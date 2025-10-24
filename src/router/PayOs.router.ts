import express from 'express';
import { createCheckoutLink, payosWebhook } from '../controllers/PayOsController';

const router = express.Router();

router.post('/checkout-link', createCheckoutLink);
router.post('/webhook', express.json({ type: '*/*' }), payosWebhook);

export default router;
