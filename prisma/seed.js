/**
 * FreeDocForge Database Seed Script
 * Pre-populates default demo and test credentials for Administrators and Users.
 * Run via: npm run db:seed  or  npx prisma db seed
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FreeDocForge database seed...");

  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
  const userPasswordHash = await bcrypt.hash("userpassword123", 10);

  // 1. Super Administrator Account
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@freedocforge.com" },
    update: {
      password: adminPasswordHash,
      role: "ADMIN",
      name: "System Administrator",
    },
    create: {
      name: "System Administrator",
      email: "admin@freedocforge.com",
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin Account: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Demo Shopkeeper / F-Commerce User
  const shopUser = await prisma.user.upsert({
    where: { email: "demo.shop@freedocforge.com" },
    update: {
      password: userPasswordHash,
      role: "USER",
      name: "Tanvir Fashion House",
      phone: "01711000001",
    },
    create: {
      name: "Tanvir Fashion House",
      email: "demo.shop@freedocforge.com",
      phone: "01711000001",
      password: userPasswordHash,
      role: "USER",
    },
  });

  await prisma.organizationProfile.deleteMany({
    where: { userId: shopUser.id },
  });

  await prisma.organizationProfile.create({
    data: {
      userId: shopUser.id,
      businessName: "Tanvir Fashion House",
      tagline: "Premium Quality Clothing & Fast Home Delivery",
      phone: "01711-000001",
      address: "Shop 42, Level 3, Eastern Plaza, Hatirpool, Dhaka",
      currency: "৳",
      terms: "Exchange within 7 days with invoice slip. Delivery charges are non-refundable.",
    },
  });
  console.log(`✅ Demo Shop User: ${shopUser.email} (Phone: ${shopUser.phone})`);

  // 3. Demo Doctor / Clinic User
  const doctorUser = await prisma.user.upsert({
    where: { email: "demo.doctor@freedocforge.com" },
    update: {
      password: userPasswordHash,
      role: "USER",
      name: "Dr. Arif Hossain",
      phone: "01811000002",
    },
    create: {
      name: "Dr. Arif Hossain",
      email: "demo.doctor@freedocforge.com",
      phone: "01811000002",
      password: userPasswordHash,
      role: "USER",
    },
  });

  await prisma.organizationProfile.deleteMany({
    where: { userId: doctorUser.id },
  });

  await prisma.organizationProfile.create({
    data: {
      userId: doctorUser.id,
      businessName: "Dr. Arif Hossain, MBBS, FCPS",
      tagline: "Consultant Physician - Green Life Medical Hospital",
      phone: "01811-000002",
      address: "Room 402, Green Life Medical, Green Road, Dhanmondi, Dhaka",
      currency: "৳",
      terms: "Follow-up consultation within 7 days is complimentary. Please bring previous investigation reports.",
    },
  });
  console.log(`✅ Demo Doctor User: ${doctorUser.email} (Phone: ${doctorUser.phone})`);

  // 4. Demo School / Institute User
  const schoolUser = await prisma.user.upsert({
    where: { email: "demo.school@freedocforge.com" },
    update: {
      password: userPasswordHash,
      role: "USER",
      name: "Ideal Coaching Center",
      phone: "01911000003",
    },
    create: {
      name: "Ideal Coaching Center",
      email: "demo.school@freedocforge.com",
      phone: "01911000003",
      password: userPasswordHash,
      role: "USER",
    },
  });

  await prisma.organizationProfile.deleteMany({
    where: { userId: schoolUser.id },
  });

  await prisma.organizationProfile.create({
    data: {
      userId: schoolUser.id,
      businessName: "Ideal Academic Coaching & Institute",
      tagline: "Excellence in Board Curriculum & Admission Prep",
      phone: "01911-000003",
      address: "House 12, Road 4, Mirpur-10, Dhaka-1216",
      currency: "৳",
      terms: "Preserve student admit card and marksheet slip for semester verification.",
    },
  });
  console.log(`✅ Demo School User: ${schoolUser.email} (Phone: ${schoolUser.phone})`);

  console.log("✨ FreeDocForge database seeded successfully with all demo credentials!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
