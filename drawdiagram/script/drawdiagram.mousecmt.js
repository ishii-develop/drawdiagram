
// --------------------------------------------------------------------
//
// マウス追従コメントクラス
//
// --------------------------------------------------------------------
// clsMouseCmt ← clsBaseBox
// --------------------------------------------------------------------
var clsMouseCmt = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MOUSECMT_KIND			= 'comment';

		this._DEF_MOUSECMT_PROPERTY		= {
			 'z-index'				: '5000'
		};

		this._DEF_MOUSECMT_CHR_WIDTH	= 12;
		this._DEF_MOUSECMT_CHR_HEIGHT	= 12;
		this._DEF_MOUSECMT_LEFT			= 15;
		this._DEF_MOUSECMT_TOP			= 5;

		// 継承元クラスのprototype
		this._BasePrototype				= null;

		// 自クラスのプロパティ
		this._MouseCmtDsp				= false;
		this._MouseCmtStop				= false;
		this._MouseCmtPos				= { left: 0, right: 0, top: 0, bottom: 0 };


		// **************************************************************
		// イベント処理
		// **************************************************************

		// コメント移動
		this.eventMouseCmtMove = function( pEvent ) {
			try {
				if ( !self._MouseCmtDsp ) return true;
				if ( !pEvent ) return true;

				var wCmtEle = self.getBoxElement()
				if ( !wCmtEle ) return true;

				var wPoint	= self.getEventPos( pEvent );
				var wCmtPos	= self.getMouseCmtPos( wPoint );

				wCmtEle.style.left	= wCmtPos.left + "px";
				wCmtEle.style.top	= wCmtPos.top  + "px";
			
				// 一時非表示中
				if ( self._MouseCmtStop ) {
					self.dspBox( true );
					self._MouseCmtStop = false;

				}

			} catch(e) {}

			return true;
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
		throw { name: 'clsMouseCmt.' + e.name, message: e.message };
	}
};

// マウス追従コメント prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsMouseCmt, clsBaseBox );

	// **************************************************************
	// コメント表示
	// **************************************************************

	// コメントサイズ取得
	clsMouseCmt.prototype.getCmtSize = function( pComment ) {
		try {
			var wRetSize = { width: 160, height: 16 };
			
			var wCmtVal = '';
			if ( pComment) wCmtVal = String(pComment);

			if ( wCmtVal.length > 0 ) {
				var wCmtAry = wCmtVal.toLowerCase().split( '<br>' );
				var wCol = 0;
				var wRow = wCmtAry.length;
				for( var wIdx=0; wIdx < wCmtAry.length; wIdx++ ) {
					if ( wCol < wCmtAry[wIdx].length ) wCol = wCmtAry[wIdx].length;
				}
				
				wRetSize.width	= wCol * this._DEF_MOUSECMT_CHR_WIDTH;
				wRetSize.height	= wRow * this._DEF_MOUSECMT_CHR_HEIGHT;

			}
			return wRetSize;

		} catch(e) {
			throw { name: 'getCmtSize.' + e.name, message: e.message };
		}
	};

	// 表示コメント設定
	clsMouseCmt.prototype.getMouseCmtPos = function( pMousePos ) {
		try {
			var wCmtPos = { left: 0, top: 0 };

			// 親の位置設定
			var wParentPos = this.getParentPos();
			
			wCmtPos.left	= pMousePos.x - wParentPos.left;
			wCmtPos.top		= pMousePos.y - wParentPos.top;

			// スクロール値加算
			var wParentScroll = this.getParentScroll();
			wCmtPos.left	+= wParentScroll.x;
			wCmtPos.top		+= wParentScroll.y;

			wCmtPos.left	+= this._DEF_MOUSECMT_LEFT;
			wCmtPos.top		+= this._DEF_MOUSECMT_TOP;

			return wCmtPos;

		} catch(e) {
			throw { name: 'getMouseCmtPos.' + e.name, message: e.message };
		}
	};

	// 表示コメント設定
	clsMouseCmt.prototype.setMouseCmt = function( pStartPos, pComment ) {
		try {
			var wCmtEle = this.getBoxElement();
			if ( !wCmtEle ) return true;

			if ( typeof pComment == 'string' ) {
				// サイズ設定
				var wCmtSize = this.getCmtSize( pComment );
				wCmtEle.style.width  = wCmtSize.width  + "px";
				wCmtEle.style.height = wCmtSize.height + "px";
				
				// コメント設定
				wCmtEle.innerHTML = pComment;
			}
			if ( String(wCmtEle.innerHTML).length == 0 ) return true;

			// 表示位置指定
			if ( pStartPos ) {
				// 親の位置設定
				var wCmtPos = this.getMouseCmtPos( pStartPos );

				wCmtEle.style.left	= wCmtPos.left + "px";
				wCmtEle.style.top	= wCmtPos.top  + "px";

			}
			return true;

		} catch(e) {
			throw { name: 'setMouseCmt.' + e.name, message: e.message };
		}
	};

	// コメント表示
	clsMouseCmt.prototype.dspMouseCmt = function( pStPos, pComment ) {
		try {
			// コメント設定
			this.setMouseCmt( pStPos, pComment );

			// 表示
			this.dspBox( true );

			this._MouseCmtDsp = true;

		} catch(e) {
			throw { name: 'dspMouseCmt.' + e.name, message: e.message };
		}
	};

	// コメント非表示
	clsMouseCmt.prototype.hideMouseCmt = function() {
		try {
			// コメント非表示
			this.dspBox( false );

			this._MouseCmtDsp = false;

		} catch(e) {
			throw { name: 'hideMouseCmt.' + e.name, message: e.message };
		}
	};

	// コメント一時非表示
	clsMouseCmt.prototype.stopMouseCmt = function() {
		try {
			// コメント表示一時停止
			this.dspBox( false );

			this._MouseCmtStop = true;

		} catch(e) {
			throw { name: 'hideMouseCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド
	// **************************************************************

	// コンストラクタ
	clsMouseCmt.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MOUSECMT_PROPERTY );

			// 種別「panel」
			wInitArgument.kind = this._DEF_MOUSECMT_KIND;

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// class設定
			this.setBoxClass( 'cssMouseCmt' );

			// マウスに追従
			var wParentEle = this.getParent();
			if ( wParentEle ) {
				this.addEvent( wParentEle, 'onmousemove'	, this.eventMouseCmtMove );
			}

		} catch(e) {
			throw { name: 'clsMouseCmt.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsMouseCmt.prototype.freeClass = function() {
		try {
			// イベント削除
			var wParentEle = this.getParent();
			if ( wParentEle ) {
				this.execFunction( this.delEvent, wParentEle, 'onmousemove', this.eventMouseCmtMove );
			
			}

			// プロパティ開放
			this._MouseCmtPos		= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype		= null;

		} catch(e) {}
	};
}());
