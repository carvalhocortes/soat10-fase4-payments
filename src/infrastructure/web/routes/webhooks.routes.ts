import express from 'express';
import { DynamoPaymentRepository } from '@infrastructure/db/repositories/PaymentRepository.db';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { webhookSchemas } from '@interfaces/validations/webhook.validation';
import { PaymentWebhookController } from '@interfaces/controllers/webhook.controller';
import { HandlePaymentCallbackUseCase } from '@application/use-cases/payment/HandlePaymentCallback.useCase';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

const topicArn = process.env.SNS_PAYMENT_TOPIC_ARN || '';

const router = express.Router();
const paymentRepository = new DynamoPaymentRepository();
const snsPublisher = new SnsPublisher(topicArn);
const whController = new PaymentWebhookController(new HandlePaymentCallbackUseCase(paymentRepository, snsPublisher));

router.post(
  '/payment/:id',
  validateRequest(webhookSchemas.paymentWebhook),
  asyncHandler(whController.handlePaymentNotification),
);

export default router;
