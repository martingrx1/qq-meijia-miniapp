// miniprogram/pages/navigation/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        title: '日期设置',
        path: '/pages/setting-date/index'
      },
      {
        title: '预约管理',
        path: '/pages/home/admin/index'
      },
      {
        title: '美甲结算',
        path: '/pages/home/settlement/index'
      },
      {
        title: '余额充值',
        path: '/pages/home/recharge/index'
      },
      {
        title: '余额转结',
        path: '/pages/home/chargeTransfer/index'
      },
      {
        title: '充值消费查询',
        path: '/pages/home/orderQuery/index'
      },
      {
        title: '展览发布',
        path: '/pages/setting/index'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qq.authorize({
      scope: 'setting.addFriend',
      success() {
        // 用户已经同意小程序使用录音功能，后续调用 qq.startRecord 接口不会弹窗询问
      },
      fail: console.log
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
