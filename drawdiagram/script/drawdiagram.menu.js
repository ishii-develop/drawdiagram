// --------------------------------------------------------------------
//
// 基本メニュークラス
//
// --------------------------------------------------------------------
// clsMenuBase ← clsBaseBox
// --------------------------------------------------------------------
var clsMenuBase = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_KIND			= 'menu';

		this._DEF_MENU_PROPERTY		= {
			 'z-index'				: '3000'
		};

		// 継承元クラスのprototype
		this._BasePrototype			= null;

		this._MenuSize				= null;
		this._MenuCallback			= null;
		this._MenuDisplay			= false;
		this._MenuAutoClose			= true;

		// **************************************************************
		// イベント処理
		// **************************************************************

		// マウス範囲外でメニュー閉じる
		this.eventMenuMouseleave = function( pEvent ) {
			try {
				self.dspMenuElement( false );

				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, { kind: 'close' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// **************************************************************
		// コンストラクタ
		// **************************************************************
		// 親クラスのprototypeを保存
		this._BasePrototype = clsBaseBox.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsBaseBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsMenuBase.' + e.name, message: e.message };
	}
};

// 基本メニュー prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsMenuBase, clsBaseBox );

	// **************************************************************
	// プロパティ設定
	// **************************************************************

	// Callback関数
	clsMenuBase.prototype.setCallBack = function( pFunction ) {
		try {
			if ( typeof pFunction !== 'function' ) return;

			this._MenuCallback = pFunction;

		} catch(e) {
			throw { name: 'setCallBack', message: e.message };
		}
	};

	// Callback関数　設定有無
	clsMenuBase.prototype.isCallback = function() {
		try {
			return (typeof this._MenuCallback == 'function');

		} catch(e) {
			throw { name: 'isCallback', message: e.message };
		}
	};

	// 自動非表示有無
	clsMenuBase.prototype.autoCloseIs = function() {
		try {
			return this._MenuAutoClose;

		} catch(e) {
			throw { name: 'autoCloseIs', message: e.message };
		}
	};

	// **************************************************************
	// プロパティ取得
	// **************************************************************

	// Callback関数
	clsMenuBase.prototype.execCallBack = function( ) {
		try {
			if ( typeof this._MenuCallback !== 'function' ) return false;

			// 引数設定
			var wArguments;
			if ( arguments.length > 0 ) {
				wArguments = Array.prototype.slice.call(arguments, 0);

			} else {
				wArguments = [];

			}
			this._MenuCallback.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execCallBack', message: e.message };
		}
	};


	// 共通メニュー取得
	clsMenuBase.prototype.loadPublicMenu = function( pMenuId ) {
		try {
			var wPublicMenu = this.loadArgument( 'publicMenu' );
			if ( !wPublicMenu ) return null;

			// Key指定なければ全て
			if ( typeof pMenuId == 'string' ) {
				if ( !(pMenuId in wPublicMenu) ) return null;
				return wPublicMenu[pMenuId];
			
			} else {
				return wPublicMenu;

			}

		} catch(e) {
			throw { name: 'loadPublicMenu', message: e.message };
		}
	};


	// **************************************************************
	// メニュー表示
	// **************************************************************

	// メニュー表示
	clsMenuBase.prototype.dspMenuElement = function( pDisplay ) {
		try {
			this.dspBox( pDisplay );

			// 自動closey有効時
			if ( this._MenuAutoClose ) {
				// マウス制御イベント
				if ( pDisplay ) {
					this.addBoxEvents( 'onmouseleave', this.eventMenuMouseleave );
				} else {
					this.delBoxEvents( 'onmouseleave', this.eventMenuMouseleave );
				}
			
			}

			// 表示時はフォーカス
			var wMenuEle = this.getBoxElement();
			if ( pDisplay ) wMenuEle.focus();

			this._MenuDisplay = pDisplay;

		} catch(e) {
			throw { name: 'dspMenuElement.' + e.name, message: e.message };
		}
	};

	// メニューのサイズ取得
	clsMenuBase.prototype.saveMenuSize = function() {
		try {
			// 表示されていない
			var wSavePos = { left: null, top: null };
			if ( !this._MenuDisplay ) {
				// 位置保存
				wSavePos.left = this.getBoxStyle( 'left' );
				wSavePos.top  = this.getBoxStyle( 'top' );

				// 表示範囲外で一旦表示
				this.setBoxStyle( { left: '-200px', top: '-200px' } );
				this.dspBox( true );
			}

			this._MenuSize = this.getBoxSize();

			// 非表示に戻す
			if ( !this._MenuDisplay ) {
				this.dspBox( false );

				// 位置戻す
				if ( wSavePos.left ) this.setBoxStyle( { left: wSavePos.left } );
				if ( wSavePos.top  ) this.setBoxStyle( { top: wSavePos.top } );

			}

		} catch(e) {
			throw { name: 'saveMenuSize.' + e.name, message: e.message };
		}
	};

	// 位置を再調整
	clsMenuBase.prototype.resetPosition = function() {
		try {
			var wBoxPos		= this.getBoxPos();
			var wParentPos	= this.getParentPos();

			// 現表示位置
			var wPoint = {};
			wPoint.y = (wBoxPos.top  + wParentPos.top);
			wPoint.x = (wBoxPos.left + wParentPos.left);

			// 親のスクロール値減算
			var wParentScroll = this.getParentScroll();
			wPoint.y -= wParentScroll.y;
			wPoint.x -= wParentScroll.x;

			// 位置補正
			this.setBoxPos( wPoint, { shift: false, correct: true, size: this._MenuSize } );

		} catch(e) {
			throw { name: 'dspMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニューを表示する
	clsMenuBase.prototype.dspMenu = function( pParam ) {
		try {
			if ( pParam ) {
				// 表示位置
				if ( (typeof pParam.x !== 'undefined') || (typeof pParam.y !== 'undefined') ) {
					var wPoint = { x: pParam.x, y: pParam.y };
					if ( typeof wPoint.x == 'undefined' ) wPoint.x = 0;
					if ( typeof wPoint.y == 'undefined' ) wPoint.y = 0;

					this.setBoxPos( wPoint, { shift: true, correct: true, size: this._MenuSize } );
				}

				// メニュー操作時イベント設定
				this.setCallBack( pParam.callback );
			}

			// 表示
			this.dspMenuElement( true );

		} catch(e) {
			throw { name: 'clsMenuBase.dspMenu.' + e.name, message: e.message };
		}
	};

	// メニューを非表示
	clsMenuBase.prototype.hideMenu = function() {
		try {
			this.dspMenuElement( false );

		} catch(e) {
			throw { name: 'clsMenuBase.hideMenu.' + e.name, message: e.message };
		}
	};

	// コンテキストメニュー無効化
	clsMenuBase.prototype.setMenuContext = function() {
		try {
			// 不要なイベントを無効化
			this.addBoxEvents( 'oncontextmenu'	, this.eventInvalid );

		} catch(e) {
			throw { name: 'clsMenuBase.setMenuContext.' + e.name, message: e.message };
		}
	};

	// メニュー要素を初期設定
	clsMenuBase.prototype.createMenu = function() {
		try {
			// ※ html生成は継承先で実装する

			// メニューサイズ保存
			this.saveMenuSize();

		} catch(e) {
			throw { name: 'clsMenuBase.createMenu', message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsMenuBase.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu」
				wInitArgument.kind = this._DEF_MENU_KIND;

			}

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// クラス追加
			this.setBoxClass( 'cssMenu-base' );

			if ( pArgument ) {
				// Callback指定時
				if ( typeof pArgument.callback !== 'undefined' ) {
					this.setCallBack( pArgument.callback );

				}
				
				// 自動close指定時
				if ( typeof pArgument.autoClose !== 'undefined' ) {
					this._MenuAutoClose = pArgument.autoClose;

				}
				
			}

			// イベント設定
			this.setMenuContext();

			// メニュー初期設定
			this.createMenu();

		} catch(e) {
			throw { name: 'clsMenuBase.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsMenuBase.prototype.freeClass = function() {
		try {
			// プロパティ開放
			this._MenuSize				= null;
			this._MenuCallback			= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};

}());
