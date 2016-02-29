var KeyStore = require('../stores/KeyStore');
var KeyActions = require('../actions/KeyActions');

var Mapping = {
  65: "C4",
  87: "C#4",
  83: "D4",
  69: "D#4",
  68: "E4",
  70: "F4",
  84: "F#4",
  71: "G4",
  89: "G#4",
  72: "A4",
  85: "A#4",
  74: "B4",
  75: "C5"
};



$(document).on('keyup', function(e) {
  KeyActions.keyUnpressed(Mapping[e.keyCode]);
});




$(document).on('keydown', function(e) {
  KeyActions.keyPressed(Mapping[e.keyCode]);
});
