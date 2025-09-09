import { db } from "../config/db";
import { categories, productCategories, productImages, products, sellers, users } from "../config/schema";
import { eq, and, asc, inArray } from "drizzle-orm";

type CreateProductInput = typeof products.$inferInsert & {
  listCate: typeof categories.$inferSelect[];
  listImg: string[];
};

const createProduct = async (product: CreateProductInput) => {
  const { listCate, listImg, ...rest } = product;
  const [result] = await db.insert(products).values(rest).returning();
  
  // Sử dụng Promise.all để xử lý song song các insert
  await Promise.all(
    listCate.map(async (categoryId: typeof categories.$inferSelect) => {
      await db.insert(productCategories).values({ 
        product_id: result.id, 
        category_id: categoryId.id 
      });
    })
  );
  await Promise.all(
    listImg.map(async (imgUrl: string) => {
      await db.insert(productImages).values({ 
        product_id: result.id, 
        img_url: imgUrl 
      });
    })
  ); 


  return {
    ...result,
    listCate: listCate,
    listImg: listImg,
  };
};

const getAllProducts = async () => {
  // Lấy tất cả products
  const productRows = await db
    .select()
    .from(products);

  const result = [];
  
  for (const product of productRows) {
    // Lấy categories cho product này
    const categoryRows = await db
      .select()
      .from(productCategories)
      .leftJoin(categories, eq(productCategories.category_id, categories.id))
      .where(eq(productCategories.product_id, product.id));
    
    // Lấy images cho product này
    const imageRows = await db
      .select()
      .from(productImages)
      .where(eq(productImages.product_id, product.id));

    result.push({
      ...product,
      listCate: categoryRows.map(row => row.categories).filter(Boolean),
      listImg: imageRows.map(row => row.img_url)
    });
  }
  
  return result;
};

const getProductById = async (id: number) => {
  const rows = await db
    .select()
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.product_id))
    .where(eq(products.id, id));

  if (rows.length === 0) return null;

  const product = { ...rows[0].products, listImg: [] as string[] } as any;
  for (const row of rows) {
    const img = row.product_images?.img_url ?? null;
    if (img) product.listImg.push(img);
  }
  return product;
};

const updateProduct = async (id: number, product: CreateProductInput) => {
  const { listCate, listImg, ...rest } = product;

  try {
    // Cập nhật thông tin sản phẩm
    await db.update(products).set(rest).where(eq(products.id, id));

    // Xóa categories cũ
    await db.delete(productCategories).where(eq(productCategories.product_id, id));
    
    // Xóa images cũ
    await db.delete(productImages).where(eq(productImages.product_id, id));

    // Thêm categories mới
    if (Array.isArray(listCate) && listCate.length > 0) {
      await Promise.all(
        listCate.map(async (category: typeof categories.$inferSelect) => {
          await db.insert(productCategories).values({ 
            product_id: id, 
            category_id: category.id 
          });
        })
      );
    }

    // Thêm images mới
    if (Array.isArray(listImg) && listImg.length > 0) {
      await Promise.all(
        listImg.map(async (imgUrl: string) => {
          await db.insert(productImages).values({ 
            product_id: id, 
            img_url: imgUrl 
          });
        })
      );
    }

    // Trả về kết quả đầy đủ
    return {
      id,
      ...rest,
      listCate: listCate,
      listImg: listImg,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

const deleteProduct = async (id: number) => {
  const result = await db.update(products).set({ status: false }).where(eq(products.id, id));
  return result;
};

const getProductWithSellers = async (id: number) => {
  // Lấy thông tin product và images
  const productRows = await db
    .select()
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.product_id))
    .where(eq(products.id, id));

  if (productRows.length === 0) return null;

  const product = { ...productRows[0].products, listImg: [] as string[] } as any;
  for (const row of productRows) {
    const img = row.product_images?.img_url ?? null;
    if (img) product.listImg.push(img);
  }

  // Lấy danh sách sellers của product này
  const sellerRows = await db
    .select({
      seller_id: sellers.id,
      user_id: sellers.user_id,
      username: users.username,
      avatar: users.avatar,
      price_original: sellers.price_original,
      discount: sellers.discount,
      stock: sellers.stock,
      status: sellers.status,
    })
    .from(sellers)
    .leftJoin(users, eq(sellers.user_id, users.id))
    .where(and(
      eq(sellers.product_id, id),
      eq(sellers.status, true)
    ))
    .orderBy(asc(sellers.price_original));

  // Tính giá cuối cùng cho mỗi seller (giả sử discount là số tiền)
  const sellersWithFinalPrice = sellerRows.map(seller => ({
    ...seller,
    final_price: seller.discount ? seller.price_original - seller.discount : seller.price_original
  }));

  // Tìm giá thấp nhất
  const lowestPrice = sellersWithFinalPrice.length > 0 
    ? Math.min(...sellersWithFinalPrice.map(s => s.final_price))
    : null;

  return {
    ...product,
    sellers: sellersWithFinalPrice,
    lowest_price: lowestPrice,
    seller_count: sellersWithFinalPrice.length
  };
};

const getAllProductsWithLowestPrice = async () => {
  // Lấy tất cả products với images
  const productRows = await db
    .select()
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.product_id));

  const productMap = new Map<number, any>();
  
  // Xử lý products và images
  for (const row of productRows) {
    const p = row.products;
    const img = row.product_images?.img_url ?? null;
    if (!productMap.has(p.id)) {
      productMap.set(p.id, { ...p, listImg: [] as string[] });
    }
    if (img) {
      productMap.get(p.id).listImg.push(img);
    }
  }

  // Lấy thông tin sellers cho tất cả products
  const sellerRows = await db
    .select({
      product_id: sellers.product_id,
      price_original: sellers.price_original,
      discount: sellers.discount,
      status: sellers.status,
    })
    .from(sellers)
    .where(eq(sellers.status, true));

  // Tính giá thấp nhất cho mỗi product
  const sellerMap = new Map<number, any[]>();
  for (const seller of sellerRows) {
    if (!sellerMap.has(seller.product_id)) {
      sellerMap.set(seller.product_id, []);
    }
    sellerMap.get(seller.product_id)!.push(seller);
  }

  // Thêm thông tin giá vào products
  const productsWithPrice = Array.from(productMap.values()).map(product => {
    const productSellers = sellerMap.get(product.id) || [];
    const sellersWithFinalPrice = productSellers.map(seller => ({
      ...seller,
      final_price: seller.discount ? seller.price_original - seller.discount : seller.price_original
    }));

    const lowestPrice = sellersWithFinalPrice.length > 0 
      ? Math.min(...sellersWithFinalPrice.map(s => s.final_price))
      : null;

    return {
      ...product,
      lowest_price: lowestPrice,
      seller_count: sellersWithFinalPrice.length
    };
  });

  return productsWithPrice;
};

export { createProduct, getAllProducts, getAllProductsWithLowestPrice, getProductById, getProductWithSellers, updateProduct, deleteProduct };