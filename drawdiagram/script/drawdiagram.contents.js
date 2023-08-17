
// --------------------------------------------------------------------
//
// ベース表示クラス
//
// --------------------------------------------------------------------
// clsContentsBox ← clsBaseBox
// --------------------------------------------------------------------
var clsContentsBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_CONTENTS_KIND					= 'contents';
		this._DEF_CONTENTS_SAVEKEY				= 'drawdiagrm-save-data-v1.00';

		this._DEF_CONTENTS_PROPERTY				= {
			 'z-index'				: '20'
		};

		// キャンバスのサイズ
		// ※ A4横：width - 1620, height - 1120
		this._DEF_CONTENTS_CANVAS_SIZE			= {
			 'width'				: 1620
			,'height'				: 1120
		};

		// コンテキストメニュー
		this._DEF_CONTENTS_MENU					= {
			 1: [
					 { kind: 'item'			, title: '人物'			}
					,{ kind: 'group'		, title: 'グループ'		}
					,{ kind: 'comment'		, title: 'コメント'		}
					,{ kind: 'freeline'		, title: 'ライン'		}
				]
			,2: [
					 { kind: 'color'		, title: '色変更'		}
				]
		};

		// 操作alert
		this._MSG_CONTENTS_ALERT				= {
			  'overlap'				: '他の項目と範囲が重複しています'
			, 'overflow'			: '配置先が範囲外です'
			, 'overflow-group'		: '配置先が所属グループの範囲外です'
			, 'relation-item'		: '所属している項目への関連付けは出来ません'
			, 'relation-group'		: '所属しているグループへの関連付けは出来ません'
		};

		// 継承元クラスのprototype
		this._BasePrototype						= null;

		// 操作可否
		this._ContentsLocked					= false;

		// 編集メニュー有無
		this._ContentsMenuIs					= null;
		// 編集メニュー状態
		this._ContentsEditMode					= '';

		this._ContentsEleMenu					= null;
		this._ContentsEleMenuList				= [];
		this._ContentsEleMain					= null;

		this._ContentsPublicMenu				= {};
		this._ContentsContextMenu				= null;
		this._ContentsContextValid				= false;
		this._ContentsContextEvent				= null;

		// コンテキストメニューオブジェクト
		this._ContentsMenuData					= null;
		this._ContentsMenuColor					= null;
		this._ContentsMenuFile					= null;

		// 項目操作通知用Callback
		this._ContentsLinkCallback				= [];

		// 操作中項目情報
		this._ContentsMoveInf					= { item: null, pos: null, drag: null, parent: null, kind: '', relation: null };
		this._ContentsResizeInf					= { item: null };
		this._ContentsSelectInf					= { item: null };
		this._ContentsCommentInf				= { item: null };
		this._ContentsRelation					= { item: null, relationInf: null, kind: '' };
		this._ContentsPosition					= { item: null, kind: '' };
		this._ContentsUpdInf					= { kind: '', param: null };
		this._ContentsLineInf					= { item: null, pos: null, start: null };

		// 所属項目
		this._ContentsItems						= {
			  person		: {}
			, group			: {}
			, comment		: {}
			, relation		: {}
			, freeline		: {}
		};

		// ライン描画要素
		this._ContentsCanvas					= null;

		// マウス追従コメント
		this._ContentsMouseCmt					= null;


		// **************************************************************
		// イベント処理
		// **************************************************************

		// コンテキストメニュー処理
		// ※クリックした項目のメニュー表示
		this.eventContentsContext = function( pEvent ) {
			try {
				// イベント停止（既存のコンテキストメニューを無効化）
				self.cancelEvent( pEvent, true );

				// ロック中は処理なし
				if ( self._ContentsLocked ) return false;

				// ベース操作無効時（項目操作時）
				if ( !self._ContentsContextValid ) {
					// 右クリックでキャンセル
					var wClickChk = self.getEventClick( pEvent );
					if ( wClickChk.right ) self.eventClearClick();

					return false;

				}

				// 処理中イベント解除
				// ※選択は解除しない
				self.cancelControl();

				// クリック位置の項目チェック
				var wClickItem = self.chkItemOverlapToClick( pEvent );

				// 項目click
				if ( wClickItem ) {
					// 項目のメニュー使用不可時は処理なし
					if ( !wClickItem.chkItemMenuAvailable() ) return false;

					// 項目のメニュー表示
					wClickItem.eventMenuDsp( pEvent );

				}
				// ベース画面click
				else if ( self._ContentsContextMenu ) {
					// 配置編集モード時
					if ( self.isEditModeMove() ) {
						// 処理なし
						return false;
					}

					// 通常コンテキストメニュー表示
					var wPoint = self.getEventPos( pEvent );
					self._ContentsContextMenu.dspMenu( wPoint );

				}

				// メニュー操作開始時のイベント情報を保存
				self._ContentsContextEvent = pEvent;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 項目選択イベント
		this.eventContentsClick = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// ロック中は処理なし
				if ( self._ContentsLocked ) return false;

				// ベース操作有効時のみ
				if ( !self._ContentsContextValid ) return false;

				// 左クリックのみ有効
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				// 選択対象
				// ※ 関連付け中継点、フリーラインは選択不可
				var wSelectTarget = {
						  relation	: false
						, freeline	: false
				};

				// クリック位置項目チェック
				var wClickItm = self.chkItemOverlapToClick( pEvent, wSelectTarget );
				if ( !wClickItm ) return false;

				// 移動可能かチェック
				var wMoveMode = self.isEditModeMove();
				if ( !wMoveMode ) {
					// ドラッグ操作可能　かつ　通常時ドラッグ許可なら移動可能
					if ( wClickItm.getItemDragIs() && wClickItm.getItemMoveInitIs() ) wMoveMode = true;
				}

				// 移動可能
				if ( wMoveMode ) {
					// 選択項目の移動開始
					self.moveItemStart( pEvent, wClickItm, 'move', true );

				// 選択項目が「コメント」以外
				} else if ( !wClickItm.isComment() ) {
					// 項目を選択状態にする
					self.selectClickItem( wClickItm );

				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 基本画面のメニュー　選択時処理
		this.eventMenuSelect = function( pEvent, pSelectMenu ) {
			try {
				// メニュー選択時処理実行
				var wRetVal = self.execContentsMenu( pEvent, pSelectMenu );

				return wRetVal;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ------------------------------------------
		// メニュー画面　ボタン押下時処理
		// ------------------------------------------

		// メニュー画面　選択時処理
		this.eventMainMenuSelect = function( pEvent ) {
			try {
				// ロック中は処理なし
				if ( self._ContentsLocked ) return false;

				// イベント停止
				self.cancelEvent( pEvent, true );

				// idからメニューkey取得
				var wId = this.id
				if ( !wId ) return null;

				wId = wId.replace( self.getBoxId() + '_menu_', '' );
				wId = wId.replace( '_link', '' );

				// 処理中イベント解除
				self.eventClear();

				// メニュー選択時処理実行
				var wRetVal = self.execMainMenu( pEvent, wId );

				return wRetVal;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ----------------------------
		// 項目移動
		// ----------------------------

		// 移動中マウス追従イベント
		this.eventItemMove = function( pEvent ) {
			try {
				if ( !pEvent ) return true;
				if ( !self._ContentsMoveInf.item ) return true;

				var wEle = self._ContentsMoveInf.item.getBoxElement();
				if ( !wEle ) return true;
				
				var wMovePos = { left: 0, top: 0 };

				// 親の位置補正
				wMovePos.left += self._ContentsMoveInf.pos.left;
				wMovePos.top  += self._ContentsMoveInf.pos.top;

				// ドラッグで移動の場合
				if ( self._ContentsMoveInf.drag ) {
					wMovePos.left += self._ContentsMoveInf.drag.left;
					wMovePos.top  += self._ContentsMoveInf.drag.top;
				}

				var wPoint = self.getEventPos( pEvent );

				wPoint.x -= wMovePos.left;
				if ( wPoint.x < 0 ) wPoint.x = 0;

				wPoint.y -= wMovePos.top;
				if ( wPoint.y < 0 ) wPoint.y = 0;

				// メイン画面のスクロール値加算
				var wMainScroll = self.getScroll( self._ContentsEleMain );
				wPoint.x += wMainScroll.x;
				wPoint.y += wMainScroll.y;

				wEle.style.left	= wPoint.x + "px";
				wEle.style.top	= wPoint.y  + "px";

			} catch(e) {
				// 強制終了
				self.execFunction( self.moveItemCancel );

				self.catchErrorDsp(e);

			}
			return false;
		};

		// 移動確定イベント
		this.eventItemMoveEnd = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 左クリックのみ有効
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				var wMoveExec = false;
				var wMoveKind = self._ContentsMoveInf.kind;
				var wMoveItem = self._ContentsMoveInf.item;

				// 移動処理
				if ( wMoveItem ) {
					// 移動確定
					wMoveExec = self.moveItemConfirm( pEvent, wMoveKind, wMoveItem );
					if ( !wMoveExec ) return false;

				}

				// 移動終了
				self.moveItemCancel();

				// 移動実行時は更新を通知
				if ( wMoveExec ) {
					// 項目変更通知（移動確定）
					pEvent.kind = wMoveKind;
					self.execLinkCallback( pEvent, wMoveItem );

				}

			} catch(e) {
				// 強制終了
				self.execFunction( self.moveItemCancel );

				self.catchErrorDsp(e);
			}
			
			return false;
		};

		// ----------------------------
		// 項目サイズ変更
		// ----------------------------

		// リサイズ中マウス追従イベント
		this.eventItemResize = function( pEvent ) {
			try {
				if ( !pEvent ) return true;
				if ( !self._ContentsResizeInf.item ) return true;

				var wEle = self._ContentsResizeInf.item.getBoxElement();
				if ( !wEle ) return true;

				var wPoint = self.getEventPos( pEvent );
				var wElePos = self._ContentsResizeInf.item.getBoxPos();

				var wWidth  = wPoint.x - wElePos.left;
				var wHeight = wPoint.y - wElePos.top;

				wEle.style.width  = wWidth  + "px";
				wEle.style.height = wHeight + "px";

			} catch(e) {
				// 強制終了
				self.execFunction( self.cancelResizeItem );

				self.catchErrorDsp(e);
			}
			return false;
		};

		// リサイズ確定イベント
		this.eventItemResizeEnd = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 変更後範囲チェック
				if ( !self.chkItemOverlapToPoint(self._ContentsResizeInf.item) ) {
					self.alertMouseCmt( 'overlap' );
					return false;
				
				}

				// リサイズ終了
				self.cancelResizeItem();

			} catch(e) {
				// 強制終了
				self.execFunction( self.cancelResizeItem );
				self.catchErrorDsp(e);
			}
			return false;
		};


		// ----------------------------
		// 項目更新
		// ----------------------------

		// 更新項目確定イベント
		this.eventItemUpdSelect = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				var wUpdItem = null;

				// 項目更新
				var wParam = self._ContentsUpdInf.param;
				if ( wParam ) {
					// クリック位置項目チェック
					// ※ コメント、関連付け中継点、フリーラインは選択不可
					var wSelectTarget = {
							  comment	: false
							, relation	: false
							, freeline	: false
					};
					wUpdItem = self.chkItemOverlapToClick( pEvent, wSelectTarget );
					if ( !wUpdItem ) return false;

					// 選択種別チェック
					var wUpdKind = wUpdItem.getBoxKind();
					if ( self._ContentsUpdInf.kind != wUpdKind ) return false;

					// 上書き確認
					var wChkMsg = '選択した項目の内容を更新します。よろしいですか？';
					if ( 'confirm' in wParam ) wChkMsg = wParam.confirm;
					if ( !self.dspConfirm(wChkMsg) ) return false;

					// 情報を上書き
					wUpdItem.updStatusValue( wParam );
				}

				// 移動終了
				self.updItemCancel();

				// 項目更新時
				if ( wUpdItem ) {
					// 項目追加を通知
					self.execFunction( self.execItemAddFunc, wUpdItem );

					// 項目変更通知
					pEvent.kind = self._ContentsUpdInf.kind;
					self.execLinkCallback( pEvent, wUpdItem );
				
				}

			} catch(e) {
				// 強制終了
				self.execFunction( self.updItemCancel );

				self.catchErrorDsp(e);
			}
			
			return false;
		};


		// ----------------------------
		// フリーライン追加
		// ----------------------------

		// フリーライン追加中マウス追従イベント
		this.eventFreeLineMove = function( pEvent ) {
			try {
				if ( !self._ContentsLineInf.item ) return true;

				var wEle = self._ContentsLineInf.item.getBoxElement();
				if ( !wEle ) return true;
				
				var wMovePos = { left: 0, top: 0 };

				// 親の位置補正
				wMovePos.left += self._ContentsLineInf.pos.left;
				wMovePos.top  += self._ContentsLineInf.pos.top;

				var wPoint = self.getEventPos( pEvent );

				wPoint.x -= wMovePos.left;
				if ( wPoint.x < 0 ) wPoint.x = 0;

				wPoint.y -= wMovePos.top;
				if ( wPoint.y < 0 ) wPoint.y = 0;

				// メイン画面のスクロール値加算
				var wMainScroll = self.getScroll( self._ContentsEleMain );
				wPoint.x += wMainScroll.x;
				wPoint.y += wMainScroll.y;

				wPoint.x += 2;
				wPoint.y += 2;

				wEle.style.left	= wPoint.x + "px";
				wEle.style.top	= wPoint.y  + "px";

			} catch(e) {
				// 強制終了
				self.execFunction( self.freeLineCancel );

				self.catchErrorDsp(e);

			}
			return false;
		};

		// フリーライン確定イベント
		this.eventFreeLineSet = function( pEvent ) {
			try {
				if ( !self._ContentsLineInf.item ) return false;

				// イベント停止
				//self.cancelEvent( pEvent, true );

				// 左クリック以外は終了
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				// 位置確定
				var wExec = self.freeLineConfirm( pEvent, self._ContentsLineInf.item );
				if ( !wExec ) return false;

			} catch(e) {
				// 強制終了
				self.execFunction( self.freeLineCancel );

				self.catchErrorDsp(e);
			}
			
			return false;
		};


		// ----------------------------
		// 位置調整関連
		// ----------------------------

		// 位置調整対象選択イベント
		this.eventPositionConfirm = function( pEvent ) {
			var wRelExec = false;

			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 対象項目チェック
				var wTargetItm = self._ContentsPosition.item;
				if ( !wTargetItm ) return false;

				// クリック位置の項目チェック
				var wClickItem = self.chkItemOverlapToClick( pEvent );
				if ( !wClickItem ) return false;

				// 位置調整確定
				var wConfirm = self.positionItemConfirm( wTargetItm, wClickItem );
				if ( !wConfirm ) return false;

				// 項目変更通知
				pEvent.kind = 'move';
				self.execLinkCallback( pEvent, wTargetItm );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			
			// 位置調整終了
			self.execFunction( self.positionItemCancel );

			return false;
		};

		// ----------------------------
		// 項目操作（メニュー処理）
		// ----------------------------

		// 人物操作（変更）時にCallされる
		this.eventItemPersonChange = function( pEvent, pArgument ) {
			try {
				// 項目操作時処理
				self.execItemControl( pArgument, self._ContentsItems.person );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// グループ操作（変更）時にCallされる
		this.eventItemGroupChange = function( pEvent, pArgument ) {
			try {
				// 項目操作時処理
				self.execItemControl( pArgument, self._ContentsItems.group );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// コメント操作（変更）時にCallされる
		this.eventItemCommentChange = function( pEvent, pArgument ) {
			try {
				// 項目操作時処理
				self.execItemControl( pArgument, self._ContentsItems.comment );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// 中継点操作（変更）時にCallされる
		this.eventItemRelationChange = function( pEvent, pArgument ) {
			try {
				// 項目操作時処理
				self.execItemControl( pArgument, self._ContentsItems.relation );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// フリーライン（変更）時にCallされる
		this.eventItemFreeLineChange = function( pEvent, pArgument ) {
			try {
				// 項目操作時処理
				self.execItemControl( pArgument, self._ContentsItems.freeline );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};


		// ----------------------------
		// コメント
		// ----------------------------

		// コメント追加時（内容設定後）にCallされる
		this.eventItemCommentAdd = function( pEvent, pParam ) {
			try {
				// コメント追加
				self.execAddItemComment( pEvent, pParam );

				return true;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};


		// ----------------------------
		// 色選択
		// ----------------------------

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
				self.setStyle( self._ContentsEleMain, { 'background-color' : wColor } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// ----------------------------
		// ファイル読込
		// ----------------------------

		// 読込ファイル選択時イベント
		this.eventLoadFile = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'file' ) return false;

				// データ読込処理
				self.execLoadData( pParam.fileData );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// ----------------------------
		// 関係関連
		// ----------------------------

		// 関連対象選択イベント
		this.eventRelationConfirm = function( pEvent ) {
			var wRelExec = false;

			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// クリック位置の項目チェック
				// ※ コメント、フリーラインは関連付け不可
				var wCheckParam = {
					  comment	: false
					, freeline	: false
				};
				var wClickItem = self.chkItemOverlapToClick( pEvent, wCheckParam );
				if ( !wClickItem ) return false;

				var wClickKd = wClickItem.getBoxKind();
				var wClickId = wClickItem.getBoxId();

				// 対象項目
				var wTargetItm = self._ContentsRelation.item;
				if ( !wTargetItm ) return false;

				var wTargetKd = wTargetItm.getBoxKind();
				var wTargetId = wTargetItm.getBoxId();

				// 自項目は処理なし
				if ( wTargetId == wClickId ) return false;

				// 関連状況取得
				var wRelationFlg = wTargetItm.chkRelationItem( wClickId );

				// 削除時
				if ( self._ContentsRelation.kind == 'unrelation' ) {
					// 関連付いていなければ処理なし
					if ( !wRelationFlg ) return false;

				// 変更時
				} else if ( self._ContentsRelation.kind == 'relationChg' ) {
					// 関連付いていなければ処理なし
					if ( !wRelationFlg ) return false;

				// 追加時
				} else {
					// 関連付け済は処理なし
					if ( wRelationFlg ) return false;

					// 中継点の場合
					if ( self.isItemRelation(wTargetKd) ) {
						// 自身の関連元・先項目は対象外
						if ( wTargetItm.chkMasterKey(wClickId) ) return false;
					}

					// クリック項目が中継点
					if ( self.isItemRelation(wClickKd) ) {
						// 自身の中継点は対象外
						if ( wTargetItm.chkRelationItemRelay(wClickId) ) return false;
					}

					// 項目クリック時
					if ( self.isItemPerson(wClickKd) ) {
						// 自身がグループ
						if ( self.isItemGroup(wTargetKd) ) {
							// 自身の子へは関係不可
							if ( wClickItem.getParentId() == wTargetId ) {
								self.alertMouseCmt( 'relation-item' );
								return false;
							}
						}

					// グループクリック
					} else if ( self.isItemGroup(wClickKd) ) {
						// 自身が項目
						if ( self.isItemPerson(wTargetKd) ) {
							// 自身の親へは関係不可
							if ( wTargetItm.getParentId() == wClickId ) {
								self.alertMouseCmt( 'relation-group' );
								return false;
							}
						}

					}
				
				}

				// 削除時
				if ( self._ContentsRelation.kind == 'unrelation' ) {
					// 関係解除
					self.liftRelation( wTargetItm, wClickItem );

					// 関係更新実行
					wRelExec = true;

				// 追加／変更時
				} else {
					// 関係変更メニュー表示
					wTargetItm.setRelationInf( pEvent, wClickId );

					// ※変更結果反映は各項目からの変更通知イベントで実施される

				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			
			// 関係追加終了
			self.execFunction( self.addRelationCancel );

			// 関係更新時は更新を通知
			if ( wRelExec ) {
				try {
					// 項目変更通知（関係更新）
					self.execLinkCallback( { kind: 'relation', event: pEvent }, wTargetItm );
				} catch(e) {
					self.catchErrorDsp(e);
				}
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
		throw { name: 'clsContentsBox.' + e.name, message: e.message };
	}
};

// メインパネル prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsContentsBox, clsBaseBox );

	// **************************************************************
	// プロパティ設定／取得
	// **************************************************************

	// 項目取得
	clsContentsBox.prototype.getBelongItems = function( ) {
		try {
			// 所属する項目オブジェクト群（への参照）を返す
			return this._ContentsItems.person;

		} catch(e) {
			throw { name: 'getBelongItems', message: e.message };
		}
	};

	// グループ取得
	clsContentsBox.prototype.getBelongGroups = function( ) {
		try {
			// 所属するグループオブジェクト群（への参照）を返す
			return this._ContentsItems.group;

		} catch(e) {
			throw { name: 'getBelongGroups', message: e.message };
		}
	};

	// コメント取得
	clsContentsBox.prototype.getBelongComment = function( ) {
		try {
			// 所属するコメントオブジェクト群（への参照）を返す
			return this._ContentsItems.group;

		} catch(e) {
			throw { name: 'getBelongComment', message: e.message };
		}
	};

	// 関連付け中継点取得
	clsContentsBox.prototype.getBelongRelation = function( ) {
		try {
			// 所属する関連付け中継点オブジェクト群（への参照）を返す
			return this._ContentsItems.relation;

		} catch(e) {
			throw { name: 'getBelongRelation', message: e.message };
		}
	};

	// フリーライン取得
	clsContentsBox.prototype.getBelongFreeLine = function( ) {
		try {
			// 所属する関連付け中継点オブジェクト群（への参照）を返す
			return this._ContentsItems.freeline;

		} catch(e) {
			throw { name: 'getBelongFreeLine', message: e.message };
		}
	};

	// 項目全て取得
	clsContentsBox.prototype.getBelongContents = function( ) {
		try {
			// 所属するオブジェクト群（への参照）を返す
			return this._ContentsItems;

		} catch(e) {
			throw { name: 'getBelongContents', message: e.message };
		}
	};

	// 項目全て取得
	clsContentsBox.prototype.getContentsItem = function( pItemId, pItemKd ) {
		try {
			var wRetItem = null;

			// 種別指定時
			if ( typeof pItemKd !== 'undefined' ) {
				if ( this.isItemPerson(pItemKd) ) {
					wRetItem = this._ContentsItems.person[pItemKd];

				} else if ( this.isItemGroup(pItemKd) ) {
					wRetItem = this._ContentsItems.group[pItemKd];

				} else if ( this.isItemComment(pItemKd) ) {
					wRetItem = this._ContentsItems.comment[pItemKd];

				} else if ( this.isItemRelation(pItemKd) ) {
					wRetItem = this._ContentsItems.relation[pItemKd];

				} else if ( this.isItemFreeLine(pItemKd) ) {
					wRetItem = this._ContentsItems.freeline[pItemKd];

				}
			
			}

			if ( !wRetItem ) {
				if ( pItemId in this._ContentsItems.person ) {
					wRetItem = this._ContentsItems.person[pItemId];

				} else if ( pItemId in this._ContentsItems.group ) {
					wRetItem = this._ContentsItems.group[pItemId];

				} else if ( pItemId in this._ContentsItems.comment ) {
					wRetItem = this._ContentsItems.comment[pItemId];

				} else if ( pItemId in this._ContentsItems.relation ) {
					wRetItem = this._ContentsItems.relation[pItemId];

				} else if ( pItemId in this._ContentsItems.freeline ) {
					wRetItem = this._ContentsItems.freeline[pItemId];

				}
			}
			
			return wRetItem;

		} catch(e) {
			throw { name: 'getContentsItem', message: e.message };
		}
	};


	// **************************************************************
	// 項目チェック
	// **************************************************************

	// 移動先に重なる項目があるかチェック
	clsContentsBox.prototype.chkItemOverlapToPoint = function( pTarget, pParam ) {
		try {
			self = this;

			if ( !pTarget ) return false;

			var wTgId   = pTarget.getBoxId();
			var wTgKind = pTarget.getBoxKind();
			var wTgRect = pTarget.getBoxRect();

			// パラメータ設定
			var wOverlap = true;
			if ( this.isObject(pParam) ) {
				// 範囲重複可否
				if ( 'overlap' in pParam ) wOverlap = pParam.overlap;

				// 移動先指定
				if ( 'targetRect' in pParam ) wTgRect = pParam.targetRect;
			}

			var checkOverlap = function( pId, pTgList ) {
				if ( !wTgRect ) return false;
				if ( !pTgList ) return false;

				for( var key in pTgList ) {
					if ( !pTgList.hasOwnProperty(key) ) continue;

					// 範囲重複チェック（自要素以外）
					if ( pTgList[key].getBoxId() != pId ) {
						if ( pTgList[key].chkBoxInRect(wTgRect) ) {
							return true;
						}
					}
				}
				return false;
			};

			var checkOverlapOther = function( pParentId, pTgList ) {
				if ( !wTgRect ) return false;
				if ( !pTgList ) return false;

				for( var key in pTgList ) {
					if ( !pTgList.hasOwnProperty(key) ) continue;

					// 範囲重複チェック（親要素以外）
					if ( pTgList[key].getParentId() != pParentId ) {
						if ( pTgList[key].chkBoxInRect(wTgRect) ) {
							return true;
						}
					}
				}
				return false;
			};

			// 同objectとの重なりチェック
			var wItemList = null;

			// 人物
			if ( this.isItemPerson(wTgKind) ) {
				wItemList = this._ContentsItems.person;
			
			// グループ
			} else if ( this.isItemGroup(wTgKind) ) {
				wItemList = this._ContentsItems.group;

			}
			if ( wItemList ) {
				if ( checkOverlap(wTgId, wItemList) ) {
					return false;
				}

			}

			// groupの場合は重なり不可
			if ( this.isItemGroup(wTgKind) ) {
				// 他objectとの重なりチェック
				if ( checkOverlapOther(wTgId, this._ContentsItems.person) ) {
					return false;
				}

			// 以外　かつ　重なり不可
			} else if ( !wOverlap ) {
				// groupとの重なりチェック
				var wParentId = pTarget.getParentId();
				if ( checkOverlap(wParentId, this._ContentsItems.group) ) {
					return false;
				}

			}
			return true;

		} catch(e) {
			throw { name: 'chkItemOverlapToPoint.' + e.name, message: e.message };
		}
	};

	// クリック位置に項目があるかチェック
	clsContentsBox.prototype.chkItemOverlapToClick = function( pEvent, pCheckKind ) {
		try {
			var self = this;

			var checkItemPos = function( pEvtPos, pTgList ) {
				if ( !pTgList ) return false;

				var wRetItem = null;

				var wChkItem;
				var wChkRect;
				for( var key in pTgList ) {
					if ( pTgList.hasOwnProperty(key) ) {
						wChkItem = pTgList[key];
						if ( wChkItem.chkBoxInPoint(pEvtPos) ) {
							wRetItem = wChkItem;

							// 後から追加した項目優先の為breakしない
						}
					}
				}

				return wRetItem;
			};

			// チェック対象
			// ※優先度順
			var wChkTarget = {
					  person	: true
					, relation	: true
					, freeline	: true
					, group		: true
					, comment	: true
				};
			if ( this.isObject(pCheckKind) ) {
				for( var wKey in pCheckKind ) {
					wChkTarget[wKey] = pCheckKind[wKey];
				}
			}

			var wEvtPos = this.getEventPos( pEvent );

			var wClickItem = null;
			for ( var wChkKey in wChkTarget ) {
				if ( !wChkTarget[wChkKey] ) continue;

				wClickItem = checkItemPos( wEvtPos, this._ContentsItems[wChkKey] );
				if ( wClickItem ) break;
			}

			return wClickItem;

		} catch(e) {
			throw { name: 'chkItemOverlapToClick.' + e.name, message: e.message };
		}
	};

	// クリック位置にグループがあるかチェック
	clsContentsBox.prototype.chkGroupOverlapToClick = function( pEvent ) {
		try {
			var wTgList = this._ContentsItems.group;
			if ( !wTgList ) return null;

			var wPoint = this.getEventPos( pEvent );

			var wRetVal = null;
			for( var key in wTgList ) {
				if ( wTgList.hasOwnProperty(key) ) {
					if ( wTgList[key].chkBoxInPoint(wPoint) ) {
						wRetVal = wTgList[key];
						break;
					}
				}
			}
			return wRetVal;

		} catch(e) {
			throw { name: 'chkGroupOverlapToClick.' + e.name, message: e.message };
		}
	};

	// 指定範囲に存在する中継点を取得
	clsContentsBox.prototype.getRelationOverlapToRect = function( pRect ) {
		try {
			// 中継点を全てチェック
			var wTgList = this._ContentsItems.relation;
			if ( !wTgList ) return null;

			var wRetList = [];
			for( var wKey in wTgList ) {
				if ( !wTgList.hasOwnProperty(wKey) ) continue;

				// 範囲内に存在するかチェック
				if ( wTgList[wKey].chkBoxInRect(pRect) ) {
					wRetList.push( wTgList[wKey] );
				}
			}

			if ( wRetList.length == 0 ) {
				return null;
			
			} else {
				return wRetList;
			
			}

		} catch(e) {
			throw { name: 'getRelationOverlapToRect.' + e.name, message: e.message };
		}
	};

	// 項目がキャンバス範囲内に納まるかチェック
	clsContentsBox.prototype.chkItemOverflowArea = function( pChkItem ) {
		try {
			// 項目の表示範囲
			var wItemRect = pChkItem.getBoxRect();
			var wItemSize = pChkItem.getBoxSize( { overflow: true, border: true } );

			wItemRect.right  = wItemRect.left + wItemSize.width;
			wItemRect.bottom = wItemRect.top  + wItemSize.height;

			// メイン画面の範囲
			var wMainRect = this.getRect( this._ContentsEleMain );

			var wMainScroll	= this.getScroll( this._ContentsEleMain );
			wMainRect.left -= wMainScroll.x;
			wMainRect.top  -= wMainScroll.y;

			// キャンバスの範囲
			var wCanvasStat = this._ContentsCanvas.canvasGetStatus();

			wMainRect.right  = wMainRect.left + wCanvasStat.width;
			wMainRect.bottom = wMainRect.top  + wCanvasStat.height;

			// メイン画面の範囲内に納まるかチェック
			return this.chkInRect( wMainRect, wItemRect, { overflow: false } );

		} catch(e) {
			throw { name: 'chkItemOverflowArea.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	//  ライン描画　関連付け
	// **************************************************************

	// 関係ライン描画
	clsContentsBox.prototype.drawRelationLine = function( pSrcItm, pDstItm, pRelInf, pLineParam ) {
		try {
			var self = this;

			if ( !pSrcItm ) return false;
			if ( !pDstItm ) return false;
			if ( !pRelInf ) return false;

			// 項目位置取得
			function getItmPos( pItem ) {
				var wItmPos  = pItem.getBoxPos();

				var wParentPos = { left: 0, top: 0 };
				// 親がGroup
				var wParentId = pItem.getParentId();
				if ( wParentId in self._ContentsItems.group ) {
					wParentPos = self._ContentsItems.group[wParentId].getParentPos();
				
				} else {
					wParentPos  = pItem.getParentPos();

				}
				wItmPos.left -= wParentPos.left;
				wItmPos.top  -= wParentPos.top;

				return wItmPos;
			};

			
			// ラインの中央取得
			function getCenterPos( pLineSt, pLineEd ) {
				var wCenterX = pLineSt.x + Math.floor( (pLineEd.x - pLineSt.x) / 2 );
				var wCenterY = pLineSt.y + Math.floor( (pLineEd.y - pLineSt.y) / 2 );

				var wCenter = { left: wCenterX, top: wCenterY };
				
				return wCenter;
			};

			// 項目位置・サイズ取得
			var wStPos = getItmPos( pSrcItm );
			var wEdPos = getItmPos( pDstItm );

			var wStSize = pSrcItm.getBoxSize();
			var wEdSize = pDstItm.getBoxSize();

			// メイン画面のスクロール値加算
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wStPos.left += wMainScroll.x;
			wStPos.top  += wMainScroll.y;
			
			wEdPos.left += wMainScroll.x;
			wEdPos.top  += wMainScroll.y;

			// 中継点かどうか
			var wStRelay = false;
			var wStRelayCmt = false;
			if ( pSrcItm.isRelation() ) {
				wStRelay	= true;
				wStRelayCmt	= pSrcItm.isComment();
			}

			var wEdRelay = false;
			var wEdRelayCmt = false;
			if ( pDstItm.isRelation() ) {
				wEdRelay	= true;
				wEdRelayCmt	= pDstItm.isComment();
			}

			// コメント表示位置
			var wCmtPos = Object.create( wStPos );

			// ライン描画
			if ( this._ContentsCanvas ) {
				// 描画設定取得
				var wLineKind = pRelInf.toLineKind();

				// パラメータ指定時
				if ( pLineParam ) {
					// ライン属性
					if ( 'width' in pLineParam ) wLineKind.width = pLineParam.width;
					if ( 'color' in pLineParam ) wLineKind.color = pLineParam.color;
					if ( 'style' in pLineParam ) wLineKind.style = pLineParam.style;
					if ( 'way'   in pLineParam ) wLineKind.way   = pLineParam.way;
				}

				// 矢印設定
				var wStArrow = false;
				var wEdArrow = false;

				// 正方向
				if ( wLineKind.way == 1 ) {
					wEdArrow = true;

				// 逆方向
				} else if ( wLineKind.way == 2 ) {
					wStArrow = true;

				// 双方向
				} else if ( wLineKind.way == 3 ) {
					wStArrow = true;
					wEdArrow = true;

				}

				var wLineParam = { 
							  StPos: wStPos, StSize: wStSize, StArrow: wStArrow, StRelay: wStRelay, StRelayCmt: wStRelayCmt
							, EdPos: wEdPos, EdSize: wEdSize, EdArrow: wEdArrow, EdRelay: wEdRelay, EdRelayCmt: wEdRelayCmt
				};

				var wLinePoint = this._ContentsCanvas.canvasGetDrawPoint( wLineParam, wLineKind );

				// ラインの幅が一定以下は描画しない
				var wWidthX = Math.abs( wLinePoint.EdPoint.x - wLinePoint.StPoint.x );
				var wWidthY = Math.abs( wLinePoint.EdPoint.y - wLinePoint.StPoint.y );
				if ( (wWidthX >= 1) || (wWidthY >= 1) ) {
					// 描画
					this._ContentsCanvas.canvasDrawLine( wLinePoint.StPoint, wLinePoint.EdPoint, wLineKind );

					// コメント位置補正
					wCmtPos = getCenterPos( wLinePoint.StPoint, wLinePoint.EdPoint );
				}
			}

			// 関係コメント表示
			pRelInf.dspRelationCmt( wCmtPos.left, wCmtPos.top );

			return true;

		} catch(e) {
			throw { name: 'drawRelationLine.' + e.name, message: e.message };
		}
	};

	// 全関係ライン描画
	clsContentsBox.prototype.drawRelationLineAll = function( pItemList, pLineParam ) {
		try {
			if ( !pItemList ) return false;

			// パラメータ設定
			var wSelectedItm	= null;
			var wRelayPoint		= null;
			var wProsessed		= null;
			if ( this.isObject(pLineParam) ) {
				if ( 'selected'  in pLineParam ) wSelectedItm	= pLineParam.selected;
				if ( 'relation'  in pLineParam ) wRelayPoint	= pLineParam.relation;
				if ( 'processed' in pLineParam ) wProsessed		= pLineParam.processed;
			}
			if ( !this.isObject(wProsessed) ) wProsessed = {};

			// 選択項目指定時
			var wDefParam	= null;
			if ( wSelectedItm ) {
				wDefParam = { width: 0.2 };

			}

			var wLineParam	= wDefParam;

			var wTargetFlg;
			var wTargetChild;
			var wListItm;
			var wRelItm;
			var wChildItm;
			var wChildKd;
			var wRelationList;

			for( var key in pItemList ) {
				if ( !pItemList.hasOwnProperty(key) ) continue;

				// 処理済は処理しない
				if ( key in wProsessed ) continue;

				wListItm = pItemList[key];

				// 選択項目指定時
				if ( wListItm == wSelectedItm ) {
					wTargetFlg = true;
				} else {
					wTargetFlg = false;
				}

				wRelationList = wListItm.getRelationList('parent');
				if ( !wRelationList ) continue;

				for ( var wId in wRelationList ) {
					// 処理済は処理しない
					if ( wId in wProsessed ) continue;

					// 対象のパラメータから項目取得
					wRelItm = wRelationList[wId];
					if ( !wRelItm ) continue;

					wChildItm = this.getContentsItem( wId, wRelItm.kind );
					if ( !wChildItm ) continue;

					// 関連付け（子）が対象かチェック
					wTargetChild = false;
					if ( !wTargetFlg ) {
						// 選択項目有効時
						if ( wChildItm == wSelectedItm ) wTargetChild = true;
					}

					if ( wTargetFlg || wTargetChild ) {
						wLineParam  = null
					} else {
						wLineParam  = wDefParam;
					}

					if ( typeof wRelayPoint == 'boolean' ) {
						// 中継点との関連付けが対象
						wChildKd = wChildItm.getBoxKind();
						if ( wRelayPoint ) {
							// 中継点以外は処理なし
							if ( !this.isItemRelation(wChildKd) ) continue;

						} else {
							// 中継点は処理なし
							if ( this.isItemRelation(wChildKd) ) continue;

						}
					}

					this.drawRelationLine( wListItm, wChildItm, wRelItm.relationInf, wLineParam );
				}

			}

		} catch(e) {
			throw { name: 'drawRelationLineAll.' + e.name, message: e.message };
		}
	};

	// 指定項目ライン描画
	clsContentsBox.prototype.drawItemLine = function( pTarget, pProcessedId ) {
		try {
			if ( !pTarget ) return false;

			// 処理済項目は処理なし
			var wTargetId = pTarget.getBoxId();
			if ( this.isObject(pProcessedId) ) {
				if ( wTargetId in pProcessedId ) return true;
			
			} else {
				pProcessedId = {};
			
			}

			// 処理済項目ID保存
			pProcessedId[wTargetId] = true;

			// 関連項目なければ処理なし
			var wRelationList = pTarget.getRelationList();
			if ( !wRelationList ) return false;

			var wRelItm;
			var wChildItm;
			var wLineKind;

			// 関連項目とのライン描画
			for ( var wId in wRelationList ) {
				wRelItm = wRelationList[wId];
				if ( !wRelItm ) continue;

				wChildItm = this.getContentsItem( wId, wRelItm.kind );
				if ( !wChildItm ) continue;

				// 項目の主で無い場合
				if ( !wRelItm.parent ) {
					// 関係ライン情報取得
					wLineKind = wRelItm.relationInf.toLineKind();

					// 矢印方向逆転
					if ( wLineKind.way == 1 ) {
						wLineKind.way = 2;

					} else if ( wLineKind.way == 2 ) {
						wLineKind.way = 1;

					}

				} else {
					wLineKind = null;

				}
				this.drawRelationLine( pTarget, wChildItm, wRelItm.relationInf, wLineKind );

				// ※ 再帰で中継点からのラインを描画
				this.drawItemLine( wRelItm.relationInf, pProcessedId );
			}

		} catch(e) {
			throw { name: 'drawItemLine.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	//  ライン描画　フリーライン
	// **************************************************************

	// フリーライン描画
	clsContentsBox.prototype.drawFreeLine = function( pSrcItm, pDstItm, pLineParam ) {
		try {
			var self = this;

			if ( !this._ContentsCanvas ) return false;

			if ( !pSrcItm ) return false;
			if ( !pDstItm ) return false;

			// 項目位置取得
			function getItmPos( pItem ) {
				var wItmPos  = pItem.getBoxPos();

				var wParentPos = pItem.getParentPos();

				wItmPos.left -= wParentPos.left;
				wItmPos.top  -= wParentPos.top;

				return wItmPos;
			};

			// 項目位置・サイズ取得
			var wStPos = getItmPos( pSrcItm );
			var wEdPos = getItmPos( pDstItm );

			var wStSize = pSrcItm.getBoxSize();
			var wEdSize = pDstItm.getBoxSize();

			// メイン画面のスクロール値加算
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wStPos.left += wMainScroll.x;
			wStPos.top  += wMainScroll.y;
			
			wEdPos.left += wMainScroll.x;
			wEdPos.top  += wMainScroll.y;

			// 中心位置
			var wStPoint = { x: wStPos.left, y: wStPos.top };
			var wEdPoint = { x: wEdPos.left, y: wEdPos.top };

			if ( wStSize.width  > 0 ) wStPoint.x += Math.floor( wStSize.width  / 2 );
			if ( wStSize.height > 0 ) wStPoint.y += Math.floor( wStSize.height / 2 );

			if ( wEdSize.width  > 0 ) wEdPoint.x += Math.floor( wEdSize.width  / 2 );
			if ( wEdSize.height > 0 ) wEdPoint.y += Math.floor( wEdSize.height / 2 );

			// ライン設定取得
			var wLineKind = pSrcItm.getLineStatus();

			// ライン属性指定時
			if ( this.isObject(pLineParam) ) {
				if ( 'width' in pLineParam ) wLineKind.width = pLineParam.width;
				if ( 'color' in pLineParam ) wLineKind.color = pLineParam.color;
				if ( 'style' in pLineParam ) wLineKind.style = pLineParam.style;
				if ( 'way'   in pLineParam ) wLineKind.way   = pLineParam.way;
			}

			// ラインの幅が一定以下は描画しない
			var wWidthX = Math.abs( wEdPoint.x - wStPoint.x );
			var wWidthY = Math.abs( wEdPoint.y - wStPoint.y );
			if ( (wWidthX >= 1) || (wWidthY >= 1) ) {
				// 描画
				this._ContentsCanvas.canvasDrawLine( wStPoint, wEdPoint, wLineKind );
			}

			return true;

		} catch(e) {
			throw { name: 'drawFreeLine.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作 - 関連付け
	// **************************************************************

	// 関連付け解除
	clsContentsBox.prototype.liftRelation = function( pSrcItm, pDstItm ) {
		try {
			if ( !pSrcItm ) return false;
			if ( !pDstItm  ) return false;

			var wSrcId = pSrcItm.getBoxId();
			var wDstId = pDstItm.getBoxId();

			// 関連付けKEY取得
			var wDelRel = pSrcItm.getRelationItem( wDstId );
			if ( !wDelRel ) return false;

			var wRelationKey = wDelRel.key;
			if ( !wRelationKey ) return false;

			// 関連付け情報解除
			pSrcItm.delRelationItem( wDstId );
			pDstItm.delRelationItem( wSrcId );

			// 関連付け情報削除
			var wRelationItm = this._ContentsItems.relation[wRelationKey];

			if ( wRelationItm ) {
				// 中継点の関連付け解除
				var wRelayList = wRelationItm.getRelationList();
				if ( wRelayList ) {
					for( var wRelayKey in wRelayList ) {
						// 関連対象取得
						var wRelayItm = this.getContentsItem( wRelayList[wRelayKey].id, wRelayList[wRelayKey].kind );

						// ※再帰で関連付け解除
						if ( wRelayItm ) {
							this.liftRelation( wRelationItm, wRelayItm );

						}
					}
					
				}

				// 項目削除を通知（削除される前に実施）
				this.execFunction( this.execItemDelFunc, wRelationItm );

				// 参照削除
				delete this._ContentsItems.relation[wRelationKey];

				// 項目削除
				wRelationItm.freeClass();
			}
			return true;

		} catch(e) {
			throw { name: 'liftRelation.' + e.name, message: e.message };
		}
	};

	// 全関連付け解除
	clsContentsBox.prototype.liftRelationAll = function( pDelItem ) {
		try {
			// 全関係を削除
			var wRelationList = pDelItem.getRelationList();
			if ( !wRelationList ) return false;

			var wRelationDel = false;

			var wRelInf;
			var wRelItm;
			for ( var wId in wRelationList ) {
				// 関係項目チェック
				wRelInf = wRelationList[wId];
				if ( !wRelInf ) continue;

				wRelItm = this.getContentsItem( wId, wRelInf.kind );
				if ( !wRelItm ) continue;

				// 関係削除
				if ( this.liftRelation(pDelItem, wRelItm) ) wRelationDel = true;
			}

			return wRelationDel;

		} catch(e) {
			throw { name: 'liftRelationAll.' + e.name, message: e.message };
		}
	};

	// 全関係ライン再描画
	clsContentsBox.prototype.drawRelationRedo = function( pLineParam ) {
		try {
			// キャンバスクリア
			if ( this._ContentsCanvas ) {
				this._ContentsCanvas.canvasClear();
			}

			// ラインパラメータ設定
			var wPriorityItm	= null;
			var wSelectItm		= null;
			if ( this.isObject(pLineParam) ) {
				wPriorityItm	= pLineParam.priority;
				wSelectItm		= pLineParam.select;
			}

			// 処理済項目ID
			var wProcessedId = {};

			// 優先項目指定時
			if ( wPriorityItm ) {
				// 優先項目のライン再描画
				this.drawItemLine( wPriorityItm, wProcessedId );

			}

			var wLineParam = {
					  selected	: wSelectItm
					, processed	: wProcessedId
			};
			// ライン再描画（中継点への関連付け以外）
			wLineParam.relation = false;
			this.drawRelationLineAll( this._ContentsItems.person,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.group,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.relation,	wLineParam );

			// ライン再描画（中継点への関連付け）
			wLineParam.relation = true;
			this.drawRelationLineAll( this._ContentsItems.person,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.group,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.relation,	wLineParam );

			// フリーライン描画
			this.drawFreeLineAll();

		} catch(e) {
			throw { name: 'drawRelationRedo.' + e.name, message: e.message };
		}
	};

	// 関連付け追加
	clsContentsBox.prototype.addRelation = function( pParam, pRelItem ) {
		try {
			// 関連情報無効なら処理なし
			var wNewRel = pParam.relationInf;
			if ( !this.isObject(wNewRel) ) return false;

			// 中継点生成
			var wAddRelation = this.addItem( null, 'item-relation' );
			if ( !wAddRelation ) return false;

			wAddRelation.setContents( wNewRel ); 

			var wDstId = pParam.relationId;
			if ( !wDstId ) return false;

			// 関連情報取得
			var wItemRel = this.getContentsItem( wDstId );
			if ( !wItemRel ) return false;

			// 関係追加
			this.setRelation( pRelItem, wItemRel, wAddRelation );

			// 全関係ライン再描画
			this.drawRelationRedo();

			try {
				// 項目変更通知（関係更新）
				pParam.kind = 'relation';
				this.execLinkCallback( pParam, pRelItem );

			} catch(e) {
				this.catchErrorDsp(e);
			}
			
			return true;

		} catch(e) {
			throw { name: 'addRelation.' + e.name, message: e.message };
		}
	};

	// 関連付け変更
	clsContentsBox.prototype.updRelation = function( pParam, pRelItem ) {
		try {
			// 関連情報無効なら処理なし
			var wNewRel = pParam.relationInf;
			if ( !this.isObject(wNewRel) ) return false;

			var wDstId = pParam.relationId;
			if ( !wDstId ) return false;

			// 関連情報取得
			var wItemRel = pRelItem.getRelationItem( wDstId );
			if ( !wItemRel ) return false;

			var wUpdRel = this._ContentsItems.relation[wItemRel.key];
			if ( !wUpdRel ) return false;

			// 設定内容更新
			wUpdRel.setContents( wNewRel ); 

			// コメント要素再生成
			wUpdRel.setCmtElement();

			// 全関係ライン再描画
			this.drawRelationRedo();

			try {
				// 項目変更通知（関係更新）
				pParam.kind = 'relation';
				this.execLinkCallback( pParam, pRelItem );

			} catch(e) {
				this.catchErrorDsp(e);
			}
			
			return true;

		} catch(e) {
			throw { name: 'updRelation.' + e.name, message: e.message };
		}
	};

	// 関連付け対象チェック
	clsContentsBox.prototype.chkRelationTarget = function( pRelItem ) {
		try {
			var wRelIdList = {};

			// 自項目ID
			var wId = pRelItem.getBoxId();
			wRelIdList[wId] = 1;

			// 親項目ID
			var wParentId = pRelItem.getParentId();
			if ( wParentId.length > 0 ) {
				wRelIdList[wParentId] = 1;
			}

			// 既に関連付いている項目取得
			var wRelList = pRelItem.getRelationList();
			for( var wKey in wRelList ) {
				// 関連項目ID
				wRelIdList[wKey] = 1;
				
				// 中継点のKEY設定
				wRelIdList[wRelList[wKey].key] = 1;
			}

			// 関連付け元が中継点
			var wRelKind = pRelItem.getBoxKind();
			if ( this.isItemRelation(wRelKind) ) {
				// 所属要素を追加
				wRelIdList[pRelItem.getMasterParent()] = 1;
				wRelIdList[pRelItem.getMasterTarget()] = 1;
			}

			var wTargetFlg = false;

			// グループチェック
			for( var wGrpKey in this._ContentsItems.group ) {
				if ( !(wGrpKey in wRelIdList) ) {
					wTargetFlg = true;
					break;
				}
			}

			// 項目チェック
			if ( !wTargetFlg ) {
				for( var wItmKey in this._ContentsItems.person ) {
					if ( !(wItmKey in wRelIdList) ) {
						wTargetFlg = true;
						break;
					}
				}
			}

			// 中継点チェック
			if ( !wTargetFlg ) {
				for( var wRelKey in this._ContentsItems.relation ) {
					if ( !(wRelKey in wRelIdList) ) {
						wTargetFlg = true;
						break;
					}
				}
			}

			return wTargetFlg;

		} catch(e) {
			throw { name: 'chkRelationTarget.' + e.name, message: e.message };
		}
	};

	// 関連付け開始
	clsContentsBox.prototype.addRelationStart = function( pParam, pRelItem ) {
		try {
			// 関係追加開始
			this.addRelationEvent();

			var wKind = pParam.kind;
			var wRelayFlg = false;
			var wReverse  = false;

			// コメント表示
			var wComment = '';
			if ( wKind == 'unrelation' ) {
				wComment = '解除対象を選択してください';

			} else if ( wKind == 'relationChg' ) {
				wComment = '変更対象を選択してください';

			} else {
				wComment = '関連対象を選択してください';

				// 関連付け対象選択時は中継点も選択状態とする
				wRelayFlg = true;
				// 未関連のみ対象
				wReverse  = true;

			}
			this.dspMouseCmt( pParam.event, wComment );

			// 関係パラメータを保存
			this._ContentsRelation.item			= pRelItem;
			this._ContentsRelation.relationInf	= pParam.relationInf;
			this._ContentsRelation.kind			= wKind;

			// ベースメニュー無効化
			this.useContextCtrl( false );

			// 項目を選択状態
			this.setSelectItem( pRelItem, { selected: true, relay: wRelayFlg, emphasis: true, emphasisRev: wReverse } );

		} catch(e) {
			// 関係追加キャンセルしてthrow
			this.execFunction( this.addRelationCancel );
			throw { name: 'addRelationStart.' + e.name, message: e.message };
		}
	};

	// 関連対象選択イベント追加
	clsContentsBox.prototype.addRelationEvent = function() {
		try {
			// 項目確定
			this.addBoxEvents( 'onclick' , this.eventRelationConfirm );

		} catch(e) {
			throw { name: 'addRelationEvent.' + e.name, message: e.message };
		}
	};

	// 関連対象選択イベント削除
	clsContentsBox.prototype.delRelationEvent = function() {
		try {
			// 項目確定
			this.delBoxEvents( 'onclick' , this.eventRelationConfirm );

		} catch(e) {
			throw { name: 'delRelationEvent.' + e.name, message: e.message };
		}
	};

	// 関連付けキャンセル
	clsContentsBox.prototype.addRelationCancel = function() {
		try {
			// 処理中でなければ処理なし
			if ( !this._ContentsRelation.item ) return;

			// イベント停止
			// ※例外無視
			this.execFunction( this.delRelationEvent );
			
			// コメント非表示
			this.hideMouseCmt();

			if ( this._ContentsRelation.item ) {
				// 選択状態・強調表示解除
				this.execFunction( this.resetSelectItem );

				// 全関係ライン再描画
				this.execFunction( this.drawRelationRedo );
			}

			this._ContentsRelation.item			= null;
			this._ContentsRelation.relationInf	= null;
			this._ContentsRelation.kind			= '';

			// ベースメニュー有効化
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'addRelationCancel.' + e.name, message: e.message };
		}
	};

	// 関係追加
	clsContentsBox.prototype.setRelation = function( pSrcItm, pDstItm, pRelInf ) {
		try {
			if ( !pSrcItm ) return false;
			if ( !pDstItm  ) return false;

			var wMasterId = pDstItm.getBoxId();
			var wMasterKd = pDstItm.getBoxKind();

			// 関連先
			var wTargetId = pSrcItm.getBoxId();
			var wTargetKd = pSrcItm.getBoxKind();

			// Callback設定
			pRelInf.setItemCallback( this.eventItemRelationChange );

			// 共通メニュー設定
			var wPublicMenu = this.getItemPublicMenu( 'item-relation' );
			pRelInf.setPublicMenu( wPublicMenu );

			// 関連付け情報の親設定
			pRelInf.initParent( this._ContentsEleMain );

			// KEY設定
			pRelInf.setMasterKey( wMasterId, wTargetId );

			// コメント要素生成
			pRelInf.setCmtElement();

			// 関連付け情報保存
			var wRelationId  = pRelInf.getBoxId();
			this._ContentsItems.relation[wRelationId] = pRelInf;

			// 項目追加を通知
			this.execFunction( this.execItemAddFunc, pRelInf );

			// 関連付け情報設定
			// ※ 関連付け情報への参照を各項目へ設定する
			pSrcItm.addRelationItem( wMasterId, { kind: wMasterKd, key: wRelationId, parent: true,  relationInf: pRelInf } );
			pDstItm.addRelationItem( wTargetId, { kind: wTargetKd, key: wRelationId, parent: false, relationInf: pRelInf } );

		} catch(e) {
			throw { name: 'setRelation.' + e.name, message: e.message };
		}
	};

	// 関連付け中継点初期化
	clsContentsBox.prototype.clearRelationRelay = function( pRelItem ) {
		try {
			// 自項目と関連している項目との中継点を全てクリア
			var wRelList = pRelItem.getRelationList();
			if ( !wRelList ) return;

			for( var wKey in wRelList ) {
				// 中継点（コメント位置）クリア
				wRelList[wKey].relationInf.clearLinePoint();

			}

			
		} catch(e) {
			throw { name: 'clearRelationRelay.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作 - 移動
	// **************************************************************

	// 項目移動初期設定
	clsContentsBox.prototype.moveItemStart = function( pEvent, pMoveObj, pMoveKind, pDrag ) {
		try {
			if ( !pMoveObj ) return false;

			// 項目のメニュー無効化
			pMoveObj.setContextAvailable( false );
			pMoveObj.setPositionAvailable( false );

			// 移動対象項目の設定
			this._ContentsMoveInf.kind		= pMoveKind;
			this._ContentsMoveInf.item		= pMoveObj;
			this._ContentsMoveInf.parent	= pMoveObj.getParentId();

			// 親から解除
			if ( this._ContentsMoveInf.parent !== this.getBoxId() ) {
				pMoveObj.setParent( this._ContentsEleMain );
			}

			// 移動項目がグループ
			if ( pMoveObj.isGroup() ) {
				// 範囲内の中継点を一時的に所属
				this.setAreaRelationCmt( pMoveObj );

			}

			// 位置補正　親の位置取得
			this._ContentsMoveInf.pos = pMoveObj.getParentPos();

			// マウスドラッグによる位置移動
			var wEvtPos = this.getEventPos( pEvent );
			var wStPos = null;
			if ( (typeof pDrag == 'boolean') && (pDrag == true) ) {
				var wItmPos = pMoveObj.getBoxPos();
				
				this._ContentsMoveInf.drag = {
					  left: wEvtPos.x - wItmPos.left
					, top : wEvtPos.y - wItmPos.top
				};

			} else {
				this._ContentsMoveInf.drag = null;

				wStPos = { x: wEvtPos.x, y: wEvtPos.y };
				wStPos.x -= this._ContentsMoveInf.pos.left;
				wStPos.y -= this._ContentsMoveInf.pos.top;

				// メイン画面のスクロール値加算
				var wMainScroll = this.getScroll( this._ContentsEleMain );
				wStPos.x += wMainScroll.x;
				wStPos.y += wMainScroll.y;

			}

			// 最前面へ移動
			pMoveObj.dspBox( true, true, wStPos );

			// ベースメニュー無効化
			this.useContextCtrl( false );

			// 対象がドラッグ可能な場合はコメント表示なし
			var wIsDrag = pMoveObj.getItemDragIs();
			if ( !wIsDrag ) {
				var wComment = '先を指定してください' ;
				if ( pMoveKind == 'add' ) {
					wComment = '追加' + wComment;
				} else {
					wComment = '移動' + wComment;
				}
				this.dspMouseCmt( pEvent, wComment );
			}

			// 移動イベント設定
			this.addMoveEvent( wIsDrag );


		} catch(e) {
			// 移動キャンセルしてthrow
			this.execFunction( this.moveItemCancel );
			throw { name: 'moveItemStart.' + e.name, message: e.message };

		}
	};

	// 項目移動終了（後処理）
	clsContentsBox.prototype.moveItemCancel = function() {
		try {
			// 処理中でなければ処理なし
			if ( this._ContentsMoveInf.kind == '' ) return;

			// イベント停止
			// ※例外無視
			this.execFunction( this.delMoveEvent );
			
			// コメント非表示
			this.hideMouseCmt();

			// 中継点解除
			this.execFunction( this.freeAreaRelationCmt );

			if ( this._ContentsMoveInf.item ) {
				// 項目追加
				if ( this._ContentsMoveInf.kind == 'add' ) {
					// 追加項目削除
					this._ContentsMoveInf.item.freeClass();

				// 移動のみ
				} else {
					// 項目最前面終了
					this._ContentsMoveInf.item.dspBox( true, false );

					// 移動項目の関連情報中継点初期化
					this.clearRelationRelay( this._ContentsMoveInf.item );

					// 配置編集モード時
					if ( this.isEditModeMove() ) {
						// 項目の位置調整メニュー有効化
						this._ContentsMoveInf.item.setPositionAvailable( true );

					}

					// 移動項目を優先的に描画
					var wLineParam = { priority: this._ContentsMoveInf.item };

					// 全関係ライン再描画
					this.drawRelationRedo( wLineParam );

				}
			}

			this._ContentsMoveInf.kind		= '';
			this._ContentsMoveInf.item		= null;
			this._ContentsMoveInf.pos		= null;
			this._ContentsMoveInf.parent	= null;
			this._ContentsMoveInf.drag		= null;

			// ベースメニュー有効化
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'moveItemCancel.' + e.name, message: e.message };
		}
	};

	// 項目移動イベント設定
	clsContentsBox.prototype.addMoveEvent = function( pDragIs ) {
		try {
			// マウス追従
			this.addBoxEvents( 'onmousemove'	, this.eventItemMove );

			// 項目確定
			if ( pDragIs ) {
				this.addBoxEvents( 'onmouseup'		, this.eventItemMoveEnd );
			} else {
				this.addBoxEvents( 'onmousedown'	, this.eventItemMoveEnd );
			}

		} catch(e) {
			throw { name: 'addMoveEvent.' + e.name, message: e.message };
		}
	};

	// 項目移動イベント解除
	clsContentsBox.prototype.delMoveEvent = function() {
		try {
			// マウス追従
			this.delBoxEvents( 'onmousemove'	, this.eventItemMove );

			// 項目確定
			this.delBoxEvents( 'onmouseup'		, this.eventItemMoveEnd );
			this.delBoxEvents( 'onmousedown'	, this.eventItemMoveEnd );

		} catch(e) {
			throw { name: 'delMoveEvent.' + e.name, message: e.message };
		}
	};

	// 項目移動確定
	clsContentsBox.prototype.moveItemConfirm = function( pEvent, pMoveKind, pMoveItem ) {
		try {
			var wItemId = pMoveItem.getBoxId();
			var wItemKd = pMoveItem.getBoxKind();

			// 移動先の項目チェック
			if ( !this.chkItemOverlapToPoint(pMoveItem) ) return false;

			// 移動先のキャンバス範囲チェック
			if ( !this.chkItemOverflowArea(pMoveItem) ) {
				this.alertMouseCmt( 'overflow' );
				return false;
			}

			// 人物項目の場合
			if ( this.isItemPerson(wItemKd) ) {
				// クリック位置グループチェック
				var wSelGrp = this.chkGroupOverlapToClick( pEvent );

				// 親変更
				if ( wSelGrp ) {
					// 親に設定
					if ( wSelGrp.getBoxId() !== pMoveItem.getParentId() ) {
						pMoveItem.setParent( wSelGrp.getBoxElement() );
						
						// 関係を解除
						this.liftRelation( pMoveItem, wSelGrp );
						
					}
				
				}

			// 中継点の場合
			} else if ( this.isItemRelation(wItemKd) ) {
				// 中継点コメント位置確定
				pMoveItem.setCommentPoint( pEvent );

			}

			// 項目追加時以外は処理終了（正常）
			if ( pMoveKind != 'add' ) return true;

			var wAddCancel = false;

			// 人物追加
			if ( this.isItemPerson(wItemKd) ) {
				// 追加項目を保存
				this._ContentsItems.person[wItemId] = pMoveItem;
				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// グループ追加
			} else if ( this.isItemGroup(wItemKd) ) {
				// 追加項目を保存
				this._ContentsItems.group[wItemId] = pMoveItem;
				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// コメント追加
			} else if ( this.isItemComment(wItemKd) ) {
				// 追加項目を保存
				this._ContentsItems.comment[wItemId] = pMoveItem;
				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// フリーライン追加
			} else if ( this.isItemFreeLine(wItemKd) ) {
				// 追加項目を保存
				this._ContentsItems.freeline[wItemId] = pMoveItem;
				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// 以外
			} else {
				// 追加キャンセル
				wAddCancel = true;

			}
			
			if ( !wAddCancel ) {
				// 移動種別を「移動」に変更
				// ※「追加」のままだと終了処理で追加項目が削除される為
				this._ContentsMoveInf.kind = 'move';
			}

			return true;

		} catch(e) {
			throw { name: 'moveItemConfirm.' + e.name, message: e.message };
		}
	};

	// 一時的に所属させた中継点を解除
	clsContentsBox.prototype.freeAreaRelationCmt = function() {
		try {
			// 対象存在する場合のみ
			var wTargetRel = this._ContentsMoveInf.relation;
			if ( !wTargetRel ) return null;

			// メイン画面の位置補正
			var wMainPos	= this.getPos( this._ContentsEleMain );
			var wMainScroll	= this.getScroll( this._ContentsEleMain );

			var wRelation;
			var wRelPos;
			var wRelCrt;

			var wTargetCnt = wTargetRel.length;
			for( var wIndex = 0; wIndex < wTargetCnt; wIndex++ ) {
				// グループから解除
				wRelation = wTargetRel[wIndex];
				wRelation.setParent( this._ContentsEleMain );

				// 中継点位置を更新
				wRelPos = wRelation.getBoxPos();
				wRelCrt = wRelation.getLinePointCorrection();

				wRelPos.x = wRelPos.left - wMainPos.left;
				wRelPos.x += wMainScroll.x + wRelCrt.x;

				wRelPos.y = wRelPos.top - wMainPos.top;
				wRelPos.y += wMainScroll.y + wRelCrt.y;

				wRelation.setLinePointPos( wRelPos );
			}

			// 対象項目を解除
			this._ContentsMoveInf.relation = null;

		} catch(e) {
			throw { name: 'freeAreaRelationCmt.' + e.name, message: e.message };
		}
	};

	// 範囲内の中継点を一時的に所属
	clsContentsBox.prototype.setAreaRelationCmt = function( pItem ) {
		try {
			// 一旦解除
			this.freeAreaRelationCmt();

			// 親として設定
			var wParentEle = pItem.getBoxElement();
			if ( !wParentEle ) return null;

			// 項目の範囲取得
			var wArea = pItem.getBoxRect();

			// 範囲内にある中継点取得
			var wTargetRel = this.getRelationOverlapToRect( wArea );
			if ( !wTargetRel ) return null;

			// 一旦項目に所属
			var wTargetCnt = wTargetRel.length;
			for( var wIndex = 0; wIndex < wTargetCnt; wIndex++ ) {
				wTargetRel[wIndex].setParent( wParentEle );
			
			}

			// 対象項目を保存
			this._ContentsMoveInf.relation = wTargetRel;

		} catch(e) {
			throw { name: 'getAreaRelationCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作 - サイズ変更
	// **************************************************************

	// リサイズ開始
	clsContentsBox.prototype.resizeItem = function( pEvent, pResizeObj ) {
		try {
			if ( !pResizeObj ) return false;
			this._ContentsResizeInf.item = pResizeObj;

			// リサイズ開始エラー
			this.addResizeEvent();

			// 最前面へ移動
			this._ContentsResizeInf.item.dspBox( true, true );

			// ベースメニュー無効化
			this.useContextCtrl( false );

			// コメント表示
			this.dspMouseCmt( pEvent, 'サイズを指定してください' );

		} catch(e) {
			// 移動キャンセルしてthrow
			this.execFunction( this.cancelResizeItem );
			throw { name: 'resizeItem.' + e.name, message: e.message };
		}
	};

	// リサイズ終了
	clsContentsBox.prototype.cancelResizeItem = function() {
		try {
			// 処理中でなければ処理なし
			if ( !this._ContentsResizeInf.item ) return;

			// イベント停止
			// ※例外無視
			this.execFunction( this.delResizeEvent );
			
			// コメント非表示
			this.hideMouseCmt();

			// 最前面化解除
			this._ContentsResizeInf.item.dspBox( true, false );

			// グループの場合
			if ( this._ContentsResizeInf.item.isGroup() ) {
				// 移動項目を優先的に描画
				var wLineParam = { priority: this._ContentsResizeInf.item };

				// 全関係ライン再描画
				this.drawRelationRedo( wLineParam );
			
			}

			this._ContentsResizeInf.item = null;

			// ベースメニュー有効化
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'cancelResizeItem.' + e.name, message: e.message };
		}
	};

	// リサイズイベント設定
	clsContentsBox.prototype.addResizeEvent = function() {
		try {
			// マウス追従
			this.addBoxEvents( 'onmousemove'	, this.eventItemResize );

			// 項目確定
			this.addBoxEvents( 'onclick'		, this.eventItemResizeEnd );

		} catch(e) {
			throw { name: 'addResizeEvent.' + e.name, message: e.message };
		}
	};

	// リサイズイベント解除
	clsContentsBox.prototype.delResizeEvent = function() {
		try {
			// マウス追従
			this.delBoxEvents( 'onmousemove'	, this.eventItemResize );

			// 項目確定
			this.delBoxEvents( 'onclick'		, this.eventItemResizeEnd );

		} catch(e) {
			throw { name: 'delResizeEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作 - 更新
	// **************************************************************

	// 更新項目選択　開始
	clsContentsBox.prototype.updItemStart = function( pParam, pItemKind ) {
		try {
			if ( !pParam ) return false;

			// 移動イベント設定
			this.addUpdEvent();

			// 移動対象項目の設定
			this._ContentsUpdInf.kind	= pItemKind;
			this._ContentsUpdInf.param	= pParam;

			// ベースメニュー無効化
			this.useContextCtrl( false );

			// コメント表示
			var wComment = '対象を指定してください' ;
			if ( 'comment' in pParam ) {
				wComment = pParam.comment;
			}
			this.dspMouseCmt( pParam, wComment );

		} catch(e) {
			// 移動キャンセルしてthrow
			this.execFunction( this.updItemCancel );
			throw { name: 'updItemStart.' + e.name, message: e.message };

		}
	};

	// 項目更新終了（後処理）
	clsContentsBox.prototype.updItemCancel = function() {
		try {
			// 処理中でなければ処理なし
			if ( !this._ContentsUpdInf.param ) return;

			// イベント停止
			// ※例外無視
			this.execFunction( this.delUpdEvent );
			
			// コメント非表示
			this.hideMouseCmt();

			// 更新情報破棄
			this._ContentsUpdInf.kind	= '';
			this._ContentsUpdInf.param	= null;

			// ベースメニュー有効化
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'updItemCancel.' + e.name, message: e.message };
		}
	};

	// 項目更新イベント設定
	clsContentsBox.prototype.addUpdEvent = function() {
		try {
			// 項目確定
			this.addBoxEvents( 'onclick'	, this.eventItemUpdSelect );

		} catch(e) {
			throw { name: 'addUpdEvent.' + e.name, message: e.message };
		}
	};

	// 項目更新イベント解除
	clsContentsBox.prototype.delUpdEvent = function() {
		try {
			// 項目確定
			this.delBoxEvents( 'onclick'	, this.eventItemUpdSelect );

		} catch(e) {
			throw { name: 'delUpdEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作 - 位置調整
	// **************************************************************

	// 位置調整開始
	clsContentsBox.prototype.positionItemStart = function( pParam, pTarget ) {
		try {
			// 関係追加開始
			this.addPositionEvent();

			// コメント表示
			var wComment = '対象を選択してください';

			this.dspMouseCmt( pParam.event, wComment );

			// 位置調整パラメータを保存
			this._ContentsPosition.item		= pTarget;
			this._ContentsPosition.kind		= pParam.kind;

			// ベースメニュー無効化
			this.useContextCtrl( false );

			// 項目を選択状態
			this.setSelectItem( pTarget, { selected: true, only: true } );

		} catch(e) {
			// 関係追加キャンセルしてthrow
			this.execFunction( this.positionItemCancel );
			throw { name: 'positionItemStart.' + e.name, message: e.message };
		}
	};

	// 位置調整対象選択イベント追加
	clsContentsBox.prototype.addPositionEvent = function() {
		try {
			// 項目確定
			this.addBoxEvents( 'onclick' , this.eventPositionConfirm );

		} catch(e) {
			throw { name: 'addPositionEvent.' + e.name, message: e.message };
		}
	};

	// 位置調整対象選択イベント削除
	clsContentsBox.prototype.delPositionEvent = function() {
		try {
			// 項目確定
			this.delBoxEvents( 'onclick' , this.eventPositionConfirm );

		} catch(e) {
			throw { name: 'delPositionEvent.' + e.name, message: e.message };
		}
	};

	// 位置調整キャンセル
	clsContentsBox.prototype.positionItemCancel = function() {
		try {
			// 処理中でなければ処理なし
			if ( !this._ContentsPosition.item ) return;

			// イベント停止
			// ※例外無視
			this.execFunction( this.delPositionEvent );
			
			// コメント非表示
			this.hideMouseCmt();

			if ( this._ContentsPosition.item ) {
				// 選択状態・強調表示解除
				this.execFunction( this.resetSelectItem );

				// 全関係ライン再描画
				this.execFunction( this.drawRelationRedo );
			}

			this._ContentsPosition.item		= null;
			this._ContentsPosition.kind		= '';

			// ベースメニュー有効化
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'positionItemCancel.' + e.name, message: e.message };
		}
	};

	// 位置調整確定
	clsContentsBox.prototype.positionItemConfirm = function( pTargetItm, pClickItem ) {
		try {
			var wClickKd	= pClickItem.getBoxKind();
			var wClickId	= pClickItem.getBoxId();
			var wClickPid	= pClickItem.getParentId();

			var wTargetKd	= pTargetItm.getBoxKind();
			var wTargetId	= pTargetItm.getBoxId();
			var wTargetPid	= pTargetItm.getParentId();

			// 自項目チェック
			if ( wTargetId == wClickId ) return false;

			// 自親項目チェック
			if ( wTargetPid == wClickId ) return false;
			
			// 対象がgroup
			if ( this.isItemGroup(wTargetKd) ) {
				// 自身に所属する項目チェック
				if ( wTargetId == wClickPid ) return false;
			}

			// 移動前対象位置
			var wTargetBef = pTargetItm.getBoxRect();
			var wClickRect = pClickItem.getBoxRect();

			// 項目領域チェック
			if ( pClickItem.chkBoxInRect(wTargetBef) ) return false;

			// クリック項目が中継点
			if ( this.isItemRelation(wClickKd) ) {
				if ( pTargetItm.chkBoxInRect(wClickRect) ) return false;
			}

			// 対象項目情報
			var wTargetSize	= pTargetItm.getBoxSize( { border: false } );
			var wTargetLine	= 0;
			if ( this.isItemRelation(wTargetKd) ) wTargetLine = pTargetItm.getDefLineWidth();

			// 親がGroupの場合は位置など取得
			var wParentItem = null;
			var wParentRect	= null;
			var wParentLine	= null;

			if ( wTargetPid in this._ContentsItems.group ) {
				wParentItem = this._ContentsItems.group[wTargetPid];
				
				wParentRect	= wParentItem.getBoxRect();
				wParentLine	= wParentItem.getBoxLine();

			}

			// クリック項目の位置取得
			var wClickSize	= pClickItem.getBoxSize( { border: false } );

			// メイン画面の位置補正
			var wMainPos	= this.getPos( this._ContentsEleMain );
			var wMainScroll	= this.getScroll( this._ContentsEleMain );

			// 位置変更
			var wMovePos = {};

			switch( this._ContentsPosition.kind ) {
			// 位置調整（縦）
			case 'pos-vert':
				// 中継点選択時の調整
				var wRelationTop = this.getPositionRelMove( {
										  targetKd		: wTargetKd
										, targetSize	: wTargetSize.height
										, targetLine	: wTargetLine
										, clickKd		: wClickKd
										, clickSize		: wClickSize.height
									} );
				wClickRect.top += wRelationTop;

				// 移動先チェック用
				// ※スクロール、親の位置調整不要
				var wHeight = wTargetBef.bottom - wTargetBef.top;
				wTargetBef.top		= wClickRect.top;
				wTargetBef.bottom	= wClickRect.top + wHeight;

				// メイン画面のスクロール調整
				wClickRect.top -= wMainPos.top;
				wClickRect.top += wMainScroll.y;

				// 親の位置調整
				if ( wParentItem ) {
					var wParentTop = wParentRect.top - wMainPos.top;
					wParentTop += wMainScroll.y;

					wClickRect.top -= wParentTop;
					if ( wParentLine ) wClickRect.top -= wParentLine.width;
				}

				// 移動先設定
				wMovePos.y = wClickRect.top;

				break;

			// 位置調整（横）
			case 'pos-side':
				// 中継点選択時の調整
				var wRelationLeft = this.getPositionRelMove( {
										  targetKd		: wTargetKd
										, targetSize	: wTargetSize.width
										, targetLine	: wTargetLine
										, clickKd		: wClickKd
										, clickSize		: wClickSize.width
									} );
				wClickRect.left += wRelationLeft;

				// 移動先チェック用
				// ※スクロール、親の位置調整不要
				var wWidth = wTargetBef.right - wTargetBef.left;
				wTargetBef.left		= wClickRect.left;
				wTargetBef.right	= wClickRect.left + wWidth;

				// 横位置変更
				wClickRect.left -= wMainPos.left;
				wClickRect.left += wMainScroll.x;

				// 親の位置調整
				if ( wParentItem ) {
					var wParentLeft = wParentRect.left - wMainPos.left;
					wParentLeft += wMainScroll.x;

					wClickRect.left -= wParentLeft;
					if ( wParentLine ) wClickRect.left -= wParentLine.width;
				}

				// 移動先設定
				wMovePos.x = wClickRect.left;

				break;
			}

			var wOverflow = false;
			var wCheckParam = {
				  targetRect : wTargetBef
			};

			// グループ
			if ( this.isItemGroup(wTargetKd) ) {
				// 移動先に他項目あれば無効
				if ( !this.chkItemOverlapToPoint(pTargetItm, wCheckParam) ) {
					this.alertMouseCmt( 'overlap' );
					return false;
				
				}
				
				// 範囲内の中継点を一時的に所属
				this.setAreaRelationCmt( pTargetItm );

			// 項目
			} else if ( this.isItemPerson(wTargetKd) ) {
				// 移動先に他項目あれば無効
				wCheckParam.overlap = false;
				if ( !this.chkItemOverlapToPoint(pTargetItm, wCheckParam) ) {
					this.alertMouseCmt( 'overlap' );
					return false;
				}

				// 範囲外チェック
				// 親がグループ
				if ( wParentItem ) {
					if ( !wParentItem.chkBoxInRect(wTargetBef) ) {
						this.alertMouseCmt( 'overflow-group' );
						return false;
					}

				// 親がキャンバス
				} else {
					var wParentRect = pTargetItm.getParentRect();
					var wParentSize = pTargetItm.getParentSize( { overflow: true } );
					var wParentScrl = pTargetItm.getParentScroll();

					// メイン画面のスクロール調整
					wParentRect.top		-= wParentScrl.y;
					wParentRect.left	-= wParentScrl.x;

					wParentRect.bottom	= wParentRect.top  + wParentSize.height;
					wParentRect.right	= wParentRect.left + wParentSize.width;

					if ( !this.chkInRect(wParentRect, wTargetBef) ) {
						this.alertMouseCmt( 'overflow' );
						return false;
					}

				}
				
				// 親項目からはみ出して表示あり
				wOverflow = true;

			// 中継点の場合
			} else if ( this.isItemRelation(wTargetKd) ) {
				// 中継点移動
				pTargetItm.setLinePointPos( wMovePos );

			}

			// 項目移動
			pTargetItm.setBoxPos( wMovePos, { overflow: wOverflow } );

			// グループ
			if ( this.isItemGroup(wTargetKd) ) {
				// 中継点の所属解除
				this.execFunction( this.freeAreaRelationCmt );
			
			}
			
			return true;

		} catch(e) {
			throw { name: 'positionItemConfirm.' + e.name, message: e.message };
		}
	};

	// 移動先が中継点の場合の位置補正値
	clsContentsBox.prototype.getPositionRelMove = function( pParam ) {
		try {
			var wRelationPos = 0;

			// 中継点の場合
			if ( this.isItemRelation(pParam.targetKd) ) {
				// クリック項目の中心に合わせる
				if ( pParam.clickSize > 2 ) {
					wRelationPos += Math.floor(pParam.clickSize / 2);
					if ( (pParam.clickSize % 2) == 0 ) wRelationPos++;
				}

				// 中継点以外をクリック
				if ( !this.isItemRelation(pParam.clickKd) ) {
					// ライン幅加算
					wRelationPos += pParam.targetLine;
				}

			// クリック項目が中継点の場合
			} else if ( this.isItemRelation(pParam.clickKd) ) {
				// 中心同士を合わせる
				if ( pParam.clickSize > 2 ) {
					wRelationPos += Math.floor(pParam.clickSize / 2);
					if ( (pParam.clickSize % 2) == 0 ) wRelationPos--;
				}
				if ( pParam.targetSize > 2 ) wRelationPos -= Math.floor(pParam.targetSize / 2);

			}
			
			return wRelationPos;

		} catch(e) {
			throw { name: 'getPositionRelMove.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作 - 選択
	// **************************************************************

	// 選択状態設定
	clsContentsBox.prototype.setSelectState = function( pSelectItm, pParam ) {
		try {
			var wRetVal = false;
			var wSelected = false;
			var wRelation = false;

			if ( typeof pParam == 'boolean' ) {
				wSelected = pParam

			} else {
				wSelected = pParam.selected;
				wRelation = pParam.relation;
			}

			if ( wSelected ) {
				// 項目を選択状態
				if ( wRelation ) {
					wRetVal = pSelectItm.selectItemRel( wSelected );
					
				} else {
					wRetVal = pSelectItm.selectItem( wSelected );
				
				}

			} else {
				// 選択解除
				wRetVal = pSelectItm.selectItemFree();

			}

			// 選択状態変更時
			if ( wRetVal ) {
				// 項目変更通知（項目選択）
				this.execLinkCallback( { kind: 'select', selected: wSelected }, pSelectItm );
			
			}
			
			return wRetVal;

		} catch(e) {
			throw { name: 'setSelectState.' + e.name, message: e.message };
		}
	};

	// 項目と関連項目の強調表示（特定項目以外を目立たなくする）
	clsContentsBox.prototype.emphasisSelectItem = function( pSelectedItms, pSelected, pEmphaRev ) {
		try {
			// 未選択Class設定
			function setNoEmphasisClass( pTargetList, pSelectList ) {
				try {
					var wTarget;

					for( var wKey in pTargetList ) {
						// 一旦選択用Class削除
						pTargetList[wKey].delBoxClass( 'cssItem-emphasis' );
						pTargetList[wKey].delBoxClass( 'cssItem-non-emphasis' );

						// 選択時のみClass再設定
						if ( !pSelected ) continue;

						// 選択項目のみ強調
						if ( !pEmphaRev ) {
							wTarget = !(wKey in pSelectList)
						
						// 選択項目以外を強調
						} else {
							wTarget = (wKey in pSelectList)

						}
							
						// ターゲット
						if ( wTarget ) {
							// 目立たなくするClass追加
							pTargetList[wKey].setBoxClass( 'cssItem-non-emphasis' );
							
						// ターゲット以外
						} else if ( pSelected ) {
							// 強調class追加
							pTargetList[wKey].setBoxClass( 'cssItem-emphasis' );

						}
					}

				} catch(e) {
					throw { name: 'setNonSelectClass', message: e.message };
				}
			};
			
			// 未選択Class設定
			setNoEmphasisClass( this._ContentsItems.person,		pSelectedItms );
			setNoEmphasisClass( this._ContentsItems.group,		pSelectedItms );
			setNoEmphasisClass( this._ContentsItems.relation,	pSelectedItms );
			setNoEmphasisClass( this._ContentsItems.freeline,	pSelectedItms );

		} catch(e) {
			throw { name: 'emphasisSelectItem.' + e.name, message: e.message };
		}
	};

	// 中継点の親の選択状態設定
	clsContentsBox.prototype.setSelectRelationMaster = function( pRelItm, pParam, pSelectedList ) {
		try {
			// 自身が中継点の場合のみ
			if ( !pRelItm.isRelation() ) return;

			// 親の選択状態設定
			var wParentItm = this.getContentsItem( pRelItm.getMasterParent() );
			if ( wParentItm ) {
				// 未設定なら処理
				var wParentId = wParentItm.getBoxId();
				if ( !(wParentId in pSelectedList) ) {
					// ※再帰による選択状態設定
					this.setSelectItemState( wParentItm, pParam, pSelectedList );
				}
			}

			// 関連先項目選択状態設定
			var wTargetItm = this.getContentsItem( pRelItm.getMasterTarget() );
			if ( wTargetItm ) {
				// 未設定なら処理
				var wTargetId = wTargetItm.getBoxId();
				if ( !(wTargetId in pSelectedList) ) {
					// ※再帰による選択状態設定
					this.setSelectItemState( wTargetItm, pParam, pSelectedList );
				}
			}

		} catch(e) {
			throw { name: 'setSelectRelationMaster.' + e.name, message: e.message };
		}
	};

	// 関連項目の選択状態設定
	clsContentsBox.prototype.setSelectRelationItem = function( pSelectItm, pParam, pSelectedList ) {
		try {
			// 関連項目を選択状態
			var wRelationList = pSelectItm.getRelationList();
			if ( !wRelationList ) return;

			// パラメータ設定
			if ( !pParam ) return;
			var wSelected = pParam.selected;
			var wRelayFlg = pParam.relay;
			var wBeyond   = pParam.beyond;

			var wParam;
			var wRelItm;
			var wRelayItm;
			for ( var wId in wRelationList ) {
				// 対象のパラメータから項目取得
				wParam = wRelationList[wId];
				if ( !wParam ) continue;

				wRelItm = this.getContentsItem( wId, wParam.kind );
				if ( !wRelItm ) continue;

				// 関連項目の選択状態設定
				// ※再帰による選択状態設定
				this.setSelectItemState( wRelItm, pParam, pSelectedList );

				// 中継点対象　または　中継点先も対象
				if ( !wRelayFlg && !wBeyond ) continue;

				// 中継点処理
				if ( !wParam.relationInf ) continue;

				wRelayItm = this._ContentsItems.relation[wParam.relationInf.getBoxId()];
				if ( !wRelayItm ) continue;

				// 中継点選択状態設定
				// ※再帰による選択状態設定
				this.setSelectItemState( wRelayItm, pParam, pSelectedList );
			}

		} catch(e) {
			throw { name: 'setSelectRelationItem.' + e.name, message: e.message };
		}
	};

	// 関連項目の選択状態設定
	clsContentsBox.prototype.setSelectItemState = function( pSelectItem, pParam, pSelectedList ) {
		try {
			var wSelectId = pSelectItem.getBoxId();

			// 設定済なら処理なし
			if ( wSelectId in pSelectedList ) return;

			// 選択状態設定
			var wSelected = pParam.selected;
			var wRelation = pParam.relation;

			this.setSelectState( pSelectItem, { selected: wSelected, relation: wRelation } );
			pSelectedList[wSelectId] = 1;

			var wIsRelation		= pSelectItem.isRelation();
			var wSetRelation	= false;
			var wSetMaster		= false;

			// 主項目の場合
			if ( !wRelation ) {
				// 選択項目のみの場合は処理終了
				if ( pParam.only ) return;

				// 関連項目の選択状態設定　有効
				wSetRelation = true;

				// 中継点対象時
				if ( pParam.relay ) {
					// 中継点の場合は親の状態設定
					if ( wIsRelation ) wSetMaster = true;
				}

				// 1項目目以降は関連項目
				pParam.relation = true;

			// 関連項目
			} else {
				// 中継点以外は処理終了
				if ( !wIsRelation ) return;

				// 中継点の先も対象
				if ( pParam.beyond ) {
					// 関連項目の選択状態設定　有効
					wSetRelation = true;

					// 親の状態設定
					wSetMaster = true;
				}

			}

			// 中継点の親の状態設定
			if ( wSetMaster ) {
				// ※再帰による選択状態設定
				this.setSelectRelationMaster( pSelectItem, pParam, pSelectedList );
			}

			// 関連項目の選択状態設定
			if ( wSetRelation ) {
				// ※再帰による選択状態設定
				this.setSelectRelationItem( pSelectItem, pParam, pSelectedList );
			}

		} catch(e) {
			throw { name: 'setSelectItemState.' + e.name, message: e.message };
		}
	};

	// 項目と関連項目の選択状態設定
	clsContentsBox.prototype.setSelectItem = function( pSelectItm, pParam ) {
		try {
			// パラメータ設定
			var wStatPram = {};

			if ( typeof pParam == 'boolean' ) {
				wStatPram.selected = pParam

			} else {
				for( var wKey in pParam ) {
					wStatPram[wKey] = pParam[wKey];
				}

			}

			// 選択項目リスト
			var wSelectedItms = {}

			// 項目を選択状態
			this.setSelectItemState( pSelectItm, pParam, wSelectedItms );

			// 項目選択
			if ( wStatPram.selected ) {
				// 選択項目保存
				this._ContentsSelectInf.item = pSelectItm;

			// 選択解除
			} else {
				// 選択項目クリア
				this._ContentsSelectInf.item = null;
			
			}

			if ( wStatPram.emphasis ) {
				// 項目を目立たなくする
				this.emphasisSelectItem( wSelectedItms, wStatPram.selected, wStatPram.emphasisRev );

				// 対象項目の関連のみライン描画
				this.drawRelationRedo( { select: pSelectItm } );
			}

		} catch(e) {
			throw { name: 'setSelectItem.' + e.name, message: e.message };
		}
	};

	// 項目選択解除
	clsContentsBox.prototype.resetSelectItem = function( ) {
		try {
			var self = this;

			// 全項目選択解除
			function resetSelect( pItemList ) {
				if ( !pItemList ) return;

				for( var wKey in pItemList ) {
					// 選択解除
					self.setSelectState( pItemList[wKey], false );
					
					// 選択用Class削除
					pItemList[wKey].delBoxClass( 'cssItem-emphasis' );
					pItemList[wKey].delBoxClass( 'cssItem-non-emphasis' );
					
				}
			};
			
			resetSelect( this._ContentsItems.person );
			resetSelect( this._ContentsItems.group );
			resetSelect( this._ContentsItems.relation );
			resetSelect( this._ContentsItems.comment );
			resetSelect( this._ContentsItems.freeline );

			// 選択項目クリア
			this._ContentsSelectInf.item = null;

		} catch(e) {
			throw { name: 'resetSelectItem', message: e.message };
		}
	};

	// 項目と関連項目の選択状態を全て解除
	clsContentsBox.prototype.resetSelectAll = function() {
		try {
			var self = this;

			function freeSelect( pList ) {
				try {
					var wSelected;

					for( var wKey in pList ) {
						if ( pList.hasOwnProperty(wKey) ) {
							// 選択解除
							if ( pList[wKey].selectItemIs() ) {
								pList[wKey].selectItem(false);
								wSelected = true;
							
							} else if ( pList[wKey].selectItemRelIs() ) {
								pList[wKey].selectItemRel( false );
								wSelected = true;

							} else {
								wSelected = false;

							}
							
							// 選択解除時は変更通知
							if ( wSelected ) {
								self.execLinkCallback( { kind: 'select', selected: false }, pList[wKey] );

							}
						}
					}

				} catch(e) {
					throw { name: 'freeSelect.' + e.name, message: e.message };
				}
			};

			freeSelect( this._ContentsItems.person );
			freeSelect( this._ContentsItems.group );
			freeSelect( this._ContentsItems.relation );
			freeSelect( this._ContentsItems.comment );
			freeSelect( this._ContentsItems.freeline );

		} catch(e) {
			throw { name: 'resetSelectAll.' + e.name, message: e.message };
		}
	};

	// クリックした項目を選択状態
	clsContentsBox.prototype.selectClickItem = function( pClickItem ) {
		try {
			// 選択中の項目クリック時
			var wResetFlg = false;
			if ( this._ContentsSelectInf.item ) {
				var wSelId = this._ContentsSelectInf.item.getBoxId();

				if ( pClickItem ) {
					var wClickId = pClickItem.getBoxId();
					if ( wSelId == wClickId ) wResetFlg = true;
				}
			}

			// 選択解除
			this.execFunction( this.resetSelectItem );

			// リセット時以外
			if ( !wResetFlg ) {
				// 項目を選択状態
				this.setSelectItem( pClickItem, { selected: true, beyond: true } );

			}

		} catch(e) {
			throw { name: 'selectClickItem.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目操作
	// **************************************************************

	// 項目が人物かどうか
	clsContentsBox.prototype.isItemPerson = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-person' );

		} catch(e) {
			throw { name: 'isItemPerson', message: e.message };
		}
	};

	// 項目がグループかどうか
	clsContentsBox.prototype.isItemGroup = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-group' );

		} catch(e) {
			throw { name: 'isItemGroup', message: e.message };
		}
	};

	// 項目がコメントかどうか
	clsContentsBox.prototype.isItemComment = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-comment' );

		} catch(e) {
			throw { name: 'isItemComment', message: e.message };
		}
	};

	// 項目が関連付け中継点かどうか
	clsContentsBox.prototype.isItemRelation = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-relation' );

		} catch(e) {
			throw { name: 'isItemRelation', message: e.message };
		}
	};

	// 項目がフリーラインかどうか
	clsContentsBox.prototype.isItemFreeLine = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-freeline' );

		} catch(e) {
			throw { name: 'isItemFreeLine', message: e.message };
		}
	};

	// 主項目取得
	clsContentsBox.prototype.getItemMainPerson = function( ) {
		try {
			if ( !this._ContentsItems.person ) return null;

			var wMainItem = null;

			var wItem;
			for( var wId in this._ContentsItems.person ) {
				if ( this._ContentsItems.person[wId].isKeyPerson() ) {
					wMainItem = this._ContentsItems.person[wId];
					break;
				}
			}
			
			return wMainItem;

		} catch(e) {
			throw { name: 'getItemMainPerson', message: e.message };
		}
	};

	// 子要素に削除不可項目があるかチェック
	clsContentsBox.prototype.chkNoDeleteChiledItem = function( pChkId, pChildList ) {
		try {
			var wFind = false;

			var wParentId;
			for( var wKey in pChildList ) {
				// 親IDが一致
				wParentId = pChildList[wKey].getParentId();
				if ( wParentId !== pChkId ) continue;

				// 削除不可チェック
				if ( !pChildList[wKey].getItemDelIs() ) {
					wFind = true;
					break;
				}
			}
			
			return wFind;

		} catch(e) {
			throw { name: 'chkNoDeleteChiledItem', message: e.message };
		}
	};

	// 項目追加　共通メニュー取得
	clsContentsBox.prototype.getItemPublicMenu = function( pItemKind ) {
		try {
			var wPublicMenu = {};
			if ( this._ContentsPublicMenu ) {
				if ( this._ContentsPublicMenu.common ) {
					wPublicMenu.color		= this._ContentsPublicMenu.common.color;
					wPublicMenu.position	= this._ContentsPublicMenu.common.position;
				}

				// 人物
				if ( this.isItemPerson(pItemKind) ) {
					if ( this._ContentsPublicMenu.person ) {
						wPublicMenu.context		= this._ContentsPublicMenu.person.context;
						wPublicMenu.status		= this._ContentsPublicMenu.person.statBase;
						wPublicMenu.contact		= this._ContentsPublicMenu.person.contact;

						wPublicMenu.listStat	= this._ContentsPublicMenu.person.listStat;
						wPublicMenu.relation	= this._ContentsPublicMenu.person.relation;
						wPublicMenu.icon		= this._ContentsPublicMenu.person.icon;
						
						if ( this._ContentsPublicMenu.person.position ) wPublicMenu.position = this._ContentsPublicMenu.person.position;
					}

				// グループ
				} else if ( this.isItemGroup(pItemKind) ) {
					if ( this._ContentsPublicMenu.group ) {
						wPublicMenu.context		= this._ContentsPublicMenu.group.context;
						wPublicMenu.status		= this._ContentsPublicMenu.group.statBase;
						wPublicMenu.contact		= this._ContentsPublicMenu.group.contact;

						wPublicMenu.listStat	= this._ContentsPublicMenu.group.listStat;
						wPublicMenu.relation	= this._ContentsPublicMenu.group.relation;

						if ( this._ContentsPublicMenu.group.position ) wPublicMenu.position = this._ContentsPublicMenu.group.position;
					}

				// コメント
				} else if ( this.isItemComment(pItemKind) ) {
					if ( this._ContentsPublicMenu.comment ) {
						wPublicMenu.context		= this._ContentsPublicMenu.comment.context;
						wPublicMenu.status		= this._ContentsPublicMenu.comment.statBase;
						wPublicMenu.contact		= false;

						wPublicMenu.listSize	= this._ContentsPublicMenu.comment.listSize;

						if ( this._ContentsPublicMenu.comment.position ) wPublicMenu.position = this._ContentsPublicMenu.comment.position;
					}

				// 関連付け中継点
				} else if ( this.isItemRelation(pItemKind) ) {
					if ( this._ContentsPublicMenu.relation ) {
						wPublicMenu.context		= this._ContentsPublicMenu.relation.context;
						wPublicMenu.status		= false;
						wPublicMenu.contact		= false;

						wPublicMenu.relation	= this._ContentsPublicMenu.relation.relation;

						if ( this._ContentsPublicMenu.relation.position ) wPublicMenu.position = this._ContentsPublicMenu.relation.position;
					}

				// フリーライン
				} else if ( this.isItemFreeLine(pItemKind) ) {
					if ( this._ContentsPublicMenu.freeline ) {
						wPublicMenu.context		= this._ContentsPublicMenu.freeline.context;
						wPublicMenu.status		= false;
						wPublicMenu.contact		= false;

						wPublicMenu.listStat	= false;
						wPublicMenu.relation	= false;

						if ( this._ContentsPublicMenu.freeline.position ) wPublicMenu.position = this._ContentsPublicMenu.freeline.position;
					}

				}
			}
			
			return wPublicMenu;

		} catch(e) {
			throw { name: 'getItemPublicMenu', message: e.message };
		}
	};

	// 項目追加
	clsContentsBox.prototype.addItem = function( pEvent, pItemKind, pLoadData ) {
		try {
			// 項目ドラッグ可否
			// ※起動時パラメータから取得
			var wItemDrag		= this.getSettingItemDrag( pItemKind );

			// 追加項目パラメータ
			var wAddParam = {
				  window		: this.getBoxWindow()
				, parent		: this._ContentsEleMain
				, locked		: this._ContentsLocked
				, loadData		: pLoadData
			};

			// 項目操作プロパティ設定
			this.copyProperty( wItemDrag, wAddParam );

			// 初期値指定時
			var wPoint		= { x: 0, y: 0 };
			if ( pEvent ) {
				wPoint = this.getEventPos( pEvent );

				// 項目パラメータ指定時
				for( var wParaKey in pEvent ) {
					if ( !pEvent.hasOwnProperty(wParaKey) ) continue;
					wAddParam[wParaKey] = pEvent[wParaKey];
				}
			}
			var wBasePos = this.getBoxPos();

			wPoint.x -= wBasePos.left;
			if ( wPoint.x < 0 ) wPoint.x = 0;
			wPoint.y -= wBasePos.top;
			if ( wPoint.y < 0 ) wPoint.y = 0;

			// メイン画面のスクロール値加算
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wPoint.x	+= wMainScroll.x;
			wPoint.y	+= wMainScroll.y;

			// プロパティ（位置など）設定
			wAddParam.property = { left: wPoint.x + 'px', top: wPoint.y + 'px' };

			// 共通メニュー継承設定
			wAddParam.publicMenu = this.getItemPublicMenu( pItemKind );
			var wAddItem = null;

			// 人物
			if ( this.isItemPerson(pItemKind) ) {
				// 設定変更時callback
				wAddParam.callback = this.eventItemPersonChange;

				// 項目追加
				wAddItem = new clsItemPerson( wAddParam );

			// グループ
			} else if ( this.isItemGroup(pItemKind) ) {
				// 設定変更時callback
				wAddParam.callback = this.eventItemGroupChange;

				// 項目追加
				wAddItem = new clsItemGroup( wAddParam );

			// コメント
			} else if ( this.isItemComment(pItemKind) ) {
				// 設定変更時callback
				wAddParam.callback = this.eventItemCommentChange;

				// 項目追加
				wAddItem = new clsItemComment( wAddParam );

			// 関連付け中継点
			} else if ( this.isItemRelation(pItemKind) ) {
				// 設定変更時callback
				wAddParam.callback = this.eventItemRelationChange;

				// 項目追加
				wAddItem = new clsItemRelation( wAddParam );

			// 関連付け中継点
			} else if ( this.isItemFreeLine(pItemKind) ) {
				// 設定変更時callback
				wAddParam.callback = this.eventItemFreeLineChange;

				// 項目追加
				wAddItem = new clsItemFreeLine( wAddParam );

			}

			return wAddItem;

		} catch(e) {
			throw { name: 'addItem.' + e.name, message: e.message };
		}
	};

	// 項目追加／削除通知用Callback取得
	clsContentsBox.prototype.getItemChangeFunc = function( pItem, pFuncName ) {
		try {
			// callback取得
			// ※項目個別のcallback優先
			var wCallFunc = pItem.loadArgument(pFuncName);

			// 項目ごとのcallbackなければ標準callback
			if ( !wCallFunc ) {
				// 主項目時
				var wKeyFlag = false;
				if ( typeof pItem.isKeyPerson == 'function' ) wKeyFlag = pItem.isKeyPerson();

				if ( wKeyFlag ) {
					// 主項目用callbackあれば優先
					var wKeyPerson = this.loadArgument('keyperson');
					if ( pFuncName in wKeyPerson ) wCallFunc = wKeyPerson[pFuncName];
				}

				// 標準callback
				if ( !wCallFunc ) wCallFunc = this.loadArgument(pFuncName);
			}
			
			return wCallFunc;

		} catch(e) {
			throw { name: 'getItemChangeFunc', message: e.message };
		}
	};

	// 項目追加を通知
	clsContentsBox.prototype.execItemAddFunc = function( pAddItem ) {
		try {
			if ( !pAddItem ) return;
			
			// 項目追加時callback取得
			var wAddFunc = this.getItemChangeFunc( pAddItem, 'addfunc' );
			if ( !wAddFunc ) return;

			// パラメータ設定
			var wCallbackParam = {};

			wCallbackParam.item = pAddItem;

			// 登録されている処理を実行
			var wArguments = [];
			wArguments.push( wCallbackParam );

			wAddFunc.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execItemAddFunc.' + e.name, message: e.message };
		}
	};

	// 項目追加　開始
	clsContentsBox.prototype.addItemStart = function( pEvent, pItemKind ) {
		try {
			// 項目追加
			var wAddItem = this.addItem( pEvent, pItemKind );
			if ( !wAddItem ) return false;

			try {
				// 項目移動開始
				this.moveItemStart( pEvent, wAddItem, 'add' );

			} catch(me) {
				// 追加項目削除して例外をthrow
				if ( wAddItem ) wAddItem.freeClass();
				throw { name: me.name, message: me.message };

			}
			return true;

		} catch(e) {
			throw { name: 'addItemStart.' + e.name, message: e.message };
		}
	};

	// 項目を項目リストから削除
	clsContentsBox.prototype.delItemFromList = function( pId, pTargetList ) {
		try {
			var wDelItm = pTargetList[pId];
			if ( !wDelItm ) return false;

			// 項目削除を通知
			this.execFunction( this.execItemDelFunc, wDelItm );

			// 項目を削除
			pTargetList[pId].freeClass();
			pTargetList[pId] = null;

			delete pTargetList[pId];

		} catch(e) {
			throw { name: 'delItemFromList', message: e.message };
		}
	};

	// 項目削除
	clsContentsBox.prototype.delItem = function( pId, pTargetList, pRelationDel ) {
		try {
			var wRedrawFlg = false;

			var wDelItm = pTargetList[pId];
			if ( !wDelItm ) return false;

			// フリーラインの場合
			if ( wDelItm.isFreeLine() ) {
				// 接続点削除
				if ( pRelationDel ) {
					wRedrawFlg = this.delFreeLineAll( pId );
				
				} else {
					wRedrawFlg = this.delFreeLinePoint( pId );
				
				}

			} else {
				// 全関係を削除
				wRedrawFlg = this.liftRelationAll( wDelItm );

			}

			// リストから項目削除
			this.delItemFromList( pId, pTargetList );

			return wRedrawFlg;

		} catch(e) {
			throw { name: 'delItem.' + e.name, message: e.message };
		}
	};

	// 子項目削除
	clsContentsBox.prototype.delItemChild = function( pId, pTargetList ) {
		try {
			if ( !pTargetList ) return false;

			var wRelationDel = false;

			var wParentId;
			for( var wKey in pTargetList ) {
				if ( pTargetList.hasOwnProperty(wKey) ) {
					// 親IDが一致すれば削除
					wParentId = pTargetList[wKey].getParentId();
					if ( wParentId !== pId ) continue;

					// 項目削除
					if ( this.delItem(wKey, pTargetList) ) wRelationDel = true;
				}
			}

			// 項目関係を削除したかを返す
			return wRelationDel;

		} catch(e) {
			throw { name: 'delItemChild.' + e.name, message: e.message };
		}
	};

	// 項目削除
	clsContentsBox.prototype.delItemParent = function( pDelItem, pTargetList, pRelationDel ) {
		try {
			if ( !pDelItem ) return false;

			var wItemId = pDelItem.getBoxId();
			var wItemKd = pDelItem.getBoxKind();

			// グループ削除
			if ( this.isItemGroup(wItemKd) ) {
				// 所属項目に削除不可項目があるかチェック
				if ( this.chkNoDeleteChiledItem(wItemId, this._ContentsItems.person) ) {
					alert( '削除できない項目が所属しているため、削除できません。' );
					return false;
				}
			}

			// 削除確認
			if ( !confirm('項目を削除します。よろしいですか？') ) return;

			var wRelationDel = false;

			// グループ
			if ( this.isItemGroup(wItemKd) ) {
				// 子項目（人物）削除
				wRelationDel = this.delItemChild(wItemId, this._ContentsItems.person);

			// 以外
			} else {
				// 子項目なし

			}

			// 自身を削除
			if ( this.delItem(wItemId, pTargetList, pRelationDel) ) wRelationDel = true;

			// 項目関係を削除したかを返す
			return wRelationDel;

		} catch(e) {
			throw { name: 'delItemParent.' + e.name, message: e.message };
		}
	};

	// 項目削除を通知
	clsContentsBox.prototype.execItemDelFunc = function( pDelItem ) {
		try {
			if ( !pDelItem ) return;
			
			// 項目追加時callback取得
			var wDelFunc = this.getItemChangeFunc( pDelItem, 'delfunc' );
			if ( !wDelFunc ) return;

			// パラメータ設定
			var wCallbackParam = {};

			wCallbackParam.item = pDelItem;

			// 登録されている処理を実行
			var wArguments = [];
			wArguments.push( wCallbackParam );

			wDelFunc.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execItemDelFunc.' + e.name, message: e.message };
		}
	};

	// 項目追加パラメータ取得
	clsContentsBox.prototype.getItemParamByValue = function( pParamVal ) {
		try {
			var wRetParam = {};

			if ( 'pos' in pParamVal ) {
				if ( 'x' in pParamVal.pos ) wRetParam.x = pParamVal.pos.x;
				if ( 'y' in pParamVal.pos ) wRetParam.y = pParamVal.pos.y;
			}

			// 初期値（ステータス）
			if ( 'default' in pParamVal ) {
				wRetParam.default = pParamVal.default;
			}
			
			// 項目更新時コメント
			if ( 'comment' in pParamVal ) wRetParam.comment = pParamVal.comment;
			if ( 'confirm' in pParamVal ) wRetParam.confirm = pParamVal.confirm;

			// その他パラメータ
			var wOthParam = pParamVal.other;
			if ( wOthParam ) {
				// その他パラメータはそのままパラメータとする
				for( var wOthKey in wOthParam ) {
					wRetParam[wOthKey] = wOthParam[wOthKey];
				}
			}
			
			return wRetParam;

		} catch(e) {
			throw { name: 'getItemParamByValue.' + e.name, message: e.message };
		}
	};

	// 項目新規追加（値指定あり）
	clsContentsBox.prototype.addItemByValue = function( pAddParam, pItemKind ) {
		try {
			// 項目追加パラメータ取得
			var wParam = this.getItemParamByValue( pAddParam );

			// 追加方式設定
			var wMode		= '';
			if ( pAddParam ) {
				if ( 'mode' in pAddParam ) wMode = pAddParam.mode;
			}

			// 主コンテンツの中心取得
			if ( !('x' in wParam) || !('y' in wParam) ) {
				var wContentsSize = this.getBoxSize();
				var wContentsPos  = this.getBoxPos();

				if ( wContentsSize.width  ) wContentsSize.width  = Math.floor( wContentsSize.width  / 2 );
				if ( wContentsSize.height ) wContentsSize.height = Math.floor( wContentsSize.height / 2 );

				if ( !('x' in wParam) ) wParam.x = wContentsSize.width + wContentsPos.left - 32;
				if ( !('y' in wParam) ) wParam.y = wContentsSize.height - 32;

				if ( wParam.x < 0 ) wParam.x = 0;
				if ( wParam.y < 0 ) wParam.y = 0;
			}

			// 選択解除
			this.execFunction( this.resetSelectItem );

			// 位置固定時
			if ( wMode == 'fixed' ) {
				// 主項目を即時追加
				var wAddItem = this.addItem( wParam, pItemKind );
				if ( !wAddItem ) return false;

				this._ContentsItems.person[wAddItem.getBoxId()] = wAddItem;

				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, wAddItem );

				// 項目表示
				wAddItem.dspBox( true );

				// 項目変更通知
				wParam.kind = 'add';
				this.execLinkCallback( wParam, wAddItem );

				return true;
			}
			// 選択
			else if ( wMode == 'select' ) {
				// 主項目選択開始
				this.updItemStart( wParam, pItemKind );

			}
			// 位置指定（追加）
			else {
				// 主項目追加開始
				this.addItemStart( wParam, pItemKind );

				return false;
			}

		} catch(e) {
			throw { name: 'addItemByValue.' + e.name, message: e.message };
		}
	};

	// 項目追加／更新（人物）
	clsContentsBox.prototype.addPersonByValue = function( pAddParam ) {
		try {
			var wResult = false;

			// 主項目更新チェック
			var wKeyPerson = false;

			if ( 'other' in pAddParam ) {
				if ( 'keyperson' in pAddParam.other ) wKeyPerson = pAddParam.other.keyperson;
			}

			var wUpdate = false;
			var wUpdItm = null;

			if ( wKeyPerson ) {
				// 既に登録済の場合
				wUpdItm = this.getItemMainPerson();
				if ( wUpdItm ) wUpdate = true;
			}

			if ( wUpdate ) {
				// 項目追加パラメータ取得
				var wUpdParam = this.getItemParamByValue( pAddParam );

				// 更新パラメータなければ処理なし
				if ( !('default' in wUpdParam) ) return false;

				// ステータスを更新
				wUpdItm.updStatusValue( wUpdParam );

				// 項目変更通知
				this.execLinkCallback( { kind: 'status' }, wUpdItm );

			// 未登録時
			} else {
				// 項目を新規追加
				wResult = this.addItemByValue( pAddParam, 'item-person' );

			}

			return wResult;

		} catch(e) {
			throw { name: 'addPersonByValue.' + e.name, message: e.message };
		}
	};

	// 項目追加（グループ）
	clsContentsBox.prototype.addGroupByValue = function( pAddParam ) {
		try {
			// グループを新規追加
			var wResult = this.addItemByValue( pAddParam, 'item-group' );

			return wResult;

		} catch(e) {
			throw { name: 'addGroupByValue.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// コメント
	// **************************************************************

	// コメント追加　開始
	clsContentsBox.prototype.addItemComment = function( pEvent ) {
		try {
			// 操作開始時のイベント優先
			var wEvent = this._ContentsContextEvent;
			if ( !wEvent ) wEvent = pEvent;

			// コメント追加
			var wCommentItem = this.addItem( wEvent, 'item-comment' );
			if ( !wCommentItem ) return false;

			// 追加コメント保存
			this._ContentsCommentInf.item = wCommentItem;

			// コメント設定画面表示
			wCommentItem.dspStatusMenu( pEvent, this.eventItemCommentAdd );

		} catch(e) {
			// コメント追加キャンセル
			this.execFunction( this.cancelAddItemComment );
			throw { name: 'addItemComment.' + e.name, message: e.message };
		}
	};

	// コメント追加時（内容設定後）にCallされる
	clsContentsBox.prototype.execAddItemComment = function( pEvent, pParam ) {
		try {
			var wAddComment = this._ContentsCommentInf.item;
			if ( !wAddComment ) return true;

			// 項目規定のステータス変更処理実行
			var wStatusSet = false;
			if ( pParam ) {
				pParam.notCallback = true;
				wStatusSet = wAddComment.eventStatusUpdate( pEvent, pParam );

			}

			// コメント決定
			if ( wStatusSet ) {
				// 追加項目を保存
				var wItemId = wAddComment.getBoxId();
				this._ContentsItems.comment[wItemId] = wAddComment;

				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, wAddComment );

				// 項目表示
				wAddComment.dspBox( true );

				// 追加完了
				this._ContentsCommentInf.item = null;

			}

			// コメント追加終了
			this.cancelAddItemComment();

			return true;

		} catch(e) {
			// コメント追加キャンセル
			this.execFunction( this.cancelAddItemComment );
			throw { name: 'execAddItemComment.' + e.name, message: e.message };
		}
		return true;
	};

	// コメント追加　キャンセル
	clsContentsBox.prototype.cancelAddItemComment = function( ) {
		try {
			// コメント削除
			if ( this._ContentsCommentInf.item ) {
				// イベントキャンセル
				this._ContentsCommentInf.item.eventClear();

				// 項目削除
				this._ContentsCommentInf.item.freeClass();
			}

			this._ContentsCommentInf.item = null;

		} catch(e) {
			throw { name: 'cancelAddItemComment.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// フリーライン
	// **************************************************************

	// フリーライン追加　開始
	clsContentsBox.prototype.addItemFreeLine = function( pEvent, pStartId ) {
		try {
			// 項目追加
			var wAddItem = this.addItem( pEvent, 'item-freeline' );
			if ( !wAddItem ) return false;

			try {
				// 移動開始
				this.freeLineStart( pEvent, wAddItem );

			} catch(me) {
				// 追加項目削除して例外をthrow
				if ( wAddItem ) wAddItem.freeClass();
				throw { name: me.name, message: me.message };

			}

			// フリーライン続き
			if ( typeof pStartId == 'string' ) {
				// 開始ポイント設定
				this._ContentsLineInf.start = pStartId;

				this.dspMouseCmt( pEvent, '終了位置を指定してください' );

			// フリーライン開始
			} else {
				// ベースメニュー無効化
				this.useContextCtrl( false );

				// イベント設定
				this.addFreeLineEvent();

				this.dspMouseCmt( pEvent, '開始位置を指定してください' );
			
			}

			return true;

		} catch(e) {
			// 移動キャンセルしてthrow
			this.execFunction( this.freeLineCancel );
			throw { name: 'addItemFreeLine.' + e.name, message: e.message };
		}
	};

	// フリーライン設定開始
	clsContentsBox.prototype.freeLineStart = function( pEvent, pFreeLine ) {
		try {
			// 項目のメニュー無効化
			pFreeLine.setContextAvailable( false );
			pFreeLine.setPositionAvailable( false );

			// 移動対象項目の設定
			this._ContentsLineInf.item = pFreeLine;

			// 位置補正　親の位置取得
			this._ContentsLineInf.pos = pFreeLine.getParentPos();

			var wEvtPos = this.getEventPos( pEvent );

			var wStPos = { x: wEvtPos.x, y: wEvtPos.y };
			wStPos.x -= this._ContentsLineInf.pos.left;
			wStPos.y -= this._ContentsLineInf.pos.top;

			// メイン画面のスクロール値加算
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wStPos.x += wMainScroll.x;
			wStPos.y += wMainScroll.y;

			// 最前面へ移動
			pFreeLine.dspBox( true, true, wStPos );

		} catch(e) {
			throw { name: 'freeLineStart.' + e.name, message: e.message };
		}
	};

	// フリーライン確定
	clsContentsBox.prototype.freeLineConfirm = function( pEvent, pLineItem ) {
		try {
			var wItemId = pLineItem.getBoxId();

			// 移動先のキャンバス範囲チェック
			if ( !this.chkItemOverflowArea(pLineItem) ) return false;

			// 開始点取得
			var wStItem = null;
			if ( this._ContentsLineInf.start ) {
				wStItem = this.getContentsItem( this._ContentsLineInf.start, 'item-freeline' );
			}

			// ポイント選択チェック
			var wChkTarget = {
					  person	: false
					, group		: false
					, relation	: false
					, freeline	: true
					, comment	: false
			};
			var wCheckId = '';
			var wChkItem = this.chkItemOverlapToClick( pEvent, wChkTarget );

			var wRedrawLine = false;
			if ( wChkItem ) {
				// 自項目チェック
				wCheckId = wChkItem.getBoxId();
				if ( wCheckId == wItemId ) return false;

				// 開始点指定時
				if ( !wStItem ) {
					// 選択ポイントを開始点とする
					wItemId  = wCheckId;
					wChkItem = null;
				
				// 開始点指定時
				} else if ( wCheckId == this._ContentsLineInf.start ) {
					// 処理なし（ライン終了）

				// 開始点の接続点指定時
				} else if ( wStItem.chkLinePoint(wCheckId) ) {
					// 処理なし（ライン終了）

				// 次点指定時
				} else {
					// 開始点と終点を接続
					wStItem.setLinePoint( wCheckId );
					wChkItem.setLinePoint( this._ContentsLineInf.start );

					// 終点のラインを継承
					var wLineParam = wChkItem.getLineStatus();

					// ライン設定
					wStItem.setLineStatus( wLineParam );

					// 開始点から確定点までのライン描画
					this.drawFreeLine( wStItem, wChkItem, wLineParam );
					
					// 関連ポイントのラインを全て変更
					this.updFreeLineStatus( wStItem );

					// ライン全て再描画
					wRedrawLine = true;

				}
				
				// 追加ポイント破棄
				pLineItem.freeClass();

			} else {
				// 次点指定時
				if ( wStItem ) {
					// 開始点と次点を接続
					wStItem.setLinePoint( wItemId );
					pLineItem.setLinePoint( this._ContentsLineInf.start );

					// 開始点のライン設定取得
					var wLineParam = wStItem.getLineStatus();

					// ライン設定
					pLineItem.setLineStatus( wLineParam );

					// 開始点から確定点までのライン描画
					this.drawFreeLine( wStItem, pLineItem, wLineParam );

				}

				// 最前面解除
				pLineItem.dspBox( true, false );

				// 追加項目を保存
				this._ContentsItems.freeline[wItemId] = pLineItem;
				// 項目追加を通知
				this.execFunction( this.execItemAddFunc, pLineItem );

			}

			// ポイント選択時は終了
			if ( wChkItem ) {
				// フリーライン終了
				this.execFunction( this.freeLineCancel );

				// ライン再描画
				if ( wRedrawLine ) this.drawRelationRedo();

			} else {
				// 次のポイント指定開始
				this.addItemFreeLine( pEvent, wItemId );

			}
			return true;

		} catch(e) {
			throw { name: 'freeLineConfirm.' + e.name, message: e.message };
		}
	};

	// フリーライン追加　キャンセル
	clsContentsBox.prototype.freeLineCancel = function( ) {
		try {
			// 追加中のみ処理
			if ( !this._ContentsLineInf.item ) return;

			// イベント停止
			// ※例外無視
			this.execFunction( this.delFreeLineEvent );
			
			// コメント非表示
			this.hideMouseCmt();

			// イベントキャンセル
			this._ContentsLineInf.item.eventClear();

			// 項目削除
			this._ContentsLineInf.item.freeClass();

			// 開始点設定時
			var wStartId = this._ContentsLineInf.start;
			if ( wStartId ) {
				// 開始点に接続点なければ削除
				var wFreeLineList = this.getBelongFreeLine();

				var wStartItm;
				if ( wFreeLineList ) wStartItm = wFreeLineList[wStartId];

				if ( wStartItm ) {
					if ( !wStartItm.getLinePoint() ) {
						// 接続点削除
						this.delItemFromList( wStartId, wFreeLineList );
					}
				}

			}

			this._ContentsLineInf.item		= null;
			this._ContentsLineInf.pos		= null;
			this._ContentsLineInf.start		= null;

			// ベースメニュー有効化
			this.useContextCtrl( true );
			
		} catch(e) {
			throw { name: 'cancelAddItemFreeLine.' + e.name, message: e.message };
		}
	};

	// フリーライン追加イベント設定
	clsContentsBox.prototype.addFreeLineEvent = function( pDragIs ) {
		try {
			// マウス追従
			this.addBoxEvents( 'onmousemove'	, this.eventFreeLineMove );

			// 項目確定
			this.addBoxEvents( 'onmousedown'	, this.eventFreeLineSet );

		} catch(e) {
			throw { name: 'addFreeLineEvent.' + e.name, message: e.message };
		}
	};

	// フリーライン追加イベント解除
	clsContentsBox.prototype.delFreeLineEvent = function() {
		try {
			// マウス追従
			this.delBoxEvents( 'onmousemove'	, this.eventFreeLineMove );

			// 項目確定
			this.delBoxEvents( 'onmousedown'	, this.eventFreeLineSet );

		} catch(e) {
			throw { name: 'delFreeLineEvent.' + e.name, message: e.message };
		}
	};

	// フリーライン描画
	clsContentsBox.prototype.drawFreeLineAll = function() {
		try {
			var self = this;

			if ( !this._ContentsItems.freeline ) return;

			var wChkList = {};

			var fncDrawFreeLine = function( pId ) {
				// 開始点取得
				var wStLine = self._ContentsItems.freeline[pId];

				// ライン設定取得
				var wLineParam = wStLine.getLineStatus();

				// 接続点取得
				var wPointList = wStLine.getLinePoint();
				if ( !wPointList ) return;

				var wEdLine;
				for( var wEdId in wPointList ) {
					// 処理済は処理なし
					if ( (pId + wEdId) in wChkList ) continue;
					if ( (wEdId + pId) in wChkList ) continue;

					if ( !(wEdId in self._ContentsItems.freeline) ) continue;
					wEdLine = self._ContentsItems.freeline[wEdId];

					// 開始点から確定点までのライン描画
					self.drawFreeLine( wStLine, wEdLine, wLineParam );

					wChkList[pId + wEdId]	= true;
					wChkList[wEdId + pId]	= true;
				}
			};

			// 全ポイントからのライン描画
			for( var wKey in this._ContentsItems.freeline ) {
				fncDrawFreeLine( wKey );
			}

		} catch(e) {
			throw { name: 'drawFreeLineAll.' + e.name, message: e.message };
		}
	};

	// フリーラインステータス更新
	clsContentsBox.prototype.updFreeLineStatus = function( pUpdItm ) {
		try {
			if ( !pUpdItm ) return false;

			// フリーラインリスト
			var wFreeLineList = this.getBelongFreeLine();
			if ( !wFreeLineList ) return false;

			// 更新起点
			var wUpdStatus	= pUpdItm.getLineStatus();

			// 接続点への接続点更新処理
			var wProcessedId = {};

			var fncUpdLineStatus = function( pItem, pStatus, pFirstPoint ) {
				var wId = pItem.getBoxId();

				// 接続点ステータス更新
				if ( !pFirstPoint ) pItem.setLineStatus( pStatus );
				wProcessedId[wId] = true;
				
				// ※再帰で接続点を処理
				var wNextPoint = pItem.getLinePoint();
				if ( !wNextPoint ) return;
				
				for( var wPointId in wNextPoint ) {
					// 未処理のみ処理
					if ( wPointId in wProcessedId ) continue;
					if ( !wFreeLineList[wPointId] ) continue;

					// 接続点への接続点処理
					fncUpdLineStatus( wFreeLineList[wPointId], pStatus );
				}
			};

			// 接続されている点のステータス全て更新
			// ※再帰で接続点を全て処理
			fncUpdLineStatus( pUpdItm, wUpdStatus, true );

		} catch(e) {
			throw { name: 'updFreeLineStatus.' + e.name, message: e.message };
		}
	};

	// フリーライン接続点削除
	clsContentsBox.prototype.delFreeLinePoint = function( pId ) {
		try {
			// フリーラインリスト
			var wFreeLineList = this.getBelongFreeLine();
			if ( !wFreeLineList ) return false;

			var wDelItm = wFreeLineList[pId];
			if ( !wDelItm ) return false;

			// 接続点取得
			var wPointList = wDelItm.getLinePoint();
			if ( !wPointList ) return false;

			// 接続点チェック
			var fncChkPoint = function( pChkItm, pDelId ) {
				// 接続点なければ対象
				var wChkList = pChkItm.getLinePoint();
				if ( !wChkList ) return true;

				// 削除対象以外の接続点あれば削除しない
				for( var wChkId in wChkList ) {
					if ( wChkId != pDelId ) return false;
				}
				
				return true;
			};

			// 接続点に他の接続なければ削除
			var wPointItm;

			for( var wPointId in wPointList ) {
				wPointItm = wFreeLineList[wPointId];
				if ( !wPointItm ) continue;

				// 削除対象チェック
				if ( fncChkPoint(wPointItm, pId) ) {
					// 接続点削除
					this.delItemFromList( wPointId, wFreeLineList );

				} else {
					// 削除ポイントへの接続解除
					wPointItm.delLinePoint( pId );

				}
			}

			return true;

		} catch(e) {
			throw { name: 'delFreeLinePoint.' + e.name, message: e.message };
		}
	};

	// フリーライン削除
	clsContentsBox.prototype.delFreeLineAll = function( pId ) {
		try {
			var self = this;

			// フリーラインリスト
			var wFreeLineList = this.getBelongFreeLine();
			if ( !wFreeLineList ) return false;

			// 接続点への接続点削除処理
			var wProcessedId = {};

			var fncDelFreeLine = function( pDelId ) {
				var wDelItm = wFreeLineList[pDelId];
				if ( !wDelItm ) return;

				// 削除済み設定
				wProcessedId[pDelId] = true;
				
				// ※再帰で接続点を処理
				var wNextPoint = wDelItm.getLinePoint();
				if ( wNextPoint ) {
					for( var wPointId in wNextPoint ) {
						// 未処理のみ処理
						if ( wPointId in wProcessedId ) continue;
						if ( !wFreeLineList[wPointId] ) continue;

						// 接続点への接続点処理
						fncDelFreeLine( wPointId );
					}
				}

				// 接続点削除
				self.delItemFromList( pDelId, wFreeLineList );
			};

			// 接続されている点のライン全て削除
			// ※再帰で接続点を全て処理
			fncDelFreeLine( pId );

			return true;

		} catch(e) {
			throw { name: 'delFreeLineAll.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// コンテンツ操作
	// **************************************************************

	// 項目初期化
	clsContentsBox.prototype.initContents = function() {
		try {
			// コメント全て削除
			for ( var wCmtId in this._ContentsItems.comment ) {
				this.delItem( wCmtId, this._ContentsItems.comment );
			}

			// 人物全て削除
			// ※グループの前に実施
			for ( var wItmId in this._ContentsItems.person ) {
				this.delItem( wItmId, this._ContentsItems.person );
			}

			// グループ全て削除
			for ( var wGrpId in this._ContentsItems.group ) {
				this.delItem( wGrpId, this._ContentsItems.group );
			}

			// 中継点全て削除
			for ( var wRelId in this._ContentsItems.relation ) {
				this.delItem( wRelId, this._ContentsItems.relation );
			}

			// フリーライン削除
			for ( var wLineId in this._ContentsItems.freeline ) {
				this.delItem( wLineId, this._ContentsItems.freeline );
			}

			// 関連情報再描画
			this.drawRelationRedo();

			// サイドパネル初期化
			// ※ 項目変更通知（項目同期）
			this.execLinkCallback( { kind: 'link' }, null );
			// ※ 項目変更通知（初期化）
			this.execLinkCallback( { kind: 'init' }, null );

		} catch(e) {
			throw { name: 'initContents.' + e.name, message: e.message };
		}
	};

	// 項目再表示
	clsContentsBox.prototype.redspContents = function() {
		try {
			// コメント全て表示
			for ( var wCmtId in this._ContentsItems.comment ) {
				this._ContentsItems.comment[wCmtId].dspBox( true );
			}

			// グループ全て表示
			for ( var wGrpId in this._ContentsItems.group ) {
				this._ContentsItems.group[wGrpId].dspBox( true );
			}

			// 人物全て表示
			for ( var wItmId in this._ContentsItems.person ) {
				this._ContentsItems.person[wItmId].dspBox( true );
			}

			// 中継点全て表示
			for ( var wRelId in this._ContentsItems.relation ) {
				this._ContentsItems.relation[wRelId].dspBox( true );
			}

			// フリーライン全て表示
			for ( var wLineId in this._ContentsItems.freeline ) {
				this._ContentsItems.freeline[wLineId].dspBox( true );
			}

			// 関連情報再描画
			this.drawRelationRedo();

			// サイドパネル再表示
			// ※ 項目変更通知（項目同期）
			this.execLinkCallback( { kind: 'link' }, null );
			// ※ 項目変更通知（再設定）
			this.execLinkCallback( { kind: 'reset' }, null );

		} catch(e) {
			throw { name: 'redspContents.' + e.name, message: e.message };
		}
	};

	// 親子関係再設定
	clsContentsBox.prototype.resetItemParent = function( pContentsItems ) {
		try {
			if ( !pContentsItems ) return;
			
			var wParentId;
			var wParentEle;

			// person、group、commentの各項目の親を再設定
			for( var wKey in pContentsItems ) {
				var wItems = pContentsItems[wKey];
				if ( !this.isObject(wItems) ) continue;
				
				// 登録項目全て再設定
				for( var wId in wItems ) {
					wParentId = wItems[wId].loadDataVal('parentId');
					if ( !wParentId ) continue;
					
					// 親要素取得
					wParentEle = this.getElement( wParentId );
					if ( wParentEle ) {
						wItems[wId].setParent( wParentEle, true );

					}

				}
			}

		} catch(e) {
			throw { name: 'resetItemParent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目メニュー操作
	// **************************************************************

	// 項目操作時処理
	clsContentsBox.prototype.execItemControl = function( pArgument, pTargetList ) {
		try {
			if ( !pArgument ) return false;
			if ( !pTargetList ) return false;

			var wId = pArgument.id;
			if ( !wId ) return false;

			var wTargetItem = pTargetList[wId];
			if ( !wTargetItem ) return false;

			switch( pArgument.kind ) {
			// 情報更新
			case 'status':
				// 項目変更通知（情報更新）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// 連絡先更新
			case 'contact':
				// 項目変更通知（情報更新）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// 項目移動
			case 'move':
				// 項目移動　開始
				this.moveItemStart( pArgument.event, wTargetItem, 'move' );
				break;

			// 項目削除
			case 'delete':
				// 全て削除チェック
				var wRelationDel = false;
				if ( 'delAll' in pArgument ) {
					wRelationDel = pArgument.delAll;
				}

				// 選択解除
				this.execFunction( this.resetSelectItem );

				// 項目削除して関連情報削除をチェック
				if ( this.delItemParent( wTargetItem, pTargetList, wRelationDel ) ) {
					// 関連情報再描画
					this.drawRelationRedo();
				}
				// 項目変更通知（項目削除）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// 関係追加
			case 'relation':
				// 関係追加　開始
				if ( this.chkRelationTarget(wTargetItem) ) {
					this.addRelationStart( pArgument, wTargetItem );

				} else {
					alert( '関連付け可能な項目がありません。' );

				}
				break;

			// 関係変更
			case 'relationChg':
				// 関係変更　開始
				if ( wTargetItem.chkRelationItem() ) {
					this.addRelationStart( pArgument, wTargetItem );

				} else {
					alert( '変更可能な関連項目が設定されていません。' );

				}
				break;
			
			// 関係解除
			case 'unrelation':
				// 関係解除　開始
				if ( wTargetItem.chkRelationItem() ) {
					this.addRelationStart( pArgument, wTargetItem );

				} else {
					alert( '解除可能な関連項目が設定されていません。' );

				}
				break;
			
			// 関係更新
			// ※各項目の関係情報設定画面の「OK」クリックイベント時処理
			case 'relationUpd':
				// 新規/更新　チェック
				var wRelMode = pArgument.displayMode;
				if ( wRelMode == 'update' ) {
					// 関係更新
					this.updRelation( pArgument, wTargetItem );
				} else {
					// 関係追加
					this.addRelation( pArgument, wTargetItem );
				}
				break;
			
			// 関係ライン調整
			case 'relationLine':
				// ライン再描画
				this.drawRelationRedo( { priority: wTargetItem } );

				// 項目変更通知（中継点位置変更）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// フリーライン調整
			case 'freeLine':
				// ライン再描画
				this.drawRelationRedo();

				// 項目変更通知（フリーライン変更）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// フリーライン更新
			case 'freeLineUpd':
				// ラインステータス更新
				this.updFreeLineStatus( wTargetItem );

				// ライン再描画
				this.drawRelationRedo();

				// 項目変更通知（フリーライン変更）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// 色変更
			case 'color':
				// 項目変更通知（色変更）
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// サイズ変更
			case 'resize':
				// サイズ変更　開始
				this.resizeItem( pArgument.event, wTargetItem );
				break;

			// 位置調整（縦）
			case 'pos-vert':
				// 位置調整（縦）　開始
				this.positionItemStart( pArgument, wTargetItem );
				break;

			// 位置調整（横）
			case 'pos-side':
				// 位置調整（横）　開始
				this.positionItemStart( pArgument, wTargetItem );
				break;

			// 項目操作キャンセル
			case 'cancel':
				// 操作（イベント）を全てキャンセル
				this.cancelControl( pArgument.cancel );
				break;
			}

		} catch(e) {
			throw { name: 'execItemControl.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// マウス追従コメント
	// **************************************************************

	// マウス追従コメント　初期設定
	clsContentsBox.prototype.initMouseCmt = function() {
		try {
			this._ContentsMouseCmt = new clsMouseCmt( { parent: this._ContentsEleMain } );

		} catch(e) {
			throw { name: 'initMouseCmt.' + e.name, message: e.message };
		}
	};

	// アラート表示（マウス追従コメント表示中）
	clsContentsBox.prototype.alertMouseCmt = function( pMsgCd ) {
		try {
			// マウス追従コメント一時停止
			if ( this._ContentsMouseCmt ) this._ContentsMouseCmt.stopMouseCmt();
			
			if ( !(pMsgCd in this._MSG_CONTENTS_ALERT) ) return;

			var wMsg = this._MSG_CONTENTS_ALERT[pMsgCd];
			alert( wMsg );

		} catch(e) { alert(e.message); }
	};

	// マウス追従コメント　表示
	clsContentsBox.prototype.dspMouseCmt = function( pEvent, pComment) {
		try {
			if ( !this._ContentsMouseCmt ) return;

			var wEvtPos = this.getEventPos( pEvent );
			this._ContentsMouseCmt.dspMouseCmt( wEvtPos, pComment );

		} catch(e) {
			throw { name: 'dspMouseCmt.' + e.name, message: e.message };
		}
	};

	// マウス追従コメント　非表示
	clsContentsBox.prototype.hideMouseCmt = function() {
		try {
			if ( !this._ContentsMouseCmt ) return;

			this._ContentsMouseCmt.hideMouseCmt();

		} catch(e) {
			throw { name: 'hideMouseCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 保存／読込
	// **************************************************************

	// 配置されている項目の情報を取得
	clsContentsBox.prototype.getItemData = function( pParam ) {
		try {
			var wItemData = {};

			// 取得対象チェック
			if ( this.isArray(pParam) ) {
				for( var wIndex = 0; wIndex < pParam.length; wIndex++ ) {
					wItemData[pParam[wIndex]] = { count: 0 };
				}

			} else if ( typeof pParam == 'string' ) {
				wItemData[pParam] = { count: 0 };

			} else {
				wItemData.person	= { count: 0 };
				wItemData.group		= { count: 0 };
				wItemData.relation	= { count: 0 };
				wItemData.comment	= { count: 0 };
				wItemData.freeline	= { count: 0 };

			}

			for( var wKey in wItemData ) {
				if ( wKey in this._ContentsItems ) {
					// 項目件数取得
					wItemData[wKey].count = Object.keys(this._ContentsItems[wKey]).length;
				}
			}

			return wItemData;

		} catch(e) {
			throw { name: 'getItemData.' + e.name, message: e.message };
		}
	};

	// 保存データ生成
	clsContentsBox.prototype.getSaveData = function( pSaveParam ) {
		try {
			// 取得データ属性
			var wSaveParam = {
				  keyperson		: true
				, personal		: true
				, contact		: true
				, comment		: true
				, freeline		: true
			};

			// パラメータで上書き
			this.copyProperty( pSaveParam, wSaveParam );

			// 保存用オブジェクト
			var wSaveObj = {};

			// 保存データKEY設定
			wSaveObj.savekey = this._DEF_CONTENTS_SAVEKEY;
			wSaveObj.baseid  = this.getBoxId();

			// 項目データ
			var wItmes;
			for( var wKey in this._ContentsItems ) {
				wItmes = this._ContentsItems[wKey];
				
				var wSaveItem = {};
				for( var wId in wItmes ) {
					// 項目の設定内容を取得（object）
					wSaveData = wItmes[wId].saveData( wSaveParam );
					wSaveItem[wId] = JSON.stringify( wSaveData );
				}
				
				wSaveObj[wKey] = JSON.stringify(wSaveItem);
			}
			
			return JSON.stringify(wSaveObj);
			
		} catch(e) {
			throw { name: 'getSaveData.' + e.name, message: e.message };
		}
	};

	// データ保存（download）　IE
	clsContentsBox.prototype.downloadDataIE = function( pSaveData ) {
		try {
			var wBlobData = new Blob( [pSaveData], {type: 'application/json'} );

			var wFileName = this.getNowDateTime() + '.sav';

			window.navigator.msSaveBlob(wBlobData, wFileName);

		} catch(e) {
			throw { name: 'downloadDataIE', message: e.message };
		}
	};

	// データ保存（download）　IE以外
	clsContentsBox.prototype.downloadDataEtc = function( pSaveData ) {
		try {
			// download用Link生成
			var wDownloadLink = this.addElement( 'a', 'a-download' );
			if ( !wDownloadLink ) return false;

			this.setStyle( wDownloadLink, { display: 'none' } );

			var wBlobData = new Blob( [pSaveData], {type: 'application/json'} );
			
			wDownloadLink.href = URL.createObjectURL( wBlobData );
			wDownloadLink.download = this.getNowDateTime() + '.sav';

			// Body要素にLinkを設定
			this.appendElementToParent( this.getBoxBody(), wDownloadLink );

			// download
			wDownloadLink.click();

			// Link削除
			this.delElement( wDownloadLink );

		} catch(e) {
			throw { name: 'downloadDataEtc', message: e.message };
		}
	};

	// データ保存（download）
	clsContentsBox.prototype.downloadData = function( pSaveData ) {
		try {
			// ブラウザがIE
			if ( this.isIE() ) {
				this.downloadDataIE( pSaveData );
			
			// 以外
			} else {
				this.downloadDataEtc( pSaveData );

			}

		} catch(e) {
			throw { name: 'downloadData.' + e.name, message: e.message };
		}
	};

	// 項目復元
	clsContentsBox.prototype.loadItem = function( pKey, pLoadData ) {
		try {
			// 項目種別チェック
			var wItemKind;
			switch( pKey ) {
			case 'person':
				wItemKind = 'item-person';
				break;

			case 'group':
				wItemKind = 'item-group';
				break;

			case 'comment':
				wItemKind = 'item-comment';
				break;

			case 'relation':
				wItemKind = 'item-relation';
				break;

			case 'freeline':
				wItemKind = 'item-freeline';
				break;

			default:
				throw { name: 'checkKey', message: '対象外バージョンのデータです[不明なデータ種別]' };
				breka;
			}

			// 項目内容復元
			var wLoadInf = JSON.parse( pLoadData );

			// 項目追加
			var wRetItem = this.addItem( null, wItemKind, wLoadInf );
			if ( !wRetItem ) {
				throw { name: 'addItem', message: '保存されている項目が復元できません[項目追加]' };
				
			}
			
			return wRetItem;

		} catch(e) {
			throw { name: 'loadItem.' + e.name, message: e.message };
		}
	};

	// 項目の関連付け情報を復元
	clsContentsBox.prototype.loadItemRelation = function() {
		try {
			var self = this;

			if ( !this._ContentsItems ) return;
			
			var mRelationSave = true;

			// 関連付け情報が保存されていないver
			if ( !this._ContentsItems.relation ) {
				// 関連付け情報を項目から生成
				this._ContentsItems.relation = {};
				mRelationSave = false;

			}

			// 関連付け情報生成
			function createRelationInf( pContentsItem ) {
				if ( !pContentsItem ) return false;

				var wItemKd;
				for( var wKey in pContentsItem ) {
					var wRelsItem = pContentsItem[wKey].getRelationList('parent');
					if ( !wRelsItem ) continue;

					for( var wRelKey in wRelsItem ) {
						wItemKd = wRelsItem[wRelKey].kind;

						// 関連付け対象取得
						var wDstItem = self.getContentsItem( wRelKey, wItemKd );
						if ( !wDstItem ) continue;

						// 関連付け情報取得
						var wRelInf = null;

						// 関連付け保存ver
						if ( mRelationSave ) {
							// 生成済の情報取得
							wRelInf = self._ContentsItems.relation[wRelsItem[wRelKey].key];
						}
						
						if ( (!wRelInf) && (typeof wRelsItem[wRelKey].relationInf !== 'undefined') ) {
							// 項目に保存されている関連付け情報取得
							// ※ load時、項目のrelationInfにはclsItemRelation生成の為のパラメータが設定される
							var wRelLoad = {};
							self.copyProperty( wRelsItem[wRelKey].relationInf, wRelLoad );

							// 関連付けclass生成
							var wRelParam;
							if ( (typeof wRelLoad.contents !== 'undefined') && (typeof wRelLoad.masterId !== 'undefined') ) {
								wRelParam = { loadData: wRelLoad };

							} else {
								wRelParam = wRelLoad;

							}
							wRelParam.window = self.getBoxWindow();
							wRelParam.parent = self._ContentsEleMain;
							
							wRelInf = new clsItemRelation( wRelParam );
						}

						// 関連付け設定
						if ( wRelInf ) self.setRelation( pContentsItem[wKey], wDstItem, wRelInf );

					}
				}
			};

			// 項目（主）
			createRelationInf( this._ContentsItems.person );

			// グループ（主）
			createRelationInf( this._ContentsItems.group );

			// 中継点（主）
			createRelationInf( this._ContentsItems.relation );

		} catch(e) {
			throw { name: 'loadItemRelation.' + e.name, message: e.message };
		}
	};

	// データ読込
	clsContentsBox.prototype.execLoadData = function( pLoadData ) {
		try {
			// 読込データ無効なら処理なし
			if ( typeof pLoadData == 'undefined' ) return false;
			if ( pLoadData == null ) return false;

			// データチェック
			if ( pLoadData.indexOf(this._DEF_CONTENTS_SAVEKEY) == -1 ) {
				alert( '選択されたファイルが保存データではないか、対象外バージョンのデータです[savekey]');
				return false;
			}

			// 読み込んだデータから項目を復元
			var wLoadObj = JSON.parse(pLoadData);

			// ベース要素id取得
			var wBaseId = wLoadObj.baseid;
			if ( !wBaseId ) {
				alert( '対象外バージョンのデータです[baseid不明]');
				return false;
			}

			// 主コンテンツのidを再設定
			this._ContentsEleMain.setAttribute( 'id', wBaseId );

			// 現情報を初期化
			this.initContents();

			var wReadContents = {};
			try {
				for ( var wKey in wLoadObj ) {
					// 保存KEYは不要
					if ( wKey == 'savekey' ) continue;
					
					// ベース要素idは不要
					if ( wKey == 'baseid' ) continue;

					// 各項目（person、group、comment、relation）を復元
					wReadContents[wKey] = {};

					var wReadItems;
					var wLoadItems = JSON.parse( wLoadObj[wKey] );
					for( var wId in wLoadItems ) {
						// 復元した項目を取得
						wReadContents[wKey][wId] = this.loadItem( wKey, wLoadItems[wId] );
					}

				}

				// 親子関係を再設定
				this.resetItemParent( wReadContents );

				// 読込項目を保存
				this._ContentsItems = wReadContents;
				if ( !('person'   in this._ContentsItems) ) this._ContentsItems.person		= {};
				if ( !('group'    in this._ContentsItems) ) this._ContentsItems.group		= {};
				if ( !('relation' in this._ContentsItems) ) this._ContentsItems.relation	= {};
				if ( !('comment'  in this._ContentsItems) ) this._ContentsItems.comment		= {};
				if ( !('freeline' in this._ContentsItems) ) this._ContentsItems.freeline	= {};

				// 項目の関連付け情報を再設定
				this.loadItemRelation();

			} catch(me) {
				// 追加項目を全て削除して例外をthrow
				try {
					for( var wDel in wReadContents ) {
						if ( wReadContents[wDel] ) {
							var wDelContents = wReadContents[wDel];
							for( var wDelId in wDelContents ) {
								if ( !wDelContents[wDelId] ) {
									if ( typeof wDelContents[wDelId].freeClass == 'function' ) {
										wDelContents[wDelId].freeClass();
									}
								}
								delete wDelContents[wDelId]
							}
						}
						delete wReadContents[wDel]
					}
				} catch(de) {}
				throw { name: me.name, message: me.message };
				
			}

			// 項目再表示
			this.redspContents();

			return true;

		} catch(e) {
			throw { name: 'execLoadData.' + e.name, message: e.message };
		}
	};

	// データ保存
	clsContentsBox.prototype.execSaveData = function( pEvent ) {
		try {
			// 保存データ生成
			var wSaveData = this.getSaveData();

			// データ保存（download）
			this.downloadData( wSaveData );

		} catch(e) {
			throw { name: 'execSaveData.' + e.name, message: e.message };
		}
	};

	// 読込メニュー表示
	clsContentsBox.prototype.dspLoadMenu = function( pEvent ) {
		try {
			// 読込ダイアログ表示
			if ( this._ContentsMenuFile ) {
				var wPoint = this.getEventPos( pEvent );
				this._ContentsMenuFile.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLoadFile } );
			}

		} catch(e) {
			throw { name: 'dspLoadMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 印刷
	// **************************************************************

	// キャンバス印刷
	clsContentsBox.prototype.printCanvasData = function( ) {
		try {
			if ( !this._ContentsEleMain ) return false;

			var wWindow = this.getBoxWindow();
			if ( !wWindow ) return false;

			// 印刷プレビュー
			wWindow.print();

			return true;
			
		} catch(e) {
			throw { name: 'printCanvasData.' + e.name, message: e.message };
		}
	};

	// 印刷データ生成
	clsContentsBox.prototype.getPrintData = function( ) {
		try {
			if ( !this._ContentsEleMain ) return null;
			if ( !this._ContentsCanvas ) return null;

			return {
				  html		: this._ContentsEleMain.innerHTML
				, canvas	: this._ContentsCanvas.canvasGetStatus()
			};

		} catch(e) {
			throw { name: 'getPrintData.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 画面操作
	// **************************************************************

	// 操作（イベント）を全てキャンセル
	//　※ メイン画面からCallされる
	clsContentsBox.prototype.cancelControl = function( pCancelParam ) {
		try {
			// キャンセル処理設定
			// ※選択はキャンセルしない
			var wParam = {
				  select : false
			};
			
			// その他パラメータ上書き
			if ( this.isObject(pCancelParam) ) {
				this.copyProperty( pCancelParam, wParam );
			}

			// 処理中イベント解除
			this.eventClear( wParam );

		} catch(e) {
			throw { name: 'cancelControl . ' + e.name, message: e.message };
		}
	};

	// 子項目のイベントを全てキャンセル
	clsContentsBox.prototype.cancelChiledEvent = function() {
		try {
			// イベントキャンセル
			var cancelItemEvent = function( pTgList ) {
				if ( !pTgList ) return false;

				for( var wKey in pTgList ) {
					if ( !pTgList.hasOwnProperty(wKey) ) continue;

					if ( typeof pTgList[wKey].eventClear == 'function' ) {
						pTgList[wKey].eventClear();
					}
				}
			};

			for( var wKind in this._ContentsItems ) {
				if ( !this.isObject(this._ContentsItems[wKind]) ) continue;
				
				// 項目イベントキャンセル
				cancelItemEvent( this._ContentsItems[wKind] );
			}

		} catch(e) {
			throw { name: 'cancelChiledEvent . ' + e.name, message: e.message };
		}
	};

	// イベントをキャンセル（右クリックでキャンセル可能なもののみ）
	clsContentsBox.prototype.eventClearClick = function( pCancelParam ) {
		try {
			if ( this._ContentsMenuColor ) {
				this._ContentsMenuColor.hideMenu();
			}

			if ( this._ContentsMenuFile ) {
				this._ContentsMenuFile.hideMenu();
			}

			var wCancelEvent = {
				  relation		: true
				, comment		: true
				, itemUpd		: true
				, position		: true
				, select		: true
				, freeline		: true
			};
			if ( this.isObject(pCancelParam) ) {
				if ( 'relation' in pCancelParam ) wCancelEvent.relation	= pCancelParam.relation;
				if ( 'comment'  in pCancelParam ) wCancelEvent.comment	= pCancelParam.comment;
				if ( 'itemUpd'  in pCancelParam ) wCancelEvent.itemUpd	= pCancelParam.itemUpd;
				if ( 'position' in pCancelParam ) wCancelEvent.position	= pCancelParam.position;
				if ( 'select'   in pCancelParam ) wCancelEvent.select	= pCancelParam.select;
				if ( 'freeline' in pCancelParam ) wCancelEvent.freeline	= pCancelParam.freeline;
			}

			// 関係追加／解除
			if ( wCancelEvent.relation ) this.execFunction( this.addRelationCancel );

			// コメント追加　解除
			if ( wCancelEvent.comment ) this.execFunction( this.cancelAddItemComment );

			// ライン追加　解除
			if ( wCancelEvent.freeline ) this.execFunction( this.freeLineCancel );

			// 項目更新解除
			if ( wCancelEvent.itemUpd ) this.execFunction( this.updItemCancel );

			// 位置調整解除
			if ( wCancelEvent.position ) this.execFunction( this.positionItemCancel );

			// 選択解除
			if ( wCancelEvent.select ) this.execFunction( this.resetSelectItem );

		} catch(e) {
			throw { name: 'eventClearClick.' + e.name, message: e.message };
		}
	};

	// イベントを全てキャンセル
	clsContentsBox.prototype.eventClear = function( pCancelParam ) {
		try {
			if ( this._ContentsMenuColor ) {
				this._ContentsMenuColor.hideMenu();
			}
			if ( this._ContentsMenuFile ) {
				this._ContentsMenuFile.hideMenu();
			}

			//※ 右クリックでキャンセル可能なイベント
			this.eventClearClick( pCancelParam );

			//※ 右クリックでキャンセルできないイベント
			// キャンセル対象設定
			var wCancelEvent = {
				  move		: true
				, resize	: true
			};
			if ( this.isObject(pCancelParam) ) {
				if ( 'move'   in pCancelParam ) wCancelEvent.move	= pCancelParam.move;
				if ( 'resize' in pCancelParam ) wCancelEvent.resize	= pCancelParam.resize;
			}

			// 　移動（および項目追加）
			if ( wCancelEvent.move ) this.execFunction( this.moveItemCancel );
			
			// 　リサイズ終了
			if ( wCancelEvent.resize ) this.execFunction( this.cancelResizeItem );

			// 子項目のイベントキャンセル
			this.cancelChiledEvent();
			
		} catch(e) {
			throw { name: 'eventClear.' + e.name, message: e.message };
		}
	};

	// 全項目メニュー　有効化・無効化
	clsContentsBox.prototype.useItemContextCtrl = function( pValid, pParam ) {
		try {
			// 全項目のメニュー操作設定
			for( var wKey in this._ContentsItems ) {
				if ( !this._ContentsItems[wKey] ) continue;
				
				for( var wId in this._ContentsItems[wKey] ) {
					var wItem = this._ContentsItems[wKey][wId];
					if ( !wItem ) continue;
					
					if ( typeof wItem.setContextAvailable == 'function' ) {
						wItem.setContextAvailable( pValid, pParam );
					}
				}
			}

		} catch(e) {
			throw { name: 'useItemContextCtrl', message: e.message };
		}
	};

	// 全項目位置調整メニュー　有効化・無効化
	clsContentsBox.prototype.useItemPositionCtrl = function( pValid ) {
		try {
			// 全項目の位置調整メニュー操作設定
			for( var wKey in this._ContentsItems ) {
				if ( !this._ContentsItems[wKey] ) continue;
				
				for( var wId in this._ContentsItems[wKey] ) {
					var wItem = this._ContentsItems[wKey][wId];
					if ( !wItem ) continue;
					
					if ( typeof wItem.setPositionAvailable == 'function' ) {
						wItem.setPositionAvailable( pValid );
					}
				}
			}

		} catch(e) {
			throw { name: 'useItemPositionCtrl', message: e.message };
		}
	};

	// ベース操作　有効化・無効化
	clsContentsBox.prototype.useContextCtrl = function( pValid ) {
		try {
			// 無効化時は選択解除
			if ( !pValid ) this.execFunction( this.resetSelectItem );

			// 項目メニュー操作設定
			var wMenuValid = pValid;

			// ドラッグ可否
			var wCtrlParam = {};

			// 配置編集モード時
			if ( this.isEditModeMove() ) {
				// 有効化しない
				wMenuValid = false;

				// ドラッグ許可
				wCtrlParam.drag = true;
			
			}

			// 全項目の操作設定
			this.useItemContextCtrl( wMenuValid, wCtrlParam );

			// ベースメニュー
			this._ContentsContextValid = pValid;

			// サイドパネル・パネルコントローラ　操作設定
			var wValidParam = {
				  kind		: 'set-valid'
				, valid		: pValid
			};
			this.execLinkCallback( wValidParam, null );

		} catch(e) {
			throw { name: 'useContextCtrl.' + e.name, message: e.message };
		}
	};

	// カラーメニュー表示
	clsContentsBox.prototype.dspColorMenu = function( pEvent ) {
		try {
			// イベント停止
			this.cancelEvent( pEvent, true );

			// 処理中イベント解除
			this.eventClear();

			// カラーメニュー表示
			if ( this._ContentsMenuColor ) {
				var wPoint = this.getEventPos( pEvent );
				this._ContentsMenuColor.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspColorMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 基本画面のメニュー
	// **************************************************************

	// 選択時処理
	clsContentsBox.prototype.execContentsMenu = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// 人物追加
			case 'item':
				wRetVal = this.addItemStart( pEvent, 'item-person' );
				break;

			// グループ追加
			case 'group':
				wRetVal = this.addItemStart( pEvent, 'item-group' );
				break;

			// コメント追加
			case 'comment':
				wRetVal = this.addItemComment( pEvent );
				break;

			// フリーライン追加
			case 'freeline':
				wRetVal = this.addItemFreeLine( pEvent );
				break;

			// 色変更
			case 'color':
				wRetVal = this.dspColorMenu( pEvent );
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'execContentsMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// メインメニュー画面のメニュー
	// **************************************************************

	// 編集モードメニューが「配置編集」かチェック
	clsContentsBox.prototype.isEditModeMove = function( pEditMode ) {
		try {
			var wModeKind = this._ContentsEditMode;
			
			if ( typeof pEditMode == 'string' ) wModeKind = pEditMode;
			
			return ( wModeKind == this._DEF_MENU_ID_MOVE );

		} catch(e) {
			throw { name: 'isEditModeMove.' + e.name, message: e.message };
		}
	};

	// 編集モード設定
	clsContentsBox.prototype.setEditMode = function( pMenuId ) {
		try {
			// メニュー変更なしは処理なし
			if ( this._ContentsEditMode == pMenuId ) return false;

			switch( pMenuId ) {
			// 配置編集モード
			case this._DEF_MENU_ID_MOVE:
				// 選択解除
				this.resetSelectItem();

				// 項目メニュー無効化
				this.useItemContextCtrl( false, { drag: true } );
				
				// 項目位置調整メニュー有効化
				this.useItemPositionCtrl( true );

				break;

			// 以外（通常モード）
			default:
				// 項目メニュー有効化
				this.useItemContextCtrl( true );

				break;
			
			}

			// モードに移行
			this._ContentsEditMode = pMenuId;

			// メニュー変更
			this.chgMenuEditStyle( this._ContentsEditMode );

			return true;

		} catch(e) {
			throw { name: 'setEditMode.' + e.name, message: e.message };
		}
	};

	// メインメニュー選択時処理
	clsContentsBox.prototype.execMainMenu = function( pEvent, pMenuId ) {
		try {
			var wRetVal = true;

			// ベース操作有効時のみ
			if ( !this._ContentsContextValid ) return false;

			switch(pMenuId) {
			// データ
			case 'data':
				// データメニュー表示
				// 配置編集用コンテキストメニュー表示
				var wPoint = this.getEventPos( pEvent );
				this._ContentsMenuData.dspMenu( wPoint );
				break;

			// 通常編集
			case this._DEF_MENU_ID_NORMAL:
				// 通常モードへ切替
				wRetVal = this.setEditMode( pMenuId );

				if ( wRetVal ) {
					// ※サイドパネルへ編集モード変更通知
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_NORMAL }, null );
				}
				break;

			// 配置編集
			case this._DEF_MENU_ID_MOVE:
				// 配置編集モードへ切替
				wRetVal = this.setEditMode( pMenuId );

				if ( wRetVal ) {
					// ※サイドパネルへ編集モード変更通知
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_MOVE }, null );
				}
				break;

			// 印刷
			case 'print':
				// 印刷
				this.printCanvasData()
				break;

			// データ保存
			case 'save':
				// 保存
				wRetVal = this.execSaveData( pEvent );
				break;

			// データ読込
			case 'load':
				// 読込
				wRetVal = this.dspLoadMenu( pEvent );
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'execMainMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 画面生成
	// **************************************************************

	// メニュー有無チェック
	clsContentsBox.prototype.chkActiveMenu = function( ) {
		try {
			// メニュー設定チェック
			if ( !this._ContentsMenuIs ) return false;

			var wMenuIs = false;
			for( var wKey in this._ContentsMenuIs ) {
				if ( this._ContentsMenuIs[wKey] ) {
					wMenuIs = true;
					break;
				}
			}

			return wMenuIs;

		} catch(e) {
			throw { name: 'createMenuElement.' + e.name, message: e.message };
		}
	};

	// メニュー表示エリア生成
	clsContentsBox.prototype.createMenuElement = function( ) {
		try {
			// メニュー設定有効時のみ
			if ( !this.chkActiveMenu() ) return;

			// メニュー表示エリア生成
			var wMenuEle = this.addElement( 'div', this.getBoxId() + '_menu' );
			if ( !wMenuEle ) {
				throw { name: 'addElement', message: '要素が生成できません' };

			}

			this.addClass( wMenuEle, 'cssCommon-menu' );
			this.addClass( wMenuEle, 'no-print' );
			this.appendBoxToParent( wMenuEle );

			// 操作無効化
			this.addEvent( wMenuEle, 'onclick',			this.eventInvalid );
			this.addEvent( wMenuEle, 'oncontextmenu',	this.eventInvalid );

			// 要素保存
			this._ContentsEleMenu = wMenuEle;

			// メニュー追加
			if ( this._ContentsMenuIs.edit ) {
				var wEditNormal = this.createMenuEditNormal( this._ContentsEleMenu, this.eventMainMenuSelect );
				this._ContentsEleMenuList.push( wEditNormal );

				var wEditMove = this.createMenuEditMove( this._ContentsEleMenu, this.eventMainMenuSelect );
				this._ContentsEleMenuList.push( wEditMove );
			}

			if ( this._ContentsMenuIs.data ) {
				// データSAVE
				var wParamSave = {
					  title		: 'データ保存'
					, name		: 'save'
					, style		: { 'float': 'right' }
					, class		: 'cssCommon-menu-list-def'
				};

				var wDataSave = this.createMenu( this._ContentsEleMenu, this.eventMainMenuSelect, wParamSave );
				this._ContentsEleMenuList.push( wDataSave );

				// データLOAD
				var wParamLoad = {
					  title		: 'データ読込'
					, name		: 'load'
					, style		: { 'float': 'right' }
					, class		: 'cssCommon-menu-list-def'
				};

				var wDataLoad = this.createMenu( this._ContentsEleMenu, this.eventMainMenuSelect, wParamLoad );
				this._ContentsEleMenuList.push( wDataLoad );
			}

			if ( this._ContentsMenuIs.print ) {
				// 印刷
				var wParamPrint = {
					  title		: '印刷'
					, name		: 'print'
					, style		: { 'float': 'right', 'padding-right': '10px' }
					, class		: 'cssCommon-menu-list-def'
				};

				var wPrint = this.createMenu( this._ContentsEleMenu, this.eventMainMenuSelect, wParamPrint );
				this._ContentsEleMenuList.push( wPrint );
			}

		} catch(e) {
			throw { name: 'createMenuElement.' + e.name, message: e.message };
		}
	};

	// メインコンテンツエリア生成
	clsContentsBox.prototype.createContentsElement = function() {
		try {
			// ステータス表示エリア生成
			var wMainEle = this.addElement( 'div', this.getBoxId() + '_main' );
			if ( !wMainEle ) {
				throw { name: 'addElement', message: '要素が生成できません' };

			}

			this.addClass( wMainEle, 'cssContents-main' );

			// メニュー設定有効時
			if ( this.chkActiveMenu() ) {
				this.addClass( wMainEle, 'cssContents-main-menu' );

			// メニューなし
			} else {
				this.addClass( wMainEle, 'cssContents-main-nomenu' );

			}

			this.appendBoxToParent( wMainEle );

			// 要素保存
			this._ContentsEleMain = wMainEle;

		} catch(e) {
			throw { name: 'createContentsElement.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 項目同期
	// **************************************************************

	// 編集モードメニュー変更
	// 　※メインオブジェクトからcallされる
	clsContentsBox.prototype.execChgEditModeNormal = function() {
		try {
			// 通常編集モードに変更
			this.setEditMode( this._DEF_MENU_ID_NORMAL );

		} catch(e) {
			throw { name: 'execChgEditModeNormal.' + e.name, message: e.message };
		}
	};

	// 同期項目変更時処理
	// 　※同期オブジェクトからcallされる
	clsContentsBox.prototype.execLinkItemEvent = function( pArgument ) {
		try {
			switch( pArgument.kind ) {
			// 項目選択
			case 'select':
				var wSelectItm = pArgument.item;
				if ( wSelectItm ) {
					// コンテンツとサイドパネル同期
					this.selectClickItem( wSelectItm );
				
				}
				break;

			// 項目操作キャンセル
			case 'cancel':
				// 操作（イベント）を全てキャンセル
				this.cancelControl( pArgument.cancel );
				break;

			// 編集メニュー選択
			case 'edit':
				this.setEditMode( pArgument.mode );
				break;
			
			}

		} catch(e) {
			throw { name: 'execLinkItemEvent.' + e.name, message: e.message };
		}
	};


	// 同期オブジェクトへの項目変更通知イベント設定
	clsContentsBox.prototype.addLinkCallback = function( pEvtFnc ) {
		try {
			if ( !pEvtFnc ) return false;

			// 項目変更時処理追加
			this._ContentsLinkCallback.push( pEvtFnc );

		} catch(e) {
			throw { name: 'addLinkCallback', message: e.message };
		}
	};

	// 項目変更時処理
	// 　※同期オブジェクトへ項目変更を通知
	clsContentsBox.prototype.execLinkCallback = function( pParam, pItem ) {
		try {
			if ( this._ContentsLinkCallback.length == 0 ) return true;

			// イベントオブジェクトへパラメータ設定
			var wCallbackParam = {};
			this.copyProperty( pParam, wCallbackParam );

			wCallbackParam.item		= pItem;

			for( var wIndex = 0; wIndex < this._ContentsLinkCallback.length; wIndex++ ) {
				if ( typeof this._ContentsLinkCallback[wIndex] == 'function' ) {
					// 登録されている処理を実行
					var wArguments = [];
					wArguments.push( wCallbackParam );

					this._ContentsLinkCallback[wIndex].apply( this, wArguments );

				}
			}
			return true;

		} catch(e) {
			throw { name: 'execLinkCallback.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 動作設定パラメータ取得
	// **************************************************************

	// 項目ドラッグ可否設定
	clsContentsBox.prototype.getSettingItemDrag = function( pItemKind ) {
		try {
			var wItemDrag = {
				  drag		: false
				, moveInit	: false
			};

			// 対象項目種別名
			var wKindNm = '';

			// 人物
			if ( this.isItemPerson(pItemKind) ) {
				wKindNm = 'person';

			// グループ
			} else if ( this.isItemGroup(pItemKind) ) {
				wKindNm = 'group';

			// コメント
			} else if ( this.isItemComment(pItemKind) ) {
				wKindNm = 'comment';

			// 関連付け中継点
			} else if ( this.isItemRelation(pItemKind) ) {
				wKindNm = 'relation';

			// 関連付け中継点
			} else if ( this.isItemFreeLine(pItemKind) ) {
				wKindNm = 'freeline';

			// 以外は処理なし
			} else {
				return wItemDrag;

			}

			// 項目操作設定取得
			var wControl = this.loadArgument( 'control' );
			if ( !wControl ) return wItemDrag;
			
			var wCtrlDrag = wControl.drag;
			if ( wCtrlDrag ) {
				if ( wKindNm in wCtrlDrag ) wItemDrag.drag = wCtrlDrag[wKindNm];
			}

			var wCtrlMove = wControl.moveInit;
			if ( wCtrlMove ) {
				if ( wKindNm in wCtrlMove ) wItemDrag.moveInit = wCtrlMove[wKindNm];
			}

			return wItemDrag;

		} catch(e) {
			throw { name: 'getSettingItemDrag.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsContentsBox.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_CONTENTS_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「contents」
				wInitArgument.kind = this._DEF_CONTENTS_KIND;

			}

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// 編集メニュー初期値
			this._ContentsEditMode = this._DEF_MENU_ID_NORMAL;

			var wArgFlg = this.isObject(pArgument);

			// パラメータ取得
			var wLocked		= false;
			var wUseMenu	= null;

			if ( wArgFlg ) {
				if ( 'locked' in pArgument ) wLocked = pArgument.locked;

				// メニュー設定
				if ( 'menu' in pArgument ) {
					if ( 'contents' in pArgument.menu ) wUseMenu = pArgument.menu.contents;
				}
			}
			this._ContentsLocked = wLocked;

			// ロック時はメニュー使用不可
			if ( !wLocked ) {
				this._ContentsMenuIs = wUseMenu;
			}

			// クラス追加
			this.setBoxClass( 'cssContents-base' );
			this.setBoxClass( 'main-print' );

			// メニュー表示エリア生成
			this.createMenuElement();

			// メインコンテンツエリア生成
			this.createContentsElement();

			// ------------------------
			// 共通メニュー設定
			// ------------------------
			// ※ロック時メニュー不要
			if ( !wLocked ) {
				// 共通メニュー設定
				this._ContentsPublicMenu = this.loadArgument( 'publicMenu' );

				// カラーメニュー設定
				if ( this._ContentsPublicMenu ) {
					if ( this._ContentsPublicMenu.common ) {
						this._ContentsMenuColor = this._ContentsPublicMenu.common.color;
					}
				}
				if ( !this._ContentsMenuColor ) this._ContentsMenuColor = new clsColorBox();

			}

			// ファイル選択メニュー設定
			if ( this._ContentsPublicMenu ) {
				if ( this._ContentsPublicMenu.common ) {
					this._ContentsMenuFile = this._ContentsPublicMenu.common.file;
				}
			}
			if ( !this._ContentsMenuFile ) this._ContentsMenuFile = new clsFileBox();

			// ------------------------
			// キャンバス設定
			// ------------------------
			var wCanvasSize = {
				  width		: this._DEF_CONTENTS_CANVAS_SIZE.width
				, height	: this._DEF_CONTENTS_CANVAS_SIZE.height
			};

			// キャンバスサイズ設定あり
			if ( wArgFlg ) {
				if ( 'canvas' in pArgument ) {
					var wCanvasParam = pArgument.canvas;
					if ( 'width' in wCanvasParam ) {
						if ( String(wCanvasParam.width).length > 0 ) wCanvasSize.width = Number(wCanvasParam.width);
					}
					if ( 'widthSub' in wCanvasParam ) {
						if ( String(wCanvasParam.widthSub).length > 0 ) wCanvasSize.width -= Number(wCanvasParam.widthSub);
					}

					if ( 'height' in wCanvasParam ) {
						if ( String(wCanvasParam.height).length > 0 ) wCanvasSize.height = Number(wCanvasParam.height);
					}
					if ( 'heightSub' in wCanvasParam ) {
						if ( String(wCanvasParam.heightSub).length > 0 ) wCanvasSize.height -= Number(wCanvasParam.heightSub);
					}

				}
			}
			this._ContentsCanvas = new clsCanvas( { parent: this._ContentsEleMain, size: wCanvasSize } );

			// 未ロック時
			if ( !wLocked ) {
				// ------------------------
				// コンテキストメニュー設定
				// ------------------------

				// メニュー生成
				this._ContentsContextMenu = new clsMenuList( { menuList: this._DEF_CONTENTS_MENU, callback: this.eventMenuSelect } );

				// ------------------------
				// イベント設定
				// ------------------------

				// ベースメニュー有効化
				this.addBoxEvents( 'oncontextmenu'	, this.eventContentsContext );

				// 項目クリック
				this.addBoxEvents( 'onmousedown'	, this.eventContentsClick );

				// ------------------------
				// 追従コメント設定
				// ------------------------
				this.initMouseCmt();

			// ロック時
			} else {
				// ベースメニュー無効化
				this.addBoxEvents( 'oncontextmenu'	, this.eventInvalid );

			}

			// 操作可否設定
			this.useContextCtrl( !wLocked );

			// ------------------------
			// 同期用callback設定
			// ------------------------
			if ( wArgFlg ) {
				this.addLinkCallback( pArgument.callback );

			}

			// 主コンテンツ表示
			this.dspBox( true );

		} catch(e) {
			throw { name: 'clsContentsBox.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsContentsBox.prototype.freeClass = function() {
		try {
			// 項目全て削除
			this.execFunction( this.initContents );

			// プロパティ開放
			this._ContentsPublicMenu		= null;
			this._ContentsMenuColor			= null;
			this._ContentsMenuFile			= null;

			if ( this._ContentsCanvas ) {
				this._ContentsCanvas.freeClass();
			}
			this._ContentsCanvas			= null;

			if ( this._ContentsContextMenu ) {
				this._ContentsContextMenu.freeClass();
			}
			this._ContentsContextMenu		= null;

			if ( this._ContentsMenuData ) {
				this._ContentsMenuData.freeClass();
			}
			this._ContentsMenuData			= null;

			for( var wIdx = 0; wIdx < this._ContentsEleMenuList.length; wIdx++ ){
				this._ContentsEleMenuList[wIdx] = null;
			}
			
			if ( this._ContentsEleMenu ) {
				this.execFunction( this.delEvent, this._ContentsEleMenu, 'onclick',			this.eventInvalid );
				this.execFunction( this.delEvent, this._ContentsEleMenu, 'oncontextmenu',	this.eventInvalid );
			}
			this._ContentsEleMenu			= null;

			for( var wCIdx = 0; this._ContentsLinkCallback.length; CIdx++ ) {
				this._ContentsLinkCallback[wCIdx] = null;
			}
			this._ContentsLinkCallback = null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};
}());
