# PayOS Setup Guide

## 🔧 Cấu hình PayOS

Để sử dụng PayOS, bạn cần tạo file `.env` trong thư mục `backend/` với các biến môi trường sau:

```env
# PayOS Configuration
PAYOS_CLIENT_ID=your_payos_client_id_here
PAYOS_API_KEY=your_payos_api_key_here
PAYOS_CHECKSUM_KEY=your_payos_checksum_key_here
```ybackend đa

## 📋 Cách lấy PayOS Credentials

1. Đăng ký tài khoản tại [PayOS Dashboard](https://my.payos.vn/)
2. Tạo ứng dụng mới
3. Lấy các thông tin:
   - **Client ID**: ID ứng dụng
   - **API Key**: Khóa API
   - **Checksum Key**: Khóa xác thực webhook

## 🚀 Test với PayOS Sandbox

Để test, bạn có thể sử dụng PayOS Sandbox:

```env
PAYOS_CLIENT_ID=sandbox_client_id
PAYOS_API_KEY=sandbox_api_key
PAYOS_CHECKSUM_KEY=sandbox_checksum_key
```

## ⚠️ Lưu ý quan trọng

- Không commit file `.env` vào git
- Sử dụng PayOS Sandbox cho development
- Sử dụng PayOS Production cho production

## 📝 Giới hạn PayOS

- **Description**: Tối đa 25 ký tự
- **Amount**: Phải là số dương (đơn vị VND)
- **OrderCode**: Phải là số nguyên duy nhất
- **ReturnUrl/CancelUrl**: Phải là URL hợp lệ

## 🐛 Troubleshooting

### Lỗi "Description quá dài"
```
Error: Mô tả tối đa 25 kí tự (code: 20)
```
**Giải pháp**: Rút ngắn description xuống dưới 25 ký tự

### Lỗi "Amount không hợp lệ"
```
Error: Số tiền phải lớn hơn 0
```
**Giải pháp**: Kiểm tra totalPrice > 0

### Lỗi "PayOS chưa được cấu hình"
```
Error: PayOS chưa được cấu hình đúng
```
**Giải pháp**: Tạo file `.env` với đầy đủ credentials
