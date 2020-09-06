const $ = Symbol('$');

class Trie {
  constructor() {
    this.root = Object.create(null);
  }

  /**
   * 插入
   * @param {string} word
   */
  insert(word) {
    let node = this.root;

    for (const c of word) {
      if (!node[c]) {
        node[c] = Object.create(null);
      }
      node = node[c];
    }
    if (!($ in node)) {
      node[$] = 0;
    }

    node[$]++;
  }

  /**
   *
   */
  most() {
    let max = 0;
    let maxWord = null;
    const visit = (node, word) => {
      if (node[$] && node[$] > max) {
        max = node[$];
        maxWord = word;
      }

      for (const p in node) {
        visit(node[p], word + p);
      }
    };

    visit(this.root, '');
    console.log(maxWord);
    console.log(max);
  }
}

function randomWord(length) {
  let s = '';

  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(
      Math.floor(Math.random() * 26 + 'a'.charCodeAt(0))
      // Math.floor(Math.random() * 2 + 'a'.charCodeAt(0))
    );
  }

  return s;
}

let trie = new Trie();

for (let i = 0; i < 10000; i++) {
  trie.insert(randomWord(4));
}

trie.most();
