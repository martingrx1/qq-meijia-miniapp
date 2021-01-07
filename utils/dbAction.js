const db = wx.cloud.database()

export function whereQuery(collection, query = {},field={},limit=20) {
  return new Promise((reslove, reject) => {
    db.collection(collection).where(query).field(field).limit(limit).get({
      success: res => {
        reslove(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}


export function upDateData(collection, doc, data = {}) {
  return new Promise((reslove, reject) => {
    db.collection(collection).doc(doc).update({
      data: data,
      success: res => {
        reslove(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}



export function addData(collection, data = {}) {
  return new Promise((reslove, reject) => {
    db.collection(collection).add({
      data: data,
      success: res => {
        reslove(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export function getDataCount(collection, query = {}) {
  return new Promise((reslove, reject) => {
    db.collection(collection).where(query).count({
      success: function (res) {
        reslove(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export const command = db.command

