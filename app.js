import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
// // Gracefully close the server
// export const closeServer = () => {
//   return new Promise((resolve, reject) => {
//     app.close((err) => {
//       if (err) {
//         console.error("Error closing server:", err);
//         return reject(err);
//       }
//       console.log("Server closed successfully.");
//       resolve();
//     });
//   });
// };

export const server = app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
