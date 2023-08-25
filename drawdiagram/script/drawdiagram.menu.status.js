// --------------------------------------------------------------------
//
// ステータス表示クラス
//
// --------------------------------------------------------------------
// clsMenuStatus ← clsMenuBase ← clsBaseBox
// --------------------------------------------------------------------
var clsMenuStatus = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_STATUS_KIND				= 'menu-status';

		this._DEF_MENU_STATUS_PROPERTY			= {
			 'z-index'				: '1200'
		};

		// ステータスのstyle
		this._DEF_MENU_STATUS_LIST_PROPERTY		= {
			 'z-index'				: '1210'
		};

		// 継承元クラスのprototype
		this._MenuPrototype						= null;

		this._StatusList						= [];
		this._StatusListMax						= 0;
		this._StatusValue						= {};

		this._StatusAddCmd						= false;
		this._StatusAddList						= [];

		// **************************************************************
		// イベント処理
		// **************************************************************

		// 追加ボタン押下時イベント
		this.eventStatusAdd = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 連絡先を追加
				self.execAddStatus();

				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, { kind: 'close' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 閉じるボタン押下時イベント
		this.eventStatusCancel = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 閉じる
				self.hideMenu();

				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, { kind: 'close' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 確定ボタン押下時イベント
		this.eventStatusConfirm = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 閉じる
				self.hideMenu();

				// 設定内容保存
				var wStatList = self.getCallbackList();
				var wStatVal  = self.getCallbackValue();

				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, { kind: 'status', statusList: wStatList, statusValue: wStatVal } );

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
		throw { name: 'clsMenuStatus.' + e.name, message: e.message };
	}
};

// 基本メニュー prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsMenuStatus, clsMenuBase );


	// **************************************************************
	// プロパティ設定／取得
	// **************************************************************

	// ステータス内容が有効か
	clsMenuStatus.prototype.isStatusList = function() {
		try {
			if ( !this._StatusList ) return false;
			if ( !this._StatusList.length ) return false;
			
			return true;

		} catch(e) {
			throw { name: 'isStatusList', message: e.message };
		}
	};

	// ステータスの行番号取得
	clsMenuStatus.prototype.getStatusIndexByName = function( pKey ) {
		try {
			if ( !this._StatusList ) return -1;
			if ( !this._StatusList.length ) return -1;

			var wResultIdx = -1;

			var wStatusInf;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusInf = this._StatusList[wIdx][wCol];
				
					// KEY名称が一致すればindexを返す
					if ( pKey == wStatusInf.name ) {
						wResultIdx = wIdx;
						break;
					}
				}
				if ( wResultIdx >= 0 ) break;
			}

			return wResultIdx;

		} catch(e) {
			throw { name: 'getStatusIndexByName', message: e.message };
		}
	};

	// ステータス内容を初期設定
	clsMenuStatus.prototype.setStatusList = function( pArgument ) {
		try {
			var wArgMenu = pArgument.statusList;
			if ( !wArgMenu ) return false;

			// 一旦クリア
			this._StatusList = [];

			if ( this.isArray(wArgMenu) ) {
				// 内容を複写
				for( var wIdx = 0; wIdx < wArgMenu.length; wIdx++ ) {
					this._StatusList.push( wArgMenu[wIdx] );

				}

			// object指定
			} else if ( this.isObject(wArgMenu) ) {
				// Key順にソート
				var wSortMenu = this.sortNumObject( wArgMenu );
				// 配列にして設定
				for( var wKey in wSortMenu ) {
					if ( this.isArray(wSortMenu[wKey]) ) {
						this._StatusList.push( wSortMenu[wKey] );

					} else if( this.isObject(wSortMenu[wKey]) ) {
						this._StatusList.push( [ wSortMenu[wKey] ] );

					}
				}

			} else {
				return false;

			}

			return true;

		} catch(e) {
			throw { name: 'setStatusList', message: e.message };
		}
	};

	// ステータス内容（追加項目）を初期設定
	clsMenuStatus.prototype.setStatusAddList = function( pArgument ) {
		try {
			var wArgMenu = pArgument.statusAddList;
			if ( !wArgMenu ) return false;

			// 一旦クリア
			this._StatusAddList = [];

			if ( this.isArray(wArgMenu) ) {
				// 内容を複写
				for( var wIdx = 0; wIdx < wArgMenu.length; wIdx++ ) {
					this._StatusAddList.push( wArgMenu[wIdx] );

				}

			// object指定
			} else if ( this.isObject(wArgMenu) ) {
				// Key順にソート
				var wSortMenu = this.sortNumObject( wArgMenu );
				// 配列にして設定
				for( var wKey in wSortMenu ) {
					if ( this.isArray(wSortMenu[wKey]) ) {
						this._StatusAddList.push( wSortMenu[wKey] );

					} else if( this.isObject(wSortMenu[wKey]) ) {
						this._StatusAddList.push( [ wSortMenu[wKey] ] );

					}
				}

			} else {
				return false;

			}

			// 追加項目あれば追加有効
			if ( this._StatusAddList.length > 0 ) this._StatusAddCmd = true;

			return true;

		} catch(e) {
			throw { name: 'setStatusAddList', message: e.message };
		}
	};

	// ステータス設定値を保存
	clsMenuStatus.prototype.saveStatusValue = function( pArgument ) {
		try {
			var wArgValue = pArgument.statusValue;
			if ( !wArgValue ) return;

			// 一旦クリア
			this._StatusValue = {};

			for( var wKey in wArgValue ) {
				this._StatusValue[wKey] = wArgValue[wKey];
			}

		} catch(e) {
			throw { name: 'saveStatusValue', message: e.message };
		}
	};

	// 入力値を設定
	clsMenuStatus.prototype.setStatusValue = function() {
		try {
			if ( !this.isStatusList() ) return false;

			var wId;
			var wValue;
			var wStatusInf;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusInf = this._StatusList[wIdx][wCol];

					wId = this.getBoxId() + '_' + wStatusInf.name;

					wValue = this._StatusValue[wStatusInf.name];
					if ( typeof wValue == 'undefined' ) continue;

					// 要素に値を設定
					switch( wStatusInf.type ) {
					case 'text':
						this.setElementValue( wId, wValue );
						break;
					
					case 'text-combo':
						this.setElementValue( wId, wValue );
						break;
					
					case 'textarea':
						this.setElementValue( wId, wValue );
						break;
					
					case 'check':
						this.setElementChkVal( wId, wValue );
						break;
					}

				}

			}

		} catch(e) {
			throw { name: 'setStatusValue', message: e.message };
		}
	};

	// 返す設定内容を取得
	clsMenuStatus.prototype.getCallbackList = function() {
		try {
			if ( !this.isStatusList() ) return null;

			var wStatusList = {};

			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				var wStatusLine = [];
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusLine.push( {} );
					this.copyProperty( this._StatusList[wIdx][wCol], wStatusLine[wCol] );

				}

				wStatusList[(wIdx + 1)] = wStatusLine;

			}
			return wStatusList;

		} catch(e) {
			throw { name: 'getCallbackList', message: e.message };
		}
	};
	
	// 返す入力値を取得
	clsMenuStatus.prototype.getCallbackValue = function() {
		try {
			if ( !this.isStatusList() ) return null;

			var wStatusValue = {};

			var wId;
			var wStatusInf;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusInf = this._StatusList[wIdx][wCol];

					wId = this.getBoxId() + '_' + wStatusInf.name;

					// 要素の値を取得
					switch( wStatusInf.type ) {
					case 'text':
						wStatusValue[wStatusInf.name] = this.getElementValue( wId );
						break;
					
					case 'text-combo':
						wStatusValue[wStatusInf.name] = this.getElementValue( wId );
						break;
					
					case 'textarea':
						wStatusValue[wStatusInf.name] = this.getElementValue( wId );
						break;
					
					case 'check':
						wStatusValue[wStatusInf.name] = this.getElementChkVal( wId );
						break;
					}

				}

			}
			return wStatusValue;

		} catch(e) {
			throw { name: 'getCallbackValue', message: e.message };
		}
	};


	// **************************************************************
	// イベント設定
	// **************************************************************

	// イベントキャンセル
	clsMenuStatus.prototype.cancelStatusEvent = function() {
		try {
			// ※サブメニュー表示ある場合はここでclose

		} catch(e) {
			throw { name: 'cancelStatusEvent.' + e.name, message: e.message };
		}
	};

	// 追加ボタン　イベント設定
	clsMenuStatus.prototype.addAddEvent = function() {
		try {
			if ( !this._StatusAddCmd ) return;

			var wCloseId = this.getBoxId() +  '_cmd' + '_add';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventStatusAdd );

			}

		} catch(e) {
			throw { name: 'addAddEvent.' + e.name, message: e.message };
		}
	};

	// 閉じるボタン　イベント削除
	clsMenuStatus.prototype.delAddEvent = function() {
		try {
			if ( !this._StatusAddCmd ) return;

			var wCloseId = this.getBoxId() +  + '_cmd' + '_add';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventStatusAdd );

			}

		} catch(e) {
			throw { name: 'delAddEvent.' + e.name, message: e.message };
		}
	};

	// 閉じるボタン　イベント設定
	clsMenuStatus.prototype.addCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventStatusCancel );

			}

		} catch(e) {
			throw { name: 'addCancelEvent.' + e.name, message: e.message };
		}
	};

	// 閉じるボタン　イベント削除
	clsMenuStatus.prototype.delCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  + '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventStatusCancel );

			}

		} catch(e) {
			throw { name: 'delCancelEvent.' + e.name, message: e.message };
		}
	};

	// 確定ボタン　イベント設定
	clsMenuStatus.prototype.addConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventStatusConfirm );

			}

		} catch(e) {
			throw { name: 'addConfirmEvent.' + e.name, message: e.message };
		}
	};

	// 確定ボタン　イベント削除
	clsMenuStatus.prototype.delConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  + '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventStatusConfirm );

			}

		} catch(e) {
			throw { name: 'delConfirmEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 要素設定
	// **************************************************************

	// 行要素追加
	clsMenuStatus.prototype.addStatusLineBase = function( pIdx, pRefEle ) {
		try {
			var wId  = this.getBoxId() + '_status_' + String(pIdx);

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssStatus-line' );
			this.setStyle( wDivEle, this._DEF_MENU_STATUS_LIST_PROPERTY );

			this.appendBoxToParent( wDivEle, pRefEle );

			return wId;

		} catch(e) {
			throw { name: 'addStatusLineBase.' + e.name, message: e.message };
		}
	};

	// 行要素追加
	clsMenuStatus.prototype.resetStatusLineBase = function( pIdx ) {
		try {
			var wId  = this.getBoxId() + '_status_' + String(pIdx);

			var wDivEle = this.getElement( wId );
			if ( !wDivEle ) return null;
			
			this.setStyle( wDivEle, { display: 'block' } );

			return wId;

		} catch(e) {
			throw { name: 'resetStatusLineBase.' + e.name, message: e.message };
		}
	};

	// 入力要素追加
	clsMenuStatus.prototype.addStatusLineContents = function( pDivId, pStatusItem ) {
		try {
			var self = this;

			// 情報内容設定
			var getStatusHtml = function( pId, pContents, pValues, pLast ) {
				var wStatId = pId + '_' + pContents.name;

				var wValue = '';
				if ( self.isObject(pValues) ) {
					if ( typeof pValues[pContents.name] !== 'undefined' ) wValue = pValues[pContents.name];
				}

				var wDesignHead = false;
				var wDesignData = false;
				var wDesignInput = false;
				if ( pContents.design ) {
					if ( pContents.design.head ) wDesignHead = true;
					if ( pContents.design.data ) wDesignData = true;
					if ( pContents.design.input ) wDesignInput = true;
				}

				var wStatTbl = '';

				var wThStyle = '';
				var wThInput = '';
				if ( wDesignHead ) {
					wThStyle = "style='"
					for( var wKey in pContents.design.head ) {
						wThStyle += wKey + ':' + pContents.design.head[wKey] + ';';
						// widthのみheaderのinputに設定
						if ( String(wKey) == 'width' ) wThInput = " style='width: " + pContents.design.head[wKey] + ";' "
					}
					wThStyle += "'"
				}

				var wHedPrm = '';
				wHedPrm += " name='" + wStatId + "_head'";
				wHedPrm += " id='" + wStatId + "_head'";
				wHedPrm += " value='" + self.toHtml(pContents.title) + "'";

				wStatTbl += "<th class='header'" + wThStyle + ">";
				wStatTbl += "<div><input type='text' " + wHedPrm + wThInput + " ReadOnly tabindex='-1' /></div>";
				wStatTbl += "</th>";

				var wTdStyle = '';
				if ( wDesignData ) {
					wTdStyle = " style='"
					for( var wKey in pContents.design.data ) {
						// 最終列のwidthは設定しない
						if ( !pLast || (wKey != 'width') ) {
							wTdStyle += wKey + ':' + pContents.design.data[wKey] + ';';
						}
					}
					wTdStyle += "'"
				}

				var wInpPrm = '';

				var wInpStyle = '';
				if ( wDesignInput ) {
					wInpStyle = " style='";
					for( var wKey in pContents.design.input ) {
						wInpStyle += wKey + ':' + pContents.design.input[wKey] + ';';
					}
					wInpStyle += "' ";
				}

				var wLkey;
				switch ( pContents.type ) {
				case 'text':
					wInpPrm = "<input type='text' ";
					wInpPrm += " name='"	+ wStatId + "' ";
					wInpPrm += " id='"		+ wStatId + "' ";

					wInpPrm += " value='" + self.toHtml(wValue) + "' ";

					if ( pContents.length ) wInpPrm += " maxlength='" + pContents.length + "' ";
					wInpPrm += wInpStyle + " />"; 
					break;

				case 'text-combo':
					wInpPrm = "<input type='text' ";
					wInpPrm += " name='"	+ wStatId + "' ";
					wInpPrm += " id='"		+ wStatId + "' ";
					wInpPrm += " list='"	+ wStatId + "_list' ";

					wInpPrm += " value='" + self.toHtml(wValue) + "' ";

					if ( pContents.length ) wInpPrm += " maxlength='" + pContents.length + "' ";
					wInpPrm += wInpStyle + " />"; 
					
					// データリスト
					if ( pContents.list ) {
						wInpPrm += "<datalist id='" + wStatId + "_list'>";
						for( wLkey in pContents.list ) {
							wInpPrm += "<option value='" + pContents.list[wLkey] + "'>";
						}
						wInpPrm += "</datalist>";
					}
					break;

				case 'textarea':
					wInpPrm = "<textarea ";
					wInpPrm += " name='"	+ wStatId + "' ";
					wInpPrm += " id='"		+ wStatId + "' ";
					if ( pContents.cols ) wInpPrm += " cols='" + pContents.cols + "' ";
					if ( pContents.rows ) wInpPrm += " rows='" + pContents.rows + "' ";
					wInpPrm += wInpStyle + " />"; 

					wInpPrm += self.toHtml(wValue, true);

					wInpPrm += wInpStyle + "</textarea>"; 
					break;

				case 'check':
					if ( pContents.list ) {
						var wChecked;
						for( wLkey in pContents.list ) {
							if ( wInpPrm.length > 0 ) wInpPrm += '&nbsp;';

							wChecked = '';
							if ( String(wValue) == String(wLkey) ) wChecked = ' checked ';

							wInpPrm += "<input type='checkbox' ";
							wInpPrm += " name='"	+ wStatId + "' ";
							wInpPrm += " id='"		+ wStatId + "_" + wLkey + "' ";
							wInpPrm += " value='" + wLkey + "' ";
							wInpPrm += wInpStyle;
							wInpPrm += wChecked + " />"; 
							if ( pContents.list[wLkey] ) {
								wInpPrm += "<label for='" + wStatId + "_" + wLkey + "'>"; 
								wInpPrm += pContents.list[wLkey]; 
								wInpPrm += "<label/>"; 
							}
						}

					} else {
						var wDefault = pContents.default;
						if ( typeof wDefault == 'undefined' ) wDefault = '';

						var wChecked = '';
						if ( String(wDefault) == String(wValue) ) wChecked = ' checked ';

						wInpPrm += "<input type='checkbox' ";
						wInpPrm += " name='"	+ wStatId + "'";
						wInpPrm += " id='"		+ wStatId + "'";
						wInpPrm += " value='" + wDefault + "'";
						wInpPrm += wInpStyle;
						wInpPrm += wChecked + " />"; 
					}
					break;

				default:
					return '';
					break;
				}

				wStatTbl += "<td id='" + wStatId + "_td' class='data' " + wTdStyle + ">";
				wStatTbl += "<div>" + wInpPrm + "</div>"; 
				wStatTbl += "</td>";
				return wStatTbl;
			};

			var wId = this.getBoxId();
			var wTblId = wId + '_table';

			var wHtml = "<table id='" + wTblId + "' class='cssStatus-table' cellpadding='0' cellspacing='0'>";
			wHtml += "<tr>";

			var wLastCol = pStatusItem.length - 1;
			for( var wCol = 0; wCol < pStatusItem.length; wCol++ ) {
				wHtml += getStatusHtml( wId, pStatusItem[wCol], this._StatusValue, (wCol == wLastCol) );

			}
			wHtml += "</tr></table>";

			var wDivEle = this.getElement(pDivId);
			if ( wDivEle ) wDivEle.innerHTML = wHtml;

			return true;

		} catch(e) {
			throw { name: 'addStatusLineContents.' + e.name, message: e.message };
		}
	};

	// 入力要素再設定
	clsMenuStatus.prototype.resetStatusLineContents = function( pDivId, pStatusItem ) {
		try {
			var self = this;

			// 情報内容設定
			var setStatusDefault = function( pId, pContents, pValues, pLast ) {
				// 要素ID
				var wStatId = pId + '_' + pContents.name;

				// 初期値設定
				var wValue = null;
				if ( self.isObject(pValues) ) {
					if ( typeof pValues[pContents.name] !== 'undefined' ) wValue = pValues[pContents.name];
				}
				if ( wValue == null ) wValue = pContents.default;

				switch ( pContents.type ) {
				case 'text':
					self.setElementValue( wStatId, wValue );
					break;

				case 'text-combo':
					self.setElementValue( wStatId, wValue );
					break;

				case 'textarea':
					self.setElementValue( wStatId, wValue );
					break;

				case 'check':
					self.setElementChkVal( wStatId, wValue );
					break;
					
				default:
					return;
					break;
				}
			};

			var wId = this.getBoxId();

			for( var wCol = 0; wCol < pStatusItem.length; wCol++ ) {
				setStatusDefault( wId, pStatusItem[wCol], this._StatusValue );

			}

		} catch(e) {
			throw { name: 'resetStatusLineContents.' + e.name, message: e.message };
		}
	};

	// ボタン要素エリア追加
	clsMenuStatus.prototype.addStatusCommand = function() {
		try {
			var wId  = this.getBoxId() + '_cmd';

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssStatus-cmd' );

			var wHtml = "";

			var wAddStyle = "style='position: absolute; left: 5px;";
			if ( !this._StatusAddCmd ) {
				wAddStyle += "display: none;";
			}
			wAddStyle += "'";

			var wAddId = wId + '_add';
			wHtml += "<a id='" + wAddId + "' href='javascript:void(0);' " + wAddStyle + ">追加</a>";

			if ( !this.autoCloseIs() ) {
				var wCloseId = wId + '_close';
				wHtml += "<a id='" + wCloseId + "' href='javascript:void(0);'>ｷｬﾝｾﾙ</a>";
			}

			var wOkId = wId + '_confirm';
			wHtml += "<a id='" + wOkId + "' href='javascript:void(0);'>OK</a>";

			wDivEle.innerHTML = wHtml;
			this.appendBoxToParent( wDivEle );
			
			// 追加ボタンへイベント追加
			this.addAddEvent();

			// キャンセルボタンへイベント追加
			this.addCancelEvent();

			// 確定ボタンへイベント追加
			this.addConfirmEvent();

		} catch(e) {
			throw { name: 'addStatusCommand.' + e.name, message: e.message };
		}
	};

	// 入力項目へフォーカスを設定
	clsMenuStatus.prototype.setFocusInput = function() {
		try {
			if ( !this.isStatusList() ) return;

			var wTarget;
			var wId = this.getBoxId();

			var wStatId;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatId = wId + '_' + this._StatusList[wIdx][wCol].name;
					
					wTarget = this.getElement( wStatId );
					if ( wTarget ) break;

				}
				if ( wTarget ) break;
			}
			if ( !wTarget ) return;
			
			if ( wTarget.focus ) wTarget.focus();

		} catch(e) {
			throw { name: 'setFocusInput.' + e.name, message: e.message };
		}
	};

	// 項目（行）追加
	clsMenuStatus.prototype.execAddStatus = function() {
		try {
			// 追加行設定なければ処理なし
			if ( !this._StatusAddList ) return;
			if ( this._StatusAddList.length == 0 ) return;

			// 設定済項目のインデックス保存
			var wMaxIdx = this._StatusList.length;

			// 追加先（ボタンエリアの要素）取得
			var wRefId  = this.getBoxId() + '_cmd';
			var wRefEle = this.getElement( wRefId );

			var wAddMenu = [];
			for( var wLineIdx = 0; wLineIdx < this._StatusAddList.length; wLineIdx++ ) {
				var wLineItem = this._StatusAddList[wLineIdx];
				var wAddLine = [];

				for( var wColIdx = 0; wColIdx < wLineItem.length; wColIdx++ ) {
					var wAddItem = {};
					this.copyProperty( wLineItem[wColIdx], wAddItem );
					
					// 名称にindex付与
					wAddItem.name = wAddItem.name + '-' + String(wMaxIdx + wLineIdx + 1);

					// 先頭項目のタイトルのみ編集
					if ( wLineIdx == 0 ) {
						wAddItem.title = wAddItem.title + String(wMaxIdx + wLineIdx + 1);
					}

					wAddLine.push( wAddItem );
				
				}
				wAddMenu.push( wAddLine );
			}

			var wId;
			for( var wAddIdx = 0; wAddIdx < wAddMenu.length; wAddIdx++ ) {
				// 内容追加
				this._StatusList.push( wAddMenu[wAddIdx] );

				// 追加行が既に存在
				if ( (wMaxIdx + wAddIdx + 1) <= this._StatusListMax ) {
					// 行再表示
					wId = this.resetStatusLineBase( (wMaxIdx + wAddIdx) );

					// 内容再設定
					if ( wId ) this.resetStatusLineContents( wId, this._StatusList[(wMaxIdx + wAddIdx)] );

				// 追加行なし
				} else {
					// 行追加
					wId = this.addStatusLineBase( (wMaxIdx + wAddIdx), wRefEle );

					// 内容設定
					this.addStatusLineContents( wId, this._StatusList[(wMaxIdx + wAddIdx)] );
					
					// 最大値更新
					this._StatusListMax++;

				}

			}

			// windowサイズ再設定
			this.saveMenuSize();

			// 再配置
			this.resetPosition();

			// 追加項目へフォーカス設定
			var wAddId = this.getBoxId() + this._StatusList[wMaxIdx][0].name;
			var wAddEle = this.getElement( wAddId );
			if ( wAddEle ) {
				if ( wAddEle.focus ) wAddEle.focus();
			}

		} catch(e) {
			throw { name: 'execAddStatus.' + e.name, message: e.message };
		}
	};

	// メニュー要素を再設定
	clsMenuStatus.prototype.resetMenu = function() {
		try {
			var wListCnt = 0;
			if ( this.isStatusList() ) {
				wListCnt = this._StatusList.length;

			}

			// 追加先（ボタンエリアの要素）取得
			var wRefId  = this.getBoxId() + '_cmd';
			var wRefEle = this.getElement( wRefId );

			// ステータスの基本Id
			var wIdBs  = this.getBoxId() + '_status_';

			// 必要分を表示（および追加）
			var wAddId;
			var wLineEle;
			for( var wIdx = 0; wIdx < wListCnt; wIdx++ ) {
				// 行表示設定
				wLineEle = this.getElement(wIdBs + String(wIdx));
				if ( wLineEle ) {
					this.setStyle( wLineEle, { display: '' } );

				} else {
					// 行追加
					wAddId = this.addStatusLineBase( wIdx, wRefEle );
					
					// 内容設定
					this.addStatusLineContents( wAddId, this._StatusList[wIdx] );
					
					// 行数保存
					this._StatusListMax++;

				}
			}

			// 余分を非表示
			if ( wListCnt < this._StatusListMax ) {
				for( var wIdx = wListCnt; wIdx < this._StatusListMax; wIdx++ ) {
					wLineEle = this.getElement(wIdBs + String(wIdx));
					if ( wLineEle ) this.setStyle( wLineEle, { display: 'none' } );
				}
			}

			// windowサイズ再設定
			this.saveMenuSize();

			// 再配置
			this.resetPosition();

		} catch(e) {
			throw { name: 'resetMenu.' + e.name, message: e.message };
		}
	};

	// メニュー内容を再設定
	clsMenuStatus.prototype.resetStatusConfig = function( pConfig ) {
		try {
			var self = this;

			if ( !this.isObject(pConfig) ) return;

			// 基本ID
			var wBaseId = this.getBoxId();

			// 項目表示設定
			var fncSetLineDisplay = function( pStatConfig, pKey ) {
				var wWinResize = false;

				if ( !('display' in pStatConfig) ) return wWinResize;

				// 行番号取得
				var wStatIdx = self.getStatusIndexByName( pKey );

				var wTargetItem = self.getElement( wBaseId + '_status_' + wStatIdx );
				if ( !wTargetItem ) return wWinResize;

				// 表示状態変更
				if ( pStatConfig.display ) {
					self.setStyle( wTargetItem, { display: '' } );

				} else {
					self.setStyle( wTargetItem, { display: 'none' } );

					// Windowサイズ変更
					wWinResize = true;

				}

				return wWinResize;
			};

			// 項目タイトル設定
			var fncSetLineTitle = function( pStatConfig, pKey ) {
				if ( !('title' in pStatConfig) ) return;

				var wTargetItem = self.getElement( wBaseId + '_' + pKey + '_head' );
				if ( !wTargetItem ) return;

				wTargetItem.value = pStatConfig.title;
			};

			// 入力リスト設定
			var fncSetLineTextList = function( pStatConfig, pKey ) {
				if ( !('list' in pStatConfig) ) return;
				if ( !self.isObject(pStatConfig.list) ) return;

				var wTargetItem = self.getElement( wBaseId + '_' + pKey + '_list' );
				if ( !wTargetItem ) return;

				// 一旦クリア
				while( wTargetItem.lastChild ) wTargetItem.removeChild( wTargetItem.lastChild );

				var wOptions;
				for( var wLkey in pStatConfig.list ) {
					wOptions = document.createElement('option');
					wOptions.value = pStatConfig.list[wLkey];

					wTargetItem.appendChild( wOptions );

				}
			};

			var wStatConfig;
	
			for( var wKey in pConfig ) {
				wStatConfig = pConfig[wKey];
				if ( !this.isObject(wStatConfig) ) continue;

				// 項目表示切替
				// ※ 非表示なら次項目
				if ( fncSetLineDisplay(wStatConfig, wKey) ) continue;

				// 項目タイトル
				fncSetLineTitle( wStatConfig, wKey );

				// 入力リスト
				fncSetLineTextList( wStatConfig, wKey );

			}
			
		} catch(e) {
			throw { name: 'resetStatusConfig.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニュー要素を初期設定
	clsMenuStatus.prototype.createMenu = function() {
		try {
			if ( !this.isStatusList() ) return false;

			var wId;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				// 行追加
				wId = this.addStatusLineBase( wIdx );
				
				// 内容設定
				this.addStatusLineContents( wId, this._StatusList[wIdx] );
				
				// 行数保存
				this._StatusListMax++;

			}
			
			// ボタン設定
			this.addStatusCommand();

			// 継承元初期設定
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuStatus.createMenu.' + e.name, message: e.message };
		}
	};

	// メニューを表示する
	clsMenuStatus.prototype.dspMenu = function( pParam ) {
		try {
			// 入力値クリア
			this._StatusValue = {};

			if ( pParam ) {
				var wConfigured = this.isStatusList();

				// status内容設定
				this.setStatusList( pParam );

				// 設定値保存
				this.saveStatusValue( pParam );

				// 追加項目設定
				this.setStatusAddList( pParam );

				// 内容未設定
				if ( !wConfigured ) {
					// html初期設定
					this.createMenu();
				
				} else {
					// html再設定
					this.resetMenu();
					
					// 設定値反映
					this.setStatusValue();

				}
				
				// 設定変更
				if ( this.isObject(pParam.statusConfig) ) {
					this.resetStatusConfig( pParam.statusConfig );

				}

			}

			// 継承元メニュー表示
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}
			
			// 入力エリアにフォーカス設定
			this.setFocusInput();

		} catch(e) {
			throw { name: 'clsMenuStatus.dspMenu.' + e.name, message: e.message };
		}
	};

	// メニューを非表示
	clsMenuStatus.prototype.hideMenu = function() {
		try {
			// ステータス画面の処理中イベント解除
			this.cancelStatusEvent();

			// 継承元非表示処理
			if ( this._MenuPrototype ) {
				this._MenuPrototype.hideMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuStatus.hideMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsMenuStatus.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_STATUS_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu-status」
				wInitArgument.kind = this._DEF_MENU_STATUS_KIND;
			}
			
			// マウス範囲外でcloseなし
			wInitArgument.autoClose = false;

			if ( pArgument ) {
				// 設定値保存
				this.saveStatusValue( pArgument );

				// status内容設定
				this.setStatusList( pArgument );
				
				// status追加項目設定
				this.setStatusAddList( pArgument );

			}

			// 継承元コンストラクタ
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// クラス追加
			this.setBoxClass( 'cssStatus-base' );

		} catch(e) {
			throw { name: 'clsMenuStatus.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsMenuStatus.prototype.freeClass = function() {
		try {
			this.execFunction( this.delAddEvent );
			this.execFunction( this.delCancelEvent );
			this.execFunction( this.delConfirmEvent );

			// プロパティ開放
			this._StatusList						= null;
			this._StatusValue						= null;
			this._StatusAddList						= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
