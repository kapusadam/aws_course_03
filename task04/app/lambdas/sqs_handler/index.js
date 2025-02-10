exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    
    event.Records.forEach(record => {
        const body = record.body;
        console.log("Message body: ", body);
        
        if (record.messageAttributes) {
            const attributes = record.messageAttributes;
            console.log("Message Attributes: ", attributes);
          
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Process completed successfully!'
        }),
    };
};