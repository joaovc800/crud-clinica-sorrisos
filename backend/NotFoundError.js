import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message) {
    super(404, message);
  }
}
