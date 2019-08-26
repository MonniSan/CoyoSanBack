module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define("Goal", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    months: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },

    amountToBe: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false
    },
    amountAccumReal: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    id_user: {
      field: "id_user",
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      }
    }
  });

  Goal.associate = function(models) {
    Goal.belongsTo(models.User, {
      foreignKey: "id_user",
      sourceKey: "id"
    });
    Goal.hasMany(models.Saving, {
      foreignKey: "id_goal",
      sourceKey: "id"
    });
    Goal.hasOne(models.Sensei, {
      foreignKey: "id_goal",
      sourceKey: "id"
    });
  };
  return Goal;
};
