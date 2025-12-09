import mongoose, { Schema, Document } from "mongoose";

export interface IExchangeRate extends Document {
  date: string; // YYYY-MM-DD (UTC)
  rate: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeRateSchema = new Schema<IExchangeRate>(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExchangeRate>(
  "ExchangeRate",
  ExchangeRateSchema
);
