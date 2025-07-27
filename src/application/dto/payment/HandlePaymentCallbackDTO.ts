export class HandlePaymentCallbackDTO {
  constructor(
    public readonly paymentId: string,
    public readonly status: string,
  ) {}

  static create(data: { params: { id?: string }; body: { status: string } }): HandlePaymentCallbackDTO {
    if (!data.params.id) {
      throw new Error('Payment ID is required');
    }

    return new HandlePaymentCallbackDTO(data.params.id, data.body.status);
  }
}
