// --------------------------------------------------------------------
//
// ���X�g���j���[�\���N���X
//
// --------------------------------------------------------------------
// clsMenuIcon �� clsMenuBase �� clsBaseBox
// --------------------------------------------------------------------
var clsMenuIcon = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_ICON_KIND		= 'menu-icon';

		this._DEF_MENU_ICON_PROPERTY	= {
			 'z-index'				: '260'
		};

		// �p�����N���X��prototype
		this._MenuPrototype				= null;

		this._IconList					= [];
		this._IconContents				= {};
		this._IcomElement				= [];

		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// ���j���[�N���b�N
		this.eventIconClick = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// click�������j���[���擾
				var wSelectIcon = self.getClickIcon( this );
				if ( !wSelectIcon ) return false;

				// ����
				self.hideMenu();
				
				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, wSelectIcon );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// **************************************************************
		// �R���X�g���N�^
		// **************************************************************
		// �e�N���X��prototype��ۑ�
		this._MenuPrototype = clsMenuBase.prototype;

		// �e�N���X��constructor
		// ���p�������uinitClass�v��call�����
		clsMenuBase.call( this, pArgument );

	} catch(e) {
		throw { name: 'clsMenuIcon.' + e.name, message: e.message };
	}
};

// ��{���j���[ prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsMenuIcon, clsMenuBase );


	// **************************************************************
	// �v���p�e�B�ݒ�
	// **************************************************************

	// ���j���[���X�g�ݒ�
	clsMenuIcon.prototype.setIconList = function( pArgIcon ) {
		try {
			// �z��Ŏw��
			if ( this.isArray(pArgIcon) ) {
				// ���e�𕡎�
				var wFind;
				for( var wIdx = 0; wIdx < pArgIcon.length; wIdx++ ) {
					wFind = false;
					for( var wChkIdx = 0; wChkIdx < this._IconList.length; wChkIdx++ ) {
						if ( pArgIcon[wIdx].kind == this._IconList[wChkIdx].kind ) {
							wFind = true;
							break;
						}
					}
					if ( !wFind ) this._IconList.push( pArgIcon[wIdx] );

				}

			}
			return true;

		} catch(e) {
			throw { name: 'setIconList', message: e.message };
		}
	};

	// �o�^�σ��j���[�`�F�b�N
	clsMenuIcon.prototype.chkIconContents = function( pMenu ) {
		try {
			if ( !this._IconContents ) return false;

			var wFind = false;
			for( var wKey in this._IconContents ) {
				if ( this._IconContents[wKey].kind == pMenu.kind ) {
					wFind = true;
					break;
				}
			}
			
			return wFind;

		} catch(e) {
			throw { name: 'chkIconContents', message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�I��
	// **************************************************************

	// �I�����j���[���e�擾
	clsMenuIcon.prototype.getClickIcon = function( pMenuEle ) {
		try {
			// id���烁�j���[key�擾
			var wId = pMenuEle.id
			if ( !wId ) return null;

			// ���j���[���e�擾
			var wContents = null;
			if ( wId in this._IconContents ) {
				wContents = this._IconContents[wId];
			}
			return wContents;

		} catch(e) {
			throw { name: 'getClickIcon', message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�ݒ�
	// **************************************************************

	// ���j���[�v�f����
	clsMenuIcon.prototype.setIconContents = function( pMenu ) {
		try {
			if ( !pMenu ) return false;

			// �����ς͏����Ȃ�
			if ( this.chkIconContents(pMenu) ) return true;
			
			var wIndex = this._IcomElement.length;

			var wMenuId  = this.getBoxId() + '_icon_' + String(wIndex);
			var wDivEle = this.addElement( 'div', wMenuId );
			if ( !wDivEle ) return false;

			if ( typeof pMenu.title !== 'undefined' ) wDivEle.title = pMenu.title;
			this.addClass( wDivEle, 'cssMenuIcon-img' );

			// �摜�ݒ�
			wDivEle.style.backgroundImage = "url(" + this.getImagePath()+ pMenu.image + ")";
			wDivEle.innerHTML = "<span class='cssMenuIcon-title'>" + pMenu.title + "</span>";

			// ���j���[�֒ǉ�
			this.appendBoxToParent( wDivEle );

			// click�C�x���g�ݒ�
			this.addEvent( wDivEle, 'onclick', this.eventIconClick );

			// ���ۑ�
			this._IconContents[wMenuId] = { index: wIndex, kind: pMenu.kind, image: pMenu.image };
			this._IcomElement.push( wDivEle );

			return true;

		} catch(e) {
			throw { name: 'setIconContents.' + e.name, message: e.message };
		}
	};

	// ���j���[�փN���X�ݒ�i�����j
	clsMenuIcon.prototype.setIconClass = function( pMenuId, pClass, pDelete ) {
		try {
			if ( !this._IcomElement ) return;
			if ( this._IcomElement.length == 0 ) return;

			for( var wIdx = 0; wIdx < this._IcomElement.length; wIdx++ ) {
				if ( this._IcomElement[wIdx].id == pMenuId ) {
					if ( pDelete ) {
						this.delClass( this._IcomElement[wIdx], pClass );
					} else {
						this.addClass( this._IcomElement[wIdx], pClass );
					}
					break;
				}
			}

		} catch(e) {
			throw { name: 'setIconClass.' + e.name, message: e.message };
		}
	};

	// �w�胁�j���[�̂ݕ\��
	clsMenuIcon.prototype.setIconUsed = function( pMenuList ) {
		try {
			if ( !this._IconContents ) return;

			var wIcon;
			var wFind;
			var wDisplay;

			for( var wIconIdx = 0; wIconIdx < this._IcomElement.length; wIconIdx++ ) {
				wIcon = this._IconContents[this._IcomElement[wIconIdx].id];
				if ( !wIcon ) continue;

				wFind = false;
				for( var wIdx = 0; wIdx < pMenuList.length; wIdx++ ){
					if ( wIcon.kind == pMenuList[wIdx].kind ) {
						wFind = true;
						break;
					}
				}

				if ( wFind ) {
					wDisplay = 'block';
				} else {
					wDisplay = 'none';
				}
				
				this.setStyle( this._IcomElement[wIconIdx], { 'display': wDisplay } );
			}
			
			// ���j���[�T�C�Y�Đݒ�
			this.saveMenuSize();

		} catch(e) {
			throw { name: 'setIconUsed.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�ύX
	// **************************************************************

	// �A�C�R���I����Ԃ�ݒ�
	clsMenuIcon.prototype.setSelectedIcon = function( pSelected, pSelKind ) {
		try {
			if ( !this._IconContents ) return;

			var wDelete = !pSelected;

			for( var wId in this._IconContents ) {
				// ��ʖ��ݒ莞�͑S��
				if ( typeof pSelKind == 'undefined' ) {
					this.setIconClass( wId, 'cssMenuIcon-selected', wDelete );

				// ��ʎw�莞
				} else if ( this._IconContents[wId].kind == pSelKind ) {
					this.setIconClass( wId, 'cssMenuIcon-selected', wDelete );
					break;

				}
			}

		} catch(e) {
			throw { name: 'setSelectedIcon.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[��\������
	clsMenuIcon.prototype.dspMenu = function( pParam ) {
		try {
			// �I������
			this.setSelectedIcon( false );

			if ( pParam ) {
				// �ǉ����j���[�ݒ�
				if ( typeof pParam.iconList !== 'undefined' ) {
					this.setIconList( pParam.iconList );

					// html�ݒ�
					for( var i = 0; i < pParam.iconList.length; i++ ) {
						this.setIconContents( pParam.iconList[i] );
					}
					
					// �w�胁�j���[�̂ݗL��
					this.setIconUsed( pParam.iconList );
				}

				// �I�𒆃��j���[�ݒ�
				if ( typeof pParam.icon !== 'undefined' ) {
					// ���j���[�I��
					this.setSelectedIcon( true, pParam.icon.kind );
				}
			}

			// �p�������j���[�\��
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}

		} catch(e) {
			throw { name: 'clsMenuIcon.dspMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[�v�f�������ݒ�
	clsMenuIcon.prototype.createMenu = function() {
		try {
			if ( !this._IconList ) return false;
			if ( !this._IconList.length ) return false;

			// html�ݒ�
			for( var i = 0; i < this._IconList.length; i++ ) {
				this.setIconContents( this._IconList[i] );
			}

			// �p���������ݒ�
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuIcon.createMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsMenuIcon.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_ICON_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu-icon�v
				wInitArgument.kind = this._DEF_MENU_ICON_KIND;
			}

			// ���j���[���e�ݒ�
			if ( pArgument ) {
				// �ǉ����j���[�ݒ�
				if ( typeof pArgument.iconList !== 'undefined' ) {
					this.setIconList( pArgument.iconList );
				}
			}

			// �p�����R���X�g���N�^
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssMenuIcon-base' );

		} catch(e) {
			throw { name: 'clsMenuIcon.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsMenuIcon.prototype.freeClass = function() {
		try {
			// �v���p�e�B�J��
			var wIcon;
			for( var wIdx = 0; wIdx < this._IcomElement.length; wIdx++ ) {
				wIcon = this._IcomElement[wIdx];
				if ( !wIcon ) continue;

				this.execFunction( this.delEvent, wIcon, 'onclick', this.eventIconClick );
				this._IcomElement[wIdx] = null;
			}

			this._IconList					= null;
			this._IconContents				= null;
			this._IcomElement				= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
