import express from 'express';
import { createCheckoutLink, payosWebhook, checkPayOSConfig, testWebhook, testCreateOrderItems, getOrderStats } from '../controllers/PayOsController';
import { 
  verifyPayOSWebhook, 
  parseWebhookData, 
  webhookRateLimit 
} from '../middlewares/webhook.middleware';

const router = express.Router();

// 🔧 API kiểm tra cấu hình PayOS
router.get('/config', checkPayOSConfig);

// 💳 API tạo link thanh toán
router.post('/checkout-link', createCheckoutLink);

// 🔔 Webhook endpoint với middleware bảo mật
router.post('/webhook', 
  express.json({ type: '*/*' }), // Parse JSON từ PayOS
  webhookRateLimit,              // Rate limiting
  verifyPayOSWebhook,           // Xác thực signature
  parseWebhookData,             // Parse và validate data
  payosWebhook                  // Xử lý webhook
);

// 🧪 Test webhook endpoint (chỉ dùng cho development)
router.post('/test-webhook', testWebhook);

// 🛒 Test tạo order_items từ cart (chỉ dùng cho development)
router.post('/test-create-order-items', testCreateOrderItems);

// 📊 Xem thống kê order với order_items (chỉ dùng cho development)
router.get('/order-stats/:orderCode', getOrderStats);

export default router;
