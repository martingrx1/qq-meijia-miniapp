/**
 * @file
 * @author linbingchen@baidu.com
 */

function debounce(func, wait) {
  var timeout;

  var debounced = function () {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };

  return debounced;
}

export {debounce};
