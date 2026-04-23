import type { NextFunction, Request, Response } from "express";
import Wrapper from "../middleware/wrapper"
import { comparePassword } from "../utils/hash";
import type { Session } from "express-session";

const { withTryCatch } = new Wrapper("Auth");

type SessionType = Session & { userId: string }

export const auth = withTryCatch(async (handlers, prisma, errors) => {
    const { req, res } = handlers;

    const schoolId = req.params.schoolId as string;

    const { username, password } = req.body;
    if (!username || !password || !schoolId) return errors.validation("SchoolId, Username and Password is required.");

    const teacher = await prisma.teacher.findFirst({ where: { schoolId, username } });
    if (!teacher) return errors.validation("Invalid credentials.");

    const isCorrectPassword = comparePassword(password, teacher.password);
    if (!isCorrectPassword) return errors.validation("Invalid credentials.");

    (req.session as SessionType).userId = teacher.id;

    res.locals.isAuthenticated = true;
    res.locals.user = { ...teacher, role: 'teacher' };
    delete res.locals.user.password;

    res.status(200).json({ ...res.locals });
});