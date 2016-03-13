# Drawing Widget

This is a synthesizer widget built with the HTML5 Web Audio API and Javascript. No external libraries are used
(e.g. JQuery), to reduce the weight and dependencies. The widget is designed to be embedded
into webpages with as little work as possible.

<!-- ![Alt text](synth-widget.png?raw=true "Screenshot") -->

## Features
 - **Waveform:** Click the waveform icons to change the timbre of the notes.
 - **On/Off:** Turn the synthesizer on and off by clicking the power button.

## API

To embed the widget, add the following lines in the body of your HTML file:

```html
  <div id="synth-widget">
  <script async src="https://rawgit.com/jjjreisss/lib/synth-widget/master/widget.js"></script>
```

This will default to a 400px by 300px widget. In order to specify your own dimensions, change the code to:

```html
  <div id="synth-widget" width=[your-width] height=[your-height]>
  <script async src="https://rawgit.com/jjjreisss/lib/synth-widget/master/widget.js"></script>
```

## History

This widget is part of a series of similar widgets. The first of these is a drawing widget
which you can find [here](http://github.com/jjjreisss/drawing-widget).

## Demo

You can see the widget demo'd on my [portfolio](http://jjjreisss.github.io) page.
