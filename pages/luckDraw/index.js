const app = getApp()
Page({
  data: {
    prizes: [{
        title: '免费',
        background: '#f9e3bb',
        probability: 0,
        fonts: [{
          text: '免费',
          top: '18%'
        }]
      },
      {
        title: '2折',
        background: '#f8d384',
        probability: 0,
        fonts: [{
          text: '2折',
          top: '18%'
        }]
      },
      {
        title: '6折',
        background: '#f9e3bb',
        probability: 2,
        fonts: [{
          text: '6折',
          top: '18%'
        }]
      },
      {
        title: '8.8折',
        background: '#f8d384',
        probability: 15,
        fonts: [{
          text: '8.8折',
          top: '18%'
        }]
      },
      {
        title: '包邮',
        background: '#f9e3bb',
        probability: 20,
        fonts: [{
          text: '包邮',
          top: '18%'
        }]
      },
      {
        title: '10元券',
        background: '#f8d384',
        probability: 13,
        fonts: [{
          text: '10元券',
          top: '18%'
        }]
      },
      {
        title: '8元券',
        background: '#f9e3bb',
        probability: 40,
        fonts: [{
          text: '8元券',
          top: '18%'
        }]
      },
      {
        title: '再转一次',
        background: '#f8d384',
        probability: 10,
        fonts: [{
          text: '再转一次',
          top: '18%'
        }]
      },
    ],
    defaultStyle: {
      fontColor: '#d64737',
      fontSize: '14px'
    },
    blocks: [{
      padding: '13px',
      background: '#d64737'
    }],
    buttons: [{
        radius: '50px',
        background: '#d64737'
      },
      {
        radius: '45px',
        background: '#fff'
      },
      {
        radius: '41px',
        background: '#f6c66f',
        pointer: true
      },
      {
        radius: '35px',
        background: '#ffdea0',
        fonts: [{
          text: '开始\n抽奖',
          fontSize: '18px',
          top: -18
        }]
      }
    ],
    LuckDrawPond: [],
    teseInfo: {

    }
  },
  showDrawResultModal(title,content){
    wx.showModal({
      confirmText: '确认',
      content: content,
      showCancel: false,
      title: title,
    })
  },
  getDrawedPrizeInfo(){
    return wx.getStorageSync('drawPrizeInfo')
  },
  getDrawChance(){
    let drawChance = wx.getStorageSync('drawChance');
    if( drawChance === '') {
      return 1
    }
    return drawChance;
  },
  setDrawChance(count){
    wx.setStorageSync('drawChance',count)
  },
  setDrawedPrizeInfo(info){
    wx.setStorageSync('drawPrizeInfo',info)
  },
  structureLuckDrawPond() {
    let LuckDrawPond = [];
    this.data.prizes.map((v, i) => {
      LuckDrawPond = LuckDrawPond.concat(new Array(v.probability).fill(i))
    })
    //  console.log(LuckDrawPond);
    this.data.LuckDrawPond = LuckDrawPond;
  },
  createdPrizesIndex() {
    let randomIndex = parseInt(Math.random() * 100);
    return this.data.LuckDrawPond[randomIndex]
  },
  start() {
    if(!this.getDrawChance()){
      this.showDrawResultModal('提示','你已中奖:' + this.getDrawedPrizeInfo())
      return;
    }
    
    // 获取抽奖组件实例
    const child = this.selectComponent('#myLucky')
    // 调用play方法开始旋转
    child.$lucky.play()
    // 用定时器模拟请求接口
    setTimeout(() => {
      // 3s 后得到中奖索引
      let index = this.createdPrizesIndex()
      this.statistics(index)
      // 调用stop方法然后缓慢停止
      child.$lucky.stop(index)
      this.setDrawChance(0);
    
     
    }, 3000)
  },
  end(event) {
    // 中奖奖品详情
    this.setDrawedPrizeInfo(event.detail.title)
    this.showDrawResultModal('提示','你已中奖:' + this.getDrawedPrizeInfo())
    // this.start()
    // console.log(event.detail)
  },
  onLoad() {
    this.structureLuckDrawPond()
  },
  statistics(index){
    let testInfo = this.data.teseInfo;
    let pond = this.data.prizes;
    let title = pond[index].title;
    testInfo[title] = testInfo[title] ? testInfo[title] + 1 : 1;
    testInfo['总抽次数'] = testInfo['总抽次数'] ? testInfo['总抽次数'] + 1 : 1;
    console.clear()
    console.log(testInfo);
  }

})