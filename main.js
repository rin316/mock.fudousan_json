/*!
 * main.js
 */
;(function ($, window, undefined) {
	var ReadJson = MY.ui.ReadJson;
	
	//インスタンス作成
	var readJson = new ReadJson();
	
	$(document).ready( function () {
		readJson.$contents        = $('#contents');
		readJson.addFavoriteSelector = '.addFavoriteButton';
		readJson.jqTemplateSelector  = '#jQueryTemplate';
		readJson.jqOutputSelector    = '#jQueryTemplateOutput';
		
		var $loadButton      = readJson.$contents.find($('.loadButton'))
		,   $favoriteButton  = readJson.$contents.find($('.favoriteButton'))
		,   $iterationSelect = readJson.$contents.find($('.iterationButton'))
		,   $iterationPrev   = readJson.$contents.find($('.iterationPrev'))
		,   $iterationNext   = readJson.$contents.find($('.iterationNext'))
		;
		
		
		
		/*
		 * Click Event
		 */
		//click $loadButton
		$loadButton.on('click', function () {
			var query = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			readJson.loadBind(query);
		});
		
		//click $favoriteButton
		$favoriteButton.on('click', function () {
			var query = readJson.cookieArray;
			readJson.loadBind(query);
		});
		
		//change $iterationSelect
		$iterationSelect.on('change', function () {
			var index = $(this).val() - 1;
			readJson.iteration(index);
		});
		
		//click $iterationPrev
		$iterationPrev.on('click', function () {
			var index = readJson.index - 1
			readJson.iteration(index);
		});
		
		//click $iterationNext
		$iterationNext.on('click', function () {
			var index = readJson.index + 1
			readJson.iteration(index);
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
