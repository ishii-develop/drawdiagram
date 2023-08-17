// --------------------------------------------------------------------
//
// ファイル選択表示クラス
//
// --------------------------------------------------------------------
// clsFileBox ← clsMenuBase ← clsBaseBox
// --------------------------------------------------------------------
var clsFileBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_FILE_KIND		= 'menu-file';

		this._DEF_MENU_FILE_PROPERTY	= {
			 'z-index'				: '4100'
		};


		// 継承元クラスのprototype
		this._MenuPrototype				= null;

		this._FileLoadData				= null;


		// **************************************************************
		// イベント処理
		// **************************************************************

		// ファイル選択時イベント
		this.eventFileSelect = function( pEvent ) {
			try {
				if ( !pEvent ) return false;
				if ( !pEvent.target ) return false;

				// 取得ファイルから情報取得
				var wFileName = '';
				var wSelFiles = pEvent.target.files;
				if ( wSelFiles ) {
					if ( wSelFiles.length ) {
						// 取得ファイル情報保存
						self.getLoadFileData( wSelFiles[0] );
					}
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// 閉じるボタン押下時イベント
		this.eventFileCancel = function( pEvent ) {
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
		this.eventFileConfirm = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 閉じる
				self.hideMenu();

				// メニュー呼出元の関数をcall
				self.execCallBack( pEvent, { kind: 'file', fileData: self._FileLoadData } );

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
		throw { name: 'clsFileBox.' + e.name, message: e.message };
	}
};


// 基本メニュー prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsFileBox, clsMenuBase );

	// **************************************************************
	// ファイル読込
	// **************************************************************

	// ファイル読込
	clsFileBox.prototype.getLoadFileData = function( pFile ) {
		try {
			var self = this;

			// 内容取得
			var wReader = new FileReader();
			var wFileName = pFile.name;

			// ファイル読込後の処理
			wReader.onload = function() {
				// 内容を保存
				self._FileLoadData = wReader.result;

				// 情報を取得したファイル名を表示
				var wTextId  = self.getBoxId() + '_base' + '_text';
				var wTextEle = self.getElement(wTextId);
				if ( wTextEle ) {
					wTextEle.value = wFileName;
				}
			};

			// ファイル読込エラー
			wReader.onerror = function() {
				var wError = wReader.error;

				// 中断
				wReader.abort();

				// 例外を発生
				throw { name: 'FileReader.readAsText', message: wError };
			};

			// ファイル読込
			wReader.readAsText( pFile );

		} catch(e) {
			throw { name: 'getLoadFileData.' + e.name, message: e.message };
		}
	};

	
	// **************************************************************
	// イベント設定
	// **************************************************************

	// 閉じるボタン　イベント設定
	clsFileBox.prototype.addCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventFileCancel );

			}

		} catch(e) {
			throw { name: 'addCancelEvent.' + e.name, message: e.message };
		}
	};

	// 閉じるボタン　イベント削除
	clsFileBox.prototype.delCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  + '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventFileCancel );

			}

		} catch(e) {
			throw { name: 'delCancelEvent.' + e.name, message: e.message };
		}
	};

	// 確定ボタン　イベント設定
	clsFileBox.prototype.addConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventFileConfirm );

			}

		} catch(e) {
			throw { name: 'addConfirmEvent.' + e.name, message: e.message };
		}
	};

	// 確定ボタン　イベント削除
	clsFileBox.prototype.delConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  + '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventFileConfirm );

			}

		} catch(e) {
			throw { name: 'delConfirmEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// メニュー作成
	// **************************************************************

	// ファイル選択要素
	clsFileBox.prototype.addFileElement = function( ) {
		try {
			var wId  = this.getBoxId() + '_base';
			var wDivEle = this.addElement( 'div', wId );
			if ( !wDivEle ) return false;

			// style設定
			this.addClass( wDivEle, 'cssMenuFile-select' );

			// 要素追加
			this.appendBoxToParent( wDivEle );

			// 内容設定
			var wFileId = wId + '_file';
			var wTextId = wId + '_text';
			
			var wHtml = '';
			wHtml += "<div class='cssMenuFile-text'><input type='text' id='" + wTextId + "' readonly ></div>";
			wHtml += "<label>";
			wHtml += "<div class='cssMenuFile-file'>選択</div>";
			wHtml += "<input type='file' id='" + wFileId + "' style='display: none;'>";
			wHtml += "</label>";

			wDivEle.innerHTML = wHtml;

			// ファイル選択イベント設定
			var wFileEle = this.getElement(wFileId);
			if ( wFileEle ) {
				this.addEvent( wFileEle, 'onchange', this.eventFileSelect );
			}

		} catch(e) {
			throw { name: 'addFileElement.' + e.name, message: e.message };
		}
	};

	// ボタン要素エリア追加
	clsFileBox.prototype.addFileCommand = function() {
		try {
			var wId  = this.getBoxId() + '_cmd';

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssMenuFile-cmd' );

			var wHtml = "";

			if ( !this.autoCloseIs() ) {
				var wCloseId = wId + '_close';
				wHtml += "<a id='" + wCloseId + "' href='javascript:void(0);'>ｷｬﾝｾﾙ</a>";
			}

			var wOkId = wId + '_confirm';
			wHtml += "<a id='" + wOkId + "' href='javascript:void(0);'>OK</a>";

			wDivEle.innerHTML = wHtml;
			this.appendBoxToParent( wDivEle );
			
			// キャンセルボタンへイベント追加
			this.addCancelEvent();

			// 確定ボタンへイベント追加
			this.addConfirmEvent();

		} catch(e) {
			throw { name: 'addFileCommand.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニュー要素を初期設定
	clsFileBox.prototype.createMenu = function() {
		try {
			// ファイル選択要素
			this.addFileElement();

			// ボタンエリア生成
			this.addFileCommand();

			// 継承元初期設定
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsFileBox.createMenu' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsFileBox.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_FILE_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu-file」
				wInitArgument.kind = this._DEF_MENU_FILE_KIND;
			}

			// マウス範囲外でcloseなし
			wInitArgument.autoClose = false;

			// メニュー内容設定
			if ( pArgument ) {

			}

			// 継承元コンストラクタ
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// クラス追加
			this.setBoxClass( 'cssMenuFile-base' );

		} catch(e) {
			throw { name: 'clsFileBox.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsFileBox.prototype.freeClass = function() {
		try {
			this.execFunction( this.delCancelEvent );
			this.execFunction( this.delConfirmEvent );

			// プロパティ開放
			this._FileLoadData				= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};

}());
