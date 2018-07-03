const http = require("http.js");
function getHome() {
  return http.post("api/books/minioverview");
}
function getBooks(data){
  return http.post("api/books/minibooks",data);
}
function login(data){
  return http.commonPost("api/Login",data);
}
function verificationCode(data){
  return http.commonPost("api/VerificationCode/",data);
}
function authorize(data){
  return http.commonPost("api/Authorize/",data);
}

module.exports = {
  getHome,
  getBooks,
  login,
  verificationCode,
  authorize
};
