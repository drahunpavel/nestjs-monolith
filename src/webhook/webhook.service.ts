import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderService } from 'src/order/order.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe.Stripe,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {}

  async handleStripeWebhook(payload: string, sig: string) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    const event = this.stripe.webhooks.constructEvent(
      payload,
      sig,
      endpointSecret,
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        await this.orderService.updatePaymentStatus(paymentIntentId, true);
        break;
      case 'payment_intent.payment_failed':
        console.log('payment intent failed');
        break;
      default:
    }

    return { received: true };
  }
}
