# Orange Sonatel API Framework

A modern JavaScript framework for working with Orange Sonatel APIs. This library provides an easy-to-use interface for integrating with SMS, USSD, Payment, and other Orange Sonatel services.

## Features

- 🔑 Automatic authentication and token management
- 📱 SMS messaging service
- 📊 USSD service integration
- 💰 Payment processing support
- 🚀 Simple, promise-based API
- ⚙️ Configurable options (timeouts, base URLs, etc.)
- 🐞 Debug mode for easier development

## Installation

```bash
npm install sonatel-api
```

## Quick Start

```javascript
const Sonatel = require('sonatel-api');

// Initialize the client
const client = Sonatel.createClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
});

// Send an SMS
async function sendMessage() {
  try {
    const result = await client.sms.sendSMS({
      recipient: '221700000000',
      message: 'Hello from Sonatel API!',
    });
    console.log('Message sent:', result);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

sendMessage();
```

## Services

### SMS Service

```javascript
// Send an SMS
const smsResult = await client.sms.sendSMS({
  recipient: '221700000000',
  message: 'Hello from Sonatel API!',
  sender: '12345', // Optional
});

// Check delivery status
const messageId = smsResult.resourceReference.resourceURL.split('/').pop();
const status = await client.sms.getDeliveryStatus(messageId);
```

### USSD Service

```javascript
// Send a USSD notification
const ussdResult = await client.ussd.sendNotification({
  address: '221700000000',
  message: 'Your account balance is 5000 XOF',
  keyword: 'BALANCE', // Optional
});
```

### Payment Service

```javascript
// Request a payment
const paymentResult = await client.payment.requestPayment({
  amount: '1000',
  currency: 'XOF',
  description: 'Payment for services',
  customerMsisdn: '221700000000',
  callbackUrl: 'https://your-website.com/payment-callback', // Optional
});

// Check payment status
const paymentId = paymentResult.resourceReference.resourceURL.split('/').pop();
const paymentStatus = await client.payment.checkPaymentStatus(paymentId);
```

### Custom API Requests

For API endpoints not covered by the service modules:

```javascript
// GET request
const data = await client.api.get('/some/endpoint', {
  param1: 'value1',
  param2: 'value2',
});

// POST request
const result = await client.api.post('/another/endpoint', {
  field1: 'value1',
  field2: 'value2',
});

// PUT request
const updateResult = await client.api.put('/update/endpoint', {
  id: '12345',
  name: 'Updated Name',
});

// DELETE request
const deleteResult = await client.api.delete('/delete/endpoint/12345');
```

## Configuration Options

```javascript
const client = Sonatel.createClient({
  clientId: 'YOUR_CLIENT_ID',         // Required
  clientSecret: 'YOUR_CLIENT_SECRET', // Required
  baseUrl: 'https://api.example.com', // Optional (default: https://api.orange-sonatel.com)
  timeout: 15000,                     // Optional (default: 10000 ms)
  debug: true,                        // Optional (default: false)
});
```

## Error Handling

```javascript
try {
  const result = await client.sms.sendSMS({
    recipient: '221700000000',
    message: 'Hello!',
  });
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error.message);
  // Handle specific error types or status codes as needed
}
```

## Development

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Building from source

```bash
git clone https://github.com/yourusername/sonatel-api.git
cd sonatel-api
npm install
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Orange Sonatel for their API documentation and services : https://developer.orange-sonatel.com/documentation
- The JavaScript community for inspiration and best practices
