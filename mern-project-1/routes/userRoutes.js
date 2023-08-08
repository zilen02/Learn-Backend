const express = require("express");
const router = express.Router();
const path = require("path");
const {
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUser,
} = require("../controllers/usersControllers");

router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
