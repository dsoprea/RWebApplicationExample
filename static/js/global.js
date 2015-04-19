function send_request(type, path, parameters, data, success_cb, error_cb) {
    var url;

    if(typeof(parameters) == 'undefined') {
        parameters = {}
    }

    url = '/custom/project2/ajax' + path;

    if(parameters.length > 0) {
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
