import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USERNAME, process.env.SQL_PASSWORD, {
  host: process.env.SQL_HOST,
  dialect: process.env.SQL_DIALECT,
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;