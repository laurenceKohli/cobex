import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const posteSchema = new Schema({
    geoloc: {
        type: {
              lat: Number,
              long: Number
            },
        required: true,
    },
    number: {
        type: Number,
        required: true,
        unique: true,
        min: 30,
        validate:
        [
            {
                validator: validatePosteNumberUniqueness,
                message: 'Post number {VALUE} already exists'
            }
        ]
    },
    estAccessible: {
        type: Boolean,
        default: true,
    },
    images : {
        type: Array,
    },
    descr : {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    code : {
        type: String,
        required: true,
    }
});

// Customize the behavior of person.toJSON() (called when using res.send)
posteSchema.set('toJSON', {
    transform: transformJsonParcours, // Modify the serialized JSON with a custom function
    virtuals: true // Include virtual properties when serializing documents to JSON
});

/**
 * Given a name, calls the callback function with true if no person exists with that name
 * (or the only person that exists is the same as the person being validated).
 */
function validatePosteNumberUniqueness(value) {
    return this.constructor
        .findOne()
        .where('number')
        .equals(value)
        .exec()
        .then(existingPoste => {
            return !existingPoste || existingPoste._id.equals(this._id);
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

export default mongoose.model('Poste', posteSchema);