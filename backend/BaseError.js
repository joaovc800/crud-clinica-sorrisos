export class BaseError extends Error {
    constructor(statusCode, message) {
      super(message)
  
      this.statusCode = statusCode;
    }
  
    getBody() {
      return {
        message: this.message,
      }
    }
  }
  esse