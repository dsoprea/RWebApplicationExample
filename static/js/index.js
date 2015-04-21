var _history = "";

function _push_to_history(code) {
    // Since we plan on simply dumping this information, we won't worry about 
    // splitting the code into separate lines. We'll just append it to a 
    // buffer.

    var time_phrase;

    time_phrase = moment().format('MMMM Do YYYY, h:mm:ss a');

    _history += "# " + time_phrase + "\n\n" + code + "\n\n";
}

function _show_error(message) {
    var $error;

    $error = $('#error-container');
    $error.text(message);
    $error.show();
}

function _clear_error(message) {
    var $error;

    $error = $('#error-container');
    $error.text('');
    $error.hide();
}

function hook_try_dataset_execute(ev) {
    var $tab, code, result_variable_name, $result;

    ev.preventDefault();
    _clear_error();

    $tab = $('#dataset');

    $result = $tab.find('.tab-subsection-result');
    $result_text = $result.find('.tab-example-result');
    $result.hide();
    $result_text.text('');

    code = $tab.find('.tab-example-try').val();
    code = $.trim(code);

    if(code == '') {
        _show_error("You have not provided any code.");
        return false;
    }

    _push_to_history(code);

    result_variable_name = 'x';

    function success_cb(data) {
        var is_success, found, value;

        is_success = data['success'][0];

        if(is_success == false) {
            var type, message;

            type = data['message']['type'][0];
            message = data['message']['message'];

            _show_error("Failure: [" + type + "] " + message);
            return;
        }

        found = data['found'][0];

        if(found == false) {
            _show_error("Your code executed, but no '" + result_variable_name + "' variable was defined.");
            return;
        }

        value = data['value'][0];

        $result_text.text(value);
        $result.show();
    }

    function error_cb(xhr) {
        var text, code;

        text = xhr.responseText;
        code = xhr.status;

        _show_error("Request failed (" + code + "): " + text);
    }

    execute_lambda(code, result_variable_name, success_cb, error_cb);

    return false;
}

function hook_try_histogram_execute() {
    var $tab, code;

    $tab = $('#histogram');

    code = $tab.find('.tab-example-try').val();
    code = $.trim(code);

    if(code == '') {
        bootbox.alert("You have not provided any code.");
        return false;
    }

    return false;
}

function hook_try_density_execute() {
    var $tab, code;

    $tab = $('#density');

    code = $tab.find('.tab-example-try').val();
    code = $.trim(code);

    if(code == '') {
        bootbox.alert("You have not provided any code.");
        return false;
    }

    return false;
}

function hook_try_lm_execute() {
    var $tab, code;

    $tab = $('#lm');

    code = $tab.find('.tab-example-try').val();
    code = $.trim(code);

    if(code == '') {
        bootbox.alert("You have not provided any code.");
        return false;
    }

    return false;
}

function hook_try_spline_execute() {
    var $tab, code;

    $tab = $('#spline');

    code = $tab.find('.tab-example-try').val();
    code = $.trim(code);

    if(code == '') {
        bootbox.alert("You have not provided any code.");
        return false;
    }

    return false;
}

function history_click(ev) {
    var message;

    ev.preventDefault();

    if(_history) {
        bootbox.dialog({
            title: "Command History",
            message: '<pre id="history-container">' + _history + '</pre>',
            buttons: {
                success: {
                    label: "Close",
                    className: "btn-primary"
                }
            }
        });
    } else {
        bootbox.alert("No history has been recorded yet.");
    }
}

function hook_try_buttons() {
    $('#dataset-execute-btn').click(hook_try_dataset_execute);
    $('#histogram-execute-btn').click(hook_try_histogram_execute);
    $('#density-execute-btn').click(hook_try_density_execute);
    $('#lm-execute-btn').click(hook_try_lm_execute);
    $('#spline-execute-btn').click(hook_try_spline_execute);

    $('#history-btn').click(history_click);
}

function hook_events() {
    hook_try_buttons();
}

function boot() {
    hook_events();
}

$(boot);
