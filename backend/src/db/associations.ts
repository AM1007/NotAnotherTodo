import User from './models/User';
import Todo from './models/Todo';

export const initializeModels = async () => {
  console.log('Models loaded');
};

export const setupAssociations = () => {
  User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
  Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  console.log('DB relations set up');
};

export default {
  User,
  Todo,
};