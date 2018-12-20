/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://wx.yyvan.cn';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // save formIds
    collectUrl: `${host}/weapp/collect`,
    messageUrl: `${host}/weapp/message`,
    code2SessionUrl: `${host}/weapp/code2Session`

  }
};

module.exports = config;
