const cloudinary = require("../configs/cloudinary.config");
const upload = require("../configs/multer.config");
import { Router } from 'express';
import  asyncHandler  from 'express-async-handler';
import { CandidateModel, ICandidate } from '../models/candidate.models';

const router = Router();

router.post("/add", upload.single('profile'), asyncHandler(
  async (req, res) => {
    const { id, Fullname, Department, PartyList, Position, Year } = req.body;
    const user = await CandidateModel.findOne({ id });
    if (user) {
      res.status(400)
        .send('Candidate Already Exists!');
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
      Votes: 0
    }
    const dbCandidate = await CandidateModel.create(newCandidate);
    res.send(dbCandidate);
  }
))


export default router;