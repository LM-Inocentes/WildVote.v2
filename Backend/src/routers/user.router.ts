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
    Year: user.Year,
    FingerprintIndex: user.FingerprintIndex,
    FingerprintAuth: user.FingerprintAuth,
    FingerprintRegistered: user.FingerprintRegistered
  };
}

router.post("/login", asyncHandler(
  async (req, res) => {
    const { id, password } = req.body;
    var user = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "FingerprintAuth": false,
        }
      },
      { new: true } // Return the updated document
    );
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

router.patch("/logout", asyncHandler(
  async (req, res) => {
    const { id } = req.body;
    var user = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "FingerprintAuth": false,
        }
      },
      { new: true } // Return the updated document
    );
    res.send(user);
  }
))

router.post("/login/fingerprint", asyncHandler(
  async (req, res) => {
    const { FingerprintIndex } = req.body;
    var user = await UserModel.findOneAndUpdate(
      { FingerprintIndex: FingerprintIndex }, // Find user by id
      {
        $set: {
          "FingerprintAuth": true,
        }
      },
      { new: true } // Return the updated document
    );
    res.send(generateTokenResponse(user));
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

router.get('/user-count', asyncHandler(async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

router.get('/user-count/voted', asyncHandler(async (req, res) => {
  try {
    const votedUserCount = await UserModel.countDocuments({ Voted: true });
    res.status(200).json({ votedUserCount });
  } catch (error) {
    console.error('Error fetching voted user count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

router.get('/user-count/fingerprint/registered', asyncHandler(async (req, res) => {
  try {
    let fingerprintIndex = 1; // Starting index
    let userExists:any = true;

    // Loop to find the next available fingerprint index
    while (userExists) {
      userExists = await UserModel.exists({ FingerprintIndex: fingerprintIndex });
      if (userExists) {
        fingerprintIndex++;
      }
    }

    res.status(200).json({ FingerprintIndex: fingerprintIndex });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

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
router.patch("/fingerprint", asyncHandler(
  async (req, res) => {
    const { id, FingerprintIndex } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: id }, // Find user by id
      {
        $set: {
          "FingerprintRegistered": true,
          "FingerprintIndex": FingerprintIndex,
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


router.patch("/reset/all/fingerprint", asyncHandler(
  async (req, res) => {
    try {
      // Update all users, setting isAdmin to false
      const updatedUsers = await UserModel.updateMany(
        {}, // No filter means update all documents
        { $set: { 
          FingerprintIndex: 0,
          FingerprintRegistered: false
        } },
      );
      res.send({ message: 'Updated successfully'});
    } catch (error) {
      res.status(500).send({ message: 'Error updating users', error });
    }
  }
));

router.delete("/delete/:id", asyncHandler(
  async (req, res) => {
    const candidate = await UserModel.findOne({ id: req.params.id });
    await candidate!.deleteOne();
    res.send();
  }
))

router.post("/register", asyncHandler(
  async (req, res) => {
    const { id, Fullname, Department, Year, password, FingerprintRegistered} = req.body;
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
      FingerprintIndex: 0,
      FingerprintAuth: false,
      FingerprintRegistered,
    }
    const dbUser = await UserModel.create(newUser);
    res.send(dbUser);
  }
))


export default router;