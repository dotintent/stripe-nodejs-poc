const stripe = require('stripe')('REPLACE_WITH_YOUR_TOKEN');

// helpers
const createUser = async () => {
  try {
    const customer = await stripe.customers.create({
      email: 'jdoe@example.com',
    });
    console.log(customer);
    return customer;
  } catch (error) {
    console.error(error);
  }
};

const addCreditCard = async (user, card) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card,
    });
    console.log(paymentMethod);
    const attached = await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: user.id,
    });
    console.log(attached);
    return paymentMethod;
  } catch (error) {
    console.error(error);
  }
};

const processPayment = async (user, card) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1250,
      customer: user.id,
      currency: 'usd',
      payment_method: card.id,
    });
    console.log(paymentIntent);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  try {
    console.log('Stripe demo');
    // create user
    const user = await createUser();
    // add credit card to user
    const creditCard = await addCreditCard(user, {
      number: '4242424242424242',
      exp_month: 9,
      exp_year: 2021,
      cvc: '314',
    });
    // create payment intent for user
    await processPayment(user, creditCard);
  } catch (e) {
    console.error(e);
  }
})();
