import { Router } from 'express';
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import { IUser, UserModel } from '../models/user.model';
const cloudinary = require("../configs/cloudinary.config");
const upload = require("../configs/multer.config");


const router = Router();


const generateTokenResponse = (user: any) => {
  const token = jwt.sign({
    id: user.id
  }, "Expires In", {
    expiresIn: "1h"
  })
  return {
    id: user.id,
    password: user.password,
    Fullname: user.Fullname,
    isAdmin: user.isAdmin,
    ReferenceFaceURL: user.ReferenceFaceURL,
    token: token,
  };
}

router.post("/login", asyncHandler(
  async (req, res) => {
    const { id, password } = req.body;
    var user = await UserModel.findOne({ id });
    if (!user) {
      res.status(400).send("User does not exist");
      return;
    }
    if (user.password === password) {
      res.send(generateTokenResponse(user));
      return;
    }
    res.status(400).send("Incorrect Password");
  }
))

router.get("/get/", asyncHandler(
  async (req, res) => {
    const users = await UserModel.find();
    res.send(users);                     
  }
))

router.get("/get/:id", asyncHandler(
  async (req, res) =>{
      const user = await UserModel.findOne({id: req.params.id});
      if(!user){
        res.status(400).send("Match Not Found");
        return;
      }
      res.send(user);                       //sending items from database
  }
))

router.patch("/edit", asyncHandler(
  async (req, res) => {
    const { id, Fullname, Department, Year, password } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "Fullname": Fullname,
          "Department": Department,
          "Year": Year,
          "password": password
        }
      },
      { new: true } // Return the updated document
    );
    res.send(updatedUser);
  }
))

router.delete("/delete/:id", asyncHandler(
  async (req, res) => {
    const candidate = await UserModel.findOne({ id: req.params.id });
    await candidate!.deleteOne();
    res.send();
  }
))

router.post("/register", upload.single('image'), asyncHandler(
  async (req, res) => {
    const { id, Fullname, Department, Year, password} = req.body;
    const user = await UserModel.findOne({ id });
    if (user) {
      res.status(400)
        .send('ID Number Already Exist!');
      return;
    }
    
    const newUser: IUser = {
      id,
      Fullname,
      isAdmin: false,
      Department,
      Year,
      password,
      Voted: false,
    }
    const dbUser = await UserModel.create(newUser);
    res.send(dbUser);
  }
))


export default router;