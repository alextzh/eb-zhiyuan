import axios from 'axios'
import qs from 'qs'
import {getMd5, getBJDate} from './tool'

const axiosIns = axios.create({
  baseURL: '//wx.yanysdd.com', // //contract.evenbasic.com
  timeout: 3000
})
const time_stamp = getBJDate()
const secret_key = getMd5()

// 请求拦截器
axiosIns.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'secret_key': secret_key,
    'time_stamp': time_stamp
  }
  config.data = qs.stringify(config.data)
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
axiosIns.interceptors.response.use((response) => {
  return response
}, error => {
  return Promise.reject(error.response)
})

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axiosIns.get(url, {
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axiosIns.post(url, data)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}
