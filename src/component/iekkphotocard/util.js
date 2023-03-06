// 根据对象数组中的某个属性值生成数组
export const arrayByProperty = (arr, property) => {
  let tmp = []
  if (arr instanceof Array) {
    arr.forEach(item => {
      if (typeof item === 'object') {
        tmp.push(item[property])
      }
    })
  }
  return tmp
}

// 解析 2022-01-25T23:53:06.000+0000
export const renderTime = (date) => {
  let dateee = new Date(date).toJSON()
  return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

// 根据时间戳获取日期格式yyyymmdd
export const getDate = (timestamp, flag = '') => {
  let date = ''
  if (timestamp) {
    let d = new Date(parseInt(timestamp))
    let month = d.getMonth() + 1
    let day = d.getDate()
    date = (d.getFullYear()) + flag + (month > 9 ? month : '0' + month) + flag + (day > 9 ? day : '0' + day)
  }
  return date
}

// 配置阿里云函数
export const getCloudUrl = (storage) => {
  if (storage === '') {
    storage = 'storage'
  }
  let cloudServe = JSON.parse(localStorage.getItem('cloudserv'))[storage]
  let url = cloudServe.cloudserv_storage_storageurl
  if (url.indexOf('http') > -1) {
    return url + '/' + cloudServe.cloudserv_storage_storagebucket
  } else {
    return 'https://' + url
  }
}

// 获取图片地址
export const getImageUrl = (files) => {
  let fileUrl = ''
  if (files) {
    let temp = JSON.parse(files)
    let tenantCode = JSON.parse(localStorage.getItem('user')).tenantcode
    let cloudServeUrl = ''
    cloudServeUrl = getCloudUrl(temp.storage)
    fileUrl = cloudServeUrl + '/' + temp.source.substring(0, 3) + '/img/' + getDate(temp.datetime) + '/' + tenantCode + '/' + temp.source
  }
  return fileUrl
}
