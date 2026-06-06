import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    constructor(
        @Inject('STRIPE_CLIENT') private readonly stripe: Stripe.Stripe,
    ) {}

    async createPaymentIntent(amount: number, currency: string) {

        if(!amount || !currency) {
            throw new BadRequestException('Amount and currency are required');
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
        });

        return paymentIntent;
    }

    async retrievePaymentIntent(paymentIntentId: string) {

        if(!paymentIntentId) {
            throw new BadRequestException('Payment intent ID is required');
        }

        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    }
}
