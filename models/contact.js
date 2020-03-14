const mogoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mogoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const contactSchema = new mogoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    number: String,
})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mogoose.model('Contact', contactSchema)