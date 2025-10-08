/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config)\n/* harmony export */ });\nconst config = {\r\n    host: 'http://localhost:3000/api',\r\n}\n\n//# sourceURL=webpack:///./config/config.js?\n}");

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\r\n\r\nclass App {\r\n    constructor() {\r\n         new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\r\n    }\r\n\r\n\r\n}\r\n\r\n(new App());\n\n//# sourceURL=webpack:///./src/app.js?\n}");

/***/ }),

/***/ "./src/components/login.js":
/*!*********************************!*\
  !*** ./src/components/login.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\n/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/custom-http */ \"./src/services/custom-http.js\");\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/config */ \"./config/config.js\");\n\r\n\r\n\r\nclass Login {\r\n    constructor() {\r\n\r\n        this.emailElement = document.getElementById('email');\r\n        this.passwordElement = document.getElementById('password');\r\n        this.rememberMe = document.getElementById('remember-me');\r\n\r\n        document.getElementById('process-button').addEventListener('click', this.login.bind(this));\r\n\r\n    }\r\n\r\n\r\n    validateForm() {\r\n\r\n        let isValid = true\r\n        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/)) {\r\n            this.emailElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.emailElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/)) {\r\n            this.passwordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n        return isValid;\r\n    }\r\n\r\n    async login() {\r\n        if (this.validateForm()) {\r\n            try {\r\n                const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_0__.CustomHttp.request(_config_config__WEBPACK_IMPORTED_MODULE_1__.config.host + '/signup', 'POST', {\r\n                    email: this.emailElement.value,\r\n                    password: this.passwordElement.value,\r\n                });\r\n                if (result) {\r\n                    if (result.error || !result.user) {\r\n                        throw new Error(result.message);\r\n                    }\r\n                    location.href = '/'\r\n                }\r\n                console.log(result);\r\n\r\n\r\n            }catch(err) {\r\n                console.log('error')\r\n            }\r\n\r\n\r\n\r\n        } else {\r\n            console.log('error')\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/components/login.js?\n}");

/***/ }),

/***/ "./src/components/signup.js":
/*!**********************************!*\
  !*** ./src/components/signup.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Signup: () => (/* binding */ Signup)\n/* harmony export */ });\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/config */ \"./config/config.js\");\n/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/custom-http */ \"./src/services/custom-http.js\");\n\r\n\r\n\r\nclass Signup {\r\n    constructor() {\r\n        this.nameElement = document.getElementById('name');\r\n        this.lastNameElement = document.getElementById('last-name');\r\n        this.emailElement = document.getElementById('email');\r\n        this.passwordElement = document.getElementById('password');\r\n        this.passwordRepeatElement = document.getElementById('password-repeat');\r\n        this.commonErorrElement = document.getElementById('common-error');\r\n\r\n        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));\r\n\r\n    }\r\n\r\n\r\n    validateForm() {\r\n\r\n        let isValid = true\r\n\r\n        if (this.nameElement.value) {\r\n            this.nameElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.nameElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n        if (this.lastNameElement.value) {\r\n            this.lastNameElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.lastNameElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n\r\n        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/)) {\r\n            this.emailElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.emailElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/)) {\r\n            this.passwordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {\r\n            this.passwordRepeatElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordRepeatElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n        return isValid;\r\n\r\n    }\r\n\r\n    async signUp() {\r\n        if (this.validateForm()) {\r\n            try {\r\n                const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_1__.CustomHttp.request(_config_config__WEBPACK_IMPORTED_MODULE_0__.config.host + '/signup', 'POST', {\r\n                    name: this.nameElement.value,\r\n                    lastName: this.nameElement.value,\r\n                    email: this.emailElement.value,\r\n                    password: this.passwordElement.value,\r\n                    passwordRepeat: this.passwordRepeatElement.value,\r\n                });\r\n                if (result) {\r\n                    if (result.error || !result.user) {\r\n                        this.commonErorrElement.style.display = 'block';\r\n                        throw new Error(result.message);\r\n                    }\r\n                    location.href = '/login'\r\n                }\r\n                console.log(result);\r\n\r\n\r\n            }catch(err) {\r\n                console.log('error')\r\n            }\r\n\r\n\r\n\r\n        } else {\r\n            console.log('error')\r\n        }\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/components/signup.js?\n}");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_signup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/signup.js */ \"./src/components/signup.js\");\n/* harmony import */ var _components_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/login */ \"./src/components/login.js\");\n\r\n\r\n\r\nclass Router {\r\n    constructor() {\r\n\r\n        this.contentElement = document.getElementById(\"content\");\r\n        this.stylesElement = document.getElementById(\"styles\");\r\n        this.titleElement = document.getElementById(\"head-title\");\r\n        this.initEvent();\r\n\r\n        this.routes = [\r\n\r\n            {\r\n                route: \"/signup\",\r\n                title: \"Регистрация\",\r\n                template: \"/templates/sign-up.html\",\r\n                styles: \"sign-up.css\",\r\n                load: () => {\r\n                    new _components_signup_js__WEBPACK_IMPORTED_MODULE_0__.Signup();\r\n                },\r\n            },\r\n            {\r\n                route: \"/login\",\r\n                title: \"Авторизоваться\",\r\n                template: \"/templates/login.html\",\r\n                styles: \"login.css\",\r\n                load: () => {\r\n                    new _components_login__WEBPACK_IMPORTED_MODULE_1__.Login();\r\n                },\r\n            },\r\n        ];\r\n    }\r\n    initEvent() {\r\n      window.addEventListener('DOMContentLoaded', this.activateRouter.bind(this));\r\n      window.addEventListener('popstate', this.activateRouter.bind(this));\r\n    }\r\n   async activateRouter() {\r\n        const urlRoute = window.location.pathname;\r\n        const newRoute = this.routes.find((item) => item.route === urlRoute);\r\n        if (newRoute) {\r\n            if (newRoute.title) {\r\n                this.titleElement.innerHTML = newRoute.title;\r\n            }\r\n            if (newRoute.styles && newRoute.styles.length > 0) {\r\n                    const link = document.createElement('link');\r\n                    link.rel = 'stylesheet';\r\n                    link.href = './styles/' + newRoute.styles;\r\n                    document.head.insertBefore(link, this.stylesElement);\r\n\r\n            }\r\n            if (newRoute.template) {\r\n                this.contentElement.innerHTML = await fetch(newRoute.template).then((response) => response.text());\r\n            }\r\n            if (newRoute.load && typeof newRoute.load === 'function') {\r\n                newRoute.load();\r\n            }\r\n\r\n\r\n        }else {\r\n            console.log('No route');\r\n        }\r\n\r\n\r\n    }\r\n\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./src/router.js?\n}");

/***/ }),

/***/ "./src/services/auth.js":
/*!******************************!*\
  !*** ./src/services/auth.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Auth: () => (/* binding */ Auth)\n/* harmony export */ });\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/config */ \"./config/config.js\");\n\r\n\r\nclass Auth {\r\n    static accessTokenKey = 'accessToken';\r\n    static refreshTokenKey = 'refreshToken';\r\n    static userInfoKey = 'userInfo';\r\n\r\n    static async processUnauthorizedResponse() {\r\n        const refreshToken = localStorage.getItem(this.refreshTokenKey);\r\n        if (refreshToken) {\r\n            const response = await fetch(_config_config__WEBPACK_IMPORTED_MODULE_0__.config.host + '/refresh', {\r\n\r\n                method: 'POST',\r\n                headers: {\r\n                    'Content-type': 'application/json',\r\n                    'Accept': 'application/json',\r\n                },\r\n                body: JSON.stringify({refreshToken: refreshToken})\r\n\r\n            });\r\n\r\n            if (response && response.status === 200) {\r\n                const result = await response.json();\r\n                if (result && !result.error) {\r\n                    this.setTokens(result.accessToken, result.refreshToken);\r\n                    return true;\r\n\r\n                }\r\n            }\r\n        }\r\n        this.removeTokens();\r\n        location.href = '/';\r\n        return false;\r\n\r\n    }\r\n\r\n\r\n    static setTokens (accessToken, refreshToken) {\r\n        localStorage.setItem(this.accessTokenKey, accessToken)\r\n        localStorage.setItem(this.refreshTokenKey, refreshToken)\r\n    }\r\n    static removeTokens () {\r\n        localStorage.removeItem(this.accessTokenKey)\r\n        localStorage.removeItem(this.refreshTokenKey)\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack:///./src/services/auth.js?\n}");

/***/ }),

/***/ "./src/services/custom-http.js":
/*!*************************************!*\
  !*** ./src/services/custom-http.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CustomHttp: () => (/* binding */ CustomHttp)\n/* harmony export */ });\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth */ \"./src/services/auth.js\");\n\r\n\r\nclass CustomHttp {\r\n    static async request (url, method = 'GET', body = null) {\r\n\r\n        const params = {\r\n            method: method,\r\n            headers: {\r\n                'Content-type': 'application/json',\r\n                'Accept': 'application/json',\r\n            },\r\n        };\r\n\r\n        // let token = localStorage.getItem(Auth.accessTokenKey);\r\n        // if (token) {\r\n        //     params.headers['x-access-token'] = token;\r\n        // }\r\n\r\n        if (body) {\r\n            params.body = JSON.stringify(body);\r\n        }\r\n\r\n        const response = await fetch(url, params);\r\n\r\n        if (response.status < 200 || response.status >= 300) {\r\n            if (response.status === 401) {\r\n                console.log('Not Found');\r\n                // const result = await Auth.processUnauthorizedResponse();\r\n                // if (result) {\r\n                //     return await this.request(url,method,body);\r\n                //\r\n                // }else {\r\n                //     return null;\r\n                // }\r\n\r\n            }\r\n            throw new Error(response.message);\r\n        }\r\n        return await response.json();\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/services/custom-http.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;