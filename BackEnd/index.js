const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose
  .connect(
    "mongodb+srv://jkad:qazwsxedc@database.zspz9.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

app.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(401).json("Wrong Passowrd or Username");

    const password = await User.findOne({ password: req.body.password });

    !password && res.status(401).json("Passowrd didn't matched");

    res.status(200).json("Success");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log("Backend is running");
});