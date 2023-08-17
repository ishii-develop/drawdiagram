
// --------------------------------------------------------------------
//
// �t���[���C�����N���X
//
// --------------------------------------------------------------------
// clsItemFreeLine �� clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsItemFreeLine = function( pArgument ) {
	try {
		var self = this;

		this._DEF_FREELINE_KIND				= 'item-freeline';

		this._DEF_FREELINE_STYLE			= {
				  'z-index'				: '260'
			};

		// ----------------------------------
		// ���j���[�ݒ�
		// ----------------------------------
		this._DEF_FREELINE_MENU_CONTEXT		= {
			  3: [
				  { kind: 'line-color'	, title: '���C���]�F'		}
				, { kind: 'line-style'	, title: '���C���]���'		}
				, { kind: 'line-width'	, title: '���C���]����'		}
			  ]
			, 4: [
				  { kind: 'delete'		, title: '�폜�i�ꕔ�j'		}
				, { kind: 'delete-all'	, title: '�폜�i�S�āj'		}
			  ]
		};

		this._DEF_FREELINE_MENU_STYLE	= {
			  1: [
				  { kind: 'normal'		, title: '�ʏ�'		}
				 ,{ kind: 'dash'		, title: '�_��'		}
			  ]
		};

		this._DEF_FREELINE_MENU_WIDTH	= {
			  1: [
				  { kind: '0.5'			, title: '�ׂ�'			}
				 ,{ kind: '1'			, title: '�ʏ�'			}
				 ,{ kind: '2.5'			, title: '����'			}
				 ,{ kind: '5'			, title: '�ő�'			}
			  ]
		};

		// ----------------------------------
		// �X�e�[�^�X���
		// ----------------------------------

		this._DEF_FREELINE_LINE				= { 
				  width		: 0.5
				, style		: 'normal'
				, color		: '#080808'
				, way		: 0
		};

		// �p�����N���X��prototype
		this._ItemPrototype						= null;

		// �t���[���C�����
		this._FreeLineDrag						= false;
		this._FreeLineStatus					= null;
		this._FreeLinePoint						= {};

		this._FreeLinePointMove					= null;

		this._FreeLineMenuLineStyle				= null;
		this._FreeLineMenuLineWidth				= null;


		// **************************************************************
		// ���j���[�C�x���g����
		// **************************************************************

		// ���C���@�J���[�p���b�g�I�����C�x���g
		this.eventLineColorSelect = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// �F�I����
				var wColor = pParam.color;

				// �F�ύX
				self.setFreeLineStatus( { color: wColor }, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���C���@����I�����C�x���g
		this.eventLineStyleSelect = function( pEvent, pSelectMenu ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// ����ύX
				self.setFreeLineStatus( { style: wKind }, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���C���@�����I�����C�x���g
		this.eventLineWidthSelect = function( pEvent, pSelectMenu ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// �����ύX
				self.setFreeLineStatus( { width: wKind }, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// �|�C���g�C�x���g
		// **************************************************************

		// �|�C���g�ړ��@�J�n
		this.eventPointMoveStart = function( pEvent ) {
			try {
				// �R�����g�h���b�O�����̂ݏ���
				if ( !self._FreeLineDrag ) return true;

				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				// ���N���b�N�̂ݗL��
				var wClick = self.getEventClick( pEvent );
				if ( wClick.left ) {
					// �ړ��J�n
					self.startPointMove( pEvent );
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �|�C���g�ړ��@�ړ���
		this.eventPointMove = function( pEvent ) {
			try {
				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				if ( !self._FreeLinePointMove ) return false;

				// �R�����g�ړ�
				var wPoint = self.getEventPos( pEvent );
				self.movePoint( wPoint );

			} catch(e) {
				self.execFunction( self.cancelPointMove );
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �|�C���g�ړ��@�I��
		this.eventCmtPointStop = function( pEvent ) {
			try {
				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				if ( self._FreeLinePointMove ) {
					// �ړ���`�F�b�N
					var wStayFlg = false;
					
					// �J�n�ʒu�Ɠ����Ȃ珈���Ȃ�
					var wStPos = self._FreeLinePointMove.startpos;
					if ( self.isObject(wStPos) ) {
						var wEvtPos = self.getEventPos( pEvent );
						if ( (wEvtPos.x == wStPos.x) && (wStPos.y == wStPos.y) ) wStayFlg = true;
					}

					if ( !wStayFlg ) {
						// �e�֕ύX��ʒm
						self.execItemCallback( pEvent, { kind: 'freeLine' } );
					
					}
				
				}

				// �ړ��I��
				self.cancelPointMove();

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// �R���X�g���N�^
		// **************************************************************
		// �e�N���X��prototype��ۑ�
		this._ItemPrototype = clsItemBox.prototype;

		// �e�N���X��constructor
		// ���p�������uinitClass�v��call�����
		clsItemBox.call( this, pArgument );

	} catch(e) {
		throw { name: 'clsItemFreeLine.' + e.name, message: e.message };
	}
};

// �֌W��� prototype
(function(){
	// clsItemBox�̃v���g�^�C�v���p��
	clsInheritance( clsItemFreeLine, clsItemBox );

	// **************************************************************
	// �v���p�e�B�ݒ�/�擾
	// **************************************************************

	// ���C�����擾
	clsItemFreeLine.prototype.getLineStatus = function( ) {
		try {
			if ( !this._FreeLineStatus ) {
				this._FreeLineStatus = {};
				this.copyProperty( this._DEF_FREELINE_LINE, this._FreeLineStatus );
			}

			var wResult = {};
			this.copyProperty( this._FreeLineStatus, wResult );

			return wResult;

		} catch(e) {
			throw { name: 'getLineStatus', message: e.message };
		}
	};

	// ���C�����ݒ�
	clsItemFreeLine.prototype.setLineStatus = function( pLineStatus ) {
		try {
			if ( !this.isObject(pLineStatus) ) return;

			if ( !this._FreeLineStatus ) this._FreeLineStatus = {};
			this.copyProperty( pLineStatus, this._FreeLineStatus );

		} catch(e) {
			throw { name: 'setLineStatus', message: e.message };
		}
	};

	// �ڑ��_�ݒ�
	clsItemFreeLine.prototype.setLinePoint = function( pPointId ) {
		try {
			if ( !this._FreeLinePoint ) this._FreeLinePoint = {};

			this._FreeLinePoint[pPointId] = true;

		} catch(e) {
			throw { name: 'setLinePoint', message: e.message };
		}
	};

	// �ڑ��_�폜
	clsItemFreeLine.prototype.delLinePoint = function( pPointId ) {
		try {
			if ( !this._FreeLinePoint ) return;

			// �L���Ȑڑ��_
			if ( pPointId in this._FreeLinePoint ) {
				// �폜
				delete this._FreeLinePoint[pPointId];
			}

		} catch(e) {
			throw { name: 'delLinePoint', message: e.message };
		}
	};

	// �ڑ��_�擾
	clsItemFreeLine.prototype.getLinePoint = function( ) {
		try {
			if ( !this._FreeLinePoint ) return null;

			// �L���ȃ|�C���g�Ȃ����null
			for( var wKey in this._FreeLinePoint ) {
				if ( wKey ) return this._FreeLinePoint;
			}

			return null;

		} catch(e) {
			throw { name: 'getLinePoint', message: e.message };
		}
	};

	// �ڑ��_�`�F�b�N
	clsItemFreeLine.prototype.chkLinePoint = function( pPointId ) {
		try {
			if ( !this.isObject(this._FreeLinePoint) ) return false;

			return ( pPointId in this._FreeLinePoint );

		} catch(e) {
			throw { name: 'chkLinePoint', message: e.message };
		}
	};


	// **************************************************************
	// �t���[���C����Ԑݒ�
	// **************************************************************

	// ���C���X�e�[�^�X�X�V
	clsItemFreeLine.prototype.setFreeLineStatus = function( pStatus, pUpdate ) {
		try {
			if ( !this.isObject(pStatus) ) return;

			var wLineStatus = this.getLineStatus();

			// ���C���X�e�[�^�X�X�V
			var wUpdFlg = false;
			for( var wKey in pStatus ) {
				if ( wKey in wLineStatus ) {
					if ( String(pStatus[wKey]) != String(wLineStatus[wKey]) ) wUpdFlg = true;
				}

				wLineStatus[wKey] = pStatus[wKey];
			}

			// �X�V���͕ύX������ꍇ�̂ݏ���
			if ( pUpdate ) {
				if ( !wUpdFlg ) return;
			}

			// �V�X�e�[�^�X�ݒ�
			this.setLineStatus( wLineStatus );

			// �ݒ�ύX��ʒm
			if ( pUpdate ) {
				this.execItemCallback( null, { kind: 'freeLineUpd' } );
			}

		} catch(e) {
			throw { name: 'setFreeLineStatus' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���L���j���[����
	// **************************************************************

	// �J���[���j���[�\��
	clsItemFreeLine.prototype.dspLineColorMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �J���[���j���[�\��
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				var wPoint = this.getEventPos( pEvent );
				wColorMenu.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLineColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspLineColorMenu.' + e.name, message: e.message };
		}
	};

	// ���탁�j���[�\��
	clsItemFreeLine.prototype.dspLineStyleMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// ���탁�j���[�\��
			if ( this._FreeLineMenuLineStyle ) {
				var wPoint = this.getEventPos( pEvent );
				this._FreeLineMenuLineStyle.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLineStyleSelect } );
			}

		} catch(e) {
			throw { name: 'dspLineStyleMenu.' + e.name, message: e.message };
		}
	};

	// �������j���[�\��
	clsItemFreeLine.prototype.dspLineWidthMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �����������j���[�\��
			if ( this._FreeLineMenuLineWidth ) {
				var wPoint = this.getEventPos( pEvent );
				this._FreeLineMenuLineWidth.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLineWidthSelect } );
			}

		} catch(e) {
			throw { name: 'dspLineWidthMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �|�C���g�ړ�
	// **************************************************************

	// �|�C���g�ړ��C�x���g�@�ǉ�
	clsItemFreeLine.prototype.addPointMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.addEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPointMove );

			// �ʒu�m��
			this.addEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtPointStop );

		} catch(e) {
			throw { name: 'addPointMoveEvent.' + e.name, message: e.message };
		}
	};

	// �|�C���g�ړ��C�x���g�@�폜
	clsItemFreeLine.prototype.delPointMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.delEvent( this.getBoxWindow(), 'onmousemove'	, this.eventPointMove );

			// �ʒu�m��
			this.delEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtPointStop );

		} catch(e) {
			throw { name: 'delPointMoveEvent.' + e.name, message: e.message };
		}
	};

	// �|�C���g�ړ��@�I��������
	clsItemFreeLine.prototype.cancelPointMove = function() {
		try {
			// �C�x���g��~
			this.delPointMoveEvent();

			this._FreeLinePointMove = null;

			// �őO�ʉ���
			this.setBoxToFront( false );

		} catch(e) {
			throw { name: 'cancelPointMove.' + e.name, message: e.message };
		}
	};

	// �|�C���g�ړ��@�J�n������
	clsItemFreeLine.prototype.startPointMove = function( pEvent ) {
		try {
			// ��U�L�����Z��
			this.cancelPointMove();

			this._FreeLinePointMove = {};

			// �e�̈ʒu��ۑ�
			this._FreeLinePointMove.parent = this.getParentPos();

			// �N���b�N�ʒu��ۑ�
			var wEvtPos = this.getEventPos( pEvent );
			var wItmPos = this.getBoxPos();

			this._FreeLinePointMove.startpos = {};
			this.copyProperty( wEvtPos, this._FreeLinePointMove.startpos );

			this._FreeLinePointMove.drag = {
				  left: wEvtPos.x - wItmPos.left
				, top : wEvtPos.y - wItmPos.top
			};

			// �C�x���g�ǉ�
			this.addPointMoveEvent();

			// �őO�ʕ\��
			this.setBoxToFront( true );

			return true;

		} catch(e) {
			throw { name: 'startPointMove.' + e.name, message: e.message };
		}
	};

	// �|�C���g�ړ�
	clsItemFreeLine.prototype.movePoint = function( pPoint ) {
		try {
			var wMovePos = { x: pPoint.x, y: pPoint.y };

			if ( this._FreeLinePointMove ) {
				if ( this._FreeLinePointMove.parent ) {
					wMovePos.x -= this._FreeLinePointMove.parent.left;
					wMovePos.y -= this._FreeLinePointMove.parent.top;

				}

				if ( this._FreeLinePointMove.drag ) {
					wMovePos.x -= this._FreeLinePointMove.drag.left;
					wMovePos.y -= this._FreeLinePointMove.drag.top;
				}
			}

			// �e�v�f�̃X�N���[���l���Z
			var wMainScroll = this.getParentScroll();
			wMovePos.x += wMainScroll.x;
			wMovePos.y += wMainScroll.y;

			// ��[�A���[�͏����Ȃ�
			if ( wMovePos.x <= 0 ) return false;
			if ( wMovePos.y <= 0 ) return false;

			this.setBoxPos( wMovePos );

			return true;

		} catch(e) {
			throw { name: 'movePoint.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �C�x���g
	// **************************************************************

	// �C�x���g�L�����Z��
	clsItemFreeLine.prototype.eventClear = function() {
		try {
			// �ړ��L�����Z��
			this.execFunction( this.cancelPointMove );

			// �J���[���j���[����
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				wColorMenu.hideMenu();
			}

			// ���탁�j���[����
			if ( this._FreeLineMenuLineStyle ) {
				this._FreeLineMenuLineStyle.hideMenu();
			}

			// �������j���[�\��
			if ( this._FreeLineMenuLineWidth ) {
				this._FreeLineMenuLineWidth.hideMenu();
			}


			// �p�����C�x���g�L�����Z������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.eventClear.call( this );

			}

		} catch(e) {
			throw { name: 'clsItemFreeLine.eventClear', message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�g�p�L���ݒ�
	// �� clsItemBox����p��
	clsItemFreeLine.prototype.setContextAvailable = function( pAvailable, pParam ) {
		try {
			// �p�����@�R���e�L�X�g���j���[�g�p�L���ݒ�
			if ( this._ItemPrototype ) {
				this._ItemPrototype.setContextAvailable.call( this, pAvailable, pParam );

			}

			// �h���b�O�����̂ݏ���
			if ( !this.getItemDragIs() ) return;

			// �R�����g�h���b�O��
			this._FreeLineDrag = pAvailable;

			// drag�ۃp�����[�^����
			var wDragParam = false;
			if ( this.isObject(pParam) ) {
				if ( 'drag' in pParam ) wDragParam = true;
			}

			if ( wDragParam ) {
				// �p�����[�^�l���g�p
				this._FreeLineDrag = pParam.drag;

			// �p�����[�^�Ȃ�
			} else {
				// ���j���[�L����
				if ( pAvailable ) {
					// �ʏ펞�h���b�O�ۂ�ݒ�
					this._FreeLineDrag = this.getItemMoveInitIs();

				}
			}

		} catch(e) {
			throw { name: 'setContextAvailable', message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// -------------------
	// ���j���[�֘A
	// -------------------

	// ���j���[�����ݒ�
	clsItemFreeLine.prototype.initItemMenu = function( pArgument ) {
		try {
			// �p�������j���[����������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// ���ڃ��b�N�������s�v
			if ( this.getItemLockIs() ) return;

			// �R�����g�h���b�O����
			if ( this.getItemDragIs() ) {
				this.addBoxEvents( 'onmousedown'	, this.eventPointMoveStart );
			}

			// ���탊�X�g���j���[
			var wStyleList = {};
			this.copyProperty( this._DEF_FREELINE_MENU_STYLE, wStyleList );

			var wStyleMenu = this.loadPublicMenu('lineStyle');
			if ( !wStyleMenu ) {
				wStyleMenu = new clsMenuList( { menuList: wStyleList } );
			}
			wStyleMenu.setMenuList( { menuList: wStyleList } );

			// ���탊�X�g���j���[�Ƃ��ĕۑ�
			this._FreeLineMenuLineStyle = wStyleMenu;

			// �������X�g���j���[
			var wWidthList = {};
			this.copyProperty( this._DEF_FREELINE_MENU_WIDTH, wWidthList );

			var wWidthMenu = this.loadPublicMenu('lineWidth');
			if ( !wWidthMenu ) {
				wWidthMenu = new clsMenuList( { menuList: wWidthList } );
			}
			wWidthMenu.setMenuList( { menuList: wWidthList } );

			// �������X�g���j���[�Ƃ��ĕۑ�
			this._FreeLineMenuLineWidth = wWidthMenu;

		} catch(e) {
			throw { name: 'clsItemFreeLine.initItemMenu.' + e.name, message: e.message };
		}
	};

	// �R�����g�p�R���e�L�X�g���j���[�I��������
	clsItemFreeLine.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// ���C���@�F
			case 'line-color':
				// �F���j���[��\��
				wRetVal = this.dspLineColorMenu( pEvent );
				break;

			// ���C���@���
			case 'line-style':
				// ���탁�j���[��\��
				wRetVal = this.dspLineStyleMenu( pEvent );
				break;

			// ���C���@����
			case 'line-width':
				// �������j���[��\��
				wRetVal = this.dspLineWidthMenu( pEvent );
				break;

			// �S�č폜
			case 'delete-all':
				// �p�������j���[���쏈��
				if ( this._ItemPrototype ) {
					// �p�����[�^�Đݒ�
					pSelectMenu.kind	= 'delete';
					pSelectMenu.delAll	= true;
					wRetVal = this._ItemPrototype.execContextSelect.call( this, pEvent, pSelectMenu );

				}
				break;

			// �ȊO
			default:
				// �p�������j���[���쏈��
				if ( this._ItemPrototype ) {
					wRetVal = this._ItemPrototype.execContextSelect.call( this, pEvent, pSelectMenu );

				}
				break;
			}

			return wRetVal;

		} catch(e) {
			throw { name: 'clsItemFreeLine.execContextSelect.' + e.name, message: e.message };
		}
	};


	// -------------------
	// ��{���֘A
	// -------------------

	// �X�e�[�^�X�����ݒ�
	clsItemFreeLine.prototype.initItemStatus = function( pArgument ) {
		try {
			// �p�����X�e�[�^�X�X�V������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// Load���@�ݒ���e
			var wLoadStatus = this.loadDataVal( 'status' );
			if ( wLoadStatus ) {
				this._FreeLineStatus = wLoadStatus;

			} else {
				// �����l�ݒ�
				if ( !this._FreeLineStatus ) this._FreeLineStatus = {};
				this.copyProperty( this._DEF_FREELINE_LINE, this._FreeLineStatus );

			}

			var wLoadPoint = this.loadDataVal( 'point' );
			if ( wLoadPoint ) {
				this._FreeLinePoint = wLoadPoint;

			}

			// �p�����[�^�ݒ�
			if ( this.isObject(pArgument) ) {
				// �ύX�������l
				for( var wKey in pArgument ) {
					// �֌W���
					if ( wKey in this._FreeLinePoint ) {
						// �l�㏑��
						this._FreeLinePoint[wKey] = pArgument[wKey];
					}
				}

			// �����h���b�O�ہi�����ړ��@���@�h���b�O�j
			this._FreeLineDrag = ( this.getItemMoveInitIs() && this.getItemDragIs() );

			}
		} catch(e) {
			throw { name: 'clsItemFreeLine.initItemStatus.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD�֘A
	// -------------------

	// �f�[�^�ۑ��p�@���ڐݒ�l�擾
	clsItemFreeLine.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// �p�������ڐݒ�l�擾����
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// ���C�����
			wSaveData.status	= JSON.stringify( this._FreeLineStatus );

			// �ڑ����
			wSaveData.point		= JSON.stringify( this._FreeLinePoint );

			// �ݒ�l���擾
			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemFreeLine.saveData', message: e.message };
		}
	};

	// �f�[�^�Ǎ�
	clsItemFreeLine.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// �p�����f�[�^�Ǎ�����
			if ( this._ItemPrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// ���C�����
			if ( pLoadData.status ) {
				wLoadBuff.status = JSON.parse( pLoadData.status );
			}

			// �ڑ����
			if ( pLoadData.point ) {
				wLoadBuff.point = JSON.parse( pLoadData.point );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemFreeLine.loadData', message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsItemFreeLine.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_FREELINE_STYLE );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁurelation�v
				wInitArgument.kind = this._DEF_FREELINE_KIND;

			}

			// ���j���[�ݒ�
			wInitArgument.menuList		= this._DEF_FREELINE_MENU_CONTEXT;
			wInitArgument.menuReplace	= true;

			// �p�����R���X�g���N�^
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}
			
			// ������Ȃ�
			this.setBoxClass('no-print');

		} catch(e) {
			throw { name: 'clsItemFreeLine.initClass', message: e.message };
		}
	};

	// �f�X�g���N�^
	clsItemFreeLine.prototype.freeClass = function() {
		try {
			// �C�x���g�폜
			this.execFunction( this.delPointMoveEvent );

			// �v���p�e�B�J��
			this._FreeLineStatus			= null;
			this._FreeLinePoint				= null;
			this._FreeLinePointMove			= null;

			this._FreeLineMenuLineStyle		= null;
			this._FreeLineMenuLineWidth		= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
