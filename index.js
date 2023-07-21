import express from "express";
import { client } from "./db.js";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//     res.type('application/javascript');
//     next();
// });
// const corsOptions = {
//     origin: "https://whats-al.vercel.app", // Ganti dengan domain Anda
//     credentials: true
// // };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Men

app.get("/api/food", async (req, res) => {
    console.log("ssss");
    const results = await client.query("select * from food");
    console.log(results.rows)
    res.json(results.rows);
})


app.listen(3000, console.log("Server ini terlah berjalan"));