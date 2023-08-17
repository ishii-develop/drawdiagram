// --------------------------------------------------------------------
//
// �T�C�h�p�l���N���X
//
// --------------------------------------------------------------------
// clsPanelSide �� clsBaseBox
// --------------------------------------------------------------------
var clsPanelSide = function( pArgument ) {
	try {
		var self = this;

		this._DEF_PANEL_SIDE_KIND			= 'menu';

		this._DEF_PANEL_SIDE_PROPERTY		= {
			 'z-index'				: '40'
		};

		// �\����ʐݒ�
		this._DEF_PANEL_SIDE_SELECT			= [
				  { value: 'select',	text: '�I�����ڂ̂�'	}
				, { value: 'person',	text: '�l���̂�'		}
				, { value: 'group',		text: '�O���[�v�̂�'	}
		];

		// �p�����N���X��prototype
		this._BasePrototype					= null;

		// ���ړ����pCallback
		this._PanelSidesLinkCallback		= [];

		// �T�C�h�p�l�����e
		this._PanelSideEleFrame				= null;

		// �T�C�h�p�l�����j���[�L��
		this._PanelSideMenuIs				= false;

		// �ҏW���j���[
		this._PanelSideEleMenu				= null;
		this._PanelSideEleMenuList			= [];

		// �ҏW���j���[���
		this._PanelSideEditMode				= '';

		// �X�e�[�^�X�\���G���A
		this._PanelSideStatus				= null;
		this._PanelSideStatusId				= '';

		// �\����ʃR���{�{�b�N�X
		this._PanelSideSelectKind			= { 
			  element	: null
			, id		: ''
			, select	: -1
			, open		: false
			, selected	: false
		};

		// ��������
		this._PanelSideContents				= {
			  person		: null
			, group			: null
			, comment		: null
			, relation		: null
		};

		// �T�C�h�p�l����̍���
		this._PanelSideContentsEle			= {};

		// ��ʃ��b�N���
		this._PanelSideLocked				= false;

		// ��ʑ����
		this._PanelSideValid				= true;

		// ���ڑ����
		this._PanelSideValidItem			= true;


		// **************************************************************
		// �C�x���g�����@�ҏW���j���[
		// **************************************************************

		// ���j���[��ʂ̃��j���[�@�I��������
		this.eventMainMenuSelect = function( pEvent ) {
			try {
				// ���b�N���͏����Ȃ�
				if ( self._PanelSideLocked ) return false;

				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// id���烁�j���[key�擾
				var wId = this.id
				if ( !wId ) return false;

				wId = wId.replace( self.getBoxId() + '_menu_', '' );
				wId = wId.replace( '_link', '' );

				// �������C�x���g����
				self.eventClear();

				// ���j���[�I�����������s
				var wRetVal = self.execMainMenu( pEvent, wId );

				return wRetVal;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// �C�x���g�����@�����I�u�W�F�N�g���쎞
		// **************************************************************

		// �R���e�L�X�g���j���[
		this.eventSideStatusMenu = function( pEvent ) {
			try {
				// ���b�N���͏����Ȃ�
				if ( self._PanelSideLocked ) return false;

				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ����L�����̂ݏ���
				if ( !self._PanelSideValid ) return false;
				if ( !self._PanelSideValidItem ) return false;

				// �Ώۍ��ڎ擾
				var wId = this.id;
				if ( !wId ) return false;

				var wClickItm = self.getClickItem( wId );
				if ( !wClickItm ) return false;

				// �������C�x���g����
				self.eventClear();

				// �R���e�L�X�g���j���[�\��
				self.execSideStatusContext( pEvent, wClickItm );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���ڑI���C�x���g
		this.eventSideStatusItemClick = function( pEvent ) {
			try {
				// ���b�N���͏����Ȃ�
				if ( self._PanelSideLocked ) return false;

				// ����L�����̂ݏ���
				if ( !self._PanelSideValid ) return false;
				if ( !self._PanelSideValidItem ) return false;

				// ��ʑI�𒆂͏����Ȃ�
				if ( self._PanelSideSelectKind.open ) return false;
				// ��ʑI���I��
				self._PanelSideSelectKind.selected = false;

				// �I�����ڂ̂ݕ\�����͏����Ȃ�
				if ( self._PanelSideSelectKind.select == 'select' ) return false;

				// ���N���b�N�̂ݗL��
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				// �N���b�N�ʒu���ڃ`�F�b�N
				var wClickItm = self.chkItemOverlapToClick( pEvent );
				if ( !wClickItm ) return false;

				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �������C�x���g����
				self.eventClear();

				// ���C���R���e���c�֍��ڑI��ʒm
				self.execLinkCallback( { kind: 'select' }, wClickItm );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// �C�x���g�����@���I�u�W�F�N�g���쎞
		// **************************************************************

		// �\�����Open���C�x���g
		this.eventSelectOpen = function( pEvent ) {
			try {
				if ( self._PanelSideSelectKind.open )     return false;
				if ( self._PanelSideSelectKind.selected ) return false;

				// �C�x���g��~
				self.cancelEvent( pEvent, true );
				
				// �������C�x���g����
				self.eventClear();

				// ��ʑI��
				self._PanelSideSelectKind.open     = true;
				self._PanelSideSelectKind.selected = false;

				return true;

			} catch(e) {
				self.catchErrorDsp(e);

			}
			return false;
		};

		// �\�����Close���C�x���g
		this.eventSelectClose = function( pEvent ) {
			try {
				// ��ʑI������
				self._PanelSideSelectKind.open     = false;
				self._PanelSideSelectKind.selected = false;

			} catch(e) {
				self.catchErrorDsp(e);

			}
			return false;
		};

		// �\����ʑI�����C�x���g
		// �� eventSelectOpen��Ɏ�ʂ�I������Ɣ���
		this.eventSelectKind = function( pEvent ) {
			try {
				if ( !self._PanelSideSelectKind.element ) return false;

				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				var wCmbEle = self._PanelSideSelectKind.element;
				var wSelected = wCmbEle.options[wCmbEle.selectedIndex];
				if ( !wSelected ) return false;

				// �\����ʑI������
				self.chgSelectKind( wSelected.value );

				// ��ʑI���I��
				self._PanelSideSelectKind.open     = false;
				self._PanelSideSelectKind.selected = true;

				return true;

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
		throw { name: 'clsPanelSide.' + e.name, message: e.message };
	}
};

// �T�C�h�p�l�� prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsPanelSide, clsBaseBox );

	// **************************************************************
	// �v���p�e�B�ݒ�
	// **************************************************************

	// �����ݒ� - ����
	clsPanelSide.prototype.setLinkItem = function( pLinkItems ) {
		try {
			if ( !pLinkItems ) return false;

			this._PanelSideContents.person = pLinkItems;

			return true;

		} catch(e) {
			throw { name: 'setLinkItem', message: e.message };

		}
	};

	// �����ݒ� - �O���[�v
	clsPanelSide.prototype.setLinkGroup = function( pLinkGroups ) {
		try {
			if ( !pLinkGroups ) return false;

			this._PanelSideContents.group = pLinkGroups;

			return true;

		} catch(e) {
			throw { name: 'setLinkGroup', message: e.message };

		}
	};

	// �����ݒ� - �֘A�t�����p�_
	clsPanelSide.prototype.setLinkRelation = function( pLinkRelations ) {
		try {
			if ( !pLinkRelations ) return false;

			this._PanelSideContents.relation = pLinkRelations;

			return true;

		} catch(e) {
			throw { name: 'setLinkRelation', message: e.message };

		}
	};

	// ���ړ���
	clsPanelSide.prototype.setLinkContents = function( pLinkContents ) {
		try {
			if ( !pLinkContents ) return false;

			// ���ځi�l���j
			if ( pLinkContents.person ) {
				this.setLinkItem( pLinkContents.person );
			}

			// �O���[�v
			if ( pLinkContents.group ) {
				this.setLinkGroup( pLinkContents.group );
			}

			// �֘A�t�����p�_
			if ( pLinkContents.relation ) {
				this.setLinkRelation( pLinkContents.relation );
			}

			return true;

		} catch(e) {
			throw { name: 'setLinkContents', message: e.message };

		}
	};

	// ���ړ���
	clsPanelSide.prototype.getLinkContents = function( pItemId ) {
		try {
			// ���ځi�l���j
			if ( this._PanelSideContents.person ) {
				if ( pItemId in this._PanelSideContents.person ) {
					return this._PanelSideContents.person[pItemId];
				}
			}

			// �O���[�v
			if ( this._PanelSideContents.group ) {
				if ( pItemId in this._PanelSideContents.group ) {
					return this._PanelSideContents.group[pItemId];
				}
			}

			// �֘A�t�����p�_
			if ( this._PanelSideContents.relation ) {
				if ( pItemId in this._PanelSideContents.relation ) {
					return this._PanelSideContents.relation[pItemId];
				}
			}

			// �R�����g
			if ( this._PanelSideContents.comment ) {
				if ( pItemId in this._PanelSideContents.comment ) {
					return this._PanelSideContents.comment[pItemId];
				}
			}

			return null;

		} catch(e) {
			throw { name: 'getLinkContents', message: e.message };

		}
	};

	// ��ʂ̑���ېݒ�
	clsPanelSide.prototype.setControlValid = function( pValid ) {
		try {
			// ����ېݒ�
			this._PanelSideValid = pValid;

			// �\����ʑ���
			if ( this._PanelSideSelectKind.element ) {
				this._PanelSideSelectKind.element.disabled = !pValid;
			}

		} catch(e) {
			throw { name: 'setControlValid.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �@���擾
	// **************************************************************

	// �����ʂ̑Ώ۔͈̓`�F�b�N
	clsPanelSide.prototype.isAllTarget = function( pKind ) {
		try {
			var wTargetAll = false;

			switch(pKind) {
			// ������
			case 'init':
				wTargetAll = true;
				break;
			
			// �ĕ\��
			case 'reset':
				wTargetAll = true;
				break;

			// �ҏW���[�h�ύX
			case 'edit':
				wTargetAll = true;
				break;

			}
			return wTargetAll;

		} catch(e) {
			throw { name: 'isAllTarget.' + e.name, message: e.message };
		}
	};

	// �\���Ώێ擾�@����
	clsPanelSide.prototype.getSideStatusDspItems = function( ) {
		try {
			if ( !this._PanelSideContents.person ) return null;
			
			var wDspItems = {};
			// �d�v�x���ɐݒ�
			for( var wKey in this._PanelSideContents.person ) {
				wDspItems[wKey] = this._PanelSideContents.person[wKey];

			}

			return wDspItems;

		} catch(e) {
			throw { name: 'getSideStatusDspItems', message: e.message };

		}
	};

	// �\���Ώێ擾�@�O���[�v
	clsPanelSide.prototype.getSideStatusDspGroups = function( ) {
		try {
			if ( !this._PanelSideContents.group ) return null;
			
			var wDspGroups = {};

			// �d�v�x���ɐݒ�
			for( var wKey in this._PanelSideContents.group ) {
				wDspGroups[wKey] = this._PanelSideContents.group[wKey];

			}

			return wDspGroups;

		} catch(e) {
			throw { name: 'getSideStatusDspGroups', message: e.message };

		}
	};

	// �\���Ώێ擾�@�֘A�t�����p�_
	clsPanelSide.prototype.getSideStatusDspRelation = function( ) {
		try {
			if ( !this._PanelSideContents.relation ) return null;
			
			var wDspRelation = {};

			// �d�v�x���ɐݒ�
			for( var wKey in this._PanelSideContents.relation ) {
				wDspRelation[wKey] = this._PanelSideContents.relation[wKey];

			}

			return wDspRelation;

		} catch(e) {
			throw { name: 'getSideStatusDspRelation', message: e.message };

		}
	};

	// �\���Ώێ擾�@�I������
	clsPanelSide.prototype.getSideStatusDspSelect = function( ) {
		try {
			var wSelectMain	= {};
			var wSelectRel	= {};

			// ���ڎ擾
			var wDspItems = this.getSideStatusDspItems();
			var wDspGroup = this.getSideStatusDspGroups();

			if ( (!wDspItems) && (!wDspGroup) ) return null;

			var wMainParent = {};

			// �I�����ڎ擾
			var wSelId;
			var wSelItem;
			for( var wSelKey in wDspItems ) {
				// �I�����ڈȊO�͑ΏۊO
				wSelItem = wDspItems[wSelKey];
				if ( !wSelItem.selectItemIs() && !wSelItem.selectItemRelIs() ) continue;
				
				// �Ώۂɒǉ�
				wSelId = wSelItem.getBoxId();
				if ( wSelItem.selectItemIs() ) {
					wSelectMain[wSelId] = wSelItem;

					// ��I�����ڂ̐eID��ۑ�
					wMainParent[wSelItem.getParentId()] = wSelId;

				} else {
					wSelectRel[wSelId] = wSelItem;

				}

			}

			// �I���O���[�v�擾
			var wMainFlg;
			var wMainId = '';

			var wGrpId;
			var wParentId;

			var wGrpItem;
			for( var wGrpKey in wDspGroup ) {
				wGrpItem = wDspGroup[wGrpKey];
				wGrpId = wGrpItem.getBoxId();

				// �I�����ڈȊO�͑ΏۊO
				wMainFlg = wGrpItem.selectItemIs();
				if ( !wMainFlg && !wGrpItem.selectItemRelIs() ) {
					// ��I�����ڂ��������邩�`�F�b�N
					wMainId = '';
					for( var wChkId in wMainParent ) {
						if ( wChkId == wGrpId ) {
							wMainId = wMainParent[wChkId];
							break;
						}
					}
					if ( wMainId.length == 0 ) continue;
					
					// ��I�����ڂ���������O���[�v����I���ɕύX
					wMainFlg = true;
				}

				// �O���[�v��Ώۂɒǉ�
				if ( wMainFlg ) {
					wSelectMain[wGrpId]	= wGrpItem;
					if ( wMainId.length > 0 ) delete wSelectMain[wMainId];

				} else {
					wSelectRel[wGrpId]	= wGrpItem;

				}

				// �O���[�v�ɏ������鍀�ڂ�Ώۃ��X�g����폜
				for( var wItmKey in wSelectRel ) {
					wParentId = wSelectRel[wItmKey].getParentId();
					if ( wParentId != wGrpId ) continue;
					
					delete wSelectRel[wItmKey];
					
				}
			}

			var wSelectItems = {};
			this.copyProperty( wSelectMain	, wSelectItems );
			this.copyProperty( wSelectRel	, wSelectItems );

			return wSelectItems;

		} catch(e) {
			throw { name: 'getSideStatusDspSelect' + e.name, message: e.message };

		}
	};

	// �\���Ώێ擾
	clsPanelSide.prototype.getSideStatusDspAll = function( ) {
		try {
			var wGroupItems = {};
			
			// ���ڎ擾
			var wDspItems = this.getSideStatusDspItems();
			var wDspGroup = this.getSideStatusDspGroups();

			if ( (!wDspItems) && (!wDspGroup) ) return null;

			if ( wDspItems ) {
				var wParentId;
				var wParentItem;

				var wChkId;
				var wChkItem;
				for( var wChkKey in wDspItems ) {
					wChkItem = wDspItems[wChkKey];

					// �e�`�F�b�N
					wParentId = wChkItem.getParentId();
					if ( wParentId in wDspGroup ) {
						// �O���[�v��\���ΏۂƂ��č��ڂ�\���Ώۂ���폜
						wParentItem = wDspGroup[wParentId];
						if ( wParentItem ) {
							for( var wDelKey in wDspItems ) {
								if ( wDspItems[wDelKey].getParentId() == wParentId ) {
									delete wDspItems[wDelKey];
								}
							}
						
							wGroupItems[wParentId] = wParentItem;
							delete wDspGroup[wParentId];
						}

					// �O���[�v�ɏ������Ȃ�����
					} else {
						wChkId = wChkItem.getBoxId();
						wGroupItems[wChkId] = wChkItem;

					}

				}

			}

			// ���ڂ̏������Ȃ��O���[�v
			if ( wDspGroup ) {
				for( var wItemKey in wDspGroup ) {
					wGroupItems[wItemKey] = wDspGroup[wItemKey];

				}

			}
			
			return wGroupItems;

		} catch(e) {
			throw { name: 'getSideStatusDspAll.' + e.name, message: e.message };

		}
	};

	// **************************************************************
	// �@�\�����ݒ� - �ڍ�
	// **************************************************************

	// ���DIV�ݒ�@�w�i�F�istyle�j
	clsPanelSide.prototype.setSideStatusInfoBgColor = function( pItem, pDivEle ) {
		try {
			// �w�i�F���擾
			var wColor = pItem.getItemColor();

			// Style�֐ݒ�
			if ( wColor ) {
				this.setStyle( pDivEle, { 'background-color': wColor } );

			}
			return true;

		} catch(e) {
			throw { name: 'setSideStatusInfoBgColor.' + e.name, message: e.message };

		}
	};

	// ���DIV�ݒ�@Border�iclass�j
	clsPanelSide.prototype.setSideStatusInfoBorder = function( pItem, pDivEle ) {
		try {
			// Border�iclass�j�𓯊�
			var wClass = '';

			// �I��
			if ( pItem.chkItemClass('cssItem-sel') ) {
				wClass = 'cssItem-sel';
				// �֘A�I��������
				this.delClass( pDivEle, 'cssItem-sel-rel' );

			// �֘A�I��
			} else if ( pItem.chkItemClass('cssItem-sel-rel') ) {
				wClass = 'cssItem-sel-rel';
				// �I��������
				this.delClass( pDivEle, 'cssItem-sel' );

			// �ȊO
			} else {
				// �S�ĉ���
				this.delClass( pDivEle, 'cssItem-sel' );
				this.delClass( pDivEle, 'cssItem-sel-rel' );

			}

			// �N���X�ǉ�
			if ( wClass.length > 0 ) {
				if ( !this.chkClass(pDivEle, wClass) ) {
					this.addClass( pDivEle, wClass );
				}
			}

		} catch(e) {
			throw { name: 'setSideStatusInfoBorder.' + e.name, message: e.message };

		}
	};

	// ��񏉊���
	clsPanelSide.prototype.initSideStatus = function( ) {
		try {
			// ���\���G���A�N���A
			this.clearSideStatus();

			// �\����ʁ@������
			var wCmbEle = this._PanelSideSelectKind.element;
			if ( wCmbEle ) {
				wCmbEle.selectedIndex = 0;

				var wSelected = wCmbEle.options[0];
				if ( wSelected ) {
					this._PanelSideSelectKind.select = wSelected.value;
				} else {
					this._PanelSideSelectKind.select = -1;
				}

			}

		} catch(e) {
			throw { name: 'initSideStatus.' + e.name, message: e.message };

		}
	};

	// ���Đݒ�
	clsPanelSide.prototype.setSideStatusHtml = function( pItem ) {
		try {
			var wItemId		= pItem.getBoxId();
			var wItemKind	= pItem.getBoxKind();

			// �����eDIV����
			var wInfId = this._PanelSideStatusId + '_' + wItemId + '_inf';
			var wInfEle = this.getElement( wInfId );
			if ( !wInfEle ) {
				wInfEle = this.addElement( 'div', wInfId );
				if ( !wInfEle ) return null;

				this.addClass( wInfEle, 'cssSide-item-value' );

			}

			if ( wItemKind == 'item-group' ) {
				this.setSideStatusHtmlGroup( wInfEle, pItem );
			} else {
				this.setSideStatusHtmlItem( wInfEle, pItem );
			}

			return wInfEle;

		} catch(e) {
			throw { name: 'setSideStatusHtml.' + e.name, message: e.message };

		}
	};

	// �X�e�[�^�X�ݒ�i���ځj
	clsPanelSide.prototype.setSideStatusHtmlItem = function( pElement, pItem ) {
		try {
			if ( !pElement ) return false;
			if ( !pItem ) return false;
			
			// �\�����e�擾
			var wStatus = this.getSideStatusValue( pItem );

			var wBackground = '';
			var wElement = pItem.getBoxElement();
			if ( wElement ) {
				wBackground = wElement.style.backgroundImage;
				if ( wBackground ) wBackground = " style='background-image: " + wBackground + ";' "
			}

			var wHtml = '';
			wHtml += "<div class='cssSide-stat-icon' " + wBackground + "></div>";

			var wTitle = wStatus.title.trim();
			if ( wTitle.length > 0 ) {
				wTitle = "�i" + wTitle + "�j"
				wHtml += "<div style='width: 180px; float: left;' class='font-small'>" + this.toHtml(wTitle) + "</div>";
			}

			wHtml += "<div style='width: 140px; float: left;'>" + this.toHtml(wStatus.name) + "</div>";
			var wAge = wStatus.age.trim();
			if ( wAge.length > 0 ) wAge += '��';
			wHtml += "<div style='width:  34px; float: right; text-align: right; padding-right: 3px;'>" + this.toHtml(wAge) + "</div>";

			wHtml += "<div style='width: 180px; float: left;' class='font-small'>" + this.toHtml(wStatus.kana) + "</div>";

			// �A����ݒ�
			var wContact = this.getSideContactValue( pItem );
			wHtml += "<table class='cssSide-stat-tbl' cellpadding='0' cellspacing='0' style='clear: both;'>";

			var wContactHtml;
			for( var wKey in wContact ) {
				// �ԍ����ݒ�͔�\��
				if ( wContact[wKey].no.trim().length > 0 ) {
					wContactHtml = '';
					wContactHtml += "<td style='text-align: right;'><div style='width: 100%;'>" + this.toHtml(wContact[wKey].name) + "</div></td>";
					wContactHtml += "<td style='width:  16px; text-align: center;'>�F</td>";
					wContactHtml += "<td style='width: 100px;text-align: left;'><div style='width: 98%;'>" + this.toHtml(wContact[wKey].no) + "</div></td>";

					wHtml += "<tr>" + wContactHtml + "</tr>";
				}
			}
			wHtml += "</table>";

			// �R�����g�ݒ�
			var wComment = '';
			if ( typeof pItem.getCommentValues == 'function' ) {
				wComment = pItem.getCommentValues();
			}
			wHtml += "<div>" + this.toHtml(wComment) + "</div>";
			pElement.innerHTML = wHtml;

			return true;

		} catch(e) {
			throw { name: 'setSideStatusHtmlItem.' + e.name, message: e.message };

		}
	};

	// �X�e�[�^�X�ݒ�i�O���[�v�j
	clsPanelSide.prototype.setSideStatusHtmlGroup = function( pElement, pItem ) {
		try {
			if ( !pElement ) return false;
			if ( !pItem ) return false;
			
			// �\�����e�擾
			var wStatus = this.getSideStatusValue( pItem );

			var wHtml = '';
			if ( wStatus.title.trim().length > 0 ) {
				var wTitle = wStatus.title;
				if ( (wStatus.name.trim().length > 0) || (wStatus.kana.trim().length > 0) ) {
					wTitle = "�y" + wTitle + "�z"
				}
				wHtml += "<div>" + this.toHtml(wTitle) + "</div>";
			}
			wHtml += "<div>" + this.toHtml(wStatus.name) + "</div>";
			wHtml += "<div class='font-small'>" + this.toHtml(wStatus.kana) + "</div>";

			var wContact = this.getSideContactValue( pItem );
			wHtml += "<table class='cssSide-stat-tbl' cellpadding='0' cellspacing='0' style='clear: both;'>";

			// �A����ݒ�
			var wContactHtml;
			for( var wKey in wContact ) {
				// �ԍ����ݒ�͔�\��
				if ( wContact[wKey].no.trim().length > 0 ) {
					wContactHtml = '';
					wContactHtml += "<td style='text-align: right;'><div style='width: 100%;'>" + this.toHtml(wContact[wKey].name) + "</div></td>";
					wContactHtml += "<td style='width:  16px; text-align: center;'>�F</td>";
					wContactHtml += "<td style='width: 100px;text-align: left;'><div style='width: 98%;'>" + this.toHtml(wContact[wKey].no) + "</div></td>";

					wHtml += "<tr>" + wContactHtml + "</tr>";
				}
			}
			wHtml += "</table>";

			pElement.innerHTML = wHtml;

			return true;

		} catch(e) {
			throw { name: 'setSideStatusHtmlGroup.' + e.name, message: e.message };

		}
	};

	// �\���X�e�[�^�X�擾
	clsPanelSide.prototype.getSideStatusValue = function( pItem ) {
		try {
			var wStatList = pItem.getStatusValues();

			var wRetStat = { name: '', kana: '' };

			if ( wStatList ) {
				this.copyProperty( wStatList, wRetStat );

			}
			return wRetStat;

		} catch(e) {
			throw { name: 'getSideStatusValue', message: e.message };

		}
	};

	// �\���A����擾
	clsPanelSide.prototype.getSideContactValue = function( pItem ) {
		try {
			var wContactList = pItem.getContactValues();

			var wRetContact = {};

			if ( wContactList ) {
				this.copyProperty( wContactList, wRetContact );

			}
			return wRetContact;

		} catch(e) {
			throw { name: 'getSideContactValue', message: e.message };

		}
	};


	// **************************************************************
	// �@�\�����ݒ�
	// **************************************************************

	// ���ݒ�
	clsPanelSide.prototype.setSideStatusInfo = function( pItem ) {
		try {
			if ( !pItem ) return null;

			var wItmId = pItem.getBoxId();
			var wParent = ( pItem.getParentId().length > 0 );

			var wDivId = this._PanelSideStatusId + '_' + wItmId + '_base';

			var wDivEle = this.addElement( 'div', wDivId );
			if ( !wDivEle ) return null;

			// �����eDIV����
			var wInfEle = this.setSideStatusHtml( pItem );
			if ( !wInfEle ) return null;

			// ���DIV�֒ǉ�
			this.appendElementToParent( wDivEle, wInfEle );

			// ��{class�ݒ�
			this.addClass( wDivEle, 'cssSide-item' );

			var wColor = 'cssItem-color-base';
			var wItemKind = pItem.getBoxKind();
			switch( wItemKind ) {
			case 'item-person':
				wColor = 'cssItem-color-person';
				break;
			
			case 'item-group':
				wColor = 'cssItem-color-group';
				break;
			
			case 'item-comment':
				wColor = 'cssItem-color-comment';
				break;
			
			case 'item-relation':
				wColor = 'cssItem-color-relation';
				break;
			
			}
			this.addClass( wDivEle, wColor );

			// �w�i�F�𓯊�
			this.setSideStatusInfoBgColor( pItem, wDivEle );

			// Border�𓯊�
			this.setSideStatusInfoBorder( pItem, wDivEle );

			// �R���e�L�X�g���j���[�ݒ�
			this.addEvent( wDivEle, 'oncontextmenu', this.eventSideStatusMenu );

			// ���v�f�ۑ�
			this._PanelSideContentsEle[wDivId] = { id: wItmId, parent: wParent, element: wDivEle };

			return wDivEle;

		} catch(e) {
			throw { name: 'setSideStatusInfo.' + e.name, message: e.message };

		}
	};

	// �F�Đݒ�
	clsPanelSide.prototype.resetSideStatusColor = function( pItem ) {
		try {
			if ( !pItem ) return false;

			var wDivEle = this.getSideStatusInfo( pItem.getBoxId() );
			if ( !wDivEle ) return false;

			// �w�i�F�𓯊�
			this.setSideStatusInfoBgColor( pItem, wDivEle );

			return true;

		} catch(e) {
			throw { name: 'resetSideStatusColor.' + e.name, message: e.message };

		}
	};

	// ���g�ݒ�
	clsPanelSide.prototype.setSideStatusFrame = function( pItem, pSelected ) {
		try {
			if ( !pItem ) return false;

			// �I���̂ݕ\����
			var wSelected = this._PanelSideSelectKind.select;
			if ( wSelected == 'select' ) {
				// �ꗗ�ĕ\��
				this.dspSideStatus();

			// �ȊO
			} else {
				// �I�����ڂ̂ݕύX
				var wDivEle = this.getSideStatusInfo( pItem.getBoxId() );
				if ( !wDivEle ) return false;

				// Border�𓯊�
				this.setSideStatusInfoBorder( pItem, wDivEle );

			}
			return true;

		} catch(e) {
			throw { name: 'setSideStatusFrame.' + e.name, message: e.message };

		}
	};

	// ���ݒ�
	clsPanelSide.prototype.getSideStatusInfo = function( pItemId ) {
		try {
			var wDivEle = null;

			for( var wKey in this._PanelSideContentsEle ) {
				if( pItemId == this._PanelSideContentsEle[wKey].id ) {
					wDivEle = this._PanelSideContentsEle[wKey].element;
					break;
				}
			}

			return wDivEle;

		} catch(e) {
			throw { name: 'getSideStatusInfo', message: e.message };

		}
	};


	// **************************************************************
	// �@���\��
	// **************************************************************

	// ���ڂ��N���A
	clsPanelSide.prototype.clearSideStatus = function() {
		try {
			var self = this;

			// �q���ڍ폜
			function clearItem( pItem ) {
				// �C�x���g�폜
				self.delEvent( pItem, 'oncontextmenu', self.eventSideStatusMenu );

				// �q���ڍ폜
				self.delElement( pItem );
			}

			// ���ڍ폜�i�q�j
			for( var wKey in this._PanelSideContentsEle ) {
				if ( this._PanelSideContentsEle[wKey].parent ) continue;

				// ���ڍ폜
				clearItem( this._PanelSideContentsEle[wKey].element );
				delete this._PanelSideContentsEle[wKey];
				
			}

			// ���ڍ폜�i�e�j
			for( var wKey in this._PanelSideContentsEle ) {
				// ���ڍ폜
				clearItem( this._PanelSideContentsEle[wKey].element );
				delete this._PanelSideContentsEle[wKey];
				
			}

			// �ۑ���񏉊���
			this._PanelSideContentsEle = {};


		} catch(e) {
			throw { name: 'clearSideStatus.' + e.name, message: e.message };

		}
	};

	// ���ڂ�\��
	clsPanelSide.prototype.dspSideStatusInfo = function( pParentItem, pItem, pDspAll ) {
		try {
			if ( !pItem ) return false;

			// ���\��
			var wDivEle = this.setSideStatusInfo( pItem );
			if ( !wDivEle ) return false;

			// �\���Ώۂ��S�ā@���@�O���[�v�\��
			if ( (pDspAll) && (pItem.getBoxKind() == 'item-group') ) {
				var wParentId = pItem.getBoxId();

				// �O���[�v�����ڕ\��
				if ( this._PanelSideContents.person ) {
					var wChiled;
					var wChiledEle;

					for( var wKey in this._PanelSideContents.person ) {
						wChiled = this._PanelSideContents.person[wKey];

						if ( wChiled.getParentId() == wParentId ) {
							// �q���\��
							wChiledEle = this.setSideStatusInfo( wChiled );
							if ( !wChiledEle ) return false;

							this.setStyle( wChiledEle, { 'margin-left': '5px' } );
							this.appendElementToParent( wDivEle, wChiledEle );
						
						}
					}
				}

			}
			this.appendElementToParent( pParentItem, wDivEle );

		} catch(e) {
			throw { name: 'dspSideStatusInfo.' + e.name, message: e.message };

		}
	};

	// �\���Ώۍ��ڂ�S�ĕ\��
	clsPanelSide.prototype.dspSideStatus = function() {
		try {
			if ( !this._PanelSideStatus ) return false;

			// �\���Ώێ擾
			var wDspAll = false;
			var wSelected = this._PanelSideSelectKind.select;

			// �l���̂�
			if ( wSelected == 'person' ) {
				wDspItems = this.getSideStatusDspItems();

			// �O���[�v�̂�
			} else if ( wSelected == 'group' ) {
				wDspItems = this.getSideStatusDspGroups();

			// �I�����ڂ̂�
			} else if ( wSelected == 'select' ) {
				wDspItems = this.getSideStatusDspSelect();
				wDspAll = true;

			// �ȊO�i�S�āj
			} else {
				wDspItems = this.getSideStatusDspAll();
				wDspAll = true;

			}
			if ( !wDspItems ) return false;

			// ���\���G���A��U�N���A
			this.clearSideStatus();

			// �\��
			for( var wKey in wDspItems ) {
				// ���ڐݒ�
				this.dspSideStatusInfo( this._PanelSideStatus, wDspItems[wKey], wDspAll );

			}

		} catch(e) {
			throw { name: 'dspSideStatus.' + e.name, message: e.message };

		}
	};


	// **************************************************************
	// �@���ڑ���
	// **************************************************************

	// �\����ʑI��������
	clsPanelSide.prototype.chgSelectKind = function( pValue ) {
		try {
			var wSelected = this._PanelSideSelectKind.select;

			// �I��l�ۑ�
			this._PanelSideSelectKind.select = pValue;
			
			if ( pValue !== wSelected ) {
				// �ꗗ�ĕ\��
				this.dspSideStatus();
			}

		} catch(e) {
			throw { name: 'chgSelectKind.' + e.name, message: e.message };

		}
	};

	// �C�x���g��S�ăL�����Z��
	clsPanelSide.prototype.eventClear = function() {
		try {
			// �o�^����Ă��鏈�������s
			// �����C���R���e���c�֍��ڑ���L�����Z���ʒm
			this.execLinkCallback( { kind: 'cancel' }, null );

		} catch(e) {
			throw { name: 'eventClear', message: e.message };
		}
	};

	// �N���b�N���ځ@���ڎ擾
	clsPanelSide.prototype.getClickItem = function( pClickId ) {
		try {
			var wClickItm = null;

			if ( pClickId in this._PanelSideContentsEle ) {
				var wId = this._PanelSideContentsEle[pClickId].id;

				for( var wKind in this._PanelSideContents ) {
					if ( !this.isObject(this._PanelSideContents[wKind]) ) continue;
					
					if( wId in this._PanelSideContents[wKind] ) {
						wClickItm = this._PanelSideContents[wKind][wId];
						break;
					}
				}

			}

			return wClickItm;

		} catch(e) {
			throw { name: 'getClickItem', message: e.message };

		}
	};

	// �N���b�N���ځ@�R���e�L�X�g���j���[�\��
	clsPanelSide.prototype.execSideStatusContext = function( pEvent, pClickItm ) {
		try {
			if ( !pClickItm.eventMenuDsp ) return;

			// ���ڂ̃��j���[�\��
			var wDispParam = {
					  hide:		['move', 'resize', 'relation', 'relationChg', 'unrelation']
					, blank:	1
			};

			pClickItm.eventMenuDsp( pEvent, wDispParam );

		} catch(e) {
			throw { name: 'execSideStatusContext', message: e.message };

		}
	};

	// �N���b�N�ʒu�ɍ��ڂ����邩�`�F�b�N
	clsPanelSide.prototype.chkItemOverlapToClick = function( pEvent ) {
		try {
			var wEvtPos = this.getEventPos( pEvent );

			var wClickItem = null;
			var wChkItem;

			for( var wKey in this._PanelSideContentsEle ) {
				wChkItem = this._PanelSideContentsEle[wKey].element;

				if ( this.chkInPoint(wChkItem, wEvtPos) ) {
					// �I��v�f�̍��ڏ��擾
					wClickItem = this.getLinkContents( this._PanelSideContentsEle[wKey].id );
					
					// �l���Ȃ�I��
					if ( wClickItem.isPerson() ) break;
				}

			}

			return wClickItem;

		} catch(e) {
			throw { name: 'chkItemOverlapToClick', message: e.message };
		}
	};


	// **************************************************************
	// ���C�����j���[��ʂ̃��j���[
	// **************************************************************

	// �ҏW���[�h���j���[�ύX
	clsPanelSide.prototype.chgEditModeMenu = function( pMenuId ) {
		try {
			// ���j���[�ύX�Ȃ��͏����Ȃ�
			if ( this._PanelSideEditMode == pMenuId ) return false;

			// �z�u�ҏW���[�h
			if ( pMenuId == this._DEF_MENU_ID_MOVE ) {
				// ���ڑ����s��
				this._PanelSideValidItem = false;

			// �ȊO�i�ʏ탂�[�h�j
			} else {
				// ���ڑ��������
				this._PanelSideValidItem = true;

			}

			// ���[�h�ύX
			this._PanelSideEditMode = pMenuId;

			// ���j���[�ύX
			this.chgMenuEditStyle( this._PanelSideEditMode );

			return true;

		} catch(e) {
			throw { name: 'chgEditModeMenu.' + e.name, message: e.message };
		}
	};

	// ���C�����j���[�I��������
	clsPanelSide.prototype.execMainMenu = function( pEvent, pMenuId ) {
		try {
			var wRetVal = true;

			// ����L�����̂ݏ���
			if ( !this._PanelSideValid ) return true;

			switch(pMenuId) {
			// �ʏ�
			case this._DEF_MENU_ID_NORMAL:
				// �ʏ탂�[�h�֐ؑ�
				wRetVal = this.chgEditModeMenu( pMenuId );

				if ( wRetVal ) {
					// �����C���R���e���c�֕ҏW���[�h�ύX�ʒm
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_NORMAL }, null );
				}
				break;

			// �z�u�ҏW
			case this._DEF_MENU_ID_MOVE:
				// �z�u�ҏW���[�h�֐ؑ�
				wRetVal = this.chgEditModeMenu( pMenuId );

				if ( wRetVal ) {
					// �����C���R���e���c�֕ҏW���[�h�ύX�ʒm
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_MOVE }, null );
				}
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'execMainMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �@�����ݒ�
	// **************************************************************

	// �ҏW���j���[�ݒ�
	clsPanelSide.prototype.createMenuElement = function() {
		try {
			// �X�e�[�^�X�\���G���A����
			var wMenuEle = this.addElement( 'div', this.getBoxId() + '_menu' );
			if ( !wMenuEle ) {
				throw { name: 'addElement', message: '�v�f�������ł��܂���' };

			}

			this.addClass( wMenuEle, 'cssCommon-menu' );
			this.appendElementToParent( this._PanelSideEleFrame, wMenuEle );

			// ���얳����
			this.addEvent( wMenuEle, 'onclick',			this.eventInvalid );
			this.addEvent( wMenuEle, 'oncontextmenu',	this.eventInvalid );

			// �v�f�ۑ�
			this._PanelSideEleMenu = wMenuEle;

			// ���j���[�ǉ�
			var wEditNormal = this.createMenuEditNormal( this._PanelSideEleMenu, this.eventMainMenuSelect );
			this._PanelSideEleMenuList.push( wEditNormal );

			var wEditMove = this.createMenuEditMove( this._PanelSideEleMenu, this.eventMainMenuSelect );
			this._PanelSideEleMenuList.push( wEditMove );
		
			return true;

		} catch(e) {
			throw { name: 'createMenuElement.' + e.name, message: e.message };

		}
	};

	// �\����ʑI���R���{�ݒ�
	clsPanelSide.prototype.initSelectCmb = function() {
		try {
			var wSelectItems = this._DEF_PANEL_SIDE_SELECT;
			if ( !wSelectItems ) return false;

			// ���암����
			var wCtrlEle = this.addElement( 'div', this.getBoxId() + '_control' );
			if ( !wCtrlEle ) return false;
			this.addClass( wCtrlEle, 'cssSide-control' );

			// �^�C�g��
			var wTitleEle = this.addElement( 'div', this.getBoxId() + '_control_title' );
			if ( !wTitleEle ) return false;
			this.addClass( wTitleEle, 'cssSide-control-title' );

			wTitleEle.innerHTML = '�\������';

			// �R���{�{�b�N�X����
			var wCmbEle = this.addElement( 'select', this.getBoxId() + '_Kind' );
			if ( !wCmbEle ) return false;
			this.addClass( wCmbEle, 'cssSide-cmb' );

			// ���암�֒ǉ�
			this.appendElementToParent( wCtrlEle, wTitleEle );
			this.appendElementToParent( wCtrlEle, wCmbEle );
			
			// �e�֒ǉ�
			this.appendElementToParent( this._PanelSideEleFrame, wCtrlEle );

			// ���ڒǉ�
			wCmbEle[wCmbEle.options.length] = new Option( '', -1 );

			var wItems;
			for( var wIndex=0; wIndex < wSelectItems.length; wIndex++ ) {
				wItems = wSelectItems[wIndex];
				if ( wItems ) {
					wCmbEle[wCmbEle.options.length] = new Option( wItems.text, wItems.value );

				}
			}
			
			// �I�����C�x���g�ݒ�
			this.addEvent( wCmbEle, 'onclick'		, this.eventSelectOpen );
			this.addEvent( wCmbEle, 'onchange'		, this.eventSelectKind );
			this.addEvent( wCmbEle, 'blur'			, this.eventSelectClose );

			// �I�u�W�F�N�g��ۑ�
			this._PanelSideSelectKind.id		= wCmbEle.id;
			this._PanelSideSelectKind.element	= wCmbEle;

			return true;

		} catch(e) {
			throw { name: 'initSelectCmb.' + e.name, message: e.message };

		}
	};

	// �X�e�[�^�X�\���G���A�ݒ�
	clsPanelSide.prototype.initStatPanel = function() {
		try {
			// �X�e�[�^�X�\���G���A����
			var wStatEle = this.addElement( 'div', this.getBoxId() + '_Stat' );
			if ( !wStatEle ) return false;

			this._PanelSideStatus	= wStatEle;
			this._PanelSideStatusId	= wStatEle.id;

			this.addClass( wStatEle, 'cssSide-stat' );
			this.appendElementToParent( this._PanelSideEleFrame, wStatEle );

			return true;

		} catch(e) {
			throw { name: 'initStatPanel.' + e.name, message: e.message };

		}
	};

	// �T�C�h�p�l�����e�ݒ�
	clsPanelSide.prototype.createMainPanel = function( pArgument ) {
		try {
			// �X�e�[�^�X�\���G���A����
			var wFrameEle = this.addElement( 'div', this.getBoxId() + '_Frame' );
			if ( !wFrameEle ) return false;

			this.addClass( wFrameEle, 'cssSide-menu-frame' );
			this.appendBoxToParent( wFrameEle );

			// ���e�v�f�ۑ�
			this._PanelSideEleFrame = wFrameEle;

			// ���j���[�L��
			if ( this._PanelSideMenuIs ) {
				// ���j���[�\���G���A����
				this.createMenuElement();
			}

			// �\����ʑI���R���{�ݒ�
			this.initSelectCmb();

			// �X�e�[�^�X�\���G���A�ݒ�
			this.initStatPanel();

			// �����\��
			var wDisplay = false;
			if ( pArgument ) {
				if ( pArgument.display ) wDisplay = true;
			}
			if ( wDisplay ) this.dspBox( true, false );

			return true;

		} catch(e) {
			throw { name: 'createMainPanel.' + e.name, message: e.message };

		}
	};


	// **************************************************************
	// ���ړ���
	// **************************************************************

	// �ҏW���[�h���j���[�ύX
	// �@�����C���I�u�W�F�N�g����call�����
	clsPanelSide.prototype.execChgEditModeNormal = function() {
		try {
			// �ʏ�ҏW���[�h�ɕύX
			this.chgEditModeMenu( this._DEF_MENU_ID_NORMAL );

		} catch(e) {
			throw { name: 'execChgEditModeNormal.' + e.name, message: e.message };
		}
	};

	// �������ڕύX������
	// �@���������I�u�W�F�N�g����call�����
	clsPanelSide.prototype.execLinkItemEvent = function( pArgument ) {
		try {
			if ( !this.isObject(pArgument) ) return false;

			if ( !('kind' in pArgument) ) return false;
			var wKind = pArgument.kind;

			// �S�Ă̍��ڂɑ΂��Ă̏����̏ꍇ�͑Ώۍ��ڎ擾�s�v
			var wTarget;
			if ( !this.isAllTarget(wKind) ) {
				wTarget = pArgument.item;
				if ( typeof wTarget == 'undefined' ) return false;

				// �R�����g
				if ( wTarget.isComment() ) {
					// �����Ȃ�
					return true;
				
				// ���p�_
				} else if ( wTarget.isRelation() ) {
					// �����Ȃ�
					return true;
				
				// �O���[�v����
				} else if ( wTarget.isGroup() ) {
					// �l���̂ݕ\�����͏����Ȃ�
					if ( this._PanelSideSelectKind.select == 'person' ) return true;

					// �ړ����͏����Ȃ�
					if ( wKind == 'move' ) return true;

				// �ȊO
				} else {
					// �O���[�v�̂ݕ\�����͏����Ȃ�
					if ( this._PanelSideSelectKind.select == 'group' ) return true;

				}

			}

			switch(wKind) {
			// ���ʕύX
			case 'gender':
				this.setSideStatusHtml( wTarget );
				break;

			// �󋵕ύX
			case 'situation':
				this.setSideStatusHtml( wTarget );
				break;

			// ���X�V
			case 'status':
				this.setSideStatusHtml( wTarget );
				break;

			// �A����X�V
			case 'contact':
				this.setSideStatusHtml( wTarget );
				break;

			// �F�ύX
			case 'color':
				this.resetSideStatusColor( wTarget );
				break;

			// �I��
			case 'select':
				this.setSideStatusFrame( wTarget, pArgument.selected );
				break;

			// ����������
			case 'init':
				this.initSideStatus();
				break;

			// �ҏW���[�h�ύX
			case 'edit':
				this.chgEditModeMenu( pArgument.mode );
				break;

			// �S�čĕ\��
			case 'reset':
				this.dspSideStatus();
				break;

			// �ȊO
			default:
				// �S�čĕ\��
				this.dspSideStatus();
				break;
			
			}
			
			return true;

		} catch(e) {
			throw { name: 'execLinkItemEvent.' + e.name, message: e.message };
		}
	};

	// �����I�u�W�F�N�g�ւ̍��ڕύX�ʒm�C�x���g�ݒ�
	clsPanelSide.prototype.addLinkCallback = function( pEvtFnc ) {
		try {
			if ( !pEvtFnc ) return false;

			// ���ڕύX�������ǉ�
			this._PanelSidesLinkCallback.push( pEvtFnc );

		} catch(e) {
			throw { name: 'addLinkCallback', message: e.message };
		}
	};

	// ���ڕύX������
	// �������I�u�W�F�N�g�֍��ڕύX��ʒm
	clsPanelSide.prototype.execLinkCallback = function( pParam, pItem ) {
		try {
			if ( this._PanelSidesLinkCallback.length == 0 ) return true;

			// �C�x���g�I�u�W�F�N�g�փp�����[�^�ݒ�
			var wCallbackParam = {};
			this.copyProperty( pParam, wCallbackParam );

			wCallbackParam.item		= pItem;

			for( var wIndex = 0; wIndex < this._PanelSidesLinkCallback.length; wIndex++ ) {
				if ( typeof this._PanelSidesLinkCallback[wIndex] == 'function' ) {
					// �o�^����Ă��鏈�������s
					var wArguments = [];
					wArguments.push( wCallbackParam );

					this._PanelSidesLinkCallback[wIndex].apply( this, wArguments );

				}
			}
			return true;

		} catch(e) {
			throw { name: 'execLinkCallback.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsPanelSide.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_PANEL_SIDE_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu�v
				wInitArgument.kind = this._DEF_PANEL_SIDE_KIND;

			}

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// �ҏW���j���[�����l
			this._PanelSideEditMode = this._DEF_MENU_ID_NORMAL;

			// �p�����[�^�擾
			var wLocked		= false;
			var wSideMenu	= false;

			if ( this.isObject(pArgument) ) {
				if ( 'locked' in pArgument ) wLocked = pArgument.locked;

				// ���j���[�ݒ�
				if ( 'menu' in pArgument ) {
					if ( 'sidepanel' in pArgument.menu ) wSideMenu = pArgument.menu.sidepanel;
				}
			}
			this._PanelSideLocked = wLocked;

			// ���b�N���̓��j���[�g�p�s��
			if ( !wLocked ) {
				this._PanelSideMenuIs = wSideMenu;
			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssSide-menu' );
			this.setBoxClass( 'no-print' );

			// ------------------------
			// �C�x���g�ݒ�
			// ------------------------

			// �R���e�L�X�g���j���[
			this.addBoxEvents( 'oncontextmenu' , this.eventInvalid );

			// ���ڃN���b�N
			this.addBoxEvents( 'onmousedown'	, this.eventSideStatusItemClick );

			// ------------------------
			// �����pcallback�ݒ�
			// ------------------------
			if ( pArgument ) {
				this.addLinkCallback( pArgument.callback );

			}

			// ------------------------
			// ���e�ݒ�
			// ------------------------
			this.createMainPanel( pArgument );


		} catch(e) {
			throw { name: 'clsPanelSide.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsPanelSide.prototype.freeClass = function() {
		try {
			// �C�x���g�폜
			if ( this._PanelSideSelectKind.element ) {
				this.execFunction( this.delEvent, this._PanelSideSelectKind.element, 'onchange', this.eventSelectKind );
				this.execFunction( this.delElement, this._PanelSideSelectKind.element );
			}
			this._PanelSideSelectKind		= null;

			this.execFunction( this.clearSideStatus );
			this._PanelSideStatus			= null;
			this._PanelSideContentsEle		= null;
			this._PanelSideEleFrame			= null;

			for( var wKey in this._PanelSideContents ) {
				this._PanelSideContents[wKey] = null;
			}

			for( var wCIdx = 0; this._PanelSidesLinkCallback.length; CIdx++ ) {
				this._PanelSidesLinkCallback[wCIdx] = null;
			}
			this._PanelSidesLinkCallback	= null;

			// �ҏW���j���[���
			for( var wIdx = 0; wIdx < this._PanelSideEleMenuList.length; wIdx++ ){
				this._PanelSideEleMenuList[wIdx] = null;
			}
			
			if ( this._PanelSideEleMenu ) {
				this.execFunction( this.delEvent, this._PanelSideEleMenu, 'onclick',		this.eventInvalid );
				this.execFunction( this.delEvent, this._PanelSideEleMenu, 'oncontextmenu',	this.eventInvalid );
			}
			this._PanelSideEleMenu			= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};

}());
