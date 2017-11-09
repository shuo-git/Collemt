// pages/studio/studio.js
const util = require('../../utils/util.js')
const app = getApp()

//计时函数
var Timerstart = function () {
  var curP = getCurrentPages();
  var thisp = curP[curP.length - 1];//获取当前页面
  var timerID = setInterval(function () {
    thisp.setData({
      'view.ms': thisp.data.view.ms + 10
    });//每隔10ms更新数据
    if (thisp.data.view.ms === 1000) {
      thisp.setData({
        'view.second': thisp.data.view.second + 1,
        'view.ms': 0
      })
    }
    thisp.setData({
      'view.durstring': util.time2string(thisp.data.view.second, thisp.data.view.ms)
    });//得到输出的时间字符串
  }, 10);
  thisp.setData({
    'view.TimerID': timerID
  })//存储计时器ID，之后停的时候用
};

var dorecord = function() {
  var curP = getCurrentPages();
  var thisp = curP[curP.length - 1];
  thisp.setData({
    'view.second': 0,
    'view.ms': 0,
    'view.durstring': "0.00"
  })
  wx.startRecord({
    success: res => {
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success: res => {
          thisp.setData({
            'record.savedpath': res.savedFilePath
          })
        }
      })
    }
  })
  thisp.setData({
    recording: true
  })
  Timerstart();
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:{
      content:"",//内容
    },
    view: {
      second: 0, // 秒数
      ms: 0, //毫秒数
      TimerID: 0, //计时器ID
      durstring: "0.00" //计时字符串
    },
    record: {
      savedpath: "",
      size: 0
    },
    recording: false //是否正在录音
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.userInfo){
      this.setData({
        'text.content': "北京市海淀区清华大学紫荆公寓二号楼二一六寝室三号床"
      })
    }else{
      wx.showModal({
        title: '尚未登录',
        content: '请先登录Collemt',
        showCancel: false,
        success: function () {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  recordtap: function(){
    wx.getSetting({
      success: (res) => {
        if(res.authSetting['scope.record']){
          dorecord();
        }else{
          wx.authorize({
            scope: 'scope.record',
            success: res => {
              dorecord();
            }
          })
        }
      }
    })
  },

  stoprecordtap: function(){
    wx.stopRecord();
    clearInterval(this.data.view.TimerID);//停止计时
    this.setData({
      recording: false
    });
    wx.getSavedFileInfo({
      filePath: this.data.record.savedpath,
      success: res=>{
        var size_mb = res.size/1024;
        this.setData({
          'record.size': size_mb
        })
      },
      fail: ()=>{
        wx.showModal({
          title: '录音失败',
          content: '抱歉，请再尝试一次',
          showCancel: false,
        })
      }
    });
  },

  playvoice: function () {
    wx.playVoice({
      filePath: this.data.record.savedpath
    })
  },

  stopvoice: function () {
    wx.stopVoice();
  },

  uploadvoice: function () {
    wx.getStorage({
      key: 'MyOpenid',
      success: res => {
        console.log(res.data);
        wx.uploadFile({
          url: 'https://60755112.collemt.club/file_upload',
          filePath: this.data.record.savedpath,
          name: 'voices',
          formData: {
            pkgid: res.data.cur_pkg.toString(),
            line: '0',
            openid: res.data.openid,
            total: '1'//Str形式,'0'表示后面还有包，'1'表示后面没有包了
          },
          success: function (res2) {
            console.log(res2.data);
          }
        });
      }
    });
  }
})