const ErrorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
  
    let error;
  
    if (err instanceof BaseError) {
      error = err;
    } else {
      error = new InternalServerError(err);
    }
  
  
    const statusCode = error.statusCode;
    const body = error.getBody();
  
    res.status(statusCode).send(body);
  }
  esse