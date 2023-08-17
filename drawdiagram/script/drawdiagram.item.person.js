// --------------------------------------------------------------------
//
// 人物項目クラス
//
// --------------------------------------------------------------------
// clsItemPerson ← clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsItemPerson = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_PERSON_KIND				= 'item-person';

		this._DEF_ITEM_PERSON_PROPERTY			= {
			 'z-index'				: '300'
		};
		
		// 主項目のプロパティ（追加）
		this._DEF_ITEM_PERSON_MAIN_PROPERTY		= {
			 'background-color'		: '#FFEEEE'
		};

		// ----------------------------
		// 人物　定数値
		// ----------------------------

		// 性別インデックス
		this._IDX_ITEM_PERSON_GENDER			= {
				  none		: 0
				, man		: 1
				, woman		: 2
				, unknown	: 3
		};

		// ----------------------------
		// 人物　メニュー設定
		// ----------------------------

		this._DEF_ITEM_PERSON_MENU				= {};

		this._DEF_ITEM_PERSON_MENU_STAT			= {
			  1: [
				  { kind: 'base'		, title: '基本情報'	}
				 ,{ kind: 'gender'		, title: '性別'		}
				 ,{ kind: 'situation'	, title: '状況'		}
				 ,{ kind: 'other'		, title: 'その他'	}
			  ]
		};

		this._DEF_ITEM_PERSON_ICON_GENDER		= [
				 { kind: ''				,title: '未設定'		, image: ''							}
				,{ kind: 'man'			,title: '男性'			, image: 'icon_man.png'				}
				,{ kind: 'woman'		,title: '女性'			, image: 'icon_woman.png'			}
				,{ kind: 'unknown'		,title: '不明'			, image: 'icon_unknown.png'			}
		];

		this._DEF_ITEM_PERSON_ICON_GENDER_KEY	= [
				 { kind: ''				,title: '未設定'		, image: ''							}
				,{ kind: 'key-man'		,title: '男性'			, image: 'icon_key_man.png'			}
				,{ kind: 'key-woman'	,title: '女性'			, image: 'icon_key_woman.png'		}
				,{ kind: 'key-unknown'	,title: '不明'			, image: 'icon_key_unknown.png'		}
		];

		this._DEF_ITEM_PERSON_ICON_SITUATION	= [
				 { kind: ''				,title: '未設定'		, image: ''							}
				,{ kind: 'death'		,title: '死亡'			, image: 'icon_death.png'			}
		];

		this._DEF_ITEM_PERSON_ICON_PREGNANCY	= { 
				kind: 'pregnancy'	,title: '妊娠'		, image: 'icon_pregnancy.png'
		};

		this._DEF_ITEM_PERSON_LIST_RELATION = {
				  1		: '父'
				, 2		: '母'
				, 3		: '兄'
				, 4		: '姉'
				, 5		: '弟'
				, 6		: '妹'
				, 10	: '祖父'
				, 11	: '祖母'
				, 99	: '※要注意※'
		};

		// ----------------------------
		// 人物　追加基本情報
		// ----------------------------

		this._DEF_ITEM_PERSON_STATUS_ITEM_AGE = {
				  name		: 'age'
				, title		: '年齢'
				, type		: 'text'
				, length	: 3
				, display	: false
				, default	: ''
				, design	: {
					 data	: { width: '230px' }
					,input	: { width: '32px' }
				}
		};

		this._DEF_ITEM_PERSON_STATUS_ITEM_AGE_FLG = {
				  name		: 'age-flg'
				, title		: '年齢表示有無'
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

		this._DEF_ITEM_PERSON_STATUS_ITEM_OTHER = {
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

		// 追加情報　基本情報
		this._DEF_ITEM_PERSON_STATUS_BASE		= {
			 4: [ this._DEF_ITEM_PERSON_STATUS_ITEM_AGE	, this._DEF_ITEM_PERSON_STATUS_ITEM_AGE_FLG ]
		};

		// その他情報
		this._DEF_ITEM_PERSON_STATUS_OTHER		= {
			  1: [ this._DEF_ITEM_PERSON_STATUS_ITEM_OTHER ]
		};

		// ----------------------------
		// 人物　連絡先
		// ----------------------------
		this._DEF_ITEM_PERSON_CONTACT_ETC_NAME	= {
				  name		: 'contact-etc'
				, title		: '連絡先2'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: '連絡先'
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_PERSON_CONTACT_ETC_NO	= {
				  name		: 'contact-etc-no'
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

		this._DEF_ITEM_PERSON_CONTACT			= {
			  2: [ this._DEF_ITEM_PERSON_CONTACT_ETC_NAME	, this._DEF_ITEM_PERSON_CONTACT_ETC_NO  ]
		};

		// 継承元クラスのprototype
		this._ItemPrototype						= null;

		this._PersonMenuStat					= null;
		this._PersonMenuIcon					= null;
		this._PersonMenuOther					= null;

		this._PersonStatus						= {
					  keyperson		: false
					, gender		: { kind: '' }
					, situation		: { kind: '' }
					, other			: { contents: null, values: null }
		};
		this._PersonStatusOtherDef				= { contents: null, values: null };


		// **************************************************************
		// メニュー処理
		// **************************************************************

		// 情報設定メニュー選択時
		this.eventStatSelect = function( pEvent, pSelectMenu ) {
			try {
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				return self.execItemMenuStat( pEvent, pSelectMenu );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 情報設定（性別）選択時
		this.eventGenderSelect = function( pEvent, pSelectMenu ) {
			try {
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// 選択した性別を保存
				self.copyProperty( pSelectMenu, self._PersonStatus.gender );
				
				// 項目のbackgroundを変更
				self.setPersonIcon();

				// 親へ性別変更を通知
				return self.execItemCallback( pEvent, { kind: 'status' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 情報設定（状況）選択時
		this.eventSituationSelect = function( pEvent, pSelectMenu ) {
			try {
				if ( !pSelectMenu ) return false;

				// 選択メニュー種別不明　close時は処理なし
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// 選択した状況を保存
				self.copyProperty( pSelectMenu, self._PersonStatus.situation );

				// 項目のbackgroundを変更
				self.setPersonIcon();

				// 親へ状況変更を通知
				return self.execItemCallback( pEvent, { kind: 'status'} );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 情報設定（その他）更新時イベント
		this.eventOtherUpdate = function( pEvent, pParam ) {
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
				self.copyProperty( pParam.statusValue, self._PersonStatus.other.values );

				// 親へ状況変更を通知
				return self.execItemCallback( pEvent, { kind: 'status'} );

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
		throw { name: 'clsItemPerson.' + e.name, message: e.message };
	}
};

// 人物 prototype
(function(){
	// clsItemBoxのプロトタイプを継承
	clsInheritance( clsItemPerson, clsItemBox );

	// **************************************************************
	// 情報取得
	// **************************************************************

	// ステータス設定値を取得
	clsItemPerson.prototype.getCommentValues = function() {
		try {
			if ( !this._PersonStatus.other.values ) return '';

			return this._PersonStatus.other.values['comment'];

		} catch(e) {
			throw { name: 'getCommentValues', message: e.message };
		}
	};

	// 主項目かどうかを取得
	clsItemPerson.prototype.isKeyPerson = function() {
		try {
			return this._PersonStatus.keyperson;

		} catch(e) {
			throw { name: 'isKeyPerson', message: e.message };
		}
	};


	// **************************************************************
	// 項目状態取得／設定
	// **************************************************************

	// 項目のbackgroundを変更
	clsItemPerson.prototype.setPersonIcon = function( pEvent ) {
		try {
			var wBackGround = '';
			var wImgPath = this.getImagePath();

			// 性別
			var wImage = this._PersonStatus.gender.image;
			if ( !wImage ) wImage = '';
			if ( String(wImage).length > 0 ) {
				wBackGround += "url(" + wImgPath + wImage + ")";
			}

			// 状況
			wImage = this._PersonStatus.situation.image;
			if ( !wImage ) wImage = '';
			if ( String(wImage).length > 0 ) {
				if ( String(wBackGround).length > 0 ) wBackGround += ',';
				wBackGround += "url(" + wImgPath + wImage + ")";
			}

			this.setBoxStyle( { 'background-image': wBackGround } );

		} catch(e) {
			throw { name: 'setPersonIcon', message: e.message };
		}
	};

	// 性別取得
	clsItemPerson.prototype.getGenderKind = function() {
		try {
			var wResultKd = '';

			if ( !this.isObject(this._PersonStatus) ) return wResultKd;
			if ( !this.isObject(this._PersonStatus.gender) ) return wResultKd;

			wResultKd = this._PersonStatus.gender.kind;

			return wResultKd;

		} catch(e) {
			throw { name: 'getGenderKind', message: e.message };
		}
	};

	// 性別設定リスト取得
	clsItemPerson.prototype.getGenderList = function( pKeyPerson ) {
		try {
			// keyperson
			var wKeyPerson = this._PersonStatus.keyperson;
			if ( typeof pKeyPerson == 'boolean' ) wKeyPerson = pKeyPerson;

			if ( wKeyPerson ) {
				return this._DEF_ITEM_PERSON_ICON_GENDER_KEY;

			} else {
				return this._DEF_ITEM_PERSON_ICON_GENDER;

			}

		} catch(e) {
			throw { name: 'getGenderList', message: e.message };
		}
	};

	// 性別設定情報取得（インデックス）
	clsItemPerson.prototype.getGenderItemByIndex = function( pIndex, pKeyPerson ) {
		try {
			var wResultItm = null;
			var wGenderList = this.getGenderList( pKeyPerson );

			return wGenderList[pIndex];

		} catch(e) {
			throw { name: 'getGenderItemByIndex', message: e.message };
		}
	};

	// 性別設定情報取得（性別種別）
	clsItemPerson.prototype.getGenderItemByKind = function( pKind, pKeyPerson ) {
		try {
			var wResultItm = null;

			// keyperson
			var wKeyPerson = this._PersonStatus.keyperson;
			if ( typeof pKeyPerson == 'boolean' ) wKeyPerson = pKeyPerson;

			var wGenderList = this.getGenderList( wKeyPerson );

			// チェック種別
			var wChkKind = pKind;
			if ( wKeyPerson ) wChkKind = 'key-' + wChkKind;

			for( var wIndex = 0; wIndex < wGenderList.length; wIndex++ ) {
				if ( wChkKind == wGenderList[wIndex].kind ) {
					wResultItm = {};
					this.copyProperty( wGenderList[wIndex], wResultItm );
					break;
				}
			}

			return wResultItm;

		} catch(e) {
			throw { name: 'getGenderItemByKind', message: e.message };
		}
	};

	// 性別（index）取得
	clsItemPerson.prototype.getGenderIndex = function() {
		try {
			var wRetIdx = 0;
			var wGenderList = this.getGenderList();

			var wGenderKd = this._PersonStatus.gender.kind;
			for( var wIndex = 0; wIndex < wGenderList.length; wIndex++ ) {
				if ( wGenderKd == wGenderList[wIndex].kind ) {
					wRetIdx = wIndex;
					break;
				}
			}

			return wRetIdx;

		} catch(e) {
			throw { name: 'getGenderIndex', message: e.message };
		}
	};

	// 性別が女性かチェック
	clsItemPerson.prototype.chkGenderWhetherWoman = function( ) {
		try {
			var wGenderIdx = this.getGenderIndex();

			if ( wGenderIdx == this._IDX_ITEM_PERSON_GENDER.woman ) {
				return true;

			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'chkGenderWhetherWoman', message: e.message };
		}
	};

	// 関係性から性別を取得
	clsItemPerson.prototype.getGenderFromRelation = function( pRelationKd ) {
		try {
			var wGenderKind = null;

			switch( pRelationKd ) {
			case '父':
			case '兄':
			case '弟':
			case '祖父':
				wGenderKind = this.getGenderItemByKind( 'man' );
				break;

			case '母':
			case '姉':
			case '妹':
			case '祖母':
				wGenderKind = this.getGenderItemByKind( 'woman' );
				break;

			default:
				break;
			}
			
			return wGenderKind;

		} catch(e) {
			throw { name: 'getGenderFromRelation', message: e.message };
		}
	};
	
	// ステータス内容表示
	clsItemPerson.prototype.setPersonStatusTitle = function() {
		try {
			var wAgeItem = this.getStatusContents('age');
			if ( !wAgeItem ) return;

			// 非表示時のみタイトルとして設定
			if ( wAgeItem.display ) return;

			var wValue = this.getStatusValues(wAgeItem.name);
			if ( !wValue ) return;

			// 名称表示情報取得
			var wTitle = this.getBoxAttribute('title');
			if ( wTitle.length > 0 ) {
				wTitle += '（' + wValue + '歳）';

			} else {
				wTitle = wValue + '歳';

			}

			// title属性を再設定
			this.setBoxAttribute( { title: wTitle } );

		} catch(e) {
			throw { name: 'setStatusTitle.' + e.name, message: e.message };
		}
	};

	
	// **************************************************************
	// サブメニュー表示
	// **************************************************************

	// 情報設定メニュー表示
	clsItemPerson.prototype.dspMenuStatus = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 情報設定メニュー表示
			if ( this._PersonMenuStat ) {
				// 選択情報設定
				var wPoint	= this.getEventPos( pEvent );
				
				var wParam = {
					  x:			wPoint.x
					, y:			wPoint.y
					, callback:		this.eventStatSelect
				};
				this._PersonMenuStat.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspMenuStatus.' + e.name, message: e.message };
		}
	};

	// 性別　選択表示
	clsItemPerson.prototype.dspMenuGender = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 性別メニュー表示
			if ( this._PersonMenuIcon ) {
				// 選択情報設定
				var wIcon	= { kind: this._PersonStatus.gender.kind };
				var wPoint	= this.getEventPos( pEvent );
				
				// アイコン設定
				var wMenu;
				if ( this._PersonStatus.keyperson ) {
					wMenu	= Array.prototype.slice.call(this._DEF_ITEM_PERSON_ICON_GENDER_KEY, 0);
				} else {
					wMenu	= Array.prototype.slice.call(this._DEF_ITEM_PERSON_ICON_GENDER, 0);
				}

				var wParam = {
					  x:			wPoint.x
					, y:			wPoint.y
					, callback:		this.eventGenderSelect
					, icon:			wIcon
					, iconList:		wMenu
				};
				this._PersonMenuIcon.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspMenuGender.' + e.name, message: e.message };
		}
	};

	// 状況　選択表示
	clsItemPerson.prototype.dspMenuSituation = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 状況メニュー表示
			if ( this._PersonMenuIcon ) {
				// 選択情報設定
				var wIcon = { kind: this._PersonStatus.situation.kind };
				var wPoint = this.getEventPos( pEvent );

				// 女性
				var wIconList = Array.prototype.slice.call(this._DEF_ITEM_PERSON_ICON_SITUATION, 0);
				if ( this.chkGenderWhetherWoman() ) {
					wIconList.push( this._DEF_ITEM_PERSON_ICON_PREGNANCY );

				}
				var wParam = {
					  x:			wPoint.x
					, y:			wPoint.y
					, callback:		this.eventSituationSelect
					, icon:			wIcon
					, iconList:		wIconList
				};
				this._PersonMenuIcon.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspMenuSituation.' + e.name, message: e.message };
		}
	};

	// その他　登録画面表示
	clsItemPerson.prototype.dspMenuOther = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// 登録画面表示
			if ( this._PersonMenuOther && this._PersonStatus.other ) {
				if ( this._PersonStatus.other.contents ) {
					var wPoint	= this.getEventPos( pEvent );
					
					var wParam = {
						  x				: wPoint.x
						, y				: wPoint.y
						, callback		: this.eventOtherUpdate
						, statusList	: this._PersonStatus.other.contents
						, statusValue	: this._PersonStatus.other.values
					};
					this._PersonMenuOther.dspMenu( wParam );
				}
			}

		} catch(e) {
			throw { name: 'dspMenuOther.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// サブメニュー　選択時処理
	// **************************************************************

	// 情報設定メニュー選択時処理
	clsItemPerson.prototype.execItemMenuStat = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// 基本情報
			case 'base':
				// 項目クラス（継承元）のメソッドをcall
				wRetVal = this.dspStatusMenu( pEvent );
				break;

			// 性別
			case 'gender':
				wRetVal = this.dspMenuGender( pEvent );
				break;

			// 状態
			case 'situation':
				wRetVal = this.dspMenuSituation( pEvent );
				break;

			// その他
			case 'other':
				wRetVal = this.dspMenuOther( pEvent );
				break;


			}

			return wRetVal;

		} catch(e) {
			throw { name: 'execItemMenuStat.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// イベントキャンセル
	clsItemPerson.prototype.eventClear = function() {
		try {
			// 情報設定メニュー閉じる
			if ( this._PersonMenuStat ) {
				this._PersonMenuStat.hideMenu();
			}

			// アイコンメニュー閉じる
			if ( this._PersonMenuIcon ) {
				this._PersonMenuIcon.hideMenu();
			}

			// 情報設定（その他）閉じる
			if ( this._PersonMenuOther ) {
				this._PersonMenuOther.hideMenu();
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
	clsItemPerson.prototype.initItemMenu = function( pArgument ) {
		try {
			// 継承元メニュー初期化処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// 項目ロック時処理不要
			if ( this.getItemLockIs() ) return;

			// 情報設定リストメニュー
			var wMenuList = {};
			this.copyProperty( this._DEF_ITEM_PERSON_MENU_STAT, wMenuList );

			var wStatMenu = this.loadPublicMenu('listStat');
			if ( !wStatMenu ) {
				wStatMenu = new clsMenuList( { menuList: wMenuList } );
			}
			wStatMenu.setMenuList( { menuList: wMenuList } );

			// 情報設定リストメニューとして保存
			this._PersonMenuStat = wStatMenu;

			// アイコン選択（性別、状況）
			this._PersonMenuIcon = this.loadPublicMenu('icon');
			if ( !this._PersonMenuIcon ) {
				this._PersonMenuIcon = new clsMenuIcon();
			}

			// その他情報メニュー
			var wOtherMenu = this.loadPublicMenu( 'other' );
			if ( !wOtherMenu ) {
				this._PersonMenuOther = new clsMenuStatus( { 
												  statusList	: this._PersonStatus.other.contents
												, statusValue	: this._PersonStatus.other.values
												, callback		: this.eventOtherUpdate
				} );

			} else {
				this._PersonMenuOther = wOtherMenu;

			}

		} catch(e) {
			throw { name: 'clsItemPerson.initItemMenu', message: e.message };
		}
	};

	// コンテキストメニュー表示
	clsItemPerson.prototype.execContextDsp = function( pEvent, pParam ) {
		try {

			// 継承元メニュー表示処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execContextDsp.call( this, pEvent, pParam );

			}

		} catch(e) {
			throw { name: 'clsItemPerson.execContextDsp', message: e.message };
		}
	};

	// 人物用コンテキストメニュー選択時処理
	clsItemPerson.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// 情報設定リストメニュー表示
			case 'status':
				wRetVal = this.dspMenuStatus( pEvent );
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
			throw { name: 'clsItemPerson.execContextSelect.' + e.name, message: e.message };
		}
	};


	// -------------------
	// 基本情報関連
	// -------------------

	// ステータス初期設定
	clsItemPerson.prototype.initItemStatus = function( pArgument ) {
		try {
			// 継承元ステータス初期設定処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// 主項目チェック
			var wKeyPerson = this.loadArgument('keyperson');
			if ( wKeyPerson == null ) wKeyPerson = false;

			// その他情報設定（デフォルト）
			this._PersonStatusOtherDef.contents = this.setStatusContents( this._DEF_ITEM_PERSON_STATUS_OTHER );
			this._PersonStatusOtherDef.values   = this.initStatusValues( this._PersonStatusOtherDef.contents );

			// Load時
			var wLoadStat = this.loadDataVal( 'person' );
			if ( wLoadStat ) {
				// 固有情報へLoadデータ設定
				this._PersonStatus = wLoadStat;

				// 表示更新
				this.setPersonIcon();

			// 新規時
			} else {
				var wIconDef = false;

				// 主項目
				this._PersonStatus.keyperson = wKeyPerson;

				// 主項目はstyle追加
				if ( wKeyPerson ) {
					this.setBoxStyle( this._DEF_ITEM_PERSON_MAIN_PROPERTY );
				}

				// 初期値チェック
				var wDefault = false;
				if ( 'default' in pArgument ) wDefault = true;

				// 初期値設定
				var wGender		= 0;
				var wSituation	= 0;

				if ( wDefault ) {
					// 性別
					if ( 'sex' in pArgument.default ) {
						wGender = pArgument.default.sex;
						wIconDef = true;
					}

					// 状態
					if ( 'situation' in pArgument.default ) {
						wSituation = pArgument.default.situation;
						wIconDef = true;
					}

				}
				
				// 性別／状態設定
				var wGenderStat = this.getGenderItemByIndex( wGender, wKeyPerson );
				this.copyProperty( wGenderStat, this._PersonStatus.gender );

				// 状態設定
				this.copyProperty( this._DEF_ITEM_PERSON_ICON_SITUATION[wSituation], this._PersonStatus.situation );

				// その他情報設定（デフォルト）
				this._PersonStatus.other.contents = {};
				this.copyProperty( this._PersonStatusOtherDef.contents, this._PersonStatus.other.contents );

				this._PersonStatus.other.values = {};
				this.copyProperty( this._PersonStatusOtherDef.values, this._PersonStatus.other.values );

				// 性別／状態初期値設定時　表示更新
				if ( wIconDef ) this.setPersonIcon();

			}

		} catch(e) {
			throw { name: 'clsItemPerson.initItemStatus.' + e.name, message: e.message };
		}
	};

	// ステータス設定時処理
	clsItemPerson.prototype.execStatusMenu = function( pEvent, pStatVal ) {
		try {

			// 継承元ステータス設定時処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execStatusMenu.call( this, pEvent, pStatVal );

			}

			// 人物用タイトル設定
			// ※canvasの都合でgroupに所属した項目のタイトル表示が出来ない為、タイトル設定しない
			//this.setPersonStatusTitle();

			// load時は以降処理なし
			var wLoad = false;
			if ( pEvent ) {
				if ( 'load' in pEvent ) wLoad = pEvent.load;
			}
			if ( wLoad ) return;

			// 関係性と連動して性別変更
			var wGenderKind = this.getGenderFromRelation( this.getStatusValues('title') );
			if ( wGenderKind ) {
				// 性別変更時
				var wNowKind = this.getGenderKind();
				if ( wGenderKind.kind != wNowKind ) {
					// 性別を変更
					this.copyProperty( wGenderKind, this._PersonStatus.gender );
					
					// 項目のbackgroundを変更
					this.setPersonIcon();
				}
			}

		} catch(e) {
			throw { name: 'clsItemPerson.execStatusMenu.' + e.name, message: e.message };
		}
	};

	// ステータス値更新設定
	clsItemPerson.prototype.updStatusValue = function( pArgument ) {
		try {
			// 継承元ステータス更新時処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.updStatusValue.call( this, pArgument );

			}

			// 設定値取得
			var wKeyPerson	= false;
			var wGender		= 0;
			var wSituation	= 0;

			if ( pArgument ) {
				// 主項目チェック
				if ( 'keyperson' in pArgument ) wKeyPerson = pArgument.keyperson;

				if ( 'default' in pArgument ) {
					var wDefault = pArgument.default;

					// 性別
					if ( 'sex' in wDefault ) wGender = wDefault.sex;

					// 状態
					if ( 'situation' in wDefault ) wSituation = wDefault.situation;
				}
			}

			// 性別／状態設定
			var wGenderStat = this.getGenderItemByIndex( wGender, wKeyPerson );
			this.copyProperty( wGenderStat, this._PersonStatus.gender );

			// 主項目設定
			this._PersonStatus.keyperson = wKeyPerson;

			// 主項目はstyle追加
			if ( wKeyPerson ) {
				this.setBoxStyle( this._DEF_ITEM_PERSON_MAIN_PROPERTY );
			} else {
				this.setBoxStyle( { 'background-color' : '' } );
			}

			// 状態設定
			this.copyProperty( this._DEF_ITEM_PERSON_ICON_SITUATION[wSituation], this._PersonStatus.situation );

			// 性別／状態　表示更新
			this.setPersonIcon();

			// その他情報設定（デフォルト）
			this._PersonStatus.other.values   = this.initStatusValues( this._PersonStatus.other.contents );

		} catch(e) {
			throw { name: 'clsItemPerson.updStatusValue.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD関連
	// -------------------

	// データ保存用　項目設定値取得
	clsItemPerson.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;

			// 保存属性パラメータ複写
			var wParam = {
				  keyperson	: true
				, personal	: true
			};
			this.copyProperty( pSaveParam, wParam );

			// 主項目　かつ　主項目対象外
			if ( (this._PersonStatus.keyperson) && (!wParam.keyperson) ) {
				// 背景色保存しない
				wParam['background-color'] = false;
			}

			// 継承元項目設定値取得処理
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, wParam );

			} else {
				wSaveData = {};

			}

			// 人物用追加基本情報
			var wPersonStatus = {};
			this.copyProperty( this._PersonStatus, wPersonStatus );

			// 主項目フラグ対象外
			if ( !wParam.keyperson ) {
				// 主項目
				if ( wPersonStatus.keyperson ) {
					// 通常項目へ変更
					wPersonStatus.keyperson = false;
					
					var wGenderIdx = this.getGenderIndex();
					this.copyProperty( this._DEF_ITEM_PERSON_ICON_GENDER[wGenderIdx], wPersonStatus.gender );
				}

			}

			// その他情報（基本情報）対象外
			if ( !wParam.personal ) {
				// 初期値
				wPersonStatus.other.contents = {};
				this.copyProperty( this._PersonStatusOtherDef.contents, wPersonStatus.other.contents );

				wPersonStatus.other.values = {};
				this.copyProperty( this._PersonStatusOtherDef.values, wPersonStatus.other.values );

			}
			wSaveData.person = JSON.stringify( wPersonStatus );

			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemPerson.saveData.' + e.name, message: e.message };
		}
	};

	// データ読込
	clsItemPerson.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// 継承元データ読込処理
			if ( this._BasePrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// 人物固有設定
			if ( pLoadData.person ) {
				wLoadBuff.person = JSON.parse( pLoadData.person );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemPerson.loadData', message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsItemPerson.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_PERSON_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「item-person」
				wInitArgument.kind = this._DEF_ITEM_PERSON_KIND;

			}

			// 追加メニュー設定
			wInitArgument.menuList		= this._DEF_ITEM_PERSON_MENU;

			// 追加ステータス設定
			wInitArgument.statusList	= this._DEF_ITEM_PERSON_STATUS_BASE;
			var wUpdProperty = {
					title		: {
						 title	: '関係性'
						,list	: this._DEF_ITEM_PERSON_LIST_RELATION
					}
			};
			wInitArgument.statusProperty = wUpdProperty;

			// 追加連絡先設定
			wInitArgument.contactList = this._DEF_ITEM_PERSON_CONTACT;

			// 継承元コンストラクタ
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsItemPerson.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsItemPerson.prototype.freeClass = function() {
		try {
			// プロパティ開放
			this._PersonMenuStat			= null;
			this._PersonMenuIcon			= null;
			this._PersonMenuOther			= null;

			this._PersonStatusOtherDef.contents	= null;
			this._PersonStatusOtherDef.values	= null;
			this._PersonStatusOtherDef			= null;

			this._PersonStatus				= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
