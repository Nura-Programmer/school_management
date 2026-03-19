import type { NextFunction, Request, Response } from "express";

export const createMark = (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
        id: 1,
        ...req.body
    });
}