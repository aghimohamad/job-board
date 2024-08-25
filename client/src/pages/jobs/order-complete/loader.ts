import { DeferredLoader } from "@/lib/rounterUtil";
import { loadStripe } from "@stripe/stripe-js";

const loader = DeferredLoader(({ request: {url} }) => {
    
    const clientSecret = new URLSearchParams(url).get("payment_intent_client_secret");
    const stripe = loadStripe('pk_test_51OsnGO16zZkKnil69VCOvHrBnxKc4jk0Kkryp67HqfQH37prQ7Q3uhyMufI0joMbKXlUTNAvmMC7IJgRbsUynBAU00f2ViKwmE');


    
    
    return {
        message: stripe.then(stripe => {
            if (stripe == null || clientSecret == null) {
              return "Something went wrong"
            }
      
            return stripe
              .retrievePaymentIntent(clientSecret)
              .then(({ paymentIntent }) => {
                switch (paymentIntent?.status) {
                  case "succeeded":
                    return "Payment succeeded"
                  case "processing":
                    return "Your payment is processing"
                  case "requires_payment_method":
                    return "Your payment was not successful, please try again"
                  default:
                    return "Something went wrong"
                }
              })
          }),
        
    }
});

export default loader;