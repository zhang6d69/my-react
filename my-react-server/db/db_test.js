// 测试使用mongoose操作mongodb数据库
// 连接数据库
//引入mongoose
const mongoose = require('mongoose')
//连接数据库
mongoose.connect('mongodb://localhost:27017/gzhipin')
//获取连接对象
const conn = mongoose.connection;

//绑定连接完成的监听
conn.on('connected',function(){//连接成功回调
	console.log('数据库连接成功')
})
const md5 = require('blueimp-md5')

//定义Schema
const UserSchema = mongoose.Schema({//指定文档的结构:属性名/属性值的类型，是否是必须的/默认值
	username:{type:String,required:true},//用户名
	password:{type:String,required:true},//密码
	type:{type:String,required:true},//类型
	header:{type:String}
})
//定义model
const UserModel = mongoose.model('user',UserSchema)//集合名users

//通过model实例save()添加数据
function testSave(){
	//创建UserModel的实例
	const userModel = new UserModel({username:'Bob2',password:md5('234'),type:'laoban'})
	//调用save()保存数据
	userModel.save((error,userDoc)=>{
		console.log('save()',error,userDoc)
	})
}
//testSave()

//通过Model的find()/findOne()查询多个或一个数据
function testFind(){
	//查询多个
	UserModel.find({_id:'5d2453bb229c462d78931da8'},(err,users)=>{//得到的是包含所有匹配文档对象的数组，如果没有匹配的就是[]
		console.log('find()',err,users)
	})
	//查询一个:得到的是匹配的文档对象，如果没有匹配的就是null
	UserModel.findOne({_id:'5d2453bb229c462d78931da9'},(error,user)=>{
		console.log('findOne()',error,user)
	})
}
//testFind()

//通过findByIdAndUpdate()更新某个数据
function testUpdate(){
	UserModel.findByIdAndUpdate({_id:'5d2453bb229c462d78931da9'},{username:'tanglinxue'},(error,oldUser)=>{
		console.log('findByIdAndUpdate',error,oldUser)
	})
}

//testUpdate()
function testDelete(){
	UserModel.remove({_id:'5d2453bb229c462d78931da9'},(error,doc)=>{
		console.log('remove',error,doc)//{n:1/0,ok:1}
	})
}
testDelete()
