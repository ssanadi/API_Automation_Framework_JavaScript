const { request } = require("../helper/httpHelper.js");
const { httpMethods } = require("../resources/http_methods.js");
const { routes } = require("../resources/endpoints.js");
const dataHelper = require("../helper/dataHelper.js");
const { expect } = require("chai");
const { faker } = require('@faker-js/faker');

// Global variables to store test data
let userId;
let createdPostId;

describe('Posts API Test Suite - Data Driven Approach', () => {
    
    // Setup: Create a user first to link posts to
    before(async () => {
        // Create a user to associate with posts
        const userPayload = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            gender: faker.person.sex(),
            status: "active"
        };
        
        const createUserResponse = await request(httpMethods.POST, routes.v2_users, userPayload);
        expect(createUserResponse.status).equal(201);
        userId = createUserResponse.body.id;
        console.log(`Test user created with ID: ${userId}`);
    });
    
    // Cleanup: Delete the user after all tests
    after(async () => {
        if (userId) {
            await request(httpMethods.DELETE, `${routes.v2_users}/${userId}`);
            console.log(`Test user with ID ${userId} deleted`);
        }
    });
    
    // Test case for creating a post with data from our predefined data
    it('Should create a post using predefined data', async () => {
        // Load data from the new location
        const postsData = dataHelper.loadJsonData('resources/data/posts/posts.json');
        const samplePostData = postsData.samplePost;
        
        // Create a post for the user
        const endpoint = `${routes.v2_users}/${userId}/posts`;
        const response = await request(httpMethods.POST, endpoint, samplePostData);
        
        // Assertions
        expect(response.status).equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.equal(samplePostData.title);
        expect(response.body.body).to.equal(samplePostData.body);
        expect(response.body.user_id).to.equal(userId);
        
        // Store post ID for later use
        createdPostId = response.body.id;
    });
    
    // Test case to verify created post
    it('Should fetch the created post', async () => {
        // Skip test if no post was created
        if (!createdPostId) {
            this.skip();
        }
        
        const response = await request(httpMethods.GET, `${routes.v2_posts}/${createdPostId}`);
        
        // Assertions
        expect(response.status).equal(200);
        expect(response.body.id).to.equal(createdPostId);
        expect(response.body.user_id).to.equal(userId);
    });
    
    // Data-driven test using multiple datasets
    describe('Data-driven post creation tests', () => {
        // Load data from the new location and loop through test cases
        const postsData = dataHelper.loadJsonData('resources/data/posts/posts.json');
        
        postsData.createPosts.forEach((testData, index) => {
            it(`Should create post with dataset ${index + 1}`, async () => {
                const endpoint = `${routes.v2_users}/${userId}/posts`;
                const response = await request(httpMethods.POST, endpoint, testData);
                
                // Assertions
                expect(response.status).equal(201);
                expect(response.body).to.have.property('id');
                expect(response.body.title).to.equal(testData.title);
                expect(response.body.user_id).to.equal(userId);
            });
        });
    });
    
    // Negative test cases
    describe('Negative test cases for post creation', () => {
        // Load data from the new location
        const postsData = dataHelper.loadJsonData('resources/data/posts/posts.json');
        
        postsData.createPostsNegative.forEach((testData, index) => {
            it(`Should handle invalid post data - case ${index + 1}`, async () => {
                const endpoint = `${routes.v2_users}/${userId}/posts`;
                
                try {
                    const response = await request(httpMethods.POST, endpoint, testData);
                    // Expecting validation error (422 status code)
                    expect(response.status).to.equal(422);
                    expect(response.body).to.be.an('array');
                    expect(response.body.length).to.be.at.least(1);
                } catch (error) {
                    // Handle any unexpected errors
                    throw error;
                }
            });
        });
    });
    
    // Test to get all posts for a user
    it('Should fetch all posts for a user', async () => {
        const response = await request(httpMethods.GET, `${routes.v2_users}/${userId}/posts`);
        
        // Assertions
        expect(response.status).equal(200);
        expect(response.body).to.be.an('array');
        // We should have at least 1 post (the one we created with sample data)
        // Plus potentially more from data-driven tests
        expect(response.body.length).to.be.at.least(1);
    });
}); 