import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const productModel = sequelize.define("Product", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
});
