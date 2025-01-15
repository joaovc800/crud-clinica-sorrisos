class InternalServerError extends BaseError {
    constructor(err) {
      super(500, 'Erro interno')
  
      console.log({
        message: err.message,
        stackTrace: err.stack,
        level: 'fatal',
      })
    }
  }
