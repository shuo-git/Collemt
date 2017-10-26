const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//输出计时字符串的函数
var time2string = function (sec, ms) {
  if (ms >= 100) {
    ms = ms/10;
    return sec.toString() + '.' + ms.toString();
  }
  else {
    return sec.toString() + '.' + '0' + ms.toString();
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  time2string: time2string
}
