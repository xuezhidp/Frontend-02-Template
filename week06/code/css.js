// div#a.b .c[id=x] 0 1 3 1
// #a:not(#b) 0 2 0 0
// *.a 0 0 1 0
// div.a 0 0 1 1
// /**
//  * @param {string} selector
//  */
// function specificity(selector) {
//   const priority = [0, 0, 0, 0];
//   priority[1] = selector.match(/([#]\w+)/g)
//     ? selector.match(/([#]\w+)/g).length
//     : 0;
//   priority[2] = selector.match(/([.]\w+)/g)
//     ? selector.match(/([.]\w+)/g).length
//     : 0;
//   priority[2] += selector.match(/(\[\w+=\w+\])/g)
//     ? selector.match(/(\[\w+=\w+\])/g).length
//     : 0;

//   selector.split(" ").forEach((part) => {
//     if (
//       part.charAt(0) !== "." &&
//       part.charAt(0) !== "#" &&
//       part.charAt(0) !== "[" &&
//       part.charAt(0) !== "*"
//     ) {
//       priority[3] += 1;
//     }
//   });
//   return priority;
// }

// console.log(specificity("div.a")); // [0, 0, 1, 1];
// console.log(specificity("div#a.b .c[id=x]")); // [0, 1, 3, 1];
// console.log(specificity("#a:not(#b)")); // [0, 2, 0, 0];
// console.log(specificity("*.a")); // [0, 0, 1, 0];

// function specifisity(selecotor) {
//   const p = [0, 0, 0, 0];
//   const selectorParts = selecotor.split(" ");

//   for (const part of selectorParts) {
//     if (part.charAt(0) === "#") {
//       p[1] += 1;
//     } else if (part.charAt(0) === ".") {
//       p[2] += 1;
//     } else {
//       p[3] += 1;
//     }
//   }

//   return p;
// }
// console.log("div#a.b .c[id=x]".match(/(\[\w+=\w+\])/g));
// console.log("#a:not(#b)".match(/([#]\w+)/g));

/**
 * @param {string} selector
 * @param {Element} element
 */
function match(selector, element) {
  const selectorParts = [];
  selector.split(" ").forEach((part, index) => {
    selectorParts[index] = [];
    if (part.charAt(0) === "#" || part.charAt(0) === ".") {
      addSimpleSelectors(part, selectorParts[index]);
    } else {
      const tagName = part.match(/(\w+)[#.]?/);
      selectorParts[index].push({
        type: "tagName",
        value: tagName[1],
      });
      addSimpleSelectors(part, selectorParts[index]);
    }
  });

  let result = false;
  debugger;
  for (let i = selectorParts.length - 1; i > -1; i--) {
    const collector = selectorParts[i];
    if (i === selectorParts.length - 1) {
      collector.forEach((selectorObj) => {
        if (selectorObj.type === "id") {
          result = selectorObj.value === element.id;
        } else if (selector.type === "tagName") {
          result = selectorObj.value === element.tagName.toLowerCase();
        } else if (selectorObj.type === "class") {
          result = element.classList.contains(selectorObj.value);
        }
      });
    } else {
      collector.forEach((selectorObj) => {
        deepGet(result, selectorObj, element);
      });
    }
  }

  return result;
}

function addSimpleSelectors(part, collector) {
  const simpleSelectors = part.match(/([#.]\w+)/g);
  if (simpleSelectors) {
    simpleSelectors.forEach((simpeleSelector) => {
      if (simpeleSelector.charAt(0) === "#") {
        collector.push({
          type: "id",
          value: simpeleSelector.slice(1),
        });
      } else if (simpeleSelector.charAt(0) === ".") {
        collector.push({
          type: "class",
          value: simpeleSelector.slice(1),
        });
      }
    });
  }
}

function deepGet(result, selectorObj, element) {
  if (result || !element.parentNode) {
    return;
  }

  if (selectorObj.type === "id") {
    result = selectorObj.value === element.id;
  } else if (selectorObj.type === "tagName") {
    result = selectorObj.value === element.tagName.toLowerCase();
  } else if (selectorObj.type === "class") {
    result = element.classList.contains(selectorObj.value);
  }

  deepGet(element.parentNode);
}

console.log(
  match(
    "#new_header .new-header .header-right1 #login-area .logined .user-card-item",
    document.getElementById("header-avator")
  )
);
