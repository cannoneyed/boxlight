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

  // Internal methods
  function setLoadingState(isLoading) {
    state.isLoading = isLoading;
    loader.style.opacity = isLoading ? 1 : 0;
  }

  function showImage(image) {
    target.style.backgroundImage = `url(${ image.src })`;
    target.style.opacity = 1;
    title.innerHTML = image.title;
  }

  function prev() {
    const prevIndex = getPrevIndex(state.currentIndex);
    goToImage(prevIndex);
  }

  function next() {
    const nextIndex = getNextIndex(state.currentIndex);
    goToImage(nextIndex);
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsInNyYy9qcy9ib3hsaWdodC5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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OlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGltYWdlRGF0YSkgPT4ge1xuICAvLyBEZWNsYXJlIGNsb3N1cmUtc2NvcGVkIHZhcmlhYmxlc1xuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgLy8gU2V0IHRoZSBjdXJyZW50SW5kZXggdG8gYSByYW5kb20gcG9zaXRpb24gaW4gdGhlIGltYWdlcyBhcnJheVxuICAgIGN1cnJlbnRJbmRleDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaW1hZ2VEYXRhLmxlbmd0aCksXG4gIH1cblxuICAvLyBNYXAgdGhlIGltYWdlVXJscyB0byBpbWFnZSBvYmplY3RzLCB3aXRoIEltYWdlIGRhdGEgaG9sZGVyc1xuICBsZXQgaW1hZ2VzID0gaW1hZ2VEYXRhLm1hcCgoeyB1cmwsIHRpdGxlIH0pID0+ICh7XG4gICAgdXJsLFxuICAgIHRpdGxlLFxuICAgIGRhdGE6IG5ldyBJbWFnZSgpLFxuICAgIGxvYWRlZDogMCxcbiAgfSkpXG5cbiAgLy8gRGVmaW5lIHRoZSBET00gRWxlbWVudCB0YXJnZXRzXG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib3hsaWdodCcpXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpdGxlJylcbiAgY29uc3QgbG9hZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRlcicpXG5cbiAgbG9hZEluaXRpYWxJbWFnZSgpXG5cbiAgLy8gUmV0dXJuIGFuIG9iamVjdCB3aXRoIGV4cG9zZWQgbWV0aG9kc1xuICByZXR1cm4ge1xuICAgIHByZXYsXG4gICAgbmV4dCxcbiAgfVxuXG4gIC8vIEludGVybmFsIG1ldGhvZHNcbiAgZnVuY3Rpb24gc2V0TG9hZGluZ1N0YXRlKGlzTG9hZGluZykge1xuICAgIHN0YXRlLmlzTG9hZGluZyA9IGlzTG9hZGluZ1xuICAgIGxvYWRlci5zdHlsZS5vcGFjaXR5ID0gaXNMb2FkaW5nID8gMSA6IDBcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dJbWFnZShpbWFnZSkge1xuICAgIHRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1hZ2Uuc3JjfSlgXG4gICAgdGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxXG4gICAgdGl0bGUuaW5uZXJIVE1MID0gaW1hZ2UudGl0bGVcbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXYoKSB7XG4gICAgY29uc3QgcHJldkluZGV4ID0gZ2V0UHJldkluZGV4KHN0YXRlLmN1cnJlbnRJbmRleClcbiAgICBnb1RvSW1hZ2UocHJldkluZGV4KVxuICB9XG5cbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjb25zdCBuZXh0SW5kZXggPSBnZXROZXh0SW5kZXgoc3RhdGUuY3VycmVudEluZGV4KVxuICAgIGdvVG9JbWFnZShuZXh0SW5kZXgpXG4gIH1cblxuICBmdW5jdGlvbiBnb1RvSW1hZ2UoaW5kZXgpIHtcbiAgICAvLyBEaXNhYmxlIHNraXBwaW5nIGFoZWFkIHBhc3QgYSBsb2FkaW5nIGltYWdlLCBmb3Igc2ltcGxpY2l0eSdzIHNha2VcbiAgICBpZiAoc3RhdGUuaXNMb2FkaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBpbWFnZSA9IGltYWdlc1tpbmRleF1cbiAgICAvLyBJbiBjYXNlIHRoZSBpbWFnZSBkYXRhIGlzIGFscmVhZHkgbG9hZGVkLCBzaW1wbHkgc2V0IHRoZSBpbWFnZVNvdXJjZVxuICAgIGlmIChpbWFnZS5sb2FkZWQpIHtcbiAgICAgIHN0YXRlLmN1cnJlbnRJbmRleCA9IGluZGV4XG4gICAgICByZXR1cm4gc2hvd0ltYWdlKGltYWdlKVxuICAgIH1cblxuICAgIHNldExvYWRpbmdTdGF0ZSh0cnVlKVxuICAgIGxvYWRJbWFnZURhdGEoaW5kZXgpLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgc3RhdGUuY3VycmVudEluZGV4ID0gaW5kZXhcbiAgICAgIHNldExvYWRpbmdTdGF0ZShmYWxzZSlcbiAgICAgIHNob3dJbWFnZShpbWFnZSlcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gbG9hZEltYWdlRGF0YShpbmRleCwgc2hvdWxkTG9hZE5laWdoYm9ycyA9IHRydWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjb25zdCBpbWFnZSA9IGltYWdlc1tpbmRleF1cbiAgICAgIGlmIChpbWFnZS5sb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoaW1hZ2UpXG4gICAgICB9XG5cbiAgICAgIC8vIFNldCB0aGUgc291cmNlIHRvIHRoZSB1cmwsIGJlZ2lubmluZyB0aGUgbG9hZFxuICAgICAgaW1hZ2UuZGF0YS5zcmMgPSBpbWFnZS51cmxcbiAgICAgIGltYWdlLmRhdGEub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGltYWdlLmxvYWRlZCA9IHRydWVcbiAgICAgICAgaW1hZ2Uuc3JjID0gdGhpcy5zcmNcbiAgICAgICAgcmVzb2x2ZShpbWFnZSlcbiAgICAgIH1cblxuICAgICAgLy8gT3B0aW1pc3RpY2FsbHkgbG9hZCB0aGUgbmV4dCBhbmQgcHJldmlvdXMgaW1hZ2VzIGluIHRoZSBzZXRcbiAgICAgIGlmIChzaG91bGRMb2FkTmVpZ2hib3JzKSB7XG4gICAgICAgIGxvYWROZWlnaGJvcnMoaW5kZXgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWROZWlnaGJvcnMoaW5kZXgpIHtcbiAgICBjb25zdCBwcmV2SW5kZXggPSBnZXRQcmV2SW5kZXgoaW5kZXgpXG4gICAgY29uc3QgbmV4dEluZGV4ID0gZ2V0TmV4dEluZGV4KGluZGV4KVxuXG4gICAgbG9hZEltYWdlRGF0YShwcmV2SW5kZXgsIGZhbHNlKVxuICAgIGxvYWRJbWFnZURhdGEobmV4dEluZGV4LCBmYWxzZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWRJbml0aWFsSW1hZ2UoKSB7XG4gICAgbG9hZEltYWdlRGF0YShzdGF0ZS5jdXJyZW50SW5kZXgpLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgc2V0TG9hZGluZ1N0YXRlKGZhbHNlKVxuICAgICAgc2hvd0ltYWdlKGltYWdlKVxuICAgIH0pXG4gIH1cblxuICAvLyBIZWxwZXIgbWV0aG9kc1xuICBmdW5jdGlvbiBnZXRQcmV2SW5kZXgoaW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggPT09IDAgPyBpbWFnZXMubGVuZ3RoIC0gMSA6IGluZGV4IC0gMVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TmV4dEluZGV4KGluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4ID09PSBpbWFnZXMubGVuZ3RoIC0gMSA/IDAgOiBpbmRleCArIDFcbiAgfVxufVxuIiwiY29uc3QgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpXG5jb25zdCBpbml0aWFsaXplQm94bGlnaHQgPSByZXF1aXJlKCcuL2JveGxpZ2h0JylcblxuY29uc3QgYXBpS2V5ID0gJ2JjMDFjNjQ5ZjkyYTk2NWRiMWZiMmRmNDhmYmQ0MjI1J1xuY29uc3QgZ2FsbGVyeUlkID0gJzcyMTU3NjY5MDI0NDYzMjk1J1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gIGxvYWRHYWxsZXJ5KGdhbGxlcnlJZClcbiAgICAudGhlbihpbWFnZURhdGEgPT4ge1xuICAgICAgY29uc3QgYm94bGlnaHQgPSBpbml0aWFsaXplQm94bGlnaHQoaW1hZ2VEYXRhKVxuXG4gICAgICAvLyBTZXQgdXAgb3VyIG5hdmlnYXRpb24gbGlua3NcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmV2JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBib3hsaWdodC5wcmV2KVxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJveGxpZ2h0Lm5leHQpXG4gICAgfSlcbn0pXG5cbmZ1bmN0aW9uIGxvYWRHYWxsZXJ5KGdhbGxlcnlJZCkge1xuICBjb25zdCBiYXNlVXJsID0gJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdCdcbiAgY29uc3QgcXVlcnlQYXJhbXMgPSB7XG4gICAgbWV0aG9kOiAnZmxpY2tyLmdhbGxlcmllcy5nZXRQaG90b3MnLFxuICAgIGdhbGxlcnlfaWQ6IGdhbGxlcnlJZCxcbiAgICBhcGlfa2V5OiBhcGlLZXksXG4gICAgZm9ybWF0OiAnanNvbicsXG4gICAgbm9qc29uY2FsbGJhY2s6IDEsXG4gICAgZXh0cmFzOiAnb3JpZ2luYWxfZm9ybWF0JyxcbiAgfVxuXG4gIGNvbnN0IHVybCA9IGAke2Jhc2VVcmx9Lz8ke3F1ZXJ5c3RyaW5nLnN0cmluZ2lmeShxdWVyeVBhcmFtcyl9YFxuXG4gIHJldHVybiBmZXRjaCh1cmwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgY29uc3QgcGhvdG9zID0gZGF0YS5waG90b3NcbiAgICAgIGNvbnN0IGltYWdlRGF0YSA9IHBob3Rvcy5waG90by5tYXAoaW1hZ2VPYmogPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVybDogY29uc3RydWN0SW1hZ2VVcmwoaW1hZ2VPYmopLFxuICAgICAgICAgIHRpdGxlOiBpbWFnZU9iai50aXRsZSxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbWFnZURhdGFcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RJbWFnZVVybChpbWFnZU9iaikge1xuICBjb25zdCB7IGZhcm0sIHNlcnZlciwgaWQsIG9yaWdpbmFsc2VjcmV0IH0gPSBpbWFnZU9ialxuICBjb25zdCBpbWFnZVVybCA9IGBodHRwczovL2Zhcm0ke2Zhcm19LnN0YXRpY2ZsaWNrci5jb20vJHtzZXJ2ZXJ9LyR7aWR9XyR7b3JpZ2luYWxzZWNyZXR9X28uanBnYFxuICByZXR1cm4gaW1hZ2VVcmxcbn1cbiJdfQ==
