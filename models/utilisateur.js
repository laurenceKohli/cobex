import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const utilisateurSchema = new Schema({
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
                    validator: validatePersonNameUniqueness,
                    message: 'Person {VALUE} already exists'
                }
            ]
    },
    mail: {
        type: String,
        required: true,
        unique: true,
        validate:
            // Manually validate uniqueness to send a "pretty" validation error
            // rather than a MongoDB duplicate key error
            [
                {
                    validator: validatePersonMailUniqueness,
                    message: 'Person {VALUE} already exists'
                },
                {
                    validator: validateIsMail,
                    message: '{VALUE} is not a valid mail'
                }
            ]
    },
    mdp: {
        type: String,
        //TODO : modifier la donnée pour qu'elle soit cryptée
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['utilisateur', 'admin', 'superAdmin'],
        default: 'utilisateur',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Customize the behavior of person.toJSON() (called when using res.send)
utilisateurSchema.set('toJSON', {
    transform: transformJsonPerson, // Modify the serialized JSON with a custom function
    virtuals: true // Include virtual properties when serializing documents to JSON
});

/**
 * Given a name, calls the callback function with true if no person exists with that name
 * (or the only person that exists is the same as the person being validated).
 */
function validatePersonNameUniqueness(value) {
    return this.constructor
        .findOne()
        .where('nom')
        .equals(value)
        .exec()
        .then(existingPerson => {
            return !existingPerson || existingPerson._id.equals(this._id);
        });
}

function validatePersonMailUniqueness(value) {
    return this.constructor
        .findOne()
        .where('mail')
        .equals(value)
        .exec()
        .then(existingPerson => {
            return !existingPerson || existingPerson._id.equals(this._id);
        });
}

function validateIsMail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

/**
 * Removes extra MongoDB properties from serialized people.
 */
function transformJsonPerson(doc, json, options) {
    // Remove MongoDB _id & __v (there's a default virtual "id" property)
    delete json._id;
    delete json.__v;

    return json;
}

export default mongoose.model('Person', utilisateurSchema);