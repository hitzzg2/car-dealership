import { Router } from 'express';
import {
  getCategories, getCategoryBySlug,
  adminGetCategories, createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/admin/list', authenticate, adminGetCategories);
router.post('/admin/create', authenticate, createCategory);
router.put('/admin/:id', authenticate, updateCategory);
router.delete('/admin/:id', authenticate, deleteCategory);

export default router;
