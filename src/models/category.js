const DataTypes = require('sequelize');

module.exports = (db) => {
  const Category = db.connection.define('category', {
    category_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      required: true,
      autoIncrement: true,
    }, name: {
      type: DataTypes.STRING, required: true,
    }, description: {
      type: DataTypes.STRING, required: false,
    },
  }, {
    schema: db.config.dbSchema,
  });
  return Category;
};
