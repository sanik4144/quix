import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Role, User } from '../models/index.js';
import sequelize from '../db/con.js';

const seed = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database connected and synced.");

        // Create Default Roles
        const roles = [
            {
                name: 'Super Admin',
                permissions: {
                    all: true
                }
            },
            {
                name: 'Admin',
                permissions: {
                    users: { view: true, edit: true, approve: true, delete: true },
                    roles: { view: true, create: true, edit: true, delete: true },
                    courses: { view: true, approve: true, delete: true },
                }
            },
            {
                name: 'Instructor',
                permissions: {
                    courses: { view: true, create: true, edit: true, delete: true },
                    lessons: { view: true, create: true, edit: true, delete: true },
                    quizzes: { view: true, create: true, edit: true, delete: true },
                }
            },
            {
                name: 'Student',
                permissions: {
                    courses: { view: true, enroll: true },
                    quizzes: { attempt: true },
                }
            }
        ];

        for (const roleData of roles) {
            await Role.findOrCreate({
                where: { name: roleData.name },
                defaults: roleData
            });
        }
        console.log("Roles initialized.");

        // Create Super Admin User
        const superAdminRole = await Role.findOne({ where: { name: 'Super Admin' } });
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await User.findOrCreate({
            where: { email: 'admin@quix.com' },
            defaults: {
                fullName: 'Super Admin',
                email: 'admin@quix.com',
                password: hashedPassword,
                roleId: superAdminRole.id,
                status: 'APPROVED'
            }
        });
        console.log("Super Admin created (admin@quix.com / admin123).");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
