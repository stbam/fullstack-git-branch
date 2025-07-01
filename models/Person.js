const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
var password = process.argv[2]
//const url = `mongodb+srv://stbacmtd:${password}@cluster0.xr8ufm7.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`
const url = `mongodb+srv://stbacmtd:wDRz7vRvJrnCjDy6@cluster0.xr8ufm7.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`
console.log('connecting to', url)
mongoose.connect(url)
.then(result=>{
        console.log('connected to MongoDB')
}).catch(error=>{
        console.log('error connecting to MongoDB:', error.message)
})
const PersonSchema=new mongoose.Schema({
    name:{
            type:String,
            minLength:3
    },
    number:String,
    number: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function (v) {
        // Must match the format: 2 or 3 digits, a dash, then at least 5 digits (total ≥ 8)
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number! Use format like 09-1234556`
    }
  }
})
PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports=mongoose.model('Person',PersonSchema)