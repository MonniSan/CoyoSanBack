const Goal = require("./goal");

module.exports = (sequelize, DataTypes) => {
  const Saving = sequelize.define("Saving", {
    amount: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false
    },
    id_goal: {
      type: DataTypes.INTEGER,
      references: {
        model: "Goals",
        key: "id"
      }
    }
  });

  Saving.associate = function(models) {
    Saving.belongsTo(models.Goal, {
      foreignKey: "id_goal",
      sourceKey: "id"
    });
  };

  Saving.afterCreate(async saving => {
    const goal = await sequelize.models.Goal.findOne({
      where: { id: saving.id_goal }
    });
    goal.amountAccumReal =
      parseFloat(goal.amountAccumReal) + parseFloat(saving.amount);
    goal.save();
  });

  return Saving;
};
