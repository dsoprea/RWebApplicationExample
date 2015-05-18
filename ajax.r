library(jsonlite)
library(base64enc)

source('utility.r')

eval.code <- function(code, result_name=NULL) {
    message <- NULL
    cb_error <- function(e) {
        message <<- list(type='error', message=e$message)
    }
    cb_warning <- function(w) {
        message <<- list(type='warning', message=w$message)
    }
    
    tryCatch(eval(parse(text=code)), error=cb_error, warning=cb_warning)
    
    if(is.null(message)) {
        result <- list(success=TRUE)

        if(is.null(result_name) == FALSE) {
            if(exists(result_name) == FALSE) {
                result$found <- FALSE
            } else {
                result$found <- TRUE
                result$value <- mget(result_name)[[result_name]]
            }
        }

        return(result)
    } else {
        return(list(success=FALSE, message=message))
    }
}

lambda.ajax.handler <- function(env) {
    # Execute code and return the value for the variable of the given name.

    req <- Request$new(env)

    if(is.null(req$GET()$tab_name)) {
        # Parameters missing.
        res <- Response$new(status=500)
        write.text(res, "No 'tab_name' parameter provided.")
    } else if(is.null(req$GET()$result_name)) {
        # Parameters missing.
        res <- Response$new(status=500)
        write.text(res, "No 'result_name' parameter provided.")
    } else if(is.null(req$POST())) {
        # Body missing.
        res <- Response$new(status=500)
        write.text(res, "POST-data missing. Please provide code.")
    } else {
        # Execute code and return the result.

        res <- Response$new()

        result_name <- req$GET()$result_name
        code <- req$POST()[['code']]

        execution_result <- eval.code(code, result_name=result_name)
        execution_result$value = paste(capture.output(print(execution_result$value)), collapse='\n')

        write.json(res, execution_result)
    }

    res$finish()
}

lambda.image.ajax.handler <- function(env) {
    # Execute code and return a base64-encoded image.

    req <- Request$new(env)

    if(is.null(req$GET()$tab_name)) {
        # Parameters missing.
        res <- Response$new(status=500)
        write.text(res, "No 'tab_name' parameter provided.")
    } else if(is.null(req$POST())) {
        # Body missing.
        res <- Response$new(status=500)
        write.text(res, "POST-data missing. Please provide code.")
    } else {
        # Execute code and return the result.

        # If we're returning an image, set the content-type and redirect 
        # the graphics device to a file.

        t <- tempfile()
        png(file=t)
        png(t, type="cairo", width=500, height=500)

        result_name <- req$GET()$result_name
        code <- req$POST()[['code']]

        execution_result <- eval.code(code, result_name=result_name)

        # If we're returning an image, stop the graphics device and return 
        # the data.

        dev.off()
        length <- file.info(t)$size

        if(length == 0) {
            res <- Response$new(status=500)
            res$header('Content-Type', 'text/plain')

            res$write("No image was generated. Your code is not complete.")
        } else {
            res <- Response$new()
            res$header('Content-Type', 'text/plain')

            data_uri <- dataURI(file=t, mime="image/png")
            res$write(data_uri)
        }
    }

    res$finish()
}
