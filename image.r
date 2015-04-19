image.handler <- function(env){
    req <- Request$new(env)
    res <- Response$new()
    res$header('Content-type','image/png')
    if (is.null(req$GET()$n)){
        n <- 100
    } else {
        n <- as.integer(req$GET()$n)
    }

    t <- tempfile()
    png(file=t)
    png(t,type="cairo",width=500,height=500)
#    par(mar=rep(0,4))
#    plot(rnorm(n),col=rainbow(n,alpha=runif(n,0,1)),pch='.',cex=c(2,3,4,5,10,50))
#    hist(rnorm(n))

    x = rnorm(1000)
    h = hist(x, probability=T)
    d = density(x)
    lines(d)

    dev.off()
    res$body <- t
    names(res$body) <- 'file'
    res$finish()
}
