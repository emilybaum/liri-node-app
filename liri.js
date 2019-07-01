require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');
// var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');

var command = process.argv[2]
var whatToSearch = process.argv.slice(3).join(" ");

// DO WHAT IT SAYS COMMAND
if (command === 'do-what-it-says' && !whatToSearch) {
    dowhatItSays()
    return;
}

// SEARCH FOR CONCERT, SONG, MOVIE COMMAND
function start(command) {    
    switch (command) {
        case 'concert-this': 
            searchBands(whatToSearch);
        break;

        case 'spotify-this-song':
            if (!whatToSearch) {
                whatToSearch = "The Sign";
                searchSpotify(whatToSearch);
            }
            searchSpotify(whatToSearch); 
        break;

        case 'movie-this': 
            if (!whatToSearch) {
                whatToSearch = "Mr. Nobody"
                searchMovie(whatToSearch);
            }
            searchMovie(whatToSearch);
        break;
    }
}

// SEARCH SPOTIFY
function searchSpotify(term) {
    var divider = "\n--- --- --- --- --- --- --- --- --- --- --- --- --- --- ---\n"

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: term }, function(err, response) {
            if (err) {
                return console.log(err);
            }
            
            for (var i = 0; i < 6; i++) {
            // console.log(JSON.stringify(response.tracks.items[i], null, 2))         

                var song = response.tracks.items[i];
                var songName = song.name;
                var artist = song.artists[0].name;
                var preview = song.external_urls.spotify;
                var album = song.album.name;

                var number = i + 1

                var details = [
                    "SONG SEARCH: response " + number + "\n",
                    "Song Name: " + songName, 
                    "Artist: " + artist, 
                    "Preview Link: " + preview, 
                    "Album: " + album,
                ].join("\n");

            fs.appendFile("logSong.txt", divider + details + divider, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
            console.log(divider + details + divider)
        }
    });
}


// SEARCH BANDS IN TOWN
function searchBands(term) {
    var divider = "\n--------------------------------------------------------\n"
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
                "CONCERT SEARCH\n",
                "Venue: " + venue,
                "Location: " + location,
                "Date: " + momentString,
            ].join("\n")
            
            fs.appendFile("logSong.txt", divider + details + divider, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });

            console.log(divider + details + divider);

        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}

// SEARCH OMDB
function searchMovie(term) {
    var divider = "\n========================================================\n"

    var API = keys.OMDB;
    console.log("API for OMDB: " + API)

    axios.get("https://www.omdbapi.com/?t=" + term + "&apikey=" + API)
        .then(function (response) {
            // console.log(JSON.stringify(response.data, null, 2));

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
                "MOVIE SEARCH\n",
                "Title: " + title,
                "Year: " + year,
                "IMDB Rating: " + rating,
                "Rotten Tomatoes Rating: " + tomatoes,
                "Country: " + country,
                "Language: " + language,
                "Plot: " + plot,
                "Actors: " + actors,
            ].join("\n")
            
            fs.appendFile("logSong.txt", divider + details + divider, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });

            console.log(divider + details + divider);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}


// DO WHAT IT SAYS
function dowhatItSays() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
            return console.log(error)
        }

        var randomArr = data.split(",");
        var commandRead = randomArr[0];
        var index1 = randomArr[1];
        whatToSearch = index1.slice(1, index1.length-1);

        start(commandRead);
    })
}

start(command)
    
