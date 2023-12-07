// Encodes the password in the URI for mongoDB
const encodeURIPass = (uri) => {
  const sections = uri.replace('mongodb+srv://robot:', '');
  const pass = sections.split('@');
  const encodedPass = encodeURIComponent(pass[0]);
  return `mongodb+srv://robot:${encodedPass}@${pass[1]}`;
};

module.exports = encodeURIPass;
