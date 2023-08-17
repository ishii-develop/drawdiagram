// --------------------------------------------------------------------
//
// �X�e�[�^�X�\���N���X
//
// --------------------------------------------------------------------
// clsMenuStatus �� clsMenuBase �� clsBaseBox
// --------------------------------------------------------------------
var clsMenuStatus = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_STATUS_KIND				= 'menu-status';

		this._DEF_MENU_STATUS_PROPERTY			= {
			 'z-index'				: '1200'
		};

		// �X�e�[�^�X��style
		this._DEF_MENU_STATUS_LIST_PROPERTY		= {
			 'z-index'				: '1210'
		};

		// �p�����N���X��prototype
		this._MenuPrototype						= null;

		this._StatusList						= [];
		this._StatusListMax						= 0;
		this._StatusValue						= {};

		this._StatusAddCmd						= false;
		this._StatusAddList						= [];

		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �ǉ��{�^���������C�x���g
		this.eventStatusAdd = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �A�����ǉ�
				self.execAddStatus();

				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, { kind: 'close' } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ����{�^���������C�x���g
		this.eventStatusCancel = function( pEvent ) {
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
		this.eventStatusConfirm = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ����
				self.hideMenu();

				// �ݒ���e�ۑ�
				var wStatList = self.getCallbackList();
				var wStatVal  = self.getCallbackValue();

				// ���j���[�ďo���̊֐���call
				self.execCallBack( pEvent, { kind: 'status', statusList: wStatList, statusValue: wStatVal } );

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
		throw { name: 'clsMenuStatus.' + e.name, message: e.message };
	}
};

// ��{���j���[ prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsMenuStatus, clsMenuBase );


	// **************************************************************
	// �v���p�e�B�ݒ�^�擾
	// **************************************************************

	// �X�e�[�^�X���e���L����
	clsMenuStatus.prototype.isStatusList = function() {
		try {
			if ( !this._StatusList ) return false;
			if ( !this._StatusList.length ) return false;
			
			return true;

		} catch(e) {
			throw { name: 'isStatusList', message: e.message };
		}
	};

	// �X�e�[�^�X���e�������ݒ�
	clsMenuStatus.prototype.setStatusList = function( pArgument ) {
		try {
			var wArgMenu = pArgument.statusList;
			if ( !wArgMenu ) return false;

			// ��U�N���A
			this._StatusList = [];

			if ( this.isArray(wArgMenu) ) {
				// ���e�𕡎�
				for( var wIdx = 0; wIdx < wArgMenu.length; wIdx++ ) {
					this._StatusList.push( wArgMenu[wIdx] );

				}

			// object�w��
			} else if ( this.isObject(wArgMenu) ) {
				// Key���Ƀ\�[�g
				var wSortMenu = this.sortNumObject( wArgMenu );
				// �z��ɂ��Đݒ�
				for( var wKey in wSortMenu ) {
					if ( this.isArray(wSortMenu[wKey]) ) {
						this._StatusList.push( wSortMenu[wKey] );

					} else if( this.isObject(wSortMenu[wKey]) ) {
						this._StatusList.push( [ wSortMenu[wKey] ] );

					}
				}

			} else {
				return false;

			}

			return true;

		} catch(e) {
			throw { name: 'setStatusList', message: e.message };
		}
	};

	// �X�e�[�^�X���e�i�ǉ����ځj�������ݒ�
	clsMenuStatus.prototype.setStatusAddList = function( pArgument ) {
		try {
			var wArgMenu = pArgument.statusAddList;
			if ( !wArgMenu ) return false;

			// ��U�N���A
			this._StatusAddList = [];

			if ( this.isArray(wArgMenu) ) {
				// ���e�𕡎�
				for( var wIdx = 0; wIdx < wArgMenu.length; wIdx++ ) {
					this._StatusAddList.push( wArgMenu[wIdx] );

				}

			// object�w��
			} else if ( this.isObject(wArgMenu) ) {
				// Key���Ƀ\�[�g
				var wSortMenu = this.sortNumObject( wArgMenu );
				// �z��ɂ��Đݒ�
				for( var wKey in wSortMenu ) {
					if ( this.isArray(wSortMenu[wKey]) ) {
						this._StatusAddList.push( wSortMenu[wKey] );

					} else if( this.isObject(wSortMenu[wKey]) ) {
						this._StatusAddList.push( [ wSortMenu[wKey] ] );

					}
				}

			} else {
				return false;

			}

			// �ǉ����ڂ���Βǉ��L��
			if ( this._StatusAddList.length > 0 ) this._StatusAddCmd = true;

			return true;

		} catch(e) {
			throw { name: 'setStatusAddList', message: e.message };
		}
	};

	// �X�e�[�^�X�ݒ�l��ۑ�
	clsMenuStatus.prototype.saveStatusValue = function( pArgument ) {
		try {
			var wArgValue = pArgument.statusValue;
			if ( !wArgValue ) return;

			// ��U�N���A
			this._StatusValue = {};

			for( var wKey in wArgValue ) {
				this._StatusValue[wKey] = wArgValue[wKey];
			}

		} catch(e) {
			throw { name: 'saveStatusValue', message: e.message };
		}
	};

	// ���͒l��ݒ�
	clsMenuStatus.prototype.setStatusValue = function() {
		try {
			if ( !this.isStatusList() ) return false;

			var wId;
			var wValue;
			var wStatusInf;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusInf = this._StatusList[wIdx][wCol];

					wId = this.getBoxId() + '_' + wStatusInf.name;

					wValue = this._StatusValue[wStatusInf.name];
					if ( typeof wValue == 'undefined' ) continue;

					// �v�f�ɒl��ݒ�
					switch( wStatusInf.type ) {
					case 'text':
						this.setElementValue( wId, wValue );
						break;
					
					case 'text-combo':
						this.setElementValue( wId, wValue );
						break;
					
					case 'textarea':
						this.setElementValue( wId, wValue );
						break;
					
					case 'check':
						this.setElementChkVal( wId, wValue );
						break;
					}

				}

			}

		} catch(e) {
			throw { name: 'setStatusValue', message: e.message };
		}
	};

	// �Ԃ��ݒ���e���擾
	clsMenuStatus.prototype.getCallbackList = function() {
		try {
			if ( !this.isStatusList() ) return null;

			var wStatusList = {};

			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				var wStatusLine = [];
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusLine.push( {} );
					this.copyProperty( this._StatusList[wIdx][wCol], wStatusLine[wCol] );

				}

				wStatusList[(wIdx + 1)] = wStatusLine;

			}
			return wStatusList;

		} catch(e) {
			throw { name: 'getCallbackList', message: e.message };
		}
	};
	
	// �Ԃ����͒l���擾
	clsMenuStatus.prototype.getCallbackValue = function() {
		try {
			if ( !this.isStatusList() ) return null;

			var wStatusValue = {};

			var wId;
			var wStatusInf;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatusInf = this._StatusList[wIdx][wCol];

					wId = this.getBoxId() + '_' + wStatusInf.name;

					// �v�f�̒l���擾
					switch( wStatusInf.type ) {
					case 'text':
						wStatusValue[wStatusInf.name] = this.getElementValue( wId );
						break;
					
					case 'text-combo':
						wStatusValue[wStatusInf.name] = this.getElementValue( wId );
						break;
					
					case 'textarea':
						wStatusValue[wStatusInf.name] = this.getElementValue( wId );
						break;
					
					case 'check':
						wStatusValue[wStatusInf.name] = this.getElementChkVal( wId );
						break;
					}

				}

			}
			return wStatusValue;

		} catch(e) {
			throw { name: 'getCallbackValue', message: e.message };
		}
	};


	// **************************************************************
	// �C�x���g�ݒ�
	// **************************************************************

	// �C�x���g�L�����Z��
	clsMenuStatus.prototype.cancelStatusEvent = function() {
		try {
			// ���T�u���j���[�\������ꍇ�͂�����close

		} catch(e) {
			throw { name: 'cancelStatusEvent.' + e.name, message: e.message };
		}
	};

	// �ǉ��{�^���@�C�x���g�ݒ�
	clsMenuStatus.prototype.addAddEvent = function() {
		try {
			if ( !this._StatusAddCmd ) return;

			var wCloseId = this.getBoxId() +  '_cmd' + '_add';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventStatusAdd );

			}

		} catch(e) {
			throw { name: 'addAddEvent.' + e.name, message: e.message };
		}
	};

	// ����{�^���@�C�x���g�폜
	clsMenuStatus.prototype.delAddEvent = function() {
		try {
			if ( !this._StatusAddCmd ) return;

			var wCloseId = this.getBoxId() +  + '_cmd' + '_add';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventStatusAdd );

			}

		} catch(e) {
			throw { name: 'delAddEvent.' + e.name, message: e.message };
		}
	};

	// ����{�^���@�C�x���g�ݒ�
	clsMenuStatus.prototype.addCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventStatusCancel );

			}

		} catch(e) {
			throw { name: 'addCancelEvent.' + e.name, message: e.message };
		}
	};

	// ����{�^���@�C�x���g�폜
	clsMenuStatus.prototype.delCancelEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wCloseId = this.getBoxId() +  + '_cmd' + '_close';

			var wCmdLnk = this.getElement(wCloseId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventStatusCancel );

			}

		} catch(e) {
			throw { name: 'delCancelEvent.' + e.name, message: e.message };
		}
	};

	// �m��{�^���@�C�x���g�ݒ�
	clsMenuStatus.prototype.addConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.addEvent( wCmdLnk, 'onclick', this.eventStatusConfirm );

			}

		} catch(e) {
			throw { name: 'addConfirmEvent.' + e.name, message: e.message };
		}
	};

	// �m��{�^���@�C�x���g�폜
	clsMenuStatus.prototype.delConfirmEvent = function() {
		try {
			if ( this.autoCloseIs() ) return;

			var wConfirmId = this.getBoxId() +  + '_cmd' + '_confirm';

			var wCmdLnk = this.getElement(wConfirmId);
			if ( wCmdLnk ) {
				this.delEvent( wCmdLnk, 'onclick', this.eventStatusConfirm );

			}

		} catch(e) {
			throw { name: 'delConfirmEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �v�f�ݒ�
	// **************************************************************

	// �s�v�f�ǉ�
	clsMenuStatus.prototype.addStatusLineBase = function( pIdx, pRefEle ) {
		try {
			var wId  = this.getBoxId() + '_status_' + String(pIdx);

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssStatus-line' );
			this.setStyle( wDivEle, this._DEF_MENU_STATUS_LIST_PROPERTY );

			this.appendBoxToParent( wDivEle, pRefEle );

			return wId;

		} catch(e) {
			throw { name: 'addStatusLineBase.' + e.name, message: e.message };
		}
	};

	// �s�v�f�ǉ�
	clsMenuStatus.prototype.resetStatusLineBase = function( pIdx ) {
		try {
			var wId  = this.getBoxId() + '_status_' + String(pIdx);

			var wDivEle = this.getElement( wId );
			if ( !wDivEle ) return null;
			
			this.setStyle( wDivEle, { display: 'block' } );

			return wId;

		} catch(e) {
			throw { name: 'resetStatusLineBase.' + e.name, message: e.message };
		}
	};

	// ���͗v�f�ǉ�
	clsMenuStatus.prototype.addStatusLineContents = function( pDivId, pStatusItem ) {
		try {
			var self = this;

			// �����e�ݒ�
			var getStatusHtml = function( pId, pContents, pValues, pLast ) {
				var wStatId = pId + '_' + pContents.name;

				var wValue = '';
				if ( self.isObject(pValues) ) {
					if ( typeof pValues[pContents.name] !== 'undefined' ) wValue = pValues[pContents.name];
				}

				var wDesignHead = false;
				var wDesignData = false;
				var wDesignInput = false;
				if ( pContents.design ) {
					if ( pContents.design.head ) wDesignHead = true;
					if ( pContents.design.data ) wDesignData = true;
					if ( pContents.design.input ) wDesignInput = true;
				}

				var wStatTbl = '';

				var wThStyle = '';
				var wThInput = '';
				if ( wDesignHead ) {
					wThStyle = "style='"
					for( var wKey in pContents.design.head ) {
						wThStyle += wKey + ':' + pContents.design.head[wKey] + ';';
						// width�̂�header��input�ɐݒ�
						if ( String(wKey) == 'width' ) wThInput = " style='width: " + pContents.design.head[wKey] + ";' "
					}
					wThStyle += "'"
				}

				var wHedPrm = '';
				wHedPrm += " name='" + wStatId + "_head'";
				wHedPrm += " id='" + wStatId + "_head'";
				wHedPrm += " value='" + self.toHtml(pContents.title) + "'";

				wStatTbl += "<th class='header'" + wThStyle + ">";
				wStatTbl += "<div><input type='text' " + wHedPrm + wThInput + " ReadOnly tabindex='-1' /></div>";
				wStatTbl += "</th>";

				var wTdStyle = '';
				if ( wDesignData ) {
					wTdStyle = " style='"
					for( var wKey in pContents.design.data ) {
						// �ŏI���width�͐ݒ肵�Ȃ�
						if ( !pLast || (wKey != 'width') ) {
							wTdStyle += wKey + ':' + pContents.design.data[wKey] + ';';
						}
					}
					wTdStyle += "'"
				}

				var wInpPrm = '';

				var wInpStyle = '';
				if ( wDesignInput ) {
					wInpStyle = " style='";
					for( var wKey in pContents.design.input ) {
						wInpStyle += wKey + ':' + pContents.design.input[wKey] + ';';
					}
					wInpStyle += "' ";
				}

				switch ( pContents.type ) {
				case 'text':
					wInpPrm = "<input type='text' ";
					wInpPrm += " name='"	+ wStatId + "' ";
					wInpPrm += " id='"		+ wStatId + "' ";

					wInpPrm += " value='" + self.toHtml(wValue) + "' ";

					if ( pContents.length ) wInpPrm += " maxlength='" + pContents.length + "' ";
					wInpPrm += wInpStyle + " />"; 
					break;

				case 'text-combo':
					wInpPrm = "<input type='text' ";
					wInpPrm += " name='"	+ wStatId + "' ";
					wInpPrm += " id='"		+ wStatId + "' ";
					wInpPrm += " list='"	+ wStatId + "_list' ";

					wInpPrm += " value='" + self.toHtml(wValue) + "' ";

					if ( pContents.length ) wInpPrm += " maxlength='" + pContents.length + "' ";
					wInpPrm += wInpStyle + " />"; 
					
					// �f�[�^���X�g
					if ( pContents.list ) {
						wInpPrm += "<datalist id='" + wStatId + "_list'>";
						for( wLkey in pContents.list ) {
							wInpPrm += "<option value='" + pContents.list[wLkey] + "'>";
						}
						wInpPrm += "</datalist>";
					}
					break;

				case 'textarea':
					wInpPrm = "<textarea ";
					wInpPrm += " name='"	+ wStatId + "' ";
					wInpPrm += " id='"		+ wStatId + "' ";
					if ( pContents.cols ) wInpPrm += " cols='" + pContents.cols + "' ";
					if ( pContents.rows ) wInpPrm += " rows='" + pContents.rows + "' ";
					wInpPrm += wInpStyle + " />"; 

					wInpPrm += self.toHtml(wValue, true);

					wInpPrm += wInpStyle + "</textarea>"; 
					break;

				case 'check':
					if ( pContents.list ) {
						var wChecked;
						for( wLkey in pContents.list ) {
							if ( wInpPrm.length > 0 ) wInpPrm += '&nbsp;';

							wChecked = '';
							if ( String(wValue) == String(wLkey) ) wChecked = ' checked ';

							wInpPrm += "<input type='checkbox' ";
							wInpPrm += " name='"	+ wStatId + "' ";
							wInpPrm += " id='"		+ wStatId + "_" + wLkey + "' ";
							wInpPrm += " value='" + wLkey + "' ";
							wInpPrm += wInpStyle;
							wInpPrm += wChecked + " />"; 
							if ( pContents.list[wLkey] ) {
								wInpPrm += "<label for='" + wStatId + "_" + wLkey + "'>"; 
								wInpPrm += pContents.list[wLkey]; 
								wInpPrm += "<label/>"; 
							}
						}

					} else {
						var wDefault = pContents.default;
						if ( typeof wDefault == 'undefined' ) wDefault = '';

						var wChecked = '';
						if ( String(wDefault) == String(wValue) ) wChecked = ' checked ';

						wInpPrm += "<input type='checkbox' ";
						wInpPrm += " name='"	+ wStatId + "'";
						wInpPrm += " id='"		+ wStatId + "'";
						wInpPrm += " value='" + wDefault + "'";
						wInpPrm += wInpStyle;
						wInpPrm += wChecked + " />"; 
					}
					break;

				default:
					return '';
					break;
				}

				wStatTbl += "<td id='" + wStatId + "_td' class='data' " + wTdStyle + ">";
				wStatTbl += "<div>" + wInpPrm + "</div>"; 
				wStatTbl += "</td>";
				return wStatTbl;
			};

			var wId = this.getBoxId();
			var wTblId = wId + '_table';

			var wHtml = "<table id='" + wTblId + "' class='cssStatus-table' cellpadding='0' cellspacing='0'>";
			wHtml += "<tr>";

			var wLastCol = pStatusItem.length - 1;
			for( var wCol = 0; wCol < pStatusItem.length; wCol++ ) {
				wHtml += getStatusHtml( wId, pStatusItem[wCol], this._StatusValue, (wCol == wLastCol) );

			}
			wHtml += "</tr></table>";

			var wDivEle = this.getElement(pDivId);
			if ( wDivEle ) wDivEle.innerHTML = wHtml;

			return true;

		} catch(e) {
			throw { name: 'addStatusLineContents.' + e.name, message: e.message };
		}
	};

	// ���͗v�f�Đݒ�
	clsMenuStatus.prototype.resetStatusLineContents = function( pDivId, pStatusItem ) {
		try {
			var self = this;

			// �����e�ݒ�
			var setStatusDefault = function( pId, pContents, pValues, pLast ) {
				// �v�fID
				var wStatId = pId + '_' + pContents.name;

				// �����l�ݒ�
				var wValue = null;
				if ( self.isObject(pValues) ) {
					if ( typeof pValues[pContents.name] !== 'undefined' ) wValue = pValues[pContents.name];
				}
				if ( wValue == null ) wValue = pContents.default;

				switch ( pContents.type ) {
				case 'text':
					self.setElementValue( wStatId, wValue );
					break;

				case 'text-combo':
					self.setElementValue( wStatId, wValue );
					break;

				case 'textarea':
					self.setElementValue( wStatId, wValue );
					break;

				case 'check':
					self.setElementChkVal( wStatId, wValue );
					break;
					
				default:
					return;
					break;
				}
			};

			var wId = this.getBoxId();

			for( var wCol = 0; wCol < pStatusItem.length; wCol++ ) {
				setStatusDefault( wId, pStatusItem[wCol], this._StatusValue );

			}

		} catch(e) {
			throw { name: 'resetStatusLineContents.' + e.name, message: e.message };
		}
	};

	// �{�^���v�f�G���A�ǉ�
	clsMenuStatus.prototype.addStatusCommand = function() {
		try {
			var wId  = this.getBoxId() + '_cmd';

			var wDivEle = this.addElement( 'div', wId );
			this.addClass( wDivEle, 'cssStatus-cmd' );

			var wHtml = "";

			var wAddStyle = "style='position: absolute; left: 5px;";
			if ( !this._StatusAddCmd ) {
				wAddStyle += "display: none;";
			}
			wAddStyle += "'";

			var wAddId = wId + '_add';
			wHtml += "<a id='" + wAddId + "' href='javascript:void(0);' " + wAddStyle + ">�ǉ�</a>";

			if ( !this.autoCloseIs() ) {
				var wCloseId = wId + '_close';
				wHtml += "<a id='" + wCloseId + "' href='javascript:void(0);'>��ݾ�</a>";
			}

			var wOkId = wId + '_confirm';
			wHtml += "<a id='" + wOkId + "' href='javascript:void(0);'>OK</a>";

			wDivEle.innerHTML = wHtml;
			this.appendBoxToParent( wDivEle );
			
			// �ǉ��{�^���փC�x���g�ǉ�
			this.addAddEvent();

			// �L�����Z���{�^���փC�x���g�ǉ�
			this.addCancelEvent();

			// �m��{�^���փC�x���g�ǉ�
			this.addConfirmEvent();

		} catch(e) {
			throw { name: 'addStatusCommand.' + e.name, message: e.message };
		}
	};

	// ���͍��ڂփt�H�[�J�X��ݒ�
	clsMenuStatus.prototype.setFocusInput = function() {
		try {
			if ( !this.isStatusList() ) return;

			var wTarget;
			var wId = this.getBoxId();

			var wStatId;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				for( var wCol = 0; wCol < this._StatusList[wIdx].length; wCol++ ) {
					wStatId = wId + '_' + this._StatusList[wIdx][wCol].name;
					
					wTarget = this.getElement( wStatId );
					if ( wTarget ) break;

				}
				if ( wTarget ) break;
			}
			if ( !wTarget ) return;
			
			if ( wTarget.focus ) wTarget.focus();

		} catch(e) {
			throw { name: 'setFocusInput.' + e.name, message: e.message };
		}
	};

	// ���ځi�s�j�ǉ�
	clsMenuStatus.prototype.execAddStatus = function() {
		try {
			// �ǉ��s�ݒ�Ȃ���Ώ����Ȃ�
			if ( !this._StatusAddList ) return;
			if ( this._StatusAddList.length == 0 ) return;

			// �ݒ�ύ��ڂ̃C���f�b�N�X�ۑ�
			var wMaxIdx = this._StatusList.length;

			// �ǉ���i�{�^���G���A�̗v�f�j�擾
			var wRefId  = this.getBoxId() + '_cmd';
			var wRefEle = this.getElement( wRefId );

			var wAddMenu = [];
			for( var wLineIdx = 0; wLineIdx < this._StatusAddList.length; wLineIdx++ ) {
				var wLineItem = this._StatusAddList[wLineIdx];
				var wAddLine = [];

				for( var wColIdx = 0; wColIdx < wLineItem.length; wColIdx++ ) {
					var wAddItem = {};
					this.copyProperty( wLineItem[wColIdx], wAddItem );
					
					// ���̂�index�t�^
					wAddItem.name = wAddItem.name + '-' + String(wMaxIdx + wLineIdx + 1);

					// �擪���ڂ̃^�C�g���̂ݕҏW
					if ( wLineIdx == 0 ) {
						wAddItem.title = wAddItem.title + String(wMaxIdx + wLineIdx + 1);
					}

					wAddLine.push( wAddItem );
				
				}
				wAddMenu.push( wAddLine );
			}

			var wId;
			for( var wAddIdx = 0; wAddIdx < wAddMenu.length; wAddIdx++ ) {
				// ���e�ǉ�
				this._StatusList.push( wAddMenu[wAddIdx] );

				// �ǉ��s�����ɑ���
				if ( (wMaxIdx + wAddIdx + 1) <= this._StatusListMax ) {
					// �s�ĕ\��
					wId = this.resetStatusLineBase( (wMaxIdx + wAddIdx) );

					// ���e�Đݒ�
					if ( wId ) this.resetStatusLineContents( wId, this._StatusList[(wMaxIdx + wAddIdx)] );

				// �ǉ��s�Ȃ�
				} else {
					// �s�ǉ�
					wId = this.addStatusLineBase( (wMaxIdx + wAddIdx), wRefEle );

					// ���e�ݒ�
					this.addStatusLineContents( wId, this._StatusList[(wMaxIdx + wAddIdx)] );
					
					// �ő�l�X�V
					this._StatusListMax++;

				}

			}

			// window�T�C�Y�Đݒ�
			this.saveMenuSize();

			// �Ĕz�u
			this.resetPosition();

			// �ǉ����ڂփt�H�[�J�X�ݒ�
			var wAddId = this.getBoxId() + this._StatusList[wMaxIdx][0].name;
			var wAddEle = this.getElement( wAddId );
			if ( wAddEle ) {
				if ( wAddEle.focus ) wAddEle.focus();
			}

		} catch(e) {
			throw { name: 'execAddStatus.' + e.name, message: e.message };
		}
	};

	// ���j���[�v�f���Đݒ�
	clsMenuStatus.prototype.resetMenu = function() {
		try {
			var wListCnt = 0;
			if ( this.isStatusList() ) {
				wListCnt = this._StatusList.length;

			}

			// �ǉ���i�{�^���G���A�̗v�f�j�擾
			var wRefId  = this.getBoxId() + '_cmd';
			var wRefEle = this.getElement( wRefId );

			// �X�e�[�^�X�̊�{Id
			var wIdBs  = this.getBoxId() + '_status_';

			// �K�v����\���i����ђǉ��j
			var wAddId;
			var wLineEle;
			for( var wIdx = 0; wIdx < wListCnt; wIdx++ ) {
				// �s�\���ݒ�
				wLineEle = this.getElement(wIdBs + String(wIdx));
				if ( wLineEle ) {
					this.setStyle( wLineEle, { display: '' } );

				} else {
					// �s�ǉ�
					wAddId = this.addStatusLineBase( wIdx, wRefEle );
					
					// ���e�ݒ�
					this.addStatusLineContents( wAddId, this._StatusList[wIdx] );
					
					// �s���ۑ�
					this._StatusListMax++;

				}
			}

			// �]�����\��
			if ( wListCnt < this._StatusListMax ) {
				for( var wIdx = wListCnt; wIdx < this._StatusListMax; wIdx++ ) {
					wLineEle = this.getElement(wIdBs + String(wIdx));
					if ( wLineEle ) this.setStyle( wLineEle, { display: 'none' } );
				}
			}

			// window�T�C�Y�Đݒ�
			this.saveMenuSize();

			// �Ĕz�u
			this.resetPosition();

		} catch(e) {
			throw { name: 'resetMenu.' + e.name, message: e.message };
		}
	};

	
	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[�v�f�������ݒ�
	clsMenuStatus.prototype.createMenu = function() {
		try {
			if ( !this.isStatusList() ) return false;

			var wId;
			for( var wIdx = 0; wIdx < this._StatusList.length; wIdx++ ) {
				// �s�ǉ�
				wId = this.addStatusLineBase( wIdx );
				
				// ���e�ݒ�
				this.addStatusLineContents( wId, this._StatusList[wIdx] );
				
				// �s���ۑ�
				this._StatusListMax++;

			}
			
			// �{�^���ݒ�
			this.addStatusCommand();

			// �p���������ݒ�
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuStatus.createMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[��\������
	clsMenuStatus.prototype.dspMenu = function( pParam ) {
		try {
			// ���͒l�N���A
			this._StatusValue = {};

			if ( pParam ) {
				var wConfigured = this.isStatusList();

				// status���e�ݒ�
				this.setStatusList( pParam );

				// �ݒ�l�ۑ�
				this.saveStatusValue( pParam );

				// �ǉ����ڐݒ�
				this.setStatusAddList( pParam );

				// ���e���ݒ�
				if ( !wConfigured ) {
					// html�����ݒ�
					this.createMenu();
				
				} else {
					// html�Đݒ�
					this.resetMenu();
					
					// �ݒ�l���f
					this.setStatusValue();

				}
			}

			// �p�������j���[�\��
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}
			
			// ���̓G���A�Ƀt�H�[�J�X�ݒ�
			this.setFocusInput();

		} catch(e) {
			throw { name: 'clsMenuStatus.dspMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[���\��
	clsMenuStatus.prototype.hideMenu = function() {
		try {
			// �X�e�[�^�X��ʂ̏������C�x���g����
			this.cancelStatusEvent();

			// �p������\������
			if ( this._MenuPrototype ) {
				this._MenuPrototype.hideMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuStatus.hideMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsMenuStatus.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_STATUS_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu-status�v
				wInitArgument.kind = this._DEF_MENU_STATUS_KIND;
			}
			
			// �}�E�X�͈͊O��close�Ȃ�
			wInitArgument.autoClose = false;

			if ( pArgument ) {
				// �ݒ�l�ۑ�
				this.saveStatusValue( pArgument );

				// status���e�ݒ�
				this.setStatusList( pArgument );
				
				// status�ǉ����ڐݒ�
				this.setStatusAddList( pArgument );

			}

			// �p�����R���X�g���N�^
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssStatus-base' );

		} catch(e) {
			throw { name: 'clsMenuStatus.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsMenuStatus.prototype.freeClass = function() {
		try {
			this.execFunction( this.delAddEvent );
			this.execFunction( this.delCancelEvent );
			this.execFunction( this.delConfirmEvent );

			// �v���p�e�B�J��
			this._StatusList						= null;
			this._StatusValue						= null;
			this._StatusAddList						= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
