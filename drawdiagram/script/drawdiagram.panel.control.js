// --------------------------------------------------------------------
//
// パネルコントローラクラス
//
// --------------------------------------------------------------------
// clsPanelControl ← clsBaseBox
// --------------------------------------------------------------------
var clsPanelControl = function( pArgument ) {
	try {
		var self = this;

		this._DEF_PANELCTRL_KIND		= 'panel';

		this._DEF_PANELCTRL_PROPERY		= {
			 'z-index'				: '30'
		};

		// 継承元クラスのprototype
		this._BasePrototype				= null;

		// 自クラスのプロパティ
		this._PanelCtrlSize				= null;
		this._PanelCtrlLinkEle			= null;
		this._PanelCtrlLinkFlg			= false;

		this._PanelCtrlSyncBody			= null;
		this._PanelCtrlSyncEle			= [];
		
		this._PanelMovePos				= null;

		this._PanelLeftMax				= 0;
		this._PanelLeftEle				= null;
		this._PanelRightEle				= null;

		this._PanelCtrlValid			= true;


		// **************************************************************
		// イベント処理
		// **************************************************************
		
		// windowとのresize同期イベント
		this.eventPanelSyncResize = function( pEvent ) {
			try {
				// 同期ターゲット無効なら処理なし
				if ( !self._PanelCtrlSyncBody ) return true;
				if ( self._PanelCtrlSyncEle.length == 0 ) return true;

				var wWinSize = self.getSize( self._PanelCtrlSyncBody );
				var wWinHeight;
				var wWinWidth;
				var wTarget;

				// コントローラ位置
				var wCtrlPos = self.getBoxPos();

				for ( var i = 0; i < self._PanelCtrlSyncEle.length; i++ ) {
					wTarget = self._PanelCtrlSyncEle[i];
					if ( wTarget ) {
						if ( wTarget.diffHeight !== null ) {
							wWinHeight = wWinSize.height;
							wWinHeight -= wTarget.diffHeight;

							wTarget.element.style.height = wWinHeight + 'px';
						}

						if ( wTarget.diffWidth !== null ) {
							wWinWidth = wWinSize.width;
							// 右パネル
							if ( wTarget.position == 'right' ) {
								// コントローラ位置補正
								wWinWidth -= (wCtrlPos.left + self._PanelCtrlSize.width);

							// 以外
							} else {
								wWinWidth -= wTarget.diffWidth;

							}

							wTarget.element.style.width = wWinWidth + 'px';
						}
					}
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		}

		// ---------------
		// 　項目移動
		// ---------------

		// コントロールパネル移動　開始
		this.eventPanelMoveStart = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 左クリックのみ有効
				var wClick = self.getEventClick( pEvent );
				if ( wClick.left ) {
					// パネル移動開始
					self.startPanelMove();
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// コントロールパネル移動　移動中
		this.eventPanelMove = function( pEvent ) {
			try {
				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				var wEle = self.getBoxElement();
				if ( (!wEle) || (!self._PanelMovePos) ) {
					throw { name: 'eventPanelMove', message: 'コントロールパネルが生成されていません' };
				}

				// ドラッグしていなければ処理終了
				var wClickChk = self.getEventMouse( pEvent );
				if ( !wClickChk.right ) {
					// パネル移動終了
					self.cancelPanelMove();

				} else {
					var wPoint = self.getEventPos( pEvent );
					wPoint.x -= self._PanelMovePos.left;
					
					// 左端 or 最大サイズ時は処理なし
					if ( ( wPoint.x <= 0 ) || ( wPoint.x >= self._PanelLeftMax ) ) {
						return false;
					}

					self.movePanel( wEle, wPoint );
				
				}

			} catch(e) {
				self.execFunction( self.cancelPanelMove );
				self.catchErrorDsp(e);
			}
			return false;
		};

		// コントロールパネル移動　終了
		this.eventPanelMoveStop = function( pEvent ) {
			try {
				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				// パネル移動終了
				self.cancelPanelMove();

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ---------------
		// 　コマンド
		// ---------------

		// 最大化／最小化リンク　クリックイベント
		this.eventClickLink = function( pEvent ) {
			try {
				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				// 操作無効時は処理なし
				if ( !self._PanelCtrlValid ) return true;

				var wEle = self.getBoxElement();
				if ( !wEle ) return false;

				if ( self._PanelCtrlLinkFlg ) {
					self.movePanel( wEle, { x: 0, y: 0 } );

				} else {
					self.movePanel( wEle, { x: self._PanelLeftMax, y: 0 } );

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
		clsBaseBox.call(this, pArgument );


	} catch(e) {
		throw { name: 'clsPanelControl.' + e.name, message: e.message };
	}
	
};

// パネルコントローラ prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsPanelControl, clsBaseBox );

	// **************************************************************
	// 基本操作
	// **************************************************************

	// 画面の操作可否設定
	clsPanelControl.prototype.setControlValid = function( pValid ) {
		try {
			// 操作可否設定
			this._PanelCtrlValid = pValid;

		} catch(e) {
			throw { name: 'setControlValid.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 操作要素設定
	// **************************************************************

	// コントロールパネル生成
	clsPanelControl.prototype.createControlPanel = function() {
		try {
			var wCtrlEle = this.getBoxElement();
			if ( !wCtrlEle ) return false;

			// 操作用要素生成
			this.addClass( wCtrlEle, 'cssControl-btn' );

			var wId = this.getBoxId();

			var wCtrlTag = '';
			wCtrlTag += "<table><tr><td>";
			wCtrlTag += "<a id='" + wId + '_link' + "' href='#'></a>";
			wCtrlTag += "</td></tr></table>";

			wCtrlEle.innerHTML = wCtrlTag;

			var wLink = this.getElement(wId + '_link');
			if ( wLink ) {
				this.addEvent( wLink, 'onclick', this.eventClickLink );
				this._PanelCtrlLinkEle = wLink;

			}
			
			return true;

		} catch(e) {
			throw { name: 'createControlPanel.' + e.name, message: e.message };
		}
	};
	
	// 最小化／最大化リンク生成
	clsPanelControl.prototype.setControlLink = function( pOpen ) {
		try {
			if ( this._PanelCtrlLinkFlg == pOpen ) return;
			if ( !this._PanelCtrlLinkEle ) return;

			var wLinkStr;
			if ( pOpen ) {
				wLinkStr = "&lt;&lt;<br/>&lt;&lt;";
			} else {
				wLinkStr = "&gt;&gt;<br/>&gt;&gt;";
			}
			
			this._PanelCtrlLinkEle.innerHTML = wLinkStr;
			this._PanelCtrlLinkFlg = pOpen;

		} catch(e) {
			throw { name: 'setControlLink.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 管理対象要素関連
	// **************************************************************

	// 管理対象パネル設定
	clsPanelControl.prototype.setTargetPanel = function( pLeftPanel, pRightPanel ) {
		try {
			var wWinBody = this.getBoxBody();
			var wWinSize = this.getSize( wWinBody );

			var wLeft = 0;
			var wHeight;
			var wWidth;
			if ( pLeftPanel ) {
				// コントロールパネル移動と同期
				var wLeftPos  = this.getPosByStyle( pLeftPanel );
				var wLeftSize = this.getSize( pLeftPanel );

				wLeft   = wLeftPos.left + wLeftSize.width;
				wHeight = wWinSize.height - 3;

				this.setBoxStyle( { left: wLeft + 'px', height: wHeight + 'px' } );

				this._PanelLeftEle = { element: pLeftPanel, pos: wLeftPos };

				this._PanelLeftMax = wLeft;

				// windowのResizeと同期へ追加
				this._PanelCtrlSyncEle.push( { element: pLeftPanel, position: 'left', diffHeight: 3, diffWidth: null } );
			}

			if ( pRightPanel ) {
				// コントロールパネル移動と同期
				wLeft  += this._PanelCtrlSize.width;
				wHeight = wWinSize.height;
				wWidth  = wWinSize.width - wLeft - 1;

				pRightPanel.style.left   = wLeft + 'px';
				pRightPanel.style.height = wHeight + 'px';
				pRightPanel.style.width  = wWidth + 'px';
				
				this._PanelRightEle = { element: pRightPanel, winBody: wWinBody };

				// windowのResizeと同期へ追加
				this._PanelCtrlSyncEle.push( { element: pRightPanel, position: 'right', diffHeight: 0, diffWidth: wLeft } );
			}
			return true;

		} catch(e) {
			throw { name: 'setTargetPanel.' + e.name, message: e.message };
		}
	};

	// コントロールパネル移動
	clsPanelControl.prototype.movePanel = function( pElement, pPoint ) {
		try {
			pElement.style.left = (pPoint.x) + "px";

			// 左パネル
			if ( this._PanelLeftEle ) {
				var wLeftEle = this._PanelLeftEle.element;
				if ( wLeftEle ) {
					var wLeftPos = this._PanelLeftEle.pos;
					var wLeftWidth = wLeftPos.left + pPoint.x;
					wLeftEle.style.width = wLeftWidth + 'px';
				}
			}

			// 右パネル
			if ( this._PanelRightEle ) {
				var wRightEle = this._PanelRightEle.element;

				if ( wRightEle ) {
					var wWinBody = this._PanelRightEle.winBody;
					var wWinSize = this.getSize( wWinBody );

					var wRightLeft  = pPoint.x + this._PanelCtrlSize.width;
					var wRightWidth = wWinSize.width - wRightLeft;

					wRightEle.style.left  = wRightLeft + 'px';
					wRightEle.style.width = wRightWidth + 'px';
				}
			}
			
			if ( pPoint.x <= 5 ) {
				this.setControlLink( false );
			} else {
				this.setControlLink( true );
			}
			return true;

		} catch(e) {
			throw { name: 'movePanel.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// イベント関連
	// **************************************************************

	// Windowリサイズに同期
	clsPanelControl.prototype.syncWindowOnResize = function( pSyncEle, pDiffHeight, pDiffWidth ) {
		try {
			// 同期ターゲット無効なら処理なし
			var wPenelWin = this.getBoxWindow();
			if ( !wPenelWin ) return false;
			if ( !pSyncEle ) return false;

			var wDiffHeight = pDiffHeight;
			if ( wDiffHeight !== null ) {
				if ( !wDiffHeight ) wDiffHeight = 0;
			}

			var wDiffWidth = pDiffWidth;
			if ( wDiffWidth !== null ) {
				if ( !wDiffWidth ) wDiffWidth = 0;
			}

			var wSyncBody;
			if ( wPenelWin == window ) {
				var wDocument = this.getDocument( wPenelWin );
				if ( !wDocument ) {
					throw { name: 'syncWindowOnResize', message: '同期対象のdocumentが取得できません' };
				}
				wSyncBody = this.getDocumentBody( wDocument );
			} else {
				wSyncBody = wPenelWin;
			}
			this._PanelCtrlSyncBody = wSyncBody;

			// 同期対象設定
			this._PanelCtrlSyncEle.push( { element: pSyncEle, position: 'center', diffHeight: pDiffHeight, diffWidth: wDiffWidth } );

			// Windowのリサイズと同期
			this.addEvent( wPenelWin, 'onresize', this.eventPanelSyncResize );

			return true;

		} catch(e) {
			throw { name: 'syncWindowOnResize.' + e.name, message: e.message };
		}
	}

	// イベント初期設定
	clsPanelControl.prototype.initPanelEvent = function() {
		try {
			// windowのResizeと同期
			if ( !this.syncWindowOnResize( this.getBoxElement(), 3, null ) ) {
				throw { name: 'syncWindowOnResize', message: '同期対象が無効です' };

			}

			// 不要なイベントを無効化
			this.addBoxEvents( 'oncontextmenu'	, this.eventInvalid );

			// 移動イベント設定
			this.addBoxEvents( 'onmousedown'	, this.eventPanelMoveStart );

		} catch(e) {
			throw { name: 'initPanelEvent.' + e.name, message: e.message };
		}
	};

	// コントロールパネル移動イベント　追加
	clsPanelControl.prototype.addPanelMoveEvent = function() {
		try {
			// マウス追従
			this.addEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPanelMove );

			// 位置確定
			this.addEvent( this.getBoxWindow(), 'onmouseup'		, this.eventPanelMoveStop );

		} catch(e) {
			throw { name: 'addPanelMoveEvent.' + e.name, message: e.message };
		}
	};

	// コントロールパネル移動イベント　削除
	clsPanelControl.prototype.delPanelMoveEvent = function() {
		try {
			// マウス追従
			this.delEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPanelMove );

			// 位置確定
			this.delEvent( this.getBoxWindow(), 'onmouseup'		, this.eventPanelMoveStop );

		} catch(e) {
			throw { name: 'delPanelMoveEvent.' + e.name, message: e.message };
		}
	};

	// コントロールパネル移動　開始時処理
	clsPanelControl.prototype.startPanelMove = function() {
		try {
			// 一旦キャンセル
			this.cancelPanelMove();

			// 操作無効時は処理なし
			if ( !this._PanelCtrlValid ) return true;

			// 現在位置取得
			this._PanelMovePos = this.getParentPos();

			// イベント追加
			this.addPanelMoveEvent();

			// 最前面表示
			this.setBoxToFront( true );

			return true;

		} catch(e) {
			throw { name: 'startPanelMove.' + e.name, message: e.message };
		}
	};

	// コントロールパネル移動　終了時処理
	clsPanelControl.prototype.cancelPanelMove = function() {
		try {
			// イベント停止
			this.delPanelMoveEvent();

			this._PanelMovePos = null;

			// 最前面解除
			this.setBoxToFront( false );

		} catch(e) {
			throw { name: 'cancelPanelMove.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド
	// **************************************************************

	// コンストラクタ
	clsPanelControl.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_PANELCTRL_PROPERY );

			// 種別「panel」
			wInitArgument.kind = this._DEF_PANELCTRL_KIND;

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// コントロールパネル使用有無
			var wIsUsed		= true;
			var wControlCls	= 'cssControl';

			if ( pArgument ) {
				if ( 'ctrlpanel' in pArgument ) wIsUsed = pArgument.ctrlpanel;
			}

			// 使用する
			if ( wIsUsed ) {
				// 操作用要素生成
				if ( !this.createControlPanel(wIsUsed) ) {
					throw { name: 'createControlPanel', message: '操作用要素を生成できません。' };
				
				}
			
			// 使用しない
			} else {
				// 未使用時クラスに変更
				 wControlCls += '-NoUsed';

			}

			// クラス追加
			this.setBoxClass( wControlCls );
			this.setBoxClass( 'no-print' );

			// 操作リンク設定
			this.setControlLink( true );

			// 操作用パネル表示
			this.dspBox( true );

			// パネルサイズ保存
			this._PanelCtrlSize = this.getBoxSize();

			// パネル設定
			var wPanelLeft  = this.getArgument( pArgument, 'panelLeft' );
			var wPanelRight = this.getArgument( pArgument, 'panelRight' );
			this.setTargetPanel( wPanelLeft, wPanelRight );

			// イベント設定
			this.initPanelEvent();

			// 初回サイズ設定
			this.eventPanelSyncResize();

		} catch(e) {
			throw { name: 'clsPanelControl.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsPanelControl.prototype.freeClass = function() {
		try {
			// イベント削除
			this.execFunction( this.delPanelMoveEvent );

			// リサイズ同期イベント削除
			this.execFunction( this.delEvent, this.getBoxWindow(), 'onresize', this.eventPanelSyncResize );

			// プロパティ開放
			this._PanelCtrlSize			= null;
			this._PanelCtrlLinkEle		= null;

			this._PanelCtrlSyncBody		= null;

			if ( this._PanelCtrlSyncEle.length > 0 ) {
				for( var wSyncIdx = 0; wSyncIdx < this._PanelCtrlSyncEle.length; wSyncIdx++ ) {
					this._PanelCtrlSyncEle[wSyncIdx] = null;
				}
			}
			this._PanelCtrlSyncEle		= null;
			
			this._PanelMovePos			= null;

			this._PanelLeftEle			= null;
			this._PanelRightEle			= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};

}());
