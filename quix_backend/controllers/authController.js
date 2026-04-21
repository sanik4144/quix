import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

export const register = async (req, res) => {
    try {
        const { fullName, email, password, roleName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Find role
        const role = await Role.findOne({ where: { name: roleName || 'Student' } });
        if (!role) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with PENDING state
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            roleId: role.id,
            status: 'PENDING'
        });

        res.status(201).json({
            message: 'Registration successful. Waiting for admin approval.',
            user: { id: user.id, fullName: user.fullName, email: user.email, status: user.status }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check status
        if (user.status !== 'APPROVED') {
            return res.status(403).json({
                message: `Your account is ${user.status.toLowerCase()}. Please contact admin.`,
                status: user.status,
                remarks: user.remarks
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.Role.name, permissions: user.Role.permissions },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.Role.name,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
