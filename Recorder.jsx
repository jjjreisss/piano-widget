var React = require('react');
var Track = require('../util/track');
var KeyStore = require('../stores/KeyStore');
var TrackStore = require('../stores/TrackStore');
var KeyActions = require('../actions/KeyActions');

var Recorder = React.createClass({
  getInitialState: function(){
    return ({
      isRecording: false, track: new Track({name: "song", roll: []})
    });
  },
  componentDidMount: function() {
    KeyStore.addListener(this.addNotes);
    TrackStore.addListener(this.stopHandler);
  },
  addNotes: function() {
    this.state.track.addNotes();
  },
  startHandler: function(){
    // this.state.track = new Track({name: "song", roll: []})
    this.state.track.startRecording();
  },
  stopHandler: function() {
    this.state.track.stopRecording();
    KeyActions.saveTrack(this.state.track);
    console.log(this.state.track);
  },
  playHandler: function() {
    this.state.track.play();
  },
  render: function(){


    return(
      <div>
      <button onClick={this.startHandler}>Start Recording</button>
      <button onClick={this.stopHandler}>Stop Recording</button>
      <button onClick={this.playHandler}>Play</button>
      </div>
    );
  }
});


module.exports = Recorder;
