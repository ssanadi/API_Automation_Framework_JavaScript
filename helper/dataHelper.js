const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Data Helper utility for working with test data files
 */
class DataHelper {
    /**
     * Loads data from a JSON file
     * @param {string} filePath - Path to the JSON file
     * @returns {Object} - Parsed JSON data
     */
    loadJsonData(filePath) {
        const fullPath = this._resolveFilePath(filePath);
        try {
            const rawData = fs.readFileSync(fullPath, 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            console.error(`Error loading JSON data from ${fullPath}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Loads data from a CSV file
     * @param {string} filePath - Path to the CSV file
     * @returns {Promise<Array>} - Array of objects representing CSV rows
     */
    async loadCsvData(filePath) {
        const fullPath = this._resolveFilePath(filePath);
        const results = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(fullPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => {
                    console.error(`Error loading CSV data from ${fullPath}: ${error.message}`);
                    reject(error);
                });
        });
    }

    /**
     * Gets test cases from a JSON file
     * @param {string} filePath - Path to the JSON file
     * @param {string} dataKey - Optional key to access specific data within the JSON file
     * @returns {Array} - Array of test data objects
     */
    getJsonTestCases(filePath, dataKey = null) {
        const data = this.loadJsonData(filePath);
        
        if (dataKey && data[dataKey]) {
            return data[dataKey];
        }
        
        return data;
    }

    /**
     * Gets test data for a specific entity type (e.g., posts, users)
     * @param {string} entityType - The type of entity to get data for (e.g., 'posts', 'users')
     * @param {string} filename - The filename without path (e.g., 'posts.json')
     * @param {string} dataKey - Optional key to access specific data within the file
     * @returns {Array|Object} - Test data for the entity
     */
    getEntityData(entityType, filename, dataKey = null) {
        const filePath = `resources/data/${entityType}/${filename}`;
        return this.getJsonTestCases(filePath, dataKey);
    }

    /**
     * Gets template data for a specific entity
     * @param {string} entityType - The entity type (e.g., 'posts', 'users')
     * @param {string} templateKey - Key to access specific template in the templates file
     * @returns {Object} - Template data
     */
    getTemplate(entityType, templateKey) {
        const filePath = `resources/data/${entityType}/templates.json`;
        const templates = this.loadJsonData(filePath);
        
        if (templateKey && templates[templateKey]) {
            return templates[templateKey];
        }
        
        return templates;
    }

    /**
     * Saves data to a JSON file
     * @param {string} filePath - Path to save the JSON file
     * @param {Object} data - Data to save
     */
    saveJsonData(filePath, data) {
        const fullPath = this._resolveFilePath(filePath);
        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(fullPath, jsonData, 'utf8');
            console.log(`Data successfully saved to ${fullPath}`);
        } catch (error) {
            console.error(`Error saving JSON data to ${fullPath}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Replaces placeholders in an object with actual values
     * @param {Object} obj - Object with potential placeholders
     * @param {Object} replacements - Key-value pairs for replacements
     * @returns {Object} - New object with replacements applied
     */
    replacePlaceholders(obj, replacements) {
        const stringified = JSON.stringify(obj);
        let result = stringified;
        
        for (const [key, value] of Object.entries(replacements)) {
            const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
            result = result.replace(placeholder, value);
        }
        
        return JSON.parse(result);
    }

    /**
     * Combines multiple data sources into a single dataset
     * @param {...Array} dataSources - Data sources to combine
     * @returns {Array} - Combined dataset
     */
    combineDataSources(...dataSources) {
        return dataSources.reduce((combined, source) => {
            return combined.concat(source);
        }, []);
    }

    /**
     * Filters test data based on a predicate function
     * @param {Array} data - Array of test data
     * @param {Function} predicate - Function to determine which items to keep
     * @returns {Array} - Filtered data
     */
    filterTestData(data, predicate) {
        return data.filter(predicate);
    }

    /**
     * Validates data against a JSON schema
     * @param {Object} data - Data to validate
     * @param {string} entityType - Entity type to get schema for (e.g., 'posts')
     * @returns {Object} - Validation result with isValid and errors properties
     */
    validateSchema(data, entityType) {
        try {
            // Note: This is a placeholder. For real schema validation,
            // you would need to add Ajv or another JSON schema validator library
            console.log(`Schema validation is a placeholder. To implement, add a schema validation library.`);
            return { isValid: true, errors: [] };
        } catch (error) {
            console.error(`Schema validation error: ${error.message}`);
            return { isValid: false, errors: [error.message] };
        }
    }

    /**
     * Resolves a file path relative to resources directory
     * @param {string} filePath - Relative or absolute file path
     * @returns {string} - Full resolved path
     * @private
     */
    _resolveFilePath(filePath) {
        if (path.isAbsolute(filePath)) {
            return filePath;
        }
        
        // Check if path already starts with a project directory
        if (filePath.startsWith('resources/') || 
            filePath.startsWith('test/') || 
            filePath.startsWith('data/')) {
            return path.resolve(process.cwd(), filePath);
        }
        
        // Default to looking in resources/requests if it's just a filename
        return path.resolve(process.cwd(), 'resources/requests', filePath);
    }
}

module.exports = new DataHelper(); 