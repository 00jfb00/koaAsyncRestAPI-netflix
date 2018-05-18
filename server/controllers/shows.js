import Shows from '../models/shows';
import Genres from '../models/genres';
const fetch = require("node-fetch");

class ShowsControllers {

  async find(ctx) {
    ctx.body = await Shows.find();
  }

  async findById(ctx) {
    const show = await Shows.findById(ctx.params.id);
    if (!show) {
      ctx.throw(404);
    }
    ctx.body = show;
  }

  async fetch(ctx) {

    for (var i = 1; i <= ctx.params.qntReg; i++) {
      let response = await fetch('http://api.tvmaze.com/shows/' + i + "?embed[]=episodes&embed[]=cast");
      let result = await response.json();
      result = {
        id: result.id,
        name: result.name,
        image: result.image
          ? result.image.original
          : null,
        details: {
          genres: result.genres,
          year: result.premiered,
          description: result.summary,
          cast: result._embedded
            ? result._embedded.cast
            : null,
          episodes: result._embedded
            ? result._embedded.episodes
            : null
        }
      }
      let show = await Shows.find({
        name: result.name
      }, (err, result) => {
        return result
      })
      if (show.length == 0) {
        console.log("New show: " + result.name)
        await new Shows(result).save()
      } else 
        console.log("Old show: " + result.name)
    }

    let genres = await Shows.distinct("details.genres", (err, result) => {
      return result
    });
    for (let genre of genres) {
      let _genre = await Genres.find({
        name: genre
      }, (err, result) => {
        return result
      })
      if (_genre.length == 0) {
        console.log("New genre: " + genre)
        await new Genres({name: genre}).save()
      } else 
        console.log("Old genre: " + genre)
    }
  }

  async findGroupedByGenre(ctx) {

    let groupeds = {}
    let genres = await Shows.distinct("details.genres", (err, genres) => {
      return genres
    });
    for (let genre of genres) {
      await Shows
        .aggregate([
          {
            $project: {
              details: 0
            }
          }, {
            $match: {
              "details.genres": {
                "$in": [genre]
              }
            }
          }, {
            $sort: {
              "details.year": -1
            }
          }, {
            $limit: 5
          }
        ], function (err, shows) {
          groupeds[genre] = shows
        })
    }
    ctx.body = groupeds;
  }

}

export default new ShowsControllers();
