/**
 *
 * @param {object} element
 * @param {object} [element.computedStyle]
 */
function layout(element) {
  if (element.computedStyle) {
    return;
  }

  const elementStyle = getStyle(element);

  if (elementStyle.display !== "flex") {
    return;
  }

  const items = element.children.filter((e) => e.type === "element");

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  const style = elementStyle;

  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === 0) {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowrap";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }

  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;

  if (style.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }

  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }

  if (style.flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.top;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexWrap === "wrap-reverse") {
    [crossStart, crossEnd] = [crossEnd, crossStart];
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  let isAutoMainSize = false;
  if (!style[mainSize]) {
    element[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  let flexLine = [];
  const flexLines = [flexLine];
  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainsize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        flexLine.push(item);
      }
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }

      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize] !== null && itemStyle === void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        mainSpace -= itemStyle[mainSize];
      }
    }

    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === "no-wrap" || isAutoMainSize) {
      flexLine.crossSpace =
        style[crossSize] !== undefined ? style[crossSize] : crossSpace;
    } else {
      flexLine[crossSpace] = crossSpace;
    }

    if (mainSpace < 0) {
      const scale = style[mainSize] / (style[mainSize] - mainSpace);
      const currentMain = mainSpace;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);

        if (itemStyle.flex) {
          itemStyle[mainSize] = 0;
        }

        itemStyle[mainSize] = itemStyle[mainSize] * scale;

        itemStyle[mainStart] = currentMain;
        itemStyle[mainEnd] =
          itemStyle[mainStart] + mainSign * itemStyle[mainSize];
        currentMain = itemStyle[mainEnd];
      }
    } else {
      flexLines.push(function item(items) {
        const mainSpace = itmes.mainSpace;
        let flexTotal = 0;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const itemStyle = getStyle(item);

          if (item.flex !== null && item.flex !== void 0) {
            flexTotal += item.flex;
            continue;
          }
        }

        if (flexTotal > 0) {
          const currentMain = mainBase;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle(item);
            if (itemStyle.flex) {
              itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
              itemStyle[mainStart] = currentMain;
              itemStyle[mainEnd] =
                itemStyle[mainStart] + mainSign * itemStyle[mainSize];
              currentMain = itemStyle[mainEnd];
            }
          }
        } else {
          if (style.justifyContent === "flex-start") {
            let currentMain = mainBase;
            let step = 0;
          } else if (style.justifyContent === "flex-end") {
            let currentMain = mainBase + mainSpace * mainSign;
            let step = 0;
          } else if (style.justifyContent === "center") {
            let currentMain = (mainSpace / 2) * mainSign + mainBase;
            let step = 0;
          } else if (style.justifyContent === "space-between") {
            let currentMain = mainBase;
            let step = (mainSpace / (items.length - 1)) * mainSign;
          } else if (style.justifyContent === "space-around") {
            let step = (mainSpace / items.length) * mainSign;
            let currentMain = step / 2 + mainSpace;
          }

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle(item);

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] =
              itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd] + step;
          }
        }
      });
    }

    console.log(items);
  }

  if (!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] += flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  const lineSize = style[crossSize] / flexLines.length;
  let step;
  if (style.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  } else if (style.alignContent === "flex-end") {
    crossBase += crossSign * crossSpace;
    step = 0;
  } else if (style.alignContent === "center") {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  } else if (style.alignContent === "space-between") {
    step = crossSpace / (flexLines.length - 1);
    crossBase += 0;
  } else if (style.alignContent === "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  } else if (style.alignContent === "stretch") {
    step = 0;
    crossBase += 0;
  }

  flexLines.forEach(function (items) {
    const lineCrossSize =
      style.alignContent === "stretch"
        ? items.crossSpace + crossSpace
        : item.crossSpace;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);
      const align = itemStyle.alignSelf || style.alignItems;

      if (item === null) {
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
      }

      if (align === "flex-start") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      } else if (align === "center") {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (align === "stretch") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          crossBase +
          crossSign * (itemStyle[crossSize] !== null && itemStyle[crossSize]);
        itemStyle[crossSize] = crossSign * itemStyle[crossSize];
      }
    }

    crossBase += crossSign * (lineCrossSize + step);
  });
}

function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (const prop in element.computedStyle) {
    const p = element.computedStyle.value;

    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
}

module.exports = layout;
