
// --------------------------------------------------------------------
//
// フリーライン情報クラス
//
// --------------------------------------------------------------------
// clsItemFreeLine ← clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsItemFreeLine = function( pArgument ) {
	try {
		var self = this;

		this._DEF_FREELINE_KIND				= 'item-freeline';

		this._DEF_FREELINE_STYLE			= {
				  'z-index'				: '260'
			};

		// ----------------------------------
		// メニュー設定
		// ----------------------------------
		this._DEF_FREELINE_MENU_CONTEXT		= {
			  3: [
				  { kind: 'line-color'	, title: 'ライン‐色'		}
				, { kind: 'line-style'	, title: 'ライン‐種類'		}
				, { kind: 'line-width'	, title: 'ライン‐太さ'		}
			  ]
			, 4: [
				  { kind: 'delete'		, title: '削除（一部）'		}
				, { kind: 'delete-all'	, title: '削除（全て）'		}
			  ]
		};

		this._DEF_FREELINE_MENU_STYLE	= {
			  1: [
				  { kind: 'normal'		, title: '通常'		}
				 ,{ kind: 'dash'		, title: '点線'		}
			  ]
		};

		this._DEF_FREELINE_MENU_WIDTH	= {
			  1: [
				  { kind: '0.5'			, title: '細い'			}
				 ,{ kind: '1'			, title: '通常'			}
				 ,{ kind: '2.5'			, title: '太い'			}
				 ,{ kind: '5'			, title: '最大'			}
			  ]
		};

		// ----------------------------------
		// ステータス情報
		// ----------------------------------

		this._DEF_FREELINE_LINE				= { 
				  width		: 0.5
				, style		: 'normal'
				, color		: '#080808'
				, way		: 0
		};

		// 継承元クラスのprototype
		this._ItemPrototype						= null;

		// フリーライン情報
		this._FreeLineDrag						= false;
		this._FreeLineStatus					= null;
		this._FreeLinePoint						= {};

		this._FreeLinePointMove					= null;

		this._FreeLineMenuLineStyle				= null;
		this._FreeLineMenuLineWidth				= null;


		// **************************************************************
		// メニューイベント処理
		// **************************************************************

		// ライン　カラーパレット選択時イベント
		this.eventLineColorSelect = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// 色選択時
				var wColor = pParam.color;

				// 色変更
				self.setFreeLineStatus( { color: wColor }, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ライン　線種選択時イベント
		this.eventLineStyleSelect = function( pEvent, pSelectMenu ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// 線種変更
				self.setFreeLineStatus( { style: wKind }, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ライン　線幅選択時イベント
		this.eventLineWidthSelect = function( pEvent, pSelectMenu ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// 線幅変更
				self.setFreeLineStatus( { width: wKind }, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// ポイントイベント
		// **************************************************************

		// ポイント移動　開始
		this.eventPointMoveStart = function( pEvent ) {
			try {
				// コメントドラッグ許可時のみ処理
				if ( !self._FreeLineDrag ) return true;

				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				// 左クリックのみ有効
				var wClick = self.getEventClick( pEvent );
				if ( wClick.left ) {
					// 移動開始
					self.startPointMove( pEvent );
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ポイント移動　移動中
		this.eventPointMove = function( pEvent ) {
			try {
				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				if ( !self._FreeLinePointMove ) return false;

				// コメント移動
				var wPoint = self.getEventPos( pEvent );
				self.movePoint( wPoint );

			} catch(e) {
				self.execFunction( self.cancelPointMove );
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ポイント移動　終了
		this.eventCmtPointStop = function( pEvent ) {
			try {
				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				if ( self._FreeLinePointMove ) {
					// 移動先チェック
					var wStayFlg = false;
					
					// 開始位置と同じなら処理なし
					var wStPos = self._FreeLinePointMove.startpos;
					if ( self.isObject(wStPos) ) {
						var wEvtPos = self.getEventPos( pEvent );
						if ( (wEvtPos.x == wStPos.x) && (wStPos.y == wStPos.y) ) wStayFlg = true;
					}

					if ( !wStayFlg ) {
						// 親へ変更を通知
						self.execItemCallback( pEvent, { kind: 'freeLine' } );
					
					}
				
				}

				// 移動終了
				self.cancelPointMove();

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// コンストラクタ
		// **************************************************************
		// 親クラスのprototypeを保存
		this._ItemPrototype = clsItemBox.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsItemBox.call( this, pArgument );

	} catch(e) {
		throw { name: 'clsItemFreeLine.' + e.name, message: e.message };
	}
};

// 関係情報 prototype
(function(){
	// clsItemBoxのプロトタイプを継承
	clsInheritance( clsItemFreeLine, clsItemBox );

	// **************************************************************
	// プロパティ設定/取得
	// **************************************************************

	// ライン情報取得
	clsItemFreeLine.prototype.getLineStatus = function( ) {
		try {
			if ( !this._FreeLineStatus ) {
				this._FreeLineStatus = {};
				this.copyProperty( this._DEF_FREELINE_LINE, this._FreeLineStatus );
			}

			var wResult = {};
			this.copyProperty( this._FreeLineStatus, wResult );

			return wResult;

		} catch(e) {
			throw { name: 'getLineStatus', message: e.message };
		}
	};

	// ライン情報設定
	clsItemFreeLine.prototype.setLineStatus = function( pLineStatus ) {
		try {
			if ( !this.isObject(pLineStatus) ) return;

			if ( !this._FreeLineStatus ) this._FreeLineStatus = {};
			this.copyProperty( pLineStatus, this._FreeLineStatus );

		} catch(e) {
			throw { name: 'setLineStatus', message: e.message };
		}
	};

	// 接続点設定
	clsItemFreeLine.prototype.setLinePoint = function( pPointId ) {
		try {
			if ( !this._FreeLinePoint ) this._FreeLinePoint = {};

			this._FreeLinePoint[pPointId] = true;

		} catch(e) {
			throw { name: 'setLinePoint', message: e.message };
		}
	};

	// 接続点削除
	clsItemFreeLine.prototype.delLinePoint = function( pPointId ) {
		try {
			if ( !this._FreeLinePoint ) return;

			// 有効な接続点
			if ( pPointId in this._FreeLinePoint ) {
				// 削除
				delete this._FreeLinePoint[pPointId];
			}

		} catch(e) {
			throw { name: 'delLinePoint', message: e.message };
		}
	};

	// 接続点取得
	clsItemFreeLine.prototype.getLinePoint = function( ) {
		try {
			if ( !this._FreeLinePoint ) return null;

			// 有効なポイントなければnull
			for( var wKey in this._FreeLinePoint ) {
				if ( wKey ) return this._FreeLinePoint;
			}

			return null;

		} catch(e) {
			throw { name: 'getLinePoint', message: e.message };
		}
	};

	// 接続点チェック
	clsItemFreeLine.prototype.chkLinePoint = function( pPointId ) {
		try {
			if ( !this.isObject(this._FreeLinePoint) ) return false;

			return ( pPointId in this._FreeLinePoint );

		} catch(e) {
			throw { name: 'chkLinePoint', message: e.message };
		}
	};


	// **************************************************************
	// フリーライン状態設定
	// **************************************************************

	// ラインステータス更新
	clsItemFreeLine.prototype.setFreeLineStatus = function( pStatus, pUpdate ) {
		try {
			if ( !this.isObject(pStatus) ) return;

			var wLineStatus = this.getLineStatus();

			// ラインステータス更新
			var wUpdFlg = false;
			for( var wKey in pStatus ) {
				if ( wKey in wLineStatus ) {
					if ( String(pStatus[wKey]) != String(wLineStatus[wKey]) ) wUpdFlg = true;
				}

				wLineStatus[wKey] = pStatus[wKey];
			}

			// 更新時は変更がある場合のみ処理
			if ( pUpdate ) {
				if ( !wUpdFlg ) return;
			}

			// 新ステータス設定
			this.setLineStatus( wLineStatus );

			// 設定変更を通知
			if ( pUpdate ) {
				this.execItemCallback( null, { kind: 'freeLineUpd' } );
			}

		} catch(e) {
			throw { name: 'setFreeLineStatus' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 共有メニュー処理
	// **************************************************************

	// カラーメニュー表示
	clsItemFreeLine.prototype.dspLineColorMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// カラーメニュー表示
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				var wPoint = this.getEventPos( pEvent );
				wColorMenu.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLineColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspLineColorMenu.' + e.name, message: e.message };
		}
	};

	// 線種メニュー表示
	clsItemFreeLine.prototype.dspLineStyleMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 線種メニュー表示
			if ( this._FreeLineMenuLineStyle ) {
				var wPoint = this.getEventPos( pEvent );
				this._FreeLineMenuLineStyle.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLineStyleSelect } );
			}

		} catch(e) {
			throw { name: 'dspLineStyleMenu.' + e.name, message: e.message };
		}
	};

	// 線幅メニュー表示
	clsItemFreeLine.prototype.dspLineWidthMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 文字太さメニュー表示
			if ( this._FreeLineMenuLineWidth ) {
				var wPoint = this.getEventPos( pEvent );
				this._FreeLineMenuLineWidth.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLineWidthSelect } );
			}

		} catch(e) {
			throw { name: 'dspLineWidthMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ポイント移動
	// **************************************************************

	// ポイント移動イベント　追加
	clsItemFreeLine.prototype.addPointMoveEvent = function() {
		try {
			// マウス追従
			this.addEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPointMove );

			// 位置確定
			this.addEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtPointStop );

		} catch(e) {
			throw { name: 'addPointMoveEvent.' + e.name, message: e.message };
		}
	};

	// ポイント移動イベント　削除
	clsItemFreeLine.prototype.delPointMoveEvent = function() {
		try {
			// マウス追従
			this.delEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPointMove );

			// 位置確定
			this.delEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtPointStop );

		} catch(e) {
			throw { name: 'delPointMoveEvent.' + e.name, message: e.message };
		}
	};

	// ポイント移動　終了時処理
	clsItemFreeLine.prototype.cancelPointMove = function() {
		try {
			// イベント停止
			this.delPointMoveEvent();

			this._FreeLinePointMove = null;

			// 最前面解除
			this.setBoxToFront( false );

		} catch(e) {
			throw { name: 'cancelPointMove.' + e.name, message: e.message };
		}
	};

	// ポイント移動　開始時処理
	clsItemFreeLine.prototype.startPointMove = function( pEvent ) {
		try {
			// 一旦キャンセル
			this.cancelPointMove();

			this._FreeLinePointMove = {};

			// 親の位置を保存
			this._FreeLinePointMove.parent = this.getParentPos();

			// クリック位置を保存
			var wEvtPos = this.getEventPos( pEvent );
			var wItmPos = this.getBoxPos();

			this._FreeLinePointMove.startpos = {};
			this.copyProperty( wEvtPos, this._FreeLinePointMove.startpos );

			this._FreeLinePointMove.drag = {
				  left: wEvtPos.x - wItmPos.left
				, top : wEvtPos.y - wItmPos.top
			};

			// イベント追加
			this.addPointMoveEvent();

			// 最前面表示
			this.setBoxToFront( true );

			return true;

		} catch(e) {
			throw { name: 'startPointMove.' + e.name, message: e.message };
		}
	};

	// ポイント移動
	clsItemFreeLine.prototype.movePoint = function( pPoint ) {
		try {
			var wMovePos = { x: pPoint.x, y: pPoint.y };

			if ( this._FreeLinePointMove ) {
				if ( this._FreeLinePointMove.parent ) {
					wMovePos.x -= this._FreeLinePointMove.parent.left;
					wMovePos.y -= this._FreeLinePointMove.parent.top;

				}

				if ( this._FreeLinePointMove.drag ) {
					wMovePos.x -= this._FreeLinePointMove.drag.left;
					wMovePos.y -= this._FreeLinePointMove.drag.top;
				}
			}

			// 親要素のスクロール値加算
			var wMainScroll = this.getParentScroll();
			wMovePos.x += wMainScroll.x;
			wMovePos.y += wMainScroll.y;

			// 上端、左端は処理なし
			if ( wMovePos.x <= 0 ) return false;
			if ( wMovePos.y <= 0 ) return false;

			this.setBoxPos( wMovePos );

			return true;

		} catch(e) {
			throw { name: 'movePoint.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// イベント
	// **************************************************************

	// イベントキャンセル
	clsItemFreeLine.prototype.eventClear = function() {
		try {
			// 移動キャンセル
			this.execFunction( this.cancelPointMove );

			// カラーメニュー閉じる
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				wColorMenu.hideMenu();
			}

			// 線種メニュー閉じる
			if ( this._FreeLineMenuLineStyle ) {
				this._FreeLineMenuLineStyle.hideMenu();
			}

			// 線幅メニュー表示
			if ( this._FreeLineMenuLineWidth ) {
				this._FreeLineMenuLineWidth.hideMenu();
			}


			// 継承元イベントキャンセル処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.eventClear.call( this );

			}

		} catch(e) {
			throw { name: 'clsItemFreeLine.eventClear', message: e.message };
		}
	};

	// コンテキストメニュー使用有無設定
	// ※ clsItemBoxから継承
	clsItemFreeLine.prototype.setContextAvailable = function( pAvailable, pParam ) {
		try {
			// 継承元　コンテキストメニュー使用有無設定
			if ( this._ItemPrototype ) {
				this._ItemPrototype.setContextAvailable.call( this, pAvailable, pParam );

			}

			// ドラッグ許可時のみ処理
			if ( !this.getItemDragIs() ) return;

			// コメントドラッグ可否
			this._FreeLineDrag = pAvailable;

			// drag可否パラメータあり
			var wDragParam = false;
			if ( this.isObject(pParam) ) {
				if ( 'drag' in pParam ) wDragParam = true;
			}

			if ( wDragParam ) {
				// パラメータ値を使用
				this._FreeLineDrag = pParam.drag;

			// パラメータなし
			} else {
				// メニュー有効時
				if ( pAvailable ) {
					// 通常時ドラッグ可否を設定
					this._FreeLineDrag = this.getItemMoveInitIs();

				}
			}

		} catch(e) {
			throw { name: 'setContextAvailable', message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// -------------------
	// メニュー関連
	// -------------------

	// メニュー初期設定
	clsItemFreeLine.prototype.initItemMenu = function( pArgument ) {
		try {
			// 継承元メニュー初期化処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// 項目ロック時処理不要
			if ( this.getItemLockIs() ) return;

			// コメントドラッグ許可
			if ( this.getItemDragIs() ) {
				this.addBoxEvents( 'onmousedown'	, this.eventPointMoveStart );
			}

			// 線種リストメニュー
			var wStyleList = {};
			this.copyProperty( this._DEF_FREELINE_MENU_STYLE, wStyleList );

			var wStyleMenu = this.loadPublicMenu('lineStyle');
			if ( !wStyleMenu ) {
				wStyleMenu = new clsMenuList( { menuList: wStyleList } );
			}
			wStyleMenu.setMenuList( { menuList: wStyleList } );

			// 線種リストメニューとして保存
			this._FreeLineMenuLineStyle = wStyleMenu;

			// 線幅リストメニュー
			var wWidthList = {};
			this.copyProperty( this._DEF_FREELINE_MENU_WIDTH, wWidthList );

			var wWidthMenu = this.loadPublicMenu('lineWidth');
			if ( !wWidthMenu ) {
				wWidthMenu = new clsMenuList( { menuList: wWidthList } );
			}
			wWidthMenu.setMenuList( { menuList: wWidthList } );

			// 線幅リストメニューとして保存
			this._FreeLineMenuLineWidth = wWidthMenu;

		} catch(e) {
			throw { name: 'clsItemFreeLine.initItemMenu.' + e.name, message: e.message };
		}
	};

	// コメント用コンテキストメニュー選択時処理
	clsItemFreeLine.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// ライン　色
			case 'line-color':
				// 色メニューを表示
				wRetVal = this.dspLineColorMenu( pEvent );
				break;

			// ライン　種類
			case 'line-style':
				// 線種メニューを表示
				wRetVal = this.dspLineStyleMenu( pEvent );
				break;

			// ライン　太さ
			case 'line-width':
				// 線幅メニューを表示
				wRetVal = this.dspLineWidthMenu( pEvent );
				break;

			// 全て削除
			case 'delete-all':
				// 継承元メニュー操作処理
				if ( this._ItemPrototype ) {
					// パラメータ再設定
					pSelectMenu.kind	= 'delete';
					pSelectMenu.delAll	= true;
					wRetVal = this._ItemPrototype.execContextSelect.call( this, pEvent, pSelectMenu );

				}
				break;

			// 以外
			default:
				// 継承元メニュー操作処理
				if ( this._ItemPrototype ) {
					wRetVal = this._ItemPrototype.execContextSelect.call( this, pEvent, pSelectMenu );

				}
				break;
			}

			return wRetVal;

		} catch(e) {
			throw { name: 'clsItemFreeLine.execContextSelect.' + e.name, message: e.message };
		}
	};


	// -------------------
	// 基本情報関連
	// -------------------

	// ステータス初期設定
	clsItemFreeLine.prototype.initItemStatus = function( pArgument ) {
		try {
			// 継承元ステータス更新時処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// Load時　設定内容
			var wLoadStatus = this.loadDataVal( 'status' );
			if ( wLoadStatus ) {
				this._FreeLineStatus = wLoadStatus;

			} else {
				// 初期値設定
				if ( !this._FreeLineStatus ) this._FreeLineStatus = {};
				this.copyProperty( this._DEF_FREELINE_LINE, this._FreeLineStatus );

			}

			var wLoadPoint = this.loadDataVal( 'point' );
			if ( wLoadPoint ) {
				this._FreeLinePoint = wLoadPoint;

			}

			// パラメータ設定
			if ( this.isObject(pArgument) ) {
				// 変更時初期値
				for( var wKey in pArgument ) {
					// 関係情報
					if ( wKey in this._FreeLinePoint ) {
						// 値上書き
						this._FreeLinePoint[wKey] = pArgument[wKey];
					}
				}

			// 初期ドラッグ可否（初期移動可　かつ　ドラッグ可）
			this._FreeLineDrag = ( this.getItemMoveInitIs() && this.getItemDragIs() );

			}
		} catch(e) {
			throw { name: 'clsItemFreeLine.initItemStatus.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD関連
	// -------------------

	// データ保存用　項目設定値取得
	clsItemFreeLine.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// 継承元項目設定値取得処理
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// ライン情報
			wSaveData.status	= JSON.stringify( this._FreeLineStatus );

			// 接続情報
			wSaveData.point		= JSON.stringify( this._FreeLinePoint );

			// 設定値を取得
			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemFreeLine.saveData', message: e.message };
		}
	};

	// データ読込
	clsItemFreeLine.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// 継承元データ読込処理
			if ( this._ItemPrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// ライン情報
			if ( pLoadData.status ) {
				wLoadBuff.status = JSON.parse( pLoadData.status );
			}

			// 接続情報
			if ( pLoadData.point ) {
				wLoadBuff.point = JSON.parse( pLoadData.point );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemFreeLine.loadData', message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsItemFreeLine.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_FREELINE_STYLE );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「relation」
				wInitArgument.kind = this._DEF_FREELINE_KIND;

			}

			// メニュー設定
			wInitArgument.menuList		= this._DEF_FREELINE_MENU_CONTEXT;
			wInitArgument.menuReplace	= true;

			// 継承元コンストラクタ
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}
			
			// 印刷しない
			this.setBoxClass('no-print');

		} catch(e) {
			throw { name: 'clsItemFreeLine.initClass', message: e.message };
		}
	};

	// デストラクタ
	clsItemFreeLine.prototype.freeClass = function() {
		try {
			// イベント削除
			this.execFunction( this.delPointMoveEvent );

			// プロパティ開放
			this._FreeLineStatus			= null;
			this._FreeLinePoint				= null;
			this._FreeLinePointMove			= null;

			this._FreeLineMenuLineStyle		= null;
			this._FreeLineMenuLineWidth		= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
