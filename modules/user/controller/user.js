import { Op } from "sequelize";
import { userModel } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import { productModel } from "../../../DB/models/product.model.js";
export const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, email, phone, age } = req.body;
    const userById = await userModel.findOne({
      attributes: ["active"],
      where: { id },
    });
    if (!userById) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (!userById.active) {
      return res.status(400).json({ message: "You've to be loged in" });
    }
    if (email) {
      const userByEmail = await userModel.findOne({
        where: { email },
        attributes: ["email"],
      });
      if (userByEmail) {
        return res.status(409).json({ message: "This email already exist" });
      }
    }
    const updateUser = await userModel.update(
      { userName, email, phone, age },
      { where: { id } }
    );
    if (!updateUser[0]) {
      return res.status(400).json({ message: "There is rong" });
    } else {
      return res.status(200).json({ message: "Done", user: updateUser });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, password } = req.body;
    const { id } = req.params;
    const user = await userModel.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "You've to be loged in" });
    }
    if (!password && !oldPassword) {
      return res
        .status(400)
        .json({ message: "The pasword and the oldPassword are required" });
    }
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "This pasword is rong" });
    }
    const hashPassword = bcrypt.hashSync(password, 9);
    const updatePassword = await userModel.update(
      { password: hashPassword },
      { where: { id } }
    );
    if (!updatePassword[0]) {
      return res.status(400).json({ message: "There is rong" });
    } else {
      return res.status(200).json({ message: "Done", updatePassword });
    }
  } catch (error) {
    return res.status(500).json({ message: "Catch error", error });
  }
};
export const deleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (!user.active) {
      return res.status(400).json({ message: "You've to be loged in" });
    }
    const deleteUser = await userModel.destroy({ where: { id } });
    if (deleteUser) {
      return res.status(200).json({ message: "Done", deleteUser });
    } else {
      return res.status(400).json({ message: "There is rong" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({
      where: { id },
      attributes: ["userName", "email", "phone", "age", "active"],
      include: [
        {
          model: productModel,
          attributes: ["title", "description", "price"],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Iv-valid user" });
    } else {
      return res.status(200).json({ message: "Done", user });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const allUsers = async (req, res) => {
  try {
    const users = await userModel.findAll({
      include: [
        {
          model: productModel,
          attributes: ["title", "description", "price"],
        },
      ],
    });
    if (!users.length) {
      return res.status(404).json({ message: "Iv-valid user" });
    } else {
      return res.status(200).json({ message: "Done", users });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const searshByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const users = await userModel.findAll({
      where: { userName: { [Op.like]: `%${name}%` } },
      include: [
        {
          model: productModel,
          attributes: ["title", "description", "price"],
        },
      ],
    });
    if (!users.length) {
      return res.status(404).json({ message: "Iv-valid users" });
    } else {
      return res.status(200).json({ message: "Done", users });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const searshByAge = async (req, res, next) => {
  try {
    const { age } = req.params;
    const users = await userModel.findAll({
      where: { age: { [Op.gte]: age } },
      include: [
        {
          model: productModel,
          attributes: ["title", "description", "price"],
        },
      ],
    });
    if (!users.length) {
      return res.status(404).json({ message: "Iv-valid users" });
    } else {
      return res.status(200).json({ message: "Done", users });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
