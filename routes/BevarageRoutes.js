const express = require('express');
const router = express.Router();
const bevarageModel = require('../Models/BevarageModel')
const getAllBevarages = router.get('/getallbevarages',async(req,res)=>{
try {
   const allBevarages = await bevarageModel.find()
   res.send(allBevarages)
} catch (error) {
    res.status(400).json({message:'No Bevarages Found!'})
}
})

const deleteBevarage = router.post('/deletebevarage',async(req,res)=>{
    const productId = req.body.productId;
    try{
      await bevarageModel.findOneAndDelete({_id:productId})
      res.send('Bevarage deleted SuccessFully!')
    }catch(error){
      res.status(400).json({message:'could not delete!'})
    }
  })
  
  const getBevarageById = router.post('/getbyid',async(req,res)=>{
    const productId = req.body.productId;
    try{
      const product = await bevarageModel.findOne({_id:productId})
      res.send(product)
    }catch(error){
      res.status(400).json({message:'Could not find Bevarage!'})
    }
  })
  
  const editBevarage = router.post('/editbevarage',async(req,res)=>{
    const product = req.body.product;
    try{
      const updatedProduct = await bevarageModel.findOne({_id:product._id})
      updatedProduct.name = product.name;
      updatedProduct.category = product.category;
      updatedProduct.description = product.description;
      updatedProduct.image = product.image;
      updatedProduct.price = product.price;
     
      await updatedProduct.save();
      res.send('Bevarage Updated Successfully!')
    }catch(error){
      res.status(400).json({message:'Could not updated Bevarage!'})
    }
  })

  const addNewBevarage = router.post('/addnewbevarage',async(req,res)=>{
    const {product} = req.body;
    
    const newProduct = new bevarageModel({
      name: product.name,
      price : product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    })
    
    try{
      await newProduct.save();
     res.send('Bevarage Added Successfully')
    }catch(error){
     res.status(400).json({message:"Could not add new bevarage"})
    }
    })
module.exports = {getAllBevarages,editBevarage,deleteBevarage,addNewBevarage,getBevarageById}