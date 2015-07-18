$(function(){

  var artistID;

  $('#search-form').submit(function(event) {
    event.preventDefault();
    var artistName = $('#query').val();
    artistID = getArtistID(artistName);
  });

});

function getArtistID(artistName){

  var id;

  var result = $.ajax({
    url: "https://api.spotify.com/v1/search",
    data: {
            q: artistName,
            type: 'artist'
        },
  })
  .done(function(result){
    console.log("SUCESS");
    console.log(result);
    id = result.artists.items[0].id;
    console.log("artistID = " + id);
    getTopTracks(id);
    $('#query').val('');

  })
  .fail(function(jqXHR, error, errorThrown){
    console.log("FAIL");
  });

}

function getTopTracks(artistID) {

  var popularity = 0;
  var popularTrack;

  var result = $.ajax({
    url: "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks",
    data: {
            country: 'US'
        },
  })
  .done(function(result){
    console.log("top tracks SUCESS");
    console.log(result);
    $.each(result.tracks, function(i, track) {
      if (track.popularity > popularity) {
        popularity = track.popularity;
        popularTrack = track;
      }
    });
    //var artistID = result.artists.items[0].id;
    console.log("top track = " + popularTrack.name);
    $('#results').append('<a href="' + popularTrack.preview_url + '"><img src="' + popularTrack.album.images[1].url + '">');
  })
  .fail(function(jqXHR, error, errorThrown){
    console.log("FAIL");
  });
}



