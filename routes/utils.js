import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

function VerifyID(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    res.send("Invalid ID");
  }else{
    next();
  }
}

function GetQuerryParams(req, res, next) {
    let query = req.query;
    if (query.length > 0) {
        res.send(query);
    } else {
        next();
    }
}

export { VerifyID, GetQuerryParams };