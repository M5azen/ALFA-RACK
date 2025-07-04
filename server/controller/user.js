const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const getCookies = require("../utils/cookies").getEntriesFromCookie;
const saltRounds = 10;
const domain = process.env.DOMAIN;
console.log("the domain " +domain);
// TODO 
// check the refresh token and if it is not vaild then logout the user and delete the cookies and redirect to login page 

function generateRefreshToken(user, expiresAt, isrefresh) {
  console.log(user);
  const { email, isAdmin } = user;
  return jwt.sign(
    { email, isAdmin },
    isrefresh
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: expiresAt,
    }
  );
}

exports.signupUser = async (req, res) => {
  const { userName, email, password } = req.body;
console.log(req.body);
  try {
    const checkEmail = await userModel.findOne({ email });
    const checkuserName = await userModel.findOne({ userName });

    if (checkEmail || checkuserName) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await userModel.create({ 
      userName,
      email: email,
      password: hashedPassword,
    });

    // Create an access token
    const jwtExpirationMinutes = 5 * 60000; // JWT token expiration time in minutes
    const refreshToken = generateRefreshToken(newUser, "1825d", true);
    const token = generateRefreshToken(newUser, jwtExpirationMinutes, false);
    const currentTime = new Date();
    const cookieExpiration = new Date(
      currentTime.getTime() + jwtExpirationMinutes
    );
    res.cookie("authcookie", token, {
      expires: cookieExpiration,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      domain,
      path: "/",
    });
    const refreshTokenExpirationYears = 1; // Refresh token expiration time in years
    const refreshTokenExpiration = new Date(
      currentTime.getTime() +
        refreshTokenExpirationYears * 365 * 24 * 60 * 60 * 1000
    );
    res.cookie("refreshToken", refreshToken, {
      expires: refreshTokenExpiration,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      domain,
      path: "/",
    });

    newUser.token = token;
    console.log("Sign up done");
    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { userName, password } = req.body;
console.log(req.body+" body");
  try {
    if (!(userName && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    const user = await userModel.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "userName does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Calculate the new time after adding 5 hours
    const fiveHoursInMilliseconds = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const newTime = new Date(Date.now() + fiveHoursInMilliseconds);

    // const domain = ".ahmed-yehia.me";
    const newTimeRefresh = new Date(Date.now() + 1000*60*60*24*399);

    // Set cookies for each domain
    const refreshToken = generateRefreshToken(user, "1825d", true);
    const token = generateRefreshToken(user, "1", false);

    res.cookie("authcookie", token, {
      expires: newTime,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      // domain for this https://www.egyequipments.cc/html/lightDuty.html#editor
      domain,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      expires: newTimeRefresh,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain,
      path: "/",
    });
   


    console.log("Logged in");
    return res.status(200).json({
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


