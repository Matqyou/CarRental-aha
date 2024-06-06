export function init_field(field_input) {
    var field_label = field_input.nextElementSibling;
    field_label.textContent = field_label.getAttribute('value');
}

export function init_form(form) {
    const inputs = form.querySelectorAll('input.field_input');
    const checkboxes = form.querySelectorAll('input.checkbox');

    if (inputs.length) { inputs[0].focus(); }

    inputs.forEach((input, index) => {
        init_field(input);
        input.addEventListener('input', function() {
            if (input.getAttribute('group') !== null) {
                const group_inputs = form.querySelectorAll(`input.field_input[group=${input.getAttribute('group')}`);
                group_inputs.forEach(function(group_input, index2) {
                    neutral_field(group_input);
                });
            } else { neutral_field(input); }
        });
        input.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                const nextIndex = index + 1;
                if (nextIndex < inputs.length) {
                    event.preventDefault();
                    inputs[nextIndex].focus();
                }
            }
        })
    })

    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            neutral_checkbox(checkbox);
        });
    });
}

export function bad_checkbox(checkbox_input) {
    var checkbox_label = checkbox_input.parentNode;
    var checkbox_text = checkbox_label.querySelector('span');

    checkbox_text.textContent = checkbox_text.textContent;
    checkbox_label.classList.remove('failure-field');
    void checkbox_label.offsetWidth;
    checkbox_label.classList.add('failure-field');

    checkbox_input.focus();
}


export function bad_field(field_input, prompt) {
    var field = field_input.parentNode;
    var field_label = field_input.nextElementSibling;

    field_label.textContent = field_label.getAttribute('value') + ' - ' + prompt;
    field.classList.remove('failure-field');
    void field.offsetWidth;
    field.classList.add('failure-field');

    if (field_input.type != 'date') {
        var endOfSelection = field_input.textContent.length - 1
        field_input.setSelectionRange(endOfSelection, endOfSelection);
    }
    field_input.focus();
}

export function bad_fields(form, group, prompt) {
    const field_inputs = form.querySelectorAll(`input.field_input[group="${group}"]`);

    field_inputs.forEach(function(field_input, index) {
        var field = field_input.parentNode;
        var field_label = field_input.nextElementSibling;

        field_label.textContent = field_label.getAttribute('value') + ' - ' + prompt;
        field.classList.remove('failure-field');
        void field.offsetWidth;
        field.classList.add('failure-field');

        if (field_input.type != 'date') {
            var endOfSelection = field_input.textContent.length - 1
            field_input.setSelectionRange(endOfSelection, endOfSelection);
        }
        field_input.focus();
    });
}

export function neutral_field(field_input) {
    var field = field_input.parentNode;
    var field_label = field_input.nextElementSibling;

    field.classList.remove('failure-field', 'success-field');
    field_label.textContent = field_label.getAttribute('value');
}

export function neutral_checkbox(checkbox) {
    var checkbox_label = checkbox.parentNode;

    checkbox_label.classList.remove('failure-field', 'success-field');
}

export function complete_field(field_input) {
    var field = field_input.parentNode;
    var field_label = field_input.nextElementSibling;

    field_label.textContent = field_label.getAttribute('value');

    field.classList.add('success-field', 'form-group-complete');
    field.classList.remove('failure-field');
}

export function complete_checkbox(checkbox_input) {
    var checkbox_label = checkbox_input.parentNode;
    var checkbox_text = checkbox_label.querySelector('span');

    checkbox_text.textContent = checkbox_text.textContent;
    checkbox_label.classList.add('success-field', 'form-group-complete');
    void checkbox_label.offsetWidth;
    checkbox_label.classList.remove('failure-field');

    checkbox_input.focus();
}
