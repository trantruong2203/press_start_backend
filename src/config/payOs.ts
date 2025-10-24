import { PayOS } from '@payos/node';

export const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export type CreatePaymentLinkParams = {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
};

export async function createPaymentLink(params: CreatePaymentLinkParams) {
  const link = await payos.paymentRequests.create({
    orderCode: params.orderCode,
    amount: params.amount,
    description: params.description,
    returnUrl: params.returnUrl,
    cancelUrl: params.cancelUrl,
  });
  return link;
}

