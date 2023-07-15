import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/auth-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err))