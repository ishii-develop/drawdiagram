
// --------------------------------------------------------------------
//
// 項目BOXクラス
//
// --------------------------------------------------------------------
// clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsItemBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_KIND				= 'item';

		this._DEF_ITEM_PROPERTY			= {
			 'z-index'				: '300'
		};

		// ----------------------------------
		// 基本メニュー設定
		// ----------------------------------
		this._DEF_ITEM_MENU_CONTEXT		= {
			  1: [
				  { kind: 'status'		, title: '情報設定'		}
				 ,{ kind: 'contact'		, title: '連絡先'		}
			  ]
			, 2: [
				  { kind: 'relation'	, title: '関連付け'		}
				, { kind: 'relationChg'	, title: '関連変更'		}
				, { kind: 'unrelation'	, title: '関連解除'		}
			 ]
			, 3: [
				  { kind: 'color'		, title: '色変更'		}
			  ]
			, 4: [
				 { kind: 'delete'		, title: '削除'			}
			  ]
		};

		// ※移動を有効化したい場合は「_DEF_ITEM_MENU_ADD_USE」を「true」
		this._DEF_ITEM_MENU_ADD_USE		= false;
		this._DEF_ITEM_MENU_CONTEXT_ADD	= {
			 3: [
				{ kind: 'move'		, title: '移動'			}
			 ]
		};

		this._DEF_ITEM_MENU_POSITION		= {
			  1: [
				  { kind: 'pos-vert'	, title: '縦位置を合わせる'		}
				 ,{ kind: 'pos-side'	, title: '横位置を合わせる'		}
			  ]
		};

		// ----------------------------------
		// 基本情報設定
		// ----------------------------------
		this._DEF_ITEM_STATUS_NAME = {
				  name		: 'name'
				, title		: '名前'
				, type		: 'text'
				, length	: 90
				, display	: true
				, default	: ''
				, design	: {
					 data	: { width: '230px' }
					,input	: { width: '220px' }
				}
		};

		this._DEF_ITEM_STATUS_NAME_FLG = {
				  name		: 'name-flg'
				, title		: '名前表示有無'
				, type		: 'check'
				, length	: 1
				, display	: false
				, default	: 1
				, list		: {
					1		: '表示する'
				}
				, design	: {
					 head	: { width: '0px', display: 'none' }
				}
		};

		this._DEF_ITEM_STATUS_KANA = {
				  name		: 'kana'
				, title		: 'カナ名'
				, type		: 'text'
				, length	: 90
				, display	: false
				, default	: ''
				, design	: {
					input	: { width: '300px' }
				}
		};

		this._DEF_ITEM_STATUS_TITLE = {
				  name		: 'title'
				, title		: '表示名'
				, type		: 'text-combo'
				, length	: 8
				, display	: false
				, default	: ''
				, design	: {
					 data	: { width: '230px' }
					,input	: { width: '112px' }
				}
		};

		this._DEF_ITEM_STATUS_TITLE_FLG = {
				  name		: 'title-flg'
				, title		: '表示有無'
				, type		: 'check'
				, length	: 1
				, display	: false
				, default	: 1
				, list		: {
					1		: '表示する'
				}
				, design	: {
					 head	: { width: '0px', display: 'none' }
				}
		};

		this._DEF_ITEM_STATUS_BASE		= {
			  1: [ this._DEF_ITEM_STATUS_NAME	, this._DEF_ITEM_STATUS_NAME_FLG  ]
			, 2: [ this._DEF_ITEM_STATUS_KANA ]
			, 3: [ this._DEF_ITEM_STATUS_TITLE	, this._DEF_ITEM_STATUS_TITLE_FLG ]
		};

		
		// ----------------------------------
		// 連絡先設定
		// ----------------------------------
		this._DEF_ITEM_CONTACT_TEL_NAME = {
				  name		: 'contact-tel'
				, title		: '連絡先1'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: '電話番号'
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_CONTACT_TEL_NO = {
				  name		: 'contact-tel-no'
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

		this._DEF_ITEM_CONTACT_ADD_NAME = {
				  name		: 'contact-add'
				, title		: '連絡先'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: ''
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_CONTACT_ADD_NO = {
				  name		: 'contact-add-no'
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

		this._DEF_ITEM_CONTACT_BASE	= {
			  1: [ this._DEF_ITEM_CONTACT_TEL_NAME	, this._DEF_ITEM_CONTACT_TEL_NO  ]
		};

		this._DEF_ITEM_CONTACT_ADD		= {
			  1: [ this._DEF_ITEM_CONTACT_ADD_NAME	, this._DEF_ITEM_CONTACT_ADD_NO  ]
		};

		// 継承元クラスのprototype
		this._BasePrototype				= null;

		this._ItemCallback				= null;

		this._ItemMenuContext			= null;
		this._ItemMenuPosition			= null;
		this._ItemMenuColor				= null;
		this._ItemMenuStatus			= null;
		this._ItemMenuContact			= null;
		this._ItemFireEventParam		= {};

		this._ItemControlLocked			= false;
		this._ItemContextAvailable		= false;
		this._ItemPositionAvailable		= false;
		this._ItemSelect				= { main: false, relation: false };

		// 項目削除可否
		this._ItemCanDelete				= true;

		// 項目ドラッグ移動可否
		this._ItemMoveDrag				= false;
		this._ItemMoveInit				= false;

		// { 
		//   id				: 関連項目　ID
		// , kind			: 関連項目　種別
		// , key			: 関連項目　中継点のID
		// , parent			: 関係の「主」かどうか
		// , relationInf	: 関連付け情報（clsItemRelationへの参照）
		// }
		this._ItemRelation				= {};
		this._ItemRelationSetId			= '';

		this._ItemStatus				= { contents: null, values: null };
		this._ItemStatusDef				= { contents: null, values: null };
		this._ItemContact				= { contents: null, values: null };
		this._ItemContactDef			= { contents: null, values: null };


		// **************************************************************
		// イベント処理
		// **************************************************************

		// コンテキストメニュー　イベント
		this.eventMenuDsp = function( pEvent, pParam ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 項目操作キャンセルを通知
				self.execItemCtrlCancel();

				// メニュー有効時のみ処理
				if ( !self.chkItemMenuAvailable() ) return true;

				if ( self._ItemContextAvailable ) {
					// コンテキストメニュー表示
					self.execContextDsp( pEvent, pParam );

				}
				else if ( self._ItemPositionAvailable ) {
					// 位置調整メニュー表示
					self.execPositionDsp( pEvent, pParam );

				}
				
			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// コンテキストメニュー　選択時イベント処理
		this.eventMenuSelect = function( pEvent, pSelectMenu ) {
			try {
				// メニュー選択時処理実行
				var wRetVal = self.execContextSelect( pEvent, pSelectMenu );

				return wRetVal;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// カラーパレット選択時イベント
		this.eventColorSelect = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// 色選択時
				var wColor = pParam.color;

				// 背景色変更
				self.setBoxStyle( { 'background-color' : wColor } );

				// 親へ変更を通知
				// 　パラメータ：選択色
				return self.execItemCallback( pEvent, { kind: 'color', color: wColor } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 関連情報設定メニュー処理
		this.eventRelationSet = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind == 'close' ) return false;

				// 関連IDを通知
				pParam.relationId = self._ItemRelationSetId;

				// 関連付け対象選択開始
				// ※親オブジェクトへ変更を通知
				return self.execItemCallback( pEvent, pParam );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ステータス更新時イベント
		this.eventStatusUpdate = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pParam.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				if ( !pParam.statusValue ) return false;

				// 設定値で情報更新
				self.copyProperty( pParam.statusValue, self._ItemStatus.values );

				// ステータス更新時処理
				self.execStatusMenu( pEvent, pParam );

				// 項目変更通知不要時
				if ( pParam.notCallback ) {
					return true;
				
				} else {
					// 親へ変更を通知
					return self.execItemCallback( pEvent, { kind: 'status' } );
				
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 連絡先更新時イベント
		this.eventContactUpdate = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pParam.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				if ( !pParam.statusValue ) return false;

				// 設定値で情報更新
				self.copyProperty( pParam.statusValue, self._ItemContact.values );

				if ( pParam.statusList ) {
					for( var wKey in pParam.statusList ) {
						self._ItemContact.contents[wKey] = pParam.statusList[wKey];
					}
				}

				// 項目変更通知不要時
				if ( pParam.notCallback ) {
					return true;
				
				} else {
					// 親へ変更を通知
					return self.execItemCallback( pEvent, { kind: 'contact' } );
				
				}

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
		throw { name: 'clsItemBox.' + e.name, message: e.message };
	}
};


// 項目 prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsItemBox, clsBaseBox );

	// **************************************************************
	// 情報取得
	// **************************************************************

	// 項目が人物かどうか
	clsItemBox.prototype.isPerson = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-person' );

		} catch(e) {
			throw { name: 'isPerson.' + e.name, message: e.message };
		}
	};

	// 項目がグループかどうか
	clsItemBox.prototype.isGroup = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-group' );

		} catch(e) {
			throw { name: 'isPerson.' + e.name, message: e.message };
		}
	};

	// 項目がコメントかどうか
	clsItemBox.prototype.isComment = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-comment' );

		} catch(e) {
			throw { name: 'isComment.' + e.name, message: e.message };
		}
	};

	// 項目が中継点かどうか
	clsItemBox.prototype.isRelation = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-relation' );

		} catch(e) {
			throw { name: 'isRelation.' + e.name, message: e.message };
		}
	};

	// 項目が中継点かどうか
	clsItemBox.prototype.isFreeLine = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-freeline' );

		} catch(e) {
			throw { name: 'isFreeLine.' + e.name, message: e.message };
		}
	};

	// 項目の色取得
	clsItemBox.prototype.getItemColor = function() {
		try {
			// 背景色取得
			var wStyle = this.getBoxStyle( 'background-color' );

			return wStyle;

		} catch(e) {
			throw { name: 'getItemColor.' + e.name, message: e.message };
		}
	};

	// 項目のclassチェック
	clsItemBox.prototype.chkItemClass = function( pClass ) {
		try {
			// クラス設定済かチェック
			var wExists = this.chkBoxClass( pClass );

			return wExists;

		} catch(e) {
			throw { name: 'chkItemClass.' + e.name, message: e.message };
		}
	};

	// 項目操作可否取得
	clsItemBox.prototype.getItemLockIs = function() {
		try {
			// 項目操作可否取得
			return this._ItemControlLocked;

		} catch(e) {
			throw { name: 'getItemLockIs', message: e.message };
		}
	};

	// 項目の削除可否取得
	clsItemBox.prototype.getItemDelIs = function() {
		try {
			// 削除可否取得
			return this._ItemCanDelete;

		} catch(e) {
			throw { name: 'getItemDelIs', message: e.message };
		}
	};

	// 項目のドラッグ移動可否取得
	clsItemBox.prototype.getItemDragIs = function() {
		try {
			// ドラッグ移動可否取得
			return this._ItemMoveDrag;

		} catch(e) {
			throw { name: 'getItemDragIs', message: e.message };
		}
	};

	// 項目のドラッグ移動可否初期値取得
	clsItemBox.prototype.getItemMoveInitIs = function() {
		try {
			// ドラッグ移動可否初期値取得
			return this._ItemMoveInit;

		} catch(e) {
			throw { name: 'getItemMoveInitIs', message: e.message };
		}
	};

	// ステータス設定値を取得
	clsItemBox.prototype.getStatusValues = function( pKey ) {
		try {
			// Key設定時は特定値のみ
			if ( pKey ) {
				return this._ItemStatus.values[pKey];

			// Key未設定時は全て
			} else {
				var wStatusValues = {};
				
				this.copyProperty( this._ItemStatus.values, wStatusValues );

				return wStatusValues;
			}

		} catch(e) {
			throw { name: 'getStatusValues', message: e.message };
		}
	};

	// ステータス内容を取得
	clsItemBox.prototype.getStatusContents = function( pName ) {
		try {
			var wRetContents = null;

			var wStatLine;
			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];

				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					if ( !wStatLine[wCol].name ) continue;
					
					if ( String(pName) == String(wStatLine[wCol].name) ) {
						wRetContents = wStatLine[wCol];
						break;
					
					}
				}
			}
			return wRetContents;

		} catch(e) {
			throw { name: 'getStatusContents', message: e.message };
		}
	};

	// 連絡先設定値を取得
	clsItemBox.prototype.getContactValues = function( pKey ) {
		try {
			if ( !this._ItemContact.contents ) return null;

			// Key設定時は特定値のみ
			if ( pKey ) {
				return this._ItemContact.values[pKey];

			// Key未設定時は全て
			} else {
				var wContactValues = {};
				
				var wName;
				var wValNm;
				var wValNo;
				for( var wLine in this._ItemContact.contents ) {
					wValNm = '';
					wName = this._ItemContact.contents[wLine][0].name;
					if ( wName ) {
						wValNm = this._ItemContact.values[wName];
						if ( typeof wValNm == 'undefined' ) wValNm = '';
					}

					wName = this._ItemContact.contents[wLine][1].name;
					if ( wName ) {
						wValNo = this._ItemContact.values[wName];
						if ( typeof wValNo == 'undefined' ) wValNo = '';
					}

					wContactValues[wLine] = { name: wValNm, no: wValNo };

				}
				return wContactValues;
			}

		} catch(e) {
			throw { name: 'getContactValues', message: e.message };
		}
	};


	// **************************************************************
	// 項目表示
	// **************************************************************

	// 項目を表示する
	clsItemBox.prototype.dspItem = function( pDisplay, pPoint, pFront ) {
		try {
			if ( pPoint ) {
				var wPosition = { top: 0, left: 0 };
				if ( pPoint.x ) {
					wPosition.left = pPoint.x;
				}

				if ( pPoint.y ) {
					wPosition.top = pPoint.y;
				}
				wPosition.top  = wPosition.top  + 'px';
				wPosition.left = wPosition.left + 'px';

				this.setBoxStyle( wPosition );
			}
			this.dspBox( pDisplay, pFront );

		} catch(e) {
			throw { name: 'dspItem.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 関係項目
	// **************************************************************

	// 関係項目取得
	clsItemBox.prototype.getRelationList = function( pKey ) {
		try {
			if ( !this._ItemRelation ) return null;

			// Keyチェック有無設定
			var wKeyChk;
			if ( !pKey ) {
				wKeyChk = false;
			} else {
				wKeyChk = true;
			}

			var wRetList = {};

			var wParam;
			for( var key in this._ItemRelation ) {
				wParam = this._ItemRelation[key];
				if ( !wParam ) continue;

				// KEYチェック
				if ( wKeyChk ) {
					if ( typeof wParam[pKey] == 'undefined' ) continue;
					if ( wParam[pKey] != true ) continue;
				}

				wRetList[key] = wParam;

			}

			return wRetList;

		} catch(e) {
			throw { name: 'getRelationList.' + e.name, message: e.message };
		}
	};

	// 関係項目追加
	// pParam = { 
	//   id				: 関連項目　ID
	// , kind			: 関連項目　種別
	// , key			: 関連項目　中継点のID
	// , parent			: 関係の「主」かどうか
	// , relationInf	: 関連付け情報（clsItemRelationへの参照）
	// }
	clsItemBox.prototype.addRelationItem = function( pId, pParam ) {
		try {
			// 関連情報追加
			this._ItemRelation[pId] = pParam;
			this._ItemRelation[pId].id = pId;

		} catch(e) {
			throw { name: 'addRelationItem.' + e.name, message: e.message };
		}
	};

	// 関係項目削除
	clsItemBox.prototype.delRelationItem = function( pId ) {
		try {
			// 関連情報削除
			if ( pId in this._ItemRelation ) {
				// 情報削除
				delete this._ItemRelation[pId];

			}

		} catch(e) {
			throw { name: 'delRelationItem.' + e.name, message: e.message };
		}
	};

	// 関係項目全て削除
	clsItemBox.prototype.delRelationAll = function( ) {
		try {
			if ( !this._ItemRelation ) return;

			// 関連情報削除
			for ( var wId in this._ItemRelation ) {
				// 情報削除
				delete this._ItemRelation[wId];

			}

		} catch(e) {
			throw { name: 'delRelationAll.' + e.name, message: e.message };
		}
	};

	// 関係項目チェック
	clsItemBox.prototype.chkRelationItem = function( pId ) {
		try {
			if ( !this._ItemRelation ) return false;

			var wCheck = false;

			// 対象ID指定時
			if ( pId ) {
				// KEY存在チェック
				if ( pId in this._ItemRelation ) {
					wCheck = true;
				
				}
			
			// 未指定時
			} else {
				for( var wKey in this._ItemRelation ) {
					if ( !this._ItemRelation[wKey] ) continue;

					wCheck = true;
					break;
				}

			}
			return wCheck;

		} catch(e) {
			throw { name: 'chkRelationItem', message: e.message };
		}
	};

	// 関係項目取得
	clsItemBox.prototype.getRelationItem = function( pId ) {
		try {
			if ( !this._ItemRelation ) return null;

			var wResultItem = null;

			// KEY存在チェック
			if ( pId in this._ItemRelation ) {
				wResultItem = this._ItemRelation[pId];
			
			}
			return wResultItem;

		} catch(e) {
			throw { name: 'getRelationItem', message: e.message };
		}
	};

	// 関係項目との中継点チェック
	clsItemBox.prototype.chkRelationItemRelay = function( pId ) {
		try {
			if ( !this._ItemRelation ) return false;

			var wCheck = false;
			var wRelId;

			for( var wKey in this._ItemRelation ) {
				if ( !this._ItemRelation[wKey] ) continue;
				if ( !this._ItemRelation[wKey].relationInf ) continue;

				wRelId = this._ItemRelation[wKey].relationInf.getBoxId();
				if ( wRelId == pId ) {
					wCheck = true;
					break;
				
				}
			}

			return wCheck;

		} catch(e) {
			throw { name: 'chkRelationItemRelay', message: e.message };
		}
	};


	// **************************************************************
	// 項目選択
	// **************************************************************

	// 項目選択状態設定
	clsItemBox.prototype.selectItem = function( pSelected ) {
		try {
			// 状態変更なければ処理なし
			if ( (this._ItemSelect.main == pSelected) && (!this._ItemSelect.relation) ) return false;

			if ( pSelected ) {
				// クラス削除（関係項目）
				this.delBoxClass( 'cssItem-sel-rel' );

				// クラス追加（主項目）
				this.setBoxClass( 'cssItem-sel' );

			} else {
				// クラス削除（主項目）
				this.delBoxClass( 'cssItem-sel' );

			}

			// 選択状態保存
			this._ItemSelect.main		= pSelected;
			this._ItemSelect.relation	= false;

			return true;

		} catch(e) {
			throw { name: 'selectItem.' + e.name, message: e.message };
		}
	};

	// 項目選択状態解除
	clsItemBox.prototype.selectItemFree = function() {
		try {
			// 状態変更なければ処理なし
			if ( !this._ItemSelect.main && !this._ItemSelect.relation ) return false;

			// クラス削除（関係項目）
			this.delBoxClass( 'cssItem-sel-rel' );

			// クラス削除（主項目）
			this.delBoxClass( 'cssItem-sel' );

			// 選択状態解除
			this._ItemSelect.main		= false;
			this._ItemSelect.relation	= false;
			
			return true;

		} catch(e) {
			throw { name: 'selectItemFree.' + e.name, message: e.message };
		}
	};

	// 項目選択状態設定チェック
	clsItemBox.prototype.selectItemIs = function( ) {
		try {
			// 選択状態返す
			return this._ItemSelect.main;

		} catch(e) {
			throw { name: 'selectItemIs.' + e.name, message: e.message };
		}
	};

	// 項目選択状態設定（関連項目）
	clsItemBox.prototype.selectItemRel = function( pSelected ) {
		try {
			// 状態変更なければ処理なし
			if ( (this._ItemSelect.relation == pSelected) && (!this._ItemSelect.main) ) return false;

			if ( pSelected ) {
				// クラス削除（主項目）
				this.delBoxClass( 'cssItem-sel' );

				// クラス追加（関係項目）
				this.setBoxClass( 'cssItem-sel-rel' );

			} else {
				// クラス削除（関係項目）
				this.delBoxClass( 'cssItem-sel-rel' );

			}

			// 選択状態保存
			this._ItemSelect.main		= false;
			this._ItemSelect.relation	= pSelected;

			return true;

		} catch(e) {
			throw { name: 'selectItemRel.' + e.name, message: e.message };
		}
	};

	// 項目選択状態設定（関連項目）チェック
	clsItemBox.prototype.selectItemRelIs = function( ) {
		try {
			// 選択状態返す
			return this._ItemSelect.relation;

		} catch(e) {
			throw { name: 'selectItemRelIs.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// イベント強制発火
	// **************************************************************

	// イベント強制発火
	clsItemBox.prototype.eventFire = function( pEvents, pParam ) {
		try {
			var wEvtEle = this.getBoxElement();
			if ( !wEvtEle ) return false;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);

			// イベントパラメータ保存
			this._ItemFireEventParam[wEvtKind] = pParam;

			// 強制発火
			var wResult = this.fireEvent( wEvtEle, pEvents );
			
			// エラー時はパラメータ削除
			if ( !wResult ) this.eventFireDel(pEvents);

			return wResult;

		} catch(e) {
			// 例外発生なしで強制発火情報削除
			this.execFunction( this.eventFireDel, pEvents );

			throw { name: 'eventFire.' + e.name, message: e.message };
		}
	};

	// 強制発火によるイベントパラメータ削除
	clsItemBox.prototype.eventFireDel = function( pEvents ) {
		try {
			if ( !this._ItemFireEventParam ) return;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);
			
			if (wEvtKind in this._ItemFireEventParam) {
				delete this._ItemFireEventParam[wEvtKind];
			}

		} catch(e) {
			throw { name: 'eventFireDel', message: e.message };
		}
	};

	// 強制発火によるイベント発生かチェック
	clsItemBox.prototype.eventFireIs = function( pEvents ) {
		try {
			if ( !this._ItemFireEventParam ) return false;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);

			if (wEvtKind in this._ItemFireEventParam) {
				return true;
			} else {
				return false;
			}

		} catch(e) {
			throw { name: 'eventFireIs', message: e.message };
		}
	};

	// 強制発火によるイベント発生時のパラメータ取得
	// ※取得後はイベント情報を破棄
	clsItemBox.prototype.eventFireParam = function( pEvents ) {
		try {
			if ( !this._ItemFireEventParam ) return false;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);
			
			var wRetParam = null;
			if (wEvtKind in this._ItemFireEventParam) {
				wRetParam = this._ItemFireEventParam[wEvtKind];

				// 例外発生なしで強制発火情報削除
				this.execFunction( this.eventFireDel, wEvtKind );
			}

			return wRetParam;

		} catch(e) {
			throw { name: 'eventFireParam', message: e.message };
		}
	};


	// **************************************************************
	// ステータス処理
	// **************************************************************

	// ステータスリスト初期設定
	clsItemBox.prototype.setStatusContents = function( pDefStat, pArgument ) {
		try {
			var self = this;

			// ステータスプロパティ　個別更新
			var updateStatProperty = function( pStatList, pStatName, pDataList ) {
				for ( var wLine in pStatList ) {
					if ( !pStatList[wLine] ) continue;
					if ( pStatList[wLine].length == 0 ) continue;

					for ( var wCol = 0; wCol < pStatList[wLine].length; wCol++ ){
						if ( !pStatList[wLine][wCol] ) continue;
						if ( pStatList[wLine][wCol].name != String(pStatName) ) continue;
						
						self.copyProperty( pDataList, pStatList[wLine][wCol] );
						return true;
					}
				}
				return false;
			};
			
			var wStatReplace = false;

			// 追加指定チェック
			var wArgStat = null;
			var wArgStatProp = null;
			if ( pArgument ) {
				// ステータス設定
				// ※object指定のみ許可
				if ( this.isObject(pArgument.statusList) ) {
					wArgStat = pArgument.statusList;
					if ( pArgument.statusReplace ) wStatReplace = true;
				}

				// ステータス　選択項目設定
				if ( this.isObject(pArgument.statusProperty) ) {
					wArgStatProp = pArgument.statusProperty;
				}
			}

			// デフォルト設定
			var wDefStat = {};

			// メニュー置換
			if ( wStatReplace ) {
				// 指定内容で置換
				this.copyProperty( wArgStat, wDefStat );

			// 置換しない
			} else {
				// 初期設定
				this.copyProperty( pDefStat, wDefStat );

				// 追加指定あり
				if ( wArgStat ) {
					// デフォルトに上書き／追加
					this.copyProperty( wArgStat, wDefStat );

				}

			}
			
			// プロパティ個別更新
			if ( wArgStatProp ) {
				for ( var wDatKey in wArgStatProp ) {
					// 複写したものを設定
					var wDataList = {};
					this.copyProperty( wArgStatProp[wDatKey], wDataList );

					updateStatProperty( wDefStat, wDatKey, wDataList );
				}
			}

			// Key順にソート
			return this.sortNumObject( wDefStat );

		} catch(e) {
			throw { name: 'setStatusContents.' + e.name, message: e.message };
		}
		return null;
	};

	// ステータス設定値初期化
	clsItemBox.prototype.initStatusValues = function( pContents ) {
		try {
			var wKey;
			var wStatLine;

			// 設定値初期化
			var wValues = {};

			for ( var wLine in pContents ) {
				wStatLine = pContents[wLine];

				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					wKey = wStatLine[wCol].name;
					wValues[wKey] = wStatLine[wCol].default;
				}
			}
			return wValues;

		} catch(e) {
			throw { name: 'initStatusValues', message: e.message };
		}
	};

	// ステータス内容　設定値更新
	clsItemBox.prototype.updStatusContents = function( pName, pTarget, pValue ) {
		try {
			if ( !this._ItemStatus.contents ) return;

			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];

				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					if ( String(pName) != String(wStatLine[wCol].name) ) continue;
					if ( typeof wStatLine[wCol][pTarget] !== 'undefined' ) wStatLine[wCol][pTarget] = pValue;
				}
			}

		} catch(e) {
			throw { name: 'updStatusContents', message: e.message };
		}
	};

	// ステータス内容　表示／非表示設定
	clsItemBox.prototype.setStatusDisplay = function() {
		try {
			if ( !this._ItemStatus.contents ) return;
			if ( !this._ItemStatus.values ) return;

			var wStatLine;
			var wName;
			var wDisplay;
			var wFlag;
			var wValue;
			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];
				
				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					wName = wStatLine[wCol].name;
					if ( !wName ) continue;

					// 表示切替項目なしは処理なし
					wFlag = this._ItemStatus.values[wName + '-flg'];
					if ( typeof wFlag == 'undefined' ) continue;

					wValue = this._ItemStatus.values[wName];
					if ( !wValue ) wValue = '';

					wDisplay = false;
					// flg有効　かつ　値設定時のみ表示
					if ( String(wFlag) == '1' ) {
						if ( String(wValue).length > 0 ) wDisplay = true;
					}

					// ステータス内容のdisplay更新
					this.updStatusContents( wName, 'display', wDisplay );
				}
			}
			
		} catch(e) {
			throw { name: 'setStatusDisplay.' + e.name, message: e.message };
		}
	};

	// ステータス画面表示
	clsItemBox.prototype.dspStatusMenu = function( pEvent, pCallback ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 項目操作キャンセルを通知
			this.execItemCtrlCancel();

			// ステータス表示
			if ( this._ItemMenuStatus ) {
				var wCallback = pCallback;
				if ( !wCallback ) wCallback = this.eventStatusUpdate;

				var wPoint	= this.getEventPos( pEvent );
				
				var wParam = {
					  x				: wPoint.x
					, y				: wPoint.y
					, callback		: wCallback
					, statusList	: this._ItemStatus.contents
					, statusValue	: this._ItemStatus.values
				};
				this._ItemMenuStatus.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspStatusMenu', message: e.message };
		}
	};

	// ステータス内容表示
	clsItemBox.prototype.dspStatusContents = function() {
		try {
			if ( !this._ItemStatus.contents ) return;
			if ( !this._ItemStatus.values ) return;

			var wContentsId;
			var wContentsNm = this.getBoxId() + '_contents';
			var wContentsEle;

			// 一旦全て非表示
			this.setElementStyle( wContentsNm, 'display', 'none' );

			// 表示設定
			var wValue;
			var wStatLine;
			var wContentsEle;
			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];
				
				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					// 表示対象でなければ処理なし
					if ( !wStatLine[wCol].display ) continue;

					wValue = this._ItemStatus.values[wStatLine[wCol].name];
					if ( typeof wValue == 'undefined' ) wValue = '';

					wContentsId = wContentsNm + '_' + wStatLine[wCol].name;
					wContentsEle = this.getElement(wContentsId);

					// 存在しなければ生成
					if ( !wContentsEle ) {
						var wDivEle = this.addElement( 'div', wContentsId );

						wDivEle.innerHTML	= "<span>" + wValue + "</span>";
						wDivEle.setAttribute( 'name', wContentsNm )
						this.addClass( wDivEle, 'cssItem-contents' );
						this.addClass( wDivEle, 'cssItem-contents-' + wStatLine[wCol].name );

						this.appendBoxToParent( wDivEle );

					// 既に存在
					} else if ( String(wValue).length > 0 ) {
						// 表示内容設定して表示
						wContentsEle.innerHTML = "<span>" + wValue.trim() + "</span>";
						this.setStyle( wContentsEle, { display : '' } ); 

					}
				}
			}

		} catch(e) {
			throw { name: 'dspStatusContents', message: e.message };
		}
	};

	// ステータス内容表示
	clsItemBox.prototype.setStatusTitle = function() {
		try {
			// 名称表示情報取得
			var wTitle = '';

			var wNameItem = this.getStatusContents('name');
			if ( wNameItem ) {
				// 非表示時のみタイトルとして設定
				if ( !wNameItem.display ) {
					var wValue = this._ItemStatus.values[wNameItem.name];
					if ( !wValue ) wValue = '';
					
					wTitle = wValue;
				}

			}
			// title属性を設定
			this.setBoxAttribute( { title: wTitle } );

		} catch(e) {
			throw { name: 'setStatusTitle.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 連絡先
	// **************************************************************

	// 連絡先画面表示
	clsItemBox.prototype.dspContactMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 項目操作キャンセルを通知
			this.execItemCtrlCancel();

			// ステータス表示
			if ( this._ItemMenuContact ) {
				var wPoint	= this.getEventPos( pEvent );
				
				var wParam = {
					  x				: wPoint.x
					, y				: wPoint.y
					, callback		: this.eventContactUpdate
					, statusList	: this._ItemContact.contents
					, statusValue	: this._ItemContact.values
					, statusAddList	: this._DEF_ITEM_CONTACT_ADD
				};
				this._ItemMenuContact.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspContactMenu', message: e.message };
		}
	};

	// 連絡先項目を設定
	clsItemBox.prototype.setContactContents = function( pValues ) {
		try {
			if ( !this._ItemContact.contents ) this._ItemContact.contents = {};

			this.copyProperty( pValues, this._ItemContact.contents );

		} catch(e) {
			throw { name: 'setContactContents', message: e.message };
		}
	};

	// 連絡先値を設定
	clsItemBox.prototype.setContactValues = function( pValues ) {
		try {
			if ( !this._ItemContact.values ) this._ItemContact.values = {};

			this.copyProperty( pValues, this._ItemContact.values );

		} catch(e) {
			throw { name: 'setContactValues', message: e.message };
		}
	};


	// **************************************************************
	// コンテキストメニュー処理
	// **************************************************************

	// 初期設定メニュー取得
	clsItemBox.prototype.getItemMenuDef = function( pDefMenu, pAddMenu ) {
		try {
			var wContextList = {};
			this.copyProperty( pDefMenu, wContextList );

			// 追加なければデフォルトを返す
			if ( !pAddMenu ) return wContextList;

			if ( this.isArray(pAddMenu) ) {
				if ( this.isArray(wContextList[1]) ) {
					wContextList[1] = pAddMenu.concat( wContextList[1] );
				} else {
					wContextList[1] = pAddMenu;
				}

			} else {
				for( var wKey in wContextList ) {
					if ( wContextList.hasOwnProperty(wKey) && pAddMenu.hasOwnProperty(wKey) ) {
						if ( this.isArray(wContextList[wKey]) ) {
							wContextList[wKey] = pAddMenu[wKey].concat( wContextList[wKey] );
						} else {
							wContextList[wKey] = pAddMenu[wKey];
						}
					}
				}

			}
			return wContextList;

		} catch(e) {
			throw { name: 'getItemMenuDef', message: e.message };
		}
	};

	// 項目追加メニュー設定
	clsItemBox.prototype.setItemMenuAdd = function( pAddMenu, pParamMenu ) {
		try {
			if ( !pAddMenu ) return true;

			// メニュー追加（パラメータのメニュー優先）
			var wAddItem;
			var wAddKind;
			var wParamItem;
			var wParamFind;

			for( var wAddKey in pAddMenu ) {
				if ( !pAddMenu.hasOwnProperty(wAddKey) ) continue;
				// パラメータメニューに存在
				if ( wAddKey in pParamMenu ) {
					// メニュー個別追加
					wAddItem = pAddMenu[wAddKey];
					wParamItem = pParamMenu[wAddKey];

					for( var wAddIdx = 0; wAddIdx < wAddItem.length; wAddIdx++ ) {
						// 同メニューチェック
						wParamFind = false;
						
						wAddKind = wAddItem[wAddIdx].kind;
						for ( var wIdx = 0; wIdx < wParamItem.length; wIdx++ ) {
							if ( wParamItem[wIdx].kind == wAddKind ) {
								wParamFind = true;
								break;
							}

						}

						// 未登録なら追加
						if ( !wParamFind ) {
							pParamMenu[wAddKey].push( wAddItem[wAddIdx] );

						}
					}

				// 存在しない
				} else {
					// メニュー追加
					pParamMenu[wAddKey] = pAddMenu[wAddKey];

				}
			}

			return true;

		} catch(e) {
			throw { name: 'setItemMenuAdd.' + e.name, message: e.message };
		}
	};

	// 項目メニュー初期設定取得
	clsItemBox.prototype.getItemMenuContents = function( pArgument, pDefMenu ) {
		try {
			var wMenuReplace = false;

			var wAddContext = null;
			if ( pArgument ) {
				if ( pArgument.menuList ) {
					wAddContext = pArgument.menuList;
					if ( pArgument.menuReplace ) wMenuReplace = true;
				}
			}

			var wContextList = {};
			// メニュー置換
			if ( wMenuReplace ) {
				// 指定内容で置換
				this.copyProperty( wAddContext, wContextList );

			// 置換しない
			} else {
				// 標準メニュー + 追加メニューを設定
				wContextList = this.getItemMenuDef( pDefMenu, wAddContext );
			}

			// Key順にソート
			return this.sortNumObject( wContextList );

		} catch(e) {
			throw { name: 'getItemMenuContents.' + e.name, message: e.message };
		}
	};

	// 項目メニュー使用可否チェック
	clsItemBox.prototype.chkItemMenuAvailable = function( pAvailable, pParam ) {
		try {
			// コンテキストメニュー有効時
			if ( this._ItemMenuContext ) {
				if ( this._ItemContextAvailable ) return true;

			}

			// コ位置調整メニュー有効時
			if ( this._ItemMenuPosition ) {
				if ( this._ItemPositionAvailable ) return true;

			}
			
			return false;

		} catch(e) {
			throw { name: 'chkItemMenuAvailable', message: e.message };
		}
	};

	// コンテキストメニュー使用有無設定
	clsItemBox.prototype.setContextAvailable = function( pAvailable, pParam ) {
		try {
			if ( !this._ItemMenuContext ) return;

			this._ItemContextAvailable = pAvailable;

			// コンテキストメニュー使用時は位置調整不可
			if ( pAvailable ) {
				// 位置調整メニュー有効化
				this.setPositionAvailable( false );
			}

		} catch(e) {
			throw { name: 'setContextAvailable', message: e.message };
		}
	};

	// コンテキストメニュー使用制限
	clsItemBox.prototype.disabledContextMenu = function( pKind, pDisabled ) {
		try {
			if ( this._ItemMenuContext ) {
				// 有効／無効設定
				this._ItemMenuContext.disabledMenu( pKind, pDisabled );
			}

		} catch(e) {
			throw { name: 'disabledContextMenu.' + e.name, message: e.message };
		}
	};

	// 位置調整メニュー使用有無設定
	clsItemBox.prototype.setPositionAvailable = function( pAvailable ) {
		try {
			if ( !this._ItemMenuPosition ) return;

			this._ItemPositionAvailable = pAvailable;

		} catch(e) {
			throw { name: 'setPositionAvailable', message: e.message };
		}
	};


	// **************************************************************
	// 共通メニュー処理
	// **************************************************************

	// 共通メニュー取得
	clsItemBox.prototype.loadPublicMenu = function( pMenuKey ) {
		try {
			var wPublicMenu = this.loadArgument( 'publicMenu' );
			if ( !wPublicMenu ) return null;

			// Key指定なければ全て
			if ( typeof pMenuKey == 'string' ) {
				if ( !(pMenuKey in wPublicMenu) ) return null;
				return wPublicMenu[pMenuKey];
			
			} else {
				return wPublicMenu;

			}

		} catch(e) {
			throw { name: 'loadPublicMenu', message: e.message };
		}
	};

	// 共通メニュー設定
	clsItemBox.prototype.setPublicMenu = function( pPublicMenu ) {
		try {
			var wPublicMenu = this.loadArgument( 'publicMenu' );
			if ( !wPublicMenu ) wPublicMenu = {};

			// 共通メニューを設定（上書き）
			for( var wKey in pPublicMenu ) {
				wPublicMenu[wKey] = pPublicMenu[wKey];
			}
			
			this.saveArgument( { publicMenu: wPublicMenu } );

		} catch(e) {
			throw { name: 'setPublicMenu', message: e.message };
		}
	};

	// 共通メニュー閉じる
	clsItemBox.prototype.closePublicMenu = function( pMenuKey ) {
		try {
			// メニュー閉じる
			function closeMenu( pMenuObj ) {
				if ( pMenuObj ) {
					// 非表示用関数あれば実行
					if ( typeof pMenuObj.hideMenu == 'function' ) {
						pMenuObj.hideMenu();

					}
				}

			};

			// 指定Keyメニューのみ
			if ( typeof pMenuKey == 'string' ) {
				closeMenu( this.loadPublicMenu[pMenuKey] );
			
			// Key指定なければ全て
			} else {
				var wPublicMenu = this.loadArgument( 'publicMenu' );
				if ( this.isObject(wPublicMenu) ) {
					for( var wKey in wPublicMenu ) {
						closeMenu( wPublicMenu[wKey] );
					
					}
				}
			}

		} catch(e) {
			throw { name: 'closePublicMenu', message: e.message };
		}
	};

	// カラーメニュー表示
	clsItemBox.prototype.dspColorMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 項目操作キャンセルを通知
			this.execItemCtrlCancel();

			// カラーメニュー表示
			if ( this._ItemMenuColor ) {
				var wPoint = this.getEventPos( pEvent );
				this._ItemMenuColor.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspColorMenu.' + e.name, message: e.message };
		}
	};

	// 関連情報設定
	clsItemBox.prototype.setRelationInf = function( pEvent, pParam ) {
		try {
			// パラメータ無効時は処理なし
			if ( !this.isObject(pParam) ) return false;

			// 対象IDクリア
			this._ItemRelationSetId = '';

			var wTargetId = pParam.id;
			if ( !wTargetId ) return false;

			var wSrcKind = this.getBoxKind();
			var wTargetKind = pParam.kind;

			// 登録済チェック
			var wRelationInf = null;
			if ( wTargetId in this._ItemRelation ) {
				wRelationInf = this._ItemRelation[wTargetId].relationInf;
			
			}

			// 登録対象ID保存
			this._ItemRelationSetId = wTargetId;

			// 関連情報設定メニュー（共通）有効ならメニュー表示
			var wRelationMenu = this.loadPublicMenu('relation');
			if ( !wRelationMenu ) return false;

			// クリック位置に関連情報設定画面表示
			var wEvePos = this.getEventPos( pEvent );

			wRelationMenu.dspMenu( { 
							  x				: wEvePos.x
							, y				: wEvePos.y
							, callback		: this.eventRelationSet
							, relationInf	: wRelationInf
							, targetKind	: {
								  src	: wSrcKind
								, dst	: wTargetKind
							  }
						} );
			
			// 関連付け開始は関連情報メニューイベントから実行
			return true;

		} catch(e) {
			throw { name: 'setRelationInf.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目変更時処理
	// **************************************************************

	// 項目変更時に実行する関数（親への通知関数）設定
	clsItemBox.prototype.setItemCallback = function( pFunction ) {
		try {
			if ( typeof pFunction !== 'function' ) return false;
			
			this._ItemCallback = pFunction;
			return true;

		} catch(e) {
			throw { name: 'setItemCallback', message: e.message };
		}
	};

	// 項目更新時通知
	clsItemBox.prototype.execItemCallback = function( pEvent, pParam ) {
		try {
			if ( typeof this._ItemCallback !== 'function' ) return false;

			var wCallbackParam = {};
			this.copyProperty( pParam, wCallbackParam );

			wCallbackParam.id		= this.getBoxId();
			wCallbackParam.event	= pEvent;

			var wArguments = [];
			wArguments.push( pEvent );
			wArguments.push( wCallbackParam );

			// 親の項目変更時関数をCall
			return this._ItemCallback.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execItemCallback', message: e.message };
		}
	};

	// 項目操作キャンセル通知
	clsItemBox.prototype.execItemCtrlCancel = function() {
		try {
			// 自項目の処理中イベント解除
			this.eventClear();

			// 操作キャンセルを通知
			this.execItemCallback( null, { kind: 'cancel' } );

		} catch(e) {
			throw { name: 'execItemCtrlCancel', message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// イベントキャンセル
	clsItemBox.prototype.eventClear = function() {
		try {
			// ステータス閉じる
			if ( this._ItemMenuStatus ) {
				this._ItemMenuStatus.hideMenu();
			}

			// 連絡先閉じる
			if ( this._ItemMenuContact ) {
				this._ItemMenuContact.hideMenu();
			}

			// カラーメニュー閉じる
			if ( this._ItemMenuColor ) {
				this._ItemMenuColor.hideMenu();
			}

			// 共有メニュー閉じる
			this.closePublicMenu();

		} catch(e) {
			throw { name: 'clsItemBox.eventClear', message: e.message };
		}
	};

	// -------------------
	// メニュー関連
	// -------------------

	// メニュー初期設定
	clsItemBox.prototype.initItemMenu = function( pArgument ) {
		try {
			// 項目ロック時処理不要
			if ( this.getItemLockIs() ) {
				// コンテキストメニュー無効
				this.addBoxEvents( 'oncontextmenu' , this.eventInvalid );
				return;

			}

			// ------------------------
			// コンテキストメニュー設定
			// ------------------------
			var wContextMenu = this.loadPublicMenu( 'context' );
			if ( wContextMenu === false ) {
				// false設定時はメニュー無効

			} else {
				// コンテキストメニューパラメータ設定
				var wContextParam = {};
				if ( this.isObject(pArgument) ) {
					if ( 'menuList' in pArgument ) {
						wContextParam.menuList = {};
						this.copyProperty( pArgument.menuList, wContextParam.menuList );
						if ( pArgument.menuReplace ) wContextParam.menuReplace = true;
					}
				}

				// メニュー追加（パラメータのメニュー優先）
				if ( !wContextParam.menuList ) {
					wContextParam.menuList = {};
				}

				// 通常時移動可能
				if ( this.getItemMoveInitIs() ) {
					// ドラッグ不可時のみ
					if ( !this.getItemDragIs() ) {
						// 移動メニュー追加
						this.setItemMenuAdd( this._DEF_ITEM_MENU_CONTEXT_ADD, wContextParam.menuList );
					}
				}

				var wContextList = this.getItemMenuContents( wContextParam, this._DEF_ITEM_MENU_CONTEXT );
				if ( !wContextMenu ) {
					wContextMenu = new clsMenuList( { menuList: wContextList } );

				}
				wContextMenu.setMenuList( { menuList: wContextList } );

				// コンテキストメニューとして保存
				this._ItemMenuContext = wContextMenu;

				// コンテキストメニュー有効化
				var wContextParam = {
					drag		: this.getItemMoveInitIs()
				};
				this.setContextAvailable( true, wContextParam );
			}

			var wPositionMenu = this.loadPublicMenu( 'position' );
			if ( wPositionMenu === false ) {
				// false設定時はメニュー無効

			} else {
				// 位置調整メニューパラメータ設定
				var wPositionParam = {};
				if ( pArgument ) {
					if ( pArgument.positionList ) {
						wPositionParam.menuList = pArgument.positionList;
						if ( pArgument.positionReplace ) wPositionParam.menuReplace = true;
					}
				}

				var wPositionList = this.getItemMenuContents( wPositionParam, this._DEF_ITEM_MENU_POSITION );
				if ( !wPositionMenu ) {
					wPositionMenu = new clsMenuList( { menuList: wPositionList } );

				}
				wPositionMenu.setMenuList( { menuList: wPositionList } );

				// 位置調整メニューとして保存
				this._ItemMenuPosition = wPositionMenu;

			}

			// コンテキストメニュー有効
			this.addBoxEvents( 'oncontextmenu' , this.eventMenuDsp );


			// カラーメニュー生成
			var wColorMenu = this.loadPublicMenu( 'color' );
			if ( wColorMenu === false ) {
				// false設定時はメニュー無効

			} else {
				if ( !wColorMenu ) {
					this._ItemMenuColor = new clsColorBox( { callback: this.eventColorSelect } );

				} else {
					this._ItemMenuColor = wColorMenu;

				}
			}

			// 基本情報　メニュー生成
			var wStatMenu = this.loadPublicMenu( 'status' );
			if ( wStatMenu === false ) {
				// false設定時はメニュー無効

			} else {
				if ( !wStatMenu ) {
					this._ItemMenuStatus = new clsMenuStatus( { 
													  statusList	: this._ItemStatus.contents
													, statusValue	: this._ItemStatus.values
													, callback		: this.eventStatusUpdate
					} );

				} else {
					this._ItemMenuStatus = wStatMenu;

				}

			}

			// 連絡先　メニュー生成
			var wContactMenu = this.loadPublicMenu( 'contact' );
			if ( wContactMenu === false ) {
				// false設定時はメニュー無効

			} else {
				if ( !wContactMenu ) {
					this._ItemMenuContact = new clsMenuStatus( { 
													  statusList	: this._ItemContact.contents
													, statusValue	: this._ItemContact.values
													, statusAddList	: this._DEF_ITEM_CONTACT_ADD
													, callback		: this.eventContactUpdate
					} );

				} else {
					this._ItemMenuContact = wContactMenu;

				}

			}

		} catch(e) {
			throw { name: 'clsItemBox.initMenu.' + e.name, message: e.message };
		}
	};

	// コンテキストメニュー表示
	clsItemBox.prototype.execContextDsp = function( pEvent, pParam ) {
		try {
			// 項目クリック時のメニュー表示
			if ( !this._ItemMenuContext ) return;

			var wFireEvent = null;

			// fireEventでのイベント発火時
			if ( this.eventFireIs('oncontextmenu') ) {
				wFireEvent = this.eventFireParam('oncontextmenu');
			} else {
				wFireEvent = pEvent;
			}
			
			// パラメータ有効時のみ処理
			if ( !wFireEvent ) return;

			// 削除無効
			if ( !this._ItemCanDelete ) {
				this.disabledContextMenu( 'delete', true );
			
			} else {
				this.disabledContextMenu( 'delete', false );

			}

			// メニュー設定
			var wPoint = this.getEventPos( wFireEvent );

			if ( this.chkRelationItem() ) {
				this._ItemMenuContext.disabledMenu( 'relationChg', false );
				this._ItemMenuContext.disabledMenu( 'unrelation', false );

			} else {
				this._ItemMenuContext.disabledMenu( 'relationChg', true );
				this._ItemMenuContext.disabledMenu( 'unrelation', true );

			}

			// メニュー表示
			var wMenuParam = {
				  x:			wPoint.x
				, y:			wPoint.y
				, callback:		this.eventMenuSelect
			};
			
			// パラメータ追加
			if ( this.isObject(pParam) ) {
				for( var wKey in pParam ) {
					wMenuParam[wKey] = pParam[wKey];
				}
			}
			this._ItemMenuContext.dspMenu( wMenuParam );

		} catch(e) {
			throw { name: 'clsItemBox.execContextDsp', message: e.message };
		}
	};

	// コンテキストメニュー選択時処理
	clsItemBox.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// 情報設定
			case 'status':
				wRetVal = this.dspStatusMenu( pEvent );
				break;

			// 連絡先
			case 'contact':
				wRetVal = this.dspContactMenu( pEvent );
				break;

			// 関連付け
			case 'relation':
				// 親へ状態変更を通知
				// ※対象選択処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// 関連変更
			case 'relationChg':
				// 親へ状態変更を通知
				// ※対象選択処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// 関連解除
			case 'unrelation':
				// 親へ状態変更を通知
				// ※対象選択処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// 色変更
			case 'color':
				// カラーメニューを表示
				wRetVal = this.dspColorMenu( pEvent );
				break;

			// 移動
			case 'move':
				// 親へ状態変更を通知
				// ※移動処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, { kind: 'move' } );
				break;

			// 削除
			case 'delete':
				// 親へ状態変更を通知
				// ※削除処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// 位置調整（縦）
			case 'pos-vert':
				// 親へ状態変更を通知
				// ※対象選択処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// 位置調整（横）
			case 'pos-side':
				// 親へ状態変更を通知
				// ※対象選択処理は親要素で実施
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'clsItemBox.execContextSelect.' + e.name, message: e.message };
		}
	};

	// 位置調整メニュー表示
	clsItemBox.prototype.execPositionDsp = function( pEvent, pParam ) {
		try {
			// 項目クリック時のメニュー表示
			if ( !this._ItemMenuPosition ) return;

			var wFireEvent = null;

			// fireEventでのイベント発火時
			if ( this.eventFireIs('oncontextmenu') ) {
				wFireEvent = this.eventFireParam('oncontextmenu');
			} else {
				wFireEvent = pEvent;
			}
			
			// パラメータ有効時のみ処理
			if ( !wFireEvent ) return;

			// メニュー設定
			var wPoint = this.getEventPos( wFireEvent );

			// メニュー表示
			var wMenuParam = {
				  x:			wPoint.x
				, y:			wPoint.y
				, callback:		this.eventMenuSelect
			};
			
			// パラメータ追加
			if ( this.isObject(pParam) ) {
				for( var wKey in pParam ) {
					wMenuParam[wKey] = pParam[wKey];
				}
			}
			this._ItemMenuPosition.dspMenu( wMenuParam );

		} catch(e) {
			throw { name: 'clsItemBox.execPositionDsp', message: e.message };
		}
	};

	// -------------------
	// 基本情報関連
	// -------------------

	// ステータス初期設定
	clsItemBox.prototype.initItemStatus = function( pArgument ) {
		try {
			// ------------------------
			// ステータス設定
			// ------------------------
			
			// 初期値チェック
			var wDefault = false;
			if ( this.isObject(pArgument) ) {
				if ( 'default' in pArgument ) wDefault = true;
			}

			// 基本情報初期値
			this._ItemStatusDef.contents	= this.setStatusContents( this._DEF_ITEM_STATUS_BASE, pArgument );
			this._ItemStatusDef.values		= this.initStatusValues( this._ItemStatusDef.contents );

			// 初期値上書き
			var wStatDef = false;
			if ( wDefault ) {
				for ( var wDefKey in pArgument.default ) {
					if ( wDefKey in this._ItemStatusDef.values ) {
						this._ItemStatusDef.values[wDefKey] = pArgument.default[wDefKey];
						wStatDef = true;
					}
				}
			}

			// Load時
			var wLoadStat = this.loadDataVal( 'status' );
			if ( wLoadStat ) {
				// 基本情報へLoadデータ設定
				this._ItemStatus = wLoadStat;

				// 表示更新
				this.execStatusMenu( { load: true } );

			// 新規時
			} else {

				// 基本情報　初期設定
				this._ItemStatus.contents = {};
				this.copyProperty( this._ItemStatusDef.contents, this._ItemStatus.contents );

				// 基本情報　設定値を初期化
				this._ItemStatus.values = {};
				this.copyProperty( this._ItemStatusDef.values, this._ItemStatus.values );

				// ステータス初期値設定時　表示更新
				if ( wStatDef ) this.execStatusMenu();
			}


			// ------------------------
			// 連絡先設定
			// ------------------------

			// 初期設定値保存
			var wContactArg = {};
			if ( pArgument ) {
				wContactArg.statusList		= pArgument.contactList;
				wContactArg.statusReplace	= pArgument.contactReplace;
				wContactArg.statusProperty	= pArgument.contactProperty;
			}

			// 連絡先情報初期値
			this._ItemContactDef.contents	= this.setStatusContents( this._DEF_ITEM_CONTACT_BASE, wContactArg );
			this._ItemContactDef.values		= this.initStatusValues( this._ItemContactDef.contents );

			// 初期値上書き
			if ( wDefault ) {
				if ( 'contact' in pArgument.default ) {
					this.copyProperty( pArgument.default.contact, this._ItemContactDef.values );
				}
			}

			// Load時
			var wLoadContact = this.loadDataVal( 'contact' );
			if ( wLoadContact ) {
				// 連絡先へLoadデータ設定
				this._ItemContact = wLoadContact;

			} else {
				// 連絡先　初期設定
				this.setContactContents( this._ItemContactDef.contents );

				// 連絡先　設定値を初期化
				this.setContactValues( this._ItemContactDef.values );

			}

		} catch(e) {
			throw { name: 'clsItemBox.initStatus.' + e.name, message: e.message };
		}
	};

	// ステータス設定時処理
	clsItemBox.prototype.execStatusMenu = function( pEvent, pStatVal ) {
		try {
			// 表示有無設定変更
			this.setStatusDisplay();

			// 表示対象ステータスを表示
			this.dspStatusContents();
			
			// マウスオーバーステータス設定
			this.setStatusTitle();

		} catch(e) {
			throw { name: 'clsItemBox.execStatusMenu.' + e.name, message: e.message };
		}
	};

	// ステータス値更新設定
	clsItemBox.prototype.updStatusValue = function( pArgument ) {
		try {
			if ( !this._ItemStatus.values ) return false;

			// ステータス値取得
			var wDefaultVal = null;
			if ( pArgument ) {
				// callback設定
				var wCallFunc = {};
				var wCallFlag = false;
				for( var wFncKey in pArgument ) {
					if ( typeof pArgument[wFncKey] == 'function' ) {
						wCallFunc[wFncKey] = pArgument[wFncKey];
						wCallFlag = true;
					}
				}
				if ( wCallFlag ) this.saveArgument( wCallFunc );

				if ( 'default' in pArgument ) wDefaultVal = pArgument.default;
			}

			// 基本ステータス値上書き
			var wUpdStat;
			if ( wDefaultVal ) {
				wUpdStat = wDefaultVal;

			} else {
				wUpdStat = {};

			}

			for ( var wDefKey in this._ItemStatus.values ) {
				// 表示フラグは初期値設定
				if ( wDefKey.slice(-4) == '-flg' ) {
					this._ItemStatus.values[wDefKey] = 1;

				// 設定値あり
				} else if ( wDefKey in wUpdStat ) {
					// 値設定
					this._ItemStatus.values[wDefKey] = wUpdStat[wDefKey];

				// 設定値なし
				} else {
					// 初期化
					this._ItemStatus.values[wDefKey] = '';

				}
			}

			// 連絡先　設定値を初期化
			this._ItemContact.contents	= {};
			this._ItemContact.values	= {};
			this.setContactContents( this._ItemContactDef.contents );
			this.setContactValues( this._ItemContactDef.values );

			// 基本連絡先
			if ( wDefaultVal ) {
				if ( 'contact' in wDefaultVal ) wUpdStat = wDefaultVal.contact;

			} else {
				wUpdStat = {};

			}

			for ( var wContKey in this._ItemContact.values ) {
				// 設定値あり
				if ( wContKey in wUpdStat ) {
					// 値設定
					this._ItemContact.values[wContKey] = wUpdStat[wContKey];
				}
			}

			// ステータス表示更新
			this.execStatusMenu( { load: true } );

			return true;

		} catch(e) {
			throw { name: 'clsItemBox.updStatusValue.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD関連
	// -------------------

	// データ保存用　項目設定値取得
	clsItemBox.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// 継承元データ保存
			if ( this._BasePrototype ) {
				wSaveData = this._BasePrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// valueを複写
			var copyValue = function( pSrc, pDst, pKey ) {
				if ( !(pKey in pSrc) ) return;
				if ( !(pKey in pDst) ) return;

				// 値取得
				var wValue = pSrc[pKey];

				// 値設定
				pDst[pKey] = wValue;
			};

			var wContact	= true;
			var wPersonal	= true;
			var wComment	= true;
			if ( this.isObject(pSaveParam) ) {
				if ( 'contact'  in pSaveParam ) wContact  = pSaveParam.contact;
				if ( 'personal' in pSaveParam ) wPersonal = pSaveParam.personal;
				if ( 'comment'  in pSaveParam ) wComment  = pSaveParam.comment;
			}

			// 基本情報　対象
			if ( wPersonal ) {
				// 設定済の基本情報
				wSaveData.status	= JSON.stringify( this._ItemStatus );

			// 対象外
			} else {
				// 初期値
				var wDefStatus = {};
				this.copyProperty( this._ItemStatusDef, wDefStatus );
				
				// タイトルのみ対象
				copyValue( this._ItemStatus.values, wDefStatus.values, 'title' );

				// 「コメント」の場合はコメントも対象
				if ( this.isComment() && wComment ) {
					copyValue( this._ItemStatus.values, wDefStatus.values, 'comment' );
				}

				wSaveData.status	= JSON.stringify( wDefStatus );

			}

			// 連絡先　対象
			if ( wContact ) {
				// 設定済の連絡先
				wSaveData.contact	= JSON.stringify( this._ItemContact );

			// 対象外
			} else {
				// 初期値
				wSaveData.contact	= JSON.stringify( this._ItemContactDef );

			}

			// 関係情報
			var wSaveRel = {};
			for( var wRelId in this._ItemRelation ) {
				wRelItem = this._ItemRelation[wRelId];
				
				var wRelInf = {};
				for( var wRelKey in wRelItem ) {
					// relationInfはclassへの参照なので保存しない
					if ( wRelKey !== 'relationInf' ) {
						wRelInf[wRelKey] = wRelItem[wRelKey];
					}
				}
				wSaveRel[wRelId] = wRelInf;
			}
			wSaveData.relation	= JSON.stringify( wSaveRel );

			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemBox.saveData', message: e.message };
		}
	};

	// データ読込
	clsItemBox.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// 継承元データ読込処理
			if ( this._BasePrototype ) {
				wLoadBuff = this._BasePrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// 基本情報
			if ( pLoadData.status ) {
				wLoadBuff.status = JSON.parse( pLoadData.status );
			}
			
			// 連絡先
			if ( pLoadData.contact ) {
				wLoadBuff.contact = JSON.parse( pLoadData.contact );
			}

			// 関係情報
			if ( pLoadData.relation ) {
				wLoadBuff.relation = JSON.parse( pLoadData.relation );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemBox.loadData', message: e.message };
		}
	};

	// 関連付け情報読込
	clsItemBox.prototype.loadDataRelation = function() {
		try {
			// Load時
			var wLoadRelation = this.loadDataVal( 'relation' );
			if ( !wLoadRelation ) return;

			var wReadRel = {};

			for( var wRelId in wLoadRelation ) {
				var wReadInf = {};
				var wLoadInf = wLoadRelation[wRelId];

				for( var wRelKey in wLoadInf ) {
					if ( wRelKey == 'relationInf' ) {
						// 関連情報を復元
						// ※ clsItemRelation保存時
						try {
							wReadInf[wRelKey] = JSON.parse(wLoadInf[wRelKey]);
						} catch(e) {
							wReadInf[wRelKey] = wLoadInf[wRelKey];
						}

					} else {
						wReadInf[wRelKey] = wLoadInf[wRelKey];

					}
				}
				wReadRel[wRelId] = wReadInf;
			}

			// 関連情報へLoadデータ設定
			this._ItemRelation = wReadRel;

		} catch(e) {
			throw { name: 'clsItemBox.loadDataRelation.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsItemBox.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「item」
				wInitArgument.kind = this._DEF_ITEM_KIND;

			}

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			if ( this.isObject(pArgument) ) {
				// ロック状態
				if ( 'locked' in pArgument ) this._ItemControlLocked = pArgument.locked;

				// 項目ドラッグ移動可否
				if ( 'drag'     in pArgument ) this._ItemMoveDrag	= pArgument.drag;
				if ( 'moveInit' in pArgument ) this._ItemMoveInit	= pArgument.moveInit;
			}

			// 項目削除可否
			var wCanDelete = this.loadArgument('delete');
			if ( wCanDelete != null ) {
				this._ItemCanDelete = wCanDelete;
			}

			// クラス追加
			var wClass = 'cssItem-base';
			var wColor = 'cssItem-color-base';

			var wItemKind = this.getBoxKind();
			switch( wItemKind ) {
			case 'item-person':
				wClass = 'cssItem-person';
				wColor = 'cssItem-color-person';
				break;
			
			case 'item-group':
				wClass = 'cssItem-group';
				wColor = 'cssItem-color-group';
				break;
			
			case 'item-comment':
				wClass = 'cssItem-comment';
				wColor = 'cssItem-color-comment';
				break;
			
			case 'item-relation':
				wClass = 'cssItem-relation';
				wColor = 'cssItem-color-relation';
				break;
			
			case 'item-freeline':
				wClass = 'cssItem-freeline';
				wColor = 'cssItem-color-freeline';
				break;
			
			}
			this.setBoxClass( wClass );
			this.setBoxClass( wColor );

			// ドラッグ可能時
			if ( this._ItemMoveDrag ) {
				// マウスポインタ変更
				//※キャンバスより奥の項目のカーソルが変更できないのでカーソル変更なし
				//this.setBoxClass( 'cssItem-drag' );

			}

			if ( pArgument ) {
				// callback設定
				if ( pArgument.callback ) this.setItemCallback( pArgument.callback );

			}

			// ------------------------
			// ステータス設定
			// ------------------------
			this.initItemStatus( pArgument );


			// ------------------------
			// メニュー設定
			// ------------------------
			this.initItemMenu( pArgument );


			// ------------------------
			// 関連付け情報 Load
			// ------------------------
			this.loadDataRelation();

		} catch(e) {
			throw { name: 'clsItemBox.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsItemBox.prototype.freeClass = function() {
		try {
			// 関連項目全て削除
			this.execFunction( this.delRelationAll );
			
			// プロパティ開放
			this._ItemCallback				= null;

			this._ItemMenuContext			= null;
			this._ItemMenuStatus			= null;
			this._ItemMenuColor				= null;
			this._ItemMenuContact			= null;

			this._ItemSelect				= null;
			this._ItemRelation				= null;
			this._ItemRelationSetId			= '';

			this._ItemStatus.contents		= null;
			this._ItemStatus.values			= null;
			this._ItemStatus				= null;

			this._ItemStatusDef.contents	= null;
			this._ItemStatusDef.values		= null;
			this._ItemStatusDef				= null;

			this._ItemContact.contents		= null;
			this._ItemContact.values		= null;
			this._ItemContact				= null;

			this._ItemContactDef.contents	= null;
			this._ItemContactDef.values		= null;
			this._ItemContactDef			= null;

			this._ItemFireEventParam		= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};
}());
