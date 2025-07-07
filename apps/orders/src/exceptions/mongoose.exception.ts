import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import mongoose from "mongoose";
import { Response } from "express"

@Catch(mongoose.Error.ValidationError)
export class MongooseValidationFilter implements ExceptionFilter {
  catch(exception: mongoose.Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation Failed',
      errors: exception.errors
    })
  }
}