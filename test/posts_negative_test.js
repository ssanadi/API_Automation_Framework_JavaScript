const { request } = require("../helper/httpHelper.js");
const { httpMethods } = require("../resources/http_methods.js");
const { routes } = require("../resources/endpoints.js");
const dataHelper = require("../helper/dataHelper.js");
const { expect } = require("chai");
const { faker } = require('@faker-js/faker');

// Global variables to store test data
let userId;
let validPostId; // We'll create one valid post to use in tests

describe('Posts API - Negative Test Scenarios', () => {
    
    // Setup: Create a user and a valid post
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
        
        // Create one valid post for use in update/delete tests
        const postPayload = {
            title: "Valid post for negative tests",
            body: "This is a valid post created for testing error scenarios."
        };
        
        const createPostResponse = await request(
            httpMethods.POST, 
            `${routes.v2_users}/${userId}/posts`, 
            postPayload
        );
        expect(createPostResponse.status).equal(201);
        validPostId = createPostResponse.body.id;
        console.log(`Test post created with ID: ${validPostId}`);
    });
    
    // Cleanup after tests
    after(async () => {
        if (userId) {
            await request(httpMethods.DELETE, `${routes.v2_users}/${userId}`);
            console.log(`Test user with ID ${userId} deleted`);
        }
    });
    
    // 1. Validation error tests - 422 Unprocessable Entity
    describe('Validation Error Tests (422)', () => {
        // Test with empty required fields
        it('Should reject post with empty title', async () => {
            const payload = { title: "", body: "This post has an empty title" };
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            expect(response.status).to.equal(422);
            expect(response.body).to.be.an('array');
            
            // Check for specific validation message about title
            const hasTitleError = response.body.some(err => 
                (err.field === 'title' || 
                 (err.message && err.message.toLowerCase().includes('title')))
            );
            expect(hasTitleError, "Response should contain an error about title").to.be.true;
        });
        
        it('Should reject post with empty body', async () => {
            const payload = { title: "Post with empty body", body: "" };
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            expect(response.status).to.equal(422);
            expect(response.body).to.be.an('array');
            
            // Check for specific validation message about body
            const hasBodyError = response.body.some(err => 
                (err.field === 'body' || 
                 (err.message && err.message.toLowerCase().includes('body')))
            );
            expect(hasBodyError, "Response should contain an error about body").to.be.true;
        });
        
        // Test with missing required fields
        it('Should reject post with missing title field', async () => {
            const payload = { body: "This post is missing the title field" };
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            expect(response.status).to.equal(422);
            expect(response.body).to.be.an('array');
        });
        
        it('Should reject post with missing body field', async () => {
            const payload = { title: "Post missing body field" };
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            expect(response.status).to.equal(422);
            expect(response.body).to.be.an('array');
        });
        
        // Test with extremely long values
        it('Should handle post with very long title', async () => {
            // Create title with 1000+ characters
            const longTitle = faker.lorem.paragraphs(5);
            const payload = { 
                title: longTitle,
                body: "This post has a very long title" 
            };
            
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            // Based on updated test results, API rejects very long titles with validation error
            expect(response.status).to.equal(422);
        });
        
        it('Should handle post with very long body', async () => {
            // Create body with 10000+ characters
            const longBody = faker.lorem.paragraphs(40);
            const payload = { 
                title: "Post with very long body",
                body: longBody
            };
            
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            // Based on updated test results, API rejects very long body content with validation error
            expect(response.status).to.equal(422);
        });
    });
    
    // 2. Resource not found tests - 404 Not Found
    describe('Resource Not Found Tests (404)', () => {
        it('Should return 404 when fetching non-existent post', async () => {
            // Use a very large ID that's unlikely to exist
            const nonExistentId = 999999999;
            const response = await request(
                httpMethods.GET, 
                `${routes.v2_posts}/${nonExistentId}`
            );
            
            expect(response.status).to.equal(404);
        });
        
        it('Should return 404 when updating non-existent post', async () => {
            const nonExistentId = 999999999;
            const payload = { 
                title: "Updated title", 
                body: "Updated body"
            };
            
            const response = await request(
                httpMethods.PUT, 
                `${routes.v2_posts}/${nonExistentId}`, 
                payload
            );
            
            expect(response.status).to.equal(404);
        });
        
        it('Should return 404 when deleting non-existent post', async () => {
            const nonExistentId = 999999999;
            const response = await request(
                httpMethods.DELETE, 
                `${routes.v2_posts}/${nonExistentId}`
            );
            
            expect(response.status).to.equal(404);
        });
        
        it('Should handle fetching posts for non-existent user', async () => {
            const nonExistentUserId = 999999999;
            const response = await request(
                httpMethods.GET, 
                `${routes.v2_users}/${nonExistentUserId}/posts`
            );
            
            // API returns 200 with empty array for non-existent user posts
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
        
        it('Should handle creating post for non-existent user', async () => {
            const nonExistentUserId = 999999999;
            const payload = {
                title: "Post for non-existent user",
                body: "This should fail because the user doesn't exist"
            };
            
            const response = await request(
                httpMethods.POST,
                `${routes.v2_users}/${nonExistentUserId}/posts`,
                payload
            );
            
            // Based on test results, API returns 422 for non-existent user
            expect(response.status).to.equal(422);
        });
    });
    
    // 3. Bad request tests - 400 Bad Request
    describe('Bad Request Tests (400)', () => {
        // These tests may or may not apply depending on the API implementation
        it('Should handle incorrect ID format gracefully', async () => {
            const invalidId = "not-a-number";
            const response = await request(
                httpMethods.GET,
                `${routes.v2_posts}/${invalidId}`
            );
            
            // Based on test results, API returns 404 for invalid ID format
            expect(response.status).to.equal(404);
        });
    });
    
    // 4. Parameter validation tests
    describe('Parameter Validation Tests', () => {
        it('Should handle invalid user ID when creating post', async () => {
            const invalidUserId = "invalid";
            const payload = {
                title: "Post with invalid user ID",
                body: "This should fail because the user ID is invalid"
            };
            
            const response = await request(
                httpMethods.POST,
                `${routes.v2_users}/${invalidUserId}/posts`,
                payload
            );
            
            // Based on test results, API returns 422 for invalid user ID
            expect(response.status).to.equal(422);
        });
    });
    
    // 5. Edge cases
    describe('Edge Case Tests', () => {
        it('Should handle special characters in post content', async () => {
            const specialCharsTitle = "Special #$%^& characters !@#";
            const specialCharsBody = "Body with unicode: 你好, नमस्ते, مرحبا, γειά σου";
            
            const payload = { 
                title: specialCharsTitle,
                body: specialCharsBody
            };
            
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                payload
            );
            
            // Special chars should be handled correctly
            expect(response.status).to.equal(201);
            expect(response.body.title).to.equal(specialCharsTitle);
            expect(response.body.body).to.equal(specialCharsBody);
        });
        
        it('Should handle HTML content in post body', async () => {
            const htmlContent = "<h1>Test</h1><p>This is <b>HTML</b> content with <script>alert('xss')</script> tags</p>";
            
            const payload = {
                title: "Post with HTML content",
                body: htmlContent
            };
            
            const response = await request(
                httpMethods.POST,
                `${routes.v2_users}/${userId}/posts`,
                payload
            );
            
            // Based on test results, API accepts HTML content
            expect(response.status).to.equal(201);
            
            // If accepted, check how it's handled
            console.log("HTML handling:", response.body.body === htmlContent ? 
                "HTML preserved as-is" : "HTML modified/sanitized");
        });
        
        it('Should handle posts with only whitespace in required fields', async () => {
            const payload = {
                title: "   ",
                body: "   "
            };
            
            const response = await request(
                httpMethods.POST,
                `${routes.v2_users}/${userId}/posts`,
                payload
            );
            
            // Based on test results, API treats whitespace as invalid
            expect(response.status).to.equal(422);
        });
    });
    
    // 6. Update-specific tests
    describe('Update-specific Tests', () => {
        it('Should validate updates to an existing post', async () => {
            // Attempt to update a post with invalid data
            const payload = {
                title: "",
                body: "Updated body"
            };
            
            const response = await request(
                httpMethods.PUT,
                `${routes.v2_posts}/${validPostId}`,
                payload
            );
            
            // Should reject with validation error
            expect(response.status).to.equal(422);
        });
        
        it('Should handle partial updates appropriately', async () => {
            // Try to update only the title
            const payload = {
                title: "Updated title only"
            };
            
            const response = await request(
                httpMethods.PUT,
                `${routes.v2_posts}/${validPostId}`,
                payload
            );
            
            // Based on test results, API supports partial updates
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(payload.title);
        });
    });
}); 