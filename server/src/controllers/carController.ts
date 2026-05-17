import { Request, Response } from 'express';
import Car from '../models/Car';

export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1, limit = 12, type, category, brand, carModel,
      minPrice, maxPrice, keyword, sort = '-createdAt', isPopular,
    } = req.query;

    const filter: any = { isActive: true };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand as string, 'i');
    if (carModel) filter.carModel = new RegExp(carModel as string, 'i');
    if (isPopular) filter.isPopular = isPopular === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (keyword) {
      filter.$or = [
        { 'name.zh': new RegExp(keyword as string, 'i') },
        { 'name.en': new RegExp(keyword as string, 'i') },
        { brand: new RegExp(keyword as string, 'i') },
        { carModel: new RegExp(keyword as string, 'i') },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions: any = {};
    const sortStr = sort as string;
    if (sortStr.startsWith('-')) {
      sortOptions[sortStr.slice(1)] = -1;
    } else {
      sortOptions[sortStr] = 1;
    }

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Car.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: cars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取车辆列表失败' });
  }
};

export const getPopularCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const cars = await Car.find({ isActive: true, isPopular: true })
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(8)
      .lean();
    res.json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取热门车辆失败' });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findById(req.params.id).populate('category', 'name slug');
    if (!car) {
      res.status(404).json({ success: false, message: '车辆不存在' });
      return;
    }
    // 获取相关车辆
    const related = await Car.find({
      _id: { $ne: car._id },
      type: car.type,
      isActive: true,
    }).limit(4).lean();
    res.json({ success: true, data: car, related });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取车辆详情失败' });
  }
};

export const adminGetCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, type, keyword, isActive } = req.query;
    const filter: any = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (keyword) {
      filter.$or = [
        { 'name.zh': new RegExp(keyword as string, 'i') },
        { brand: new RegExp(keyword as string, 'i') },
      ];
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const [cars, total] = await Promise.all([
      Car.find(filter).populate('category', 'name').sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Car.countDocuments(filter),
    ]);
    res.json({ success: true, data: cars, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取车辆列表失败' });
  }
};

export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ success: true, data: car, message: '车辆创建成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '创建车辆失败' });
  }
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!car) {
      res.status(404).json({ success: false, message: '车辆不存在' });
      return;
    }
    res.json({ success: true, data: car, message: '车辆更新成功' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || '更新车辆失败' });
  }
};

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      res.status(404).json({ success: false, message: '车辆不存在' });
      return;
    }
    res.json({ success: true, message: '车辆删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除车辆失败' });
  }
};

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !(req.files as Express.Multer.File[]).length) {
      res.status(400).json({ success: false, message: '没有上传文件' });
      return;
    }
    const files = req.files as Express.Multer.File[];
    const urls = files.map(file => {
      const isVideo = file.mimetype.startsWith('video/');
      return `/uploads/${isVideo ? 'videos' : 'images'}/${file.filename}`;
    });
    res.json({ success: true, data: urls, message: '文件上传成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '文件上传失败' });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [total, newCars, usedCars, popular] = await Promise.all([
      Car.countDocuments({ isActive: true }),
      Car.countDocuments({ type: 'new', isActive: true }),
      Car.countDocuments({ type: 'used', isActive: true }),
      Car.countDocuments({ isPopular: true, isActive: true }),
    ]);
    res.json({ success: true, data: { total, newCars, usedCars, popular } });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取统计数据失败' });
  }
};
