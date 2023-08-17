
// --------------------------------------------------------------------
//
// 関係種別選択メニュー
//
// --------------------------------------------------------------------
// clsMenuRelation ← clsMenuBase ← clsBaseBox
//        |― clsItemRelation ← clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsMenuRelation = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_RELATION_KIND		= 'menu-relation';

		this._DEF_MENU_RELATION_PROPERTY	= {
			 'z-index'				: '3200'
		};

		this._DEF_MENU_RELATION_SIZE		= { width: 180, height: 210 };
		this._DEF_MENU_RELATION_LINE_HEIGHT	= 24;

		this._DEF_MENU_RELATION_VALUE		= {
			  stat		: 0
			, kind		: 0
			, comment	: ''
			, way		: 0
		};

		// 継承元クラスのprototype
		this._MenuPrototype					= null;

		this._RelationContents				= null;
		this._RelationMode					= '';
		this._RelationConfig				= { stat: true, kind: true, comment: true, way: true };

		this._RelationMenuColor				= null;


		// **************************************************************
		// イベント
		// **************************************************************

		// 色選択メニュー表示イベント
		this.eventMenuColorOpen = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 処理中イベント解除
				self.cancelRelationEvent();

				// カラーメニュー表示
				if ( self._RelationMenuColor ) {
					var wPoint = self.getEventPos( pEvent );
					self._RelationMenuColor.dspMenu( { x: wPoint.x, y: wPoint.y, callback: self.eventMenuColorSelect } );

				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// 関係選択イベント
		this.eventMenuRelChange = function( pEvent ) {
			try {
				var wRelId = self.getBoxId() + '_rel';
				var wRelEle = self.getElement( wRelId );
				if ( !wRelEle ) return false;

				var wRelVal = wRelEle.options[wRelEle.selectedIndex].value;
				var wSelRel = self._RelationContents.getDefKind( wRelVal );

				var wColorId = self.getBoxId() + '_color';
				var wColorEle = self.getElement( wColorId );
				if ( !wColorEle ) return false;

				// 背景色変更
				self.setStyle( wColorEle, { 'background-color' : wSelRel.color } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 色選択時イベント
		this.eventMenuColorSelect = function( pEvent, pParam ) {
			try {
				// パラメータなければ処理なし
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				var wKind = pParam.kind;
				
				// 色選択時
				if ( wKind == 'select' ) {
					var wColor = pParam.color;

					var wColorId = self.getBoxId() + '_color';
					var wColorEle = self.getElement( wColorId );
					if ( !wColorEle ) return false;

					// 背景色変更
					self.setStyle( wColorEle, { 'background-color' : wColor } );

				}

				return true;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// キャンセルボタン押下イベント
		this.eventMenuCancel = function( pEvent ) {
			try {
				// 閉じる
				self.hideMenu();

				// 親イベント発生
				self.execCallBack( pEvent, { kind: 'close' } );

				return true;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// OKボタン押下イベント
		this.eventMenuOk = function( pEvent ) {
			try {
				// 入力値取得
				var wInputValue = {};
				self.copyProperty( self._DEF_MENU_RELATION_VALUE, wInputValue );

				if ( self._RelationConfig.stat		) wInputValue.stat		= self.getSelectValue('_stat');
				if ( self._RelationConfig.kind		) wInputValue.kind		= self.getSelectValue('_rel');
				if ( self._RelationConfig.comment	) wInputValue.comment	= self.getSelectText('_cmt');
				if ( self._RelationConfig.way		) wInputValue.way		= self.getSelectValue('_way');

				self._RelationContents.setStatus(	wInputValue.stat	);
				self._RelationContents.setRelation(	wInputValue.kind	);
				self._RelationContents.setWorkWay(	wInputValue.way		);
				self._RelationContents.setComment(	wInputValue.comment	);

				self._RelationContents.setColor(	self.getSelectColor('_color')	);

				// 閉じる
				self.hideMenu();

				// 設定内容取得
				var wRelParam = self._RelationContents.getContents();

				// 画面設定情報を戻り値に設定
				var wParam = {
								kind		: 'relationUpd'
							,	displayMode	: self._RelationMode
							,	relationInf	: wRelParam
				};

				// 親イベント発生
				self.execCallBack( pEvent, wParam );

				return true;

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
		throw { name: 'clsMenuRelation.' + e.name, message: e.message };
	}
};


// 関係情報 prototype
(function(){

	// clsMenuBaseのプロトタイプを継承
	clsInheritance( clsMenuRelation, clsMenuBase );

	// **************************************************************
	// 内容設定／取得
	// **************************************************************

	// 選択値取得
	clsMenuRelation.prototype.getSelectValue = function( pSubId ) {
		try {
			var wSelectId = this.getBoxId() + pSubId;
			var wSelectEle = this.getElement( wSelectId );
			if ( !wSelectEle ) return 0;

			var wValue = wSelectEle.options[wSelectEle.selectedIndex].value;

			return wValue;

		} catch(e) {
			throw { name: 'getSelectValue.' + e.name, message: e.message };
		}
	};

	// 選択インデックス取得
	clsMenuRelation.prototype.getSelectIndex = function( pSubId, pValue ) {
		try {
			var wSelectId = this.getBoxId() + pSubId;
			var wSelectEle = this.getElement( wSelectId );
			if ( !wSelectEle ) return 0;

			var wRetIdx = 0;
			for( var wIdx=0; wIdx < wSelectEle.options.length; wIdx++ ) {
				if ( wSelectEle.options[wIdx].value == pValue ) {
					wRetIdx = wIdx;
					break;
				}
			}
			return wRetIdx;

		} catch(e) {
			throw { name: 'getSelectIndex.' + e.name, message: e.message };
		}
	};

	// 入力値取得
	clsMenuRelation.prototype.getSelectText = function( pSubId ) {
		try {
			var wTextId = this.getBoxId() + pSubId;
			var wTextEle = this.getElement( wTextId );
			if ( !wTextEle ) return '';

			var wValue = wTextEle.value;

			return wValue;

		} catch(e) {
			throw { name: 'getSelectText.' + e.name, message: e.message };
		}
	};

	// 背景色取得
	clsMenuRelation.prototype.getSelectColor = function( pSubId ) {
		try {
			var wColorId = this.getBoxId() + pSubId;
			var wColorEle = this.getElement( wColorId );
			if ( !wColorEle ) return '';

			var wValue = this.getStyle( wColorEle, 'background-color' );

			return wValue;

		} catch(e) {
			throw { name: 'getSelectColor.' + e.name, message: e.message };
		}
	};

	// 設定内容初期化
	clsMenuRelation.prototype.initCondition = function( pRelationInf ) {
		try {
			var wId = this.getBoxId();

			// 種別
			var wStatEle = this.getElement( wId + '_stat' );
			if ( wStatEle ) {
				var wStatIdx = this._DEF_MENU_RELATION_VALUE.stat;
				// 種別有効時のみ値設定
				if ( this._RelationConfig.stat ) {
					if ( pRelationInf ) {
						wStatIdx = this.getSelectIndex( '_stat', pRelationInf.getStatus() );
					}
				}
				wStatEle.selectedIndex = wStatIdx;
			}

			// 関係
			var wRelEle = this.getElement( wId + '_rel' );
			if ( wRelEle ) {
				var wRelIdx = this._DEF_MENU_RELATION_VALUE.kind;
				// 関係有効時のみ値設定
				if ( this._RelationConfig.kind ) {
					if ( pRelationInf ) {
						wRelIdx = this.getSelectIndex( '_rel', pRelationInf.getRelation() );
					}
				}
				wRelEle.selectedIndex = wRelIdx;
			}

			// コメント
			var wCmtEle = this.getElement( wId + '_cmt' );
			if ( wCmtEle ) {
				var wComment = this._DEF_MENU_RELATION_VALUE.comment;
				// コメント有効時のみ値設定
				if ( this._RelationConfig.comment ) {
					if ( pRelationInf ) {
						wComment = pRelationInf.getComment();
					}
				}
				wCmtEle.value = wComment;
			}

			// 方向
			var wWayEle = this.getElement( wId + '_way' );
			if ( wWayEle ) {
				var wWayIdx = this._DEF_MENU_RELATION_VALUE.way;
				// 方向有効時のみ値設定
				if ( this._RelationConfig.way ) {
					if ( pRelationInf ) {
						wWayIdx = this.getSelectIndex( '_way', pRelationInf.getWorkWay() );
					}
				}
				wWayEle.selectedIndex = wWayIdx;
			}

			// 色
			if ( pRelationInf ) {
				this.eventMenuColorSelect( {}, { kind: 'select', color: pRelationInf.getColor() } );

			} else {
				this.eventMenuRelChange();

			}

		} catch(e) {
			throw { name: 'initCondition.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// イベント
	// **************************************************************

	// イベントキャンセル
	clsMenuRelation.prototype.cancelRelationEvent = function() {
		try {
			// カラーメニュー閉じる
			if ( this._RelationMenuColor ) {
				this._RelationMenuColor.hideMenu();

			}

		} catch(e) {
			throw { name: 'cancelRelationEvent.' + e.name, message: e.message };
		}
	};

	// メニュー要素にイベント設定
	clsMenuRelation.prototype.setRelationEvent = function( pDelete ) {
		try {
			var wId = this.getBoxId();

			// 関係選択イベント追加
			if ( this._RelationConfig.kind ) {
				var wRelId = wId + '_rel';
				var wRelEle = this.getElement( wRelId );
				if ( wRelEle ) {
					if ( !pDelete ) {
						this.addEvent( wRelEle, 'onchange', this.eventMenuRelChange );
					} else {
						this.delEvent( wRelEle, 'onchange', this.eventMenuRelChange );
					}

				}
			
			}

			// 色変更イベント追加
			var wColorId = wId + '_color';
			var wColorEle = this.getElement( wColorId );
			if ( wColorEle ) {
				if ( !pDelete ) {
					this.addEvent( wColorEle, 'onclick', this.eventMenuColorOpen );
				} else {
					this.delEvent( wColorEle, 'onclick', this.eventMenuColorOpen );
				}

			}

			// ボタン押下
			var wCancelId = wId + '_cancel';
			var wCancelEle = this.getElement( wCancelId );
			if ( wCancelEle ) {
				if ( !pDelete ) {
					this.addEvent( wCancelEle, 'onclick', this.eventMenuCancel );
				} else {
					this.delEvent( wCancelEle, 'onclick', this.eventMenuCancel );
				}

			}

			var wOkId = wId + '_ok';
			var wOkEle = this.getElement( wOkId );
			if ( wOkEle ) {
				if ( !pDelete ) {
					this.addEvent( wOkEle, 'onclick', this.eventMenuOk );
				} else {
					this.delEvent( wOkEle, 'onclick', this.eventMenuOk );
				}

			}

		} catch(e) {
			throw { name: 'setRelationEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// メニュー設定
	// **************************************************************

	// html設定
	clsMenuRelation.prototype.createContents = function( ) {
		try {
			var wBeseEle = this.getBoxElement();
			if ( !wBeseEle ) return false;

			function setSelectLine( pId, pTitle, pList, pDisabled, pDisplay ) {
				var wDisabled = '';
				if ( pDisabled == true ) {
					wDisabled = 'disabled';
				}

				var wDisplay = '';
				if ( typeof pDisplay == 'boolean' ) {
					if ( !pDisplay ) {
						wDisplay = " style='display: none;' ";
					}
				}

				var wHtml = '';
				wHtml += "<tr" + wDisplay + ">"
				wHtml += "<td style='text-align: right; width: 60px;'>" + pTitle + "：</td>";
				wHtml += "<td>"
				wHtml += "<select id='" + pId + "' " + wDisabled + ">";
				for( var i = 0; i < pList.length; i++ ) {
					wHtml += "<option value='" + pList[i].value + "'>" + pList[i].name + "</option>";
				}
				wHtml += "</select>"
				wHtml += "</td>"
				wHtml += "</tr>"
				
				return wHtml;
			};

			var wId = this.getBoxId();
			var wMenuBase	= wId + '_base';

			var wMenuTag = '';
			wMenuTag += "<div id='" + wMenuBase + "' style='width: 100%;'>";

			wMenuTag += "<table class='cssMenuRelation-tbl'>";

			// カラムサイズ設定
			wMenuTag += "<colgroup>";
			wMenuTag += "<col style='width: 60px;'>";
			wMenuTag += "<col>";
			wMenuTag += "</colgroup>";

			// 状態
			wMenuTag += setSelectLine( wId + '_stat',	'状態',		this._RelationContents.getDefStat(), false, this._RelationConfig.stat );

			// 関係性
			wMenuTag += setSelectLine( wId + '_rel',	'関係',		this._RelationContents.getDefKind(), false, this._RelationConfig.kind );

			// コメント
			var wCmtDsp = '';
			if ( !this._RelationConfig.comment ) {
				wCmtDsp = " style='display: none;' ";
			}

			var wMenuCmt = wId + '_cmt';
			wMenuTag += "<tr" + wCmtDsp + ">"
			wMenuTag += "<td style='text-align: right;'>コメント：</td>";
			wMenuTag += "<td>"
			wMenuTag += "<input type='text' id='" + wMenuCmt + "' style='width: 100px; border: solid 1px black;' />";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			// 働きかけ
			wMenuTag += setSelectLine( wId + '_way',	'働きかけ',	this._RelationContents.getDefWay(), false, this._RelationConfig.way );

			var wMenuColor = wId + '_color';
			wMenuTag += "<tr>"
			wMenuTag += "<td style='text-align: right;'>色：</td>";
			wMenuTag += "<td>"
			wMenuTag += "<div id='" + wMenuColor + "' style='width: 32px; height: 32px; cursor : pointer; border: solid 1px black; background-color: black;'></div>";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			wMenuTag += "<tr>"
			wMenuTag += "<td colspan='2'>"
			wMenuTag += "<div style='width: 97%; height: 0px; margin-left: 2px; border-top: 1px solid #CCCCCC; border-bottom: 1px solid #999999;'></div>";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			wMenuTag += "<tr>"
			wMenuTag += "<td colspan='2' style='text-align: center;'>"

			var wMenuCancel = wId + '_cancel';
			wMenuTag += "<input type='button' id='" + wMenuCancel + "' value='ｷｬﾝｾﾙ' style='padding: 3px 0px 3px 0px; text-align: center; width: 50px;' />";

			var wMenuOk = wId + '_ok';
			wMenuTag += "<input type='button' id='" + wMenuOk + "' value='OK'    style='padding: 3px 0px 3px 0px; text-align: center; width: 50px; margin-left: 10px;' />";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			wMenuTag += "</table>";

			wMenuTag += "</div>";

			wBeseEle.innerHTML += wMenuTag;

		} catch(e) {
			throw { name: 'createContents.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニューを表示する
	clsMenuRelation.prototype.dspMenu = function( pParam ) {
		try {
			// 表示モード初期値：新規
			this._RelationMode = 'insert';

			var wRelationInf = null;
			if ( pParam ) {
				// 初期表示情報設定
				wRelationInf = pParam.relationInf
				if ( wRelationInf ) {
					// 表示モード：更新
					this._RelationMode = 'update';
				}

			}
			// 設定値初期化
			this.initCondition( wRelationInf );

			// 継承元メニュー表示
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.dspMenu.' + e.name, message: e.message };
		}
	};

	// メニューを非表示
	clsMenuRelation.prototype.hideMenu = function() {
		try {
			// 関係設定画面の処理中イベント解除
			this.cancelRelationEvent();

			// 継承元非表示処理
			if ( this._MenuPrototype ) {
				this._MenuPrototype.hideMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.hideMenu.' + e.name, message: e.message };
		}
	};

	// メニュー要素を初期設定
	clsMenuRelation.prototype.createMenu = function() {
		try {
			// html設定
			this.createContents();

			// イベント設定
			this.setRelationEvent( false );

			// サイズ設定
			var wHeight = this._DEF_MENU_RELATION_SIZE.height;
			for( var wKey in this._RelationConfig ) {
				if ( !this._RelationConfig[wKey] ) wHeight -= this._DEF_MENU_RELATION_LINE_HEIGHT;
			}

			this.setBoxStyle( { height: (wHeight + 'px'), width: (this._DEF_MENU_RELATION_SIZE.width + 'px') } );

			// 継承元初期設定
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.createMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsMenuRelation.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_RELATION_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu-relation」
				wInitArgument.kind = this._DEF_MENU_RELATION_KIND;
			}

			// メニュー設定取得
			var wAutoClose = false;

			var wMenuConfig = null;
			if ( this.isObject(pArgument) ) {
				if ( 'config' in pArgument ) {
					if ( this.isObject(pArgument.config) ) wMenuConfig = pArgument.config;
				}
			}

			if ( wMenuConfig ) {
				if ( 'autoClose' in wMenuConfig ) wAutoClose = wMenuConfig.autoClose;

				// 表示情報設定
				for( var wKindKey in this._RelationConfig ) {
					if ( wKindKey in wMenuConfig ) {
						this._RelationConfig[wKindKey] = wMenuConfig[wKindKey];
					}
				}
			
			}

			// 自動close設定
			wInitArgument.autoClose = wAutoClose;

			// 関係情報クラス生成
			// ※ BOX生成なし
			this._RelationContents = new clsItemRelation( wInitArgument, false );

			// 継承元コンストラクタ
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// クラス追加
			this.setBoxClass( 'cssMenuRelation-base' );

			// ------------------------
			// 共通メニュー設定
			// ------------------------

			// カラーメニュー生成
			var wColorMenu = this.loadPublicMenu( 'color' );
			if ( !wColorMenu ) {
				this._RelationMenuColor = new clsColorBox( { callback: this.eventMenuColorSelect } );

			} else {
				this._RelationMenuColor = wColorMenu;

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsMenuRelation.prototype.freeClass = function() {
		try {
			// イベント削除
			this.execFunction( this.setRelationEvent, true );

			// プロパティ開放
			if ( this._RelationContents ) {
				if ( this._RelationContents.freeClass ) this._RelationContents.freeClass();
			}
			this._RelationContents				= null;
			this._RelationMenuColor				= null;
			this._RelationConfig				= null;


			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
