write.json <- function(response, data) {
    response$header('Content-type', 'application/json')
    x <- toJSON(data)
    response$write(x)
}
