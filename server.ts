import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import categoriesRouter from './src/router/Categories.router';
import usersRouter from './src/router/Users.router';
import productsRouter from './src/router/Product.router';
import productCategoriesRouter from './src/router/ProductCate.router';
import sellersRouter from './src/router/Sellers.router';
import platformsRouter from './src/router/Platforms.router';
import productImagesRouter from './src/router/ProductImages.router';
import cartItemsRouter from './src/router/CartItems.router';
import vouchersRouter from './src/router/Vouchers.router';
import ordersRouter from './src/router/Orders.router';
import orderItemsRouter from './src/router/OrderItems.router';
import postsRouter from './src/router/Posts.router';
import commentsRouter from './src/router/Comments.router';
import paymentsRouter from './src/router/Payments.router';
import accountPoolRouter from './src/router/AccountPool.router';
import keyPoolRouter from './src/router/KeyPool.router';
import wishlistRouter from './src/router/Wishlist.router';
import payOsRouter from './src/router/PayOs.router';
  
const app = express();
const server = createServer(app);
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: true, // Cho phép tất cả origins trong development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/product-cate', productCategoriesRouter);
app.use('/sellers', sellersRouter);
app.use('/platforms', platformsRouter);
app.use('/product-images', productImagesRouter);
app.use('/cart-items', cartItemsRouter);
app.use('/vouchers', vouchersRouter);
app.use('/orders', ordersRouter);
app.use('/order-items', orderItemsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/payments', paymentsRouter);
app.use('/account-pool', accountPoolRouter);
app.use('/key-pool', keyPoolRouter);
app.use('/wishlist', wishlistRouter);
app.use('/payos', payOsRouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); 
});


