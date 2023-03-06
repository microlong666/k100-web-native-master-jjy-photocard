/*
 * @Author: 卢丽莎
 * @Email: lulisha@wxchina.com
 * @Date: 2021-10-25 09:45:20
 * @Last Modified by: 卢丽莎
 * @Last Modified time: 2022-06-15 22:49:54
 * @Description: 封装请求方法
 */
async function post (content, url, body) {
  let result = null
  try {
    result = await content.$http.post(url, body)
    result = result.body.resp_data
  } catch (error) {
    let msg = (error.body && error.body.error_code) || error.statusText || error
    content.$message.error(msg)
  }
  return result
}

async function get (content, url) {
  let result = null
  try {
    result = await content.$http.get(url)
    result = result.body.resp_data
  } catch (error) {
    let msg = (error.body && error.body.error_code) || error.statusText || error
    content.$message.error(msg)
  }
  return result
}

export { post, get }
