import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider"

// import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
// const { CognitoIdentityProviderClient, GetUserCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
let jwt = require('jsonwebtoken')
let request = require('request')
let jwkToPem = require('jwk-to-pem')
let iss = 'https://cognito-idp.' + process.env.AWS_LAMBDA_REGION + '.amazonaws.com/' + process.env.AWS_COGNITO_POOL_ID
console.log('ISS', iss)
let pems: any

export const handler = (event: any, context: any, callback: any) => {

	if (!pems) { //Download PEM for your UserPool if not already downloaded
		request({ //Download the JWKs and save it as PEM
			url: iss + '/.well-known/jwks.json',
			json: true
		}, function (error: any, response: { statusCode: number }, body: { [x: string]: any }) {
			if (!error && response.statusCode === 200) {
				pems = {};
				let keys = body['keys'];
				for (let i = 0; i < keys.length; i++) {
					//Convert each key to PEM
					let key_id = keys[i].kid;
					let modulus = keys[i].n;
					let exponent = keys[i].e;
					let key_type = keys[i].kty;
					let jwk = { kty: key_type, n: modulus, e: exponent };
					let pem = jwkToPem(jwk);
					pems[key_id] = pem;
				}
				//Now continue with validating the token
				ValidateToken(pems, event, context, callback);
			} else {
				//Unable to download JWKs, fail the call
				context.fail("error");
			}
		});
	} else {
		//PEMs are already downloaded, continue with validating the token
		ValidateToken(pems, event, context, callback);
	}
}

function ValidateToken(pems: any, event: any, context: any, callback: any) {
	let token = event.authorizationToken;
	if (token === undefined) {
		console.log('GET COGNITO TOKEN FROM HEADER COGNITO TOKEN')
		token = event.headers['cognito-token'] ? event.headers['cognito-token'] : event.headers['Cognito-Token']
	}
	console.log('TOKEN:', token)
	//Fail if the token is not jwt
	let decodedJwt = jwt.decode(token, { complete: true });
	if (!decodedJwt) {
		console.log("Not a valid JWT token");
		context.fail("Unauthorized");
		return;
	}

	//Fail if token is not from your UserPool
	if (decodedJwt.payload.iss != iss) {
		console.log("invalid issuer");
		context.fail("Unauthorized");
		return;
	}

	//Reject the jwt if it's not an 'Access Token'
	if (decodedJwt.payload.token_use != 'access') {
		console.log("Not an access token");
		context.fail("Unauthorized");
		return;
	}

	//Get the kid from the token and retrieve corresponding PEM
	let kid = decodedJwt.header.kid;
	let pem = pems[kid];
	if (!pem) {
		console.log('Invalid access token');
		context.fail("Unauthorized");
		return;
	}

	//Verify the signature of the JWT token to ensure it's really coming from your User Pool

	jwt.verify(token, pem, { issuer: iss }, async function (err: any, payload: any) {
		console.log('PAYLOAD', payload)
		if (err) {
			console.log("FAIL ON JWT VERIFY: jwt.verify")
			context.fail("Unauthorized");
		} else {
			//Valid token. Generate the API Gateway policy for the user
			//Always generate the policy on value of 'sub' claim and not for 'username' because username is reassignable
			//sub is UUID for a user which is never reassigned to another user.
			// let principalId = payload.sub;

			//Get AWS AccountId and API Options
			let apiOptions: any = {};
			let tmp = event.methodArn.split(':');
			let apiGatewayArnTmp = tmp[5].split('/');
			// let awsAccountId = tmp[4];
			apiOptions.region = tmp[3];
			apiOptions.restApiId = apiGatewayArnTmp[0];
			apiOptions.stage = apiGatewayArnTmp[1];
			// let method = apiGatewayArnTmp[2];
			let resource = '/'; // root resource
			if (apiGatewayArnTmp[3]) {
				resource += apiGatewayArnTmp[3];
			}

			let params = {
				AccessToken: token /* required */
			};
			const client = new CognitoIdentityProviderClient({ region: process.env.AWS_LAMBDA_REGION });
			const command = new GetUserCommand(params)
			client.send(command, (err, data) => {
				if (err) {
					console.log("FAIL ON COGNITO IDENTITY GET USER: cognitoidentityserviceprovider.getUser")
					console.log(err);
					context.fail("Unauthorized"); // an error occurred
					return;
				} else {
					if (data && data.UserAttributes) {
						let authContext: any = {};
						let currentSession = token;
						authContext["username"] = data.Username;
						authContext["groups"] = payload['cognito:groups'][0].toUpperCase();
						data.UserAttributes.forEach(function (userAttributes) {
							var name = userAttributes.Name;
							if (name == "custom:current_session") {
								currentSession = userAttributes.Value
							}
							if (name == "email") {
								authContext["email"] = userAttributes.Value
							}
						});
						if (currentSession !== token) {
							console.log("FAILED ON <sub> <token validation>: ", payload.sub, currentSession === token)
							context.fail("Unauthorized"); // an error occurred
							return;
						} else {
							console.log("Session not revoked"); // successful response
							callback(null, generatePolicy('user', 'Allow', event.methodArn, authContext));
						}
					}
				}
			})
		}
	});
}

const generatePolicy = function (principalId: any, effect: any, resource: any, context: any) {
	let authResponse: any = {};

	authResponse.principalId = principalId;
	if (effect && resource) {
		let policyDocument: any = {};
		policyDocument.Version = '2012-10-17';
		policyDocument.Statement = [];
		let statementOne: any = {};
		statementOne.Action = 'execute-api:Invoke';
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}


	authResponse.context = context;

	return authResponse;
}