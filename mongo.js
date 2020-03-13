const mogoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1)
} 

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0-88lk9.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mogoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})

const contactSchema = new mogoose.Schema({
    name: String,
    number: String,
})

const Contact = mogoose.model('Contact', contactSchema)

if (process.argv.length == 3) {
    // get all data
    console.log('phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
            mogoose.connection.close()
        })
    })
} else if (process.argv.length == 5) {
    // create new object save to database
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    contact.save().then(response => {
        // console.log(response)
        console.log(`add ${response.name} number ${response.number} to phonebook`)
        mogoose.connection.close()
    })
}
