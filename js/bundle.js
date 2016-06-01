(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
module.exports = imageData => {

  // Declare closure-scoped variables
  const state = {
    isLoading: true,
    // Set the currentIndex to a random position in the images array
    currentIndex: Math.floor(Math.random() * imageData.length)
  };

  // Map the imageUrls to image objects, with Image data holders
  let images = imageData.map(({ url, title }) => ({
    url,
    title,
    data: new Image(),
    loaded: 0
  }));

  // Define the DOM Element targets
  const target = document.getElementById('boxlight');
  const title = document.getElementById('title');
  const loader = document.getElementById('loader');

  loadInitialImage();

  // Return an object with exposed methods
  return {
    prev,
    next
  };

  // ------------------------------------- Internal methods

  // Set loading state and hide the loader element
  function setLoadingState(isLoading) {
    state.isLoading = isLoading;
    loader.style.opacity = isLoading ? 1 : 0;
  }

  // Display an image by setting it as the target's background
  function showImage(image) {
    target.style.backgroundImage = `url(${ image.src })`;
    target.style.opacity = 1;
    title.innerHTML = image.title;
  }

  // Controls
  function prev() {
    const prevIndex = getPrevIndex(state.currentIndex);
    goToImage(prevIndex);
  }

  function next() {
    const nextIndex = getNextIndex(state.currentIndex);
    goToImage(nextIndex);
  }

  // Navigate to a specific image
  function goToImage(index) {
    // Disable skipping ahead past a loading image, for simplicity's sake
    if (state.isLoading) {
      return;
    }

    const image = images[index];
    // In case the image data is already loaded, simply set the imageSource
    if (image.loaded) {
      state.currentIndex = index;
      return showImage(image);
    }

    setLoadingState(true);
    loadImageData(index).then(image => {
      state.currentIndex = index;
      setLoadingState(false);
      showImage(image);
    });
  }

  // Load image data
  function loadImageData(index, shouldLoadNeighbors = true) {
    return new Promise(resolve => {
      const image = images[index];
      if (image.loaded) {
        return resolve(image);
      }

      // Set the source to the url, beginning the load
      image.data.src = image.url;
      image.data.onload = function () {
        image.loaded = true;
        image.src = this.src;
        resolve(image);
      };

      // Optimistically load the next and previous images in the set
      if (shouldLoadNeighbors) {
        loadNeighbors(index);
      }
    });
  }

  // Optimistically load the previous and next image
  function loadNeighbors(index) {
    const prevIndex = getPrevIndex(index);
    const nextIndex = getNextIndex(index);

    loadImageData(prevIndex, false);
    loadImageData(nextIndex, false);
  }

  function loadInitialImage() {
    loadImageData(state.currentIndex).then(image => {
      setLoadingState(false);
      showImage(image);
    });
  }

  // Helper methods
  function getPrevIndex(index) {
    return index === 0 ? images.length - 1 : index - 1;
  }

  function getNextIndex(index) {
    return index === images.length - 1 ? 0 : index + 1;
  }
};

},{}],5:[function(require,module,exports){
const querystring = require('querystring');
const initializeBoxlight = require('./boxlight');

const apiKey = 'bc01c649f92a965db1fb2df48fbd4225';
const galleryId = '72157669024463295';

document.addEventListener('DOMContentLoaded', function () {
  loadGallery(galleryId).then(imageData => {
    const boxlight = initializeBoxlight(imageData);

    // Set up our navigation links
    document.getElementById('prev').addEventListener('click', boxlight.prev);
    document.getElementById('next').addEventListener('click', boxlight.next);
  });
});

function loadGallery(galleryId) {
  const baseUrl = 'https://api.flickr.com/services/rest';
  const queryParams = {
    method: 'flickr.galleries.getPhotos',
    gallery_id: galleryId,
    api_key: apiKey,
    format: 'json',
    nojsoncallback: 1,
    extras: 'original_format'
  };

  const url = `${ baseUrl }/?${ querystring.stringify(queryParams) }`;

  return fetch(url).then(response => response.json()).then(data => {
    const photos = data.photos;
    const imageData = photos.photo.map(imageObj => {
      return {
        url: constructImageUrl(imageObj),
        title: imageObj.title
      };
    });
    return imageData;
  });
}

function constructImageUrl(imageObj) {
  const { farm, server, id, originalsecret } = imageObj;
  const imageUrl = `https://farm${ farm }.staticflickr.com/${ server }/${ id }_${ originalsecret }_o.jpg`;
  return imageUrl;
}

},{"./boxlight":4,"querystring":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsInNyYy9qcy9ib3hsaWdodC5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBLE9BQU8sT0FBUCxHQUFrQixTQUFELElBQWU7OztBQUc5QixRQUFNLFFBQVE7QUFDWixlQUFXLElBREM7O0FBR1osa0JBQWMsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLFVBQVUsTUFBckM7QUFIRixHQUFkOzs7QUFPQSxNQUFJLFNBQVMsVUFBVSxHQUFWLENBQWMsQ0FBQyxFQUFFLEdBQUYsRUFBTyxLQUFQLEVBQUQsTUFBcUI7QUFDOUMsT0FEOEM7QUFFOUMsU0FGOEM7QUFHOUMsVUFBTSxJQUFJLEtBQUosRUFId0M7QUFJOUMsWUFBUTtBQUpzQyxHQUFyQixDQUFkLENBQWI7OztBQVFBLFFBQU0sU0FBUyxTQUFTLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBZjtBQUNBLFFBQU0sUUFBUSxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBZDtBQUNBLFFBQU0sU0FBUyxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZjs7QUFFQTs7O0FBR0EsU0FBTztBQUNMLFFBREs7QUFFTDtBQUZLLEdBQVA7Ozs7O0FBUUEsV0FBUyxlQUFULENBQXlCLFNBQXpCLEVBQW9DO0FBQ2xDLFVBQU0sU0FBTixHQUFrQixTQUFsQjtBQUNBLFdBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsWUFBWSxDQUFaLEdBQWdCLENBQXZDO0FBQ0Q7OztBQUdELFdBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixXQUFPLEtBQVAsQ0FBYSxlQUFiLEdBQStCLENBQUMsSUFBRCxHQUFPLE1BQU0sR0FBYixFQUFpQixDQUFqQixDQUEvQjtBQUNBLFdBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsQ0FBdkI7QUFDQSxVQUFNLFNBQU4sR0FBa0IsTUFBTSxLQUF4QjtBQUNEOzs7QUFHRCxXQUFTLElBQVQsR0FBZ0I7QUFDZCxVQUFNLFlBQVksYUFBYSxNQUFNLFlBQW5CLENBQWxCO0FBQ0EsY0FBVSxTQUFWO0FBQ0Q7O0FBRUQsV0FBUyxJQUFULEdBQWdCO0FBQ2QsVUFBTSxZQUFZLGFBQWEsTUFBTSxZQUFuQixDQUFsQjtBQUNBLGNBQVUsU0FBVjtBQUNEOzs7QUFHRCxXQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7O0FBRXhCLFFBQUksTUFBTSxTQUFWLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQsVUFBTSxRQUFRLE9BQU8sS0FBUCxDQUFkOztBQUVBLFFBQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2hCLFlBQU0sWUFBTixHQUFxQixLQUFyQjtBQUNBLGFBQU8sVUFBVSxLQUFWLENBQVA7QUFDRDs7QUFFRCxvQkFBZ0IsSUFBaEI7QUFDQSxrQkFBYyxLQUFkLEVBQXFCLElBQXJCLENBQTBCLFNBQVM7QUFDakMsWUFBTSxZQUFOLEdBQXFCLEtBQXJCO0FBQ0Esc0JBQWdCLEtBQWhCO0FBQ0EsZ0JBQVUsS0FBVjtBQUNELEtBSkQ7QUFLRDs7O0FBR0QsV0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCLHNCQUFzQixJQUFwRCxFQUEwRDtBQUN4RCxXQUFPLElBQUksT0FBSixDQUFZLFdBQVc7QUFDNUIsWUFBTSxRQUFRLE9BQU8sS0FBUCxDQUFkO0FBQ0EsVUFBSSxNQUFNLE1BQVYsRUFBa0I7QUFDaEIsZUFBTyxRQUFRLEtBQVIsQ0FBUDtBQUNEOzs7QUFHRCxZQUFNLElBQU4sQ0FBVyxHQUFYLEdBQWlCLE1BQU0sR0FBdkI7QUFDQSxZQUFNLElBQU4sQ0FBVyxNQUFYLEdBQW9CLFlBQVc7QUFDN0IsY0FBTSxNQUFOLEdBQWUsSUFBZjtBQUNBLGNBQU0sR0FBTixHQUFZLEtBQUssR0FBakI7QUFDQSxnQkFBUSxLQUFSO0FBQ0QsT0FKRDs7O0FBT0EsVUFBSSxtQkFBSixFQUF5QjtBQUN2QixzQkFBYyxLQUFkO0FBQ0Q7QUFDRixLQWxCTSxDQUFQO0FBbUJEOzs7QUFHRCxXQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDNUIsVUFBTSxZQUFZLGFBQWEsS0FBYixDQUFsQjtBQUNBLFVBQU0sWUFBWSxhQUFhLEtBQWIsQ0FBbEI7O0FBRUEsa0JBQWMsU0FBZCxFQUF5QixLQUF6QjtBQUNBLGtCQUFjLFNBQWQsRUFBeUIsS0FBekI7QUFDRDs7QUFFRCxXQUFTLGdCQUFULEdBQTRCO0FBQzFCLGtCQUFjLE1BQU0sWUFBcEIsRUFBa0MsSUFBbEMsQ0FBdUMsU0FBUztBQUM5QyxzQkFBZ0IsS0FBaEI7QUFDQSxnQkFBVSxLQUFWO0FBQ0QsS0FIRDtBQUlEOzs7QUFHRCxXQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkI7QUFDM0IsV0FBTyxVQUFVLENBQVYsR0FBYyxPQUFPLE1BQVAsR0FBZ0IsQ0FBOUIsR0FBa0MsUUFBUSxDQUFqRDtBQUNEOztBQUVELFdBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtBQUMzQixXQUFPLFVBQVUsT0FBTyxNQUFQLEdBQWdCLENBQTFCLEdBQThCLENBQTlCLEdBQWtDLFFBQVEsQ0FBakQ7QUFDRDtBQUNGLENBN0hEOzs7QUNBQSxNQUFNLGNBQWMsUUFBUSxhQUFSLENBQXBCO0FBQ0EsTUFBTSxxQkFBcUIsUUFBUSxZQUFSLENBQTNCOztBQUVBLE1BQU0sU0FBUyxrQ0FBZjtBQUNBLE1BQU0sWUFBWSxtQkFBbEI7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBVztBQUN2RCxjQUFZLFNBQVosRUFDRyxJQURILENBQ1EsYUFBYTtBQUNqQixVQUFNLFdBQVcsbUJBQW1CLFNBQW5CLENBQWpCOzs7QUFHQSxhQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsZ0JBQWhDLENBQWlELE9BQWpELEVBQTBELFNBQVMsSUFBbkU7QUFDQSxhQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsZ0JBQWhDLENBQWlELE9BQWpELEVBQTBELFNBQVMsSUFBbkU7QUFDRCxHQVBIO0FBUUQsQ0FURDs7QUFXQSxTQUFTLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0M7QUFDOUIsUUFBTSxVQUFVLHNDQUFoQjtBQUNBLFFBQU0sY0FBYztBQUNsQixZQUFRLDRCQURVO0FBRWxCLGdCQUFZLFNBRk07QUFHbEIsYUFBUyxNQUhTO0FBSWxCLFlBQVEsTUFKVTtBQUtsQixvQkFBZ0IsQ0FMRTtBQU1sQixZQUFRO0FBTlUsR0FBcEI7O0FBU0EsUUFBTSxNQUFNLENBQUEsQUFBQyxHQUFFLE9BQUgsRUFBVyxFQUFYLEdBQWUsWUFBWSxTQUFaLENBQXNCLFdBQXRCLENBQWYsRUFBQSxBQUFrRCxDQUE5RDs7QUFFQSxTQUFPLE1BQU0sR0FBTixFQUNKLElBREksQ0FDQyxZQUFZLFNBQVMsSUFBVCxFQURiLEVBRUosSUFGSSxDQUVDLFFBQVE7QUFDWixVQUFNLFNBQVMsS0FBSyxNQUFwQjtBQUNBLFVBQU0sWUFBWSxPQUFPLEtBQVAsQ0FBYSxHQUFiLENBQWlCLFlBQVk7QUFDN0MsYUFBTztBQUNMLGFBQUssa0JBQWtCLFFBQWxCLENBREE7QUFFTCxlQUFPLFNBQVM7QUFGWCxPQUFQO0FBSUQsS0FMaUIsQ0FBbEI7QUFNQSxXQUFPLFNBQVA7QUFDRCxHQVhJLENBQVA7QUFZRDs7QUFFRCxTQUFTLGlCQUFULENBQTJCLFFBQTNCLEVBQXFDO0FBQ25DLFFBQU0sRUFBRSxJQUFGLEVBQVEsTUFBUixFQUFnQixFQUFoQixFQUFvQixjQUFwQixLQUF1QyxRQUE3QztBQUNBLFFBQU0sV0FBVyxDQUFDLFlBQUQsR0FBZSxJQUFmLEVBQW9CLGtCQUFwQixHQUF3QyxNQUF4QyxFQUErQyxDQUEvQyxHQUFrRCxFQUFsRCxFQUFxRCxDQUFyRCxHQUF3RCxjQUF4RCxFQUF1RSxNQUF2RSxDQUFqQjtBQUNBLFNBQU8sUUFBUDtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoaW1hZ2VEYXRhKSA9PiB7XG5cbiAgLy8gRGVjbGFyZSBjbG9zdXJlLXNjb3BlZCB2YXJpYWJsZXNcbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgIC8vIFNldCB0aGUgY3VycmVudEluZGV4IHRvIGEgcmFuZG9tIHBvc2l0aW9uIGluIHRoZSBpbWFnZXMgYXJyYXlcbiAgICBjdXJyZW50SW5kZXg6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGltYWdlRGF0YS5sZW5ndGgpLFxuICB9XG5cbiAgLy8gTWFwIHRoZSBpbWFnZVVybHMgdG8gaW1hZ2Ugb2JqZWN0cywgd2l0aCBJbWFnZSBkYXRhIGhvbGRlcnNcbiAgbGV0IGltYWdlcyA9IGltYWdlRGF0YS5tYXAoKHsgdXJsLCB0aXRsZSB9KSA9PiAoe1xuICAgIHVybCxcbiAgICB0aXRsZSxcbiAgICBkYXRhOiBuZXcgSW1hZ2UoKSxcbiAgICBsb2FkZWQ6IDAsXG4gIH0pKVxuXG4gIC8vIERlZmluZSB0aGUgRE9NIEVsZW1lbnQgdGFyZ2V0c1xuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm94bGlnaHQnKVxuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aXRsZScpXG4gIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkZXInKVxuXG4gIGxvYWRJbml0aWFsSW1hZ2UoKVxuXG4gIC8vIFJldHVybiBhbiBvYmplY3Qgd2l0aCBleHBvc2VkIG1ldGhvZHNcbiAgcmV0dXJuIHtcbiAgICBwcmV2LFxuICAgIG5leHQsXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEludGVybmFsIG1ldGhvZHNcblxuICAvLyBTZXQgbG9hZGluZyBzdGF0ZSBhbmQgaGlkZSB0aGUgbG9hZGVyIGVsZW1lbnRcbiAgZnVuY3Rpb24gc2V0TG9hZGluZ1N0YXRlKGlzTG9hZGluZykge1xuICAgIHN0YXRlLmlzTG9hZGluZyA9IGlzTG9hZGluZ1xuICAgIGxvYWRlci5zdHlsZS5vcGFjaXR5ID0gaXNMb2FkaW5nID8gMSA6IDBcbiAgfVxuXG4gIC8vIERpc3BsYXkgYW4gaW1hZ2UgYnkgc2V0dGluZyBpdCBhcyB0aGUgdGFyZ2V0J3MgYmFja2dyb3VuZFxuICBmdW5jdGlvbiBzaG93SW1hZ2UoaW1hZ2UpIHtcbiAgICB0YXJnZXQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2ltYWdlLnNyY30pYFxuICAgIHRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMVxuICAgIHRpdGxlLmlubmVySFRNTCA9IGltYWdlLnRpdGxlXG4gIH1cblxuICAvLyBDb250cm9sc1xuICBmdW5jdGlvbiBwcmV2KCkge1xuICAgIGNvbnN0IHByZXZJbmRleCA9IGdldFByZXZJbmRleChzdGF0ZS5jdXJyZW50SW5kZXgpXG4gICAgZ29Ub0ltYWdlKHByZXZJbmRleClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gZ2V0TmV4dEluZGV4KHN0YXRlLmN1cnJlbnRJbmRleClcbiAgICBnb1RvSW1hZ2UobmV4dEluZGV4KVxuICB9XG5cbiAgLy8gTmF2aWdhdGUgdG8gYSBzcGVjaWZpYyBpbWFnZVxuICBmdW5jdGlvbiBnb1RvSW1hZ2UoaW5kZXgpIHtcbiAgICAvLyBEaXNhYmxlIHNraXBwaW5nIGFoZWFkIHBhc3QgYSBsb2FkaW5nIGltYWdlLCBmb3Igc2ltcGxpY2l0eSdzIHNha2VcbiAgICBpZiAoc3RhdGUuaXNMb2FkaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBpbWFnZSA9IGltYWdlc1tpbmRleF1cbiAgICAvLyBJbiBjYXNlIHRoZSBpbWFnZSBkYXRhIGlzIGFscmVhZHkgbG9hZGVkLCBzaW1wbHkgc2V0IHRoZSBpbWFnZVNvdXJjZVxuICAgIGlmIChpbWFnZS5sb2FkZWQpIHtcbiAgICAgIHN0YXRlLmN1cnJlbnRJbmRleCA9IGluZGV4XG4gICAgICByZXR1cm4gc2hvd0ltYWdlKGltYWdlKVxuICAgIH1cblxuICAgIHNldExvYWRpbmdTdGF0ZSh0cnVlKVxuICAgIGxvYWRJbWFnZURhdGEoaW5kZXgpLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgc3RhdGUuY3VycmVudEluZGV4ID0gaW5kZXhcbiAgICAgIHNldExvYWRpbmdTdGF0ZShmYWxzZSlcbiAgICAgIHNob3dJbWFnZShpbWFnZSlcbiAgICB9KVxuICB9XG5cbiAgLy8gTG9hZCBpbWFnZSBkYXRhXG4gIGZ1bmN0aW9uIGxvYWRJbWFnZURhdGEoaW5kZXgsIHNob3VsZExvYWROZWlnaGJvcnMgPSB0cnVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY29uc3QgaW1hZ2UgPSBpbWFnZXNbaW5kZXhdXG4gICAgICBpZiAoaW1hZ2UubG9hZGVkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKGltYWdlKVxuICAgICAgfVxuXG4gICAgICAvLyBTZXQgdGhlIHNvdXJjZSB0byB0aGUgdXJsLCBiZWdpbm5pbmcgdGhlIGxvYWRcbiAgICAgIGltYWdlLmRhdGEuc3JjID0gaW1hZ2UudXJsXG4gICAgICBpbWFnZS5kYXRhLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpbWFnZS5sb2FkZWQgPSB0cnVlXG4gICAgICAgIGltYWdlLnNyYyA9IHRoaXMuc3JjXG4gICAgICAgIHJlc29sdmUoaW1hZ2UpXG4gICAgICB9XG5cbiAgICAgIC8vIE9wdGltaXN0aWNhbGx5IGxvYWQgdGhlIG5leHQgYW5kIHByZXZpb3VzIGltYWdlcyBpbiB0aGUgc2V0XG4gICAgICBpZiAoc2hvdWxkTG9hZE5laWdoYm9ycykge1xuICAgICAgICBsb2FkTmVpZ2hib3JzKGluZGV4KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBPcHRpbWlzdGljYWxseSBsb2FkIHRoZSBwcmV2aW91cyBhbmQgbmV4dCBpbWFnZVxuICBmdW5jdGlvbiBsb2FkTmVpZ2hib3JzKGluZGV4KSB7XG4gICAgY29uc3QgcHJldkluZGV4ID0gZ2V0UHJldkluZGV4KGluZGV4KVxuICAgIGNvbnN0IG5leHRJbmRleCA9IGdldE5leHRJbmRleChpbmRleClcblxuICAgIGxvYWRJbWFnZURhdGEocHJldkluZGV4LCBmYWxzZSlcbiAgICBsb2FkSW1hZ2VEYXRhKG5leHRJbmRleCwgZmFsc2UpXG4gIH1cblxuICBmdW5jdGlvbiBsb2FkSW5pdGlhbEltYWdlKCkge1xuICAgIGxvYWRJbWFnZURhdGEoc3RhdGUuY3VycmVudEluZGV4KS50aGVuKGltYWdlID0+IHtcbiAgICAgIHNldExvYWRpbmdTdGF0ZShmYWxzZSlcbiAgICAgIHNob3dJbWFnZShpbWFnZSlcbiAgICB9KVxuICB9XG5cbiAgLy8gSGVscGVyIG1ldGhvZHNcbiAgZnVuY3Rpb24gZ2V0UHJldkluZGV4KGluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4ID09PSAwID8gaW1hZ2VzLmxlbmd0aCAtIDEgOiBpbmRleCAtIDFcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5leHRJbmRleChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCA9PT0gaW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogaW5kZXggKyAxXG4gIH1cbn1cbiIsImNvbnN0IHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKVxuY29uc3QgaW5pdGlhbGl6ZUJveGxpZ2h0ID0gcmVxdWlyZSgnLi9ib3hsaWdodCcpXG5cbmNvbnN0IGFwaUtleSA9ICdiYzAxYzY0OWY5MmE5NjVkYjFmYjJkZjQ4ZmJkNDIyNSdcbmNvbnN0IGdhbGxlcnlJZCA9ICc3MjE1NzY2OTAyNDQ2MzI5NSdcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICBsb2FkR2FsbGVyeShnYWxsZXJ5SWQpXG4gICAgLnRoZW4oaW1hZ2VEYXRhID0+IHtcbiAgICAgIGNvbnN0IGJveGxpZ2h0ID0gaW5pdGlhbGl6ZUJveGxpZ2h0KGltYWdlRGF0YSlcblxuICAgICAgLy8gU2V0IHVwIG91ciBuYXZpZ2F0aW9uIGxpbmtzXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJldicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYm94bGlnaHQucHJldilcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBib3hsaWdodC5uZXh0KVxuICAgIH0pXG59KVxuXG5mdW5jdGlvbiBsb2FkR2FsbGVyeShnYWxsZXJ5SWQpIHtcbiAgY29uc3QgYmFzZVVybCA9ICdodHRwczovL2FwaS5mbGlja3IuY29tL3NlcnZpY2VzL3Jlc3QnXG4gIGNvbnN0IHF1ZXJ5UGFyYW1zID0ge1xuICAgIG1ldGhvZDogJ2ZsaWNrci5nYWxsZXJpZXMuZ2V0UGhvdG9zJyxcbiAgICBnYWxsZXJ5X2lkOiBnYWxsZXJ5SWQsXG4gICAgYXBpX2tleTogYXBpS2V5LFxuICAgIGZvcm1hdDogJ2pzb24nLFxuICAgIG5vanNvbmNhbGxiYWNrOiAxLFxuICAgIGV4dHJhczogJ29yaWdpbmFsX2Zvcm1hdCcsXG4gIH1cblxuICBjb25zdCB1cmwgPSBgJHtiYXNlVXJsfS8/JHtxdWVyeXN0cmluZy5zdHJpbmdpZnkocXVlcnlQYXJhbXMpfWBcblxuICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbihkYXRhID0+IHtcbiAgICAgIGNvbnN0IHBob3RvcyA9IGRhdGEucGhvdG9zXG4gICAgICBjb25zdCBpbWFnZURhdGEgPSBwaG90b3MucGhvdG8ubWFwKGltYWdlT2JqID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1cmw6IGNvbnN0cnVjdEltYWdlVXJsKGltYWdlT2JqKSxcbiAgICAgICAgICB0aXRsZTogaW1hZ2VPYmoudGl0bGUsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gaW1hZ2VEYXRhXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SW1hZ2VVcmwoaW1hZ2VPYmopIHtcbiAgY29uc3QgeyBmYXJtLCBzZXJ2ZXIsIGlkLCBvcmlnaW5hbHNlY3JldCB9ID0gaW1hZ2VPYmpcbiAgY29uc3QgaW1hZ2VVcmwgPSBgaHR0cHM6Ly9mYXJtJHtmYXJtfS5zdGF0aWNmbGlja3IuY29tLyR7c2VydmVyfS8ke2lkfV8ke29yaWdpbmFsc2VjcmV0fV9vLmpwZ2BcbiAgcmV0dXJuIGltYWdlVXJsXG59XG4iXX0=
