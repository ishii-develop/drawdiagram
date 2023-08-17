// --------------------------------------------------------------------
//
// コメント項目クラス
//
// --------------------------------------------------------------------
// clsItemComment ← clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsItemComment = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_COMMENT_KIND			= 'item-comment';

		this._DEF_ITEM_COMMENT_PROPERTY		= {
			 'z-index'				: '90'
		};

		// ----------------------------------
		// メニュー設定
		// ----------------------------------
		this._DEF_ITEM_COMMENT_MENU			= {
			  1: [
				  { kind: 'status'		, title: 'コメント設定'	}
				, { kind: 'color'		, title: '背景色'		}
			  ]
			, 2: [
				  { kind: 'font-size'	, title: '文字‐大きさ'	}
				, { kind: 'font-weight'	, title: '文字‐太さ'	}
				, { kind: 'font-color'	, title: '文字‐色'		}
			  ]
			, 3: [
				  { kind: 'resize'		, title: 'サイズ変更'	}
			  ]
			, 4: [
				 { kind: 'delete'		, title: '削除'			}
			  ]
		};

		this._DEF_ITEM_COMMENT_MENU_SIZE	= {
			  1: [
				  { kind: '10px'		, title: '小さい'		}
				 ,{ kind: '12px'		, title: '標準'			}
				 ,{ kind: '14px'		, title: '大きい'		}
				 ,{ kind: '16px'		, title: '最大'			}
			  ]
		};

		this._DEF_ITEM_COMMENT_MENU_WEIGHT	= {
			  1: [
				  { kind: '400'		, title: '標準'			}
				 ,{ kind: '700'		, title: '太い'			}
			  ]
		};

		this._DEF_ITEM_COMMENT_MENU_POSITION = {
			 1: [
				{ kind: 'resize'	, title: 'サイズ変更'	}
			 ]
		};

		// ----------------------------------
		// ステータス情報
		// ----------------------------------
		this._DEF_ITEM_COMMENT_STATUS_ITEM_COMMENT = {
				  name		: 'comment'
				, title		: 'コメント'
				, type		: 'textarea'
				, cols		: 40
				, rows		: 10
				, display	: false
				, default	: ''
				, design	: {
					 head	: { width: '0px', display: 'none' }
					,data	: { width: '295px', height: '145px' }
				}
		};

		this._DEF_ITEM_COMMENT_STATUS		= {
			  1: [ this._DEF_ITEM_COMMENT_STATUS_ITEM_COMMENT ]
		};

		// 継承元クラスのprototype
		this._ItemPrototype					= null;
		
		this._CommentMenuFontSize			= null;
		this._CommentMenuFontWeight			= null;

		this._CommentStatus					= { color: '', size: '', weight: '' };


		// **************************************************************
		// イベント処理
		// **************************************************************

		// 文字　カラーパレット選択時イベント
		this.eventFontColorSelect = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// 色選択時
				var wColor = pParam.color;

				// 文字色変更
				self.setCommentFontColor( wColor, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 文字　サイズ選択時イベント
		this.eventSizeSelect = function( pEvent, pSelectMenu ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// 文字サイズ変更
				self.setCommentFontSize( wKind, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 文字　太さ選択時イベント
		this.eventWeightSelect = function( pEvent, pSelectMenu ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// 文字太さ変更
				self.setCommentFontWeight( wKind, true );

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
		throw { name: 'clsItemComment.' + e.name, message: e.message };
	}
};

// グループ prototype
(function(){
	// clsItemBoxのプロトタイプを継承
	clsInheritance( clsItemComment, clsItemBox );


	// **************************************************************
	// 共有メニュー処理
	// **************************************************************

	// カラーメニュー表示
	clsItemComment.prototype.dspFontColorMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// カラーメニュー表示
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				var wPoint = this.getEventPos( pEvent );
				wColorMenu.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventFontColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspFontColorMenu.' + e.name, message: e.message };
		}
	};

	// サイズメニュー表示
	clsItemComment.prototype.dspFontSizeMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 文字サイズメニュー表示
			if ( this._CommentMenuFontSize ) {
				var wPoint = this.getEventPos( pEvent );
				this._CommentMenuFontSize.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventSizeSelect } );
			}

		} catch(e) {
			throw { name: 'dspFontSizeMenu.' + e.name, message: e.message };
		}
	};

	// 太さメニュー表示
	clsItemComment.prototype.dspFontWeightMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 文字太さメニュー表示
			if ( this._CommentMenuFontWeight ) {
				var wPoint = this.getEventPos( pEvent );
				this._CommentMenuFontWeight.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventWeightSelect } );
			}

		} catch(e) {
			throw { name: 'dspFontWeightMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// コメント
	// **************************************************************

	// コメント表示要素生成
	clsItemComment.prototype.createComment = function() {
		try {
			var wId  = this.getBoxId() + '_comment';

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssClsItem-CmtBase' );

			this.appendBoxToParent( wDivEle );
			
			return wDivEle;

		} catch(e) {
			throw { name: 'createComment' + e.name, message: e.message };
		}
	};

	// コメント文字色設定
	clsItemComment.prototype.setCommentFontColor = function( pColor, pUpdate ) {
		try {
			if ( !pColor ) return;

			// 更新時は変更がある場合のみ処理
			if ( pUpdate ) {
				if ( this._CommentStatus.color == pColor ) return;
			}

			// フォント色変更
			this.setBoxStyle( { 'color' : pColor } );
				
			// フォント色保存
			this._CommentStatus.color = pColor;

			// 設定変更を通知
			if ( pUpdate ) {
				this.execItemCallback( null, { kind: 'status' } );
			}

		} catch(e) {
			throw { name: 'setCommentFontColor' + e.name, message: e.message };
		}
	};

	// コメント文字サイズ設定
	clsItemComment.prototype.setCommentFontSize = function( pSize, pUpdate ) {
		try {
			if ( !pSize ) return;

			// 更新時は変更がある場合のみ処理
			if ( pUpdate ) {
				if ( this._CommentStatus.size == pSize ) return;
			}

			var wId  = this.getBoxId() + '_comment';
			var wCmtEle = this.getElement( wId );
			if ( wCmtEle ) {
				this.setStyle( wCmtEle, { 'font-size': pSize } );

				// フォントサイズ保存
				this._CommentStatus.size = pSize;

				// 設定変更を通知
				if ( pUpdate ) {
					this.execItemCallback( null, { kind: 'status' } );
				}
			}

		} catch(e) {
			throw { name: 'setCommentFontSize' + e.name, message: e.message };
		}
	};

	// コメント文字太さ設定
	clsItemComment.prototype.setCommentFontWeight = function( pWeight, pUpdate ) {
		try {
			if ( !pWeight ) return;

			// 更新時は変更がある場合のみ処理
			if ( pUpdate ) {
				if ( this._CommentStatus.weight == pWeight ) return;
			}

			var wId  = this.getBoxId() + '_comment';
			var wCmtEle = this.getElement( wId );
			if ( wCmtEle ) {
				this.setStyle( wCmtEle, { 'font-weight': pWeight } );

				// フォントサイズ保存
				this._CommentStatus.weight = pWeight;

				// 設定変更を通知
				if ( pUpdate ) {
					this.execItemCallback( null, { kind: 'status' } );
				}
			}

		} catch(e) {
			throw { name: 'setCommentFontWeight' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// イベントキャンセル
	clsItemComment.prototype.eventClear = function() {
		try {
			// カラーメニュー閉じる
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				wColorMenu.hideMenu();
			}

			// 文字サイズメニュー閉じる
			if ( this._CommentMenuFontSize ) {
				this._CommentMenuFontSize.hideMenu();
			}

			// 文字太さメニュー表示
			if ( this._CommentMenuFontWeight ) {
				this._CommentMenuFontWeight.hideMenu();
			}


			// 継承元イベントキャンセル処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.eventClear.call( this );

			}

		} catch(e) {
			throw { name: 'clsItemPerson.eventClear.' + e.name, message: e.message };
		}
	};


	// -------------------
	// メニュー関連
	// -------------------

	// メニュー初期設定
	clsItemComment.prototype.initItemMenu = function( pArgument ) {
		try {
			// 継承元メニュー初期化処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// 項目ロック時処理不要
			if ( this.getItemLockIs() ) return;

			// 文字サイズリストメニュー
			var wMenuList = {};
			this.copyProperty( this._DEF_ITEM_COMMENT_MENU_SIZE, wMenuList );

			var wSizeMenu = this.loadPublicMenu('listSize');
			if ( !wSizeMenu ) {
				wSizeMenu = new clsMenuList( { menuList: wMenuList } );
			}
			wSizeMenu.setMenuList( { menuList: wMenuList } );

			// 文字サイズリストメニューとして保存
			this._CommentMenuFontSize = wSizeMenu;


			// 文字太さリストメニュー
			var wWeightList = {};
			this.copyProperty( this._DEF_ITEM_COMMENT_MENU_WEIGHT, wWeightList );

			var wWeightMenu = this.loadPublicMenu('listWeight');
			if ( !wWeightMenu ) {
				wWeightMenu = new clsMenuList( { menuList: wWeightList } );
			}
			wWeightMenu.setMenuList( { menuList: wWeightList } );

			// 文字サイズリストメニューとして保存
			this._CommentMenuFontWeight = wWeightMenu;

		} catch(e) {
			throw { name: 'clsItemComment.initItemMenu.' + e.name, message: e.message };
		}
	};

	// コメント用コンテキストメニュー選択時処理
	clsItemComment.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// 文字　色
			case 'font-color':
				// 文字色メニューを表示
				wRetVal = this.dspFontColorMenu( pEvent );
				break;

			// 文字　サイズ
			case 'font-size':
				// 文字サイズメニューを表示
				wRetVal = this.dspFontSizeMenu( pEvent );
				break;

			// 文字　太さ
			case 'font-weight':
				// 文字太さメニューを表示
				wRetVal = this.dspFontWeightMenu( pEvent );
				break;

			// リサイズ
			case 'resize':
				// 親へ状態変更を通知
				// ※リサイズ処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, { kind: 'resize' } );
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
			throw { name: 'clsItemComment.execContextSelect.' + e.name, message: e.message };
		}
	};

	// -------------------
	// 基本情報関連
	// -------------------

	// ステータス初期設定
	clsItemComment.prototype.initItemStatus = function( pArgument ) {
		try {
			// 継承元ステータス更新時処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// Load時
			var wLoadStat = this.loadDataVal( 'comment' );
			if ( wLoadStat ) {
				if ( 'color'  in wLoadStat ) this._CommentStatus.color  = wLoadStat.color;
				if ( 'size'   in wLoadStat ) this._CommentStatus.size   = wLoadStat.size;
				if ( 'weight' in wLoadStat ) this._CommentStatus.weight = wLoadStat.weight;
				
			}

		} catch(e) {
			throw { name: 'clsItemComment.initItemStatus.' + e.name, message: e.message };
		}
	};

	// ステータス設定時処理
	clsItemComment.prototype.execStatusMenu = function( pEvent, pStatVal ) {
		try {
			// 設定内容取得
			var wComment = this.getStatusValues('comment');

			// コメント内容を設定
			var wId  = this.getBoxId() + '_comment';
			var wCmtEle = this.getElement( wId );
			if ( !wCmtEle ) wCmtEle = this.createComment();

			if ( wCmtEle ) {
				wCmtEle.innerHTML = this.toHtml( wComment );
			}

			// 継承元ステータス更新時処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execStatusMenu.call( this, pEvent, pStatVal );

			}

		} catch(e) {
			throw { name: 'clsItemComment.execStatusMenu.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD関連
	// -------------------

	// データ保存用　項目設定値取得
	clsItemComment.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// 継承元項目設定値取得処理
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// コメント用情報を追加
			wSaveData.comment = JSON.stringify( this._CommentStatus );

			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemComment.saveData.' + e.name, message: e.message };
		}
	};

	// データ読込
	clsItemComment.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;
			// 継承元データ読込処理
			if ( this._BasePrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// コメント固有設定
			if ( pLoadData.comment ) {
				wLoadBuff.comment = JSON.parse( pLoadData.comment );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemComment.loadData', message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsItemComment.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_COMMENT_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「item-comment」
				wInitArgument.kind = this._DEF_ITEM_COMMENT_KIND;

			}

			// 追加メニュー設定
			wInitArgument.menuList		= this._DEF_ITEM_COMMENT_MENU;
			wInitArgument.menuReplace	= true;

			// 追加位置調整メニュー設定
			wInitArgument.positionList	= this._DEF_ITEM_COMMENT_MENU_POSITION;

			// 追加ステータス設定
			wInitArgument.statusList	= this._DEF_ITEM_COMMENT_STATUS;
			wInitArgument.statusReplace	= true;

			// 継承元コンストラクタ
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

			// コメント表示要素生成
			this.createComment();

			// フォントカラー更新
			this.setCommentFontColor( this._CommentStatus.color );

			// フォントサイズ更新
			this.setCommentFontSize( this._CommentStatus.size );

			// フォント太さ更新
			this.setCommentFontWeight( this._CommentStatus.weight );

		} catch(e) {
			throw { name: 'clsItemComment.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsItemComment.prototype.freeClass = function() {
		try {
			// プロパティ開放
			this._CommentMenuFontSize		= null;
			this._CommentMenuFontWeight		= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
