var KeyStore = require('../stores/KeyStore');
var KeyAction = require('../actions/KeyActions');
// var TrackStore = require('../stores/TrackStore');


var Track = function(attributes) {
  this.name = attributes[name];
  // this.closedRoll = attributes[roll];
  this.roll = [];
};

Track.prototype.startRecording = function() {
  this.interval = undefined;
  this.roll = [];
  this.currentTime = new Date();
};

Track.prototype.addNotes = function () {
  var timeSlice = new Date() - this.currentTime;
  var notes = KeyStore.all();
  this.roll.push({"notes": notes, "timeSlice": timeSlice});
};

Track.prototype.stopRecording = function(){
  this.closedRoll = this.roll.slice();
  this.roll = [];
  this.addNotes();

};

Track.prototype.play = function () {
  console.log(this.interval);
  if (this.interval !== undefined) {
    return;
  } else {
    var playbackStartTime = Date.now();
    var currentNote = 0;
    var length = this.closedRoll[currentNote]["timeSlice"];
  }

  var resetInterval = function() {
    clearInterval(this.interval);
    if (currentNote < this.closedRoll.length && Date.now() - playbackStartTime > this.closedRoll[currentNote]["timeSlice"]){
      KeyAction.playKeys(this.closedRoll[currentNote]["notes"]);
      currentNote += 1;
      if (currentNote !== 0 && currentNote < this.closedRoll.length) {
        console.log (this.closedRoll);
        console.log(currentNote);
        length = this.closedRoll[currentNote]["timeSlice"] - this.closedRoll[currentNote-1]["timeSlice"];
      }
      this.interval = setInterval(resetInterval, length);
    }
  }.bind(this);

  this.interval = setInterval(function(){
    resetInterval();
  }.bind(this), length);

};


module.exports = Track;
