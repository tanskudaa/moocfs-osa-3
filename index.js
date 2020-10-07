const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


/*
 * HTTP GET
 */
// Info
app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    let count = 0
    result.forEach(() => count += 1)
    const info = (`\
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date}</p>
    `)
    response.send(info)
  })
})

// All persons
app.get('/api/persons', (request, response) => {
  let persons = []
  Person.find({}).then(result => {
    result.forEach(a => {
      persons = persons.concat(a)
    })
    response.json(persons)
  })
})

// Individual persons
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) response.json(person)
      else response.status(404).end()
    })
    .catch(error => next(error))
})


/*
 * HTTP POST
 */
// New person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

/*
 * HTTP PUT
 */
// Update number
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

/*
 * HTTP DELETE
 */
// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


/*
 * Error handler
 */
// 400 bad request
const unknownEndpoint = (error, request, response, next) => {
  console.log(`${error.name}: ${error.message}`)
  if (typeof error.name !== 'undefined') {
    response.status(400).send(error.message)
  }
  else {
    error => next(error)
  }
}
app.use(unknownEndpoint)

// 404 not found
app.use((request, response) => {
  response.status(404).end()
})

/*
 * Listen for connections
 */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
