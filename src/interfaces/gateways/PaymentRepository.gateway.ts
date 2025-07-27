import { Payment } from '@core/entities/payment.entity';

export interface PaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  update(id: string, payment: Payment): Promise<Payment>;
}
