
// --------------------------------------------------------------------
//
// DIV表示クラス
//
// --------------------------------------------------------------------
var clsBaseBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_BOX_ERRMSG_DSP		= true;

		this._DEF_BOX_SAVE_STYLE		= [
				  'width'
				, 'height'
				, 'left'
				, 'top'
				, 'background-color'
			];

		this._DEF_BOX_REGEXP			= [
				 [ '(&)'				, '&#x26;']		// アンパサンド
				,[ '(<)'				, '&#x3C;']		// 小なり
				,[ '(>)'				, '&#x3E;']		// 大なり
				,[ "(')"				, '&#x27;']
				,[ '(`)'				, '&#x60;']
				,[ '(")'				, '&quot;']
		];

		// 画像ファイルパス
		this._DEF_PATH_IMG				= _C_DRAWDIAGRAM_IMG_PATH;

		// メニューID
		this._DEF_MENU_ID_NORMAL		= 'normal';
		this._DEF_MENU_ID_MOVE			= 'move';

		this._BoxId						= '';
		this._BoxKind					= '';

		this._BoxArgument				= {};
		this._BoxLoadData				= {};
		this._BoxProperty				= {};
		this._BoxEvents					= [];

		this._BoxWindow					= null;
		this._BoxDocument				= null;
		this._BoxBody					= null;
		this._BoxParent					= null;
		this._BoxElement				= null;


		// **************************************************************
		// イベント
		// **************************************************************

		// イベント無効化用
		this.eventInvalid = function( pEvent ) {
			try {
				// イベント停止
				return self.cancelEvent( pEvent, true );

			} catch(e) { alert(e.message); }

			return false;
		};


		// **************************************************************
		// コンストラクタ
		// **************************************************************

		// 初期処理
		this.initClass( pArgument );


	} catch(e) {
		// 例外時破棄
		throw { name: 'clsBaseBox.' + e.name, message: e.message };
	}
};

// prototype
(function(){

	// **************************************************************
	// プロパティに依存しない共通関数
	// **************************************************************

	// コンソールログ出力
	clsBaseBox.prototype.consoleLog = function( pLog ) {
		try {
			if ( typeof console == 'undefined' ) return;
			if ( typeof console.log !== 'function' ) return;
			
			console.log( pLog );

		} catch(e) {}
	}

	// 確認メッセージ表示
	clsBaseBox.prototype.dspConfirm = function( pMessage ) {
		try {
			return window.confirm( pMessage );

		} catch(e) {}
	};

	// 警告メッセージ表示
	clsBaseBox.prototype.dspAlert = function( pMessage ) {
		try {
			return window.alert( pMessage );

		} catch(e) {}
	};

	// エラーメッセージをalert表示
	clsBaseBox.prototype.catchErrorDsp = function( pError ) {
		try {
			if ( this._DEF_BOX_ERRMSG_DSP ) {
				alert( pError.message + '\n >> ' + pError.name );
			}
		} catch(e) {}
	};

	// 画像ファイルパス取得
	clsBaseBox.prototype.getImagePath = function() {
		try {
			var wImgPath = this._DEF_PATH_IMG;
			if ( wImgPath.slice(-1) != '/' ) wImgPath += '/';

			return wImgPath;

		} catch(e) {
			return '';
		}
	}

	// エラーを無視して処理実行
	clsBaseBox.prototype.execFunction = function( pFunction ) {
		try {
			if ( typeof pFunction !== 'function' ) return;
			
			var wArguments;
			if ( arguments.length > 0 ) {
				wArguments = Array.prototype.slice.call(arguments, 1);
			} else {
				wArguments = [];
			}

			pFunction.apply( this, wArguments );

		} catch(e) {}
	}

	// 配列かどうかチェック
	clsBaseBox.prototype.isArray = function( pArgument ) {
		try {
			// 配列かチェック
			if( pArgument instanceof Array ) {
				return true;
			
			} else {
				return false;
			
			}

		} catch(e) {
			throw { name: 'isArray', message: e.message };
		}
	};

	// オブジェクト（連想配列）かどうかチェック
	clsBaseBox.prototype.isObject = function( pArgument ) {
		try {
			// nullチェック
			if ( pArgument === null ) return false;

			// 配列かチェック
			if ( this.isArray(pArgument) ) return false;

			// 配列以外のObjectかチェック
			if ( pArgument instanceof Object ) {
				return true;

			// Objectを参照渡しした場合
			} else if ( typeof pArgument == 'object' ) {
				return true;
			
			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'isObject', message: e.message };
		}
	};

	// パラメータ取得
	clsBaseBox.prototype.getArgument = function( pArgument, pKey ) {
		try {
			if ( !this.isObject(pArgument) ) return null;
			
			if ( typeof pArgument[pKey] === 'undefined' ) {
				return null;
			} else {
				return pArgument[pKey];
			}

		} catch(e) {
			throw { name: 'getArgument', message: e.message };
		}
	};

	// パラメータ設定
	clsBaseBox.prototype.setArgumentInProperty = function( pArgument, pProperty ) {
		try {
			var wRetArgument = {};
			wRetArgument.property = pProperty;

			// 引数に設定されたパラメータを設定
			if ( this.isObject(pArgument) ) {
				for( var wKey in pArgument ) {
					if ( !pArgument.hasOwnProperty(wKey) ) continue;

					// propertyは個別に上書き
					if ( wKey == 'property' ) {
						var wArgProperty = pArgument[wKey];
						for( var wProperty in wArgProperty ) {
							if ( !wArgProperty.hasOwnProperty(wProperty) ) continue;
							wRetArgument.property[wProperty] = wArgProperty[wProperty];
						}

					} else {
						wRetArgument[wKey] = pArgument[wKey];

					}
				}
			}
			return wRetArgument;

		} catch(e) {
			throw { name: 'setArgumentInProperty', message: e.message };
		}
	};

	// プロパティを複写
	clsBaseBox.prototype.copyProperty = function( pSrcEle, pDstEle ) {
		try {
			if ( !this.isObject(pSrcEle) ) return false;
			if ( !this.isObject(pDstEle) ) return false;

			for( var key in pSrcEle ) {
				if ( !pSrcEle.hasOwnProperty(key) ) continue;

				// 配列
				if ( this.isArray(pSrcEle[key]) ) {
					pDstEle[key] = [];
					this.copyArray( pSrcEle[key], pDstEle[key] );

				// class
				} else if ( pSrcEle[key] instanceof clsBaseBox ) {
					// 参照を設定
					pDstEle[key] = pSrcEle[key];

				// object（連想配列）
				} else if ( this.isObject(pSrcEle[key]) ) {
					// objectは再帰
					pDstEle[key] = {};
					this.copyProperty( pSrcEle[key], pDstEle[key] );

				// 以外
				} else {
					// 値を複写
					pDstEle[key] = pSrcEle[key];

				}
			}
			return true;

		} catch(e) {
			throw { name: 'copyProperty', message: e.message };
		}
	};

	// 配列を複写
	clsBaseBox.prototype.copyArray = function( pSrcEle, pDstEle ) {
		try {
			if ( !this.isArray(pSrcEle) ) return false;
			if ( !this.isArray(pDstEle) ) return false;

			for( var wIdx = 0; wIdx < pSrcEle.length; wIdx++ ) {
				var wValue;

				// 配列
				if ( this.isArray(pSrcEle[wIdx]) ) {
					wValue = [];
					this.copyArray( pSrcEle[wIdx], wValue );

				// object（連想配列）
				} else if ( this.isObject(pSrcEle[wIdx]) ) {
					// objectは再帰
					wValue = {};
					this.copyProperty( pSrcEle[wIdx], wValue );

				// 以外
				} else {
					wValue = pSrcEle[wIdx];

				}

				if ( pDstEle.length > wIdx ) {
					pDstEle[wIdx] = wValue;

				} else {
					pDstEle.push( wValue );

				}
			}
			return true;

		} catch(e) {
			throw { name: 'copyArray', message: e.message };
		}
	};

	// 連想配列をKey順にソート
	clsBaseBox.prototype.sortNumObject = function( pObject ) {
		try {
			if ( !this.isObject(pObject) ) return pObject;

			var wKeyList = [];
			for( var wKey in pObject ) {
				if ( !pObject.hasOwnProperty(wKey) ) continue;

				wKeyList.push( wKey );
			}
			if ( wKeyList.length == 0 ) return pObject;
			
			// keyリストをソート
			wKeyList.sort( function(a, b) { return a - b; } );
			
			var wSortObj = {};
			for( var wIdx = 0; wIdx < wKeyList.length; wIdx++ ) {
				wSortObj[wKeyList[wIdx]] = pObject[wKeyList[wIdx]];
			}
			
			return wSortObj;

		} catch(e) {
			throw { name: 'sortNumObject', message: e.message };
		}
	};

	// 現日時を文字列で取得
	clsBaseBox.prototype.getNowDateTime = function( pFull ) {
		try {
			var wNow = new Date();

			var wRetStr = '';
			
			wRetStr += String(wNow.getFullYear()) + String(wNow.getMonth() + 1) + String(wNow.getDate());
			wRetStr += String(wNow.getHours()) + String(wNow.getMinutes()) + String(wNow.getSeconds());
			
			if ( pFull ) {
				wRetStr += String(wNow.getMilliseconds());

			}

			return wRetStr;

		} catch(e) {
			throw { name: 'getNowDateTime', message: e.message };
		}
	};

	// HTML文字列に変換
	clsBaseBox.prototype.toHtml = function( pText, pCrLf ) {
		try {
			if ( !pText ) return '';

			var wRetStr = pText;

			var wRegExp;
			for ( var wIdx = 0; wIdx < this._DEF_BOX_REGEXP.length; wIdx++ ) {
				wRegExp = new RegExp(this._DEF_BOX_REGEXP[wIdx][0], 'ig');
				wRetStr = wRetStr.replace(wRegExp, this._DEF_BOX_REGEXP[wIdx][1]);
			}

			// 改行変換
			if ( !pCrLf ) {
				wRetStr = wRetStr.replace(/\r?\n/g, '<br>');
			
			}

			return wRetStr;

		} catch(e) {
			throw { name: 'toHtml' + e.name, message: e.message };
		}
	};

	// ブラウザがIEか判定
	clsBaseBox.prototype.isIE = function() {
		try {
			// ブラウザ判定
			if ( !window.navigator ) return false;
			if ( !window.navigator.userAgent ) return false;
			
			var wAgent = window.navigator.userAgent.toLowerCase();

			// IE
			if ( (wAgent.indexOf('msie') != -1) || (wAgent.indexOf('trident') != -1) ) {
				return true;
			
			// 以外
			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'isIE', message: e.message };
		}
	};


	// -------------------
	// 要素操作
	// -------------------

	// Document要素を取得
	clsBaseBox.prototype.getDocument = function( pTgWindow ) {
		try {
			if ( !pTgWindow ) return null;

			var wDocument = null;
			if ( pTgWindow.document ) {
				wDocument = pTgWindow.document;

			} else if ( pTgWindow.contentWindow ) {
				wDocument = pTgWindow.contentWindow.document;

			} else if ( pTgWindow.contentDocument ) {
				wDocument = pTgWindow.contentDocument;

			}
			
			return wDocument;

		} catch(e) {
			throw { name: 'getDocument', message: e.message };
		}
	};

	// Documentのbody要素を取得
	clsBaseBox.prototype.getDocumentBody = function( pDocument ) {
		try {
			if ( !pDocument ) return null;

			var wBody = pDocument.body;
			if ( !wBody ) {
				wBody = pDocument.documentElement;
				if ( wBody ) {
					if ( wBody.body ) wBody = wBody.body;
				}
			}
			return wBody;

		} catch(e) {
			throw { name: 'getDocumentBody', message: e.message };
		}
	};

	// 要素を他要素の子へ設定
	clsBaseBox.prototype.appendElementToParent = function( pParent, pElement, pRefEle ) {
		try {
			if ( !pParent  ) return false;
			if ( !pElement ) return false;

			var wRefNode = pRefEle;
			if ( !wRefNode ) wRefNode = null;

			if ( pParent.insertBefore ) {
				pParent.insertBefore(pElement, wRefNode);

			} else if ( pParent.appendChild ) {
				pParent.appendChild(pElement);

			} else {
				throw { name: 'appendElementToParent', message: '親要素に要素を追加できません' };
			}
			return true;

		} catch(e) {
			throw { name: 'appendElementToParent', message: e.message };
		}
	};

	// 要素を削除
	clsBaseBox.prototype.delElement = function( pElement ) {
		try {
			if ( !pElement )  return false;

			var wParentEle = pElement.parentNode;
			if ( wParentEle ) {
				wParentEle.removeChild( pElement );
			}
			return true;

		} catch(e) {
			throw { name: 'delElement', message: e.message };
		}
	};

	// 要素のサイズ（width, height）を取得
	clsBaseBox.prototype.getSize = function( pElement, pParam ) {
		try {
			var wSize = { width: 0, height: 0 };

			if ( !pElement ) return wSize;
			
			var wBorder = true;
			var wOverflow = false;
			if ( pParam ) {
				if ( 'border' in pParam ) wBorder = pParam.border;
				if ( 'overflow' in pParam ) wOverflow = pParam.overflow;
			}

			// 一旦表示
			var wSavePos = { left: null, top: null };
			var wDisplay = this.getStyle( pElement, 'display' );
			if ( wDisplay == 'none' ) {
				wSavePos.left = this.getStyle( pElement, 'left' );
				wSavePos.top  = this.getStyle( pElement, 'top' );

				// 表示範囲外で一旦表示
				this.setStyle( pElement, { left: '-1000px', top: '-1000px', display: '' } );
			}

			// 隠れている領域を含む
			if ( wOverflow ) {
				wSize.width  = pElement.scrollWidth;
				wSize.height = pElement.scrollHeight;

				// 枠線を含む
				if ( wBorder ) {
					var wLine = this.getLine( pElement );
					if ( wLine ) {
						wSize.width  += wLine.left.width + wLine.right.width;
						wSize.height += wLine.top.width + wLine.bottom.width;
					}

				}

			} else {
				// 枠線を含む
				if ( wBorder ) {
					wSize.width  = pElement.offsetWidth;
					wSize.height = pElement.offsetHeight;
				
				// 枠線を含まない
				} else {
					wSize.width  = pElement.clientWidth;
					wSize.height = pElement.clientHeight;

				}

			}

			// 非表示に戻す
			if ( wDisplay == 'none' ) {
				this.setStyle( pElement, { left: wSavePos.left, top: wSavePos.top, display: 'none' } );
			}

			return wSize;

		} catch(e) {
			throw { name: 'getSize', message: e.message };
		}
	};

	// 要素の範囲（left, right, top, bottom）を取得
	clsBaseBox.prototype.getRect = function( pElement ) {
		try {
			if ( !pElement ) return null;

			var wClientRect = pElement.getBoundingClientRect();
			
			return {
				  left	: wClientRect.left
				, right	: wClientRect.right
				, top	: wClientRect.top
				, bottom: wClientRect.bottom
				, width	: wClientRect.width
				, height: wClientRect.height
			};

		} catch(e) {
			throw { name: 'getRect.' + e.name, message: e.message };
		}
	};

	// 要素の位置（left, top）を取得
	clsBaseBox.prototype.getPos = function( pElement ) {
		try {
			var wPoint = { left: 0, top: 0 };

			var wRect = this.getRect( pElement );
			if ( wRect ) {
				wPoint.left = wRect.left;
				wPoint.top  = wRect.top;

			}
			return wPoint;

		} catch(e) {
			throw { name: 'getPos', message: e.message };
		}
	};

	// 要素の位置（left, top）をStyleから取得
	clsBaseBox.prototype.getPosByStyle = function( pElement ) {
		try {
			var wPoint = { left: 0, top: 0 };

			var wPosEle = pElement;
			if ( !wPosEle ) return wPoint;

			var wLeft = String(wPosEle.style.left);
			if ( wLeft.length > 0 ) {
				var wLeftVal = String( wLeft.toLowerCase() );
				wPoint.left = Number( wLeft.toLowerCase().replace('px', '') );
			}

			var wTop = String(wPosEle.style.top);
			if ( wTop.length > 0 ) {
				wPoint.top  = Number( wTop.toLowerCase().replace('px', '') );
			}

			return wPoint;

		} catch(e) {
			throw { name: 'getPosByStyle', message: e.message };
		}
	};

	// 要素のスクロール量を取得
	clsBaseBox.prototype.getScroll = function( pElement ) {
		try {
			var wScroll = { x: 0, y: 0 };
			
			// 要素有効時のみ
			if ( pElement ) {
				wScroll.x = pElement.scrollLeft;
				wScroll.y = pElement.scrollTop;

			}
			return wScroll;

		} catch(e) {
			throw { name: 'getScroll.' + e.name, message: e.message };
		}
	};

	// 要素のスクロール量を設定
	clsBaseBox.prototype.setScroll = function( pElement, pScroll ) {
		try {
			// 要素有効時のみ
			if ( !pElement ) return;

			pElement.scrollLeft	= pScroll.x;
			pElement.scrollTop	= pScroll.y;

		} catch(e) {
			throw { name: 'setScroll.' + e.name, message: e.message };
		}
	};

	// 要素の位置ずらし量取得
	clsBaseBox.prototype.getShiftPos = function( pCenter, pEleSize ) {
		try {
			var wPosShift = { x: 10, y: 10 };

			if ( pEleSize ) {
				var wWidthVal	= 8;
				var wHeightVal	= 4;
				
				if ( pCenter ) {
					wWidthVal	= 2;
					wHeightVal	= 2;
				}

				wPosShift.x = Math.floor(pEleSize.width  / wWidthVal);
				wPosShift.y = Math.floor(pEleSize.height / wHeightVal);
			}

			return wPosShift;

		} catch(e) {
			throw { name: 'getShiftPos.' + e.name, message: e.message };
		}
	};

	// 指定位置に要素が存在するかチェック
	clsBaseBox.prototype.chkInPoint = function( pElement, pPoint ) {
		try {
			if ( !pElement ) return false;

			var wEleRect = this.getRect( pElement );
			if ( !wEleRect ) return false;

			if ( wEleRect.left <= pPoint.x && wEleRect.top <= pPoint.y ) {
				if ( wEleRect.right >= pPoint.x && wEleRect.bottom >= pPoint.y ) {
					return true;
				}
			}
			return false;

		} catch(e) {
			throw { name: 'chkBoxInPoint.' + e.name, message: e.message };
		}
	};

	// 要素同士の範囲が重複するかチェック
	clsBaseBox.prototype.chkInRect = function( pRect1, pRect2, pParam ) {
		try {
			if ( !pRect1 ) return false;
			if ( !pRect2 ) return false;

			var wOverflow = true;
			if ( this.isObject(pParam) ) {
				// はみ出し可否
				if ( 'overflow' in pParam ) wOverflow = pParam.overflow;
			}

			// はみ出し不可
			if ( !wOverflow ) {
				if ( pRect1.left   > pRect2.left   ) return false;
				if ( pRect1.right  < pRect2.right  ) return false;
				if ( pRect1.top    > pRect2.top    ) return false;
				if ( pRect1.bottom < pRect2.bottom ) return false;
			}

			// 範囲内に要素があるかチェック
			if ( pRect1.left <= pRect2.right && pRect1.right >= pRect2.left ) {
				if ( pRect1.top <= pRect2.bottom && pRect1.bottom >= pRect2.top ) {
					return true;
				}
			}
			
			return false;

		} catch(e) {
			throw { name: 'chkInRect.' + e.name, message: e.message };
		}
	};

	// 要素のスタイルを設定
	clsBaseBox.prototype.setStyle = function( pElement, pProperty ) {
		try {
			if ( !this.isObject(pElement) ) return false;
			if ( !this.isObject(pProperty) ) return false;

			for( var key in pProperty ) {
				if ( pProperty.hasOwnProperty(key) ) {
					if ( typeof pElement.style[key] !== 'undefined' ) {
						pElement.style[key] = pProperty[key];
					}
				}
			}
			return true;

		} catch(e) {
			throw { name: 'setStyle', message: e.message };
		}
	};

	// 要素のスタイルを取得
	clsBaseBox.prototype.getStyle = function( pElement, pStyleKey ) {
		try {
			if ( !this.isObject(pElement) ) return '';

			var wRetStyle = '';
			if ( typeof pElement.style[pStyleKey] !== 'undefined' ) {
				wRetStyle = pElement.style[pStyleKey];
			}

			return wRetStyle;

		} catch(e) {
			throw { name: 'getStyle', message: e.message };
		}
	};

	// 要素のラインスタイルを取得
	clsBaseBox.prototype.getLine = function( pElement ) {
		try {
			var wStyle = window.getComputedStyle( pElement );
			if ( !wStyle ) return null;

			function getLineStyle( pPos ) {
				try {
					var wBorderStyle = { style: '', color: '', width: 0 };

					if ( pPos.length > 0 ) pPos += '-';

					wBorderStyle.style = wStyle.getPropertyValue( 'border-' + pPos + 'style' );
					wBorderStyle.color = wStyle.getPropertyValue( 'border-' + pPos + 'color' );
					wBorderStyle.width = wStyle.getPropertyValue( 'border-' + pPos + 'width' );

					if ( String(wBorderStyle.width).length > 0 ) {
						wBorderStyle.width = Number( String(wBorderStyle.width).toLowerCase().replace('px','') );
					}
					return wBorderStyle;

				} catch(e) {
					throw { name: 'getLineStyle', message: e.message };
				}
			};

			var wRetStyle = getLineStyle( '' );

			wRetStyle.left   = getLineStyle( 'left' );
			wRetStyle.right  = getLineStyle( 'right' );
			wRetStyle.top    = getLineStyle( 'top' );
			wRetStyle.bottom = getLineStyle( 'bottom' );

			return wRetStyle;

		} catch(e) {
			throw { name: 'getLine.' + e.name, message: e.message };
		}
	};

	// 要素のラインスタイルを取得
	clsBaseBox.prototype.getStyleLine = function( pElement ) {
		try {
			var wStyle = null;
			if ( pElement ) {
				wStyle = pElement.style;
			}

			function getStyleValue( pStyle, pKey ) {
				try {
					var wValue = 0;

					if ( pKey in pStyle ) {
						wValue = pStyle[pKey];
					}
					return wValue;

				} catch(e) {
					throw { name: 'getStyleValue', message: e.message };
				}
			};

			function getLineStyle( pStyle, pPos ) {
				try {
					var wBorderStyle = { style: '', color: '', width: 0 };
					if ( !pStyle ) return wBorderStyle;

					wBorderStyle.style = getStyleValue( pStyle, 'border' + pPos + 'Style' );
					wBorderStyle.color = getStyleValue( pStyle, 'border' + pPos + 'Color' );
					wBorderStyle.width = getStyleValue( pStyle, 'border' + pPos + 'Width' );

					wBorderStyle.width = Number( wBorderStyle.width.toLowerCase().replace('px','') );

					return wBorderStyle;

				} catch(e) {
					throw { name: 'getLineStyle', message: e.message };
				}
			};

			var wRetStyle = getLineStyle( wStyle, '' );

			wRetStyle.left   = getLineStyle( wStyle, 'Left' );
			wRetStyle.right  = getLineStyle( wStyle, 'Right' );
			wRetStyle.top    = getLineStyle( wStyle, 'Top' );
			wRetStyle.bottom = getLineStyle( wStyle, 'Bottom' );

			return wRetStyle;

		} catch(e) {
			throw { name: 'getStyleLine.' + e.name, message: e.message };
		}
	};

	// 要素へclassを追加
	clsBaseBox.prototype.addClass = function( pElement, pClass ) {
		try {
			if ( typeof pElement.classList !== 'undefined' ) {
				pElement.classList.add( pClass );

			} else if ( typeof pElement.className !== 'undefined' ) {
				if ( pElement.className.length > 0 ) {
					pElement.className += ' ' + pClass;
				} else {
					pElement.className = pClass;
				}
			
			} else {
				throw { name: 'addClass', message: '要素へclassを設定できません' };

			}

		} catch(e) {
			throw { name: 'addClass', message: e.message };
		}
	};

	// 要素からclassを削除
	clsBaseBox.prototype.delClass = function( pElement, pClass ) {
		try {
			if ( typeof pElement.classList !== 'undefined' ) {
				pElement.classList.remove( pClass );

			} else if ( typeof pElement.className !== 'undefined' ) {
				if ( pElement.className.length > 0 ) {
					pElement.className = String(pElement.className).replace( pClass, '' ).replace( '  ', ' ' );
				}
			
			} else {
				throw { name: 'delClass', message: '要素からclassを削除できません' };

			}

		} catch(e) {
			throw { name: 'delClass', message: e.message };
		}
	};

	// 要素のclassを取得
	clsBaseBox.prototype.getClass = function( pElement ) {
		try {
			var wRetClass = null;
			if ( typeof pElement.classList !== 'undefined' ) {
				wRetClass = pElement.classList.value;

			} else if ( typeof pElement.className !== 'undefined' ) {
				wRetClass = pElement.className;

			}
			return wRetClass;

		} catch(e) {
			throw { name: 'getClass', message: e.message };
		}
	};

	// 要素のclassをチェック
	clsBaseBox.prototype.chkClass = function( pElement, pClass ) {
		try {
			var wExists = false;

			if ( typeof pElement.classList !== 'undefined' ) {
				wExists = pElement.classList.contains( pClass );

			} else if ( typeof pElement.className !== 'undefined' ) {
				var wChkPos;
				var wChkStr = String(pElement.className);
				var wChkLen = wChkList.length;

				// クラス有無
				for( var wIndex = 0; wIndex < wChkLen; wIndex++ ) {
					wChkPos = wChkStr.indexOf(pClass);
					if ( wChkPos == 0 ) break;

					wChkStr = wChkStr.substring( wChkPos + pClass.length );
					if ( (wChkStr.length == 0) || (wChkStr.substring(0,1) == ' ') ) {
						wExists = true;
						break;
					}

				}
			}
			return wExists;

		} catch(e) {
			throw { name: 'chkClass', message: e.message };
		}
	};


	// -------------------
	// イベント関連
	// -------------------

	// 要素にイベントを追加
	clsBaseBox.prototype.addEvent = function( pElement, pEvents, pFunction ) {
		try {
			var wEvtStr = String(pEvents);
			var wChkStr = wEvtStr.substring(0,2).toLowerCase();
			if( pElement.attachEvent ) {
				if ( wChkStr != 'on' ) wEvtStr = 'on' + wEvtStr;
				pElement.attachEvent( wEvtStr, pFunction );

			} else if( pElement.addEventListener ) {
				if ( wChkStr == 'on' ) wEvtStr = wEvtStr.substring(2);
				pElement.addEventListener( wEvtStr, pFunction, false );

			} else {
				throw { name: 'addEvent', message: 'No Event Add Function' };
			
			}
			return true;

		} catch(e) {
			throw { name: 'addEvent', message: e.message };
		}
	};

	// 要素からイベントを削除
	clsBaseBox.prototype.delEvent = function( pElement, pEvents, pFunction ) {
		try {
			var wEvtStr = String(pEvents);
			var wChkStr = wEvtStr.substring(0,2).toLowerCase();
			if( pElement.detachEvent ) {
				if ( wChkStr != 'on' ) wEvtStr = 'on' + wEvtStr;
				pElement.detachEvent( wEvtStr, pFunction );

			} else if( pElement.removeEventListener ) {
				if ( wChkStr == 'on' ) wEvtStr = wEvtStr.substring(2);
				pElement.removeEventListener( wEvtStr, pFunction, false );

			} else {
				return false;
			
			}
			return true;

		} catch(e) {
			throw { name: 'delEvent.' + e.name, message: e.message };
		}
	};

	// イベントを停止
	clsBaseBox.prototype.cancelEvent = function( pEvent, pBubble ) {
		try {
			if ( !pEvent ) return false;

			if ( pEvent.preventDefault ) {
				pEvent.preventDefault();
			} else if ( typeof pEvent.returnValue !== 'undefined' ) {
				pEvent.returnValue = false;
			}

			if ( pBubble ) {
				if ( pEvent.stopPropagation ) {
					pEvent.stopPropagation();
				} else if ( typeof pEvent.cancelBubble !== 'undefined' ) {
					pEvent.cancelBubble = true;
				}
			}
			return true;

		} catch(e) {
			return false;
		}
	};

	// イベント発生位置取得
	clsBaseBox.prototype.getEventPos = function( pEvent ) {
		try {
			var wPoint = { x: 0, y: 0 };

			if ( typeof pEvent.clientX !== 'undefined' ) {
				wPoint.x = pEvent.clientX;
				wPoint.y = pEvent.clientY;

			} else if( typeof pEvent.x !== 'undefined' ) {
				wPoint.x = pEvent.x;
				wPoint.y = pEvent.y;

			} else if( typeof pEvent.offsetX !== 'undefined' ) {
				wPoint.x = pEvent.offsetX;
				wPoint.y = pEvent.offsetY;

			}
			
			return wPoint;

		} catch(e) {
			throw { name: 'getEventPos', message: e.message };
		}
	};

	// イベントを発生させたマウス操作取得
	clsBaseBox.prototype.getEventClick = function( pEvent ) {
		try {
			var wClick = { left: false, wheel : false, right: false };

			// IE8以下
			if ( !pEvent.which ) {
				if ( pEvent.button == 1 ) {
					wClick.left = true;
				} else if ( pEvent.button == 4 ) {
					wClick.wheel = true;
				} else if ( pEvent.button == 2 ) {
					wClick.right = true;
				}

			// IE9以降
			} else {
				if ( pEvent.which == 1 ) {
					wClick.left = true;
				} else if ( pEvent.which == 2 ) {
					wClick.wheel = true;
				} else if ( pEvent.which == 3 ) {
					wClick.right = true;
				}
			}
			return wClick;

		} catch(e) {
			throw { name: 'getEventClick', message: e.message };
		}
	};

	// イベント時のマウス操作状態取得
	clsBaseBox.prototype.getEventMouse = function( pEvent ) {
		try {
			var wClick = { left: false, wheel : false, right: false };

			var wPushBtn = pEvent.buttons;
			
			// 主ボタン
			if ( wPushBtn && 1 ) wClick.left = true;
			
			// 副ボタン
			if ( wPushBtn && 2 ) wClick.right = true;

			// 補助ボタン
			if ( wPushBtn && 4 ) wClick.wheel = true;

			return wClick;

		} catch(e) {
			throw { name: 'getEventMouse', message: e.message };
		}
	};

	// イベント発生要素取得
	clsBaseBox.prototype.getEventTarget = function( pEvent ) {
		try {
			if ( !pEvent ) return null;

			if ( pEvent.target ) {
				return pEvent.target;
			} else if ( pEvent.srcElement ) {
				return pEvent.srcElement;
			} else {
				return null;
			}

		} catch(e) {
			throw { name: 'getEventTarget', message: e.message };
		}
	};


	// -------------------
	// 要素生成
	// -------------------

	// メニューボタン生成
	clsBaseBox.prototype.createMenu = function( pParentEle, pClickFunc, pMenuParam ) {
		try {
			var wMenuTitle	= '';
			var wMenuName	= '';
			var wMenuStyle	= '';
			var wMenuClass	= ''

			if ( this.isObject(pMenuParam) ) {
				if ( 'title'  in pMenuParam ) wMenuTitle = pMenuParam.title;
				if ( 'name'   in pMenuParam ) wMenuName  = pMenuParam.name;
				if ( 'style'  in pMenuParam ) wMenuStyle = pMenuParam.style;
				if ( 'class'  in pMenuParam ) wMenuClass = pMenuParam.class;
			}

			// メニュー追加
			var wListId = this.getBoxId() + '_menu_' + wMenuName;
			var wListEle = this.addElement( 'div', wListId );
			if ( !wListEle ) {
				throw { name: 'addElement', message: 'メニュー要素[' + wMenuTitle + ']が生成できません' };

			}
			this.addClass( wListEle, 'cssCommon-menu-list' );
			if ( wMenuStyle ) {
				this.setStyle( wListEle, wMenuStyle );
			}
			this.appendElementToParent( pParentEle, wListEle );

			// 内容追加
			var wLinkTag = this.addElement( 'a', wListId + '_link' );
			if ( !wLinkTag ) {
				this.delElement( wListEle );
				throw { name: 'addElement', message: 'メニューリンク要素[' + wMenuTitle + ']が生成できません' };
			}
			wLinkTag.href = "#";
			wLinkTag.innerHTML = "<span id='" + wListId + '_span' + "'>" + wMenuTitle + "</span>";
			if ( typeof wMenuClass == 'string' ) {
				this.addClass( wLinkTag, wMenuClass );
			}

			this.appendElementToParent( wListEle, wLinkTag )

			// clickイベント
			this.addEvent( wLinkTag, 'onclick', pClickFunc );

			// 生成したメニューを返す
			return wListEle;

		} catch(e) {
			throw { name: 'createMenu', message: e.message };
		}
	};

	// メニューボタン生成　通常編集
	clsBaseBox.prototype.createMenuEditNormal = function( pParentEle, pClickFunc ) {
		try {
			// 通常編集メニュー
			var wParamNormal = {
				  title		: '通常編集'
				, name		: this._DEF_MENU_ID_NORMAL
				, style		: null
				, class		: 'cssCommon-menu-list-select'
			};

			return this.createMenu( pParentEle, pClickFunc, wParamNormal );

		} catch(e) {
			throw { name: 'createMenuEditNormal.' + e.name, message: e.message };
		}
	};

	// メニューボタン生成　配置編集
	clsBaseBox.prototype.createMenuEditMove = function( pParentEle, pClickFunc ) {
		try {
			// 配置編集メニュー
			var wParamMove = {
				  title		: '配置編集'
				, name		: this._DEF_MENU_ID_MOVE
				, style		: null
				, class		: 'cssCommon-menu-list-def'
			};

			return this.createMenu( pParentEle, pClickFunc, wParamMove );

		} catch(e) {
			throw { name: 'createMenuEditMove.' + e.name, message: e.message };
		}
	};

	// 編集モードメニュー変更
	clsBaseBox.prototype.chgMenuEditStyle = function( pMenuId ) {
		try {
			if ( typeof pMenuId != 'string' ) return;

			var wId = this.getBoxId();

			var wAftId = pMenuId;
			var wBefId = '';
			if ( pMenuId == this._DEF_MENU_ID_NORMAL ) {
				wBefId = this._DEF_MENU_ID_MOVE;
			} else {
				wBefId = this._DEF_MENU_ID_NORMAL;
			}

			wAftId = wId + '_menu_' + wAftId;
			wBefId = wId + '_menu_' + wBefId;

			// リンク要素にclass設定
			var wBefEle = this.getElement( wBefId + '_link' );
			if ( wBefEle ) {
				this.delClass( wBefEle, 'cssCommon-menu-list-select' );
				this.addClass( wBefEle, 'cssCommon-menu-list-def' );
			}

			var wAftEle = this.getElement( wAftId + '_link' );
			if ( wAftEle ) {
				this.delClass( wAftEle, 'cssCommon-menu-list-def' );
				this.addClass( wAftEle, 'cssCommon-menu-list-select' );
			}

			return true;

		} catch(e) {
			throw { name: 'chgMenuEditStyle.' + e.name, message: e.message };
		}
	};


	// -------------------
	// 項目種別チェック
	// -------------------

	// 項目が人物かどうか
	clsBaseBox.prototype.isItemPerson = function( pKind ) {
		try {
			if ( !pKind ) return false;

			if ( pKind == 'person' ) {
				return true;
			
			} else if ( String(pKind) == 'item-person' ) {
				return true;

			}
			return false;

		} catch(e) {
			throw { name: 'isItemPerson', message: e.message };
		}
	};

	// 項目がグループかどうか
	clsBaseBox.prototype.isItemGroup = function( pKind ) {
		try {
			if ( !pKind ) return false;

			if ( pKind == 'group' ) {
				return true;
			
			} else if ( String(pKind) == 'item-group' ) {
				return true;

			}
			return false;

		} catch(e) {
			throw { name: 'isItemGroup', message: e.message };
		}
	};

	// 項目がコメントかどうか
	clsBaseBox.prototype.isItemComment = function( pKind ) {
		try {
			if ( !pKind ) return false;

			if ( pKind == 'comment' ) {
				return true;
			
			} else if ( String(pKind) == 'item-comment' ) {
				return true;

			}
			return false;

		} catch(e) {
			throw { name: 'isItemComment', message: e.message };
		}
	};

	// 項目が関連付け中継点かどうか
	clsBaseBox.prototype.isItemRelation = function( pKind ) {
		try {
			if ( !pKind ) return false;

			if ( pKind == 'relation' ) {
				return true;
			
			} else if ( String(pKind) == 'item-relation' ) {
				return true;

			}
			return false;

		} catch(e) {
			throw { name: 'isItemRelation', message: e.message };
		}
	};

	// 項目がフリーラインかどうか
	clsBaseBox.prototype.isItemFreeLine = function( pKind ) {
		try {
			if ( !pKind ) return false;

			if ( pKind == 'freeline' ) {
				return true;
			
			} else if ( String(pKind) == 'item-freeline' ) {
				return true;

			}
			return false;

		} catch(e) {
			throw { name: 'isItemFreeLine', message: e.message };
		}
	};


	// **************************************************************
	// プロパティを参照する共通関数
	// **************************************************************

	// id取得
	clsBaseBox.prototype.getElementId = function() {
		try {
			var wId = this.getNowDateTime(true);

			var wDivCnt = this._BoxDocument.getElementsByTagName('div');
			if ( wDivCnt ) {
				wId += '_' + String(wDivCnt.length);
			}
			
			return 'div_bs_' + wId;

		} catch(e) {
			throw { name: 'getElementId', message: e.message };
		}
	};

	// 要素を取得
	clsBaseBox.prototype.getElement = function( pTagId ) {
		try {
			var wGetEle = this._BoxDocument.getElementById(pTagId);
			if ( !wGetEle ) {
				wGetEle = this._BoxDocument.getElementsByName(pTagId)[0];
			}
			return wGetEle;

		} catch(e) {
			throw { name: 'getElement', message: e.message };
		}
	};

	// 要素を取得
	clsBaseBox.prototype.getElementByClass = function( pClass, pElement ) {
		try {
			var wBase = pElement;
			if ( !wBase ) wBase = this._BoxDocument;

			if ( !wBase.getElementsByClassName ) return null;

			var wGetEle = wBase.getElementsByClassName(pClass);
			if ( !wGetEle ) {
				wGetEle = null;

			} else if ( wGetEle.length == 0 ) {
				wGetEle = null;

			}
			return wGetEle;

		} catch(e) {
			throw { name: 'getElementByClass', message: e.message };
		}
	};

	// 要素のstyle設定
	clsBaseBox.prototype.setElementStyle = function( pTagId, pKey, pValue ) {
		try {
			var wTargetEle = null;

			var wElement = this._BoxDocument.getElementById(pTagId);
			if ( wElement ) {
				wTargetEle = [ wElement ];
			
			} else {
				wTargetEle = this._BoxDocument.getElementsByName(pTagId);

			}
			if ( !wTargetEle ) return;
			if ( wTargetEle.length == 0 ) return;

			var wStyle = {};
			wStyle[pKey] = pValue;

			for( var wIdx = 0; wIdx < wTargetEle.length; wIdx++ ) {
				this.setStyle( wTargetEle[wIdx], wStyle ); 
			}

		} catch(e) {
			throw { name: 'setElementChkVal', message: e.message };
		}
	};

	// 要素の属性取得
	clsBaseBox.prototype.getElementAttribute = function( pTagId, pAttrKey ) {
		try {
			var wTargetEle = null;

			var wElement = this._BoxDocument.getElementById(pTagId);
			if ( wElement ) {
				wTargetEle = wElement;
			
			} else {
				wTargetEle = this._BoxDocument.getElementsByName(pTagId)[0];

			}
			if ( !wTargetEle ) return;

			return wTargetEle[wIdx].getAttribute( pAttrKey );

		} catch(e) {
			throw { name: 'getElementAttribute', message: e.message };
		}
	};

	// 要素の属性設定
	clsBaseBox.prototype.setElementAttribute = function( pTagId, pAttrKey, pAttrVal ) {
		try {
			var wTargetEle = null;

			var wElement = this._BoxDocument.getElementById(pTagId);
			if ( wElement ) {
				wTargetEle = [ wElement ];
			
			} else {
				wTargetEle = this._BoxDocument.getElementsByName(pTagId);

			}
			if ( !wTargetEle ) return;
			if ( wTargetEle.length == 0 ) return;

			for( var wIdx = 0; wIdx < wTargetEle.length; wIdx++ ) {
				wTargetEle[wIdx].setAttribute( pAttrKey, pAttrVal );

			}

		} catch(e) {
			throw { name: 'setElementAttribute', message: e.message };
		}
	};

	// 要素（input）の値取得
	clsBaseBox.prototype.getElementValue = function( pTagId ) {
		try {
			var wElement = this.getElement( pTagId );
			if ( !wElement ) return '';

			if ( typeof wElement.value == 'undefine' ) return '';
			
			return wElement.value;

		} catch(e) {
			throw { name: 'getElementValue.' + e.name, message: e.message };
		}
	};

	// 要素のvalue設定
	clsBaseBox.prototype.setElementValue = function( pTagId, pValue ) {
		try {
			var wElement = this.getElement( pTagId );
			if ( !wElement ) return;

			if ( typeof wElement.value == 'undefine' ) return;
			
			wElement.value = pValue;

		} catch(e) {
			throw { name: 'setElementValue.' + e.name, message: e.message };
		}
	};

	// 要素（checkbox）の値取得
	clsBaseBox.prototype.getElementChkVal = function( pTagId ) {
		try {
			var wElement = this._BoxDocument.getElementsByName(pTagId);
			if ( !wElement ) return '';
			if ( wElement.length == 0 ) return '';

			var wValue = '';
			for( var wIdx = 0; wIdx < wElement.length; wIdx++ ) {
				if ( !wElement[wIdx] ) continue;
				if ( typeof wElement[wIdx].value == 'undefine' ) continue;
			
				if ( wElement[wIdx].checked ) {
					if ( wValue.length > 0 ) wValue += ',';
					wValue += wElement[wIdx].value;
				}
			}
			return wValue;

		} catch(e) {
			throw { name: 'getElementValue', message: e.message };
		}
	};

	// 要素（checkbox）の値設定
	clsBaseBox.prototype.setElementChkVal = function( pTagId, pValue ) {
		try {
			var wElement = this._BoxDocument.getElementsByName(pTagId);
			if ( !wElement ) return;
			if ( wElement.length == 0 ) return;

			for( var wIdx = 0; wIdx < wElement.length; wIdx++ ) {
				if ( !wElement[wIdx] ) continue;
				if ( typeof wElement[wIdx].value == 'undefine' ) continue;
			
				if ( String(wElement[wIdx].value) == String(pValue) ) {
					wElement[wIdx].checked = true;
				} else {
					wElement[wIdx].checked = false;
				}
			}

		} catch(e) {
			throw { name: 'setElementChkVal', message: e.message };
		}
	};

	// 要素を追加（存在する場合は取得）
	clsBaseBox.prototype.addElement = function( pTagName, pTagId ) {
		try {
			var wAddEle = this.getElement(pTagId);
			if ( !wAddEle ) {
				wAddEle = this._BoxDocument.createElement(pTagName);

				// ID設定
				if ( wAddEle.setAttribute ) {
					wAddEle.setAttribute( 'id', pTagId );
				} else {
					throw { name: 'addElement', message: '要素にIDを設定できません。' };
				}
			}
			if ( !wAddEle ) {
				throw { name: 'addElement', message: '要素が生成できません。' };
			}
			return wAddEle;

		} catch(e) {
			throw { name: 'addElement', message: e.message };
		}
	};

	// BOXの子要素として設定
	clsBaseBox.prototype.appendBoxToParent = function( pElement, pRefEle ) {
		try {
			var wResult = this.appendElementToParent( this._BoxElement, pElement, pRefEle );

			return wResult;

		} catch(e) {
			throw { name: 'appendBoxToParent.' + e.name, message: e.message };
		}
	};

	// イベント強制発火
	clsBaseBox.prototype.fireEvent = function( pElement, pEvents ) {
		try {
			if ( !pElement ) return false;

			var wEvtStr  = String(pEvents).toLowerCase();
			var wEvtKind = wEvtStr;
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);

			// IE8以前
			if ( typeof pElement.fireEvent !== 'undefined' ) {
				if ( wEvtStr.substring(0,2) != 'on' ) wEvtStr = 'on' + wEvtStr;

				// イベント発生
				pElement.fireEvent(wEvtStr);
				return true;
			
			// IE9以降
			} else {
				var wEvtObj = null;
				try {
					// コンストラクタ対応ブラウザ
					wEvtObj = new Event(wEvtKind);

				} catch(e) {
					// コンストラクタ非対応ブラウザ
					if ( typeof this._BoxDocument.createEvent !== 'undefined' ) {
						wEvtObj = this._BoxDocument.createEvent('Events');
						wEvtObj.initEvent(wEvtKind, true, true);
					}
				}

				// イベント生成成功時
				if ( wEvtObj ) {
					// イベント発生
					pElement.dispatchEvent( wEvtObj );
					return true;
				}
			}
			
			return false;

		} catch(e) {
			throw { name: 'fireEvent', message: e.message };
		}
	};

	// 要素のラインスタイル（CSS設定含む）を取得
	clsBaseBox.prototype.getCssStyleLine = function( pElement ) {
		try {
			if ( !pElement ) return null;
			if ( !this._BoxWindow ) return null;

			// 関数使用不可なら処理なし
			if ( typeof this._BoxWindow.getComputedStyle !== 'function' ) return null;
			var wStyle = this._BoxWindow.getComputedStyle(pElement);
			if ( !wStyle ) return null;

			if ( typeof wStyle.getPropertyValue !== 'function' ) return null;

			function toNumber( pWidth ) {
				try {
					if ( !pWidth ) return 0;

					return Number( String(pWidth).toLowerCase().replace('px','') );

				} catch(e) {
					throw { name: 'toNumber', message: e.message };
				}
			};

			var wRetStyle = {};

			wRetStyle.style = wStyle.getPropertyValue('border-style');
			wRetStyle.color = wStyle.getPropertyValue('border-color');
			wRetStyle.width = toNumber( wStyle.getPropertyValue('border-width') );

			wRetStyle.left = {};
			wRetStyle.left.style = wStyle.getPropertyValue('border-left-style');
			wRetStyle.left.color = wStyle.getPropertyValue('border-left-color');
			wRetStyle.left.width = toNumber( wStyle.getPropertyValue('border-left-width') );

			wRetStyle.right = {};
			wRetStyle.right.style = wStyle.getPropertyValue('border-right-style');
			wRetStyle.right.color = wStyle.getPropertyValue('border-right-color');
			wRetStyle.right.width = toNumber( wStyle.getPropertyValue('border-right-width') );

			wRetStyle.top = {};
			wRetStyle.top.style = wStyle.getPropertyValue('border-top-style');
			wRetStyle.top.color = wStyle.getPropertyValue('border-top-color');
			wRetStyle.top.width = toNumber( wStyle.getPropertyValue('border-top-width') );

			wRetStyle.bottom = {};
			wRetStyle.bottom.style = wStyle.getPropertyValue('border-bottom-style');
			wRetStyle.bottom.color = wStyle.getPropertyValue('border-bottom-color');
			wRetStyle.bottom.width = toNumber( wStyle.getPropertyValue('border-bottom-width') );

			return wRetStyle;

		} catch(e) {
			throw { name: 'getCssStyleLine.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// プロパティ取得／設定
	// **************************************************************

	// BOXのIDを返す
	clsBaseBox.prototype.getBoxId = function() {
		try {
			return this._BoxId;

		} catch(e) {
			throw { name: 'getBoxId', message: e.message };
		}
	};

	// BOXのIDを設定
	clsBaseBox.prototype.setBoxId = function( pNewId ) {
		try {
			// 要素のID再設定
			this.setBoxAttribute( { id: pNewId } );

			// ID更新
			this._BoxId = pNewId;

		} catch(e) {
			throw { name: 'setBoxId', message: e.message };
		}
	};

	// BOX種別を返す
	clsBaseBox.prototype.getBoxKind = function() {
		try {
			return this._BoxKind;

		} catch(e) {
			throw { name: 'clsBaseBox.getBoxKind.' + e.name, message: e.message };
		}
	};

	// BOXエレメントを返す
	clsBaseBox.prototype.getBoxElement = function() {
		try {
			return this._BoxElement;

		} catch(e) {
			throw { name: 'getBoxElement', message: e.message };
		}
	};

	// BOX上のエレメント（Class指定）を返す
	clsBaseBox.prototype.getBoxElementByClass = function( pClass ) {
		try {
			return this.getElementByClass( pClass, this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxElementByClass', message: e.message };
		}
	};

	// BOXの所属するwindowのBody要素を返す
	clsBaseBox.prototype.getBoxBody = function() {
		try {
			return this._BoxBody;

		} catch(e) {
			throw { name: 'getBoxBody', message: e.message };
		}
	};

	// BOXの所属するwindowを返す
	clsBaseBox.prototype.getBoxWindow = function() {
		try {
			return this._BoxWindow;

		} catch(e) {
			throw { name: 'getBoxWindow', message: e.message };
		}
	};

	// BOXのプロパティを返す
	clsBaseBox.prototype.getBoxProperty = function( pKey ) {
		try {
			var wProperty = '';
			if ( this._BoxProperty.hasOwnProperty(pKey) ) {
				wProperty = this._BoxProperty[pKey];
			}

			return wProperty;

		} catch(e) {
			throw { name: 'getBoxProperty', message: e.message };
		}
	};

	// BOXの親要素を返す
	clsBaseBox.prototype.getParent = function() {
		try {
			return this._BoxParent;

		} catch(e) {
			throw { name: 'getParent', message: e.message };
		}
	};

	// BOXの親要素のIDを取得
	clsBaseBox.prototype.getParentId = function() {
		try {
			var wId = '';
			if ( this._BoxParent ) {
				if ( this._BoxParent.id ) wId = this._BoxParent.id;
			}
			return wId;

		} catch(e) {
			throw { name: 'getParentId', message: e.message };
		}
	};


	// **************************************************************
	// プロパティ設定
	// **************************************************************

	// 所属window設定
	clsBaseBox.prototype.setWindow = function( pWindow ) {
		try {
			if ( pWindow ) {
				this._BoxWindow = pWindow;
			} else {
				this._BoxWindow = window;
			}

			// document設定
			this.setDocument();

		} catch(e) {
			throw { name: 'setWindow.' + e.name, message: e.message };
		}
	};

	// 所属document設定
	clsBaseBox.prototype.setDocument = function( ) {
		try {
			var wDocument = this._BoxWindow;
			if ( !wDocument ) {
				throw { name: 'setDocument', message: 'windowが未定義です' };
			}

			if ( typeof wDocument.getElementById !== 'function' ) {
				wDocument = this.getDocument( this._BoxWindow );
				if ( !wDocument ) {
					throw { name: 'setDocument', message: 'documentが取得できません' };
				}
			}
			
			this._BoxDocument = wDocument;
			this._BoxBody = this.getDocumentBody( this._BoxDocument );

		} catch(e) {
			throw { name: 'setDocument.' + e.name, message: e.message };
		}
	};

	// プロパティ上書き
	clsBaseBox.prototype.overwriteProperty = function( pSrcParam ) {
		try {
			if ( !pSrcParam ) return;
			if ( !this._BoxProperty ) {
				this._BoxProperty = {};
			}

			for( var key in pSrcParam ) {
				if ( pSrcParam.hasOwnProperty(key) ) {
					this._BoxProperty[key] = pSrcParam[key];
				}
			}

		} catch(e) {
			throw { name: 'overwriteProperty', message: e.message };
		}
	};

	// パラメータ保存
	clsBaseBox.prototype.saveArgument = function( pArgument ) {
		try {
			if ( !this.isObject(pArgument) ) return;

			for( var wKey in pArgument ) {
				if ( pArgument.hasOwnProperty(wKey) ) {
					// 全て保存
					this._BoxArgument[wKey] = pArgument[wKey];

				}
				switch( wKey ) {
				case 'window':
					this._BoxWindow = pArgument.window;
					break;

				case 'parent':
					this._BoxParent = pArgument.parent;
					break;

				case 'kind':
					this._BoxKind = pArgument.kind;
					break;

				case 'property':
					this.overwriteProperty( pArgument.property );
					break;

				}

			}

		} catch(e) {
			throw { name: 'saveArgument', message: e.message };
		}
	};

	// パラメータ取得
	clsBaseBox.prototype.loadArgument = function( pKey ) {
		try {
			if ( !this.isObject(this._BoxArgument) ) return null;
			if ( !(pKey in this._BoxArgument) ) return null;

			return this._BoxArgument[pKey];

		} catch(e) {
			throw { name: 'loadArgument', message: e.message };
		}
	};


	// **************************************************************
	// 親要素への操作
	// **************************************************************

	// BOXの親要素を初期化
	clsBaseBox.prototype.initParent = function( pParent ) {
		try {
			// 親未指定ならdocumentを親に設定
			if ( !pParent ) {
				this._BoxParent = this._BoxDocument.body;

			} else {
				// 親要素を保存
				this._BoxParent = pParent;

			}
			if ( !this._BoxParent ) {
				throw { name: 'not parent', message: '親要素が初期化できません' };
			}

			// BOX要素生成済
			if ( this._BoxElement ) {
				// 親要素へ追加
				this.appendElementToParent( this._BoxParent, this._BoxElement );

			}
			return true;

		} catch(e) {
			throw { name: 'initParent.' + e.name, message: e.message };
		}
	};

	// BOXの親要素を設定
	clsBaseBox.prototype.setParent = function( pParent, pNotFix ) {
		try {
			// 親要素未指定なら処理なし
			if ( !pParent ) return false;

			// 親要素を保存
			this._BoxParent = pParent;

			if ( !this._BoxElement ) return true;

			// 親要素変更による位置補正
			var wIsFix = !pNotFix;
			if ( wIsFix ) {
				var wParentPos  = this.getPos( pParent );
				var wParentLine = this.getCssStyleLine( pParent );
				if ( !wParentLine ) {
					wParentLine = this.getStyleLine( pParent );
				}
				var wPrtLeft = wParentPos.left + wParentLine.left.width;
				var wPrtTop  = wParentPos.top  + wParentLine.top.width;

				var wBoxPos = this.getPos( this._BoxElement );
				var wLeft = wBoxPos.left;
				var wTop  = wBoxPos.top;

				var wParentScroll = this.getScroll( pParent );
				wLeft += wParentScroll.x;
				wTop  += wParentScroll.y;

				wLeft -= wPrtLeft;
				wTop  -= wPrtTop;

				this.setBoxStyle( { left: wLeft + 'px', top: wTop + 'px' } );

			}

			// 親要素へ追加
			this.appendElementToParent( this._BoxParent, this._BoxElement );

			return true;

		} catch(e) {
			throw { name: 'setParent.' + e.name, message: e.message };
		}
	};

	// 親要素の範囲を取得
	clsBaseBox.prototype.getParentRect = function( ) {
		try {
			var wParent = this._BoxParent;
			if ( !wParent ) wParent = this._BoxDocument;

			var wEleRect = this.getRect( wParent );

			if ( !wEleRect ) {
				wEleRect = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
			}

			return wEleRect;

		} catch(e) {
			throw { name: 'getParentRect.' + e.name, message: e.message };
		}
	};

	// 親要素の位置を取得
	clsBaseBox.prototype.getParentPos = function( ) {
		try {
			var wParent = this._BoxParent;
			if ( !wParent ) wParent = this._BoxDocument;

			var wEleRect = this.getRect( wParent );

			if ( !wEleRect ) {
				wEleRect = { left: 0, right: 0, top: 0, bottom: 0 };
			}

			return wEleRect;

		} catch(e) {
			throw { name: 'getParentPos.' + e.name, message: e.message };
		}
	};

	// 親要素の位置（left, top）をStyleから取得
	clsBaseBox.prototype.getParentPosByStyle = function( ) {
		try {
			var wParent = this._BoxParent;
			if ( !wParent ) wParent = this._BoxDocument;

			return this.getPosByStyle( wParent );

		} catch(e) {
			throw { name: 'getParentPosByStyle.' + e.name, message: e.message };
		}
	};

	// 親要素のサイズを取得
	clsBaseBox.prototype.getParentSize = function( pParam ) {
		try {
			var wParent = this._BoxParent;
			if ( !wParent ) wParent = this._BoxDocument;

			return this.getSize(wParent, pParam);

		} catch(e) {
			throw { name: 'getParentSize.' + e.name, message: e.message };
		}
	};

	// 親要素のスクロール量を取得
	clsBaseBox.prototype.getParentScroll = function( ) {
		try {
			// 親要素のスクロール量取得
			return this.getScroll( this._BoxParent );

		} catch(e) {
			throw { name: 'getParentScroll.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 自BOX要素への操作
	// **************************************************************

	// BOXを生成
	clsBaseBox.prototype.createBoxElement = function( pDefId ) {
		try {
			if ( !this._BoxDocument ) {
				throw { name: 'not document', message: 'documentが取得できません' };
			}

			// ユニークID設定
			var wDivId = pDefId;
			if ( !wDivId ) wDivId = this.getElementId();

			this._BoxId = wDivId;

			var wDivEle = this.addElement( 'div', this._BoxId );
			wDivEle.style.display = 'none';

			// 要素保存
			this._BoxElement = wDivEle;

			// style初期設定
			this.setBoxStyle();

		} catch(e) {
			throw { name: 'createBoxElement.' + e.name, message: e.message };
		}
	};

	// BOXを削除
	clsBaseBox.prototype.delBoxElement = function() {
		try {
			if ( !this._BoxElement )  return false;

			var wDivEle = this._BoxElement
			if ( wDivEle ) {
				// 子要素削除
				var wChildNodes = wDivEle.childNodes;
				if ( wChildNodes ) {
					for( var i=0; i < wChildNodes.length; i++ ) {
						wDivEle.removeChild( wChildNodes[i] );

					}
				}

				// 要素削除
				this.delElement( wDivEle );
			}
			this._BoxElement = null;
			return true;

		} catch(e) {
			return false;
		}
	};

	// BOX要素の範囲（left, right, top, bottom）を取得
	clsBaseBox.prototype.getBoxRect = function( ) {
		try {
			return this.getRect( this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxRect.' + e.name, message: e.message };
		}
	};

	// BOX要素のborderを取得
	clsBaseBox.prototype.getBoxLine = function( ) {
		try {
			return this.getLine( this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxLine.' + e.name, message: e.message };
		}
	};

	// BOX要素の位置（left, top）を取得
	clsBaseBox.prototype.getBoxPos = function( ) {
		try {
			return this.getPos( this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxPos.' + e.name, message: e.message };
		}
	};

	// BOX要素の位置（left, top）をStyleから取得
	clsBaseBox.prototype.getBoxPosByStyle = function( ) {
		try {
			return this.getPosByStyle( this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxPosByStyle.' + e.name, message: e.message };
		}
	};
	
	// BOX要素のスクロール量を取得
	clsBaseBox.prototype.getBoxScroll = function( ) {
		try {
			// BOX要素のスクロール量取得
			return this.getScroll( this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxScroll.' + e.name, message: e.message };
		}
	};

	// BOX要素の位置設定
	clsBaseBox.prototype.setBoxPos = function( pPoint, pParam ) {
		try {
			if ( !this._BoxElement ) return;
			if ( !pPoint ) return;

			// パラメータ設定
			var wShift		= false;
			var wCenter		= false;
			var wCorrect	= false;
			var wOverflow	= false;
			var wEleSize	= null;
			if ( this.isObject(pParam) ) {
				wShift		= pParam.shift;
				wCenter		= pParam.center;
				wCorrect	= pParam.correct;
				wOverflow	= pParam.overflow;
				wEleSize	= pParam.size;
			}

			var wPosition = {};
			if ( typeof pPoint.x != 'undefined' ) wPosition.left = pPoint.x;
			if ( typeof pPoint.y != 'undefined' ) wPosition.top  = pPoint.y;

			// 位置ずらし有効時
			// ※ マウス追従時など
			if ( wShift ) {
				var wPosShift = this.getShiftPos( wCenter, wEleSize );

				if ( typeof wPosition.left != 'undefined' ) wPosition.left -= wPosShift.x;
				if ( typeof wPosition.top  != 'undefined' ) wPosition.top  -= wPosShift.y;
			}

			// window端での位置補正
			if ( wCorrect ) {
				if ( this._BoxBody && wEleSize ) {
					var wWinSize = this.getSize( this._BoxBody );

					if ( typeof wPosition.left != 'undefined' ) {
						if ( (wPosition.left + wEleSize.width) > wWinSize.width ) {
							wPosition.left = wWinSize.width - wEleSize.width - 2;
						}
					}

					if ( typeof wPosition.top != 'undefined' ) {
						if ( (wPosition.top + wEleSize.height) > wWinSize.height ) {
							wPosition.top = wWinSize.height - wEleSize.height - 2;
						}
					}
				}
			}

			if ( typeof wPosition.left != 'undefined' ) {
				// 枠外有効時以外
				if ( !wOverflow ) {
					if ( wPosition.left < 0 ) wPosition.left = 0;
				}
				wPosition.left = wPosition.left + 'px';
			}

			if ( typeof wPosition.top != 'undefined' ) {
				// 枠外有効時以外
				if ( !wOverflow ) {
					if ( wPosition.top < 0 ) wPosition.top = 0;
				}
				wPosition.top  = wPosition.top  + 'px';
			}

			this.setBoxStyle( wPosition );

		} catch(e) {
			throw { name: 'setBoxPos.' + e.name, message: e.message };
		}
	};

	// BOXのサイズを取得
	clsBaseBox.prototype.getBoxSize = function( pParam ) {
		try {
			return this.getSize( this._BoxElement, pParam );

		} catch(e) {
			throw { name: 'getBoxSize.' + e.name, message: e.message };
		}
	};

	// BOXへStyleを設定
	clsBaseBox.prototype.setBoxStyle = function( pProperty ) {
		try {
			if ( !this._BoxElement ) return false;

			var wSetStyle = pProperty;

			// 設定style未指定時
			if ( !wSetStyle ) {
				// 既存のstyleを設定
				wSetStyle = this._BoxProperty;

			} else {
				// BOXのプロパティを上書き
				this.overwriteProperty( wSetStyle );

			}
			if ( !wSetStyle ) return false;
			
			// BOXのstyleを上書き
			this.setStyle( this._BoxElement, wSetStyle );
			return true;

		} catch(e) {
			throw { name: 'setBoxStyle.' + e.name, message: e.message };
		}
	};

	// BOXのStyleを取得
	clsBaseBox.prototype.getBoxStyle = function( pStyleKey ) {
		try {
			if ( !this._BoxElement ) return '';

			var wRetStyle = this.getStyle( this._BoxElement, pStyleKey );

			return wRetStyle;

		} catch(e) {
			throw { name: 'getBoxStyle.' + e.name, message: e.message };
		}
	};

	// BOXへClassを設定
	clsBaseBox.prototype.setBoxClass = function( pClass ) {
		try {
			if ( !this._BoxElement ) return;

			this.addClass( this._BoxElement, pClass );

		} catch(e) {
			throw { name: 'setBoxClass.' + e.name, message: e.message };
		}
	};

	// BOXからClassを削除
	clsBaseBox.prototype.delBoxClass = function ( pClass ) {
		try {
			if ( !this._BoxElement ) return;

			this.delClass( this._BoxElement, pClass );

		} catch(e) {
			throw { name: 'delBoxClass.' + e.name, message: e.message };
		}
	};

	// BOXのClassを取得
	clsBaseBox.prototype.getBoxClass = function ( pStyle ) {
		try {
			if ( !this._BoxElement ) return '';

			return this.getClass( this._BoxElement );

		} catch(e) {
			throw { name: 'getBoxClass.' + e.name, message: e.message };
		}
	};

	// BOXのClassをチェック
	clsBaseBox.prototype.chkBoxClass = function ( pClass ) {
		try {
			if ( !this._BoxElement ) return '';

			return this.chkClass( this._BoxElement, pClass );

		} catch(e) {
			throw { name: 'chkBoxClass.' + e.name, message: e.message };
		}
	};

	// 指定位置にBOXが存在するかチェック
	clsBaseBox.prototype.chkBoxInPoint = function( pPoint ) {
		try {
			if ( !this._BoxElement ) return false;

			// 要素内をクリックしているかチェック
			return this.chkInPoint( this._BoxElement, pPoint );

		} catch(e) {
			throw { name: 'chkBoxInPoint.' + e.name, message: e.message };
		}
	};

	// 指定範囲にBOXが存在するかチェック
	clsBaseBox.prototype.chkBoxInRect = function( pRect ) {
		try {
			var wBoxRect = this.getBoxRect();
			if ( !wBoxRect ) return false;

			// 範囲内に要素があるかチェック
			return this.chkInRect( wBoxRect, pRect );

		} catch(e) {
			throw { name: 'chkBoxInPoint.' + e.name, message: e.message };
		}
	};

	// BOX要素からイベント削除
	clsBaseBox.prototype.delBoxEvents = function( pEvents, pFunction ) {
		try {
			// 登録されていれば削除
			var wDelEvents = [];
			var wBreak = false;

			for( var wIdx = 0; wIdx < this._BoxEvents.length; wIdx++ ) {
				// 対象イベント指定あり
				if ( pEvents ) {
					if ( this._BoxEvents[wIdx].eventName !== pEvents ) continue;

					// 対象function指定あり
					if ( pFunction ) {
						if ( this._BoxEvents[wIdx].eventFunc !== pFunction ) continue;
						wBreak = true;
					}
				}

				// イベント削除リストへ追加
				wDelEvents.push( wIdx );
				if ( wBreak ) break;
			}

			// 削除対象無ければ終了
			if ( wDelEvents.length == 0 ) return;

			// 削除（後ろから）
			var wIndex;
			for( var wDelIdx = (wDelEvents.length - 1); wDelIdx >= 0; wDelIdx-- ) {
				wIndex = wDelEvents[wDelIdx];

				// イベントを削除
				this.delEvent( this._BoxElement, this._BoxEvents[wIndex].eventName , this._BoxEvents[wIndex].eventFunc );
				this._BoxEvents.splice(wIndex, 1);

			}

		} catch(e) {
			throw { name: 'delBoxEvents.' + e.name, message: e.message };
		}
	};

	// BOX要素にイベントを追加
	clsBaseBox.prototype.addBoxEvents = function( pEvents, pFunction ) {
		try {
			// 登録済なら削除して再登録
			var wUpdate = false;
			for( var wIdx = 0; wIdx < this._BoxEvents.length; wIdx++ ) {
				if ( this._BoxEvents[wIdx].eventName !== pEvents )   continue;
				if ( this._BoxEvents[wIdx].eventFunc !== pFunction ) continue;
				
				wUpdate = true;
				break;
			}

			if ( wUpdate ) {
				this.delBoxEvents( this._BoxEvents[wIdx].eventName, this._BoxEvents[wIdx].eventFunc );
			}
			this.addEvent( this._BoxElement, pEvents, pFunction );

			// 追加したイベントを保存
			this._BoxEvents.push( { eventName: pEvents, eventFunc: pFunction } );

		} catch(e) {
			throw { name: 'addBoxEvents.' + e.name, message: e.message };
		}
	};

	// BOXから属性を取得
	clsBaseBox.prototype.getBoxAttribute = function( pAttribute ) {
		try {
			if ( !this._BoxElement ) return '';

			var wValue;
			if ( this._BoxElement.getAttribute ) {
				wValue = this._BoxElement.getAttribute( pAttribute );

			} else {
				wValue = this._BoxElement[pAttribute];

			}
			if ( !wValue ) wValue = '';

			return wValue;

		} catch(e) {
			throw { name: 'getBoxAttribute', message: e.message };
		}
	};

	// BOXへ属性を設定
	clsBaseBox.prototype.setBoxAttribute = function( pAttribute ) {
		try {
			if ( !this._BoxElement ) return false;

			for ( var wKey in pAttribute ) {
				if ( this._BoxElement.setAttribute ) {
					this._BoxElement.setAttribute( wKey, pAttribute[wKey] );

				} else {
					this._BoxElement[wKey] = pAttribute[wKey];

				}
			}
			return true;

		} catch(e) {
			throw { name: 'setBoxAttribute', message: e.message };
		}
	};

	// **************************************************************
	// BOX表示
	// **************************************************************

	// BOXを前面表示
	clsBaseBox.prototype.setBoxToFront = function( pFront ) {
		try {
			if ( !this._BoxElement ) return;

			var wZindex = this._BoxProperty['z-index'];
			if ( typeof wZindex === 'undefined' ) return;

			if ( pFront ) {
				if ( Number(wZindex) !== NaN ) {
					wZindex = Number(wZindex) + 101;
				}
			}
			this._BoxElement.style['z-index'] = wZindex;

		} catch(e) {
			throw { name: 'setBoxToFront', message: e.message };
		}
	};

	// BOXを表示する
	clsBaseBox.prototype.dspBox = function( pDisplay, pFront, pPos ) {
		try {
			if ( !this._BoxElement ) return;

			if ( pPos ) {
				this.setBoxPos( pPos );
			}

			if ( pDisplay ) {
				this._BoxElement.style.display = 'block';
			} else {
				this._BoxElement.style.display = 'none';
			}

			if ( ( pDisplay ) && ( typeof pFront === 'boolean' ) ) {
				this.setBoxToFront( pFront );
			}

		} catch(e) {
			throw { name: 'dspBox.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// データ保存用　項目設定値取得
	clsBaseBox.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData = {};

			wSaveData.id		= this.getBoxId();
			wSaveData.parentId	= this.getParentId();

			// style保存
			var wItemEle = this.getBoxElement();
			if ( wItemEle ) {
				var wStyle = {};

				var wKey;
				for( var wIdx = 0; wIdx < this._DEF_BOX_SAVE_STYLE.length; wIdx++ ) {
					wKey = this._DEF_BOX_SAVE_STYLE[wIdx];
					if ( typeof wItemEle.style[wKey] == 'undefined' ) continue;
					
					// 複写対象外Styleチェック
					if ( wKey in pSaveParam ) {
						if ( !pSaveParam[wKey] ) continue;
					}

					wStyle[wKey] = wItemEle.style[wKey];
				}
				wSaveData.style = JSON.stringify( wStyle );
			}

			return wSaveData;

		} catch(e) {
			throw { name: 'clsBaseBox.saveData', message: e.message };
		}
	};

	// データ読込
	clsBaseBox.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff = {};

			if ( !pLoadData ) return wLoadBuff;

			wLoadBuff.id		= pLoadData.id;
			wLoadBuff.parentId	= pLoadData.parentId;

			// style
			if ( pLoadData.style ) {
				wLoadBuff.style = JSON.parse( pLoadData.style );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsBaseBox.loadData', message: e.message };
		}
	};

	// Loadデータ取得
	clsBaseBox.prototype.loadDataVal = function( pKey ) {
		try {
			if ( !this._BoxLoadData ) return null;

			return this._BoxLoadData[pKey];

		} catch(e) {
			throw { name: 'clsBaseBox.loadDataVal', message: e.message };
		}
	};

	// **************************************************************
	// コンストラクタ／デストラクタ
	// **************************************************************

	// コンストラクタ
	clsBaseBox.prototype.initClass = function( pArgument, pNoBoxReq ) {
		try {
			// パラメータ取得
			this.saveArgument( pArgument );

			// 親window初期設定
			this.setWindow( this._BoxWindow );

			// loadデータ復元
			if ( pArgument ) {
				this._BoxLoadData = this.loadData( pArgument.loadData );

			}

			// load時初期値設定
			var wLoadId		= this.loadDataVal( 'id' );
			var wLoadStyle	= this.loadDataVal( 'style' );

			// BOX生成
			if ( !pNoBoxReq ) this.createBoxElement( wLoadId );

			// 親要素設定
			this.initParent( this._BoxParent );

			// style更新
			if ( wLoadStyle ) {
				this.setBoxStyle( wLoadStyle );
			}

		} catch(e) {
			throw { name: 'clsBaseBox.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsBaseBox.prototype.freeClass = function() {
		try {
			// イベント全て削除
			this.execFunction( this.delBoxEvents );

			// 要素削除
			this.execFunction( this.delBoxElement );

			// プロパティ開放
			this._BoxArgument				= null;
			this._BoxProperty				= null;
			this._BoxEvents					= null;

			this._BoxWindow					= null;
			this._BoxDocument				= null;
			this._BoxBody					= null;
			this._BoxParent					= null;
			this._BoxElement				= null;

		} catch(e) {}
	};
}());

