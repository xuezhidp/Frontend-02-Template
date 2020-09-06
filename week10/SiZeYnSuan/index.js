/**
 * 四则运算
 * 1.TokenNumber: 1 2 3 4 5 6 7 8 9 0 的组合
 * 2.Operator: + - * / 之一
 * 3.Whitespace: <SP>
 * 4.LineTerminator: <LF> <CR>
 */
/**
 * 产生式
 * <Expression>::=
 *  <Add><EOF>
 * <Add>::=
 *  <Multi>
 *  |<Add><+><Multi>
 *  |<Add><-><Multi>
 * <Multi>::=
 *  <Number>
 *  |<Multi><*><Number>
 *  |<Multi></><Number>
 */

const regExp = /([0-9\.]+)|([ \t])|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
const dictionary = [
  'Number',
  'whitespace',
  'LineTerminator',
  '*',
  '/',
  '+',
  '-',
];

function* tokensize(source) {
  let result = null;
  let lastIndex = 0;

  while (true) {
    lastIndex = regExp.lastIndex;
    result = regExp.exec(source);

    if (!result || regExp.lastIndex - lastIndex > result[0].length) {
      break;
    }

    let token = {
      type: null,
      value: null,
    };

    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1];
      }
    }

    token.value = result[0];
    yield token;
  }

  yield {
    type: 'EOF',
  };
}

let source = [];

for (const token of tokensize('10 * 2 - 5 + 3')) {
  if (token.type !== 'whitespace' && token.type !== 'LineTerminator') {
    source.push(token);
  }
}

function Expression(tokens) {
  if (source[0].type === 'AddExp' && source[1] && AddExp[1].type === 'EOF') {
    let node = {
      type: 'Expression',
      children: [source.shift(), source.shift()],
    };

    source.unshift(node);

    return node;
  }

  AddExp(source);

  return Expression(source);
}

function AddExp(source) {
  if (source[0].type === 'MultiExp') {
    let node = {
      type: 'AddExp',
      children: [source[0]],
    };

    source[0] = node;

    return AddExp(source);
  } else if (
    source[0].type === 'AddExp' &&
    source[1] &&
    source[1].type === '+'
  ) {
    let node = {
      type: 'AddExp',
      operator: '+',
      children: [],
    };

    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiExp(source);
    node.children.push(source.shift());

    source.unshift(node);

    return AddExp(source);
  } else if (
    source[0].type === 'AddExp' &&
    source[1] &&
    source[1].type === '-'
  ) {
    let node = {
      type: 'AddExp',
      operator: '-',
      children: [],
    };

    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiExp(source);
    node.children.push(source.shift());

    source.unshift(node);

    return AddExp(source);
  } else if (source[0].type === 'AddExp') {
    return source[0];
  } else {
    MultiExp(source);
    return AddExp(source);
  }
}

function MultiExp(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiExp',
      children: [source[0]],
    };

    source[0] = node;

    return MultiExp(source);
  } else if (
    source[0].type === 'MultiExp' &&
    source[1] &&
    source[1].type === '*'
  ) {
    let node = {
      type: 'MultiExp',
      operator: '*',
      children: [],
    };

    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());

    source.unshift(node);

    return MultiExp(source);
  } else if (
    source[0].type === 'MultiExp' &&
    source[1] &&
    source[1].type === '/'
  ) {
    let node = {
      type: 'MultiExp',
      operator: '/',
      children: [],
    };

    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());

    source.unshift(node);

    return MultiExp(source);
  } else if (source[0].type === 'MultiExp') {
    return source[0];
  } else {
    return MultiExp(source);
  }
}

// MultiExp(source);

console.log('sourc', AddExp(source));
