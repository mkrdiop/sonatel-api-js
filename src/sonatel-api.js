class SonatelAPI {
  /**
   * Initialize the Sonatel API client
   * @param {Object} config - Configuration object
   * @param {string} config.clientId - Client ID for authentication
   * @param {string} config.clientSecret - Client Secret for authentication
   * @param {string} [config.baseUrl=https://api.orange-sonatel.com] - Base URL for API requests
   * @param {number} [config.timeout=10000] - Request timeout in milliseconds
   * @param {boolean} [config.debug=false] - Enable debug logging
   */
  constructor(config) {
    if (!config.clientId || !config.clientSecret) {
      throw new Error('Client ID and Client Secret are required');
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = config.baseUrl || 'https://api.orange-sonatel.com';
    this.timeout = config.timeout || 10000;
    this.debug = config.debug || false;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Log debug messages if debug mode is enabled
   * @param {string} message - Message to log
   * @param {any} [data] - Optional data to log
   * @private
   */
  _log(message, data) {
    if (this.debug) {
      console.log(`[SonatelAPI] ${message}`);
      if (data) console.log(data);
    }
  }

  /**
   * Get an authentication token
   * @returns {Promise<string>} Authentication token
   * @private
   */
  async _getToken() {
    // Check if we have a valid token
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      this._log('Using cached token');
      return this.token;
    }

    this._log('Fetching new token');
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      
      // Set token expiry (usually expires_in is in seconds)
      const expiresIn = data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
      
      this._log('Token acquired', { expiresIn });
      return this.token;
    } catch (error) {
      this._log('Token acquisition failed', error);
      throw new Error(`Failed to get authentication token: ${error.message}`);
    }
  }

  /**
   * Make an authenticated request to the Sonatel API
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Request options
   * @param {string} [options.method='GET'] - HTTP method
   * @param {Object} [options.params={}] - URL parameters
   * @param {Object} [options.data=null] - Request body data
   * @param {Object} [options.headers={}] - Additional request headers
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, options = {}) {
    const method = options.method || 'GET';
    const params = options.params || {};
    const data = options.data || null;
    const headers = options.headers || {};
    
    // Get authentication token
    const token = await this._getToken();
    
    // Prepare URL with query parameters
    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url += `?${queryParams.toString()}`;
    }
    
    // Prepare request options
    const requestOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: this.timeout,
    };
    
    // Add request body for non-GET requests
    if (method !== 'GET' && data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    this._log(`Making ${method} request to ${url}`, { params, data });
    
    try {
      const response = await fetch(url, requestOptions);
      
      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      
      this._log('Request successful', responseData);
      return responseData;
    } catch (error) {
      this._log('Request failed', error);
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  /**
   * Shorthand for GET requests
   * @param {string} endpoint - API endpoint
   * @param {Object} [params={}] - URL parameters
   * @param {Object} [options={}] - Additional request options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, params = {}, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      params,
      ...options,
    });
  }

  /**
   * Shorthand for POST requests
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [options={}] - Additional request options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data,
      ...options,
    });
  }

  /**
   * Shorthand for PUT requests
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [options={}] - Additional request options
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data,
      ...options,
    });
  }

  /**
   * Shorthand for DELETE requests
   * @param {string} endpoint - API endpoint
   * @param {Object} [options={}] - Additional request options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

export default SonatelAPI;