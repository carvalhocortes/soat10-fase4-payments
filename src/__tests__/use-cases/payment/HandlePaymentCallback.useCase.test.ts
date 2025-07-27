import { HandlePaymentCallbackUseCase } from '@application/use-cases/payment/HandlePaymentCallback.useCase';
import { Payment } from '@core/entities/payment.entity';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

const mockPaymentRepository = {
  findByOrderId: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
};
const mockSnsPublisher = { publish: jest.fn() } as unknown as jest.Mocked<SnsPublisher>;

describe('HandlePaymentCallbackUseCase Test', () => {
  it('should update the payment status and emit an event', async () => {
    const payment = Payment.create({ orderId: 'order-1', status: 'paid' });
    mockPaymentRepository.findByOrderId.mockResolvedValue(payment);
    mockPaymentRepository.update.mockResolvedValue(payment);
    const useCase = new HandlePaymentCallbackUseCase(mockPaymentRepository, mockSnsPublisher);
    const result = await useCase.execute({ paymentId: 'order-1', status: 'paid' });
    expect(result.status).toBe('paid');
    expect(mockPaymentRepository.update).toHaveBeenCalledWith('order-1', expect.any(Payment));
    expect(mockSnsPublisher.publish).toHaveBeenCalled();
  });

  it('should throw an error if payment is not found', async () => {
    mockPaymentRepository.findByOrderId.mockResolvedValue(null);
    const useCase = new HandlePaymentCallbackUseCase(mockPaymentRepository, mockSnsPublisher);
    await expect(useCase.execute({ paymentId: 'order-x', status: 'paid' })).rejects.toThrow('Payment not found');
  });
});
