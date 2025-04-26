# Data-Driven Testing Capability

This document provides details on the data-driven testing capabilities added to the API Automation Framework.

## Overview

Data-driven testing enables running the same test with multiple sets of data, making tests more comprehensive and maintainable. It separates test logic from test data, making it easier to add new test cases without modifying the test code.

## Key Features

- **Multiple Data Sources**: Support for JSON, CSV, and dynamically generated test data
- **Template-Based Testing**: Data templates with placeholder support for dynamic values
- **Entity-Based Organization**: Structured organization of test data by entity type
- **Schema Validation**: Basic structure for validating data against defined schemas
- **Data Manipulation**: Tools for filtering, combining, and modifying test data

## Directory Structure

The test data is organized using the following structure:

```
resources/
└── data/
    └── [entity-type]/
        ├── [entity].json        # Standard test data in JSON format
        ├── [entity].csv         # Test data in CSV format
        ├── templates.json       # Template data with placeholders
        └── schema.json          # JSON schema for validation
```

For example, the posts entity data is organized as:

```
resources/
└── data/
    └── posts/
        ├── posts.json          # Post test data
        ├── posts.csv           # Post test data in CSV format
        ├── templates.json      # Post templates with placeholders
        └── schema.json         # Post JSON schema
```

## Data Helper Utility

The `dataHelper.js` utility provides methods for working with test data:

### Loading Data

```javascript
// Load JSON data
const postsData = dataHelper.loadJsonData('resources/data/posts/posts.json');

// Load CSV data
const csvData = await dataHelper.loadCsvData('resources/data/posts/posts.csv');

// Get entity data using helper method
const testCases = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');
```

### Template-Based Testing

```javascript
// Get template
const template = dataHelper.getTemplate('posts', 'postTemplates')[0];

// Define replacement values
const replacements = {
    dynamicValue: "test-value",
    anotherValue: "another-test-value"
};

// Replace placeholders
const resolvedData = dataHelper.replacePlaceholders(template, replacements);
```

### Data Manipulation

```javascript
// Filter test data
const filteredData = dataHelper.filterTestData(jsonData, 
    (item) => item.title.includes('specific text'));

// Combine data sources
const combinedData = dataHelper.combineDataSources(filteredData, dynamicData);
```

### Schema Validation

```javascript
// Validate data against schema
const validation = dataHelper.validateSchema(data, 'posts');
if (validation.isValid) {
    // Use the data
} else {
    console.error('Validation errors:', validation.errors);
}
```

## JSON Data Format

JSON test data is organized with descriptive keys for different test cases:

```json
{
  "createPosts": [
    {
      "title": "Data-driven test post 1",
      "body": "This is the body of test post 1"
    },
    {
      "title": "Data-driven test post 2",
      "body": "This is the body of test post 2"
    }
  ],
  "createPostsNegative": [
    {
      "title": "",
      "body": "This post has an empty title which should fail validation."
    }
  ]
}
```

## CSV Data Format

CSV files provide another way to define test data:

```
title,body,expected_status
Test post 1,This is test post 1,201
Test post 2,This is test post 2,201
,Empty title post,422
```

## Template Format

Templates define data structures with placeholders that can be replaced at runtime:

```json
{
  "postTemplates": [
    {
      "title": "Post with ${dynamicValue} in title",
      "body": "This is a post with ${dynamicValue} in the body and also ${anotherValue}."
    }
  ]
}
```

## Usage Examples

### Basic JSON-Driven Test

```javascript
// Load test cases
const testCases = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');

// Run tests for each data set
testCases.forEach((testData, index) => {
    it(`Should create post with dataset ${index + 1}`, async () => {
        const response = await request(httpMethods.POST, endpoint, testData);
        
        // Assertions
        expect(response.status).equal(201);
        expect(response.body.title).to.equal(testData.title);
    });
});
```

### CSV-Driven Test

```javascript
it('Should run tests with CSV data', async () => {
    // Load CSV data
    const csvData = await dataHelper.loadCsvData('resources/data/posts/posts.csv');
    
    // Run test for each row
    for (const row of csvData) {
        const testData = {
            title: row.title,
            body: row.body
        };
        
        const response = await request(httpMethods.POST, endpoint, testData);
        
        // Assert based on expected status from CSV
        expect(response.status).to.equal(parseInt(row.expected_status));
    }
});
```

### Template-Based Test

```javascript
it('Should use template with dynamic values', async () => {
    // Get template
    const template = dataHelper.getTemplate('posts', 'postTemplates')[0];
    
    // Replace placeholders
    const resolvedData = dataHelper.replacePlaceholders(template, {
        dynamicValue: "test-value",
        anotherValue: "another-value"
    });
    
    const response = await request(httpMethods.POST, endpoint, resolvedData);
    
    // Assertions
    expect(response.status).equal(201);
});
```

## Best Practices

1. **Organize by Entity Type**: Keep data for each entity type in its own directory
2. **Use Descriptive Keys**: Use descriptive key names for data sets (e.g., `createPosts`, `updatePosts`)
3. **Include Negative Cases**: Always include negative test cases to test validation
4. **Keep Raw Data Separate**: Avoid embedding large amounts of test data directly in test files
5. **Use Templates**: Use templates for data with repeating patterns but changing values
6. **Validate Before Using**: Consider validating data against a schema before using it in tests

## Future Enhancements

1. **Full Schema Validation**: Implement full JSON schema validation using a library like Ajv
2. **External Data Sources**: Add support for loading test data from external sources (databases, APIs)
3. **Data Generation Rules**: Define rules for generating test data beyond simple random values
4. **Data Relationships**: Add support for defining relationships between different entities in test data 