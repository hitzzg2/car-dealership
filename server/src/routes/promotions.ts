import { Router } from 'express';
import {
  getPromotions, getBanners,
  adminGetPromotions, createPromotion, updatePromotion, deletePromotion,
} from '../controllers/promotionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getPromotions);
router.get('/banners', getBanners);
router.get('/admin/list', authenticate, adminGetPromotions);
router.post('/admin/create', authenticate, createPromotion);
router.put('/admin/:id', authenticate, updatePromotion);
router.delete('/admin/:id', authenticate, deletePromotion);

export default router;
