const DataTypes = require('sequelize');

module.exports = (db) => {
  const Protocol = db.connection.define('protocol', {
    protocol_id: {
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
  return Protocol;
};
