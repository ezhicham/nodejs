

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
,  createdAt: {
    type: Date,
    default: Date.now
  }
  , updatedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  },
  __v: { type: Number, select: false }      
});

module.exports = mongoose.model('User', userSchema);