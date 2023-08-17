// --------------------------------------------------------------------
//
// ���X�g���j���[�\���N���X
//
// --------------------------------------------------------------------
// clsMenuList �� clsMenuBase �� clsBaseBox
// --------------------------------------------------------------------
var clsMenuList = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_LIST_KIND		= 'menu-list';

		this._DEF_MENU_LIST_PROPERTY	= {
			 'z-index'				: '3000'
		};

		// ���j���[��style
		this._DEF_MENU_LIST_LIST_PROPERTY = {
			 'z-index'				: '3010'
		};

		// �ݒ�l
		this._DEF_MENU_LIST_MIN_WIDTH	= 125;
		this._DEF_MENU_LIST_FONT_WIDTH	= 24;

		// �p�����N���X��prototype
		this._MenuPrototype				= null;

		this._MenuList					= [];
		this._MenuContents				= {};
		this._MenuElement				= [];
		this._MenuCreated				= false;

		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// ���j���[�N���b�N
		this.eventMenuClick = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// click�������j���[���擾
				var wSelectMenu = self.getClickMenu( this );
				if ( !wSelectMenu ) return false;

				// �������j���[�͏������Ȃ�
				if ( wSelectMenu.disabled ) return false;

				// ����
				self.hideMenu();
				
				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, wSelectMenu );

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
		throw { name: 'clsMenuList.' + e.name, message: e.message };
	}
};

// ��{���j���[ prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsMenuList, clsMenuBase );


	// **************************************************************
	// �v���p�e�B�ݒ�
	// **************************************************************

	// ���j���[���X�g�ݒ�
	clsMenuList.prototype.initMenuList = function( pArgument ) {
		try {
			if ( !pArgument ) return;

			var wArgMenu = pArgument.menuList;
			if ( !wArgMenu ) return;

			// �z��Ŏw��
			if ( this.isArray(wArgMenu) ) {
				// ���e�𕡎�
				for( var wIdx = 0; wIdx < wArgMenu.length; wIdx++ ) {
					this._MenuList.push( wArgMenu[wIdx] );

				}

			// object�w��
			} else if ( this.isObject(wArgMenu) ) {
				// Key���Ƀ\�[�g
				var wSortMenu = this.sortNumObject( wArgMenu );
				// �z��ɂ��Đݒ�
				var wFirst = true;
				for( var wKey in wSortMenu ) {
					if ( wFirst ) {
						wFirst = false;
					} else {
						this._MenuList.push( { kind: 'blank', title: '�|' } ); 
					}

					if ( this.isArray(wSortMenu[wKey]) ) {
						this._MenuList = this._MenuList.concat( wSortMenu[wKey] );

					} else if( this.isObject(wSortMenu[wKey]) ) {
						this._MenuList.push( wSortMenu[wKey] );

					}
				}

			}


			return true;

		} catch(e) {
			throw { name: 'initMenuList.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�I��
	// **************************************************************

	// �I�����j���[���e�擾
	clsMenuList.prototype.getClickMenu = function( pMenuEle ) {
		try {
			// click�ʒu�̗v�f�擾
			if ( !pMenuEle ) return null;

			// id���烁�j���[key�擾
			var wId = pMenuEle.id
			if ( !wId ) return null;
			wId = wId.replace( '_link', '' );

			// ���j���[���e�擾
			var wContents = this._MenuContents[wId];
			if ( !wContents ) return null;
			
			return wContents;

		} catch(e) {
			throw { name: 'getClickMenu', message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�ݒ�
	// **************************************************************

	// ���j���[��؂�v�f����
	clsMenuList.prototype.setMenuBlank = function( pIdx ) {
		try {
			var wBeseEle = this.getBoxElement();
			if ( !wBeseEle ) return false;

			var wBlankTag = '';
			wBlankTag += "<div class='cssMenuList-blank'></div>";

			wBeseEle.innerHTML += wBlankTag;

		} catch(e) {
			throw { name: 'setMenuBlank', message: e.message };
		}
	};

	// ���j���[�v�f����
	clsMenuList.prototype.setMenuContents = function( pIdx, pMenu, pProperty ) {
		try {
			var wBeseEle = this.getBoxElement();
			if ( !wBeseEle ) return false;

			var wId = this.getBoxId();

			// �x�[�X�v�f�ǉ�
			var wDivId  = wId + '_menu_' + String(pIdx);
			var wDivEle = this.addElement( 'div', wDivId );
			if ( !wDivEle ) return false;

			this.addClass( wDivEle, 'cssMenuList-button' );
			this.setStyle( wDivEle, pProperty );

			this.appendBoxToParent( wDivEle );

			// ���e�ǉ�
			var wLinkId  = wDivId + '_link';
			var wLinTag = this.addElement( 'a', wLinkId );
			if ( !wLinTag ) {
				this.delElement( wDivEle );
				return false;
			}
			wLinTag.href = "#";

			var wMenuTag = "<span id='" + wDivId + '_span' + "' style='padding-left: 10px;'>" + pMenu.title + "</span>";

			wLinTag.innerHTML += wMenuTag;

			// ���j���[�֒ǉ�
			this.appendElementToParent( wDivEle, wLinTag )

			// ���j���[���ۑ�
			this._MenuContents[wDivId] = { index: pIdx, title: pMenu.title, kind: pMenu.kind };
			this._MenuElement.push( wDivEle );

		} catch(e) {
			throw { name: 'setMenuContents.' + e.name, message: e.message };
		}
	};

	// ���j���[���X�g�ő剡���擾
	clsMenuList.prototype.getMaxMenuWidth = function() {
		try {
			if ( !this._MenuList ) return 0;
			if ( !this._MenuList.length ) return 0;

			var wWidth	= 0;
			var wTemp	= 0;
			var wTitle	= '';

			for( var i = 0; i < this._MenuList.length; i++ ) {
				if ( this._MenuList[i].kind !== 'blank' ) {
					wTitle = this._MenuList[i].title;
					wTemp = (String(wTitle).length * this._DEF_MENU_FONT_WIDTH);
					if ( wTemp > wWidth ) wWidth = wTemp;
				}
			}

			return wWidth;

		} catch(e) {
			throw { name: 'getMaxMenuWidth', message: e.message };
		}
	};

	// ���j���[�v�f�֑I�����C�x���g�ݒ�
	clsMenuList.prototype.setMenuContentsEvent = function( pKey ) {
		try {
			// link��click�C�x���g�ݒ�
			var wLinkEle = this.getElement(pKey + '_link');
			if ( !wLinkEle ) return;

			this.addEvent( wLinkEle, 'onclick', this.eventMenuClick );
			
		} catch(e) {
			throw { name: 'setMenuContentsEvent.' + e.name, message: e.message };
		}
	};

	// ���j���[�v�f�������ݒ�
	clsMenuList.prototype.createMenuContents = function() {
		try {
			if ( !this._MenuList ) return false;
			if ( !this._MenuList.length ) return false;

			var wProperty = this._DEF_MENU_LIST_LIST_PROPERTY;
			var wBgColor = this.getBoxProperty('background-color');
			if ( wBgColor ) {
				wProperty['background-color'] = wBgColor;
			}

			// html�ݒ�
			for( var i = 0; i < this._MenuList.length; i++ ) {
				if ( this._MenuList[i].kind === 'blank' ) {
					this.setMenuBlank(i);
				} else {
					this.setMenuContents( i, this._MenuList[i], wProperty );
				}
			}

			// �����Nclick�C�x���g�ݒ�
			for ( var wKey in this._MenuContents ) {
				this.setMenuContentsEvent( wKey );
			}

			// ��������
			var wWidth    = this.getMaxMenuWidth();
			if ( wWidth < this._DEF_MENU_LIST_MIN_WIDTH ) wWidth = this._DEF_MENU_LIST_MIN_WIDTH;
			this.setBoxStyle( { width: (wWidth + 'px') } );

			// ���e�ݒ��
			this._MenuCreated = true;

		} catch(e) {
			throw { name: 'createMenuContents.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�ύX
	// **************************************************************

	// ���j���[�̎g�p��Ԃ�ύX
	clsMenuList.prototype.disabledMenu = function( pKind, pDisabled ) {
		try {
			if ( !this._MenuContents ) return;

			var wTargetKey = '';
			for ( var key in this._MenuContents ) {
				if ( this._MenuContents[key].kind == pKind ) {
					wTargetKey = key;
					break;
				}
			}
			if ( !wTargetKey ) return;
			
			// �Ώۃ��j���[�̏�Ԃ�ύX
			var wMenuEle = this.getElement(wTargetKey + '_span');
			if ( wMenuEle ) {
				if ( pDisabled ) {
					this.setStyle( wMenuEle, { 'color': '#999999' } );
				} else {
					this.setStyle( wMenuEle, { 'color': '#000000' } );
				}
				this._MenuContents[wTargetKey].disabled = pDisabled;
			}

		} catch(e) {
			throw { name: 'disabledMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[�̕\����Ԃ�ύX
	clsMenuList.prototype.visibledMenu = function( pVisible, pKind ) {
		try {
			if ( !this._MenuContents ) return;

			// �Ώېݒ�
			var wChkKd = '';
			if ( typeof pKind == 'string' ) wChkKd = pKind;

			var wTarget;
			for ( var wKey in this._MenuContents ) {
				if ( wChkKd.length == 0 ) {
					wTarget = true;
				} else if ( wChkKd == this._MenuContents[wKey].kind ) {
					wTarget = true;
				} else {
					wTarget = false;
				}
				
				if ( wTarget ) {
					// �Ώۃ��j���[�̏�Ԃ�ύX
					var wMenuEle = this.getElement(wKey);
					if ( wMenuEle ) {
						if ( pVisible ) {
							this.setStyle( wMenuEle, { 'display': 'block' } );
						} else {
							this.setStyle( wMenuEle, { 'display': 'none' } );
						}
					}

					// �Ώێw�莞�͑Ώۂ̂�
					if ( wChkKd.length > 0 ) break;
				}
			}

		} catch(e) {
			throw { name: 'visibledMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[�i��؂�j�̕\����Ԃ�ύX
	clsMenuList.prototype.visibledBlank = function( pVisible, pIdx ) {
		try {
			if ( !this._MenuContents ) return;

			// �Ώۃ��j���[�̏�Ԃ�ύX
			var wBlankEle = this.getBoxElementByClass('cssMenuList-blank');
			if ( wBlankEle ) {
				var wTarget = true;
				for( var wIndex = 0; wIndex < wBlankEle.length; wIndex++ ) {
					if ( typeof pIdx != 'undefined' ) {
						if( String(pIdx) == String(wIndex+1) ) {
							wTarget = true;
						} else {
							wTarget = false;
						}
					}

					if ( wTarget ) {
						if ( pVisible ) {
							this.setStyle( wBlankEle[wIndex], { 'display': 'block' } );
						} else {
							this.setStyle( wBlankEle[wIndex], { 'display': 'none' } );
						}
					}
				}
			}

		} catch(e) {
			throw { name: 'visibledBlank.' + e.name, message: e.message };
		}
	};

	// ���j���[�̓��e��ݒ肷��
	clsMenuList.prototype.setMenuList = function( pParam ) {
		try {
			// ���e�ݒ�ς͏����s��
			if ( this._MenuCreated ) return;

			// ���j���[���ݒ莞
			if ( this._MenuList.length == 0 ) {
				// �p�����[�^���烁�j���[���X�g�ݒ�
				this.initMenuList( pParam );

			}

			// ���e����
			if ( this._MenuList.length > 0 ) {
				// ���j���[�����ݒ�
				this.createMenu();

			}

		} catch(e) {
			throw { name: 'setMenuList.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[�v�f�������ݒ�
	clsMenuList.prototype.createMenu = function() {
		try {
			// ���j���[���e����
			this.createMenuContents();

			// �p���������ݒ�
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuList.createMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[��\������
	clsMenuList.prototype.dspMenu = function( pParam ) {
		try {
			if ( pParam ) {
				// ���j���[�Đݒ�
				this.setMenuList( pParam );
				
				// ��U�S���j���[�\��
				this.visibledMenu( true );
				this.visibledBlank( true );

				// ��\�����j���[�ݒ�
				if ( pParam.hide ) {
					if ( this.isArray(pParam.hide) ) {
						for( var wIdx = 0; wIdx < pParam.hide.length; wIdx++ ) {
							this.visibledMenu( false, pParam.hide[wIdx] );
						}
					
					} else {
						this.visibledMenu( false, pParam.hide );

					}
				}

				if ( pParam.blank ) {
					if ( this.isArray(pParam.blank) ) {
						for( var wIdx = 0; wIdx < pParam.blank.length; wIdx++ ) {
							this.visibledBlank( false, pParam.blank[wIdx] );
						}
					
					} else {
						this.visibledBlank( false, pParam.blank );

					}
				}
			}
			
			// ���j���[���ݒ莞�͕\�����Ȃ�
			if ( this._MenuList.length == 0 ) return false;

			// �T�C�Y�Đݒ�
			this.saveMenuSize();

			// �p�������j���[�\��
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}

		} catch(e) {
			throw { name: 'clsMenuList.dspMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsMenuList.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_LIST_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu-list�v
				wInitArgument.kind = this._DEF_MENU_LIST_KIND;
			}

			// ���j���[���e�ݒ�
			this.initMenuList( pArgument );

			// �p�����R���X�g���N�^
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsMenuList.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsMenuList.prototype.freeClass = function() {
		try {
			// �v���p�e�B�J��
			var wMenu;
			var wMenuLink;
			for( var wIdx = 0; wIdx < this._MenuElement.length; wIdx++ ) {
				wMenu = this._MenuElement[wIdx];
				if ( !wMenu ) continue;

				wMenuLink = this.getElement(wMenu.id + '_link');
				if ( wMenuLink ) {
					this.execFunction( this.delEvent, wMenuLink, 'onclick', this.eventMenuClick );
				}
				this._MenuElement[wIdx] = null;
			}

			this._MenuList					= null;
			this._MenuContents				= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
