const css = require("css");
const rules = [];

/**
 * 收集css文本
 * @param {string} text
 */
function addCssRules(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

/**
 * 向元素添加css属性
 * @param {object} element
 * @param {'element'|'text'} [element.type]
 * @param {[]} [element.children]
 * @param {[]} [element.attributes]
 * @param {string} [element.tagName]
 * @param {[]} stack
 */
function computeCss(element, stack) {
  const elements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (const rule of rules) {
    const selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      const sp = specifisity(rule.selectors[0]);
      const computedStyle = element.computedStyle;

      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if (!computedStyle[declaration.property].specifisity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specifisity = sp;
        } else if (
          compare(computedStyle[declaration.property].specifisity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specifisity = sp;
        }
      }
      // 如果匹配到，我们要加入
      console.log("Element", element, "matched rules", rule);
    }
  }
}

function specifisity(selecotor) {
  const p = [0, 0, 0, 0];
  const selectorParts = selecotor.split(" ");

  for (const part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }

  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }

  return sp1[3] - sp2[3];
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  // 符合选择器
  // if (isMultySelector) {
  //   return multyMatch(element, selector);
  // }

  if (selector.charAt(0) === "#") {
    const attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    const attr = element.attributes.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }

  return false;
}

function multyMatch(element, selector) {
  const otherSeletors = selector.match(/([.#]\w+)/g);
  const attrs = element.attributes.filter(
    (attr) => attr.name === "id" || attr.name === "class"
  );

  if (selector.charAt(0) === "#" || selector.charAt(0) === ".") {
    return matchClassAndID(otherSeletors, attrs);
  } else {
    const firstTagName = selector.match(/(\w+)[.#]/)[1];
    if (element.tagName === selector) {
      return true;
    }
  }
}

function matchClassAndID(otherSeletors, attrs) {
  let result = false;
  otherSeletors.forEach((item) => {
    if (item.charAt(0) === "#") {
      const attr = attrs.filter((attr) => attr.name === "id")[0];
      if (attr && attr.value === item.replace("#", "")) {
        result = true;
      }
    }

    if (item.charAt(0) === ".") {
      result = element.attributes
        .filter((attr) => attr.name === "class")
        .some((attr) => attr && attr.value === item.replace(".", ""));
    }
  });

  return result;
}

function isMultySelector(selector) {
  if (selector.indexOf("#") > 0 || selector.indexOf(".") > 0) {
    return true;
  } else {
    return false;
  }
}

// const b = "div.a.b.c#a";
// console.log(b.match(/([.#]\w+)/g));
// console.log(b.match(/(\w+)[.#]/));

module.exports = {
  addCssRules,
  computeCss,
};
