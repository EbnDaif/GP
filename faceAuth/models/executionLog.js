const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const executionLogSchema = new Schema({
  code: String,
  output: { type: String, default: "" },
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ["running", "completed"], default: "running" },
});

module.exports = mongoose.model("ExecutionLog", executionLogSchema);

