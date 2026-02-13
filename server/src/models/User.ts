import mongoose, { Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// 🔐 Encrypt password before saving
UserSchema.pre('save', async function (next) {
  const user = this as HydratedDocument<IUser>;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

// 🧠 Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as HydratedDocument<IUser>;

  try {
    if (!user.password) return false;

    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

export default mongoose.model<IUser>('User', UserSchema);
