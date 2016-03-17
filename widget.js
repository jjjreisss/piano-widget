var ctx = new (window.AudioContext || window.webkitAudioContext)();
var noteStops = {};
var freeNotes = {};
var chordNotes = {};
var playing = false;
var powerOn = true;
var wave = "sine";


var createOscillator = function (freq) {
  var osc = ctx.createOscillator();
  osc.type = wave;
  osc.frequency.value = freq;
  osc.start(ctx.currentTime);
  return osc;
};

var createGainNode = function () {
  var gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  return gainNode;
};

var Note = function (freq) {
  this.oscillatorNode = createOscillator(freq);
  this.gainNode = createGainNode();
  this.oscillatorNode.connect(this.gainNode);
};

Note.prototype = {
  start: function (type) {
    if (type === "free") {
      this.gainNode.gain.value = 0.3;
    } else if (type === "chord") {
      this.gainNode.gain.value = 0.1;
    }
  },

  stop: function () {
    this.gainNode.gain.value = 0;
  }
};

var Tones = {
  "A#3": 466.16,
  "B3": 493.88,
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
  "C5":	1046.50,
  "C#5": 	1108.73,
  "D5":	1174.66,
  "D#5": 	1244.51,
  "E5":	1318.51,
  "F5":	1396.91,
  "F#5": 	1479.98,
  "G5":	1567.98
};

var Mapping = {
  16: ["A#3"],
  20: ["B3"],
  65: ["C4"],
  87: ["C#4"],
  83: ["D4"],
  69: ["D#4"],
  68: ["E4"],
  70: ["F4"],
  84: ["F#4"],
  71: ["G4"],
  89: ["G#4"],
  72: ["A4"],
  85: ["A#4"],
  74: ["B4"],
  75: ["C5"],
  79: ["C#5"],
  76: ["D5"],
  80: ["D#5"],
  186: ["E5"],
  222: ["F5"],
  221: ["F#5"],
  13: ["G5"],
  90: ["C4", "E4", "G4"],
  88: ["D4", "F#4", "A#4"]
};

// $(document).on('keyup', function(e) {
//   KeyActions.keyUnpressed(Mapping[e.keyCode]);
// });
//
// $(document).on('keydown', function(e) {
//   KeyActions.keyPressed(Mapping[e.keyCode]);
// });

var createKeys = function(widgetWidth, widgetHeight) {
  var toneStrings = Object.keys(Tones);
  var key;
  var width = widgetWidth / 15;
  var height = widgetHeight * 13 / 15;

  toneStrings.forEach(
    function(tone) {
      key = document.createElement("div");
      key.id = tone;
      key.className = "key";
      var keyStyleString;
      if (tone[1] === "#") {
        keyStyleString = (
          "width: " + width + "px;" +
          "height: " + height + "px;" +
          "border: 1px solid green;" +
          "display: inline-block;" +
          "background: black;" +
          "position: absolute;" +
          "top: 0;" +
          "width: " + width / 2 + "px;" +
          "height: " + height / 2 + "px;" +
          "margin-left: " + "-" + width / 4 + "px;"
        );
      } else {
        keyStyleString = (
          "width: " + width + "px;" +
          "height: " + height + "px;" +
          "border: 1px solid green;" +
          "display: inline-block;" +
          "background: white;"
        );
      }
      key.style.cssText = keyStyleString;
      key.addEventListener(
        'mousedown',
        function() {
          playing = true;
          playKey(tone);
        }
      );
      key.addEventListener(
        'mouseup',
        function() {
          playing = false;
          stopKey(tone);
        }
      );
      key.addEventListener(
        'mouseleave',
        function() {
          if (playing) {
            stopKey(tone);
          }
        }
      );
      key.addEventListener(
        'mouseenter',
        function() {
          if (playing) {
            playKey(tone);
          }
        }
      );
      document.getElementById("keyboard").appendChild(key);
    }.bind(this)
  )
};

var playFreeKey = function(tone) {
  if (!freeNotes[tone] && powerOn) {
    var key = document.getElementById(tone);
    var freq = Tones[tone];
    var note = new Note(freq);
    note.start("free");
    freeNotes[tone] = note;
    key.style.cssText += "box-shadow: -1px 2px 0px 2px;";
  }
};

var stopFreeKey = function(tone) {
  var key = document.getElementById(tone);
  // if (!chordNotes[tone]) {
    key.style.cssText += "box-shadow: 0px 0px 0px 0px;";
  // }
  if (freeNotes[tone]) {
    freeNotes[tone].stop();
    freeNotes[tone] = null;
  }
};

var playChordKey = function(tone) {
  if (!chordNotes[tone] && powerOn) {
    var key = document.getElementById(tone);
    var freq = Tones[tone];
    var note = new Note(freq);
    // key.style.cssText += "box-shadow: -1px 2px 0px 2px;";
    note.start("chord");
    chordNotes[tone] = note;
  }
};

var stopChordKey = function(tone) {
  var key = document.getElementById(tone);
  // if (!freeNotes[tone]) {
  //   key.style.cssText += "box-shadow: 0px 0px 0px 0px;";
  // }
  if (chordNotes[tone]) {
    chordNotes[tone].stop();
    chordNotes[tone] = null;
  }
};

keyDownHandler = function(e) {
  var tones = Mapping[Number(e.keyCode)];
  if (tones && tones.length === 1) {
    if (Tones[tones[0]]) {
      playFreeKey(tones[0]);
    }
  }
  else if (tones && tones.length > 1) {
      tones.forEach(
          function(tone) {
              if (Tones[tone]) {
                playChordKey(tone);
              }
          }
      )
  }
};

keyUpHandler = function(e, tones) {
  var tones = Mapping[Number(e.keyCode)];
  if (tones && tones.length === 1) {
      if (Tones[tones[0]]) {
        stopFreeKey(tones[0]);
      }
  } else if (tones && tones.length > 1) {
    tones.forEach(
        function(tone) {
            if (Tones[tone]) {
              stopChordKey(tone);
            }
        }
    )
  }
};

var setupKeyboardElement = function(widgetWidth, widgetHeight) {
  keyboardElement = document.createElement("div");
  keyboardElement.id = "keyboard";
  keyboardStyleString = (
    "display: inline-block;" +
    "margin-top: " +  widgetHeight / 30 + "px;" +
    "overflow: hidden;" +
    "position: relative;"
  )
  keyboardElement.style.cssText = keyboardStyleString;
  document.getElementById("synth-widget").appendChild(keyboardElement);
};

var setupSynthWidgetElement = function() {
  var synthWidgetElement = document.getElementById("synth-widget");
  synthWidgetStyleString = (
    "background-color: brown;" +
    "width: " + synthWidgetElement.getAttribute("width") + "px;" +
    "height: " + synthWidgetElement.getAttribute("height") + "px;" +
    "text-align: center;" +
    "position: relative;" +
    "overflow: hidden;"
  );
  synthWidgetElement.style.cssText = synthWidgetStyleString;
}

var setupPowerButtonElement = function(widgetWidth, widgetHeight) {
  var powerButtonElement = document.createElement("div");
  powerButtonStyleString = (
    "width: " + widgetWidth / 20 + "px;" +
    "height: " + widgetHeight / 15 + "px;" +
    "background: " + powerButtonColor() + ";" +
    "position: absolute;" +
    "right: " + widgetWidth / 40 + "px;" +
    "bottom: " + widgetHeight / 150 + "px;" +
    "box-shadow: 0px 0px 1px 1px;"
  )
  powerButtonElement.style.cssText = powerButtonStyleString;
  powerButtonElement.id = "power-button";
  document.getElementById("synth-widget").appendChild(powerButtonElement);

  powerButtonElement.addEventListener(
    'click',
    flipPowerSwitch
  );
};

var setupWaveButtons = function(widgetWidth, widgetHeight) {
  var buttonPanelElement = document.createElement("div");
  var buttonPanelStyleString = (
    "position: absolute;" +
    "height: " + widgetHeight / 15 + "px;" +
    "left: "+  widgetWidth / 80 + "px;" +
    "bottom: " + widgetHeight / 100 + "px;" +
    "text-align: center;"
  );
  var buttonWidth = widgetWidth / 15;
  var buttonHeight = widgetHeight / 15;

  var buttonStyleString = (
    "width: " + buttonWidth + "px;" +
    "height: " + buttonHeight + "px;" +
    "margin-left: " + widgetWidth / 40 + "px;" +
    "margin-right: " + widgetWidth / 40 + "px;"
  )
  buttonPanelElement.style.cssText = buttonPanelStyleString;
  buttonPanelElement.id = "button-panel";
  document.getElementById("synth-widget").appendChild(buttonPanelElement);

  setupWave(buttonWidth, buttonHeight, buttonStyleString, "sine_oleix7", "sine");
  setupWave(buttonWidth, buttonHeight, buttonStyleString, "square_i8z8xq", "square");
  setupWave(buttonWidth, buttonHeight, buttonStyleString, "sawtooth_zzoxij", "sawtooth");
  setupWave(buttonWidth, buttonHeight, buttonStyleString, "triangle_s1ersy", "triangle");
};

var setupWave = function(width, height, styleString, picString, type) {
  var waveElement = document.createElement("img");
  waveElement.style.cssText = styleString;
  waveElement.src = "http://res.cloudinary.com/ddhru3qpb/image/upload/w_" + width + ",h_" + height + "/" + picString + ".png";
  waveElement.id = type;

  waveElement.addEventListener(
    "click",
    function(e) {
      changeWave(type);
    }
  )

  document.getElementById("button-panel").appendChild(waveElement)
};

var changeWave = function(type) {
  if (powerOn) {
    document.getElementById(wave).style.outline = "0px";
    wave = type;
    document.getElementById(wave).style.outline = "1px solid yellow";
  }
}

var powerButtonColor = function() {
  if (powerOn) {
    return "green";
  } else {
    return "red";
  }
}

var flipPowerSwitch = function() {
  if (powerOn) {
    turnSynthOff();
  } else {
    turnSynthOn();
  }
};

var turnSynthOn = function() {
  powerOn = true;
  powerButtonElement = document.getElementById("power-button");
  powerButtonElement.style.cssText += (
    "background: green;"
  )
  changeWave("sine");
};

var turnSynthOff = function() {
  powerOn = false;
  powerButtonElement = document.getElementById("power-button");
  powerButtonElement.style.cssText += (
    "background: red;"
  )
  document.getElementById(wave).style.outline = "0px";
};


var main = function() {
  var synthWidgetElement = document.getElementById("synth-widget");

  setupSynthWidgetElement();

  var widgetWidth = synthWidgetElement.getAttribute("width") || 600;
  var widgetHeight = synthWidgetElement.getAttribute("height") || 300;

  setupKeyboardElement(widgetWidth, widgetHeight);
  createKeys(widgetWidth, widgetHeight);
  setupPowerButtonElement(widgetWidth, widgetHeight);

  setupWaveButtons(widgetWidth, widgetHeight);
  turnSynthOn();

  document.addEventListener(
    'keydown',
    keyDownHandler
  );
  document.addEventListener(
    'keyup',
    keyUpHandler
  )
};

main();
