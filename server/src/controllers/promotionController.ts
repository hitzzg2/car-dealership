import { Request, Response } from 'express';
import Promotion from '../models/Promotion';

const now = () => new Date();

export const getPromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now() },
      endDate: { $gte: now() },
    }).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取促销活动失败' });
  }
};

export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Promotion.find({
      type: 'banner',
      isActive: true,
      startDate: { $lte: now() },
      endDate: { $gte: now() },
    }).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取轮播图失败' });
  }
};

export const adminGetPromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取促销列表失败' });
  }
};

export const createPromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json({ success: true, data: promotion, message: '促销活动创建成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '创建促销活动失败' });
  }
};

export const updatePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) {
      res.status(404).json({ success: false, message: '促销活动不存在' });
      return;
    }
    res.json({ success: true, data: promotion, message: '促销活动更新成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '更新失败' });
  }
};

export const deletePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      res.status(404).json({ success: false, message: '促销活动不存在' });
      return;
    }
    res.json({ success: true, message: '促销活动删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败' });
  }
};
