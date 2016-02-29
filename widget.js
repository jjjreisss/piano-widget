var ctx = new (window.AudioContext || window.webkitAudioContext)();

var createOscillator = function (freq) {
  var osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.value = freq;
  osc.detune.value = 0;
  osc.start(ctx.currentTime);
  return osc;
};

var createGainNode = function () {
  var gainNode = ctx.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(ctx.destination);
  return gainNode;
};

var Note = function (freq) {
  this.oscillatorNode = createOscillator(freq);
  this.gainNode = createGainNode();
  this.oscillatorNode.connect(this.gainNode);
};

Note.prototype = {
  start: function () {
    // can't explain 0.3, it is a reasonable value
    this.gainNode.gain.value = 0.3;
  },

  stop: function () {
    this.gainNode.gain.value = 0;
  }
};

var Tones = {
  "C4":	523.25,
   "C#4": 554.37,
  "D4":	587.33,
   "D#4": 622.25,
  "E4":	659.25,
  "F4":	698.46,
   "F#4": 739.99,
  "G4":	783.99,
   "G#4":	830.61,
  "A4":	880.00,
   "A#4": 932.33,
  "B4":	987.77,
  "C5":	1046.50
};

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

// $(document).on('keyup', function(e) {
//   KeyActions.keyUnpressed(Mapping[e.keyCode]);
// });
//
// $(document).on('keydown', function(e) {
//   KeyActions.keyPressed(Mapping[e.keyCode]);
// });

var createKeys = function() {
  var toneStrings = Object.keys(Tones);
  var key;

  toneStrings.forEach(
    function(tone) {
      key = document.createElement("div");
      key.id = tone;
      key.style.height = "100px";
      key.style.width = "20px";
      key.style.background = "black";
      key.style.border = "1px solid white";
      key.style.display = "inline-block";
      key.addEventListener('click', playKey.bind(this, tone));
      document.getElementById("piano-widget").appendChild(key);
    }.bind(this)
  )
};

var playKey = function(tone) {
  var freq = Tones[tone];
  var note = new Note(freq);
  note.start();
}


var main = function() {
  createKeys();
};

main();
