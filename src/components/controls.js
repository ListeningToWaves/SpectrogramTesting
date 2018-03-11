import React,{Component}  from 'react';
import "./controls.css";

class Controls extends Component {
  constructor(){
    super();
  }

  render(){
    return(
      <div className = "controls-container">

      <div className="title-container">
      <h1>Spectrogram Controls</h1>
      <button on-tap="reset">Reset</button>
    </div>
    <div className = "config">
  <div className="container">
  <div className="color-map" id="cool">
  </div>
  <div className="color-map-labels" >
Soft<span>Loud</span>
</div>

  </div>

  <div className="section-container"id="graph">

  <h1 className="section-title" >
  Graph
</h1>
<div className="config contain">
  <label for="speed">Microphone Sensitivity&nbsp;</label>
  <input type="range" id="speed" value="" min="1" max="10" />
</div>
<div className="config contain">
<label for="ticks">Max Frequency&nbsp;</label>
<input type="range" id="resolution" value="" min="20" max="20000" />

</div>
<template if="">
<div className="config contain">
<label for="ticks">Minimum Frequency&nbsp;</label>
<input type="range" id="resolution" value="" min="1" max="1000" />

</div>
<div className="config contain">
  <label for="speed">Speed&nbsp;</label>
  <input type="range" id="speed" value="" min="1" max="5" />
</div>
<div className="config contain">
<label>Pause&nbsp;</label>
<input type="checkbox" id="resolution" checked="" />
</div>

<div className="config">
<label className="switch-light switch-candy contain" onclick="">
<input type="checkbox" checked=""></input>

<strong>
Vertical Scale&nbsp;
</strong>

<span className="graph-scale">
<span>Linear</span>
<span>Log</span>
</span>
</label>
</div>

</template>
<div className="advanced" on-tap="">
<button className="advanced-button">Advanced &nbsp; <i className="arrow down"></i> </button>
</div>
</div>

</div>

<div class="section-container" id="sound">

  <h1 class="section-title">
      Sound
    </h1>

  <div class="config contain">
    <label for="speed">Sound&nbsp;</label>
    <button class="sound-button" ></button>

  </div>
  <div class="config contain">
      <label for="ticks">Output Volume&nbsp;</label>
      <input type="range" id="fadeIn"  min="1" max="100" />
      
      </div>

      <template if="}">
      <div class="config contain">
      <label for="ticks">Attack&nbsp;</label>
      <input type="range" id="fadeIn"  min="10" max="2000" />
      } ms
      </div>
      <div class="config contain">
      <label for="ticks">Decay&nbsp;</label>
      <input type="range" id="fadeOut"  min="10" max="2000" />
      } ms
      </div>

      <div class="config contain">
        <div class="timbre-container">
          <div class="timbre-title">
        Timbre:
      </div>
        <span class="img-span" >
        <img src="./images/sine.png" class="timbre-image selected"></img>
        <label for="speed">Sine</label>
      </span>
      <span class="img-span" >
    <img src="./images/saw.png" class="timbre-image"></img>
    <label for="speed">Saw</label>
  </span>
  <span class="img-span" >
    <img src="./images/square.png" class="timbre-image"></img>
    <label for="speed">Square</label>
  </span>
  <span class="img-span" >
    <img src="./images/triangle.png" class="timbre-image"></img>
    <label for="speed">Triangle</label>
  </span>

      </div>
      </div>
      <div class="config contain">
        <label for="speed">Snap to Scale&nbsp;</label>
        <input type="checkbox" id="labels" ></input>
      </div>
        <template if="}">
          <div class="scale-container">
          <label for="speed" class="scale-label">Scale:&nbsp;</label>
          <select name="scaleChoice" size="3" selectedIndex="}" class="scale-choice" >
            <option value="3" selected="selected">C</option>
            <option value="4">C#/Db</option>
            <option value="5">D</option>
            <option value="6">D#/Eb</option>
            <option value="7">E</option>
            <option value="8">F</option>
            <option value="9">F#/Gb</option>
            <option value="10">G</option>
            <option value="11">G#/Ab</option>
            <option value="0">A</option>
            <option value="1">A#/Bb</option>
            <option value="12">B</option>
          </select>

          <span>
            <select name="mode" size = "3" selectedIndex="}" >
              <option value="major" selected="selected">Major</option>
              <option value="minor">Minor</option>
              <option value="pentaM">Major Pentatonic</option>
              <option value="chromatic">Chromatic</option>
              <option value="blues">Blues</option>
              <option value="harmonic-major">Harmonic Major</option>
              <option value="hungarian-minor">Hungarian Minor</option>
              <option value="heptatonic-1">Heptatonic 1</option>
              <option value="heptatonic-2">Heptatonic 2</option>
              <option value="heptatonic-3">Heptatonic 3</option>
              <option value="heptatonic-4">Heptatonic 4</option>
              <option value="heptatonic-5">Heptatonic 5</option>
              <option value="heptatonic-6">Heptatonic 6</option>
              <option value="hexatonic-1">Hexatonic 1</option>
              <option value="hexatonic-2">Hexatonic 2</option>
              <option value="hexatonic-3">Hexatonic 3</option>
              <option value="hexatonic-4">Hexatonic 4</option>
              <option value="hexatonic-5">Hexatonic 5</option>
              <option value="hexatonic-6">Hexatonic 6</option>
              <option value="pentatonic-1">Pentatonic 1</option>
              <option value="pentatonic-2">Pentatonic 2</option>
              <option value="pentatonic-3">Pentatonic 3</option>
              <option value="mondongo">Mondongo </option>




            </select>
          </span>

</div>

    </template>
<div class="config contain">
  <label for="speed">Headphone Mode&nbsp;</label>
  <input type="checkbox" id="labels" checked="}"></input>
</div>

</template>
<div class="advanced" on-tap="}">
  <button class="advanced-button">Advanced &nbsp; <i class="arrow down"></i> </button>
</div>

  </div>

      </div>
    );
  }

}
export default Controls;
