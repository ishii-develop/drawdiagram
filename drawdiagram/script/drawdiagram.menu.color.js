// --------------------------------------------------------------------
//
// カラーパレット表示クラス
//
// --------------------------------------------------------------------
// clsColorBox ← clsMenuBase ← clsBaseBox
// --------------------------------------------------------------------
var clsColorBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_COLOR_KIND		= 'menu-color';

		this._DEF_MENU_COLOR_PROPERTY	= {
			 'z-index'				: '4100'
		};

		// メニューのstyle
		this._DEF_MENU_COLOR_LIST_PROPERTY = {
			 'z-index'				: '4110'
		};

		// 継承元クラスのprototype
		this._MenuPrototype				= null;

		this._ColorList = [
			 [ '#FFFFFF', '#BBBBBB', '#888888', '#444444', '#000000' ]
			,[ '#FFFFEE', '#FFFFAA', '#FFFF77', '#FFFF33', '#FFFF00' ]
			,[ '#EEFFFF', '#AAFFFF', '#77FFFF', '#33FFFF', '#00FFFF' ]
			,[ '#FFEEFF', '#FFAAFF', '#FF77FF', '#FF33FF', '#FF00FF' ]
			,[ '#FFEEEE', '#FFAAAA', '#FF7777', '#FF3333', '#FF0000' ]
			,[ '#EEEEFF', '#AAAAFF', '#7777FF', '#3333FF', '#0000FF' ]
			,[ '#EEFFEE', '#AAFFAA', '#77FF77', '#33FF33', '#00FF00' ]
			,[ '#FF0000', '#CC0000', '#990000', '#550000', '#220000' ]
			,[ '#00FF00', '#00CC00', '#009900', '#005500', '#002200' ]
			,[ '#0000FF', '#0000CC', '#000099', '#000055', '#000022' ]
		];

		this._ColorContents				= {};
		this._ColorElement				= [];

		// **************************************************************
		// イベント処理
		// **************************************************************
		
		// 色選択時イベント
		this.eventColorClick = function( pEvent ) {
			try {
				// イベント停止
				self.cancelEvent( pEvent, true );

				// 選択要素の色情報取得
				var wSelectColor = self.getColorInf( this );

				// 閉じる
				self.hideMenu();

				// メニュー呼出元の関数をcall
				if ( wSelectColor ) {
					self.execCallBack( pEvent, { kind: 'select', color: wSelectColor.color } );

				} else {
					self.execCallBack( pEvent, { kind: 'close' } );

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
		this._MenuPrototype = clsMenuBase.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsMenuBase.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsColorBox.' + e.name, message: e.message };
	}
};


// 基本メニュー prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsColorBox, clsMenuBase );

	// **************************************************************
	// プロパティ設定／取得
	// **************************************************************

	// 色リスト設定
	clsColorBox.prototype.setColorList = function( pColorAry ) {
		try {
			if ( !pColorAry ) return false;
			if ( !this.isArray(pColorAry) ) return false;

			this._ColorList = pColorAry;
			return true;

		} catch(e) {
			throw { name: 'setColorList', message: e.message };
		}
	};

	// 要素の色取得
	clsColorBox.prototype.getColorInf = function( pElement ) {
		try {
			if ( !pElement ) return null;

			var wId = pElement.id;
			if ( !wId ) return null;

			var wContents = this._ColorContents[wId];
			if ( !wContents ) return null;
			
			return wContents;

		} catch(e) {
			throw { name: 'getColorInf', message: e.message };
		}
	};


	// **************************************************************
	// メニュー作成
	// **************************************************************

	// カラーBOX要素生成
	clsColorBox.prototype.addColorElement = function( pIdx, pColor, pFloat ) {
		try {
			var wId  = this.getBoxId() + '_color_' + String(pIdx);
			var wDivEle = this.addElement( 'div', wId );
			if ( !wDivEle ) return false;

			// style設定
			this.addClass( wDivEle, 'cssMenuColor-box' );
			this.setStyle( wDivEle, this._DEF_MENU_COLOR_LIST_PROPERTY );
			wDivEle.style['background-color'] = pColor;
			
			if ( !pFloat ) {
				wDivEle.style['clear']	= 'left';
			}

			// メニューへ追加
			this.appendBoxToParent( wDivEle );

			// clickイベント設定
			this.addEvent( wDivEle, 'onclick', this.eventColorClick );

			// 情報保存
			this._ColorContents[wId] = { index: pIdx, color: pColor };
			this._ColorElement.push( wDivEle );
			
			return true;

		} catch(e) {
			throw { name: 'addColorElement.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// メニュー要素を初期設定
	clsColorBox.prototype.createMenu = function() {
		try {
			if ( !this._ColorList ) return false;
			if ( !this.isArray(this._ColorList) ) return false;

			var wColorCol;
			var wCnt = 0;
			for( var i = 0; i < this._ColorList.length; i++ ) {
				wColorCol = this._ColorList[i];
				if ( typeof wColorCol === 'string' ) {
					if ( this.addColorElement(wCnt, wColorCol, false) ) {
						wCnt++;
					}

				} else {
					var wFloat = false;
					for( var j = 0; j < wColorCol.length; j++ ) {
						if ( this.addColorElement(wCnt, wColorCol[j], wFloat) ) {
							wFloat = true;
							wCnt++;
						}
					}
				}
				
			}

			// 継承元初期設定
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsColorBox.createMenu' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsColorBox.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_COLOR_PROPERTY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「menu-color」
				wInitArgument.kind = this._DEF_MENU_COLOR_KIND;
			}

			// メニュー内容設定
			if ( pArgument ) {
				// 色リスト指定時
				if ( typeof pArgument.colorList !== 'undefined' ) {
					this.setColorList(pArgument.colorList);
				}

			}

			// 継承元コンストラクタ
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsColorBox.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsColorBox.prototype.freeClass = function() {
		try {
			// プロパティ開放
			var wColor;
			for( var wIdx = 0; wIdx < this._ColorElement.length; wIdx++ ) {
				wColor = this._ColorElement[wIdx];
				if ( !wColor ) continue;

				this.execFunction( this.delEvent, wColor, 'onclick', this.eventColorClick );
				this._ColorElement[wIdx] = null;
			}

			this._ColorContents		= null;
			this._ColorElement		= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};

}());
