const express = require('express')
const router = express.Router();
const IndianMeals = require('../Models/IndianMealsModel')

const getAllIndianMeals = router.get('/getallindianmeals',async(req,res)=>{
    try {
        const result = await IndianMeals.find();
        res.send(result)
    } catch (error) {
        res.status(400).json({message:'Could not find Indian meals!'})
    }
})

const deleteIndianMeal = router.post('/deleteindianmeal',async(req,res)=>{
    const productId = req.body.productId;
    try{
      await IndianMeals.findOneAndDelete({_id:productId})
      res.send('Product deleted SuccessFully!')
    }catch(error){
      res.status(400).json({message:'could not delete!'})
    }
  })

  const addNewIndianMeal = router.post('/addnewindianmeal',async(req,res)=>{
    const {product} = req.body;
    const newProduct = new IndianMeals({
      name: product.name,
      price : product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    })
    try{
      await newProduct.save();
     res.send('Meal Added Successfully')
    }catch(error){
     res.status(400).json({message:"Could not add new meal"})
    }
    })
    
    const getIndianMealById = router.post('/getbyid',async(req,res)=>{
      const productId = req.body.productId;
      try{
        const product = await IndianMeals.findOne({_id:productId})
        res.send(product)
      }catch(error){
        res.status(400).json({message:'Could not find Meal!'})
      }
    })
    
    const editIndianMeal = router.post('/editindianmeal',async(req,res)=>{
      const product = req.body.product;
      try{
        const updatedProduct = await IndianMeals.findOne({_id:product._id})
        updatedProduct.name = product.name;
        updatedProduct.category = product.category;
        updatedProduct.description = product.description;
        updatedProduct.image = product.image;
        updatedProduct.price = product.price;
       
        await updatedProduct.save();
        res.send('Meal Updated Successfully!')
      }catch(error){
        res.status(400).json({message:'Could not update Meal!'})
      }
    })

module.exports  = {getAllIndianMeals,deleteIndianMeal,getIndianMealById,addNewIndianMeal,editIndianMeal} 