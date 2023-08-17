// --------------------------------------------------------------------
//
// グループ項目クラス
//
// --------------------------------------------------------------------
// clsItemGroup ← clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsItemGroup = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_GROUP_KIND				= 'item-group';

		this._DEF_ITEM_GROUP_PROPERTY			= {
			 'z-index'				: '200'
		};

		this._DEF_ITEM_GROUP_MENU				= {
			 3: [
				{ kind: 'resize'	, title: 'サイズ変更'	}
			 ]
		};

		this._DEF_ITEM_GROUP_MENU_POSITION		= {
			 1: [
				{ kind: 'resize'	, title: 'サイズ変更'	}
			 ]
		};

		this._DEF_ITEM_GROUP_LIST_RELATION		= {
				  1		: '家族'
				, 2		: '親族'
				, 10	: '医療機関'
				, 11	: 'その他機関'
		};

		// ----------------------------
		// グループ　連絡先
		// ----------------------------

		// 連絡先設定
		this._DEF_ITEM_GROUP_CONTACT_FAX_NAME	= {
				  name		: 'contact-fax'
				, title		: '連絡先2'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: 'FAX番号'
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_GROUP_CONTACT_FAX_NO		= {
				  name		: 'contact-fax-no'
				, title		: '番号'
				, type		: 'text'
				, length	: 13
				, display	: true
				, default	: ''
				, design	: {
					 head	: { width: '0px', display: 'none' }
					,data	: { width: '110px' }
					,input	: { width: '96px' }
				}
		};

		this._DEF_ITEM_GROUP_CONTACT			= {
			  2: [ this._DEF_ITEM_GROUP_CONTACT_FAX_NAME	, this._DEF_ITEM_GROUP_CONTACT_FAX_NO  ]
		};

		// 継承元クラスのprototype
		this._ItemPrototype				= null;


		// **************************************************************
		// コンストラクタ
		// **************************************************************
		// 親クラスのprototypeを保存
		this._ItemPrototype = clsItemBox.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsItemBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsItemGroup.' + e.name, message: e.message };
	}
};

// グループ prototype
(function(){
	// clsItemBoxのプロトタイプを継承
	clsInheritance( clsItemGroup, clsItemBox );


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// -------------------
	// メニュー関連
	// -------------------

	// コンテキストメニュー表示
	clsItemGroup.prototype.execContextDsp = function( pEvent, pParam ) {
		try {

			// 継承元メニュー表示処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execContextDsp.call( this, pEvent, pParam );

			}

		} catch(e) {
			throw { name: 'clsItemGroup.execContextDsp', message: e.message };
		}
	};

	// グループ用コンテキストメニュー選択時処理
	clsItemGroup.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
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
			throw { name: 'clsItemGroup.execContextSelect.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsItemGroup.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_GROUP_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「item-group」
				wInitArgument.kind = this._DEF_ITEM_GROUP_KIND;

			}

			// 追加メニュー設定
			wInitArgument.menuList		= this._DEF_ITEM_GROUP_MENU;

			// 追加位置調整メニュー設定
			wInitArgument.positionList	= this._DEF_ITEM_GROUP_MENU_POSITION;

			// 追加ステータス設定
			var wUpdProperty = {
					title		: {
						 title	: '種別'
						,list	: this._DEF_ITEM_GROUP_LIST_RELATION
					}
			};
			wInitArgument.statusProperty = wUpdProperty;

			// 追加連絡先設定
			wInitArgument.contactList	= this._DEF_ITEM_GROUP_CONTACT;

			// 継承元コンストラクタ
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsItemGroup.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsItemGroup.prototype.freeClass = function() {
		try {
			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
