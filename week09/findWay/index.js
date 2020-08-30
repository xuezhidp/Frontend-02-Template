let map = localStorage['map']
  ? JSON.parse(localStorage['map'])
  : Array(10000).fill(0);

let container = document.getElementById('container');
let mousedown = false;
let clear = false;

class Sorted {
  /**
   * @param {[]} data
   * @param {function} compare
   */
  constructor(data, compare) {
    this.data = data;
    this.compare = compare || ((a, b) => a - b);
  }

  take() {
    if (!this.data.length) {
      return;
    }

    let min = this.data[0];
    let minIndex = 0;

    for (let i = 1; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i];
        minIndex = i;
      }
    }

    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();
    return min;
  }

  give(v) {
    this.data.push(v);
  }

  get length() {
    return this.data.length;
  }
}

for (let y = 0; y < 100; y++) {
  for (let x = 0; x < 100; x++) {
    let cell = document.createElement('div');
    cell.classList.add('cell');

    if (map[100 * y + x] === 1) {
      cell.style.backgroundColor = 'black';
    }

    if (x === 50 && y === 50) {
      cell.style.backgroundColor = 'red';
    }

    cell.addEventListener('mousemove', () => {
      if (mousedown) {
        if (clear) {
          cell.style.backgroundColor = '';
          map[100 * y + x] = 0;
        } else {
          cell.style.backgroundColor = 'black';
          map[100 * y + x] = 1;
        }
      }
    });

    container.appendChild(cell);
  }
}

document.addEventListener('mousedown', (e) => {
  mousedown = true;
  clear = e.which === 3;
});

document.addEventListener('mouseup', () => {
  mousedown = false;
});
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

function sleep(t) {
  return new Promise((reolve, reject) => {
    setTimeout(reolve, t);
  });
}

/**
 * 寻路
 * @param {[number, number][]} map
 * @param {[number, number]} start
 * @param {[number, number]} end
 */
async function path(map, start, end) {
  // debugger;
  let table = Object.create(map);
  let queue = new Sorted([start], (a, b) => distance(a) - distance(b));

  async function insert(x, y, pre) {
    if (x < 0 || x >= 100 || y < 0 || y >= 100) {
      return;
    }

    if (table[y * 100 + x]) {
      return;
    }

    await sleep(5);
    container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
    table[y * 100 + x] = pre;
    queue.give([x, y]);
  }

  function distance(point) {
    return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
  }

  while (queue.length) {
    let [x, y] = queue.take();

    // console.log(x, y);
    if (x === end[0] && y === end[1]) {
      let path = [];
      while (x !== start[0] || y !== start[1]) {
        path.push(map[y * 100 + x]);
        [x, y] = table[y * 100 + x];
        container.children[y * 100 + x].style.backgroundColor = 'purple';
      }
      return path;
    }

    await insert(x - 1, y, [x, y]);
    await insert(x, y - 1, [x, y]);
    await insert(x + 1, y, [x, y]);
    await insert(x, y + 1, [x, y]);

    await insert(x - 1, y - 1, [x, y]);
    await insert(x + 1, y - 1, [x, y]);
    await insert(x - 1, y + 1, [x, y]);
    await insert(x + 1, y + 1, [x, y]);
  }
}

path(map, [0, 0], [50, 50]);
