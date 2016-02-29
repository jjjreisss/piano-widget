var React = require('react');
var ReactDOM = require('react-dom');
var Note = require('../util/Note');
var Tones = require('../constants/Tones');
var KeyStore = require('../stores/KeyStore');
var KeyListener = require('../util/KeyListener');

var Key = React.createClass({
  getInitialState: function(){
    return ({started: false});
  },
  componentWillMount: function() {
    var freq = Tones[this.props.noteName];
    this.note = new Note(freq);
    this.token = KeyStore.addListener(this.keysChanged);
  },
  componentWillUnmount: function() {
    this.token.remove();
  },
  keysChanged: function(){
    var keys = KeyStore.all();


    var idx = keys.indexOf(this.props.noteName);

    if ( idx !== -1){
      this.setState({started: true});
      this.note.start();
    } else {
      this.setState({started: false});
      this.note.stop();
    }
  },
  render: function() {
    var freq = Tones[this.props.noteName];

    return(
      <div id={freq} note={this.note}>
        {this.props.noteName}
      </div>
    );
  }
});


module.exports = Key;
