# LocalStack demo

This repository was created in order to create an small demo for https://github.com/localstack/localstack/issues/2757.
Generates a CloudFormation template with [aws-cdk](https://github.com/aws/aws-cdk) and deploy it to Localstack.

## How to reproduce the issue

1. Clone the repository

```console
  git clone https://github.com/lfantone/localstack-issue-2757-example.git
```

2. Install dependencies with `yarn` or `npm install`.
3. Run the `synthesize` script with `yarn synthesize` or `npm run synthesize`. This script command will create a CloudFormation template file named _LocalStackDemoStack.template.json_ in the **cdk.out** folder.
4. Zip the `asset` folder, upload it to a local S3 Bucket and replace the `"your-bucket-goes-here"` from the `params.json` file with the S3 Bucket name. (Not sure if this step is necessary or you can just use any bucket).
5. Deploy the CloudFormation template by running `yarn deploy` or `npm run deploy`.
