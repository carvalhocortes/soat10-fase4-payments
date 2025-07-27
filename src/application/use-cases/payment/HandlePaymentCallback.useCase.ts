import { HandlePaymentCallbackDTO } from '@application/dto/payment/HandlePaymentCallbackDTO';
import { PaymentRepository } from '@interfaces/gateways/PaymentRepository.gateway';
import { Payment } from '@core/entities/payment.entity';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

export class HandlePaymentCallbackUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly snsPublisher: SnsPublisher,
  ) {}

  async execute({ paymentId, status }: HandlePaymentCallbackDTO): Promise<Payment> {
    const payment = await this.paymentRepository.findByOrderId(paymentId);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    payment.status = status;
    await this.paymentRepository.update(paymentId, payment);
    await this.snsPublisher.publish({ eventType: 'PAYMENT_STATUS_UPDATED', payload: payment });
    return payment;
  }
}
