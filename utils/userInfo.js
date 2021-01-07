export function setOpenid() {
  return new Promise((reslove, reject) => {
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res => {
        reslove(res)
      },
      fail: err => {
        reject(err)
      },
    })
  })

}

export function getOpenid() {
  return openId
}