// --------------------------------------------------------------------
//
// リストメニュー表示クラス
//
// --------------------------------------------------------------------
// clsMenuList ← clsMenuBase ← clsBaseBox
// --------------------------------------------------------------------
var clsMenuList = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_LIST_KIND		= 'menu-list';

		this._DEF_MENU_LIST_PROPERTY	= {
			 'z-index'				: '3000'
		};

		// メニューのstyle
		this._DEF_MENU_LIST_LIST_PROPERTY = {
			 'z-index'				: '3010'
		};

		// 設定値
		this._DEF_MENU_LIST_MIN_WIDTH	= 125;
		this._DEF_MENU_LIST_FONT_WIDTH	= 24;

		// 継承元クラスのprototype
		this._MenuPrototype				= null;

		this._MenuList					= [];
		this._MenuContents				= {};
		this._MenuElement				= [];
		this._MenuCreated				= false;

		// **************************************************************
		// イベント処理
		// **************************************************************

		// メニュークリック
		this.eventMenuClick = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// clickしたメニュー情報取得
				var wSelectMenu = self.getClickMenu( this );
				if ( !wSelectMenu ) return false;

				// 無効メニューは処理しない
				if ( wSelectMenu.disabled ) return false;

				// 閉じる
				self.hideMenu();
				
				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, wSelectMenu );

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
		throw { name: 'clsMenuList.' + e.name, message: e.message };
	}
};

// 基本メニュー prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsMenuList, clsMenuBase );


	// **************************************************************
	// プロパティ設定
	// **************************************************************

	// メニューリスト設定
	clsMenuList.prototype.initMenuList = function( pArgument ) {
		try {
			if ( !pArgument ) return;

			var wArgMenu = pArgument.menuList;
			if ( !wArgMenu ) return;

			// 配列で指定
			if ( this.isArray(wArgMenu) ) {
				// 内容を複写
				for( var wIdx = 0; wIdx < wArgMenu.length; wIdx++ ) {
					this._MenuList.push( wArgMenu[wIdx] );

				}

			// object指定
			} else if ( this.isObject(wArgMenu) ) {
				// Key順にソート
				var wSortMenu = this.sortNumObject( wArgMenu );
				// 配列にして設定
				var wFirst = true;
				for( var wKey in wSortMenu ) {
					if ( wFirst ) {
						wFirst = false;
					} else {
						this._MenuList.push( { kind: 'blank', title: '－' } ); 
					}

					if ( this.isArray(wSortMenu[wKey]) ) {
						this._MenuList = this._MenuList.concat( wSortMenu[wKey] );

					} else if( this.isObject(wSortMenu[wKey]) ) {
						this._MenuList.push( wSortMenu[wKey] );

					}
				}

			}


			return true;

		} catch(e) {
			throw { name: 'initMenuList.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// メニュー選択
	// **************************************************************

	// 選択メニュー内容取得
	clsMenuList.prototype.getClickMenu = function( pMenuEle ) {
		try {
			// click位置の要素取得
			if ( !pMenuEle ) return null;

			// idからメニューkey取得
			var wId = pMenuEle.id
			if ( !wId ) return null;
			wId = wId.replace( '_link', '' );

			// メニュー内容取得
			var wContents = this._MenuContents[wId];
			if ( !wContents ) return null;
			
			return wContents;

		} catch(e) {
			throw { name: 'getClickMenu', message: e.message };
		}
	};


	// **************************************************************
	// メニュー設定
	// **************************************************************

	// メニュー区切り要素生成
	clsMenuList.prototype.setMenuBlank = function( pIdx ) {
		try {
			var wBeseEle = this.getBoxElement();
			if ( !wBeseEle ) return false;

			var wBlankTag = '';
			wBlankTag += "<div class='cssMenuList-blank'></div>";

			wBeseEle.innerHTML += wBlankTag;

		} catch(e) {
			throw { name: 'setMenuBlank', message: e.message };
		}
	};

	// メニュー要素生成
	clsMenuList.prototype.setMenuContents = function( pIdx, pMenu, pProperty ) {
		try {
			var wBeseEle = this.getBoxElement();
			if ( !wBeseEle ) return false;

			var wId = this.getBoxId();

			// ベース要素追加
			var wDivId  = wId + '_menu_' + String(pIdx);
			var wDivEle = this.addElement( 'div', wDivId );
			if ( !wDivEle ) return false;

			this.addClass( wDivEle, 'cssMenuList-button' );
			this.setStyle( wDivEle, pProperty );

			this.appendBoxToParent( wDivEle );

			// 内容追加
			var wLinkId  = wDivId + '_link';
			var wLinTag = this.addElement( 'a', wLinkId );
			if ( !wLinTag ) {
				this.delElement( wDivEle );
				return false;
			}
			wLinTag.href = "#";

			var wMenuTag = "<span id='" + wDivId + '_span' + "' style='padding-left: 10px;'>" + pMenu.title + "</span>";

			wLinTag.innerHTML += wMenuTag;

			// メニューへ追加
			this.appendElementToParent( wDivEle, wLinTag )

			// メニュー情報保存
			this._MenuContents[wDivId] = { index: pIdx, title: pMenu.title, kind: pMenu.kind };
			this._MenuElement.push( wDivEle );

		} catch(e) {
			throw { name: 'setMenuContents.' + e.name, message: e.message };
		}
	};

	// メニューリスト最大横幅取得
	clsMenuList.prototype.getMaxMenuWidth = function() {
		try {
			if ( !this._MenuList ) return 0;
			if ( !this._MenuList.length ) return 0;

			var wWidth	= 0;
			var wTemp	= 0;
			var wTitle	= '';

			for( var i = 0; i < this._MenuList.length; i++ ) {
				if ( this._MenuList[i].kind !== 'blank' ) {
					wTitle = this._MenuList[i].title;
					wTemp = (String(wTitle).length * this._DEF_MENU_FONT_WIDTH);
					if ( wTemp > wWidth ) wWidth = wTemp;
				}
			}

			return wWidth;

		} catch(e) {
			throw { name: 'getMaxMenuWidth', message: e.message };
		}
	};

	// メニュー要素へ選択時イベント設定
	clsMenuList.prototype.setMenuContentsEvent = function( pKey ) {
		try {
			// linkへclickイベント設定
			var wLinkEle = this.getElement(pKey + '_link');
			if ( !wLinkEle ) return;

			this.addEvent( wLinkEle, 'onclick', this.eventMenuClick );
			
		} catch(e) {
			throw { name: 'setMenuContentsEvent.' + e.name, message: e.message };
		}
	};

	// メニュー要素を初期設定
	clsMenuList.prototype.createMenuContents = function() {
		try {
			if ( !this._MenuList ) return false;
			if ( !this._MenuList.length ) return false;

			var wProperty = this._DEF_MENU_LIST_LIST_PROPERTY;
			var wBgColor = this.getBoxProperty('background-color');
			if ( wBgColor ) {
				wProperty['background-color'] = wBgColor;
			}

			// html設定
			for( var i = 0; i < this._MenuList.length; i++ ) {
				if ( this._MenuList[i].kind === 'blank' ) {
					this.setMenuBlank(i);
				} else {
					this.setMenuContents( i, this._MenuList[i], wProperty );
				}
			}

			// リンクclickイベント設定
			for ( var wKey in this._MenuContents ) {
				this.setMenuContentsEvent( wKey );
			}

			// 横幅調整
			var wWidth    = this.getMaxMenuWidth();
			if ( wWidth < this._DEF_MENU_LIST_MIN_WIDTH ) wWidth = this._DEF_MENU_LIST_MIN_WIDTH;
			this.setBoxStyle( { width: (wWidth + 'px') } );

			// 内容設定済
			this._MenuCreated = true;

		} catch(e) {
			throw { name: 'createMenuContents.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// メニュー変更
	// **************************************************************

	// メニューの使用状態を変更
	clsMenuList.prototype.disabledMenu = function( pKind, pDisabled ) {
		try {
			if ( !this._MenuContents ) return;

			var wTargetKey = '';
			for ( var key in this._MenuContents ) {
				if ( this._MenuContents[key].kind == pKind ) {
					wTargetKey = key;
					break;
				}
			}
			if ( !wTargetKey ) return;
			
			// 対象メニューの状態を変更
			var wMenuEle = this.getElement(wTargetKey + '_span');
			if ( wMenuEle ) {
				if ( pDisabled ) {
					this.setStyle( wMenuEle, { 'color': '#999999' } );
				} else {
					this.setStyle( wMenuEle, { 'color': '#000000' } );
				}
				this._MenuContents[wTargetKey].disabled = pDisabled;
			}

		} catch(e) {
			throw { name: 'disabledMenu.' + e.name, message: e.message };
		}
	};

	// メニューの表示状態を変更
	clsMenuList.prototype.visibledMenu = function( pVisible, pKind ) {
		try {
			if ( !this._MenuContents ) return;

			// 対象設定
			var wChkKd = '';
			if ( typeof pKind == 'string' ) wChkKd = pKind;

			var wTarget;
			for ( var wKey in this._MenuContents ) {
				if ( wChkKd.length == 0 ) {
					wTarget = true;
				} else if ( wChkKd == this._MenuContents[wKey].kind ) {
					wTarget = true;
				} else {
					wTarget = false;
				}
				
				if ( wTarget ) {
					// 対象メニューの状態を変更
					var wMenuEle = this.getElement(wKey);
					if ( wMenuEle ) {
						if ( pVisible ) {
							this.setStyle( wMenuEle, { 'display': 'block' } );
						} else {
							this.setStyle( wMenuEle, { 'display': 'none' } );
						}
					}

					// 対象指定時は対象のみ
					if ( wChkKd.length > 0 ) break;
				}
			}

		} catch(e) {
			throw { name: 'visibledMenu.' + e.name, message: e.message };
		}
	};

	// メニュー（区切り）の表示状態を変更
	clsMenuList.prototype.visibledBlank = function( pVisible, pIdx ) {
		try {
			if ( !this._MenuContents ) return;

			// 対象メニューの状態を変更
			var wBlankEle = this.getBoxElementByClass('cssMenuList-blank');
			if ( wBlankEle ) {
				var wTarget = true;
				for( var wIndex = 0; wIndex < wBlankEle.length; wIndex++ ) {
					if ( typeof pIdx != 'undefined' ) {
						if( String(pIdx) == String(wIndex+1) ) {
							wTarget = true;
						} else {
							wTarget = false;
						}
					}

					if ( wTarget ) {
						if ( pVisible ) {
							this.setStyle( wBlankEle[wIndex], { 'display': 'block' } );
						} else {
							this.setStyle( wBlankEle[wIndex], { 'display': 'none' } );
						}
					}
				}
			}

		} catch(e) {
			throw { name: 'visibledBlank.' + e.name, message: e.message };
		}
	};

	// メニューの内容を設定する
	clsMenuList.prototype.setMenuList = function( pParam ) {
		try {
			// 内容設定済は処理不可
			if ( this._MenuCreated ) return;

			// メニュー未設定時
			if ( this._MenuList.length == 0 ) {
				// パラメータからメニューリスト設定
				this.initMenuList( pParam );

			}

			// 内容生成
			if ( this._MenuList.length > 0 ) {
				// メニュー初期設定
				this.createMenu();

			}

		} catch(e) {
			throw { name: 'setMenuList.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニュー要素を初期設定
	clsMenuList.prototype.createMenu = function() {
		try {
			// メニュー内容生成
			this.createMenuContents();

			// 継承元初期設定
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuList.createMenu.' + e.name, message: e.message };
		}
	};

	// メニューを表示する
	clsMenuList.prototype.dspMenu = function( pParam ) {
		try {
			if ( pParam ) {
				// メニュー再設定
				this.setMenuList( pParam );
				
				// 一旦全メニュー表示
				this.visibledMenu( true );
				this.visibledBlank( true );

				// 非表示メニュー設定
				if ( pParam.hide ) {
					if ( this.isArray(pParam.hide) ) {
						for( var wIdx = 0; wIdx < pParam.hide.length; wIdx++ ) {
							this.visibledMenu( false, pParam.hide[wIdx] );
						}
					
					} else {
						this.visibledMenu( false, pParam.hide );

					}
				}

				if ( pParam.blank ) {
					if ( this.isArray(pParam.blank) ) {
						for( var wIdx = 0; wIdx < pParam.blank.length; wIdx++ ) {
							this.visibledBlank( false, pParam.blank[wIdx] );
						}
					
					} else {
						this.visibledBlank( false, pParam.blank );

					}
				}
			}
			
			// メニュー未設定時は表示しない
			if ( this._MenuList.length == 0 ) return false;

			// サイズ再設定
			this.saveMenuSize();

			// 継承元メニュー表示
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}

		} catch(e) {
			throw { name: 'clsMenuList.dspMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsMenuList.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_LIST_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu-list」
				wInitArgument.kind = this._DEF_MENU_LIST_KIND;
			}

			// メニュー内容設定
			this.initMenuList( pArgument );

			// 継承元コンストラクタ
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsMenuList.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsMenuList.prototype.freeClass = function() {
		try {
			// プロパティ開放
			var wMenu;
			var wMenuLink;
			for( var wIdx = 0; wIdx < this._MenuElement.length; wIdx++ ) {
				wMenu = this._MenuElement[wIdx];
				if ( !wMenu ) continue;

				wMenuLink = this.getElement(wMenu.id + '_link');
				if ( wMenuLink ) {
					this.execFunction( this.delEvent, wMenuLink, 'onclick', this.eventMenuClick );
				}
				this._MenuElement[wIdx] = null;
			}

			this._MenuList					= null;
			this._MenuContents				= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
