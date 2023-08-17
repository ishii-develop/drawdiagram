
// --------------------------------------------------------------------
//
// �֌W��ʑI�����j���[
//
// --------------------------------------------------------------------
// clsMenuRelation �� clsMenuBase �� clsBaseBox
//        |�\ clsItemRelation �� clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsMenuRelation = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_RELATION_KIND		= 'menu-relation';

		this._DEF_MENU_RELATION_PROPERTY	= {
			 'z-index'				: '3200'
		};

		this._DEF_MENU_RELATION_SIZE		= { width: 180, height: 210 };
		this._DEF_MENU_RELATION_LINE_HEIGHT	= 24;

		this._DEF_MENU_RELATION_VALUE		= {
			  stat		: 0
			, kind		: 0
			, comment	: ''
			, way		: 0
		};

		// �p�����N���X��prototype
		this._MenuPrototype					= null;

		this._RelationContents				= null;
		this._RelationMode					= '';
		this._RelationConfig				= { stat: true, kind: true, comment: true, way: true };

		this._RelationMenuColor				= null;


		// **************************************************************
		// �C�x���g
		// **************************************************************

		// �F�I�����j���[�\���C�x���g
		this.eventMenuColorOpen = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �������C�x���g����
				self.cancelRelationEvent();

				// �J���[���j���[�\��
				if ( self._RelationMenuColor ) {
					var wPoint = self.getEventPos( pEvent );
					self._RelationMenuColor.dspMenu( { x: wPoint.x, y: wPoint.y, callback: self.eventMenuColorSelect } );

				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// �֌W�I���C�x���g
		this.eventMenuRelChange = function( pEvent ) {
			try {
				var wRelId = self.getBoxId() + '_rel';
				var wRelEle = self.getElement( wRelId );
				if ( !wRelEle ) return false;

				var wRelVal = wRelEle.options[wRelEle.selectedIndex].value;
				var wSelRel = self._RelationContents.getDefKind( wRelVal );

				var wColorId = self.getBoxId() + '_color';
				var wColorEle = self.getElement( wColorId );
				if ( !wColorEle ) return false;

				// �w�i�F�ύX
				self.setStyle( wColorEle, { 'background-color' : wSelRel.color } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �F�I�����C�x���g
		this.eventMenuColorSelect = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				var wKind = pParam.kind;
				
				// �F�I����
				if ( wKind == 'select' ) {
					var wColor = pParam.color;

					var wColorId = self.getBoxId() + '_color';
					var wColorEle = self.getElement( wColorId );
					if ( !wColorEle ) return false;

					// �w�i�F�ύX
					self.setStyle( wColorEle, { 'background-color' : wColor } );

				}

				return true;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �L�����Z���{�^�������C�x���g
		this.eventMenuCancel = function( pEvent ) {
			try {
				// ����
				self.hideMenu();

				// �e�C�x���g����
				self.execCallBack( pEvent, { kind: 'close' } );

				return true;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// OK�{�^�������C�x���g
		this.eventMenuOk = function( pEvent ) {
			try {
				// ���͒l�擾
				var wInputValue = {};
				self.copyProperty( self._DEF_MENU_RELATION_VALUE, wInputValue );

				if ( self._RelationConfig.stat		) wInputValue.stat		= self.getSelectValue('_stat');
				if ( self._RelationConfig.kind		) wInputValue.kind		= self.getSelectValue('_rel');
				if ( self._RelationConfig.comment	) wInputValue.comment	= self.getSelectText('_cmt');
				if ( self._RelationConfig.way		) wInputValue.way		= self.getSelectValue('_way');

				self._RelationContents.setStatus(	wInputValue.stat	);
				self._RelationContents.setRelation(	wInputValue.kind	);
				self._RelationContents.setWorkWay(	wInputValue.way		);
				self._RelationContents.setComment(	wInputValue.comment	);

				self._RelationContents.setColor(	self.getSelectColor('_color')	);

				// ����
				self.hideMenu();

				// �ݒ���e�擾
				var wRelParam = self._RelationContents.getContents();

				// ��ʐݒ����߂�l�ɐݒ�
				var wParam = {
								kind		: 'relationUpd'
							,	displayMode	: self._RelationMode
							,	relationInf	: wRelParam
				};

				// �e�C�x���g����
				self.execCallBack( pEvent, wParam );

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
		this._MenuPrototype = clsMenuBase.prototype;

		// �e�N���X��constructor
		// ���p�������uinitClass�v��call�����
		clsMenuBase.call( this, pArgument );


	} catch(e) {
		throw { name: 'clsMenuRelation.' + e.name, message: e.message };
	}
};


// �֌W��� prototype
(function(){

	// clsMenuBase�̃v���g�^�C�v���p��
	clsInheritance( clsMenuRelation, clsMenuBase );

	// **************************************************************
	// ���e�ݒ�^�擾
	// **************************************************************

	// �I��l�擾
	clsMenuRelation.prototype.getSelectValue = function( pSubId ) {
		try {
			var wSelectId = this.getBoxId() + pSubId;
			var wSelectEle = this.getElement( wSelectId );
			if ( !wSelectEle ) return 0;

			var wValue = wSelectEle.options[wSelectEle.selectedIndex].value;

			return wValue;

		} catch(e) {
			throw { name: 'getSelectValue.' + e.name, message: e.message };
		}
	};

	// �I���C���f�b�N�X�擾
	clsMenuRelation.prototype.getSelectIndex = function( pSubId, pValue ) {
		try {
			var wSelectId = this.getBoxId() + pSubId;
			var wSelectEle = this.getElement( wSelectId );
			if ( !wSelectEle ) return 0;

			var wRetIdx = 0;
			for( var wIdx=0; wIdx < wSelectEle.options.length; wIdx++ ) {
				if ( wSelectEle.options[wIdx].value == pValue ) {
					wRetIdx = wIdx;
					break;
				}
			}
			return wRetIdx;

		} catch(e) {
			throw { name: 'getSelectIndex.' + e.name, message: e.message };
		}
	};

	// ���͒l�擾
	clsMenuRelation.prototype.getSelectText = function( pSubId ) {
		try {
			var wTextId = this.getBoxId() + pSubId;
			var wTextEle = this.getElement( wTextId );
			if ( !wTextEle ) return '';

			var wValue = wTextEle.value;

			return wValue;

		} catch(e) {
			throw { name: 'getSelectText.' + e.name, message: e.message };
		}
	};

	// �w�i�F�擾
	clsMenuRelation.prototype.getSelectColor = function( pSubId ) {
		try {
			var wColorId = this.getBoxId() + pSubId;
			var wColorEle = this.getElement( wColorId );
			if ( !wColorEle ) return '';

			var wValue = this.getStyle( wColorEle, 'background-color' );

			return wValue;

		} catch(e) {
			throw { name: 'getSelectColor.' + e.name, message: e.message };
		}
	};

	// �ݒ���e������
	clsMenuRelation.prototype.initCondition = function( pRelationInf ) {
		try {
			var wId = this.getBoxId();

			// ���
			var wStatEle = this.getElement( wId + '_stat' );
			if ( wStatEle ) {
				var wStatIdx = this._DEF_MENU_RELATION_VALUE.stat;
				// ��ʗL�����̂ݒl�ݒ�
				if ( this._RelationConfig.stat ) {
					if ( pRelationInf ) {
						wStatIdx = this.getSelectIndex( '_stat', pRelationInf.getStatus() );
					}
				}
				wStatEle.selectedIndex = wStatIdx;
			}

			// �֌W
			var wRelEle = this.getElement( wId + '_rel' );
			if ( wRelEle ) {
				var wRelIdx = this._DEF_MENU_RELATION_VALUE.kind;
				// �֌W�L�����̂ݒl�ݒ�
				if ( this._RelationConfig.kind ) {
					if ( pRelationInf ) {
						wRelIdx = this.getSelectIndex( '_rel', pRelationInf.getRelation() );
					}
				}
				wRelEle.selectedIndex = wRelIdx;
			}

			// �R�����g
			var wCmtEle = this.getElement( wId + '_cmt' );
			if ( wCmtEle ) {
				var wComment = this._DEF_MENU_RELATION_VALUE.comment;
				// �R�����g�L�����̂ݒl�ݒ�
				if ( this._RelationConfig.comment ) {
					if ( pRelationInf ) {
						wComment = pRelationInf.getComment();
					}
				}
				wCmtEle.value = wComment;
			}

			// ����
			var wWayEle = this.getElement( wId + '_way' );
			if ( wWayEle ) {
				var wWayIdx = this._DEF_MENU_RELATION_VALUE.way;
				// �����L�����̂ݒl�ݒ�
				if ( this._RelationConfig.way ) {
					if ( pRelationInf ) {
						wWayIdx = this.getSelectIndex( '_way', pRelationInf.getWorkWay() );
					}
				}
				wWayEle.selectedIndex = wWayIdx;
			}

			// �F
			if ( pRelationInf ) {
				this.eventMenuColorSelect( {}, { kind: 'select', color: pRelationInf.getColor() } );

			} else {
				this.eventMenuRelChange();

			}

		} catch(e) {
			throw { name: 'initCondition.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �C�x���g
	// **************************************************************

	// �C�x���g�L�����Z��
	clsMenuRelation.prototype.cancelRelationEvent = function() {
		try {
			// �J���[���j���[����
			if ( this._RelationMenuColor ) {
				this._RelationMenuColor.hideMenu();

			}

		} catch(e) {
			throw { name: 'cancelRelationEvent.' + e.name, message: e.message };
		}
	};

	// ���j���[�v�f�ɃC�x���g�ݒ�
	clsMenuRelation.prototype.setRelationEvent = function( pDelete ) {
		try {
			var wId = this.getBoxId();

			// �֌W�I���C�x���g�ǉ�
			if ( this._RelationConfig.kind ) {
				var wRelId = wId + '_rel';
				var wRelEle = this.getElement( wRelId );
				if ( wRelEle ) {
					if ( !pDelete ) {
						this.addEvent( wRelEle, 'onchange', this.eventMenuRelChange );
					} else {
						this.delEvent( wRelEle, 'onchange', this.eventMenuRelChange );
					}

				}
			
			}

			// �F�ύX�C�x���g�ǉ�
			var wColorId = wId + '_color';
			var wColorEle = this.getElement( wColorId );
			if ( wColorEle ) {
				if ( !pDelete ) {
					this.addEvent( wColorEle, 'onclick', this.eventMenuColorOpen );
				} else {
					this.delEvent( wColorEle, 'onclick', this.eventMenuColorOpen );
				}

			}

			// �{�^������
			var wCancelId = wId + '_cancel';
			var wCancelEle = this.getElement( wCancelId );
			if ( wCancelEle ) {
				if ( !pDelete ) {
					this.addEvent( wCancelEle, 'onclick', this.eventMenuCancel );
				} else {
					this.delEvent( wCancelEle, 'onclick', this.eventMenuCancel );
				}

			}

			var wOkId = wId + '_ok';
			var wOkEle = this.getElement( wOkId );
			if ( wOkEle ) {
				if ( !pDelete ) {
					this.addEvent( wOkEle, 'onclick', this.eventMenuOk );
				} else {
					this.delEvent( wOkEle, 'onclick', this.eventMenuOk );
				}

			}

		} catch(e) {
			throw { name: 'setRelationEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�ݒ�
	// **************************************************************

	// html�ݒ�
	clsMenuRelation.prototype.createContents = function( ) {
		try {
			var wBeseEle = this.getBoxElement();
			if ( !wBeseEle ) return false;

			function setSelectLine( pId, pTitle, pList, pDisabled, pDisplay ) {
				var wDisabled = '';
				if ( pDisabled == true ) {
					wDisabled = 'disabled';
				}

				var wDisplay = '';
				if ( typeof pDisplay == 'boolean' ) {
					if ( !pDisplay ) {
						wDisplay = " style='display: none;' ";
					}
				}

				var wHtml = '';
				wHtml += "<tr" + wDisplay + ">"
				wHtml += "<td style='text-align: right; width: 60px;'>" + pTitle + "�F</td>";
				wHtml += "<td>"
				wHtml += "<select id='" + pId + "' " + wDisabled + ">";
				for( var i = 0; i < pList.length; i++ ) {
					wHtml += "<option value='" + pList[i].value + "'>" + pList[i].name + "</option>";
				}
				wHtml += "</select>"
				wHtml += "</td>"
				wHtml += "</tr>"
				
				return wHtml;
			};

			var wId = this.getBoxId();
			var wMenuBase	= wId + '_base';

			var wMenuTag = '';
			wMenuTag += "<div id='" + wMenuBase + "' style='width: 100%;'>";

			wMenuTag += "<table class='cssMenuRelation-tbl'>";

			// �J�����T�C�Y�ݒ�
			wMenuTag += "<colgroup>";
			wMenuTag += "<col style='width: 60px;'>";
			wMenuTag += "<col>";
			wMenuTag += "</colgroup>";

			// ���
			wMenuTag += setSelectLine( wId + '_stat',	'���',		this._RelationContents.getDefStat(), false, this._RelationConfig.stat );

			// �֌W��
			wMenuTag += setSelectLine( wId + '_rel',	'�֌W',		this._RelationContents.getDefKind(), false, this._RelationConfig.kind );

			// �R�����g
			var wCmtDsp = '';
			if ( !this._RelationConfig.comment ) {
				wCmtDsp = " style='display: none;' ";
			}

			var wMenuCmt = wId + '_cmt';
			wMenuTag += "<tr" + wCmtDsp + ">"
			wMenuTag += "<td style='text-align: right;'>�R�����g�F</td>";
			wMenuTag += "<td>"
			wMenuTag += "<input type='text' id='" + wMenuCmt + "' style='width: 100px; border: solid 1px black;' />";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			// ��������
			wMenuTag += setSelectLine( wId + '_way',	'��������',	this._RelationContents.getDefWay(), false, this._RelationConfig.way );

			var wMenuColor = wId + '_color';
			wMenuTag += "<tr>"
			wMenuTag += "<td style='text-align: right;'>�F�F</td>";
			wMenuTag += "<td>"
			wMenuTag += "<div id='" + wMenuColor + "' style='width: 32px; height: 32px; cursor : pointer; border: solid 1px black; background-color: black;'></div>";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			wMenuTag += "<tr>"
			wMenuTag += "<td colspan='2'>"
			wMenuTag += "<div style='width: 97%; height: 0px; margin-left: 2px; border-top: 1px solid #CCCCCC; border-bottom: 1px solid #999999;'></div>";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			wMenuTag += "<tr>"
			wMenuTag += "<td colspan='2' style='text-align: center;'>"

			var wMenuCancel = wId + '_cancel';
			wMenuTag += "<input type='button' id='" + wMenuCancel + "' value='��ݾ�' style='padding: 3px 0px 3px 0px; text-align: center; width: 50px;' />";

			var wMenuOk = wId + '_ok';
			wMenuTag += "<input type='button' id='" + wMenuOk + "' value='OK'    style='padding: 3px 0px 3px 0px; text-align: center; width: 50px; margin-left: 10px;' />";
			wMenuTag += "</td>"
			wMenuTag += "</tr>"

			wMenuTag += "</table>";

			wMenuTag += "</div>";

			wBeseEle.innerHTML += wMenuTag;

		} catch(e) {
			throw { name: 'createContents.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[��\������
	clsMenuRelation.prototype.dspMenu = function( pParam ) {
		try {
			// �\�����[�h�����l�F�V�K
			this._RelationMode = 'insert';

			var wRelationInf = null;
			if ( pParam ) {
				// �����\�����ݒ�
				wRelationInf = pParam.relationInf
				if ( wRelationInf ) {
					// �\�����[�h�F�X�V
					this._RelationMode = 'update';
				}

			}
			// �ݒ�l������
			this.initCondition( wRelationInf );

			// �p�������j���[�\��
			if ( this._MenuPrototype ) {
				this._MenuPrototype.dspMenu.call( this, pParam );

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.dspMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[���\��
	clsMenuRelation.prototype.hideMenu = function() {
		try {
			// �֌W�ݒ��ʂ̏������C�x���g����
			this.cancelRelationEvent();

			// �p������\������
			if ( this._MenuPrototype ) {
				this._MenuPrototype.hideMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.hideMenu.' + e.name, message: e.message };
		}
	};

	// ���j���[�v�f�������ݒ�
	clsMenuRelation.prototype.createMenu = function() {
		try {
			// html�ݒ�
			this.createContents();

			// �C�x���g�ݒ�
			this.setRelationEvent( false );

			// �T�C�Y�ݒ�
			var wHeight = this._DEF_MENU_RELATION_SIZE.height;
			for( var wKey in this._RelationConfig ) {
				if ( !this._RelationConfig[wKey] ) wHeight -= this._DEF_MENU_RELATION_LINE_HEIGHT;
			}

			this.setBoxStyle( { height: (wHeight + 'px'), width: (this._DEF_MENU_RELATION_SIZE.width + 'px') } );

			// �p���������ݒ�
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.createMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsMenuRelation.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_RELATION_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu-relation�v
				wInitArgument.kind = this._DEF_MENU_RELATION_KIND;
			}

			// ���j���[�ݒ�擾
			var wAutoClose = false;

			var wMenuConfig = null;
			if ( this.isObject(pArgument) ) {
				if ( 'config' in pArgument ) {
					if ( this.isObject(pArgument.config) ) wMenuConfig = pArgument.config;
				}
			}

			if ( wMenuConfig ) {
				if ( 'autoClose' in wMenuConfig ) wAutoClose = wMenuConfig.autoClose;

				// �\�����ݒ�
				for( var wKindKey in this._RelationConfig ) {
					if ( wKindKey in wMenuConfig ) {
						this._RelationConfig[wKindKey] = wMenuConfig[wKindKey];
					}
				}
			
			}

			// ����close�ݒ�
			wInitArgument.autoClose = wAutoClose;

			// �֌W���N���X����
			// �� BOX�����Ȃ�
			this._RelationContents = new clsItemRelation( wInitArgument, false );

			// �p�����R���X�g���N�^
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssMenuRelation-base' );

			// ------------------------
			// ���ʃ��j���[�ݒ�
			// ------------------------

			// �J���[���j���[����
			var wColorMenu = this.loadPublicMenu( 'color' );
			if ( !wColorMenu ) {
				this._RelationMenuColor = new clsColorBox( { callback: this.eventMenuColorSelect } );

			} else {
				this._RelationMenuColor = wColorMenu;

			}

		} catch(e) {
			throw { name: 'clsMenuRelation.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsMenuRelation.prototype.freeClass = function() {
		try {
			// �C�x���g�폜
			this.execFunction( this.setRelationEvent, true );

			// �v���p�e�B�J��
			if ( this._RelationContents ) {
				if ( this._RelationContents.freeClass ) this._RelationContents.freeClass();
			}
			this._RelationContents				= null;
			this._RelationMenuColor				= null;
			this._RelationConfig				= null;


			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};
}());
