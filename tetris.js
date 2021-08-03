const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

var collide = function (arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0)
        return true;
    }
  }
  return false;
};

var createMatrix = function (w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
};

var draw = function () {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
};

var drawMatrix = function (matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = "red";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

var merge = function (arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};

// Moving Vertically (just down)
var playerDrop = function () {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
};

// Moving horizontally
var playerMove = function (dir) {
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
};

var playerRotate = function (dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
};

var rotate = function (matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
};

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

var update = function (time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
};

const arena = createMatrix(12, 20);
console.log(arena);

const player = {
  pos: { x: 5, y: 5 },
  matrix: matrix,
};

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") playerMove(-1);
  else if (event.key == "ArrowRight") playerMove(1);
  else if (event.key == "ArrowDown") playerDrop();
  else if (event.key == "e") playerRotate(-1);
  else if (event.key == "q") playerRotate(1);
});

update();
