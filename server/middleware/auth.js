const getCookie = require("../utils/cookies").getEntriesFromCookie;
module.exports.verifyToken = async (req, res, next) => {
  const authcookie = getCookie(req);
  console.log(authcookie);
  if (!authcookie) {
    return res.status(403).send("A token is required for authentication");
  }
  if (!authcookie.isAdmin) {
    return res.status(401).send("Invalid Token you are not admin");
  }
  console.log("role verfied");
  next();
};