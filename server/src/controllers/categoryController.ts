import { Request, Response } from 'express';
import Category from '../models/Category';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.status(404).json({ success: false, message: '分类不存在' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
};

export const adminGetCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取分类失败' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category, message: '分类创建成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '创建分类失败' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ success: false, message: '分类不存在' });
      return;
    }
    res.json({ success: true, data: category, message: '分类更新成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '更新分类失败' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, message: '分类不存在' });
      return;
    }
    res.json({ success: true, message: '分类删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除分类失败' });
  }
};
