import $ from 'jQuery';
import Masonry from 'Masonry';

import * as util from './util';
import AppHistory from './AppHistory';


const SCROLL_OFFSET = 30; // 페이지가 변화되는 스크롤 y축 위치 offset
const SCROLL_SPEED = 300; // 페이지 추가될때 스크롤 이동되는 속도
const BLOCK_DELAY = 80; // 아이템들이 추가될때 fade in 딜레이 간격
const LOAD_PAGE_PER_SIZE = 20; // 페이지 추가될때마다 불러올 아이템의 갯수
const appHistory = new AppHistory();


export default function Index(parent)
{
	const self = this;

	/**
	 * PUBLIC VARIABLES
	 */

	this.srls = {};
	this.options = {};
	this.scrollTimer = null;
	this.selector_articles = '#articles';
	this.$index = $('.index');
	this.$articles = this.$index.find('.index__articles');
	this.$category = this.$index.find('.index__categories');
	this.$more = this.$index.find('.index__loadMore');
	this.masonry = null;

	/**
	 * FUNCTIONS
	 */

	/**
	 * masonry
	 * `masonry` 객체를 만들거나 제거한다.
	 *
	 * @param {Boolean} sw
	 */
	function masonry(sw=true)
	{
		if(sw)
		{
			self.$articles.addClass('masonry');
			self.masonry = new Masonry(self.selector_articles, {
				itemSelector: '.grid-item',
				columnWidth: '.grid-sizer',
				transitionDuration : '0s',
				hiddenStyle : {},
				visibleStyle : {}
			});
		}
		else
		{
			// TODO: destroy masonry
		}
	}

	/**
	 * more articles
	 * 아이템을 더 불러왔을때..
	 *
	 * @param {Number} page
	 * @return {Promise}
	 */
	async function moreArticles(page)
	{
		let response = null;

		// turn on loading
		moreButton(false);

		// get articles
		try
		{
			response = await $.ajax({
				url: `${parent.options.root}/ajax/`,
				type: 'post',
				data: {
					page,
					size: self.options.size,
					field: 'srl,title,category_srl,json',
				},
				dataType: 'json',
			});
		}
		catch(e)
		{
			alert('Server error');
			console.error(e);
			moreButton(true);
			return false;
		}

		// update index
		await updateIndex(response, true, true);

		// update more button
		self.$more.children('a').attr('data-next', response.nextpage);

		// refresh masonry layout
		self.masonry.layout();

		// turn off loading
		moreButton(true);

		return false;
	}

	/**
	 * update index
	 *
	 * @param {Object} res
	 * @param {Boolean} showAnimation
	 * @param {Boolean} useScroll
	 */
	async function updateIndex(res, showAnimation=false, useScroll=false)
	{
		if (!res.nextpage)
		{
			self.$more.remove();
		}

		// check articles
		if (!(res.articles && res.articles.length)) return;

		// make article template
		let appendElements = res.articles.map((item, key) => {
			let url = `${parent.options.root}/article/${self.options.nest || ''}${item.srl}`;
			let image = `${parent.options.gooseRoot}/${item.json.thumbnail.url}`;
			let className = `grid-item grid-item__hidden ${item.size_className}`;
			return `<div class="${className}">` +
				`<a href="${url}" title="${item.title}">` +
				`<figure style="background-image: url('${image}')">` +
				`${item.title}` +
				`</figure>` +
				`</a>` +
				`</div>`;
		}).join('');

		// append articles
		let $appendElements = $(appendElements);
		self.$articles.append($appendElements);
		self.masonry.appended($appendElements);

		// play animation blocks
		if (showAnimation)
		{
			animationBlocks($appendElements);
		}

		// move to next page by scroll
		if (useScroll)
		{
			let $firstElement = $appendElements.eq(0);
			let top = $firstElement.offset().top - SCROLL_OFFSET;
			$firstElement.attr('data-page', res.currentPage);
			$("html, body").stop().animate({ scrollTop: top }, SCROLL_SPEED, 'swing');
		}
	}

	/**
	 * show animation block
	 *
	 * @param {Object} $blocks
	 */
	function animationBlocks($blocks)
	{
		$blocks.each(function(key) {
			setTimeout(() => {
				$(this).removeClass('grid-item__hidden');
			}, BLOCK_DELAY * key);
		});
	}

	/**
	 * control more button
	 * 더 불러오기 버튼의 상태가 변한다.
	 *
	 * @param {Boolean} sw
	 */
	function moreButton(sw)
	{
		// more load articles
		function loadMoreTrigger()
		{
			moreArticles(this.dataset.next).then();
			return false;
		}

		if (sw)
		{
			self.$more.children('a').on('click', loadMoreTrigger);
			self.$more.removeClass('loadMore-loading');
		}
		else
		{
			self.$more.children('a').off('click');
			self.$more.addClass('loadMore-loading');
		}
	}

	/**
	 * toggle category
	 */
	function toggleCategory()
	{
		$(this).toggleClass('categories__toggle-active');
		$(this).next().toggleClass('categories__index-active');
	}

	/**
	 * scroll event
	 *
	 * @param {Boolean} sw
	 */
	function scrollEvent(sw)
	{
		const delay = 100;

		function action()
		{
			const $el = self.$articles.children('[data-page]');
			const top = $(this).scrollTop();
			let $current = null;

			if (!$el.length) return false;

			if (top + $(this).height() === $(document).height())
			{
				$current = ($el.eq($el.length - 1)) ? $el.eq($el.length - 1) : null;
			}
			else
			{
				$el.each(function(key) {
					if (top >= ($(this).offset().top - (SCROLL_OFFSET + 5)))
					{
						$current = $(this);
					}
				});
			}

			// update page
			let page = ($current && $current.length) ? $current.data('page') : 1;
			updatePage(page);
		}

		if (sw)
		{
			$(window).on('scroll', function() {
				// 너무많은 스크롤 이벤트가 트리깅 하는것을 방지하기 위하여 셋 타임아웃을 걸어놓았다.
				clearTimeout(self.scrollTimer);
				self.scrollTimer = setTimeout(action, delay);
			});
		}
		else
		{
			$(window).off('scroll');
		}
	}

	/**
	 * update page
	 * 변경된 페이지 번호로 url 업데이트 한다.
	 *
	 * @param {Number} page
	 */
	function updatePage(page)
	{
		if (!URL) return;

		let url = new URL(window.location.href);
		let urlParams = url.searchParams;
		let urlPage = url.searchParams.get('page');
		urlPage = urlPage ? parseInt(urlPage) : 1;

		if (page === urlPage) return;

		if (page === 1)
		{
			urlParams.delete('page');
		}
		else
		{
			urlParams.set('page', page);
		}

		let newUrl = location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');

		console.log(newUrl);

		// update url
		appHistory.replace({ url: newUrl, type: 'index' }, null, newUrl);
	}

	/**
	 * METHODS
	 */

	/**
	 * init
	 *
	 * @param {Object} options
	 */
	this.init = function(options={})
	{
		if (!this.$articles.length) return false;

		// set srls
		this.srls.nest = options.nest_srl;
		this.srls.category = options.category_srl;

		// set options
		this.options.size = options.size || LOAD_PAGE_PER_SIZE;

		// set toggle category for mobile
		this.$category.children('.categories__toggle').on('click', toggleCategory);

		// initial history pop state event
		appHistory.initPopEvent();

		// set masonry
		masonry();

		self.$more.children('a').attr('href', 'javascript:;');

		// set more articles event
		moreButton(true);

		// set change page sensor
		scrollEvent(true);
	};

	this.changePage = function(page)
	{};

	this.prevPage = function()
	{};

	this.nextPage = function()
	{};

}