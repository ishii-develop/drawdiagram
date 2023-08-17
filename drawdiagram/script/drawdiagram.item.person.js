// --------------------------------------------------------------------
//
// �l�����ڃN���X
//
// --------------------------------------------------------------------
// clsItemPerson �� clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsItemPerson = function( pArgument ) {
	try {
		var self = this;

		this._DEF_ITEM_PERSON_KIND				= 'item-person';

		this._DEF_ITEM_PERSON_PROPERTY			= {
			 'z-index'				: '300'
		};
		
		// �區�ڂ̃v���p�e�B�i�ǉ��j
		this._DEF_ITEM_PERSON_MAIN_PROPERTY		= {
			 'background-color'		: '#FFEEEE'
		};

		// ----------------------------
		// �l���@�萔�l
		// ----------------------------

		// ���ʃC���f�b�N�X
		this._IDX_ITEM_PERSON_GENDER			= {
				  none		: 0
				, man		: 1
				, woman		: 2
				, unknown	: 3
		};

		// ----------------------------
		// �l���@���j���[�ݒ�
		// ----------------------------

		this._DEF_ITEM_PERSON_MENU				= {};

		this._DEF_ITEM_PERSON_MENU_STAT			= {
			  1: [
				  { kind: 'base'		, title: '��{���'	}
				 ,{ kind: 'gender'		, title: '����'		}
				 ,{ kind: 'situation'	, title: '��'		}
				 ,{ kind: 'other'		, title: '���̑�'	}
			  ]
		};

		this._DEF_ITEM_PERSON_ICON_GENDER		= [
				 { kind: ''				,title: '���ݒ�'		, image: ''							}
				,{ kind: 'man'			,title: '�j��'			, image: 'icon_man.png'				}
				,{ kind: 'woman'		,title: '����'			, image: 'icon_woman.png'			}
				,{ kind: 'unknown'		,title: '�s��'			, image: 'icon_unknown.png'			}
		];

		this._DEF_ITEM_PERSON_ICON_GENDER_KEY	= [
				 { kind: ''				,title: '���ݒ�'		, image: ''							}
				,{ kind: 'key-man'		,title: '�j��'			, image: 'icon_key_man.png'			}
				,{ kind: 'key-woman'	,title: '����'			, image: 'icon_key_woman.png'		}
				,{ kind: 'key-unknown'	,title: '�s��'			, image: 'icon_key_unknown.png'		}
		];

		this._DEF_ITEM_PERSON_ICON_SITUATION	= [
				 { kind: ''				,title: '���ݒ�'		, image: ''							}
				,{ kind: 'death'		,title: '���S'			, image: 'icon_death.png'			}
		];

		this._DEF_ITEM_PERSON_ICON_PREGNANCY	= { 
				kind: 'pregnancy'	,title: '�D�P'		, image: 'icon_pregnancy.png'
		};

		this._DEF_ITEM_PERSON_LIST_RELATION = {
				  1		: '��'
				, 2		: '��'
				, 3		: '�Z'
				, 4		: '�o'
				, 5		: '��'
				, 6		: '��'
				, 10	: '�c��'
				, 11	: '�c��'
				, 99	: '���v���Ӂ�'
		};

		// ----------------------------
		// �l���@�ǉ���{���
		// ----------------------------

		this._DEF_ITEM_PERSON_STATUS_ITEM_AGE = {
				  name		: 'age'
				, title		: '�N��'
				, type		: 'text'
				, length	: 3
				, display	: false
				, default	: ''
				, design	: {
					 data	: { width: '230px' }
					,input	: { width: '32px' }
				}
		};

		this._DEF_ITEM_PERSON_STATUS_ITEM_AGE_FLG = {
				  name		: 'age-flg'
				, title		: '�N��\���L��'
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

		this._DEF_ITEM_PERSON_STATUS_ITEM_OTHER = {
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

		// �ǉ����@��{���
		this._DEF_ITEM_PERSON_STATUS_BASE		= {
			 4: [ this._DEF_ITEM_PERSON_STATUS_ITEM_AGE	, this._DEF_ITEM_PERSON_STATUS_ITEM_AGE_FLG ]
		};

		// ���̑����
		this._DEF_ITEM_PERSON_STATUS_OTHER		= {
			  1: [ this._DEF_ITEM_PERSON_STATUS_ITEM_OTHER ]
		};

		// ----------------------------
		// �l���@�A����
		// ----------------------------
		this._DEF_ITEM_PERSON_CONTACT_ETC_NAME	= {
				  name		: 'contact-etc'
				, title		: '�A����2'
				, type		: 'text'
				, length	: 40
				, display	: true
				, default	: '�A����'
				, design	: {
					 data	: { width: '150px' }
					,input	: { width: '146px' }
				}
		};

		this._DEF_ITEM_PERSON_CONTACT_ETC_NO	= {
				  name		: 'contact-etc-no'
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

		this._DEF_ITEM_PERSON_CONTACT			= {
			  2: [ this._DEF_ITEM_PERSON_CONTACT_ETC_NAME	, this._DEF_ITEM_PERSON_CONTACT_ETC_NO  ]
		};

		// �p�����N���X��prototype
		this._ItemPrototype						= null;

		this._PersonMenuStat					= null;
		this._PersonMenuIcon					= null;
		this._PersonMenuOther					= null;

		this._PersonStatus						= {
					  keyperson		: false
					, gender		: { kind: '' }
					, situation		: { kind: '' }
					, other			: { contents: null, values: null }
		};
		this._PersonStatusOtherDef				= { contents: null, values: null };


		// **************************************************************
		// ���j���[����
		// **************************************************************

		// ���ݒ胁�j���[�I����
		this.eventStatSelect = function( pEvent, pSelectMenu ) {
			try {
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				return self.execItemMenuStat( pEvent, pSelectMenu );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���ݒ�i���ʁj�I����
		this.eventGenderSelect = function( pEvent, pSelectMenu ) {
			try {
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// �I���������ʂ�ۑ�
				self.copyProperty( pSelectMenu, self._PersonStatus.gender );
				
				// ���ڂ�background��ύX
				self.setPersonIcon();

				// �e�֐��ʕύX��ʒm
				return self.execItemCallback( pEvent, { kind: 'status' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���ݒ�i�󋵁j�I����
		this.eventSituationSelect = function( pEvent, pSelectMenu ) {
			try {
				if ( !pSelectMenu ) return false;

				// �I�����j���[��ʕs���@close���͏����Ȃ�
				var wKind = pSelectMenu.kind;
				if ( typeof wKind == 'undefined' ) return false;
				if ( wKind == 'close' ) return false;

				// �I�������󋵂�ۑ�
				self.copyProperty( pSelectMenu, self._PersonStatus.situation );

				// ���ڂ�background��ύX
				self.setPersonIcon();

				// �e�֏󋵕ύX��ʒm
				return self.execItemCallback( pEvent, { kind: 'status'} );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���ݒ�i���̑��j�X�V���C�x���g
		this.eventOtherUpdate = function( pEvent, pParam ) {
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
				self.copyProperty( pParam.statusValue, self._PersonStatus.other.values );

				// �e�֏󋵕ύX��ʒm
				return self.execItemCallback( pEvent, { kind: 'status'} );

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
		throw { name: 'clsItemPerson.' + e.name, message: e.message };
	}
};

// �l�� prototype
(function(){
	// clsItemBox�̃v���g�^�C�v���p��
	clsInheritance( clsItemPerson, clsItemBox );

	// **************************************************************
	// ���擾
	// **************************************************************

	// �X�e�[�^�X�ݒ�l���擾
	clsItemPerson.prototype.getCommentValues = function() {
		try {
			if ( !this._PersonStatus.other.values ) return '';

			return this._PersonStatus.other.values['comment'];

		} catch(e) {
			throw { name: 'getCommentValues', message: e.message };
		}
	};

	// �區�ڂ��ǂ������擾
	clsItemPerson.prototype.isKeyPerson = function() {
		try {
			return this._PersonStatus.keyperson;

		} catch(e) {
			throw { name: 'isKeyPerson', message: e.message };
		}
	};


	// **************************************************************
	// ���ڏ�Ԏ擾�^�ݒ�
	// **************************************************************

	// ���ڂ�background��ύX
	clsItemPerson.prototype.setPersonIcon = function( pEvent ) {
		try {
			var wBackGround = '';
			var wImgPath = this.getImagePath();

			// ����
			var wImage = this._PersonStatus.gender.image;
			if ( !wImage ) wImage = '';
			if ( String(wImage).length > 0 ) {
				wBackGround += "url(" + wImgPath + wImage + ")";
			}

			// ��
			wImage = this._PersonStatus.situation.image;
			if ( !wImage ) wImage = '';
			if ( String(wImage).length > 0 ) {
				if ( String(wBackGround).length > 0 ) wBackGround += ',';
				wBackGround += "url(" + wImgPath + wImage + ")";
			}

			this.setBoxStyle( { 'background-image': wBackGround } );

		} catch(e) {
			throw { name: 'setPersonIcon', message: e.message };
		}
	};

	// ���ʎ擾
	clsItemPerson.prototype.getGenderKind = function() {
		try {
			var wResultKd = '';

			if ( !this.isObject(this._PersonStatus) ) return wResultKd;
			if ( !this.isObject(this._PersonStatus.gender) ) return wResultKd;

			wResultKd = this._PersonStatus.gender.kind;

			return wResultKd;

		} catch(e) {
			throw { name: 'getGenderKind', message: e.message };
		}
	};

	// ���ʐݒ胊�X�g�擾
	clsItemPerson.prototype.getGenderList = function( pKeyPerson ) {
		try {
			// keyperson
			var wKeyPerson = this._PersonStatus.keyperson;
			if ( typeof pKeyPerson == 'boolean' ) wKeyPerson = pKeyPerson;

			if ( wKeyPerson ) {
				return this._DEF_ITEM_PERSON_ICON_GENDER_KEY;

			} else {
				return this._DEF_ITEM_PERSON_ICON_GENDER;

			}

		} catch(e) {
			throw { name: 'getGenderList', message: e.message };
		}
	};

	// ���ʐݒ���擾�i�C���f�b�N�X�j
	clsItemPerson.prototype.getGenderItemByIndex = function( pIndex, pKeyPerson ) {
		try {
			var wResultItm = null;
			var wGenderList = this.getGenderList( pKeyPerson );

			return wGenderList[pIndex];

		} catch(e) {
			throw { name: 'getGenderItemByIndex', message: e.message };
		}
	};

	// ���ʐݒ���擾�i���ʎ�ʁj
	clsItemPerson.prototype.getGenderItemByKind = function( pKind, pKeyPerson ) {
		try {
			var wResultItm = null;

			// keyperson
			var wKeyPerson = this._PersonStatus.keyperson;
			if ( typeof pKeyPerson == 'boolean' ) wKeyPerson = pKeyPerson;

			var wGenderList = this.getGenderList( wKeyPerson );

			// �`�F�b�N���
			var wChkKind = pKind;
			if ( wKeyPerson ) wChkKind = 'key-' + wChkKind;

			for( var wIndex = 0; wIndex < wGenderList.length; wIndex++ ) {
				if ( wChkKind == wGenderList[wIndex].kind ) {
					wResultItm = {};
					this.copyProperty( wGenderList[wIndex], wResultItm );
					break;
				}
			}

			return wResultItm;

		} catch(e) {
			throw { name: 'getGenderItemByKind', message: e.message };
		}
	};

	// ���ʁiindex�j�擾
	clsItemPerson.prototype.getGenderIndex = function() {
		try {
			var wRetIdx = 0;
			var wGenderList = this.getGenderList();

			var wGenderKd = this._PersonStatus.gender.kind;
			for( var wIndex = 0; wIndex < wGenderList.length; wIndex++ ) {
				if ( wGenderKd == wGenderList[wIndex].kind ) {
					wRetIdx = wIndex;
					break;
				}
			}

			return wRetIdx;

		} catch(e) {
			throw { name: 'getGenderIndex', message: e.message };
		}
	};

	// ���ʂ��������`�F�b�N
	clsItemPerson.prototype.chkGenderWhetherWoman = function( ) {
		try {
			var wGenderIdx = this.getGenderIndex();

			if ( wGenderIdx == this._IDX_ITEM_PERSON_GENDER.woman ) {
				return true;

			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'chkGenderWhetherWoman', message: e.message };
		}
	};

	// �֌W�����琫�ʂ��擾
	clsItemPerson.prototype.getGenderFromRelation = function( pRelationKd ) {
		try {
			var wGenderKind = null;

			switch( pRelationKd ) {
			case '��':
			case '�Z':
			case '��':
			case '�c��':
				wGenderKind = this.getGenderItemByKind( 'man' );
				break;

			case '��':
			case '�o':
			case '��':
			case '�c��':
				wGenderKind = this.getGenderItemByKind( 'woman' );
				break;

			default:
				break;
			}
			
			return wGenderKind;

		} catch(e) {
			throw { name: 'getGenderFromRelation', message: e.message };
		}
	};
	
	// �X�e�[�^�X���e�\��
	clsItemPerson.prototype.setPersonStatusTitle = function() {
		try {
			var wAgeItem = this.getStatusContents('age');
			if ( !wAgeItem ) return;

			// ��\�����̂݃^�C�g���Ƃ��Đݒ�
			if ( wAgeItem.display ) return;

			var wValue = this.getStatusValues(wAgeItem.name);
			if ( !wValue ) return;

			// ���̕\�����擾
			var wTitle = this.getBoxAttribute('title');
			if ( wTitle.length > 0 ) {
				wTitle += '�i' + wValue + '�΁j';

			} else {
				wTitle = wValue + '��';

			}

			// title�������Đݒ�
			this.setBoxAttribute( { title: wTitle } );

		} catch(e) {
			throw { name: 'setStatusTitle.' + e.name, message: e.message };
		}
	};

	
	// **************************************************************
	// �T�u���j���[�\��
	// **************************************************************

	// ���ݒ胁�j���[�\��
	clsItemPerson.prototype.dspMenuStatus = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// ���ݒ胁�j���[�\��
			if ( this._PersonMenuStat ) {
				// �I�����ݒ�
				var wPoint	= this.getEventPos( pEvent );
				
				var wParam = {
					  x:			wPoint.x
					, y:			wPoint.y
					, callback:		this.eventStatSelect
				};
				this._PersonMenuStat.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspMenuStatus.' + e.name, message: e.message };
		}
	};

	// ���ʁ@�I��\��
	clsItemPerson.prototype.dspMenuGender = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// ���ʃ��j���[�\��
			if ( this._PersonMenuIcon ) {
				// �I�����ݒ�
				var wIcon	= { kind: this._PersonStatus.gender.kind };
				var wPoint	= this.getEventPos( pEvent );
				
				// �A�C�R���ݒ�
				var wMenu;
				if ( this._PersonStatus.keyperson ) {
					wMenu	= Array.prototype.slice.call(this._DEF_ITEM_PERSON_ICON_GENDER_KEY, 0);
				} else {
					wMenu	= Array.prototype.slice.call(this._DEF_ITEM_PERSON_ICON_GENDER, 0);
				}

				var wParam = {
					  x:			wPoint.x
					, y:			wPoint.y
					, callback:		this.eventGenderSelect
					, icon:			wIcon
					, iconList:		wMenu
				};
				this._PersonMenuIcon.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspMenuGender.' + e.name, message: e.message };
		}
	};

	// �󋵁@�I��\��
	clsItemPerson.prototype.dspMenuSituation = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �󋵃��j���[�\��
			if ( this._PersonMenuIcon ) {
				// �I�����ݒ�
				var wIcon = { kind: this._PersonStatus.situation.kind };
				var wPoint = this.getEventPos( pEvent );

				// ����
				var wIconList = Array.prototype.slice.call(this._DEF_ITEM_PERSON_ICON_SITUATION, 0);
				if ( this.chkGenderWhetherWoman() ) {
					wIconList.push( this._DEF_ITEM_PERSON_ICON_PREGNANCY );

				}
				var wParam = {
					  x:			wPoint.x
					, y:			wPoint.y
					, callback:		this.eventSituationSelect
					, icon:			wIcon
					, iconList:		wIconList
				};
				this._PersonMenuIcon.dspMenu( wParam );
			}

		} catch(e) {
			throw { name: 'dspMenuSituation.' + e.name, message: e.message };
		}
	};

	// ���̑��@�o�^��ʕ\��
	clsItemPerson.prototype.dspMenuOther = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �o�^��ʕ\��
			if ( this._PersonMenuOther && this._PersonStatus.other ) {
				if ( this._PersonStatus.other.contents ) {
					var wPoint	= this.getEventPos( pEvent );
					
					var wParam = {
						  x				: wPoint.x
						, y				: wPoint.y
						, callback		: this.eventOtherUpdate
						, statusList	: this._PersonStatus.other.contents
						, statusValue	: this._PersonStatus.other.values
					};
					this._PersonMenuOther.dspMenu( wParam );
				}
			}

		} catch(e) {
			throw { name: 'dspMenuOther.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// �T�u���j���[�@�I��������
	// **************************************************************

	// ���ݒ胁�j���[�I��������
	clsItemPerson.prototype.execItemMenuStat = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// ��{���
			case 'base':
				// ���ڃN���X�i�p�����j�̃��\�b�h��call
				wRetVal = this.dspStatusMenu( pEvent );
				break;

			// ����
			case 'gender':
				wRetVal = this.dspMenuGender( pEvent );
				break;

			// ���
			case 'situation':
				wRetVal = this.dspMenuSituation( pEvent );
				break;

			// ���̑�
			case 'other':
				wRetVal = this.dspMenuOther( pEvent );
				break;


			}

			return wRetVal;

		} catch(e) {
			throw { name: 'execItemMenuStat.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// �C�x���g�L�����Z��
	clsItemPerson.prototype.eventClear = function() {
		try {
			// ���ݒ胁�j���[����
			if ( this._PersonMenuStat ) {
				this._PersonMenuStat.hideMenu();
			}

			// �A�C�R�����j���[����
			if ( this._PersonMenuIcon ) {
				this._PersonMenuIcon.hideMenu();
			}

			// ���ݒ�i���̑��j����
			if ( this._PersonMenuOther ) {
				this._PersonMenuOther.hideMenu();
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
	clsItemPerson.prototype.initItemMenu = function( pArgument ) {
		try {
			// �p�������j���[����������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// ���ڃ��b�N�������s�v
			if ( this.getItemLockIs() ) return;

			// ���ݒ胊�X�g���j���[
			var wMenuList = {};
			this.copyProperty( this._DEF_ITEM_PERSON_MENU_STAT, wMenuList );

			var wStatMenu = this.loadPublicMenu('listStat');
			if ( !wStatMenu ) {
				wStatMenu = new clsMenuList( { menuList: wMenuList } );
			}
			wStatMenu.setMenuList( { menuList: wMenuList } );

			// ���ݒ胊�X�g���j���[�Ƃ��ĕۑ�
			this._PersonMenuStat = wStatMenu;

			// �A�C�R���I���i���ʁA�󋵁j
			this._PersonMenuIcon = this.loadPublicMenu('icon');
			if ( !this._PersonMenuIcon ) {
				this._PersonMenuIcon = new clsMenuIcon();
			}

			// ���̑���񃁃j���[
			var wOtherMenu = this.loadPublicMenu( 'other' );
			if ( !wOtherMenu ) {
				this._PersonMenuOther = new clsMenuStatus( { 
												  statusList	: this._PersonStatus.other.contents
												, statusValue	: this._PersonStatus.other.values
												, callback		: this.eventOtherUpdate
				} );

			} else {
				this._PersonMenuOther = wOtherMenu;

			}

		} catch(e) {
			throw { name: 'clsItemPerson.initItemMenu', message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�\��
	clsItemPerson.prototype.execContextDsp = function( pEvent, pParam ) {
		try {

			// �p�������j���[�\������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execContextDsp.call( this, pEvent, pParam );

			}

		} catch(e) {
			throw { name: 'clsItemPerson.execContextDsp', message: e.message };
		}
	};

	// �l���p�R���e�L�X�g���j���[�I��������
	clsItemPerson.prototype.execContextSelect = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// ���ݒ胊�X�g���j���[�\��
			case 'status':
				wRetVal = this.dspMenuStatus( pEvent );
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
			throw { name: 'clsItemPerson.execContextSelect.' + e.name, message: e.message };
		}
	};


	// -------------------
	// ��{���֘A
	// -------------------

	// �X�e�[�^�X�����ݒ�
	clsItemPerson.prototype.initItemStatus = function( pArgument ) {
		try {
			// �p�����X�e�[�^�X�����ݒ菈��
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// �區�ڃ`�F�b�N
			var wKeyPerson = this.loadArgument('keyperson');
			if ( wKeyPerson == null ) wKeyPerson = false;

			// ���̑����ݒ�i�f�t�H���g�j
			this._PersonStatusOtherDef.contents = this.setStatusContents( this._DEF_ITEM_PERSON_STATUS_OTHER );
			this._PersonStatusOtherDef.values   = this.initStatusValues( this._PersonStatusOtherDef.contents );

			// Load��
			var wLoadStat = this.loadDataVal( 'person' );
			if ( wLoadStat ) {
				// �ŗL����Load�f�[�^�ݒ�
				this._PersonStatus = wLoadStat;

				// �\���X�V
				this.setPersonIcon();

			// �V�K��
			} else {
				var wIconDef = false;

				// �區��
				this._PersonStatus.keyperson = wKeyPerson;

				// �區�ڂ�style�ǉ�
				if ( wKeyPerson ) {
					this.setBoxStyle( this._DEF_ITEM_PERSON_MAIN_PROPERTY );
				}

				// �����l�`�F�b�N
				var wDefault = false;
				if ( 'default' in pArgument ) wDefault = true;

				// �����l�ݒ�
				var wGender		= 0;
				var wSituation	= 0;

				if ( wDefault ) {
					// ����
					if ( 'sex' in pArgument.default ) {
						wGender = pArgument.default.sex;
						wIconDef = true;
					}

					// ���
					if ( 'situation' in pArgument.default ) {
						wSituation = pArgument.default.situation;
						wIconDef = true;
					}

				}
				
				// ���ʁ^��Ԑݒ�
				var wGenderStat = this.getGenderItemByIndex( wGender, wKeyPerson );
				this.copyProperty( wGenderStat, this._PersonStatus.gender );

				// ��Ԑݒ�
				this.copyProperty( this._DEF_ITEM_PERSON_ICON_SITUATION[wSituation], this._PersonStatus.situation );

				// ���̑����ݒ�i�f�t�H���g�j
				this._PersonStatus.other.contents = {};
				this.copyProperty( this._PersonStatusOtherDef.contents, this._PersonStatus.other.contents );

				this._PersonStatus.other.values = {};
				this.copyProperty( this._PersonStatusOtherDef.values, this._PersonStatus.other.values );

				// ���ʁ^��ԏ����l�ݒ莞�@�\���X�V
				if ( wIconDef ) this.setPersonIcon();

			}

		} catch(e) {
			throw { name: 'clsItemPerson.initItemStatus.' + e.name, message: e.message };
		}
	};

	// �X�e�[�^�X�ݒ莞����
	clsItemPerson.prototype.execStatusMenu = function( pEvent, pStatVal ) {
		try {

			// �p�����X�e�[�^�X�ݒ莞����
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execStatusMenu.call( this, pEvent, pStatVal );

			}

			// �l���p�^�C�g���ݒ�
			// ��canvas�̓s����group�ɏ����������ڂ̃^�C�g���\�����o���Ȃ��ׁA�^�C�g���ݒ肵�Ȃ�
			//this.setPersonStatusTitle();

			// load���͈ȍ~�����Ȃ�
			var wLoad = false;
			if ( pEvent ) {
				if ( 'load' in pEvent ) wLoad = pEvent.load;
			}
			if ( wLoad ) return;

			// �֌W���ƘA�����Đ��ʕύX
			var wGenderKind = this.getGenderFromRelation( this.getStatusValues('title') );
			if ( wGenderKind ) {
				// ���ʕύX��
				var wNowKind = this.getGenderKind();
				if ( wGenderKind.kind != wNowKind ) {
					// ���ʂ�ύX
					this.copyProperty( wGenderKind, this._PersonStatus.gender );
					
					// ���ڂ�background��ύX
					this.setPersonIcon();
				}
			}

		} catch(e) {
			throw { name: 'clsItemPerson.execStatusMenu.' + e.name, message: e.message };
		}
	};

	// �X�e�[�^�X�l�X�V�ݒ�
	clsItemPerson.prototype.updStatusValue = function( pArgument ) {
		try {
			// �p�����X�e�[�^�X�X�V������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.updStatusValue.call( this, pArgument );

			}

			// �ݒ�l�擾
			var wKeyPerson	= false;
			var wGender		= 0;
			var wSituation	= 0;

			if ( pArgument ) {
				// �區�ڃ`�F�b�N
				if ( 'keyperson' in pArgument ) wKeyPerson = pArgument.keyperson;

				if ( 'default' in pArgument ) {
					var wDefault = pArgument.default;

					// ����
					if ( 'sex' in wDefault ) wGender = wDefault.sex;

					// ���
					if ( 'situation' in wDefault ) wSituation = wDefault.situation;
				}
			}

			// ���ʁ^��Ԑݒ�
			var wGenderStat = this.getGenderItemByIndex( wGender, wKeyPerson );
			this.copyProperty( wGenderStat, this._PersonStatus.gender );

			// �區�ڐݒ�
			this._PersonStatus.keyperson = wKeyPerson;

			// �區�ڂ�style�ǉ�
			if ( wKeyPerson ) {
				this.setBoxStyle( this._DEF_ITEM_PERSON_MAIN_PROPERTY );
			} else {
				this.setBoxStyle( { 'background-color' : '' } );
			}

			// ��Ԑݒ�
			this.copyProperty( this._DEF_ITEM_PERSON_ICON_SITUATION[wSituation], this._PersonStatus.situation );

			// ���ʁ^��ԁ@�\���X�V
			this.setPersonIcon();

			// ���̑����ݒ�i�f�t�H���g�j
			this._PersonStatus.other.values   = this.initStatusValues( this._PersonStatus.other.contents );

		} catch(e) {
			throw { name: 'clsItemPerson.updStatusValue.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD�֘A
	// -------------------

	// �f�[�^�ۑ��p�@���ڐݒ�l�擾
	clsItemPerson.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;

			// �ۑ������p�����[�^����
			var wParam = {
				  keyperson	: true
				, personal	: true
			};
			this.copyProperty( pSaveParam, wParam );

			// �區�ځ@���@�區�ڑΏۊO
			if ( (this._PersonStatus.keyperson) && (!wParam.keyperson) ) {
				// �w�i�F�ۑ����Ȃ�
				wParam['background-color'] = false;
			}

			// �p�������ڐݒ�l�擾����
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, wParam );

			} else {
				wSaveData = {};

			}

			// �l���p�ǉ���{���
			var wPersonStatus = {};
			this.copyProperty( this._PersonStatus, wPersonStatus );

			// �區�ڃt���O�ΏۊO
			if ( !wParam.keyperson ) {
				// �區��
				if ( wPersonStatus.keyperson ) {
					// �ʏ퍀�ڂ֕ύX
					wPersonStatus.keyperson = false;
					
					var wGenderIdx = this.getGenderIndex();
					this.copyProperty( this._DEF_ITEM_PERSON_ICON_GENDER[wGenderIdx], wPersonStatus.gender );
				}

			}

			// ���̑����i��{���j�ΏۊO
			if ( !wParam.personal ) {
				// �����l
				wPersonStatus.other.contents = {};
				this.copyProperty( this._PersonStatusOtherDef.contents, wPersonStatus.other.contents );

				wPersonStatus.other.values = {};
				this.copyProperty( this._PersonStatusOtherDef.values, wPersonStatus.other.values );

			}
			wSaveData.person = JSON.stringify( wPersonStatus );

			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemPerson.saveData.' + e.name, message: e.message };
		}
	};

	// �f�[�^�Ǎ�
	clsItemPerson.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// �p�����f�[�^�Ǎ�����
			if ( this._BasePrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// �l���ŗL�ݒ�
			if ( pLoadData.person ) {
				wLoadBuff.person = JSON.parse( pLoadData.person );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemPerson.loadData', message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsItemPerson.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_ITEM_PERSON_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁuitem-person�v
				wInitArgument.kind = this._DEF_ITEM_PERSON_KIND;

			}

			// �ǉ����j���[�ݒ�
			wInitArgument.menuList		= this._DEF_ITEM_PERSON_MENU;

			// �ǉ��X�e�[�^�X�ݒ�
			wInitArgument.statusList	= this._DEF_ITEM_PERSON_STATUS_BASE;
			var wUpdProperty = {
					title		: {
						 title	: '�֌W��'
						,list	: this._DEF_ITEM_PERSON_LIST_RELATION
					}
			};
			wInitArgument.statusProperty = wUpdProperty;

			// �ǉ��A����ݒ�
			wInitArgument.contactList = this._DEF_ITEM_PERSON_CONTACT;

			// �p�����R���X�g���N�^
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsItemPerson.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsItemPerson.prototype.freeClass = function() {
		try {
			// �v���p�e�B�J��
			this._PersonMenuStat			= null;
			this._PersonMenuIcon			= null;
			this._PersonMenuOther			= null;

			this._PersonStatusOtherDef.contents	= null;
			this._PersonStatusOtherDef.values	= null;
			this._PersonStatusOtherDef			= null;

			this._PersonStatus				= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
