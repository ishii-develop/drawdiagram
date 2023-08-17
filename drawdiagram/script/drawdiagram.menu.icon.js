// --------------------------------------------------------------------
//
// リストメニュー表示クラス
//
// --------------------------------------------------------------------
// clsMenuIcon ← clsMenuBase ← clsBaseBox
// --------------------------------------------------------------------
var clsMenuIcon = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_ICON_KIND		= 'menu-icon';

		this._DEF_MENU_ICON_PROPERTY	= {
			 'z-index'				: '260'
		};

		// 継承元クラスのprototype
		this._MenuPrototype				= null;

		this._IconList					= [];
		this._IconContents				= {};
		this._IcomElement				= [];

		// **************************************************************
		// イベント処理
		// **************************************************************

		// メニュークリック
		this.eventIconClick = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// clickしたメニュー情報取得
				var wSelectIcon = self.getClickIcon( this );
				if ( !wSelectIcon ) return false;

				// 閉じる
				self.hideMenu();
				
				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, wSelectIcon );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// **************************************************************
		// コンストラクタ
		// **************************************************************
		// 親クラスのprototypeを保存
		this._MenuPrototype = clsMenuBase.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsMenuBase.call( this, pArgument );

	} catch(e) {
		throw { name: 'clsMenuIcon.' + e.name, message: e.message };
	}
};

// 基本メニュー prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsMenuIcon, clsMenuBase );


	// **************************************************************
	// プロパティ設定
	// **************************************************************

	// メニューリスト設定
	clsMenuIcon.prototype.setIconList = function( pArgIcon ) {
		try {
			// 配列で指定
			if ( this.isArray(pArgIcon) ) {
				// 内容を複写
				var wFind;
				for( var wIdx = 0; wIdx < pArgIcon.length; wIdx++ ) {
					wFind = false;
					for( var wChkIdx = 0; wChkIdx < this._IconList.length; wChkIdx++ ) {
						if ( pArgIcon[wIdx].kind == this._IconList[wChkIdx].kind ) {
							wFind = true;
							break;
						}
					}
					if ( !wFind ) this._IconList.push( pArgIcon[wIdx] );

				}

			}
			return true;

		} catch(e) {
			throw { name: 'setIconList', message: e.message };
		}
	};

	// 登録済メニューチェック
	clsMenuIcon.prototype.chkIconContents = function( pMenu ) {
		try {
			if ( !this._IconContents ) return false;

			var wFind = false;
			for( var wKey in this._IconContents ) {
				if ( this._IconContents[wKey].kind == pMenu.kind ) {
					wFind = true;
					break;
				}
			}
			
			return wFind;

		} catch(e) {
			throw { name: 'chkIconContents', message: e.message };
		}
	};


	// **************************************************************
	// メニュー選択
	// **************************************************************

	// 選択メニュー内容取得
	clsMenuIcon.prototype.getClickIcon = function( pMenuEle ) {
		try {
			// idからメニューkey取得
			var wId = pMenuEle.id
			if ( !wId ) return null;

			// メニュー内容取得
			var wContents = null;
			if ( wId in this._IconContents ) {
				wContents = this._IconContents[wId];
			}
			return wContents;

		} catch(e) {
			throw { name: 'getClickIcon', message: e.message };
		}
	};


	// **************************************************************
	// メニュー設定
	// **************************************************************

	// メニュー要素生成
	clsMenuIcon.prototype.setIconContents = function( pMenu ) {
		try {
			if ( !pMenu ) return false;

			// 生成済は処理なし
			if ( this.chkIconContents(pMenu) ) return true;
			
			var wIndex = this._IcomElement.length;

			var wMenuId  = this.getBoxId() + '_icon_' + String(wIndex);
			var wDivEle = this.addElement( 'div', wMenuId );
			if ( !wDivEle ) return false;

			if ( typeof pMenu.title !== 'undefined' ) wDivEle.title = pMenu.title;
			this.addClass( wDivEle, 'cssMenuIcon-img' );

			// 画像設定
			wDivEle.style.backgroundImage = "url(" + this.getImagePath()+ pMenu.image + ")";
			wDivEle.innerHTML = "<span class='cssMenuIcon-title'>" + pMenu.title + "</span>";

			// メニューへ追加
			this.appendBoxToParent( wDivEle );

			// clickイベント設定
			this.addEvent( wDivEle, 'onclick', this.eventIconClick );

			// 情報保存
			this._IconContents[wMenuId] = { index: wIndex, kind: pMenu.kind, image: pMenu.image };
			this._IcomElement.push( wDivEle );

			return true;

		} catch(e) {
			throw { name: 'setIconContents.' + e.name, message: e.message };
		}
	};

	// メニューへクラス設定（解除）
	clsMenuIcon.prototype.setIconClass = function( pMenuId, pClass, pDelete ) {
		try {
			if ( !this._IcomElement ) return;
			if ( this._IcomElement.length == 0 ) return;

			for( var wIdx = 0; wIdx < this._IcomElement.length; wIdx++ ) {
				if ( this._IcomElement[wIdx].id == pMenuId ) {
					if ( pDelete ) {
						this.delClass( this._IcomElement[wIdx], pClass );
					} else {
						this.addClass( this._IcomElement[wIdx], pClass );
					}
					break;
				}
			}

		} catch(e) {
			throw { name: 'setIconClass.' + e.name, message: e.message };
		}
	};

	// 指定メニューのみ表示
	clsMenuIcon.prototype.setIconUsed = function( pMenuList ) {
		try {
			if ( !this._IconContents ) return;

			var wIcon;
			var wFind;
			var wDisplay;

			for( var wIconIdx = 0; wIconIdx < this._IcomElement.length; wIconIdx++ ) {
				wIcon = this._IconContents[this._IcomElement[wIconIdx].id];
				if ( !wIcon ) continue;

				wFind = false;
				for( var wIdx = 0; wIdx < pMenuList.length; wIdx++ ){
					if ( wIcon.kind == pMenuList[wIdx].kind ) {
						wFind = true;
						break;
					}
				}

				if ( wFind ) {
					wDisplay = 'block';
				} else {
					wDisplay = 'none';
				}
				
				this.setStyle( this._IcomElement[wIconIdx], { 'display': wDisplay } );
			}
			
			// メニューサイズ再設定
			this.saveMenuSize();

		} catch(e) {
			throw { name: 'setIconUsed.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// メニュー変更
	// **************************************************************

	// アイコン選択状態を設定
	clsMenuIcon.prototype.setSelectedIcon = function( pSelected, pSelKind ) {
		try {
			if ( !this._IconContents ) return;

			var wDelete = !pSelected;

			for( var wId in this._IconContents ) {
				// 種別未設定時は全て
				if ( typeof pSelKind == 'undefined' ) {
					this.setIconClass( wId, 'cssMenuIcon-selected', wDelete );

				// 種別指定時
				} else if ( this._IconContents[wId].kind == pSelKind ) {
					this.setIconClass( wId, 'cssMenuIcon-selected', wDelete );
					break;

				}
			}

		} catch(e) {
			throw { name: 'setSelectedIcon.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニューを表示する
	clsMenuIcon.prototype.dspMenu = function( pParam ) {
		try {
			// 選択解除
			this.setSelectedIcon( false );

			if ( pParam ) {
				// 追加メニュー設定
				if ( typeof pParam.iconList !== 'undefined' ) {
					this.setIconList( pParam.iconList );

					// html設定
					for( var i = 0; i < pParam.iconList.length; i++ ) {
						this.setIconContents( pParam.iconList[i] );
					}
					
					// 指定メニューのみ有効
					this.setIconUsed( pParam.iconList );
				}

				// 選択中メニュー設定
				if ( typeof pParam.icon !== 'undefined' ) {
					// メニュー選択
					this.setSelectedIcon( true, pParam.icon.kind );
				}
			}

			// 継承元メニュー表示
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}

		} catch(e) {
			throw { name: 'clsMenuIcon.dspMenu.' + e.name, message: e.message };
		}
	};

	// メニュー要素を初期設定
	clsMenuIcon.prototype.createMenu = function() {
		try {
			if ( !this._IconList ) return false;
			if ( !this._IconList.length ) return false;

			// html設定
			for( var i = 0; i < this._IconList.length; i++ ) {
				this.setIconContents( this._IconList[i] );
			}

			// 継承元初期設定
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuIcon.createMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsMenuIcon.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_ICON_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu-icon」
				wInitArgument.kind = this._DEF_MENU_ICON_KIND;
			}

			// メニュー内容設定
			if ( pArgument ) {
				// 追加メニュー設定
				if ( typeof pArgument.iconList !== 'undefined' ) {
					this.setIconList( pArgument.iconList );
				}
			}

			// 継承元コンストラクタ
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// クラス追加
			this.setBoxClass( 'cssMenuIcon-base' );

		} catch(e) {
			throw { name: 'clsMenuIcon.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsMenuIcon.prototype.freeClass = function() {
		try {
			// プロパティ開放
			var wIcon;
			for( var wIdx = 0; wIdx < this._IcomElement.length; wIdx++ ) {
				wIcon = this._IcomElement[wIdx];
				if ( !wIcon ) continue;

				this.execFunction( this.delEvent, wIcon, 'onclick', this.eventIconClick );
				this._IcomElement[wIdx] = null;
			}

			this._IconList					= null;
			this._IconContents				= null;
			this._IcomElement				= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
