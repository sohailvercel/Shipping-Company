import mongoose, { Schema, Document } from 'mongoose';

export interface IPortSchedule {
  port: string;
  arrival: string;
  departure: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export interface IVoyage {
  voyageNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: 'On Time' | 'Delayed' | 'Completed';
  schedule: IPortSchedule[];
}

export interface ISchedule extends Document {
  _id: string;
  vesselName: string;
  vesselType: string;
  capacity: string;
  flag: string;
  currentLocation: string;
  voyages: IVoyage[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PortScheduleSchema = new Schema<IPortSchedule>({
  port: {
    type: String,
    required: [true, 'Please add a port name'],
    trim: true
  },
  arrival: {
    type: String,
    required: [true, 'Please add arrival time'],
    trim: true
  },
  departure: {
    type: String,
    required: [true, 'Please add departure time'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Please add status'],
    enum: {
      values: ['Completed', 'In Progress', 'Upcoming'],
      message: 'Please select a valid status'
    }
  }
}, { _id: false });

const VoyageSchema = new Schema<IVoyage>({
  voyageNumber: {
    type: String,
    required: [true, 'Please add a voyage number'],
    trim: true
  },
  origin: {
    type: String,
    required: [true, 'Please add origin'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Please add destination'],
    trim: true
  },
  departure: {
    type: String,
    required: [true, 'Please add departure date'],
    trim: true
  },
  arrival: {
    type: String,
    required: [true, 'Please add arrival date'],
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Please add voyage status'],
    enum: {
      values: ['On Time', 'Delayed', 'Completed'],
      message: 'Please select a valid status'
    }
  },
  schedule: [PortScheduleSchema]
}, { _id: false });

const ScheduleSchema = new Schema<ISchedule>({
  vesselName: {
    type: String,
    required: [true, 'Please add a vessel name'],
    trim: true
  },
  vesselType: {
    type: String,
    required: [true, 'Please add vessel type'],
    trim: true
  },
  capacity: {
    type: String,
    required: [true, 'Please add vessel capacity'],
    trim: true
  },
  flag: {
    type: String,
    required: [true, 'Please add vessel flag'],
    trim: true
  },
  currentLocation: {
    type: String,
    required: [true, 'Please add current location'],
    trim: true
  },
  voyages: [VoyageSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for better query performance
ScheduleSchema.index({ vesselName: 1, createdAt: -1 });

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);
