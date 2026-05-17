import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as any);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: '请提供用户名、邮箱和密码' });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: '该邮箱已被注册' });
      return;
    }
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin',
      isActive: true,
    });
    const token = generateToken(user._id.toString());
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '注册失败' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: '请提供邮箱和密码' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: '邮箱或密码错误' });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: '邮箱或密码错误' });
      return;
    }
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '登录失败' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: req.user });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: '用户不存在' });
      return;
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: '原密码错误' });
      return;
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '修改密码失败' });
  }
};
