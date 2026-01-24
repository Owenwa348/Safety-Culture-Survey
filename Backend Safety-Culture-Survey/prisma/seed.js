const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create password hash for 'Admin@123'
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const hashedPin = await bcrypt.hash('123456', 10);

    // Check if SuperAdmin already exists
    const existingSuperAdmin = await prisma.superAdminList.findFirst({
        where: { email: 'superadmin@tunwa.com' }
    });

    if (!existingSuperAdmin) {
        // Create SuperAdmin
        const superAdmin = await prisma.superAdminList.create({
            data: {
                email: 'superadmin@tunwa.com',
                phone: '0812345678',
                password: hashedPassword,
                pin: hashedPin,
                role: 'SuperAdmin',
                status: 'ACTIVE',
            },
        });

        console.log('✅ SuperAdmin created successfully!');
        console.log('📧 Email: superadmin@tunwa.com');
        console.log('🔑 Password: Admin@123');
        console.log('📌 PIN: 123456');
        console.log('📞 Phone: 0812345678');
    } else {
        console.log('✅ SuperAdmin already exists');
    }

    // Check if Admin already exists
    const existingAdmin = await prisma.adminList.findFirst({
        where: { email: 'admin@tunwa.com' }
    });

    if (!existingAdmin) {
        // Create Admin
        const admin = await prisma.adminList.create({
            data: {
                email: 'admin@tunwa.com',
                companyName: 'Tunwa Co., Ltd',
                firstName: 'Admin',
                lastName: 'User',
                phone: '0823456789',
                password: hashedPassword,
                role: 'Admin',
                status: 'ACTIVE',
            },
        });

        console.log('✅ Admin created successfully!');
        console.log('📧 Email: admin@tunwa.com');
        console.log('🔑 Password: Admin@123');
        console.log('📞 Phone: 0823456789');
        console.log('🏢 Company: Tunwa Co., Ltd');
    } else {
        console.log('✅ Admin already exists');
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
