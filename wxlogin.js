var config = require('./config');

let createNonceStr = function() {
  return Math.random()
    .toString(36)
    .substr(2, 15);
};

function wxlogin(app) {
  app.isLoginning = true;
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        let code = res.code;
        console.log('code:', code);
        wx.showLoading({
          mask: true,
          title: '登录中'
        });
        //发起网络请求
        wx.request({
          url: config.service.loginUrl,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code,
            random: createNonceStr()
          },
          success: res => {
            app.isLoginning = false;
            wx.hideLoading();

            if (res.statusCode === 401) {

                if (app.loginFailCallback) {

                  app.loginFailCallback(res, '登录会话过期,请刷新页面');
                }
                return
            }

            if (res.statusCode === 200) {
              let sessionId = res.data.data.session;
              console.log(sessionId);
              app.globalData.sessionId = sessionId;

              if (app.loginSuccessCallback) {
                console.log(
                  'global loginUrl loginSuccessCallback,',
                  app.loginSuccessCallback
                );
                app.loginSuccessCallback(res);
              }
            } else {
              if (app.loginFailCallback) {
                console.log(
                  'global loginUrl loginFailCallback,',
                  app.loginFailCallback
                );
                app.loginFailCallback(res);
              }
            }
          },
          fail: (res) => {
            app.isLoginning = false;
            wx.hideLoading();

            if (app.loginFailCallback) {
              console.log(
                'global loginUrl loginFailCallback,',
                app.loginFailCallback
              );
              app.loginFailCallback(res);
            }
          }
        });
      } else {
        app.isLoginning = false;
        if (app.loginFailCallback) {
          console.log('global login loginFailCallback,', app.loginFailCallback);
          app.loginFailCallback(res);
        }
        console.log('登录失败！' + res.errMsg);
      }
    }
  });
}

module.exports = wxlogin;
