var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const {UserModel,ChatModel} = require('../db/models')
const filter = {password:0,_v:0}//指定过滤的属性

//注册的路由
router.post('/register',(req,res)=>{
	//读取请求参数
	const {username,password,type} = req.body;
	//处理:判断用户是否已经存在，如果存在，返回提示错误的信息，如果不存在，保存
	//查询(根据username)
	UserModel.findOne({username},(err,user)=>{
		//如果user有值(已存在)
		if(user){
			//返回提示错误的信息
			res.send({code:1,msg:'此用户已存在'})
		}else {
			//没有值(不存在)
			//保存
			new UserModel({username,type,password:md5(password)}).save((error,user)=>{
				//生成一个cookie(userid: user._id),并交给浏览器保存 
				res.cookie('userid',user._id,{maxAge:1000*60*60*24})
				//返回包含user的json数据
				const data = {username,type,_id:user._id} //响应数据中不要携带密码
				res.send({code:0,data})
			})
		}
	})
})

//登录的路由
router.post('/login',(req,res)=>{
	//读取请求参数
	const {username,password} = req.body;
	//根据username和password查询数据库users,如果没有，返回提示错误的信息，如果有，返回登陆成功的信息(包含user)
	UserModel.findOne({username,password:md5(password)},filter,(err,user)=>{
		if(user){
			//登陆成功
			//生成一个cookie(userid:user._id),并交给浏览器保存 
			res.cookie('userid',user._id,{maxAge:1000*60*60*24})
			res.send({code:0,data:user})
		}else{
			//登陆失败
			res.send({code:1,msg:'用户名或密码不正确'})
		}
	})
})

// 更新用户信息
router.post('/update',(req,res)=>{
	//从请求的cookie中得到userid
	const userid = req.cookies.userid;
	//如果不存在，直接返回一个提示信息的结果
	if(!userid){
		return res.send({code:1,msg:'请先登陆'})
	}
	//存在，根据userid更新对应的user文档数据
	//得到提交的用户数据
	const user = req.body;//没有_id
	UserModel.findByIdAndUpdate({_id:userid},user,(err,oldUser)=>{
		if(!oldUser){
			//通知浏览器删除userid的cookie
			res.clearCookie('userid')
			
			//直接返回一个提示信息的结果
			return res.send({code:1,msg:'请先登陆'})
		}else{
			//准备一个返回的user数据对象
			const {_id,username,type} = oldUser
			const data = Object.assign(user,{_id,username,type})
			return res.send({code:0,data})
		}
	})
})

//根据cookie中的userid获取用户信息的路由
router.get('/user',(req,res)=>{
	//从请求的cookie中得到userid
	const userid = req.cookies.userid;
	//如果不存在，直接返回一个提示信息的结果
	if(!userid){
		return res.send({code:1,msg:'请先登陆'})
	}
	//根据userid查询对应的user
	UserModel.findOne({_id:userid},filter,(err,user)=>{
		res.send({code:0,data:user})
	})
})

//获取用户列表(根据类型)
router.get('/userlist',(req,res)=>{
	const {type} = req.query;
	UserModel.find({type},filter,(err,users)=>{
		res.send({code:0,data:users})
	})
})


/* 获 取 当 前 用 户 所 有 相 关 聊 天 信 息 列 表 */ 
router.get('/msglist', function (req, res) { 
	// 获 取 cookie 中 的 userid 
	const userid = req.cookies.userid 
	// 查 询 得 到 所 有 user 文 档 数 组 
	UserModel.find(function (err, userDocs) { 
	// 用 对 象 存 储 所 有 user 信 息 : key 为 user 的 _id, val为 name和 header组 成 的 user对 象
		const users = {} 
		//对 象 容 器 
		userDocs.forEach(doc => { 
			users[doc._id] = {username: doc.username, header: doc.header}
		}) 
		
		// const users = userDocs.reduce((users,user)=>{
		// 	users[user._id] = {username: user.username, header: user.header},
		// 	return users
		// },{})
		/* 查 询 userid 相 关 的 所 有 聊 天 信 息 参 数 1: 查 询 条 件 参 数 2: 过 滤 条 件 参 数 3: 回 调 函 数 */ 
		ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) { 
			// 返 回 包 含 所 有 用 户 和 当 前 用 户 相 关 的 所 有 聊 天 消 息 的 数 据 
			res.send({code: 0, data: {users, chatMsgs}}) 
		}) 
	}) 
})

/* 修 改 指 定 消 息 为 已 读 */ 
router.post('/readmsg', function (req, res) { 
		// 得 到 请 求 中 的 from 和 to 
		const from = req.body.from 
		const to = req.cookies.userid
		/* 更 新 数 据 库 中 的 chat数 据
		参 数 1:
		查 询 条 件
		参 数 2:
		更 新 为 指 定 的 数 据 对 象
		参 数 3:
		是 否 1
		次 更 新 多 条 ,
		默 认 只 更 新 一 条
		参 数 4:
		更 新 完 成 的 回 调 函 数
		*/ 
		ChatModel.update({from, to, read: false}, {read: true}, {multi: true},function (err, doc) { 
			 console.log('/readmsg', doc) 
			 res.send({code: 0, data: doc.nModified}) // 更 新 的 数 量 		 
		}) 
})



module.exports = router;
