var React = require('react');
var ReactDOM = require('react-dom');
var Note = require('../util/Note');
var Tones = require('../constants/Tones');
var KeyStore = require('../stores/KeyStore');
var KeyListener = require('../util/KeyListener');
var Key = require('./key');
var Recorder = require('./recorder');

var Organ = React.createClass({

  render: function() {
    var keys = Object.keys(Tones).map(function(noteName) {
      return <Key noteName={noteName}/>;
    });
    return(
      <div>
        {keys}
        <Recorder/>
      </div>
    );
  }
});

module.exports = Organ;
