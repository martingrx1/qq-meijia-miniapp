// miniprogram/pages/home/admin/index.js
import {whereQuery, command, upDateData} from '../../../utils/dbAction';
import {parseDateToTimestamp, findNearMonday, getTodayCnName} from '../../../utils/date';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formattedData: [],
    originData: [],
    timeQuantum: [],
    subInfo: []
  },

  formatDate(dates) {
    let formatted = dates.map(v => {
      return v.startTime + ' 至 ' + v.endTime;
    });
    this.setData({
      formattedData: formatted,
      originData: dates
    });
  },
  formatSubscribeInfo() {
    //格式化预约信息
    let tQ = this.data.timeQuantum;
    let formatted = tQ
      .map(v => {
        return v.customers
          .map((c, subOrder) => {
            let subInfo = {};
            subInfo.userInfo = {
              _openid: c._openid,
              avatarUrl: c.avatarUrl,
              nickName: c.nickName,
              qqNumber: c.qqNumber
            };

            let timeoutStamp = parseDateToTimestamp(c.subInfo.date, c.subInfo.clock.split('-')[1]);

            subInfo.subTimeOut = timeoutStamp < new Date().getTime() ? true : false; //预约过期
            subInfo.orderStamp = parseDateToTimestamp(c.subInfo.date, c.subInfo.clock.split('-')[0]); //按照预约时间排序

            subInfo.clock = c.subInfo.clock; //预约时间段
            subInfo.cnDayName = getTodayCnName(timeoutStamp);
            subInfo.date = c.subInfo.date; //预约日
            subInfo.subDayIndex = c.subDayIndex; //预约日下表
            subInfo.subOrder = subOrder; //预约日下表
            subInfo.subDayTimeIndex = c.subDayTimeIndex;
            return subInfo;
          })
          .sort((a, b) => {
            return a.orderStamp - b.orderStamp;
          });
      })
      .flat(Infinity);
    this.setData({
      subInfo: formatted
    });
  },

  selectWeek() {
    wx.showActionSheet({
      itemList: this.data.formattedData,
      success: r => {
        whereQuery('subscribe', this.data.originData[r.tapIndex]).then(data => {
          this.setData({
            timeQuantum: data[0].timeQuantum,
            _id: data[0]._id
          });
          this.formatSubscribeInfo();
        });
      }
    });
  },

  cancelCustomerSub(e) {
    let dataset = e.currentTarget.dataset;
    let that = this;
    console.log(dataset);
    wx.showModal({
      title: '警告',
      content: '确实要踢除该顾客',
      success(res) {
        if (res.confirm) {
          that.data.timeQuantum[dataset.subdayindex].customers.splice(dataset.suborder, 1);
          that.data.timeQuantum[dataset.subdayindex].dayPlan[dataset.subdaytimeindex].capacity++;
          that.data.timeQuantum[dataset.subdayindex].capacity++;

          upDateData('subscribe', that.data._id, {
            timeQuantum: that.data.timeQuantum
          }).then(r => {
            wx.showToast({title: '操作成功', icon: 'none'});
            that.formatSubscribeInfo();
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {previousTimestamp} = findNearMonday(new Date().getTime());
    whereQuery(
      'subscribe',
      {startTimestamp: command.gte(1608480000000)},
      {_id: false, startTime: true, endTime: true},
      6
    ).then(res => {
      console.log(res);
      this.formatDate(res);
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
