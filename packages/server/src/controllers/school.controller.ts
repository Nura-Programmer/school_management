import type { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createSchool = async (req: Request, res: Response) => {
    const { name, address } = req.body;

    if (!name || typeof name != "string") {
        return res.status(400).json({
            error: "School name is required and must be a string."
        });
    }

    const school = await prisma.school.create({
        data: {
            name,
            address: address ?? ""
        },
    });

    res.status(201).json(school);
}
