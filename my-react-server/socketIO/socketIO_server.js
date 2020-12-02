
const {ChatModel} = require('../db/models')
module.exports = function(server){
	const io = require('socket.io')(server)
	io.on('connection',(socket)=>{
		console.log('有一个客户端连接上了服务器')
		socket.on('sendMsg',({from,to,content})=>{
			console.log('服务器接收到客户端发送的消息',{from,to,content})
			const chat_id = [from,to].sort().join('_')
			const create_time = Date.now()
			new ChatModel({from,to,content,chat_id,create_time}).save((err,chatMsg)=>{
				io.emit('receiveMsg',chatMsg)
			})		
		})
	})
	
}