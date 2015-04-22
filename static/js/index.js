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

function _clear_result($tab) {
    $result = $tab.find('.tab-subsection-result');
    $result_text = $result.find('.tab-example-result');
    $result_image = $result.find('.tab-example-result-image');

    $result.hide();
    $result_text.text('');
    $result_image.removeAttr('src');
}

function _set_result_text($tab, text) {
    $result = $tab.find('.tab-subsection-result');
    $result_text = $result.find('.tab-example-result');

    $result_text.text(value);
    $result.show();
}

function _set_result_image($tab, encoded_image_data) {
    $result = $tab.find('.tab-subsection-result');
    $result_image = $result.find('.tab-example-result-image');

    $result_image.attr('src', encoded_image_data);
    $result.show();
}

function _get_and_validate_code($tab) {
    code = $tab.find('.tab-example-try').val();
    code = $.trim(code);

    if(code == '') {
        _show_error("You have not provided any code.");
        return false;
    }

    _push_to_history(code);

    return code;
}

function hook_try_dataset_execute(ev) {
    var $tab, code, result_variable_name, $result;

    ev.preventDefault();
    _clear_error();

    $tab = $('#dataset');

    _clear_result($tab);

    code = _get_and_validate_code($tab);
    if(code == false) {
        return false;
    }

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
        _set_result_text(value);
    }

    function error_cb(xhr) {
        var text, code;

        text = xhr.responseText;
        code = xhr.status;

        _show_error("Request failed (" + code + "): " + text);
    }

    execute_lambda(code, result_variable_name, success_cb, error_cb, false);

    return false;
}

function hook_try_histogram_execute(ev) {
    var $tab, code;

    ev.preventDefault();
    _clear_error();

    $tab = $('#histogram');

    _clear_result($tab);

    code = _get_and_validate_code($tab);
    if(code == false) {
        return false;
    }

    function success_cb(encoded_image_data, textStatus, request) {
        _set_result_image($tab, encoded_image_data);
    }

    function error_cb(xhr) {
        var text, code;

        text = xhr.responseText;
        code = xhr.status;

        _show_error("Request failed (" + code + "): " + text);
    }

    execute_lambda_for_image(code, success_cb, error_cb);

    return false;
}

function hook_try_density_execute(ev) {
    var $tab, code;

    ev.preventDefault();
    _clear_error();

    $tab = $('#density');

    _clear_result($tab);

    code = _get_and_validate_code($tab);
    if(code == false) {
        return false;
    }

    function success_cb(encoded_image_data, textStatus, request) {
        _set_result_image($tab, encoded_image_data);
    }

    function error_cb(xhr) {
        var text, code;

        text = xhr.responseText;
        code = xhr.status;

        _show_error("Request failed (" + code + "): " + text);
    }

    execute_lambda_for_image(code, success_cb, error_cb);

    return false;
}

function hook_try_lm_execute(ev) {
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

function hook_try_spline_execute(ev) {
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
