const express=  require('express')
var morgan = require('morgan')
const app=express()
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
      response.json(persons)
   

  // response.json(persons)
   // console.log('"test')

}) 



app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person= persons.find(p=>p.id===id)
 

    if(person){
      response.json(person)
    }else{
        response.status(404).send({error:"person not found"})
    }

  // response.json(persons)
   // console.log('"test')

}) 

app.get('/api/info',(request,response)=>{
    const currentTime  = new Date()

    response.send(`<p>phone book has info for 2 people</p>
          <p>${currentTime}</p>
        `)
  
})
app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    persons = persons.filter((person)=>person.id!==id)
    response.status(204).end()
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
    const person = {
        id:generateId(),
        name: body.name,
        number:body.number
    }
    persons=persons.concat(person)
    response.json(person)
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

const PORT = 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)