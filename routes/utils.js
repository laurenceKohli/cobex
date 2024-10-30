import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

function VerfyID(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    res.send("Invalid ID");
  }else{
    next();
  }
}

export { VerfyID };