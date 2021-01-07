// 云函数入口文件
const cloud = require('qq-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  wx.request({
    url: 'https://api.q.qq.com/api/json/subscribe/SendSubscriptionMessage?access_token=ACCESS_TOKEN', //仅为示例，并非真实的接口地址
    method: 'POST',
    data: {
      "touser": "OPENID",
      "template_id": "TEMPLATE_ID",
      "page": "index",
      "data": {
        "keyword1": {
          "value": "339208499"
        },
        "keyword2": {
          "value": "2019年5月05日 12:30"
        },
        "keyword3": {
          "value": "腾讯大厦"
        },
        "keyword4": {
          "value": "深圳市南山区高新科技园中区一路"
        }
      },
      "emphasis_keyword": "keyword1.DATA"
    },
    success(res) {
      console.log(res.data)
    }
  })
}
