export const dateYYYYMMDD = (timestamp, type) => {
  // 后端返回的时间戳为秒
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  let strDate = Y + M + D + h + m + s;
  return strDate;
};

export const formatSeconds = (value) => {
  let result = parseInt(value);
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  let m = Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60);
  let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60);
  result = `${h}:${m}:${s}`;
  return result;
};
