import mongoose from 'mongoose';
import Poste from './poste.js';

const Schema = mongoose.Schema;

const parcoursSchema = new Schema({
    nom: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
        validate:
            // Manually validate uniqueness to send a "pretty" validation error
            // rather than a MongoDB duplicate key error
            [
                {
                    validator: validateParcoursNameUniqueness,
                    message: 'Parcours {VALUE} already exists'
                }
            ]
    },
    difficulte: {
        type: String,
        required: true,
        enum: ['facile', 'moyen', 'difficile', 'très difficile']
    },
    descr: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Utilisateur',
        required: true,
    },
    postesInclus: {
        type: Array,
        required: true,
        validate:
        [
            {
                validator: validatePostesExists,
                message: '{VALUE} posts not exist'
            }
        ]
    }
});

// Customize the behavior of person.toJSON() (called when using res.send)
parcoursSchema.set('toJSON', {
    transform: transformJsonParcours, // Modify the serialized JSON with a custom function
    virtuals: true // Include virtual properties when serializing documents to JSON
});

/**
 * Given a name, calls the callback function with true if no person exists with that name
 * (or the only person that exists is the same as the person being validated).
 */
function validateParcoursNameUniqueness(value) {
    return this.constructor
        .findOne()
        .where('nom')
        .equals(value)
        .exec()
        .then(existingParcours => {
            return !existingParcours || existingParcours._id.equals(this._id);
        });
}

/**
 * Give an id of a post, calls the callback function with true if the post exists
 */
async function validatePostesExists(value) {
    const postesNotValid = []; 
    await Promise.all(value.map(async poste => {
        let isValid = await existingPost(poste);
        if (!isValid) {
            postesNotValid.push(poste);
        }
    }))
    return postesNotValid.length === 0;
}

function existingPost(poste){
    return Poste
    .findOne()
    .where('_id')
    .equals(poste)
    .exec()
    .then(existingPoste => {
        return !!existingPoste;
    });
}

/**
 * Removes extra MongoDB properties from serialized people.
 */
function transformJsonParcours(doc, json, options) {
    // Remove MongoDB _id & __v (there's a default virtual "id" property)
    delete json._id;
    delete json.__v;

    return json;
}

export default mongoose.model('Trail', parcoursSchema);