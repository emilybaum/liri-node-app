require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');

var command = process.argv[2]
var whatToSearch = process.argv.slice(3).join("+");

// COMMANDS TO WRITE
    // concert-this
    // spotify-this-song
    // movie-this
    // do-what-it-says

switch (command) {
    case 'concert-this': console.log("concert-this selected");
        searchBands(whatToSearch);
        // console.log("search term: " + whatToSearch)
    break;

    case 'spotify-this-song': console.log("spotify-this-song selected");
        if (!whatToSearch) {
            whatToSearch = "The Sign";
            searchSpotify(whatToSearch);
        }
        searchSpotify(whatToSearch);        
    break;

    case 'movie-this': console.log("movie-this selected");
        if (!whatToSearch) {
            whatToSearch = "Mr. Nobody"
            searchMovie(whatToSearch);
        }
        searchMovie(whatToSearch);
    break;

    case 'do-what-it-says': console.log("do-what-it-says selected");
    break;
}

var divider = "\n--------------------------------------------------------\n"

function searchSpotify(term) {
    var spotify = new Spotify(keys.spotify);

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


function searchBands(term) {
    var API = keys.bandsInTown;

    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=" + API)
        .then(function (response) {

            var venue = response.data[0].venue.name;
            var location = response.data[0].venue.city + ", " + response.data[0].venue.region;

            // Date of the Event(use moment to format this as "MM/DD/YYYY")
            var dateString = response.data[0].datetime
            var dateObj = new Date(dateString);
            var momentObj = moment(dateObj);
            var momentString = momentObj.format('L'); 

            var details = [
                "Venue: " + venue,
                "Location: " + location,
                "Date: " + momentString,
            ].join("\n")
            console.log(divider + details + divider);

        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}


function searchMovie(term) {
    var API = keys.OMDB;
    console.log("API for OMDB: " + API)

    axios.get("https://www.omdbapi.com/?t=" + term + "&apikey=" + API)
        .then(function (response) {
            // handle success
            console.log(JSON.stringify(response.data, null, 2));

            var data = response.data

            var title = data.Title;
            var year = data.Year;
            var rating = data.Ratings[0].Value;
            var tomatoes = data.Ratings[1].value;
            var country = data.Country;
            var language = data.Language;
            var plot = data.Plot;
            var actors = data.Actors;

            var details = [
                "Title: " + title,
                "Year: " + year,
                "IMDB Rating: " + rating,
                "Rotten Tomatoes Rating: " + tomatoes,
                "Country: " + country,
                "Language: " + language,
                "Plot: " + plot,
                "Actors: " + actors,
            ].join("\n")
            console.log(divider + details + divider);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}
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

