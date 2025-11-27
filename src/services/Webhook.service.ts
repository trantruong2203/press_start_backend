import { db } from '../config/db';
import { orders, orderItems, cartItems, sellers } from '../config/schema';
import { eq, and } from 'drizzle-orm';
import { deleteCartItemsByUserId } from './CartItems.service';

// Types cho webhook service
export interface WebhookData {
  orderCode: string;
  status: string;
  amount?: number;
  isPaymentSuccess: boolean;
  paymentMethod?: string;
  transactionId?: string;
  rawData: any;
}

export interface PaymentProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface OrderUpdateResult {
  success: boolean;
  order?: any;
  error?: string;
  warning?: string;
}

// 🏪 Service xử lý webhook PayOS
export class WebhookService {
  
  // 💰 Xử lý thanh toán thành công
  static async processSuccessfulPayment(
    webhookData: WebhookData, 
    requestId: string
  ): Promise<PaymentProcessingResult> {
    try {
      console.log(`💰 [${requestId}] Processing successful payment for order: ${webhookData.orderCode}`);

      // 1. Cập nhật đơn hàng
      const orderResult = await this.updateOrderStatus(
        webhookData.orderCode, 
        true, 
        webhookData.amount,
        requestId
      );

      if (!orderResult.success) {
        return {
          success: false,
          error: orderResult.error
        };
      }

      // 2. Tạo order_items từ cart_items trước khi xóa giỏ hàng
      // Skip if order doesn't exist (test webhook case)
      if (orderResult.order?.buyer_id) {
        await this.createOrderItemsFromCart(orderResult.order.id, orderResult.order.buyer_id, requestId);
        await this.clearUserCart(orderResult.order.buyer_id, requestId);
      } else if (orderResult.warning) {
        console.log(`⚠️ [${requestId}] Skipping cart processing: ${orderResult.warning}`);
      }

      // 3. Có thể thêm các xử lý khác
      await this.handlePostPaymentActions(webhookData, orderResult.order, requestId);

      return {
        success: true,
        data: {
          orderCode: webhookData.orderCode,
          buyerId: orderResult.order?.buyer_id,
          amount: webhookData.amount,
          paymentMethod: webhookData.paymentMethod,
          transactionId: webhookData.transactionId,
          paidAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error(`❌ [${requestId}] Error processing successful payment:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ⏳ Xử lý thanh toán đang chờ hoặc thất bại
  static async processPendingOrFailedPayment(
    webhookData: WebhookData, 
    requestId: string
  ): Promise<void> {
    try {
      console.log(`⏳ [${requestId}] Processing pending/failed payment for order: ${webhookData.orderCode}`);

      await this.logPaymentStatus(webhookData, requestId);

    } catch (error) {
      console.error(`❌ [${requestId}] Error processing pending/failed payment:`, error);
    }
  }

  // 📝 Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(
    orderCode: string, 
    isPaid: boolean, 
    amount?: number,
    requestId?: string
  ): Promise<OrderUpdateResult> {
    try {
      console.log(`📝 [${requestId || 'unknown'}] Updating order status: ${orderCode}`);

      const updateData: any = {
        status: isPaid,
        updated_at: new Date()
      };

      if (isPaid) {
        updateData.paid_at = new Date();
        if (amount) {
          updateData.total = Number(amount);
        }
      }

      const [updatedOrder] = await db
        .update(orders)
        .set(updateData)
        .where(eq(orders.order_code, orderCode))
        .returning();

      if (!updatedOrder) {
        console.log(`⚠️ [${requestId || 'unknown'}] Order not found with order_code: ${orderCode} (might be a test webhook)`);
        return {
          success: true,
          order: null,
          warning: `Order not found with order_code: ${orderCode}`
        };
      }

      console.log(`✅ [${requestId || 'unknown'}] Order ${orderCode} updated successfully`);
      
      return {
        success: true,
        order: updatedOrder
      };

    } catch (error) {
      console.error(`❌ [${requestId || 'unknown'}] Error updating order status:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 🧹 Xóa giỏ hàng của user
  static async clearUserCart(userId: number, requestId?: string): Promise<void> {
    try {
      await deleteCartItemsByUserId(userId);
      console.log(`🧹 [${requestId || 'unknown'}] Cart cleared for user ${userId}`);
    } catch (error) {
      console.log(`⚠️ [${requestId || 'unknown'}] Failed to clear cart for user ${userId}:`, error);
    }
  }

  // 📊 Log trạng thái thanh toán
  static async logPaymentStatus(webhookData: WebhookData, requestId?: string): Promise<void> {
    try {
      console.log(`📝 [${requestId || 'unknown'}] Payment status logged:`, {
        orderCode: webhookData.orderCode,
        status: webhookData.status,
        amount: webhookData.amount,
        paymentMethod: webhookData.paymentMethod,
        transactionId: webhookData.transactionId,
        timestamp: new Date().toISOString()
      });

      // Có thể lưu vào database hoặc gửi đến logging service
      // await this.savePaymentLog(webhookData);

    } catch (error) {
      console.error(`❌ [${requestId || 'unknown'}] Error logging payment status:`, error);
    }
  }

  // 🎯 Xử lý các hành động sau thanh toán
  static async handlePostPaymentActions(
    webhookData: WebhookData, 
    order: any, 
    requestId?: string
  ): Promise<void> {
    try {
      console.log(`🎯 [${requestId || 'unknown'}] Handling post-payment actions for order: ${webhookData.orderCode}`);

      // Có thể thêm các xử lý như:
      // - Gửi email xác nhận
      // - Cập nhật inventory
      // - Tạo invoice
      // - Gửi notification
      // - Cập nhật analytics
      // - Trigger các workflow khác

      // Ví dụ: Gửi email xác nhận (mock)
      // await this.sendConfirmationEmail(order, webhookData);

      // Ví dụ: Cập nhật inventory (mock)
      // await this.updateInventory(order);

      console.log(`✅ [${requestId || 'unknown'}] Post-payment actions completed`);

    } catch (error) {
      console.error(`❌ [${requestId || 'unknown'}] Error in post-payment actions:`, error);
      // Không throw error vì đây là các xử lý phụ
    }
  }

  // 🔍 Kiểm tra đơn hàng có tồn tại không
  static async checkOrderExists(orderCode: string): Promise<boolean> {
    try {
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.order_code, orderCode))
        .limit(1);

      return order.length > 0;
    } catch (error) {
      console.error('Error checking order existence:', error);
      return false;
    }
  }

  // 📈 Lấy thống kê thanh toán
  static async getPaymentStats(orderCode: string): Promise<any> {
    try {
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.order_code, orderCode))
        .limit(1);

      if (order.length === 0) {
        return null;
      }

      const orderItemsData = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.order_id, order[0].id));

      return {
        order: order[0],
        items: orderItemsData,
        totalItems: orderItemsData.length,
        totalAmount: order[0].total
      };

    } catch (error) {
      console.error('Error getting payment stats:', error);
      return null;
    }
  }

  // 🛒 Tạo order_items từ cart_items
  static async createOrderItemsFromCart(
    orderId: number, 
    userId: number, 
    requestId?: string
  ): Promise<void> {
    try {
      console.log(`🛒 [${requestId || 'unknown'}] Creating order items from cart for user ${userId}`);

      // 1. Lấy tất cả cart_items của user
      const userCartItems = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.user_id, userId));

      if (userCartItems.length === 0) {
        console.log(`⚠️ [${requestId || 'unknown'}] No cart items found for user ${userId}`);
        return;
      }

      console.log(`📦 [${requestId || 'unknown'}] Found ${userCartItems.length} cart items`);

      // 2. Tạo order_items cho mỗi cart_item
      for (const cartItem of userCartItems) {
        try {
          // Lấy giá sản phẩm từ sellers table
          const sellerInfo = await db
            .select()
            .from(sellers)
            .where(
              and(
                eq(sellers.product_id, cartItem.product_id),
                eq(sellers.status, true) // Chỉ lấy seller đang active
              )
            )
            .limit(1);

          if (sellerInfo.length === 0) {
            console.log(`⚠️ [${requestId || 'unknown'}] No seller found for product ${cartItem.product_id}`);
            continue;
          }

          const seller = sellerInfo[0];
          const finalPrice = seller.price_original - (seller.discount || 0);

          // Tạo order_item
          await db.insert(orderItems).values({
            order_id: orderId,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: finalPrice,
            created_at: new Date()
          });

          console.log(`✅ [${requestId || 'unknown'}] Created order item: product ${cartItem.product_id}, quantity ${cartItem.quantity}, price ${finalPrice}`);

        } catch (itemError) {
          console.error(`❌ [${requestId || 'unknown'}] Error creating order item for product ${cartItem.product_id}:`, itemError);
          // Tiếp tục với item tiếp theo thay vì dừng toàn bộ process
        }
      }

      console.log(`✅ [${requestId || 'unknown'}] Order items creation completed`);

    } catch (error) {
      console.error(`❌ [${requestId || 'unknown'}] Error creating order items from cart:`, error);
      // Không throw error vì đây không phải là lỗi nghiêm trọng
    }
  }
}
