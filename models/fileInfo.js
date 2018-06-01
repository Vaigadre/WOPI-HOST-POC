const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileInfoSchema = new Schema(
  {
    BaseFileName: { type: "String" },
    OwnerId: { type: "String", default: "tricon" },
    Size: { type: "Number" },
    UserId: { type: "String", default: "test_user" },
    Version: { type: "String", default: "1" },
    fileStorageId: { type: "String" },
    LockValue: { type: "String" },
    LockExpires: { type: "Date" }
  },
  { versionKey: false, timestamps: true,  }
);

const FileInfo = (module.exports = mongoose.model("FileInfo", FileInfoSchema));
