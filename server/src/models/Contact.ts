import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  type: 'phone' | 'email' | 'address' | 'social' | 'wechat';
  label: { zh: string; en: string };
  value: string;
  icon?: string;
  isPublic: boolean;
  sortOrder: number;
}

const ContactSchema = new Schema<IContact>(
  {
    type: {
      type: String,
      enum: ['phone', 'email', 'address', 'social', 'wechat'],
      required: true,
    },
    label: {
      zh: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    value: { type: String, required: true },
    icon: { type: String },
    isPublic: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>('Contact', ContactSchema);
