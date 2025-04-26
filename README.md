# API_Automation_Framework_JavaScript

This repository contains a robust and scalable API Automation Framework built using JavaScript. It leverages modern testing libraries like Mocha and Chai for writing and executing test cases and Supertest for making HTTP assertions. The framework is designed to facilitate efficient and effective API testing, ensuring comprehensive coverage and high reliability of API endpoints.

## Features

- **Modular Structure**: Well-organized folder structure separating concerns for better maintainability.
- **Dynamic Endpoint Handling**: Support for placeholder replacement in endpoints, allowing flexible and reusable API endpoint definitions.
- **Environment Configuration**: Utilizes `.env` for managing sensitive data like tokens and a properties file for environment-specific base URLs.
- **Data-Driven Testing**: Comprehensive data-driven testing capability with support for JSON, CSV, and template-based data.
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
   ```

### Usage
1. Set up environment variables in a .env file:
      ```env
      TOKEN=your_api_token_here
      ENVIRONMENT=qa
      ```

2. Configure base URLs for different environments in a properties file:
     ```properties
     BASE_URL=https://qa.example.com
     RETRY_COUNT=3
     ```

3. Run tests:
     ```sh
     npm run test                  # Run all tests
     npm test -- --grep "Posts"    # Run specific tests
     npm run test_with_report      # Generate test reports
     ```

4. View Mocha Awesome reports:

After running the tests, open the mochawesome-report/mochawesome.html file in your browser to view the detailed test report.

## Project Structure

```
API_Automation_Framework_JavaScript/
├── config/                 # Configuration files
│   ├── environment_config.js
│   ├── qa_env.properties
│   └── staging_env.properties
├── docs/                   # Documentation
│   ├── README.md
│   ├── data-driven-testing.md
│   └── data-driven-examples.md
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

## Data-Driven Testing

The framework includes a powerful data-driven testing capability that allows running the same test with multiple datasets. This separates test data from test logic, making it easier to add new test cases without modifying the test code.

Key features include:
- Multiple data sources (JSON, CSV, dynamic data)
- Template-based testing with placeholders
- Organized data by entity type
- Data filtering and combining

See the documentation for details:
- [Data-Driven Testing Overview](docs/data-driven-testing.md)
- [Data-Driven Testing Examples](docs/data-driven-examples.md)

## Contributing

Contributions to enhance and improve this framework are welcome. Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the ISC License.



