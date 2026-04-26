const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const size = 50;          // grid size (50x50)
const cellSize = 10;      // pixel size per cell
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let grid = createGrid();
let running = false;
let interval = null;

// --- Grid Creation ---
function createGrid(random = false) {
  const arr = [];
  for (let y = 0; y < size; y++) {
    arr[y] = [];
    for (let x = 0; x < size; x++) {
      arr[y][x] = random ? (Math.random() > 0.7 ? 1 : 0) : 0;
    }
  }
  return arr;
}

// --- Draw ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = "black";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// --- Update ---
function step() {
  const newGrid = createGrid();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {

      let neighbours = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {

          if (dx === 0 && dy === 0) continue;

          const ny = y + dy;
          const nx = x + dx;

          if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
            neighbours += grid[ny][nx];
          }
        }
      }

      if (grid[y][x] === 1) {
        newGrid[y][x] = (neighbours === 2 || neighbours === 3) ? 1 : 0;
      } else {
        newGrid[y][x] = (neighbours === 3) ? 1 : 0;
      }
    }
  }

  grid = newGrid;
}

// --- Controls ---
document.getElementById("startPause").onclick = () => {
  running = !running;

  if (running) {
    interval = setInterval(() => {
      step();
      draw();
    }, 500);
    document.getElementById("startPause").textContent = "Pause";
  } else {
    clearInterval(interval);
    document.getElementById("startPause").textContent = "Start";
  }
};

document.getElementById("clear").onclick = () => {
  grid = createGrid();
  draw();
};

document.getElementById("random").onclick = () => {
  grid = createGrid(true);
  draw();
};

// --- Toggle Cells ---
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  grid[y][x] = grid[y][x] ? 0 : 1;
  draw();
});

// Initial draw
draw();