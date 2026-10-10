import { lorentzTransform } from './lorentz';

import JXG from 'jsxgraph';
import './style.css';

const board = JXG.JSXGraph.initBoard('box', {
  boundingBox: [-6, 6, 6, -6],
  axis: true,
  showCopyright: false,
  showNavigation: false,
  pan: {
    enabled: true,
    needTwoFingers: false,
    needShift: false,
  },
  zoom: {
    wheel: true,
    needShift: false,
    factorX: 1.1,
    factorY: 1.1,
  },
});

// ----------------------------------------
// beta slider
// ----------------------------------------
const betaSlider = board.create('slider', [
  [1, -4],
  [4, -4],
  [-0.9, 0.5, 0.9],
], {
  name: 'β (V/c)',
  snapWidth: 0.01,
  frozen: true,
});

// ----------------------------------------
// S' axes
// ----------------------------------------
const origin = board.create('point', [0, 0], { visible: false }) as JXG.Point;
const spaceDirection = board.create('point', [
  () => 4,
  () => betaSlider.Value() * 4
], { visible: false }) as JXG.Point;
const timeDirection = board.create('point', [
  () => betaSlider.Value() * 4,
  () => 4
], { visible: false }) as JXG.Point;

const xPrimeAxis = board.create('axis', [origin, spaceDirection], {
  name: "x'",
  withLabel: true,
  label: { color: 'blue', offset: [10, 10] },
  strokeColor: 'blue',
  strokeWidth: 1,
  ticks: {
    visible: true, majorHeight: 5,
  },
}) as JXG.Axis;

const ctPrimeAxis = board.create('axis', [origin, timeDirection], {
  name: "ct'",
  withLabel: true,
  label: { color: 'red', offset: [10, 10] },
  strokeColor: 'red',
  strokeWidth: 1,
  ticks: {
    visible: true, majorHeight: 5,
  },
}) as JXG.Axis;

// ----------------------------------------
// Point P
// ----------------------------------------
const pointP = board.create('point', [2, 2.5], {
  name: 'P',
  size: 5,
  strokeColor: 'black',
  fillColor: 'black',
  fixed: false,
  showInfoBox: false,
}) as JXG.Point;;

// ----------------------------------------
// P-parallel S lines
// ----------------------------------------
const xParallel = board.create('line', [
  [0, () => pointP.Y()],
  [1, () => pointP.Y()],
], {
  strokeColor: '#777',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

const ctParallel = board.create('line', [
  [() => pointP.X(), 0],
  [() => pointP.X(), 1],
], {
  strokeColor: '#777',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

// ----------------------------------------
// P-parallel x' line
// ----------------------------------------
const xPrimeParallel = board.create('line', [
  [() => pointP.X(), () => pointP.Y()],
  [() => pointP.X() + 1, () => pointP.Y() + betaSlider.Value()],
], {
  strokeColor: 'blue',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

// ----------------------------------------
// P-parallel ct' line
// ----------------------------------------
const ctPrimeParallel = board.create('line', [
  [() => pointP.X(), () => pointP.Y()],
  [() => pointP.X() + betaSlider.Value(), () => pointP.Y() + 1],
], {
  strokeColor: 'red',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

// ----------------------------------------
// Coordinate text
// ----------------------------------------
const intersectX = board.create('intersection', [ctParallel, board.defaultAxes.x, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'gray'
  },
  fillColor: 'gray',
  strokeColor: 'gray'
}) as JXG.Point;

const intersectY = board.create('intersection', [xParallel, board.defaultAxes.y, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'gray'
  },
  fillColor: 'gray',
  strokeColor: 'gray'
}) as JXG.Point;

const intersectXPrime = board.create('intersection', [ctPrimeParallel, xPrimeAxis, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'blue'
  },
  fillColor: 'blue',
  strokeColor: 'blue'
}) as JXG.Point;

const intersectCTPrime = board.create('intersection', [xPrimeParallel, ctPrimeAxis, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'red'
  },
  fillColor: 'red',
  strokeColor: 'red'
}) as JXG.Point;

board.on('update', () => {
  const x = pointP.X();
  const ct = pointP.Y();
  const beta = betaSlider.Value();

  // Update S coordinate
  if (intersectX.label) {
    intersectX.label.setText(`${intersectX.X().toFixed(2)}`);
  }
  if (intersectY.label) {
    intersectY.label.setText(`${intersectY.Y().toFixed(2)}`);
  }

  // Update S' coordinate
  if (intersectXPrime.label) {
    const transformed = lorentzTransform(x, ct, beta);
    intersectXPrime.label.setText(`${transformed.x.toFixed(2)}`);
  }
  if (intersectCTPrime.label) {
    const transformed = lorentzTransform(x, ct, beta);
    intersectCTPrime.label.setText(`${transformed.ct.toFixed(2)}`);
  }
});

// 初期描画
board.update();
