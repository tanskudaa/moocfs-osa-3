const express = require('express')
const app = express()

app.use(express.json())


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
    info = (
        '<p>Hello</p>',
        '<p>Hell-o</p>'
    )
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
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(a => a.id))
        : 0

    return maxId + 1
}
// New person
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name and/or number missing'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
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


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

