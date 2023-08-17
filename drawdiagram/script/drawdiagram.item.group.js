// --------------------------------------------------------------------
//
// �O���[�v���ڃN���X
//
// --------------------------------------------------------------------
// clsItemGroup �� clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsItemGroup = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_GROUP_KIND				= 'item-group';

		this._DEF_ITEM_GROUP_PROPERTY			= {
			 'z-index'				: '200'
		};

		this._DEF_ITEM_GROUP_MENU				= {
			 3: [
				{ kind: 'resize'	, title: '�T�C�Y�ύX'	}
			 ]
		};

		this._DEF_ITEM_GROUP_MENU_POSITION		= {
			 1: [
				{ kind: 'resize'	, title: '�T�C�Y�ύX'	}
			 ]
		};

		this._DEF_ITEM_GROUP_LIST_RELATION		= {
				  1		: '�Ƒ�'
				, 2		: '�e��'
				, 10	: '��Ë@��'
				, 11	: '���̑��@��'
		};

		// ----------------------------
		// �O���[�v�@�A����
		// ----------------------------

		// �A����ݒ�
		this._DEF_ITEM_GROUP_CONTACT_FAX_NAME	= {
				  name		: 'contact-fax'
				, title		: '�A����2'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: 'FAX�ԍ�'
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_GROUP_CONTACT_FAX_NO		= {
				  name		: 'contact-fax-no'
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

		this._DEF_ITEM_GROUP_CONTACT			= {
			  2: [ this._DEF_ITEM_GROUP_CONTACT_FAX_NAME	, this._DEF_ITEM_GROUP_CONTACT_FAX_NO  ]
		};

		// �p�����N���X��prototype
		this._ItemPrototype				= null;


		// **************************************************************
		// �R���X�g���N�^
		// **************************************************************
		// �e�N���X��prototype��ۑ�
		this._ItemPrototype = clsItemBox.prototype;

		// �e�N���X��constructor
		// ���p�������uinitClass�v��call�����
		clsItemBox.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsItemGroup.' + e.name, message: e.message };
	}
};

// �O���[�v prototype
(function(){
	// clsItemBox�̃v���g�^�C�v���p��
	clsInheritance( clsItemGroup, clsItemBox );


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// -------------------
	// ���j���[�֘A
	// -------------------

	// �R���e�L�X�g���j���[�\��
	clsItemGroup.prototype.execContextDsp = function( pEvent, pParam ) {
		try {

			// �p�������j���[�\������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execContextDsp.call( this, pEvent, pParam );

			}

		} catch(e) {
			throw { name: 'clsItemGroup.execContextDsp', message: e.message };
		}
	};

	// �O���[�v�p�R���e�L�X�g���j���[�I��������
	clsItemGroup.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
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
			throw { name: 'clsItemGroup.execContextSelect.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsItemGroup.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_GROUP_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁuitem-group�v
				wInitArgument.kind = this._DEF_ITEM_GROUP_KIND;

			}

			// �ǉ����j���[�ݒ�
			wInitArgument.menuList		= this._DEF_ITEM_GROUP_MENU;

			// �ǉ��ʒu�������j���[�ݒ�
			wInitArgument.positionList	= this._DEF_ITEM_GROUP_MENU_POSITION;

			// �ǉ��X�e�[�^�X�ݒ�
			var wUpdProperty = {
					title		: {
						 title	: '���'
						,list	: this._DEF_ITEM_GROUP_LIST_RELATION
					}
			};
			wInitArgument.statusProperty = wUpdProperty;

			// �ǉ��A����ݒ�
			wInitArgument.contactList	= this._DEF_ITEM_GROUP_CONTACT;

			// �p�����R���X�g���N�^
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsItemGroup.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsItemGroup.prototype.freeClass = function() {
		try {
			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
