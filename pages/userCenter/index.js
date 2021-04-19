import {whereQuery} from '../../utils/dbAction';
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
    let interval = setInterval(async () => {
      if (app.globalData._openid) {
        clearInterval(interval);
        let userInfo = (await whereQuery('user', {}))[0];

        if (userInfo) {
          this.setData({userInfo});
        }

        if (userInfo.userInfo.phoneNumber) {
          let costHistory = await whereQuery('order', {phoneNumber: userInfo.userInfo.phoneNumber});
          let rechargeHistory = await whereQuery('recharge', {phoneNumber: userInfo.userInfo.phoneNumber});
          this.setData({costHistory, rechargeHistory});
        }
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
