import express from 'express';
import { 
    getAllUsers,
    updateUser, 
    updateUserStatus, 
    updateUserRole,
    getAllRoles, 
    createRole, 
    updateRole,
    getAllCoursesAdmin,
    updateCourseStatus,
    getAdminDashboardStats,
    fetchUser
} from '../controllers/adminController.js';
import { deleteCourse } from '../controllers/instructorController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { getCourseDetail } from '../controllers/studentController.js';

const router = express.Router();

// All admin routes are protected
router.use(authenticate);
router.use(authorize(['admin'])); // Basic check, can be refined

// Dashboard Stats
router.get('/stats', getAdminDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id/fetch', fetchUser);
router.put('/users/:id/update', updateUser);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

// Role Management
router.get('/roles', getAllRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);

// Course Management
router.get('/courses', getAllCoursesAdmin);
router.get('/courses/:id', getCourseDetail);
router.patch('/courses/:id/status', updateCourseStatus);
router.delete('/courses/:id/delete', deleteCourse);

export default router;
