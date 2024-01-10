import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { CustomError } from './custom.error';

export class CustomException {
  constructor(error: any) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((element) => {
        return {
          field: element.path[0],
          message: element.message,
        };
      });

      return new HttpException(
        {
          success: false,
          errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new HttpException(
        {
          success: false,
          errors: {
            code: error.code,
            message: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return new HttpException(
        {
          success: false,
          errors: {
            message: error.message,
            client_version: error.clientVersion,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (error instanceof CustomError) {
      return new HttpException(
        {
          success: false,
          errors: [
            {
              message: error.message,
            },
          ],
        },
        error.code,
      );
    }

    return new HttpException(
      {
        success: false,
        errors: {
          message: 'SERVER IS DOWN',
          log: error.message,
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
