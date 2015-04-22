library(jsonlite)
library(base64enc)

source('utility.r')

stats.filepath <- '/tmp/r.tutorial.stats.json'

request.counter <- list()
request.start.time <- list()
request.avg.time <- list()

tick.request <- function(tab_name) {
    # Keep track of how often the various exercises are attempted and the 
    # average time between attempts. Note that since 1) we're running in a 
    # webpage and 2) R doesn't keep track of the history for eval'd code, we 
    # write the "report" for *every* execution. That way, there's a report 
    # waiting when the application is actually terminated.

    if(is.null(request.counter[[tab_name]])) {
        request.counter[[tab_name]] <<- 1
    } else {
        request.counter[[tab_name]] <<- request.counter[[tab_name]] + 1
    }

    if(is.null(request.start.time[[tab_name]])) {
        request.start.time[[tab_name]] <<- Sys.time()
    } else {
        now.time <- Sys.time()
        start.time <- request.start.time[[tab_name]]

        delta <- difftime(now.time, start.time, units="secs")
        elapsed_s <- as.numeric(delta)

        request.avg.time[[tab_name]] <<- elapsed_s / request.counter[[tab_name]]
    }

    j <- toJSON(list(
                counters=request.counter, 
                avg.times.s=request.avg.time
            ))
    
    f <- file(stats.filepath)
    writeLines(j, f)
    close(f)
}

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

        tick.request(req$GET()$tab_name)

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

        tick.request(req$GET()$tab_name)

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
