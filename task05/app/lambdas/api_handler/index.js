// Load the AWS SDK for Node.js and UUID library
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure the region
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB document client
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));

    let data;

    // Check if invoked via API Gateway with a body
    if (event.body) {
        try {
            // Check if the body is a string and needs parsing
            data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } catch (error) {
            console.error('Error parsing JSON from event body:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON format in the body' })
            };
        }
    } else {
        // Assume it's a direct invocation if no body is present
        data = event;
    }

    const eventRecord = {
        TableName: "Events",
        Item: {
            id: uuidv4(),
            principalId: data.principalId,
            createdAt: new Date().toISOString(),
            body: data.content
        }
    };

    // Insert the event into the DynamoDB table
    try {
        await dynamodb.put(eventRecord).promise();
        // Generate the response for successful data insertion
        const response = {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: eventRecord.Item })
        };
        return response;
    } catch (error) {
        console.error('Error inserting data into DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while inserting data into DynamoDB' })
        };
    }
};