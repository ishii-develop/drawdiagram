
// --------------------------------------------------------------------
//
// メインクラス
//
// --------------------------------------------------------------------
// clsDrawMain
// --------------------------------------------------------------------
var clsDrawMain = function( pArgument ) {
	try {
		var self = this;

		// 共通メニュー
		this._MainPublicMenu = {
			  common		: {}
			, person		: {}
			, group			: {}
			, comment		: {}
			, relation		: {}
			, freeline		: {}
		};

		// 各操作要素
		this._MainPanelSide				= null;
		this._MainPanelContents			= null;
		this._MainPanelControl			= null;
		
		// Callback
		this._MainFuncChgStat			= null;
		this._MainFuncChgPos			= null;


		// **************************************************************
		// イベント処理
		// **************************************************************

		// ----------------------------
		// コンテンツ操作
		// ----------------------------

		// コンテンツ（変更）時にCallされる
		this.eventContentsChange = function( pArgument ) {
			try {
				// 項目操作時処理
				self.execContentsChange( pArgument );

			} catch(e) {
				alert( e.message );

			}
			return true;
		};

		// サイドパネル - 項目操作完了時にCallされる
		this.eventSidePanelChange = function( pArgument ) {
			try {
				// 項目操作時処理
				self.execSidePanelChange( pArgument );

			} catch(e) {
				alert( e.message );

			}
			return true;
		};


		// **************************************************************
		// コンストラクタ
		// **************************************************************
		this.initClass( pArgument );

	} catch(e) {
		throw { name: 'clsDrawMain.' + e.name, message: e.message };
	}
};

// メイン prototype
(function(){

	// **************************************************************
	// 基本
	// ※「drawdiagram.js」へ同定義関数あり
	// **************************************************************

	// 配列かどうかチェック
	clsDrawMain.prototype.isArray = function( pArgument ) {
		try {
			// 配列かチェック
			if( pArgument instanceof Array ) {
				return true;
			
			} else {
				return false;
			
			}

		} catch(e) {
			throw { name: 'clsDrawMain.isArray.' + e.name, message: e.message };
		}
	};

	// オブジェクト（連想配列）かどうかチェック
	clsDrawMain.prototype.isObject = function( pArgument ) {
		try {
			// 配列かチェック
			if ( this.isArray(pArgument) ) return false;

			// 配列以外のObjectかチェック
			if ( pArgument instanceof Object ) {
				return true;

			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'clsDrawMain.isObject.' + e.name, message: e.message };
		}
	};

	// プロパティを複写
	clsDrawMain.prototype.copyProperty = function( pSrcEle, pDstEle ) {
		try {
			if ( !this.isObject(pSrcEle) ) return false;
			if ( !this.isObject(pDstEle) ) return false;

			for( var key in pSrcEle ) {
				// 値を複写
				pDstEle[key] = pSrcEle[key];
			}
			return true;

		} catch(e) {
			throw { name: 'clsDrawMain.copyProperty', message: e.message };
		}
	};


	// **************************************************************
	// 図形描画使用元からCallされる
	// **************************************************************

	// 登録開始
	clsDrawMain.prototype.drawStart = function() {
		try {
			if ( !this._MainPanelContents ) return;

			// コンテンツとサイドパネル同期開始
			this.linkContentsAndSide();

		} catch(e) {
			throw { name: 'clsDrawMain.drawStart.' + e.name, message: e.message };
		}
	};

	// 操作キャンセル
	clsDrawMain.prototype.drawCancelControl = function() {
		try {
			// コンテンツの操作キャンセル
			if ( !this._MainPanelContents ) return;
			this._MainPanelContents.cancelControl();

			// ※サイドパネルの操作キャンセル不要

		} catch(e) {
			throw { name: 'clsDrawMain.drawCancelControl.' + e.name, message: e.message };
		}
	};

	// 項目（人物）追加
	clsDrawMain.prototype.drawAddPerson = function( pAddParam ) {
		try {
			if ( !this._MainPanelContents ) return false;

			// 編集モードを通常に変更
			this._MainPanelContents.execChgEditModeNormal();

			if ( this._MainPanelSide ) {
				// ※「drawdiagram.panel.side.js」
				this._MainPanelSide.execChgEditModeNormal();
			}

			// 項目生成
			// ※「drawdiagram.contents.js」
			var wResult = this._MainPanelContents.addPersonByValue( pAddParam );

			return wResult;

		} catch(e) {
			throw { name: 'clsDrawMain.drawAddPerson.' + e.name, message: e.message };
		}
	};

	// 項目（グループ）追加
	clsDrawMain.prototype.drawAddGroup = function( pAddParam ) {
		try {
			if ( !this._MainPanelContents ) return false;

			// 編集モードを通常に変更
			this._MainPanelContents.execChgEditModeNormal();

			if ( this._MainPanelSide ) {
				// ※「drawdiagram.panel.side.js」
				this._MainPanelSide.execChgEditModeNormal();
			}
			
			// 項目生成
			// ※「drawdiagram.contents.js」
			var wResult = this._MainPanelContents.addGroupByValue( pAddParam );

			return wResult;

		} catch(e) {
			throw { name: 'clsDrawMain.drawAddGroup.' + e.name, message: e.message };
		}
	};

	// 項目情報取得
	clsDrawMain.prototype.drawGetItemData = function( pParam ) {
		try {
			if ( !this._MainPanelContents ) return null;

			// 項目情報取得
			// ※「drawdiagram.contents.js」
			return this._MainPanelContents.getItemData( pParam );

		} catch(e) {
			throw { name: 'clsDrawMain.drawGetItemData.' + e.name, message: e.message };
		}
	};

	// 描画内容取得
	clsDrawMain.prototype.drawGetSaveData = function( pSaveParam ) {
		try {
			if ( !this._MainPanelContents ) return null;

			// 描画情報取得
			// ※「drawdiagram.contents.js」
			return this._MainPanelContents.getSaveData( pSaveParam );

		} catch(e) {
			throw { name: 'clsDrawMain.drawGetSaveData.' + e.name, message: e.message };
		}
	};

	// 描画情報を元にキャンバス生成
	// ※パラメータ「pLoadData」は要素（の参照）
	clsDrawMain.prototype.drawLoadData = function( pLoadData ) {
		try {
			if ( !this._MainPanelContents ) return null;

			// 描画情報をLoad
			// ※「drawdiagram.contents.js」
			return this._MainPanelContents.execLoadData( pLoadData.value );

		} catch(e) {
			throw { name: 'clsDrawMain.drawLoadData.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 操作
	// **************************************************************

	// コンテンツとサイドパネル同期
	clsDrawMain.prototype.linkContentsAndSide = function() {
		try {
			if ( !this._MainPanelContents ) return;
			if ( !this._MainPanelSide ) return;

			// コンテンツの項目への参照取得
			var wLinkContents = this._MainPanelContents.getBelongContents();

			// 項目を同期
			this._MainPanelSide.setLinkContents( wLinkContents );

		} catch(e) {
			throw { name: 'clsDrawMain.linkContentsAndSide.' + e.name, message: e.message };
		}
	};

	// パネルコントローラとサイドパネルの操作状況設定
	clsDrawMain.prototype.setCtrlAndSideValid = function( pArgument ) {
		try {
			if ( !pArgument ) return false;
			if ( typeof pArgument.valid == 'undefined' ) return false;

			// サイドパネルの操作可否設定
			if ( this._MainPanelSide ) {
				if ( typeof this._MainPanelSide.setControlValid == 'function' ) {
					this._MainPanelSide.setControlValid( pArgument.valid );
				}
			}

			// パネルコントローラの操作可否設定
			if ( this._MainPanelControl ) {
				if ( typeof this._MainPanelControl.setControlValid == 'function' ) {
					this._MainPanelControl.setControlValid( pArgument.valid );
				}
			}

		} catch(e) {
			throw { name: 'clsDrawMain.setCtrlAndSideValid.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// Callback
	// **************************************************************

	// コンテンツ操作時処理
	clsDrawMain.prototype.execContentsChange = function( pArgument ) {
		try {
			// 項目操作通知
			this.execContentsChangeCallback( pArgument );

			if ( !this._MainPanelSide ) return;

			switch( pArgument.kind ) {
			// 項目同期
			case 'link':
				// コンテンツとサイドパネル同期
				this.linkContentsAndSide();
				break;
			
			// 操作状況設定
			case 'set-valid':
				// パネルコントローラとサイドパネルの操作状況設定
				this.setCtrlAndSideValid( pArgument );
				break;
			
			// 以外
			default:
				// サイドパネル更新関数実行
				this._MainPanelSide.execLinkItemEvent( pArgument );
				break;

			}

		} catch(e) {
			throw { name: 'clsDrawMain.execContentsChange.' + e.name, message: e.message };
		}
	};

	// サイドパネル操作時処理
	clsDrawMain.prototype.execSidePanelChange = function( pArgument ) {
		try {
			if ( !this._MainPanelContents ) return;

			// メインコンテンツ更新関数実行
			// ※「drawdiagram.contents.js」
			this._MainPanelContents.execLinkItemEvent( pArgument );

		} catch(e) {
			throw { name: 'clsDrawMain.execSidePanelChange.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// Callback関数をCall
	// ※図形描画使用元の関数をCall
	// **************************************************************

	// 項目操作通知
	clsDrawMain.prototype.execContentsChangeCallback = function( pArgument ) {
		try {
			if ( !this.isObject(pArgument) ) return;

			// 操作内容
			var wCtrlKind = pArgument.kind;

			switch( wCtrlKind ) {
			// 情報更新
			case 'status':
			// 連絡先更新
			case 'contact':
			// 関係追加
			case 'relation':
			// 関係変更
			case 'relationChg':
			// 関係解除
			case 'unrelation':
			// 関係更新
			case 'relationUpd':
			// 関係ライン調整
			case 'relationLine':
			// 色変更
			case 'color':
				if ( typeof this._MainFuncChgStat == 'function' ) {
					this._MainFuncChgStat( pArgument );
				}
				break;

			// 項目移動
			case 'move':
			// サイズ変更
			case 'resize':
			// 位置調整（縦）
			case 'pos-vert':
			// 位置調整（横）
			case 'pos-side':
				if ( typeof this._MainFuncChgPos == 'function' ) {
					this._MainFuncChgPos( pArgument );
				}
				break;
			}

		} catch(e) {
			throw { name: 'clsDrawMain.execContentsChangeCallback.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 図形描画使用元からCallされる（印刷関連）
	// **************************************************************

	// キャンバス印刷
	clsDrawMain.prototype.drawPrintCanvas = function() {
		try {
			if ( !this._MainPanelContents ) return null;

			// 描画情報印刷
			// ※「drawdiagram.contents.js」
			return this._MainPanelContents.printCanvasData();

		} catch(e) {
			throw { name: 'clsDrawMain.drawPrintCanvas.' + e.name, message: e.message };
		}
	};

	// 描画内容取得（印刷用）
	clsDrawMain.prototype.drawGetPrintCanvas = function() {
		try {
			if ( !this._MainPanelContents ) return null;

			// 描画情報取得
			// ※「drawdiagram.contents.js」
			return this._MainPanelContents.getPrintData();

		} catch(e) {
			throw { name: 'clsDrawMain.drawGetPrintCanvas.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// コンストラクタ／デストラクタ
	// **************************************************************

	// コンストラクタ
	clsDrawMain.prototype.initClass = function( pArgument ) {
		try {
			var self = this;

			// 基本動作パラメータ取得
			var wIsLocked		= false;
			var wIsSidePanel	= true;

			// メニュー基本設定
			//　関係メニュー
			var wMenuRelationStat = null;

			if ( this.isObject(pArgument) ) {
				if ( 'locked'    in pArgument ) wIsLocked    = pArgument.locked;
				if ( 'sidepanel' in pArgument ) wIsSidePanel = pArgument.sidepanel;

				// メニュー基本設定
				if ( 'menu' in pArgument ) {
					var wArgumentMenu = pArgument['menu'];
					if ( this.isObject(wArgumentMenu) ) {
						// 関係メニュー
						if ( 'relation' in wArgumentMenu ) {
							var wMenuRelation = wArgumentMenu['relation'];

							wMenuRelationStat = {};
							for( var wRelKey in wMenuRelation ) wMenuRelationStat[wRelKey] = wMenuRelation[wRelKey];
						}
					}

				}

				// Callback関数保存
				this._MainFuncChgStat	= pArgument.statfunc;
				this._MainFuncChgPos	= pArgument.posfunc;
			}

			// --------------------------------
			// 共通サブメニュー生成
			// --------------------------------
			// サブメニュー（色）設定
			this._MainPublicMenu.common.color = new clsColorBox();

			// サブメニュー（ファイル選択）設定
			this._MainPublicMenu.common.file = new clsFileBox();

			// サブメニュー（位置調整）設定
			this._MainPublicMenu.common.position = new clsMenuList();

			// --------------------------------
			// 共通サブメニュー　人物
			// --------------------------------
			// サブメニュー（コンテキスト）設定
			this._MainPublicMenu.person.context = new clsMenuList();

			// サブメニュー（情報設定）設定
			this._MainPublicMenu.person.listStat = new clsMenuList();

			// サブメニュー（情報設定 - 基本情報）設定
			this._MainPublicMenu.person.statBase = new clsMenuStatus();

			// サブメニュー（情報設定 - アイコン）設定
			this._MainPublicMenu.person.icon = new clsMenuIcon( );

			// サブメニュー（情報設定 - 連絡先）設定
			this._MainPublicMenu.person.contact = new clsMenuStatus();

			// サブメニュー（関連付け）設定
			this._MainPublicMenu.person.relation = new clsMenuRelation( { 
														   relKind	: 'item-person'
														 , config	: wMenuRelationStat
														 , publicMenu: {
														 	  color		: this._MainPublicMenu.common.color
														 	, position	: this._MainPublicMenu.common.position
														  }
												} );
			// サブメニュー（位置調整）設定
			this._MainPublicMenu.person.position = new clsMenuList();

			// --------------------------------
			// 共通サブメニュー　グループ
			// --------------------------------
			// サブメニュー（コンテキスト）設定
			this._MainPublicMenu.group.context = new clsMenuList();

			// サブメニュー（情報設定 - 基本情報）設定
			this._MainPublicMenu.group.statBase = new clsMenuStatus();

			// サブメニュー（情報設定 - 連絡先）設定
			this._MainPublicMenu.group.contact = new clsMenuStatus();

			// サブメニュー（関連付け）設定
			this._MainPublicMenu.group.relation = new clsMenuRelation( { 
														   relKind	: 'item-group'
														 , config	: wMenuRelationStat
														 , publicMenu: {
														 	  color		: this._MainPublicMenu.common.color
														 	, position	: this._MainPublicMenu.common.position
														  }
												} );

			// サブメニュー（位置調整）設定
			this._MainPublicMenu.group.position = new clsMenuList();

			// --------------------------------
			// 共通サブメニュー　コメント
			// --------------------------------
			// サブメニュー（コンテキスト）設定
			this._MainPublicMenu.comment.context = new clsMenuList();

			// サブメニュー（情報設定 - 基本情報）設定
			this._MainPublicMenu.comment.statBase = new clsMenuStatus();

			// サブメニュー（サイズ設定）設定
			this._MainPublicMenu.comment.listSize = new clsMenuList();

			// サブメニュー（サイズ設定）設定
			this._MainPublicMenu.comment.listWeight = new clsMenuList();

			// サブメニュー（位置調整）設定
			this._MainPublicMenu.comment.position = new clsMenuList();

			// --------------------------------
			// 共通サブメニュー　関連付け中継点
			// --------------------------------
			// サブメニュー（コンテキスト）設定
			this._MainPublicMenu.relation.context = new clsMenuList();

			// サブメニュー（関連付け）設定
			this._MainPublicMenu.relation.relation = new clsMenuRelation( { 
														   relKind	: 'item-relation'
														 , config	: wMenuRelationStat
														 , publicMenu: {
														 	  color		: this._MainPublicMenu.common.color
														 	, position	: this._MainPublicMenu.common.position
														  }
												} );

			// --------------------------------
			// 共通サブメニュー　フリーライン
			// --------------------------------
			// サブメニュー（コンテキスト）設定
			this._MainPublicMenu.freeline.context = new clsMenuList();

			// サブメニュー（線種設定）設定
			this._MainPublicMenu.freeline.lineStyle = new clsMenuList();

			// サブメニュー（線幅設定）設定
			this._MainPublicMenu.freeline.lineWidth = new clsMenuList();

			// サブメニュー（位置調整）設定
			this._MainPublicMenu.freeline.position = new clsMenuList();


			// --------------------------------
			// サイドパネル設定
			// --------------------------------
			if ( wIsSidePanel ) {
				// ※操作ロック時は編集メニューなし
				var wParamPanelSide = {
							  display		: true 
							, callback		: this.eventSidePanelChange
				};
				self.copyProperty( pArgument, wParamPanelSide );

				this._MainPanelSide = new clsPanelSide( wParamPanelSide );

			}


			// --------------------------------
			// 主コンテンツ設定
			// --------------------------------
			var wParamContentsBox = {
						  publicMenu	: this._MainPublicMenu
						, callback		: this.eventContentsChange
						, editMenu		: false
			};
			self.copyProperty( pArgument, wParamContentsBox );

			this._MainPanelContents = new clsContentsBox( wParamContentsBox );


			// --------------------------------
			// パネルコントローラ生成
			// --------------------------------
			var wMainPanel = null;
			if ( this._MainPanelContents ) wMainPanel = this._MainPanelContents.getBoxElement();

			var wSidePanel = null;
			if ( this._MainPanelSide ) wSidePanel = this._MainPanelSide.getBoxElement();

			var wParamPanelControl = {
						  panelLeft		: wSidePanel
						, panelRight	: wMainPanel
			};
			self.copyProperty( pArgument, wParamPanelControl );

			this._MainPanelControl = new clsPanelControl( wParamPanelControl );

		} catch(e) {
			throw { name: 'clsDrawMain.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsDrawMain.prototype.freeClass = function() {
		try {
			// クラス開放
			for( var wKey in this._MainPublicMenu ) {
				var wMenuItems = this._MainPublicMenu[wKey];
				
				if ( this.isObject(wMenuItems) ) {
					for( var wMenuId in wMenuItems ) {
						try {
							if ( wMenuItems[wMenuId].freeClass ) wMenuItems[wMenuId].freeClass();
						} catch(ef) {};
					}
				}
			}

			if ( this._MainPanelSide ) {
				try {
					if ( this._MainPanelSide.freeClass ) this._MainPanelSide.freeClass();
				} catch(e1) {};
			}

			if ( this._MainPanelContents ) {
				try {
					if ( this._MainPanelContents.freeClass ) this._MainPanelContents.freeClass();
				} catch(e2) {};
			}
			if ( this._MainPanelControl ) {
				try {
					if ( this._MainPanelControl.freeClass ) this._MainPanelControl.freeClass();
				} catch(e3) {};
			}

			// プロパティ開放
			this._MainPublicMenu			= null;
			this._MainPanelSide				= null;
			this._MainPanelContents			= null;
			this._MainPanelControl			= null;

		} catch(e) {}
	};

}());
