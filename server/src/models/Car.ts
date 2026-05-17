import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  category?: mongoose.Types.ObjectId;
  type: 'new' | 'used';
  brand: string;
  carModel: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage?: number;
  condition?: string;
  images: string[];
  videos?: string[];
  specifications: {
    engine?: string;
    transmission?: string;
    fuel?: string;
    color?: string;
    seats?: number;
    displacement?: string;
    horsepower?: string;
    driveType?: string;
  };
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: {
      zh: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    description: {
      zh: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    type: { type: String, enum: ['new', 'used'], required: true },
    brand: { type: String, required: true, trim: true },
    carModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    mileage: { type: Number },
    condition: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    specifications: {
      engine: String,
      transmission: String,
      fuel: String,
      color: String,
      seats: Number,
      displacement: String,
      horsepower: String,
      driveType: String,
    },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CarSchema.index({ brand: 1, carModel: 1 });
CarSchema.index({ type: 1 });
CarSchema.index({ isPopular: 1 });
CarSchema.index({ isActive: 1 });
CarSchema.index({ price: 1 });

export default mongoose.model<ICar>('Car', CarSchema);
