const crypto = require("crypto");

const generateEtag = (data) => {
  const hash = crypto.createHash("sha1");
  hash.update(JSON.stringify(data));
  return hash.digest("hex");
};

module.exports = generateEtag;
