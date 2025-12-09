import mongoose, { Schema, Document } from "mongoose";

export interface ITariffTable {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface ICompanyTariff {
  name: string;
  tables: ITariffTable[];
}

export interface ITariffPage extends Document {
  exchangeRate: number;
  exchangeDate: string;
  allowUserHistoricalRates?: boolean;
  companies: ICompanyTariff[];
  updatedAt: Date;
}

const TariffPageSchema = new Schema(
  {
    exchangeRate: {
      type: Number,
      required: true,
      default: 1.0,
    },
    exchangeDate: {
      type: String,
      required: true,
      default: () => new Date().toISOString().slice(0, 10),
    },
    // If true, non-admin users can fetch historical/effective exchange rates
    allowUserHistoricalRates: {
      type: Boolean,
      required: true,
      default: false,
    },
    companies: [
      {
        name: {
          type: String,
          required: true,
        },
        tables: [
          {
            title: {
              type: String,
              required: true,
            },
            columns: [
              {
                type: String,
              },
            ],
            rows: [[Schema.Types.Mixed]],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITariffPage>("TariffPage", TariffPageSchema);
