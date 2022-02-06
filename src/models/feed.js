const DataTypes = require('sequelize');

module.exports = (db) => {
  const Feed = db.connection.define('feed', {
    feed_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      required: true,
      autoIncrement: true,
    }, feed_name: {
      type: DataTypes.STRING, required: true,
    }, url: {
      type: DataTypes.STRING, required: true,
    }, rating: {
      type: DataTypes.INTEGER,
    }, active: {
      type: DataTypes.BOOLEAN,
    }, description: {
      type: DataTypes.TEXT,
    },
  }, {
    schema: db.config.dbSchema,
  });
  return Feed;
};
