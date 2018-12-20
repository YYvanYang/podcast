var config = require('../../config');
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  dealFormIds: function (formId) {
    let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: Date.now() + 60 * 60 * 24 * 7 * 1000
      //计算7天后的过期时间时间戳
    }
    formIds.push(data);//将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },
  //事件处理函数
  formSubmit: function (e) {
    let formId = e.detail.formId;
    console.log('formId:', formId)
    this.dealFormIds(formId); //处理保存推送码
    let type = e.detail.target.dataset.type;
    //根据type的值来执行相应的点击事件
    if (type === 'send') {
      wx.request({
        url: config.service.messageUrl,
        method: 'POST',
        data: {
          touser: app.globalData.userInfo.openid,
        },
        success(res) {
          console.log(res.data)
        }
      })
    } else if (type === 'save') {
      let formIds = app.globalData.gloabalFomIds;
      wx.request({
        url: config.service.collectUrl,
        method: 'POST',
        data: {
          openId: app.globalData.userInfo.openid,
          formIds
        },
        success(res) {
          console.log(res.data)
          app.globalData.gloabalFomIds = []
        }
      })
    } else if (type === 'collect') {

    }
    //...
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
