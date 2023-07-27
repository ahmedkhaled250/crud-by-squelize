import { userModel } from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
export const signup = async (req, res, next) => {
  try {
    const { userName, email, password, age, phone } = req.body;
    const user = await userModel.findOne({
      where: { email },
      attributes: ["email"],
    });
    if (user) {
      return res.status(409).json({ message: "This email already exist" });
    }
    const hashPassword = bcrypt.hashSync(password, 9);
    const addUser = await userModel.create({
      userName,
      email,
      password: hashPassword,
      age,
      phone,
    });
    return res.status(201).json({ message: "Done", user: addUser });
  } catch (err) {
    if (err?.original?.errno == 1062) {
      res.json({ message: "Email exist" });
    } else {
      return res.status(500).json({ message: "Catch error", err });
    }
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "This password is rong" });
    }
    const loginUser = await userModel.update(
      { active: true },
      {
        where: { email },
      }
    );
    if (loginUser) {
      return res.status(200).json({ message: "Done", user: loginUser });
    } else {
      return res.status(400).json({ message: "There is rong" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const logout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findOne({
      attributes: ["id", "userName", "email", "active"],
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    console.log(user);
    if (!user.active) {
      return res.status(400).json({ message: "Already you loged out" });
    }
    const logoudUser = await userModel.update(
      { active: false },
      {
        where: { id },
      }
    );
    if (!logoudUser[0]) {
      return res.status(400).json({ message: "There is rong" });
    } else {
      return res.status(200).json({ message: "Done", user: logoudUser });
    }
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
