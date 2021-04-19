// pages/userInfo/userInfo.js
import {upDateData} from '../../utils/dbAction';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qqNumber: '',
    phoneNumber: ''
  },

  inputControl(e) {
    this.setData({
      [e.target.dataset.type]: e.detail.value
    });
  },

  submit() {
    if (!this.data.qqNumber && !this.data.phoneNumber) {
      wx.showToast({title: '请填写完整信息', icon: 'none'});
      return;
    }

    upDateData('user', this.data._id, {
      userInfo: {
        qqNumber: this.data.qqNumber,
        phoneNumber: this.data.phoneNumber
      },

      cheeckedInfo: true
    }).then(() => wx.navigateBack());
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let params = JSON.parse(options.params);

    this.setData({
      _id: params._id
    });
  },

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
