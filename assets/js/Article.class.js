function Article()
{
	var self = this;
	var $self = $('#Article');
	var $body = $('body');
	var $btns = {
		close : $self.find('button.closeView')
		,prev : $self.find('button.prevView')
		,next : $self.find('button.nextView')
		,like : $self.find('button.likeArticle')
	};
	var $html = $('html');

	window.view = null;

	this.init = function(userData)
	{
		// set class
		$html.addClass('mode-view');
		$('#topNav').addClass('on');

		// close button event
		$btns.close.on('click', function(){
			window.location.href = userData.urls.close;
			return false;
		});

		// prev button event
		if (userData.urls.prev)
		{
			$btns.prev
				.removeClass('disabled')
				.on('click', function(){
					window.location.href = userData.urls.prev;
					return false;
				})
			;
		}
		else
		{
			$btns.prev.off('click');
		}

		// next button event
		if (userData.urls.next)
		{
			$btns.next
				.removeClass('disabled')
				.on('click', function(){
					window.location.href = userData.urls.next;
					return false;
				})
			;
		}
		else
		{
			$btns.next.off('click');
		}

		// keyboard event
		$html.on('keyup.gooseView', function(e){
			switch(e.keyCode)
			{
				case 27:
					// esc
					window.location.href = userData.urls.close;
					break;
				case 37:
					// left
					if (userData.urls.prev)
					{
						window.location.href = userData.urls.prev;
					}
					break;
				case 39:
					// right
					if (userData.urls.next)
					{
						window.location.href = userData.urls.next;
					}
					break;
			}
		});

		// update url
		if (history.pushState)
		{
			var path = window.location.pathname + window.location.search;
			window.history.pushState({
				type : 'index'
				,url : userData.urls.close
			}, userData.title, userData.urls.close);

			window.history.pushState({
				type : 'article'
				,url : path
			}, $('title').text(), path);
		}
	};

	// update like
	this.onLike = function(srl, $target)
	{
		$.get(this.root + '/updateLike/' + srl, function(res){
			res = JSON.parse(res);
			if (res.state == 'success')
			{
				$target.text(res.count);
				$target.parent().addClass('disabled');
			}
			else
			{
				log(res);
			}
		});
	};

	this.destroy = function()
	{

	}
}
