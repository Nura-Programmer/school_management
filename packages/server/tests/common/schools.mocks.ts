import request from "supertest";
import { withTestPrisma } from "../helpers/withTestPrisma";
import app from "../../src/app";

type CreateSchoolProps = {
    name?: string | number | null,
    address?: string | null
}

type GetSchoolProps = {
    page?: number,
    limit?: number
}

const schoolApi = "/api/schools";

const schoolMocks = {
    info: {
        name: "Annur International School",
        address: "123 Main St, Cityville",
    },

    create: async ({ name, address }: CreateSchoolProps) => {
        return await withTestPrisma(
            request(app)
                .post(schoolApi)
                .send({ name, address })
        );
    },

    getSchools: async ({page, limit}: GetSchoolProps) => {
        let params = "";

        if(page) params += `?page=${page}`;
        if(limit) {
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