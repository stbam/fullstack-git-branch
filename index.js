const express=  require('express')
var morgan = require('morgan')
const app=express()
const Person = require('./models/Person')
app.use(express.json())


const cors=require('cors')

app.use(cors())
app.use(express.static('dist'))

let persons= [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json());

app.get('/api/persons',(request,response)=>{
     // response.json(persons)
  Person.find({}).then(people=>{
    response.json(people)
  })

  // response.json(persons)
   // console.log('"test')

}) 



app.get('/api/persons/:id',(request,response,next)=>{
   /* const id = request.params.id
   const person= persons.find(p=>p.id===id)
 

    if(person){
      response.json(person)
    }else{
        response.status(404).send({error:"person not found"})
    }*/
  // response.json(persons)
   // console.log('"test')
 Person.findById(request.params.id).then(person=>{
  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }

 }).catch(error=>next(error))



}) 
app.get('/api/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      response.send(`<p>Phonebook has info for ${count} people</p><p>${currentTime}</p>`)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response)=>{
  /*  const id = request.params.id
    persons = persons.filter((person)=>person.id!==id)
    response.status(204).end()*/

    Person.findByIdAndDelete(request.params.id).then(()=>{
      response.status(204).end()

    }).catch(error=>{
      console.log(error)
      response.json(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const generateId=()=>{
       /* const maxId=persons.length>0?Math.max(...persons.map((person)=>Number(person.id))):0
        return String(maxId+1)*/
         return Math.floor(Math.random()*10000).toString()
    }

app.post('/api/persons',(request,response)=>{
    const body=request.body

    if(!body.name || !body.number){
        return response.status(404).json({error:"name or number missing"})
    }
    const person = new Person({
      name:body.name,
      number: body.number
    })
    person.save().then(savedPerson=>{
        response.json(savedPerson)
    })

   /* const person = {
        id:generateId(),
        name: body.name,
        number:body.number
    }
    persons=persons.concat(person)
    response.json(person)*/
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
//use tiny for logging
//app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

morgan.token('body',(req,res)=>{
    return req.method === 'POST' ? JSON.stringify(req.body):''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(errorHandler)
const PORT = 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)