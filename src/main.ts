import { lorentzTransform } from './lorentz';
import { assert } from './assert';


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
  defaultAxes: {
    x: {
      name: "x",
      withLabel: true,
      label: { color: 'green', offset: [0, 10], position: 'rt' },
      strokeColor: 'green',
      strokeWidth: 1,
    },
    y: {
      name: "ct",
      withLabel: true,
      label: { color: 'orange', offset: [5, 0], position: 'rt' },
      strokeColor: 'orange',
      strokeWidth: 1,
    },
  }
});

// ----------------------------------------
// beta slider
// ----------------------------------------
const betaSlider = board.create('slider', [
  [0.5, -5],
  [4, -5],
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

const scaleAxis = (beta: number) => {
  return Math.sqrt((1 + beta * beta) / (1 - beta * beta))
}

const xPrimeAxis = board.create('axis', [origin, spaceDirection], {
  name: "x'",
  withLabel: true,
  label: { color: 'blue', offset: [0, 10], position: 'rt' },
  strokeColor: 'blue',
  strokeWidth: 1,
  ticks: {
    visible: true,
    majorHeight: 5,
    scale: scaleAxis(betaSlider.Value()),
  },
}) as JXG.Axis;

const ctPrimeAxis = board.create('axis', [origin, timeDirection], {
  name: "ct'",
  withLabel: true,
  label: { color: 'red', offset: [5, 0], position: 'rt' },
  strokeColor: 'red',
  strokeWidth: 1,
  ticks: {
    visible: true,
    majorHeight: 5,
    scale: scaleAxis(betaSlider.Value()),
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
  strokeColor: 'green',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

const ctParallel = board.create('line', [
  [() => pointP.X(), 0],
  [() => pointP.X(), 1],
], {
  strokeColor: 'orange',
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
// Inter sections with S axes
const intersectCTParallelAndX = board.create('intersection', [ctParallel, board.defaultAxes.x, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'green'
  },
  fillColor: 'green',
  strokeColor: 'green'
}) as JXG.Point;

const intersectXParallelAndY = board.create('intersection', [xParallel, board.defaultAxes.y, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'orange'
  },
  fillColor: 'orange',
  strokeColor: 'orange'
}) as JXG.Point;

const intersectCTPrimeParallelAndX = board.create('intersection', [ctPrimeParallel, board.defaultAxes.x, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'green'
  },
  fillColor: 'green',
  strokeColor: 'green'
}) as JXG.Point;

const intersectXPrimeParallelAndY = board.create('intersection', [xPrimeParallel, board.defaultAxes.y, 0], {
  name: '',
  withLabel: true,
  showInfoBox: false,
  label: {
    offset: [10, -15],
    color: 'orange'
  },
  fillColor: 'orange',
  strokeColor: 'orange'
}) as JXG.Point;

// Inter sections with S' axes
const intersectCTPrimeParallelAndXPrime = board.create('intersection', [ctPrimeParallel, xPrimeAxis, 0], {
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

const intersectXPrimeParallelAndCTPrime = board.create('intersection', [xPrimeParallel, ctPrimeAxis, 0], {
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

const intersectCTParallelAndXPrime = board.create('intersection', [ctParallel, xPrimeAxis, 0], {
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

const intersectXParallelAndCTPrime = board.create('intersection', [xParallel, ctPrimeAxis, 0], {
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

const pXInput = board.create(
  'input',
  [1.5, -3.2, '', 'P_x = '],
  {
    cssStyle: 'width: clamp(35px, 8vw, 100px);',
    fixed: true,
    frozen: true,
  },
);

const pCTInput = board.create(
  'input',
  [1.5, -4, '', 'P_{ct} = '],
  {
    cssStyle: 'width: clamp(35px, 8vw, 100px);',
    fixed: true,
    frozen: true,
  },
);

const outOfBoard = (x: number, y: number) => {
  const bbox = board.getBoundingBox()
  if (x < bbox[0] || bbox[2] < x ||
    y < bbox[3] || bbox[1] < y) {
    return true
  }
  return false
}

board.create('button', [
  4, -3.2,
  'Apply',
  () => {
    const x = Number(pXInput.Value());
    const ct = Number(pCTInput.Value());

    if (
      pXInput.Value().trim() === '' ||
      pCTInput.Value().trim() === '' ||
      !Number.isFinite(x) ||
      !Number.isFinite(ct)
    ) {
      console.log('error: invalid input');
      return;
    }

    if (outOfBoard(x, ct)) {
      alert('error: input coordinate is out of the board');
      return;
    }

    pointP.setPosition(JXG.COORDS_BY_USER, [x, ct]);
    board.update();
  }],
  {
    fixed: true,
    frozen: true,
  }
);

board.on('update', () => {
  // The internal calculation of each geometrical objects are
  // sometimes delayed, which causes the invalid result.
  // To mitigate the effect of the delay, the calculation
  // is slightly delayed by using setTimeout.
  setTimeout(() => {
    // We should update some geometric objects only when
    // the value of `betaSlider` is changed.
    // Thus, it is ideal to move these lines of code to
    // the slider 'drag' and 'up' event handler.
    // However, surprisingly, the slider value is sometimes
    // changed without these slider events.
    // That is the reason why these lines of code are
    // located here.
    const beta = betaSlider.Value();

    xPrimeAxis.update();
    xPrimeAxis.defaultTicks.visProp.scale = scaleAxis(beta);
    ctPrimeAxis.update();
    ctPrimeAxis.defaultTicks.visProp.scale = scaleAxis(beta);

    intersectCTParallelAndX.label?.setText(`${intersectCTParallelAndX.X().toFixed(2)}`);
    intersectXParallelAndY.label?.setText(`${intersectXParallelAndY.Y().toFixed(2)}`);
    intersectCTPrimeParallelAndX.label?.setText(`${intersectCTPrimeParallelAndX.X().toFixed(2)}`);
    intersectXPrimeParallelAndY.label?.setText(`${intersectXPrimeParallelAndY.Y().toFixed(2)}`);

    const pTransformed = lorentzTransform(pointP.X(), pointP.Y(), beta);
    intersectCTPrimeParallelAndXPrime.label?.setText(`${pTransformed.x.toFixed(2)}`);
    intersectXPrimeParallelAndCTPrime.label?.setText(`${pTransformed.ct.toFixed(2)}`);

    const epsilon = 0.001
    const intersectCTParallelAndXPrimeTransformed = lorentzTransform(intersectCTParallelAndXPrime.X(), intersectCTParallelAndXPrime.Y(), beta);
    assert(Math.abs(intersectCTParallelAndXPrimeTransformed.ct) <= epsilon, `ct' coordinate must be 0, but ${intersectCTParallelAndXPrimeTransformed.ct}`);
    intersectCTParallelAndXPrime.label?.setText(`${intersectCTParallelAndXPrimeTransformed.x.toFixed(2)}`);
    const intersectXParallelAndCTPrimeTransformed = lorentzTransform(intersectXParallelAndCTPrime.X(), intersectXParallelAndCTPrime.Y(), beta);
    assert(Math.abs(intersectXParallelAndCTPrimeTransformed.x) <= epsilon, "x' coordinate must be 0, but ${intersectXParallelAndCTPrimeTransformed.x}");
    intersectXParallelAndCTPrime.label?.setText(`${intersectXParallelAndCTPrimeTransformed.ct.toFixed(2)}`);
  }, 0);
});

betaSlider.on('drag', () => {
  board.fullUpdate();
});

// 初期描画
board.update();
