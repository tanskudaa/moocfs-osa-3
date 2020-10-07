const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('password must be supplied as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://tanskudaa:${password}@cluster0.0nttw.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

if (process.argv.length === 4) {
  console.log('both name and number must be submitted to add person')
  process.exit(1)
}

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(res => {
    console.log('person added:')
    console.log(res)
    mongoose.connection.close()
  })
}
else {
  Person.find({}).then(res => {
    console.log('all people in phonebook:')
    res.forEach(a => {
      console.log(`${a.name} ${a.number}`)
    })
    mongoose.connection.close()
  })
}
