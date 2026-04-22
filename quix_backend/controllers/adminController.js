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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page-1) * limit;

    try {
        const { count, rows } = await User.findAndCountAll({
            include: [{ model: Role }],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        res.json({
            users: rows,
            totalUsers: count,
            totalPages: Math.ceil(count/limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetchUser = async (req, res)=>{
    try {
        const {id} = req.params;

        const user =await User.findByPk(id, {
            include: [{model: Role}]
        });
        if(!user) return res.status(404).json({message: "User not Found"})

        res.status(200).json({
            message: "Successfull",
            user: user,
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateUser = async (req, res)=>{
    try {
        const {id} = req.params;
        const {fullName, email, roleId, remarks} = req.body;

        const user = await User.findByPk(id);
        if(!user) return res.status(404).json({message: "User not found"});

        user.fullName = fullName;
        user.email = email;
        user.roleId = roleId;
        user.remarks = remarks;

        await user.save();

        res.status(200).json({message: "User updated successfully"});

    } catch (error) {
        res.json({ message: error.message});
    }
}

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
