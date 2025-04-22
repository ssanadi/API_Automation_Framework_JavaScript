const { request } = require("../helper/httpHelper.js");
const { httpMethods } = require("../resources/http_methods.js");
const { routes } = require("../resources/endpoints.js");
const dataHelper = require("../helper/dataHelper.js");
const { expect } = require("chai");
const { faker } = require('@faker-js/faker');

// Global variables to store test data
let userId;
let createdPostIds = [];

describe('Organized Data-Driven API Testing Demo', () => {
    
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
    
    describe('JSON Data-Driven Tests', () => {
        // Load test cases using the new getEntityData method
        const testCases = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');
        
        testCases.forEach((testData, index) => {
            it(`Should create post with JSON dataset ${index + 1}`, async () => {
                const endpoint = `${routes.v2_users}/${userId}/posts`;
                const response = await request(httpMethods.POST, endpoint, testData);
                
                // Assertions
                expect(response.status).equal(201);
                expect(response.body).to.have.property('id');
                expect(response.body.title).to.equal(testData.title);
                expect(response.body.user_id).to.equal(userId);
                
                // Store created post ID
                createdPostIds.push(response.body.id);
            });
        });
    });
    
    describe('Template-Based Tests', () => {
        it('Should support template-based test data with placeholders', async () => {
            // Load template data using the new getTemplate method
            const template = dataHelper.getTemplate('posts', 'postTemplates')[0];
            
            // Define replacement values
            const replacements = {
                dynamicValue: faker.lorem.word(),
                anotherValue: faker.lorem.word()
            };
            
            // Replace placeholders
            const resolvedData = dataHelper.replacePlaceholders(template, replacements);
            
            // Verify placeholders were replaced
            expect(resolvedData.title).to.include(replacements.dynamicValue);
            expect(resolvedData.body).to.include(replacements.dynamicValue);
            expect(resolvedData.body).to.include(replacements.anotherValue);
            
            // Use the data in a request
            const endpoint = `${routes.v2_users}/${userId}/posts`;
            const response = await request(httpMethods.POST, endpoint, resolvedData);
            
            // Assertions
            expect(response.status).equal(201);
            expect(response.body.title).to.equal(resolvedData.title);
            
            // Store created post ID
            createdPostIds.push(response.body.id);
        });
        
        it('Should support user-specific template data', async () => {
            // Load user post template using the new getTemplate method
            const userTemplate = dataHelper.getTemplate('posts', 'userPostTemplate');
            
            // Get user details from the API for accurate data
            const userResponse = await request(httpMethods.GET, `${routes.v2_users}/${userId}`);
            expect(userResponse.status).equal(200);
            
            // Define replacement values based on actual user data
            const replacements = {
                userId: userId,
                userName: userResponse.body.name,
                userEmail: userResponse.body.email
            };
            
            // Replace placeholders
            const resolvedData = dataHelper.replacePlaceholders(userTemplate, replacements);
            
            // Use the data in a request
            const endpoint = `${routes.v2_users}/${userId}/posts`;
            const response = await request(httpMethods.POST, endpoint, resolvedData);
            
            // Assertions
            expect(response.status).equal(201);
            expect(response.body.title).to.contain(userId.toString());
            
            // Store created post ID
            createdPostIds.push(response.body.id);
        });
        
        // Optional: Demonstrate schema validation
        it('Should validate post data against schema', async () => {
            // Create a valid post payload
            const postData = {
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(1)
            };
            
            // Optional validation before sending data
            const validation = dataHelper.validateSchema(postData, 'posts');
            expect(validation.isValid).to.be.true;
            
            // Create post
            const endpoint = `${routes.v2_users}/${userId}/posts`;
            const response = await request(httpMethods.POST, endpoint, postData);
            
            // Assertions
            expect(response.status).equal(201);
            createdPostIds.push(response.body.id);
        });
    });
    
    describe('CSV Data-Driven Tests', () => {
        it('Should run tests with data from CSV file in the organized structure', async () => {
            // Load CSV data from the new location
            const csvData = await dataHelper.loadCsvData('resources/data/posts/posts.csv');
            
            // Run a test for each row in the CSV
            for (const [index, row] of csvData.entries()) {
                console.log(`Running test with CSV data row ${index + 1}`);
                
                const testData = {
                    title: row.title,
                    body: row.body
                };
                
                const expectedStatus = parseInt(row.expected_status);
                const endpoint = `${routes.v2_users}/${userId}/posts`;
                
                const response = await request(httpMethods.POST, endpoint, testData);
                
                // Assertions
                expect(response.status).to.equal(expectedStatus, 
                    `Expected status ${expectedStatus} but got ${response.status} for data: ${JSON.stringify(testData)}`);
                
                // If success status, store the post ID
                if (response.status === 201) {
                    createdPostIds.push(response.body.id);
                    expect(response.body.title).to.equal(testData.title);
                    expect(response.body.user_id).to.equal(userId);
                }
                
                // If error status (422), check for validation errors
                if (response.status === 422) {
                    expect(response.body).to.be.an('array');
                    expect(response.body.length).to.be.at.least(1);
                }
            }
        });
    });
    
    // Test to verify that all the posts we created exist
    it('Should verify all created posts exist', function(done) {
        // Skip if no posts were created
        if (createdPostIds.length === 0) {
            this.skip();
            return done();
        }
        
        // Get all user posts
        request(httpMethods.GET, `${routes.v2_users}/${userId}/posts`)
            .then(response => {
                // Assertions
                expect(response.status).equal(200);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.be.at.least(createdPostIds.length);
                
                // Verify each created post is in the response
                for (const postId of createdPostIds) {
                    const postExists = response.body.some(post => post.id === postId);
                    expect(postExists).to.be.true;
                }
                done();
            })
            .catch(done);
    });
}); 