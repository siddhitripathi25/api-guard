import express from "express";
import { requestId } from "../src/index.js";

const app = express();

app.use(requestId());

app.get("/", (req, res) => {
  res.json({
    message: "API Guard is working!",
    requestId: req.requestId
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});