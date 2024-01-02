const express = require('express');
const bodyParser = require('body-parser');
const product=require('./model/product');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.post('/product',  (req, res)=>{
    
  
    var name = req.body.name
    var description = req.body.description
    var brand = req.body.brand
    var price = req.body.price

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


















module.exports = app;
