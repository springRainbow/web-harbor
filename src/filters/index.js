/**
 * vue filter
 * @author zhaofangmo
 */
/**
 * 时间戳转日期MM月DD日
 * @params {Number} timestamp 时间戳 后端为s  前端为ms
 * @params {Number} type 1：年月日；2：. 3：-
 * @author zhaofangmo
 */
Vue.filter('dateYYYYMMDD', function (timestamp, type) {
  // 后端返回的时间戳为秒
  var date = new Date(timestamp * 1000),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    _month = month < 10 ? '0' + month : month,
    _day = day < 10 ? '0' + day : day;
  if (type == 1) {
    return `${year}年${_month}月${_day}日`;
  } else if (type == 2) {
    return `${year}.${_month}.${_day}`;
  } else {
    return `${year}-${_month}-${_day}`;
  }
});
