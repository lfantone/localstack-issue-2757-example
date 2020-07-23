'use strict';

const AWS = require('aws-sdk');
const { IS_OFFLINE, EDGE_PORT } = process.env;
const EDGE_ENDPOINT = `http://localhost:${EDGE_PORT || 4566}`;

const options = {
  region: 'us-west-1',
  s3ForcePathStyle: true,
  dynamodb: {
    endpoint: EDGE_ENDPOINT
  },
  s3: {
    endpoint: EDGE_ENDPOINT
  }
};

if (IS_OFFLINE) {
  AWS.config.update(options);
}

module.exports = AWS;
