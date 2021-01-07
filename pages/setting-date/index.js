// miniprogram/pages/setting-date/index.js
import {
  parseDateToTimestamp,
  parseTimestampToDate,
  isMonday,
  findNearMonday
} from '../../utils/date'
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
    dates: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    clock: ['morning', 'afternoon', 'evening'],
    startTime: '2020-09-01',
    startTimestamp: 1601481600000,
    endTime: '2022-01-01',
    endTimestamp: 1633017600000,
    morningSubTime: [
      '9:00-11:30',
      '1111'
    ],
    afternoonSubTime: [
      '15:00-17:30'
    ],
    eveningSubTime: [
      '19:00-21:00'
    ],
    dateIndex: 0, //当前选择日期数
    lazyDog: false, //懒狗模式
    weekPlan: [],
    timeQuantum: [],
    settingMode: 'add',
  },
  strategies() {
    return {
      'week': this.pickerWeek,
      'date': this.pickerDate,
    }
  },

  getDayTemplate() {
    return {
      capacity: 2,
      contentText: "可预约",
      customers: [],
      canSub: true,
      morningIndex: 0,
      afternoonIndex: 0,
      eveningIndex: 0,
      morningCapacity: 0,
      afternoonCapacity: 1,
      eveningCapacity: 1,
      dayPlan: [{
          capacity: 0,
          content: "上午",
          status: "morning",
          time: "9:00-11:30"
        },
        {
          capacity: 1.0,
          content: "下午",
          status: "afternoon",
          time: "14:30-17:00"
        },
        {
          time: "19:00-21:30",
          capacity: 1.0,
          content: "晚上",
          status: "evening"
        }
      ],
    }
  },

  pickerWeek(status, value) {
    //时间应从本周一 选到下周一
    let time = status + 'Time';
    let stamp = status + 'Timestamp'
    let stampValue = parseDateToTimestamp(value)

    if (!isMonday(value)) { //星期一设置错误
      wx.showToast({
        title: '必须选择周一',
        icon: 'none'
      })
      return;
    }

    wx.showLoading({
      title: `正在加载日期配置`,
    })

    this.selectQueryMethodsForStamp(stampValue)

   
    if (status === 'end' && stampValue - this.data.startTimestamp > 86400000 * 7) {
      wx.showToast({
        title: '结束周设置错误',
        icon: 'none'
      })
      return
    }

    this.setData({
      [time]: value,
      [stamp]: stampValue
    })

    console.log(this.data.startTimestamp, this.data.endTimestamp)
  },

  selectQueryMethodsForStamp(stampValue){
    whereQuery('subscribe', {
      startTimestamp: stampValue
    }).then((res) => { //根据选择的起始周判断加载模式
      // console.log(res,stampValue)
      wx.hideLoading()
      if (res.length > 0) { //新建周配置数据
        this.ininLoadData(res[0])
      } else {
        this.initTemplateData(stampValue)
      }
    })
  },
  pickerDate(status, index) { //选择修改当日预约时间时
    let target = status + 'Index';
    // console.log(target)
    this.setWeekPlan()
    this.setData({
      [target]: index
    })

    if (status === 'date') {
      this.setDayPlan()
    }
  },

  bindPickerChange(e) {
    let dataset = e.currentTarget.dataset;
    let {
      detail
    } = e;
    // console.log(dataset, detail.value)
    this.strategies()[dataset.type](dataset.status, detail.value)
  },

  inputControl(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;
    this.setData({
      [type + 'Capacity']: +value
    })
  },

  judgeSubmit() {
    wx.showModal({
      content: '是否确认启程',
      title: '警告⚠️',
      success: (result) => {
        if (result.confirm) {
          this.doSubmit()
        }
      },
    })
  },

  doSubmit() {
    this.setWeekPlan();
    this.setDayDateInfo()
    if (this.data.settingMode === 'add') {
      addData('subscribe', {
        startTime: this.data.startTime,
        startTimestamp: this.data.startTimestamp,
        endTime: this.data.endTime,
        endTimestamp: this.data.endTimestamp,
        timeQuantum: this.data.timeQuantum
      }).then((r) => {
        wx.showToast({
          title: '打工人已启程',
        })
        this.data.settingMode = 'modify'
        this.data._id = r._id
        // console.log(r)
      })
    } else {
      upDateData('subscribe', this.data._id, {
        startTime: this.data.startTime,
        startTimestamp: this.data.startTimestamp,
        endTime: this.data.endTime,
        endTimestamp: this.data.endTimestamp,
        timeQuantum: this.data.timeQuantum
      }).then((r) => {
        wx.showToast({
          title: '打工人已启程',
        })
        
      })
    }
  },
  setDayDateInfo() { //为每一天设置日期信息和时间戳信息
    let date = new Date(this.data.startTimestamp)
    for (let i = 0; i < 7; i++) {
      let timestamp = date.getTime()
      console.log(timestamp, date.getDate())
      this.data.timeQuantum[i].timestamp = timestamp;
      this.data.timeQuantum[i].date = parseTimestampToDate(timestamp)
      date.setMilliseconds(86400000) //日期加一
    }
  },

  switchLazyDog(e) {
    this.setData({
      lazyDog: e.detail.value
    })
  },
  setDayPlan() { //当前页面信息切换为当日配置
    const D = this.data;
    let i = D.dateIndex;

    this.setData({
      morningIndex: D.timeQuantum[i].morningIndex,
      afternoonIndex: D.timeQuantum[i].afternoonIndex,
      eveningIndex: D.timeQuantum[i].eveningIndex,
      morningCapacity: D.timeQuantum[i].morningCapacity,
      afternoonCapacity: D.timeQuantum[i].afternoonCapacity,
      eveningCapacity: D.timeQuantum[i].eveningCapacity,
    })
  },
  setWeekPlan() { //将修改后的当日配置信息覆盖至周配置信息中
    let data = this.data;
    let day = data.timeQuantum[data.dateIndex];
    let capacity = 0;

    day.morningIndex = data.morningIndex
    day.afternoonIndex = data.afternoonIndex
    day.eveningIndex = data.eveningIndex
    day.morningCapacity = data.morningCapacity
    day.afternoonCapacity = data.afternoonCapacity
    day.eveningCapacity = data.eveningCapacity

    data.clock.map((v, i) => {
      let time = data[v + 'SubTime'];
      day.dayPlan[i].time = time[data[v + 'Index']]
      day.dayPlan[i].capacity = data[v + 'Capacity'];
      capacity += data[v + 'Capacity'];
    })
    day.capacity = capacity;

    this.setData({
      timeQuantum: data.timeQuantum
    })
  },
  getDayPlanTemplate() {
    return {
      morningIndex: 0,
      afternoonIndex: 0,
      eveningIndex: 0,
      morningCapacity: 0,
      afternoonCapacity: 1,
      eveningCapacity: 1,
    }
  },
  ininLoadData(data) { //页面配置从数据库读取
    this.data.settingMode = 'modify'
    this.data.timeQuantum = data.timeQuantum
    this.data._id = data._id;
    this.setDayPlan()
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime,
      startTimestamp: data.startTimestamp,
      endTimestamp: data.endTimestamp
    })

  },
  initTemplateData(startDateTimestamp = new Date().getTime()) { //页面配置为从本地模板新增
    this.data.settingMode = 'add'
    for (let i = 0; i < 7; i++) {
      this.data.timeQuantum[i] = this.getDayTemplate()
    }
    this.initSubTime(startDateTimestamp); //自动配置起始和结束周如期
    this.setDayPlan() //设置当日配置信息
    this.setData({
      timeQuantum: this.data.timeQuantum
    })
  },
  initSubTime(startDateTimestamp) {
    const {
      previousDate,
      previousTimestamp,
      nextDate,
      nextTimestamp
    } = findNearMonday(startDateTimestamp)
    this.setData({
      startTime: previousDate,
      startTimestamp: previousTimestamp,
      endTime: nextDate,
      endTimestamp: nextTimestamp,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSubTime(new Date().getTime())
    this.selectQueryMethodsForStamp(this.data.startTimestamp)
    // wx.showModal({
    //   cancelText: '新建',
    //   confirmText: '采用上周',
    //   content: '当前配置模式',
    //   showCancel: true,
    //   title: '打工计划',
    //   success: (result) => {
    //     result.confirm ? this.ininLoadData() : this.initTemplateData()
    //   },

    // })
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