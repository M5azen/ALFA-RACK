const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database.js");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://127.0.0.1:5500", 
    "http://localhost:5500",
    "https://elrewiee-company.vercel.app"
  ],
  credentials: true
}));
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser()); 
// Routes

app.use("/user", userRouter);
app.use("/product", productRouter);
const PORT = process.env.PORT || 5001;
//mesa
db.once("open", () => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});

db.on("error", (err) => {
  console.error("MongoDB error:", err);
});