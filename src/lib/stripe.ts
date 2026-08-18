import "server-only";
import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Stripe does not settle in MZN, so international card payments are charged
// in USD using the exchange rate the admin maintains in Site Settings.
export const STRIPE_CURRENCY = "usd";
