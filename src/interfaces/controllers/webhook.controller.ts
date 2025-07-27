import { Request, Response } from 'express';

import { HandlePaymentCallbackUseCase } from '@application/use-cases/payment/HandlePaymentCallback.useCase';
import { HandlePaymentCallbackDTO } from '@application/dto/payment/HandlePaymentCallbackDTO';

export class PaymentWebhookController {
  constructor(private readonly handlePaymentCallback: HandlePaymentCallbackUseCase) {}

  handlePaymentNotification = async (req: Request, res: Response): Promise<void> => {
    const dto = HandlePaymentCallbackDTO.create(req);
    const customer = await this.handlePaymentCallback.execute(dto);
    res.json(customer);
  };
}
