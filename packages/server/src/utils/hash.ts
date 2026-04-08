import { compare, hash } from 'bcrypt';


export const hashPassword = async (password: string) => {
    const salt = 10;
    return await hash(password, salt);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await compare(password, hashedPassword);
}
