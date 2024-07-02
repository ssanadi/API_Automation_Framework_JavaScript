# API_Automation_Framework_JavaScript

This repository contains a robust and scalable API Automation Framework built using JavaScript. It leverages modern testing libraries like Mocha and Chai for writing and executing test cases and Supertest for making HTTP assertions. The framework is designed to facilitate efficient and effective API testing, ensuring comprehensive coverage and high reliability of API endpoints.

## Features

- **Modular Structure**: Well-organized folder structure separating concerns for better maintainability.
- **Dynamic Endpoint Handling**: Support for placeholder replacement in endpoints, allowing flexible and reusable API endpoint definitions.
- **Environment Configuration**: Utilizes `.env` for managing sensitive data like tokens and a properties file for environment-specific base URLs.
- **Comprehensive Testing**: Includes examples of GET and POST requests with assertions, making it easy to expand and customize.
- **Automated CI Integration**: Ready to integrate with CI/CD pipelines for continuous testing and deployment.
- **Detailed Reporting**: Integration with Mocha Awesome for generating comprehensive and visually appealing test reports.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository and Install dependencies:
   ```sh
   git clone https://github.com/yourusername/API_Automation_Framework_JavaScript.git
   cd API_Automation_Framework_JavaScript
   npm install

### Usage
1. Set up environment variables in a .env file:
      ```env
      TOKEN=your_api_token_here

3. Configure base URLs for different environments in a properties file:
     ```properties
     QA_BASE_URL=https://qa.example.com
     STAGING_BASE_URL=https://staging.example.com
     PROD_BASE_URL=https://prod.example.com

5. Run tests:
     ```sh
     npm run test_with_report      

7. View Mocha Awesome reports:

After running the tests, open the mochawesome-report/mochawesome.html file in your browser to view the detailed test report.



