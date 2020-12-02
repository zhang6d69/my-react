import {combineReducers} from 'redux'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
} from './action-types'

import {getRedirectTo} from '../utils'

const initUser = {
  username: '', // 用户名
  type: '', // 用户类型 dashen/laoban
  msg: '', // 错误提示信息
  redirectTo: '' // 需要自动重定向的路由路径
}
// 产生user状态的reducer
function user(state=initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS: // data是user
      const {type, header} = action.data
      return {...action.data, redirectTo: getRedirectTo(type, header)}
    case ERROR_MSG: // data是msg
      return {...state, msg: action.data}
    case RECEIVE_USER: // data是user
      return action.data
    case RESET_USER: // data是msg
      return {...initUser, msg: action.data}
    default:
      return state
  }
}


const initUserList = []
// 产生userlist状态的reducer
function userList(state=initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:  // data为userList
      return action.data
    default:
      return state
  }
}

const initChat = {
  users: {}, 
  chatMsgs: [], 
  unReadCount: 0 
}

// 产生聊天状态的reducer
function chat(state=initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:  // data: {users, chatMsgs}
      const {users, chatMsgs, userid} = action.data
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read&&msg.to===userid?1:0),0)
      }
    case RECEIVE_MSG: // data: chatMsg
      const {chatMsg} = action.data
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
      }
    case MSG_READ:
      const {from, to, count} = action.data
      state.chatMsgs.forEach(msg => {
        if(msg.from===from && msg.to===to && !msg.read) {
          msg.read = true
        }
      })
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(msg => {
          if(msg.from===from && msg.to===to && !msg.read) {
            return {...msg, read: true}
          } else {
            return msg
          }
        }),
        unReadCount: state.unReadCount-count
      }
    default:
      return state
  }
}

export default combineReducers({
  user,
  userList,
  chat
})


