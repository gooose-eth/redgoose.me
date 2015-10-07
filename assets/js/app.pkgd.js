function Article(){var e=$("#Article"),t=($("body"),{close:e.find("button.closeView"),prev:e.find("button.prevView"),next:e.find("button.nextView"),like:e.find("button.likeArticle")}),o=$("html");window.view=null,this.init=function(e){if(o.addClass("mode-view"),$("#topNav").addClass("on"),t.close.on("click",function(){return log("for Article.class.js"),window.location.href=e.urls.close,!1}),e.urls.prev?t.prev.removeClass("disabled").on("click",function(){return window.location.href=e.urls.prev,!1}):t.prev.off("click"),e.urls.next?t.next.removeClass("disabled").on("click",function(){return window.location.href=e.urls.next,!1}):t.next.off("click"),o.on("keyup.gooseView",function(t){switch(t.keyCode){case 27:window.location.href=e.urls.close;break;case 37:e.urls.prev&&(window.location.href=e.urls.prev);break;case 39:e.urls.next&&(window.location.href=e.urls.next)}}),history.pushState){var i=window.location.pathname+window.location.search;window.history.pushState({type:"index",url:e.urls.close},e.title,e.urls.close),window.history.pushState({type:"article",url:i},$("title").text(),i)}},this.onLike=function(e,t){$.get(this.root+"/updateLike/"+e,function(e){e=JSON.parse(e),"success"==e.state?(t.text(e.count),t.parent().addClass("disabled")):log(e)})},this.destroy=function(){}}

function Index(o){var t=this,e={items:$("#items"),body:$("html, body"),category:$("#categoryList"),loading:null};window.article=new Article,article.root=o.root;var i=function(o,t){var e="";return e+=470==o?" wx2":"",e+=470==t?" hx2":""};if(this.updateUrl=function(o){var t=null,e=o.split("?"),i="";t=e[1]?JSON.parse('{"'+decodeURI(e[1]).replace(/"/g,'\\"').replace(/&/g,'","').replace(/=/g,'":"')+'"}'):new Object,t.page=t.page?parseInt(t.page)+1:2;for(var n in t)""!=i&&(i+="&"),i+=n+"="+t[n];return t=i,e[0]+"?"+t},this.loadItems=function(n,a){$.ajax({type:"get",url:n,dataType:"json",timeout:3e3,error:function(o,t,e){log("error message"),log(e)},success:function(n,r,l){for(var s="",d=null,w=null,c=0;c<n.length;c++)w=i(n[c].width,n[c].height),s+=n[c].more?'<a href="#" class="item more" title="more item"><span><em><i>More item</i></em></span></a>':'<div class="item'+w+'"><a href="'+n[c].url+'"><img src="'+n[c].img+'" alt="'+n[c].title+'" /></a></div>';d=$(s),d.not("div.more").children("a").on("click",function(t){return window.history.pushState&&window.history.pushState({type:"index",url:window.location.pathname+window.location.search},o.title,window.location.pathname+window.location.search),$(this).closest("div.item").addClass("view"),view.open($(this).attr("href"),!0),!1}),d.filter(".more").on("click",function(i){var n=$(this);o.loadItemsUrl=t.updateUrl(o.loadItemsUrl);var a=t.updateUrl(window.location.pathname+location.search);return window.history.pushState&&window.history.pushState({},o.title,a),window.gotoTop=n.offset().top,n.off("click"),n.addClass("loading"),e.loading=n,t.loadItems(o.loadItemsUrl,function(){n.next().find("a").focus()}),!1}),d.imagesLoaded(function(){e.loading&&(masonry.remove(e.loading),e.loading=null),masonry?e.items.masonry().append(d).masonry("appended",d).masonry("layout"):(e.items.append(d).masonry(masonryOptions),masonry=e.items.data("masonry"),masonry.on("layoutComplete",window.masonryLayoutComplete)),a&&a()})}})},window.masonryLayoutComplete=function(){window.gotoTop&&(window.gotoTop=window.gotoTop-o.paddingTop,e.body.animate({scrollTop:window.gotoTop},400,"swing"),window.gotoTop=null)},$("body").append('<div id="View_bg"></div><section id="View"></section>'),window.view=new View(o),window.masonryOptions={itemSelector:".item",columnWidth:".grid-sizer"},window.masonry=null,$("#toggleCategory").on("click",function(){$(this).toggleClass("on"),e.category.children("ul").toggleClass("on")}),this.loadItems(o.loadItemsUrl),window.history.pushState){var n=window.location.pathname+window.location.search;window.history.pushState({type:"index"},o.title,n)}}

var View=function(t){var e=this,a={index:$("#Index"),items:$("#items"),view:$("#View"),bg:$("#View_bg"),title:$("head > title"),topNav:$("#topNav"),body:$("html, body")},i=300,o=$("html");this.active=!1,this.path=null;var s=function(){},n=function(t){t.attr("data-prev")?$("button.prevView").removeClass("disabled"):$("button.prevView").addClass("disabled"),t.attr("data-next")?$("button.nextView").removeClass("disabled"):$("button.nextView").addClass("disabled")},d=function(t,i,o){e.path=window.location.pathname+window.location.search,t&&window.history.pushState&&(a.title.text(i),window.history.pushState({type:"article",url:o},i,o))};this.open=function(t,s){e.active=!0,o.removeClass("scroll"),a.view.show(),a.bg.fadeIn(i,function(){masonry&&(masonry.destroy(),masonry=null),a.index.hide(),a.view.load(t+" #Article",function(){$("html").addClass("mode-view"),$("#topNav").addClass("on"),d(s,$(this).children().attr("data-title"),t),n($(this).children())})}),o.on("keyup.gooseView",function(t){var i=a.view.children();switch(t.keyCode){case 27:e.close();break;case 37:i.attr("data-prev")&&e.go(i.attr("data-prev"));break;case 39:i.attr("data-next")&&e.go(i.attr("data-next"))}})},this.close=function(o){e.active=!1,$("button.closeView").off("click"),$("html").off("keyup.gooseView").addClass("scroll"),$("#topNav").removeClass("on"),a.index.show(),a.items.masonry(masonryOptions),window.masonry=a.items.data("masonry"),masonry.on("layoutComplete",window.masonryLayoutComplete),a.bg.fadeOut(i),a.view.fadeOut(i,function(){$("html").removeClass("mode-view"),$(this).empty();var e=a.items.children("div.view"),i=e.offset().top-t.paddingTop;i>220&&a.body.scrollTop(i),e.removeClass("view")}),o&&window.history.pushState&&(a.title.text(t.title),window.history.pushState({type:"index",url:e.path},t.title,e.path)),e.path=null},this.go=function(t){a.view.load(t+" #Article",function(){d(!0,$(this).children().attr("data-title"),t),n($(this).children())})},s()};

jQuery(function(e){"ontouchstart"in document.documentElement?e("html").addClass("touch"):e("html").addClass("no-touch"),e("#toggleNavigation").on("click",function(){e("#header > nav.lnb").toggleClass("on")});var t=e("html.touch #header > nav.lnb"),n=!1;t.find("> ul.dep1 > li > a").on("touchend click",function(){var t=e(this).parent();return n||(n=!0,setTimeout(function(){n=!1},200),e(window).width()>640&&(t.hasClass("on")?t.removeClass("on"):(t.parent().children().removeClass("on"),t.addClass("on")))),!1}),e("#header > nav.lnb > ul.dep1 > li").on("focusin",function(){e(this).addClass("on")}).on("focusout",function(){e(this).removeClass("on")}),e(window).on("popstate",function(t){var n=t.originalEvent.state;if(n)switch(n.type){case"index":try{view.active&&view.close(!1)}catch(i){location.reload()}break;case"article":try{view&&(e("#items").find('a[href="'+n.url+'"]').closest("div.item").addClass("view"),view.open(n.url,!1))}catch(i){location.reload()}}}),e("#header li.active").closest("div").parent().addClass("active"),e(window).on("resize",function(){e(window).width()<640?e("html").addClass("mini"):e("html").removeClass("mini")}),e(window).trigger("resize");var i=e("body");try{i.on("click","button.closeView",function(){view.close(!0)}),i.on("click","button.likeArticle",function(){if(!e(this).hasClass("disabled")){var t=parseInt(e(this).attr("data-srl"));article.onLike(t,e(this).children("em"))}}),i.on("click","button.prevView",function(){e(this).hasClass("disabled")||view.go(e("#Article").attr("data-prev"))}),i.on("click","button.nextView",function(){e(this).hasClass("disabled")||view.go(e("#Article").attr("data-next"))})}catch(a){}!function(e,t,n,i,a,o,s){e.GoogleAnalyticsObject=a,e[a]=e[a]||function(){(e[a].q=e[a].q||[]).push(arguments)},e[a].l=1*new Date,o=t.createElement(n),s=t.getElementsByTagName(n)[0],o.async=1,o.src=i,s.parentNode.insertBefore(o,s)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-42563094-1","redgoose.me"),ga("send","pageview")});
//# sourceMappingURL=app.pkgd.js.map
