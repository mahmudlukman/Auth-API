import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const ResetTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now()
  }
})

ResetTokenSchema.pre('save', async function(next){
  if(this.isModified('token')){
    const hash = await bcrypt.hash(this.token, 8)
    this.token = hash
  }
  next()
})

ResetTokenSchema.methods.compareToken = async function(token) {
  const result = await bcrypt.compareSync(token, this.token)
  return result
}

const ResetToken = mongoose.model('ResetToken', ResetTokenSchema)
export default ResetToken