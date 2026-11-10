import mongoose from 'mongoose';

export async function connectDB() {
   await mongoose.connect('mongodb+srv://kimmoc:kimmoc-english-for-life-connect@cluster-english-for-lif.htthrpw.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  console.log('MongoDB connected');
}
