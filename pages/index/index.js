//'use strict';
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    myopenid: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (wx.getStorageSync('MyOpenid').openid){
      this.setData({
        myopenid: wx.getStorageSync('MyOpenid').openid
      })
    }else{
      app.openidCallback = res => {
        this.setData({
          myopenid: res.openid
        })
      }
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onSignup: function() {
    // console.log(wx.getStorageSync('MyOpenid'));
    wx.request({
      url: 'https://' + app.config.host + '/onSignup',
      method: 'GET',
      data: {
        openid: this.data.myopenid,
        gender: 'strange',
        address: 'Zhejiang-Hanzhou',
        phonenumber: '0'
      },
      success: function(res) {
        if(!res.data.stat){
          wx.setStorageSync('MyOpenid', res.data);
          console.log(res.data);
        }else{
          console.log(res.data);
        }
      }
    })
  },
  onModify: function() {
    wx.request({
      url: 'https://' + app.config.host + '/onModify',
      method: 'GET',
      data: {
        openid: this.data.myopenid,
        gender: 'Male',
        address: 'Heibei-Cangzhou',
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.stat > 0){
          var data = wx.getStorageSync('MyOpenid');
          data.gender = 'Male';
          data.address = 'Heibei-Cangzhou';
          wx.setStorageSync('MyOpenid', data);
          console.log(wx.getStorageSync('MyOpenid'));
        }
      }
    })
  },
  onFetch: function() {
    wx.request({
      url: 'https://' + app.config.host + '/onFetch',
      method: 'GET',
      data: {
        openid: this.data.myopenid
      },
      success: function(res) {
        console.log(res.data);
        if(res.data.stat > 0){
          var data = wx.getStorageSync('MyOpenid');
          data.cur_pkg = res.data.pkgid;
          wx.setStorageSync('MyOpenid', data);
          console.log(wx.getStorageSync('MyOpenid'));
        }
      }
    })  
  }
})
