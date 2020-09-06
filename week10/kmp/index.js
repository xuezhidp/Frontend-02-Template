/**
 * @param {string} source
 * @param {string} pattern
 */
function kmp(source, pattern) {
  // 计算表格
  let table = new Array(pattern).fill(0);

  {
    let i = 1;
    let j = 0;

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i++;
        j++;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          i++;
        }
      }
    }
  }

  {
    let i = 0;
    let j = 0;

    while (i < source.length) {
      if (pattern[j] === source[i]) {
        i++;
        j++;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          i++;
        }
      }

      if (j === pattern.length) {
        return true;
      }
    }

    return false;
  }
}

console.log(kmp("abcdabce", "abcdabce")); // true
console.log(kmp("hello", "ll")); // true
console.log(kmp("helxlo", "ll")); // false

// 这个匹配不对
console.log(kmp("abcdabcabcdabce", "abcdabce")); // false
