import {whereQuery} from '../../../utils/dbAction';
import {queryDoc} from '../../../utils/cloudFnAction';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    userBalance: 0,
    rechargeHistory: [],
    costHistory: [],
    userInfo: {}
  },

  inputControl(e) {
    this.setData({
      [e.target.dataset.type]: e.detail.value
    });
  },

  async submit() {
    try {
      let userInfo = (await queryDoc('user', {'userInfo.phoneNumber': this.data.phoneNumber}))[0];
      if (!userInfo) {
        wx.showToast({title: '未找到该顾客信息', icon: 'none'});
        return;
      }

      let rechargeHistory = await whereQuery('recharge', {phoneNumber: this.data.phoneNumber});
      let costHistory = await whereQuery('order', {phoneNumber: this.data.phoneNumber});

      this.setData({rechargeHistory, costHistory, userBalance: userInfo.balance});

      wx.showToast({title: '操作成功', icon: 'success'});
    } catch (e) {
      wx.showToast({title: '出错了', icon: 'none'});
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
