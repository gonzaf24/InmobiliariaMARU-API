const formatFileNameToShow = (fileName) => {
  if (fileName) {
    const out = fileName.replace("https://alchimia.s3.us-east-2.amazonaws.com/", "");
    return out
  }
}

module.exports = formatFileNameToShow