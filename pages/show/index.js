// miniprogram/pages/show/index.js
import {
  whereQuery,
  addData,
  upDateData
} from '../../utils/dbAction'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [

    ],
    swiperBackground: [{
      url: '../../images/ml.png'
    }, {
      url: '../../images/ml.png'
    }, {
      url: '../../images/WechatIMG3699.jpeg'
    }],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },

  preiviewImage(e) {
    wx.previewImage({
      urls: [e.target.dataset.imgurl]
    })
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
    whereQuery('products', {
      _id: 'first'
    }).then((res) => {
      this.setData({
        products: res[0].products
      })
    })
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