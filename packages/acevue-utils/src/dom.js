import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\\:\-\\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
const camelCase = function(name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
export const loadStyleString = (css, id = '') => {
  if (document.getElementById(id)) return;
  let style = document.createElement('style');
  style.type = 'text/css';
  style.id = id;
  try {
    style.appendChild(document.createTextNode(css));
  } catch (ex) {
    style.styleSheet.cssText = css;
  }
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
};

/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
      return element;
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
      return element;
    };
  }
})();

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
      return element;
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
      return element;
    };
  }
})();

/* istanbul ignore next */
export const once = function(el, event, fn) {
  let listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  return on(el, event, listener);
};

/* istanbul ignore next */
export function scrollIntoView(container, selected) {
  if (isServer) return;

  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const top = selected.offsetTop;
  const bottom = selected.offsetTop + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}

// 鼠标的距离body的offsetX/offsetY
/* istanbul ignore next */
export function pointer(event) {
  if (isServer) return { left: 0, top: 0 };
  return {
    left:
      event.pageX ||
      event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
    top:
      event.pageY ||
      event.clientY + (document.documentElement.scrollTop || document.body.scrollTop),
  };
}

// 获取组件距离body的offsetX/offsetY
/* istanbul ignore next */
export function getOffset(el) {
  if (isServer) return { left: 0, top: 0 };
  if (el.getBoundingClientRect) {
    return getOffsetRect(el);
  } else {
    return getOffsetSum(el);
  }
}

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

/* istanbul ignore next */
export function addClass(el, cls) {
  if (!el) return;
  let curClass = el.className;
  let classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  let classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/* istanbul ignore next */
export function toggleClass(el, cls) {
  if (hasClass(el, cls)) {
    removeClass(el, cls);
  } else {
    addClass(el, cls);
  }
}

// 获取样式兼容性函数
/* istanbul ignore next */
export const getStyle =
  ieVersion < 9
    ? function(element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'styleFloat';
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null;
          }
        } catch (e) {
          return element.style[styleName];
        }
      }
    : function(element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'cssFloat';
        }
        try {
          let computed = document.defaultView.getComputedStyle(element, '');
          return element.style[styleName] || computed ? computed[styleName] : null;
        } catch (e) {
          return element.style[styleName];
        }
      };

// 设置样式
/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (let prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
}

// 获取 element offset (防止position污染))
/* istanbul ignore next */
function getOffsetSum(ele) {
  let top = 0;
  let left = 0;
  while (ele) {
    top += ele.offsetTop;
    left += ele.offsetLeft;
    ele = ele.offsetParent;
  }
  return {
    top: top,
    left: left,
  };
}

// 获取 page offset (包含 scroll)
/* istanbul ignore next */
function getOffsetRect(ele) {
  let box = ele.getBoundingClientRect();
  let body = document.body;
  let docElem = document.documentElement;
  // 获取页面的scrollTop,scrollLeft(兼容性写法)
  let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  let clientTop = docElem.clientTop || body.clientTop;
  let clientLeft = docElem.clientLeft || body.clientLeft;
  let top = box.top + scrollTop - clientTop;
  let left = box.left + scrollLeft - clientLeft;
  return {
    // Math.round 兼容火狐浏览器bug
    top: Math.round(top),
    left: Math.round(left),
  };
}

/* istanbul ignore next */
export const isScroll = (el, vertical) => {
  if (isServer) return;

  const determinedDirection = vertical !== null || vertical !== undefined;
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')
    : getStyle(el, 'overflow');

  return overflow.match(/(scroll|auto)/);
};

/* istanbul ignore next */
export const getScrollContainer = (el, vertical) => {
  if (isServer) return;

  let parent = el;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window;
    }
    if (isScroll(parent, vertical)) {
      return parent;
    }
    parent = parent.parentNode;
  }

  return parent;
};

/* istanbul ignore next */
export const isInContainer = (el, container) => {
  if (isServer || !el || !container) return false;

  const elRect = el.getBoundingClientRect();
  let containerRect;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  );
};
