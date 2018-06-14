
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productId: DataTypes.STRING,
    quantity: DataTypes.DOUBLE,
    unitOfMeasurement: DataTypes.STRING,
  }, { timestamps: false });

  return Product;
};