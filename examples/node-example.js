/**
 * Orange Sonatel API Framework - Node.js Example
 * 
 * This example demonstrates how to use the Sonatel API Framework
 * in a Node.js environment for various services.
 * 
 * To run this example:
 * 1. Set up your credentials in environment variables or replace directly in the code
 * 2. Run with: node node-example.js [service-name]
 *    Where service-name can be: sms, ussd, payment, or all (default)
 */

const Sonatel = require('../dist'); // Use the built package
// For local development without building: const Sonatel = require('../src');

// Set up client credentials - use environment variables for security
const clientId = process.env.SONATEL_CLIENT_ID || 'YOUR_CLIENT_ID';
const clientSecret = process.env.SONATEL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';

// Initialize the client
const client = Sonatel.createClient({
  clientId,
  clientSecret,
  debug: true, // Enable debug logging
});

// Helper to display formatted responses
function displayResponse(title, response) {
  console.log('\n========================================');
  console.log(`${title}:`);
  console.log('========================================');
  console.log(JSON.stringify(response, null, 2));
  console.log('========================================\n');
}

// SMS service example
async function runSMSExample() {
  console.log('Running SMS service example...');
  
  try {
    // Send an SMS
    console.log('Sending SMS...');
    const smsResponse = await client.sms.sendSMS({
      recipient: '221700000000', // Replace with a valid number
      message: 'Hello from Sonatel API Framework!',
      sender: '12345', // Optional sender ID
    });
    
    displayResponse('SMS Sent Response', smsResponse);
    
    // Extract message ID from response
    const messageId = smsResponse.resourceReference.resourceURL.split('/').pop();
    console.log(`Message ID: ${messageId}`);
    
    // Check SMS delivery status (may need to wait a moment)
    console.log('Checking delivery status...');
    console.log('(Waiting 5 seconds for message processing)');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await client.sms.getDeliveryStatus(messageId);
    displayResponse('SMS Status Response', statusResponse);
    
    return true;
  } catch (error) {
    console.error('SMS Example Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// USSD service example
async function runUSSDExample() {
  console.log('Running USSD service example...');
  
  try {
    // Send a USSD notification
    console.log('Sending USSD notification...');
    const ussdResponse = await client.ussd.sendNotification({
      address: '221700000000', // Replace with a valid number
      message: 'Your account balance is 5000 XOF',
      keyword: 'BALANCE', // Optional service keyword
    });
    
    displayResponse('USSD Response', ussdResponse);
    return true;
  } catch (error) {
    console.error('USSD Example Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Payment service example
async function runPaymentExample() {
  console.log('Running Payment service example...');
  
  try {
    // Request a payment
    console.log('Requesting payment...');
    const paymentResponse = await client.payment.requestPayment({
      amount: '1000',
      currency: 'XOF',
      description: 'Payment for services',
      customerMsisdn: '221700000000', // Replace with a valid number
      callbackUrl: 'https://your-website.com/payment-callback',
    });
    
    displayResponse('Payment Request Response', paymentResponse);
    
    // Extract payment ID from response
    const paymentId = paymentResponse.resourceReference.resourceURL.split('/').pop();
    console.log(`Payment ID: ${paymentId}`);
    
    // Check payment status (may need to wait a moment)
    console.log('Checking payment status...');
    console.log('(Waiting 5 seconds for payment processing)');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await client.payment.checkPaymentStatus(paymentId);
    displayResponse('Payment Status Response', statusResponse);
    
    return true;
  } catch (error) {
    console.error('Payment Example Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Custom API request example
async function runCustomAPIExample() {
  console.log('Running Custom API request example...');
  
  try {
    // Example GET request
    console.log('Making custom GET request...');
    const getData = await client.api.get('/user/v1/profile', {
      msisdn: '221700000000', // Replace with a valid number
    });
    
    displayResponse('Custom GET Response', getData);
    
    // Example POST request
    console.log('Making custom POST request...');
    const postData = await client.api.post('/user/v1/update', {
      msisdn: '221700000000', // Replace with a valid number
      name: 'John Doe',
    });
    
    displayResponse('Custom POST Response', postData);
    
    return true;
  } catch (error) {
    console.error('Custom API Example Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Main function to run examples
async function main() {
  console.log('Sonatel API Framework - Node.js Example');
  console.log('---------------------------------------');
  
  // Check if we have credentials
  if (clientId === 'YOUR_CLIENT_ID' || clientSecret === 'YOUR_CLIENT_SECRET') {
    console.log('\n⚠️  WARNING: You need to set your client credentials!');
    console.log('Set SONATEL_CLIENT_ID and SONATEL_CLIENT_SECRET environment variables');
    console.log('or replace the placeholder values in the code.\n');
  }
  
  // Parse command line arguments
  const service = process.argv[2] || 'all';
  
  try {
    switch (service.toLowerCase()) {
      case 'sms':
        await runSMSExample();
        break;
      
      case 'ussd':
        await runUSSDExample();
        break;
      
      case 'payment':
        await runPaymentExample();
        break;
      
      case 'custom':
        await runCustomAPIExample();
        break;
      
      case 'all':
      default:
        console.log('Running all examples sequentially...\n');
        
        const smsResult = await runSMSExample();
        console.log(`\nSMS example ${smsResult ? 'succeeded' : 'failed'}\n`);
        
        const ussdResult = await runUSSDExample();
        console.log(`\nUSSD example ${ussdResult ? 'succeeded' : 'failed'}\n`);
        
        const paymentResult = await runPaymentExample();
        console.log(`\nPayment example ${paymentResult ? 'succeeded' : 'failed'}\n`);
        
        const customResult = await runCustomAPIExample();
        console.log(`\nCustom API example ${customResult ? 'succeeded' : 'failed'}\n`);
        
        console.log('All examples completed!');
        break;
    }
  } catch (error) {
    console.error('Unhandled error:', error);
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});