import express from "express";
import apiRouter from "./routes/index.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api", apiRouter);
// app.use("/", (_, res) => {
//   res.redirect("/api/users");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
