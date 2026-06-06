import { Global, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Global()
@Module({
  imports: [],
  controllers: [StripeController],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get('STRIPE_SECRET_KEY') as string, {
          apiVersion: '2026-05-27.dahlia',
        });
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  exports: ['STRIPE_CLIENT'],
})
export class StripeModule {}
