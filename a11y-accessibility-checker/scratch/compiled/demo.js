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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/demo/ts/Demo.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/demo/ts/Demo.ts":
/*!*****************************!*\
  !*** ./src/demo/ts/Demo.ts ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_ts_Plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../main/ts/Plugin */ "./src/main/ts/Plugin.ts");

Object(_main_ts_Plugin__WEBPACK_IMPORTED_MODULE_0__["default"])();
tinymce.init({
    selector: 'textarea.tinymce',
    plugins: 'code a11y-accessibility-checker',
    toolbar: 'a11y-accessibility-checker'
});


/***/ }),

/***/ "./src/main/ts/Plugin.ts":
/*!*******************************!*\
  !*** ./src/main/ts/Plugin.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var setup = function (editor) {
    editor.ui.registry.addButton('a11y-accessibility-checker', {
        text: 'Accessibility Checker',
        onAction: function () {
            var content = editor.getContent();
            // Open the initial checking dialog
            var dialog = editor.windowManager.open({
                title: 'Accessibility Checker',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'htmlpanel',
                            html: '<p id="a11y-status">Checking...</p>'
                        }
                    ]
                },
                buttons: [],
                onClose: function () { }
            });
            fetch('/check-accessibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ html: content })
            })
                .then(function (response) {
                if (response.ok) {
                    return response.blob();
                }
                else {
                    return response.text().then(function (error) { throw new Error(error); });
                }
            })
                .then(function (blob) {
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'report.xslx';
                a.click();
                URL.revokeObjectURL(url);
                // Update the dialog content
                dialog.redial({
                    title: 'Accessibility Checker',
                    body: {
                        type: 'panel',
                        items: [
                            {
                                type: 'htmlpanel',
                                html: '<p id="a11y-status">Download ready</p>'
                            }
                        ]
                    },
                    buttons: [
                        {
                            type: 'cancel',
                            text: 'Close',
                            primary: true
                        }
                    ]
                });
            })
                .catch(function (error) {
                // Update the dialog content in case of error
                dialog.redial({
                    title: 'Accessibility Checker',
                    body: {
                        type: 'panel',
                        items: [
                            {
                                type: 'htmlpanel',
                                html: "<p id=\"a11y-status\">Error: ".concat(error.message, "</p>")
                            }
                        ]
                    },
                    buttons: [
                        {
                            type: 'cancel',
                            text: 'Close',
                            primary: true
                        }
                    ]
                });
            });
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (function () {
    tinymce.PluginManager.add('a11y-accessibility-checker', setup);
});


/***/ })

/******/ });
//# sourceMappingURL=demo.js.map