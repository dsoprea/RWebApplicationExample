write.text <- function(response, text) {
    response$header('Content-Type', 'text/plain')
    response$write(text)
}

write.json <- function(response, data) {
    response$header('Content-Type', 'application/json')
    x <- toJSON(data)
    response$write(x)
}
