import JXG from 'jsxgraph';
import './style.css';

const board = JXG.JSXGraph.initBoard('box', {
  boundingBox: [-6, 6, 6, -6],
  axis: true,
  grid: true,
  showCopyright: false,
  showNavigation: false,
  pan: {
    enabled: true,
    needTwoFingers: false,
    needShift: false,
  },
  zoom: {
    wheel: true,      // Enable/disable mouse wheel zooming
    needShift: false, // If true, requires Shift key + wheel
    factorX: 1.25,    // Zoom factor in X direction
    factorY: 1.25     // Zoom factor in Y direction
  }
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
});

// ----------------------------------------
// S' axes
// ----------------------------------------

board.create('line', [
  [0, 0],
  () => [1, betaSlider.Value()],
], {
  strokeWidth: 3,
  strokeColor: 'blue',
  fixed: true,
  name: "x'",
  withLabel: true,
  label: {
    position: 'rt',
    offset: [10, -15],
  },
});

board.create('line', [
  [0, 0],
  () => [betaSlider.Value(), 1],
], {
  strokeWidth: 3,
  strokeColor: 'red',
  fixed: true,
  name: "ct'",
  withLabel: true,
  label: {
    position: 'rt',
    offset: [10, 10],
  },
});

// ----------------------------------------
// S' coordinate labels
// ----------------------------------------
//
// x'軸上で x'=n, ct'=0 となる点は
//
//   x  = gamma * n
//   ct = gamma * beta * n
//
// ct'軸上で x'=0, ct'=n となる点は
//
//   x  = gamma * beta * n
//   ct = gamma * n
//

for (let n = -10; n <= 10; n++) {

  // x' positive side
  board.create('text', [
    () => {
      const beta = betaSlider.Value();
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return gamma * n;
    },
    () => {
      const beta = betaSlider.Value();
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return gamma * beta * n;
    },
    String(n),
  ], {
    fixed: true,
    anchorX: 'middle',
    anchorY: 'bottom',
    fontSize: 12,
    strokeColor: 'blue',
  });

  // ct' positive side
  board.create('text', [
    () => {
      const beta = betaSlider.Value();
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return gamma * beta * n;
    },
    () => {
      const beta = betaSlider.Value();
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return gamma * n;
    },
    String(n),
  ], {
    fixed: true,
    anchorX: 'left',
    anchorY: 'middle',
    fontSize: 12,
    strokeColor: 'red',
  });
}

// ----------------------------------------
// Point P
// ----------------------------------------

const pointP = board.create('point', [2, 2.5], {
  name: 'P',
  size: 5,
  strokeColor: 'black',
  fillColor: 'black',
  fixed: false,
});

// ----------------------------------------
// P-parallel S lines
// ----------------------------------------

board.create('line', [
  [0, () => pointP.Y()],
  [1, () => pointP.Y()],
], {
  strokeColor: '#777',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

board.create('line', [
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

board.create('line', [
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

board.create('line', [
  [() => pointP.X(), () => pointP.Y()],
  [() => pointP.X() + betaSlider.Value(), () => pointP.Y() + 1],
], {
  strokeColor: 'red',
  strokeWidth: 1,
  dash: 2,
  fixed: true,
});

// ----------------------------------------
// Lorentz transform
// ----------------------------------------

function lorentzTransform(
  x: number,
  ct: number,
  beta: number,
) {
  const gamma = 1 / Math.sqrt(1 - beta * beta);

  return {
    x: gamma * (x - beta * ct),
    ct: gamma * (ct - beta * x),
  };
}

// ----------------------------------------
// Coordinate text near P
// ----------------------------------------

board.create('text', [
  () => pointP.X() + 0.2,
  () => pointP.Y() + 0.4,
  () => {
    const x = pointP.X();
    const ct = pointP.Y();
    const beta = betaSlider.Value();

    const transformed = lorentzTransform(x, ct, beta);

    return `
            <span style="color: black">
                S: (x, ct) = (${x.toFixed(2)}, ${ct.toFixed(2)})
            </span>
            <br>
            <span style="color: blue">
                S': (x', ct') = (${transformed.x.toFixed(2)}, ${transformed.ct.toFixed(2)})
            </span>
        `;
  },
], {
  fixed: true,
  anchorX: 'left',
  anchorY: 'bottom',
  fontSize: 14,
});

// 初期描画
board.update();
