const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const content= process.argv[3]
const number =process.argv[4]
const url = `mongodb+srv://stbacmtd:${password}@cluster0.xr8ufm7.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  number: String,
})

const PhoneBook = mongoose.model('PhoneBook', noteSchema)

if(content&&number){
    const phonebook = new PhoneBook({content,number});
    phonebook.save().then(()=>{
        console.log(`added ${content} number ${number} to phonebook`)
        mongoose.connection.close()
    })

}else{
    PhoneBook.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
});
}

/*const phonebook = new PhoneBook({
  content: 'Anna',
  number: '040-1234556',
})*/

/*phonebook.save().then(result => {
  console.log(`added ${phonebook.content} number ${phonebook.number}`)
  mongoose.connection.close()
})*/
