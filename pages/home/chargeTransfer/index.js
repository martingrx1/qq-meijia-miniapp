// miniprogram/pages/navigation/index.js
const app = getApp();
import { whereQuery, addData, upDateData } from '../../../utils/dbAction';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    style: '',
    phoneNumber: '',
    originCost: null,
    discountCost: null,
    date: '',
    userInfo: {}
  },

  inputControl(e) {
    this.setData({
      [e.target.dataset.type]: e.detail.value
    });
  },

  async submit() {
    try {
      let userInfo = (await whereQuery('user', { 'userInfo.phoneNumber': this.data.phoneNumber }))[0];
      if (!userInfo) {
        wx.showToast({ title: '未找到该顾客信息', icon: 'none' });
        return;
      }
      if (this.data.discountCost < 0) {
        wx.showToast({ title: '折扣价格式输入错误', icon: 'none' });
        return;
      }
      if (userInfo.balance - this.data.discountCost < 0) {
        wx.showToast({ title: '该顾客消费余额不足', icon: 'none' });
        return;
      }
      userInfo.balance -= this.data.discountCost;
      await upDateData('user', userInfo._id, { balance: userInfo.balance });
      await addData('order', {
        style: this.data.style,
        phoneNumber: this.data.phoneNumber,
        originCost: this.data.originCost,
        discountCost: this.data.discountCost,
        date: this.data.date
      });
      wx.showToast({ title: '操作成功', icon: 'success' });
      wx.navigateBack();
    } catch (e) {
      wx.showToast({ title: '出错了', icon: 'none' });
    }

    // if (!this.data.qqNumber && !this.data.phoneNumber) {
    //   wx.showToast({
    //     title: '请填写完整信息',
    //     icon: 'none'
    //   });
    //   return;
    // }
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
  onShow: function () {},

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
