// --------------------------------------------------------------------
//
// ��{���j���[�N���X
//
// --------------------------------------------------------------------
// clsMenuBase �� clsBaseBox
// --------------------------------------------------------------------
var clsMenuBase = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_KIND			= 'menu';

		this._DEF_MENU_PROPERTY		= {
			 'z-index'				: '3000'
		};

		// �p�����N���X��prototype
		this._BasePrototype			= null;

		this._MenuSize				= null;
		this._MenuCallback			= null;
		this._MenuDisplay			= false;
		this._MenuAutoClose			= true;

		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �}�E�X�͈͊O�Ń��j���[����
		this.eventMenuMouseleave = function( pEvent ) {
			try {
				self.dspMenuElement( false );

				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, { kind: 'close' } );

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
		throw { name: 'clsMenuBase.' + e.name, message: e.message };
	}
};

// ��{���j���[ prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsMenuBase, clsBaseBox );

	// **************************************************************
	// �v���p�e�B�ݒ�
	// **************************************************************

	// Callback�֐�
	clsMenuBase.prototype.setCallBack = function( pFunction ) {
		try {
			if ( typeof pFunction !== 'function' ) return;

			this._MenuCallback = pFunction;

		} catch(e) {
			throw { name: 'setCallBack', message: e.message };
		}
	};

	// Callback�֐��@�ݒ�L��
	clsMenuBase.prototype.isCallback = function() {
		try {
			return (typeof this._MenuCallback == 'function');

		} catch(e) {
			throw { name: 'isCallback', message: e.message };
		}
	};

	// ������\���L��
	clsMenuBase.prototype.autoCloseIs = function() {
		try {
			return this._MenuAutoClose;

		} catch(e) {
			throw { name: 'autoCloseIs', message: e.message };
		}
	};

	// **************************************************************
	// �v���p�e�B�擾
	// **************************************************************

	// Callback�֐�
	clsMenuBase.prototype.execCallBack = function( ) {
		try {
			if ( typeof this._MenuCallback !== 'function' ) return false;

			// �����ݒ�
			var wArguments;
			if ( arguments.length > 0 ) {
				wArguments = Array.prototype.slice.call(arguments, 0);

			} else {
				wArguments = [];

			}
			this._MenuCallback.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execCallBack', message: e.message };
		}
	};


	// ���ʃ��j���[�擾
	clsMenuBase.prototype.loadPublicMenu = function( pMenuId ) {
		try {
			var wPublicMenu = this.loadArgument( 'publicMenu' );
			if ( !wPublicMenu ) return null;

			// Key�w��Ȃ���ΑS��
			if ( typeof pMenuId == 'string' ) {
				if ( !(pMenuId in wPublicMenu) ) return null;
				return wPublicMenu[pMenuId];
			
			} else {
				return wPublicMenu;

			}

		} catch(e) {
			throw { name: 'loadPublicMenu', message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�\��
	// **************************************************************

	// ���j���[�\��
	clsMenuBase.prototype.dspMenuElement = function( pDisplay ) {
		try {
			this.dspBox( pDisplay );

			// ����closey�L����
			if ( this._MenuAutoClose ) {
				// �}�E�X����C�x���g
				if ( pDisplay ) {
					this.addBoxEvents( 'onmouseleave', this.eventMenuMouseleave );
				} else {
					this.delBoxEvents( 'onmouseleave', this.eventMenuMouseleave );
				}
			
			}

			// �\�����̓t�H�[�J�X
			var wMenuEle = this.getBoxElement();
			if ( pDisplay ) wMenuEle.focus();

			this._MenuDisplay = pDisplay;

		} catch(e) {
			throw { name: 'dspMenuElement.' + e.name, message: e.message };
		}
	};

	// ���j���[�̃T�C�Y�擾
	clsMenuBase.prototype.saveMenuSize = function() {
		try {
			// �\������Ă��Ȃ�
			var wSavePos = { left: null, top: null };
			if ( !this._MenuDisplay ) {
				// �ʒu�ۑ�
				wSavePos.left = this.getBoxStyle( 'left' );
				wSavePos.top  = this.getBoxStyle( 'top' );

				// �\���͈͊O�ň�U�\��
				this.setBoxStyle( { left: '-200px', top: '-200px' } );
				this.dspBox( true );
			}

			this._MenuSize = this.getBoxSize();

			// ��\���ɖ߂�
			if ( !this._MenuDisplay ) {
				this.dspBox( false );

				// �ʒu�߂�
				if ( wSavePos.left ) this.setBoxStyle( { left: wSavePos.left } );
				if ( wSavePos.top  ) this.setBoxStyle( { top: wSavePos.top } );

			}

		} catch(e) {
			throw { name: 'saveMenuSize.' + e.name, message: e.message };
		}
	};

	// �ʒu���Ē���
	clsMenuBase.prototype.resetPosition = function() {
		try {
			var wBoxPos		= this.getBoxPos();
			var wParentPos	= this.getParentPos();

			// ���\���ʒu
			var wPoint = {};
			wPoint.y = (wBoxPos.top  + wParentPos.top);
			wPoint.x = (wBoxPos.left + wParentPos.left);

			// �e�̃X�N���[���l���Z
			var wParentScroll = this.getParentScroll();
			wPoint.y -= wParentScroll.y;
			wPoint.x -= wParentScroll.x;

			// �ʒu�␳
			this.setBoxPos( wPoint, { shift: false, correct: true, size: this._MenuSize } );

		} catch(e) {
			throw { name: 'dspMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[��\������
	clsMenuBase.prototype.dspMenu = function( pParam ) {
		try {
			if ( pParam ) {
				// �\���ʒu
				if ( (typeof pParam.x !== 'undefined') || (typeof pParam.y !== 'undefined') ) {
					var wPoint = { x: pParam.x, y: pParam.y };
					if ( typeof wPoint.x == 'undefined' ) wPoint.x = 0;
					if ( typeof wPoint.y == 'undefined' ) wPoint.y = 0;

					this.setBoxPos( wPoint, { shift: true, correct: true, size: this._MenuSize } );
				}

				// ���j���[���쎞�C�x���g�ݒ�
				this.setCallBack( pParam.callback );
			}

			// �\��
			this.dspMenuElement( true );

		} catch(e) {
			throw { name: 'clsMenuBase.dspMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[���\��
	clsMenuBase.prototype.hideMenu = function() {
		try {
			this.dspMenuElement( false );

		} catch(e) {
			throw { name: 'clsMenuBase.hideMenu.' + e.name, message: e.message };
		}
	};

	// �R���e�L�X�g���j���[������
	clsMenuBase.prototype.setMenuContext = function() {
		try {
			// �s�v�ȃC�x���g�𖳌���
			this.addBoxEvents( 'oncontextmenu'	, this.eventInvalid );

		} catch(e) {
			throw { name: 'clsMenuBase.setMenuContext.' + e.name, message: e.message };
		}
	};

	// ���j���[�v�f�������ݒ�
	clsMenuBase.prototype.createMenu = function() {
		try {
			// �� html�����͌p����Ŏ�������

			// ���j���[�T�C�Y�ۑ�
			this.saveMenuSize();

		} catch(e) {
			throw { name: 'clsMenuBase.createMenu', message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsMenuBase.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu�v
				wInitArgument.kind = this._DEF_MENU_KIND;

			}

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssMenu-base' );

			if ( pArgument ) {
				// Callback�w�莞
				if ( typeof pArgument.callback !== 'undefined' ) {
					this.setCallBack( pArgument.callback );

				}
				
				// ����close�w�莞
				if ( typeof pArgument.autoClose !== 'undefined' ) {
					this._MenuAutoClose = pArgument.autoClose;

				}
				
			}

			// �C�x���g�ݒ�
			this.setMenuContext();

			// ���j���[�����ݒ�
			this.createMenu();

		} catch(e) {
			throw { name: 'clsMenuBase.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsMenuBase.prototype.freeClass = function() {
		try {
			// �v���p�e�B�J��
			this._MenuSize				= null;
			this._MenuCallback			= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};

}());
