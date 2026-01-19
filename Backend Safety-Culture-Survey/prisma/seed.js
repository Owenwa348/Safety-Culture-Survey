const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Check if SuperAdmin already exists
    const existingSuperAdmin = await prisma.superAdminList.findFirst({
        where: { email: 'superadmin@tunwa.com' }
    });

    if (existingSuperAdmin) {
        console.log('✅ SuperAdmin already exists');
        return;
    }

    // Create password hash for 'Admin@123'
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const hashedPin = await bcrypt.hash('123456', 10);

    // Create SuperAdmin
    const superAdmin = await prisma.superAdminList.create({
        data: {
            email: 'superadmin@tunwa.com',
            phone: '0812345678',
            password: hashedPassword,
            pin: hashedPin,
            role: 'Super Admin',
            status: 'ACTIVE',
        },
    });

    console.log('✅ SuperAdmin created successfully!');
    console.log('📧 Email: superadmin@tunwa.com');
    console.log('🔑 Password: Admin@123');
    console.log('📌 PIN: 123456');
    console.log('📞 Phone: 0812345678');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
