/*!
 * main.js
 */
;(function ($, window, undefined) {
	//インスタンス作成
	var readJson = new MY.ui.ReadJson();
	
	$(document).ready( function () {
		readJson.jqTemplateSelector  = '#jQueryTemplate';
		readJson.jqOutputSelector    = '#jQueryTemplateOutput';
		
		var $contents        = $('#contents')
		,   $loadButton      = $contents.find($('.loadButton'))
		,   $showFavorite  = $contents.find($('.favoriteButton'))
		,   $iterationSelect = $contents.find($('.iterationButton'))
		,   $iterationPrev   = $contents.find($('.iterationPrev'))
		,   $iterationNext   = $contents.find($('.iterationNext'))
		,   addFavoriteSelector = '.addFavoriteButton'
		;
		
		
		/*
		 * Click Event
		 */
		//click $loadButton
		$loadButton.on('click', function () {
			var query = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			readJson.loadBind(query);
		});
		
		//click $showFavorite
		$showFavorite.on('click', function () {
			var query = readJson.cookieArray;
			readJson.loadBind(query);
		});
		
		//click addFavoriteSelector ($.delegate)
		$contents.on('click', addFavoriteSelector, function () {
			readJson.setCookie(this.value);
		});
		
		//change $iterationSelect
		$iterationSelect.on('change', function () {
			var index = $(this).val() - 1;
			readJson.iteration(index);
		});
		
		//click $iterationPrev
		$iterationPrev.on('click', function () {
			var index = readJson.index - 1
			readJson.iteration(index, 'nullIsNotUpdate');
		});
		
		//click $iterationNext
		$iterationNext.on('click', function () {
			var index = readJson.index + 1
			readJson.iteration(index, 'nullIsNotUpdate');
		});
		
		
		/*
		 * debug
		 * TODO debug後に削除
		 */
		readJson.debug('.cookie', readJson.cookieArray);
		readJson.debug('.query', readJson.queryObj);
		
		$(window).on('click', function () {
			readJson.debug('.cookie', readJson.cookieArray);
			readJson.debug('.query', readJson.queryObj);
		});
		//end debug
		
	});

})(jQuery, this);
