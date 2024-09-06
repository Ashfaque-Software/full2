const express = require("express");
const connection = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/user.Routes");
const snacksRouter=require("./routes/snacksRouter")
const orderRouter=require("./routes/orderRouter")
const detergentRouter=require("./routes/detergentRouter")

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/detergent", detergentRouter);
app.use("/snacks", snacksRouter);
app.use("/order", orderRouter);

const PORT = process.env.PORT || 4555;

app.get("/", (req, res) => {
    res.send("Server is running fine");
});

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
    }
});
