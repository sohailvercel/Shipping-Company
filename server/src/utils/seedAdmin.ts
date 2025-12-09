import User from '../models/User';

export default async function seedAdmin(): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('seedAdmin: ADMIN_EMAIL or ADMIN_PASSWORD not set - skipping admin seeding');
      return;
    }

    const email = adminEmail.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`seedAdmin: promoted existing user ${email} to admin`);
      } else {
        console.log(`seedAdmin: admin ${email} already exists`);
      }
      return;
    }

    const user = await User.create({
      email,
      password: adminPassword,
      role: 'admin'
    });

    console.log(`seedAdmin: created admin ${user.email}`);
  } catch (err) {
    console.error('seedAdmin error:', err);
  }
}