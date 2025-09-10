import User from './models/User';

// Функция для инициализации всех моделей
export const initializeModels = async () => {
  // Пока что у нас только User модель
  // Все модели уже проинициализированы через import
  
  console.log('📦 Models initialized');
};

// Функция для настройки связей между моделями
export const setupAssociations = () => {
  // В будущем здесь будут связи между моделями
  // Пример:
  // User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
  // Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  console.log('🔗 Associations configured');
};

export default {
  User,
  // Здесь будут другие модели в будущем
};