import type { NextFunction, Request, Response } from "express";
import Errors from "../errors";
import { getPrisma } from "../prisma/getPrisma";
import type { PrismaClient } from "@prisma/client";
import type { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { DefaultArgs } from "@prisma/client/runtime/client";

type PrismaType = PrismaClient<
    { adapter: PrismaMariaDb; }, never, DefaultArgs
>

type Handlers = {
    req: Request,
    res: Response,
    next: NextFunction,
}

type HandlerType = (handlers: Handlers, prisma: PrismaType, errors: Errors)
    => Promise<Response<any, Record<string, any>> | undefined | void>;

class Wrapper {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    withTryCatch = (handler: HandlerType) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const errors = new Errors(res, this.name);

            try {
                const prisma = getPrisma(req);
                handler({ req, res, next }, prisma, errors);
            } catch (error) {
                console.error(error);

                return errors.server();
            }
        }
    }
}



export default Wrapper;