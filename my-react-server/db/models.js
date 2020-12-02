// 包含n个操作数据库集合数据的Model模块

//引入mongoose
const mongoose = require('mongoose')

//连接数据库
mongoose.connect('mongodb://localhost:27017/tangtangzhipin')

//获取连接对象
const conn = mongoose.connection;

//绑定连接完成的监听
conn.on('connected',function(){//连接成功回调
	console.log('数据库连接成功')
})

// 得到对应特定集合的Model并向外暴露
//定义Schema(描述文档结构)
const userSchema = mongoose.Schema({//指定文档的结构:属性名/属性值的类型，是否是必须的/默认值
	username: {type: String, required: true}, //用 户 名
	password: {type: String, required: true}, //密 码
	type: {type: String, required: true}, //用 户 类 型 : dashen/laoban
	header: {type: String}, //头 像 名 称
	post: {type: String}, //职 位
	info: {type: String}, //个 人 或 职 位 简 介 
	company: {type: String}, // 公 司 名 称 
	salary: {type: String} // 工 资 
})

//定义model(与集合对应，可以操作集合)
const UserModel = mongoose.model('user',userSchema)//集合名users

//向外暴露Model
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
//定 义 能 操 作 chats集 合 数 据 的 Model 
const ChatModel = mongoose.model('chat', chatSchema) 
// 向 外 暴 露 Model 
exports.ChatModel = ChatModel