# Saloodo Tech Assignment Submission - Backend

This repository contains the backend portion of the Saloodo tech assignment submission. The backend is responsible for handling data storage in a MongoDB database and is hosted on AWS Lambda functions using the Serverless Framework.

## Local Setup

To run this backend locally, follow these steps:

1. Create a `.env.yml` file in the project root.
2. Contact me at [a.ghazy500@gmail.com](mailto:a.ghazy500@gmail.com) to obtain the necessary values for this file.

After obtaining the required values, proceed with the following commands:

```bash
# Install project dependencies
yarn

# Run the backend locally using the Serverless Framework with serverless-offline plugin
yarn run deploy:host
```
This will simulate the AWS Lambda environment locally for development and testing purposes.

## Deployment
The backend is automatically deployed to AWS Lambda functions using the Serverless Framework.

## Contact Information
For any inquiries, additional information, or to obtain the required values for the .env.yml file, please reach out to me at [a.ghazy500@gmail.com](mailto:a.ghazy500@gmail.com).
