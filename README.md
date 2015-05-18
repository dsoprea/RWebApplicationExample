## Overview

We combine [Rook](https://github.com/jeffreyhorner/Rook), [jQuery](https://jquery.com), and [Bootstrap](http://getbootstrap.com) to make a nice-looking, R-based web-application.

## Screenshot

![Screenshot](resources/screenshot.png "Screenshot")

## Installing

A list of the required packages are provided [here](resources/requirements.txt).

To install a package:

```r
install.packages('Rook')
```

The first parameter can also be a vector of multiple packages.

## Running

```
$ ./main 

Attaching package: ‘jsonlite’

The following object is masked from ‘package:utils’:

    View

starting httpd help server ... done

Server started on host 127.0.0.1 and port 5000 . App urls are:

    http://127.0.0.1:5000/custom/test_project
```

To view the website, open the following in your browser:

    http://127.0.0.1:5000/custom/test_project/html/index.html

This project was developed against Chrome.

## Notes

- We use [Rscript](http://www.inside-r.org/r-doc/utils/Rscript) to be able to create an executable script to boot the application.
- We use Rook's *Builder* class to route the requests.
- We send raw user-code to the server and dynamically execute it.
- We use JSON in the Ajax communication.
- We serve images by redirecting the output device to a temporary-file and then using the same file in the response (after setting the content-type).
