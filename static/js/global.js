function send_request_json(type, path, parameters, data, success_cb, error_cb) {
    var url;

    if(typeof(parameters) == 'undefined') {
        parameters = {}
    }

    url = '/custom/test_project/ajax' + path;

    if(parameters) {
        url += '?' + $.param(parameters);
    }

    $.ajax({
            method: type,
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: data,
            success: success_cb,
            error: error_cb
        });
}

function send_request_urlencoded(type, path, parameters, data, success_cb, error_cb) {
    var url;

    url = '/custom/test_project/ajax' + path;

    if(parameters) {
        url += '?' + $.param(parameters);
    }

    $.ajax({
            method: type,
            url: url,
            data: data,
            success: success_cb,
            error: error_cb
        });
}

function execute_lambda_for_result(tab_name, code, result_name, success_cb, error_cb) {
    var parameters, data;

    parameters = {
        tab_name: tab_name,
        result_name: result_name
    }

    data = {
        code: code
    }

    send_request_urlencoded(
        'post', 
        '/lambda/result', 
        parameters, 
        data, 
        success_cb, 
        error_cb);
}

function execute_lambda_for_image(tab_name, code, success_cb, error_cb) {
    var parameters, data;

    parameters = {
        tab_name: tab_name
    }

    data = {
        code: code
    }

    send_request_urlencoded(
        'post', 
        '/lambda/image', 
        parameters, 
        data, 
        success_cb, 
        error_cb);
}
