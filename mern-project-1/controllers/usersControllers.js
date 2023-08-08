const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { password: 0 });
  if (!users || !users.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const user = await User.findOne({ username }).lean().exec();

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    username,
    password: hashedPassword,
    roles,
  };

  const createdUser = await User.create(newUser);

  if (createdUser) {
    res.status(201).json({ message: "User created successfully" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const user = await User.findById(id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(400).json({ message: "Username already exists" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });

  if (updatedUser) {
    res.status(200).json({ message: "User updated successfully" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Please provide id" });
  }

  const user = await User.findById(id).lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = await User.findByIdAndDelete(id);

  if (deletedUser) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
