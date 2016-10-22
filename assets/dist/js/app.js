/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _Index = __webpack_require__(1);\n\nvar _Index2 = _interopRequireDefault(_Index);\n\nvar _Mobile = __webpack_require__(6);\n\nvar _Mobile2 = _interopRequireDefault(_Mobile);\n\nvar _View = __webpack_require__(2);\n\nvar _View2 = _interopRequireDefault(_View);\n\nvar _ActiveNavigationMenu = __webpack_require__(7);\n\nvar _ActiveNavigationMenu2 = _interopRequireDefault(_ActiveNavigationMenu);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// init redgoose state\nwindow.redgooseState = {};\n\n// set elements\nvar $articleIndex = $('#articleIndex');\nvar $moreItemArea = $('#moreItem');\nvar $navigation = $('#navigation');\nvar $toggleCategory = $('#toggleCategory');\nvar $articleView = $('#articleView');\n\n/**\n * APP\n *\n * @Param {Object} userData\n */\nwindow.APP = function (userData) {\n\n\twindow.redgooseState.root = userData.root || '';\n\twindow.redgooseState.gooseRoot = userData.gooseRoot || '';\n\n\tthis.index = function (options) {\n\n\t\t// init instance objects\n\t\tvar index = new _Index2.default();\n\t\tvar mobile = new _Mobile2.default();\n\n\t\t// init toggle category\n\t\tmobile.toggleCategory($toggleCategory);\n\n\t\t// init index\n\t\tindex.init({\n\t\t\t_nest: options._nest,\n\t\t\t_category: options._category,\n\t\t\t$articleIndex: $articleIndex,\n\t\t\t$moreItemArea: $moreItemArea\n\t\t});\n\n\t\t// init masonry\n\t\tindex.initMasonry($articleIndex.get(0));\n\n\t\t// init load item\n\t\tindex.initLoadItem();\n\t};\n\n\tthis.view = function () {\n\t\tvar view = new _View2.default();\n\n\t\t// init page\n\t\tview.initPage($articleView);\n\t};\n};\n\n// init mobile\nvar mobile = new _Mobile2.default();\nmobile.init();\n\n// active navigation menu\n\nif ($navigation.length) {\n\tvar activeNavigationMenu = new _ActiveNavigationMenu2.default($navigation);\n\tactiveNavigationMenu.init();\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/App.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/App.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _View = __webpack_require__(2);\n\nvar _View2 = _interopRequireDefault(_View);\n\nvar _AppHistory = __webpack_require__(5);\n\nvar _AppHistory2 = _interopRequireDefault(_AppHistory);\n\nvar _CSS = __webpack_require__(4);\n\nvar _CSS2 = _interopRequireDefault(_CSS);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar appHistory = new _AppHistory2.default();\nvar ITEM_DELAY = 50;\nvar SCROLL_SPEED = 300;\n\nfunction Index() {\n\tvar _this = this;\n\n\tthis.options = {};\n\tthis.masonry = null;\n\tthis.$loadItemButton = null;\n\tthis.view = new _View2.default(this);\n\n\t// init app history\n\tappHistory.initPopEvent(this.view, this);\n\n\t/**\n  * init\n  *\n  * @Param {Object} userOptions\n  */\n\tthis.init = function (userOptions) {\n\n\t\t_this.options = $.extend({}, userOptions, _this.options);\n\n\t\tvar $items = _this.options.$articleIndex.find('.grid-item');\n\t\t_this.initOpenArticle($items);\n\n\t\t_this.$loadItemButton = _this.options.$moreItemArea.find('a');\n\n\t\tappHistory.replace({ url: location.pathname + location.search, type: 'index' }, null, location.pathname + location.search);\n\t};\n\n\t/**\n  * init masonry\n  *\n  * @Param {Object} _index\n  */\n\tthis.initMasonry = function (_index) {\n\n\t\t// add className `grid`\n\t\t$(_index).addClass('grid');\n\n\t\t// init masonry\n\t\t_this.masonry = new Masonry(_index, {\n\t\t\titemSelector: '.grid-item',\n\t\t\tcolumnWidth: '.grid-sizer',\n\t\t\ttransitionDuration: '0s',\n\t\t\thiddenStyle: {},\n\t\t\tvisibleStyle: {}\n\t\t});\n\t};\n\n\t/**\n  * init load item\n  *\n  * @Param {Object} $body\n  */\n\tthis.initLoadItem = function ($body) {\n\t\tif (!_this.options.$moreItemArea.length) return false;\n\n\t\t_this.$loadItemButton.on('click', _this.loadItemEvent);\n\t};\n\n\t/**\n  * item template\n  *\n  * @Param {Object} src\n  * @Param {Boolean} isAnimation\n  * @Return {String}\n  */\n\tthis.itemTemplate = function (src, isAnimation) {\n\t\tvar str = '' + ('<div class=\"grid-item ' + src.size_className + ' ' + (isAnimation && 'ready') + '\">') + ('<a href=\"' + window.redgooseState.root + '/article/' + (_this.options._nest ? _this.options._nest + '/' : '') + src.srl + '/\">') + ('<figure style=\"background-image: url(\\'' + window.redgooseState.gooseRoot + '/' + src.json.thumbnail.url + '\\')\">') + src.title + '</figure>' + '</a>' + '</div>';\n\t\treturn str;\n\t};\n\n\t/**\n  * load item event\n  *\n  * @Param {Object} e\n  */\n\tthis.loadItemEvent = function (e) {\n\n\t\tvar $button = $(e.currentTarget);\n\t\tvar url = $button.attr('href');\n\n\t\t// play loading button\n\t\t_this.loadingLoadItem(true);\n\n\t\t// off more items button\n\t\t_this.$loadItemButton.off('click');\n\n\t\t// load item\n\t\tvar loadItem = _this.load(url);\n\t\tloadItem.done(function (articles, nextpage, currentpage) {\n\t\t\t// stop loading button\n\t\t\t_this.loadingLoadItem(false);\n\n\t\t\t// update index\n\t\t\t_this.updateIndex(articles, nextpage, true, true);\n\n\t\t\t// update history\n\t\t\tvar url = location.pathname + '?page=' + currentpage;\n\t\t\tappHistory.push({ url: url, type: 'index' }, null, url);\n\t\t});\n\n\t\treturn false;\n\t};\n\n\t/**\n  * update index\n  *\n  * @Param {Object} articles\n  * @Param {int} nextpage\n  * @Param {Boolean} isAnimation\n  * @Param {Boolean} isMoveScroll\n  */\n\tthis.updateIndex = function (articles, nextpage, isAnimation, isMoveScroll) {\n\t\t// update more item button\n\t\tif (nextpage) {\n\t\t\t_this.options.$moreItemArea.removeClass('hide');\n\n\t\t\tvar url = _this.$loadItemButton.attr('href').replace(/page=(.+)/, \"page=\" + nextpage);\n\t\t\t_this.$loadItemButton.attr('href', url).on('click', _this.loadItemEvent);\n\t\t} else {\n\t\t\t_this.options.$moreItemArea.addClass('hide');\n\t\t}\n\n\t\t// make items\n\t\tvar items = articles.map(function (o) {\n\t\t\treturn _this.itemTemplate(o, isAnimation);\n\t\t}).join('');\n\t\tvar $items = $(items);\n\n\t\tif (isAnimation) {\n\t\t\t$items.each(function (k, o) {\n\t\t\t\tvar delay = k * ITEM_DELAY;\n\t\t\t\tvar $el = $(o);\n\n\t\t\t\t_CSS2.default.transitionEnd($el, function (e) {\n\t\t\t\t\t$el.removeClass('ready show');\n\t\t\t\t});\n\n\t\t\t\tsetTimeout(function () {\n\t\t\t\t\t$el.addClass('show');\n\t\t\t\t}, delay);\n\t\t\t});\n\t\t}\n\n\t\t// init open article event\n\t\t_this.initOpenArticle($items);\n\n\t\t// append items in index\n\t\t_this.options.$articleIndex.append($items);\n\t\t_this.masonry.appended($items);\n\n\t\t// move scroll\n\t\tif (isMoveScroll) {\n\t\t\tvar top = $items.eq(0).offset().top - 30;\n\t\t\t$(\"html, body\").stop().animate({ scrollTop: top }, SCROLL_SPEED, 'swing');\n\t\t}\n\t};\n\n\t/**\n  * loading load item\n  *\n  * @Param {Boolean} sw\n  */\n\tthis.loadingLoadItem = function (sw) {\n\t\tif (!_this.$loadItemButton.length) return false;\n\t\tif (sw) {\n\t\t\t_this.$loadItemButton.addClass('loading');\n\t\t} else {\n\t\t\t_this.$loadItemButton.removeClass('loading');\n\t\t}\n\t};\n\n\t/**\n  * load item\n  *\n  * @Param {String} url\n  * @Return {Object}\n  */\n\tthis.load = function (url) {\n\n\t\tvar defer = $.Deferred();\n\n\t\t$.post(url, function (res) {\n\t\t\tif (res.state == 'success') {\n\t\t\t\tdefer.resolve(res.articles, res.nextpage, res.currentpage);\n\t\t\t} else {\n\t\t\t\tdefer.reject(res.message);\n\t\t\t}\n\t\t}, 'json');\n\n\t\treturn defer.promise();\n\t};\n\n\t/**\n  * init open article event\n  *\n  * @Param {Object} $items\n  */\n\tthis.initOpenArticle = function ($items) {\n\t\t$items.each(function (n, el) {\n\t\t\t$(el).find('a').on('click', function (e) {\n\t\t\t\tvar button = $(e.currentTarget);\n\t\t\t\t_this.view.open(button.attr('href'));\n\t\t\t\treturn false;\n\t\t\t});\n\t\t});\n\t};\n\n\t/**\n  * update\n  *\n  * @Param {String} url\n  */\n\tthis.update = function (url) {\n\n\t\t// off more items button\n\t\t_this.$loadItemButton.off('click');\n\n\t\t// off loading\n\t\t_this.loadingLoadItem(true);\n\n\t\t// remove items\n\t\t_this.masonry.remove(_this.options.$articleIndex.find('.grid-item'));\n\n\t\t// load item\n\t\tvar loadItem = _this.load(url);\n\t\tloadItem.done(function (articles, nextpage, currentpage) {\n\t\t\t// stop loading button\n\t\t\t_this.loadingLoadItem(false);\n\n\t\t\t// update index\n\t\t\t_this.updateIndex(articles, nextpage, false, false);\n\n\t\t\t_this.masonry.layout();\n\t\t});\n\t};\n}\n\nexports.default = Index;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Index/index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Index/index.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _Loading = __webpack_require__(3);\n\nvar _Loading2 = _interopRequireDefault(_Loading);\n\nvar _CSS = __webpack_require__(4);\n\nvar _CSS2 = _interopRequireDefault(_CSS);\n\nvar _AppHistory = __webpack_require__(5);\n\nvar _AppHistory2 = _interopRequireDefault(_AppHistory);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar loading = new _Loading2.default();\nvar appHistory = new _AppHistory2.default();\n\nvar KEYCODE_ESC = 27;\nvar KEYCODE_LEFT = 37;\nvar KEYCODE_RIGHT = 39;\n\n/**\n * keyboard event\n *\n * @Param {Boolean} evt\n * @Return {Object}\n */\nvar keyboardEvent = function keyboardEvent(evt) {\n\tif (evt) {\n\t\tvar _ret = function () {\n\t\t\tvar defer = $.Deferred();\n\n\t\t\t$(window).on('keydown.redgoose', function (e) {\n\t\t\t\tdefer.notify(e.keyCode);\n\t\t\t});\n\n\t\t\treturn {\n\t\t\t\tv: defer.promise()\n\t\t\t};\n\t\t}();\n\n\t\tif ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === \"object\") return _ret.v;\n\t} else {\n\t\t$(window).off('keydown.redgoose');\n\t\treturn null;\n\t}\n};\n\n/**\n * View\n */\nfunction View(index) {\n\tvar _this = this;\n\n\tthis.$el = {\n\t\tpopup: $('#popupView'),\n\t\tarticle: null\n\t};\n\n\t/**\n  * init page\n  *\n  * @Param {Object} $article\n  */\n\tthis.initPage = function ($article) {\n\t\t_this.$el.article = $article;\n\n\t\t_this.keyEvent = keyboardEvent(true);\n\n\t\t_this.initView();\n\n\t\t// keyboard event\n\t\t_this.keyEvent.progress(function (code) {\n\t\t\tif (code === KEYCODE_LEFT) {\n\t\t\t\tif (_this.$el.article.find('.direction.prev').length) {\n\t\t\t\t\tlocation.href = _this.$el.article.find('.direction.prev').attr('href');\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (code === KEYCODE_RIGHT) {\n\t\t\t\tif (_this.$el.article.find('.direction.next').length) {\n\t\t\t\t\tlocation.href = _this.$el.article.find('.direction.next').attr('href');\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t};\n\n\t/**\n  * open view in popup\n  *\n  * @Param {String} url\n  * @Param {Boolean} isHistory\n  */\n\tthis.open = function (url, isHistory) {\n\n\t\t// save is view popup\n\t\twindow.redgooseState.isViewPopup = true;\n\n\t\t// save scroll top\n\t\twindow.redgooseState.indexScrollTop = $(window).scrollTop();\n\n\t\t// save index url\n\t\twindow.redgooseState.indexUrl = location.pathname + location.search;\n\n\t\t// on loading\n\t\tloading.on();\n\n\t\t// load page\n\t\t_this.$el.popup.load(url + '?popup=1', function () {\n\t\t\t// update history\n\t\t\tif (!isHistory) {\n\t\t\t\tappHistory.push({ url: url, type: 'article' }, null, url);\n\t\t\t}\n\n\t\t\t_this.$el.popup.addClass('ready');\n\t\t\tsetTimeout(function () {\n\t\t\t\t_this.$el.popup.addClass('show').scrollTop(0);\n\t\t\t\t_CSS2.default.transitionEnd(_this.$el.popup, function () {\n\t\t\t\t\t$('html').addClass('popup-mode');\n\t\t\t\t\t$(window).scrollTop(0);\n\t\t\t\t\t_this.$el.popup.addClass('active');\n\t\t\t\t\tloading.off();\n\t\t\t\t});\n\t\t\t}, 20);\n\n\t\t\t_this.keyEvent = keyboardEvent(true);\n\t\t\t_this.initPopup();\n\t\t\t_this.initView();\n\t\t});\n\t};\n\n\t/**\n  * close view in popup\n  *\n  * @Param {Boolean} isHistory\n  */\n\tthis.close = function (isHistory) {\n\t\tvar scrollY = $(window).scrollTop();\n\n\t\t// save is view popup\n\t\twindow.redgooseState.isViewPopup = false;\n\n\t\t_CSS2.default.transitionEnd(_this.$el.popup, function () {\n\t\t\t_this.$el.popup.removeClass('ready').html('');\n\t\t\t$(window).scrollTop(window.redgooseState.indexScrollTop);\n\t\t});\n\n\t\t_this.$el.popup.removeClass('show active').scrollTop(scrollY);\n\t\t$('html').removeClass('popup-mode');\n\n\t\tif (index) index.masonry.layout();\n\n\t\t// disable keyboard event\n\t\t_this.keyEvent = keyboardEvent(false);\n\n\t\t// update history\n\t\tif (!isHistory) {\n\t\t\tappHistory.push(null, null, window.redgooseState.indexUrl);\n\t\t\twindow.redgooseState.indexUrl = null;\n\t\t}\n\t};\n\n\t/**\n  * view init\n  */\n\tthis.initView = function () {\n\t\t// on like event\n\t\t_this.$el.article.find('a.on-like').on('click', function (e) {\n\t\t\tvar $el = $(e.currentTarget);\n\t\t\t$.post($el.attr('href'), function (res) {\n\t\t\t\t$el.replaceWith('<span class=\"on-like\" title=\"on like\">' + ('<img src=\"' + window.redgooseState.root + '/assets/img/ico-heart-on.svg\" alt=\"\">') + ('<em>' + res.data.like + '</em>') + '</span>');\n\t\t\t}, 'json');\n\t\t\treturn false;\n\t\t});\n\t};\n\n\t/**\n  * init popup\n  */\n\tthis.initPopup = function () {\n\t\t// set article element\n\t\t_this.$el.article = _this.$el.popup.children();\n\n\t\t// close popup\n\t\t_this.$el.article.find('[data-action=close]').on('click', function () {\n\t\t\t_this.close();\n\t\t});\n\n\t\t// keyboard event\n\t\t_this.keyEvent.progress(function (code) {\n\t\t\tif (code === KEYCODE_ESC) {\n\t\t\t\t_this.close();\n\t\t\t}\n\t\t\tif (code === KEYCODE_LEFT) {\n\t\t\t\tif (_this.$el.article.find('.direction.prev').length) {\n\t\t\t\t\t_this.go(_this.$el.article.find('.direction.prev').attr('href'));\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (code === KEYCODE_RIGHT) {\n\t\t\t\tif (_this.$el.article.find('.direction.next').length) {\n\t\t\t\t\t_this.go(_this.$el.article.find('.direction.next').attr('href'));\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\n\t\t// direction button event\n\t\t_this.$el.article.find('.direction').on('click', function (e) {\n\t\t\t_this.go($(e.currentTarget).attr('href'));\n\t\t\treturn false;\n\t\t});\n\t};\n\n\t/**\n  * go another article\n  *\n  * @Param {String} url\n  * @Param {Boolean} isHistory\n  */\n\tthis.go = function (url, isHistory) {\n\n\t\tloading.on();\n\n\t\t_this.keyEvent = keyboardEvent(false);\n\t\t_this.$el.popup.html('');\n\n\t\t// load page\n\t\t_this.$el.popup.load(url + '?popup=1', function () {\n\t\t\t// update history\n\t\t\tif (!isHistory) {\n\t\t\t\tappHistory.push({ url: url, type: 'article' }, null, url);\n\t\t\t}\n\n\t\t\tloading.off();\n\n\t\t\t_this.keyEvent = keyboardEvent(true);\n\t\t\t_this.initPopup();\n\t\t\t_this.initView();\n\t\t});\n\t};\n}\n\nexports.default = View;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/View/index.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/View/index.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nvar template = '<div class=\"popup-loading\">' + '<div class=\"wrap\">' + '<div class=\"sk-folding-cube\">' + '<div class=\"sk-cube1 sk-cube\"></div>' + '<div class=\"sk-cube2 sk-cube\"></div>' + '<div class=\"sk-cube4 sk-cube\"></div>' + '<div class=\"sk-cube3 sk-cube\"></div>' + '</div>' + '</div>' + '</div>';\n\nfunction Loading() {\n\tvar _this = this;\n\n\tthis.$el = $(template);\n\n\tthis.on = function () {\n\t\t$('body').append(_this.$el);\n\t};\n\n\tthis.off = function () {\n\t\t_this.$el.remove();\n\t};\n}\n\nexports.default = Loading;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Util/Loading.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Util/Loading.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nvar CSS3 = {\n\n\teventNames: {\n\t\tWebkitTransition: 'webkitTransitionEnd',\n\t\tMozTransition: 'transitionend',\n\t\tOTransition: 'oTransitionEnd otransitionend',\n\t\ttransition: 'transitionend'\n\t},\n\n\tisSupport: function isSupport() {\n\t\tvar el = document.createElement('div');\n\t\tfor (var name in this.eventNames) {\n\t\t\tif (el.style[name] !== undefined) {\n\t\t\t\treturn this.eventNames[name];\n\t\t\t}\n\t\t}\n\t\tel = null;\n\t\treturn false;\n\t},\n\n\ttransitionEnd: function transitionEnd($el, callback) {\n\t\tif (this.isSupport()) {\n\t\t\tif (callback) {\n\t\t\t\t$el.one(this.isSupport(), callback);\n\t\t\t}\n\t\t} else {\n\t\t\t$el.one(this.isSupport(), callback);\n\t\t}\n\t}\n};\n\nexports.default = CSS3;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Util/CSS3.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Util/CSS3.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction AppHistory() {\n\tvar _this = this;\n\n\t/**\n  * support\n  *\n  * @Return {Boolean}\n  */\n\tthis.support = function () {\n\t\treturn history.pushState ? true : false;\n\t};\n\n\t/**\n  * Push state\n  *\n  * @Param {Object} environment\n  * @Param {String} title\n  * @Param {String} url\n  */\n\tthis.push = function (environment, title, url) {\n\t\tif (!_this.support()) return false;\n\t\tif (!url) return false;\n\n\t\thistory.pushState(environment || null, title || url, url);\n\t};\n\n\t/**\n  * Replace state\n  *\n  * @Param {Object} environment\n  * @Param {String} title\n  * @Param {String} url\n  */\n\tthis.replace = function (environment, title, url) {\n\t\tif (!_this.support()) return false;\n\t\tif (!url) return false;\n\n\t\thistory.replaceState(environment || null, title || url, url);\n\t};\n\n\t/**\n  * Initial pop event\n  */\n\tthis.initPopEvent = function (view, index) {\n\n\t\twindow.addEventListener('popstate', function (e) {\n\t\t\tvar state = e.state;\n\n\t\t\tif (state) {\n\t\t\t\tswitch (state.type) {\n\t\t\t\t\tcase 'article':\n\t\t\t\t\t\tif (window.redgooseState.isViewPopup) {\n\t\t\t\t\t\t\tview.go(state.url, true);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tview.open(state.url, true);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\tcase 'index':\n\t\t\t\t\t\tif (window.redgooseState.isViewPopup) {\n\t\t\t\t\t\t\tview.close(true);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tindex.update(state.url);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tif (window.redgooseState.isViewPopup) {\n\t\t\t\t\tview.close(true);\n\t\t\t\t} else {\n\t\t\t\t\tlocation.reload();\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\t};\n}\n\nexports.default = AppHistory;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Util/AppHistory.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Util/AppHistory.js?");

/***/ },
/* 6 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction Mobile() {\n\tvar _this = this;\n\n\t/**\n  * toggle navigation\n  *\n  * @param {Object} $selector\n  * @param {Object} $target\n  */\n\tthis.toggleNavigation = function ($selector, $target) {\n\t\t$selector.on('click', function () {\n\t\t\t$target.toggleClass('active');\n\t\t});\n\t};\n\n\t/**\n  * toggle category list\n  *\n  * @param {Object} $selector\n  */\n\tthis.toggleCategory = function ($selector) {\n\t\t$selector.on('click', function (e) {\n\t\t\t$(e.currentTarget).parent().toggleClass('active');\n\t\t});\n\t};\n\n\tthis.init = function () {\n\t\t_this.toggleNavigation($('#toggleNavigation'), $('#navigation'));\n\t};\n}\n\nexports.default = Mobile;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Mobile/index.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Mobile/index.js?");

/***/ },
/* 7 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nfunction ActiveNavigationMenu($nav) {\n\tvar _this = this;\n\n\tthis.$navigation = $nav;\n\n\tthis.init = function () {\n\t\t_this.$navigation.find('.dep-2 li.active').parent().closest('li').addClass('active');\n\t};\n}\n\nexports.default = ActiveNavigationMenu;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./assets/src/js/Util/ActiveNavigationMenu.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./assets/src/js/Util/ActiveNavigationMenu.js?");

/***/ }
/******/ ]);