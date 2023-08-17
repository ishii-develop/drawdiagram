// --------------------------------------------------------------------
//
// �p�l���R���g���[���N���X
//
// --------------------------------------------------------------------
// clsPanelControl �� clsBaseBox
// --------------------------------------------------------------------
var clsPanelControl = function( pArgument ) {
	try {
		var self = this;

		this._DEF_PANELCTRL_KIND		= 'panel';

		this._DEF_PANELCTRL_PROPERY		= {
			 'z-index'				: '30'
		};

		// �p�����N���X��prototype
		this._BasePrototype				= null;

		// ���N���X�̃v���p�e�B
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
		// �C�x���g����
		// **************************************************************
		
		// window�Ƃ�resize�����C�x���g
		this.eventPanelSyncResize = function( pEvent ) {
			try {
				// �����^�[�Q�b�g�����Ȃ珈���Ȃ�
				if ( !self._PanelCtrlSyncBody ) return true;
				if ( self._PanelCtrlSyncEle.length == 0 ) return true;

				var wWinSize = self.getSize( self._PanelCtrlSyncBody );
				var wWinHeight;
				var wWinWidth;
				var wTarget;

				// �R���g���[���ʒu
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
							// �E�p�l��
							if ( wTarget.position == 'right' ) {
								// �R���g���[���ʒu�␳
								wWinWidth -= (wCtrlPos.left + self._PanelCtrlSize.width);

							// �ȊO
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
		// �@���ڈړ�
		// ---------------

		// �R���g���[���p�l���ړ��@�J�n
		this.eventPanelMoveStart = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ���N���b�N�̂ݗL��
				var wClick = self.getEventClick( pEvent );
				if ( wClick.left ) {
					// �p�l���ړ��J�n
					self.startPanelMove();
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �R���g���[���p�l���ړ��@�ړ���
		this.eventPanelMove = function( pEvent ) {
			try {
				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				var wEle = self.getBoxElement();
				if ( (!wEle) || (!self._PanelMovePos) ) {
					throw { name: 'eventPanelMove', message: '�R���g���[���p�l������������Ă��܂���' };
				}

				// �h���b�O���Ă��Ȃ���Ώ����I��
				var wClickChk = self.getEventMouse( pEvent );
				if ( !wClickChk.right ) {
					// �p�l���ړ��I��
					self.cancelPanelMove();

				} else {
					var wPoint = self.getEventPos( pEvent );
					wPoint.x -= self._PanelMovePos.left;
					
					// ���[ or �ő�T�C�Y���͏����Ȃ�
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

		// �R���g���[���p�l���ړ��@�I��
		this.eventPanelMoveStop = function( pEvent ) {
			try {
				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				// �p�l���ړ��I��
				self.cancelPanelMove();

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ---------------
		// �@�R�}���h
		// ---------------

		// �ő剻�^�ŏ��������N�@�N���b�N�C�x���g
		this.eventClickLink = function( pEvent ) {
			try {
				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				// ���얳�����͏����Ȃ�
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
		// �R���X�g���N�^
		// **************************************************************
		// �e�N���X��prototype��ۑ�
		this._BasePrototype = clsBaseBox.prototype;

		// �e�N���X��constructor
		// ���p�������uinitClass�v��call�����
		clsBaseBox.call(this, pArgument );


	} catch(e) {
		throw { name: 'clsPanelControl.' + e.name, message: e.message };
	}
	
};

// �p�l���R���g���[�� prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsPanelControl, clsBaseBox );

	// **************************************************************
	// ��{����
	// **************************************************************

	// ��ʂ̑���ېݒ�
	clsPanelControl.prototype.setControlValid = function( pValid ) {
		try {
			// ����ېݒ�
			this._PanelCtrlValid = pValid;

		} catch(e) {
			throw { name: 'setControlValid.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ����v�f�ݒ�
	// **************************************************************

	// �R���g���[���p�l������
	clsPanelControl.prototype.createControlPanel = function() {
		try {
			var wCtrlEle = this.getBoxElement();
			if ( !wCtrlEle ) return false;

			// ����p�v�f����
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
	
	// �ŏ����^�ő剻�����N����
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
	// �Ǘ��Ώۗv�f�֘A
	// **************************************************************

	// �Ǘ��Ώۃp�l���ݒ�
	clsPanelControl.prototype.setTargetPanel = function( pLeftPanel, pRightPanel ) {
		try {
			var wWinBody = this.getBoxBody();
			var wWinSize = this.getSize( wWinBody );

			var wLeft = 0;
			var wHeight;
			var wWidth;
			if ( pLeftPanel ) {
				// �R���g���[���p�l���ړ��Ɠ���
				var wLeftPos  = this.getPosByStyle( pLeftPanel );
				var wLeftSize = this.getSize( pLeftPanel );

				wLeft   = wLeftPos.left + wLeftSize.width;
				wHeight = wWinSize.height - 3;

				this.setBoxStyle( { left: wLeft + 'px', height: wHeight + 'px' } );

				this._PanelLeftEle = { element: pLeftPanel, pos: wLeftPos };

				this._PanelLeftMax = wLeft;

				// window��Resize�Ɠ����֒ǉ�
				this._PanelCtrlSyncEle.push( { element: pLeftPanel, position: 'left', diffHeight: 3, diffWidth: null } );
			}

			if ( pRightPanel ) {
				// �R���g���[���p�l���ړ��Ɠ���
				wLeft  += this._PanelCtrlSize.width;
				wHeight = wWinSize.height;
				wWidth  = wWinSize.width - wLeft - 1;

				pRightPanel.style.left   = wLeft + 'px';
				pRightPanel.style.height = wHeight + 'px';
				pRightPanel.style.width  = wWidth + 'px';
				
				this._PanelRightEle = { element: pRightPanel, winBody: wWinBody };

				// window��Resize�Ɠ����֒ǉ�
				this._PanelCtrlSyncEle.push( { element: pRightPanel, position: 'right', diffHeight: 0, diffWidth: wLeft } );
			}
			return true;

		} catch(e) {
			throw { name: 'setTargetPanel.' + e.name, message: e.message };
		}
	};

	// �R���g���[���p�l���ړ�
	clsPanelControl.prototype.movePanel = function( pElement, pPoint ) {
		try {
			pElement.style.left = (pPoint.x) + "px";

			// ���p�l��
			if ( this._PanelLeftEle ) {
				var wLeftEle = this._PanelLeftEle.element;
				if ( wLeftEle ) {
					var wLeftPos = this._PanelLeftEle.pos;
					var wLeftWidth = wLeftPos.left + pPoint.x;
					wLeftEle.style.width = wLeftWidth + 'px';
				}
			}

			// �E�p�l��
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
	// �C�x���g�֘A
	// **************************************************************

	// Window���T�C�Y�ɓ���
	clsPanelControl.prototype.syncWindowOnResize = function( pSyncEle, pDiffHeight, pDiffWidth ) {
		try {
			// �����^�[�Q�b�g�����Ȃ珈���Ȃ�
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
					throw { name: 'syncWindowOnResize', message: '�����Ώۂ�document���擾�ł��܂���' };
				}
				wSyncBody = this.getDocumentBody( wDocument );
			} else {
				wSyncBody = wPenelWin;
			}
			this._PanelCtrlSyncBody = wSyncBody;

			// �����Ώېݒ�
			this._PanelCtrlSyncEle.push( { element: pSyncEle, position: 'center', diffHeight: pDiffHeight, diffWidth: wDiffWidth } );

			// Window�̃��T�C�Y�Ɠ���
			this.addEvent( wPenelWin, 'onresize', this.eventPanelSyncResize );

			return true;

		} catch(e) {
			throw { name: 'syncWindowOnResize.' + e.name, message: e.message };
		}
	}

	// �C�x���g�����ݒ�
	clsPanelControl.prototype.initPanelEvent = function() {
		try {
			// window��Resize�Ɠ���
			if ( !this.syncWindowOnResize( this.getBoxElement(), 3, null ) ) {
				throw { name: 'syncWindowOnResize', message: '�����Ώۂ������ł�' };

			}

			// �s�v�ȃC�x���g�𖳌���
			this.addBoxEvents( 'oncontextmenu'	, this.eventInvalid );

			// �ړ��C�x���g�ݒ�
			this.addBoxEvents( 'onmousedown'	, this.eventPanelMoveStart );

		} catch(e) {
			throw { name: 'initPanelEvent.' + e.name, message: e.message };
		}
	};

	// �R���g���[���p�l���ړ��C�x���g�@�ǉ�
	clsPanelControl.prototype.addPanelMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.addEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPanelMove );

			// �ʒu�m��
			this.addEvent( this.getBoxWindow(), 'onmouseup'		, this.eventPanelMoveStop );

		} catch(e) {
			throw { name: 'addPanelMoveEvent.' + e.name, message: e.message };
		}
	};

	// �R���g���[���p�l���ړ��C�x���g�@�폜
	clsPanelControl.prototype.delPanelMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.delEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPanelMove );

			// �ʒu�m��
			this.delEvent( this.getBoxWindow(), 'onmouseup'		, this.eventPanelMoveStop );

		} catch(e) {
			throw { name: 'delPanelMoveEvent.' + e.name, message: e.message };
		}
	};

	// �R���g���[���p�l���ړ��@�J�n������
	clsPanelControl.prototype.startPanelMove = function() {
		try {
			// ��U�L�����Z��
			this.cancelPanelMove();

			// ���얳�����͏����Ȃ�
			if ( !this._PanelCtrlValid ) return true;

			// ���݈ʒu�擾
			this._PanelMovePos = this.getParentPos();

			// �C�x���g�ǉ�
			this.addPanelMoveEvent();

			// �őO�ʕ\��
			this.setBoxToFront( true );

			return true;

		} catch(e) {
			throw { name: 'startPanelMove.' + e.name, message: e.message };
		}
	};

	// �R���g���[���p�l���ړ��@�I��������
	clsPanelControl.prototype.cancelPanelMove = function() {
		try {
			// �C�x���g��~
			this.delPanelMoveEvent();

			this._PanelMovePos = null;

			// �őO�ʉ���
			this.setBoxToFront( false );

		} catch(e) {
			throw { name: 'cancelPanelMove.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h
	// **************************************************************

	// �R���X�g���N�^
	clsPanelControl.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_PANELCTRL_PROPERY );

			// ��ʁupanel�v
			wInitArgument.kind = this._DEF_PANELCTRL_KIND;

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// �R���g���[���p�l���g�p�L��
			var wIsUsed		= true;
			var wControlCls	= 'cssControl';

			if ( pArgument ) {
				if ( 'control' in pArgument ) wIsUsed = pArgument.control;
			}

			// �g�p����
			if ( wIsUsed ) {
				// ����p�v�f����
				if ( !this.createControlPanel(wIsUsed) ) {
					throw { name: 'createControlPanel', message: '����p�v�f�𐶐��ł��܂���B' };
				
				}
			
			// �g�p���Ȃ�
			} else {
				// ���g�p���N���X�ɕύX
				 wControlCls += '-NoUsed';

			}

			// �N���X�ǉ�
			this.setBoxClass( wControlCls );
			this.setBoxClass( 'no-print' );

			// ���샊���N�ݒ�
			this.setControlLink( true );

			// ����p�p�l���\��
			this.dspBox( true );

			// �p�l���T�C�Y�ۑ�
			this._PanelCtrlSize = this.getBoxSize();

			// �p�l���ݒ�
			var wPanelLeft  = this.getArgument( pArgument, 'panelLeft' );
			var wPanelRight = this.getArgument( pArgument, 'panelRight' );
			this.setTargetPanel( wPanelLeft, wPanelRight );

			// �C�x���g�ݒ�
			this.initPanelEvent();

			// ����T�C�Y�ݒ�
			this.eventPanelSyncResize();

		} catch(e) {
			throw { name: 'clsPanelControl.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsPanelControl.prototype.freeClass = function() {
		try {
			// �C�x���g�폜
			this.execFunction( this.delPanelMoveEvent );

			// ���T�C�Y�����C�x���g�폜
			this.execFunction( this.delEvent, this.getBoxWindow(), 'onresize', this.eventPanelSyncResize );

			// �v���p�e�B�J��
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

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};

}());
