"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/login",{

/***/ "./_client/pages/login.jsx":
/*!*********************************!*\
  !*** ./_client/pages/login.jsx ***!
  \*********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Login; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ \"./node_modules/next/head.js\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nvar _s = $RefreshSig$();\nfunction Login(param) {\n    var data1 = param.data;\n    _s();\n    var Nulled = function(v) {\n        return typeof v === \"undefined\" ? true : v === null ? true : v.length === 0;\n    };\n    var El = function(id) {\n        return document.getElementById(id);\n    };\n    var ref = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false), running = ref[0], setRunning = ref[1];\n    // On Window Load\n    if (true) {\n        jquery__WEBPACK_IMPORTED_MODULE_4___default()(window).on(\"load\", function() {\n            if (Nulled(data1.haveAlert)) return;\n            else if (data1.haveAlert) {\n                alert(data1.message);\n                next_router__WEBPACK_IMPORTED_MODULE_3___default().push({}, \"/login\", {\n                    shallow: true\n                });\n            }\n        });\n    }\n    var login = function(e) {\n        e.preventDefault();\n        if (!running) {\n            setRunning(true);\n            // Check Inputs\n            if (Nulled(El(\"useremail\").value)) {\n                El(\"useremail\").setCustomValidity(\"\");\n                return El(\"useremail\").reportValidity();\n            }\n            if (Nulled(\"password\").value) {\n                El(\"password\").setCustomValidity(\"\");\n                return El(\"password\").reportValidity();\n            }\n            // Loading\n            jquery__WEBPACK_IMPORTED_MODULE_4___default()(\"#login\").children(\"p\").fadeTo(250, 0, \"swing\", function() {\n                jquery__WEBPACK_IMPORTED_MODULE_4___default()(\"#login\").children(\"p\").hide();\n                jquery__WEBPACK_IMPORTED_MODULE_4___default()(\"#login\").children(\"img\").show().fadeTo(250, 1, \"swing\", function() {\n                    // Send Request\n                    jquery__WEBPACK_IMPORTED_MODULE_4___default().ajax({\n                        type: \"POST\",\n                        url: \"/auth/login\",\n                        data: {\n                            useremail: El(\"useremail\").value,\n                            password: El(\"password\").value\n                        },\n                        success: function(data) {\n                            jquery__WEBPACK_IMPORTED_MODULE_4___default()(\"#login\").children(\"img\").fadeTo(250, 0, \"swing\", function() {\n                                jquery__WEBPACK_IMPORTED_MODULE_4___default()(\"#login\").children(\"img\").hide();\n                                jquery__WEBPACK_IMPORTED_MODULE_4___default()(\"#login\").children(\"p\").show().fadeTo(250, 1, \"swing\", function() {\n                                    if (data.valid) return next_router__WEBPACK_IMPORTED_MODULE_3___default().push(\"/home\", undefined, {\n                                        shallow: true\n                                    });\n                                    else {\n                                        if (data.message === \"Password is Incorrect\") {\n                                            El(\"password\").value = \"\";\n                                            El(\"password\").setCustomValidity(data.message);\n                                            El(\"password\").reportValidity();\n                                        } else if (data.message === \"Account is Not Registered\") {\n                                            El(\"useremail\").value = \"\";\n                                            El(\"password\").value = \"\";\n                                            El(\"useremail\").setCustomValidity(data.message);\n                                            El(\"useremail\").reportValidity();\n                                        }\n                                    }\n                                });\n                            });\n                            setRunning(false);\n                        }\n                    });\n                });\n            });\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_1___default()), {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                    children: \"Signin | GoForIt\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                    lineNumber: 79,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                lineNumber: 78,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"reg-log-bg\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"log-container\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"login-form\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                                className: \"cur-def\",\n                                children: \"Login\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                lineNumber: 84,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                                defaultValue: Nulled(data1.username) ? \"\" : data1.username,\n                                onKeyPress: function(e) {\n                                    e.key === \"Enter\" && login(e);\n                                },\n                                id: \"useremail\",\n                                placeholder: \"Username or Email\",\n                                maxLength: \"255\",\n                                type: \"text\",\n                                required: true\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                lineNumber: 85,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                                onKeyPress: function(e) {\n                                    e.key === \"Enter\" && login(e);\n                                },\n                                id: \"password\",\n                                placeholder: \"Password\",\n                                maxLength: \"255\",\n                                required: true,\n                                type: \"password\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                lineNumber: 86,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                                onClick: function(e) {\n                                    return login(e);\n                                },\n                                id: \"login\",\n                                className: \"cur-point\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                        children: \"Login\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                        lineNumber: 88,\n                                        columnNumber: 15\n                                    }, this),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                        className: \"none\",\n                                        style: {\n                                            opacity: \"0\",\n                                            width: \"0.9em\",\n                                            height: \"0.9em\"\n                                        },\n                                        src: \"/icons/loading.svg\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                        lineNumber: 89,\n                                        columnNumber: 15\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                lineNumber: 87,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n                                href: \"register\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h5\", {\n                                    className: \"cur-point\",\n                                    children: \"Don't have an account?\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                    lineNumber: 92,\n                                    columnNumber: 15\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                                lineNumber: 91,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                        lineNumber: 83,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                    lineNumber: 82,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rcdup\\\\Desktop\\\\CS\\\\JavaScript\\\\Node\\\\ToDoList-GoForIt\\\\_client\\\\pages\\\\login.jsx\",\n                lineNumber: 81,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n};\n_s(Login, \"Hdw5EO+DplCNBEJcNuH8tsP7WZ4=\");\n_c = Login;\nLogin.getInitialProps = function(param) {\n    var query = param.query;\n    var data = query;\n    return {\n        data: data\n    };\n};\nvar _c;\n$RefreshReg$(_c, \"Login\");\n\n\n;\r\n    // Wrapped in an IIFE to avoid polluting the global scope\r\n    ;\r\n    (function () {\r\n        var _a, _b;\r\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\r\n        // to extract CSS. For backwards compatibility, we need to check we're in a\r\n        // browser context before continuing.\r\n        if (typeof self !== 'undefined' &&\r\n            // AMP / No-JS mode does not inject these helpers:\r\n            '$RefreshHelpers$' in self) {\r\n            // @ts-ignore __webpack_module__ is global\r\n            var currentExports = module.exports;\r\n            // @ts-ignore __webpack_module__ is global\r\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\r\n            // This cannot happen in MainTemplate because the exports mismatch between\r\n            // templating and execution.\r\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\r\n            // A module can be accepted automatically based on its exports, e.g. when\r\n            // it is a Refresh Boundary.\r\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\r\n                // Save the previous exports on update so we can compare the boundary\r\n                // signatures.\r\n                module.hot.dispose(function (data) {\r\n                    data.prevExports = currentExports;\r\n                });\r\n                // Unconditionally accept an update to this module, we'll check if it's\r\n                // still a Refresh Boundary later.\r\n                // @ts-ignore importMeta is replaced in the loader\r\n                module.hot.accept();\r\n                // This field is set when the previous version of this module was a\r\n                // Refresh Boundary, letting us know we need to check for invalidation or\r\n                // enqueue an update.\r\n                if (prevExports !== null) {\r\n                    // A boundary can become ineligible if its exports are incompatible\r\n                    // with the previous exports.\r\n                    //\r\n                    // For example, if you add/remove/change exports, we'll want to\r\n                    // re-execute the importing modules, and force those components to\r\n                    // re-render. Similarly, if you convert a class component to a\r\n                    // function, we want to invalidate the boundary.\r\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\r\n                        module.hot.invalidate();\r\n                    }\r\n                    else {\r\n                        self.$RefreshHelpers$.scheduleUpdate();\r\n                    }\r\n                }\r\n            }\r\n            else {\r\n                // Since we just executed the code for the module, it's possible that the\r\n                // new exports made it ineligible for being a boundary.\r\n                // We only care about the case when we were _previously_ a boundary,\r\n                // because we already accepted this update (accidental side effect).\r\n                var isNoLongerABoundary = prevExports !== null;\r\n                if (isNoLongerABoundary) {\r\n                    module.hot.invalidate();\r\n                }\r\n            }\r\n        }\r\n    })();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFVO2dDQUFDdUMsV0FBVyxFQUFDLFVBQVU7Z0NBQUNDLFNBQVMsRUFBQyxLQUFLO2dDQUFDQyxRQUFRO2dDQUFDbEIsSUFBSSxFQUFDLFVBQVU7Ozs7O29DQUFHOzBDQUMzSSw4REFBQ21CLFFBQU07Z0NBQUNDLE9BQU8sRUFBRSxTQUFDOUIsQ0FBQzsyQ0FBS0QsS0FBSyxDQUFDQyxDQUFDLENBQUM7aUNBQUE7Z0NBQUViLEVBQUUsRUFBQyxPQUFPO2dDQUFDZ0MsU0FBUyxFQUFDLFdBQVc7O2tEQUNoRSw4REFBQ1ksR0FBQztrREFBQyxPQUFLOzs7Ozs0Q0FBSTtrREFDWiw4REFBQ0MsS0FBRzt3Q0FBQ2IsU0FBUyxFQUFDLE1BQU07d0NBQUNjLEtBQUssRUFBRTs0Q0FBRUMsT0FBTyxFQUFFLEdBQUc7NENBQUVDLEtBQUssRUFBRSxPQUFPOzRDQUFFQyxNQUFNLEVBQUUsT0FBTzt5Q0FBRTt3Q0FBRUMsR0FBRyxFQUFDLG9CQUFvQjs7Ozs7NENBQUU7Ozs7OztvQ0FDbkc7MENBQ1QsOERBQUM3RCxrREFBSTtnQ0FBQzhELElBQUksRUFBQyxVQUFVOzBDQUNuQiw0RUFBQ0MsSUFBRTtvQ0FBQ3BCLFNBQVMsRUFBQyxXQUFXOzhDQUFDLHdCQUFzQjs7Ozs7d0NBQUs7Ozs7O29DQUNoRDs7Ozs7OzRCQUNIOzs7Ozt3QkFDRjs7Ozs7b0JBQ0Y7O29CQUNMLENBQ0o7Q0FDRjtHQTVGdUJ0QyxLQUFLO0FBQUxBLEtBQUFBLEtBQUs7QUE4RjdCQSxLQUFLLENBQUMyRCxlQUFlLEdBQUcsZ0JBQWU7UUFBWkMsS0FBSyxTQUFMQSxLQUFLO0lBQzlCLElBQUkzRCxJQUFJLEdBQUcyRCxLQUFLO0lBQ2hCLE9BQU87UUFBRTNELElBQUksRUFBSkEsSUFBSTtLQUFFO0NBQ2hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL19jbGllbnQvcGFnZXMvbG9naW4uanN4P2NlYTAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhlYWQgZnJvbSBcIm5leHQvaGVhZFwiXHJcbmltcG9ydCBMaW5rIGZyb20gXCJuZXh0L2xpbmtcIlxyXG5pbXBvcnQgUm91dGVyIGZyb20gXCJuZXh0L3JvdXRlclwiXHJcbmltcG9ydCAkIGZyb20gXCJqcXVlcnlcIlxyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2luKHsgZGF0YSB9KSB7XHJcbiAgY29uc3QgTnVsbGVkPSh2KT0+e3JldHVybiB0eXBlb2YgdiA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiB2ID09PSBudWxsID8gdHJ1ZSA6IHYubGVuZ3RoID09PSAwfVxyXG4gIGNvbnN0IEVsPShpZCk9PntyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpfVxyXG5cclxuICBjb25zdCBbcnVubmluZywgc2V0UnVubmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcclxuXHJcbiAgLy8gT24gV2luZG93IExvYWRcclxuICBpZih0eXBlb2Ygd2luZG93IT09XCJ1bmRlZmluZWRcIil7XHJcbiAgICAkKHdpbmRvdykub24oXCJsb2FkXCIsICgpPT57XHJcbiAgICAgIGlmKE51bGxlZChkYXRhLmhhdmVBbGVydCkpIHJldHVyblxyXG4gICAgICBlbHNlIGlmKGRhdGEuaGF2ZUFsZXJ0KSB7XHJcbiAgICAgICAgYWxlcnQoZGF0YS5tZXNzYWdlKVxyXG4gICAgICAgIFJvdXRlci5wdXNoKHt9LFwiL2xvZ2luXCIse3NoYWxsb3c6dHJ1ZX0pXHJcbiAgICAgIH1cclxuICAgIH0pICAgICAgXHJcbiAgfVxyXG5cclxuICBsZXQgbG9naW4gPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBpZiAoIXJ1bm5pbmcpIHtcclxuICAgICAgc2V0UnVubmluZyh0cnVlKVxyXG4gICAgICAvLyBDaGVjayBJbnB1dHNcclxuICAgICAgaWYgKE51bGxlZChFbChcInVzZXJlbWFpbFwiKS52YWx1ZSkpIHtcclxuICAgICAgICBFbChcInVzZXJlbWFpbFwiKS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKVxyXG4gICAgICAgIHJldHVybiBFbChcInVzZXJlbWFpbFwiKS5yZXBvcnRWYWxpZGl0eSgpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKE51bGxlZChcInBhc3N3b3JkXCIpLnZhbHVlKSB7XHJcbiAgICAgICAgRWwoXCJwYXNzd29yZFwiKS5zZXRDdXN0b21WYWxpZGl0eShcIlwiKVxyXG4gICAgICAgIHJldHVybiBFbChcInBhc3N3b3JkXCIpLnJlcG9ydFZhbGlkaXR5KClcclxuICAgICAgfVxyXG4gICAgICAvLyBMb2FkaW5nXHJcbiAgICAgICQoXCIjbG9naW5cIikuY2hpbGRyZW4oXCJwXCIpLmZhZGVUbygyNTAsIDAsIFwic3dpbmdcIiwgKCkgPT4ge1xyXG4gICAgICAgICQoXCIjbG9naW5cIikuY2hpbGRyZW4oXCJwXCIpLmhpZGUoKVxyXG4gICAgICAgICQoXCIjbG9naW5cIikuY2hpbGRyZW4oXCJpbWdcIikuc2hvdygpLmZhZGVUbygyNTAsIDEsIFwic3dpbmdcIiwgKCkgPT4ge1xyXG4gICAgICAgIC8vIFNlbmQgUmVxdWVzdFxyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogXCIvYXV0aC9sb2dpblwiLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgdXNlcmVtYWlsOiBFbChcInVzZXJlbWFpbFwiKS52YWx1ZSxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogRWwoXCJwYXNzd29yZFwiKS52YWx1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAkKFwiI2xvZ2luXCIpLmNoaWxkcmVuKFwiaW1nXCIpLmZhZGVUbygyNTAsIDAsIFwic3dpbmdcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChcIiNsb2dpblwiKS5jaGlsZHJlbihcImltZ1wiKS5oaWRlKClcclxuICAgICAgICAgICAgICAgICQoXCIjbG9naW5cIikuY2hpbGRyZW4oXCJwXCIpLnNob3coKS5mYWRlVG8oMjUwLCAxLCBcInN3aW5nXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsaWQpIHJldHVybiBSb3V0ZXIucHVzaChcIi9ob21lXCIsIHVuZGVmaW5lZCwgeyBzaGFsbG93OiB0cnVlIH0pXHJcbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1lc3NhZ2UgPT09IFwiUGFzc3dvcmQgaXMgSW5jb3JyZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIEVsKFwicGFzc3dvcmRcIikudmFsdWUgPSBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBFbChcInBhc3N3b3JkXCIpLnNldEN1c3RvbVZhbGlkaXR5KGRhdGEubWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICAgIEVsKFwicGFzc3dvcmRcIikucmVwb3J0VmFsaWRpdHkoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5tZXNzYWdlID09PSBcIkFjY291bnQgaXMgTm90IFJlZ2lzdGVyZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgRWwoXCJ1c2VyZW1haWxcIikudmFsdWUgPSBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBFbChcInBhc3N3b3JkXCIpLnZhbHVlID0gXCJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgRWwoXCJ1c2VyZW1haWxcIikuc2V0Q3VzdG9tVmFsaWRpdHkoZGF0YS5tZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgRWwoXCJ1c2VyZW1haWxcIikucmVwb3J0VmFsaWRpdHkoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBzZXRSdW5uaW5nKGZhbHNlKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPEhlYWQ+XHJcbiAgICAgICAgPHRpdGxlPlNpZ25pbiB8IEdvRm9ySXQ8L3RpdGxlPlxyXG4gICAgICA8L0hlYWQ+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnLWxvZy1iZ1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG9nLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2dpbi1mb3JtXCI+XHJcbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJjdXItZGVmXCI+TG9naW48L2gxPlxyXG4gICAgICAgICAgICA8aW5wdXQgZGVmYXVsdFZhbHVlPXtOdWxsZWQoZGF0YS51c2VybmFtZSkgPyBcIlwiIDogZGF0YS51c2VybmFtZX0gb25LZXlQcmVzcz17KGUpID0+IHtlLmtleSA9PT0gXCJFbnRlclwiICYmIGxvZ2luKGUpfX0gaWQ9XCJ1c2VyZW1haWxcIiBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lIG9yIEVtYWlsXCIgbWF4TGVuZ3RoPVwiMjU1XCIgdHlwZT1cInRleHRcIiByZXF1aXJlZCAvPlxyXG4gICAgICAgICAgICA8aW5wdXQgb25LZXlQcmVzcz17KGUpID0+IHtlLmtleSA9PT0gXCJFbnRlclwiICYmIGxvZ2luKGUpfX0gaWQ9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiBtYXhMZW5ndGg9XCIyNTVcIiByZXF1aXJlZCB0eXBlPVwicGFzc3dvcmRcIiAvPlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eyhlKSA9PiBsb2dpbihlKX0gaWQ9XCJsb2dpblwiIGNsYXNzTmFtZT1cImN1ci1wb2ludFwiID5cclxuICAgICAgICAgICAgICA8cD5Mb2dpbjwvcD5cclxuICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm5vbmVcIiBzdHlsZT17eyBvcGFjaXR5OiBcIjBcIiwgd2lkdGg6IFwiMC45ZW1cIiwgaGVpZ2h0OiBcIjAuOWVtXCIgfX0gc3JjPVwiL2ljb25zL2xvYWRpbmcuc3ZnXCIvPlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPExpbmsgaHJlZj1cInJlZ2lzdGVyXCI+XHJcbiAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cImN1ci1wb2ludFwiPkRvbid0IGhhdmUgYW4gYWNjb3VudD88L2g1PlxyXG4gICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8Lz5cclxuICApXHJcbn1cclxuXHJcbkxvZ2luLmdldEluaXRpYWxQcm9wcyA9ICh7IHF1ZXJ5IH0pID0+IHtcclxuICB2YXIgZGF0YSA9IHF1ZXJ5XHJcbiAgcmV0dXJuIHsgZGF0YSB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIkhlYWQiLCJMaW5rIiwiUm91dGVyIiwiJCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiTG9naW4iLCJkYXRhIiwiTnVsbGVkIiwidiIsImxlbmd0aCIsIkVsIiwiaWQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicnVubmluZyIsInNldFJ1bm5pbmciLCJ3aW5kb3ciLCJvbiIsImhhdmVBbGVydCIsImFsZXJ0IiwibWVzc2FnZSIsInB1c2giLCJzaGFsbG93IiwibG9naW4iLCJlIiwicHJldmVudERlZmF1bHQiLCJ2YWx1ZSIsInNldEN1c3RvbVZhbGlkaXR5IiwicmVwb3J0VmFsaWRpdHkiLCJjaGlsZHJlbiIsImZhZGVUbyIsImhpZGUiLCJzaG93IiwiYWpheCIsInR5cGUiLCJ1cmwiLCJ1c2VyZW1haWwiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ2YWxpZCIsInVuZGVmaW5lZCIsInRpdGxlIiwiZGl2IiwiY2xhc3NOYW1lIiwiaDEiLCJpbnB1dCIsImRlZmF1bHRWYWx1ZSIsInVzZXJuYW1lIiwib25LZXlQcmVzcyIsImtleSIsInBsYWNlaG9sZGVyIiwibWF4TGVuZ3RoIiwicmVxdWlyZWQiLCJidXR0b24iLCJvbkNsaWNrIiwicCIsImltZyIsInN0eWxlIiwib3BhY2l0eSIsIndpZHRoIiwiaGVpZ2h0Iiwic3JjIiwiaHJlZiIsImg1IiwiZ2V0SW5pdGlhbFByb3BzIiwicXVlcnkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./_client/pages/login.jsx\n");

/***/ })

});