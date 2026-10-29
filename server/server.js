// const e = require('express');
// const express = require('express');
// const app = express();
// app.use(express.json());
// const port = 5000;
// const department =[
//     {id: 1,name:'it'},
//     {id: 2,name: 'hr'}
//     , {id: 3,name: 'finance'},
// ];
// let employees =[
//     {id: 1,name:'ahmed_ali',job:'developer',departid:1},
//     {id: 2,name: 'ali' ,job:'hr',departid:2}
//     , {id: 3,name: 'mohamed',job:'developer',departid:1},
// ];
// app.get('/api/departments',(req,res)=>{
//     res.json(department);
// });

// app.get('/api/employees',(req,res)=>{
//     res.json(employees);
// });
// app.get('/api/employees/:departid',(req,res)=>{
//     let searchdeptid=Number(req.params.departid);
//     let newlist = employees.filter(e=>e.departid=== searchdeptid);
//  if(newlist.length===0)

//     {
//         res.status(404).json ({message:`depaetment with id=${searchdeptid}`});
//     }
//     res.json(newlist)
// }

// );


// app.get('/',(req,res)=>{
//     res.send('employeehub is running')
// })





// app.listen(port,() =>{
// console.log(`system is running ${port}`)
// });

require('dotenv').config();
 
const app = require('./src/app')
const connectDB = require('./src/config/DB');
 
const PORT = process.env.PORT || 5000;
 
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
