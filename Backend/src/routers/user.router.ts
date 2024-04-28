import { Router } from 'express';
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import { IUser, UserModel } from '../models/user.model';
import { IUserVote, UserVoteModel } from '../models/vote.model';
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
    ReferenceFingerPrint: user.ReferenceFingerPrint,
    token: token,
    Voted: user.Voted,
    Department: user.Department,
    Year: user.Year
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

router.post("/vote", asyncHandler(
  async (req, res) => {
    const { id, President, VicePresident, Secretary, Treasurer, Auditor, CPERepresentative } = req.body;
    var user = await UserVoteModel.findOne({ id });
    if (user) {
      res.status(400)
        .send('ID Number Already Exist!');
      return;
    }
    const newUserVote: IUserVote = {
      id, President, VicePresident, Secretary, Treasurer, Auditor, CPERepresentative 
    }
    const dbUser = await UserVoteModel.create(newUserVote);
    res.send(dbUser);
  }
))

router.get("/vote/:id", asyncHandler(
  async (req, res) =>{
      const uservote = await UserVoteModel.findOne({id: req.params.id});
      if(!uservote){
        return;
      }
      res.send(uservote);                     
  }
))

router.delete("/vote/reset", asyncHandler(
  async (req, res) => {
      const result = await UserVoteModel.deleteMany({});
      res.status(204).send(); 
  }));


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
      res.send(user);                     
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

router.patch("/edit/voted", asyncHandler(
  async (req, res) => {
    const { id } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "Voted": true,
        }
      },
      { new: true } // Return the updated document
    );
    res.send(updatedUser);
  }
))

router.patch("/reset/voted", asyncHandler(
  async (req, res) => {
    const { } = req.body;
    try {
      // Update all documents in UserModel to set 'Voted' to false
      const updatedUsers = await UserModel.updateMany(
        { Voted: true }, // Empty filter to match all documents
        {
          $set: {
            "Voted": false, // Set 'Voted' field to false
          }
        },
        { new: true } // Return updated documents
      );
      res.send(updatedUsers); // Send updated documents
    } catch (error) {
      res.status(500).send({ message: "Failed to update documents", error });
    }
  }
));

router.patch("/edit/isAdmin", asyncHandler(
  async (req, res) => {
    const { id } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "isAdmin": true,
        }
      },
      { new: true } // Return the updated document
    );
    res.send(updatedUser);
  }
))

router.patch("/edit/isnotAdmin", asyncHandler(
  async (req, res) => {
    const { id } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "isAdmin": false,
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