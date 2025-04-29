import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post('http://localhost:8000/api/create-payment-intent', {
      amount: 1000 // en centimes, donc 10€ ici
    });

    const clientSecret = data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
    });

    if (result.paymentIntent?.status === 'succeeded') {
      setSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Payer</button>
      {success && <p>Paiement réussi !</p>}
    </form>
  );
};

export default CheckoutForm;
