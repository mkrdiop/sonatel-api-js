/**
 * SMS Service for Orange Sonatel API
 * 
 * This module provides methods for sending SMS messages and checking
 * delivery status through the Orange Sonatel API.
 */

class SMSService {
  /**
   * SMS service for interacting with Sonatel SMS APIs
   * @param {Object} apiClient - Sonatel API client instance
   */
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = '/sms/v1';
  }

  /**
   * Send an SMS message
   * @param {Object} options - SMS options
   * @param {string} options.recipient - Recipient phone number
   * @param {string} options.message - SMS content
   * @param {string} [options.sender] - Sender identifier
   * @returns {Promise<Object>} Response data
   */
  async sendSMS(options) {
    if (!options.recipient || !options.message) {
      throw new Error('Recipient and message are required');
    }

    return this.api.post(`${this.endpoint}/messages`, {
      outboundSMSMessageRequest: {
        address: `tel:${options.recipient}`,
        senderAddress: options.sender ? `tel:${options.sender}` : undefined,
        outboundSMSTextMessage: {
          message: options.message
        }
      }
    });
  }

  /**
   * Get SMS delivery status
   * @param {string} messageId - Message ID to check
   * @returns {Promise<Object>} Delivery status
   */
  async getDeliveryStatus(messageId) {
    if (!messageId) {
      throw new Error('Message ID is required');
    }

    return this.api.get(`${this.endpoint}/messages/${messageId}/deliveryInfos`);
  }
  
  /**
   * Get sent SMS history
   * @param {Object} [options] - Query options
   * @param {number} [options.limit=10] - Maximum number of messages to return
   * @param {string} [options.senderAddress] - Filter by sender address
   * @param {string} [options.startDate] - Start date for filtering (ISO format)
   * @param {string} [options.endDate] - End date for filtering (ISO format)
   * @returns {Promise<Object>} SMS history
   */
  async getHistory(options = {}) {
    const params = {};
    
    if (options.limit) params.limit = options.limit;
    if (options.senderAddress) params.senderAddress = options.senderAddress;
    if (options.startDate) params.startDate = options.startDate;
    if (options.endDate) params.endDate = options.endDate;
    
    return this.api.get(`${this.endpoint}/messages`, params);
  }
  
  /**
   * Subscribe to SMS delivery notifications
   * @param {Object} options - Subscription options
   * @param {string} options.notifyUrl - URL to receive notifications
   * @param {string} [options.clientCorrelator] - Client correlator
   * @returns {Promise<Object>} Subscription result
   */
  async subscribeToDeliveryNotifications(options) {
    if (!options.notifyUrl) {
      throw new Error('Notify URL is required');
    }
    
    return this.api.post(`${this.endpoint}/subscriptions`, {
      deliveryReceiptSubscription: {
        callbackReference: {
          notifyURL: options.notifyUrl
        },
        clientCorrelator: options.clientCorrelator || undefined
      }
    });
  }
}

export default SMSService;