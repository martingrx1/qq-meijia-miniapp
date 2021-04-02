// miniprogram/pages/setting/index.js
import {whereQuery, addData, upDateData} from '../../utils/dbAction';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    costHistory: [],
    rechargeHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let interval = setInterval(() => {
      if (app.globalData._openid) {
        clearInterval(interval);
        whereQuery('user', {_openid: app.globalData._openid}).then(res => {
          console.log(res);
          this.setData({userInfo: res[0]});

          whereQuery('order', {phoneNumber: res[0].userInfo.phoneNumber}).then(res => {
            this.setData({costHistory: res});
            console.log(res);
          });
          whereQuery('recharge', {phoneNumber: res[0].userInfo.phoneNumber}).then(res => {
            this.setData({rechargeHistory: res});
            console.log(res);
          });
        });
      }
    }, 0);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});
