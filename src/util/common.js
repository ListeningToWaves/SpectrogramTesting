const timbreOptions = [
  {
  text: "Sine",
  value: 0,
  image: {src: './images/sine.png'}
  },
  {
  text: "Square",
  value: 1,
  image: {src: './images/square.png'}
  },
  {
  text: "Sawtooth",
  value: 2,
  image: {src: './images/saw.png'}
  },
  {
  text: "Triangle",
  value: 3,
  image: {src: './images/triangle.png'}
  },
];

const scaleOptions = [
  {
    text: "Major",
    value: 0
  },
  {
    text: "Minor",
    value: 1
  },
  {
    text: "Pentatonic",
    value: 2
  },
  {
    text: "Harmonic Minor",
    value: 3
  },
];
const keyOptions = [
  {
    text: "C",
    value: 0
  },
  {
    text: "D",
    value: 1
  },
  {
    text: "E",
    value: 2
  },
  {
    text: "F",
    value: 3
  },
  {
    text: "G",
    value: 4
  },
  {
    text: "A",
    value: 5
  },
  {
    text: "B",
    value: 6
  },
]
const accidentalOptions = [
  {
    text: " ",
    value: 0
  },
  {
    text: "# ",
    value: 1
  },
  {
    text: "b ",
    value: 2
  },
]

export {timbreOptions, scaleOptions, keyOptions, accidentalOptions};
