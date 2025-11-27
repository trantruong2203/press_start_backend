import express from "express";
import {
  checkPayOSConfig,
  createCheckoutLink,
  getOrderStats,
  payosWebhook,
  testCreateOrderItems,
  testWebhook,
} from "../controllers/PayOsController";
import {
  parseWebhookData,
  verifyPayOSWebhook,
  webhookRateLimit,
} from "../middlewares/webhook.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  orderCodeParamSchema,
  payOsCheckoutSchema,
  payOsTestOrderItemsSchema,
  payOsTestWebhookSchema,
} from "../validation/schemas";

const router = express.Router();

// 🔧 API kiểm tra cấu hình PayOS
router.get('/config', checkPayOSConfig);

// 💳 API tạo link thanh toán
router.post(
  "/checkout-link",
  validateRequest({ body: payOsCheckoutSchema }),
  createCheckoutLink,
);

// 🔔 Webhook endpoint với middleware bảo mật
router.post('/webhook', 
  express.json({ type: '*/*' }), // Parse JSON từ PayOS
  webhookRateLimit,              // Rate limiting
  verifyPayOSWebhook,           // Xác thực signature
  parseWebhookData,             // Parse và validate data
  payosWebhook                  // Xử lý webhook
);

// 🧪 Test webhook endpoint (chỉ dùng cho development)
router.post(
  "/test-webhook",
  validateRequest({ body: payOsTestWebhookSchema }),
  testWebhook,
);

// 🛒 Test tạo order_items từ cart (chỉ dùng cho development)
router.post(
  "/test-create-order-items",
  validateRequest({ body: payOsTestOrderItemsSchema }),
  testCreateOrderItems,
);

// 📊 Xem thống kê order với order_items (chỉ dùng cho development)
router.get(
  "/order-stats/:orderCode",
  validateRequest({ params: orderCodeParamSchema }),
  getOrderStats,
);

export default router;
