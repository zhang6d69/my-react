var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const {UserModel,ChatModel} = require('../db/models')
const filter = {password:0,_v:0}

//注册的路由
router.post('/register',(req,res)=>{
	const {username,password,type} = req.body;
	UserModel.findOne({username},(err,user)=>{
		if(user){
			res.send({code:1,msg:'此用户已存在'})
		}else {
			new UserModel({username,type,password:md5(password)}).save((error,user)=>{
				res.cookie('userid',user._id,{maxAge:1000*60*60*24})
				const data = {username,type,_id:user._id} 
				res.send({code:0,data})
			})
		}
	})
})

//登录的路由
router.post('/login',(req,res)=>{
	const {username,password} = req.body;
	UserModel.findOne({username,password:md5(password)},filter,(err,user)=>{
		if(user){
			res.cookie('userid',user._id,{maxAge:1000*60*60*24})
			res.send({code:0,data:user})
		}else{
			res.send({code:1,msg:'用户名或密码不正确'})
		}
	})
})

// 更新用户信息
router.post('/update',(req,res)=>{
	const userid = req.cookies.userid;
	if(!userid){
		return res.send({code:1,msg:'请先登陆'})
	}
	const user = req.body;
	UserModel.findByIdAndUpdate({_id:userid},user,(err,oldUser)=>{
		if(!oldUser){
			res.clearCookie('userid')
			return res.send({code:1,msg:'请先登陆'})
		}else{
			const {_id,username,type} = oldUser
			const data = Object.assign(user,{_id,username,type})
			return res.send({code:0,data})
		}
	})
})

//根据cookie中的userid获取用户信息的路由
router.get('/user',(req,res)=>{

	const userid = req.cookies.userid;
	if(!userid){
		return res.send({code:1,msg:'请先登陆'})
	}

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
	const userid = req.cookies.userid 
	UserModel.find(function (err, userDocs) { 
		const users = {} 
		userDocs.forEach(doc => { 
			users[doc._id] = {username: doc.username, header: doc.header}
		}) 
		
		ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) { 
			res.send({code: 0, data: {users, chatMsgs}}) 
		}) 
	}) 
})

router.post('/readmsg', function (req, res) { 
		const from = req.body.from 
		const to = req.cookies.userid
		ChatModel.update({from, to, read: false}, {read: true}, {multi: true},function (err, doc) { 
			 console.log('/readmsg', doc) 
			 res.send({code: 0, data: doc.nModified}) 		 
		}) 
})

module.exports = router;
