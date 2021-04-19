function updateDoc(dbName, query, data) {
  return new Promise((reslove, reject) => {
    wx.cloud
      .callFunction({
        name: 'updateDoc',
        data: {
          dbName,
          query,
          data
        }
      })
      .then(res => reslove(res.result.data))
      .catch(reject);
  });
}

function queryDoc(dbName, query) {
  return new Promise((reslove, reject) => {
    wx.cloud
      .callFunction({
        name: 'queryDoc',
        data: {
          dbName,
          query
        }
      })
      .then(res => reslove(res.result.data))
      .catch(reject);
  });
}

export {updateDoc, queryDoc};
