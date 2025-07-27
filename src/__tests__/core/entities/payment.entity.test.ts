import { Payment } from '@core/entities/payment.entity';
import { ValidationError } from '@shared/errors/ValidationError';

describe('Payment Entity Test', () => {
  it('should create a valid payment', () => {
    const payment = Payment.create({ orderId: 'order-1', status: 'paid' });
    expect(payment).toBeInstanceOf(Payment);
    expect(payment.orderId).toBe('order-1');
    expect(payment.status).toBe('paid');
    expect(payment.createdAt).toBeInstanceOf(Date);
    expect(payment.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw an error if orderId is empty', () => {
    expect(() => Payment.create({ orderId: '', status: 'paid' })).toThrow(ValidationError);
  });

  it('should throw an error if status is empty', () => {
    expect(() => Payment.create({ orderId: 'order-1', status: '' })).toThrow(ValidationError);
  });

  it('should update the payment', () => {
    const payment = Payment.create({ orderId: 'order-1', status: 'pending' });
    const updated = Payment.update({ orderId: 'order-1', status: 'paid', id: payment.id });
    expect(updated.status).toBe('paid');
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(payment.updatedAt.getTime());
  });

  it('should reconstruct the payment', () => {
    const now = new Date();
    const payment = Payment.reconstruct({
      orderId: 'order-1',
      status: 'paid',
      id: 'id-1',
      createdAt: now,
      updatedAt: now,
    });
    expect(payment.id).toBe('id-10');
    expect(payment.createdAt).toBe(now);
    expect(payment.updatedAt).toBe(now);
  });
});
