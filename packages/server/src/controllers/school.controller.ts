import type { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createSchool = async (req: Request, res: Response) => {
    const { name, address } = req.body;

    if (!name || typeof name != "string" || name.trim() === "") {
        return res.status(400).json({
            error: "Invalid school name"
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
