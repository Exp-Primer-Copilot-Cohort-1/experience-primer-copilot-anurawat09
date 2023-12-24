//create a web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');

app.use(bodyParser.json());