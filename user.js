
const table=[]


const adduser=({id,username,room})=>{


const result=table.find((value)=>{
return value.room===room && value.username===username
})


if(result)
{
return false
}

else 
{
table.push({id,username,room})
console.log(table)
return true 
}

}

const deleteuser=({id})=>{

const x=table.findIndex((user)=> user.id===id)

console.log('tableafterdelete:'+table)


    if (x !== -1) {
        return table.splice(x, 1)[0]
    }

return false
}

const getroom=({room})=>{

const userlist=[]
table.find((value)=>{
if(value.room===room){
    userlist.push(value.username)
}})
console.log('userlist:'+userlist)
return userlist

}

module.exports={adduser,deleteuser,getroom}


