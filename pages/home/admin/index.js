// miniprogram/pages/home/admin/index.js
import {
  whereQuery,
  addData,
  upDateData,
  getDataCount,
  coomand,
  command
} from '../../../utils/dbAction'
import {
  parseDateToTimestamp,
  findNearMonday
} from '../../../utils/date'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formattedData: [],
    originData: [

    ],
    timeQuantum: [

    ],
    subInfo: [

    ]

  },



  formatDate(dates) {
    let formatted = dates.map((v) => {
      return v.startTime + ' 至 ' + v.endTime
    })
    this.setData({
      formattedData: formatted,
      originData: dates
    })
  },
  formatSubscribe() { //格式化预约信息
    let tQ = this.data.timeQuantum;
    let formatted = tQ.map((v) => {
      return v.customers.map(c => {
        let subInfo = {};
        subInfo.userInfo = {
          _openid: c._openid,
          avatarUrl: c.avatarUrl,
          nickName: c.nickName
        }
        subInfo.subTimeOut = parseDateToTimestamp(c.subInfo.date) + 86400000 < new Date().getTime() ? true : false
        subInfo.clock = c.subInfo.clock;
        subInfo.date = c.subInfo.date
        return subInfo
      })
    }).flat(Infinity)
    console.log(formatted)
    this.setData({
      subInfo: formatted
    })
  },

  selectWeek() {
    wx.showActionSheet({
      itemList: this.data.formattedData,
      success: (r) => {
        whereQuery('subscribe', this.data.originData[r.tapIndex]).then((data) => {
          console.log(data)
          this.setData({
            timeQuantum: data[0].timeQuantum
          })
          this.formatSubscribe()
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      previousTimestamp
    } = findNearMonday(new Date().getTime())
    whereQuery('subscribe', {
      startTimestamp: command.gte(previousTimestamp)
    }, {
      _id: false,
      startTime: true,
      endTime: true
    }, 6).then(res => {
      console.log(res)
      this.formatDate(res)
     
    })
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

  }
})