const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const MAX_ID = Number.MAX_SAFE_INTEGER


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Taneli Hongisto",
        number: "040-654321",
        id: 2
    },
    {
        name: "Tupsula",
        number: "112",
        id: 3
    }
]

//
// HTTP GET
//
// Info
app.get('/info', (req, res) => {
    info = (`\
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>
    `)
    res.send(info)
})
// All persons
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
// Individual persons
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(a => a.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

// 
// HTTP POST
//
// Generate id
const generateId = (count = 0) => {
    const id = Math.ceil(Math.random() * MAX_ID)

    if (persons.find(a => a.id === id)) {
        // console.log(`id ${id} taken, generating new...`)
        if (count > 10) {
            console.log('too many id generate requests! aborting')
            return -1
        }
        else {
            return generateId(count + 1)
        }
    }
    else {
        // console.log(`found unique id ${id}, returning for POST call`)
        return id
    }
}
// New person
app.post('/api/persons', (req, res) => {
    const body = req.body

    // Must have name
    if (!body.name) {
        return res.status(400).json({
            error: 'must supply name'
        })
    }
    // Name must be unique
    else if (persons.find(a => a.name === body.name) !== undefined) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    // Must have number
    else if (!body.number) {
        return res.status(400).json({
            error: 'must supply number'
        })
    }

    // Create and add new entry
    else {
        const id = generateId()
        if (id === -1) {
            return res.status(400).json({
                error: 'error generating entry id'
            })
        }
        else {
            const newPerson = {
                name: body.name,
                number: body.number,
                id: id
            }

            persons = persons.concat(newPerson)
            res.json(newPerson)
        }
    }
})

//
// HTTP DELETE
//
// Delete person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(a => a.id !== id)
    res.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
