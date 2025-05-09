/**
 * Payment Service for Orange Sonatel API
 * 
 * This module provides methods for processing payments and checking
 * payment status through the Orange Sonatel API.
 */

class PaymentService {
  /**
   * Payment service for interacting with Sonatel Payment APIs
   * @param {Object} apiClient - Sonatel API client instance
   */
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = '/payment/v1';
  }

  /**
   * Request a payment
   * @param {Object} options - Payment options
   * @param {string} options.amount - Payment amount
   * @param {string} options.currency - Currency code (e.g., 'XOF')
   * @param {string} options.description - Payment description
   * @param {string} options.customerMsisdn - Customer phone number
   * @param {string} [options.callbackUrl] - Callback URL for notifications
   * @param {string} [options.merchantId] - Merchant ID
   * @param {string} [options.orderId] - Order ID
   * @returns {Promise<Object>} Response data
   */
  async requestPayment(options) {
    if (!options.amount || !options.currency || !options.customerMsisdn) {
      throw new Error('Amount, currency, and customer MSISDN are required');
    }

    return this.api.post(`${this.endpoint}/payments`, {
      requestPayment: {
        amount: options.amount,
        currency: options.currency,
        description: options.description || '',
        customerMsisdn: options.customerMsisdn,
        callbackUrl: options.callbackUrl,
        merchantId: options.merchantId,
        orderId: options.orderId
      }
    });
  }

  /**
   * Check payment status
   * @param {string} paymentId - Payment ID to check
   * @returns {Promise<Object>} Payment status
   */
  async checkPaymentStatus(paymentId) {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    return this.api.get(`${this.endpoint}/payments/${paymentId}`);
  }
  
  /**
   * Refund a payment
   * @param {Object} options - Refund options
   * @param {string} options.paymentId - Payment ID to refund
   * @param {string} options.amount - Refund amount
   * @param {string} [options.reason] - Refund reason
   * @returns {Promise<Object>} Refund result
   */
  async refundPayment(options) {
    if (!options.paymentId || !options.amount) {
      throw new Error('Payment ID and amount are required');
    }
    
    return this.api.post(`${this.endpoint}/payments/${options.paymentId}/refund`, {
      refundPayment: {
        amount: options.amount,
        reason: options.reason || 'Customer request'
      }
    });
  }
  
  /**
   * Get transaction history
   * @param {Object} [options] - Query options
   * @param {number} [options.limit=10] - Maximum number of transactions to return
   * @param {string} [options.offset] - Offset for pagination
   * @param {string} [options.startDate] - Start date for filtering (ISO format)
   * @param {string} [options.endDate] - End date for filtering (ISO format)
   * @param {string} [options.status] - Transaction status filter
   * @returns {Promise<Object>} Transaction history
   */
  async getTransactionHistory(options = {}) {
    const params = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;
    if (options.status) params.status = options.status;
    
    return this.api.get(`${this.endpoint}/transactions`, params);
  }
  
  /**
   * Get account balance
   * @returns {Promise<Object>} Account balance
   */
  async getAccountBalance() {
    return this.api.get(`${this.endpoint}/account/balance`);
  }
  
  /**
   * Subscribe to payment notifications
   * @param {Object} options - Subscription options
   * @param {string} options.notifyUrl - URL to receive notifications
   * @param {string} [options.eventType] - Event type to subscribe to (default: all)
   * @returns {Promise<Object>} Subscription result
   */
  async subscribeToNotifications(options) {
    if (!options.notifyUrl) {
      throw new Error('Notify URL is required');
    }
    
    return this.api.post(`${this.endpoint}/subscriptions`, {
      paymentNotificationSubscription: {
        callbackReference: {
          notifyURL: options.notifyUrl
        },
        eventType: options.eventType || 'all'
      }
    });
  }
}

export default PaymentService;