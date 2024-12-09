import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const resultatSchema = new Schema({
   temps: {
        type: Number,
        min : 0,
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Utilisateur',
        required: true,
    },
    trailID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Trail',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Customize the behavior of person.toJSON() (called when using res.send)
resultatSchema.set('toJSON', {
    transform: transformJsonParcours, // Modify the serialized JSON with a custom function
    virtuals: true // Include virtual properties when serializing documents to JSON
});

/**
 * Removes extra MongoDB properties from serialized people.
 */
function transformJsonParcours(doc, json, options) {
    // Remove MongoDB _id & __v (there's a default virtual "id" property)
    delete json._id;
    delete json.__v;

    return json;
}

export default mongoose.model('Resultat', resultatSchema);