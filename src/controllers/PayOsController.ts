import crypto from 'crypto';
import { Request, Response } from 'express';
import { db } from '../config/db';
import { orders } from '../config/schema';
import { eq } from 'drizzle-orm';
import { payos } from '../config/payOs';
import { deleteCartItemsByUserId } from '../services/CartItems.service';
import { WebhookService } from '../services/Webhook.service';

// Types cho webhook processing
interface WebhookVerificationResult {
  isValid: boolean;
  method?: string;
  error?: string;
}

interface WebhookData {
  orderCode: string | number;
  status: string;
  amount?: number;
  isPaymentSuccess: boolean;
  paymentMethod?: string;
  transactionId?: string;
  rawData: any;
}

interface PaymentProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
// Sử dụng đúng tên biến môi trường cho checksum key (khớp với config/payOs.ts)
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY as string | undefined;

// 0️⃣ API kiểm tra cấu hình PayOS
export const checkPayOSConfig = async (req: Request, res: Response) => {
  try {
    const config = {
      hasClientId: !!PAYOS_CLIENT_ID,
      hasApiKey: !!PAYOS_API_KEY,
      hasChecksumKey: !!PAYOS_CHECKSUM_KEY,
      clientIdLength: PAYOS_CLIENT_ID?.length || 0,
      apiKeyLength: PAYOS_API_KEY?.length || 0,
      checksumKeyLength: PAYOS_CHECKSUM_KEY?.length || 0,
    };

    const isConfigured = config.hasClientId && config.hasApiKey && config.hasChecksumKey;

    res.status(200).json({
      success: true,
      configured: isConfigured,
      config,
      message: isConfigured 
        ? 'PayOS đã được cấu hình đúng' 
        : 'PayOS chưa được cấu hình. Vui lòng kiểm tra file .env'
    });
  } catch (err) {
    console.error('Error checking PayOS config:', err);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi kiểm tra cấu hình PayOS',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// 1️⃣ API tạo link thanh toán
export const createCheckoutLink = async (req: Request, res: Response) => {
  try {
    const { orderCode, amount, description, returnUrl, cancelUrl } = req.body;

    console.log("🔗 Creating checkout link with data:", {
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl
    });

    // Kiểm tra dữ liệu đầu vào
    if (!orderCode || !amount || !description || !returnUrl || !cancelUrl) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: 'Thiếu thông tin bắt buộc',
        required: ['orderCode', 'amount', 'description', 'returnUrl', 'cancelUrl']
      });
    }

    // Kiểm tra độ dài description (PayOS yêu cầu tối đa 25 ký tự)
    if (description.length > 25) {
      console.log("❌ Description too long:", description.length);
      return res.status(400).json({ 
        message: 'Mô tả không được vượt quá 25 ký tự',
        currentLength: description.length,
        maxLength: 25
      });
    }

    // Kiểm tra amount phải là số dương
    if (amount <= 0) {
      console.log("❌ Invalid amount:", amount);
      return res.status(400).json({ 
        message: 'Số tiền phải lớn hơn 0',
        amount: amount
      });
    }

    // Kiểm tra PayOS configuration
    if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY) {
      console.log("❌ Missing PayOS credentials");
      return res.status(500).json({ 
        message: 'PayOS chưa được cấu hình đúng. Vui lòng kiểm tra PAYOS_CLIENT_ID và PAYOS_API_KEY'
      });
    }

    const body = {
      orderCode: Number(orderCode),
      amount: Number(amount),
      description: String(description),
      returnUrl: String(returnUrl),
      cancelUrl: String(cancelUrl),
    };

    console.log("📝 PayOS request body:", body);

    // Tạo link thanh toán với PayOS SDK
    const link = await payos.paymentRequests.create({
      orderCode: body.orderCode,
      amount: body.amount,
      description: body.description,
      returnUrl: body.returnUrl,
      cancelUrl: body.cancelUrl,
    });

    console.log("✅ PayOS response:", JSON.stringify(link, null, 2));

    // Chuẩn hóa cấu trúc trả về để frontend dùng ổn định
    const checkoutUrl = (link as any)?.checkoutUrl || 
                       (link as any)?.data?.checkoutUrl || 
                       (link as any)?.data?.checkout_url || 
                       (link as any)?.checkout_url;

    if (!checkoutUrl) {
      console.log("❌ No checkout URL in PayOS response");
      return res.status(500).json({ 
        message: 'PayOS không trả về checkout URL',
        raw: link
      });
    }

    res.status(200).json({
      success: true,
      data: {
        checkoutUrl,
        raw: link,
      },
    });
  } catch (err) {
    console.error("❌ Error creating checkout link:", err);
    
    // Phân loại lỗi để trả về message phù hợp
    let errorMessage = 'Tạo link thanh toán thất bại';
    
    if (err instanceof Error) {
      if (err.message.includes('PAYOS_CLIENT_ID') || err.message.includes('PAYOS_API_KEY')) {
        errorMessage = 'PayOS chưa được cấu hình đúng. Vui lòng kiểm tra credentials';
      } else if (err.message.includes('orderCode')) {
        errorMessage = 'Mã đơn hàng không hợp lệ';
      } else if (err.message.includes('amount')) {
        errorMessage = 'Số tiền không hợp lệ';
      } else {
        errorMessage = `Lỗi PayOS: ${err.message}`;
      }
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// 2️⃣ Webhook xác nhận thanh toán - Phiên bản cải tiến
export const payosWebhook = async (req: Request, res: Response) => {
  const startTime = Date.now();
  let orderCode: string | number | undefined;
  
  try {
    const payload = req.body as any;
    const requestId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🔔 [${requestId}] PayOS Webhook received (Verified by Middleware):`, {
      timestamp: new Date().toISOString(),
      payload: JSON.stringify(payload, null, 2)
    });
    
    // 1) Dữ liệu đã được verify bởi middleware, chỉ cần extract
    // Sử dụng dữ liệu đã parse từ middleware nếu có
    const webhookData = req.webhookData || extractWebhookData(payload);
    orderCode = webhookData.orderCode;
    
    if (!orderCode) {
      console.log(`❌ [${requestId}] Missing orderCode in webhook data`);
      return res.status(400).json({ 
        message: 'Missing orderCode in webhook data',
        requestId 
      });
    }

    console.log(`📊 [${requestId}] Extracted webhook data:`, {
      orderCode: webhookData.orderCode,
      status: webhookData.status,
      amount: webhookData.amount,
      isPaymentSuccess: webhookData.isPaymentSuccess,
      paymentMethod: webhookData.paymentMethod,
      transactionId: webhookData.transactionId
    });

    // 2) Xử lý business logic dựa trên trạng thái thanh toán
    if (webhookData.isPaymentSuccess) {
      // Convert webhookData to match service interface
      const serviceWebhookData = {
        orderCode: String(webhookData.orderCode),
        status: webhookData.status,
        amount: webhookData.amount,
        isPaymentSuccess: webhookData.isPaymentSuccess,
        paymentMethod: webhookData.paymentMethod,
        transactionId: webhookData.transactionId,
        rawData: webhookData.rawData
      };
      
      const result = await WebhookService.processSuccessfulPayment(serviceWebhookData, requestId);
      
      if (!result.success) {
        console.log(`❌ [${requestId}] Failed to process successful payment:`, result.error);
        return res.status(500).json({ 
          message: 'Failed to process payment',
          error: result.error,
          requestId 
        });
      }
      
      console.log(`✅ [${requestId}] Payment processed successfully:`, result.data);
    } else {
      console.log(`⏳ [${requestId}] Payment not successful or pending. Status: ${webhookData.status}`);
      
      // Convert webhookData to match service interface
      const serviceWebhookData = {
        orderCode: String(webhookData.orderCode),
        status: webhookData.status,
        amount: webhookData.amount,
        isPaymentSuccess: webhookData.isPaymentSuccess,
        paymentMethod: webhookData.paymentMethod,
        transactionId: webhookData.transactionId,
        rawData: webhookData.rawData
      };
      
      // Có thể xử lý các trường hợp thanh toán thất bại hoặc đang chờ
      await WebhookService.processPendingOrFailedPayment(serviceWebhookData, requestId);
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ [${requestId}] Webhook processed successfully in ${processingTime}ms`);
    
    return res.status(200).json({ 
      message: 'Webhook received and processed successfully',
      requestId,
      processingTime: `${processingTime}ms`,
      orderCode: webhookData.orderCode,
      status: webhookData.status
    });
    
  } catch (err) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ [${orderCode || 'unknown'}] Webhook error after ${processingTime}ms:`, {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      orderCode,
      processingTime: `${processingTime}ms`
    });
    
    return res.status(500).json({ 
      message: 'Webhook processing failed',
      error: err instanceof Error ? err.message : 'Unknown error',
      orderCode,
      processingTime: `${processingTime}ms`
    });
  }
};

function extractWebhookData(payload: any): WebhookData {
  const data = payload?.data ?? {};
  
  const orderCode = data?.orderCode ?? 
                   data?.order_code ?? 
                   payload?.orderCode ?? 
                   payload?.order_code ?? 
                   data?.orderId ?? 
                   payload?.orderId;

  const status = data?.status ?? 
                payload?.status ?? 
                data?.paymentStatus ?? 
                payload?.paymentStatus ?? 
                (payload?.success ? 'PAID' : 'PENDING');

  const amount = data?.amount ?? 
                data?.totalAmount ?? 
                data?.total_amount ?? 
                payload?.amount ?? 
                payload?.totalAmount ?? 
                data?.value ?? 
                payload?.value;

  const paymentMethod = data?.paymentMethod ?? 
                      data?.payment_method ?? 
                      payload?.paymentMethod ?? 
                      data?.method ?? 
                      payload?.method;

  const transactionId = data?.transactionId ?? 
                       data?.transaction_id ?? 
                       payload?.transactionId ?? 
                       data?.txnId ?? 
                       payload?.txnId ?? 
                       data?.id ?? 
                       payload?.id;

  const isPaymentSuccess = status === 'PAID' || 
                          status === 'SUCCESS' || 
                          status === 'COMPLETED' ||
                          payload?.success === true || 
                          payload?.code === '00' ||
                          payload?.code === 0 ||
                          data?.status === 'PAID' ||
                          data?.status === 'SUCCESS' ||
                          data?.status === 'COMPLETED';

  return {
    orderCode: String(orderCode),
    status: String(status),
    amount: amount ? Number(amount) : undefined,
    isPaymentSuccess,
    paymentMethod: paymentMethod ? String(paymentMethod) : undefined,
    transactionId: transactionId ? String(transactionId) : undefined,
    rawData: payload
  };
}

// 📊 API xem thống kê order với order_items (chỉ dùng cho development)
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const { orderCode } = req.params;
    
    if (!orderCode) {
      return res.status(400).json({ 
        message: 'Missing orderCode in URL params' 
      });
    }

    console.log("📊 Getting order stats for:", orderCode);

    // Gọi service để lấy thống kê
    const stats = await WebhookService.getPaymentStats(orderCode);

    if (!stats) {
      return res.status(404).json({ 
        message: 'Order not found' 
      });
    }

    return res.status(200).json({
      message: 'Order stats retrieved successfully',
      data: stats
    });

  } catch (err) {
    console.error('❌ Get order stats error:', err);
    return res.status(500).json({ 
      message: 'Get order stats failed',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// 🛒 API test tạo order_items từ cart (chỉ dùng cho development)
export const testCreateOrderItems = async (req: Request, res: Response) => {
  try {
    const { orderId, userId } = req.body;
    
    if (!orderId || !userId) {
      return res.status(400).json({ 
        message: 'Missing orderId or userId in test data' 
      });
    }

    console.log("🛒 Testing create order items from cart:", { orderId, userId });

    // Gọi service để tạo order_items
    await WebhookService.createOrderItemsFromCart(Number(orderId), Number(userId), 'test');

    return res.status(200).json({
      message: 'Order items created successfully from cart',
      data: { orderId, userId }
    });

  } catch (err) {
    console.error('❌ Test create order items error:', err);
    return res.status(500).json({ 
      message: 'Test create order items failed',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

// 🧪 API test webhook (chỉ dùng cho development)
export const testWebhook = async (req: Request, res: Response) => {
  try {
    const { orderCode, status = 'PAID', amount = 100000 } = req.body;
    
    if (!orderCode) {
      return res.status(400).json({ 
        message: 'Missing orderCode in test data' 
      });
    }

    // Tạo mock webhook data
    const mockWebhookData = {
      orderCode: String(orderCode),
      status: String(status),
      amount: Number(amount),
      isPaymentSuccess: status === 'PAID',
      paymentMethod: 'TEST',
      transactionId: `test_${Date.now()}`,
      rawData: {
        data: {
          orderCode: String(orderCode),
          status: String(status),
          amount: Number(amount)
        },
        success: status === 'PAID'
      }
    };

    console.log("🧪 Testing webhook with mock data:", mockWebhookData);

    // Xử lý như webhook thật
    if (mockWebhookData.isPaymentSuccess) {
      const result = await WebhookService.processSuccessfulPayment(mockWebhookData, 'test');
      
      if (!result.success) {
        return res.status(500).json({ 
          message: 'Test webhook failed',
          error: result.error
        });
      }
      
      return res.status(200).json({
        message: 'Test webhook processed successfully',
        data: result.data
      });
    } else {
      await WebhookService.processPendingOrFailedPayment(mockWebhookData, 'test');
      
      return res.status(200).json({
        message: 'Test webhook processed (pending/failed)',
        data: mockWebhookData
      });
    }

  } catch (err) {
    console.error('❌ Test webhook error:', err);
    return res.status(500).json({ 
      message: 'Test webhook failed',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

