import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';

const spotifyAPI = new SpotifyWebApi(); 

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyAPI.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: ''},
      playlists: [],
      artists: { ids: [], names: [] },
      relatedSongs: []
    }
    //console.log(params);
  }

  getHashParams() {
    const hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyAPI.getMyCurrentPlaybackState()
      .then((res) => {
        
        this.setState({ 
          nowPlaying: { name: res.item.name, albumArt: res.item.album.images[0].url}
        });
        
        res.item.artists.forEach(artist => {
          this.setState({
            artists: {
              ids: [...this.state.artists.ids, artist.id],
              names: [...this.state.artists.names, artist.name]
            }
          });
        
        })
      })
  }

  getAllPlaylists() {
    spotifyAPI.getUserPlaylists()
      .then((res) => {
          res.items.forEach(album => {
            this.setState({
              playlists: [...this.state.playlists, album.name]
            });
          });
        });
  }

  showRelatedSongs() {
    spotifyAPI.getArtistTopTracks(this.state.artists.ids[0], 'GB')
      .then(res => {
        res.tracks.forEach(track => {
          this.setState({
            relatedSongs: [...this.state.relatedSongs, track.name]
          })
        })
      })
  }

  render() {

    return (
      <div className="App">
        <a href='http://localhost:8888'> Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height : 150 }} />
        </div>
        <div>
          {this.state.loggedIn && 
          <button onClick={() => this.getNowPlaying()} >
            Check Now Playing
          </button>}
        </div>
        <div>
          {this.state.loggedIn &&
            <button onClick={() => this.getAllPlaylists()} >
              See Your Playlists
          </button>}
        </div>
        <div>
          Playlists: {
            this.state.loggedIn &&
            <ul>
              { this.state.playlists.map(data => <li key={data}>{data}</li>) }
            </ul>
          }
        </div>
        
        <div>
          {this.state.loggedIn &&
            <button onClick={() => this.showRelatedSongs()} >
              Related Songs
            </button>}
        </div>
        <div>
          Related Songs: {
            this.state.loggedIn &&
            <ul>
              { this.state.relatedSongs.map(data => <li key={data}>{data}</li>) }
            </ul>
          }
        </div>
      </div>
    );
  }
}

export default App;
