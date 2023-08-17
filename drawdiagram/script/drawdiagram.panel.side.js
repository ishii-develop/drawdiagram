// --------------------------------------------------------------------
//
// サイドパネルクラス
//
// --------------------------------------------------------------------
// clsPanelSide ← clsBaseBox
// --------------------------------------------------------------------
var clsPanelSide = function( pArgument ) {
	try {
		var self = this;

		this._DEF_PANEL_SIDE_KIND			= 'menu';

		this._DEF_PANEL_SIDE_PROPERTY		= {
			 'z-index'				: '40'
		};

		// 表示種別設定
		this._DEF_PANEL_SIDE_SELECT			= [
				  { value: 'select',	text: '選択項目のみ'	}
				, { value: 'person',	text: '人物のみ'		}
				, { value: 'group',		text: 'グループのみ'	}
		];

		// 継承元クラスのprototype
		this._BasePrototype					= null;

		// 項目同期用Callback
		this._PanelSidesLinkCallback		= [];

		// サイドパネル内容
		this._PanelSideEleFrame				= null;

		// サイドパネルメニュー有無
		this._PanelSideMenuIs				= false;

		// 編集メニュー
		this._PanelSideEleMenu				= null;
		this._PanelSideEleMenuList			= [];

		// 編集メニュー状態
		this._PanelSideEditMode				= '';

		// ステータス表示エリア
		this._PanelSideStatus				= null;
		this._PanelSideStatusId				= '';

		// 表示種別コンボボックス
		this._PanelSideSelectKind			= { 
			  element	: null
			, id		: ''
			, select	: -1
			, open		: false
			, selected	: false
		};

		// 同期項目
		this._PanelSideContents				= {
			  person		: null
			, group			: null
			, comment		: null
			, relation		: null
		};

		// サイドパネル上の項目
		this._PanelSideContentsEle			= {};

		// 画面ロック状態
		this._PanelSideLocked				= false;

		// 画面操作可否
		this._PanelSideValid				= true;

		// 項目操作可否
		this._PanelSideValidItem			= true;


		// **************************************************************
		// イベント処理　編集メニュー
		// **************************************************************

		// メニュー画面のメニュー　選択時処理
		this.eventMainMenuSelect = function( pEvent ) {
			try {
				// ロック中は処理なし
				if ( self._PanelSideLocked ) return false;

				// イベント停止
				self.cancelEvent( pEvent, true );

				// idからメニューkey取得
				var wId = this.id
				if ( !wId ) return false;

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


		// **************************************************************
		// イベント処理　同期オブジェクト操作時
		// **************************************************************

		// コンテキストメニュー
		this.eventSideStatusMenu = function( pEvent ) {
			try {
				// ロック中は処理なし
				if ( self._PanelSideLocked ) return false;

				// イベント停止
				self.cancelEvent( pEvent, true );

				// 操作有効時のみ処理
				if ( !self._PanelSideValid ) return false;
				if ( !self._PanelSideValidItem ) return false;

				// 対象項目取得
				var wId = this.id;
				if ( !wId ) return false;

				var wClickItm = self.getClickItem( wId );
				if ( !wClickItm ) return false;

				// 処理中イベント解除
				self.eventClear();

				// コンテキストメニュー表示
				self.execSideStatusContext( pEvent, wClickItm );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 項目選択イベント
		this.eventSideStatusItemClick = function( pEvent ) {
			try {
				// ロック中は処理なし
				if ( self._PanelSideLocked ) return false;

				// 操作有効時のみ処理
				if ( !self._PanelSideValid ) return false;
				if ( !self._PanelSideValidItem ) return false;

				// 種別選択中は処理なし
				if ( self._PanelSideSelectKind.open ) return false;
				// 種別選択終了
				self._PanelSideSelectKind.selected = false;

				// 選択項目のみ表示時は処理なし
				if ( self._PanelSideSelectKind.select == 'select' ) return false;

				// 左クリックのみ有効
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				// クリック位置項目チェック
				var wClickItm = self.chkItemOverlapToClick( pEvent );
				if ( !wClickItm ) return false;

				// イベント停止
				self.cancelEvent( pEvent, true );

				// 処理中イベント解除
				self.eventClear();

				// メインコンテンツへ項目選択通知
				self.execLinkCallback( { kind: 'select' }, wClickItm );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// イベント処理　自オブジェクト操作時
		// **************************************************************

		// 表示種別Open時イベント
		this.eventSelectOpen = function( pEvent ) {
			try {
				if ( self._PanelSideSelectKind.open )     return false;
				if ( self._PanelSideSelectKind.selected ) return false;

				// イベント停止
				self.cancelEvent( pEvent, true );
				
				// 処理中イベント解除
				self.eventClear();

				// 種別選択中
				self._PanelSideSelectKind.open     = true;
				self._PanelSideSelectKind.selected = false;

				return true;

			} catch(e) {
				self.catchErrorDsp(e);

			}
			return false;
		};

		// 表示種別Close時イベント
		this.eventSelectClose = function( pEvent ) {
			try {
				// 種別選択解除
				self._PanelSideSelectKind.open     = false;
				self._PanelSideSelectKind.selected = false;

			} catch(e) {
				self.catchErrorDsp(e);

			}
			return false;
		};

		// 表示種別選択時イベント
		// ※ eventSelectOpen後に種別を選択すると発生
		this.eventSelectKind = function( pEvent ) {
			try {
				if ( !self._PanelSideSelectKind.element ) return false;

				// イベント停止
				self.cancelEvent( pEvent, true );

				var wCmbEle = self._PanelSideSelectKind.element;
				var wSelected = wCmbEle.options[wCmbEle.selectedIndex];
				if ( !wSelected ) return false;

				// 表示種別選択処理
				self.chgSelectKind( wSelected.value );

				// 種別選択終了
				self._PanelSideSelectKind.open     = false;
				self._PanelSideSelectKind.selected = true;

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
		this._BasePrototype = clsBaseBox.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsBaseBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsPanelSide.' + e.name, message: e.message };
	}
};

// サイドパネル prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsPanelSide, clsBaseBox );

	// **************************************************************
	// プロパティ設定
	// **************************************************************

	// 同期設定 - 項目
	clsPanelSide.prototype.setLinkItem = function( pLinkItems ) {
		try {
			if ( !pLinkItems ) return false;

			this._PanelSideContents.person = pLinkItems;

			return true;

		} catch(e) {
			throw { name: 'setLinkItem', message: e.message };

		}
	};

	// 同期設定 - グループ
	clsPanelSide.prototype.setLinkGroup = function( pLinkGroups ) {
		try {
			if ( !pLinkGroups ) return false;

			this._PanelSideContents.group = pLinkGroups;

			return true;

		} catch(e) {
			throw { name: 'setLinkGroup', message: e.message };

		}
	};

	// 同期設定 - 関連付け中継点
	clsPanelSide.prototype.setLinkRelation = function( pLinkRelations ) {
		try {
			if ( !pLinkRelations ) return false;

			this._PanelSideContents.relation = pLinkRelations;

			return true;

		} catch(e) {
			throw { name: 'setLinkRelation', message: e.message };

		}
	};

	// 項目同期
	clsPanelSide.prototype.setLinkContents = function( pLinkContents ) {
		try {
			if ( !pLinkContents ) return false;

			// 項目（人物）
			if ( pLinkContents.person ) {
				this.setLinkItem( pLinkContents.person );
			}

			// グループ
			if ( pLinkContents.group ) {
				this.setLinkGroup( pLinkContents.group );
			}

			// 関連付け中継点
			if ( pLinkContents.relation ) {
				this.setLinkRelation( pLinkContents.relation );
			}

			return true;

		} catch(e) {
			throw { name: 'setLinkContents', message: e.message };

		}
	};

	// 項目同期
	clsPanelSide.prototype.getLinkContents = function( pItemId ) {
		try {
			// 項目（人物）
			if ( this._PanelSideContents.person ) {
				if ( pItemId in this._PanelSideContents.person ) {
					return this._PanelSideContents.person[pItemId];
				}
			}

			// グループ
			if ( this._PanelSideContents.group ) {
				if ( pItemId in this._PanelSideContents.group ) {
					return this._PanelSideContents.group[pItemId];
				}
			}

			// 関連付け中継点
			if ( this._PanelSideContents.relation ) {
				if ( pItemId in this._PanelSideContents.relation ) {
					return this._PanelSideContents.relation[pItemId];
				}
			}

			// コメント
			if ( this._PanelSideContents.comment ) {
				if ( pItemId in this._PanelSideContents.comment ) {
					return this._PanelSideContents.comment[pItemId];
				}
			}

			return null;

		} catch(e) {
			throw { name: 'getLinkContents', message: e.message };

		}
	};

	// 画面の操作可否設定
	clsPanelSide.prototype.setControlValid = function( pValid ) {
		try {
			// 操作可否設定
			this._PanelSideValid = pValid;

			// 表示種別操作
			if ( this._PanelSideSelectKind.element ) {
				this._PanelSideSelectKind.element.disabled = !pValid;
			}

		} catch(e) {
			throw { name: 'setControlValid.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 　情報取得
	// **************************************************************

	// 操作種別の対象範囲チェック
	clsPanelSide.prototype.isAllTarget = function( pKind ) {
		try {
			var wTargetAll = false;

			switch(pKind) {
			// 初期化
			case 'init':
				wTargetAll = true;
				break;
			
			// 再表示
			case 'reset':
				wTargetAll = true;
				break;

			// 編集モード変更
			case 'edit':
				wTargetAll = true;
				break;

			}
			return wTargetAll;

		} catch(e) {
			throw { name: 'isAllTarget.' + e.name, message: e.message };
		}
	};

	// 表示対象取得　項目
	clsPanelSide.prototype.getSideStatusDspItems = function( ) {
		try {
			if ( !this._PanelSideContents.person ) return null;
			
			var wDspItems = {};
			// 重要度順に設定
			for( var wKey in this._PanelSideContents.person ) {
				wDspItems[wKey] = this._PanelSideContents.person[wKey];

			}

			return wDspItems;

		} catch(e) {
			throw { name: 'getSideStatusDspItems', message: e.message };

		}
	};

	// 表示対象取得　グループ
	clsPanelSide.prototype.getSideStatusDspGroups = function( ) {
		try {
			if ( !this._PanelSideContents.group ) return null;
			
			var wDspGroups = {};

			// 重要度順に設定
			for( var wKey in this._PanelSideContents.group ) {
				wDspGroups[wKey] = this._PanelSideContents.group[wKey];

			}

			return wDspGroups;

		} catch(e) {
			throw { name: 'getSideStatusDspGroups', message: e.message };

		}
	};

	// 表示対象取得　関連付け中継点
	clsPanelSide.prototype.getSideStatusDspRelation = function( ) {
		try {
			if ( !this._PanelSideContents.relation ) return null;
			
			var wDspRelation = {};

			// 重要度順に設定
			for( var wKey in this._PanelSideContents.relation ) {
				wDspRelation[wKey] = this._PanelSideContents.relation[wKey];

			}

			return wDspRelation;

		} catch(e) {
			throw { name: 'getSideStatusDspRelation', message: e.message };

		}
	};

	// 表示対象取得　選択項目
	clsPanelSide.prototype.getSideStatusDspSelect = function( ) {
		try {
			var wSelectMain	= {};
			var wSelectRel	= {};

			// 項目取得
			var wDspItems = this.getSideStatusDspItems();
			var wDspGroup = this.getSideStatusDspGroups();

			if ( (!wDspItems) && (!wDspGroup) ) return null;

			var wMainParent = {};

			// 選択項目取得
			var wSelId;
			var wSelItem;
			for( var wSelKey in wDspItems ) {
				// 選択項目以外は対象外
				wSelItem = wDspItems[wSelKey];
				if ( !wSelItem.selectItemIs() && !wSelItem.selectItemRelIs() ) continue;
				
				// 対象に追加
				wSelId = wSelItem.getBoxId();
				if ( wSelItem.selectItemIs() ) {
					wSelectMain[wSelId] = wSelItem;

					// 主選択項目の親IDを保存
					wMainParent[wSelItem.getParentId()] = wSelId;

				} else {
					wSelectRel[wSelId] = wSelItem;

				}

			}

			// 選択グループ取得
			var wMainFlg;
			var wMainId = '';

			var wGrpId;
			var wParentId;

			var wGrpItem;
			for( var wGrpKey in wDspGroup ) {
				wGrpItem = wDspGroup[wGrpKey];
				wGrpId = wGrpItem.getBoxId();

				// 選択項目以外は対象外
				wMainFlg = wGrpItem.selectItemIs();
				if ( !wMainFlg && !wGrpItem.selectItemRelIs() ) {
					// 主選択項目が所属するかチェック
					wMainId = '';
					for( var wChkId in wMainParent ) {
						if ( wChkId == wGrpId ) {
							wMainId = wMainParent[wChkId];
							break;
						}
					}
					if ( wMainId.length == 0 ) continue;
					
					// 主選択項目が所属するグループを主選択に変更
					wMainFlg = true;
				}

				// グループを対象に追加
				if ( wMainFlg ) {
					wSelectMain[wGrpId]	= wGrpItem;
					if ( wMainId.length > 0 ) delete wSelectMain[wMainId];

				} else {
					wSelectRel[wGrpId]	= wGrpItem;

				}

				// グループに所属する項目を対象リストから削除
				for( var wItmKey in wSelectRel ) {
					wParentId = wSelectRel[wItmKey].getParentId();
					if ( wParentId != wGrpId ) continue;
					
					delete wSelectRel[wItmKey];
					
				}
			}

			var wSelectItems = {};
			this.copyProperty( wSelectMain	, wSelectItems );
			this.copyProperty( wSelectRel	, wSelectItems );

			return wSelectItems;

		} catch(e) {
			throw { name: 'getSideStatusDspSelect' + e.name, message: e.message };

		}
	};

	// 表示対象取得
	clsPanelSide.prototype.getSideStatusDspAll = function( ) {
		try {
			var wGroupItems = {};
			
			// 項目取得
			var wDspItems = this.getSideStatusDspItems();
			var wDspGroup = this.getSideStatusDspGroups();

			if ( (!wDspItems) && (!wDspGroup) ) return null;

			if ( wDspItems ) {
				var wParentId;
				var wParentItem;

				var wChkId;
				var wChkItem;
				for( var wChkKey in wDspItems ) {
					wChkItem = wDspItems[wChkKey];

					// 親チェック
					wParentId = wChkItem.getParentId();
					if ( wParentId in wDspGroup ) {
						// グループを表示対象として項目を表示対象から削除
						wParentItem = wDspGroup[wParentId];
						if ( wParentItem ) {
							for( var wDelKey in wDspItems ) {
								if ( wDspItems[wDelKey].getParentId() == wParentId ) {
									delete wDspItems[wDelKey];
								}
							}
						
							wGroupItems[wParentId] = wParentItem;
							delete wDspGroup[wParentId];
						}

					// グループに所属しない項目
					} else {
						wChkId = wChkItem.getBoxId();
						wGroupItems[wChkId] = wChkItem;

					}

				}

			}

			// 項目の所属しないグループ
			if ( wDspGroup ) {
				for( var wItemKey in wDspGroup ) {
					wGroupItems[wItemKey] = wDspGroup[wItemKey];

				}

			}
			
			return wGroupItems;

		} catch(e) {
			throw { name: 'getSideStatusDspAll.' + e.name, message: e.message };

		}
	};

	// **************************************************************
	// 　表示情報設定 - 詳細
	// **************************************************************

	// 情報DIV設定　背景色（style）
	clsPanelSide.prototype.setSideStatusInfoBgColor = function( pItem, pDivEle ) {
		try {
			// 背景色を取得
			var wColor = pItem.getItemColor();

			// Styleへ設定
			if ( wColor ) {
				this.setStyle( pDivEle, { 'background-color': wColor } );

			}
			return true;

		} catch(e) {
			throw { name: 'setSideStatusInfoBgColor.' + e.name, message: e.message };

		}
	};

	// 情報DIV設定　Border（class）
	clsPanelSide.prototype.setSideStatusInfoBorder = function( pItem, pDivEle ) {
		try {
			// Border（class）を同期
			var wClass = '';

			// 選択中
			if ( pItem.chkItemClass('cssItem-sel') ) {
				wClass = 'cssItem-sel';
				// 関連選択を解除
				this.delClass( pDivEle, 'cssItem-sel-rel' );

			// 関連選択中
			} else if ( pItem.chkItemClass('cssItem-sel-rel') ) {
				wClass = 'cssItem-sel-rel';
				// 選択を解除
				this.delClass( pDivEle, 'cssItem-sel' );

			// 以外
			} else {
				// 全て解除
				this.delClass( pDivEle, 'cssItem-sel' );
				this.delClass( pDivEle, 'cssItem-sel-rel' );

			}

			// クラス追加
			if ( wClass.length > 0 ) {
				if ( !this.chkClass(pDivEle, wClass) ) {
					this.addClass( pDivEle, wClass );
				}
			}

		} catch(e) {
			throw { name: 'setSideStatusInfoBorder.' + e.name, message: e.message };

		}
	};

	// 情報初期化
	clsPanelSide.prototype.initSideStatus = function( ) {
		try {
			// 情報表示エリアクリア
			this.clearSideStatus();

			// 表示種別　初期化
			var wCmbEle = this._PanelSideSelectKind.element;
			if ( wCmbEle ) {
				wCmbEle.selectedIndex = 0;

				var wSelected = wCmbEle.options[0];
				if ( wSelected ) {
					this._PanelSideSelectKind.select = wSelected.value;
				} else {
					this._PanelSideSelectKind.select = -1;
				}

			}

		} catch(e) {
			throw { name: 'initSideStatus.' + e.name, message: e.message };

		}
	};

	// 情報再設定
	clsPanelSide.prototype.setSideStatusHtml = function( pItem ) {
		try {
			var wItemId		= pItem.getBoxId();
			var wItemKind	= pItem.getBoxKind();

			// 情報内容DIV生成
			var wInfId = this._PanelSideStatusId + '_' + wItemId + '_inf';
			var wInfEle = this.getElement( wInfId );
			if ( !wInfEle ) {
				wInfEle = this.addElement( 'div', wInfId );
				if ( !wInfEle ) return null;

				this.addClass( wInfEle, 'cssSide-item-value' );

			}

			if ( wItemKind == 'item-group' ) {
				this.setSideStatusHtmlGroup( wInfEle, pItem );
			} else {
				this.setSideStatusHtmlItem( wInfEle, pItem );
			}

			return wInfEle;

		} catch(e) {
			throw { name: 'setSideStatusHtml.' + e.name, message: e.message };

		}
	};

	// ステータス設定（項目）
	clsPanelSide.prototype.setSideStatusHtmlItem = function( pElement, pItem ) {
		try {
			if ( !pElement ) return false;
			if ( !pItem ) return false;
			
			// 表示内容取得
			var wStatus = this.getSideStatusValue( pItem );

			var wBackground = '';
			var wElement = pItem.getBoxElement();
			if ( wElement ) {
				wBackground = wElement.style.backgroundImage;
				if ( wBackground ) wBackground = " style='background-image: " + wBackground + ";' "
			}

			var wHtml = '';
			wHtml += "<div class='cssSide-stat-icon' " + wBackground + "></div>";

			var wTitle = wStatus.title.trim();
			if ( wTitle.length > 0 ) {
				wTitle = "（" + wTitle + "）"
				wHtml += "<div style='width: 180px; float: left;' class='font-small'>" + this.toHtml(wTitle) + "</div>";
			}

			wHtml += "<div style='width: 140px; float: left;'>" + this.toHtml(wStatus.name) + "</div>";
			var wAge = wStatus.age.trim();
			if ( wAge.length > 0 ) wAge += '歳';
			wHtml += "<div style='width:  34px; float: right; text-align: right; padding-right: 3px;'>" + this.toHtml(wAge) + "</div>";

			wHtml += "<div style='width: 180px; float: left;' class='font-small'>" + this.toHtml(wStatus.kana) + "</div>";

			// 連絡先設定
			var wContact = this.getSideContactValue( pItem );
			wHtml += "<table class='cssSide-stat-tbl' cellpadding='0' cellspacing='0' style='clear: both;'>";

			var wContactHtml;
			for( var wKey in wContact ) {
				// 番号未設定は非表示
				if ( wContact[wKey].no.trim().length > 0 ) {
					wContactHtml = '';
					wContactHtml += "<td style='text-align: right;'><div style='width: 100%;'>" + this.toHtml(wContact[wKey].name) + "</div></td>";
					wContactHtml += "<td style='width:  16px; text-align: center;'>：</td>";
					wContactHtml += "<td style='width: 100px;text-align: left;'><div style='width: 98%;'>" + this.toHtml(wContact[wKey].no) + "</div></td>";

					wHtml += "<tr>" + wContactHtml + "</tr>";
				}
			}
			wHtml += "</table>";

			// コメント設定
			var wComment = '';
			if ( typeof pItem.getCommentValues == 'function' ) {
				wComment = pItem.getCommentValues();
			}
			wHtml += "<div>" + this.toHtml(wComment) + "</div>";
			pElement.innerHTML = wHtml;

			return true;

		} catch(e) {
			throw { name: 'setSideStatusHtmlItem.' + e.name, message: e.message };

		}
	};

	// ステータス設定（グループ）
	clsPanelSide.prototype.setSideStatusHtmlGroup = function( pElement, pItem ) {
		try {
			if ( !pElement ) return false;
			if ( !pItem ) return false;
			
			// 表示内容取得
			var wStatus = this.getSideStatusValue( pItem );

			var wHtml = '';
			if ( wStatus.title.trim().length > 0 ) {
				var wTitle = wStatus.title;
				if ( (wStatus.name.trim().length > 0) || (wStatus.kana.trim().length > 0) ) {
					wTitle = "【" + wTitle + "】"
				}
				wHtml += "<div>" + this.toHtml(wTitle) + "</div>";
			}
			wHtml += "<div>" + this.toHtml(wStatus.name) + "</div>";
			wHtml += "<div class='font-small'>" + this.toHtml(wStatus.kana) + "</div>";

			var wContact = this.getSideContactValue( pItem );
			wHtml += "<table class='cssSide-stat-tbl' cellpadding='0' cellspacing='0' style='clear: both;'>";

			// 連絡先設定
			var wContactHtml;
			for( var wKey in wContact ) {
				// 番号未設定は非表示
				if ( wContact[wKey].no.trim().length > 0 ) {
					wContactHtml = '';
					wContactHtml += "<td style='text-align: right;'><div style='width: 100%;'>" + this.toHtml(wContact[wKey].name) + "</div></td>";
					wContactHtml += "<td style='width:  16px; text-align: center;'>：</td>";
					wContactHtml += "<td style='width: 100px;text-align: left;'><div style='width: 98%;'>" + this.toHtml(wContact[wKey].no) + "</div></td>";

					wHtml += "<tr>" + wContactHtml + "</tr>";
				}
			}
			wHtml += "</table>";

			pElement.innerHTML = wHtml;

			return true;

		} catch(e) {
			throw { name: 'setSideStatusHtmlGroup.' + e.name, message: e.message };

		}
	};

	// 表示ステータス取得
	clsPanelSide.prototype.getSideStatusValue = function( pItem ) {
		try {
			var wStatList = pItem.getStatusValues();

			var wRetStat = { name: '', kana: '' };

			if ( wStatList ) {
				this.copyProperty( wStatList, wRetStat );

			}
			return wRetStat;

		} catch(e) {
			throw { name: 'getSideStatusValue', message: e.message };

		}
	};

	// 表示連絡先取得
	clsPanelSide.prototype.getSideContactValue = function( pItem ) {
		try {
			var wContactList = pItem.getContactValues();

			var wRetContact = {};

			if ( wContactList ) {
				this.copyProperty( wContactList, wRetContact );

			}
			return wRetContact;

		} catch(e) {
			throw { name: 'getSideContactValue', message: e.message };

		}
	};


	// **************************************************************
	// 　表示情報設定
	// **************************************************************

	// 情報設定
	clsPanelSide.prototype.setSideStatusInfo = function( pItem ) {
		try {
			if ( !pItem ) return null;

			var wItmId = pItem.getBoxId();
			var wParent = ( pItem.getParentId().length > 0 );

			var wDivId = this._PanelSideStatusId + '_' + wItmId + '_base';

			var wDivEle = this.addElement( 'div', wDivId );
			if ( !wDivEle ) return null;

			// 情報内容DIV生成
			var wInfEle = this.setSideStatusHtml( pItem );
			if ( !wInfEle ) return null;

			// 情報DIVへ追加
			this.appendElementToParent( wDivEle, wInfEle );

			// 基本class設定
			this.addClass( wDivEle, 'cssSide-item' );

			var wColor = 'cssItem-color-base';
			var wItemKind = pItem.getBoxKind();
			switch( wItemKind ) {
			case 'item-person':
				wColor = 'cssItem-color-person';
				break;
			
			case 'item-group':
				wColor = 'cssItem-color-group';
				break;
			
			case 'item-comment':
				wColor = 'cssItem-color-comment';
				break;
			
			case 'item-relation':
				wColor = 'cssItem-color-relation';
				break;
			
			}
			this.addClass( wDivEle, wColor );

			// 背景色を同期
			this.setSideStatusInfoBgColor( pItem, wDivEle );

			// Borderを同期
			this.setSideStatusInfoBorder( pItem, wDivEle );

			// コンテキストメニュー設定
			this.addEvent( wDivEle, 'oncontextmenu', this.eventSideStatusMenu );

			// 情報要素保存
			this._PanelSideContentsEle[wDivId] = { id: wItmId, parent: wParent, element: wDivEle };

			return wDivEle;

		} catch(e) {
			throw { name: 'setSideStatusInfo.' + e.name, message: e.message };

		}
	};

	// 色再設定
	clsPanelSide.prototype.resetSideStatusColor = function( pItem ) {
		try {
			if ( !pItem ) return false;

			var wDivEle = this.getSideStatusInfo( pItem.getBoxId() );
			if ( !wDivEle ) return false;

			// 背景色を同期
			this.setSideStatusInfoBgColor( pItem, wDivEle );

			return true;

		} catch(e) {
			throw { name: 'resetSideStatusColor.' + e.name, message: e.message };

		}
	};

	// 情報枠設定
	clsPanelSide.prototype.setSideStatusFrame = function( pItem, pSelected ) {
		try {
			if ( !pItem ) return false;

			// 選択のみ表示時
			var wSelected = this._PanelSideSelectKind.select;
			if ( wSelected == 'select' ) {
				// 一覧再表示
				this.dspSideStatus();

			// 以外
			} else {
				// 選択項目のみ変更
				var wDivEle = this.getSideStatusInfo( pItem.getBoxId() );
				if ( !wDivEle ) return false;

				// Borderを同期
				this.setSideStatusInfoBorder( pItem, wDivEle );

			}
			return true;

		} catch(e) {
			throw { name: 'setSideStatusFrame.' + e.name, message: e.message };

		}
	};

	// 情報設定
	clsPanelSide.prototype.getSideStatusInfo = function( pItemId ) {
		try {
			var wDivEle = null;

			for( var wKey in this._PanelSideContentsEle ) {
				if( pItemId == this._PanelSideContentsEle[wKey].id ) {
					wDivEle = this._PanelSideContentsEle[wKey].element;
					break;
				}
			}

			return wDivEle;

		} catch(e) {
			throw { name: 'getSideStatusInfo', message: e.message };

		}
	};


	// **************************************************************
	// 　情報表示
	// **************************************************************

	// 項目をクリア
	clsPanelSide.prototype.clearSideStatus = function() {
		try {
			var self = this;

			// 子項目削除
			function clearItem( pItem ) {
				// イベント削除
				self.delEvent( pItem, 'oncontextmenu', self.eventSideStatusMenu );

				// 子項目削除
				self.delElement( pItem );
			}

			// 項目削除（子）
			for( var wKey in this._PanelSideContentsEle ) {
				if ( this._PanelSideContentsEle[wKey].parent ) continue;

				// 項目削除
				clearItem( this._PanelSideContentsEle[wKey].element );
				delete this._PanelSideContentsEle[wKey];
				
			}

			// 項目削除（親）
			for( var wKey in this._PanelSideContentsEle ) {
				// 項目削除
				clearItem( this._PanelSideContentsEle[wKey].element );
				delete this._PanelSideContentsEle[wKey];
				
			}

			// 保存情報初期化
			this._PanelSideContentsEle = {};


		} catch(e) {
			throw { name: 'clearSideStatus.' + e.name, message: e.message };

		}
	};

	// 項目を表示
	clsPanelSide.prototype.dspSideStatusInfo = function( pParentItem, pItem, pDspAll ) {
		try {
			if ( !pItem ) return false;

			// 情報表示
			var wDivEle = this.setSideStatusInfo( pItem );
			if ( !wDivEle ) return false;

			// 表示対象が全て　かつ　グループ表示
			if ( (pDspAll) && (pItem.getBoxKind() == 'item-group') ) {
				var wParentId = pItem.getBoxId();

				// グループ内項目表示
				if ( this._PanelSideContents.person ) {
					var wChiled;
					var wChiledEle;

					for( var wKey in this._PanelSideContents.person ) {
						wChiled = this._PanelSideContents.person[wKey];

						if ( wChiled.getParentId() == wParentId ) {
							// 子情報表示
							wChiledEle = this.setSideStatusInfo( wChiled );
							if ( !wChiledEle ) return false;

							this.setStyle( wChiledEle, { 'margin-left': '5px' } );
							this.appendElementToParent( wDivEle, wChiledEle );
						
						}
					}
				}

			}
			this.appendElementToParent( pParentItem, wDivEle );

		} catch(e) {
			throw { name: 'dspSideStatusInfo.' + e.name, message: e.message };

		}
	};

	// 表示対象項目を全て表示
	clsPanelSide.prototype.dspSideStatus = function() {
		try {
			if ( !this._PanelSideStatus ) return false;

			// 表示対象取得
			var wDspAll = false;
			var wSelected = this._PanelSideSelectKind.select;

			// 人物のみ
			if ( wSelected == 'person' ) {
				wDspItems = this.getSideStatusDspItems();

			// グループのみ
			} else if ( wSelected == 'group' ) {
				wDspItems = this.getSideStatusDspGroups();

			// 選択項目のみ
			} else if ( wSelected == 'select' ) {
				wDspItems = this.getSideStatusDspSelect();
				wDspAll = true;

			// 以外（全て）
			} else {
				wDspItems = this.getSideStatusDspAll();
				wDspAll = true;

			}
			if ( !wDspItems ) return false;

			// 情報表示エリア一旦クリア
			this.clearSideStatus();

			// 表示
			for( var wKey in wDspItems ) {
				// 項目設定
				this.dspSideStatusInfo( this._PanelSideStatus, wDspItems[wKey], wDspAll );

			}

		} catch(e) {
			throw { name: 'dspSideStatus.' + e.name, message: e.message };

		}
	};


	// **************************************************************
	// 　項目操作
	// **************************************************************

	// 表示種別選択時処理
	clsPanelSide.prototype.chgSelectKind = function( pValue ) {
		try {
			var wSelected = this._PanelSideSelectKind.select;

			// 選択値保存
			this._PanelSideSelectKind.select = pValue;
			
			if ( pValue !== wSelected ) {
				// 一覧再表示
				this.dspSideStatus();
			}

		} catch(e) {
			throw { name: 'chgSelectKind.' + e.name, message: e.message };

		}
	};

	// イベントを全てキャンセル
	clsPanelSide.prototype.eventClear = function() {
		try {
			// 登録されている処理を実行
			// ※メインコンテンツへ項目操作キャンセル通知
			this.execLinkCallback( { kind: 'cancel' }, null );

		} catch(e) {
			throw { name: 'eventClear', message: e.message };
		}
	};

	// クリック項目　項目取得
	clsPanelSide.prototype.getClickItem = function( pClickId ) {
		try {
			var wClickItm = null;

			if ( pClickId in this._PanelSideContentsEle ) {
				var wId = this._PanelSideContentsEle[pClickId].id;

				for( var wKind in this._PanelSideContents ) {
					if ( !this.isObject(this._PanelSideContents[wKind]) ) continue;
					
					if( wId in this._PanelSideContents[wKind] ) {
						wClickItm = this._PanelSideContents[wKind][wId];
						break;
					}
				}

			}

			return wClickItm;

		} catch(e) {
			throw { name: 'getClickItem', message: e.message };

		}
	};

	// クリック項目　コンテキストメニュー表示
	clsPanelSide.prototype.execSideStatusContext = function( pEvent, pClickItm ) {
		try {
			if ( !pClickItm.eventMenuDsp ) return;

			// 項目のメニュー表示
			var wDispParam = {
					  hide:		['move', 'resize', 'relation', 'relationChg', 'unrelation']
					, blank:	1
			};

			pClickItm.eventMenuDsp( pEvent, wDispParam );

		} catch(e) {
			throw { name: 'execSideStatusContext', message: e.message };

		}
	};

	// クリック位置に項目があるかチェック
	clsPanelSide.prototype.chkItemOverlapToClick = function( pEvent ) {
		try {
			var wEvtPos = this.getEventPos( pEvent );

			var wClickItem = null;
			var wChkItem;

			for( var wKey in this._PanelSideContentsEle ) {
				wChkItem = this._PanelSideContentsEle[wKey].element;

				if ( this.chkInPoint(wChkItem, wEvtPos) ) {
					// 選択要素の項目情報取得
					wClickItem = this.getLinkContents( this._PanelSideContentsEle[wKey].id );
					
					// 人物なら終了
					if ( wClickItem.isPerson() ) break;
				}

			}

			return wClickItem;

		} catch(e) {
			throw { name: 'chkItemOverlapToClick', message: e.message };
		}
	};


	// **************************************************************
	// メインメニュー画面のメニュー
	// **************************************************************

	// 編集モードメニュー変更
	clsPanelSide.prototype.chgEditModeMenu = function( pMenuId ) {
		try {
			// メニュー変更なしは処理なし
			if ( this._PanelSideEditMode == pMenuId ) return false;

			// 配置編集モード
			if ( pMenuId == this._DEF_MENU_ID_MOVE ) {
				// 項目操作を不可
				this._PanelSideValidItem = false;

			// 以外（通常モード）
			} else {
				// 項目操作を許可
				this._PanelSideValidItem = true;

			}

			// モード変更
			this._PanelSideEditMode = pMenuId;

			// メニュー変更
			this.chgMenuEditStyle( this._PanelSideEditMode );

			return true;

		} catch(e) {
			throw { name: 'chgEditModeMenu.' + e.name, message: e.message };
		}
	};

	// メインメニュー選択時処理
	clsPanelSide.prototype.execMainMenu = function( pEvent, pMenuId ) {
		try {
			var wRetVal = true;

			// 操作有効時のみ処理
			if ( !this._PanelSideValid ) return true;

			switch(pMenuId) {
			// 通常
			case this._DEF_MENU_ID_NORMAL:
				// 通常モードへ切替
				wRetVal = this.chgEditModeMenu( pMenuId );

				if ( wRetVal ) {
					// ※メインコンテンツへ編集モード変更通知
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_NORMAL }, null );
				}
				break;

			// 配置編集
			case this._DEF_MENU_ID_MOVE:
				// 配置編集モードへ切替
				wRetVal = this.chgEditModeMenu( pMenuId );

				if ( wRetVal ) {
					// ※メインコンテンツへ編集モード変更通知
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_MOVE }, null );
				}
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'execMainMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 　初期設定
	// **************************************************************

	// 編集メニュー設定
	clsPanelSide.prototype.createMenuElement = function() {
		try {
			// ステータス表示エリア生成
			var wMenuEle = this.addElement( 'div', this.getBoxId() + '_menu' );
			if ( !wMenuEle ) {
				throw { name: 'addElement', message: '要素が生成できません' };

			}

			this.addClass( wMenuEle, 'cssCommon-menu' );
			this.appendElementToParent( this._PanelSideEleFrame, wMenuEle );

			// 操作無効化
			this.addEvent( wMenuEle, 'onclick',			this.eventInvalid );
			this.addEvent( wMenuEle, 'oncontextmenu',	this.eventInvalid );

			// 要素保存
			this._PanelSideEleMenu = wMenuEle;

			// メニュー追加
			var wEditNormal = this.createMenuEditNormal( this._PanelSideEleMenu, this.eventMainMenuSelect );
			this._PanelSideEleMenuList.push( wEditNormal );

			var wEditMove = this.createMenuEditMove( this._PanelSideEleMenu, this.eventMainMenuSelect );
			this._PanelSideEleMenuList.push( wEditMove );
		
			return true;

		} catch(e) {
			throw { name: 'createMenuElement.' + e.name, message: e.message };

		}
	};

	// 表示種別選択コンボ設定
	clsPanelSide.prototype.initSelectCmb = function() {
		try {
			var wSelectItems = this._DEF_PANEL_SIDE_SELECT;
			if ( !wSelectItems ) return false;

			// 操作部生成
			var wCtrlEle = this.addElement( 'div', this.getBoxId() + '_control' );
			if ( !wCtrlEle ) return false;
			this.addClass( wCtrlEle, 'cssSide-control' );

			// タイトル
			var wTitleEle = this.addElement( 'div', this.getBoxId() + '_control_title' );
			if ( !wTitleEle ) return false;
			this.addClass( wTitleEle, 'cssSide-control-title' );

			wTitleEle.innerHTML = '表示項目';

			// コンボボックス生成
			var wCmbEle = this.addElement( 'select', this.getBoxId() + '_Kind' );
			if ( !wCmbEle ) return false;
			this.addClass( wCmbEle, 'cssSide-cmb' );

			// 操作部へ追加
			this.appendElementToParent( wCtrlEle, wTitleEle );
			this.appendElementToParent( wCtrlEle, wCmbEle );
			
			// 親へ追加
			this.appendElementToParent( this._PanelSideEleFrame, wCtrlEle );

			// 項目追加
			wCmbEle[wCmbEle.options.length] = new Option( '', -1 );

			var wItems;
			for( var wIndex=0; wIndex < wSelectItems.length; wIndex++ ) {
				wItems = wSelectItems[wIndex];
				if ( wItems ) {
					wCmbEle[wCmbEle.options.length] = new Option( wItems.text, wItems.value );

				}
			}
			
			// 選択時イベント設定
			this.addEvent( wCmbEle, 'onclick'		, this.eventSelectOpen );
			this.addEvent( wCmbEle, 'onchange'		, this.eventSelectKind );
			this.addEvent( wCmbEle, 'blur'			, this.eventSelectClose );

			// オブジェクトを保存
			this._PanelSideSelectKind.id		= wCmbEle.id;
			this._PanelSideSelectKind.element	= wCmbEle;

			return true;

		} catch(e) {
			throw { name: 'initSelectCmb.' + e.name, message: e.message };

		}
	};

	// ステータス表示エリア設定
	clsPanelSide.prototype.initStatPanel = function() {
		try {
			// ステータス表示エリア生成
			var wStatEle = this.addElement( 'div', this.getBoxId() + '_Stat' );
			if ( !wStatEle ) return false;

			this._PanelSideStatus	= wStatEle;
			this._PanelSideStatusId	= wStatEle.id;

			this.addClass( wStatEle, 'cssSide-stat' );
			this.appendElementToParent( this._PanelSideEleFrame, wStatEle );

			return true;

		} catch(e) {
			throw { name: 'initStatPanel.' + e.name, message: e.message };

		}
	};

	// サイドパネル内容設定
	clsPanelSide.prototype.createMainPanel = function( pArgument ) {
		try {
			// ステータス表示エリア生成
			var wFrameEle = this.addElement( 'div', this.getBoxId() + '_Frame' );
			if ( !wFrameEle ) return false;

			this.addClass( wFrameEle, 'cssSide-menu-frame' );
			this.appendBoxToParent( wFrameEle );

			// 内容要素保存
			this._PanelSideEleFrame = wFrameEle;

			// メニュー有効
			if ( this._PanelSideMenuIs ) {
				// メニュー表示エリア生成
				this.createMenuElement();
			}

			// 表示種別選択コンボ設定
			this.initSelectCmb();

			// ステータス表示エリア設定
			this.initStatPanel();

			// 初期表示
			var wDisplay = false;
			if ( pArgument ) {
				if ( pArgument.display ) wDisplay = true;
			}
			if ( wDisplay ) this.dspBox( true, false );

			return true;

		} catch(e) {
			throw { name: 'createMainPanel.' + e.name, message: e.message };

		}
	};


	// **************************************************************
	// 項目同期
	// **************************************************************

	// 編集モードメニュー変更
	// 　※メインオブジェクトからcallされる
	clsPanelSide.prototype.execChgEditModeNormal = function() {
		try {
			// 通常編集モードに変更
			this.chgEditModeMenu( this._DEF_MENU_ID_NORMAL );

		} catch(e) {
			throw { name: 'execChgEditModeNormal.' + e.name, message: e.message };
		}
	};

	// 同期項目変更時処理
	// 　※同期元オブジェクトからcallされる
	clsPanelSide.prototype.execLinkItemEvent = function( pArgument ) {
		try {
			if ( !this.isObject(pArgument) ) return false;

			if ( !('kind' in pArgument) ) return false;
			var wKind = pArgument.kind;

			// 全ての項目に対しての処理の場合は対象項目取得不要
			var wTarget;
			if ( !this.isAllTarget(wKind) ) {
				wTarget = pArgument.item;
				if ( typeof wTarget == 'undefined' ) return false;

				// コメント
				if ( wTarget.isComment() ) {
					// 処理なし
					return true;
				
				// 中継点
				} else if ( wTarget.isRelation() ) {
					// 処理なし
					return true;
				
				// グループ操作
				} else if ( wTarget.isGroup() ) {
					// 人物のみ表示時は処理なし
					if ( this._PanelSideSelectKind.select == 'person' ) return true;

					// 移動時は処理なし
					if ( wKind == 'move' ) return true;

				// 以外
				} else {
					// グループのみ表示時は処理なし
					if ( this._PanelSideSelectKind.select == 'group' ) return true;

				}

			}

			switch(wKind) {
			// 性別変更
			case 'gender':
				this.setSideStatusHtml( wTarget );
				break;

			// 状況変更
			case 'situation':
				this.setSideStatusHtml( wTarget );
				break;

			// 情報更新
			case 'status':
				this.setSideStatusHtml( wTarget );
				break;

			// 連絡先更新
			case 'contact':
				this.setSideStatusHtml( wTarget );
				break;

			// 色変更
			case 'color':
				this.resetSideStatusColor( wTarget );
				break;

			// 選択
			case 'select':
				this.setSideStatusFrame( wTarget, pArgument.selected );
				break;

			// 初期化処理
			case 'init':
				this.initSideStatus();
				break;

			// 編集モード変更
			case 'edit':
				this.chgEditModeMenu( pArgument.mode );
				break;

			// 全て再表示
			case 'reset':
				this.dspSideStatus();
				break;

			// 以外
			default:
				// 全て再表示
				this.dspSideStatus();
				break;
			
			}
			
			return true;

		} catch(e) {
			throw { name: 'execLinkItemEvent.' + e.name, message: e.message };
		}
	};

	// 同期オブジェクトへの項目変更通知イベント設定
	clsPanelSide.prototype.addLinkCallback = function( pEvtFnc ) {
		try {
			if ( !pEvtFnc ) return false;

			// 項目変更時処理追加
			this._PanelSidesLinkCallback.push( pEvtFnc );

		} catch(e) {
			throw { name: 'addLinkCallback', message: e.message };
		}
	};

	// 項目変更時処理
	// ※同期オブジェクトへ項目変更を通知
	clsPanelSide.prototype.execLinkCallback = function( pParam, pItem ) {
		try {
			if ( this._PanelSidesLinkCallback.length == 0 ) return true;

			// イベントオブジェクトへパラメータ設定
			var wCallbackParam = {};
			this.copyProperty( pParam, wCallbackParam );

			wCallbackParam.item		= pItem;

			for( var wIndex = 0; wIndex < this._PanelSidesLinkCallback.length; wIndex++ ) {
				if ( typeof this._PanelSidesLinkCallback[wIndex] == 'function' ) {
					// 登録されている処理を実行
					var wArguments = [];
					wArguments.push( wCallbackParam );

					this._PanelSidesLinkCallback[wIndex].apply( this, wArguments );

				}
			}
			return true;

		} catch(e) {
			throw { name: 'execLinkCallback.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsPanelSide.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_PANEL_SIDE_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu」
				wInitArgument.kind = this._DEF_PANEL_SIDE_KIND;

			}

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// 編集メニュー初期値
			this._PanelSideEditMode = this._DEF_MENU_ID_NORMAL;

			// パラメータ取得
			var wLocked		= false;
			var wSideMenu	= false;

			if ( this.isObject(pArgument) ) {
				if ( 'locked' in pArgument ) wLocked = pArgument.locked;

				// メニュー設定
				if ( 'menu' in pArgument ) {
					if ( 'sidepanel' in pArgument.menu ) wSideMenu = pArgument.menu.sidepanel;
				}
			}
			this._PanelSideLocked = wLocked;

			// ロック時はメニュー使用不可
			if ( !wLocked ) {
				this._PanelSideMenuIs = wSideMenu;
			}

			// クラス追加
			this.setBoxClass( 'cssSide-menu' );
			this.setBoxClass( 'no-print' );

			// ------------------------
			// イベント設定
			// ------------------------

			// コンテキストメニュー
			this.addBoxEvents( 'oncontextmenu' , this.eventInvalid );

			// 項目クリック
			this.addBoxEvents( 'onmousedown'	, this.eventSideStatusItemClick );

			// ------------------------
			// 同期用callback設定
			// ------------------------
			if ( pArgument ) {
				this.addLinkCallback( pArgument.callback );

			}

			// ------------------------
			// 内容設定
			// ------------------------
			this.createMainPanel( pArgument );


		} catch(e) {
			throw { name: 'clsPanelSide.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsPanelSide.prototype.freeClass = function() {
		try {
			// イベント削除
			if ( this._PanelSideSelectKind.element ) {
				this.execFunction( this.delEvent, this._PanelSideSelectKind.element, 'onchange', this.eventSelectKind );
				this.execFunction( this.delElement, this._PanelSideSelectKind.element );
			}
			this._PanelSideSelectKind		= null;

			this.execFunction( this.clearSideStatus );
			this._PanelSideStatus			= null;
			this._PanelSideContentsEle		= null;
			this._PanelSideEleFrame			= null;

			for( var wKey in this._PanelSideContents ) {
				this._PanelSideContents[wKey] = null;
			}

			for( var wCIdx = 0; this._PanelSidesLinkCallback.length; CIdx++ ) {
				this._PanelSidesLinkCallback[wCIdx] = null;
			}
			this._PanelSidesLinkCallback	= null;

			// 編集メニュー解放
			for( var wIdx = 0; wIdx < this._PanelSideEleMenuList.length; wIdx++ ){
				this._PanelSideEleMenuList[wIdx] = null;
			}
			
			if ( this._PanelSideEleMenu ) {
				this.execFunction( this.delEvent, this._PanelSideEleMenu, 'onclick',		this.eventInvalid );
				this.execFunction( this.delEvent, this._PanelSideEleMenu, 'oncontextmenu',	this.eventInvalid );
			}
			this._PanelSideEleMenu			= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};

}());
