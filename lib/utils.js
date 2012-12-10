var utils = {};

utils.humanBytes = function (bytes) {
  var size = bytes.toString().length;
  if (size > 9) return (bytes/1000000000).toFixed(1)+" GB";
  if (size > 6) return (bytes/1000000).toFixed(1)+" MB";
  if (size > 3) return (bytes/1000).toFixed(1)+" KB";
  return bytes+" B";
};


module.exports = utils;
