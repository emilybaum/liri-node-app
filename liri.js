require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');

var command = process.argv[2]
var whatToSearch = process.argv.slice(3).join(" ");

// COMMANDS TO WRITE
    // concert-this
    // spotify-this-song
    // movie-this
    // do-what-it-says

switch (command) {
    case 'concert-this': console.log("concert-this selected");
    break;

    case 'spotify-this-song': console.log("spotify-this-song selected");
        searchSpotify(whatToSearch);
    break;

    case 'movie-this': console.log("movie-this selected");
    break;

    case 'do-what-it-says': console.log("do-what-it-says selected");
    break;
}

var divider = "\n--------------------------------------------------------\n"
function searchSpotify(term) {
    var spotify = new Spotify(keys.spotify);
    console.log(term + " was searched");
    spotify.search({ type: 'track', query: term }, function(err, response) {
            if (err) {
                return console.log(err);
            }
            var song = response.tracks.items[0];
            var songName = song.name;
            var artist = song.artists[0].name;
            var preview = song.external_urls.spotify;
            var album = song.album.name;

            var details = [
                "Song Name: " + songName, 
                "Artist: " + artist, 
                "Preview Link: " + preview, 
                "Album: " + album,
            ].join("\n");

        fs.appendFile("logSong.txt", details + divider, (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });

        console.log(divider + details + divider)

    });

}
// node liri.js spotify-this-song '<song name here>'
// This will show the following information about the song in your terminal/bash window
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    // If no song is provided then your program will default to "The Sign" by Ace of Base.


        
// node liri.js concert-this '<_____>'
// "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    // Name of the venue
    // Venue location
    // Date of the Event(use moment to format this as "MM/DD/YYYY")


// node liri.js movie-this '<movie name here>'
// This will output the following information to your terminal/bash window:
    //   * Title of the movie.
    //   * Year the movie came out.
    //   * IMDB Rating of the movie.
    //   * Rotten Tomatoes Rating of the movie.
    //   * Country where the movie was produced.
    //   * Language of the movie.
    //   * Plot of the movie.
    //   * Actors in the movie.
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'


// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

