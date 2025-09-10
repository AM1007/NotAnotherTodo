import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize'; 
import { emailRegexp } from '../../constants/auth';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string | null;
  refreshToken: string | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'token' | 'refreshToken'>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public token!: string | null;
  public refreshToken!: string | null;

  // Timestamp поля от Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { 
        is: emailRegexp,
        isEmail: true
      },
    },
    password: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    token: { 
      type: DataTypes.TEXT, // TEXT для длинных JWT токенов
      allowNull: true, 
      defaultValue: null 
    },
    refreshToken: { 
      type: DataTypes.TEXT, // TEXT для длинных токенов
      allowNull: true, 
      defaultValue: null 
    },
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: true, // createdAt, updatedAt
    paranoid: false,  // Не используем soft delete пока
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  }
);

// Убираем User.sync() отсюда - будем синхронизировать в connectDb()

export default User;