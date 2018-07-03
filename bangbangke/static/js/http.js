const _url = "http://api-miniapp-test.dushu.io/"; //"https://api-miniapp-test.dushu.io/";
const _header = {
  "content-type": "application/json"
};
const http = (url = "", param = {}, type = "GET", header = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url + url,
      data: param,
      header: header,
      method: type,
      success: res => {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          console.error("服务器端错误", res);
        }
      },
      fail: res => {
        reject(res);
      },
      complete: res => {
        wx.hideLoading(); // 关闭loading
      }
    });
  });
};

const get = (url = "", param = {}) => {
  return http(url, param, "GET", _header);
};

const post = (url = "", param = {}) => {
  let data = Object.assign(param, {
    token: "dc14b5aa808d4b0087af5f3b683b447d"
  });
  return http(url, data, "POST", _header);
};
const commonPost = (url = "", param = {}) => {
  return http(url, param, "POST", _header);
};

const update = (url = "", param = {}) => {
  return http(url, param, "PUT", _header);
};

const remove = (url = "", param = {}) => {
  return http(url, param, "DELETE", _header);
};
module.exports = {
  get,
  post,
  commonPost,
  update,
  remove
};
