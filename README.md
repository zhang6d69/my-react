#  一、项目概述

1. 本项目是一个前后端分离的招聘SPA。
2. 项目实现了注册/登录，招聘者（老板）/应聘者（大神）列表和实时聊天功能。



#  二、技术栈



1. 前端：react + react-router-dom + redux + antd-mobile
2. 后端：express + mongodb + mongoose + socket.io
3. 前后端交互：ajax
4. 其它：blueimp-md5(密码加密)



#  三、项目结构



```
├─my-react-client
│  ├─public
│  └─src
│      ├─api
│      ├─assets
│      │  ├─css
│      │  └─images
│      ├─components
│      │  ├─header-selector
│      │  ├─logo
│      │  ├─nav-footer
│      │  │  └─images
│      │  ├─not-found
│      │  └─user-list
│      ├─containers
│      │  ├─chat
│      │  ├─dashen
│      │  ├─dashen-info
│      │  ├─laoban
│      │  ├─laoban-info
│      │  ├─login
│      │  ├─main
│      │  ├─message
│      │  ├─personal
│      │  └─register
│      ├─redux
│      ├─test
│      └─utils
└─my-react-server
    ├─bin
    ├─db
    ├─public
    │  └─stylesheets
    ├─routes
    ├─socketIO
    └─views
```



#  四、API

## 1、注册

### 请求URL：

	http://localhost:3000/register

### 请求方式：

	POST

### 参数类型

	|参数		|是否必选 |类型     |说明
	|username    |Y       |string   |用户名
	|password    |Y       |string   |密码
	|type        |Y       |string   |类型

### 返回示例：

	成功:
	    {
	      "code": 0,
	      "data": {
	        "_id": "5ae133e621388d262c8d91a6",
	        "username": "ds2",
	        "type": "dashen"
	      }
	    }
	失败
	    {
	      "code": 1,
	      "msg": "此用户已存在"
	    }


## 2、登陆

### 请求URL：

	httP://localhost:3000/login

### 请求方式：

	POST

### 参数类型

	|参数		|是否必选 |类型     |说明
	|username    |Y       |string   |用户名
	|password    |Y       |string   |密码

### 返回示例：

	成功:
	    {
	      "code": 0,
	      "data": {
	        "_id": "5ae1338a21388d262c8d91a5",
	        "username": "ds1",
	        "type": "dashen",
	        "__v": 0
	      }
	    }
	失败
	    {
	      "code": 1,
	      "msg": "用户名或密码错误"
	    }

## 3、更新用户信息

### 请求URL：

	http://localhost:3000/update

### 请求方式：

	POST

### 参数类型：

	|参数		|是否必选 |类型     |说明
	|header    |Y       |string   |头像名称
	|info      |N       |string   |介绍
	|post      |N       |string   |职位
	|salary    |N       |string   |月薪
	|company   |N       |string   |公司

### 返回示例：

	成功:
	    {
		    "code": 0,
		    "data": {
		        "header": "头像2",
		        "info": "react/vue",
		        "post": "前端工程师",
		        "company": "Oracle",
		        "salary": "18K",
		        "_id": "5ae1f088d37a442b749fc143",
		        "username": "laoban1",
		        "type": "laoban"
		    }
		}
	失败
	    {
	      "code": 1,
	      "msg": "请先登陆"
	    }


## 4、获取当前的user(根据cookie)

### 请求URL：

	http://localhost:3000/user

### 请求方式：

	GET

### 参数类型

	无

### 返回示例：

	成功:
	    {
		    "code": 0,
		    "data": {
		        "_id": "5ae1f088d37a442b749fc143",
		        "username": "laoban1",
		        "type": "laoban",
		        "__v": 0,
		        "salary": "18K",
		        "company": "Oracle",
		        "post": "前端工程师",
		        "info": "react/vue",
		        "header": "头像2"
		    }
		}
	失败
	    {
	      "code": 1,
	      "msg": "请先登陆"
	    }


## 5、获取用户列表

### 请求URL：

	http://localhost:3000/userlist

### 请求方式：

	GET

### 参数类型: query

	|参数		|是否必选 |类型     |说明
	|type       |Y       |string   |类型(dashen/laoban)

### 返回示例：

	{
	    "code": 0,
	    "data": [
	        {
	            "_id": "5ae1d5d19151153d30e008fd",
	            "username": "ds2",
	            "type": "dashen",
	            "__v": 0
	        },
	        {
	            "_id": "5ae1ddd99ca58023d82351ae",
	            "username": "aa",
	            "type": "dashen",
	            "__v": 0,
	            "post": "前端工程师",
	            "info": "Rect/Vue",
	            "header": "头像1"
	        }
	    ]
	}


## 6、获取当前用户的聊天消息列表

### 请求URL：

	http://localhost:3000/msglist

### 请求方式：

	GET

### 参数类型

	无

### 返回示例：

	{
	    "code": 0,
	    "data": {
	        "users": {
	            "5ae1d5d19151153d30e008fd": {
	                "username": "ds2"
	            },
	            "5ae1ddd99ca58023d82351ae": {
	                "username": "aa",
	                "header": "头像1"
	            },
	            "5ae1df049ca58023d82351af": {
	                "username": "aa2"
	            },
	            "5ae1e72aa072c522e024b18e": {
	                "username": "bb",
	                "header": "头像3"
	            },
	            "5ae1f088d37a442b749fc143": {
	                "username": "laoban1",
	                "header": "头像2"
	            }
	        },
	        "chatMsgs": [
				{
	                "read": false,
	                "_id": "5ae1f3c3a95eb824841199f1",
	                "from": "5ae1f088d37a442b749fc143",
	                "to": "5ae1ddd99ca58023d82351ae",
	                "content": "aa",
	                "create_time": 1524757443374,
	                "__v": 0
	            }
			]
	    }
	}

## 7、 修改指定消息为已读

### 请求URL：

	http://localhost:300/readmsg

### 请求方式：

	post

### 参数类型：

	|参数		|是否必选 |类型     |说明
	|from       |Y       |string   |发送消息用户的id

### 返回示例：

	{code: 0, data: 2}





# 五、项目运行

```
//启动客户端
cd my-react-client
npm i
npm start
访问：http://localhost:3000

//启动mongodb
cmd模式下:
进入mongodb安装目录
cd bin
net start mongodb

//启动服务端
cd my-react-server
npm i
npm start
服务端在4000端口监听
```

