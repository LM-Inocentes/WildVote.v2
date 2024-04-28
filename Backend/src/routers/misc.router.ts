import { Router } from 'express';
import  asyncHandler  from 'express-async-handler';
import { UserModel } from '../models/user.model';
import { ElectionModel } from '../models/manage_election.models';

const router = Router();

router.post("/set-election", async (req, res) => {
    const { isElectionStart } = req.body;
    try {
      const electionStatus = await ElectionModel.findOneAndUpdate(
        {}, // Update the first document found (assuming only one document)
        { isElectionStart },
        { new: true } // Create a new document if not found
      );
      res.send(electionStatus);
    } catch (error) {
      res.status(500).send("Error updating election status");
    }
  });

  router.get("/get-election-status", async (req, res) => {
    try {
      // Find the election status document
      const electionStatus = await ElectionModel.findOne();
  
      if (!electionStatus) {
        // If no election status document is found, send a 404 Not Found response
        return res.status(404).send("Election status not found");
      }
  
      // Extract the isElectionStart property from the electionStatus document
      const isElectionStart = electionStatus.isElectionStart;
      
      // Send only the isElectionStart property as a boolean value in the response
      res.send({ isElectionStart });
    } catch (error) {
      console.error("Error retrieving election status:", error);
      res.status(500).send("Error retrieving election status");
    }
  });


  
export default router;