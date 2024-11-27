import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

function VerifyID(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    res.send("Invalid ID");
  }else{
    next();
  }
}

function GetQueryParams(req, res, next) {
    let query = req.query;
    if (query.length > 0) {
        res.send(query);
    } else {
        next();
    }
}

function requireJson(req, res, next) {
  if (req.is('application/json')) {
    return next();
  }
  const error = new Error('This resource only has an application/json representation');
  error.status = 415; // 415 Unsupported Media Type
  next(error);
}

export { VerifyID, GetQueryParams, requireJson };