import { request } from "../helper/httpHelper.js";
import { base_url} from "../config/environment_config.js";
import { httpMethods } from "../resources/http_methods.js";
import { routes } from "../resources/endpoints.js";
import { userPayload } from "../resources/requests/usersPayload.js";
import {expect, should} from "chai";
import nock from "nock";

let userID;

describe('Post User API Test', () => {
    it('Post - Create User Test /users', async () => {
        let res = await request(httpMethods.POST, routes.v2_users, userPayload)
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
        expect(res.body.id).to.equal(userID);
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


describe('Mocking Example Test', () => {
    before(() => {       
         nock(base_url)
        .get("/mockedAPI")
        .reply(200, userPayload);        
    });

    it('Get - Test Mock API', async() => {
        let res = await request(httpMethods.GET,`/mockedAPI`)  
        expect(res.status).equal(200);
        expect(res.body).to.not.be.empty;    
    });

});