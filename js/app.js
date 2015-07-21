$(function(){

  var DEBUG_MODE = true;
  var debug = function(msg) {
      if (DEBUG_MODE === true) {
          console.log("DEBUG:", msg);
      }
  };

  // Create artist object "class"
  function Artist(name) {
    this.name = name;
    this.id = -1;
  }

  // Method to retrieve most popular track
  Artist.prototype.getMostPopularTrack = function () {

    var self = this;
    debug("artistName = " + self.name);

    var result = $.ajax({
      url: "https://api.spotify.com/v1/search",
      data: {
              q: self.name,
              type: 'artist'
          },
    })
    .done(function(result){
      debug("SUCESS");
      debug(result);

      // Check is valid artist found
      if (result.artists.items.length === 0) {
        alert("Enter a valid artist name!");

      } else {
        self.id = result.artists.items[0].id;
        debug("artistName = " + self.name);
        debug("artistID = " + self.id);
        self.getTopTracks();
      }

      // Clear artist name entry
      $('#query').val('');

    })
    .fail(function(jqXHR, error, errorThrown){
      debug("FAIL");
    });

  };

  // Get the top tracks and display most popular
  Artist.prototype.getTopTracks = function() {

    var popularity = 0;
    var popularTrack;
    var self = this;

    debug("Artist = " + self.name);
    debug("Artist id = " + self.id);

    var result = $.ajax({
      url: "https://api.spotify.com/v1/artists/" + self.id + "/top-tracks",
      data: {
              country: 'US'
          },
    })
    .done(function(result){
      debug("top tracks SUCESS");
      debug(result);

      // Check is tracks found
      if (result.tracks.length === 0) {
        alert("Cannot find any tracks for " + self.name +"!");
      } else {

        // Search for most popular track
        $.each(result.tracks, function(i, track) {
          if (track.popularity > popularity) {
            popularity = track.popularity;
            popularTrack = track;
          }
        });

        debug("top track = " + popularTrack.name);

        // Display the most popular track in DOM
        $('#results').append('<p><span>Artist:</span> ' + self.name + '</p>');
        $('#results').append('<p><span>Most Popular Song:</span> ' + popularTrack.name + '</p>');
        $('#results').append('<a href="' + popularTrack.preview_url + '"><img src="' + popularTrack.album.images[1].url + '">');
      }
    })
    .fail(function(jqXHR, error, errorThrown){
      debug("FAIL");
    });
  };

  // Retrieve artist name, create new artist
  // and display most popular track in DOM
  $('#search-form').submit(function(event) {
    event.preventDefault();
    $('#results').empty();
    var artistName = $('#query').val();

    // Convert to artist name to upper case
    artistName = artistName.replace(/^(.)|\s(.)/g, function($1){ return $1.toUpperCase( ); });

    var artist = new Artist(artistName);
    debug("Artist name = " + artist.name);

    artist.getMostPopularTrack();
  });

});
