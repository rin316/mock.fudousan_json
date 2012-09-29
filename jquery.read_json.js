/*!
 * jquery.read_json.js
 */
var MY = {};

;(function ($, window, undefined) {
	MY.ui = {
		ReadJson: (function () {
			var ReadJson;
			
			ReadJson = function () {
				var __this = this;
				
				__this.dataPath            = 'data.json';
				__this.idName              = 'id';
				
				//cookieからidを読み込み配列化  cookieが無ければ空の配列を作成
				__this.cookieArray = ($.cookie(__this.idName)) ? $.cookie(__this.idName).split("-"): [];
				
				__this.res      = null;//Ajax response
				__this.queryObj = null;//Ajax send 'data:' query object
				__this.index    = null;//iteration index

				return __this;
			}

			ReadJson.prototype = {
				/**
				 * loadBind
				 * Ajax読み込み,描画メソッドを1つにバインド
				 * @param {string, array} query ajax呼び出し時に送信するオブジェクトの、元になる文字列や配列
				 * @return {Instance Object}
				 * @see init
				 */
				loadBind: function (query) {
					var __this = this;

					//reset
					__this.index = null;

					//読み込み完了時
					__this.request(query).then(function (res) {
						__this.res = res;

						//status:'success'以外なら処理を停止
						if(!__this.statusValidation(res.status)){ return false }

						//描画
						__this.draw(__this.res, __this.jqTemplateSelector, __this.jqOutputSelector);

					//読み込み失敗時
					}, function () {
						console.log('Ajax読み込みエラーです。');
					});

					return __this;
				}
				,

				/**
				 * request
				 * 任意のタイミングでJSONに問い合わせる
				 * @param {string, array} query ajax呼び出し時に送信するオブジェクトの、元になる文字列や配列
				 * @return {Instance Object}
				 * @see loadBind
				 */
				request: function (query) {
					var __this = this
					,   defer = $.Deferred()
					;

					//queryをobjectに変換
					__this.queryObj = {};
					__this.queryObj[__this.idName] = query;

					$.ajax({
						url: __this.dataPath,
						data: __this.queryObj,
						dataType: 'json',
						type: 'GET',
						success: defer.resolve,
						error: defer.reject
					});
					return defer.promise();
				}
				,

				/*
				 * statusValidation
				 * 取得したデータのstatus:'success'ならtrueを、それ以外ならfalseを返す
				 * @param {string} status 取得したデータのstatus値
				 * @return {Boolean}
				 * @see loadBind
				 */
				statusValidation: function (status) {
					if (status === 'success'){
						return true;
					} else {
						console.log('status: ' + status);
						return false;
					}
				}
				,

				/*
				 * draw
				 * 取得したデータを描画する
				 * @param {object} res ajaxをリクエストし返ってきたdata
				 * @param {string} templateId jQueryTemplate テンプレートid
				 * @param {string} outputId jQueryTemplate テンプレートを出力するid
				 * @return {Instance Object}
				 * @see loadBind, iteration
				 */
				draw: function (res, templateId, outputId) {
					var __this = this
					,   $outputArea = $(outputId)
					;

					//既に挿入された要素があれば削除
					$outputArea.find($('.ajaxDraw')).remove();
					$(templateId).tmpl(res.results).hide().appendTo($outputArea).fadeIn(700).addClass('ajaxDraw');

					//描画後、お気に入りボタンにイベントを設定
					__this.addFavoriteEvent();

					return __this;
				}
				,

				/*
				 * addFavoriteEvent
				 * 描画されたお気に入りボタンにイベントを設定
				 * @return {Instance Object}
				 * @see draw
				 */
				addFavoriteEvent: function () {
					var __this = this;

					//$addFavoriteButton 定義
					__this.$addFavoriteButton = $(__this.addFavoriteSelector);

					//click $addFavoriteButton
					__this.$addFavoriteButton.on('click', function () {
						__this.setCookie(this.value);
					});

					return __this;
				}
				,

				/*
				 * setCookie
				 * cookieにidを配列としてセットする。すでにidがあれば配列から削除する。
				 * @param {string} id 「お気に入りに追加」が押された時のボタンのvalue
				 * @param {string} limitedControl
				 *     default:  cookieへの追加と削除の両方が有効
				 *     'add':    cookieへの追加のみ有効
				 *     'remove': cookieへの削除のみ有効
				 * @return {Instance Object}
				 * @see addFavoriteEvent
				 */
				setCookie: function (id, limitedControl) {
					var __this = this;

					if (!__this.cookieEnabled) {
						alert('cookieが無効です。この機能を使うにはcookieを有効にしてください');
						return false
					}

					//cookieから作成した配列にidがなければ配列に追加
					if( $.inArray(id, __this.cookieArray) == -1) {
						if (limitedControl !== 'remove') {
							//既に10件以上の登録があれば一番古い登録を破棄
							if (__this.cookieArray.length >= 10) { __this.cookieArray.shift(); }
							//配列に追加
							__this.cookieArray.push(id);
						}
					//cookie内に既にidが存在すれば配列から削除
					} else {
						if (limitedControl !== 'add') {
							__this.cookieArray.splice($.inArray(id, __this.cookieArray), 1)
						}
					}

					//ハイフン区切りで連結しcookieに格納
					$.cookie(__this.idName, __this.cookieArray.join("-"));

					return __this;
				}
				,

				/*
				 * cookieEnabled
				 * クッキーが利用できればtrueを、できなければfalseを返す
				 * @return {Boolean}
				 * @see setCookie
				 */
				cookieEnabled: (function () {
					$.cookie('cookiecheck', 'set');
					result = ($.cookie('cookiecheck') === 'set') ? true : false;
					$.cookie('cookiecheck', null);
					return result;
				})()
				,

				/*
				 * iteration
				 * index番目の項目だけを表示
				 * @param {Number} index 表示させたい要素のindex番号
				 * @return {Instance Object}
				 * @see init
				 */
				iteration: function (index) {
					var __this = this
					,   indexRes
					;
					
					if (!__this.res) { return false; }
					//nullなら抜ける,  0より小さい場合は抜ける,  取得した要素の数より大きければ抜ける
					if (__this.index === null || index < 0 || index > __this.res.results.length - 1) { return false; }
					__this.index = index;
					//Object deep copy
					indexRes = $.extend(true, {}, __this.res); 
					//results配列からindex番目の要素だけを残し削除
					indexRes.results.splice(0, indexRes.results.length, __this.res.results[__this.index]);
					//描画
					__this.draw(indexRes, __this.jqTemplateSelector, __this.jqOutputSelector);
					
					return __this;
				}
				,

				//-----------------------------------------
				//TODO debugが終わったら削除
				//-----------------------------------------
				/*
				 * debug
				 * @see init
				 */
				debug: function (selector, variable) {
					var __this = this;
					
					//debug領域に値を表示
					if ($.type(variable) === 'object') {
						$(selector).html(trace(variable));
					} else {
						$(selector).html(variable);
					}
					
					//渡されたobjectをconsole.logのように見やすい文字で出力
					function trace(s){
						//queryが空なら抜ける
						if (!__this.queryObj){ return false }
						var mylog = [];
						function getIndent(num){
							var ind = [];
							while(num){
								ind.push('	');
								num--;
							}
							return ind.join('');
						}
						function addLog(txt, defaultIndent){
							var cnt = defaultIndent;
							//array
							if((typeof txt == 'object') && (txt instanceof Array)){
								cnt++;
								mylog.push('[');
								for(var i = 0; i < txt.length; i++){
									mylog.push('\r\n' + getIndent(cnt));
									addLog(txt[i], cnt);
									if(i != txt.length - 1){
										mylog.push(',');
									}
								}
								mylog.push('\r\n' + getIndent(cnt - 1) + ']');
							//object
							}else if((typeof txt == 'object')){
								cnt++;
								mylog.push('{');
								for(var i in txt){
									mylog.push('\r\n' + getIndent(cnt) + i + ':');
									addLog(txt[i], cnt);
									mylog.push(',');
								}
								mylog.pop();
								mylog.push('\r\n' + getIndent(cnt - 1) + '}');
							}else{
								mylog.push(txt);
							}
						}
						addLog(s, 0);
						//console.log(mylog.join(''));
						//alert(mylog.join(''));
						return mylog.join('');
					}
					
					return __this;
				}//-----------------------------------------
				////end debug
				//-----------------------------------------
			}
			
			return ReadJson;
			
		})()
	}

})(jQuery, this);
