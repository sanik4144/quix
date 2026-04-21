import { User, Role, Course, Enrollment } from '../models/index.js';

// Admin Dashboard Stats
export const getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalCourses = await Course.count();
        const pendingApprovals = await User.count({ where: { status: 'PENDING' } });
        const totalEnrollments = await Enrollment.count();

        res.json({
            totalUsers,
            totalCourses,
            pendingApprovals,
            totalEnrollments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Management
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Role }],
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = status;
        user.remarks = remarks || user.remarks;
        await user.save();

        res.json({ message: `User status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.roleId = roleId;
        await user.save();

        const updatedUser = await User.findByPk(id, {
            include: [{ model: Role }],
            attributes: { exclude: ['password'] }
        });

        res.json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Role Management
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const role = await Role.create({ name, permissions });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;
        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        role.name = name || role.name;
        role.permissions = permissions || role.permissions;
        await role.save();

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Course Oversight
export const getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{ model: User, as: 'instructor', attributes: ['fullName', 'email'] }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourseStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        const course = await Course.findByPk(id);
        if(!course) return res.status(404).json({message: "Course Not Found"});

        course.status = status;
        await course.save();

        res.json({
            message: `Course Status Updated to ${status}`,
            course
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
