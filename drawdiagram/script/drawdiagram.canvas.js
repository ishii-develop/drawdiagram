// --------------------------------------------------------------------
//
// キャンバス
//
// --------------------------------------------------------------------
// clsCanvas ← clsBaseBox
// --------------------------------------------------------------------

var clsCanvas = function( pArgument ) {
	try {
		var self = this;

		this._DEF_CANVAS_KIND			= 'canvas';

		this._DEF_CANVAS_PROPERY		= {
			 'z-index'				: '250'
		};

		this._DEF_CANVAS_SIZE			= { width: 2000, height: 2000 };

		this._DEF_CANVAS_DASH			= { interval: 3 };
		this._DEF_CANVAS_STRIPE			= { interval: 10, width: 5 };
		this._DEF_CANVAS_ARROW			= { width: 10, height: 5 };
		this._DEF_CANVAS_LINE_PADDING	= 2;

		// 継承元クラスのprototype
		this._BasePrototype				= null;

		this._CanvasSize				= {};
		this._CanvasEle					= null;
		this._CanvasContext				= null;
		this._CanvasLine				= null;
		
		this._CanvasDash				= { interval: this._DEF_CANVAS_DASH.interval };
		this._CanvasStripe				= null;
		this._CanvasArrow				= { width: this._DEF_CANVAS_ARROW.width, height: this._DEF_CANVAS_ARROW.height };

		// **************************************************************
		// コンストラクタ
		// **************************************************************
		// 親クラスのprototypeを保存
		this._BasePrototype = clsBaseBox.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsBaseBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsCanvas.' + e.name, message: e.message };
	}
};


// キャンバス prototype
(function(){
	// clsBaseBoxのプロトタイプを継承
	clsInheritance( clsCanvas, clsBaseBox );

	// **************************************************************
	// プロパティ設定
	// **************************************************************

	// 破線の間隔設定
	clsCanvas.prototype.setDashInterval = function( pInterval ) {
		try {
			this._CanvasDash.interval = pInterval;

		} catch(e) {
			throw { name: 'setDashInterval', message: e.message };
		}
	};

	// 矢印の設定（長さ）
	clsCanvas.prototype.setArrowLength = function( pLength ) {
		try {
			this._CanvasArrow.width = pLength;

		} catch(e) {
			throw { name: 'setArrowLength', message: e.message };
		}
	};

	// 矢印の設定（幅）
	clsCanvas.prototype.setArrowWidth = function( pWidth ) {
		try {
			this._CanvasArrow.height = pWidth;

		} catch(e) {
			throw { name: 'setArrowWidth', message: e.message };
		}
	};


	// **************************************************************
	// 描画領域生成
	// **************************************************************

	// キャンバス情報取得
	clsCanvas.prototype.canvasGetStatus = function( ) {
		try {
			if ( !this._CanvasEle ) return null;

			return {
				  element		: this._CanvasEle
				, id			: this._CanvasEle.id
				, width			: this._CanvasContext.width
				, height		: this._CanvasContext.height
			};

		} catch(e) {
			throw { name: 'canvasGetStatus.' + e.name, message: e.message };
		}
	};

	// キャンバス生成
	clsCanvas.prototype.canvasCreate = function( ) {
		try {
			// キャンバスを生成して子要素として追加
			this._CanvasEle = this.addElement( 'canvas', this.getBoxId() + '_canvas' );
			if ( !this._CanvasEle ) {
				throw { name: 'addElement', message: 'キャンバスを生成できません' };
			}

			this._CanvasEle.setAttribute( 'width'	, this._CanvasSize.width );
			this._CanvasEle.setAttribute( 'height'	, this._CanvasSize.height );

			this.addClass( this._CanvasEle, 'cssCanvas' );

			// 描画エリア設定
			this._CanvasContext = this._CanvasEle.getContext('2d');
			if ( !this._CanvasContext ) {
				throw { name: 'getContext', message: '描画エリアを生成できません' };
			}

			this._CanvasContext.width  = this._CanvasSize.width;
			this._CanvasContext.height = this._CanvasSize.height;

			this.appendBoxToParent( this._CanvasEle );

			// キャンバスのライン
			var wLineEle = this.addElement( 'div', this.getBoxId() + '_line' );
			if ( !wLineEle ) return;

			this.addClass( wLineEle, 'cssCanvas-line' );
			this.addClass( wLineEle, 'no-print' );

			this.appendBoxToParent( wLineEle );
			
			this._CanvasLine = wLineEle;

			return true;

		} catch(e) {
			throw { name: 'canvasCreate.' + e.name, message: e.message };
		}
	};

	// キャンバスを子要素として設定
	clsCanvas.prototype.appendCanvas = function( pParentEle ) {
		if ( !this._CanvasEle ) {
			throw { name: 'appendCanvas', message: 'キャンバスが未生成です' };
		}

		try {
			this.appendElementToParent( pParentEle, this._CanvasEle );

		} catch(e) {
			throw { name: 'appendCanvas.' + e.name, message: e.message };
		}
	};

	// キャンバスのライン表示設定
	clsCanvas.prototype.setCanvasLineDisplay = function( pDisplay ) {
		try {
			if ( !this._CanvasLine ) return;

			var wDisplay = '';
			if ( !pDisplay ) wDisplay = 'none';

			this.setStyle( this._CanvasLine, { display: wDisplay } );

		} catch(e) {
			throw { name: 'setCanvasLineDisplay.' + e.name, message: e.message };
		}
	};



	// **************************************************************
	// 描画情報取得
	// **************************************************************

	// ライン描画情報（開始点、終了点）取得
	clsCanvas.prototype.canvasGetDrawPoint = function( pLineParam, pLineKind ) {
		try {
			var self = this;

			// 境界線チェック
			function chkBorderLine( pYkind, pXkind, pMainPos, pMainSize, pTgPos, pTgSize ) {
				var wBorder = false;
				var wBorderTop;

				var wBsX = pMainPos.left;
				var wBsY = pMainPos.top;

				var wChkX = pTgPos.left;
				var wChkY = pTgPos.top;
				
				// 傾き
				var wInc = 0.5;

				// 左
				if ( pXkind == 'left' ) {
					wChkX += pTgSize.width;
					// 下
					if ( pYkind == 'bottom' ) {
						wBsY += pMainSize.height;

					// 上
					} else {
						wChkY += pTgSize.height;
						wInc *= -1;

					}

				// 右
				} else {
					wBsX += pMainSize.width;
					// 下
					if ( pYkind == 'bottom' ) {
						wBsY += pMainSize.height;
						wInc *= -1;

					// 上
					} else {
						wChkY += pTgSize.height;

					}

				}

				var wPosX = wChkX - wBsX;
				var wPosY = wChkY - wBsY;

				wPosY *= -1;

				// 座標が直線より上
				var wUpper;
				if ( wPosY >= (wInc * wPosX) ) {
					wUpper = true;

				// 座標が直線より下
				} else {
					wUpper = false;

				}

				// 上エリア
				if ( pYkind == 'top' ) {
					if ( wUpper ) wBorder = true;

				// 下エリア
				} else {
					if ( !wUpper ) wBorder = true;

				}

				return wBorder;
			};

			// ライン開始位置算出
			function getLinePos( pKind, pPos, pSize ) {
				var wLinePos = { x: 0, y: 0 };

				switch(pKind) {
				// 上
				case 'top':
					wLinePos.x = pPos.left + Math.floor(pSize.width / 2);
					wLinePos.y = pPos.top - self._DEF_CANVAS_LINE_PADDING;
					break;

				// 下
				case 'bottom':
					wLinePos.x = pPos.left + Math.floor(pSize.width / 2);
					wLinePos.y = pPos.top  + pSize.height;
					break;

				// 左
				case 'left':
					wLinePos.x = pPos.left - self._DEF_CANVAS_LINE_PADDING;
					wLinePos.y = pPos.top + Math.floor(pSize.height / 2);
					break;

				// 右
				case 'right':
					wLinePos.x = pPos.left + pSize.width;
					wLinePos.y = pPos.top  + Math.floor(pSize.height / 2);
					break;

				}
				
				return wLinePos;
			};

			// 描画開始点取得
			function getStartPoint( pStPos, pStSize, pEdPos, pEdSize ) {
				var wStPoint;

				// 対象が右側
				if ( pStPos.left < (pEdPos.left + pEdSize.width) ) {
					// 対象が右端より右側
					if ( (pStPos.left + pStSize.width) < pEdPos.left ) {
						// 対象が上部境界線より上
						if ( chkBorderLine('top', 'right', pStPos, pStSize, pEdPos, pEdSize) ) {
							wStPoint = getLinePos( 'top',    pStPos, pStSize );

						// 対象が下部境界線より下
						} else if ( chkBorderLine('bottom', 'right', pStPos, pStSize, pEdPos, pEdSize) ) {
							wStPoint = getLinePos( 'bottom', pStPos, pStSize );

						// 以外
						} else {
							wStPoint = getLinePos( 'right', pStPos, pStSize );

						}

					// 以外
					} else {
						if ( pStPos.top < pEdPos.top ) {
							wStPoint = getLinePos( 'bottom', pStPos, pStSize );
						} else {
							wStPoint = getLinePos( 'top',    pStPos, pStSize );
						}

					}

				// 対象が左側
				} else {
					// 対象が上部境界線より上
					if ( chkBorderLine('top', 'left', pStPos, pStSize, pEdPos, pEdSize) ) {
						wStPoint = getLinePos( 'top',    pStPos, pStSize );

					// 対象が下部境界線より下
					} else if ( chkBorderLine('bottom', 'left', pStPos, pStSize, pEdPos, pEdSize) ) {
						wStPoint = getLinePos( 'bottom', pStPos, pStSize );

					// 以外
					} else {
						wStPoint = getLinePos( 'left',  pStPos, pStSize );

					}

				}
				
				return wStPoint;
			
			};

			// 描画開始点取得
			function getStartRelayPoint( pRelayPos, pRelaySize ) {
				var wStPoint = { x: 0, y: 0 };

				// 中継点の中心
				wStPoint.x = pRelayPos.left + Math.floor(pRelaySize.width / 2);
				wStPoint.y = pRelayPos.top  + Math.floor(pRelaySize.height / 2);

				return wStPoint;
			
			};

			// 開始オブジェクト
			var wStPos		= pLineParam.StPos;
			var wStSize		= pLineParam.StSize;
			var wStArrow	= pLineParam.StArrow;
			var wStRelay	= pLineParam.StRelay;
			var wStRelayCmt	= pLineParam.StRelayCmt;

			// 終了オブジェクト
			var wEdPos		= pLineParam.EdPos;
			var wEdSize		= pLineParam.EdSize;
			var wEdArrow	= pLineParam.EdArrow;
			var wEdRelay	= pLineParam.EdRelay;
			var wEdRelayCmt	= pLineParam.EdRelayCmt;

			// 接続先
			var wStToPos;
			var wStToSize;
			var wEdToPos;
			var wEdToSize;

			// 中間点
			var wRelayPos = [];
			var wRelayCnt = 0;
			if ( pLineKind.point ) {
				for( var wPoint in pLineKind.point ) {
					wRelayPos.push( { left: pLineKind.point[wPoint].x, top: pLineKind.point[wPoint].y } );
					wRelayCnt++;
					
				}
			}
			if ( wRelayCnt == 0 ) {
				wStToPos  = Object.create( wEdPos );
				wStToSize = Object.create( wEdSize );

				wEdToPos  = Object.create( wStPos );
				wEdToSize = Object.create( wStSize );

			} else {
				wStToPos  = Object.create( wRelayPos[0] );
				wStToSize = { width: 0, height: 0 };

				wEdToPos  = Object.create( wRelayPos[wRelayCnt - 1] );
				wEdToSize = { width: 0, height: 0 };

			}

			// 開始点が中継点
			var wStPoint;
			if ( wStRelay ) {
				// 矢印なし　または　コメントなし
				if ( !wStArrow || !wStRelayCmt ) {
					wStPoint = getStartRelayPoint( wStPos, wStSize );
				} else {
					wStPoint = getStartPoint( wStPos, wStSize, wStToPos, wStToSize );
				}

			// 以外
			} else {
				wStPoint = getStartPoint( wStPos, wStSize, wStToPos, wStToSize );
			}

			// 終了点が中継点
			var wEdPoint;
			if ( wEdRelay ) {
				// 矢印なし　または　コメントなし
				if ( !wEdArrow || !wEdRelayCmt ) {
					wEdPoint = getStartRelayPoint( wEdPos, wEdSize );
				} else {
					wEdPoint = getStartPoint( wEdPos, wEdSize, wEdToPos, wEdToSize );
				}

			// 以外
			} else {
				wEdPoint = getStartPoint( wEdPos, wEdSize, wEdToPos, wEdToSize );
			}

			return { StPoint: wStPoint, EdPoint: wEdPoint };

		} catch(e) {
			throw { name: 'canvasGetDrawPoint.' + e.name, message: e.message };
		}
	};

	// 矢印描画情報取得
	clsCanvas.prototype.canvasGetArrowInf = function( pStPoint, pEdPoint ) {
		try {
			// 線の長さが短い場合は矢印描画なし
			var wWidthAbs;
			var wWidthX = Math.abs( pEdPoint.x - pStPoint.x );
			var wWidthY = Math.abs( pEdPoint.y - pStPoint.y );

			if ( wWidthX == 0 ) {
				wWidthAbs = wWidthY;
			} else if ( wWidthY == 0 ) {
				wWidthAbs = wWidthX;
			} else {
				wWidthAbs = Math.floor( Math.sqrt( (wWidthX * wWidthX) + (wWidthY * wWidthY) ) );
			}

			// 矢印設定
			var wArrowInf = Object.create( this._CanvasArrow );

			// 矢印サイズ補正
			if ( wWidthAbs < (wArrowInf.width * 2) ) {
				wArrowInf.width  = Math.floor(wArrowInf.width / 2);
				wArrowInf.height = Math.floor(wArrowInf.height / 1.5);

				// 長さが矢印サイズの1/2以下なら描画なし
				if ( wWidthAbs < (wArrowInf.width + 1) ) {
					return null;
				}
				
			}

			// 矢印描画開始点算出
			var wLenX;
			var wLenY;
			if ( wWidthX == 0 ) {
				wLenX = 0;
				wLenY = wArrowInf.width;
			
			} else if ( wWidthY == 0 ) {
				wLenX = wArrowInf.width;
				wLenY = 0;

			} else {
				var wAngl;
				if ( wWidthX < wWidthY ) {
					wLenY = wArrowInf.width;
					
					wAngl = Math.atan2( wWidthX, wWidthY );
					wLenX = Math.floor( wLenY * Math.tan(wAngl) );

				} else {
					wLenX = wArrowInf.width;
					
					wAngl = Math.atan2( wWidthY, wWidthX );
					wLenY = Math.floor( wLenX * Math.tan(wAngl) );

				}

			}
			
			var wIncX = 1;
			if ( pStPoint.x > pEdPoint.x ) wIncX = -1;

			var wIncY = 1;
			if ( pStPoint.y > pEdPoint.y ) wIncY = -1;

			var wResultInf = {};

			wResultInf.Style = wArrowInf;

			wResultInf.StPoint = {};
			wResultInf.StPoint.x = pEdPoint.x - (wLenX * wIncX);
			wResultInf.StPoint.y = pEdPoint.y - (wLenY * wIncY);

			wResultInf.EdPoint = {};
			wResultInf.EdPoint.x = pEdPoint.x;
			wResultInf.EdPoint.y = pEdPoint.y;

			return wResultInf;

		} catch(e) {
			throw { name: 'canvasGetArrowInf.' + e.name, message: e.message };
		}
	}


	// **************************************************************
	// 描画
	// **************************************************************

	// 線描画
	// pLineKind { width: 線サイズ, color: 線色, style: 線種別, way: 矢印方向 }
	clsCanvas.prototype.canvasDrawLine = function( pStPoint, pEdPoint, pLineKind ) {
		try {
			if ( !this._CanvasContext ) return false;

			this._CanvasContext.lineWidth   = pLineKind.width;
			this._CanvasContext.strokeStyle = pLineKind.color;
			this._CanvasContext.fillStyle   = pLineKind.color;

			// 線種設定
			if ( pLineKind.style == 'dash' ) {
				// 破線
				this._CanvasContext.lineCap     = 'butt';

			} else {
				// 通常
				this._CanvasContext.lineCap     = 'round';

			}

			// 開始・終了点設定
			var wPntSt = [];
			var wPntEd = [];
			var wPntCnt = 0;

			wPntSt.push( Object.create( pStPoint ) );
			if ( pLineKind.point ) {
				// 中間点あり
				for( var wPoint in pLineKind.point ) {
					wPntEd.push( Object.create( pLineKind.point[wPoint] ) );
					wPntSt.push( Object.create( pLineKind.point[wPoint] ) );
					wPntCnt++;
					
				}
			}
			wPntEd.push( Object.create( pEdPoint ) );

			var wArrowSt = [];
			var wArrowEd = [];

			// 矢印描画回数設定
			var wWayAry = [];
			// 正方向
			if ( (pLineKind.way == 1) || (pLineKind.way == 3) ) {
				wWayAry.push( 1 );

				// 正方向矢印設定
				wArrowSt.push( Object.create( wPntSt[wPntCnt] ) );
				wArrowEd.push( Object.create( wPntEd[wPntCnt] ) );
			}

			// 逆方向
			if ( (pLineKind.way == 2) || (pLineKind.way == 3) ) {
				wWayAry.push( 2 );

				// 逆方向矢印設定
				wArrowSt.push( Object.create( wPntEd[0] ) );
				wArrowEd.push( Object.create( wPntSt[0] ) );
			}

			// 線描画
			for( var wPidx = 0; wPidx < wPntSt.length; wPidx++ ) {
				// 破線
				if ( pLineKind.style == 'dash' ) {
					this.canvasDrawDash( wPntSt[wPidx], wPntEd[wPidx] );

				// 縞
				} else if ( pLineKind.style == 'stripe' ) {
					this.canvasDrawStripe( wPntSt[wPidx], wPntEd[wPidx] );

				// 以外
				} else {
					this.canvasDrawNormal( wPntSt[wPidx], wPntEd[wPidx] );

				}

			}

			// 矢印描画
			if ( pLineKind.way != 0 ) {
				for( var wCnt = 0; wCnt < wWayAry.length; wCnt++ ) {
					// 矢印描画情報取得
					var wArrowInf = this.canvasGetArrowInf( wArrowSt[wCnt], wArrowEd[wCnt] );

					if ( wArrowInf ) {
						this.canvasDrawArrow( wArrowInf.StPoint, wArrowInf.EdPoint, wArrowInf.Style );
					}
				}

			}
			return true;

		} catch(e) {
			throw { name: 'canvasDrawLine.' + e.name, message: e.message };
		}
	};

	// 直線描画
	clsCanvas.prototype.canvasDrawNormal = function( pStPoint, pEdPoint ) {
		try {
			if ( !this._CanvasContext ) return false;

			// 描画
			this._CanvasContext.beginPath();

			this._CanvasContext.moveTo( pStPoint.x, pStPoint.y );
			this._CanvasContext.lineTo( pEdPoint.x, pEdPoint.y );

			this._CanvasContext.stroke();
			this._CanvasContext.closePath();

			return true;

		} catch(e) {
			throw { name: 'canvasDrawNormal', message: e.message };
		}
	};

	// 2点間を分割
	clsCanvas.prototype.canvasGetSplitPoint = function( pStPoint, pEdPoint, pLength, pPointCnt, pJump ) {
		try {
			var wPoint = [];
			var wSplit = Math.round( (pLength / pPointCnt) * 1000 ) / 1000;

			var wInc;
			if ( pStPoint < pEdPoint ) {
				wInc = 1.0;
			} else {
				wInc = -1.0;
			}

			var wSt = pStPoint;
			var wEd = wSt * 1.0;
			var wDraw = true;
			var wJump = true;
			if ( typeof pJump == 'boolean' ) {
				wJump = pJump;
			}

			var wEndAbs = Math.abs( pEdPoint );

			var wEdFlg = false;
			for( var wIdx = 0; wIdx < pPointCnt; wIdx++ ) {
				wEd += (wSplit * wInc);

				// 最終点を超えれば終了
				if ( wInc > 0 ) {
					if ( wEd > pEdPoint ) wEdFlg = true;
				} else {
					if ( wEd < pEdPoint ) wEdFlg = true;
				}

				if ( wEdFlg ) {
					wPoint.push( { st: wSt, ed: pEdPoint } );
					break;
				
				} else {
					if ( wDraw ) wPoint.push( { st: wSt, ed: wEd } );
					if ( wJump ) wDraw = !wDraw;
				}

				wSt = wEd;
			}

			if ( !wEdFlg ) wPoint.push( { st: wSt, ed: pEdPoint } );

			return wPoint;

		} catch(e) {
			throw { name: 'canvasGetSplitPoint', message: e.message };
		}
	};

	// 特定位置の垂直ポイント取得
	clsCanvas.prototype.canvasGetVerticalPoint = function( pPointX, pPointY, pWidthX, pWidthY, pWidth ) {
		try {
			var wSt = { x: pPointX, y: pPointY };
			var wEd = { x: pPointX, y: pPointY };

			wSt.x += pWidthX;
			wSt.y -= pWidthY;

			wEd.x -= pWidthX;
			wEd.y += pWidthY;

		    return { st: wSt, ed: wEd };

		} catch(e) {
			throw { name: 'canvasGetVerticalPoint', message: e.message };
		}
	};

	// 破線描画
	clsCanvas.prototype.canvasDrawDash = function( pStPoint, pEdPoint ) {
		try {
			if ( !this._CanvasContext ) return false;

			var wWidthX = Math.abs( pEdPoint.x - pStPoint.x );
			var wWidthY = Math.abs( pEdPoint.y - pStPoint.y );

			var wWidthAbs;
			if ( wWidthX == 0 ) {
				wWidthAbs = wWidthY;
			} else if ( wWidthY == 0 ) {
				wWidthAbs = wWidthX;
			} else {
				wWidthAbs = Math.floor( Math.sqrt( (wWidthX * wWidthX) + (wWidthY * wWidthY) ) );
			}

			// 最小破線サイズ以下なら直線描画
			if ( wWidthAbs < (this._CanvasDash.interval * 2) ) {
				this.canvasDrawNormal( pStPoint, pEdPoint );
				return true;
			}

			var wPointCnt = Math.floor( wWidthAbs / this._CanvasDash.interval );

			// 2点間を分割
			wPointX = this.canvasGetSplitPoint( pStPoint.x, pEdPoint.x, wWidthX, wPointCnt );
			wPointY = this.canvasGetSplitPoint( pStPoint.y, pEdPoint.y, wWidthY, wPointCnt );

			// 描画
			this._CanvasContext.beginPath();

			var wPointLen = wPointX.length;
			if ( wPointLen > wPointY.length ) wPointLen = wPointY.length;

			for ( var wIdx = 0; wIdx < wPointLen; wIdx++ ) {
				this._CanvasContext.moveTo( wPointX[wIdx].st, wPointY[wIdx].st );
				this._CanvasContext.lineTo( wPointX[wIdx].ed, wPointY[wIdx].ed );
			}

			this._CanvasContext.stroke();
			this._CanvasContext.closePath();

			return true;

		} catch(e) {
			throw { name: 'canvasDrawDash.' + e.name, message: e.message };
		}
	};

	// 縞線描画
	clsCanvas.prototype.canvasDrawStripe = function( pStPoint, pEdPoint ) {
		try {
			if ( !this._CanvasContext ) return false;

			var wWidthX = Math.abs( pEdPoint.x - pStPoint.x );
			var wWidthY = Math.abs( pEdPoint.y - pStPoint.y );

			var wWidthAbs;
			if ( wWidthX == 0 ) {
				wWidthAbs = wWidthY;
			} else if ( wWidthY == 0 ) {
				wWidthAbs = wWidthX;
			} else {
				wWidthAbs = Math.floor( Math.sqrt( (wWidthX * wWidthX) + (wWidthY * wWidthY) ) );
			}

			// 最小破線サイズ以下なら直線描画
			if ( wWidthAbs < (this._CanvasStripe.interval * 2) ) {
				this.canvasDrawNormal( pStPoint, pEdPoint );
				return true;
			}

			var wPointCnt = Math.floor( wWidthAbs / this._CanvasStripe.interval );

			// 2点間を分割
			wPointX = this.canvasGetSplitPoint( pStPoint.x, pEdPoint.x, wWidthX, wPointCnt, false );
			wPointY = this.canvasGetSplitPoint( pStPoint.y, pEdPoint.y, wWidthY, wPointCnt, false );

			// 描画
			this._CanvasContext.beginPath();

			this._CanvasContext.moveTo( pStPoint.x, pStPoint.y );
			this._CanvasContext.lineTo( pEdPoint.x, pEdPoint.y );

			var wPx = this._CanvasStripe.width;
			var wPy = this._CanvasStripe.width;
			if ( wWidthX == 0 ) {
				wPy = 0;
			
			} else if ( wWidthY == 0 ) {
				wPx = 0;
			
			} else {
				// 傾きを考慮した斜線の長さ設定
				var wX = pEdPoint.x - pStPoint.x;
				var wY = pEdPoint.y - pStPoint.y;

				var wSlope = Math.sqrt( Math.pow(wX, 2) + Math.pow(wY, 2) );
				var wVx = wX / wSlope;
				var wVy = wY / wSlope;

				wPx = Math.floor(wPx * wVy);
				wPy = Math.floor(wPy * wVx);

			}

			var wStripe;

			// 最終点にはライン描画なし
			var wPointLen = wPointX.length;
			if ( wPointLen > wPointY.length ) wPointLen = wPointY.length;

			wPointLen--;

			for ( var wIdx = 0; wIdx < wPointLen; wIdx++ ) {
				wStripe = this.canvasGetVerticalPoint( wPointX[wIdx].ed, wPointY[wIdx].ed, wPx, wPy, this._CanvasStripe.width );
				this._CanvasContext.moveTo( wStripe.st.x, wStripe.st.y );
				this._CanvasContext.lineTo( wStripe.ed.x, wStripe.ed.y );
			}

			this._CanvasContext.stroke();
			this._CanvasContext.closePath();

			return true;

		} catch(e) {
			throw { name: 'canvasDrawStripe.' + e.name, message: e.message };
		}
	};

	// 矢印描画
	// pArrowInf { width: 矢印の長さ, height: 矢印の高さ（横幅） }
	clsCanvas.prototype.canvasDrawArrow = function( pStPoint, pEdPoint, pArrowInf, pAdjustment ) {
		try {
			if ( !this._CanvasContext ) return false;

			var wWidthX = pEdPoint.x - pStPoint.x;
			var wWidthY = pEdPoint.y - pStPoint.y;

			if ( !pArrowInf ) {
				pArrowInf = Object.create( this._CanvasArrow );
			}

			// 矢印サイズ補正あり
			if ( pAdjustment == true ) {
				var wWidthAbs = Math.abs( wWidthX );
				if ( wWidthAbs < Math.abs(wWidthY) ) wWidthAbs = Math.abs(wWidthY);

				// 矢印サイズ補正
				if ( wWidthAbs < (pArrowInf.width * 2) ) {
					pArrowInf.width  = Math.floor(pArrowInf.width / 2);
					pArrowInf.height = Math.floor(pArrowInf.height / 1.5);

					// 長さが矢印サイズの1/2以下なら直線描画
					if ( wWidthAbs < pArrowInf.width ) {
						this.canvasDrawNormal( pStPoint, pEdPoint );
						return true;
					}
					
				}
			
			}

			var wArrowW = pArrowInf.width * -1;
			var wArrowH = pArrowInf.height;
			var wArrowPoint = [ 
								  { x: 0,		y: 1 }
								, { x: wArrowW,	y: 1 }
								, { x: wArrowW,	y: wArrowH }
							];

			var wLen = Math.sqrt(wWidthX * wWidthX + wWidthY * wWidthY);

			var wPoint = [];
			var wX;
			var wY;

			// 矢印上部
			wPoint.push(0, 0);
			for ( var wUidx = 0; wUidx < wArrowPoint.length; wUidx++ ) {
				wX = wArrowPoint[wUidx].x;
				wY = wArrowPoint[wUidx].y;
				if ( wX < 0 ) wX += wLen;

				wPoint.push(wX, wY);
			}
			wPoint.push(wLen, 0);

			// 矢印下部
			for ( var wDidx = (wArrowPoint.length - 1); wDidx > 0; wDidx-- ) {
				wX = wArrowPoint[wDidx].x;
				wY = wArrowPoint[wDidx].y;
				if ( wX < 0 ) wX += wLen;

				wPoint.push(wX, -wY);
			}
			wPoint.push(0, 0);

			// 描画
			this._CanvasContext.beginPath();

			var wSin = wWidthY / wLen;
			var wCos = wWidthX / wLen;
			for (var wPidx = 0; wPidx < wPoint.length; wPidx += 2) {
				wX = wPoint[wPidx] * wCos - wPoint[wPidx + 1] * wSin + pStPoint.x;
				wY = wPoint[wPidx] * wSin + wPoint[wPidx + 1] * wCos + pStPoint.y;

				if ( wPidx === 0 ) {
					this._CanvasContext.moveTo(wX, wY);
				} else {
					this._CanvasContext.lineTo(wX, wY);
				}
			}
			this._CanvasContext.fill();

			this._CanvasContext.stroke();
			this._CanvasContext.closePath();

			return true;

		} catch(e) {
			throw { name: 'canvasDrawArrow', message: e.message };
		}
	};

	// クリア
	clsCanvas.prototype.canvasClear = function( ) {
		try {
			if ( !this._CanvasContext ) return false;

			this._CanvasContext.clearRect(0, 0, this._CanvasSize.width, this._CanvasSize.height);

		} catch(e) {
			throw { name: 'canvasClear', message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsCanvas.prototype.initClass = function( pArgument ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_CANVAS_PROPERY );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「canvas」
				wInitArgument.kind = this._DEF_CANVAS_KIND;

			}

			// 継承元コンストラクタ
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// クラス追加
			this.setBoxClass( 'cssCanvas-base' );

			if ( !this._CanvasStripe ) this._CanvasStripe = {};
			this.copyProperty( this._DEF_CANVAS_STRIPE, this._CanvasStripe );

			// キャンバスサイズ設定
			var wArgSize = this.loadArgument( 'size' );
			if ( wArgSize ) {
				this.copyProperty( wArgSize, this._CanvasSize );
			
			} else {
				this.copyProperty( this._DEF_CANVAS_SIZE, this._CanvasSize );

			}

			// キャンバス生成
			this.canvasCreate();

			// キャンバスとベースのサイズ同期
			var wSizeStyle = {
				  'width'  : this._CanvasSize.width  + 'px'
				, 'height' : this._CanvasSize.height + 'px'
			};
			this.setStyle( this.getBoxElement(), wSizeStyle );

			// 主コンテンツ表示
			this.dspBox( true );

		} catch(e) {
			throw { name: 'clsCanvas.initClass.' + e.name, message: e.message };
		}
	};

	// デストラクタ
	clsCanvas.prototype.freeClass = function() {
		try {
			// Canvas削除
			if ( this.CanvasEle ) {
				this.execFunction( this.delElement, this.CanvasEle );
			}

			// プロパティ開放
			this._CanvasContext				= null;
			this._CanvasEle					= null;
			this._CanvasLine				= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};
}());
