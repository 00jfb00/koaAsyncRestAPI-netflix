import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const showSchema = new Schema(
  {
      id: Number,
      name: String,
      image: String,
      details: {
          genres: Array,
          year: String,
          description: String,
          cast: Array,
          episodes: Array
      }
  }
);

export default mongoose.model('Show', showSchema);
