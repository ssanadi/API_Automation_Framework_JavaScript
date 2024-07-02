import { request } from "../helper/httpHelper.js";
import { httpMethods } from "../resources/http_methods.js";
import { routes } from "../resources/endpoints.js";
import {expect, should} from "chai";

let userID;

describe('Post User API Test', () => {
    it('Post - Create User Test /users', async () => {
        const payload =   {
            name: "Test User",
            email: `TestUser_${Math.floor(Math.random() *9999)}@harris.test`,
            gender: "female",
            status: "active"
          }

        let res = await request(httpMethods.POST, routes.v2_users, payload)
        expect(res.body).to.not.be.empty;
        expect(res.status).equal(201);
        userID = res.body.id
    });

});

describe('GET Users API Test', () => {
    it('GET - All Users Test /users', async () => {
        let res = await request(httpMethods.GET, routes.v2_users)
        expect(res.status).equal(200);
        expect(res.body).to.not.be.empty;
    });
    
    it(`GET - Specific User Test /users`, async () => {
        let res = await request(httpMethods.GET,`${routes.v2_users}/${userID}`)
        expect(res.status).equal(200);
        expect(res.body).to.not.be.empty;
        expect(res.body.id).to.equal(userID)
    });
});


describe(`DELETE User API Test`, () => {
    it('DELETE - Specific User', async() => {
        let res = await request(httpMethods.DELETE,`${routes.v2_users}/${userID}`)
        expect(res.status).equal(204);
    });

    it('DELETE - Test error code 404 ', async() => {
        let res = await request(httpMethods.DELETE,`${routes.v2_users}/${userID}`)
        expect(res.status).equal(404);
        expect(res.body.message).to.eq('Resource not found')
    });
});