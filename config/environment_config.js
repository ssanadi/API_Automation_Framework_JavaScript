require('dotenv').config();
var propertiesReader = require("properties-reader");

// Load environment-specific properties file
let environment = process.env.ENVIRONMENT || 'qa';
let properties = propertiesReader(`config/${environment}_env.properties`);
const BASE_URL = properties.get('BASE_URL');

//load environment variables
const TOKEN = process.env.TOKEN;
const REGION = process.env.REGION;
const TENANT = process.env.TENANT;

module.exports = {
    token: TOKEN,
    region: REGION,
    tenant: TENANT,
    base_url: BASE_URL
}