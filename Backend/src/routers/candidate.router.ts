const cloudinary = require("../configs/cloudinary.config");
const upload = require("../configs/multer.config");
import { Router } from 'express';
import  asyncHandler  from 'express-async-handler';
import { CandidateModel, ICandidate } from '../models/candidate.models';

const router = Router();

router.post("/add", upload.single('profile'), asyncHandler(
  async (req, res) => {
    const { id, Fullname, Department, PartyList, Position, Year, color } = req.body;
    const user = await CandidateModel.findOne({ id });
    if (user) {
      res.status(400)
        .send('Candidate Already Exists!');
      return;
    }

    if (!req.file) {
      res.status(400).send("No Profile Uploaded");
      return;
    }
    
    const result = await cloudinary.uploader.upload(req.file?.path, {
      public_id: id,
      folder: `Candidates/${Position}`
    });
    const newCandidate: ICandidate = {
      id,
      Fullname,
      Department,
      Year,
      PartyList,
      Position,
      Profile: result.secure_url,
      ProfileID: result.public_id,
      Votes: 0,
      color,
    }
    const dbCandidate = await CandidateModel.create(newCandidate);
    res.send(dbCandidate);
  }
))

router.patch("/edit", upload.single('profile'), asyncHandler(
  async (req, res) => {
    const { Position, PartyList, id, Fullname, Department, Year, color } = req.body;
    if (!req.file) {
      const updatedCandidate = await CandidateModel.findOneAndUpdate(
        { id: id }, // Find user by id
        {
          $set: {
            "Position": Position,
            "PartyList": PartyList,
            "Fullname": Fullname,
            "Department": Department,
            "Year": Year,
            "color": color,
          }
        },
        { new: true } 
      );
      res.send(updatedCandidate);
      return;
    }
    //if new profile is uploaded

    const candidate = await CandidateModel.findOne({ id: id });
    await cloudinary.uploader.destroy(candidate?.ProfileID);

    const result = await cloudinary.uploader.upload(req.file?.path, {
      public_id: id,
      folder: `Candidates/${Position}`
    });

    const updatedCandidate = await CandidateModel.findOneAndUpdate(
      { id: id }, 
      {
        $set: {
          "Position": Position,
          "PartyList": PartyList,
          "Fullname": Fullname,
          "Department": Department,
          "Year": Year,
          "Profile": result.secure_url,
          "ProfileID": result.public_id,
        }
      },
      { new: true } 
    );
    res.send(updatedCandidate);
  }
))

router.delete("/remove/:id", asyncHandler(
  async (req, res) => {
    const candidate = await CandidateModel.findOne({ id: req.params.id });
    await cloudinary.uploader.destroy(candidate?.ProfileID);
    await candidate!.deleteOne();
    res.send();
  }
))

router.get("/get/", asyncHandler(
  async (req, res) => {
    const customOrder = [
      "PRESIDENT",
      "VICE-PRESIDENT",
      "SECRETARY",
      "TREASURER",
      "AUDITOR",
      "ARCH REPRESENTATIVE",
      "CHE REPRESENTATIVE",
      "CE REPRESENTATIVE",
      "CPE REPRESENTATIVE",
      "EE REPRESENTATIVE",
      "ECE REPRESENTATIVE",
      "IE REPRESENTATIVE",
      "ME REPRESENTATIVE",
      "EM REPRESENTATIVE",
      "CS REPRESENTATIVE",
      "IT REPRESENTATIVE",
      "CNAHS REPRESENTATIVE",
      "CMBA REPRESENTATIVE",
      "CASE REPRESENTATIVE",
      "CCJ REPRESENTATIVE",
    ];
    const candidates = await CandidateModel.find({
      Position: { $in: customOrder }
    }).sort([
      ['Position', 'asc'], // Custom sort based on the defined order
    ]);
    res.send(candidates);             
  }
));

router.get("/get/:id", asyncHandler(
  async (req, res) =>{
      const user = await CandidateModel.findOne({id: req.params.id});
      if(!user){
        res.status(400).send("Match Not Found");
        return;
      }
      res.send(user);                     
  }
))

router.get("/get/president", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "PRESIDENT" });
    res.send(candidates);                     
  }
))

router.get("/get/vice-president", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "VICE-PRESIDENT" });
    res.send(candidates);                     
  }
))

router.get("/get/secretary", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "SECRETARY" });
    res.send(candidates);                     
  }
))

router.get("/get/treasurer", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "TREASURER" });
    res.send(candidates);                     
  }
))

router.get("/get/auditor", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "AUDITOR" });
    res.send(candidates);                     
  }
))

router.get("/get/arch-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "ARCH REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/che-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CHE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/ce-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/cpe-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CPE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/ee-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "EE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/ece-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "ECE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/ie-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "IE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/me-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "ME REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/em-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "EM REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/cs-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CS REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/it-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "IT REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/cnahs-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CNAHS REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/cmba-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CMBA REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/case-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CASE REPRESENTATIVE" });
    res.send(candidates);                     
  }
))

router.get("/get/ccj-representative", asyncHandler(
  async (req, res) => {
    const candidates = await CandidateModel.find({ Position: "CCJ REPRESENTATIVE" });
    res.send(candidates);                     
  }
))
export default router;