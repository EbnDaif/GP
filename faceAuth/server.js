const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const executionRoutes = require("./routes/execution");
const webSocketService = require("./services/webSocketService");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/online-code-compiler")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use("/api/execution", executionRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

webSocketService(server);
