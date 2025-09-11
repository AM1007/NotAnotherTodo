import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';

interface TodoAttributes {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
}

type TodoCreationAttributes = Optional<TodoAttributes, 'id' | 'completed' | 'description'>;

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public completed!: boolean;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    tableName: 'Todos',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['userId', 'completed']
      }
    ]
  }
);

export default Todo;