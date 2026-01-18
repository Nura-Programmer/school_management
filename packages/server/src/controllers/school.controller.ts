import type { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createSchool = async (req: Request, res: Response) => {
    const { name, address } = req.body;

    const school = await prisma.school.create({
        data: { name, address },
    });

    res.status(201).json(school);
}
