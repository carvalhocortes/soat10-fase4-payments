import { PaymentRepository } from '@interfaces/gateways/PaymentRepository.gateway';
import { Payment, PaymentProps } from '@core/entities/payment.entity';
import { PaymentModel } from '@infrastructure/db/models/payment.model';

export class DynamoPaymentRepository implements PaymentRepository {
  async save(payment: Payment): Promise<Payment> {
    const newPayment = new PaymentModel(payment);
    await newPayment.save();
    return Payment.reconstruct(this.toPaymentProps(newPayment));
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const payments = await PaymentModel.query('paymentId').eq(orderId).using('paymentId-index').exec();
    if (payments.count === 0) {
      return null;
    }
    return Payment.reconstruct(this.toPaymentProps(payments[0]));
  }

  async update(id: string, payment: Payment): Promise<Payment> {
    const updatedPayment = new PaymentModel(payment);
    await updatedPayment.save();
    return Payment.reconstruct(this.toPaymentProps(updatedPayment));
  }

  private toPaymentProps(document: PaymentProps): PaymentProps {
    return {
      id: document.id,
      orderId: document.orderId,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
