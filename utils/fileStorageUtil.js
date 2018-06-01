const request = require("request");
const fs = require("fs");
const config = require("../config/officeConfig");
const app = require("../app");
const streamBuffers = require("stream-buffers");
const crypto = require("crypto");
const File = require("../models/fileContent");
const FileInfo = require("../models/fileInfo");
const getExpiryTime = require("../utils/wopiUtil").getExpiryTime;

module.exports.getFile = async function(fileInfo) {
  const fileData = await File.findOne({ _id: fileInfo.fileStorageId });
  return fileData.data.buffer;
};

module.exports.getFileInfo = async function(fileId) {
  const fileData = await FileInfo.findById({ _id: fileId });
  return fileData;
};

module.exports.savefile = async function(file) {
  if (!file) {
    return "file not available";
  }
  const newFile = {
    data: file.buffer,
    fileName: file.originalname,
    size: file.size,
    fileType: file.mimetype
  };

  const newFileInfo = {
    BaseFileName: file.originalname,
    Size: file.size,
    LockExpires: getExpiryTime()
    // fileStorageId: { type: "String" },
  };

  const savedFile = await File.create(newFile);
  newFileInfo.fileStorageId = savedFile.id;
  const fileInfo = await FileInfo.create(newFileInfo);
  return fileInfo;
};

module.exports.updateFileInfo = async function(fileInfo) {
  const updatedFile = await FileInfo.findByIdAndUpdate(
    { _id: fileInfo._id },
    fileInfo,
    { new: true }
  );
  return updatedFile;
};

//module.exports.getFile =

// module.exports.getFile = function(accessToken, fileId, res) {
//   var name =
//     "upload_" +
//     new Date().toLocaleString().replace(/[^a-zA-Z0-9]/g, "") +
//     ".xlsx";
//   fs.readFile("questions.xlsx", (err, data) => {
//     if (err) {
//       res.send(err);
//     }
//     sendRes(data);
//   });

//   function sendRes(buf) {
//     File.create({ fileName: name, data: buf })
//       .then(result => {
//         fs.writeFile(result.fileName, result.data, err => {
//           if (err) {
//             res.send(err);
//           }
//           //   res.send("done");
//         });
//         res.send(result);
//       })
//       .catch(err => {
//         res.send(err);
//       });
//     // fs.writeFile(name, buf, err => {
//     //   if (err) {
//     //     res.send(err);
//     //   }
//     //   res.send("done");
//     // });
//   }
// };

// module.exports.uploadFile = function(accessToken, res) {
//   var name =
//     "upload_" +
//     new Date().toLocaleString().replace(/[^a-zA-Z0-9]/g, "") +
//     ".xlsx";
//   const uploadFile = fs.createReadStream("./copyFile.xlsx", {
//     highWaterMark: 500
//   });
//   request.put(
//     `https://graph.microsoft.com/v1.0/users/${
//       config.userId
//     }/drive/root:/${name}:/content`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`
//       },
//       body: uploadFile
//     },
//     (err, response, body) => {
//       if (err) {
//         throw err;
//       }
//       res.json(body);
//     }
//   );
// };

//const downloadFile = fs.createWriteStream("./copyFile.xlsx");
//const storeFile = fs.createWriteStream("./copy.xlsx");
//const buf1 = Buffer.alloc(12);
// request(
//   `https://graph.microsoft.com/v1.0/users/${
//     config.userId
//   }/drive/items/${fileId}/content`,
//   {
//     headers: {
//       Authorization: `Bearer ${accessToken}`
//       //  ,         "Content-Type": "application/json"
//     }
//   }
// ).pipe();
//var buf = crypto.randomBytes(25);
