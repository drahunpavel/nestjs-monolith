import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number, currency: string }) {
    return this.stripeService.createPaymentIntent(body.amount, body.currency);
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') paymentIntentId: string) {
    return this.stripeService.retrievePaymentIntent(paymentIntentId);
  }

  // @Get('retrieve-payment-intent')
  // async retrievePaymentIntent(@Query('paymentIntentId') paymentIntentId: string) {
  //   return this.stripeService.retrievePaymentIntent(paymentIntentId);
  // }
}
