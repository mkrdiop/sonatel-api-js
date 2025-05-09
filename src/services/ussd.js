/**
 * USSD Service for Orange Sonatel API
 * 
 * This module provides methods for sending USSD notifications and
 * handling USSD sessions through the Orange Sonatel API.
 */

class USSDService {
  /**
   * USSD service for interacting with Sonatel USSD APIs
   * @param {Object} apiClient - Sonatel API client instance
   */
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = '/ussd/v1';
  }

  /**
   * Send a USSD notification
   * @param {Object} options - USSD options
   * @param {string} options.address - User's MSISDN
   * @param {string} options.message - USSD message
   * @param {string} [options.keyword] - Service keyword
   * @returns {Promise<Object>} Response data
   */
  async sendNotification(options) {
    if (!options.address || !options.message) {
      throw new Error('Address and message are required');
    }

    return this.api.post(`${this.endpoint}/outbound`, {
      outboundUSSDMessageRequest: {
        address: `tel:${options.address}`,
        keyword: options.keyword || '',
        outboundUSSDMessage: {
          message: options.message
        }
      }
    });
  }
  
  /**
   * Handle USSD inbound message
   * @param {Object} options - USSD options
   * @param {string} options.address - User's MSISDN
   * @param {string} options.message - USSD message from user
   * @param {string} options.sessionId - USSD session ID
   * @param {boolean} [options.endSession=false] - Whether to end the session
   * @returns {Promise<Object>} Response data
   */
  async handleInbound(options) {
    if (!options.address || !options.message || !options.sessionId) {
      throw new Error('Address, message, and sessionId are required');
    }
    
    return this.api.post(`${this.endpoint}/inbound/${options.sessionId}`, {
      inboundUSSDMessageRequest: {
        address: `tel:${options.address}`,
        inboundUSSDMessage: {
          message: options.message
        },
        ussdSessionTermination: options.endSession || false
      }
    });
  }
  
  /**
   * Subscribe to USSD notifications
   * @param {Object} options - Subscription options
   * @param {string} options.notifyUrl - URL to receive notifications
   * @param {string} options.keyword - Service keyword
   * @param {string} [options.clientCorrelator] - Client correlator
   * @returns {Promise<Object>} Subscription result
   */
  async subscribeToNotifications(options) {
    if (!options.notifyUrl || !options.keyword) {
      throw new Error('Notify URL and keyword are required');
    }
    
    return this.api.post(`${this.endpoint}/subscriptions`, {
      ussdNotificationSubscription: {
        callbackReference: {
          notifyURL: options.notifyUrl
        },
        keyword: options.keyword,
        clientCorrelator: options.clientCorrelator || undefined
      }
    });
  }
  
  /**
   * Cancel a USSD session
   * @param {string} sessionId - USSD session ID
   * @returns {Promise<Object>} Response data
   */
  async cancelSession(sessionId) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    
    return this.api.delete(`${this.endpoint}/sessions/${sessionId}`);
  }
}

export default USSDService;