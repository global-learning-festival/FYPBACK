const express = require('express');
const cors = require('cors');
//const multer = require("multer");
const path = require("path");
const product=require('./model/product');

const pool = require('./database')

//////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////
const app = express();


const bodyParser=require('body-parser');
//const pool = require('./db'); //Import from db.js



//const jwt = require("jsonwebtoken");
//const JWT_SECRET = require("./config"); 
//const { user, password } = require('pg/lib/defaults');





//////////////////////////////////////////////////////
// SETUP APP    
//////////////////////////////////////////////////////
app.use(cors());

// REQUIRED TO READ POST>BODY
// If not req.body is empty
app.use(express.urlencoded({ extended: false}));
app.use(express.json())
app.use(bodyParser.json()); 



  app.post('/product',  (req, res)=>{
    
  
    var name = req.params.name
    var description = req.params.description
    var brand = req.params.brand
    var price = req.params.price

    // call the model method add module
    product.addproduct(name, description, brand, price, (err, result)=>{
        if(err){
            console.log(err)
            // respond the error
            res.status(500).send()
        }else{
           
          
            res.status(201).send(result)
        }
    })
     
})

//get product
app.get('/products', (req, res)=>{
  product.getproduct((err, result)=>{
      if(err){
          console.log(err)
          // respond with status 500 
          res.status(500).send()
      }else {
          console.log(result)
          //respond with status 200 and send result back
          res.status(200).send(result.rows)    
      }
  })
})
  