const socket=io()

//constant used in client side js
const urlParams = new URLSearchParams(window.location.search)
const username = urlParams.get('username')
const room=urlParams.get('room')

if(username===null||room===null||username==""||room=="")
{   
	window.location.assign('http://localhost:3000/')
}

roomnumber=document.querySelector('#roomnumber')
body=document.querySelector('#body')
messagebox=document.querySelector('#messagebox')
inputmessage=document.querySelector('#inputmessage')
send=document.querySelector('#send')
userlistbox=document.querySelector('#userlist')
scroll=document.querySelector('#scroll')
roomnumber.innerHTML=room




//join room
socket.emit('joined',({username,room}))
socket.on('err',()=>{
body.innerHTML='username already exist in your room'
})
socket.on('newuserjointhechat',(message)=>{
 const html='<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg" style="position:relative;text-align: center;left:150px;"><p>'
                +message+'</p><span class="time_date"></span></div></div>' 
messagebox.innerHTML+=html
})

//left room
socket.on('userleftthechat',(message)=>{
 const html='<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg" style="position:relative;text-align: center;left:150px;"><p>'
                +message+'</p><span class="time_date"></span></div></div>' 
messagebox.innerHTML+=html
})


//refresh user list
socket.on('refreshlist',(userlist)=>{
userlistbox.innerHTML=""
userlist.forEach((value)=>
{const html='<div class="chat_list active_chat"><div class="chat_people"><div class="chat_ib"><h5 class="user_name">'
              +value+'<span class="chat_date"></span></h5></div></div></div>'
userlistbox.innerHTML+=html}
)
})




//recievemeassage
socket.on('recievemessage',({message,username,time})=>
{
 const html='<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p>'
                +message+'</p><span class="time_date">' +time +'</span></div></div>' 
messagebox.innerHTML+=html
})


//sendmessage
send.addEventListener('click',()=>{
const message=inputmessage.value
const d=new Date()

const time=d.getHours()+':'+d.getMinutes()+'-'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()

socket.emit('sendmessage',{message,username,room,time})
const html='<div class="outgoing_msg"><div class="sent_msg"><p>'+message+'</p><span class="time_date">'+time+'</span></div></div>'
messagebox.innerHTML+=html
messagebox.scrollTop = messagebox.scrollHeight
})



//typing..
let timeout=0
inputmessage.addEventListener('keyup',()=>{
   socket.emit('typing',{username,room})  
     
     clearTimeout(timeout)
     timeout=setTimeout(function () {
      socket.emit('typingstop',{username,room}) 
    }, 2000);
})

socket.on('usertyping',({username})=>{

const heading=document.querySelectorAll('.user_name')

heading.forEach((current)=>{

if(current.innerHTML==username+'<span class="chat_date"></span>'){
		
        current.innerHTML=username+'<span class="chat_date">typing...</span>'
}
})


})

//typing stop
socket.on('usertypingstop',({username})=>{

const heading=document.querySelectorAll('.user_name')

heading.forEach((current)=>{
const term=username+'<span class="chat_date">typing...</span>'	

if(current.innerHTML==term){
		
        current.innerHTML=username+'<span class="chat_date"></span>'
}
})


})