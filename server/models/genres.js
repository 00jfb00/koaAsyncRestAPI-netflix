import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const genreSchema = new Schema(
  {
      id: Number,
      name: String
  }
);

export default mongoose.model('Genres', genreSchema);
