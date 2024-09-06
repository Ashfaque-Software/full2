const express = require("express");
const noteModel = require("../models/note.model");
const auth = require("../middleware/auth.middleware");

const noteRouter = express.Router();

// Apply auth middleware to all routes in this router
noteRouter.use(auth);

noteRouter.post("/create", async (req, res) => {
    const { title, content, status } = req.body;
    const userId = req.user._id;

    try {
        const note = new noteModel({
            title, content, status, userId
        });
        await note.save();
        res.status(201).json({ message: "Note created successfully" });
    } catch (error) {
        res.status(500).json({ message: `Error while creating note: ${error.message}` });
    }
});
noteRouter.get("/get",async(req,res)=>{
    const userId=req.user._id
    try {
        const notes=await noteModel.find({userId})
        res.status(200).json({msg:"get all the notes"})
    } catch (error) {
        res.status(404).json({msg:`error getting notes ${error}`})
    }
})

noteRouter.patch("/update/:id", async (req, res) => {
    const payload=req.body
    const noteId=req.params.id
    const userId=req.user._id
    try {
     const note=await noteModel.findOne({_id:noteId})
     if(note.userId.toString()===userId.toString()){
         await noteModel.findByIdAndUpdate({_id:noteId},payload)
         return res.status(200).json({message:"note updated successfully"})
     }else{
         return res.status(401).json({message:"unauthorized"})
     }
    } catch (error) {
     res.status(500).json({message:`error while updating note ${error}`})
    }
 });

noteRouter.delete("/delete/:id",async(req,res)=>{
    const noteId=req.params.id
    const userId=req.user._id
    try {
        const note=await noteModel.findById(noteId)
        if(!note){
            return res.status(404).json({msg:"note not found"})
        }
        if(note.userId.toString()!==userId.toString()){
               return res.status(400).json({msg:"probl in deleting"})
        }
        await noteModel.findByIdAndDelete(noteId)
        res.status(200).json({msg:"note deleted successfully"})
    } catch (error) {
        res.status(500).json({msg:`error deleting successfully ${error}`})    }
})
module.exports = noteRouter;
