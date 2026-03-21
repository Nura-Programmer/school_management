import request from "supertest";
import { withTestPrisma } from "../helpers/withTestPrisma";
import app from "../../src/app";

type CreateSchoolProps = {
    name?: string | number | null,
    address?: string | null
}

type UpdateSchoolProps = { id: number } & CreateSchoolProps;

type GetSchoolProps = {
    page?: number,
    limit?: number
}

const schoolApi = "/api/schools";

const schoolMocks = {
    info: {
        name: "Annur International School",
        address: "123 Main St, Cityville",
        id: null
    },

    create: async ({ name, address }: CreateSchoolProps) => {
        return await withTestPrisma(
            request(app).post(schoolApi).send({ name, address })
        );
    },

    update: async ({ name, address, id }: UpdateSchoolProps) => {
        let payload: CreateSchoolProps = {};

        if (name) payload.name = name;
        if (address) payload.address = address;

        return await withTestPrisma(
            request(app).put(`${schoolApi}/${id}`).send(payload)
        );
    },

    delete: async (id: number) => {
        return await withTestPrisma(
            request(app).delete(`${schoolApi}/${id}`).send()
        );
    },

    getSchools: async ({ page, limit }: GetSchoolProps) => {
        let params = "";

        if (page) params += `?page=${page}`;
        if (limit) {
            params += params.length > 0 ? "&" : "?";
            params += `limit=${limit}`;
        }

        return await withTestPrisma(
            request(app).get(schoolApi + params)
        );
    },

    getCrash: async (crashUrl = "/api/__test__/crash") => {
        return await withTestPrisma(
            request(app).get(crashUrl)
        );
    }
};

export default schoolMocks;