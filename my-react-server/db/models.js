const mongoose = require('mongoose')

//连接数据库
mongoose.connect('mongodb://localhost:27017/tangtangzhipin')

//获取连接对象
const conn = mongoose.connection;


conn.on('connected',function(){
	console.log('数据库连接成功')
})


const userSchema = mongoose.Schema({
	username: {type: String, required: true}, //用 户 名
	password: {type: String, required: true}, //密 码
	type: {type: String, required: true}, //用 户 类 型 : dashen/laoban
	header: {type: String}, //头 像 名 称
	post: {type: String}, //职 位
	info: {type: String}, //个 人 或 职 位 简 介 
	company: {type: String}, // 公 司 名 称 
	salary: {type: String} // 工 资 
})


const UserModel = mongoose.model('user',userSchema)


exports.UserModel = UserModel;


//定 义 chats集 合 的 文 档 结 构 
const chatSchema = mongoose.Schema({ 
	from: {type: String, required: true}, //发 送 用 户 的 id
	to: {type: String, required: true}, //接 收 用 户 的 id 
	chat_id: {type: String, required: true}, // from 和 to组 成 的 字 符 串
	content: {type: String, required: true}, //内 容
	read: {type:Boolean, default: false}, //标 识 是 否 已 读
	create_time: {type: Number} //创 建 时 间
}) 
const ChatModel = mongoose.model('chat', chatSchema) 

exports.ChatModel = ChatModel