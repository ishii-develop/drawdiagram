// --------------------------------------------------------------------
//
// �L�����o�X
//
// --------------------------------------------------------------------
// clsCanvas �� clsBaseBox
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

		// �p�����N���X��prototype
		this._BasePrototype				= null;

		this._CanvasSize				= {};
		this._CanvasEle					= null;
		this._CanvasContext				= null;
		
		this._CanvasDash				= { interval: this._DEF_CANVAS_DASH.interval };
		this._CanvasStripe				= null;
		this._CanvasArrow				= { width: this._DEF_CANVAS_ARROW.width, height: this._DEF_CANVAS_ARROW.height };

		// **************************************************************
		// �R���X�g���N�^
		// **************************************************************
		// �e�N���X��prototype��ۑ�
		this._BasePrototype = clsBaseBox.prototype;

		// �e�N���X��constructor
		// ���p�������uinitClass�v��call�����
		clsBaseBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsCanvas.' + e.name, message: e.message };
	}
};


// �L�����o�X prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsCanvas, clsBaseBox );

	// **************************************************************
	// �v���p�e�B�ݒ�
	// **************************************************************

	// �j���̊Ԋu�ݒ�
	clsCanvas.prototype.setDashInterval = function( pInterval ) {
		try {
			this._CanvasDash.interval = pInterval;

		} catch(e) {
			throw { name: 'setDashInterval', message: e.message };
		}
	};

	// ���̐ݒ�i�����j
	clsCanvas.prototype.setArrowLength = function( pLength ) {
		try {
			this._CanvasArrow.width = pLength;

		} catch(e) {
			throw { name: 'setArrowLength', message: e.message };
		}
	};

	// ���̐ݒ�i���j
	clsCanvas.prototype.setArrowWidth = function( pWidth ) {
		try {
			this._CanvasArrow.height = pWidth;

		} catch(e) {
			throw { name: 'setArrowWidth', message: e.message };
		}
	};


	// **************************************************************
	// �`��̈搶��
	// **************************************************************

	// �L�����o�X���擾
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

	// �L�����o�X����
	clsCanvas.prototype.canvasCreate = function( ) {
		try {
			// �L�����o�X�𐶐����Ďq�v�f�Ƃ��Ēǉ�
			this._CanvasEle = this.addElement( 'canvas', this.getBoxId() + '_canvas' );
			if ( !this._CanvasEle ) {
				throw { name: 'addElement', message: '�L�����o�X�𐶐��ł��܂���' };
			}

			this._CanvasEle.setAttribute( 'width'	, this._CanvasSize.width );
			this._CanvasEle.setAttribute( 'height'	, this._CanvasSize.height );

			this.addClass( this._CanvasEle, 'cssCanvas' );

			// �`��G���A�ݒ�
			this._CanvasContext = this._CanvasEle.getContext('2d');
			if ( !this._CanvasContext ) {
				throw { name: 'getContext', message: '�`��G���A�𐶐��ł��܂���' };
			}

			this._CanvasContext.width  = this._CanvasSize.width;
			this._CanvasContext.height = this._CanvasSize.height;

			this.appendBoxToParent( this._CanvasEle );

			// �L�����o�X�̃��C��
			var wLineEle = this.addElement( 'div', this.getBoxId() + '_line' );
			if ( !wLineEle ) return;

			this.addClass( wLineEle, 'cssCanvas-line' );
			this.addClass( wLineEle, 'no-print' );

			this.appendBoxToParent( wLineEle );

			return true;

		} catch(e) {
			throw { name: 'canvasCreate.' + e.name, message: e.message };
		}
	};

	// �L�����o�X���q�v�f�Ƃ��Đݒ�
	clsCanvas.prototype.appendCanvas = function( pParentEle ) {
		if ( !this._CanvasEle ) {
			throw { name: 'appendCanvas', message: '�L�����o�X���������ł�' };
		}

		try {
			this.appendElementToParent( pParentEle, this._CanvasEle );

		} catch(e) {
			throw { name: 'appendCanvas.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �`����擾
	// **************************************************************

	// ���C���`����i�J�n�_�A�I���_�j�擾
	clsCanvas.prototype.canvasGetDrawPoint = function( pLineParam, pLineKind ) {
		try {
			var self = this;

			// ���E���`�F�b�N
			function chkBorderLine( pYkind, pXkind, pMainPos, pMainSize, pTgPos, pTgSize ) {
				var wBorder = false;
				var wBorderTop;

				var wBsX = pMainPos.left;
				var wBsY = pMainPos.top;

				var wChkX = pTgPos.left;
				var wChkY = pTgPos.top;
				
				// �X��
				var wInc = 0.5;

				// ��
				if ( pXkind == 'left' ) {
					wChkX += pTgSize.width;
					// ��
					if ( pYkind == 'bottom' ) {
						wBsY += pMainSize.height;

					// ��
					} else {
						wChkY += pTgSize.height;
						wInc *= -1;

					}

				// �E
				} else {
					wBsX += pMainSize.width;
					// ��
					if ( pYkind == 'bottom' ) {
						wBsY += pMainSize.height;
						wInc *= -1;

					// ��
					} else {
						wChkY += pTgSize.height;

					}

				}

				var wPosX = wChkX - wBsX;
				var wPosY = wChkY - wBsY;

				wPosY *= -1;

				// ���W����������
				var wUpper;
				if ( wPosY >= (wInc * wPosX) ) {
					wUpper = true;

				// ���W��������艺
				} else {
					wUpper = false;

				}

				// ��G���A
				if ( pYkind == 'top' ) {
					if ( wUpper ) wBorder = true;

				// ���G���A
				} else {
					if ( !wUpper ) wBorder = true;

				}

				return wBorder;
			};

			// ���C���J�n�ʒu�Z�o
			function getLinePos( pKind, pPos, pSize ) {
				var wLinePos = { x: 0, y: 0 };

				switch(pKind) {
				// ��
				case 'top':
					wLinePos.x = pPos.left + Math.floor(pSize.width / 2);
					wLinePos.y = pPos.top - self._DEF_CANVAS_LINE_PADDING;
					break;

				// ��
				case 'bottom':
					wLinePos.x = pPos.left + Math.floor(pSize.width / 2);
					wLinePos.y = pPos.top  + pSize.height;
					break;

				// ��
				case 'left':
					wLinePos.x = pPos.left - self._DEF_CANVAS_LINE_PADDING;
					wLinePos.y = pPos.top + Math.floor(pSize.height / 2);
					break;

				// �E
				case 'right':
					wLinePos.x = pPos.left + pSize.width;
					wLinePos.y = pPos.top  + Math.floor(pSize.height / 2);
					break;

				}
				
				return wLinePos;
			};

			// �`��J�n�_�擾
			function getStartPoint( pStPos, pStSize, pEdPos, pEdSize ) {
				var wStPoint;

				// �Ώۂ��E��
				if ( pStPos.left < (pEdPos.left + pEdSize.width) ) {
					// �Ώۂ��E�[���E��
					if ( (pStPos.left + pStSize.width) < pEdPos.left ) {
						// �Ώۂ��㕔���E������
						if ( chkBorderLine('top', 'right', pStPos, pStSize, pEdPos, pEdSize) ) {
							wStPoint = getLinePos( 'top',    pStPos, pStSize );

						// �Ώۂ��������E����艺
						} else if ( chkBorderLine('bottom', 'right', pStPos, pStSize, pEdPos, pEdSize) ) {
							wStPoint = getLinePos( 'bottom', pStPos, pStSize );

						// �ȊO
						} else {
							wStPoint = getLinePos( 'right', pStPos, pStSize );

						}

					// �ȊO
					} else {
						if ( pStPos.top < pEdPos.top ) {
							wStPoint = getLinePos( 'bottom', pStPos, pStSize );
						} else {
							wStPoint = getLinePos( 'top',    pStPos, pStSize );
						}

					}

				// �Ώۂ�����
				} else {
					// �Ώۂ��㕔���E������
					if ( chkBorderLine('top', 'left', pStPos, pStSize, pEdPos, pEdSize) ) {
						wStPoint = getLinePos( 'top',    pStPos, pStSize );

					// �Ώۂ��������E����艺
					} else if ( chkBorderLine('bottom', 'left', pStPos, pStSize, pEdPos, pEdSize) ) {
						wStPoint = getLinePos( 'bottom', pStPos, pStSize );

					// �ȊO
					} else {
						wStPoint = getLinePos( 'left',  pStPos, pStSize );

					}

				}
				
				return wStPoint;
			
			};

			// �`��J�n�_�擾
			function getStartRelayPoint( pRelayPos, pRelaySize ) {
				var wStPoint = { x: 0, y: 0 };

				// ���p�_�̒��S
				wStPoint.x = pRelayPos.left + Math.floor(pRelaySize.width / 2);
				wStPoint.y = pRelayPos.top  + Math.floor(pRelaySize.height / 2);

				return wStPoint;
			
			};

			// �J�n�I�u�W�F�N�g
			var wStPos		= pLineParam.StPos;
			var wStSize		= pLineParam.StSize;
			var wStArrow	= pLineParam.StArrow;
			var wStRelay	= pLineParam.StRelay;
			var wStRelayCmt	= pLineParam.StRelayCmt;

			// �I���I�u�W�F�N�g
			var wEdPos		= pLineParam.EdPos;
			var wEdSize		= pLineParam.EdSize;
			var wEdArrow	= pLineParam.EdArrow;
			var wEdRelay	= pLineParam.EdRelay;
			var wEdRelayCmt	= pLineParam.EdRelayCmt;

			// �ڑ���
			var wStToPos;
			var wStToSize;
			var wEdToPos;
			var wEdToSize;

			// ���ԓ_
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

			// �J�n�_�����p�_
			var wStPoint;
			if ( wStRelay ) {
				// ���Ȃ��@�܂��́@�R�����g�Ȃ�
				if ( !wStArrow || !wStRelayCmt ) {
					wStPoint = getStartRelayPoint( wStPos, wStSize );
				} else {
					wStPoint = getStartPoint( wStPos, wStSize, wStToPos, wStToSize );
				}

			// �ȊO
			} else {
				wStPoint = getStartPoint( wStPos, wStSize, wStToPos, wStToSize );
			}

			// �I���_�����p�_
			var wEdPoint;
			if ( wEdRelay ) {
				// ���Ȃ��@�܂��́@�R�����g�Ȃ�
				if ( !wEdArrow || !wEdRelayCmt ) {
					wEdPoint = getStartRelayPoint( wEdPos, wEdSize );
				} else {
					wEdPoint = getStartPoint( wEdPos, wEdSize, wEdToPos, wEdToSize );
				}

			// �ȊO
			} else {
				wEdPoint = getStartPoint( wEdPos, wEdSize, wEdToPos, wEdToSize );
			}

			return { StPoint: wStPoint, EdPoint: wEdPoint };

		} catch(e) {
			throw { name: 'canvasGetDrawPoint.' + e.name, message: e.message };
		}
	};

	// ���`����擾
	clsCanvas.prototype.canvasGetArrowInf = function( pStPoint, pEdPoint ) {
		try {
			// ���̒������Z���ꍇ�͖��`��Ȃ�
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

			// ���ݒ�
			var wArrowInf = Object.create( this._CanvasArrow );

			// ���T�C�Y�␳
			if ( wWidthAbs < (wArrowInf.width * 2) ) {
				wArrowInf.width  = Math.floor(wArrowInf.width / 2);
				wArrowInf.height = Math.floor(wArrowInf.height / 1.5);

				// ���������T�C�Y��1/2�ȉ��Ȃ�`��Ȃ�
				if ( wWidthAbs < (wArrowInf.width + 1) ) {
					return null;
				}
				
			}

			// ���`��J�n�_�Z�o
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
	// �`��
	// **************************************************************

	// ���`��
	// pLineKind { width: ���T�C�Y, color: ���F, style: �����, way: ������ }
	clsCanvas.prototype.canvasDrawLine = function( pStPoint, pEdPoint, pLineKind ) {
		try {
			if ( !this._CanvasContext ) return false;

			this._CanvasContext.lineWidth   = pLineKind.width;
			this._CanvasContext.strokeStyle = pLineKind.color;
			this._CanvasContext.fillStyle   = pLineKind.color;

			// ����ݒ�
			if ( pLineKind.style == 'dash' ) {
				// �j��
				this._CanvasContext.lineCap     = 'butt';

			} else {
				// �ʏ�
				this._CanvasContext.lineCap     = 'round';

			}

			// �J�n�E�I���_�ݒ�
			var wPntSt = [];
			var wPntEd = [];
			var wPntCnt = 0;

			wPntSt.push( Object.create( pStPoint ) );
			if ( pLineKind.point ) {
				// ���ԓ_����
				for( var wPoint in pLineKind.point ) {
					wPntEd.push( Object.create( pLineKind.point[wPoint] ) );
					wPntSt.push( Object.create( pLineKind.point[wPoint] ) );
					wPntCnt++;
					
				}
			}
			wPntEd.push( Object.create( pEdPoint ) );

			var wArrowSt = [];
			var wArrowEd = [];

			// ���`��񐔐ݒ�
			var wWayAry = [];
			// ������
			if ( (pLineKind.way == 1) || (pLineKind.way == 3) ) {
				wWayAry.push( 1 );

				// ���������ݒ�
				wArrowSt.push( Object.create( wPntSt[wPntCnt] ) );
				wArrowEd.push( Object.create( wPntEd[wPntCnt] ) );
			}

			// �t����
			if ( (pLineKind.way == 2) || (pLineKind.way == 3) ) {
				wWayAry.push( 2 );

				// �t�������ݒ�
				wArrowSt.push( Object.create( wPntEd[0] ) );
				wArrowEd.push( Object.create( wPntSt[0] ) );
			}

			// ���`��
			for( var wPidx = 0; wPidx < wPntSt.length; wPidx++ ) {
				// �j��
				if ( pLineKind.style == 'dash' ) {
					this.canvasDrawDash( wPntSt[wPidx], wPntEd[wPidx] );

				// ��
				} else if ( pLineKind.style == 'stripe' ) {
					this.canvasDrawStripe( wPntSt[wPidx], wPntEd[wPidx] );

				// �ȊO
				} else {
					this.canvasDrawNormal( wPntSt[wPidx], wPntEd[wPidx] );

				}

			}

			// ���`��
			if ( pLineKind.way != 0 ) {
				for( var wCnt = 0; wCnt < wWayAry.length; wCnt++ ) {
					// ���`����擾
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

	// �����`��
	clsCanvas.prototype.canvasDrawNormal = function( pStPoint, pEdPoint ) {
		try {
			if ( !this._CanvasContext ) return false;

			// �`��
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

	// 2�_�Ԃ𕪊�
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

				// �ŏI�_�𒴂���ΏI��
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

	// ����ʒu�̐����|�C���g�擾
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

	// �j���`��
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

			// �ŏ��j���T�C�Y�ȉ��Ȃ璼���`��
			if ( wWidthAbs < (this._CanvasDash.interval * 2) ) {
				this.canvasDrawNormal( pStPoint, pEdPoint );
				return true;
			}

			var wPointCnt = Math.floor( wWidthAbs / this._CanvasDash.interval );

			// 2�_�Ԃ𕪊�
			wPointX = this.canvasGetSplitPoint( pStPoint.x, pEdPoint.x, wWidthX, wPointCnt );
			wPointY = this.canvasGetSplitPoint( pStPoint.y, pEdPoint.y, wWidthY, wPointCnt );

			// �`��
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

	// �Ȑ��`��
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

			// �ŏ��j���T�C�Y�ȉ��Ȃ璼���`��
			if ( wWidthAbs < (this._CanvasStripe.interval * 2) ) {
				this.canvasDrawNormal( pStPoint, pEdPoint );
				return true;
			}

			var wPointCnt = Math.floor( wWidthAbs / this._CanvasStripe.interval );

			// 2�_�Ԃ𕪊�
			wPointX = this.canvasGetSplitPoint( pStPoint.x, pEdPoint.x, wWidthX, wPointCnt, false );
			wPointY = this.canvasGetSplitPoint( pStPoint.y, pEdPoint.y, wWidthY, wPointCnt, false );

			// �`��
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
				// �X�����l�������ΐ��̒����ݒ�
				var wX = pEdPoint.x - pStPoint.x;
				var wY = pEdPoint.y - pStPoint.y;

				var wSlope = Math.sqrt( Math.pow(wX, 2) + Math.pow(wY, 2) );
				var wVx = wX / wSlope;
				var wVy = wY / wSlope;

				wPx = Math.floor(wPx * wVy);
				wPy = Math.floor(wPy * wVx);

			}

			var wStripe;

			// �ŏI�_�ɂ̓��C���`��Ȃ�
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

	// ���`��
	// pArrowInf { width: ���̒���, height: ���̍����i�����j }
	clsCanvas.prototype.canvasDrawArrow = function( pStPoint, pEdPoint, pArrowInf, pAdjustment ) {
		try {
			if ( !this._CanvasContext ) return false;

			var wWidthX = pEdPoint.x - pStPoint.x;
			var wWidthY = pEdPoint.y - pStPoint.y;

			if ( !pArrowInf ) {
				pArrowInf = Object.create( this._CanvasArrow );
			}

			// ���T�C�Y�␳����
			if ( pAdjustment == true ) {
				var wWidthAbs = Math.abs( wWidthX );
				if ( wWidthAbs < Math.abs(wWidthY) ) wWidthAbs = Math.abs(wWidthY);

				// ���T�C�Y�␳
				if ( wWidthAbs < (pArrowInf.width * 2) ) {
					pArrowInf.width  = Math.floor(pArrowInf.width / 2);
					pArrowInf.height = Math.floor(pArrowInf.height / 1.5);

					// ���������T�C�Y��1/2�ȉ��Ȃ璼���`��
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

			// ���㕔
			wPoint.push(0, 0);
			for ( var wUidx = 0; wUidx < wArrowPoint.length; wUidx++ ) {
				wX = wArrowPoint[wUidx].x;
				wY = wArrowPoint[wUidx].y;
				if ( wX < 0 ) wX += wLen;

				wPoint.push(wX, wY);
			}
			wPoint.push(wLen, 0);

			// ��󉺕�
			for ( var wDidx = (wArrowPoint.length - 1); wDidx > 0; wDidx-- ) {
				wX = wArrowPoint[wDidx].x;
				wY = wArrowPoint[wDidx].y;
				if ( wX < 0 ) wX += wLen;

				wPoint.push(wX, -wY);
			}
			wPoint.push(0, 0);

			// �`��
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

	// �N���A
	clsCanvas.prototype.canvasClear = function( ) {
		try {
			if ( !this._CanvasContext ) return false;

			this._CanvasContext.clearRect(0, 0, this._CanvasSize.width, this._CanvasSize.height);

		} catch(e) {
			throw { name: 'canvasClear', message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsCanvas.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_CANVAS_PROPERY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁucanvas�v
				wInitArgument.kind = this._DEF_CANVAS_KIND;

			}

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssCanvas-base' );

			if ( !this._CanvasStripe ) this._CanvasStripe = {};
			this.copyProperty( this._DEF_CANVAS_STRIPE, this._CanvasStripe );

			// �L�����o�X�T�C�Y�ݒ�
			var wArgSize = this.loadArgument( 'size' );
			if ( wArgSize ) {
				this.copyProperty( wArgSize, this._CanvasSize );
			
			} else {
				this.copyProperty( this._DEF_CANVAS_SIZE, this._CanvasSize );

			}

			// �L�����o�X����
			this.canvasCreate();

			// �L�����o�X�ƃx�[�X�̃T�C�Y����
			var wSizeStyle = {
				  'width'  : this._CanvasSize.width  + 'px'
				, 'height' : this._CanvasSize.height + 'px'
			};
			this.setStyle( this.getBoxElement(), wSizeStyle );

			// ��R���e���c�\��
			this.dspBox( true );

		} catch(e) {
			throw { name: 'clsCanvas.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsCanvas.prototype.freeClass = function() {
		try {
			// Canvas�폜
			if ( this.CanvasEle ) {
				this.execFunction( this.delElement, this.CanvasEle );
			}

			// �v���p�e�B�J��
			this._CanvasContext				= null;
			this._CanvasEle					= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};
}());
