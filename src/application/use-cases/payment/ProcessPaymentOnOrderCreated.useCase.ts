import { PaymentRepository } from '@interfaces/gateways/PaymentRepository.gateway';
import { Payment } from '@core/entities/payment.entity';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';
import { ProcessPaymentOnOrderCreatedDTO } from '@application/dto/payment/ProcessPaymentOnOrderCreatedDTO';

export class ProcessPaymentOnOrderCreatedUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly snsPublisher: SnsPublisher,
  ) {}

  async execute({ orderId, amount }: ProcessPaymentOnOrderCreatedDTO): Promise<Payment> {
    const payment = Payment.create({
      orderId,
      status: 'PROCESSING',
    });
    await this.paymentRepository.save(payment);

    await this.snsPublisher.publish({
      eventType: 'PAYMENT_STARTED',
      payload: {
        orderId,
        amount,
        status: payment.status,
      },
    });
    return payment;
  }
}
