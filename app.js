const express=require('express')
const path=require('path')
const socketio=require('socket.io')
const http=require('http')
const { adduser, deleteuser , getroom}=require('./user')
const app=express()

app.use(express.static(path.join(__dirname,'/public')))

const server=http.createServer(app)
const io=socketio(server)


io.on('connection',(socket)=>{
  console.log('ok, server is running')
//joining room
socket.on('joined',( { username , room } )=>{
const result=adduser({id:socket.id,username,room})
if(result)
{socket.join(room)
//refresh uselist
const userlist=getroom({room})
socket.to(room).broadcast.emit('newuserjointhechat',username+'  has joined the chat!!!')
io.to(room).emit('refreshlist',userlist)
}
else
{
socket.emit('err')
}
})

//leaving room
socket.on('disconnect',()=>{
const del=deleteuser({id:socket.id})
//refresh userlist

if(!del){return}
socket.to(del.room).broadcast.emit('userleftthechat',del.username+'  has left the chat!!!')	
const userlist=getroom({room:del.room})
io.to(del.room).emit('refreshlist',userlist)
})



//socket sending message to server
socket.on('sendmessage',({message,username,room,time})=>{

socket.to(room).broadcast.emit('recievemessage',{message,username,time})

})

//typing..
socket.on('typing',({username,room})=>
io.to(room).emit('usertyping',{username})
)

socket.on('typingstop',({username,room})=>
io.to(room).emit('usertypingstop',{username})
)

})



server.listen(3000)