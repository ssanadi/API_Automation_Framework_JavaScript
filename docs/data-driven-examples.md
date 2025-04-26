# Data-Driven Testing Examples

This guide provides practical examples of data-driven testing in the API Automation Framework, showing how to use each feature.

## Basic JSON Data-Driven Test

This example shows how to run the same test with multiple data sets from a JSON file:

### 1. Create JSON test data (resources/data/posts/posts.json):

```json
{
  "createPosts": [
    {
      "title": "Test post 1",
      "body": "This is test post 1"
    },
    {
      "title": "Test post 2",
      "body": "This is test post 2"
    }
  ]
}
```

### 2. Create a data-driven test:

```javascript
const dataHelper = require("../helper/dataHelper.js");

describe('JSON-Driven Test Example', () => {
    // Load test data
    const testCases = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');
    
    // For each test case in the data
    testCases.forEach((testData, index) => {
        it(`Test case ${index + 1}: ${testData.title}`, async () => {
            // Make a request using the test data
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                testData
            );
            
            // Assertions
            expect(response.status).equal(201);
            expect(response.body.title).to.equal(testData.title);
        });
    });
});
```

## CSV Data-Driven Testing

This example shows how to use CSV files for data-driven testing:

### 1. Create CSV test data (resources/data/posts/posts.csv):

```
title,body,expected_status
Test post 1,This is test post 1,201
Test post 2,This is test post 2,201
,Empty title post,422
```

### 2. Create a CSV-driven test:

```javascript
it('Should test with CSV data', async () => {
    // Load CSV data
    const csvData = await dataHelper.loadCsvData('resources/data/posts/posts.csv');
    
    // Test each row in the CSV
    for (const [index, row] of csvData.entries()) {
        console.log(`Running test with CSV row ${index + 1}`);
        
        const testData = {
            title: row.title,
            body: row.body
        };
        
        const expectedStatus = parseInt(row.expected_status);
        const response = await request(
            httpMethods.POST, 
            `${routes.v2_users}/${userId}/posts`, 
            testData
        );
        
        // Dynamic assertion based on CSV data
        expect(response.status).to.equal(expectedStatus);
        
        // Additional assertions based on status
        if (response.status === 201) {
            expect(response.body.title).to.equal(testData.title);
        } else if (response.status === 422) {
            expect(response.body).to.be.an('array');
        }
    }
});
```

## Template-Based Testing

This example shows how to use templates with placeholders:

### 1. Create template data (resources/data/posts/templates.json):

```json
{
  "postTemplates": [
    {
      "title": "Post by ${author} about ${topic}",
      "body": "This post about ${topic} was written by ${author} on ${date}."
    }
  ]
}
```

### 2. Use templates in tests:

```javascript
it('Should test with template and dynamic values', async () => {
    // Get template
    const template = dataHelper.getTemplate('posts', 'postTemplates')[0];
    
    // Create dynamic values
    const replacements = {
        author: faker.person.fullName(),
        topic: faker.lorem.word(),
        date: faker.date.recent().toISOString().split('T')[0]
    };
    
    // Replace placeholders with values
    const resolvedData = dataHelper.replacePlaceholders(template, replacements);
    
    // Verify template was processed correctly
    expect(resolvedData.title).to.include(replacements.author);
    expect(resolvedData.title).to.include(replacements.topic);
    expect(resolvedData.body).to.include(replacements.date);
    
    // Use the resolved data in the test
    const response = await request(
        httpMethods.POST, 
        `${routes.v2_users}/${userId}/posts`, 
        resolvedData
    );
    
    // Assertions
    expect(response.status).equal(201);
    expect(response.body.title).to.equal(resolvedData.title);
});
```

## Combining Data Sources

This example shows how to combine different data sources:

```javascript
it('Should combine different data sources', async () => {
    // Get data from JSON file
    const jsonData = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');
    
    // Generate dynamic data
    const dynamicData = [
        { 
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(1)
        },
        { 
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(1)
        }
    ];
    
    // Filter the JSON data
    const filteredData = dataHelper.filterTestData(jsonData, 
        (item) => item.title.includes('specific text'));
    
    // Combine filtered JSON data with dynamic data
    const combinedData = dataHelper.combineDataSources(filteredData, dynamicData);
    
    // Use combinedData for testing
    for (const testData of combinedData) {
        const response = await request(
            httpMethods.POST, 
            `${routes.v2_users}/${userId}/posts`, 
            testData
        );
        
        expect(response.status).equal(201);
    }
});
```

## Dynamic Data Transformation

This example shows how to transform data at runtime:

```javascript
it('Should transform test data at runtime', async () => {
    // Get base data
    const testData = dataHelper.getEntityData('posts', 'posts.json', 'createPosts')[0];
    
    // Transform the data
    const transformedData = {
        ...testData,
        title: testData.title.toUpperCase(),
        body: testData.body + ' (Modified at ' + new Date().toISOString() + ')',
        additionalField: faker.lorem.sentence()
    };
    
    // Use transformed data
    const response = await request(
        httpMethods.POST, 
        `${routes.v2_users}/${userId}/posts`, 
        transformedData
    );
    
    expect(response.status).equal(201);
    expect(response.body.title).to.equal(transformedData.title);
});
```

## Using Data for Negative Testing

This example shows how to use data-driven approach for negative testing:

```javascript
describe('Negative Testing with Data', () => {
    const invalidData = [
        { title: "", body: "Empty title" },                // Empty title
        { title: "Valid title", body: "" },                // Empty body
        { title: "X".repeat(300), body: "Too long title" } // Title too long
    ];
    
    invalidData.forEach((testData, index) => {
        it(`Should handle invalid data case ${index + 1}`, async () => {
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                testData
            );
            
            // Expect validation error
            expect(response.status).to.equal(422);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.at.least(1);
        });
    });
});
```

## Full Test Example

This example shows a complete test that uses multiple data-driven approaches:

```javascript
const { request } = require("../helper/httpHelper.js");
const { httpMethods } = require("../resources/http_methods.js");
const { routes } = require("../resources/endpoints.js");
const dataHelper = require("../helper/dataHelper.js");
const { expect } = require("chai");
const { faker } = require('@faker-js/faker');

describe('Comprehensive Data-Driven Test Example', () => {
    let userId;
    
    before(async () => {
        // Create a test user
        const userPayload = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            gender: faker.person.sex(),
            status: "active"
        };
        
        const response = await request(httpMethods.POST, routes.v2_users, userPayload);
        userId = response.body.id;
    });
    
    after(async () => {
        // Clean up the test user
        if (userId) {
            await request(httpMethods.DELETE, `${routes.v2_users}/${userId}`);
        }
    });
    
    // Test with JSON data
    describe('JSON-based tests', () => {
        const testCases = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');
        
        testCases.forEach((testData, index) => {
            it(`Should create post with JSON data ${index + 1}`, async () => {
                const response = await request(
                    httpMethods.POST, 
                    `${routes.v2_users}/${userId}/posts`, 
                    testData
                );
                
                expect(response.status).equal(201);
            });
        });
    });
    
    // Test with CSV data
    describe('CSV-based tests', async () => {
        it('Should test with CSV data', async () => {
            const csvData = await dataHelper.loadCsvData('resources/data/posts/posts.csv');
            
            for (const row of csvData) {
                const testData = {
                    title: row.title,
                    body: row.body
                };
                
                const response = await request(
                    httpMethods.POST, 
                    `${routes.v2_users}/${userId}/posts`, 
                    testData
                );
                
                expect(response.status).to.equal(parseInt(row.expected_status));
            }
        });
    });
    
    // Test with templates
    describe('Template-based tests', () => {
        it('Should test with templates', async () => {
            const template = dataHelper.getTemplate('posts', 'postTemplates')[0];
            
            const resolvedData = dataHelper.replacePlaceholders(template, {
                author: faker.person.fullName(),
                topic: "API Testing",
                date: new Date().toISOString().split('T')[0]
            });
            
            const response = await request(
                httpMethods.POST, 
                `${routes.v2_users}/${userId}/posts`, 
                resolvedData
            );
            
            expect(response.status).equal(201);
        });
    });
});
```

These examples demonstrate the various ways to implement data-driven testing in the API Automation Framework. By separating test data from test logic, you can create more maintainable and comprehensive test suites. 