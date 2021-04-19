// miniprogram/pages/home/index.js
import {whereQuery, addData, upDateData} from '../../../utils/dbAction';
import {findNearMonday} from '../../../utils/date';
import {subscribeAppMsg, sendSubscribeMsg} from '../../../utils/subscribeMsg';
import APPCONF from '../../../env/appInfo';
const db = wx.cloud.database();
const app = getApp();
//caf3a1c05d0448b48c5ab9dc5bbd9d8f openid
const dayPlanMap = ['morningCapacity', 'afternoonCapacity', 'eveningCapacity'];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    t: [],
    modalVisible: true,
    lastCurrent: 0
  },

  defaultPageData() {
    return {
      subUserInfo: null,
      subDay: null, //选中的预约日信息
      userInfo: {}, //当前用户信息
      subInfo: {
        date: null,
        clock: null,
        style: null
      },
      dayIndex: -1, //选中的一周的哪一天
      selectTimeIndex: -1, //预约入时间段状态
      weekSubLimited: 1, //每周每人可预约上限
      todayTimestamp: new Date().getTime()
    };
  },
  initPageData() {
    this.setData(this.defaultPageData());
  },

  subDay(e) {
    //选择星期几
    this.setData({
      subDay: this.data.timeQuantum[e.currentTarget.dataset.index],
      dayIndex: e.currentTarget.dataset.index
    });
  },
  checkUserLogin(e) {
    //点击预约前需要保证是在登录状态
    let msg = e.detail.errMsg.split('getUserInfo:')[1];
    if (msg !== 'ok') {
    } else if (this.data.selectTimeIndex === -1) {
      //用户信息存在,但未选择时间段
      wx.showToast({title: '请选择预约时间段', icon: 'none'});
    } else {
      //,刷新用户信息
      this.refreshUserInfo(e.detail.userInfo);
    }
  },
  refreshUserInfo(userInfo) {
    whereQuery('user', {})
      .then(async r => {
        //当已存在该用户信息,更新
        //未存在则新增该用户信息
        userInfo = r.length ? {...r[0].userInfo, ...userInfo} : userInfo; //保存qq号 手机号等信息以防覆盖更新
        let res = r.length ? await upDateData('user', r[0]._id, {userInfo}) : await addData('user', {userInfo});
        this.data.userInfo = userInfo;
        return r[0] || res;
      })
      .then(r => {
        if (r.cheeckedInfo) {
          this.confirmSub(); //确认预约
        } else {
          //没有输入对应用户信息
          wx.navigateTo({url: `/pages/userInfo/index?params=${JSON.stringify(r)}`});
        }
      });
  },
  hasSubscribeCapacity(timeQuantum, dayIndex, selectTimeIndex) {
    if (timeQuantum[dayIndex].dayPlan[selectTimeIndex].capacity == 0) {
      return false;
    }
    return true;
  },
  async confirmSub() {
    let weekInfo = await whereQuery('subscribe', {_id: this.data._id});
    let hasCapacity = this.hasSubscribeCapacity(weekInfo[0].timeQuantum, this.data.dayIndex, this.data.selectTimeIndex); //判断是否还有预约名额

    if (!hasCapacity) {
      wx.showToast({title: '抱歉,当前时间预约已满', icon: 'none'});
      return false;
    }
    this.data.subDay.capacity--; // 预约日数量减少
    let subInfo = {
      date: this.data.subDay.date,
      clock: this.data.subDay.dayPlan[this.data.selectTimeIndex].time
    };
    this.data.subDay.customers.push({
      ...this.data.userInfo,
      subInfo,
      _openid: this.data._openid, //预约用户id
      subDayTimeIndex: this.data.selectTimeIndex, //预约时间段
      subDayIndex: this.data.dayIndex, //预约日
      order: this.data.subDay.customers.length //预约者顺序 便于后续删除
    });

    this.data.subDay.dayPlan[this.data.selectTimeIndex].capacity--; //预约时间段数量减少
    this.data.timeQuantum[this.data.dayIndex] = this.data.subDay; //预约成功后刷新信息

    // let TimeCapacity = dayPlanMap[this.data.selectTimeIndex];
    // let exactTimeQuantum = this.data.timeQuantum[this.data.dayIndex];
    // exactTimeQuantum[TimeCapacity]--;

    this.setData({timeQuantum: this.data.timeQuantum});
    upDateData('subscribe', this.data._id, {
      timeQuantum: this.data.timeQuantum
    }).then(() => {
      sendSubscribeMsg({
        //发送订阅
        template_id: '9ce2b5693835623005c57bfdea31f994',
        tousers: [app.globalData._openid, ...APPCONF.ADMIN_OPENIDS],
        content: [`${this.data.userInfo.qqNumber}`, subInfo.date, subInfo.clock.replace(/-/, '~'), ' ']
      });
    });
    this.filter();
  },
  selectTime(e) {
    //选择当天准确日期
    this.setData({
      selectTimeIndex: e.currentTarget.dataset.index
    });
  },

  async init() {
    this.initPageData(); //页面数据初始化
    await this.queryData();
    let _openid = await this.getOpenid();
    wx.hideLoading();
    this.setData({_openid: _openid});
    this.filter();
  },

  queryData() {
    return new Promise(reslove => {
      const _ = db.command;
      const {previousTimestamp} = findNearMonday(new Date().getTime());

      db.collection('subscribe')
        .where({
          startTimestamp: _.gte(previousTimestamp)
        })
        .limit(3)
        .get({
          success: res => {
            res.data = res.data.map(t => {
              return {...t, ...this.defaultPageData()};
            });
            let index = this.data.lastCurrent; //修复因切换导致默认加载第一项预约日期导致的bug
            this.setData({
              t: res.data,
              timeQuantum: res.data[index].timeQuantum,
              _id: res.data[index]._id,
              startTime: res.data[index].startTime,
              endTime: res.data[index].endTime
            });
            reslove();
          }
        });
    });
  },

  getOpenid() {
    //获取openid
    return new Promise(reslove => {
      let interval = setInterval(() => {
        if (app.globalData._openid) {
          clearInterval(interval);
          reslove(app.globalData._openid);
        }
      }, 10);
    });
  },

  filter() {
    //筛选,判断是否已达到本周预约上限
    this.data.weekSubLimited = 1;
    this.data.timeQuantum.forEach(day => {
      day.customers.forEach(v => {
        console.log(this.data._openid, 'openid');
        if (v._openid === this.data._openid) {
          this.data.subUserInfo = v;
          this.data.weekSubLimited--;
        }
      });
    });

    this.setData({
      subUserInfo: this.data.subUserInfo,
      timeQuantum: this.data.timeQuantum,
      weekSubLimited: this.data.weekSubLimited
    });
  },
  subscribeAppMsg() {
    //询问是否同意发送预约消息
    subscribeAppMsg(APPCONF.TEMPLATES);
  },

  showCancelModal() {
    wx.showModal({
      title: '提示',
      content: '是否取消预约',
      cancelColor: 'grey',
      success: res => {
        if (res.confirm) {
          this.cancelSub();
        } else {
        }
      }
    });
  },
  cancelSub() {
    //取消预约
    let sUI = this.data.subUserInfo;
    let tQ = this.data.timeQuantum;

    if (this.data.subDay && this.data.subDay !== tQ[sUI.subDayIndex]) {
      this.data.subDay.capacity++; // 预约日数量增加
      this.data.subDay.customers.splice(sUI.order, 1);
      this.data.subDay.dayPlan[this.data.selectTimeIndex].capacity++; //预约时间段数量减少
      this.data.timeQuantum[this.data.dayIndex] = this.data.subDay; //预约成功后刷新信息
    } else {
      tQ[sUI.subDayIndex].capacity++; //预约日余量
      tQ[sUI.subDayIndex].customers.splice(sUI.order, 1); //删除预约者
      tQ[sUI.subDayIndex].dayPlan[sUI.subDayTimeIndex].capacity++; //预约时间段余量
    }

    // let TimeCapacity = dayPlanMap[sUI.subDayTimeIndex];
    // let exactTimeQuantum = tQ[sUI.subDayIndex];
    // exactTimeQuantum[TimeCapacity]++;

    upDateData('subscribe', this.data._id, {
      timeQuantum: tQ
    }).then(() => {
      sendSubscribeMsg({
        //发送订阅
        template_id: '8f71e6999e013aec45833b92034bd606',
        tousers: [...APPCONF.ADMIN_OPENIDS],
        content: [
          this.data.subUserInfo.nickName,
          sUI.subInfo.date + ' ' + sUI.subInfo.clock.replace('-', '~'),
          `QQ:${this.data.subUserInfo.qqNumber}`
        ]
      });
    });
    this.setData({
      timeQuantum: tQ
    });
    this.filter();
  },

  gotoSettingNavPage() {
    if (APPCONF.ADMIN_OPENIDS.includes(app.globalData._openid)) {
      console.log('匹配');
      wx.navigateTo({
        url: '/pages/navigation/index'
      });
    }
    console.log('不匹配');
  },

  swiperChange({detail}) {
    for (const key in this.data) {
      if (/^(t|__webviewId__|_openid|lastCurrent|todayTimestamp|modalVisible)$/.test(key)) continue; //要保留的页面属性值
      this.data.t[this.data.lastCurrent][key] = this.data[key];
    }
    this.data.lastCurrent = detail.current;

    for (const key in this.data) {
      if (/^(t|__webviewId__|_openid|lastCurrent|todayTimestamp|modalVisible)$/.test(key)) continue; //更新页面信息为下一页
      this.data[key] = this.data.t[detail.current][key];
    }
    this.setData(this.data);
    this.filter();
  },

  handleModelOk() {
    this.setData({modalVisible: false});
  },
  switchWeek() {},

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
    // subscribeAppMsg(APPCONF.TEMPLATES);
    wx.showLoading({
      title: '加载数据中'
    });
    this.init();
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
