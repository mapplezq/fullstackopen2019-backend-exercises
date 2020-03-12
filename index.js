const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

morgan.token('post-body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))


let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

  app.get('/api/persons', (request, response) => {
      response.json(persons)
  })

  app.get('/info', (request, response) => {
      response.send(`<p>Phonebook has info for ${persons.length} people<p/> <p>${new Date()}</p>`)
  })

  app.get('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id)
      const person = persons.find(person => person.id === id)

      if (person) {
          response.json(person)
      } else {
          response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id)
      persons = persons.filter(person => person.id !== id)

      response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
      const body = request.body
      console.log(body)
      if (!body.name || !body.number) {
          response.status(400).json({
              error: 'name or number missing'
          })
      } else if (persons.find(person => person.name === body.name)) {
        response.status(400).json({
            error: 'name must be unique'
        })
      } 

      const person = {
          name: body.name,
          number: body.number,
          id: Math.round(Math.random()*10000)
      }

      persons = persons.concat(person)
      response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })