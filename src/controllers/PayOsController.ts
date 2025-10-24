import crypto from 'crypto';
import { Request, Response } from 'express';
import { db } from '../config/db';
import { orders } from '../config/schema';
import { eq } from 'drizzle-orm';
import { payos } from '../config/payOs';
import { deleteCartItemsByUserId } from '../services/CartItems.service';

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
// Sử dụng đúng tên biến môi trường cho checksum key (khớp với config/payOs.ts)
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY as string | undefined;

// 1️⃣ API tạo link thanh toán
export const createCheckoutLink = async (req: Request, res: Response) => {
  try {
    const { orderCode, amount, description, returnUrl, cancelUrl } = req.body;

    const body = {
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
    };

    // Ưu tiên dùng SDK để tạo link thanh toán (đã cấu hình ở config/payOs.ts)
    const link = await payos.paymentRequests.create({
      orderCode: Number(body.orderCode),
      amount: Number(body.amount),
      description: String(body.description),
      returnUrl: String(body.returnUrl),
      cancelUrl: String(body.cancelUrl),
    });
    // Chuẩn hóa cấu trúc trả về để frontend dùng ổn định
    res.status(200).json({
      success: true,
      data: {
        checkoutUrl: (link as any)?.checkoutUrl || (link as any)?.data?.checkoutUrl || (link as any)?.data?.checkout_url || (link as any)?.checkout_url,
        raw: link,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Tạo link thất bại' });
  }
};

// 2️⃣ Webhook xác nhận thanh toán
export const payosWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body as any;
    console.log("vdvbb");
    
    // 1) Xác thực chữ ký: ưu tiên SDK nếu có; fallback HMAC khi thiếu SDK/biến môi trường
    let isValid = false;
    try {
      // Nhiều phiên bản SDK hỗ trợ verify trực tiếp dữ liệu webhook
      // nếu không hỗ trợ, lệnh này sẽ ném lỗi và chuyển sang HMAC thủ công
      // @ts-ignore
      if (typeof (payos as any).verifyPaymentWebhookData === 'function') {
        // @ts-ignore
        isValid = (payos as any).verifyPaymentWebhookData(payload) === true;
      }
    } catch {
      isValid = false;
    }

    if (!isValid) {
      const signatureHeader = req.headers['x-payos-signature'] as string | undefined;
      const signatureBody = (payload && payload.signature) as string | undefined;
      const signature = signatureHeader || signatureBody;

      if (!signature) {
        return res.status(400).json({ message: 'Missing signature' });
      }
      if (!PAYOS_CHECKSUM_KEY) {
        return res.status(500).json({ message: 'Missing PAYOS_CHECKSUM_KEY' });
      }

      const hmac = crypto.createHmac('sha256', PAYOS_CHECKSUM_KEY);
      hmac.update(JSON.stringify(payload));
      const expectedSignature = hmac.digest('hex');
      if (signature !== expectedSignature) {
        return res.status(403).json({ message: 'Invalid signature' });
      }
      isValid = true;
    }

    // 2) Xử lý dữ liệu giao dịch
    const data = payload?.data ?? {};
    const status = data?.status ?? payload?.success ? 'PAID' : undefined;
    const orderCode = data?.orderCode ?? data?.order_code ?? payload?.orderCode;
    const amount = data?.amount ?? data?.totalAmount ?? payload?.amount;

    if (!orderCode) {
      return res.status(400).json({ message: 'Missing orderCode in webhook data' });
    }

    if (status === 'PAID' || payload?.success === true || payload?.code === '00') {
      // ✅ Cập nhật đơn hàng theo order_code bằng Drizzle ORM
      const [updated] = await db
        .update(orders)
        .set({ status: true, paid_at: new Date(), total: amount ? Number(amount) : undefined })
        .where(eq(orders.order_code, String(orderCode)))
        .returning();

      // ✅ Nếu có buyer_id thì xóa giỏ hàng của user
      const buyerId = updated?.buyer_id as number | undefined;
      if (buyerId) {
        await deleteCartItemsByUserId(buyerId);
        console.log(`🧹 Đã xóa giỏ hàng của user ${buyerId} sau khi thanh toán`);
      }

      console.log(`💰 Đơn hàng ${orderCode} đã được xác nhận thanh toán`);
    }

    return res.status(200).json({ message: 'Webhook received' });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ message: 'Webhook failed' });
  }
};
