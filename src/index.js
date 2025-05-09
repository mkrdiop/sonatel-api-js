import SonatelAPI from './sonatel-api';
import SMSService from './services/sms';
import USSDService from './services/ussd';
import PaymentService from './services/payment';

const Sonatel = {
  createClient(config) {
    const apiClient = new SonatelAPI(config);
    
    return {
      api: apiClient,
      sms: new SMSService(apiClient),
      ussd: new USSDService(apiClient),
      payment: new PaymentService(apiClient)
    };
  }
};

export default Sonatel;