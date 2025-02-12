// Load the AWS SDK for Node.js and UUID library
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure the region
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB document client
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('event');
    console.log(event);
    
    console.log("Received event:", JSON.stringify(event));

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No event body!' })
        };
    }

    let data;
    try {
        // Check if event.body is already an object or a string
        if (typeof event.body === 'string') {
            data = JSON.parse(event.body);
        } else {
            // If event.body is already an object, use it directly
            data = event.body;
        }
    } catch (error) {
        console.error('Error parsing event body:', error);
        // Handle error parsing JSON
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Error parsing JSON body' })
        };
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
        // Generate the response
        const response = {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: eventRecord.Item })
        };
        return response;
    } catch (error) {
        console.error('Error inserting data into DynamoDB', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred inserting data into DynamoDB' })
        };
    }
};