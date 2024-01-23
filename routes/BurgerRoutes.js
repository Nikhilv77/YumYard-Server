const express = require('express');
const router = express.Router();
const burgerModel = require('../Models/BurgerModel')
const getAllBurgers = router.get('/getallburgers',async(req,res)=>{
try {
   const allBurgers = await burgerModel.find();
   res.send(allBurgers)
} catch (error) {
    res.status(400).json({message:'No Burger Found!'})
}
})

const addNewBurger = router.post('/addnewburger',async(req,res)=>{
    const {product} = req.body;
    
    const newProduct = new burgerModel({
      name: product.name,
      price : product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    })
    
    try{
      await newProduct.save();
     res.send('Burger Added Successfully')
    }catch(error){
     res.status(400).json({message:"Could not add new burger"})
    }
    })
    
    const deleteBurger = router.post('/deleteburger',async(req,res)=>{
      const productId = req.body.productId;
      try{
        await burgerModel.findOneAndDelete({_id:productId})
        res.send('Burger deleted SuccessFully!')
      }catch(error){
        res.status(400).json({message:'could not delete!'})
      }
    })
    
    const getBurgerById = router.post('/getbyid',async(req,res)=>{
      const productId = req.body.productId;
      try{
        const product = await burgerModel.findOne({_id:productId})
        res.send(product)
      }catch(error){
        res.status(400).json({message:'Could not find product!'})
      }
    })
    
    const editBurger = router.post('/editburger',async(req,res)=>{
      const product = req.body.product;
      try{
        const updatedProduct = await burgerModel.findOne({_id:product._id})
        updatedProduct.name = product.name;
        updatedProduct.category = product.category;
        updatedProduct.description = product.description;
        updatedProduct.image = product.image;
        updatedProduct.price = product.price;
       
        await updatedProduct.save();
        res.send('Product Updated Successfully!')
      }catch(error){
        res.status(400).json({message:'Could not updated Product!'})
      }
    })
module.exports = {getAllBurgers,addNewBurger,editBurger,deleteBurger,getBurgerById} 