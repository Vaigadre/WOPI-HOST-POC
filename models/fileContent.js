const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileContentSchema = new Schema(
  {
    fileName: { type: "String" },
    data: {},
    size: { type: "Number" },
    fileType: { type: "String" }
  },
  {
    versionKey: false
  }
);

const File = (module.exports = mongoose.model("File", FileContentSchema));
