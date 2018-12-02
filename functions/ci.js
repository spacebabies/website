/**
 * handler:
   {
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
    }

    callback:
    {
    "isBase64Encoded": true|false,
    "statusCode": httpStatusCode,
    "headers": { "headerName": "headerValue", ... },
    "body": "..."
    }
  */


exports.handler = async function(event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (event.queryStringParameters['token'] !== process.env.TOKEN) {
    return { statusCode: 400, headers: { "WWW-Authenticate": 'Bearer realm="API"'} }''
  }

  }

  callback(null, response);
}
