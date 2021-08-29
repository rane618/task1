const mongoose =require("mongoose")

mongoose.connect(process.env.MONGO_URL,{
               useNewUrlParser:true,
               useUnifiedTopology:true})
               .then(() => {
                   console.log('Connected Database Successfully');
               }).catch((e) =>{
               console.log('Database not connected'
               )})

