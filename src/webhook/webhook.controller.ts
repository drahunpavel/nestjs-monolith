import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  handleStripeWebhook(
    @Body() body: { payload: string },
    @Headers('stripe-signature') sig: string,
  ) {
    return this.webhookService.handleStripeWebhook(body.payload, sig);
  }
}
