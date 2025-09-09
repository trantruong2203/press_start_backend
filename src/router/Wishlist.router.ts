import { Router } from   'express';
import { createWishlistController, deleteWishlistController, getAllWishlistController, getWishlistByIdController, updateWishlistController } from "../controllers/Wishlist.controller";

const router = Router();

router.post('/create', createWishlistController);
router.get('/', getAllWishlistController);
router.get('/:id', getWishlistByIdController);
router.put('/:id', updateWishlistController);
router.delete('/:id', deleteWishlistController);
export default router; 