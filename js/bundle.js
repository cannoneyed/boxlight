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
'use strict';

module.exports = function (imageData) {

  // Declare closure-scoped variables
  var state = {
    isLoading: true,
    // Set the currentIndex to a random position in the images array
    currentIndex: Math.floor(Math.random() * imageData.length)
  };

  // Map the imageUrls to image objects, with Image data holders
  var images = imageData.map(function (_ref) {
    var url = _ref.url;
    var title = _ref.title;
    return {
      url: url,
      title: title,
      data: new Image(),
      loaded: 0
    };
  });

  // Define the DOM Element targets
  var target = document.getElementById('boxlight');
  var title = document.getElementById('title');
  var loader = document.getElementById('loader');

  loadInitialImage();

  // Return an object with exposed methods
  return {
    prev: prev,
    next: next
  };

  // ------------------------------------- Internal methods

  // Set loading state and hide the loader element
  function setLoadingState(isLoading) {
    state.isLoading = isLoading;
    loader.style.opacity = isLoading ? 1 : 0;
  }

  // Display an image by setting it as the target's background
  function showImage(image) {
    target.style.backgroundImage = 'url(' + image.src + ')';
    target.style.opacity = 1;
    title.innerHTML = image.title;
  }

  // Controls
  function prev() {
    var prevIndex = getPrevIndex(state.currentIndex);
    goToImage(prevIndex);
  }

  function next() {
    var nextIndex = getNextIndex(state.currentIndex);
    goToImage(nextIndex);
  }

  // Navigate to a specific image
  function goToImage(index) {
    // Disable skipping ahead past a loading image, for simplicity's sake
    if (state.isLoading) {
      return;
    }

    var image = images[index];
    // In case the image data is already loaded, simply set the imageSource
    if (image.loaded) {
      state.currentIndex = index;
      return showImage(image);
    }

    setLoadingState(true);
    loadImageData(index).then(function (image) {
      state.currentIndex = index;
      setLoadingState(false);
      showImage(image);
    });
  }

  // Load image data
  function loadImageData(index) {
    var shouldLoadNeighbors = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return new Promise(function (resolve) {
      var image = images[index];
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
    var prevIndex = getPrevIndex(index);
    var nextIndex = getNextIndex(index);

    loadImageData(prevIndex, false);
    loadImageData(nextIndex, false);
  }

  function loadInitialImage() {
    loadImageData(state.currentIndex).then(function (image) {
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
'use strict';

var querystring = require('querystring');
var initializeBoxlight = require('./boxlight');

var apiKey = 'bc01c649f92a965db1fb2df48fbd4225';
var galleryId = '72157669024463295';

document.addEventListener('DOMContentLoaded', function () {
  loadGallery(galleryId).then(function (imageData) {
    var boxlight = initializeBoxlight(imageData);

    // Set up our navigation links
    document.getElementById('prev').addEventListener('click', boxlight.prev);
    document.getElementById('next').addEventListener('click', boxlight.next);
  });
});

function loadGallery(galleryId) {
  var baseUrl = 'https://api.flickr.com/services/rest';
  var queryParams = {
    method: 'flickr.galleries.getPhotos',
    gallery_id: galleryId,
    api_key: apiKey,
    format: 'json',
    nojsoncallback: 1,
    extras: 'original_format'
  };

  var url = baseUrl + '/?' + querystring.stringify(queryParams);

  return fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    var photos = data.photos;
    var imageData = photos.photo.map(function (imageObj) {
      return {
        url: constructImageUrl(imageObj),
        title: imageObj.title
      };
    });
    return imageData;
  });
}

function constructImageUrl(imageObj) {
  var farm = imageObj.farm;
  var server = imageObj.server;
  var id = imageObj.id;
  var originalsecret = imageObj.originalsecret;

  var imageUrl = 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + originalsecret + '_o.jpg';
  return imageUrl;
}

},{"./boxlight":4,"querystring":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsInNyYy9qcy9ib3hsaWdodC5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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b3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGltYWdlRGF0YSkgPT4ge1xuXG4gIC8vIERlY2xhcmUgY2xvc3VyZS1zY29wZWQgdmFyaWFibGVzXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAvLyBTZXQgdGhlIGN1cnJlbnRJbmRleCB0byBhIHJhbmRvbSBwb3NpdGlvbiBpbiB0aGUgaW1hZ2VzIGFycmF5XG4gICAgY3VycmVudEluZGV4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpbWFnZURhdGEubGVuZ3RoKSxcbiAgfVxuXG4gIC8vIE1hcCB0aGUgaW1hZ2VVcmxzIHRvIGltYWdlIG9iamVjdHMsIHdpdGggSW1hZ2UgZGF0YSBob2xkZXJzXG4gIGxldCBpbWFnZXMgPSBpbWFnZURhdGEubWFwKCh7IHVybCwgdGl0bGUgfSkgPT4gKHtcbiAgICB1cmwsXG4gICAgdGl0bGUsXG4gICAgZGF0YTogbmV3IEltYWdlKCksXG4gICAgbG9hZGVkOiAwLFxuICB9KSlcblxuICAvLyBEZWZpbmUgdGhlIERPTSBFbGVtZW50IHRhcmdldHNcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JveGxpZ2h0JylcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUnKVxuICBjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGVyJylcblxuICBsb2FkSW5pdGlhbEltYWdlKClcblxuICAvLyBSZXR1cm4gYW4gb2JqZWN0IHdpdGggZXhwb3NlZCBtZXRob2RzXG4gIHJldHVybiB7XG4gICAgcHJldixcbiAgICBuZXh0LFxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBJbnRlcm5hbCBtZXRob2RzXG5cbiAgLy8gU2V0IGxvYWRpbmcgc3RhdGUgYW5kIGhpZGUgdGhlIGxvYWRlciBlbGVtZW50XG4gIGZ1bmN0aW9uIHNldExvYWRpbmdTdGF0ZShpc0xvYWRpbmcpIHtcbiAgICBzdGF0ZS5pc0xvYWRpbmcgPSBpc0xvYWRpbmdcbiAgICBsb2FkZXIuc3R5bGUub3BhY2l0eSA9IGlzTG9hZGluZyA/IDEgOiAwXG4gIH1cblxuICAvLyBEaXNwbGF5IGFuIGltYWdlIGJ5IHNldHRpbmcgaXQgYXMgdGhlIHRhcmdldCdzIGJhY2tncm91bmRcbiAgZnVuY3Rpb24gc2hvd0ltYWdlKGltYWdlKSB7XG4gICAgdGFyZ2V0LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpbWFnZS5zcmN9KWBcbiAgICB0YXJnZXQuc3R5bGUub3BhY2l0eSA9IDFcbiAgICB0aXRsZS5pbm5lckhUTUwgPSBpbWFnZS50aXRsZVxuICB9XG5cbiAgLy8gQ29udHJvbHNcbiAgZnVuY3Rpb24gcHJldigpIHtcbiAgICBjb25zdCBwcmV2SW5kZXggPSBnZXRQcmV2SW5kZXgoc3RhdGUuY3VycmVudEluZGV4KVxuICAgIGdvVG9JbWFnZShwcmV2SW5kZXgpXG4gIH1cblxuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGNvbnN0IG5leHRJbmRleCA9IGdldE5leHRJbmRleChzdGF0ZS5jdXJyZW50SW5kZXgpXG4gICAgZ29Ub0ltYWdlKG5leHRJbmRleClcbiAgfVxuXG4gIC8vIE5hdmlnYXRlIHRvIGEgc3BlY2lmaWMgaW1hZ2VcbiAgZnVuY3Rpb24gZ29Ub0ltYWdlKGluZGV4KSB7XG4gICAgLy8gRGlzYWJsZSBza2lwcGluZyBhaGVhZCBwYXN0IGEgbG9hZGluZyBpbWFnZSwgZm9yIHNpbXBsaWNpdHkncyBzYWtlXG4gICAgaWYgKHN0YXRlLmlzTG9hZGluZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgaW1hZ2UgPSBpbWFnZXNbaW5kZXhdXG4gICAgLy8gSW4gY2FzZSB0aGUgaW1hZ2UgZGF0YSBpcyBhbHJlYWR5IGxvYWRlZCwgc2ltcGx5IHNldCB0aGUgaW1hZ2VTb3VyY2VcbiAgICBpZiAoaW1hZ2UubG9hZGVkKSB7XG4gICAgICBzdGF0ZS5jdXJyZW50SW5kZXggPSBpbmRleFxuICAgICAgcmV0dXJuIHNob3dJbWFnZShpbWFnZSlcbiAgICB9XG5cbiAgICBzZXRMb2FkaW5nU3RhdGUodHJ1ZSlcbiAgICBsb2FkSW1hZ2VEYXRhKGluZGV4KS50aGVuKGltYWdlID0+IHtcbiAgICAgIHN0YXRlLmN1cnJlbnRJbmRleCA9IGluZGV4XG4gICAgICBzZXRMb2FkaW5nU3RhdGUoZmFsc2UpXG4gICAgICBzaG93SW1hZ2UoaW1hZ2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIExvYWQgaW1hZ2UgZGF0YVxuICBmdW5jdGlvbiBsb2FkSW1hZ2VEYXRhKGluZGV4LCBzaG91bGRMb2FkTmVpZ2hib3JzID0gdHJ1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGltYWdlID0gaW1hZ2VzW2luZGV4XVxuICAgICAgaWYgKGltYWdlLmxvYWRlZCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShpbWFnZSlcbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSBzb3VyY2UgdG8gdGhlIHVybCwgYmVnaW5uaW5nIHRoZSBsb2FkXG4gICAgICBpbWFnZS5kYXRhLnNyYyA9IGltYWdlLnVybFxuICAgICAgaW1hZ2UuZGF0YS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaW1hZ2UubG9hZGVkID0gdHJ1ZVxuICAgICAgICBpbWFnZS5zcmMgPSB0aGlzLnNyY1xuICAgICAgICByZXNvbHZlKGltYWdlKVxuICAgICAgfVxuXG4gICAgICAvLyBPcHRpbWlzdGljYWxseSBsb2FkIHRoZSBuZXh0IGFuZCBwcmV2aW91cyBpbWFnZXMgaW4gdGhlIHNldFxuICAgICAgaWYgKHNob3VsZExvYWROZWlnaGJvcnMpIHtcbiAgICAgICAgbG9hZE5laWdoYm9ycyhpbmRleClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gT3B0aW1pc3RpY2FsbHkgbG9hZCB0aGUgcHJldmlvdXMgYW5kIG5leHQgaW1hZ2VcbiAgZnVuY3Rpb24gbG9hZE5laWdoYm9ycyhpbmRleCkge1xuICAgIGNvbnN0IHByZXZJbmRleCA9IGdldFByZXZJbmRleChpbmRleClcbiAgICBjb25zdCBuZXh0SW5kZXggPSBnZXROZXh0SW5kZXgoaW5kZXgpXG5cbiAgICBsb2FkSW1hZ2VEYXRhKHByZXZJbmRleCwgZmFsc2UpXG4gICAgbG9hZEltYWdlRGF0YShuZXh0SW5kZXgsIGZhbHNlKVxuICB9XG5cbiAgZnVuY3Rpb24gbG9hZEluaXRpYWxJbWFnZSgpIHtcbiAgICBsb2FkSW1hZ2VEYXRhKHN0YXRlLmN1cnJlbnRJbmRleCkudGhlbihpbWFnZSA9PiB7XG4gICAgICBzZXRMb2FkaW5nU3RhdGUoZmFsc2UpXG4gICAgICBzaG93SW1hZ2UoaW1hZ2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIEhlbHBlciBtZXRob2RzXG4gIGZ1bmN0aW9uIGdldFByZXZJbmRleChpbmRleCkge1xuICAgIHJldHVybiBpbmRleCA9PT0gMCA/IGltYWdlcy5sZW5ndGggLSAxIDogaW5kZXggLSAxXG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXh0SW5kZXgoaW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggPT09IGltYWdlcy5sZW5ndGggLSAxID8gMCA6IGluZGV4ICsgMVxuICB9XG59XG4iLCJjb25zdCBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJylcbmNvbnN0IGluaXRpYWxpemVCb3hsaWdodCA9IHJlcXVpcmUoJy4vYm94bGlnaHQnKVxuXG5jb25zdCBhcGlLZXkgPSAnYmMwMWM2NDlmOTJhOTY1ZGIxZmIyZGY0OGZiZDQyMjUnXG5jb25zdCBnYWxsZXJ5SWQgPSAnNzIxNTc2NjkwMjQ0NjMyOTUnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgbG9hZEdhbGxlcnkoZ2FsbGVyeUlkKVxuICAgIC50aGVuKGltYWdlRGF0YSA9PiB7XG4gICAgICBjb25zdCBib3hsaWdodCA9IGluaXRpYWxpemVCb3hsaWdodChpbWFnZURhdGEpXG5cbiAgICAgIC8vIFNldCB1cCBvdXIgbmF2aWdhdGlvbiBsaW5rc1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXYnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGJveGxpZ2h0LnByZXYpXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYm94bGlnaHQubmV4dClcbiAgICB9KVxufSlcblxuZnVuY3Rpb24gbG9hZEdhbGxlcnkoZ2FsbGVyeUlkKSB7XG4gIGNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9hcGkuZmxpY2tyLmNvbS9zZXJ2aWNlcy9yZXN0J1xuICBjb25zdCBxdWVyeVBhcmFtcyA9IHtcbiAgICBtZXRob2Q6ICdmbGlja3IuZ2FsbGVyaWVzLmdldFBob3RvcycsXG4gICAgZ2FsbGVyeV9pZDogZ2FsbGVyeUlkLFxuICAgIGFwaV9rZXk6IGFwaUtleSxcbiAgICBmb3JtYXQ6ICdqc29uJyxcbiAgICBub2pzb25jYWxsYmFjazogMSxcbiAgICBleHRyYXM6ICdvcmlnaW5hbF9mb3JtYXQnLFxuICB9XG5cbiAgY29uc3QgdXJsID0gYCR7YmFzZVVybH0vPyR7cXVlcnlzdHJpbmcuc3RyaW5naWZ5KHF1ZXJ5UGFyYW1zKX1gXG5cbiAgcmV0dXJuIGZldGNoKHVybClcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICBjb25zdCBwaG90b3MgPSBkYXRhLnBob3Rvc1xuICAgICAgY29uc3QgaW1hZ2VEYXRhID0gcGhvdG9zLnBob3RvLm1hcChpbWFnZU9iaiA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXJsOiBjb25zdHJ1Y3RJbWFnZVVybChpbWFnZU9iaiksXG4gICAgICAgICAgdGl0bGU6IGltYWdlT2JqLnRpdGxlLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGltYWdlRGF0YVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdEltYWdlVXJsKGltYWdlT2JqKSB7XG4gIGNvbnN0IHsgZmFybSwgc2VydmVyLCBpZCwgb3JpZ2luYWxzZWNyZXQgfSA9IGltYWdlT2JqXG4gIGNvbnN0IGltYWdlVXJsID0gYGh0dHBzOi8vZmFybSR7ZmFybX0uc3RhdGljZmxpY2tyLmNvbS8ke3NlcnZlcn0vJHtpZH1fJHtvcmlnaW5hbHNlY3JldH1fby5qcGdgXG4gIHJldHVybiBpbWFnZVVybFxufVxuIl19
