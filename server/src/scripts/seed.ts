import 'dotenv/config';
import connectDB from '../config/database';
import User from '../models/User';
import Category from '../models/Category';
import Car from '../models/Car';
import Promotion from '../models/Promotion';
import Contact from '../models/Contact';

const seed = async (): Promise<void> => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Car.deleteMany({}),
    Promotion.deleteMany({}),
    Contact.deleteMany({}),
  ]);

  // Create categories
  const categories = await Category.insertMany([
    { name: { zh: '新车', en: 'New Cars' }, slug: 'new-cars', icon: 'car', sortOrder: 1, isActive: true },
    { name: { zh: '二手车', en: 'Used Cars' }, slug: 'used-cars', icon: 'swap', sortOrder: 2, isActive: true },
    { name: { zh: '豪华车', en: 'Luxury Cars' }, slug: 'luxury', icon: 'star', sortOrder: 3, isActive: true },
    { name: { zh: 'SUV', en: 'SUV' }, slug: 'suv', icon: 'inbox', sortOrder: 4, isActive: true },
    { name: { zh: '新能源', en: 'EV / Hybrid' }, slug: 'ev', icon: 'thunderbolt', sortOrder: 5, isActive: true },
  ]);
  console.log('✅ Categories created');

  // Create sample cars
  const cars = await Car.insertMany([
    {
      name: { zh: '宝马 5系 2024款', en: 'BMW 5 Series 2024' },
      description: { zh: '全新宝马5系，豪华商务轿车', en: 'All-new BMW 5 Series, luxury business sedan.' },
      category: categories[0]._id,
      type: 'new',
      brand: 'BMW',
      carModel: '5 Series',
      year: 2024,
      price: 498000,
      images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
      specifications: { engine: '2.0T', transmission: '8AT', fuel: 'Petrol', color: 'Pearl White', seats: 5 },
      features: ['Panoramic Sunroof', 'Heated & Ventilated Seats', 'HUD'],
      isPopular: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: { zh: '奔驰 C级 2024款', en: 'Mercedes-Benz C-Class 2024' },
      description: { zh: '全新奔驰C级，优雅与动感', en: 'All-new C-Class, elegance and sportiness.' },
      category: categories[0]._id,
      type: 'new',
      brand: 'Mercedes-Benz',
      carModel: 'C-Class',
      year: 2024,
      price: 368000,
      images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'],
      specifications: { engine: '1.5T', transmission: '9AT', fuel: 'Petrol', color: 'Obsidian Grey', seats: 5 },
      features: ['MBUX Display', '64-color Ambient Lighting', 'Burmester Audio'],
      isPopular: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: { zh: '特斯拉 Model 3 2024', en: 'Tesla Model 3 2024' },
      description: { zh: '特斯拉Model3，纯电续航超600km', en: 'Tesla Model 3, over 600km range, advanced autopilot.' },
      category: categories[4]._id,
      type: 'new',
      brand: 'Tesla',
      carModel: 'Model 3',
      year: 2024,
      price: 245900,
      images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'],
      specifications: { engine: 'Electric', transmission: 'Single Speed', fuel: 'Electric', color: 'Deep Blue', seats: 5 },
      features: ['Autopilot', '15.4" Touchscreen', 'OTA Updates', 'Supercharger Network'],
      isPopular: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: { zh: '宝马 X5 二手 2022款', en: 'BMW X5 Used 2022' },
      description: { zh: '准新车，行驶约1.5万公里', en: 'Nearly new, approx 15,000 km, accident-free.' },
      category: categories[3]._id,
      type: 'used',
      brand: 'BMW',
      carModel: 'X5',
      year: 2022,
      price: 598000,
      originalPrice: 798000,
      mileage: 15000,
      condition: 'Excellent',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
      specifications: { engine: '3.0T', transmission: '8AT', fuel: 'Petrol', color: 'Black', seats: 7 },
      features: ['7-Seater', 'Air Suspension', 'B&W Audio', 'HUD'],
      isPopular: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      name: { zh: '丰田 凯美瑞 二手 2021款', en: 'Toyota Camry Used 2021' },
      description: { zh: '丰田凯美瑞，行驶约3万公里', en: 'Toyota Camry, approx 30,000 km, well-maintained.' },
      category: categories[1]._id,
      type: 'used',
      brand: 'Toyota',
      carModel: 'Camry',
      year: 2021,
      price: 168000,
      originalPrice: 218000,
      mileage: 30000,
      condition: 'Good',
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'],
      specifications: { engine: '2.5L', transmission: 'CVT', fuel: 'Petrol', color: 'Silver', seats: 5 },
      features: ['Toyota Safety Sense', 'Keyless Entry', 'Navigation', 'Rear Camera'],
      isPopular: false,
      isActive: true,
      sortOrder: 5,
    },
    {
      name: { zh: '奥迪 Q7 2024款', en: 'Audi Q7 2024' },
      description: { zh: '全新奥迪Q7，豪华大型SUV', en: 'All-new Audi Q7, luxury full-size SUV with quattro.' },
      category: categories[3]._id,
      type: 'new',
      brand: 'Audi',
      carModel: 'Q7',
      year: 2024,
      price: 698000,
      images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'],
      specifications: { engine: '3.0T', transmission: '8AT', fuel: 'Petrol', color: 'Glacier White', seats: 7 },
      features: ['quattro AWD', 'Air Suspension', 'Bang & Olufsen Audio', 'Matrix LED', '7-Seater'],
      isPopular: true,
      isActive: true,
      sortOrder: 6,
    },
  ]);
  console.log('✅ Cars created');

  // Create promotions / banners
  await Promotion.insertMany([
    {
      title: { zh: '全新车系盛大上市', en: 'New Models Grand Launch' },
      description: { zh: '2024全新车系重磅登场', en: 'Experience the ultimate driving pleasure with our 2024 lineup' },
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=80',
      link: '/cars?type=new',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      sortOrder: 1,
    },
    {
      title: { zh: '认证二手车特惠', en: 'Certified Pre-Owned Special' },
      description: { zh: '精选认证二手车，品质保障', en: 'Certified pre-owned vehicles with quality guarantee' },
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80',
      link: '/cars?type=used',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      sortOrder: 2,
    },
    {
      title: { zh: '新能源购车优惠', en: 'EV Purchase Benefits' },
      description: { zh: '新能源汽车专项优惠', en: 'Special benefits for EV purchases' },
      type: 'banner',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=80',
      link: '/cars?category=ev',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      sortOrder: 3,
    },
  ]);
  console.log('✅ Promotions created');

  // Create contact / social media info
  await Contact.insertMany([
    { type: 'whatsapp', label: { zh: 'WhatsApp', en: 'WhatsApp' }, value: '+86 15918161885', icon: 'whatsapp', isPublic: true, sortOrder: 1 },
    { type: 'wechat', label: { zh: '微信', en: 'WeChat' }, value: 'chinavehice77', icon: 'wechat', isPublic: true, sortOrder: 2 },
    { type: 'telegram', label: { zh: 'Telegram', en: 'Telegram' }, value: '+86 15918161885', icon: 'send', isPublic: true, sortOrder: 3 },
    { type: 'email', label: { zh: '邮箱', en: 'Email' }, value: 'chinavehice77@gmail.com', icon: 'mail', isPublic: true, sortOrder: 4 },
    { type: 'facebook', label: { zh: 'Facebook', en: 'Facebook' }, value: 'China Vehicle Auto', icon: 'facebook', isPublic: true, sortOrder: 5 },
    { type: 'tiktok', label: { zh: 'TikTok', en: 'TikTok' }, value: '@ChinaCar_Export', icon: 'video-camera', isPublic: true, sortOrder: 6 },
    { type: 'instagram', label: { zh: 'Instagram', en: 'Instagram' }, value: '@china_vehice77', icon: 'instagram', isPublic: true, sortOrder: 7 },
  ]);
  console.log('✅ Contact / Social media info created');

  // Create default admin user
  await User.create({
    username: 'Admin',
    email: 'admin@cardealership.com',
    password: 'Admin@123456',
    role: 'admin',
    isActive: true,
    isApproved: true,
  });
  console.log('✅ Default admin user created');

  console.log('\n🎉 Seed completed!');
  console.log('📧 Admin: admin@cardealership.com');
  console.log('🔑 Password: Admin@123456');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
