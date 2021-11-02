import dayjs from 'dayjs';
/**
 * excel文件流下载
 * @param data  二进制流
 * @param name  文件名;
 */
export const download = (data, name, suffix = 'xlsx') => {
  const filename = `${name}${dayjs(new Date()).format('YYYYMMDD')}.${suffix}`;
  const blob = new Blob([data], {
    type: 'application/octet-stream'
  });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(filename));
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', decodeURI(filename));
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL);
  }
};
export const downloadFile = (data, filename) => {
  const blob = new Blob([data], {
    type: 'application/octet-stream'
  });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(filename));
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', decodeURI(filename));
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL);
  }
};
/**
 * 文件链接转文件流下载--主要针对pdf 解决谷歌浏览器a标签下载pdf直接打开的问题
 * @param url  ：文件链接
 * @param fileName  ：文件名;
 */
export const fileLinkToStreamDownload = function (url, fileName) {
  let reg = /^(\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
  if (!reg.test(url)) {
    throw new Error('传入参数不合法,不是标准的文件链接');
  } else {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    // xhr.setRequestHeader('Content-Type', `application/${type}`);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status == 200) {
        //接受二进制文件流
        var blob = this.response;
        downloadFile(blob, fileName);
      }
    };
    xhr.send();
  }
};
