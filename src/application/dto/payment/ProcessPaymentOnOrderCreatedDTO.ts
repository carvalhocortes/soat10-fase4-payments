export class ProcessPaymentOnOrderCreatedDTO {
  constructor(
    public readonly orderId: string,
    public readonly amount: number,
  ) {}

  static create(data: { payload: { orderId: string; amount: number } }): ProcessPaymentOnOrderCreatedDTO {
    if (!data.payload.orderId) {
      throw new Error('Order ID is required');
    }

    return new ProcessPaymentOnOrderCreatedDTO(data.payload.orderId, data.payload.amount);
  }
}
