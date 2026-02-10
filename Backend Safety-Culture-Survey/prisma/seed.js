const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // --- Seeding Positions, Departments, WorkGroups, Experiences ---
    
    // 1. Seed Positions (ตําแหน่งงาน)
    const positionData = [
        'ผู้บริหารระดับสูง / ผู้จัดการส่วน',
        'ผู้จัดการแผนก / ผู้จัดการ',
        'พนักงานอาวุโส',
        'พนักงาน',
        'ผู้รับเหมาประจำ'
    ];
    console.log('Seeding Positions...');
    for (const name of positionData) {
        const existing = await prisma.position.findFirst({ where: { name } });
        if (!existing) {
            await prisma.position.create({ data: { name } });
            console.log(` -> Created Position: ${name}`);
        }
    }
    console.log('✅ Positions are up to date.');

    // 2. Seed Departments (สายงาน)
    const departmentData = ['CEO', 'REP', 'COO', 'CFO', 'SSE', 'PSE', 'CME'];
    console.log('Seeding Departments...');
    for (const name of departmentData) {
        const existing = await prisma.department.findFirst({ where: { name } });
        if (!existing) {
            await prisma.department.create({ data: { name } });
            console.log(` -> Created Department: ${name}`);
        }
    }
    console.log('✅ Departments are up to date.');

    // 3. Seed WorkGroups (กลุ่มงาน)
    const workGroupData = [
        'หน่วยงานเดินเครื่อง (Operation)',
        'หน่วยงานบำรุงรักษา (Maintenance)',
        'หน่วยงานวิศวกรรม (Engineering)',
        'หน่วยงานสนับสนุน (Supporting functions)'
    ];
    console.log('Seeding WorkGroups...');
    for (const name of workGroupData) {
        const existing = await prisma.workGroup.findFirst({ where: { name } });
        if (!existing) {
            await prisma.workGroup.create({ data: { name } });
            console.log(` -> Created WorkGroup: ${name}`);
        }
    }
    console.log('✅ WorkGroups are up to date.');

    // 4. Seed Experiences (อายุงาน)
    const experienceData = [
        '0-3 ปี',
        '3 ปีขึ้นไป แต่ไม่เกิน 5 ปี',
        '5 ปีขึ้นไป แต่ไม่เกิน 10 ปี',
        '10 ปีขึ้นไป แต่ไม่เกิน 15 ปี',
        'มากกว่า 15 ปีขึ้นไป'
    ];
    console.log('Seeding Experiences...');
    for (const name of experienceData) {
        const existing = await prisma.experience.findFirst({ where: { name } });
        if (!existing) {
            await prisma.experience.create({ data: { name } });
            console.log(` -> Created Experience: ${name}`);
        }
    }
    console.log('✅ Experiences are up to date.');


    // 6. Seed User Excel (รายชื่อผู้ประเมิน)
    console.log('Seeding User Excel...');
    const userExcelData = [];
    const companies = ['Safety First Ltd.', 'Secure Works Inc.'];
    const divisions = ['Operations', 'Maintenance', 'Engineering', 'Support'];

    for (const company of companies) {
        for (let i = 1; i <= 20; i++) {
            const email = `${company.toLowerCase().replace(/ /g, '_').replace('.', '')}_user${i}@example.com`;
            userExcelData.push({
                email_user: email,
                company_user: company,
                division_user: divisions[Math.floor(i / 10)] // Assign divisions somewhat evenly
            });
        }
    }

    for (const userData of userExcelData) {
        const existingUser = await prisma.user_excel.findUnique({
            where: { email_user: userData.email_user },
        });

        if (!existingUser) {
            await prisma.user_excel.create({
                data: userData,
            });
            console.log(` -> Created User Excel: ${userData.email_user}`);
        }
    }
    console.log('✅ User Excel is up to date.');


    // 7. Seed Sample Registered Users (ผู้ประเมินที่ลงทะเบียนแล้ว)
    console.log('Seeding Sample Registered Users...');

    // Fetch positions, departments, workgroups, experiences for reference
    const allPositions = await prisma.position.findMany();
    const allDepartments = await prisma.department.findMany();
    const allWorkGroups = await prisma.workGroup.findMany();
    const allExperiences = await prisma.experience.findMany();

    const sampleRegisteredUsers = [
        {
            title_user: 'นาย',
            name_user: 'สมชาย ใจดี',
            email_user: 'safety_first_ltd_user1@example.com',
            company_user: 'Safety First Ltd.',
            phone_user: '0811111111',
            password_user: await bcrypt.hash('User@123', 10),
            position_user: allPositions[3]?.name || 'พนักงาน',
            job_field_user: allDepartments[0]?.name || 'CEO',
            work_group_user: allWorkGroups[0]?.name || 'หน่วยงานเดินเครื่อง (Operation)',
            years_of_service: allExperiences[0]?.name || '0-3 ปี',
            section_user: 'Operations',
            status: 'active',
            surveyStatus: 'done' // ทำแบบประเมินเสร็จแล้ว
        },
        {
            title_user: 'นาง',
            name_user: 'วิไล สุขสันต์',
            email_user: 'safety_first_ltd_user2@example.com',
            company_user: 'Safety First Ltd.',
            phone_user: '0822222222',
            password_user: await bcrypt.hash('User@123', 10),
            position_user: allPositions[2]?.name || 'พนักงานอาวุโส',
            job_field_user: allDepartments[1]?.name || 'REP',
            work_group_user: allWorkGroups[1]?.name || 'หน่วยงานบำรุงรักษา (Maintenance)',
            years_of_service: allExperiences[2]?.name || '5 ปีขึ้นไป แต่ไม่เกิน 10 ปี',
            section_user: 'Operations',
            status: 'active',
            surveyStatus: 'in_progress' // กำลังทำแบบประเมิน
        },
        {
            title_user: 'นาย',
            name_user: 'ประสิทธิ์ วิริยะ',
            email_user: 'safety_first_ltd_user3@example.com',
            company_user: 'Safety First Ltd.',
            phone_user: '0833333333',
            password_user: await bcrypt.hash('User@123', 10),
            position_user: allPositions[1]?.name || 'ผู้จัดการแผนก / ผู้จัดการ',
            job_field_user: allDepartments[2]?.name || 'COO',
            work_group_user: allWorkGroups[2]?.name || 'หน่วยงานวิศวกรรม (Engineering)',
            years_of_service: allExperiences[3]?.name || '10 ปีขึ้นไป แต่ไม่เกิน 15 ปี',
            section_user: 'Maintenance',
            status: 'active',
            surveyStatus: 'not_started' // ยังไม่เริ่มทำแบบประเมิน
        },
        {
            title_user: 'นางสาว',
            name_user: 'ศิริพร เจริญสุข',
            email_user: 'secure_works_inc_user1@example.com',
            company_user: 'Secure Works Inc.',
            phone_user: '0844444444',
            password_user: await bcrypt.hash('User@123', 10),
            position_user: allPositions[0]?.name || 'ผู้บริหารระดับสูง / ผู้จัดการส่วน',
            job_field_user: allDepartments[3]?.name || 'CFO',
            work_group_user: allWorkGroups[3]?.name || 'หน่วยงานสนับสนุน (Supporting functions)',
            years_of_service: allExperiences[4]?.name || 'มากกว่า 15 ปีขึ้นไป',
            section_user: 'Operations',
            status: 'active',
            surveyStatus: 'done'
        },
        {
            title_user: 'นาย',
            name_user: 'อนุชา พัฒนา',
            email_user: 'secure_works_inc_user2@example.com',
            company_user: 'Secure Works Inc.',
            phone_user: '0855555555',
            password_user: await bcrypt.hash('User@123', 10),
            position_user: allPositions[4]?.name || 'ผู้รับเหมาประจำ',
            job_field_user: allDepartments[4]?.name || 'SSE',
            work_group_user: allWorkGroups[0]?.name || 'หน่วยงานเดินเครื่อง (Operation)',
            years_of_service: allExperiences[1]?.name || '3 ปีขึ้นไป แต่ไม่เกิน 5 ปี',
            section_user: 'Maintenance',
            status: 'active',
            surveyStatus: 'not_started'
        }
    ];

    for (const userData of sampleRegisteredUsers) {
        const existingUser = await prisma.user.findUnique({
            where: { email_user: userData.email_user },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: userData,
            });
            console.log(` -> Created User: ${userData.name_user} (${userData.email_user})`);
        }
    }

    console.log('✅ Sample Registered Users are up to date.');
    console.log('🔑 Sample User Password: User@123');


    // Seed Categories, Questions, and Options
    const categoriesData = [
        {
            name: 'ภาวะผู้นำและความมุ่งมั่น',
            questions: [
                { text: 'ผู้บริหารระดับสูงแสดงให้เห็นถึงความมุ่งมั่นในเรื่องความปลอดภัยอย่างชัดเจน' },
                { text: 'ผู้จัดการ/หัวหน้างาน ให้ความสำคัญกับความปลอดภัยเทียบเท่ากับเป้าหมายการผลิต' },
                { text: 'มีการสื่อสารเรื่องความปลอดภัยจากผู้บริหารสู่พนักงานอย่างสม่ำเสมอ' },
                { text: 'ผู้บริหารรับฟังและให้ความสำคัญกับข้อเสนอแนะด้านความปลอดภัยจากพนักงาน' },
            ]
        },
        {
            name: 'การมีส่วนร่วมของพนักงาน',
            questions: [
                { text: 'พนักงานมีส่วนร่วมในการระบุอันตรายและประเมินความเสี่ยง' },
                { text: 'พนักงานรู้สึกสบายใจที่จะรายงานเหตุการณ์ผิดปกติ (unsafe acts/conditions) โดยไม่ต้องกังวลว่าจะถูกตำหนิ' },
                { text: 'ข้อเสนอแนะด้านความปลอดภัยของพนักงานได้รับการตอบสนองและนำไปปฏิบัติ' },
                { text: 'พนักงานมีส่วนร่วมในกิจกรรมส่งเสริมความปลอดภัยต่างๆ' },
            ]
        },
        {
            name: 'การสื่อสารด้านความปลอดภัย',
            questions: [
                { text: 'มีการสื่อสารข้อมูลเกี่ยวกับความปลอดภัยที่ชัดเจนและเข้าใจง่าย' },
                { text: 'มีการประชุมหรือพูดคุยเรื่องความปลอดภัย (safety talk) อย่างสม่ำเสมอ' },
                { text: 'ช่องทางการสื่อสารด้านความปลอดภัยเข้าถึงได้ง่ายสำหรับทุกคน' },
                { text: 'พนักงานรับทราบถึงผลการสอบสวนอุบัติเหตุและมาตรการป้องกัน' },
            ]
        },
        {
            name: 'สภาพแวดล้อมและขั้นตอนการทำงานที่ปลอดภัย',
            questions: [
                { text: 'บริษัทจัดหาอุปกรณ์ป้องกันส่วนบุคคล (PPE) ที่เหมาะสมและเพียงพอ' },
                { text: 'ขั้นตอนการทำงานมีความชัดเจนและคำนึงถึงความปลอดภัยเป็นหลัก' },
                { text: 'มีการตรวจสอบและบำรุงรักษาเครื่องมือและอุปกรณ์ให้อยู่ในสภาพที่ปลอดภัยเสมอ' },
                { text: 'สภาพแวดล้อมในการทำงานมีความสะอาดและเป็นระเบียบ' },
            ]
        },
        {
            name: 'การเรียนรู้และพัฒนาด้านความปลอดภัย',
            questions: [
                { text: 'บริษัทมีการฝึกอบรมด้านความปลอดภัยที่เหมาะสมกับลักษณะงาน' },
                { text: 'พนักงานใหม่ได้รับการปฐมนิเทศเรื่องความปลอดภัยอย่างครบถ้วน' },
                { text: 'มีการทบทวนและปรับปรุงขั้นตอนการทำงานด้านความปลอดภัยอย่างต่อเนื่อง' },
                { text: 'มีการเรียนรู้จากอุบัติการณ์และเหตุการณ์เกือบเกิดอุบัติเหตุเพื่อป้องกันการเกิดซ้ำ' },
            ]
        }
    ];

    const optionsData = [
        { text: 'น้อยที่สุด' },
        { text: 'น้อย' },
        { text: 'ปานกลาง' },
        { text: 'มาก' },
        { text: 'มากที่สุด' },
    ];

    for (const categoryData of categoriesData) {
        // Find if a category with questions already exists to avoid duplication
        const existingCategory = await prisma.category.findFirst({
            where: { 
                name: categoryData.name,
                questions: {
                    some: {} // check if there are any questions linked to it
                }
            }
        });

        if (!existingCategory) {
            await prisma.category.create({
                data: {
                    name: categoryData.name,
                    questions: {
                        create: categoryData.questions.map(questionData => ({
                            text: questionData.text,
                            options: {
                                create: optionsData
                            }
                        }))
                    }
                },
                include: {
                    questions: {
                        include: {
                            options: true
                        }
                    }
                }
            });
        }
    }

    console.log('✅ Categories, Questions, and Options seeded');


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
        console.log('✅ Admin already exists.');
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