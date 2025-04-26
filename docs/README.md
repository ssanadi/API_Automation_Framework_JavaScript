# API Automation Framework Documentation

This documentation provides detailed information about the JavaScript API Automation Framework, its features, and how to use it.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Framework Structure](#framework-structure)
4. [Core Features](#core-features)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)

## Overview

The API Automation Framework is a robust and scalable solution built in JavaScript for testing RESTful APIs. It uses modern testing libraries like Mocha and Chai for writing and executing test cases, and Supertest for making HTTP assertions.

Key features include:
- Modular architecture with separation of concerns
- Support for multiple environments
- Data-driven testing capability
- API request abstraction and retry mechanism
- Comprehensive reporting with Mochawesome

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Set up environment variables in `.env`:
   ```
   TOKEN=your_api_token
   ENVIRONMENT=qa
   REGION=your_region
   TENANT=your_tenant
   ```

2. Configure base URLs in environment property files:
   ```
   # qa_env.properties
   BASE_URL=https://qa-api.example.com
   RETRY_COUNT=3
   ```

### Running Tests

Run all tests:
```bash
npm test
```

Run specific tests:
```bash
npm test -- --grep "Posts API"
```

Generate test reports:
```bash
npm run test_with_report
```

## Framework Structure

```
API_Automation_Framework_JavaScript/
├── config/                 # Configuration files
│   ├── environment_config.js
│   ├── qa_env.properties
│   └── staging_env.properties
├── docs/                   # Documentation
│   ├── README.md
│   └── data-driven-testing.md
├── helper/                 # Helper utilities
│   ├── httpHelper.js        # HTTP request helper
│   └── dataHelper.js        # Data handling helper
├── resources/              # Resources for tests
│   ├── data/               # Test data organized by entity
│   │   └── posts/
│   │       ├── posts.json
│   │       ├── posts.csv
│   │       ├── templates.json
│   │       └── schema.json
│   ├── endpoints.js        # API endpoints
│   └── http_methods.js     # HTTP method constants
├── test/                   # Test files
│   ├── users_test.js
│   ├── posts_test.js
│   └── posts_organized_test.js
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── .mocharc.yaml           # Mocha configuration
```

## Core Features

### HTTP Request Helper

The `httpHelper.js` provides a unified interface for making HTTP requests:

```javascript
const { request } = require("../helper/httpHelper.js");

// Making a GET request
let response = await request(httpMethods.GET, '/users');

// Making a POST request with payload
let response = await request(httpMethods.POST, '/users', userPayload);
```

Features include:
- Automatic header management
- Retry mechanism for transient failures
- Support for all HTTP methods

### Environment Configuration

The framework supports multiple environments through:
- Environment variables for sensitive data
- Property files for environment-specific settings
- Dynamic environment selection at runtime

## Advanced Features

### Data-Driven Testing

The framework includes robust support for data-driven testing, allowing tests to be run with multiple datasets.

[View detailed documentation on data-driven testing](data-driven-testing.md)

Key capabilities:
- Multiple data sources (JSON, CSV)
- Template-based testing with placeholders
- Organized data by entity type
- Data manipulation utilities

Example:
```javascript
// Load test data
const testCases = dataHelper.getEntityData('posts', 'posts.json', 'createPosts');

// Run test for each data item
testCases.forEach((testData) => {
    it(`Should test with ${testData.title}`, async () => {
        // Test logic using testData
    });
});
```

### Mocking and Stubbing

The framework includes support for API mocking using Nock:

```javascript
// Mock an API endpoint
nock(base_url)
    .get("/users")
    .reply(200, mockUserData);
```

## Best Practices

### Test Organization

1. **Structure tests logically**: Group tests by entity or feature
2. **Use descriptive test names**: Make test names clear and descriptive
3. **Isolate tests**: Each test should be independent and not rely on other tests

### Data Management

1. **Separate test data from test code**: Store test data in organized data files
2. **Use data-driven approach**: Parameterize tests to run with multiple data sets
3. **Include edge cases**: Test with edge cases, not just happy paths

### Maintenance

1. **Keep dependencies updated**: Regularly update project dependencies
2. **Document complex tests**: Add comments for complex test scenarios
3. **Review and refactor**: Periodically review and refactor test code

## Additional Resources

- [Data-Driven Testing Documentation](data-driven-testing.md)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Documentation](https://www.chaijs.com/)
- [SuperTest Documentation](https://github.com/visionmedia/supertest) 