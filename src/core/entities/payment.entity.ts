import { ValidationError } from '@shared/errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentProps {
  id?: string;
  orderId: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment {
  public readonly id?: string;
  public readonly orderId: string;
  public status: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: PaymentProps) {
    this.id = props.id || uuidv4();
    this.orderId = props.orderId;
    this.status = props.status;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<PaymentProps, 'createdAt' | 'updatedAt'>): Payment {
    this.validate(props);
    return new Payment({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static update(props: Omit<PaymentProps, 'updatedAt'>): Payment {
    this.validate(props);
    return new Payment({
      ...props,
      updatedAt: new Date(),
    });
  }

  public static reconstruct(props: PaymentProps): Payment {
    return new Payment(props);
  }

  public toJSON(): PaymentProps {
    return {
      id: this.id,
      orderId: this.orderId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static validate(props: Omit<PaymentProps, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!props.orderId) {
      throw new ValidationError('orderId is required');
    }
    if (!props.status) {
      throw new ValidationError('Status is required');
    }
  }
}
