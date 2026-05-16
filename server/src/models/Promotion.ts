import mongoose, { Document, Schema } from 'mongoose';

export interface IPromotion extends Document {
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  type: 'banner' | 'discount' | 'special';
  image: string;
  link?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  sortOrder: number;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    title: {
      zh: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    description: {
      zh: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    type: { type: String, enum: ['banner', 'discount', 'special'], default: 'banner' },
    image: { type: String, required: true },
    link: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);
