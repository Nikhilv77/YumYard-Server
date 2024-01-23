const express = require('express');
const router = express.Router();
const SidesModel = require('../Models/SidesModel')
const getAllSides = router.get('/getallsides',async(req,res)=>{
try {
   const allSides = await SidesModel.find()
   res.send(allSides)
} catch (error) {
    res.status(400).json({message:'No Sides Found!'})
}
})

const deleteSide = router.post('/deleteside',async(req,res)=>{
    const productId = req.body.productId;

    try{
      await SidesModel.findOneAndDelete({_id:productId})
      res.send('Side deleted SuccessFully!')
    }catch(error){
      res.status(400).json({message:'could not delete!'})
    }
  })
  
  const getSideById = router.post('/getbyid',async(req,res)=>{
    const productId = req.body.productId;
  
    try{
      const product = await SidesModel.findOne({_id:productId})
      res.send(product)
    }catch(error){
      res.status(400).json({message:'Could not find product!'})
    }
  })
  
  const editSide = router.post('/editside',async(req,res)=>{
    const product = req.body.product;
    try{
      const updatedProduct = await SidesModel.findOne({_id:product._id})
      updatedProduct.name = product.name;
      updatedProduct.category = product.category;
      updatedProduct.description = product.description;
      updatedProduct.image = product.image;
      updatedProduct.price = product.price;
     
      await updatedProduct.save();
      res.send('Side Updated Successfully!')
    }catch(error){
      res.status(400).json({message:'Could not updated Side!'})
    }
  })

  const addNewSide = router.post('/addnewside',async(req,res)=>{
    const {product} = req.body;
    
    const newProduct = new SidesModel({
      name: product.name,
      price : product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    })
    
    try{
      await newProduct.save();
     res.send('Side Added Successfully')
    }catch(error){
     res.status(400).json({message:"Could not add new side"})
    }
    })

module.exports = {getAllSides,addNewSide,deleteSide,editSide,getSideById}