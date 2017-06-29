/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getFile(id) {
  return document.getElementById(id).files[0];
}

function onFileInputChange(changeEvent) {
  toggleSubmit();

  var reader = new FileReader();

  reader.onload = function (e) {
    var gif = document.createElement('img');
    gif.classList.add('gif-preview');
    gif.src = e.target.result;

    changeEvent.target.parentNode.append(gif);
  };

  reader.readAsDataURL(changeEvent.target.files[0]);
}

function toggleSubmit() {
  var backgroundFile = getFile('background');
  var foregroundFile = getFile('foreground');

  document.getElementById('merge-button').disabled = !(backgroundFile && foregroundFile);
}

window.onload = function () {
  document.getElementById('background').onchange = onFileInputChange;
  document.getElementById('foreground').onchange = onFileInputChange;

  document.getElementById('merge-button').addEventListener('click', function () {
    var backgroundFile = getFile('background');
    var foregroundFile = getFile('foreground');
    var replaceColor = document.getElementById('replace-color').value;

    var formData = new FormData();
    formData.append("background", backgroundFile);
    formData.append("foreground", foregroundFile);
    formData.append("color", replaceColor);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        var blob = xhr.response;
        var b64Response = btoa(String.fromCharCode.apply(null, new Uint8Array(blob)));

        var gif = document.createElement('img');
        gif.src = 'data:image/gif;base64,' + b64Response;
        document.body.appendChild(gif);
      }
    };

    xhr.open('POST', 'http://localhost:3000/api/v1/merge_gifs/', true);
    xhr.withCredentials = true;
    xhr.responseType = 'arraybuffer';
    xhr.send(formData);
  });
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map