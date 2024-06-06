const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const port = 80;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(session({
  secret: 'my_secret_key_hehehehh',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

app.listen(port, () => {
  connection.connect((err) => {
    if (err) throw err;
    console.log('Listening..');
  })
})

function generateToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sequence = '';

  for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
          sequence += '-';
      }
      const randomIndex = Math.floor(Math.random() * characters.length);
      sequence += characters.charAt(randomIndex);
  }

  return sequence;
}

async function renderPage(pageName, req, res) {
  try {
    const page_data = await readFileAsync(path.join(__dirname, 'html', 'subpages', `${pageName}.html`), 'utf8');
    renderPageByHTML(page_data, req, res);
  } catch (err) {
    console.error('Error reading files:', err);
    res.status(500).send('Internal Server Error');
  }
}

async function renderPageByHTML(pageHTML, req, res) {
  try {
    // Read the contents of the auth HTML
    let authData = null;
    if (req.session && req.session.userId) {
      const username = req.session.username;
      authData = `<script src="logout.js"></script>
      <button class="btn btn-outline-info dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Account: ${username}
  </button>
  <div class="dropdown-menu background-color3" style="width: 200px">
      <a class="dropdown-item3" href="/account">Settings</a>
      <button class="dropdown-item3 text-danger" id="logoutButton">Log Out</button>
  </div>`;
    } else {
      const auth_data = await readFileAsync(path.join(__dirname, 'html', 'auth.html'), 'utf8');
      authData = auth_data;
    }

    // Read the contents of the subpage HTML
    const pageData = pageHTML;

    // Read the contents of the index HTML
    const index_html = await readFileAsync(path.join(__dirname, 'html', 'index.html'), 'utf8');
    const indexHtml = index_html;

    // Generate combined HTML
    var combinedHtml = indexHtml.replace('<!-- auth -->', `${authData}`);
    combinedHtml = combinedHtml.replace('<!-- content -->', `${pageData}`);

    // Send the response
    res.send(combinedHtml);
  } catch (err) {
    console.error('Error reading files:', err);
    res.status(500).send('Internal Server Error');
  }
}

// Middleware to log the current route
app.use((req, res, next) => {
    console.log('Loading:', req.path);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  renderPage('login', req, res);
});

app.get('/signup', (req, res) => {
  renderPage('signup', req, res);
});

app.get('/client', checkAuth, (req, res) => {
  const user_id = req.session.userId;

  connection.query( "SELECT * FROM client WHERE client_id = ?;", [user_id], (err, result) => {
    if (result === undefined || result.length == 0) { renderPage('client', req, res); }
    else { res.redirect('/vehicles'); }
  });
});

function checkAuth(req, res, next) {
  if (req.session && req.session.userId) {
    // User is logged in, proceed to the next middleware/route handler
    next();
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
}

app.get('/tos', (req, res) => {
  renderPage('tos', req, res);
})

app.get('/account', checkAuth, (req, res) => {
  const userId = req.session.userId;

  connection.query(
    "SELECT u.*, c.* FROM user u LEFT JOIN client c ON u.user_id = c.client_id WHERE u.user_id = ?;", [userId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: 'error', reason: ['database_error'] });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ status: 'error', reason: ['user_not_found'] });
      }
  
      const userData = result[0];
      
      // Construct the HTML data with user and client information
      const html_data = `
  <h2>Your account details.</h2>
  <div class="color3">
    <div class="subscribe-container card">
      <div class="user-info">
        <h2>User Information</h2>
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
      </div>
      <div class="client-info">
        <h2>Client Information</h2>
        <p><strong>Birthdate:</strong> ${userData.birthdate || 'Not available'}</p>
        <p><strong>Phone:</strong> ${userData.phone || 'Not available'}</p>
        <p><strong>Billing Address:</strong> ${userData.billing_address || 'Not available'}</p>
        <p><strong>Card Information:</strong> ${userData.card_information || 'Not available'}</p>
        <p><strong>Is Active:</strong> ${userData.is_active ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  </div>
`;

  
      // Send the HTML data as the response
      renderPageByHTML(html_data, req, res);
    }
  );
})

app.get('/vehicles', (req, res) => {
  renderPage('vehicles', req, res);
})

app.post('/vehicle', (req, res) => {
  // Extract vehicle ID from request body
  const { vehicleId } = req.body;

  // Perform a database query to fetch the vehicle data based on the vehicle ID
  connection.query(
    "SELECT * FROM vehicle WHERE vehicle_id = ?",
    [vehicleId],
    (err, result) => {
      if (err) {
        // If an error occurs during the query, send an error response
        return res.status(201).json({ status: 'error', reason: ['database_error'] });
      }
      if (result === undefined || result.length === 0) {
        // If no matching vehicle is found, send a not found response
        return res.status(201).json({ status: 'error', reason: ['not_found'] });
      }
      // If a matching vehicle is found, send it in the response
      const vehicle = result[0];
      return res.status(201).json({ status: 'success', vehicle: vehicle });
    }
  );
});

app.post('/vehicles', (req, res) => {
  // Query to select all vehicles from the database
  connection.query(
    "SELECT * FROM vehicle",
    (err, result) => {
      if (err) {
        console.error('Error fetching vehicles:', err);
        return res.status(500).json({ status: 'error', reason: 'database_error' });
      }
      
      // If the query is successful, return the vehicles to the client
      return res.status(201).json({ status: 'success', vehicles: result });
    }
  );
});

app.get('/subscribe', checkAuth, (req, res) => {
  renderPage('subscribe', req, res);
})

app.post('/clear', (req, res) => {
  connection.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
    if (err) {
      console.error('Error disabling foreign key checks:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to disable foreign key checks' });
    }

    connection.query("TRUNCATE TABLE user", (err) => {
      if (err) {
        console.error('Error truncating users:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to truncate users table' });
      }

      console.log('Cleared users table');

      connection.query("TRUNCATE TABLE client", (err) => {
        if (err) {
          console.error('Error truncating clients:', err);
          return res.status(500).json({ status: 'error', message: 'Failed to truncate clients table' });
        }

        console.log('Cleared clients table');

        connection.query("TRUNCATE TABLE subscription", (err) => {
          if (err) {
            console.error('Error truncating subscriptions:', err);
            return res.status(500).json({ status: 'error', message: 'Failed to truncate subscriptions table' });
          }

          console.log('Cleared subscriptions table');

          connection.query("TRUNCATE TABLE administrator", (err) => {
            if (err) {
              console.error('Error truncating administrators:', err);
              return res.status(500).json({ status: 'error', message: 'Failed to truncate administrators table' });
            }

            console.log('Cleared administrators table');

            connection.query("SET FOREIGN_KEY_CHECKS = 1", (err) => {
              if (err) {
                console.error('Error enabling foreign key checks:', err);
                return res.status(500).json({ status: 'error', message: 'Failed to enable foreign key checks' });
              }

              return res.status(201).json({ status: 'success' });
            });
          });
        });
      });
    });
  });
});


app.post('/signup', (req, res) => {
  const { email, username, password } = req.body;

  reasons = [];

  if (email.length > 64) { reasons.push('email_long'); }
  if (username.length > 16) { reasons.push('username_long'); }
  if (password.length > 64) { reasons.push('password_long'); }
  if (reasons.length) { return res.status(201).json({status: 'error', reason: reasons}); }

  connection.query("SELECT COUNT(email) AS 'taken' FROM user WHERE email LIKE ? GROUP BY email;", [email], (err, result) => {
    if (result !== undefined && result.length && result[0]['taken'] >= 1) {
      reasons.push('email_taken');
    }

    connection.query("SELECT COUNT(username) AS 'taken' FROM user WHERE username LIKE ? GROUP BY username;", [username], (err, result) => {
      if (err) {
        console.error('Error selecting usernames from database:', err);
        return res.status(500).json({ status: 'error', reason: ['database']})
      }
  
      if (result !== undefined && result.length && result[0]['taken'] >= 1) {
        reasons.push('username_taken');
      }
  
      if (reasons.length) {
        return res.status(201).json({status: 'error', reason: reasons});
      }

      connection.query("INSERT INTO user (email, username, password) VALUES (?, ?, ?)", [email, username, password], (err, result) => {
        if (err) {
          console.log('Failed to add new user');
          console.error('Error inserting data into the database:', err);
          return res.status(500).json({ status: 'error', reason: ['database']});
        }
        
        const user_id = result.insertId;
        console.log(`New user #${user_id}`);
        console.log(`Email: ${email}`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        res.status(201).json({ status: 'success', redirect: '/login' });
      }) // end query insert
    }); // end query username
  }); // end query email
}) // end app.post

app.post('/login', (req, res) => {
  const { auth, password } = req.body;
  let reasons = [];

  if (auth.length > 64) { reasons.push('auth_long'); }
  if (password.length > 64) { reasons.push('password_long'); }
  if (reasons.length) { 
    return res.status(201).json({status: 'error', reason: reasons}); 
  }

  connection.query(
    "SELECT * FROM user WHERE email = ? OR username = ?;",
    [auth, auth],
    (err, result) => {
      if (err) {
        return res.status(500).json({status: 'error', reason: ['database_error']});
      }
      if (result === undefined || result.length == 0) { 
        return res.status(201).json({status: 'error', reason: ['bad_credentials']}); 
      }
      const record = result[0];
      if (password !== record['password']) { 
        return res.status(201).json({status: 'error', reason: ['bad_credentials']}); 
      }
      
      var user_id = record['user_id'];
      var username = record['username'];
      var session_token = generateToken();
      console.log(`User #${user_id} has logged in! (session: ${session_token})`);

      // Set session variables
      req.session.userId = user_id;
      req.session.username = username;

      connection.query( "SELECT * FROM client WHERE client_id = ?;", [user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ status: 'error', reason: ['database_error'] });
            }
            if (result === undefined || result.length == 0) {
                return res.status(201).json({status: 'success', uid: user_id, session: session_token, redirect: '/client'});
            } else {
                return res.status(201).json({status: 'success', uid: user_id, session: session_token, redirect: '/vehicles'});
            }
        }
      );

      // return res.status(201).json({status: 'success', uid: user_id, session: session_token, redirect: '/client'});
    }
  );
});

// Logout endpoint
app.post('/logout', (req, res) => {
  try {
    // Clear the user's session data to log them out
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error logging out');
      } else {
        // Redirect the user to the login page or send a success response
        return res.status(201);
      }
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).send('Error logging out');
  }
});


function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// POST route to add client data to the database
app.post('/add_client', isAuthenticated, (req, res) => {
  // Extract client data from the request body
  const { birthdate, phone, address, card } = req.body;

  // Retrieve user ID from the session (assuming it's stored there)
  const userId = req.session.userId;

  // Construct the SQL query to check if client data already exists
  const checkQuery = `
      SELECT * FROM client WHERE client_id = ?
  `;

  // Execute the query to check if client data already exists
  connection.query(checkQuery, [userId], (checkErr, checkResult) => {
      if (checkErr) {
          console.error('Database error:', checkErr);
          return res.status(500).json({ status: 'error', reason: 'database_error' });
      }

      // If client data already exists for the user ID, return an error response
      if (checkResult.length > 0) {
          return res.status(201).json({ status: 'error', reason: 'client_data_exists' });
      }

      // Construct the SQL query to insert client data into the database
      const query = `
          INSERT INTO client (client_id, birthdate, phone, billing_address, card_information, is_active)
          VALUES (?, ?, ?, ?, ?, true)
      `;

      // Execute the query with user ID and client data
      connection.query(query, [userId, birthdate, phone, address, card], (err, result) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ status: 'error', reason: 'database_error' });
          }

          console.log(`Client data recieved #${userId} ${birthdate} ${phone} ${address} ${card}`);
          // Return success response if insertion is successful
          return res.status(201).json({ status: 'success', message: 'Client data added successfully', redirect: '/subscribe'});
      });
  });
});

app.post('/subscribe', isAuthenticated, (req, res) => {
  const { vehicle_id, begin_date, end_date } = req.body;
  const subscriber_id = req.session.userId;
  const creation_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date and time

  // Validate form data here (e.g., check for empty fields, valid dates, etc.)
  if (!vehicle_id || !begin_date || !end_date) {
    return res.status(400).json({ status: 'error', reason: 'missing_fields' });
  }

  // You can also validate date formats or ranges here if needed

  const query = "INSERT INTO subscription (subscriber_id, vehicle_id, creation_date, begin_date, end_date) VALUES (?, ?, ?, ?, ?)";
  connection.query(query, [subscriber_id, vehicle_id, creation_date, begin_date, end_date], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ status: 'error', reason: 'database_error' });
    }
    return res.status(201).json({ status: 'success', message: 'Subscription info added successfully' });
  });
});

const connection = mysql.createConnection({
    host: "localhost",
    database: "car_rental",
    user: "root",
    password: "MyPassword1!",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to database:', err);
      return;
  }
  console.log('Connected to database:');
});

