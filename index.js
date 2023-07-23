import express from "express";
import { client } from "./db.js";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";

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

app.get("/api/food-arrya-segara", async (_req, res) => {
    const results = await client.query("select * from food");
    res.json(results.rows);
});

app.post("/api/akun", async (req, res) => {
    const result = await client.query("select username from login");
    let ada = false;
    result.rows.forEach(e => (e.username === req.body.username) ? ada = true : "");
    if (ada) {
        res.status(401);
        res.send("Username Sudah ada");
    } else {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password, salt);
        await client.query(
            `INSERT INTO login VALUES (default,'${req.body.username}', '${hash}','${req.body.name}')`
        );
        res.send("Akun berhasil ditambahkan.");
    }
});

app.post("/api/login", async (req, res) => {
    const result = await client.query(`select * from login where username = '${req.body.username}'`);

    if (result.rows.length === 1) {
        const check = await bcrypt.compare(req.body.password, result.rows[0].password);
        if (check) {
            const token = jwt.sign(result.rows[0], "rahasia");
            res.cookie("token", token);
            res.send("Berhasil login");
        } else {
            res.status(401);
            res.send("Kata sandi salah");
        }
    } else {
        res.send("Username Salah");
    }
});

app.listen(3000, console.log("Server ini terlah berjalan"));