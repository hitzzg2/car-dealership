import { Router } from 'express';
import {
  getCars, getPopularCars, getCarById,
  adminGetCars, createCar, updateCar, deleteCar, uploadFiles, getDashboardStats,
} from '../controllers/carController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getCars);
router.get('/popular', getPopularCars);
router.get('/:id', getCarById);

// Admin routes
router.get('/admin/list', authenticate, adminGetCars);
router.get('/admin/stats', authenticate, getDashboardStats);
router.post('/admin/create', authenticate, createCar);
router.put('/admin/:id', authenticate, updateCar);
router.delete('/admin/:id', authenticate, deleteCar);
router.post('/admin/upload', authenticate, upload.array('files', 20), uploadFiles);

export default router;
