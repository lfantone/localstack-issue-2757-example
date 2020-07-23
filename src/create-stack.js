'use strict';

const { Table, AttributeType, BillingMode } = require('@aws-cdk/aws-dynamodb');
const { Stack } = require('@aws-cdk/core');
const { AssetCode, Function, Runtime } = require('@aws-cdk/aws-lambda');
const { LambdaIntegration, LambdaRestApi } = require('@aws-cdk/aws-apigateway');
const { Role, ManagedPolicy, ServicePrincipal } = require('@aws-cdk/aws-iam');
// const addCorsOptions = require('./add-cors');

class LocalStackDemoStack extends Stack {
  constructor(app, id, config) {
    super(app, id, config.stack);

    const environment = config.stage || 'development';

    const dynamoDBTable = new Table(this, `localstack-demo`, {
      ...config.dynamodb,
      tableName: `${environment}-localstack-demo`,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'key',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const lambdaRole = new Role(this, 'lambda-role-id', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role to be used by lambda functions',
      roleName: 'lambda-role',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });
    const usersServiceCode = new AssetCode('src/lambdas/');

    const createUserLambdaHandler = new Function(this, 'create-user-handler', {
      code: usersServiceCode,
      handler: 'index.createUserHandler',
      runtime: Runtime.NODEJS_12_X,
      memorySize: 256,
      environment: {
        TABLE_NAME: dynamoDBTable.tableName
      },
      role: lambdaRole
    });

    const authUserLambdaHandler = new Function(this, 'authenticate-user-handler', {
      code: usersServiceCode,
      handler: 'index.authenticateUserHandler',
      runtime: Runtime.NODEJS_12_X,
      memorySize: 256,
      environment: {
        TABLE_NAME: dynamoDBTable.tableName
      },
      role: lambdaRole
    });

    dynamoDBTable.grantReadWriteData(createUserLambdaHandler);
    dynamoDBTable.grantReadWriteData(authUserLambdaHandler);

    const usersAPI = new LambdaRestApi(this, 'localstack-demo-users-api', {
      ...config.apigateway,
      handler: createUserLambdaHandler,
      // localstack doesn't support AWS::ApiGateway::Stage type
      deploy: false,
      proxy: false
    });

    const users = usersAPI.root.addResource('users');
    const auth = users.addResource('auth');

    users.addMethod('POST', new LambdaIntegration(createUserLambdaHandler));
    auth.addMethod('POST', new LambdaIntegration(authUserLambdaHandler));
  }
}

function createStack(app, config) {
  return new LocalStackDemoStack(app, 'LocalStackDemoStack', config);
}

module.exports = LocalStackDemoStack;
module.exports.createStack = createStack;
