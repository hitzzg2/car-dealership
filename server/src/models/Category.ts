import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: { zh: string; en: string };
  slug: string;
  description?: { zh: string; en: string };
  icon?: string;
  image?: string;
  parentId?: mongoose.Types.ObjectId;
  sortOrder: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      zh: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, trim: true },
    description: {
      zh: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    icon: { type: String },
    image: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
