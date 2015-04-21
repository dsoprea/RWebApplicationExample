library(jsonlite)

source('utility.r')

dataset.ajax.handler <- function(env) {
    req <- Request$new(env)

    if(is.null(req$GET()$n)){
        # Parameters missing.
        res <- Response$new(status=500)
        write.text(res, "No 'n' parameter provided.")
    } else {
        # Parameters found. Generate dataset.

        res <- Response$new()

        n <- as.integer(req$GET()$n)
        x <- rnorm(n)

        write.json(res, x)
    }

    res$finish()
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
    req <- Request$new(env)

    if(is.null(req$GET()$result_name)){
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

history.ajax.handler <- function(env) {

    # We don't actually use this since eval() doesn't affect the command-history at all.

    req <- Request$new(env)

    res <- Response$new()

    filepath <- '.r_tutorial_history'
    savehistory(filepath)
    h <- scan(filepath, 'character')
    unlink(filepath)

    write.json(res, list(history=h))

    res$finish()
}
