import axios from 'axios';
import { http } from './http'
import store, { addTodo } from '../store/store';

//企业id
const CorpID = 'ww13638b88f8e0e007'
//东本储运
// const DBCYId = "1000004"
const DBCYSecret = "dm249crh0P60rh757WIilJocgMEGuUPauN-cEmi1sO8"

// 获取access_token
export const getAccess_TokenUrl = () => axios.get('/cgi-bin/gettoken?corpid=' + CorpID + '&corpsecret=' + DBCYSecret)

/**
 * 获取token
 * @returns 
 */
const getToken = () => {
  let params = {}
  params.SID = Math.floor(Math.random() * (100));
  params.KEY = 'wdhl'
  params.TYPE = 2
  params.SRCSYS = '企业微信'
  params.VERIFY = 'token'
  params.DATA = [{ user_code: store.getState().userModule.user_code }]

  return http('post', '/service/ncBaseDataSynServlet', params)
}


/**
 * 基本请求
 * @param {
 * 1:模版
 * 2:token
 * 3:招聘需求数据
 * 5:岗位说明书
 * 6:员工手册
 * 8:参照
 * } type 
 * @param {数据体} data 
 * @param {billtype} billtype 
 * @returns 
 */
export const ncBaseDataSynServlet = async (type, data, billtype) => {
  let params = {}
  params.SID = Math.floor(Math.random() * (100));
  params.KEY = 'wdhl'
  params.TYPE = type
  params.billtype = billtype
  params.SRCSYS = '企业微信'
  params.DATA = data
  //第一次请求没有token
  if (store.getState().userModule.token === '') {
    //获取token
    const result = await getToken();
    params.VERIFY = result.TonKen;
    store.dispatch(addTodo('SET_USER_TOKEN', result.TonKen))
    store.dispatch(addTodo('SET_USER_CODE', result.VALUES[0].user_code))
    store.dispatch(addTodo('SET_USER_CUSERID', result.VALUES[0].cuserid))
    store.dispatch(addTodo('SET_USER_USERNAME', result.VALUES[0].user_name))
  } else {
    params.VERIFY = store.getState().userModule.token;
  }
  console.log(params);
  return await http('post', '/service/ncBaseDataSynServlet', params);
}

/**
 * 上传文件
 * @param {文件} file 
 * @param {*} pk 
 * @returns 
 */
export const uploadFile = async (file, pk = '1001ZZ10000000009EQY') => {
  const formData = new FormData();
  formData.append('TYPE', 11)
  formData.append('KEY', 'wdhl')
  formData.append('SID', Math.floor(Math.random() * (100)))
  formData.append('billtype', 'ZPXQ')
  formData.append('SRCSYS', '企业微信')
  formData.append('pk', pk)
  formData.append('file', file)
  return await http('post', '/service/fileDataUpLoadServlet', formData)
}