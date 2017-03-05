const Mopidy = require('mopidy');
const mopidy = new Mopidy({
  webSocketUrl: 'ws://localhost:6680/mopidy/ws/',
  callingConvention: 'by-position-or-by-name',
});
let mopidyConnected = false;
mopidy.on('state:online', () => {
  mopidyConnected = true;
});
const intent = () => ({
  keywords: ['music qqqq', 'what is playing'],
  module: 'mopidy'
});

function * mpd_resp(query) {
  if (query.indexOf('music ') === 0) {
    query = query.slice('music '.length).trim();
  }
  if (!mopidyConnected) {
    return {text: 'MPD not connected'};
  }
  switch (query) {
    case ('next') : {
      mopidy.playback.next();
      return {
        text: 'Playing next track',
        silent: true,
      };
      break;
    }
    case ('previous') : {
      mopidy.playback.previous();
      return {
        text: 'Playing previous track',
        silent: true,
      };
      break;
    }
    case ('pause') : {
      mopidy.playback.pause();
      return {
        text: 'Track paused',
        silent: true,
      };
      break;
    }
    case ('stop') : {
      mopidy.playback.stop();
      return {
        text: 'Track stopped',
        silent: true,
      };
      break;
    }
    case ('resume') : {
      mopidy.playback.resume();
      return {
        text: 'Track resumed',
        silent: true,
      };
      break;
    }
    case ('play') : {
      mopidy.playback.play();
      return {
        text: 'Playing music',
        silent: true,
      };
      break;
    }
    case ('volume up') : {
      let vol = mopidy.mixer.getVolume();
      vol = vol + 5;
      mopidy.mixer.getVolume(vol);
      return {
        text: 'Volume up',
        silent: true,
      };
      break;
    }
    case ('volume down') : {
      let vol = mopidy.mixer.getVolume();
      vol = vol - 5;
      mopidy.mixer.getVolume(vol);
      return {
        text: 'Volume down',
        silent: true,
      };
      break;
    }
    case ('what is playing') : {
      return yield mopidy.playback.getCurrentTrack().then((data) => {
        let track = 'unknown';
        let artist = 'unknown';
        if (data.name) {
          track = data.name;
        }
        if (data.artists && data.artists[0] && data.artists[0].name) {
          artist = data.artists[0].name;
        }
        return {
          text: `This is ${track} by ${artist}`,
        }
      })
    }
  }
  if (query.indexOf('play') === 0) {
    const search = determineSearchType(query.replace('play', '').trim());
    if (search.playlist) {
      // Looking for a playlist so need to do something different.
      return yield mopidy.playlists.asList().then((playlists) => {
        let playlist = playlists.find((playlist) => (playlist.name.toLowerCase() == search.playlist));
        if (playlist && playlist.uri) {
          mopidy.tracklist.clear();
          mopidy.tracklist.add({uri: playlist.uri});
          mopidy.playback.play();
          return {
            text: 'Playing playlist ' + playlist.name,
          }
        } else {
          return {
            text: 'Couldn\'t find that playlist',
          }
        }
      });
    } else {
      // Perform the search and play.
      return yield mopidy.library.search(search).then((res) => {
        const searchResult = relevantSearchResult(res, search);
        if (searchResult) {
          mopidy.tracklist.clear();
          mopidy.tracklist.add(searchResult.songs);
          mopidy.playback.play();
          return {
            text: searchResult.text,
          }
        }
      });
    }
  }
  return {text: 'Couldn\'t find that mpd command'};
}

function determineSearchType(text) {
  let search = {};

  if (text.indexOf('all by ') === 0) {
    search.artist = [text.replace('all by ', '').trim()];
  } else if (text.indexOf(' by ') > -1) {
    search.album = [text.substring(0,text.indexOf(' by ')).trim()];
    search.artist = [text.replace('by', '').replace(search.album, '').trim()];
  } else if (text.indexOf('my ') === 0 && text.indexOf(' playlist') == (text.length - ' playlist'.length)) {
    search.playlist = text.slice('my '.length).slice(0, 0 - ' playlist'.length).trim().toLowerCase();
  }

  if (Object.keys(search).length < 1) {
    search.any = [text];
  }

  return search;
}

function relevantSearchResult(results, search) {
  // Sort by service importance
  const serviceOrder = ['local', 'spotify', 'gmusic', 'soundcloud', 'pandora', 'podcast', 'youtube'];
  results.sort((service1, service2) => {
    let service1Name = null;
    let service2Name = null;

    for (var i = serviceOrder.length - 1; i >= 0; i--) {
      if (service1.uri.indexOf(serviceOrder[i]) === 0) {
        service1Name = serviceOrder[i];
      }
      if (service2.uri.indexOf(serviceOrder[i]) === 0) {
        service2Name = serviceOrder[i];
      }
    }

    if (!service1Name) { return 1; }
    if (!service2Name) { return -1; }
    const order = (serviceOrder.indexOf(service1Name) - serviceOrder.indexOf(service2Name));
    return order;
  });

  // console.log(results);
  // console.log(search);

  // Return the relevant artist or album
  if (search.artist) {
    for (var i = 0; i < results.length; i++) {
      if (results[i].artists) {
        return {
          songs: {uri: results[i].artists[0].uri},
          text: 'Playing everything by ' + results[i].artists[0].name,
        };
      }
    }
  }
  if (search.album) {
    for (var i = 0; i < results.length; i++) {
      if (results[i].albums) {
        return {
          songs: {uri: results[i].albums[0].uri},
          text: `Playing ${results[i].albums[0].name}`,
        };
      }
    }
  }

  // For search.any or unsuccessful
  for (var i = 0; i < results.length; i++) {
    if (results[i].tracks) {
      return {
        songs: {tracks: results[i].tracks},
        text: 'Playing all tracks I could find',
      };
    }
  }

  return false;
}

const examples = () => (
  ['music play all by the beatles', 'music play rumours by fleetwood mac', 'music pause', 'music stop']
);

module.exports = {
  get: mpd_resp,
  intent,
  examples
}
