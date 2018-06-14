const Product = require('./product');

module.exports = (sequelize, DataTypes) => {
  var Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    poNumber: DataTypes.STRING,
    soldTo: DataTypes.STRING,
    shipTo: DataTypes.STRING,
    modeOfTransport: DataTypes.STRING,
    // recurrence:
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {});
  Subscription.associate = function(models) {
    Subscription.hasMany(models.Product, { as: 'products', foreignKey: 'subscriptionId' });
  };
  return Subscription;
};