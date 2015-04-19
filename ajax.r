library(jsonlite)

source('utility.r')

dataset.ajax.handler <- function(env) {
    req <- Request$new(env)

    if(is.null(req$GET()$n)){
        # Parameters missing.
        res <- Response$new(status=400)
    } else {
        # Parameters found. Generate dataset.

        res <- Response$new()

        n <- as.integer(req$GET()$n)
        x <- rnorm(n)

        write.json(res, x)
    }

    res$finish()
}
