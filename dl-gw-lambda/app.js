const axios = require('axios');
const url = process.env.urlForALB;
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

console.log('Loading function');


exports.lambdaHandler = async (event, context) => {
    try {

        console.log('start running handler ............. ');
		console.log('REquest headers : ' + JSON.stringify(event.headers));
		console.log('REquest path : ' + event.path);
		console.log('REquest path : ' + JSON.stringify(event.queryStringParameters));
		
        //Try attaching the headers from the inbound request:
        let auth = event.headers['Authorization'];
        let urlStructure = url + event.path.replace('/Stage', '');
        let securityId = event.queryStringParameters['sedol'];
        let bucket = event.queryStringParameters['bucket'];

        let config = {
            headers: {
                Authorization: auth,
            },
            params: {
                sedol: securityId,
                bucket: bucket,
            }

        }

        const ret = await axios(urlStructure, config);
        let rep = {
            headers: ret.headers,
            body: JSON.stringify(ret.data),
			statusCode: ret.statusCode
        };
		console.log(" status : " + JSON.stringify(rep.statusCode));
		console.log(" headers : " + JSON.stringify(rep.headers));
        response = rep;
		console.log('End function');

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};