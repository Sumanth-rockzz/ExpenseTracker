const Expenselist =document.getElementById('expenseslist');
const add=document.querySelector('#add');
const amount=document.querySelector('#amount');
const date=document.querySelector('#date');
const reason=document.querySelector('#reason');
const category=document.querySelector('#category');
const msg=document.querySelector('#msg');
let total=0;
const totalexpense=document.getElementById('totalexpense');
add.addEventListener('click',addexpense);
async function addexpense(e){

 try{
    e.preventDefault();
    if(amount.value===''||date.value===''||reason.value===''||category.value==='')
    {
        msg.innerHTML="Please fill in all the Details";
        setTimeout(()=>msg.innerHTML='',3000)
    }
    else  {
    const myobj={
       amount:amount.value,
       date:date.value,
       reason:reason.value,
       category:category.value
    };
    const response =await axios.post('http://localhost:3000/expense/add-expense',myobj)
    total+=parseInt(amount.value);
    totalexpense.innerHTML=total;
    console.log(response.data.message);
         create(response.data.message);
}
}
catch(err){
    console.log("Error at add Function:",err);
}
}
function create(data){
    try{
    Expenselist.innerHTML=Expenselist.innerHTML+`<tr id="${data.id}"><td>${data.date}</td><td>${data.amount}</td>
    <td>${data.reason}</td><td>${data.category}</td>
    <td><button class="btn btn-danger" onclick="del('${data.id}','${data.amount}')">Delete</button></td>
    <td><button class="btn btn-primary" onclick="edit('${data.id}','${data.amount}','${data.date}','${data.reason}','${data.category}')">Edit</button></td></tr>`;
    document.getElementById('myform').reset();
    }
    catch(err){
        console.log("Error at create Function:",err);
    } 
    
}  
window.addEventListener('DOMContentLoaded',async ()=>{

    try{
    const response =await axios.get(`http://localhost:3000/expense/get-expenses`);
    console.log(response);
  
        total=0;

        for(let i=0;i<response.data.message.length;i++)
        {
            total+=parseInt(response.data.message[i].amount);
            create(response.data.message[i]);
        }
        totalexpense.innerHTML=total;
    }
    catch(err){
        console.log("Error at Delete Function:",err);
    } 
})

    async function del(id,amount){
    try{
       const tr=document.getElementById(`${id}`);
       const response= await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`);
        total-=parseInt(amount);
        totalexpense.innerHTML=total;
        Expenselist.removeChild(tr);
    }
    catch(err){
        console.log("Error at Delete Function:",err);
    }  
    }

    async function edit(id,amount,date,reason,category){
        try{
           
        const tr=document.getElementById(`${id}`);
        document.getElementById('amount').value=amount;
        document.getElementById('date').value=date;
        document.getElementById('reason').value=reason;
        document.getElementById('category').value=category;

        const response = await axios.delete(`http://localhost:3000/expense/edit-expense/${id}`)
        total-=parseInt(amount);
        totalexpense.innerHTML=total;
        Expenselist.removeChild(tr);
        }
        catch(err){
            console.log("Error at Edit Function:",err);
        } 
    }
