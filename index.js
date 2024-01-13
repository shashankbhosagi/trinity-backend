const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
const entries = require("./routes/entries");
const forms = require("./routes/forms");
const cors = require("cors");
const connectDB = require("./db/connect");

//middle-ware
app.use(express.json());
app.use(cors());

//routes
app.use("/entries", entries);
app.use("/forms", forms);

app.get("/", (req, res) => {
  res.json({
    status: "running",
  });
});

//connect to db and backend
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
