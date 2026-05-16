import { Request, Response } from 'express';
import Contact from '../models/Contact';

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find({ isPublic: true }).sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取联系信息失败' });
  }
};

export const adminGetContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find().sort({ sortOrder: 1 }).lean();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取联系信息失败' });
  }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, data: contact, message: '联系信息创建成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '创建失败' });
  }
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      res.status(404).json({ success: false, message: '联系信息不存在' });
      return;
    }
    res.json({ success: true, data: contact, message: '联系信息更新成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '更新失败' });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      res.status(404).json({ success: false, message: '联系信息不存在' });
      return;
    }
    res.json({ success: true, message: '联系信息删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败' });
  }
};
