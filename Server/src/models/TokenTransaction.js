import mongoose from 'mongoose';

const tokenTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  source: {
    type: String,
    required: true,
    enum: ['recycling', 'volunteering', 'redemption', 'wallet_bonus', 'other']
  },
  details: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const TokenTransaction = mongoose.model('TokenTransaction', tokenTransactionSchema);

export default TokenTransaction;
