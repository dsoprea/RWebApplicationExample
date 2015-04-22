function send_request_json(type, path, parameters, data, success_cb, error_cb) {
    var url;

    if(typeof(parameters) == 'undefined') {
        parameters = {}
    }

    url = '/custom/project2/ajax' + path;

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

    url = '/custom/project2/ajax' + path;

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

function execute_lambda_for_result(code, result_name, success_cb, error_cb) {
    var parameters, data;

    parameters = {
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

function execute_lambda_for_image(code, success_cb, error_cb) {
    var data;

    data = {
        code: code
    }

    send_request_urlencoded(
        'post', 
        '/lambda/image', 
        undefined, 
        data, 
        success_cb, 
        error_cb);
}
