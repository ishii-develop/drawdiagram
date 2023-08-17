
// --------------------------------------------------------------------
//
// ����BOX�N���X
//
// --------------------------------------------------------------------
// clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsItemBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_KIND				= 'item';

		this._DEF_ITEM_PROPERTY			= {
			 'z-index'				: '300'
		};

		// ----------------------------------
		// ��{���j���[�ݒ�
		// ----------------------------------
		this._DEF_ITEM_MENU_CONTEXT		= {
			  1: [
				  { kind: 'status'		, title: '���ݒ�'		}
				 ,{ kind: 'contact'		, title: '�A����'		}
			  ]
			, 2: [
				  { kind: 'relation'	, title: '�֘A�t��'		}
				, { kind: 'relationChg'	, title: '�֘A�ύX'		}
				, { kind: 'unrelation'	, title: '�֘A����'		}
			 ]
			, 3: [
				  { kind: 'color'		, title: '�F�ύX'		}
			  ]
			, 4: [
				 { kind: 'delete'		, title: '�폜'			}
			  ]
		};

		// ���ړ���L�����������ꍇ�́u_DEF_ITEM_MENU_ADD_USE�v���utrue�v
		this._DEF_ITEM_MENU_ADD_USE		= false;
		this._DEF_ITEM_MENU_CONTEXT_ADD	= {
			 3: [
				{ kind: 'move'		, title: '�ړ�'			}
			 ]
		};

		this._DEF_ITEM_MENU_POSITION		= {
			  1: [
				  { kind: 'pos-vert'	, title: '�c�ʒu�����킹��'		}
				 ,{ kind: 'pos-side'	, title: '���ʒu�����킹��'		}
			  ]
		};

		// ----------------------------------
		// ��{���ݒ�
		// ----------------------------------
		this._DEF_ITEM_STATUS_NAME = {
				  name		: 'name'
				, title		: '���O'
				, type		: 'text'
				, length	: 90
				, display	: true
				, default	: ''
				, design	: {
					 data	: { width: '230px' }
					,input	: { width: '220px' }
				}
		};

		this._DEF_ITEM_STATUS_NAME_FLG = {
				  name		: 'name-flg'
				, title		: '���O�\���L��'
				, type		: 'check'
				, length	: 1
				, display	: false
				, default	: 1
				, list		: {
					1		: '�\������'
				}
				, design	: {
					 head	: { width: '0px', display: 'none' }
				}
		};

		this._DEF_ITEM_STATUS_KANA = {
				  name		: 'kana'
				, title		: '�J�i��'
				, type		: 'text'
				, length	: 90
				, display	: false
				, default	: ''
				, design	: {
					input	: { width: '300px' }
				}
		};

		this._DEF_ITEM_STATUS_TITLE = {
				  name		: 'title'
				, title		: '�\����'
				, type		: 'text-combo'
				, length	: 8
				, display	: false
				, default	: ''
				, design	: {
					 data	: { width: '230px' }
					,input	: { width: '112px' }
				}
		};

		this._DEF_ITEM_STATUS_TITLE_FLG = {
				  name		: 'title-flg'
				, title		: '�\���L��'
				, type		: 'check'
				, length	: 1
				, display	: false
				, default	: 1
				, list		: {
					1		: '�\������'
				}
				, design	: {
					 head	: { width: '0px', display: 'none' }
				}
		};

		this._DEF_ITEM_STATUS_BASE		= {
			  1: [ this._DEF_ITEM_STATUS_NAME	, this._DEF_ITEM_STATUS_NAME_FLG  ]
			, 2: [ this._DEF_ITEM_STATUS_KANA ]
			, 3: [ this._DEF_ITEM_STATUS_TITLE	, this._DEF_ITEM_STATUS_TITLE_FLG ]
		};

		
		// ----------------------------------
		// �A����ݒ�
		// ----------------------------------
		this._DEF_ITEM_CONTACT_TEL_NAME = {
				  name		: 'contact-tel'
				, title		: '�A����1'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: '�d�b�ԍ�'
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_CONTACT_TEL_NO = {
				  name		: 'contact-tel-no'
				, title		: '�ԍ�'
				, type		: 'text'
				, length	: 13
				, display	: true
				, default	: ''
				, design	: {
					 head	: { width: '0px', display: 'none' }
					,data	: { width: '110px' }
					,input	: { width: '96px' }
				}
		};

		this._DEF_ITEM_CONTACT_ADD_NAME = {
				  name		: 'contact-add'
				, title		: '�A����'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: ''
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_CONTACT_ADD_NO = {
				  name		: 'contact-add-no'
				, title		: '�ԍ�'
				, type		: 'text'
				, length	: 13
				, display	: true
				, default	: ''
				, design	: {
					 head	: { width: '0px', display: 'none' }
					,data	: { width: '110px' }
					,input	: { width: '96px' }
				}
		};

		this._DEF_ITEM_CONTACT_BASE	= {
			  1: [ this._DEF_ITEM_CONTACT_TEL_NAME	, this._DEF_ITEM_CONTACT_TEL_NO  ]
		};

		this._DEF_ITEM_CONTACT_ADD		= {
			  1: [ this._DEF_ITEM_CONTACT_ADD_NAME	, this._DEF_ITEM_CONTACT_ADD_NO  ]
		};

		// �p�����N���X��prototype
		this._BasePrototype				= null;

		this._ItemCallback				= null;

		this._ItemMenuContext			= null;
		this._ItemMenuPosition			= null;
		this._ItemMenuColor				= null;
		this._ItemMenuStatus			= null;
		this._ItemMenuContact			= null;
		this._ItemFireEventParam		= {};

		this._ItemControlLocked			= false;
		this._ItemContextAvailable		= false;
		this._ItemPositionAvailable		= false;
		this._ItemSelect				= { main: false, relation: false };

		// ���ڍ폜��
		this._ItemCanDelete				= true;

		// ���ڃh���b�O�ړ���
		this._ItemMoveDrag				= false;
		this._ItemMoveInit				= false;

		// { 
		//   id				: �֘A���ځ@ID
		// , kind			: �֘A���ځ@���
		// , key			: �֘A���ځ@���p�_��ID
		// , parent			: �֌W�́u��v���ǂ���
		// , relationInf	: �֘A�t�����iclsItemRelation�ւ̎Q�Ɓj
		// }
		this._ItemRelation				= {};
		this._ItemRelationSetId			= '';

		this._ItemStatus				= { contents: null, values: null };
		this._ItemStatusDef				= { contents: null, values: null };
		this._ItemContact				= { contents: null, values: null };
		this._ItemContactDef			= { contents: null, values: null };


		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �R���e�L�X�g���j���[�@�C�x���g
		this.eventMenuDsp = function( pEvent, pParam ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ���ڑ���L�����Z����ʒm
				self.execItemCtrlCancel();

				// ���j���[�L�����̂ݏ���
				if ( !self.chkItemMenuAvailable() ) return true;

				if ( self._ItemContextAvailable ) {
					// �R���e�L�X�g���j���[�\��
					self.execContextDsp( pEvent, pParam );

				}
				else if ( self._ItemPositionAvailable ) {
					// �ʒu�������j���[�\��
					self.execPositionDsp( pEvent, pParam );

				}
				
			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// �R���e�L�X�g���j���[�@�I�����C�x���g����
		this.eventMenuSelect = function( pEvent, pSelectMenu ) {
			try {
				// ���j���[�I�����������s
				var wRetVal = self.execContextSelect( pEvent, pSelectMenu );

				return wRetVal;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �J���[�p���b�g�I�����C�x���g
		this.eventColorSelect = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// �F�I����
				var wColor = pParam.color;

				// �w�i�F�ύX
				self.setBoxStyle( { 'background-color' : wColor } );

				// �e�֕ύX��ʒm
				// �@�p�����[�^�F�I��F
				return self.execItemCallback( pEvent, { kind: 'color', color: wColor } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �֘A���ݒ胁�j���[����
		this.eventRelationSet = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind == 'close' ) return false;

				// �֘AID��ʒm
				pParam.relationId = self._ItemRelationSetId;

				// �֘A�t���ΏۑI���J�n
				// ���e�I�u�W�F�N�g�֕ύX��ʒm
				return self.execItemCallback( pEvent, pParam );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �X�e�[�^�X�X�V���C�x���g
		this.eventStatusUpdate = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pParam.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				if ( !pParam.statusValue ) return false;

				// �ݒ�l�ŏ��X�V
				self.copyProperty( pParam.statusValue, self._ItemStatus.values );

				// �X�e�[�^�X�X�V������
				self.execStatusMenu( pEvent, pParam );

				// ���ڕύX�ʒm�s�v��
				if ( pParam.notCallback ) {
					return true;
				
				} else {
					// �e�֕ύX��ʒm
					return self.execItemCallback( pEvent, { kind: 'status' } );
				
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �A����X�V���C�x���g
		this.eventContactUpdate = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pParam.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				if ( !pParam.statusValue ) return false;

				// �ݒ�l�ŏ��X�V
				self.copyProperty( pParam.statusValue, self._ItemContact.values );

				if ( pParam.statusList ) {
					for( var wKey in pParam.statusList ) {
						self._ItemContact.contents[wKey] = pParam.statusList[wKey];
					}
				}

				// ���ڕύX�ʒm�s�v��
				if ( pParam.notCallback ) {
					return true;
				
				} else {
					// �e�֕ύX��ʒm
					return self.execItemCallback( pEvent, { kind: 'contact' } );
				
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
		clsBaseBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsItemBox.' + e.name, message: e.message };
	}
};


// ���� prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsItemBox, clsBaseBox );

	// **************************************************************
	// ���擾
	// **************************************************************

	// ���ڂ��l�����ǂ���
	clsItemBox.prototype.isPerson = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-person' );

		} catch(e) {
			throw { name: 'isPerson.' + e.name, message: e.message };
		}
	};

	// ���ڂ��O���[�v���ǂ���
	clsItemBox.prototype.isGroup = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-group' );

		} catch(e) {
			throw { name: 'isPerson.' + e.name, message: e.message };
		}
	};

	// ���ڂ��R�����g���ǂ���
	clsItemBox.prototype.isComment = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-comment' );

		} catch(e) {
			throw { name: 'isComment.' + e.name, message: e.message };
		}
	};

	// ���ڂ����p�_���ǂ���
	clsItemBox.prototype.isRelation = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-relation' );

		} catch(e) {
			throw { name: 'isRelation.' + e.name, message: e.message };
		}
	};

	// ���ڂ����p�_���ǂ���
	clsItemBox.prototype.isFreeLine = function() {
		try {
			var wItemKind = this.getBoxKind();

			return ( wItemKind == 'item-freeline' );

		} catch(e) {
			throw { name: 'isFreeLine.' + e.name, message: e.message };
		}
	};

	// ���ڂ̐F�擾
	clsItemBox.prototype.getItemColor = function() {
		try {
			// �w�i�F�擾
			var wStyle = this.getBoxStyle( 'background-color' );

			return wStyle;

		} catch(e) {
			throw { name: 'getItemColor.' + e.name, message: e.message };
		}
	};

	// ���ڂ�class�`�F�b�N
	clsItemBox.prototype.chkItemClass = function( pClass ) {
		try {
			// �N���X�ݒ�ς��`�F�b�N
			var wExists = this.chkBoxClass( pClass );

			return wExists;

		} catch(e) {
			throw { name: 'chkItemClass.' + e.name, message: e.message };
		}
	};

	// ���ڑ���ێ擾
	clsItemBox.prototype.getItemLockIs = function() {
		try {
			// ���ڑ���ێ擾
			return this._ItemControlLocked;

		} catch(e) {
			throw { name: 'getItemLockIs', message: e.message };
		}
	};

	// ���ڂ̍폜�ێ擾
	clsItemBox.prototype.getItemDelIs = function() {
		try {
			// �폜�ێ擾
			return this._ItemCanDelete;

		} catch(e) {
			throw { name: 'getItemDelIs', message: e.message };
		}
	};

	// ���ڂ̃h���b�O�ړ��ێ擾
	clsItemBox.prototype.getItemDragIs = function() {
		try {
			// �h���b�O�ړ��ێ擾
			return this._ItemMoveDrag;

		} catch(e) {
			throw { name: 'getItemDragIs', message: e.message };
		}
	};

	// ���ڂ̃h���b�O�ړ��ۏ����l�擾
	clsItemBox.prototype.getItemMoveInitIs = function() {
		try {
			// �h���b�O�ړ��ۏ����l�擾
			return this._ItemMoveInit;

		} catch(e) {
			throw { name: 'getItemMoveInitIs', message: e.message };
		}
	};

	// �X�e�[�^�X�ݒ�l���擾
	clsItemBox.prototype.getStatusValues = function( pKey ) {
		try {
			// Key�ݒ莞�͓���l�̂�
			if ( pKey ) {
				return this._ItemStatus.values[pKey];

			// Key���ݒ莞�͑S��
			} else {
				var wStatusValues = {};
				
				this.copyProperty( this._ItemStatus.values, wStatusValues );

				return wStatusValues;
			}

		} catch(e) {
			throw { name: 'getStatusValues', message: e.message };
		}
	};

	// �X�e�[�^�X���e���擾
	clsItemBox.prototype.getStatusContents = function( pName ) {
		try {
			var wRetContents = null;

			var wStatLine;
			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];

				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					if ( !wStatLine[wCol].name ) continue;
					
					if ( String(pName) == String(wStatLine[wCol].name) ) {
						wRetContents = wStatLine[wCol];
						break;
					
					}
				}
			}
			return wRetContents;

		} catch(e) {
			throw { name: 'getStatusContents', message: e.message };
		}
	};

	// �A����ݒ�l���擾
	clsItemBox.prototype.getContactValues = function( pKey ) {
		try {
			if ( !this._ItemContact.contents ) return null;

			// Key�ݒ莞�͓���l�̂�
			if ( pKey ) {
				return this._ItemContact.values[pKey];

			// Key���ݒ莞�͑S��
			} else {
				var wContactValues = {};
				
				var wName;
				var wValNm;
				var wValNo;
				for( var wLine in this._ItemContact.contents ) {
					wValNm = '';
					wName = this._ItemContact.contents[wLine][0].name;
					if ( wName ) {
						wValNm = this._ItemContact.values[wName];
						if ( typeof wValNm == 'undefined' ) wValNm = '';
					}

					wName = this._ItemContact.contents[wLine][1].name;
					if ( wName ) {
						wValNo = this._ItemContact.values[wName];
						if ( typeof wValNo == 'undefined' ) wValNo = '';
					}

					wContactValues[wLine] = { name: wValNm, no: wValNo };

				}
				return wContactValues;
			}

		} catch(e) {
			throw { name: 'getContactValues', message: e.message };
		}
	};


	// **************************************************************
	// ���ڕ\��
	// **************************************************************

	// ���ڂ�\������
	clsItemBox.prototype.dspItem = function( pDisplay, pPoint, pFront ) {
		try {
			if ( pPoint ) {
				var wPosition = { top: 0, left: 0 };
				if ( pPoint.x ) {
					wPosition.left = pPoint.x;
				}

				if ( pPoint.y ) {
					wPosition.top = pPoint.y;
				}
				wPosition.top  = wPosition.top  + 'px';
				wPosition.left = wPosition.left + 'px';

				this.setBoxStyle( wPosition );
			}
			this.dspBox( pDisplay, pFront );

		} catch(e) {
			throw { name: 'dspItem.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �֌W����
	// **************************************************************

	// �֌W���ڎ擾
	clsItemBox.prototype.getRelationList = function( pKey ) {
		try {
			if ( !this._ItemRelation ) return null;

			// Key�`�F�b�N�L���ݒ�
			var wKeyChk;
			if ( !pKey ) {
				wKeyChk = false;
			} else {
				wKeyChk = true;
			}

			var wRetList = {};

			var wParam;
			for( var key in this._ItemRelation ) {
				wParam = this._ItemRelation[key];
				if ( !wParam ) continue;

				// KEY�`�F�b�N
				if ( wKeyChk ) {
					if ( typeof wParam[pKey] == 'undefined' ) continue;
					if ( wParam[pKey] != true ) continue;
				}

				wRetList[key] = wParam;

			}

			return wRetList;

		} catch(e) {
			throw { name: 'getRelationList.' + e.name, message: e.message };
		}
	};

	// �֌W���ڒǉ�
	// pParam = { 
	//   id				: �֘A���ځ@ID
	// , kind			: �֘A���ځ@���
	// , key			: �֘A���ځ@���p�_��ID
	// , parent			: �֌W�́u��v���ǂ���
	// , relationInf	: �֘A�t�����iclsItemRelation�ւ̎Q�Ɓj
	// }
	clsItemBox.prototype.addRelationItem = function( pId, pParam ) {
		try {
			// �֘A���ǉ�
			this._ItemRelation[pId] = pParam;
			this._ItemRelation[pId].id = pId;

		} catch(e) {
			throw { name: 'addRelationItem.' + e.name, message: e.message };
		}
	};

	// �֌W���ڍ폜
	clsItemBox.prototype.delRelationItem = function( pId ) {
		try {
			// �֘A���폜
			if ( pId in this._ItemRelation ) {
				// ���폜
				delete this._ItemRelation[pId];

			}

		} catch(e) {
			throw { name: 'delRelationItem.' + e.name, message: e.message };
		}
	};

	// �֌W���ڑS�č폜
	clsItemBox.prototype.delRelationAll = function( ) {
		try {
			if ( !this._ItemRelation ) return;

			// �֘A���폜
			for ( var wId in this._ItemRelation ) {
				// ���폜
				delete this._ItemRelation[wId];

			}

		} catch(e) {
			throw { name: 'delRelationAll.' + e.name, message: e.message };
		}
	};

	// �֌W���ڃ`�F�b�N
	clsItemBox.prototype.chkRelationItem = function( pId ) {
		try {
			if ( !this._ItemRelation ) return false;

			var wCheck = false;

			// �Ώ�ID�w�莞
			if ( pId ) {
				// KEY���݃`�F�b�N
				if ( pId in this._ItemRelation ) {
					wCheck = true;
				
				}
			
			// ���w�莞
			} else {
				for( var wKey in this._ItemRelation ) {
					if ( !this._ItemRelation[wKey] ) continue;

					wCheck = true;
					break;
				}

			}
			return wCheck;

		} catch(e) {
			throw { name: 'chkRelationItem', message: e.message };
		}
	};

	// �֌W���ڎ擾
	clsItemBox.prototype.getRelationItem = function( pId ) {
		try {
			if ( !this._ItemRelation ) return null;

			var wResultItem = null;

			// KEY���݃`�F�b�N
			if ( pId in this._ItemRelation ) {
				wResultItem = this._ItemRelation[pId];
			
			}
			return wResultItem;

		} catch(e) {
			throw { name: 'getRelationItem', message: e.message };
		}
	};

	// �֌W���ڂƂ̒��p�_�`�F�b�N
	clsItemBox.prototype.chkRelationItemRelay = function( pId ) {
		try {
			if ( !this._ItemRelation ) return false;

			var wCheck = false;
			var wRelId;

			for( var wKey in this._ItemRelation ) {
				if ( !this._ItemRelation[wKey] ) continue;
				if ( !this._ItemRelation[wKey].relationInf ) continue;

				wRelId = this._ItemRelation[wKey].relationInf.getBoxId();
				if ( wRelId == pId ) {
					wCheck = true;
					break;
				
				}
			}

			return wCheck;

		} catch(e) {
			throw { name: 'chkRelationItemRelay', message: e.message };
		}
	};


	// **************************************************************
	// ���ڑI��
	// **************************************************************

	// ���ڑI����Ԑݒ�
	clsItemBox.prototype.selectItem = function( pSelected ) {
		try {
			// ��ԕύX�Ȃ���Ώ����Ȃ�
			if ( (this._ItemSelect.main == pSelected) && (!this._ItemSelect.relation) ) return false;

			if ( pSelected ) {
				// �N���X�폜�i�֌W���ځj
				this.delBoxClass( 'cssItem-sel-rel' );

				// �N���X�ǉ��i�區�ځj
				this.setBoxClass( 'cssItem-sel' );

			} else {
				// �N���X�폜�i�區�ځj
				this.delBoxClass( 'cssItem-sel' );

			}

			// �I����ԕۑ�
			this._ItemSelect.main		= pSelected;
			this._ItemSelect.relation	= false;

			return true;

		} catch(e) {
			throw { name: 'selectItem.' + e.name, message: e.message };
		}
	};

	// ���ڑI����ԉ���
	clsItemBox.prototype.selectItemFree = function() {
		try {
			// ��ԕύX�Ȃ���Ώ����Ȃ�
			if ( !this._ItemSelect.main && !this._ItemSelect.relation ) return false;

			// �N���X�폜�i�֌W���ځj
			this.delBoxClass( 'cssItem-sel-rel' );

			// �N���X�폜�i�區�ځj
			this.delBoxClass( 'cssItem-sel' );

			// �I����ԉ���
			this._ItemSelect.main		= false;
			this._ItemSelect.relation	= false;
			
			return true;

		} catch(e) {
			throw { name: 'selectItemFree.' + e.name, message: e.message };
		}
	};

	// ���ڑI����Ԑݒ�`�F�b�N
	clsItemBox.prototype.selectItemIs = function( ) {
		try {
			// �I����ԕԂ�
			return this._ItemSelect.main;

		} catch(e) {
			throw { name: 'selectItemIs.' + e.name, message: e.message };
		}
	};

	// ���ڑI����Ԑݒ�i�֘A���ځj
	clsItemBox.prototype.selectItemRel = function( pSelected ) {
		try {
			// ��ԕύX�Ȃ���Ώ����Ȃ�
			if ( (this._ItemSelect.relation == pSelected) && (!this._ItemSelect.main) ) return false;

			if ( pSelected ) {
				// �N���X�폜�i�區�ځj
				this.delBoxClass( 'cssItem-sel' );

				// �N���X�ǉ��i�֌W���ځj
				this.setBoxClass( 'cssItem-sel-rel' );

			} else {
				// �N���X�폜�i�֌W���ځj
				this.delBoxClass( 'cssItem-sel-rel' );

			}

			// �I����ԕۑ�
			this._ItemSelect.main		= false;
			this._ItemSelect.relation	= pSelected;

			return true;

		} catch(e) {
			throw { name: 'selectItemRel.' + e.name, message: e.message };
		}
	};

	// ���ڑI����Ԑݒ�i�֘A���ځj�`�F�b�N
	clsItemBox.prototype.selectItemRelIs = function( ) {
		try {
			// �I����ԕԂ�
			return this._ItemSelect.relation;

		} catch(e) {
			throw { name: 'selectItemRelIs.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �C�x���g��������
	// **************************************************************

	// �C�x���g��������
	clsItemBox.prototype.eventFire = function( pEvents, pParam ) {
		try {
			var wEvtEle = this.getBoxElement();
			if ( !wEvtEle ) return false;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);

			// �C�x���g�p�����[�^�ۑ�
			this._ItemFireEventParam[wEvtKind] = pParam;

			// ��������
			var wResult = this.fireEvent( wEvtEle, pEvents );
			
			// �G���[���̓p�����[�^�폜
			if ( !wResult ) this.eventFireDel(pEvents);

			return wResult;

		} catch(e) {
			// ��O�����Ȃ��ŋ������Ώ��폜
			this.execFunction( this.eventFireDel, pEvents );

			throw { name: 'eventFire.' + e.name, message: e.message };
		}
	};

	// �������΂ɂ��C�x���g�p�����[�^�폜
	clsItemBox.prototype.eventFireDel = function( pEvents ) {
		try {
			if ( !this._ItemFireEventParam ) return;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);
			
			if (wEvtKind in this._ItemFireEventParam) {
				delete this._ItemFireEventParam[wEvtKind];
			}

		} catch(e) {
			throw { name: 'eventFireDel', message: e.message };
		}
	};

	// �������΂ɂ��C�x���g�������`�F�b�N
	clsItemBox.prototype.eventFireIs = function( pEvents ) {
		try {
			if ( !this._ItemFireEventParam ) return false;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);

			if (wEvtKind in this._ItemFireEventParam) {
				return true;
			} else {
				return false;
			}

		} catch(e) {
			throw { name: 'eventFireIs', message: e.message };
		}
	};

	// �������΂ɂ��C�x���g�������̃p�����[�^�擾
	// ���擾��̓C�x���g����j��
	clsItemBox.prototype.eventFireParam = function( pEvents ) {
		try {
			if ( !this._ItemFireEventParam ) return false;

			var wEvtKind = pEvents.toLowerCase();
			if ( wEvtKind.substring(0,2) == 'on' ) wEvtKind = wEvtKind.substring(2);
			
			var wRetParam = null;
			if (wEvtKind in this._ItemFireEventParam) {
				wRetParam = this._ItemFireEventParam[wEvtKind];

				// ��O�����Ȃ��ŋ������Ώ��폜
				this.execFunction( this.eventFireDel, wEvtKind );
			}

			return wRetParam;

		} catch(e) {
			throw { name: 'eventFireParam', message: e.message };
		}
	};


	// **************************************************************
	// �X�e�[�^�X����
	// **************************************************************

	// �X�e�[�^�X���X�g�����ݒ�
	clsItemBox.prototype.setStatusContents = function( pDefStat, pArgument ) {
		try {
			var self = this;

			// �X�e�[�^�X�v���p�e�B�@�ʍX�V
			var updateStatProperty = function( pStatList, pStatName, pDataList ) {
				for ( var wLine in pStatList ) {
					if ( !pStatList[wLine] ) continue;
					if ( pStatList[wLine].length == 0 ) continue;

					for ( var wCol = 0; wCol < pStatList[wLine].length; wCol++ ){
						if ( !pStatList[wLine][wCol] ) continue;
						if ( pStatList[wLine][wCol].name != String(pStatName) ) continue;
						
						self.copyProperty( pDataList, pStatList[wLine][wCol] );
						return true;
					}
				}
				return false;
			};
			
			var wStatReplace = false;

			// �ǉ��w��`�F�b�N
			var wArgStat = null;
			var wArgStatProp = null;
			if ( pArgument ) {
				// �X�e�[�^�X�ݒ�
				// ��object�w��̂݋���
				if ( this.isObject(pArgument.statusList) ) {
					wArgStat = pArgument.statusList;
					if ( pArgument.statusReplace ) wStatReplace = true;
				}

				// �X�e�[�^�X�@�I�����ڐݒ�
				if ( this.isObject(pArgument.statusProperty) ) {
					wArgStatProp = pArgument.statusProperty;
				}
			}

			// �f�t�H���g�ݒ�
			var wDefStat = {};

			// ���j���[�u��
			if ( wStatReplace ) {
				// �w����e�Œu��
				this.copyProperty( wArgStat, wDefStat );

			// �u�����Ȃ�
			} else {
				// �����ݒ�
				this.copyProperty( pDefStat, wDefStat );

				// �ǉ��w�肠��
				if ( wArgStat ) {
					// �f�t�H���g�ɏ㏑���^�ǉ�
					this.copyProperty( wArgStat, wDefStat );

				}

			}
			
			// �v���p�e�B�ʍX�V
			if ( wArgStatProp ) {
				for ( var wDatKey in wArgStatProp ) {
					// ���ʂ������̂�ݒ�
					var wDataList = {};
					this.copyProperty( wArgStatProp[wDatKey], wDataList );

					updateStatProperty( wDefStat, wDatKey, wDataList );
				}
			}

			// Key���Ƀ\�[�g
			return this.sortNumObject( wDefStat );

		} catch(e) {
			throw { name: 'setStatusContents.' + e.name, message: e.message };
		}
		return null;
	};

	// �X�e�[�^�X�ݒ�l������
	clsItemBox.prototype.initStatusValues = function( pContents ) {
		try {
			var wKey;
			var wStatLine;

			// �ݒ�l������
			var wValues = {};

			for ( var wLine in pContents ) {
				wStatLine = pContents[wLine];

				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					wKey = wStatLine[wCol].name;
					wValues[wKey] = wStatLine[wCol].default;
				}
			}
			return wValues;

		} catch(e) {
			throw { name: 'initStatusValues', message: e.message };
		}
	};

	// �X�e�[�^�X���e�@�ݒ�l�X�V
	clsItemBox.prototype.updStatusContents = function( pName, pTarget, pValue ) {
		try {
			if ( !this._ItemStatus.contents ) return;

			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];

				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					if ( String(pName) != String(wStatLine[wCol].name) ) continue;
					if ( typeof wStatLine[wCol][pTarget] !== 'undefined' ) wStatLine[wCol][pTarget] = pValue;
				}
			}

		} catch(e) {
			throw { name: 'updStatusContents', message: e.message };
		}
	};

	// �X�e�[�^�X���e�@�\���^��\���ݒ�
	clsItemBox.prototype.setStatusDisplay = function() {
		try {
			if ( !this._ItemStatus.contents ) return;
			if ( !this._ItemStatus.values ) return;

			var wStatLine;
			var wName;
			var wDisplay;
			var wFlag;
			var wValue;
			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];
				
				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					wName = wStatLine[wCol].name;
					if ( !wName ) continue;

					// �\���ؑ֍��ڂȂ��͏����Ȃ�
					wFlag = this._ItemStatus.values[wName + '-flg'];
					if ( typeof wFlag == 'undefined' ) continue;

					wValue = this._ItemStatus.values[wName];
					if ( !wValue ) wValue = '';

					wDisplay = false;
					// flg�L���@���@�l�ݒ莞�̂ݕ\��
					if ( String(wFlag) == '1' ) {
						if ( String(wValue).length > 0 ) wDisplay = true;
					}

					// �X�e�[�^�X���e��display�X�V
					this.updStatusContents( wName, 'display', wDisplay );
				}
			}
			
		} catch(e) {
			throw { name: 'setStatusDisplay.' + e.name, message: e.message };
		}
	};

	// �X�e�[�^�X��ʕ\��
	clsItemBox.prototype.dspStatusMenu = function( pEvent, pCallback ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// ���ڑ���L�����Z����ʒm
			this.execItemCtrlCancel();

			// �X�e�[�^�X�\��
			if ( this._ItemMenuStatus ) {
				var wCallback = pCallback;
				if ( !wCallback ) wCallback = this.eventStatusUpdate;

				var wPoint	= this.getEventPos( pEvent );
				
				var wParam = {
					  x				: wPoint.x
					, y				: wPoint.y
					, callback		: wCallback
					, statusList	: this._ItemStatus.contents
					, statusValue	: this._ItemStatus.values
				};
				this._ItemMenuStatus.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspStatusMenu', message: e.message };
		}
	};

	// �X�e�[�^�X���e�\��
	clsItemBox.prototype.dspStatusContents = function() {
		try {
			if ( !this._ItemStatus.contents ) return;
			if ( !this._ItemStatus.values ) return;

			var wContentsId;
			var wContentsNm = this.getBoxId() + '_contents';
			var wContentsEle;

			// ��U�S�Ĕ�\��
			this.setElementStyle( wContentsNm, 'display', 'none' );

			// �\���ݒ�
			var wValue;
			var wStatLine;
			var wContentsEle;
			for ( var wLine in this._ItemStatus.contents ) {
				wStatLine = this._ItemStatus.contents[wLine];
				
				for ( var wCol = 0; wCol < wStatLine.length; wCol++ ) {
					// �\���ΏۂłȂ���Ώ����Ȃ�
					if ( !wStatLine[wCol].display ) continue;

					wValue = this._ItemStatus.values[wStatLine[wCol].name];
					if ( typeof wValue == 'undefined' ) wValue = '';

					wContentsId = wContentsNm + '_' + wStatLine[wCol].name;
					wContentsEle = this.getElement(wContentsId);

					// ���݂��Ȃ���ΐ���
					if ( !wContentsEle ) {
						var wDivEle = this.addElement( 'div', wContentsId );

						wDivEle.innerHTML	= "<span>" + wValue + "</span>";
						wDivEle.setAttribute( 'name', wContentsNm )
						this.addClass( wDivEle, 'cssItem-contents' );
						this.addClass( wDivEle, 'cssItem-contents-' + wStatLine[wCol].name );

						this.appendBoxToParent( wDivEle );

					// ���ɑ���
					} else if ( String(wValue).length > 0 ) {
						// �\�����e�ݒ肵�ĕ\��
						wContentsEle.innerHTML = "<span>" + wValue.trim() + "</span>";
						this.setStyle( wContentsEle, { display : '' } ); 

					}
				}
			}

		} catch(e) {
			throw { name: 'dspStatusContents', message: e.message };
		}
	};

	// �X�e�[�^�X���e�\��
	clsItemBox.prototype.setStatusTitle = function() {
		try {
			// ���̕\�����擾
			var wTitle = '';

			var wNameItem = this.getStatusContents('name');
			if ( wNameItem ) {
				// ��\�����̂݃^�C�g���Ƃ��Đݒ�
				if ( !wNameItem.display ) {
					var wValue = this._ItemStatus.values[wNameItem.name];
					if ( !wValue ) wValue = '';
					
					wTitle = wValue;
				}

			}
			// title������ݒ�
			this.setBoxAttribute( { title: wTitle } );

		} catch(e) {
			throw { name: 'setStatusTitle.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �A����
	// **************************************************************

	// �A�����ʕ\��
	clsItemBox.prototype.dspContactMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// ���ڑ���L�����Z����ʒm
			this.execItemCtrlCancel();

			// �X�e�[�^�X�\��
			if ( this._ItemMenuContact ) {
				var wPoint	= this.getEventPos( pEvent );
				
				var wParam = {
					  x				: wPoint.x
					, y				: wPoint.y
					, callback		: this.eventContactUpdate
					, statusList	: this._ItemContact.contents
					, statusValue	: this._ItemContact.values
					, statusAddList	: this._DEF_ITEM_CONTACT_ADD
				};
				this._ItemMenuContact.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspContactMenu', message: e.message };
		}
	};

	// �A���捀�ڂ�ݒ�
	clsItemBox.prototype.setContactContents = function( pValues ) {
		try {
			if ( !this._ItemContact.contents ) this._ItemContact.contents = {};

			this.copyProperty( pValues, this._ItemContact.contents );

		} catch(e) {
			throw { name: 'setContactContents', message: e.message };
		}
	};

	// �A����l��ݒ�
	clsItemBox.prototype.setContactValues = function( pValues ) {
		try {
			if ( !this._ItemContact.values ) this._ItemContact.values = {};

			this.copyProperty( pValues, this._ItemContact.values );

		} catch(e) {
			throw { name: 'setContactValues', message: e.message };
		}
	};


	// **************************************************************
	// �R���e�L�X�g���j���[����
	// **************************************************************

	// �����ݒ胁�j���[�擾
	clsItemBox.prototype.getItemMenuDef = function( pDefMenu, pAddMenu ) {
		try {
			var wContextList = {};
			this.copyProperty( pDefMenu, wContextList );

			// �ǉ��Ȃ���΃f�t�H���g��Ԃ�
			if ( !pAddMenu ) return wContextList;

			if ( this.isArray(pAddMenu) ) {
				if ( this.isArray(wContextList[1]) ) {
					wContextList[1] = pAddMenu.concat( wContextList[1] );
				} else {
					wContextList[1] = pAddMenu;
				}

			} else {
				for( var wKey in wContextList ) {
					if ( wContextList.hasOwnProperty(wKey) && pAddMenu.hasOwnProperty(wKey) ) {
						if ( this.isArray(wContextList[wKey]) ) {
							wContextList[wKey] = pAddMenu[wKey].concat( wContextList[wKey] );
						} else {
							wContextList[wKey] = pAddMenu[wKey];
						}
					}
				}

			}
			return wContextList;

		} catch(e) {
			throw { name: 'getItemMenuDef', message: e.message };
		}
	};

	// ���ڒǉ����j���[�ݒ�
	clsItemBox.prototype.setItemMenuAdd = function( pAddMenu, pParamMenu ) {
		try {
			if ( !pAddMenu ) return true;

			// ���j���[�ǉ��i�p�����[�^�̃��j���[�D��j
			var wAddItem;
			var wAddKind;
			var wParamItem;
			var wParamFind;

			for( var wAddKey in pAddMenu ) {
				if ( !pAddMenu.hasOwnProperty(wAddKey) ) continue;
				// �p�����[�^���j���[�ɑ���
				if ( wAddKey in pParamMenu ) {
					// ���j���[�ʒǉ�
					wAddItem = pAddMenu[wAddKey];
					wParamItem = pParamMenu[wAddKey];

					for( var wAddIdx = 0; wAddIdx < wAddItem.length; wAddIdx++ ) {
						// �����j���[�`�F�b�N
						wParamFind = false;
						
						wAddKind = wAddItem[wAddIdx].kind;
						for ( var wIdx = 0; wIdx < wParamItem.length; wIdx++ ) {
							if ( wParamItem[wIdx].kind == wAddKind ) {
								wParamFind = true;
								break;
							}

						}

						// ���o�^�Ȃ�ǉ�
						if ( !wParamFind ) {
							pParamMenu[wAddKey].push( wAddItem[wAddIdx] );

						}
					}

				// ���݂��Ȃ�
				} else {
					// ���j���[�ǉ�
					pParamMenu[wAddKey] = pAddMenu[wAddKey];

				}
			}

			return true;

		} catch(e) {
			throw { name: 'setItemMenuAdd.' + e.name, message: e.message };
		}
	};

	// ���ڃ��j���[�����ݒ�擾
	clsItemBox.prototype.getItemMenuContents = function( pArgument, pDefMenu ) {
		try {
			var wMenuReplace = false;

			var wAddContext = null;
			if ( pArgument ) {
				if ( pArgument.menuList ) {
					wAddContext = pArgument.menuList;
					if ( pArgument.menuReplace ) wMenuReplace = true;
				}
			}

			var wContextList = {};
			// ���j���[�u��
			if ( wMenuReplace ) {
				// �w����e�Œu��
				this.copyProperty( wAddContext, wContextList );

			// �u�����Ȃ�
			} else {
				// �W�����j���[ + �ǉ����j���[��ݒ�
				wContextList = this.getItemMenuDef( pDefMenu, wAddContext );
			}

			// Key���Ƀ\�[�g
			return this.sortNumObject( wContextList );

		} catch(e) {
			throw { name: 'getItemMenuContents.' + e.name, message: e.message };
		}
	};

	// ���ڃ��j���[�g�p�ۃ`�F�b�N
	clsItemBox.prototype.chkItemMenuAvailable = function( pAvailable, pParam ) {
		try {
			// �R���e�L�X�g���j���[�L����
			if ( this._ItemMenuContext ) {
				if ( this._ItemContextAvailable ) return true;

			}

			// �R�ʒu�������j���[�L����
			if ( this._ItemMenuPosition ) {
				if ( this._ItemPositionAvailable ) return true;

			}
			
			return false;

		} catch(e) {
			throw { name: 'chkItemMenuAvailable', message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�g�p�L���ݒ�
	clsItemBox.prototype.setContextAvailable = function( pAvailable, pParam ) {
		try {
			if ( !this._ItemMenuContext ) return;

			this._ItemContextAvailable = pAvailable;

			// �R���e�L�X�g���j���[�g�p���͈ʒu�����s��
			if ( pAvailable ) {
				// �ʒu�������j���[�L����
				this.setPositionAvailable( false );
			}

		} catch(e) {
			throw { name: 'setContextAvailable', message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�g�p����
	clsItemBox.prototype.disabledContextMenu = function( pKind, pDisabled ) {
		try {
			if ( this._ItemMenuContext ) {
				// �L���^�����ݒ�
				this._ItemMenuContext.disabledMenu( pKind, pDisabled );
			}

		} catch(e) {
			throw { name: 'disabledContextMenu.' + e.name, message: e.message };
		}
	};

	// �ʒu�������j���[�g�p�L���ݒ�
	clsItemBox.prototype.setPositionAvailable = function( pAvailable ) {
		try {
			if ( !this._ItemMenuPosition ) return;

			this._ItemPositionAvailable = pAvailable;

		} catch(e) {
			throw { name: 'setPositionAvailable', message: e.message };
		}
	};


	// **************************************************************
	// ���ʃ��j���[����
	// **************************************************************

	// ���ʃ��j���[�擾
	clsItemBox.prototype.loadPublicMenu = function( pMenuKey ) {
		try {
			var wPublicMenu = this.loadArgument( 'publicMenu' );
			if ( !wPublicMenu ) return null;

			// Key�w��Ȃ���ΑS��
			if ( typeof pMenuKey == 'string' ) {
				if ( !(pMenuKey in wPublicMenu) ) return null;
				return wPublicMenu[pMenuKey];
			
			} else {
				return wPublicMenu;

			}

		} catch(e) {
			throw { name: 'loadPublicMenu', message: e.message };
		}
	};

	// ���ʃ��j���[�ݒ�
	clsItemBox.prototype.setPublicMenu = function( pPublicMenu ) {
		try {
			var wPublicMenu = this.loadArgument( 'publicMenu' );
			if ( !wPublicMenu ) wPublicMenu = {};

			// ���ʃ��j���[��ݒ�i�㏑���j
			for( var wKey in pPublicMenu ) {
				wPublicMenu[wKey] = pPublicMenu[wKey];
			}
			
			this.saveArgument( { publicMenu: wPublicMenu } );

		} catch(e) {
			throw { name: 'setPublicMenu', message: e.message };
		}
	};

	// ���ʃ��j���[����
	clsItemBox.prototype.closePublicMenu = function( pMenuKey ) {
		try {
			// ���j���[����
			function closeMenu( pMenuObj ) {
				if ( pMenuObj ) {
					// ��\���p�֐�����Ύ��s
					if ( typeof pMenuObj.hideMenu == 'function' ) {
						pMenuObj.hideMenu();

					}
				}

			};

			// �w��Key���j���[�̂�
			if ( typeof pMenuKey == 'string' ) {
				closeMenu( this.loadPublicMenu[pMenuKey] );
			
			// Key�w��Ȃ���ΑS��
			} else {
				var wPublicMenu = this.loadArgument( 'publicMenu' );
				if ( this.isObject(wPublicMenu) ) {
					for( var wKey in wPublicMenu ) {
						closeMenu( wPublicMenu[wKey] );
					
					}
				}
			}

		} catch(e) {
			throw { name: 'closePublicMenu', message: e.message };
		}
	};

	// �J���[���j���[�\��
	clsItemBox.prototype.dspColorMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// ���ڑ���L�����Z����ʒm
			this.execItemCtrlCancel();

			// �J���[���j���[�\��
			if ( this._ItemMenuColor ) {
				var wPoint = this.getEventPos( pEvent );
				this._ItemMenuColor.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspColorMenu.' + e.name, message: e.message };
		}
	};

	// �֘A���ݒ�
	clsItemBox.prototype.setRelationInf = function( pEvent, pId ) {
		try {
			// �Ώ�ID�N���A
			this._ItemRelationSetId = '';

			// �o�^�σ`�F�b�N
			var wRelationInf = null;
			if ( typeof pId == 'string' ) {
				if ( pId in this._ItemRelation ) {
					wRelationInf = this._ItemRelation[pId].relationInf;
				
				}
			}

			// �o�^�Ώ�ID�ۑ�
			this._ItemRelationSetId = pId;

			// �֘A���ݒ胁�j���[�i���ʁj�L���Ȃ烁�j���[�\��
			var wRelationMenu = this.loadPublicMenu('relation');
			if ( !wRelationMenu ) return false;

			// �N���b�N�ʒu�Ɋ֘A���ݒ��ʕ\��
			var wEvePos = this.getEventPos( pEvent );

			wRelationMenu.dspMenu( { 
							  x: wEvePos.x
							, y: wEvePos.y
							, callback: this.eventRelationSet
							, relationInf: wRelationInf
						} );
			
			// �֘A�t���J�n�͊֘A��񃁃j���[�C�x���g������s
			return true;

		} catch(e) {
			throw { name: 'setRelationInf.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڕύX������
	// **************************************************************

	// ���ڕύX���Ɏ��s����֐��i�e�ւ̒ʒm�֐��j�ݒ�
	clsItemBox.prototype.setItemCallback = function( pFunction ) {
		try {
			if ( typeof pFunction !== 'function' ) return false;
			
			this._ItemCallback = pFunction;
			return true;

		} catch(e) {
			throw { name: 'setItemCallback', message: e.message };
		}
	};

	// ���ڍX�V���ʒm
	clsItemBox.prototype.execItemCallback = function( pEvent, pParam ) {
		try {
			if ( typeof this._ItemCallback !== 'function' ) return false;

			var wCallbackParam = {};
			this.copyProperty( pParam, wCallbackParam );

			wCallbackParam.id		= this.getBoxId();
			wCallbackParam.event	= pEvent;

			var wArguments = [];
			wArguments.push( pEvent );
			wArguments.push( wCallbackParam );

			// �e�̍��ڕύX���֐���Call
			return this._ItemCallback.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execItemCallback', message: e.message };
		}
	};

	// ���ڑ���L�����Z���ʒm
	clsItemBox.prototype.execItemCtrlCancel = function() {
		try {
			// �����ڂ̏������C�x���g����
			this.eventClear();

			// ����L�����Z����ʒm
			this.execItemCallback( null, { kind: 'cancel' } );

		} catch(e) {
			throw { name: 'execItemCtrlCancel', message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// �C�x���g�L�����Z��
	clsItemBox.prototype.eventClear = function() {
		try {
			// �X�e�[�^�X����
			if ( this._ItemMenuStatus ) {
				this._ItemMenuStatus.hideMenu();
			}

			// �A�������
			if ( this._ItemMenuContact ) {
				this._ItemMenuContact.hideMenu();
			}

			// �J���[���j���[����
			if ( this._ItemMenuColor ) {
				this._ItemMenuColor.hideMenu();
			}

			// ���L���j���[����
			this.closePublicMenu();

		} catch(e) {
			throw { name: 'clsItemBox.eventClear', message: e.message };
		}
	};

	// -------------------
	// ���j���[�֘A
	// -------------------

	// ���j���[�����ݒ�
	clsItemBox.prototype.initItemMenu = function( pArgument ) {
		try {
			// ���ڃ��b�N�������s�v
			if ( this.getItemLockIs() ) {
				// �R���e�L�X�g���j���[����
				this.addBoxEvents( 'oncontextmenu' , this.eventInvalid );
				return;

			}

			// ------------------------
			// �R���e�L�X�g���j���[�ݒ�
			// ------------------------
			var wContextMenu = this.loadPublicMenu( 'context' );
			if ( wContextMenu === false ) {
				// false�ݒ莞�̓��j���[����

			} else {
				// �R���e�L�X�g���j���[�p�����[�^�ݒ�
				var wContextParam = {};
				if ( this.isObject(pArgument) ) {
					if ( 'menuList' in pArgument ) {
						wContextParam.menuList = {};
						this.copyProperty( pArgument.menuList, wContextParam.menuList );
						if ( pArgument.menuReplace ) wContextParam.menuReplace = true;
					}
				}

				// ���j���[�ǉ��i�p�����[�^�̃��j���[�D��j
				if ( !wContextParam.menuList ) {
					wContextParam.menuList = {};
				}

				// �ʏ펞�ړ��\
				if ( this.getItemMoveInitIs() ) {
					// �h���b�O�s���̂�
					if ( !this.getItemDragIs() ) {
						// �ړ����j���[�ǉ�
						this.setItemMenuAdd( this._DEF_ITEM_MENU_CONTEXT_ADD, wContextParam.menuList );
					}
				}

				var wContextList = this.getItemMenuContents( wContextParam, this._DEF_ITEM_MENU_CONTEXT );
				if ( !wContextMenu ) {
					wContextMenu = new clsMenuList( { menuList: wContextList } );

				}
				wContextMenu.setMenuList( { menuList: wContextList } );

				// �R���e�L�X�g���j���[�Ƃ��ĕۑ�
				this._ItemMenuContext = wContextMenu;

				// �R���e�L�X�g���j���[�L����
				var wContextParam = {
					drag		: this.getItemMoveInitIs()
				};
				this.setContextAvailable( true, wContextParam );
			}

			var wPositionMenu = this.loadPublicMenu( 'position' );
			if ( wPositionMenu === false ) {
				// false�ݒ莞�̓��j���[����

			} else {
				// �ʒu�������j���[�p�����[�^�ݒ�
				var wPositionParam = {};
				if ( pArgument ) {
					if ( pArgument.positionList ) {
						wPositionParam.menuList = pArgument.positionList;
						if ( pArgument.positionReplace ) wPositionParam.menuReplace = true;
					}
				}

				var wPositionList = this.getItemMenuContents( wPositionParam, this._DEF_ITEM_MENU_POSITION );
				if ( !wPositionMenu ) {
					wPositionMenu = new clsMenuList( { menuList: wPositionList } );

				}
				wPositionMenu.setMenuList( { menuList: wPositionList } );

				// �ʒu�������j���[�Ƃ��ĕۑ�
				this._ItemMenuPosition = wPositionMenu;

			}

			// �R���e�L�X�g���j���[�L��
			this.addBoxEvents( 'oncontextmenu' , this.eventMenuDsp );


			// �J���[���j���[����
			var wColorMenu = this.loadPublicMenu( 'color' );
			if ( wColorMenu === false ) {
				// false�ݒ莞�̓��j���[����

			} else {
				if ( !wColorMenu ) {
					this._ItemMenuColor = new clsColorBox( { callback: this.eventColorSelect } );

				} else {
					this._ItemMenuColor = wColorMenu;

				}
			}

			// ��{���@���j���[����
			var wStatMenu = this.loadPublicMenu( 'status' );
			if ( wStatMenu === false ) {
				// false�ݒ莞�̓��j���[����

			} else {
				if ( !wStatMenu ) {
					this._ItemMenuStatus = new clsMenuStatus( { 
													  statusList	: this._ItemStatus.contents
													, statusValue	: this._ItemStatus.values
													, callback		: this.eventStatusUpdate
					} );

				} else {
					this._ItemMenuStatus = wStatMenu;

				}

			}

			// �A����@���j���[����
			var wContactMenu = this.loadPublicMenu( 'contact' );
			if ( wContactMenu === false ) {
				// false�ݒ莞�̓��j���[����

			} else {
				if ( !wContactMenu ) {
					this._ItemMenuContact = new clsMenuStatus( { 
													  statusList	: this._ItemContact.contents
													, statusValue	: this._ItemContact.values
													, statusAddList	: this._DEF_ITEM_CONTACT_ADD
													, callback		: this.eventContactUpdate
					} );

				} else {
					this._ItemMenuContact = wContactMenu;

				}

			}

		} catch(e) {
			throw { name: 'clsItemBox.initMenu.' + e.name, message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�\��
	clsItemBox.prototype.execContextDsp = function( pEvent, pParam ) {
		try {
			// ���ڃN���b�N���̃��j���[�\��
			if ( !this._ItemMenuContext ) return;

			var wFireEvent = null;

			// fireEvent�ł̃C�x���g���Ύ�
			if ( this.eventFireIs('oncontextmenu') ) {
				wFireEvent = this.eventFireParam('oncontextmenu');
			} else {
				wFireEvent = pEvent;
			}
			
			// �p�����[�^�L�����̂ݏ���
			if ( !wFireEvent ) return;

			// �폜����
			if ( !this._ItemCanDelete ) {
				this.disabledContextMenu( 'delete', true );
			
			} else {
				this.disabledContextMenu( 'delete', false );

			}

			// ���j���[�ݒ�
			var wPoint = this.getEventPos( wFireEvent );

			if ( this.chkRelationItem() ) {
				this._ItemMenuContext.disabledMenu( 'relationChg', false );
				this._ItemMenuContext.disabledMenu( 'unrelation', false );

			} else {
				this._ItemMenuContext.disabledMenu( 'relationChg', true );
				this._ItemMenuContext.disabledMenu( 'unrelation', true );

			}

			// ���j���[�\��
			var wMenuParam = {
				  x:			wPoint.x
				, y:			wPoint.y
				, callback:		this.eventMenuSelect
			};
			
			// �p�����[�^�ǉ�
			if ( this.isObject(pParam) ) {
				for( var wKey in pParam ) {
					wMenuParam[wKey] = pParam[wKey];
				}
			}
			this._ItemMenuContext.dspMenu( wMenuParam );

		} catch(e) {
			throw { name: 'clsItemBox.execContextDsp', message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�I��������
	clsItemBox.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// ���ݒ�
			case 'status':
				wRetVal = this.dspStatusMenu( pEvent );
				break;

			// �A����
			case 'contact':
				wRetVal = this.dspContactMenu( pEvent );
				break;

			// �֘A�t��
			case 'relation':
				// �e�֏�ԕύX��ʒm
				// ���ΏۑI�������͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// �֘A�ύX
			case 'relationChg':
				// �e�֏�ԕύX��ʒm
				// ���ΏۑI�������͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// �֘A����
			case 'unrelation':
				// �e�֏�ԕύX��ʒm
				// ���ΏۑI�������͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// �F�ύX
			case 'color':
				// �J���[���j���[��\��
				wRetVal = this.dspColorMenu( pEvent );
				break;

			// �ړ�
			case 'move':
				// �e�֏�ԕύX��ʒm
				// ���ړ������͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, { kind: 'move' } );
				break;

			// �폜
			case 'delete':
				// �e�֏�ԕύX��ʒm
				// ���폜�����͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// �ʒu�����i�c�j
			case 'pos-vert':
				// �e�֏�ԕύX��ʒm
				// ���ΏۑI�������͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			// �ʒu�����i���j
			case 'pos-side':
				// �e�֏�ԕύX��ʒm
				// ���ΏۑI�������͐e�v�f�Ŏ��{
				wRetVal = this.execItemCallback( pEvent, pSelectMenu );
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'clsItemBox.execContextSelect.' + e.name, message: e.message };
		}
	};

	// �ʒu�������j���[�\��
	clsItemBox.prototype.execPositionDsp = function( pEvent, pParam ) {
		try {
			// ���ڃN���b�N���̃��j���[�\��
			if ( !this._ItemMenuPosition ) return;

			var wFireEvent = null;

			// fireEvent�ł̃C�x���g���Ύ�
			if ( this.eventFireIs('oncontextmenu') ) {
				wFireEvent = this.eventFireParam('oncontextmenu');
			} else {
				wFireEvent = pEvent;
			}
			
			// �p�����[�^�L�����̂ݏ���
			if ( !wFireEvent ) return;

			// ���j���[�ݒ�
			var wPoint = this.getEventPos( wFireEvent );

			// ���j���[�\��
			var wMenuParam = {
				  x:			wPoint.x
				, y:			wPoint.y
				, callback:		this.eventMenuSelect
			};
			
			// �p�����[�^�ǉ�
			if ( this.isObject(pParam) ) {
				for( var wKey in pParam ) {
					wMenuParam[wKey] = pParam[wKey];
				}
			}
			this._ItemMenuPosition.dspMenu( wMenuParam );

		} catch(e) {
			throw { name: 'clsItemBox.execPositionDsp', message: e.message };
		}
	};

	// -------------------
	// ��{���֘A
	// -------------------

	// �X�e�[�^�X�����ݒ�
	clsItemBox.prototype.initItemStatus = function( pArgument ) {
		try {
			// ------------------------
			// �X�e�[�^�X�ݒ�
			// ------------------------
			
			// �����l�`�F�b�N
			var wDefault = false;
			if ( this.isObject(pArgument) ) {
				if ( 'default' in pArgument ) wDefault = true;
			}

			// ��{��񏉊��l
			this._ItemStatusDef.contents	= this.setStatusContents( this._DEF_ITEM_STATUS_BASE, pArgument );
			this._ItemStatusDef.values		= this.initStatusValues( this._ItemStatusDef.contents );

			// �����l�㏑��
			var wStatDef = false;
			if ( wDefault ) {
				for ( var wDefKey in pArgument.default ) {
					if ( wDefKey in this._ItemStatusDef.values ) {
						this._ItemStatusDef.values[wDefKey] = pArgument.default[wDefKey];
						wStatDef = true;
					}
				}
			}

			// Load��
			var wLoadStat = this.loadDataVal( 'status' );
			if ( wLoadStat ) {
				// ��{����Load�f�[�^�ݒ�
				this._ItemStatus = wLoadStat;

				// �\���X�V
				this.execStatusMenu( { load: true } );

			// �V�K��
			} else {

				// ��{���@�����ݒ�
				this._ItemStatus.contents = {};
				this.copyProperty( this._ItemStatusDef.contents, this._ItemStatus.contents );

				// ��{���@�ݒ�l��������
				this._ItemStatus.values = {};
				this.copyProperty( this._ItemStatusDef.values, this._ItemStatus.values );

				// �X�e�[�^�X�����l�ݒ莞�@�\���X�V
				if ( wStatDef ) this.execStatusMenu();
			}


			// ------------------------
			// �A����ݒ�
			// ------------------------

			// �����ݒ�l�ۑ�
			var wContactArg = {};
			if ( pArgument ) {
				wContactArg.statusList		= pArgument.contactList;
				wContactArg.statusReplace	= pArgument.contactReplace;
				wContactArg.statusProperty	= pArgument.contactProperty;
			}

			// �A�����񏉊��l
			this._ItemContactDef.contents	= this.setStatusContents( this._DEF_ITEM_CONTACT_BASE, wContactArg );
			this._ItemContactDef.values		= this.initStatusValues( this._ItemContactDef.contents );

			// �����l�㏑��
			if ( wDefault ) {
				if ( 'contact' in pArgument.default ) {
					this.copyProperty( pArgument.default.contact, this._ItemContactDef.values );
				}
			}

			// Load��
			var wLoadContact = this.loadDataVal( 'contact' );
			if ( wLoadContact ) {
				// �A�����Load�f�[�^�ݒ�
				this._ItemContact = wLoadContact;

			} else {
				// �A����@�����ݒ�
				this.setContactContents( this._ItemContactDef.contents );

				// �A����@�ݒ�l��������
				this.setContactValues( this._ItemContactDef.values );

			}

		} catch(e) {
			throw { name: 'clsItemBox.initStatus.' + e.name, message: e.message };
		}
	};

	// �X�e�[�^�X�ݒ莞����
	clsItemBox.prototype.execStatusMenu = function( pEvent, pStatVal ) {
		try {
			// �\���L���ݒ�ύX
			this.setStatusDisplay();

			// �\���ΏۃX�e�[�^�X��\��
			this.dspStatusContents();
			
			// �}�E�X�I�[�o�[�X�e�[�^�X�ݒ�
			this.setStatusTitle();

		} catch(e) {
			throw { name: 'clsItemBox.execStatusMenu.' + e.name, message: e.message };
		}
	};

	// �X�e�[�^�X�l�X�V�ݒ�
	clsItemBox.prototype.updStatusValue = function( pArgument ) {
		try {
			if ( !this._ItemStatus.values ) return false;

			// �X�e�[�^�X�l�擾
			var wDefaultVal = null;
			if ( pArgument ) {
				// callback�ݒ�
				var wCallFunc = {};
				var wCallFlag = false;
				for( var wFncKey in pArgument ) {
					if ( typeof pArgument[wFncKey] == 'function' ) {
						wCallFunc[wFncKey] = pArgument[wFncKey];
						wCallFlag = true;
					}
				}
				if ( wCallFlag ) this.saveArgument( wCallFunc );

				if ( 'default' in pArgument ) wDefaultVal = pArgument.default;
			}

			// ��{�X�e�[�^�X�l�㏑��
			var wUpdStat;
			if ( wDefaultVal ) {
				wUpdStat = wDefaultVal;

			} else {
				wUpdStat = {};

			}

			for ( var wDefKey in this._ItemStatus.values ) {
				// �\���t���O�͏����l�ݒ�
				if ( wDefKey.slice(-4) == '-flg' ) {
					this._ItemStatus.values[wDefKey] = 1;

				// �ݒ�l����
				} else if ( wDefKey in wUpdStat ) {
					// �l�ݒ�
					this._ItemStatus.values[wDefKey] = wUpdStat[wDefKey];

				// �ݒ�l�Ȃ�
				} else {
					// ������
					this._ItemStatus.values[wDefKey] = '';

				}
			}

			// �A����@�ݒ�l��������
			this._ItemContact.contents	= {};
			this._ItemContact.values	= {};
			this.setContactContents( this._ItemContactDef.contents );
			this.setContactValues( this._ItemContactDef.values );

			// ��{�A����
			if ( wDefaultVal ) {
				if ( 'contact' in wDefaultVal ) wUpdStat = wDefaultVal.contact;

			} else {
				wUpdStat = {};

			}

			for ( var wContKey in this._ItemContact.values ) {
				// �ݒ�l����
				if ( wContKey in wUpdStat ) {
					// �l�ݒ�
					this._ItemContact.values[wContKey] = wUpdStat[wContKey];
				}
			}

			// �X�e�[�^�X�\���X�V
			this.execStatusMenu( { load: true } );

			return true;

		} catch(e) {
			throw { name: 'clsItemBox.updStatusValue.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD�֘A
	// -------------------

	// �f�[�^�ۑ��p�@���ڐݒ�l�擾
	clsItemBox.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// �p�����f�[�^�ۑ�
			if ( this._BasePrototype ) {
				wSaveData = this._BasePrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// value�𕡎�
			var copyValue = function( pSrc, pDst, pKey ) {
				if ( !(pKey in pSrc) ) return;
				if ( !(pKey in pDst) ) return;

				// �l�擾
				var wValue = pSrc[pKey];

				// �l�ݒ�
				pDst[pKey] = wValue;
			};

			var wContact	= true;
			var wPersonal	= true;
			var wComment	= true;
			if ( this.isObject(pSaveParam) ) {
				if ( 'contact'  in pSaveParam ) wContact  = pSaveParam.contact;
				if ( 'personal' in pSaveParam ) wPersonal = pSaveParam.personal;
				if ( 'comment'  in pSaveParam ) wComment  = pSaveParam.comment;
			}

			// ��{���@�Ώ�
			if ( wPersonal ) {
				// �ݒ�ς̊�{���
				wSaveData.status	= JSON.stringify( this._ItemStatus );

			// �ΏۊO
			} else {
				// �����l
				var wDefStatus = {};
				this.copyProperty( this._ItemStatusDef, wDefStatus );
				
				// �^�C�g���̂ݑΏ�
				copyValue( this._ItemStatus.values, wDefStatus.values, 'title' );

				// �u�R�����g�v�̏ꍇ�̓R�����g���Ώ�
				if ( this.isComment() && wComment ) {
					copyValue( this._ItemStatus.values, wDefStatus.values, 'comment' );
				}

				wSaveData.status	= JSON.stringify( wDefStatus );

			}

			// �A����@�Ώ�
			if ( wContact ) {
				// �ݒ�ς̘A����
				wSaveData.contact	= JSON.stringify( this._ItemContact );

			// �ΏۊO
			} else {
				// �����l
				wSaveData.contact	= JSON.stringify( this._ItemContactDef );

			}

			// �֌W���
			var wSaveRel = {};
			for( var wRelId in this._ItemRelation ) {
				wRelItem = this._ItemRelation[wRelId];
				
				var wRelInf = {};
				for( var wRelKey in wRelItem ) {
					// relationInf��class�ւ̎Q�ƂȂ̂ŕۑ����Ȃ�
					if ( wRelKey !== 'relationInf' ) {
						wRelInf[wRelKey] = wRelItem[wRelKey];
					}
				}
				wSaveRel[wRelId] = wRelInf;
			}
			wSaveData.relation	= JSON.stringify( wSaveRel );

			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemBox.saveData', message: e.message };
		}
	};

	// �f�[�^�Ǎ�
	clsItemBox.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// �p�����f�[�^�Ǎ�����
			if ( this._BasePrototype ) {
				wLoadBuff = this._BasePrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// ��{���
			if ( pLoadData.status ) {
				wLoadBuff.status = JSON.parse( pLoadData.status );
			}
			
			// �A����
			if ( pLoadData.contact ) {
				wLoadBuff.contact = JSON.parse( pLoadData.contact );
			}

			// �֌W���
			if ( pLoadData.relation ) {
				wLoadBuff.relation = JSON.parse( pLoadData.relation );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemBox.loadData', message: e.message };
		}
	};

	// �֘A�t�����Ǎ�
	clsItemBox.prototype.loadDataRelation = function() {
		try {
			// Load��
			var wLoadRelation = this.loadDataVal( 'relation' );
			if ( !wLoadRelation ) return;

			var wReadRel = {};

			for( var wRelId in wLoadRelation ) {
				var wReadInf = {};
				var wLoadInf = wLoadRelation[wRelId];

				for( var wRelKey in wLoadInf ) {
					if ( wRelKey == 'relationInf' ) {
						// �֘A���𕜌�
						// �� clsItemRelation�ۑ���
						try {
							wReadInf[wRelKey] = JSON.parse(wLoadInf[wRelKey]);
						} catch(e) {
							wReadInf[wRelKey] = wLoadInf[wRelKey];
						}

					} else {
						wReadInf[wRelKey] = wLoadInf[wRelKey];

					}
				}
				wReadRel[wRelId] = wReadInf;
			}

			// �֘A����Load�f�[�^�ݒ�
			this._ItemRelation = wReadRel;

		} catch(e) {
			throw { name: 'clsItemBox.loadDataRelation.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsItemBox.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁuitem�v
				wInitArgument.kind = this._DEF_ITEM_KIND;

			}

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			if ( this.isObject(pArgument) ) {
				// ���b�N���
				if ( 'locked' in pArgument ) this._ItemControlLocked = pArgument.locked;

				// ���ڃh���b�O�ړ���
				if ( 'drag'     in pArgument ) this._ItemMoveDrag	= pArgument.drag;
				if ( 'moveInit' in pArgument ) this._ItemMoveInit	= pArgument.moveInit;
			}

			// ���ڍ폜��
			var wCanDelete = this.loadArgument('delete');
			if ( wCanDelete != null ) {
				this._ItemCanDelete = wCanDelete;
			}

			// �N���X�ǉ�
			var wClass = 'cssItem-base';
			var wColor = 'cssItem-color-base';

			var wItemKind = this.getBoxKind();
			switch( wItemKind ) {
			case 'item-person':
				wClass = 'cssItem-person';
				wColor = 'cssItem-color-person';
				break;
			
			case 'item-group':
				wClass = 'cssItem-group';
				wColor = 'cssItem-color-group';
				break;
			
			case 'item-comment':
				wClass = 'cssItem-comment';
				wColor = 'cssItem-color-comment';
				break;
			
			case 'item-relation':
				wClass = 'cssItem-relation';
				wColor = 'cssItem-color-relation';
				break;
			
			case 'item-freeline':
				wClass = 'cssItem-freeline';
				wColor = 'cssItem-color-freeline';
				break;
			
			}
			this.setBoxClass( wClass );
			this.setBoxClass( wColor );

			// �h���b�O�\��
			if ( this._ItemMoveDrag ) {
				// �}�E�X�|�C���^�ύX
				//���L�����o�X��艜�̍��ڂ̃J�[�\�����ύX�ł��Ȃ��̂ŃJ�[�\���ύX�Ȃ�
				//this.setBoxClass( 'cssItem-drag' );

			}

			if ( pArgument ) {
				// callback�ݒ�
				if ( pArgument.callback ) this.setItemCallback( pArgument.callback );

			}

			// ------------------------
			// �X�e�[�^�X�ݒ�
			// ------------------------
			this.initItemStatus( pArgument );


			// ------------------------
			// ���j���[�ݒ�
			// ------------------------
			this.initItemMenu( pArgument );


			// ------------------------
			// �֘A�t����� Load
			// ------------------------
			this.loadDataRelation();

		} catch(e) {
			throw { name: 'clsItemBox.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsItemBox.prototype.freeClass = function() {
		try {
			// �֘A���ڑS�č폜
			this.execFunction( this.delRelationAll );
			
			// �v���p�e�B�J��
			this._ItemCallback				= null;

			this._ItemMenuContext			= null;
			this._ItemMenuStatus			= null;
			this._ItemMenuColor				= null;
			this._ItemMenuContact			= null;

			this._ItemSelect				= null;
			this._ItemRelation				= null;
			this._ItemRelationSetId			= '';

			this._ItemStatus.contents		= null;
			this._ItemStatus.values			= null;
			this._ItemStatus				= null;

			this._ItemStatusDef.contents	= null;
			this._ItemStatusDef.values		= null;
			this._ItemStatusDef				= null;

			this._ItemContact.contents		= null;
			this._ItemContact.values		= null;
			this._ItemContact				= null;

			this._ItemContactDef.contents	= null;
			this._ItemContactDef.values		= null;
			this._ItemContactDef			= null;

			this._ItemFireEventParam		= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};
}());
