import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
  }
},{timestamps: true})

UserSchema.pre('save', async function(next){
  if(this.isModified('password')){
    const hash = await bcrypt.hash(this.password, 8)
    this.password = hash
  }
  next()
})

UserSchema.methods.comparePassword = async function(password) {
  const result = await bcrypt.compareSync(password, this.password)
  return result
}

const User = mongoose.model('User', UserSchema)
export default User