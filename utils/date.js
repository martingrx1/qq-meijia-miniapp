function getTodayDate() {
  let date = new Date();
  return date.getMonth() + 1 + '月' + date.getDate() + '日';
}

function parseDateToTimestamp(rawDate, rawClock = '') {
  let dates = rawDate.split('-');
  let clocks = rawClock.split(':');
  dates[1] && (dates[1] -= 1); //处理月份问题 0表示一月
  let date = new Date(...dates, ...clocks);
  return date.getTime();
}

function parseTimestampToDate(timestamp, separator = '-') {
  let date = new Date(timestamp);
  return date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
}

function isMonday(raw = '', timestamp = '') {
  let date;
  if (timestamp) {
    date = new Date(timestamp);
  } else {
    let ele = raw.split('-');
    date = new Date(ele[0], ele[1] - 1, ele[2]);
  }
  return date.getDay() == 1;
}

function findNextMonday(timestamp) {
  let nextMondayTimestamp = timestamp + 86400000 * 7;
  return {
    nextMondayTimestamp,
    nextMondayDate: parseTimestampToDate(nextMondayTimestamp)
  };
}

function findNearMonday(timestamp) {
  for (let i = 0; i < 7; i++) {
    if (isMonday(null, timestamp)) {
      let mondayTimestamp = parseDateToTimestamp(parseTimestampToDate(timestamp));
      let {nextMondayTimestamp, nextMondayDate} = findNextMonday(mondayTimestamp);
      return {
        previousTimestamp: mondayTimestamp, //转换时间戳为当天十二点
        previousDate: parseTimestampToDate(timestamp),
        nextTimestamp: nextMondayTimestamp,
        nextDate: nextMondayDate
      };
    }
    timestamp -= 86400000;
  }
}

function getTodayCnName(timestamp) {
  const translate = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return translate[new Date(timestamp).getDay()];
}

export {getTodayDate, parseDateToTimestamp, parseTimestampToDate, isMonday, findNearMonday, getTodayCnName};
