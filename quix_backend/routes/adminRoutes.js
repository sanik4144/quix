import express from 'express';
import { 
    getAllUsers, 
    updateUserStatus, 
    updateUserRole,
    getAllRoles, 
    createRole, 
    updateRole,
    getAllCoursesAdmin,
    updateCourseStatus,
    getAdminDashboardStats
} from '../controllers/adminController.js';
import { deleteCourse } from '../controllers/instructorController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected
router.use(authenticate);
router.use(authorize(['admin'])); // Basic check, can be refined

// Dashboard Stats
router.get('/stats', getAdminDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

// Role Management
router.get('/roles', getAllRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);

// Course Management
router.get('/courses', getAllCoursesAdmin);
router.patch('/courses/:id/status', updateCourseStatus);
router.delete('/courses/:id/delete', deleteCourse);

export default router;
