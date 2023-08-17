
// --------------------------------------------------------------------
//
// ���C���N���X
//
// --------------------------------------------------------------------
// clsDrawMain
// --------------------------------------------------------------------
var clsDrawMain = function( pArgument ) {
	try {
		var self = this;

		// ���ʃ��j���[
		this._MainPublicMenu = {
			  common		: {}
			, person		: {}
			, group			: {}
			, comment		: {}
			, relation		: {}
			, freeline		: {}
		};

		// �e����v�f
		this._MainPanelSide				= null;
		this._MainPanelContents			= null;
		this._MainPanelControl			= null;
		
		// Callback
		this._MainFuncChgStat			= null;
		this._MainFuncChgPos			= null;


		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// ----------------------------
		// �R���e���c����
		// ----------------------------

		// �R���e���c�i�ύX�j����Call�����
		this.eventContentsChange = function( pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execContentsChange( pArgument );

			} catch(e) {
				alert( e.message );

			}
			return true;
		};

		// �T�C�h�p�l�� - ���ڑ��슮������Call�����
		this.eventSidePanelChange = function( pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execSidePanelChange( pArgument );

			} catch(e) {
				alert( e.message );

			}
			return true;
		};


		// **************************************************************
		// �R���X�g���N�^
		// **************************************************************
		this.initClass( pArgument );

	} catch(e) {
		throw { name: 'clsDrawMain.' + e.name, message: e.message };
	}
};

// ���C�� prototype
(function(){

	// **************************************************************
	// ��{
	// ���udrawdiagram.js�v�֓���`�֐�����
	// **************************************************************

	// �z�񂩂ǂ����`�F�b�N
	clsDrawMain.prototype.isArray = function( pArgument ) {
		try {
			// �z�񂩃`�F�b�N
			if( pArgument instanceof Array ) {
				return true;
			
			} else {
				return false;
			
			}

		} catch(e) {
			throw { name: 'clsDrawMain.isArray.' + e.name, message: e.message };
		}
	};

	// �I�u�W�F�N�g�i�A�z�z��j���ǂ����`�F�b�N
	clsDrawMain.prototype.isObject = function( pArgument ) {
		try {
			// �z�񂩃`�F�b�N
			if ( this.isArray(pArgument) ) return false;

			// �z��ȊO��Object���`�F�b�N
			if ( pArgument instanceof Object ) {
				return true;

			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'clsDrawMain.isObject.' + e.name, message: e.message };
		}
	};

	// �v���p�e�B�𕡎�
	clsDrawMain.prototype.copyProperty = function( pSrcEle, pDstEle ) {
		try {
			if ( !this.isObject(pSrcEle) ) return false;
			if ( !this.isObject(pDstEle) ) return false;

			for( var key in pSrcEle ) {
				// �l�𕡎�
				pDstEle[key] = pSrcEle[key];
			}
			return true;

		} catch(e) {
			throw { name: 'clsDrawMain.copyProperty', message: e.message };
		}
	};


	// **************************************************************
	// �}�`�`��g�p������Call�����
	// **************************************************************

	// �o�^�J�n
	clsDrawMain.prototype.drawStart = function() {
		try {
			if ( !this._MainPanelContents ) return;

			// �R���e���c�ƃT�C�h�p�l�������J�n
			this.linkContentsAndSide();

		} catch(e) {
			throw { name: 'clsDrawMain.drawStart.' + e.name, message: e.message };
		}
	};

	// ����L�����Z��
	clsDrawMain.prototype.drawCancelControl = function() {
		try {
			// �R���e���c�̑���L�����Z��
			if ( !this._MainPanelContents ) return;
			this._MainPanelContents.cancelControl();

			// ���T�C�h�p�l���̑���L�����Z���s�v

		} catch(e) {
			throw { name: 'clsDrawMain.drawCancelControl.' + e.name, message: e.message };
		}
	};

	// ���ځi�l���j�ǉ�
	clsDrawMain.prototype.drawAddPerson = function( pAddParam ) {
		try {
			if ( !this._MainPanelContents ) return false;

			// �ҏW���[�h��ʏ�ɕύX
			this._MainPanelContents.execChgEditModeNormal();

			if ( this._MainPanelSide ) {
				// ���udrawdiagram.panel.side.js�v
				this._MainPanelSide.execChgEditModeNormal();
			}

			// ���ڐ���
			// ���udrawdiagram.contents.js�v
			var wResult = this._MainPanelContents.addPersonByValue( pAddParam );

			return wResult;

		} catch(e) {
			throw { name: 'clsDrawMain.drawAddPerson.' + e.name, message: e.message };
		}
	};

	// ���ځi�O���[�v�j�ǉ�
	clsDrawMain.prototype.drawAddGroup = function( pAddParam ) {
		try {
			if ( !this._MainPanelContents ) return false;

			// �ҏW���[�h��ʏ�ɕύX
			this._MainPanelContents.execChgEditModeNormal();

			if ( this._MainPanelSide ) {
				// ���udrawdiagram.panel.side.js�v
				this._MainPanelSide.execChgEditModeNormal();
			}
			
			// ���ڐ���
			// ���udrawdiagram.contents.js�v
			var wResult = this._MainPanelContents.addGroupByValue( pAddParam );

			return wResult;

		} catch(e) {
			throw { name: 'clsDrawMain.drawAddGroup.' + e.name, message: e.message };
		}
	};

	// ���ڏ��擾
	clsDrawMain.prototype.drawGetItemData = function( pParam ) {
		try {
			if ( !this._MainPanelContents ) return null;

			// ���ڏ��擾
			// ���udrawdiagram.contents.js�v
			return this._MainPanelContents.getItemData( pParam );

		} catch(e) {
			throw { name: 'clsDrawMain.drawGetItemData.' + e.name, message: e.message };
		}
	};

	// �`����e�擾
	clsDrawMain.prototype.drawGetSaveData = function( pSaveParam ) {
		try {
			if ( !this._MainPanelContents ) return null;

			// �`����擾
			// ���udrawdiagram.contents.js�v
			return this._MainPanelContents.getSaveData( pSaveParam );

		} catch(e) {
			throw { name: 'clsDrawMain.drawGetSaveData.' + e.name, message: e.message };
		}
	};

	// �`��������ɃL�����o�X����
	// ���p�����[�^�upLoadData�v�͗v�f�i�̎Q�Ɓj
	clsDrawMain.prototype.drawLoadData = function( pLoadData ) {
		try {
			if ( !this._MainPanelContents ) return null;

			// �`�����Load
			// ���udrawdiagram.contents.js�v
			return this._MainPanelContents.execLoadData( pLoadData.value );

		} catch(e) {
			throw { name: 'clsDrawMain.drawLoadData.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ����
	// **************************************************************

	// �R���e���c�ƃT�C�h�p�l������
	clsDrawMain.prototype.linkContentsAndSide = function() {
		try {
			if ( !this._MainPanelContents ) return;
			if ( !this._MainPanelSide ) return;

			// �R���e���c�̍��ڂւ̎Q�Ǝ擾
			var wLinkContents = this._MainPanelContents.getBelongContents();

			// ���ڂ𓯊�
			this._MainPanelSide.setLinkContents( wLinkContents );

		} catch(e) {
			throw { name: 'clsDrawMain.linkContentsAndSide.' + e.name, message: e.message };
		}
	};

	// �p�l���R���g���[���ƃT�C�h�p�l���̑���󋵐ݒ�
	clsDrawMain.prototype.setCtrlAndSideValid = function( pArgument ) {
		try {
			if ( !pArgument ) return false;
			if ( typeof pArgument.valid == 'undefined' ) return false;

			// �T�C�h�p�l���̑���ېݒ�
			if ( this._MainPanelSide ) {
				if ( typeof this._MainPanelSide.setControlValid == 'function' ) {
					this._MainPanelSide.setControlValid( pArgument.valid );
				}
			}

			// �p�l���R���g���[���̑���ېݒ�
			if ( this._MainPanelControl ) {
				if ( typeof this._MainPanelControl.setControlValid == 'function' ) {
					this._MainPanelControl.setControlValid( pArgument.valid );
				}
			}

		} catch(e) {
			throw { name: 'clsDrawMain.setCtrlAndSideValid.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// Callback
	// **************************************************************

	// �R���e���c���쎞����
	clsDrawMain.prototype.execContentsChange = function( pArgument ) {
		try {
			// ���ڑ���ʒm
			this.execContentsChangeCallback( pArgument );

			if ( !this._MainPanelSide ) return;

			switch( pArgument.kind ) {
			// ���ړ���
			case 'link':
				// �R���e���c�ƃT�C�h�p�l������
				this.linkContentsAndSide();
				break;
			
			// ����󋵐ݒ�
			case 'set-valid':
				// �p�l���R���g���[���ƃT�C�h�p�l���̑���󋵐ݒ�
				this.setCtrlAndSideValid( pArgument );
				break;
			
			// �ȊO
			default:
				// �T�C�h�p�l���X�V�֐����s
				this._MainPanelSide.execLinkItemEvent( pArgument );
				break;

			}

		} catch(e) {
			throw { name: 'clsDrawMain.execContentsChange.' + e.name, message: e.message };
		}
	};

	// �T�C�h�p�l�����쎞����
	clsDrawMain.prototype.execSidePanelChange = function( pArgument ) {
		try {
			if ( !this._MainPanelContents ) return;

			// ���C���R���e���c�X�V�֐����s
			// ���udrawdiagram.contents.js�v
			this._MainPanelContents.execLinkItemEvent( pArgument );

		} catch(e) {
			throw { name: 'clsDrawMain.execSidePanelChange.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// Callback�֐���Call
	// ���}�`�`��g�p���̊֐���Call
	// **************************************************************

	// ���ڑ���ʒm
	clsDrawMain.prototype.execContentsChangeCallback = function( pArgument ) {
		try {
			if ( !this.isObject(pArgument) ) return;

			// ������e
			var wCtrlKind = pArgument.kind;

			switch( wCtrlKind ) {
			// ���X�V
			case 'status':
			// �A����X�V
			case 'contact':
			// �֌W�ǉ�
			case 'relation':
			// �֌W�ύX
			case 'relationChg':
			// �֌W����
			case 'unrelation':
			// �֌W�X�V
			case 'relationUpd':
			// �֌W���C������
			case 'relationLine':
			// �F�ύX
			case 'color':
				if ( typeof this._MainFuncChgStat == 'function' ) {
					this._MainFuncChgStat( pArgument );
				}
				break;

			// ���ڈړ�
			case 'move':
			// �T�C�Y�ύX
			case 'resize':
			// �ʒu�����i�c�j
			case 'pos-vert':
			// �ʒu�����i���j
			case 'pos-side':
				if ( typeof this._MainFuncChgPos == 'function' ) {
					this._MainFuncChgPos( pArgument );
				}
				break;
			}

		} catch(e) {
			throw { name: 'clsDrawMain.execContentsChangeCallback.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �}�`�`��g�p������Call�����i����֘A�j
	// **************************************************************

	// �L�����o�X���
	clsDrawMain.prototype.drawPrintCanvas = function() {
		try {
			if ( !this._MainPanelContents ) return null;

			// �`������
			// ���udrawdiagram.contents.js�v
			return this._MainPanelContents.printCanvasData();

		} catch(e) {
			throw { name: 'clsDrawMain.drawPrintCanvas.' + e.name, message: e.message };
		}
	};

	// �`����e�擾�i����p�j
	clsDrawMain.prototype.drawGetPrintCanvas = function() {
		try {
			if ( !this._MainPanelContents ) return null;

			// �`����擾
			// ���udrawdiagram.contents.js�v
			return this._MainPanelContents.getPrintData();

		} catch(e) {
			throw { name: 'clsDrawMain.drawGetPrintCanvas.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �R���X�g���N�^�^�f�X�g���N�^
	// **************************************************************

	// �R���X�g���N�^
	clsDrawMain.prototype.initClass = function( pArgument ) {
		try {
			var self = this;

			// ��{����p�����[�^�擾
			var wIsLocked		= false;
			var wIsSidePanel	= true;

			// ���j���[��{�ݒ�
			//�@�֌W���j���[
			var wMenuRelationStat = null;

			if ( this.isObject(pArgument) ) {
				if ( 'locked'    in pArgument ) wIsLocked    = pArgument.locked;
				if ( 'sidepanel' in pArgument ) wIsSidePanel = pArgument.sidepanel;

				// ���j���[��{�ݒ�
				if ( 'menu' in pArgument ) {
					var wArgumentMenu = pArgument['menu'];
					if ( this.isObject(wArgumentMenu) ) {
						// �֌W���j���[
						if ( 'relation' in wArgumentMenu ) {
							var wMenuRelation = wArgumentMenu['relation'];

							wMenuRelationStat = {};
							for( var wRelKey in wMenuRelation ) wMenuRelationStat[wRelKey] = wMenuRelation[wRelKey];
						}
					}

				}

				// Callback�֐��ۑ�
				this._MainFuncChgStat	= pArgument.statfunc;
				this._MainFuncChgPos	= pArgument.posfunc;
			}

			// --------------------------------
			// ���ʃT�u���j���[����
			// --------------------------------
			// �T�u���j���[�i�F�j�ݒ�
			this._MainPublicMenu.common.color = new clsColorBox();

			// �T�u���j���[�i�t�@�C���I���j�ݒ�
			this._MainPublicMenu.common.file = new clsFileBox();

			// �T�u���j���[�i�ʒu�����j�ݒ�
			this._MainPublicMenu.common.position = new clsMenuList();

			// --------------------------------
			// ���ʃT�u���j���[�@�l��
			// --------------------------------
			// �T�u���j���[�i�R���e�L�X�g�j�ݒ�
			this._MainPublicMenu.person.context = new clsMenuList();

			// �T�u���j���[�i���ݒ�j�ݒ�
			this._MainPublicMenu.person.listStat = new clsMenuList();

			// �T�u���j���[�i���ݒ� - ��{���j�ݒ�
			this._MainPublicMenu.person.statBase = new clsMenuStatus();

			// �T�u���j���[�i���ݒ� - �A�C�R���j�ݒ�
			this._MainPublicMenu.person.icon = new clsMenuIcon( );

			// �T�u���j���[�i���ݒ� - �A����j�ݒ�
			this._MainPublicMenu.person.contact = new clsMenuStatus();

			// �T�u���j���[�i�֘A�t���j�ݒ�
			this._MainPublicMenu.person.relation = new clsMenuRelation( { 
														   relKind	: 'item-person'
														 , config	: wMenuRelationStat
														 , publicMenu: {
														 	  color		: this._MainPublicMenu.common.color
														 	, position	: this._MainPublicMenu.common.position
														  }
												} );
			// �T�u���j���[�i�ʒu�����j�ݒ�
			this._MainPublicMenu.person.position = new clsMenuList();

			// --------------------------------
			// ���ʃT�u���j���[�@�O���[�v
			// --------------------------------
			// �T�u���j���[�i�R���e�L�X�g�j�ݒ�
			this._MainPublicMenu.group.context = new clsMenuList();

			// �T�u���j���[�i���ݒ� - ��{���j�ݒ�
			this._MainPublicMenu.group.statBase = new clsMenuStatus();

			// �T�u���j���[�i���ݒ� - �A����j�ݒ�
			this._MainPublicMenu.group.contact = new clsMenuStatus();

			// �T�u���j���[�i�֘A�t���j�ݒ�
			this._MainPublicMenu.group.relation = new clsMenuRelation( { 
														   relKind	: 'item-group'
														 , config	: wMenuRelationStat
														 , publicMenu: {
														 	  color		: this._MainPublicMenu.common.color
														 	, position	: this._MainPublicMenu.common.position
														  }
												} );

			// �T�u���j���[�i�ʒu�����j�ݒ�
			this._MainPublicMenu.group.position = new clsMenuList();

			// --------------------------------
			// ���ʃT�u���j���[�@�R�����g
			// --------------------------------
			// �T�u���j���[�i�R���e�L�X�g�j�ݒ�
			this._MainPublicMenu.comment.context = new clsMenuList();

			// �T�u���j���[�i���ݒ� - ��{���j�ݒ�
			this._MainPublicMenu.comment.statBase = new clsMenuStatus();

			// �T�u���j���[�i�T�C�Y�ݒ�j�ݒ�
			this._MainPublicMenu.comment.listSize = new clsMenuList();

			// �T�u���j���[�i�T�C�Y�ݒ�j�ݒ�
			this._MainPublicMenu.comment.listWeight = new clsMenuList();

			// �T�u���j���[�i�ʒu�����j�ݒ�
			this._MainPublicMenu.comment.position = new clsMenuList();

			// --------------------------------
			// ���ʃT�u���j���[�@�֘A�t�����p�_
			// --------------------------------
			// �T�u���j���[�i�R���e�L�X�g�j�ݒ�
			this._MainPublicMenu.relation.context = new clsMenuList();

			// �T�u���j���[�i�֘A�t���j�ݒ�
			this._MainPublicMenu.relation.relation = new clsMenuRelation( { 
														   relKind	: 'item-relation'
														 , config	: wMenuRelationStat
														 , publicMenu: {
														 	  color		: this._MainPublicMenu.common.color
														 	, position	: this._MainPublicMenu.common.position
														  }
												} );

			// --------------------------------
			// ���ʃT�u���j���[�@�t���[���C��
			// --------------------------------
			// �T�u���j���[�i�R���e�L�X�g�j�ݒ�
			this._MainPublicMenu.freeline.context = new clsMenuList();

			// �T�u���j���[�i����ݒ�j�ݒ�
			this._MainPublicMenu.freeline.lineStyle = new clsMenuList();

			// �T�u���j���[�i�����ݒ�j�ݒ�
			this._MainPublicMenu.freeline.lineWidth = new clsMenuList();

			// �T�u���j���[�i�ʒu�����j�ݒ�
			this._MainPublicMenu.freeline.position = new clsMenuList();


			// --------------------------------
			// �T�C�h�p�l���ݒ�
			// --------------------------------
			if ( wIsSidePanel ) {
				// �����샍�b�N���͕ҏW���j���[�Ȃ�
				var wParamPanelSide = {
							  display		: true 
							, callback		: this.eventSidePanelChange
				};
				self.copyProperty( pArgument, wParamPanelSide );

				this._MainPanelSide = new clsPanelSide( wParamPanelSide );

			}


			// --------------------------------
			// ��R���e���c�ݒ�
			// --------------------------------
			var wParamContentsBox = {
						  publicMenu	: this._MainPublicMenu
						, callback		: this.eventContentsChange
						, editMenu		: false
			};
			self.copyProperty( pArgument, wParamContentsBox );

			this._MainPanelContents = new clsContentsBox( wParamContentsBox );


			// --------------------------------
			// �p�l���R���g���[������
			// --------------------------------
			var wMainPanel = null;
			if ( this._MainPanelContents ) wMainPanel = this._MainPanelContents.getBoxElement();

			var wSidePanel = null;
			if ( this._MainPanelSide ) wSidePanel = this._MainPanelSide.getBoxElement();

			var wParamPanelControl = {
						  panelLeft		: wSidePanel
						, panelRight	: wMainPanel
			};
			self.copyProperty( pArgument, wParamPanelControl );

			this._MainPanelControl = new clsPanelControl( wParamPanelControl );

		} catch(e) {
			throw { name: 'clsDrawMain.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsDrawMain.prototype.freeClass = function() {
		try {
			// �N���X�J��
			for( var wKey in this._MainPublicMenu ) {
				var wMenuItems = this._MainPublicMenu[wKey];
				
				if ( this.isObject(wMenuItems) ) {
					for( var wMenuId in wMenuItems ) {
						try {
							if ( wMenuItems[wMenuId].freeClass ) wMenuItems[wMenuId].freeClass();
						} catch(ef) {};
					}
				}
			}

			if ( this._MainPanelSide ) {
				try {
					if ( this._MainPanelSide.freeClass ) this._MainPanelSide.freeClass();
				} catch(e1) {};
			}

			if ( this._MainPanelContents ) {
				try {
					if ( this._MainPanelContents.freeClass ) this._MainPanelContents.freeClass();
				} catch(e2) {};
			}
			if ( this._MainPanelControl ) {
				try {
					if ( this._MainPanelControl.freeClass ) this._MainPanelControl.freeClass();
				} catch(e3) {};
			}

			// �v���p�e�B�J��
			this._MainPublicMenu			= null;
			this._MainPanelSide				= null;
			this._MainPanelContents			= null;
			this._MainPanelControl			= null;

		} catch(e) {}
	};

}());
