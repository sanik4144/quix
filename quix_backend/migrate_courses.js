import { Course } from './models/index.js';
import sequelize from './db/con.js';
import { Op } from 'sequelize';

async function fix() {
    try {
        const [updatedCount] = await Course.update(
            { status: 'APPROVED' },
            { where: { [Op.or]: [{ status: 'SUBMITTED' }, { status: 'PUBLISHED' }] } }
        );
        console.log(`Updated ${updatedCount} courses to APPROVED`);
        
        const all = await Course.findAll({ attributes: ['title', 'status'] });
        console.log('Current Courses:', JSON.stringify(all, null, 2));
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        process.exit();
    }
}

fix();
