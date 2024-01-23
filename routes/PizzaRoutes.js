const express = require("express");
const router = express.Router();
const pizzaModel = require("../Models/PizzaModel");
const getPizza = router.get("/getallpizzas", (req, res) => {
  pizzaModel
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});
const addNewProduct = router.post('/addnewproduct',async(req,res)=>{
const {product} = req.body;

const newProduct = new pizzaModel({
  name: product.name,
  variants : product.variants,
  prices : product.prices,
  category: product.category,
  image: product.image,
  description: product.description,
})

try{
  await newProduct.save();
 res.send('Product Added Successfully')
}catch(error){
 res.status(400).json({message:"Could not add new product"})
}
})

const deleteProduct = router.post('/deleteproduct',async(req,res)=>{
  const productId = req.body.productId;
  try{
    await pizzaModel.findOneAndDelete({_id:productId})
    res.send('Product deleted SuccessFully!')
  }catch(error){
    res.status(400).json({message:'could not delete!'})
  }
})

const getById = router.post('/getbyid',async(req,res)=>{
  const productId = req.body.productId;

  try{
    const product = await pizzaModel.findOne({_id:productId})
    res.send(product)
  }catch(error){
    res.status(400).json({message:'Could not find product!'})
  }
})

const editProduct = router.post('/editproduct',async(req,res)=>{
  const product = req.body.product;
  try{
    const updatedProduct = await pizzaModel.findOne({_id:product._id})
    updatedProduct.name = product.name;
    updatedProduct.category = product.category;
    updatedProduct.description = product.description;
    updatedProduct.image = product.image;
    updatedProduct.prices = product.prices;

    await updatedProduct.save();
    res.send('Product Updated Successfully!')
  }catch(error){
    res.status(400).json({message:'Could not updated Product!'})
  }
})
module.exports = {getPizza,addNewProduct,deleteProduct,getById,editProduct};

