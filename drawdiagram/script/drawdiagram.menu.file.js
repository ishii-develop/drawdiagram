// --------------------------------------------------------------------
//
// �t�@�C���I��\���N���X
//
// --------------------------------------------------------------------
// clsFileBox �� clsMenuBase �� clsBaseBox
// --------------------------------------------------------------------
var clsFileBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_FILE_KIND		= 'menu-file';

		this._DEF_MENU_FILE_PROPERTY	= {
			 'z-index'				: '4100'
		};


		// �p�����N���X��prototype
		this._MenuPrototype				= null;

		this._FileLoadData				= null;


		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �t�@�C���I�����C�x���g
		this.eventFileSelect = function( pEvent ) {
			try {
				if ( !pEvent ) return false;
				if ( !pEvent.target ) return false;

				// �擾�t�@�C��������擾
				var wFileName = '';
				var wSelFiles = pEvent.target.files;
				if ( wSelFiles ) {
					if ( wSelFiles.length ) {
						// �擾�t�@�C�����ۑ�
						self.getLoadFileData( wSelFiles[0] );
					}
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ����{�^���������C�x���g
		this.eventFileCancel = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ����
				self.hideMenu();

				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, { kind: 'close' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �m��{�^���������C�x���g
		this.eventFileConfirm = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ����
				self.hideMenu();

				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, { kind: 'file', fileData: self._FileLoadData } );

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
		throw { name: 'clsFileBox.' + e.name, message: e.message };
	}
};


// ��{���j���[ prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsFileBox, clsMenuBase );

	// **************************************************************
	// �t�@�C���Ǎ�
	// **************************************************************

	// �t�@�C���Ǎ�
	clsFileBox.prototype.getLoadFileData = function( pFile ) {
		try {
			var self = this;

			// ���e�擾
			var wReader = new FileReader();
			var wFileName = pFile.name;

			// �t�@�C���Ǎ���̏���
			wReader.onload = function() {
				// ���e��ۑ�
				self._FileLoadData = wReader.result;

				// �����擾�����t�@�C������\��
				var wTextId  = self.getBoxId() + '_base' + '_text';
				var wTextEle = self.getElement(wTextId);
				if ( wTextEle ) {
					wTextEle.value = wFileName;
				}
			};

			// �t�@�C���Ǎ��G���[
			wReader.onerror = function() {
				var wError = wReader.error;

				// ���f
				wReader.abort();

				// ��O�𔭐�
				throw { name: 'FileReader.readAsText', message: wError };
			};

			// �t�@�C���Ǎ�
			wReader.readAsText( pFile );

		} catch(e) {
			throw { name: 'getLoadFileData.' + e.name, message: e.message };
		}
	};

	
	// **************************************************************
	// �C�x���g�ݒ�
	// **************************************************************

	// ����{�^���@�C�x���g�ݒ�
	clsFileBox.prototype.addCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventFileCancel );

			}

		} catch(e) {
			throw { name: 'addCancelEvent.' + e.name, message: e.message };
		}
	};

	// ����{�^���@�C�x���g�폜
	clsFileBox.prototype.delCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  + '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventFileCancel );

			}

		} catch(e) {
			throw { name: 'delCancelEvent.' + e.name, message: e.message };
		}
	};

	// �m��{�^���@�C�x���g�ݒ�
	clsFileBox.prototype.addConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventFileConfirm );

			}

		} catch(e) {
			throw { name: 'addConfirmEvent.' + e.name, message: e.message };
		}
	};

	// �m��{�^���@�C�x���g�폜
	clsFileBox.prototype.delConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  + '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventFileConfirm );

			}

		} catch(e) {
			throw { name: 'delConfirmEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�쐬
	// **************************************************************

	// �t�@�C���I��v�f
	clsFileBox.prototype.addFileElement = function( ) {
		try {
			var wId  = this.getBoxId() + '_base';
			var wDivEle = this.addElement( 'div', wId );
			if ( !wDivEle ) return false;

			// style�ݒ�
			this.addClass( wDivEle, 'cssMenuFile-select' );

			// �v�f�ǉ�
			this.appendBoxToParent( wDivEle );

			// ���e�ݒ�
			var wFileId = wId + '_file';
			var wTextId = wId + '_text';
			
			var wHtml = '';
			wHtml += "<div class='cssMenuFile-text'><input type='text' id='" + wTextId + "' readonly ></div>";
			wHtml += "<label>";
			wHtml += "<div class='cssMenuFile-file'>�I��</div>";
			wHtml += "<input type='file' id='" + wFileId + "' style='display: none;'>";
			wHtml += "</label>";

			wDivEle.innerHTML = wHtml;

			// �t�@�C���I���C�x���g�ݒ�
			var wFileEle = this.getElement(wFileId);
			if ( wFileEle ) {
				this.addEvent( wFileEle, 'onchange', this.eventFileSelect );
			}

		} catch(e) {
			throw { name: 'addFileElement.' + e.name, message: e.message };
		}
	};

	// �{�^���v�f�G���A�ǉ�
	clsFileBox.prototype.addFileCommand = function() {
		try {
			var wId  = this.getBoxId() + '_cmd';

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssMenuFile-cmd' );

			var wHtml = "";

			if ( !this.autoCloseIs() ) {
				var wCloseId = wId + '_close';
				wHtml += "<a id='" + wCloseId + "' href='javascript:void(0);'>��ݾ�</a>";
			}

			var wOkId = wId + '_confirm';
			wHtml += "<a id='" + wOkId + "' href='javascript:void(0);'>OK</a>";

			wDivEle.innerHTML = wHtml;
			this.appendBoxToParent( wDivEle );
			
			// �L�����Z���{�^���փC�x���g�ǉ�
			this.addCancelEvent();

			// �m��{�^���փC�x���g�ǉ�
			this.addConfirmEvent();

		} catch(e) {
			throw { name: 'addFileCommand.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[�v�f�������ݒ�
	clsFileBox.prototype.createMenu = function() {
		try {
			// �t�@�C���I��v�f
			this.addFileElement();

			// �{�^���G���A����
			this.addFileCommand();

			// �p���������ݒ�
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsFileBox.createMenu' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsFileBox.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_FILE_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu-file�v
				wInitArgument.kind = this._DEF_MENU_FILE_KIND;
			}

			// �}�E�X�͈͊O��close�Ȃ�
			wInitArgument.autoClose = false;

			// ���j���[���e�ݒ�
			if ( pArgument ) {

			}

			// �p�����R���X�g���N�^
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssMenuFile-base' );

		} catch(e) {
			throw { name: 'clsFileBox.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsFileBox.prototype.freeClass = function() {
		try {
			this.execFunction( this.delCancelEvent );
			this.execFunction( this.delConfirmEvent );

			// �v���p�e�B�J��
			this._FileLoadData				= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};

}());
