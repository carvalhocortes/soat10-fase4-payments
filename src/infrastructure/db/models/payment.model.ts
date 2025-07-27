import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

export interface PaymentProps extends Item {
  id?: string;
  orderId: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, required: true },
  orderId: {
    type: String,
    required: true,
    index: {
      name: 'orderId-index',
      type: 'global',
      project: true,
    },
  },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const PaymentModel = dynamoose.model<PaymentProps>('Payment', paymentSchema, {
  tableName: 'payments',
});
