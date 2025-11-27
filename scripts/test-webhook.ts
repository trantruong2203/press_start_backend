import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = `http://localhost:${PORT}/payos/webhook`;
const CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

if (!CHECKSUM_KEY) {
  console.error('❌ Missing PAYOS_CHECKSUM_KEY in .env');
  process.exit(1);
}

// Generate random order code to avoid duplicates
const randomOrderCode = Math.floor(Math.random() * 1000000);

const mockPayload = {
  code: "00",
  desc: "success",
  data: {
    orderCode: randomOrderCode,
    amount: 10000,
    description: "VQRIO123",
    accountNumber: "000000",
    reference: "FT2333333333",
    transactionDateTime: "2023-10-05 14:00:00",
    currency: "VND",
    paymentLinkId: "88888888",
    code: "00",
    desc: "success",
    counterAccountBankId: "",
    counterAccountBankName: "",
    counterAccountName: "",
    counterAccountNumber: "",
    virtualAccountName: "",
    virtualAccountNumber: ""
  },
  signature: ""
};

// Calculate signature
const hmac = crypto.createHmac('sha256', CHECKSUM_KEY);
hmac.update(JSON.stringify(mockPayload));
const signature = hmac.digest('hex');

console.log(`🚀 Sending webhook to ${WEBHOOK_URL}`);
console.log(`🔑 Using Checksum Key: ${CHECKSUM_KEY.substring(0, 5)}...`);
console.log(`📦 Order Code: ${randomOrderCode}`);

async function runTest() {
  try {
    // Test Method 2: HMAC Header
    // For header verification, the body should NOT contain the signature if the middleware hashes the whole body
    // OR the middleware should handle it. 
    // Assuming the middleware hashes req.body as-is, we should send the body EXACTLY as we hashed it.
    // We hashed 'mockPayload' (which has signature: ""). 
    // So we should send 'mockPayload' with signature: "" OR remove it?
    // Wait, if we hashed it with signature: "", we must send it with signature: "".
    
    console.log('\n🧪 Testing Method 2: HMAC Header...');
    // We send mockPayload (which has signature: "")
    const res1 = await axios.post(WEBHOOK_URL, mockPayload, {
      headers: {
        'x-payos-signature': signature
      }
    });
    console.log('✅ Method 2 Result:', res1.data);

    // Test Method 3: HMAC Payload
    // For payload verification, the signature must be in the body.
    // But if we add it, the hash changes.
    // The middleware Method 3 likely expects the signature to be IN the body, 
    // but verification logic usually excludes it.
    // Let's look at middleware Method 3:
    // hmac.update(JSON.stringify(payload));
    // It hashes the WHOLE payload. This seems wrong if payload contains the signature.
    // Unless the signature is calculated on the payload WITHOUT the signature.
    // But the middleware doesn't remove it.
    
    // Actually, let's check if we can just test Method 2 for now, as it's the standard.
    // But to make Method 3 work with current middleware, the middleware is likely buggy 
    // OR it expects the signature to be a separate field not involved in the hash?
    // No, it hashes 'payload'.
    
    // Let's just fix Method 2 first.
    // We hashed 'mockPayload' with signature: "".
    // So we send 'mockPayload' with signature: "".
    
  } catch (error: any) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
}

runTest();
