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
const premiumbtn=document.querySelector('#premiumbtn');
premiumbtn.addEventListener('click',premiumuser);

const leaderboardbtn=document.querySelector('#leaderboardbtn');
leaderboardbtn.addEventListener('click',showleaderboard);

const downloadbtn=document.getElementById('downloadbtn');

downloadbtn.addEventListener('click',downloadexpenses);


const downloadedfilesbtn=document.getElementById('downloadedfilesbtn');
downloadedfilesbtn.addEventListener('click',downloadedfiles);



//animate count
let count=0;
let value=0;
function increaseCount(){
    if(count<=total){
        totalexpense.innerHTML=count;
        count=count+value;
        value=value+3;
        setTimeout(increaseCount,1);
    }else{
        totalexpense.innerHTML=total;
    }
}
//decode token
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function addexpense(e){

 try{
    e.preventDefault();
    if(amount.value===''||date.value===''||reason.value===''||category.value==='')
    {
        msg.innerHTML="Please fill in all the Details";
        setTimeout(()=>msg.innerHTML='',3000)
    }
    else  {
    const expensedetails={
       amount:amount.value,
       date:date.value,
       reason:reason.value,
       category:category.value
    };
    const token=localStorage.getItem('token');
    const response =await axios.post('http://localhost:3000/expense/add-expense',expensedetails,{headers:{"Authorization":token}});
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
        const token=localStorage.getItem('token');
        const decodedtoken=parseJwt(token);
        console.log(">>>>>>>>>>>>",decodedtoken);
        const ispremiumuser=decodedtoken.ispremiumuser;
        if(ispremiumuser){
            showpremiumuser();
        }

    const response =await axios.get(`http://localhost:3000/expense/get-expenses`,{headers:{"Authorization":token}});
    console.log(response);
  
        total=0;

        for(let i=0;i<response.data.message.length;i++)
        {
            total+=parseInt(response.data.message[i].amount);
            create(response.data.message[i]);
        }
        
            increaseCount();
        
    }
    catch(err){
        console.log("Error at Delete Function:",err);
    } 
})

    async function del(id,amount){
    try{
        const token=localStorage.getItem('token');
       const tr=document.getElementById(`${id}`);
       const response= await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`,{headers:{"Authorization":token}});
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

   


   async function premiumuser(e){
    try{
        const token=localStorage.getItem('token');
        console.log(token);
        const response =await axios.get(`http://localhost:3000/purchase/premiummembership`,{headers:{'Authorization':token}});
        console.log(response);
        var options={
            "key":response.data.key_id,
            "order_id":response.data.order.id,
            "handler":async function(response){
               const result= await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razor_payment_id},
                {headers:{"Authorization":token}})

                alert('You Are a Premium User Now')

                showpremiumuser();
                console.log(">>>>>>>",result.data.token);
                localStorage.setItem('token',result.data.token);
               

            },

        }
        const rp1=new Razorpay(options);
        rp1.open();
        e.preventDefault();

        rp1.on('payment.failed',function(response){
            console.log(response);
            alert('Something went wrong')
        })

    }
    catch(err){
        console.log(err);
        console.log("error at premiumbtn",err);
    }

   }

   function showpremiumuser(){
    document.getElementById('premiumbtn').style.display="none";
    document.getElementById('premiummsg').innerHTML="You are a Premium User";
    document.getElementById('leaderboardbtn').style.display="block";
    downloadbtn.style.display="block";
    downloadedfilesbtn.style.display="block";
    document.getElementById('downloadedfilesdiv').style.display="block";
  
    
   }

   async function showleaderboard(){
    try{
    const leaderboardtablebody=document.getElementById('leaderboardtablebody');
    const token=localStorage.getItem('token');
    const sortedarray= await axios.get(`http://localhost:3000/premium/leaderboard`,{headers:{'Authorization':token}});

    console.log(">>>>",sortedarray.data.leaderboarddetails);
    let i=1;
    sortedarray.data.leaderboarddetails.forEach((data)=>{
        console.log(data);
        leaderboardtablebody.innerHTML=leaderboardtablebody.innerHTML+`<tr><td>${i}</td><td>${data.username}</td><td>${data.totalexpenses}</td></tr>`;
        i++;
    })
    document.getElementById('leaderboarddetails').style.display="block";
   
    }
    catch(err){
        console.log(err);
    }
    
   }
    
   async function downloadexpenses(e){
    e.preventDefault();
    try{
        const token=localStorage.getItem('token');
        const response  =  await axios.get(`http://localhost:3000/expense/download`,{headers:{'Authorization':token}});
        
        console.log(response);
        if(response.status===200){
            const a=document.createElement('a');
            a.href=response.data.fileURL;
            a.download='myexpense.csv';
            a.click(); 
        }
        else{
             console.log(">>>>>")
            throw new Error(response.data.message);
        }   
    }catch(err){
        console.log(err);
    }
   }

   async function downloadedfiles(e){
    
            try{
                e.preventDefault();
               const token= localStorage.getItem('token');
            const response= await axios.get(`http://localhost:3000/expense/downloadedfiles`,{headers:{'Authorization':token}});

            const downloadedfileslist=document.getElementById('downloadedfileslist');
            for(let i=0;i<response.data.message.length;i++){

                //console.log(response.data.message[0].url);
                downloadedfileslist.innerHTML+=`<li><a href=${response.data.message[i].url}>TextFile${i}</a></li>`
            }
                

            }catch(err){
                console.log(err);
            }
   }
    