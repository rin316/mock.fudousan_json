/*!
 * main.js
 */
;(function ($, window, MY, undefined) {

	var setting = {
		favCookieId: 'id'
	,	dataJson: 'json.php'
	};
	
	$(document).ready( function () {

		/**
		 * Modal window setup
		 */
		(function () {
			$.ui.domwindowdialog.setup({
				selector_close: '.ui-domwindow-close'
			});
		})();


		/*
		 * 最後に追加したお気に入りの詳細ページ へ飛ぶボタン
		 */
		(function () {
			var $showFavorite  = $('.favoriteButton')
			,   cookie = $.cookie(setting.favCookieId)
			;

			if (cookie){
				var cookieArr = cookie.split("-");
				var lastId = cookieArr[cookieArr.length - 1];
				$showFavorite.attr('href', 'detail.php?' + setting.favCookieId + '=' + lastId);

				//TODO debug リンクを無効 後から削除
				$showFavorite.on('click', function (e) {
					alert('linkへ飛ぶ: detail.php?id=' + lastId);
					e.preventDefault();
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
			var modalTemplate = '#modalTemplate';

			//インスタンス作成
			var readJson = new MY.ui.ReadJson({
			    templateSelector: '#jQueryTemplate' //{selector}
			,   OutputSelector: '#jQueryTemplateOutput' //{selector}
			,   dataPath: setting.dataJson //{string}
			,   idName: setting.favCookieId //{string}
			});

			var $contents           = $('#contents')
			,   $loadButton         = $contents.find($('.loadButton'))
			,   $loadButton2        = $contents.find($('.loadButton2'))
			,   $showFavButton      = $contents.find($('.showFavButton'))
			,   iterationPrev       = '.iterationPrev'
			,   iterationNext       = '.iterationNext'
			,   addFavorite         = '.addFavoriteButton'
			,   detailsButton       = '.detailsButton'
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
			
			//click $loadButton2
			$loadButton2.on('click', function (e) {
				var query = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
				readJson.loadBind(query, 0);
				e.preventDefault();
			});

			//click $showFavButton
			$showFavButton.on('click', function (e) {
				var query = readJson.cookieArray;
				readJson.loadBind(query);
				e.preventDefault();
			});

			//click addFavorite ($.live)
			//readJsonとreadJsonModal(モーダルウィンドウ)にも適用
			$(document).on('click', addFavorite, function (e) {
				readJson.setCookie(this.value);
				e.preventDefault();
			});

			//click iterationPrev ($.delegate)
			$contents.on('click', iterationPrev, function (e) {
				var index = readJson.index - 1;
				readJson.iteration(index);
				e.preventDefault();
			});

			//click iterationNext ($.delegate)
			$contents.on('click', iterationNext, function (e) {
				var index = readJson.index + 1;
				readJson.iteration(index);
				e.preventDefault();
			});

			//click detailsButton ($.delegate)
			$contents.on('click', detailsButton, function (e) {
				var __this = this;

				//modal作成
				window.domwindowApi.open(modalTemplate, {
					width: 800
				,	height: 400
				,   afteropen: function(e, data){
						data.dialog.append('<div id="jQueryTemplateOutputModal"></div>');

						var $modal = $('.ui-domwindowdialog');

						//modal用のインスタンス作成
						var readJsonModal = new MY.ui.ReadJson({
							templateSelector: '#jQueryTemplateModal' //{selector}
							,   OutputSelector: '#jQueryTemplateOutputModal' //{selector}
							,   dataPath: setting.dataJson //{string}
							,   idName: setting.favCookieId //{string}
								//inheritance readJson
							,   res: readJson.res
						});

						var index = __this.value - 1;
						readJsonModal.iteration(index);

						//click iterationPrev ($.delegate)
						$modal.on('click', iterationPrev, function (e) {
							var index = readJsonModal.index - 1;
							readJsonModal.iteration(index);
							e.preventDefault();
						});

						//click iterationNext ($.delegate)
						$modal.on('click', iterationNext, function (e) {
							var index = readJsonModal.index + 1;
							readJsonModal.iteration(index);
							e.preventDefault();
						});

					}
				});

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

})(jQuery, this, mockFudousan);
