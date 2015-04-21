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
            data: data,
            success: success_cb,
            error: error_cb
        });
}

function execute_lambda(code, result_name, success_cb, error_cb) {
    send_request_urlencoded(
        'post', 
        '/lambda', 
        { result_name: result_name }, 
        { code: code }, 
        success_cb, 
        error_cb);
}
