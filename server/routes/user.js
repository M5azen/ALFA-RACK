const express = require("express");
const router = express.Router();

const {
  loginUser,
  signupUser
} = require("../controller/user");
// const {
//   verifyToken,
// } = require("../middleware/auth");
router.get("/", (req, res) => {
  res.send("User route");
});
router.post("/signup", signupUser);
router.post("/login", loginUser);
// router.use(verifyToken);

module.exports = router;
