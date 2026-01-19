import { Prisma } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);

    if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
    ) {
        return res.status(409).json({
            error: "Conflict",
            message: "School already exists",
        });
    }

    res.status(500).json({
        error: "InternalServerError",
        message: "An unexpected error occurred",
    });
};
