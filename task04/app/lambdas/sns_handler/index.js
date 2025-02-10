const { log } = console;

exports.handler = async (event) => {
    log('Received event:', JSON.stringify(event, null, 2));

    // Loop through each record in the event
    event.Records.forEach((record) => {
        // Extract the SNS message from the record
        const { Sns } = record;
        const { Message } = Sns;

        // Log the SNS message content
        log(`SNS Message Content: ${Message}`);
    });

    return { statusCode: 200, body: JSON.stringify('SNS message processed and logged successfully') };
};