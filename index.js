'use strict';

const { App } = require('@aws-cdk/core');
const { createStack } = require('./src/create-stack');
const configs = require('./config');
const { NODE_ENV } = process.env;

const environment = NODE_ENV || 'development';
const config = configs[environment];

const app = new App(config.app);

createStack(app, config);

app.synth();
