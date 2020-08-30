// 一个路口的红绿灯
// 会按照绿灯亮10秒
// 黄灯亮2秒
// 红灯亮5秒的顺序
// 无限循环
// 请编写js控制这个红绿灯

/************************ 我的方案 开始 *************************/
// const SEOND = 100;
// const RED = '红';
// const RED_DURATION = 5 * SEOND;
// const YELLOW = '黄';
// const YELLOW_DURATION = 2 * SEOND;
// const GREEN = '绿';
// const GREEN_DURATION = 10 * SEOND;

// let light = RED;

// // 绿 => 黄 =》 红 =》 绿

// function showRed() {
//   light = RED;
//   console.log(light);
//   setTimeout(() => {
//     showGreen();
//   }, RED_DURATION);
// }

// function showYellow() {
//   light = YELLOW;
//   console.log(light);
//   setTimeout(() => {
//     showRed();
//   }, YELLOW_DURATION);
// }

// function showGreen() {
//   light = GREEN;
//   console.log(light);
//   setTimeout(() => {
//     showYellow();
//   }, GREEN_DURATION);
// }
// showGreen(); // 启动
/************************ 我的方案 结束 *************************/

function lighten(color) {
  const lights = document.getElementsByTagName('div');

  for (let light of lights) {
    light.classList.remove('light');
  }

  document.getElementsByClassName(color)[0].classList.add('light');
}

function sleep(t) {
  return new Promise((reolve, reject) => {
    setTimeout(reolve, t);
  });
}

/************************ Promise *************************/
function go() {
  lighten('green');
  sleep(1000)
    .then(() => {
      lighten('yellow');
      return sleep(200);
    })
    .then(() => {
      lighten('red');
      return sleep(500);
    })
    .then(go);
}

/************************ Async *************************/
async function asyncGo() {
  while (true) {
    lighten('green');
    await happen(document.getElementById('next'), 'click');
    // await sleep(1000);

    lighten('yellow');
    await happen(document.getElementById('next'), 'click');
    // await sleep(200);

    lighten('red');
    await happen(document.getElementById('next'), 'click');
    // await sleep(500);
  }
}

// asyncGo();

/**
 * @param {HTMLElement} element
 * @param {string} eventName
 */
function happen(element, eventName) {
  return new Promise((resolve, reject) => {
    element.addEventListener(eventName, resolve, { once: true });
  });
}

/************************ generater *************************/

function* generatorGo() {
  while (true) {
    lighten('green');
    yield sleep(1000);

    lighten('yellow');
    yield sleep(200);

    lighten('red');
    yield sleep(500);
  }
}

function run(iterator) {
  let { value, done } = iterator.next();
  if (done) {
    return;
  }

  if (value instanceof Promise) {
    value.then(() => {
      run(iterator);
    });
  }
}

function co(generator) {
  return () => run(generator());
}

generatorGo = co(generatorGo);

async function* counter() {
  let i = 0;
  while (true) {
    await sleep(1000);
    yield i++;
  }
}

(async () => {
  for await (const v of counter()) {
    console.log(v);
  }
})();
