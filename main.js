/*!
 * main.js
 */
;(function ($, window, undefined) {	
	
	$(document).ready( function () {
		/*
		 * 最後に追加したお気に入りの詳細ページへ飛ぶボタン
		 */
		(function () {
			var $showFavorite  = $('.favoriteButton')
			,   cookie = $.cookie('id')
			;

			//TODO 文字列'id'を使わずReadJson.idNameを使う
			if (cookie){
				var cookieArr = cookie.split("-");
				var lastId = cookieArr[cookieArr.length - 1];
				$showFavorite.attr('href', 'detail.php?id=' + lastId);

				//TODO debug 後から削除
				$showFavorite.on('click', function (e) {
					e.preventDefault();
					alert('linkへ飛ぶ: detail.php?id=' + lastId);
				});

			} else {
				$showFavorite.addClass('disabled');
				//リンクを無効化
				$showFavorite.on('click', function (e) {
					e.preventDefault();
				});
			}
		})();
		
		
		
		/*
		 * readJson
		 * Ajax読み込み
		 */
		(function () {
			//インスタンス作成
			var readJson = new MY.ui.ReadJson({
			    templateSelector: '#jQueryTemplate' //{selector}
			,   OutputSelector: '#jQueryTemplateOutput' //{selector}
			,   dataPath: 'data.json' //{string}
			,   idName: 'id' //{string}
			});

			var $contents        = $('#contents')
			,   $loadButton      = $contents.find($('.loadButton'))
			,   $iterationSelect = $contents.find($('.iterationButton'))
			,   $iterationPrev   = $contents.find($('.iterationPrev'))
			,   $iterationNext   = $contents.find($('.iterationNext'))
			,   addFavoriteSelector = '.addFavoriteButton'
			;

			/*
			 * Click Event
			 */
			//click $loadButton
			$loadButton.on('click', function (e) {
				var query = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
				readJson.loadBind(query);
				e.preventDefault();
			});

			//click addFavoriteSelector ($.delegate)
			$contents.on('click', addFavoriteSelector, function (e) {
				readJson.setCookie(this.value);
				e.preventDefault();
			});

			//change $iterationSelect
			$iterationSelect.on('change', function (e) {
				var index = $(this).val() - 1;
				readJson.iteration(index);
				e.preventDefault();
			});

			//click $iterationPrev
			$iterationPrev.on('click', function (e) {
				var index = readJson.index - 1
				readJson.iteration(index, 'nullIsNotUpdate');
				e.preventDefault();
			});

			//click $iterationNext
			$iterationNext.on('click', function (e) {
				var index = readJson.index + 1
				readJson.iteration(index, 'nullIsNotUpdate');
				e.preventDefault();
			});


			/*
			 * debug
			 * TODO debug後に削除
			 */
			var debugMsg = null;

			readJson.debug('.cookie', readJson.cookieArray);
			readJson.debug('.query', readJson.queryObj);

			$(window).on('click', function () {
				readJson.debug('.cookie', readJson.cookieArray);

				if (debugMsg) {
					readJson.debug('.query', debugMsg);
					debugMsg = null;
				} else {
					readJson.debug('.query', readJson.queryObj);
				}

			});
			//end debug
		})();
		
	});//end document ready

})(jQuery, this);
