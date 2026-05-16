import 'dotenv/config';
import connectDB from '../config/database';
import User from '../models/User';
import Category from '../models/Category';
import Car from '../models/Car';
import Promotion from '../models/Promotion';
import Contact from '../models/Contact';

const seed = async (): Promise<void> => {
  await connectDB();
  console.log('🌱 开始初始化数据...');

  // 清空数据
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Car.deleteMany({}),
    Promotion.deleteMany({}),
    Contact.deleteMany({}),
  ]);

  // 创建管理员
  const admin = new User({
    username: '超级管理员',
    email: 'admin@cardealership.com',
    password: 'Admin@123456',
    role: 'admin',
    isActive: true,
  });
  await admin.save();
  console.log('✅ 管理员账户已创建: admin@cardealership.com / Admin@123456');

  // 创建分类
  const categories = await Category.insertMany([
    { name: { zh: '新车', en: 'New Cars' }, slug: 'new-cars', icon: 'car', sortOrder: 1, isActive: true },
    { name: { zh: '二手车', en: 'Used Cars' }, slug: 'used-cars', icon: 'swap', sortOrder: 2, isActive: true },
    { name: { zh: '豪华车', en: 'Luxury Cars' }, slug: 'luxury', icon: 'star', sortOrder: 3, isActive: true },
    { name: { zh: 'SUV', en: 'SUV' }, slug: 'suv', icon: 'inbox', sortOrder: 4, isActive: true },
    { name: { zh: '新能源', en: 'EV/Hybrid' }, slug: 'ev', icon: 'thunderbolt', sortOrder: 5, isActive: true },
  ]);
  console.log('✅ 分类数据已创建');

  // 创建车辆
  const now = new Date();
  const cars = await Car.insertMany([
    {
      name: { zh: '宝马 5系 2024款', en: 'BMW 5 Series 2024' },
      description: { zh: '全新宝马5系，豪华商务轿车，搭载最新驾驶辅助系统，舒适与科技完美融合。', en: 'All-new BMW 5 Series, luxury business sedan with the latest driver assistance systems.' },
      category: categories[0]._id,
      type: 'new',
      brand: '宝马',
      model: '5系',
      year: 2024,
      price: 498000,
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80'],
      specifications: { engine: '2.0T', transmission: '8AT', fuel: '汽油', color: '珍珠白', seats: 5 },
      features: ['全景天窗', '座椅加热通风', '车道偏离预警', '自动泊车', 'HUD抬头显示'],
      isPopular: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: { zh: '奔驰 C级 2024款', en: 'Mercedes-Benz C-Class 2024' },
      description: { zh: '全新奔驰C级，优雅与动感的完美结合，搭载MBUX智能系统。', en: 'All-new Mercedes-Benz C-Class, perfect combination of elegance and sportiness with MBUX.' },
      category: categories[0]._id,
      type: 'new',
      brand: '奔驰',
      model: 'C级',
      year: 2024,
      price: 368000,
      images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'],
      specifications: { engine: '1.5T', transmission: '9AT', fuel: '汽油', color: '曜岩灰', seats: 5 },
      features: ['MBUX大屏', '64色氛围灯', 'Burmester音响', '驾驶辅助包'],
      isPopular: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: { zh: '特斯拉 Model 3 2024', en: 'Tesla Model 3 2024' },
      description: { zh: '特斯拉Model 3，纯电续航超600km，OTA自动升级，智能驾驶领航。', en: 'Tesla Model 3, over 600km range, OTA updates, advanced autopilot.' },
      category: categories[4]._id,
      type: 'new',
      brand: '特斯拉',
      model: 'Model 3',
      year: 2024,
      price: 245900,
      images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', 'https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800&q=80'],
      specifications: { engine: '纯电动', transmission: '单速', fuel: '电动', color: '深海蓝', seats: 5 },
      features: ['Autopilot自动辅助驾驶', '15.4英寸触控屏', 'OTA远程升级', '超级充电桩'],
      isPopular: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: { zh: '宝马 X5 二手 2022款', en: 'BMW X5 Used 2022' },
      description: { zh: '准新车，行驶约1.5万公里，全车无事故，官方认证二手车。', en: 'Nearly new, approx 15,000 km, accident-free, certified pre-owned.' },
      category: categories[3]._id,
      type: 'used',
      brand: '宝马',
      model: 'X5',
      year: 2022,
      price: 598000,
      originalPrice: 798000,
      mileage: 15000,
      condition: '极好',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80'],
      specifications: { engine: '3.0T', transmission: '8AT', fuel: '汽油', color: '暗夜黑', seats: 7 },
      features: ['7座版', '全景天窗', '空气悬架', 'B&W音响', 'HUD'],
      isPopular: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      name: { zh: '丰田 凯美瑞 二手 2021款', en: 'Toyota Camry Used 2021' },
      description: { zh: '丰田凯美瑞，行驶约3万公里，原车主精心保养，无改装无事故。', en: 'Toyota Camry, approx 30,000 km, well-maintained, no accidents, no modifications.' },
      category: categories[1]._id,
      type: 'used',
      brand: '丰田',
      model: '凯美瑞',
      year: 2021,
      price: 168000,
      originalPrice: 218000,
      mileage: 30000,
      condition: '良好',
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'],
      specifications: { engine: '2.5L', transmission: 'CVT', fuel: '汽油', color: '冰晶银', seats: 5 },
      features: ['Toyota Safety Sense', '无钥匙进入', '原厂导航', '倒车影像'],
      isPopular: false,
      isActive: true,
      sortOrder: 5,
    },
    {
      name: { zh: '奥迪 Q7 2024款', en: 'Audi Q7 2024' },
      description: { zh: '全新奥迪Q7，豪华大型SUV，搭载quattro全时四驱，驾驭一切路况。', en: 'All-new Audi Q7, luxury full-size SUV with quattro all-wheel drive.' },
      category: categories[3]._id,
      type: 'new',
      brand: '奥迪',
      model: 'Q7',
      year: 2024,
      price: 698000,
      images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'],
      specifications: { engine: '3.0T', transmission: '8AT', fuel: '汽油', color: '冰川白', seats: 7 },
      features: ['quattro四驱', '空气悬架', 'Bang&Olufsen音响', '矩阵大灯', '7座'],
      isPopular: true,
      isActive: true,
      sortOrder: 6,
    },
  ]);
  console.log('✅ 车辆数据已创建');

  // 创建轮播图/促销
  await Promotion.insertMany([
    {
      title: { zh: '全新车系盛大上市', en: 'New Models Grand Launch' },
      description: { zh: '2024全新车系重磅登场，感受极致驾乘体验', en: 'Experience the ultimate driving pleasure with our 2024 lineup' },
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=80',
      link: '/cars?type=new',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true,
      sortOrder: 1,
    },
    {
      title: { zh: '二手好车特惠专场', en: 'Used Cars Special Deals' },
      description: { zh: '精选认证二手车，品质保障，价格实惠', en: 'Certified pre-owned vehicles with quality guarantee' },
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80',
      link: '/cars?type=used',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true,
      sortOrder: 2,
    },
    {
      title: { zh: '新能源购车补贴', en: 'EV Purchase Subsidy' },
      description: { zh: '国家新能源补贴政策，购车享最高5万元优惠', en: 'Government EV subsidies up to ¥50,000 off' },
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=80',
      link: '/cars?category=ev',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true,
      sortOrder: 3,
    },
    {
      title: { zh: '春节大促：购车享8折', en: 'Spring Festival Sale: 20% Off' },
      description: { zh: '春节期间限时特惠，全系车型8折起', en: 'Limited time Spring Festival offer, 20% off all models' },
      type: 'special',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      link: '/cars',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      isActive: true,
      sortOrder: 1,
    },
  ]);
  console.log('✅ 轮播图/促销数据已创建');

  // 创建联系信息
  await Contact.insertMany([
    { type: 'phone', label: { zh: '销售热线', en: 'Sales Hotline' }, value: '400-888-8888', icon: 'phone', isPublic: true, sortOrder: 1 },
    { type: 'phone', label: { zh: '服务热线', en: 'Service Hotline' }, value: '400-999-9999', icon: 'customer-service', isPublic: true, sortOrder: 2 },
    { type: 'email', label: { zh: '邮箱', en: 'Email' }, value: 'sales@cardealership.com', icon: 'mail', isPublic: true, sortOrder: 3 },
    { type: 'address', label: { zh: '门店地址', en: 'Store Address' }, value: '北京市朝阳区建国路88号国贸汽车城', icon: 'environment', isPublic: true, sortOrder: 4 },
    { type: 'wechat', label: { zh: '微信客服', en: 'WeChat Service' }, value: 'cardealer2024', icon: 'wechat', isPublic: true, sortOrder: 5 },
    { type: 'social', label: { zh: '营业时间', en: 'Business Hours' }, value: '周一至周日 9:00-20:00', icon: 'clock-circle', isPublic: true, sortOrder: 6 },
  ]);
  console.log('✅ 联系信息已创建');

  console.log('\n🎉 初始化完成！');
  console.log('📧 管理员邮箱: admin@cardealership.com');
  console.log('🔑 管理员密码: Admin@123456');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ 初始化失败:', err);
  process.exit(1);
});
