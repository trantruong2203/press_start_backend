import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY as string | undefined;

// 🔐 Middleware xác thực webhook PayOS
export const verifyPayOSWebhook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const signatureHeader = req.headers['x-payos-signature'] as string | undefined;
    const signatureBody = payload?.signature as string | undefined;
    const signature = signatureHeader || signatureBody;

    // Kiểm tra có signature không
    if (!signature) {
      console.log("❌ Missing signature in webhook");
      return res.status(400).json({ 
        message: 'Missing signature',
        code: 'MISSING_SIGNATURE'
      });
    }

    // Kiểm tra có checksum key không
    if (!PAYOS_CHECKSUM_KEY) {
      console.log("❌ Missing PAYOS_CHECKSUM_KEY environment variable");
      return res.status(500).json({ 
        message: 'Missing PAYOS_CHECKSUM_KEY',
        code: 'MISSING_CHECKSUM_KEY'
      });
    }

    // Tạo HMAC signature để so sánh
    const hmac = crypto.createHmac('sha256', PAYOS_CHECKSUM_KEY);
    hmac.update(JSON.stringify(payload));
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      console.log("❌ Invalid signature:", { 
        received: signature, 
        expected: expectedSignature 
      });
      return res.status(403).json({ 
        message: 'Invalid signature',
        code: 'INVALID_SIGNATURE'
      });
    }

    console.log("✅ Webhook signature verified successfully");
    next();
    
  } catch (error) {
    console.error('❌ Webhook verification error:', error);
    return res.status(500).json({ 
      message: 'Webhook verification failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'VERIFICATION_ERROR'
    });
  }
};

// 📊 Middleware parse và validate webhook data
export const parseWebhookData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    
    // Extract dữ liệu cơ bản
    const data = payload?.data ?? {};
    const orderCode = data?.orderCode ?? 
                     data?.order_code ?? 
                     payload?.orderCode ?? 
                     payload?.order_code;
    
    const status = data?.status ?? 
                   payload?.status ?? 
                   (payload?.success ? 'PAID' : 'PENDING');
    
    const amount = data?.amount ?? 
                  data?.totalAmount ?? 
                  payload?.amount ?? 
                  payload?.totalAmount;

    // Validate dữ liệu bắt buộc
    if (!orderCode) {
      return res.status(400).json({ 
        message: 'Missing orderCode in webhook data',
        code: 'MISSING_ORDER_CODE'
      });
    }

    // Attach parsed data vào request
    req.webhookData = {
      orderCode: String(orderCode),
      status: String(status),
      amount: amount ? Number(amount) : undefined,
      isPaymentSuccess: status === 'PAID' || 
                       status === 'SUCCESS' || 
                       status === 'COMPLETED' ||
                       payload?.success === true || 
                       payload?.code === '00' ||
                       payload?.code === 0,
      paymentMethod: data?.paymentMethod ?? payload?.paymentMethod,
      transactionId: data?.transactionId ?? payload?.transactionId,
      rawData: payload
    };

    console.log("📊 Webhook data parsed:", {
      orderCode: req.webhookData.orderCode,
      status: req.webhookData.status,
      isPaymentSuccess: req.webhookData.isPaymentSuccess
    });

    next();
    
  } catch (error) {
    console.error('❌ Webhook data parsing error:', error);
    return res.status(500).json({ 
      message: 'Failed to parse webhook data',
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'PARSE_ERROR'
    });
  }
};

// 🛡️ Middleware rate limiting cho webhook
export const webhookRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Simple in-memory rate limiting (có thể thay bằng Redis cho production)
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10; // Max 10 requests per minute per IP

  // Clean up old entries
  if (!global.webhookRateLimit) {
    global.webhookRateLimit = new Map();
  }

  const rateLimitMap = global.webhookRateLimit as Map<string, { count: number; resetTime: number }>;
  
  // Clean expired entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }

  const clientData = rateLimitMap.get(clientIp);
  
  if (!clientData) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
    next();
  } else if (now > clientData.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
    next();
  } else if (clientData.count >= maxRequests) {
    console.log(`🚫 Rate limit exceeded for IP: ${clientIp}`);
    return res.status(429).json({ 
      message: 'Too many webhook requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  } else {
    clientData.count++;
    next();
  }
};

// Extend Request interface để include webhookData
declare global {
  namespace Express {
    interface Request {
      webhookData?: {
        orderCode: string;
        status: string;
        amount?: number;
        isPaymentSuccess: boolean;
        paymentMethod?: string;
        transactionId?: string;
        rawData: any;
      };
    }
  }
}
