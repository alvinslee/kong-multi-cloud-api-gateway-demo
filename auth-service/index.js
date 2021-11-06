const credentials = require('./credentials.json')
const jwt = require('jsonwebtoken')

exports.handler = async (event) => {
    let requestBody = event.request_body ? JSON.parse(event.request_body) : event;
    const email = String(requestBody.email).toLowerCase()
    let result
    let statusCode = 401
    
    if (credentials[email] && credentials[email].password === requestBody.password) {
        statusCode = 200
        result = await jwt.sign({
          userId: credentials[email].userId,
          email,
          isAdmin: credentials[email].isAdmin,
          kid: process.env.KONG_CONSUMER_KEY_ID || "kid is required for Kong JWT plugin"
        }, process.env.JWT_SECRET)
    }
    
    return {
      statusCode,
      body: result
    }
};
