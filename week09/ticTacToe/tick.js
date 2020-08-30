let pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0];

let color = 1;

function show() {
  let board = document.getElementById('board');

  board.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let cell = document.createElement('div');

      cell.classList.add('cell');

      let cellNum = pattern[i * 3 + j];
      cell.innerHTML = cellNum === 2 ? '❌' : cellNum === 1 ? '⭕' : '';
      cell.addEventListener('click', () => {
        userMove(j, i);
      });

      board.appendChild(cell);
    }

    board.appendChild(document.createElement('br'));
  }
}

function userMove(x, y) {
  pattern[y * 3 + x] = color;

  if (check(pattern, color)) {
    alert(color === 2 ? '❌赢了' : '⭕赢了');
  }

  color = 3 - color;
  console.log(bestChoice(pattern, color));
  show();
  computeMove();

  // if (willWin(pattern, color)) {
  //   console.log(color === 2 ? '❌会赢' : '⭕会赢');
  // }
}

function computeMove() {
  let choice = bestChoice(pattern, color);
  if (choice.point) {
    pattern[choice.point[1] * 3 + choice.point[0]] = color;
  }

  if (check(pattern, color)) {
    alert(color === 2 ? '❌ 赢了' : '⭕赢了');
  }

  color = 3 - color;
  show();
}

function check(pattern, color) {
  for (let i = 0; i < 3; i++) {
    let win = true;

    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j] !== color) {
        win = false;
      }
    }

    if (win) {
      return true;
    }
  }

  for (let i = 0; i < 3; i++) {
    let win = true;

    for (let j = 0; j < 3; j++) {
      if (pattern[j * 3 + i] !== color) {
        win = false;
      }
    }

    if (win) {
      return true;
    }
  }
  {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[j * 3 + 2 - j] !== color) {
        win = false;
      }
    }

    if (win) {
      return true;
    }
  }
  {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[j * 3 + j] !== color) {
        win = false;
      }
    }

    if (win) {
      return true;
    }
  }

  return false;
}

function clone(pattern) {
  return Object.create(pattern);
}

function willWin(pattern, color) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j]) {
        continue;
      }

      // if (i == 2 && j == 0) {
      //   debugger;
      // }

      let temp = clone(pattern);
      temp[i * 3 + j] = color;

      if (check(temp, color)) {
        return [j, i];
      }
    }
  }

  return null;
}

function bestChoice(pattern, color) {
  let point = willWin(pattern, color);

  if (point) {
    return {
      point: point,
      result: 1,
    };
  }

  let result = -1;

  outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i * 3 + j]) {
        continue;
      }

      let temp = clone(pattern);
      temp[i * 3 + j] = color;
      let opp = bestChoice(temp, 3 - color);

      if (-opp.result >= result) {
        result = -opp.result;
        point = [j, i];
      }

      if (result === 1) {
        break outer;
      }
    }
  }

  return {
    point,
    result: point ? result : 0,
  };
}

show();
// console.log(bestChoice(pattern, color));
