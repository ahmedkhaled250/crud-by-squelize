import { Op } from "sequelize";
import { productModel } from "../../../DB/models/product.model.js";
import { userModel } from "../../../DB/models/user.model.js";

export const addProduct = async (req, res, next) => {
  try {
    const { title, description, price, UserId } = req.body;
    const user = await userModel.findOne({
      where: { id: UserId },
      attributes: ["userName", "email", "active"],
    });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "You've to be loged in" });
    }
    const product = await productModel.create({
      title,
      description,
      price,
      UserId,
    });
    if (!product) {
      return res.status(400).json({ message: "There is rong" });
    }
    return res.status(201).json({ message: "Done", product });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, UserId } = req.body;
    const { id } = req.params;
    const user = await userModel.findOne({
      where: { id: UserId },
      attributes: ["userName", "email", "active"],
    });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "You've to be loged in" });
    }
    const product = await productModel.findOne({ where: { id, UserId } });
    if (!product) {
      return res.status(404).json({ message: "In-valid product" });
    }
    const updateProduct = await productModel.update(
      { title, description, price },
      { where: { id } }
    );
    if (updateProduct[0]) {
      return res.status(200).json({ message: "Done", updateProduct });
    } else {
      return res.status(400).json({ message: "There is rong" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { UserId } = req.body;
    const user = await userModel.findOne({
      where: { id: UserId },
      attributes: ["userName", "email", "active"],
    });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "You've to be loged in" });
    }
    const deleteProduct = await productModel.destroy({ where: { id, UserId } });
    if (!deleteProduct) {
      return res.status(404).json({ message: "In-valid product" });
    }
    return res.status(200).json({ message: "Done", deleteProduct });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const products = async (req, res, next) => {
  try {
    const products = await productModel.findAll({
      include: [
        {
          model: userModel,
          attributes: ["userName", "email", "active"],
        },
      ],
      attributes: ["id", "title", "description", "price", "UserId"],
    });
    if (!products.length) {
      return res.status(404).json({ message: "In-valid products" });
    }
    return res.status(200).json({ message: "Done", products });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOne({
      where: { id },
      include: [
        {
          model: userModel,
          attributes: ["userName", "email", "active"],
        },
      ],
      attributes: ["id", "title", "description", "price", "UserId"],
    });
    if (!product) {
      return res.status(404).json({ message: "In-valid product" });
    }
    return res.status(200).json({ message: "Done", product });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const getProductbByPrice = async (req, res, next) => {
  try {
    const { price } = req.params;
    const products = await productModel.findAll({
      where: { price: { [Op.gte]: price } },
      include: [
        { model: userModel, attributes: ["userName", "age", "phone", "email"] },
      ],
      attributes: ["title", "description", "price"],
    });
    if (!products.length) {
      return res.status(404).json({ message: "In-valid products" });
    } else {
      return res.status(200).json({ message: "Done", products });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const getProductbByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const products = await productModel.findAll({
      where: { title: { [Op.like]: `%${title}%` } },
      include: [
        { model: userModel, attributes: ["userName", "age", "phone", "email"] },
      ],
      attributes: ["title", "description", "price"],
    });
    if (!products.length) {
      return res.status(404).json({ message: "In-valid products" });
    } else {
      return res.status(200).json({ message: "Done", products });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
