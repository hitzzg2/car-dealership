import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({ success: false, message: '数据验证失败', errors });
    return;
  }

  if (err.code === 11000) {
    res.status(400).json({ success: false, message: '数据已存在，请勿重复添加' });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: '无效的ID格式' });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `路由 ${req.originalUrl} 不存在` });
};
