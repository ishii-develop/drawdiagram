// --------------------------------------------------------------------
//
// �R�����g���ڃN���X
//
// --------------------------------------------------------------------
// clsItemComment �� clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsItemComment = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_COMMENT_KIND			= 'item-comment';

		this._DEF_ITEM_COMMENT_PROPERTY		= {
			 'z-index'				: '90'
		};

		// ----------------------------------
		// ���j���[�ݒ�
		// ----------------------------------
		this._DEF_ITEM_COMMENT_MENU			= {
			  1: [
				  { kind: 'status'		, title: '�R�����g�ݒ�'	}
				, { kind: 'color'		, title: '�w�i�F'		}
			  ]
			, 2: [
				  { kind: 'font-size'	, title: '�����]�傫��'	}
				, { kind: 'font-weight'	, title: '�����]����'	}
				, { kind: 'font-color'	, title: '�����]�F'		}
			  ]
			, 3: [
				  { kind: 'resize'		, title: '�T�C�Y�ύX'	}
			  ]
			, 4: [
				 { kind: 'delete'		, title: '�폜'			}
			  ]
		};

		this._DEF_ITEM_COMMENT_MENU_SIZE	= {
			  1: [
				  { kind: '10px'		, title: '������'		}
				 ,{ kind: '12px'		, title: '�W��'			}
				 ,{ kind: '14px'		, title: '�傫��'		}
				 ,{ kind: '16px'		, title: '�ő�'			}
			  ]
		};

		this._DEF_ITEM_COMMENT_MENU_WEIGHT	= {
			  1: [
				  { kind: '400'		, title: '�W��'			}
				 ,{ kind: '700'		, title: '����'			}
			  ]
		};

		this._DEF_ITEM_COMMENT_MENU_POSITION = {
			 1: [
				{ kind: 'resize'	, title: '�T�C�Y�ύX'	}
			 ]
		};

		// ----------------------------------
		// �X�e�[�^�X���
		// ----------------------------------
		this._DEF_ITEM_COMMENT_STATUS_ITEM_COMMENT = {
				  name		: 'comment'
				, title		: '�R�����g'
				, type		: 'textarea'
				, cols		: 40
				, rows		: 10
				, display	: false
				, default	: ''
				, design	: {
					 head	: { width: '0px', display: 'none' }
					,data	: { width: '295px', height: '145px' }
				}
		};

		this._DEF_ITEM_COMMENT_STATUS		= {
			  1: [ this._DEF_ITEM_COMMENT_STATUS_ITEM_COMMENT ]
		};

		// �p�����N���X��prototype
		this._ItemPrototype					= null;
		
		this._CommentMenuFontSize			= null;
		this._CommentMenuFontWeight			= null;

		this._CommentStatus					= { color: '', size: '', weight: '' };


		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �����@�J���[�p���b�g�I�����C�x���g
		this.eventFontColorSelect = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// �F�I����
				var wColor = pParam.color;

				// �����F�ύX
				self.setCommentFontColor( wColor, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �����@�T�C�Y�I�����C�x���g
		this.eventSizeSelect = function( pEvent, pSelectMenu ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// �����T�C�Y�ύX
				self.setCommentFontSize( wKind, true );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �����@�����I�����C�x���g
		this.eventWeightSelect = function( pEvent, pSelectMenu ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// ���������ύX
				self.setCommentFontWeight( wKind, true );

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
		throw { name: 'clsItemComment.' + e.name, message: e.message };
	}
};

// �O���[�v prototype
(function(){
	// clsItemBox�̃v���g�^�C�v���p��
	clsInheritance( clsItemComment, clsItemBox );


	// **************************************************************
	// ���L���j���[����
	// **************************************************************

	// �J���[���j���[�\��
	clsItemComment.prototype.dspFontColorMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �J���[���j���[�\��
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				var wPoint = this.getEventPos( pEvent );
				wColorMenu.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventFontColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspFontColorMenu.' + e.name, message: e.message };
		}
	};

	// �T�C�Y���j���[�\��
	clsItemComment.prototype.dspFontSizeMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �����T�C�Y���j���[�\��
			if ( this._CommentMenuFontSize ) {
				var wPoint = this.getEventPos( pEvent );
				this._CommentMenuFontSize.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventSizeSelect } );
			}

		} catch(e) {
			throw { name: 'dspFontSizeMenu.' + e.name, message: e.message };
		}
	};

	// �������j���[�\��
	clsItemComment.prototype.dspFontWeightMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �����������j���[�\��
			if ( this._CommentMenuFontWeight ) {
				var wPoint = this.getEventPos( pEvent );
				this._CommentMenuFontWeight.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventWeightSelect } );
			}

		} catch(e) {
			throw { name: 'dspFontWeightMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �R�����g
	// **************************************************************

	// �R�����g�\���v�f����
	clsItemComment.prototype.createComment = function() {
		try {
			var wId  = this.getBoxId() + '_comment';

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssClsItem-CmtBase' );

			this.appendBoxToParent( wDivEle );
			
			return wDivEle;

		} catch(e) {
			throw { name: 'createComment' + e.name, message: e.message };
		}
	};

	// �R�����g�����F�ݒ�
	clsItemComment.prototype.setCommentFontColor = function( pColor, pUpdate ) {
		try {
			if ( !pColor ) return;

			// �X�V���͕ύX������ꍇ�̂ݏ���
			if ( pUpdate ) {
				if ( this._CommentStatus.color == pColor ) return;
			}

			// �t�H���g�F�ύX
			this.setBoxStyle( { 'color' : pColor } );
				
			// �t�H���g�F�ۑ�
			this._CommentStatus.color = pColor;

			// �ݒ�ύX��ʒm
			if ( pUpdate ) {
				this.execItemCallback( null, { kind: 'status' } );
			}

		} catch(e) {
			throw { name: 'setCommentFontColor' + e.name, message: e.message };
		}
	};

	// �R�����g�����T�C�Y�ݒ�
	clsItemComment.prototype.setCommentFontSize = function( pSize, pUpdate ) {
		try {
			if ( !pSize ) return;

			// �X�V���͕ύX������ꍇ�̂ݏ���
			if ( pUpdate ) {
				if ( this._CommentStatus.size == pSize ) return;
			}

			var wId  = this.getBoxId() + '_comment';
			var wCmtEle = this.getElement( wId );
			if ( wCmtEle ) {
				this.setStyle( wCmtEle, { 'font-size': pSize } );

				// �t�H���g�T�C�Y�ۑ�
				this._CommentStatus.size = pSize;

				// �ݒ�ύX��ʒm
				if ( pUpdate ) {
					this.execItemCallback( null, { kind: 'status' } );
				}
			}

		} catch(e) {
			throw { name: 'setCommentFontSize' + e.name, message: e.message };
		}
	};

	// �R�����g���������ݒ�
	clsItemComment.prototype.setCommentFontWeight = function( pWeight, pUpdate ) {
		try {
			if ( !pWeight ) return;

			// �X�V���͕ύX������ꍇ�̂ݏ���
			if ( pUpdate ) {
				if ( this._CommentStatus.weight == pWeight ) return;
			}

			var wId  = this.getBoxId() + '_comment';
			var wCmtEle = this.getElement( wId );
			if ( wCmtEle ) {
				this.setStyle( wCmtEle, { 'font-weight': pWeight } );

				// �t�H���g�T�C�Y�ۑ�
				this._CommentStatus.weight = pWeight;

				// �ݒ�ύX��ʒm
				if ( pUpdate ) {
					this.execItemCallback( null, { kind: 'status' } );
				}
			}

		} catch(e) {
			throw { name: 'setCommentFontWeight' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// �C�x���g�L�����Z��
	clsItemComment.prototype.eventClear = function() {
		try {
			// �J���[���j���[����
			var wColorMenu = this.loadPublicMenu('color');
			if ( wColorMenu ) {
				wColorMenu.hideMenu();
			}

			// �����T�C�Y���j���[����
			if ( this._CommentMenuFontSize ) {
				this._CommentMenuFontSize.hideMenu();
			}

			// �����������j���[�\��
			if ( this._CommentMenuFontWeight ) {
				this._CommentMenuFontWeight.hideMenu();
			}


			// �p�����C�x���g�L�����Z������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.eventClear.call( this );

			}

		} catch(e) {
			throw { name: 'clsItemPerson.eventClear.' + e.name, message: e.message };
		}
	};


	// -------------------
	// ���j���[�֘A
	// -------------------

	// ���j���[�����ݒ�
	clsItemComment.prototype.initItemMenu = function( pArgument ) {
		try {
			// �p�������j���[����������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// ���ڃ��b�N�������s�v
			if ( this.getItemLockIs() ) return;

			// �����T�C�Y���X�g���j���[
			var wMenuList = {};
			this.copyProperty( this._DEF_ITEM_COMMENT_MENU_SIZE, wMenuList );

			var wSizeMenu = this.loadPublicMenu('listSize');
			if ( !wSizeMenu ) {
				wSizeMenu = new clsMenuList( { menuList: wMenuList } );
			}
			wSizeMenu.setMenuList( { menuList: wMenuList } );

			// �����T�C�Y���X�g���j���[�Ƃ��ĕۑ�
			this._CommentMenuFontSize = wSizeMenu;


			// �����������X�g���j���[
			var wWeightList = {};
			this.copyProperty( this._DEF_ITEM_COMMENT_MENU_WEIGHT, wWeightList );

			var wWeightMenu = this.loadPublicMenu('listWeight');
			if ( !wWeightMenu ) {
				wWeightMenu = new clsMenuList( { menuList: wWeightList } );
			}
			wWeightMenu.setMenuList( { menuList: wWeightList } );

			// �����T�C�Y���X�g���j���[�Ƃ��ĕۑ�
			this._CommentMenuFontWeight = wWeightMenu;

		} catch(e) {
			throw { name: 'clsItemComment.initItemMenu.' + e.name, message: e.message };
		}
	};

	// �R�����g�p�R���e�L�X�g���j���[�I��������
	clsItemComment.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// �����@�F
			case 'font-color':
				// �����F���j���[��\��
				wRetVal = this.dspFontColorMenu( pEvent );
				break;

			// �����@�T�C�Y
			case 'font-size':
				// �����T�C�Y���j���[��\��
				wRetVal = this.dspFontSizeMenu( pEvent );
				break;

			// �����@����
			case 'font-weight':
				// �����������j���[��\��
				wRetVal = this.dspFontWeightMenu( pEvent );
				break;

			// ���T�C�Y
			case 'resize':
				// �e�֏�ԕύX��ʒm
				// �����T�C�Y�����͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, { kind: 'resize' } );
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
			throw { name: 'clsItemComment.execContextSelect.' + e.name, message: e.message };
		}
	};

	// -------------------
	// ��{���֘A
	// -------------------

	// �X�e�[�^�X�����ݒ�
	clsItemComment.prototype.initItemStatus = function( pArgument ) {
		try {
			// �p�����X�e�[�^�X�X�V������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// Load��
			var wLoadStat = this.loadDataVal( 'comment' );
			if ( wLoadStat ) {
				if ( 'color'  in wLoadStat ) this._CommentStatus.color  = wLoadStat.color;
				if ( 'size'   in wLoadStat ) this._CommentStatus.size   = wLoadStat.size;
				if ( 'weight' in wLoadStat ) this._CommentStatus.weight = wLoadStat.weight;
				
			}

		} catch(e) {
			throw { name: 'clsItemComment.initItemStatus.' + e.name, message: e.message };
		}
	};

	// �X�e�[�^�X�ݒ莞����
	clsItemComment.prototype.execStatusMenu = function( pEvent, pStatVal ) {
		try {
			// �ݒ���e�擾
			var wComment = this.getStatusValues('comment');

			// �R�����g���e��ݒ�
			var wId  = this.getBoxId() + '_comment';
			var wCmtEle = this.getElement( wId );
			if ( !wCmtEle ) wCmtEle = this.createComment();

			if ( wCmtEle ) {
				wCmtEle.innerHTML = this.toHtml( wComment );
			}

			// �p�����X�e�[�^�X�X�V������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execStatusMenu.call( this, pEvent, pStatVal );

			}

		} catch(e) {
			throw { name: 'clsItemComment.execStatusMenu.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD�֘A
	// -------------------

	// �f�[�^�ۑ��p�@���ڐݒ�l�擾
	clsItemComment.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// �p�������ڐݒ�l�擾����
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// �R�����g�p����ǉ�
			wSaveData.comment = JSON.stringify( this._CommentStatus );

			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemComment.saveData.' + e.name, message: e.message };
		}
	};

	// �f�[�^�Ǎ�
	clsItemComment.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;
			// �p�����f�[�^�Ǎ�����
			if ( this._BasePrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// �R�����g�ŗL�ݒ�
			if ( pLoadData.comment ) {
				wLoadBuff.comment = JSON.parse( pLoadData.comment );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemComment.loadData', message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsItemComment.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_COMMENT_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁuitem-comment�v
				wInitArgument.kind = this._DEF_ITEM_COMMENT_KIND;

			}

			// �ǉ����j���[�ݒ�
			wInitArgument.menuList		= this._DEF_ITEM_COMMENT_MENU;
			wInitArgument.menuReplace	= true;

			// �ǉ��ʒu�������j���[�ݒ�
			wInitArgument.positionList	= this._DEF_ITEM_COMMENT_MENU_POSITION;

			// �ǉ��X�e�[�^�X�ݒ�
			wInitArgument.statusList	= this._DEF_ITEM_COMMENT_STATUS;
			wInitArgument.statusReplace	= true;

			// �p�����R���X�g���N�^
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

			// �R�����g�\���v�f����
			this.createComment();

			// �t�H���g�J���[�X�V
			this.setCommentFontColor( this._CommentStatus.color );

			// �t�H���g�T�C�Y�X�V
			this.setCommentFontSize( this._CommentStatus.size );

			// �t�H���g�����X�V
			this.setCommentFontWeight( this._CommentStatus.weight );

		} catch(e) {
			throw { name: 'clsItemComment.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsItemComment.prototype.freeClass = function() {
		try {
			// �v���p�e�B�J��
			this._CommentMenuFontSize		= null;
			this._CommentMenuFontWeight		= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
