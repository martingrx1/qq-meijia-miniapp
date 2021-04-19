// 云函数入口文件
const cloud = require('qq-server-sdk');
cloud.init({
  env: 'base-a8b157'
});

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const {dbName, query} = event;

  return db.collection(dbName).where(query).get();
};
