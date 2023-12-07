const jose = require('node-jose');
const { get, includes, join, last, nth, split } = require('lodash');
const { BIKER, SENDER } = require('../constants/constants');


const buildArn = (methodArn, url) => {
  const segments = split(methodArn, ':');
  const path = nth(segments, 5);
  const apiGatewayArn = split(path, '/');

  const resource = join(
    [
      nth(segments, 0),
      nth(segments, 1),
      nth(segments, 2),
      nth(segments, 3),
      nth(segments, 4),
      join([nth(apiGatewayArn, 0), nth(apiGatewayArn, 1), ...url], '/'),
    ],
    ':',
  );

  return resource;
};

const generatePolicy = (principalId, groups, methodArn) => {
  let resource = [];

  // If biker user then add changing status permission
  if (includes(groups, BIKER)) {
    resource = [
      ...resource,
      buildArn(methodArn, ['PUT', 'parcel', '*', 'state', '*' ]),
    ];
  }

  // If sender user then add creating parcel permission
  if (includes(groups, SENDER)) {
    resource = [
      ...resource,
      buildArn(methodArn, ['POST', 'parcel', '*' ]),
    ];
  }

  // For all users append these permissions
  resource = [
    ...resource,
    buildArn(methodArn, ['GET', 'parcel', '*']),
    buildArn(methodArn, ['GET', 'user', '*']),
  ];

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['execute-api:Invoke'],
          Resource: resource,
        },
      ],
    },
  };
};

const handler = async (event, context, callback) => {
  try {
    const keystoreObj = require(`./keystore.json`);
    const keystore = await jose.JWK.asKeyStore(keystoreObj);

    // Retrieve token from HTTP header
    const token = last(split(event.headers.authorization || event.headers.Authorization, ' '));
    const result = await jose.JWS.createVerify(keystore).verify(token);

    const obj = JSON.parse(result.payload.toString('utf8'));

    const principalId = get(obj, 'sub');
    const groups = get(obj, 'cognito:groups', []);

    callback(null, generatePolicy(principalId, groups, event.routeArn));
  } catch (error) {
    callback('Unauthorized');
  }
};

module.exports = { handler };
