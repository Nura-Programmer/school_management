import type { Response } from 'express';

type ResponseType = {
   error: string;
   message: string;
};

class Errors {
   name: string;
   res: Response;

   constructor(res: Response, name: string) {
      this.name = name;
      this.res = res;
   }

   conflict = (): Response => {
      return this.res.status(409).json({
         error: 'Conflict',
         message: `${this.name} already exist.`,
      });
   };

   server = (): Response => {
      return this.res.status(500).json({
         error: 'ServerError',
         message: 'An internal server error occur. Please try again.',
      });
   };

   validation = (message: string): Response => {
      return this.res.status(400).json({
         error: 'ValidationError',
         message,
      });
   };

   notFound = (): Response => {
      return this.res.status(404).json({
         error: 'NotFound',
         message: `${this.name} was not found.`,
      });
   };
}

export default Errors;
