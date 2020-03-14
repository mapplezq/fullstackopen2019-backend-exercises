require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Contact = require('./models/contact')

app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('post-body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
    response.json(contacts.map(contact => contact.toJSON()))
    })
})

//   app.get('/info', (request, response) => {
//       response.send(`<p>Phonebook has info for ${persons.length} people<p/> <p>${new Date()}</p>`)
//   })

  app.get('/api/persons/:id', (request, response, next) => {
      Contact.findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
      Contact.findOneAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
  })

  app.post('/api/persons', (request, response) => {
      const body = request.body
      console.log(body)
      if (!body.name || !body.number) {
          response.status(400).json({
              error: 'name or number missing'
          })
      } 
      
      Contact.find({name: body.name }).then(conatacts => {
          if (conatacts.length > 0) {
            response.status(400).json({
                error: 'name must be unique'
            })
          }

          const contact = new Contact( {
            name: body.name,
            number: body.number,
        })
  
        contact.save().then(savedContact => {
          response.json(savedContact.toJSON())
        })
      })
  })

  app.put('/api/persons/:id', (request, response, next) => {
      const body = request.body

      Contact.findOneAndUpdate({name: body.name}, {number: body.number}, {new: true})
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
    }

  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    
    next(error)
  }

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })