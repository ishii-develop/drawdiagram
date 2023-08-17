
// --------------------------------------------------------------------
//
// �x�[�X�\���N���X
//
// --------------------------------------------------------------------
// clsContentsBox �� clsBaseBox
// --------------------------------------------------------------------
var clsContentsBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_CONTENTS_KIND					= 'contents';
		this._DEF_CONTENTS_SAVEKEY				= 'drawdiagrm-save-data-v1.00';

		this._DEF_CONTENTS_PROPERTY				= {
			 'z-index'				: '20'
		};

		// �L�����o�X�̃T�C�Y
		// �� A4���Fwidth - 1620, height - 1120
		this._DEF_CONTENTS_CANVAS_SIZE			= {
			 'width'				: 1620
			,'height'				: 1120
		};

		// �R���e�L�X�g���j���[
		this._DEF_CONTENTS_MENU					= {
			 1: [
					 { kind: 'item'			, title: '�l��'			}
					,{ kind: 'group'		, title: '�O���[�v'		}
					,{ kind: 'comment'		, title: '�R�����g'		}
					,{ kind: 'freeline'		, title: '���C��'		}
				]
			,2: [
					 { kind: 'color'		, title: '�F�ύX'		}
				]
		};

		// ����alert
		this._MSG_CONTENTS_ALERT				= {
			  'overlap'				: '���̍��ڂƔ͈͂��d�����Ă��܂�'
			, 'overflow'			: '�z�u�悪�͈͊O�ł�'
			, 'overflow-group'		: '�z�u�悪�����O���[�v�͈̔͊O�ł�'
			, 'relation-item'		: '�������Ă��鍀�ڂւ̊֘A�t���͏o���܂���'
			, 'relation-group'		: '�������Ă���O���[�v�ւ̊֘A�t���͏o���܂���'
		};

		// �p�����N���X��prototype
		this._BasePrototype						= null;

		// �����
		this._ContentsLocked					= false;

		// �ҏW���j���[�L��
		this._ContentsMenuIs					= null;
		// �ҏW���j���[���
		this._ContentsEditMode					= '';

		this._ContentsEleMenu					= null;
		this._ContentsEleMenuList				= [];
		this._ContentsEleMain					= null;

		this._ContentsPublicMenu				= {};
		this._ContentsContextMenu				= null;
		this._ContentsContextValid				= false;
		this._ContentsContextEvent				= null;

		// �R���e�L�X�g���j���[�I�u�W�F�N�g
		this._ContentsMenuData					= null;
		this._ContentsMenuColor					= null;
		this._ContentsMenuFile					= null;

		// ���ڑ���ʒm�pCallback
		this._ContentsLinkCallback				= [];

		// ���쒆���ڏ��
		this._ContentsMoveInf					= { item: null, pos: null, drag: null, parent: null, kind: '', relation: null };
		this._ContentsResizeInf					= { item: null };
		this._ContentsSelectInf					= { item: null };
		this._ContentsCommentInf				= { item: null };
		this._ContentsRelation					= { item: null, relationInf: null, kind: '' };
		this._ContentsPosition					= { item: null, kind: '' };
		this._ContentsUpdInf					= { kind: '', param: null };
		this._ContentsLineInf					= { item: null, pos: null, start: null };

		// ��������
		this._ContentsItems						= {
			  person		: {}
			, group			: {}
			, comment		: {}
			, relation		: {}
			, freeline		: {}
		};

		// ���C���`��v�f
		this._ContentsCanvas					= null;

		// �}�E�X�Ǐ]�R�����g
		this._ContentsMouseCmt					= null;


		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �R���e�L�X�g���j���[����
		// ���N���b�N�������ڂ̃��j���[�\��
		this.eventContentsContext = function( pEvent ) {
			try {
				// �C�x���g��~�i�����̃R���e�L�X�g���j���[�𖳌����j
				self.cancelEvent( pEvent, true );

				// ���b�N���͏����Ȃ�
				if ( self._ContentsLocked ) return false;

				// �x�[�X���얳�����i���ڑ��쎞�j
				if ( !self._ContentsContextValid ) {
					// �E�N���b�N�ŃL�����Z��
					var wClickChk = self.getEventClick( pEvent );
					if ( wClickChk.right ) self.eventClearClick();

					return false;

				}

				// �������C�x���g����
				// ���I���͉������Ȃ�
				self.cancelControl();

				// �N���b�N�ʒu�̍��ڃ`�F�b�N
				var wClickItem = self.chkItemOverlapToClick( pEvent );

				// ����click
				if ( wClickItem ) {
					// ���ڂ̃��j���[�g�p�s���͏����Ȃ�
					if ( !wClickItem.chkItemMenuAvailable() ) return false;

					// ���ڂ̃��j���[�\��
					wClickItem.eventMenuDsp( pEvent );

				}
				// �x�[�X���click
				else if ( self._ContentsContextMenu ) {
					// �z�u�ҏW���[�h��
					if ( self.isEditModeMove() ) {
						// �����Ȃ�
						return false;
					}

					// �ʏ�R���e�L�X�g���j���[�\��
					var wPoint = self.getEventPos( pEvent );
					self._ContentsContextMenu.dspMenu( wPoint );

				}

				// ���j���[����J�n���̃C�x���g����ۑ�
				self._ContentsContextEvent = pEvent;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���ڑI���C�x���g
		this.eventContentsClick = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ���b�N���͏����Ȃ�
				if ( self._ContentsLocked ) return false;

				// �x�[�X����L�����̂�
				if ( !self._ContentsContextValid ) return false;

				// ���N���b�N�̂ݗL��
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				// �I��Ώ�
				// �� �֘A�t�����p�_�A�t���[���C���͑I��s��
				var wSelectTarget = {
						  relation	: false
						, freeline	: false
				};

				// �N���b�N�ʒu���ڃ`�F�b�N
				var wClickItm = self.chkItemOverlapToClick( pEvent, wSelectTarget );
				if ( !wClickItm ) return false;

				// �ړ��\���`�F�b�N
				var wMoveMode = self.isEditModeMove();
				if ( !wMoveMode ) {
					// �h���b�O����\�@���@�ʏ펞�h���b�O���Ȃ�ړ��\
					if ( wClickItm.getItemDragIs() && wClickItm.getItemMoveInitIs() ) wMoveMode = true;
				}

				// �ړ��\
				if ( wMoveMode ) {
					// �I�����ڂ̈ړ��J�n
					self.moveItemStart( pEvent, wClickItm, 'move', true );

				// �I�����ڂ��u�R�����g�v�ȊO
				} else if ( !wClickItm.isComment() ) {
					// ���ڂ�I����Ԃɂ���
					self.selectClickItem( wClickItm );

				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ��{��ʂ̃��j���[�@�I��������
		this.eventMenuSelect = function( pEvent, pSelectMenu ) {
			try {
				// ���j���[�I�����������s
				var wRetVal = self.execContentsMenu( pEvent, pSelectMenu );

				return wRetVal;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// ------------------------------------------
		// ���j���[��ʁ@�{�^������������
		// ------------------------------------------

		// ���j���[��ʁ@�I��������
		this.eventMainMenuSelect = function( pEvent ) {
			try {
				// ���b�N���͏����Ȃ�
				if ( self._ContentsLocked ) return false;

				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// id���烁�j���[key�擾
				var wId = this.id
				if ( !wId ) return null;

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

		// ----------------------------
		// ���ڈړ�
		// ----------------------------

		// �ړ����}�E�X�Ǐ]�C�x���g
		this.eventItemMove = function( pEvent ) {
			try {
				if ( !pEvent ) return true;
				if ( !self._ContentsMoveInf.item ) return true;

				var wEle = self._ContentsMoveInf.item.getBoxElement();
				if ( !wEle ) return true;
				
				var wMovePos = { left: 0, top: 0 };

				// �e�̈ʒu�␳
				wMovePos.left += self._ContentsMoveInf.pos.left;
				wMovePos.top  += self._ContentsMoveInf.pos.top;

				// �h���b�O�ňړ��̏ꍇ
				if ( self._ContentsMoveInf.drag ) {
					wMovePos.left += self._ContentsMoveInf.drag.left;
					wMovePos.top  += self._ContentsMoveInf.drag.top;
				}

				var wPoint = self.getEventPos( pEvent );

				wPoint.x -= wMovePos.left;
				if ( wPoint.x < 0 ) wPoint.x = 0;

				wPoint.y -= wMovePos.top;
				if ( wPoint.y < 0 ) wPoint.y = 0;

				// ���C����ʂ̃X�N���[���l���Z
				var wMainScroll = self.getScroll( self._ContentsEleMain );
				wPoint.x += wMainScroll.x;
				wPoint.y += wMainScroll.y;

				wEle.style.left	= wPoint.x + "px";
				wEle.style.top	= wPoint.y  + "px";

			} catch(e) {
				// �����I��
				self.execFunction( self.moveItemCancel );

				self.catchErrorDsp(e);

			}
			return false;
		};

		// �ړ��m��C�x���g
		this.eventItemMoveEnd = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// ���N���b�N�̂ݗL��
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				var wMoveExec = false;
				var wMoveKind = self._ContentsMoveInf.kind;
				var wMoveItem = self._ContentsMoveInf.item;

				// �ړ�����
				if ( wMoveItem ) {
					// �ړ��m��
					wMoveExec = self.moveItemConfirm( pEvent, wMoveKind, wMoveItem );
					if ( !wMoveExec ) return false;

				}

				// �ړ��I��
				self.moveItemCancel();

				// �ړ����s���͍X�V��ʒm
				if ( wMoveExec ) {
					// ���ڕύX�ʒm�i�ړ��m��j
					pEvent.kind = wMoveKind;
					self.execLinkCallback( pEvent, wMoveItem );

				}

			} catch(e) {
				// �����I��
				self.execFunction( self.moveItemCancel );

				self.catchErrorDsp(e);
			}
			
			return false;
		};

		// ----------------------------
		// ���ڃT�C�Y�ύX
		// ----------------------------

		// ���T�C�Y���}�E�X�Ǐ]�C�x���g
		this.eventItemResize = function( pEvent ) {
			try {
				if ( !pEvent ) return true;
				if ( !self._ContentsResizeInf.item ) return true;

				var wEle = self._ContentsResizeInf.item.getBoxElement();
				if ( !wEle ) return true;

				var wPoint = self.getEventPos( pEvent );
				var wElePos = self._ContentsResizeInf.item.getBoxPos();

				var wWidth  = wPoint.x - wElePos.left;
				var wHeight = wPoint.y - wElePos.top;

				wEle.style.width  = wWidth  + "px";
				wEle.style.height = wHeight + "px";

			} catch(e) {
				// �����I��
				self.execFunction( self.cancelResizeItem );

				self.catchErrorDsp(e);
			}
			return false;
		};

		// ���T�C�Y�m��C�x���g
		this.eventItemResizeEnd = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �ύX��͈̓`�F�b�N
				if ( !self.chkItemOverlapToPoint(self._ContentsResizeInf.item) ) {
					self.alertMouseCmt( 'overlap' );
					return false;
				
				}

				// ���T�C�Y�I��
				self.cancelResizeItem();

			} catch(e) {
				// �����I��
				self.execFunction( self.cancelResizeItem );
				self.catchErrorDsp(e);
			}
			return false;
		};


		// ----------------------------
		// ���ڍX�V
		// ----------------------------

		// �X�V���ڊm��C�x���g
		this.eventItemUpdSelect = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				var wUpdItem = null;

				// ���ڍX�V
				var wParam = self._ContentsUpdInf.param;
				if ( wParam ) {
					// �N���b�N�ʒu���ڃ`�F�b�N
					// �� �R�����g�A�֘A�t�����p�_�A�t���[���C���͑I��s��
					var wSelectTarget = {
							  comment	: false
							, relation	: false
							, freeline	: false
					};
					wUpdItem = self.chkItemOverlapToClick( pEvent, wSelectTarget );
					if ( !wUpdItem ) return false;

					// �I����ʃ`�F�b�N
					var wUpdKind = wUpdItem.getBoxKind();
					if ( self._ContentsUpdInf.kind != wUpdKind ) return false;

					// �㏑���m�F
					var wChkMsg = '�I���������ڂ̓��e���X�V���܂��B��낵���ł����H';
					if ( 'confirm' in wParam ) wChkMsg = wParam.confirm;
					if ( !self.dspConfirm(wChkMsg) ) return false;

					// �����㏑��
					wUpdItem.updStatusValue( wParam );
				}

				// �ړ��I��
				self.updItemCancel();

				// ���ڍX�V��
				if ( wUpdItem ) {
					// ���ڒǉ���ʒm
					self.execFunction( self.execItemAddFunc, wUpdItem );

					// ���ڕύX�ʒm
					pEvent.kind = self._ContentsUpdInf.kind;
					self.execLinkCallback( pEvent, wUpdItem );
				
				}

			} catch(e) {
				// �����I��
				self.execFunction( self.updItemCancel );

				self.catchErrorDsp(e);
			}
			
			return false;
		};


		// ----------------------------
		// �t���[���C���ǉ�
		// ----------------------------

		// �t���[���C���ǉ����}�E�X�Ǐ]�C�x���g
		this.eventFreeLineMove = function( pEvent ) {
			try {
				if ( !self._ContentsLineInf.item ) return true;

				var wEle = self._ContentsLineInf.item.getBoxElement();
				if ( !wEle ) return true;
				
				var wMovePos = { left: 0, top: 0 };

				// �e�̈ʒu�␳
				wMovePos.left += self._ContentsLineInf.pos.left;
				wMovePos.top  += self._ContentsLineInf.pos.top;

				var wPoint = self.getEventPos( pEvent );

				wPoint.x -= wMovePos.left;
				if ( wPoint.x < 0 ) wPoint.x = 0;

				wPoint.y -= wMovePos.top;
				if ( wPoint.y < 0 ) wPoint.y = 0;

				// ���C����ʂ̃X�N���[���l���Z
				var wMainScroll = self.getScroll( self._ContentsEleMain );
				wPoint.x += wMainScroll.x;
				wPoint.y += wMainScroll.y;

				wPoint.x += 2;
				wPoint.y += 2;

				wEle.style.left	= wPoint.x + "px";
				wEle.style.top	= wPoint.y  + "px";

			} catch(e) {
				// �����I��
				self.execFunction( self.freeLineCancel );

				self.catchErrorDsp(e);

			}
			return false;
		};

		// �t���[���C���m��C�x���g
		this.eventFreeLineSet = function( pEvent ) {
			try {
				if ( !self._ContentsLineInf.item ) return false;

				// �C�x���g��~
				//self.cancelEvent( pEvent, true );

				// ���N���b�N�ȊO�͏I��
				var wClick = self.getEventClick( pEvent );
				if ( !wClick.left ) return false;

				// �ʒu�m��
				var wExec = self.freeLineConfirm( pEvent, self._ContentsLineInf.item );
				if ( !wExec ) return false;

			} catch(e) {
				// �����I��
				self.execFunction( self.freeLineCancel );

				self.catchErrorDsp(e);
			}
			
			return false;
		};


		// ----------------------------
		// �ʒu�����֘A
		// ----------------------------

		// �ʒu�����ΏۑI���C�x���g
		this.eventPositionConfirm = function( pEvent ) {
			var wRelExec = false;

			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �Ώۍ��ڃ`�F�b�N
				var wTargetItm = self._ContentsPosition.item;
				if ( !wTargetItm ) return false;

				// �N���b�N�ʒu�̍��ڃ`�F�b�N
				var wClickItem = self.chkItemOverlapToClick( pEvent );
				if ( !wClickItem ) return false;

				// �ʒu�����m��
				var wConfirm = self.positionItemConfirm( wTargetItm, wClickItem );
				if ( !wConfirm ) return false;

				// ���ڕύX�ʒm
				pEvent.kind = 'move';
				self.execLinkCallback( pEvent, wTargetItm );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			
			// �ʒu�����I��
			self.execFunction( self.positionItemCancel );

			return false;
		};

		// ----------------------------
		// ���ڑ���i���j���[�����j
		// ----------------------------

		// �l������i�ύX�j����Call�����
		this.eventItemPersonChange = function( pEvent, pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execItemControl( pArgument, self._ContentsItems.person );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// �O���[�v����i�ύX�j����Call�����
		this.eventItemGroupChange = function( pEvent, pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execItemControl( pArgument, self._ContentsItems.group );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// �R�����g����i�ύX�j����Call�����
		this.eventItemCommentChange = function( pEvent, pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execItemControl( pArgument, self._ContentsItems.comment );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// ���p�_����i�ύX�j����Call�����
		this.eventItemRelationChange = function( pEvent, pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execItemControl( pArgument, self._ContentsItems.relation );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};

		// �t���[���C���i�ύX�j����Call�����
		this.eventItemFreeLineChange = function( pEvent, pArgument ) {
			try {
				// ���ڑ��쎞����
				self.execItemControl( pArgument, self._ContentsItems.freeline );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};


		// ----------------------------
		// �R�����g
		// ----------------------------

		// �R�����g�ǉ����i���e�ݒ��j��Call�����
		this.eventItemCommentAdd = function( pEvent, pParam ) {
			try {
				// �R�����g�ǉ�
				self.execAddItemComment( pEvent, pParam );

				return true;

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return true;
		};


		// ----------------------------
		// �F�I��
		// ----------------------------

		// �J���[�p���b�g�I�����C�x���g
		this.eventColorSelect = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'select' ) return false;

				// �F�I����
				var wColor = pParam.color;

				// �w�i�F�ύX
				self.setStyle( self._ContentsEleMain, { 'background-color' : wColor } );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// ----------------------------
		// �t�@�C���Ǎ�
		// ----------------------------

		// �Ǎ��t�@�C���I�����C�x���g
		this.eventLoadFile = function( pEvent, pParam ) {
			try {
				// �p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !pEvent ) return false;
				if ( !pParam ) return false;

				if ( pParam.kind !== 'file' ) return false;

				// �f�[�^�Ǎ�����
				self.execLoadData( pParam.fileData );

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// ----------------------------
		// �֌W�֘A
		// ----------------------------

		// �֘A�ΏۑI���C�x���g
		this.eventRelationConfirm = function( pEvent ) {
			var wRelExec = false;

			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �N���b�N�ʒu�̍��ڃ`�F�b�N
				// �� �R�����g�A�t���[���C���͊֘A�t���s��
				var wCheckParam = {
					  comment	: false
					, freeline	: false
				};
				var wClickItem = self.chkItemOverlapToClick( pEvent, wCheckParam );
				if ( !wClickItem ) return false;

				var wClickKd = wClickItem.getBoxKind();
				var wClickId = wClickItem.getBoxId();

				// �Ώۍ���
				var wTargetItm = self._ContentsRelation.item;
				if ( !wTargetItm ) return false;

				var wTargetKd = wTargetItm.getBoxKind();
				var wTargetId = wTargetItm.getBoxId();

				// �����ڂ͏����Ȃ�
				if ( wTargetId == wClickId ) return false;

				// �֘A�󋵎擾
				var wRelationFlg = wTargetItm.chkRelationItem( wClickId );

				// �폜��
				if ( self._ContentsRelation.kind == 'unrelation' ) {
					// �֘A�t���Ă��Ȃ���Ώ����Ȃ�
					if ( !wRelationFlg ) return false;

				// �ύX��
				} else if ( self._ContentsRelation.kind == 'relationChg' ) {
					// �֘A�t���Ă��Ȃ���Ώ����Ȃ�
					if ( !wRelationFlg ) return false;

				// �ǉ���
				} else {
					// �֘A�t���ς͏����Ȃ�
					if ( wRelationFlg ) return false;

					// ���p�_�̏ꍇ
					if ( self.isItemRelation(wTargetKd) ) {
						// ���g�̊֘A���E�捀�ڂ͑ΏۊO
						if ( wTargetItm.chkMasterKey(wClickId) ) return false;
					}

					// �N���b�N���ڂ����p�_
					if ( self.isItemRelation(wClickKd) ) {
						// ���g�̒��p�_�͑ΏۊO
						if ( wTargetItm.chkRelationItemRelay(wClickId) ) return false;
					}

					// ���ڃN���b�N��
					if ( self.isItemPerson(wClickKd) ) {
						// ���g���O���[�v
						if ( self.isItemGroup(wTargetKd) ) {
							// ���g�̎q�ւ͊֌W�s��
							if ( wClickItem.getParentId() == wTargetId ) {
								self.alertMouseCmt( 'relation-item' );
								return false;
							}
						}

					// �O���[�v�N���b�N
					} else if ( self.isItemGroup(wClickKd) ) {
						// ���g������
						if ( self.isItemPerson(wTargetKd) ) {
							// ���g�̐e�ւ͊֌W�s��
							if ( wTargetItm.getParentId() == wClickId ) {
								self.alertMouseCmt( 'relation-group' );
								return false;
							}
						}

					}
				
				}

				// �폜��
				if ( self._ContentsRelation.kind == 'unrelation' ) {
					// �֌W����
					self.liftRelation( wTargetItm, wClickItem );

					// �֌W�X�V���s
					wRelExec = true;

				// �ǉ��^�ύX��
				} else {
					// �֌W�ύX���j���[�\��
					wTargetItm.setRelationInf( pEvent, wClickId );

					// ���ύX���ʔ��f�͊e���ڂ���̕ύX�ʒm�C�x���g�Ŏ��{�����

				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			
			// �֌W�ǉ��I��
			self.execFunction( self.addRelationCancel );

			// �֌W�X�V���͍X�V��ʒm
			if ( wRelExec ) {
				try {
					// ���ڕύX�ʒm�i�֌W�X�V�j
					self.execLinkCallback( { kind: 'relation', event: pEvent }, wTargetItm );
				} catch(e) {
					self.catchErrorDsp(e);
				}
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
		throw { name: 'clsContentsBox.' + e.name, message: e.message };
	}
};

// ���C���p�l�� prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsContentsBox, clsBaseBox );

	// **************************************************************
	// �v���p�e�B�ݒ�^�擾
	// **************************************************************

	// ���ڎ擾
	clsContentsBox.prototype.getBelongItems = function( ) {
		try {
			// �������鍀�ڃI�u�W�F�N�g�Q�i�ւ̎Q�Ɓj��Ԃ�
			return this._ContentsItems.person;

		} catch(e) {
			throw { name: 'getBelongItems', message: e.message };
		}
	};

	// �O���[�v�擾
	clsContentsBox.prototype.getBelongGroups = function( ) {
		try {
			// ��������O���[�v�I�u�W�F�N�g�Q�i�ւ̎Q�Ɓj��Ԃ�
			return this._ContentsItems.group;

		} catch(e) {
			throw { name: 'getBelongGroups', message: e.message };
		}
	};

	// �R�����g�擾
	clsContentsBox.prototype.getBelongComment = function( ) {
		try {
			// ��������R�����g�I�u�W�F�N�g�Q�i�ւ̎Q�Ɓj��Ԃ�
			return this._ContentsItems.group;

		} catch(e) {
			throw { name: 'getBelongComment', message: e.message };
		}
	};

	// �֘A�t�����p�_�擾
	clsContentsBox.prototype.getBelongRelation = function( ) {
		try {
			// ��������֘A�t�����p�_�I�u�W�F�N�g�Q�i�ւ̎Q�Ɓj��Ԃ�
			return this._ContentsItems.relation;

		} catch(e) {
			throw { name: 'getBelongRelation', message: e.message };
		}
	};

	// �t���[���C���擾
	clsContentsBox.prototype.getBelongFreeLine = function( ) {
		try {
			// ��������֘A�t�����p�_�I�u�W�F�N�g�Q�i�ւ̎Q�Ɓj��Ԃ�
			return this._ContentsItems.freeline;

		} catch(e) {
			throw { name: 'getBelongFreeLine', message: e.message };
		}
	};

	// ���ڑS�Ď擾
	clsContentsBox.prototype.getBelongContents = function( ) {
		try {
			// ��������I�u�W�F�N�g�Q�i�ւ̎Q�Ɓj��Ԃ�
			return this._ContentsItems;

		} catch(e) {
			throw { name: 'getBelongContents', message: e.message };
		}
	};

	// ���ڑS�Ď擾
	clsContentsBox.prototype.getContentsItem = function( pItemId, pItemKd ) {
		try {
			var wRetItem = null;

			// ��ʎw�莞
			if ( typeof pItemKd !== 'undefined' ) {
				if ( this.isItemPerson(pItemKd) ) {
					wRetItem = this._ContentsItems.person[pItemKd];

				} else if ( this.isItemGroup(pItemKd) ) {
					wRetItem = this._ContentsItems.group[pItemKd];

				} else if ( this.isItemComment(pItemKd) ) {
					wRetItem = this._ContentsItems.comment[pItemKd];

				} else if ( this.isItemRelation(pItemKd) ) {
					wRetItem = this._ContentsItems.relation[pItemKd];

				} else if ( this.isItemFreeLine(pItemKd) ) {
					wRetItem = this._ContentsItems.freeline[pItemKd];

				}
			
			}

			if ( !wRetItem ) {
				if ( pItemId in this._ContentsItems.person ) {
					wRetItem = this._ContentsItems.person[pItemId];

				} else if ( pItemId in this._ContentsItems.group ) {
					wRetItem = this._ContentsItems.group[pItemId];

				} else if ( pItemId in this._ContentsItems.comment ) {
					wRetItem = this._ContentsItems.comment[pItemId];

				} else if ( pItemId in this._ContentsItems.relation ) {
					wRetItem = this._ContentsItems.relation[pItemId];

				} else if ( pItemId in this._ContentsItems.freeline ) {
					wRetItem = this._ContentsItems.freeline[pItemId];

				}
			}
			
			return wRetItem;

		} catch(e) {
			throw { name: 'getContentsItem', message: e.message };
		}
	};


	// **************************************************************
	// ���ڃ`�F�b�N
	// **************************************************************

	// �ړ���ɏd�Ȃ鍀�ڂ����邩�`�F�b�N
	clsContentsBox.prototype.chkItemOverlapToPoint = function( pTarget, pParam ) {
		try {
			self = this;

			if ( !pTarget ) return false;

			var wTgId   = pTarget.getBoxId();
			var wTgKind = pTarget.getBoxKind();
			var wTgRect = pTarget.getBoxRect();

			// �p�����[�^�ݒ�
			var wOverlap = true;
			if ( this.isObject(pParam) ) {
				// �͈͏d����
				if ( 'overlap' in pParam ) wOverlap = pParam.overlap;

				// �ړ���w��
				if ( 'targetRect' in pParam ) wTgRect = pParam.targetRect;
			}

			var checkOverlap = function( pId, pTgList ) {
				if ( !wTgRect ) return false;
				if ( !pTgList ) return false;

				for( var key in pTgList ) {
					if ( !pTgList.hasOwnProperty(key) ) continue;

					// �͈͏d���`�F�b�N�i���v�f�ȊO�j
					if ( pTgList[key].getBoxId() != pId ) {
						if ( pTgList[key].chkBoxInRect(wTgRect) ) {
							return true;
						}
					}
				}
				return false;
			};

			var checkOverlapOther = function( pParentId, pTgList ) {
				if ( !wTgRect ) return false;
				if ( !pTgList ) return false;

				for( var key in pTgList ) {
					if ( !pTgList.hasOwnProperty(key) ) continue;

					// �͈͏d���`�F�b�N�i�e�v�f�ȊO�j
					if ( pTgList[key].getParentId() != pParentId ) {
						if ( pTgList[key].chkBoxInRect(wTgRect) ) {
							return true;
						}
					}
				}
				return false;
			};

			// ��object�Ƃ̏d�Ȃ�`�F�b�N
			var wItemList = null;

			// �l��
			if ( this.isItemPerson(wTgKind) ) {
				wItemList = this._ContentsItems.person;
			
			// �O���[�v
			} else if ( this.isItemGroup(wTgKind) ) {
				wItemList = this._ContentsItems.group;

			}
			if ( wItemList ) {
				if ( checkOverlap(wTgId, wItemList) ) {
					return false;
				}

			}

			// group�̏ꍇ�͏d�Ȃ�s��
			if ( this.isItemGroup(wTgKind) ) {
				// ��object�Ƃ̏d�Ȃ�`�F�b�N
				if ( checkOverlapOther(wTgId, this._ContentsItems.person) ) {
					return false;
				}

			// �ȊO�@���@�d�Ȃ�s��
			} else if ( !wOverlap ) {
				// group�Ƃ̏d�Ȃ�`�F�b�N
				var wParentId = pTarget.getParentId();
				if ( checkOverlap(wParentId, this._ContentsItems.group) ) {
					return false;
				}

			}
			return true;

		} catch(e) {
			throw { name: 'chkItemOverlapToPoint.' + e.name, message: e.message };
		}
	};

	// �N���b�N�ʒu�ɍ��ڂ����邩�`�F�b�N
	clsContentsBox.prototype.chkItemOverlapToClick = function( pEvent, pCheckKind ) {
		try {
			var self = this;

			var checkItemPos = function( pEvtPos, pTgList ) {
				if ( !pTgList ) return false;

				var wRetItem = null;

				var wChkItem;
				var wChkRect;
				for( var key in pTgList ) {
					if ( pTgList.hasOwnProperty(key) ) {
						wChkItem = pTgList[key];
						if ( wChkItem.chkBoxInPoint(pEvtPos) ) {
							wRetItem = wChkItem;

							// �ォ��ǉ��������ڗD��̈�break���Ȃ�
						}
					}
				}

				return wRetItem;
			};

			// �`�F�b�N�Ώ�
			// ���D��x��
			var wChkTarget = {
					  person	: true
					, relation	: true
					, freeline	: true
					, group		: true
					, comment	: true
				};
			if ( this.isObject(pCheckKind) ) {
				for( var wKey in pCheckKind ) {
					wChkTarget[wKey] = pCheckKind[wKey];
				}
			}

			var wEvtPos = this.getEventPos( pEvent );

			var wClickItem = null;
			for ( var wChkKey in wChkTarget ) {
				if ( !wChkTarget[wChkKey] ) continue;

				wClickItem = checkItemPos( wEvtPos, this._ContentsItems[wChkKey] );
				if ( wClickItem ) break;
			}

			return wClickItem;

		} catch(e) {
			throw { name: 'chkItemOverlapToClick.' + e.name, message: e.message };
		}
	};

	// �N���b�N�ʒu�ɃO���[�v�����邩�`�F�b�N
	clsContentsBox.prototype.chkGroupOverlapToClick = function( pEvent ) {
		try {
			var wTgList = this._ContentsItems.group;
			if ( !wTgList ) return null;

			var wPoint = this.getEventPos( pEvent );

			var wRetVal = null;
			for( var key in wTgList ) {
				if ( wTgList.hasOwnProperty(key) ) {
					if ( wTgList[key].chkBoxInPoint(wPoint) ) {
						wRetVal = wTgList[key];
						break;
					}
				}
			}
			return wRetVal;

		} catch(e) {
			throw { name: 'chkGroupOverlapToClick.' + e.name, message: e.message };
		}
	};

	// �w��͈͂ɑ��݂��钆�p�_���擾
	clsContentsBox.prototype.getRelationOverlapToRect = function( pRect ) {
		try {
			// ���p�_��S�ă`�F�b�N
			var wTgList = this._ContentsItems.relation;
			if ( !wTgList ) return null;

			var wRetList = [];
			for( var wKey in wTgList ) {
				if ( !wTgList.hasOwnProperty(wKey) ) continue;

				// �͈͓��ɑ��݂��邩�`�F�b�N
				if ( wTgList[wKey].chkBoxInRect(pRect) ) {
					wRetList.push( wTgList[wKey] );
				}
			}

			if ( wRetList.length == 0 ) {
				return null;
			
			} else {
				return wRetList;
			
			}

		} catch(e) {
			throw { name: 'getRelationOverlapToRect.' + e.name, message: e.message };
		}
	};

	// ���ڂ��L�����o�X�͈͓��ɔ[�܂邩�`�F�b�N
	clsContentsBox.prototype.chkItemOverflowArea = function( pChkItem ) {
		try {
			// ���ڂ̕\���͈�
			var wItemRect = pChkItem.getBoxRect();
			var wItemSize = pChkItem.getBoxSize( { overflow: true, border: true } );

			wItemRect.right  = wItemRect.left + wItemSize.width;
			wItemRect.bottom = wItemRect.top  + wItemSize.height;

			// ���C����ʂ͈̔�
			var wMainRect = this.getRect( this._ContentsEleMain );

			var wMainScroll	= this.getScroll( this._ContentsEleMain );
			wMainRect.left -= wMainScroll.x;
			wMainRect.top  -= wMainScroll.y;

			// �L�����o�X�͈̔�
			var wCanvasStat = this._ContentsCanvas.canvasGetStatus();

			wMainRect.right  = wMainRect.left + wCanvasStat.width;
			wMainRect.bottom = wMainRect.top  + wCanvasStat.height;

			// ���C����ʂ͈͓̔��ɔ[�܂邩�`�F�b�N
			return this.chkInRect( wMainRect, wItemRect, { overflow: false } );

		} catch(e) {
			throw { name: 'chkItemOverflowArea.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	//  ���C���`��@�֘A�t��
	// **************************************************************

	// �֌W���C���`��
	clsContentsBox.prototype.drawRelationLine = function( pSrcItm, pDstItm, pRelInf, pLineParam ) {
		try {
			var self = this;

			if ( !pSrcItm ) return false;
			if ( !pDstItm ) return false;
			if ( !pRelInf ) return false;

			// ���ڈʒu�擾
			function getItmPos( pItem ) {
				var wItmPos  = pItem.getBoxPos();

				var wParentPos = { left: 0, top: 0 };
				// �e��Group
				var wParentId = pItem.getParentId();
				if ( wParentId in self._ContentsItems.group ) {
					wParentPos = self._ContentsItems.group[wParentId].getParentPos();
				
				} else {
					wParentPos  = pItem.getParentPos();

				}
				wItmPos.left -= wParentPos.left;
				wItmPos.top  -= wParentPos.top;

				return wItmPos;
			};

			
			// ���C���̒����擾
			function getCenterPos( pLineSt, pLineEd ) {
				var wCenterX = pLineSt.x + Math.floor( (pLineEd.x - pLineSt.x) / 2 );
				var wCenterY = pLineSt.y + Math.floor( (pLineEd.y - pLineSt.y) / 2 );

				var wCenter = { left: wCenterX, top: wCenterY };
				
				return wCenter;
			};

			// ���ڈʒu�E�T�C�Y�擾
			var wStPos = getItmPos( pSrcItm );
			var wEdPos = getItmPos( pDstItm );

			var wStSize = pSrcItm.getBoxSize();
			var wEdSize = pDstItm.getBoxSize();

			// ���C����ʂ̃X�N���[���l���Z
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wStPos.left += wMainScroll.x;
			wStPos.top  += wMainScroll.y;
			
			wEdPos.left += wMainScroll.x;
			wEdPos.top  += wMainScroll.y;

			// ���p�_���ǂ���
			var wStRelay = false;
			var wStRelayCmt = false;
			if ( pSrcItm.isRelation() ) {
				wStRelay	= true;
				wStRelayCmt	= pSrcItm.isComment();
			}

			var wEdRelay = false;
			var wEdRelayCmt = false;
			if ( pDstItm.isRelation() ) {
				wEdRelay	= true;
				wEdRelayCmt	= pDstItm.isComment();
			}

			// �R�����g�\���ʒu
			var wCmtPos = Object.create( wStPos );

			// ���C���`��
			if ( this._ContentsCanvas ) {
				// �`��ݒ�擾
				var wLineKind = pRelInf.toLineKind();

				// �p�����[�^�w�莞
				if ( pLineParam ) {
					// ���C������
					if ( 'width' in pLineParam ) wLineKind.width = pLineParam.width;
					if ( 'color' in pLineParam ) wLineKind.color = pLineParam.color;
					if ( 'style' in pLineParam ) wLineKind.style = pLineParam.style;
					if ( 'way'   in pLineParam ) wLineKind.way   = pLineParam.way;
				}

				// ���ݒ�
				var wStArrow = false;
				var wEdArrow = false;

				// ������
				if ( wLineKind.way == 1 ) {
					wEdArrow = true;

				// �t����
				} else if ( wLineKind.way == 2 ) {
					wStArrow = true;

				// �o����
				} else if ( wLineKind.way == 3 ) {
					wStArrow = true;
					wEdArrow = true;

				}

				var wLineParam = { 
							  StPos: wStPos, StSize: wStSize, StArrow: wStArrow, StRelay: wStRelay, StRelayCmt: wStRelayCmt
							, EdPos: wEdPos, EdSize: wEdSize, EdArrow: wEdArrow, EdRelay: wEdRelay, EdRelayCmt: wEdRelayCmt
				};

				var wLinePoint = this._ContentsCanvas.canvasGetDrawPoint( wLineParam, wLineKind );

				// ���C���̕������ȉ��͕`�悵�Ȃ�
				var wWidthX = Math.abs( wLinePoint.EdPoint.x - wLinePoint.StPoint.x );
				var wWidthY = Math.abs( wLinePoint.EdPoint.y - wLinePoint.StPoint.y );
				if ( (wWidthX >= 1) || (wWidthY >= 1) ) {
					// �`��
					this._ContentsCanvas.canvasDrawLine( wLinePoint.StPoint, wLinePoint.EdPoint, wLineKind );

					// �R�����g�ʒu�␳
					wCmtPos = getCenterPos( wLinePoint.StPoint, wLinePoint.EdPoint );
				}
			}

			// �֌W�R�����g�\��
			pRelInf.dspRelationCmt( wCmtPos.left, wCmtPos.top );

			return true;

		} catch(e) {
			throw { name: 'drawRelationLine.' + e.name, message: e.message };
		}
	};

	// �S�֌W���C���`��
	clsContentsBox.prototype.drawRelationLineAll = function( pItemList, pLineParam ) {
		try {
			if ( !pItemList ) return false;

			// �p�����[�^�ݒ�
			var wSelectedItm	= null;
			var wRelayPoint		= null;
			var wProsessed		= null;
			if ( this.isObject(pLineParam) ) {
				if ( 'selected'  in pLineParam ) wSelectedItm	= pLineParam.selected;
				if ( 'relation'  in pLineParam ) wRelayPoint	= pLineParam.relation;
				if ( 'processed' in pLineParam ) wProsessed		= pLineParam.processed;
			}
			if ( !this.isObject(wProsessed) ) wProsessed = {};

			// �I�����ڎw�莞
			var wDefParam	= null;
			if ( wSelectedItm ) {
				wDefParam = { width: 0.2 };

			}

			var wLineParam	= wDefParam;

			var wTargetFlg;
			var wTargetChild;
			var wListItm;
			var wRelItm;
			var wChildItm;
			var wChildKd;
			var wRelationList;

			for( var key in pItemList ) {
				if ( !pItemList.hasOwnProperty(key) ) continue;

				// �����ς͏������Ȃ�
				if ( key in wProsessed ) continue;

				wListItm = pItemList[key];

				// �I�����ڎw�莞
				if ( wListItm == wSelectedItm ) {
					wTargetFlg = true;
				} else {
					wTargetFlg = false;
				}

				wRelationList = wListItm.getRelationList('parent');
				if ( !wRelationList ) continue;

				for ( var wId in wRelationList ) {
					// �����ς͏������Ȃ�
					if ( wId in wProsessed ) continue;

					// �Ώۂ̃p�����[�^���獀�ڎ擾
					wRelItm = wRelationList[wId];
					if ( !wRelItm ) continue;

					wChildItm = this.getContentsItem( wId, wRelItm.kind );
					if ( !wChildItm ) continue;

					// �֘A�t���i�q�j���Ώۂ��`�F�b�N
					wTargetChild = false;
					if ( !wTargetFlg ) {
						// �I�����ڗL����
						if ( wChildItm == wSelectedItm ) wTargetChild = true;
					}

					if ( wTargetFlg || wTargetChild ) {
						wLineParam  = null
					} else {
						wLineParam  = wDefParam;
					}

					if ( typeof wRelayPoint == 'boolean' ) {
						// ���p�_�Ƃ̊֘A�t�����Ώ�
						wChildKd = wChildItm.getBoxKind();
						if ( wRelayPoint ) {
							// ���p�_�ȊO�͏����Ȃ�
							if ( !this.isItemRelation(wChildKd) ) continue;

						} else {
							// ���p�_�͏����Ȃ�
							if ( this.isItemRelation(wChildKd) ) continue;

						}
					}

					this.drawRelationLine( wListItm, wChildItm, wRelItm.relationInf, wLineParam );
				}

			}

		} catch(e) {
			throw { name: 'drawRelationLineAll.' + e.name, message: e.message };
		}
	};

	// �w�荀�ڃ��C���`��
	clsContentsBox.prototype.drawItemLine = function( pTarget, pProcessedId ) {
		try {
			if ( !pTarget ) return false;

			// �����ύ��ڂ͏����Ȃ�
			var wTargetId = pTarget.getBoxId();
			if ( this.isObject(pProcessedId) ) {
				if ( wTargetId in pProcessedId ) return true;
			
			} else {
				pProcessedId = {};
			
			}

			// �����ύ���ID�ۑ�
			pProcessedId[wTargetId] = true;

			// �֘A���ڂȂ���Ώ����Ȃ�
			var wRelationList = pTarget.getRelationList();
			if ( !wRelationList ) return false;

			var wRelItm;
			var wChildItm;
			var wLineKind;

			// �֘A���ڂƂ̃��C���`��
			for ( var wId in wRelationList ) {
				wRelItm = wRelationList[wId];
				if ( !wRelItm ) continue;

				wChildItm = this.getContentsItem( wId, wRelItm.kind );
				if ( !wChildItm ) continue;

				// ���ڂ̎�Ŗ����ꍇ
				if ( !wRelItm.parent ) {
					// �֌W���C�����擾
					wLineKind = wRelItm.relationInf.toLineKind();

					// �������t�]
					if ( wLineKind.way == 1 ) {
						wLineKind.way = 2;

					} else if ( wLineKind.way == 2 ) {
						wLineKind.way = 1;

					}

				} else {
					wLineKind = null;

				}
				this.drawRelationLine( pTarget, wChildItm, wRelItm.relationInf, wLineKind );

				// �� �ċA�Œ��p�_����̃��C����`��
				this.drawItemLine( wRelItm.relationInf, pProcessedId );
			}

		} catch(e) {
			throw { name: 'drawItemLine.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	//  ���C���`��@�t���[���C��
	// **************************************************************

	// �t���[���C���`��
	clsContentsBox.prototype.drawFreeLine = function( pSrcItm, pDstItm, pLineParam ) {
		try {
			var self = this;

			if ( !this._ContentsCanvas ) return false;

			if ( !pSrcItm ) return false;
			if ( !pDstItm ) return false;

			// ���ڈʒu�擾
			function getItmPos( pItem ) {
				var wItmPos  = pItem.getBoxPos();

				var wParentPos = pItem.getParentPos();

				wItmPos.left -= wParentPos.left;
				wItmPos.top  -= wParentPos.top;

				return wItmPos;
			};

			// ���ڈʒu�E�T�C�Y�擾
			var wStPos = getItmPos( pSrcItm );
			var wEdPos = getItmPos( pDstItm );

			var wStSize = pSrcItm.getBoxSize();
			var wEdSize = pDstItm.getBoxSize();

			// ���C����ʂ̃X�N���[���l���Z
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wStPos.left += wMainScroll.x;
			wStPos.top  += wMainScroll.y;
			
			wEdPos.left += wMainScroll.x;
			wEdPos.top  += wMainScroll.y;

			// ���S�ʒu
			var wStPoint = { x: wStPos.left, y: wStPos.top };
			var wEdPoint = { x: wEdPos.left, y: wEdPos.top };

			if ( wStSize.width  > 0 ) wStPoint.x += Math.floor( wStSize.width  / 2 );
			if ( wStSize.height > 0 ) wStPoint.y += Math.floor( wStSize.height / 2 );

			if ( wEdSize.width  > 0 ) wEdPoint.x += Math.floor( wEdSize.width  / 2 );
			if ( wEdSize.height > 0 ) wEdPoint.y += Math.floor( wEdSize.height / 2 );

			// ���C���ݒ�擾
			var wLineKind = pSrcItm.getLineStatus();

			// ���C�������w�莞
			if ( this.isObject(pLineParam) ) {
				if ( 'width' in pLineParam ) wLineKind.width = pLineParam.width;
				if ( 'color' in pLineParam ) wLineKind.color = pLineParam.color;
				if ( 'style' in pLineParam ) wLineKind.style = pLineParam.style;
				if ( 'way'   in pLineParam ) wLineKind.way   = pLineParam.way;
			}

			// ���C���̕������ȉ��͕`�悵�Ȃ�
			var wWidthX = Math.abs( wEdPoint.x - wStPoint.x );
			var wWidthY = Math.abs( wEdPoint.y - wStPoint.y );
			if ( (wWidthX >= 1) || (wWidthY >= 1) ) {
				// �`��
				this._ContentsCanvas.canvasDrawLine( wStPoint, wEdPoint, wLineKind );
			}

			return true;

		} catch(e) {
			throw { name: 'drawFreeLine.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ��� - �֘A�t��
	// **************************************************************

	// �֘A�t������
	clsContentsBox.prototype.liftRelation = function( pSrcItm, pDstItm ) {
		try {
			if ( !pSrcItm ) return false;
			if ( !pDstItm  ) return false;

			var wSrcId = pSrcItm.getBoxId();
			var wDstId = pDstItm.getBoxId();

			// �֘A�t��KEY�擾
			var wDelRel = pSrcItm.getRelationItem( wDstId );
			if ( !wDelRel ) return false;

			var wRelationKey = wDelRel.key;
			if ( !wRelationKey ) return false;

			// �֘A�t��������
			pSrcItm.delRelationItem( wDstId );
			pDstItm.delRelationItem( wSrcId );

			// �֘A�t�����폜
			var wRelationItm = this._ContentsItems.relation[wRelationKey];

			if ( wRelationItm ) {
				// ���p�_�̊֘A�t������
				var wRelayList = wRelationItm.getRelationList();
				if ( wRelayList ) {
					for( var wRelayKey in wRelayList ) {
						// �֘A�Ώێ擾
						var wRelayItm = this.getContentsItem( wRelayList[wRelayKey].id, wRelayList[wRelayKey].kind );

						// ���ċA�Ŋ֘A�t������
						if ( wRelayItm ) {
							this.liftRelation( wRelationItm, wRelayItm );

						}
					}
					
				}

				// ���ڍ폜��ʒm�i�폜�����O�Ɏ��{�j
				this.execFunction( this.execItemDelFunc, wRelationItm );

				// �Q�ƍ폜
				delete this._ContentsItems.relation[wRelationKey];

				// ���ڍ폜
				wRelationItm.freeClass();
			}
			return true;

		} catch(e) {
			throw { name: 'liftRelation.' + e.name, message: e.message };
		}
	};

	// �S�֘A�t������
	clsContentsBox.prototype.liftRelationAll = function( pDelItem ) {
		try {
			// �S�֌W���폜
			var wRelationList = pDelItem.getRelationList();
			if ( !wRelationList ) return false;

			var wRelationDel = false;

			var wRelInf;
			var wRelItm;
			for ( var wId in wRelationList ) {
				// �֌W���ڃ`�F�b�N
				wRelInf = wRelationList[wId];
				if ( !wRelInf ) continue;

				wRelItm = this.getContentsItem( wId, wRelInf.kind );
				if ( !wRelItm ) continue;

				// �֌W�폜
				if ( this.liftRelation(pDelItem, wRelItm) ) wRelationDel = true;
			}

			return wRelationDel;

		} catch(e) {
			throw { name: 'liftRelationAll.' + e.name, message: e.message };
		}
	};

	// �S�֌W���C���ĕ`��
	clsContentsBox.prototype.drawRelationRedo = function( pLineParam ) {
		try {
			// �L�����o�X�N���A
			if ( this._ContentsCanvas ) {
				this._ContentsCanvas.canvasClear();
			}

			// ���C���p�����[�^�ݒ�
			var wPriorityItm	= null;
			var wSelectItm		= null;
			if ( this.isObject(pLineParam) ) {
				wPriorityItm	= pLineParam.priority;
				wSelectItm		= pLineParam.select;
			}

			// �����ύ���ID
			var wProcessedId = {};

			// �D�捀�ڎw�莞
			if ( wPriorityItm ) {
				// �D�捀�ڂ̃��C���ĕ`��
				this.drawItemLine( wPriorityItm, wProcessedId );

			}

			var wLineParam = {
					  selected	: wSelectItm
					, processed	: wProcessedId
			};
			// ���C���ĕ`��i���p�_�ւ̊֘A�t���ȊO�j
			wLineParam.relation = false;
			this.drawRelationLineAll( this._ContentsItems.person,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.group,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.relation,	wLineParam );

			// ���C���ĕ`��i���p�_�ւ̊֘A�t���j
			wLineParam.relation = true;
			this.drawRelationLineAll( this._ContentsItems.person,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.group,	wLineParam );
			this.drawRelationLineAll( this._ContentsItems.relation,	wLineParam );

			// �t���[���C���`��
			this.drawFreeLineAll();

		} catch(e) {
			throw { name: 'drawRelationRedo.' + e.name, message: e.message };
		}
	};

	// �֘A�t���ǉ�
	clsContentsBox.prototype.addRelation = function( pParam, pRelItem ) {
		try {
			// �֘A��񖳌��Ȃ珈���Ȃ�
			var wNewRel = pParam.relationInf;
			if ( !this.isObject(wNewRel) ) return false;

			// ���p�_����
			var wAddRelation = this.addItem( null, 'item-relation' );
			if ( !wAddRelation ) return false;

			wAddRelation.setContents( wNewRel ); 

			var wDstId = pParam.relationId;
			if ( !wDstId ) return false;

			// �֘A���擾
			var wItemRel = this.getContentsItem( wDstId );
			if ( !wItemRel ) return false;

			// �֌W�ǉ�
			this.setRelation( pRelItem, wItemRel, wAddRelation );

			// �S�֌W���C���ĕ`��
			this.drawRelationRedo();

			try {
				// ���ڕύX�ʒm�i�֌W�X�V�j
				pParam.kind = 'relation';
				this.execLinkCallback( pParam, pRelItem );

			} catch(e) {
				this.catchErrorDsp(e);
			}
			
			return true;

		} catch(e) {
			throw { name: 'addRelation.' + e.name, message: e.message };
		}
	};

	// �֘A�t���ύX
	clsContentsBox.prototype.updRelation = function( pParam, pRelItem ) {
		try {
			// �֘A��񖳌��Ȃ珈���Ȃ�
			var wNewRel = pParam.relationInf;
			if ( !this.isObject(wNewRel) ) return false;

			var wDstId = pParam.relationId;
			if ( !wDstId ) return false;

			// �֘A���擾
			var wItemRel = pRelItem.getRelationItem( wDstId );
			if ( !wItemRel ) return false;

			var wUpdRel = this._ContentsItems.relation[wItemRel.key];
			if ( !wUpdRel ) return false;

			// �ݒ���e�X�V
			wUpdRel.setContents( wNewRel ); 

			// �R�����g�v�f�Đ���
			wUpdRel.setCmtElement();

			// �S�֌W���C���ĕ`��
			this.drawRelationRedo();

			try {
				// ���ڕύX�ʒm�i�֌W�X�V�j
				pParam.kind = 'relation';
				this.execLinkCallback( pParam, pRelItem );

			} catch(e) {
				this.catchErrorDsp(e);
			}
			
			return true;

		} catch(e) {
			throw { name: 'updRelation.' + e.name, message: e.message };
		}
	};

	// �֘A�t���Ώۃ`�F�b�N
	clsContentsBox.prototype.chkRelationTarget = function( pRelItem ) {
		try {
			var wRelIdList = {};

			// ������ID
			var wId = pRelItem.getBoxId();
			wRelIdList[wId] = 1;

			// �e����ID
			var wParentId = pRelItem.getParentId();
			if ( wParentId.length > 0 ) {
				wRelIdList[wParentId] = 1;
			}

			// ���Ɋ֘A�t���Ă��鍀�ڎ擾
			var wRelList = pRelItem.getRelationList();
			for( var wKey in wRelList ) {
				// �֘A����ID
				wRelIdList[wKey] = 1;
				
				// ���p�_��KEY�ݒ�
				wRelIdList[wRelList[wKey].key] = 1;
			}

			// �֘A�t���������p�_
			var wRelKind = pRelItem.getBoxKind();
			if ( this.isItemRelation(wRelKind) ) {
				// �����v�f��ǉ�
				wRelIdList[pRelItem.getMasterParent()] = 1;
				wRelIdList[pRelItem.getMasterTarget()] = 1;
			}

			var wTargetFlg = false;

			// �O���[�v�`�F�b�N
			for( var wGrpKey in this._ContentsItems.group ) {
				if ( !(wGrpKey in wRelIdList) ) {
					wTargetFlg = true;
					break;
				}
			}

			// ���ڃ`�F�b�N
			if ( !wTargetFlg ) {
				for( var wItmKey in this._ContentsItems.person ) {
					if ( !(wItmKey in wRelIdList) ) {
						wTargetFlg = true;
						break;
					}
				}
			}

			// ���p�_�`�F�b�N
			if ( !wTargetFlg ) {
				for( var wRelKey in this._ContentsItems.relation ) {
					if ( !(wRelKey in wRelIdList) ) {
						wTargetFlg = true;
						break;
					}
				}
			}

			return wTargetFlg;

		} catch(e) {
			throw { name: 'chkRelationTarget.' + e.name, message: e.message };
		}
	};

	// �֘A�t���J�n
	clsContentsBox.prototype.addRelationStart = function( pParam, pRelItem ) {
		try {
			// �֌W�ǉ��J�n
			this.addRelationEvent();

			var wKind = pParam.kind;
			var wRelayFlg = false;
			var wReverse  = false;

			// �R�����g�\��
			var wComment = '';
			if ( wKind == 'unrelation' ) {
				wComment = '�����Ώۂ�I�����Ă�������';

			} else if ( wKind == 'relationChg' ) {
				wComment = '�ύX�Ώۂ�I�����Ă�������';

			} else {
				wComment = '�֘A�Ώۂ�I�����Ă�������';

				// �֘A�t���ΏۑI�����͒��p�_���I����ԂƂ���
				wRelayFlg = true;
				// ���֘A�̂ݑΏ�
				wReverse  = true;

			}
			this.dspMouseCmt( pParam.event, wComment );

			// �֌W�p�����[�^��ۑ�
			this._ContentsRelation.item			= pRelItem;
			this._ContentsRelation.relationInf	= pParam.relationInf;
			this._ContentsRelation.kind			= wKind;

			// �x�[�X���j���[������
			this.useContextCtrl( false );

			// ���ڂ�I�����
			this.setSelectItem( pRelItem, { selected: true, relay: wRelayFlg, emphasis: true, emphasisRev: wReverse } );

		} catch(e) {
			// �֌W�ǉ��L�����Z������throw
			this.execFunction( this.addRelationCancel );
			throw { name: 'addRelationStart.' + e.name, message: e.message };
		}
	};

	// �֘A�ΏۑI���C�x���g�ǉ�
	clsContentsBox.prototype.addRelationEvent = function() {
		try {
			// ���ڊm��
			this.addBoxEvents( 'onclick' , this.eventRelationConfirm );

		} catch(e) {
			throw { name: 'addRelationEvent.' + e.name, message: e.message };
		}
	};

	// �֘A�ΏۑI���C�x���g�폜
	clsContentsBox.prototype.delRelationEvent = function() {
		try {
			// ���ڊm��
			this.delBoxEvents( 'onclick' , this.eventRelationConfirm );

		} catch(e) {
			throw { name: 'delRelationEvent.' + e.name, message: e.message };
		}
	};

	// �֘A�t���L�����Z��
	clsContentsBox.prototype.addRelationCancel = function() {
		try {
			// �������łȂ���Ώ����Ȃ�
			if ( !this._ContentsRelation.item ) return;

			// �C�x���g��~
			// ����O����
			this.execFunction( this.delRelationEvent );
			
			// �R�����g��\��
			this.hideMouseCmt();

			if ( this._ContentsRelation.item ) {
				// �I����ԁE�����\������
				this.execFunction( this.resetSelectItem );

				// �S�֌W���C���ĕ`��
				this.execFunction( this.drawRelationRedo );
			}

			this._ContentsRelation.item			= null;
			this._ContentsRelation.relationInf	= null;
			this._ContentsRelation.kind			= '';

			// �x�[�X���j���[�L����
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'addRelationCancel.' + e.name, message: e.message };
		}
	};

	// �֌W�ǉ�
	clsContentsBox.prototype.setRelation = function( pSrcItm, pDstItm, pRelInf ) {
		try {
			if ( !pSrcItm ) return false;
			if ( !pDstItm  ) return false;

			var wMasterId = pDstItm.getBoxId();
			var wMasterKd = pDstItm.getBoxKind();

			// �֘A��
			var wTargetId = pSrcItm.getBoxId();
			var wTargetKd = pSrcItm.getBoxKind();

			// Callback�ݒ�
			pRelInf.setItemCallback( this.eventItemRelationChange );

			// ���ʃ��j���[�ݒ�
			var wPublicMenu = this.getItemPublicMenu( 'item-relation' );
			pRelInf.setPublicMenu( wPublicMenu );

			// �֘A�t�����̐e�ݒ�
			pRelInf.initParent( this._ContentsEleMain );

			// KEY�ݒ�
			pRelInf.setMasterKey( wMasterId, wTargetId );

			// �R�����g�v�f����
			pRelInf.setCmtElement();

			// �֘A�t�����ۑ�
			var wRelationId  = pRelInf.getBoxId();
			this._ContentsItems.relation[wRelationId] = pRelInf;

			// ���ڒǉ���ʒm
			this.execFunction( this.execItemAddFunc, pRelInf );

			// �֘A�t�����ݒ�
			// �� �֘A�t�����ւ̎Q�Ƃ��e���ڂ֐ݒ肷��
			pSrcItm.addRelationItem( wMasterId, { kind: wMasterKd, key: wRelationId, parent: true,  relationInf: pRelInf } );
			pDstItm.addRelationItem( wTargetId, { kind: wTargetKd, key: wRelationId, parent: false, relationInf: pRelInf } );

		} catch(e) {
			throw { name: 'setRelation.' + e.name, message: e.message };
		}
	};

	// �֘A�t�����p�_������
	clsContentsBox.prototype.clearRelationRelay = function( pRelItem ) {
		try {
			// �����ڂƊ֘A���Ă��鍀�ڂƂ̒��p�_��S�ăN���A
			var wRelList = pRelItem.getRelationList();
			if ( !wRelList ) return;

			for( var wKey in wRelList ) {
				// ���p�_�i�R�����g�ʒu�j�N���A
				wRelList[wKey].relationInf.clearLinePoint();

			}

			
		} catch(e) {
			throw { name: 'clearRelationRelay.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ��� - �ړ�
	// **************************************************************

	// ���ڈړ������ݒ�
	clsContentsBox.prototype.moveItemStart = function( pEvent, pMoveObj, pMoveKind, pDrag ) {
		try {
			if ( !pMoveObj ) return false;

			// ���ڂ̃��j���[������
			pMoveObj.setContextAvailable( false );
			pMoveObj.setPositionAvailable( false );

			// �ړ��Ώۍ��ڂ̐ݒ�
			this._ContentsMoveInf.kind		= pMoveKind;
			this._ContentsMoveInf.item		= pMoveObj;
			this._ContentsMoveInf.parent	= pMoveObj.getParentId();

			// �e�������
			if ( this._ContentsMoveInf.parent !== this.getBoxId() ) {
				pMoveObj.setParent( this._ContentsEleMain );
			}

			// �ړ����ڂ��O���[�v
			if ( pMoveObj.isGroup() ) {
				// �͈͓��̒��p�_���ꎞ�I�ɏ���
				this.setAreaRelationCmt( pMoveObj );

			}

			// �ʒu�␳�@�e�̈ʒu�擾
			this._ContentsMoveInf.pos = pMoveObj.getParentPos();

			// �}�E�X�h���b�O�ɂ��ʒu�ړ�
			var wEvtPos = this.getEventPos( pEvent );
			var wStPos = null;
			if ( (typeof pDrag == 'boolean') && (pDrag == true) ) {
				var wItmPos = pMoveObj.getBoxPos();
				
				this._ContentsMoveInf.drag = {
					  left: wEvtPos.x - wItmPos.left
					, top : wEvtPos.y - wItmPos.top
				};

			} else {
				this._ContentsMoveInf.drag = null;

				wStPos = { x: wEvtPos.x, y: wEvtPos.y };
				wStPos.x -= this._ContentsMoveInf.pos.left;
				wStPos.y -= this._ContentsMoveInf.pos.top;

				// ���C����ʂ̃X�N���[���l���Z
				var wMainScroll = this.getScroll( this._ContentsEleMain );
				wStPos.x += wMainScroll.x;
				wStPos.y += wMainScroll.y;

			}

			// �őO�ʂֈړ�
			pMoveObj.dspBox( true, true, wStPos );

			// �x�[�X���j���[������
			this.useContextCtrl( false );

			// �Ώۂ��h���b�O�\�ȏꍇ�̓R�����g�\���Ȃ�
			var wIsDrag = pMoveObj.getItemDragIs();
			if ( !wIsDrag ) {
				var wComment = '����w�肵�Ă�������' ;
				if ( pMoveKind == 'add' ) {
					wComment = '�ǉ�' + wComment;
				} else {
					wComment = '�ړ�' + wComment;
				}
				this.dspMouseCmt( pEvent, wComment );
			}

			// �ړ��C�x���g�ݒ�
			this.addMoveEvent( wIsDrag );


		} catch(e) {
			// �ړ��L�����Z������throw
			this.execFunction( this.moveItemCancel );
			throw { name: 'moveItemStart.' + e.name, message: e.message };

		}
	};

	// ���ڈړ��I���i�㏈���j
	clsContentsBox.prototype.moveItemCancel = function() {
		try {
			// �������łȂ���Ώ����Ȃ�
			if ( this._ContentsMoveInf.kind == '' ) return;

			// �C�x���g��~
			// ����O����
			this.execFunction( this.delMoveEvent );
			
			// �R�����g��\��
			this.hideMouseCmt();

			// ���p�_����
			this.execFunction( this.freeAreaRelationCmt );

			if ( this._ContentsMoveInf.item ) {
				// ���ڒǉ�
				if ( this._ContentsMoveInf.kind == 'add' ) {
					// �ǉ����ڍ폜
					this._ContentsMoveInf.item.freeClass();

				// �ړ��̂�
				} else {
					// ���ڍőO�ʏI��
					this._ContentsMoveInf.item.dspBox( true, false );

					// �ړ����ڂ̊֘A��񒆌p�_������
					this.clearRelationRelay( this._ContentsMoveInf.item );

					// �z�u�ҏW���[�h��
					if ( this.isEditModeMove() ) {
						// ���ڂ̈ʒu�������j���[�L����
						this._ContentsMoveInf.item.setPositionAvailable( true );

					}

					// �ړ����ڂ�D��I�ɕ`��
					var wLineParam = { priority: this._ContentsMoveInf.item };

					// �S�֌W���C���ĕ`��
					this.drawRelationRedo( wLineParam );

				}
			}

			this._ContentsMoveInf.kind		= '';
			this._ContentsMoveInf.item		= null;
			this._ContentsMoveInf.pos		= null;
			this._ContentsMoveInf.parent	= null;
			this._ContentsMoveInf.drag		= null;

			// �x�[�X���j���[�L����
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'moveItemCancel.' + e.name, message: e.message };
		}
	};

	// ���ڈړ��C�x���g�ݒ�
	clsContentsBox.prototype.addMoveEvent = function( pDragIs ) {
		try {
			// �}�E�X�Ǐ]
			this.addBoxEvents( 'onmousemove'	, this.eventItemMove );

			// ���ڊm��
			if ( pDragIs ) {
				this.addBoxEvents( 'onmouseup'		, this.eventItemMoveEnd );
			} else {
				this.addBoxEvents( 'onmousedown'	, this.eventItemMoveEnd );
			}

		} catch(e) {
			throw { name: 'addMoveEvent.' + e.name, message: e.message };
		}
	};

	// ���ڈړ��C�x���g����
	clsContentsBox.prototype.delMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.delBoxEvents( 'onmousemove'	, this.eventItemMove );

			// ���ڊm��
			this.delBoxEvents( 'onmouseup'		, this.eventItemMoveEnd );
			this.delBoxEvents( 'onmousedown'	, this.eventItemMoveEnd );

		} catch(e) {
			throw { name: 'delMoveEvent.' + e.name, message: e.message };
		}
	};

	// ���ڈړ��m��
	clsContentsBox.prototype.moveItemConfirm = function( pEvent, pMoveKind, pMoveItem ) {
		try {
			var wItemId = pMoveItem.getBoxId();
			var wItemKd = pMoveItem.getBoxKind();

			// �ړ���̍��ڃ`�F�b�N
			if ( !this.chkItemOverlapToPoint(pMoveItem) ) return false;

			// �ړ���̃L�����o�X�͈̓`�F�b�N
			if ( !this.chkItemOverflowArea(pMoveItem) ) {
				this.alertMouseCmt( 'overflow' );
				return false;
			}

			// �l�����ڂ̏ꍇ
			if ( this.isItemPerson(wItemKd) ) {
				// �N���b�N�ʒu�O���[�v�`�F�b�N
				var wSelGrp = this.chkGroupOverlapToClick( pEvent );

				// �e�ύX
				if ( wSelGrp ) {
					// �e�ɐݒ�
					if ( wSelGrp.getBoxId() !== pMoveItem.getParentId() ) {
						pMoveItem.setParent( wSelGrp.getBoxElement() );
						
						// �֌W������
						this.liftRelation( pMoveItem, wSelGrp );
						
					}
				
				}

			// ���p�_�̏ꍇ
			} else if ( this.isItemRelation(wItemKd) ) {
				// ���p�_�R�����g�ʒu�m��
				pMoveItem.setCommentPoint( pEvent );

			}

			// ���ڒǉ����ȊO�͏����I���i����j
			if ( pMoveKind != 'add' ) return true;

			var wAddCancel = false;

			// �l���ǉ�
			if ( this.isItemPerson(wItemKd) ) {
				// �ǉ����ڂ�ۑ�
				this._ContentsItems.person[wItemId] = pMoveItem;
				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// �O���[�v�ǉ�
			} else if ( this.isItemGroup(wItemKd) ) {
				// �ǉ����ڂ�ۑ�
				this._ContentsItems.group[wItemId] = pMoveItem;
				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// �R�����g�ǉ�
			} else if ( this.isItemComment(wItemKd) ) {
				// �ǉ����ڂ�ۑ�
				this._ContentsItems.comment[wItemId] = pMoveItem;
				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// �t���[���C���ǉ�
			} else if ( this.isItemFreeLine(wItemKd) ) {
				// �ǉ����ڂ�ۑ�
				this._ContentsItems.freeline[wItemId] = pMoveItem;
				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, pMoveItem );

			// �ȊO
			} else {
				// �ǉ��L�����Z��
				wAddCancel = true;

			}
			
			if ( !wAddCancel ) {
				// �ړ���ʂ��u�ړ��v�ɕύX
				// ���u�ǉ��v�̂܂܂��ƏI�������Œǉ����ڂ��폜������
				this._ContentsMoveInf.kind = 'move';
			}

			return true;

		} catch(e) {
			throw { name: 'moveItemConfirm.' + e.name, message: e.message };
		}
	};

	// �ꎞ�I�ɏ������������p�_������
	clsContentsBox.prototype.freeAreaRelationCmt = function() {
		try {
			// �Ώۑ��݂���ꍇ�̂�
			var wTargetRel = this._ContentsMoveInf.relation;
			if ( !wTargetRel ) return null;

			// ���C����ʂ̈ʒu�␳
			var wMainPos	= this.getPos( this._ContentsEleMain );
			var wMainScroll	= this.getScroll( this._ContentsEleMain );

			var wRelation;
			var wRelPos;
			var wRelCrt;

			var wTargetCnt = wTargetRel.length;
			for( var wIndex = 0; wIndex < wTargetCnt; wIndex++ ) {
				// �O���[�v�������
				wRelation = wTargetRel[wIndex];
				wRelation.setParent( this._ContentsEleMain );

				// ���p�_�ʒu���X�V
				wRelPos = wRelation.getBoxPos();
				wRelCrt = wRelation.getLinePointCorrection();

				wRelPos.x = wRelPos.left - wMainPos.left;
				wRelPos.x += wMainScroll.x + wRelCrt.x;

				wRelPos.y = wRelPos.top - wMainPos.top;
				wRelPos.y += wMainScroll.y + wRelCrt.y;

				wRelation.setLinePointPos( wRelPos );
			}

			// �Ώۍ��ڂ�����
			this._ContentsMoveInf.relation = null;

		} catch(e) {
			throw { name: 'freeAreaRelationCmt.' + e.name, message: e.message };
		}
	};

	// �͈͓��̒��p�_���ꎞ�I�ɏ���
	clsContentsBox.prototype.setAreaRelationCmt = function( pItem ) {
		try {
			// ��U����
			this.freeAreaRelationCmt();

			// �e�Ƃ��Đݒ�
			var wParentEle = pItem.getBoxElement();
			if ( !wParentEle ) return null;

			// ���ڂ͈͎̔擾
			var wArea = pItem.getBoxRect();

			// �͈͓��ɂ��钆�p�_�擾
			var wTargetRel = this.getRelationOverlapToRect( wArea );
			if ( !wTargetRel ) return null;

			// ��U���ڂɏ���
			var wTargetCnt = wTargetRel.length;
			for( var wIndex = 0; wIndex < wTargetCnt; wIndex++ ) {
				wTargetRel[wIndex].setParent( wParentEle );
			
			}

			// �Ώۍ��ڂ�ۑ�
			this._ContentsMoveInf.relation = wTargetRel;

		} catch(e) {
			throw { name: 'getAreaRelationCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ��� - �T�C�Y�ύX
	// **************************************************************

	// ���T�C�Y�J�n
	clsContentsBox.prototype.resizeItem = function( pEvent, pResizeObj ) {
		try {
			if ( !pResizeObj ) return false;
			this._ContentsResizeInf.item = pResizeObj;

			// ���T�C�Y�J�n�G���[
			this.addResizeEvent();

			// �őO�ʂֈړ�
			this._ContentsResizeInf.item.dspBox( true, true );

			// �x�[�X���j���[������
			this.useContextCtrl( false );

			// �R�����g�\��
			this.dspMouseCmt( pEvent, '�T�C�Y���w�肵�Ă�������' );

		} catch(e) {
			// �ړ��L�����Z������throw
			this.execFunction( this.cancelResizeItem );
			throw { name: 'resizeItem.' + e.name, message: e.message };
		}
	};

	// ���T�C�Y�I��
	clsContentsBox.prototype.cancelResizeItem = function() {
		try {
			// �������łȂ���Ώ����Ȃ�
			if ( !this._ContentsResizeInf.item ) return;

			// �C�x���g��~
			// ����O����
			this.execFunction( this.delResizeEvent );
			
			// �R�����g��\��
			this.hideMouseCmt();

			// �őO�ʉ�����
			this._ContentsResizeInf.item.dspBox( true, false );

			// �O���[�v�̏ꍇ
			if ( this._ContentsResizeInf.item.isGroup() ) {
				// �ړ����ڂ�D��I�ɕ`��
				var wLineParam = { priority: this._ContentsResizeInf.item };

				// �S�֌W���C���ĕ`��
				this.drawRelationRedo( wLineParam );
			
			}

			this._ContentsResizeInf.item = null;

			// �x�[�X���j���[�L����
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'cancelResizeItem.' + e.name, message: e.message };
		}
	};

	// ���T�C�Y�C�x���g�ݒ�
	clsContentsBox.prototype.addResizeEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.addBoxEvents( 'onmousemove'	, this.eventItemResize );

			// ���ڊm��
			this.addBoxEvents( 'onclick'		, this.eventItemResizeEnd );

		} catch(e) {
			throw { name: 'addResizeEvent.' + e.name, message: e.message };
		}
	};

	// ���T�C�Y�C�x���g����
	clsContentsBox.prototype.delResizeEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.delBoxEvents( 'onmousemove'	, this.eventItemResize );

			// ���ڊm��
			this.delBoxEvents( 'onclick'		, this.eventItemResizeEnd );

		} catch(e) {
			throw { name: 'delResizeEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ��� - �X�V
	// **************************************************************

	// �X�V���ڑI���@�J�n
	clsContentsBox.prototype.updItemStart = function( pParam, pItemKind ) {
		try {
			if ( !pParam ) return false;

			// �ړ��C�x���g�ݒ�
			this.addUpdEvent();

			// �ړ��Ώۍ��ڂ̐ݒ�
			this._ContentsUpdInf.kind	= pItemKind;
			this._ContentsUpdInf.param	= pParam;

			// �x�[�X���j���[������
			this.useContextCtrl( false );

			// �R�����g�\��
			var wComment = '�Ώۂ��w�肵�Ă�������' ;
			if ( 'comment' in pParam ) {
				wComment = pParam.comment;
			}
			this.dspMouseCmt( pParam, wComment );

		} catch(e) {
			// �ړ��L�����Z������throw
			this.execFunction( this.updItemCancel );
			throw { name: 'updItemStart.' + e.name, message: e.message };

		}
	};

	// ���ڍX�V�I���i�㏈���j
	clsContentsBox.prototype.updItemCancel = function() {
		try {
			// �������łȂ���Ώ����Ȃ�
			if ( !this._ContentsUpdInf.param ) return;

			// �C�x���g��~
			// ����O����
			this.execFunction( this.delUpdEvent );
			
			// �R�����g��\��
			this.hideMouseCmt();

			// �X�V���j��
			this._ContentsUpdInf.kind	= '';
			this._ContentsUpdInf.param	= null;

			// �x�[�X���j���[�L����
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'updItemCancel.' + e.name, message: e.message };
		}
	};

	// ���ڍX�V�C�x���g�ݒ�
	clsContentsBox.prototype.addUpdEvent = function() {
		try {
			// ���ڊm��
			this.addBoxEvents( 'onclick'	, this.eventItemUpdSelect );

		} catch(e) {
			throw { name: 'addUpdEvent.' + e.name, message: e.message };
		}
	};

	// ���ڍX�V�C�x���g����
	clsContentsBox.prototype.delUpdEvent = function() {
		try {
			// ���ڊm��
			this.delBoxEvents( 'onclick'	, this.eventItemUpdSelect );

		} catch(e) {
			throw { name: 'delUpdEvent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ��� - �ʒu����
	// **************************************************************

	// �ʒu�����J�n
	clsContentsBox.prototype.positionItemStart = function( pParam, pTarget ) {
		try {
			// �֌W�ǉ��J�n
			this.addPositionEvent();

			// �R�����g�\��
			var wComment = '�Ώۂ�I�����Ă�������';

			this.dspMouseCmt( pParam.event, wComment );

			// �ʒu�����p�����[�^��ۑ�
			this._ContentsPosition.item		= pTarget;
			this._ContentsPosition.kind		= pParam.kind;

			// �x�[�X���j���[������
			this.useContextCtrl( false );

			// ���ڂ�I�����
			this.setSelectItem( pTarget, { selected: true, only: true } );

		} catch(e) {
			// �֌W�ǉ��L�����Z������throw
			this.execFunction( this.positionItemCancel );
			throw { name: 'positionItemStart.' + e.name, message: e.message };
		}
	};

	// �ʒu�����ΏۑI���C�x���g�ǉ�
	clsContentsBox.prototype.addPositionEvent = function() {
		try {
			// ���ڊm��
			this.addBoxEvents( 'onclick' , this.eventPositionConfirm );

		} catch(e) {
			throw { name: 'addPositionEvent.' + e.name, message: e.message };
		}
	};

	// �ʒu�����ΏۑI���C�x���g�폜
	clsContentsBox.prototype.delPositionEvent = function() {
		try {
			// ���ڊm��
			this.delBoxEvents( 'onclick' , this.eventPositionConfirm );

		} catch(e) {
			throw { name: 'delPositionEvent.' + e.name, message: e.message };
		}
	};

	// �ʒu�����L�����Z��
	clsContentsBox.prototype.positionItemCancel = function() {
		try {
			// �������łȂ���Ώ����Ȃ�
			if ( !this._ContentsPosition.item ) return;

			// �C�x���g��~
			// ����O����
			this.execFunction( this.delPositionEvent );
			
			// �R�����g��\��
			this.hideMouseCmt();

			if ( this._ContentsPosition.item ) {
				// �I����ԁE�����\������
				this.execFunction( this.resetSelectItem );

				// �S�֌W���C���ĕ`��
				this.execFunction( this.drawRelationRedo );
			}

			this._ContentsPosition.item		= null;
			this._ContentsPosition.kind		= '';

			// �x�[�X���j���[�L����
			this.useContextCtrl( true );

		} catch(e) {
			throw { name: 'positionItemCancel.' + e.name, message: e.message };
		}
	};

	// �ʒu�����m��
	clsContentsBox.prototype.positionItemConfirm = function( pTargetItm, pClickItem ) {
		try {
			var wClickKd	= pClickItem.getBoxKind();
			var wClickId	= pClickItem.getBoxId();
			var wClickPid	= pClickItem.getParentId();

			var wTargetKd	= pTargetItm.getBoxKind();
			var wTargetId	= pTargetItm.getBoxId();
			var wTargetPid	= pTargetItm.getParentId();

			// �����ڃ`�F�b�N
			if ( wTargetId == wClickId ) return false;

			// ���e���ڃ`�F�b�N
			if ( wTargetPid == wClickId ) return false;
			
			// �Ώۂ�group
			if ( this.isItemGroup(wTargetKd) ) {
				// ���g�ɏ������鍀�ڃ`�F�b�N
				if ( wTargetId == wClickPid ) return false;
			}

			// �ړ��O�Ώۈʒu
			var wTargetBef = pTargetItm.getBoxRect();
			var wClickRect = pClickItem.getBoxRect();

			// ���ڗ̈�`�F�b�N
			if ( pClickItem.chkBoxInRect(wTargetBef) ) return false;

			// �N���b�N���ڂ����p�_
			if ( this.isItemRelation(wClickKd) ) {
				if ( pTargetItm.chkBoxInRect(wClickRect) ) return false;
			}

			// �Ώۍ��ڏ��
			var wTargetSize	= pTargetItm.getBoxSize( { border: false } );
			var wTargetLine	= 0;
			if ( this.isItemRelation(wTargetKd) ) wTargetLine = pTargetItm.getDefLineWidth();

			// �e��Group�̏ꍇ�͈ʒu�Ȃǎ擾
			var wParentItem = null;
			var wParentRect	= null;
			var wParentLine	= null;

			if ( wTargetPid in this._ContentsItems.group ) {
				wParentItem = this._ContentsItems.group[wTargetPid];
				
				wParentRect	= wParentItem.getBoxRect();
				wParentLine	= wParentItem.getBoxLine();

			}

			// �N���b�N���ڂ̈ʒu�擾
			var wClickSize	= pClickItem.getBoxSize( { border: false } );

			// ���C����ʂ̈ʒu�␳
			var wMainPos	= this.getPos( this._ContentsEleMain );
			var wMainScroll	= this.getScroll( this._ContentsEleMain );

			// �ʒu�ύX
			var wMovePos = {};

			switch( this._ContentsPosition.kind ) {
			// �ʒu�����i�c�j
			case 'pos-vert':
				// ���p�_�I�����̒���
				var wRelationTop = this.getPositionRelMove( {
										  targetKd		: wTargetKd
										, targetSize	: wTargetSize.height
										, targetLine	: wTargetLine
										, clickKd		: wClickKd
										, clickSize		: wClickSize.height
									} );
				wClickRect.top += wRelationTop;

				// �ړ���`�F�b�N�p
				// ���X�N���[���A�e�̈ʒu�����s�v
				var wHeight = wTargetBef.bottom - wTargetBef.top;
				wTargetBef.top		= wClickRect.top;
				wTargetBef.bottom	= wClickRect.top + wHeight;

				// ���C����ʂ̃X�N���[������
				wClickRect.top -= wMainPos.top;
				wClickRect.top += wMainScroll.y;

				// �e�̈ʒu����
				if ( wParentItem ) {
					var wParentTop = wParentRect.top - wMainPos.top;
					wParentTop += wMainScroll.y;

					wClickRect.top -= wParentTop;
					if ( wParentLine ) wClickRect.top -= wParentLine.width;
				}

				// �ړ���ݒ�
				wMovePos.y = wClickRect.top;

				break;

			// �ʒu�����i���j
			case 'pos-side':
				// ���p�_�I�����̒���
				var wRelationLeft = this.getPositionRelMove( {
										  targetKd		: wTargetKd
										, targetSize	: wTargetSize.width
										, targetLine	: wTargetLine
										, clickKd		: wClickKd
										, clickSize		: wClickSize.width
									} );
				wClickRect.left += wRelationLeft;

				// �ړ���`�F�b�N�p
				// ���X�N���[���A�e�̈ʒu�����s�v
				var wWidth = wTargetBef.right - wTargetBef.left;
				wTargetBef.left		= wClickRect.left;
				wTargetBef.right	= wClickRect.left + wWidth;

				// ���ʒu�ύX
				wClickRect.left -= wMainPos.left;
				wClickRect.left += wMainScroll.x;

				// �e�̈ʒu����
				if ( wParentItem ) {
					var wParentLeft = wParentRect.left - wMainPos.left;
					wParentLeft += wMainScroll.x;

					wClickRect.left -= wParentLeft;
					if ( wParentLine ) wClickRect.left -= wParentLine.width;
				}

				// �ړ���ݒ�
				wMovePos.x = wClickRect.left;

				break;
			}

			var wOverflow = false;
			var wCheckParam = {
				  targetRect : wTargetBef
			};

			// �O���[�v
			if ( this.isItemGroup(wTargetKd) ) {
				// �ړ���ɑ����ڂ���Ζ���
				if ( !this.chkItemOverlapToPoint(pTargetItm, wCheckParam) ) {
					this.alertMouseCmt( 'overlap' );
					return false;
				
				}
				
				// �͈͓��̒��p�_���ꎞ�I�ɏ���
				this.setAreaRelationCmt( pTargetItm );

			// ����
			} else if ( this.isItemPerson(wTargetKd) ) {
				// �ړ���ɑ����ڂ���Ζ���
				wCheckParam.overlap = false;
				if ( !this.chkItemOverlapToPoint(pTargetItm, wCheckParam) ) {
					this.alertMouseCmt( 'overlap' );
					return false;
				}

				// �͈͊O�`�F�b�N
				// �e���O���[�v
				if ( wParentItem ) {
					if ( !wParentItem.chkBoxInRect(wTargetBef) ) {
						this.alertMouseCmt( 'overflow-group' );
						return false;
					}

				// �e���L�����o�X
				} else {
					var wParentRect = pTargetItm.getParentRect();
					var wParentSize = pTargetItm.getParentSize( { overflow: true } );
					var wParentScrl = pTargetItm.getParentScroll();

					// ���C����ʂ̃X�N���[������
					wParentRect.top		-= wParentScrl.y;
					wParentRect.left	-= wParentScrl.x;

					wParentRect.bottom	= wParentRect.top  + wParentSize.height;
					wParentRect.right	= wParentRect.left + wParentSize.width;

					if ( !this.chkInRect(wParentRect, wTargetBef) ) {
						this.alertMouseCmt( 'overflow' );
						return false;
					}

				}
				
				// �e���ڂ���͂ݏo���ĕ\������
				wOverflow = true;

			// ���p�_�̏ꍇ
			} else if ( this.isItemRelation(wTargetKd) ) {
				// ���p�_�ړ�
				pTargetItm.setLinePointPos( wMovePos );

			}

			// ���ڈړ�
			pTargetItm.setBoxPos( wMovePos, { overflow: wOverflow } );

			// �O���[�v
			if ( this.isItemGroup(wTargetKd) ) {
				// ���p�_�̏�������
				this.execFunction( this.freeAreaRelationCmt );
			
			}
			
			return true;

		} catch(e) {
			throw { name: 'positionItemConfirm.' + e.name, message: e.message };
		}
	};

	// �ړ��悪���p�_�̏ꍇ�̈ʒu�␳�l
	clsContentsBox.prototype.getPositionRelMove = function( pParam ) {
		try {
			var wRelationPos = 0;

			// ���p�_�̏ꍇ
			if ( this.isItemRelation(pParam.targetKd) ) {
				// �N���b�N���ڂ̒��S�ɍ��킹��
				if ( pParam.clickSize > 2 ) {
					wRelationPos += Math.floor(pParam.clickSize / 2);
					if ( (pParam.clickSize % 2) == 0 ) wRelationPos++;
				}

				// ���p�_�ȊO���N���b�N
				if ( !this.isItemRelation(pParam.clickKd) ) {
					// ���C�������Z
					wRelationPos += pParam.targetLine;
				}

			// �N���b�N���ڂ����p�_�̏ꍇ
			} else if ( this.isItemRelation(pParam.clickKd) ) {
				// ���S���m�����킹��
				if ( pParam.clickSize > 2 ) {
					wRelationPos += Math.floor(pParam.clickSize / 2);
					if ( (pParam.clickSize % 2) == 0 ) wRelationPos--;
				}
				if ( pParam.targetSize > 2 ) wRelationPos -= Math.floor(pParam.targetSize / 2);

			}
			
			return wRelationPos;

		} catch(e) {
			throw { name: 'getPositionRelMove.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ��� - �I��
	// **************************************************************

	// �I����Ԑݒ�
	clsContentsBox.prototype.setSelectState = function( pSelectItm, pParam ) {
		try {
			var wRetVal = false;
			var wSelected = false;
			var wRelation = false;

			if ( typeof pParam == 'boolean' ) {
				wSelected = pParam

			} else {
				wSelected = pParam.selected;
				wRelation = pParam.relation;
			}

			if ( wSelected ) {
				// ���ڂ�I�����
				if ( wRelation ) {
					wRetVal = pSelectItm.selectItemRel( wSelected );
					
				} else {
					wRetVal = pSelectItm.selectItem( wSelected );
				
				}

			} else {
				// �I������
				wRetVal = pSelectItm.selectItemFree();

			}

			// �I����ԕύX��
			if ( wRetVal ) {
				// ���ڕύX�ʒm�i���ڑI���j
				this.execLinkCallback( { kind: 'select', selected: wSelected }, pSelectItm );
			
			}
			
			return wRetVal;

		} catch(e) {
			throw { name: 'setSelectState.' + e.name, message: e.message };
		}
	};

	// ���ڂƊ֘A���ڂ̋����\���i���荀�ڈȊO��ڗ����Ȃ�����j
	clsContentsBox.prototype.emphasisSelectItem = function( pSelectedItms, pSelected, pEmphaRev ) {
		try {
			// ���I��Class�ݒ�
			function setNoEmphasisClass( pTargetList, pSelectList ) {
				try {
					var wTarget;

					for( var wKey in pTargetList ) {
						// ��U�I��pClass�폜
						pTargetList[wKey].delBoxClass( 'cssItem-emphasis' );
						pTargetList[wKey].delBoxClass( 'cssItem-non-emphasis' );

						// �I�����̂�Class�Đݒ�
						if ( !pSelected ) continue;

						// �I�����ڂ̂݋���
						if ( !pEmphaRev ) {
							wTarget = !(wKey in pSelectList)
						
						// �I�����ڈȊO������
						} else {
							wTarget = (wKey in pSelectList)

						}
							
						// �^�[�Q�b�g
						if ( wTarget ) {
							// �ڗ����Ȃ�����Class�ǉ�
							pTargetList[wKey].setBoxClass( 'cssItem-non-emphasis' );
							
						// �^�[�Q�b�g�ȊO
						} else if ( pSelected ) {
							// ����class�ǉ�
							pTargetList[wKey].setBoxClass( 'cssItem-emphasis' );

						}
					}

				} catch(e) {
					throw { name: 'setNonSelectClass', message: e.message };
				}
			};
			
			// ���I��Class�ݒ�
			setNoEmphasisClass( this._ContentsItems.person,		pSelectedItms );
			setNoEmphasisClass( this._ContentsItems.group,		pSelectedItms );
			setNoEmphasisClass( this._ContentsItems.relation,	pSelectedItms );
			setNoEmphasisClass( this._ContentsItems.freeline,	pSelectedItms );

		} catch(e) {
			throw { name: 'emphasisSelectItem.' + e.name, message: e.message };
		}
	};

	// ���p�_�̐e�̑I����Ԑݒ�
	clsContentsBox.prototype.setSelectRelationMaster = function( pRelItm, pParam, pSelectedList ) {
		try {
			// ���g�����p�_�̏ꍇ�̂�
			if ( !pRelItm.isRelation() ) return;

			// �e�̑I����Ԑݒ�
			var wParentItm = this.getContentsItem( pRelItm.getMasterParent() );
			if ( wParentItm ) {
				// ���ݒ�Ȃ珈��
				var wParentId = wParentItm.getBoxId();
				if ( !(wParentId in pSelectedList) ) {
					// ���ċA�ɂ��I����Ԑݒ�
					this.setSelectItemState( wParentItm, pParam, pSelectedList );
				}
			}

			// �֘A�捀�ڑI����Ԑݒ�
			var wTargetItm = this.getContentsItem( pRelItm.getMasterTarget() );
			if ( wTargetItm ) {
				// ���ݒ�Ȃ珈��
				var wTargetId = wTargetItm.getBoxId();
				if ( !(wTargetId in pSelectedList) ) {
					// ���ċA�ɂ��I����Ԑݒ�
					this.setSelectItemState( wTargetItm, pParam, pSelectedList );
				}
			}

		} catch(e) {
			throw { name: 'setSelectRelationMaster.' + e.name, message: e.message };
		}
	};

	// �֘A���ڂ̑I����Ԑݒ�
	clsContentsBox.prototype.setSelectRelationItem = function( pSelectItm, pParam, pSelectedList ) {
		try {
			// �֘A���ڂ�I�����
			var wRelationList = pSelectItm.getRelationList();
			if ( !wRelationList ) return;

			// �p�����[�^�ݒ�
			if ( !pParam ) return;
			var wSelected = pParam.selected;
			var wRelayFlg = pParam.relay;
			var wBeyond   = pParam.beyond;

			var wParam;
			var wRelItm;
			var wRelayItm;
			for ( var wId in wRelationList ) {
				// �Ώۂ̃p�����[�^���獀�ڎ擾
				wParam = wRelationList[wId];
				if ( !wParam ) continue;

				wRelItm = this.getContentsItem( wId, wParam.kind );
				if ( !wRelItm ) continue;

				// �֘A���ڂ̑I����Ԑݒ�
				// ���ċA�ɂ��I����Ԑݒ�
				this.setSelectItemState( wRelItm, pParam, pSelectedList );

				// ���p�_�Ώہ@�܂��́@���p�_����Ώ�
				if ( !wRelayFlg && !wBeyond ) continue;

				// ���p�_����
				if ( !wParam.relationInf ) continue;

				wRelayItm = this._ContentsItems.relation[wParam.relationInf.getBoxId()];
				if ( !wRelayItm ) continue;

				// ���p�_�I����Ԑݒ�
				// ���ċA�ɂ��I����Ԑݒ�
				this.setSelectItemState( wRelayItm, pParam, pSelectedList );
			}

		} catch(e) {
			throw { name: 'setSelectRelationItem.' + e.name, message: e.message };
		}
	};

	// �֘A���ڂ̑I����Ԑݒ�
	clsContentsBox.prototype.setSelectItemState = function( pSelectItem, pParam, pSelectedList ) {
		try {
			var wSelectId = pSelectItem.getBoxId();

			// �ݒ�ςȂ珈���Ȃ�
			if ( wSelectId in pSelectedList ) return;

			// �I����Ԑݒ�
			var wSelected = pParam.selected;
			var wRelation = pParam.relation;

			this.setSelectState( pSelectItem, { selected: wSelected, relation: wRelation } );
			pSelectedList[wSelectId] = 1;

			var wIsRelation		= pSelectItem.isRelation();
			var wSetRelation	= false;
			var wSetMaster		= false;

			// �區�ڂ̏ꍇ
			if ( !wRelation ) {
				// �I�����ڂ݂̂̏ꍇ�͏����I��
				if ( pParam.only ) return;

				// �֘A���ڂ̑I����Ԑݒ�@�L��
				wSetRelation = true;

				// ���p�_�Ώێ�
				if ( pParam.relay ) {
					// ���p�_�̏ꍇ�͐e�̏�Ԑݒ�
					if ( wIsRelation ) wSetMaster = true;
				}

				// 1���ږڈȍ~�͊֘A����
				pParam.relation = true;

			// �֘A����
			} else {
				// ���p�_�ȊO�͏����I��
				if ( !wIsRelation ) return;

				// ���p�_�̐���Ώ�
				if ( pParam.beyond ) {
					// �֘A���ڂ̑I����Ԑݒ�@�L��
					wSetRelation = true;

					// �e�̏�Ԑݒ�
					wSetMaster = true;
				}

			}

			// ���p�_�̐e�̏�Ԑݒ�
			if ( wSetMaster ) {
				// ���ċA�ɂ��I����Ԑݒ�
				this.setSelectRelationMaster( pSelectItem, pParam, pSelectedList );
			}

			// �֘A���ڂ̑I����Ԑݒ�
			if ( wSetRelation ) {
				// ���ċA�ɂ��I����Ԑݒ�
				this.setSelectRelationItem( pSelectItem, pParam, pSelectedList );
			}

		} catch(e) {
			throw { name: 'setSelectItemState.' + e.name, message: e.message };
		}
	};

	// ���ڂƊ֘A���ڂ̑I����Ԑݒ�
	clsContentsBox.prototype.setSelectItem = function( pSelectItm, pParam ) {
		try {
			// �p�����[�^�ݒ�
			var wStatPram = {};

			if ( typeof pParam == 'boolean' ) {
				wStatPram.selected = pParam

			} else {
				for( var wKey in pParam ) {
					wStatPram[wKey] = pParam[wKey];
				}

			}

			// �I�����ڃ��X�g
			var wSelectedItms = {}

			// ���ڂ�I�����
			this.setSelectItemState( pSelectItm, pParam, wSelectedItms );

			// ���ڑI��
			if ( wStatPram.selected ) {
				// �I�����ڕۑ�
				this._ContentsSelectInf.item = pSelectItm;

			// �I������
			} else {
				// �I�����ڃN���A
				this._ContentsSelectInf.item = null;
			
			}

			if ( wStatPram.emphasis ) {
				// ���ڂ�ڗ����Ȃ�����
				this.emphasisSelectItem( wSelectedItms, wStatPram.selected, wStatPram.emphasisRev );

				// �Ώۍ��ڂ̊֘A�̂݃��C���`��
				this.drawRelationRedo( { select: pSelectItm } );
			}

		} catch(e) {
			throw { name: 'setSelectItem.' + e.name, message: e.message };
		}
	};

	// ���ڑI������
	clsContentsBox.prototype.resetSelectItem = function( ) {
		try {
			var self = this;

			// �S���ڑI������
			function resetSelect( pItemList ) {
				if ( !pItemList ) return;

				for( var wKey in pItemList ) {
					// �I������
					self.setSelectState( pItemList[wKey], false );
					
					// �I��pClass�폜
					pItemList[wKey].delBoxClass( 'cssItem-emphasis' );
					pItemList[wKey].delBoxClass( 'cssItem-non-emphasis' );
					
				}
			};
			
			resetSelect( this._ContentsItems.person );
			resetSelect( this._ContentsItems.group );
			resetSelect( this._ContentsItems.relation );
			resetSelect( this._ContentsItems.comment );
			resetSelect( this._ContentsItems.freeline );

			// �I�����ڃN���A
			this._ContentsSelectInf.item = null;

		} catch(e) {
			throw { name: 'resetSelectItem', message: e.message };
		}
	};

	// ���ڂƊ֘A���ڂ̑I����Ԃ�S�ĉ���
	clsContentsBox.prototype.resetSelectAll = function() {
		try {
			var self = this;

			function freeSelect( pList ) {
				try {
					var wSelected;

					for( var wKey in pList ) {
						if ( pList.hasOwnProperty(wKey) ) {
							// �I������
							if ( pList[wKey].selectItemIs() ) {
								pList[wKey].selectItem(false);
								wSelected = true;
							
							} else if ( pList[wKey].selectItemRelIs() ) {
								pList[wKey].selectItemRel( false );
								wSelected = true;

							} else {
								wSelected = false;

							}
							
							// �I���������͕ύX�ʒm
							if ( wSelected ) {
								self.execLinkCallback( { kind: 'select', selected: false }, pList[wKey] );

							}
						}
					}

				} catch(e) {
					throw { name: 'freeSelect.' + e.name, message: e.message };
				}
			};

			freeSelect( this._ContentsItems.person );
			freeSelect( this._ContentsItems.group );
			freeSelect( this._ContentsItems.relation );
			freeSelect( this._ContentsItems.comment );
			freeSelect( this._ContentsItems.freeline );

		} catch(e) {
			throw { name: 'resetSelectAll.' + e.name, message: e.message };
		}
	};

	// �N���b�N�������ڂ�I�����
	clsContentsBox.prototype.selectClickItem = function( pClickItem ) {
		try {
			// �I�𒆂̍��ڃN���b�N��
			var wResetFlg = false;
			if ( this._ContentsSelectInf.item ) {
				var wSelId = this._ContentsSelectInf.item.getBoxId();

				if ( pClickItem ) {
					var wClickId = pClickItem.getBoxId();
					if ( wSelId == wClickId ) wResetFlg = true;
				}
			}

			// �I������
			this.execFunction( this.resetSelectItem );

			// ���Z�b�g���ȊO
			if ( !wResetFlg ) {
				// ���ڂ�I�����
				this.setSelectItem( pClickItem, { selected: true, beyond: true } );

			}

		} catch(e) {
			throw { name: 'selectClickItem.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڑ���
	// **************************************************************

	// ���ڂ��l�����ǂ���
	clsContentsBox.prototype.isItemPerson = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-person' );

		} catch(e) {
			throw { name: 'isItemPerson', message: e.message };
		}
	};

	// ���ڂ��O���[�v���ǂ���
	clsContentsBox.prototype.isItemGroup = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-group' );

		} catch(e) {
			throw { name: 'isItemGroup', message: e.message };
		}
	};

	// ���ڂ��R�����g���ǂ���
	clsContentsBox.prototype.isItemComment = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-comment' );

		} catch(e) {
			throw { name: 'isItemComment', message: e.message };
		}
	};

	// ���ڂ��֘A�t�����p�_���ǂ���
	clsContentsBox.prototype.isItemRelation = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-relation' );

		} catch(e) {
			throw { name: 'isItemRelation', message: e.message };
		}
	};

	// ���ڂ��t���[���C�����ǂ���
	clsContentsBox.prototype.isItemFreeLine = function( pKind ) {
		try {
			if ( !pKind ) return false;

			return ( String(pKind) == 'item-freeline' );

		} catch(e) {
			throw { name: 'isItemFreeLine', message: e.message };
		}
	};

	// �區�ڎ擾
	clsContentsBox.prototype.getItemMainPerson = function( ) {
		try {
			if ( !this._ContentsItems.person ) return null;

			var wMainItem = null;

			var wItem;
			for( var wId in this._ContentsItems.person ) {
				if ( this._ContentsItems.person[wId].isKeyPerson() ) {
					wMainItem = this._ContentsItems.person[wId];
					break;
				}
			}
			
			return wMainItem;

		} catch(e) {
			throw { name: 'getItemMainPerson', message: e.message };
		}
	};

	// �q�v�f�ɍ폜�s���ڂ����邩�`�F�b�N
	clsContentsBox.prototype.chkNoDeleteChiledItem = function( pChkId, pChildList ) {
		try {
			var wFind = false;

			var wParentId;
			for( var wKey in pChildList ) {
				// �eID����v
				wParentId = pChildList[wKey].getParentId();
				if ( wParentId !== pChkId ) continue;

				// �폜�s�`�F�b�N
				if ( !pChildList[wKey].getItemDelIs() ) {
					wFind = true;
					break;
				}
			}
			
			return wFind;

		} catch(e) {
			throw { name: 'chkNoDeleteChiledItem', message: e.message };
		}
	};

	// ���ڒǉ��@���ʃ��j���[�擾
	clsContentsBox.prototype.getItemPublicMenu = function( pItemKind ) {
		try {
			var wPublicMenu = {};
			if ( this._ContentsPublicMenu ) {
				if ( this._ContentsPublicMenu.common ) {
					wPublicMenu.color		= this._ContentsPublicMenu.common.color;
					wPublicMenu.position	= this._ContentsPublicMenu.common.position;
				}

				// �l��
				if ( this.isItemPerson(pItemKind) ) {
					if ( this._ContentsPublicMenu.person ) {
						wPublicMenu.context		= this._ContentsPublicMenu.person.context;
						wPublicMenu.status		= this._ContentsPublicMenu.person.statBase;
						wPublicMenu.contact		= this._ContentsPublicMenu.person.contact;

						wPublicMenu.listStat	= this._ContentsPublicMenu.person.listStat;
						wPublicMenu.relation	= this._ContentsPublicMenu.person.relation;
						wPublicMenu.icon		= this._ContentsPublicMenu.person.icon;
						
						if ( this._ContentsPublicMenu.person.position ) wPublicMenu.position = this._ContentsPublicMenu.person.position;
					}

				// �O���[�v
				} else if ( this.isItemGroup(pItemKind) ) {
					if ( this._ContentsPublicMenu.group ) {
						wPublicMenu.context		= this._ContentsPublicMenu.group.context;
						wPublicMenu.status		= this._ContentsPublicMenu.group.statBase;
						wPublicMenu.contact		= this._ContentsPublicMenu.group.contact;

						wPublicMenu.listStat	= this._ContentsPublicMenu.group.listStat;
						wPublicMenu.relation	= this._ContentsPublicMenu.group.relation;

						if ( this._ContentsPublicMenu.group.position ) wPublicMenu.position = this._ContentsPublicMenu.group.position;
					}

				// �R�����g
				} else if ( this.isItemComment(pItemKind) ) {
					if ( this._ContentsPublicMenu.comment ) {
						wPublicMenu.context		= this._ContentsPublicMenu.comment.context;
						wPublicMenu.status		= this._ContentsPublicMenu.comment.statBase;
						wPublicMenu.contact		= false;

						wPublicMenu.listSize	= this._ContentsPublicMenu.comment.listSize;

						if ( this._ContentsPublicMenu.comment.position ) wPublicMenu.position = this._ContentsPublicMenu.comment.position;
					}

				// �֘A�t�����p�_
				} else if ( this.isItemRelation(pItemKind) ) {
					if ( this._ContentsPublicMenu.relation ) {
						wPublicMenu.context		= this._ContentsPublicMenu.relation.context;
						wPublicMenu.status		= false;
						wPublicMenu.contact		= false;

						wPublicMenu.relation	= this._ContentsPublicMenu.relation.relation;

						if ( this._ContentsPublicMenu.relation.position ) wPublicMenu.position = this._ContentsPublicMenu.relation.position;
					}

				// �t���[���C��
				} else if ( this.isItemFreeLine(pItemKind) ) {
					if ( this._ContentsPublicMenu.freeline ) {
						wPublicMenu.context		= this._ContentsPublicMenu.freeline.context;
						wPublicMenu.status		= false;
						wPublicMenu.contact		= false;

						wPublicMenu.listStat	= false;
						wPublicMenu.relation	= false;

						if ( this._ContentsPublicMenu.freeline.position ) wPublicMenu.position = this._ContentsPublicMenu.freeline.position;
					}

				}
			}
			
			return wPublicMenu;

		} catch(e) {
			throw { name: 'getItemPublicMenu', message: e.message };
		}
	};

	// ���ڒǉ�
	clsContentsBox.prototype.addItem = function( pEvent, pItemKind, pLoadData ) {
		try {
			// ���ڃh���b�O��
			// ���N�����p�����[�^����擾
			var wItemDrag		= this.getSettingItemDrag( pItemKind );

			// �ǉ����ڃp�����[�^
			var wAddParam = {
				  window		: this.getBoxWindow()
				, parent		: this._ContentsEleMain
				, locked		: this._ContentsLocked
				, loadData		: pLoadData
			};

			// ���ڑ���v���p�e�B�ݒ�
			this.copyProperty( wItemDrag, wAddParam );

			// �����l�w�莞
			var wPoint		= { x: 0, y: 0 };
			if ( pEvent ) {
				wPoint = this.getEventPos( pEvent );

				// ���ڃp�����[�^�w�莞
				for( var wParaKey in pEvent ) {
					if ( !pEvent.hasOwnProperty(wParaKey) ) continue;
					wAddParam[wParaKey] = pEvent[wParaKey];
				}
			}
			var wBasePos = this.getBoxPos();

			wPoint.x -= wBasePos.left;
			if ( wPoint.x < 0 ) wPoint.x = 0;
			wPoint.y -= wBasePos.top;
			if ( wPoint.y < 0 ) wPoint.y = 0;

			// ���C����ʂ̃X�N���[���l���Z
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wPoint.x	+= wMainScroll.x;
			wPoint.y	+= wMainScroll.y;

			// �v���p�e�B�i�ʒu�Ȃǁj�ݒ�
			wAddParam.property = { left: wPoint.x + 'px', top: wPoint.y + 'px' };

			// ���ʃ��j���[�p���ݒ�
			wAddParam.publicMenu = this.getItemPublicMenu( pItemKind );
			var wAddItem = null;

			// �l��
			if ( this.isItemPerson(pItemKind) ) {
				// �ݒ�ύX��callback
				wAddParam.callback = this.eventItemPersonChange;

				// ���ڒǉ�
				wAddItem = new clsItemPerson( wAddParam );

			// �O���[�v
			} else if ( this.isItemGroup(pItemKind) ) {
				// �ݒ�ύX��callback
				wAddParam.callback = this.eventItemGroupChange;

				// ���ڒǉ�
				wAddItem = new clsItemGroup( wAddParam );

			// �R�����g
			} else if ( this.isItemComment(pItemKind) ) {
				// �ݒ�ύX��callback
				wAddParam.callback = this.eventItemCommentChange;

				// ���ڒǉ�
				wAddItem = new clsItemComment( wAddParam );

			// �֘A�t�����p�_
			} else if ( this.isItemRelation(pItemKind) ) {
				// �ݒ�ύX��callback
				wAddParam.callback = this.eventItemRelationChange;

				// ���ڒǉ�
				wAddItem = new clsItemRelation( wAddParam );

			// �֘A�t�����p�_
			} else if ( this.isItemFreeLine(pItemKind) ) {
				// �ݒ�ύX��callback
				wAddParam.callback = this.eventItemFreeLineChange;

				// ���ڒǉ�
				wAddItem = new clsItemFreeLine( wAddParam );

			}

			return wAddItem;

		} catch(e) {
			throw { name: 'addItem.' + e.name, message: e.message };
		}
	};

	// ���ڒǉ��^�폜�ʒm�pCallback�擾
	clsContentsBox.prototype.getItemChangeFunc = function( pItem, pFuncName ) {
		try {
			// callback�擾
			// �����ڌʂ�callback�D��
			var wCallFunc = pItem.loadArgument(pFuncName);

			// ���ڂ��Ƃ�callback�Ȃ���ΕW��callback
			if ( !wCallFunc ) {
				// �區�ڎ�
				var wKeyFlag = false;
				if ( typeof pItem.isKeyPerson == 'function' ) wKeyFlag = pItem.isKeyPerson();

				if ( wKeyFlag ) {
					// �區�ڗpcallback����ΗD��
					var wKeyPerson = this.loadArgument('keyperson');
					if ( pFuncName in wKeyPerson ) wCallFunc = wKeyPerson[pFuncName];
				}

				// �W��callback
				if ( !wCallFunc ) wCallFunc = this.loadArgument(pFuncName);
			}
			
			return wCallFunc;

		} catch(e) {
			throw { name: 'getItemChangeFunc', message: e.message };
		}
	};

	// ���ڒǉ���ʒm
	clsContentsBox.prototype.execItemAddFunc = function( pAddItem ) {
		try {
			if ( !pAddItem ) return;
			
			// ���ڒǉ���callback�擾
			var wAddFunc = this.getItemChangeFunc( pAddItem, 'addfunc' );
			if ( !wAddFunc ) return;

			// �p�����[�^�ݒ�
			var wCallbackParam = {};

			wCallbackParam.item = pAddItem;

			// �o�^����Ă��鏈�������s
			var wArguments = [];
			wArguments.push( wCallbackParam );

			wAddFunc.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execItemAddFunc.' + e.name, message: e.message };
		}
	};

	// ���ڒǉ��@�J�n
	clsContentsBox.prototype.addItemStart = function( pEvent, pItemKind ) {
		try {
			// ���ڒǉ�
			var wAddItem = this.addItem( pEvent, pItemKind );
			if ( !wAddItem ) return false;

			try {
				// ���ڈړ��J�n
				this.moveItemStart( pEvent, wAddItem, 'add' );

			} catch(me) {
				// �ǉ����ڍ폜���ė�O��throw
				if ( wAddItem ) wAddItem.freeClass();
				throw { name: me.name, message: me.message };

			}
			return true;

		} catch(e) {
			throw { name: 'addItemStart.' + e.name, message: e.message };
		}
	};

	// ���ڂ����ڃ��X�g����폜
	clsContentsBox.prototype.delItemFromList = function( pId, pTargetList ) {
		try {
			var wDelItm = pTargetList[pId];
			if ( !wDelItm ) return false;

			// ���ڍ폜��ʒm
			this.execFunction( this.execItemDelFunc, wDelItm );

			// ���ڂ��폜
			pTargetList[pId].freeClass();
			pTargetList[pId] = null;

			delete pTargetList[pId];

		} catch(e) {
			throw { name: 'delItemFromList', message: e.message };
		}
	};

	// ���ڍ폜
	clsContentsBox.prototype.delItem = function( pId, pTargetList, pRelationDel ) {
		try {
			var wRedrawFlg = false;

			var wDelItm = pTargetList[pId];
			if ( !wDelItm ) return false;

			// �t���[���C���̏ꍇ
			if ( wDelItm.isFreeLine() ) {
				// �ڑ��_�폜
				if ( pRelationDel ) {
					wRedrawFlg = this.delFreeLineAll( pId );
				
				} else {
					wRedrawFlg = this.delFreeLinePoint( pId );
				
				}

			} else {
				// �S�֌W���폜
				wRedrawFlg = this.liftRelationAll( wDelItm );

			}

			// ���X�g���獀�ڍ폜
			this.delItemFromList( pId, pTargetList );

			return wRedrawFlg;

		} catch(e) {
			throw { name: 'delItem.' + e.name, message: e.message };
		}
	};

	// �q���ڍ폜
	clsContentsBox.prototype.delItemChild = function( pId, pTargetList ) {
		try {
			if ( !pTargetList ) return false;

			var wRelationDel = false;

			var wParentId;
			for( var wKey in pTargetList ) {
				if ( pTargetList.hasOwnProperty(wKey) ) {
					// �eID����v����΍폜
					wParentId = pTargetList[wKey].getParentId();
					if ( wParentId !== pId ) continue;

					// ���ڍ폜
					if ( this.delItem(wKey, pTargetList) ) wRelationDel = true;
				}
			}

			// ���ڊ֌W���폜��������Ԃ�
			return wRelationDel;

		} catch(e) {
			throw { name: 'delItemChild.' + e.name, message: e.message };
		}
	};

	// ���ڍ폜
	clsContentsBox.prototype.delItemParent = function( pDelItem, pTargetList, pRelationDel ) {
		try {
			if ( !pDelItem ) return false;

			var wItemId = pDelItem.getBoxId();
			var wItemKd = pDelItem.getBoxKind();

			// �O���[�v�폜
			if ( this.isItemGroup(wItemKd) ) {
				// �������ڂɍ폜�s���ڂ����邩�`�F�b�N
				if ( this.chkNoDeleteChiledItem(wItemId, this._ContentsItems.person) ) {
					alert( '�폜�ł��Ȃ����ڂ��������Ă��邽�߁A�폜�ł��܂���B' );
					return false;
				}
			}

			// �폜�m�F
			if ( !confirm('���ڂ��폜���܂��B��낵���ł����H') ) return;

			var wRelationDel = false;

			// �O���[�v
			if ( this.isItemGroup(wItemKd) ) {
				// �q���ځi�l���j�폜
				wRelationDel = this.delItemChild(wItemId, this._ContentsItems.person);

			// �ȊO
			} else {
				// �q���ڂȂ�

			}

			// ���g���폜
			if ( this.delItem(wItemId, pTargetList, pRelationDel) ) wRelationDel = true;

			// ���ڊ֌W���폜��������Ԃ�
			return wRelationDel;

		} catch(e) {
			throw { name: 'delItemParent.' + e.name, message: e.message };
		}
	};

	// ���ڍ폜��ʒm
	clsContentsBox.prototype.execItemDelFunc = function( pDelItem ) {
		try {
			if ( !pDelItem ) return;
			
			// ���ڒǉ���callback�擾
			var wDelFunc = this.getItemChangeFunc( pDelItem, 'delfunc' );
			if ( !wDelFunc ) return;

			// �p�����[�^�ݒ�
			var wCallbackParam = {};

			wCallbackParam.item = pDelItem;

			// �o�^����Ă��鏈�������s
			var wArguments = [];
			wArguments.push( wCallbackParam );

			wDelFunc.apply( this, wArguments );

		} catch(e) {
			throw { name: 'execItemDelFunc.' + e.name, message: e.message };
		}
	};

	// ���ڒǉ��p�����[�^�擾
	clsContentsBox.prototype.getItemParamByValue = function( pParamVal ) {
		try {
			var wRetParam = {};

			if ( 'pos' in pParamVal ) {
				if ( 'x' in pParamVal.pos ) wRetParam.x = pParamVal.pos.x;
				if ( 'y' in pParamVal.pos ) wRetParam.y = pParamVal.pos.y;
			}

			// �����l�i�X�e�[�^�X�j
			if ( 'default' in pParamVal ) {
				wRetParam.default = pParamVal.default;
			}
			
			// ���ڍX�V���R�����g
			if ( 'comment' in pParamVal ) wRetParam.comment = pParamVal.comment;
			if ( 'confirm' in pParamVal ) wRetParam.confirm = pParamVal.confirm;

			// ���̑��p�����[�^
			var wOthParam = pParamVal.other;
			if ( wOthParam ) {
				// ���̑��p�����[�^�͂��̂܂܃p�����[�^�Ƃ���
				for( var wOthKey in wOthParam ) {
					wRetParam[wOthKey] = wOthParam[wOthKey];
				}
			}
			
			return wRetParam;

		} catch(e) {
			throw { name: 'getItemParamByValue.' + e.name, message: e.message };
		}
	};

	// ���ڐV�K�ǉ��i�l�w�肠��j
	clsContentsBox.prototype.addItemByValue = function( pAddParam, pItemKind ) {
		try {
			// ���ڒǉ��p�����[�^�擾
			var wParam = this.getItemParamByValue( pAddParam );

			// �ǉ������ݒ�
			var wMode		= '';
			if ( pAddParam ) {
				if ( 'mode' in pAddParam ) wMode = pAddParam.mode;
			}

			// ��R���e���c�̒��S�擾
			if ( !('x' in wParam) || !('y' in wParam) ) {
				var wContentsSize = this.getBoxSize();
				var wContentsPos  = this.getBoxPos();

				if ( wContentsSize.width  ) wContentsSize.width  = Math.floor( wContentsSize.width  / 2 );
				if ( wContentsSize.height ) wContentsSize.height = Math.floor( wContentsSize.height / 2 );

				if ( !('x' in wParam) ) wParam.x = wContentsSize.width + wContentsPos.left - 32;
				if ( !('y' in wParam) ) wParam.y = wContentsSize.height - 32;

				if ( wParam.x < 0 ) wParam.x = 0;
				if ( wParam.y < 0 ) wParam.y = 0;
			}

			// �I������
			this.execFunction( this.resetSelectItem );

			// �ʒu�Œ莞
			if ( wMode == 'fixed' ) {
				// �區�ڂ𑦎��ǉ�
				var wAddItem = this.addItem( wParam, pItemKind );
				if ( !wAddItem ) return false;

				this._ContentsItems.person[wAddItem.getBoxId()] = wAddItem;

				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, wAddItem );

				// ���ڕ\��
				wAddItem.dspBox( true );

				// ���ڕύX�ʒm
				wParam.kind = 'add';
				this.execLinkCallback( wParam, wAddItem );

				return true;
			}
			// �I��
			else if ( wMode == 'select' ) {
				// �區�ڑI���J�n
				this.updItemStart( wParam, pItemKind );

			}
			// �ʒu�w��i�ǉ��j
			else {
				// �區�ڒǉ��J�n
				this.addItemStart( wParam, pItemKind );

				return false;
			}

		} catch(e) {
			throw { name: 'addItemByValue.' + e.name, message: e.message };
		}
	};

	// ���ڒǉ��^�X�V�i�l���j
	clsContentsBox.prototype.addPersonByValue = function( pAddParam ) {
		try {
			var wResult = false;

			// �區�ڍX�V�`�F�b�N
			var wKeyPerson = false;

			if ( 'other' in pAddParam ) {
				if ( 'keyperson' in pAddParam.other ) wKeyPerson = pAddParam.other.keyperson;
			}

			var wUpdate = false;
			var wUpdItm = null;

			if ( wKeyPerson ) {
				// ���ɓo�^�ς̏ꍇ
				wUpdItm = this.getItemMainPerson();
				if ( wUpdItm ) wUpdate = true;
			}

			if ( wUpdate ) {
				// ���ڒǉ��p�����[�^�擾
				var wUpdParam = this.getItemParamByValue( pAddParam );

				// �X�V�p�����[�^�Ȃ���Ώ����Ȃ�
				if ( !('default' in wUpdParam) ) return false;

				// �X�e�[�^�X���X�V
				wUpdItm.updStatusValue( wUpdParam );

				// ���ڕύX�ʒm
				this.execLinkCallback( { kind: 'status' }, wUpdItm );

			// ���o�^��
			} else {
				// ���ڂ�V�K�ǉ�
				wResult = this.addItemByValue( pAddParam, 'item-person' );

			}

			return wResult;

		} catch(e) {
			throw { name: 'addPersonByValue.' + e.name, message: e.message };
		}
	};

	// ���ڒǉ��i�O���[�v�j
	clsContentsBox.prototype.addGroupByValue = function( pAddParam ) {
		try {
			// �O���[�v��V�K�ǉ�
			var wResult = this.addItemByValue( pAddParam, 'item-group' );

			return wResult;

		} catch(e) {
			throw { name: 'addGroupByValue.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �R�����g
	// **************************************************************

	// �R�����g�ǉ��@�J�n
	clsContentsBox.prototype.addItemComment = function( pEvent ) {
		try {
			// ����J�n���̃C�x���g�D��
			var wEvent = this._ContentsContextEvent;
			if ( !wEvent ) wEvent = pEvent;

			// �R�����g�ǉ�
			var wCommentItem = this.addItem( wEvent, 'item-comment' );
			if ( !wCommentItem ) return false;

			// �ǉ��R�����g�ۑ�
			this._ContentsCommentInf.item = wCommentItem;

			// �R�����g�ݒ��ʕ\��
			wCommentItem.dspStatusMenu( pEvent, this.eventItemCommentAdd );

		} catch(e) {
			// �R�����g�ǉ��L�����Z��
			this.execFunction( this.cancelAddItemComment );
			throw { name: 'addItemComment.' + e.name, message: e.message };
		}
	};

	// �R�����g�ǉ����i���e�ݒ��j��Call�����
	clsContentsBox.prototype.execAddItemComment = function( pEvent, pParam ) {
		try {
			var wAddComment = this._ContentsCommentInf.item;
			if ( !wAddComment ) return true;

			// ���ڋK��̃X�e�[�^�X�ύX�������s
			var wStatusSet = false;
			if ( pParam ) {
				pParam.notCallback = true;
				wStatusSet = wAddComment.eventStatusUpdate( pEvent, pParam );

			}

			// �R�����g����
			if ( wStatusSet ) {
				// �ǉ����ڂ�ۑ�
				var wItemId = wAddComment.getBoxId();
				this._ContentsItems.comment[wItemId] = wAddComment;

				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, wAddComment );

				// ���ڕ\��
				wAddComment.dspBox( true );

				// �ǉ�����
				this._ContentsCommentInf.item = null;

			}

			// �R�����g�ǉ��I��
			this.cancelAddItemComment();

			return true;

		} catch(e) {
			// �R�����g�ǉ��L�����Z��
			this.execFunction( this.cancelAddItemComment );
			throw { name: 'execAddItemComment.' + e.name, message: e.message };
		}
		return true;
	};

	// �R�����g�ǉ��@�L�����Z��
	clsContentsBox.prototype.cancelAddItemComment = function( ) {
		try {
			// �R�����g�폜
			if ( this._ContentsCommentInf.item ) {
				// �C�x���g�L�����Z��
				this._ContentsCommentInf.item.eventClear();

				// ���ڍ폜
				this._ContentsCommentInf.item.freeClass();
			}

			this._ContentsCommentInf.item = null;

		} catch(e) {
			throw { name: 'cancelAddItemComment.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �t���[���C��
	// **************************************************************

	// �t���[���C���ǉ��@�J�n
	clsContentsBox.prototype.addItemFreeLine = function( pEvent, pStartId ) {
		try {
			// ���ڒǉ�
			var wAddItem = this.addItem( pEvent, 'item-freeline' );
			if ( !wAddItem ) return false;

			try {
				// �ړ��J�n
				this.freeLineStart( pEvent, wAddItem );

			} catch(me) {
				// �ǉ����ڍ폜���ė�O��throw
				if ( wAddItem ) wAddItem.freeClass();
				throw { name: me.name, message: me.message };

			}

			// �t���[���C������
			if ( typeof pStartId == 'string' ) {
				// �J�n�|�C���g�ݒ�
				this._ContentsLineInf.start = pStartId;

				this.dspMouseCmt( pEvent, '�I���ʒu���w�肵�Ă�������' );

			// �t���[���C���J�n
			} else {
				// �x�[�X���j���[������
				this.useContextCtrl( false );

				// �C�x���g�ݒ�
				this.addFreeLineEvent();

				this.dspMouseCmt( pEvent, '�J�n�ʒu���w�肵�Ă�������' );
			
			}

			return true;

		} catch(e) {
			// �ړ��L�����Z������throw
			this.execFunction( this.freeLineCancel );
			throw { name: 'addItemFreeLine.' + e.name, message: e.message };
		}
	};

	// �t���[���C���ݒ�J�n
	clsContentsBox.prototype.freeLineStart = function( pEvent, pFreeLine ) {
		try {
			// ���ڂ̃��j���[������
			pFreeLine.setContextAvailable( false );
			pFreeLine.setPositionAvailable( false );

			// �ړ��Ώۍ��ڂ̐ݒ�
			this._ContentsLineInf.item = pFreeLine;

			// �ʒu�␳�@�e�̈ʒu�擾
			this._ContentsLineInf.pos = pFreeLine.getParentPos();

			var wEvtPos = this.getEventPos( pEvent );

			var wStPos = { x: wEvtPos.x, y: wEvtPos.y };
			wStPos.x -= this._ContentsLineInf.pos.left;
			wStPos.y -= this._ContentsLineInf.pos.top;

			// ���C����ʂ̃X�N���[���l���Z
			var wMainScroll = this.getScroll( this._ContentsEleMain );
			wStPos.x += wMainScroll.x;
			wStPos.y += wMainScroll.y;

			// �őO�ʂֈړ�
			pFreeLine.dspBox( true, true, wStPos );

		} catch(e) {
			throw { name: 'freeLineStart.' + e.name, message: e.message };
		}
	};

	// �t���[���C���m��
	clsContentsBox.prototype.freeLineConfirm = function( pEvent, pLineItem ) {
		try {
			var wItemId = pLineItem.getBoxId();

			// �ړ���̃L�����o�X�͈̓`�F�b�N
			if ( !this.chkItemOverflowArea(pLineItem) ) return false;

			// �J�n�_�擾
			var wStItem = null;
			if ( this._ContentsLineInf.start ) {
				wStItem = this.getContentsItem( this._ContentsLineInf.start, 'item-freeline' );
			}

			// �|�C���g�I���`�F�b�N
			var wChkTarget = {
					  person	: false
					, group		: false
					, relation	: false
					, freeline	: true
					, comment	: false
			};
			var wCheckId = '';
			var wChkItem = this.chkItemOverlapToClick( pEvent, wChkTarget );

			var wRedrawLine = false;
			if ( wChkItem ) {
				// �����ڃ`�F�b�N
				wCheckId = wChkItem.getBoxId();
				if ( wCheckId == wItemId ) return false;

				// �J�n�_�w�莞
				if ( !wStItem ) {
					// �I���|�C���g���J�n�_�Ƃ���
					wItemId  = wCheckId;
					wChkItem = null;
				
				// �J�n�_�w�莞
				} else if ( wCheckId == this._ContentsLineInf.start ) {
					// �����Ȃ��i���C���I���j

				// �J�n�_�̐ڑ��_�w�莞
				} else if ( wStItem.chkLinePoint(wCheckId) ) {
					// �����Ȃ��i���C���I���j

				// ���_�w�莞
				} else {
					// �J�n�_�ƏI�_��ڑ�
					wStItem.setLinePoint( wCheckId );
					wChkItem.setLinePoint( this._ContentsLineInf.start );

					// �I�_�̃��C�����p��
					var wLineParam = wChkItem.getLineStatus();

					// ���C���ݒ�
					wStItem.setLineStatus( wLineParam );

					// �J�n�_����m��_�܂ł̃��C���`��
					this.drawFreeLine( wStItem, wChkItem, wLineParam );
					
					// �֘A�|�C���g�̃��C����S�ĕύX
					this.updFreeLineStatus( wStItem );

					// ���C���S�čĕ`��
					wRedrawLine = true;

				}
				
				// �ǉ��|�C���g�j��
				pLineItem.freeClass();

			} else {
				// ���_�w�莞
				if ( wStItem ) {
					// �J�n�_�Ǝ��_��ڑ�
					wStItem.setLinePoint( wItemId );
					pLineItem.setLinePoint( this._ContentsLineInf.start );

					// �J�n�_�̃��C���ݒ�擾
					var wLineParam = wStItem.getLineStatus();

					// ���C���ݒ�
					pLineItem.setLineStatus( wLineParam );

					// �J�n�_����m��_�܂ł̃��C���`��
					this.drawFreeLine( wStItem, pLineItem, wLineParam );

				}

				// �őO�ʉ���
				pLineItem.dspBox( true, false );

				// �ǉ����ڂ�ۑ�
				this._ContentsItems.freeline[wItemId] = pLineItem;
				// ���ڒǉ���ʒm
				this.execFunction( this.execItemAddFunc, pLineItem );

			}

			// �|�C���g�I�����͏I��
			if ( wChkItem ) {
				// �t���[���C���I��
				this.execFunction( this.freeLineCancel );

				// ���C���ĕ`��
				if ( wRedrawLine ) this.drawRelationRedo();

			} else {
				// ���̃|�C���g�w��J�n
				this.addItemFreeLine( pEvent, wItemId );

			}
			return true;

		} catch(e) {
			throw { name: 'freeLineConfirm.' + e.name, message: e.message };
		}
	};

	// �t���[���C���ǉ��@�L�����Z��
	clsContentsBox.prototype.freeLineCancel = function( ) {
		try {
			// �ǉ����̂ݏ���
			if ( !this._ContentsLineInf.item ) return;

			// �C�x���g��~
			// ����O����
			this.execFunction( this.delFreeLineEvent );
			
			// �R�����g��\��
			this.hideMouseCmt();

			// �C�x���g�L�����Z��
			this._ContentsLineInf.item.eventClear();

			// ���ڍ폜
			this._ContentsLineInf.item.freeClass();

			// �J�n�_�ݒ莞
			var wStartId = this._ContentsLineInf.start;
			if ( wStartId ) {
				// �J�n�_�ɐڑ��_�Ȃ���΍폜
				var wFreeLineList = this.getBelongFreeLine();

				var wStartItm;
				if ( wFreeLineList ) wStartItm = wFreeLineList[wStartId];

				if ( wStartItm ) {
					if ( !wStartItm.getLinePoint() ) {
						// �ڑ��_�폜
						this.delItemFromList( wStartId, wFreeLineList );
					}
				}

			}

			this._ContentsLineInf.item		= null;
			this._ContentsLineInf.pos		= null;
			this._ContentsLineInf.start		= null;

			// �x�[�X���j���[�L����
			this.useContextCtrl( true );
			
		} catch(e) {
			throw { name: 'cancelAddItemFreeLine.' + e.name, message: e.message };
		}
	};

	// �t���[���C���ǉ��C�x���g�ݒ�
	clsContentsBox.prototype.addFreeLineEvent = function( pDragIs ) {
		try {
			// �}�E�X�Ǐ]
			this.addBoxEvents( 'onmousemove'	, this.eventFreeLineMove );

			// ���ڊm��
			this.addBoxEvents( 'onmousedown'	, this.eventFreeLineSet );

		} catch(e) {
			throw { name: 'addFreeLineEvent.' + e.name, message: e.message };
		}
	};

	// �t���[���C���ǉ��C�x���g����
	clsContentsBox.prototype.delFreeLineEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.delBoxEvents( 'onmousemove'	, this.eventFreeLineMove );

			// ���ڊm��
			this.delBoxEvents( 'onmousedown'	, this.eventFreeLineSet );

		} catch(e) {
			throw { name: 'delFreeLineEvent.' + e.name, message: e.message };
		}
	};

	// �t���[���C���`��
	clsContentsBox.prototype.drawFreeLineAll = function() {
		try {
			var self = this;

			if ( !this._ContentsItems.freeline ) return;

			var wChkList = {};

			var fncDrawFreeLine = function( pId ) {
				// �J�n�_�擾
				var wStLine = self._ContentsItems.freeline[pId];

				// ���C���ݒ�擾
				var wLineParam = wStLine.getLineStatus();

				// �ڑ��_�擾
				var wPointList = wStLine.getLinePoint();
				if ( !wPointList ) return;

				var wEdLine;
				for( var wEdId in wPointList ) {
					// �����ς͏����Ȃ�
					if ( (pId + wEdId) in wChkList ) continue;
					if ( (wEdId + pId) in wChkList ) continue;

					if ( !(wEdId in self._ContentsItems.freeline) ) continue;
					wEdLine = self._ContentsItems.freeline[wEdId];

					// �J�n�_����m��_�܂ł̃��C���`��
					self.drawFreeLine( wStLine, wEdLine, wLineParam );

					wChkList[pId + wEdId]	= true;
					wChkList[wEdId + pId]	= true;
				}
			};

			// �S�|�C���g����̃��C���`��
			for( var wKey in this._ContentsItems.freeline ) {
				fncDrawFreeLine( wKey );
			}

		} catch(e) {
			throw { name: 'drawFreeLineAll.' + e.name, message: e.message };
		}
	};

	// �t���[���C���X�e�[�^�X�X�V
	clsContentsBox.prototype.updFreeLineStatus = function( pUpdItm ) {
		try {
			if ( !pUpdItm ) return false;

			// �t���[���C�����X�g
			var wFreeLineList = this.getBelongFreeLine();
			if ( !wFreeLineList ) return false;

			// �X�V�N�_
			var wUpdStatus	= pUpdItm.getLineStatus();

			// �ڑ��_�ւ̐ڑ��_�X�V����
			var wProcessedId = {};

			var fncUpdLineStatus = function( pItem, pStatus, pFirstPoint ) {
				var wId = pItem.getBoxId();

				// �ڑ��_�X�e�[�^�X�X�V
				if ( !pFirstPoint ) pItem.setLineStatus( pStatus );
				wProcessedId[wId] = true;
				
				// ���ċA�Őڑ��_������
				var wNextPoint = pItem.getLinePoint();
				if ( !wNextPoint ) return;
				
				for( var wPointId in wNextPoint ) {
					// �������̂ݏ���
					if ( wPointId in wProcessedId ) continue;
					if ( !wFreeLineList[wPointId] ) continue;

					// �ڑ��_�ւ̐ڑ��_����
					fncUpdLineStatus( wFreeLineList[wPointId], pStatus );
				}
			};

			// �ڑ�����Ă���_�̃X�e�[�^�X�S�čX�V
			// ���ċA�Őڑ��_��S�ď���
			fncUpdLineStatus( pUpdItm, wUpdStatus, true );

		} catch(e) {
			throw { name: 'updFreeLineStatus.' + e.name, message: e.message };
		}
	};

	// �t���[���C���ڑ��_�폜
	clsContentsBox.prototype.delFreeLinePoint = function( pId ) {
		try {
			// �t���[���C�����X�g
			var wFreeLineList = this.getBelongFreeLine();
			if ( !wFreeLineList ) return false;

			var wDelItm = wFreeLineList[pId];
			if ( !wDelItm ) return false;

			// �ڑ��_�擾
			var wPointList = wDelItm.getLinePoint();
			if ( !wPointList ) return false;

			// �ڑ��_�`�F�b�N
			var fncChkPoint = function( pChkItm, pDelId ) {
				// �ڑ��_�Ȃ���ΑΏ�
				var wChkList = pChkItm.getLinePoint();
				if ( !wChkList ) return true;

				// �폜�ΏۈȊO�̐ڑ��_����΍폜���Ȃ�
				for( var wChkId in wChkList ) {
					if ( wChkId != pDelId ) return false;
				}
				
				return true;
			};

			// �ڑ��_�ɑ��̐ڑ��Ȃ���΍폜
			var wPointItm;

			for( var wPointId in wPointList ) {
				wPointItm = wFreeLineList[wPointId];
				if ( !wPointItm ) continue;

				// �폜�Ώۃ`�F�b�N
				if ( fncChkPoint(wPointItm, pId) ) {
					// �ڑ��_�폜
					this.delItemFromList( wPointId, wFreeLineList );

				} else {
					// �폜�|�C���g�ւ̐ڑ�����
					wPointItm.delLinePoint( pId );

				}
			}

			return true;

		} catch(e) {
			throw { name: 'delFreeLinePoint.' + e.name, message: e.message };
		}
	};

	// �t���[���C���폜
	clsContentsBox.prototype.delFreeLineAll = function( pId ) {
		try {
			var self = this;

			// �t���[���C�����X�g
			var wFreeLineList = this.getBelongFreeLine();
			if ( !wFreeLineList ) return false;

			// �ڑ��_�ւ̐ڑ��_�폜����
			var wProcessedId = {};

			var fncDelFreeLine = function( pDelId ) {
				var wDelItm = wFreeLineList[pDelId];
				if ( !wDelItm ) return;

				// �폜�ςݐݒ�
				wProcessedId[pDelId] = true;
				
				// ���ċA�Őڑ��_������
				var wNextPoint = wDelItm.getLinePoint();
				if ( wNextPoint ) {
					for( var wPointId in wNextPoint ) {
						// �������̂ݏ���
						if ( wPointId in wProcessedId ) continue;
						if ( !wFreeLineList[wPointId] ) continue;

						// �ڑ��_�ւ̐ڑ��_����
						fncDelFreeLine( wPointId );
					}
				}

				// �ڑ��_�폜
				self.delItemFromList( pDelId, wFreeLineList );
			};

			// �ڑ�����Ă���_�̃��C���S�č폜
			// ���ċA�Őڑ��_��S�ď���
			fncDelFreeLine( pId );

			return true;

		} catch(e) {
			throw { name: 'delFreeLineAll.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �R���e���c����
	// **************************************************************

	// ���ڏ�����
	clsContentsBox.prototype.initContents = function() {
		try {
			// �R�����g�S�č폜
			for ( var wCmtId in this._ContentsItems.comment ) {
				this.delItem( wCmtId, this._ContentsItems.comment );
			}

			// �l���S�č폜
			// ���O���[�v�̑O�Ɏ��{
			for ( var wItmId in this._ContentsItems.person ) {
				this.delItem( wItmId, this._ContentsItems.person );
			}

			// �O���[�v�S�č폜
			for ( var wGrpId in this._ContentsItems.group ) {
				this.delItem( wGrpId, this._ContentsItems.group );
			}

			// ���p�_�S�č폜
			for ( var wRelId in this._ContentsItems.relation ) {
				this.delItem( wRelId, this._ContentsItems.relation );
			}

			// �t���[���C���폜
			for ( var wLineId in this._ContentsItems.freeline ) {
				this.delItem( wLineId, this._ContentsItems.freeline );
			}

			// �֘A���ĕ`��
			this.drawRelationRedo();

			// �T�C�h�p�l��������
			// �� ���ڕύX�ʒm�i���ړ����j
			this.execLinkCallback( { kind: 'link' }, null );
			// �� ���ڕύX�ʒm�i�������j
			this.execLinkCallback( { kind: 'init' }, null );

		} catch(e) {
			throw { name: 'initContents.' + e.name, message: e.message };
		}
	};

	// ���ڍĕ\��
	clsContentsBox.prototype.redspContents = function() {
		try {
			// �R�����g�S�ĕ\��
			for ( var wCmtId in this._ContentsItems.comment ) {
				this._ContentsItems.comment[wCmtId].dspBox( true );
			}

			// �O���[�v�S�ĕ\��
			for ( var wGrpId in this._ContentsItems.group ) {
				this._ContentsItems.group[wGrpId].dspBox( true );
			}

			// �l���S�ĕ\��
			for ( var wItmId in this._ContentsItems.person ) {
				this._ContentsItems.person[wItmId].dspBox( true );
			}

			// ���p�_�S�ĕ\��
			for ( var wRelId in this._ContentsItems.relation ) {
				this._ContentsItems.relation[wRelId].dspBox( true );
			}

			// �t���[���C���S�ĕ\��
			for ( var wLineId in this._ContentsItems.freeline ) {
				this._ContentsItems.freeline[wLineId].dspBox( true );
			}

			// �֘A���ĕ`��
			this.drawRelationRedo();

			// �T�C�h�p�l���ĕ\��
			// �� ���ڕύX�ʒm�i���ړ����j
			this.execLinkCallback( { kind: 'link' }, null );
			// �� ���ڕύX�ʒm�i�Đݒ�j
			this.execLinkCallback( { kind: 'reset' }, null );

		} catch(e) {
			throw { name: 'redspContents.' + e.name, message: e.message };
		}
	};

	// �e�q�֌W�Đݒ�
	clsContentsBox.prototype.resetItemParent = function( pContentsItems ) {
		try {
			if ( !pContentsItems ) return;
			
			var wParentId;
			var wParentEle;

			// person�Agroup�Acomment�̊e���ڂ̐e���Đݒ�
			for( var wKey in pContentsItems ) {
				var wItems = pContentsItems[wKey];
				if ( !this.isObject(wItems) ) continue;
				
				// �o�^���ڑS�čĐݒ�
				for( var wId in wItems ) {
					wParentId = wItems[wId].loadDataVal('parentId');
					if ( !wParentId ) continue;
					
					// �e�v�f�擾
					wParentEle = this.getElement( wParentId );
					if ( wParentEle ) {
						wItems[wId].setParent( wParentEle, true );

					}

				}
			}

		} catch(e) {
			throw { name: 'resetItemParent.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ڃ��j���[����
	// **************************************************************

	// ���ڑ��쎞����
	clsContentsBox.prototype.execItemControl = function( pArgument, pTargetList ) {
		try {
			if ( !pArgument ) return false;
			if ( !pTargetList ) return false;

			var wId = pArgument.id;
			if ( !wId ) return false;

			var wTargetItem = pTargetList[wId];
			if ( !wTargetItem ) return false;

			switch( pArgument.kind ) {
			// ���X�V
			case 'status':
				// ���ڕύX�ʒm�i���X�V�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// �A����X�V
			case 'contact':
				// ���ڕύX�ʒm�i���X�V�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// ���ڈړ�
			case 'move':
				// ���ڈړ��@�J�n
				this.moveItemStart( pArgument.event, wTargetItem, 'move' );
				break;

			// ���ڍ폜
			case 'delete':
				// �S�č폜�`�F�b�N
				var wRelationDel = false;
				if ( 'delAll' in pArgument ) {
					wRelationDel = pArgument.delAll;
				}

				// �I������
				this.execFunction( this.resetSelectItem );

				// ���ڍ폜���Ċ֘A���폜���`�F�b�N
				if ( this.delItemParent( wTargetItem, pTargetList, wRelationDel ) ) {
					// �֘A���ĕ`��
					this.drawRelationRedo();
				}
				// ���ڕύX�ʒm�i���ڍ폜�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// �֌W�ǉ�
			case 'relation':
				// �֌W�ǉ��@�J�n
				if ( this.chkRelationTarget(wTargetItem) ) {
					this.addRelationStart( pArgument, wTargetItem );

				} else {
					alert( '�֘A�t���\�ȍ��ڂ�����܂���B' );

				}
				break;

			// �֌W�ύX
			case 'relationChg':
				// �֌W�ύX�@�J�n
				if ( wTargetItem.chkRelationItem() ) {
					this.addRelationStart( pArgument, wTargetItem );

				} else {
					alert( '�ύX�\�Ȋ֘A���ڂ��ݒ肳��Ă��܂���B' );

				}
				break;
			
			// �֌W����
			case 'unrelation':
				// �֌W�����@�J�n
				if ( wTargetItem.chkRelationItem() ) {
					this.addRelationStart( pArgument, wTargetItem );

				} else {
					alert( '�����\�Ȋ֘A���ڂ��ݒ肳��Ă��܂���B' );

				}
				break;
			
			// �֌W�X�V
			// ���e���ڂ̊֌W���ݒ��ʂ́uOK�v�N���b�N�C�x���g������
			case 'relationUpd':
				// �V�K/�X�V�@�`�F�b�N
				var wRelMode = pArgument.displayMode;
				if ( wRelMode == 'update' ) {
					// �֌W�X�V
					this.updRelation( pArgument, wTargetItem );
				} else {
					// �֌W�ǉ�
					this.addRelation( pArgument, wTargetItem );
				}
				break;
			
			// �֌W���C������
			case 'relationLine':
				// ���C���ĕ`��
				this.drawRelationRedo( { priority: wTargetItem } );

				// ���ڕύX�ʒm�i���p�_�ʒu�ύX�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// �t���[���C������
			case 'freeLine':
				// ���C���ĕ`��
				this.drawRelationRedo();

				// ���ڕύX�ʒm�i�t���[���C���ύX�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// �t���[���C���X�V
			case 'freeLineUpd':
				// ���C���X�e�[�^�X�X�V
				this.updFreeLineStatus( wTargetItem );

				// ���C���ĕ`��
				this.drawRelationRedo();

				// ���ڕύX�ʒm�i�t���[���C���ύX�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// �F�ύX
			case 'color':
				// ���ڕύX�ʒm�i�F�ύX�j
				this.execLinkCallback( pArgument, wTargetItem );
				break;

			// �T�C�Y�ύX
			case 'resize':
				// �T�C�Y�ύX�@�J�n
				this.resizeItem( pArgument.event, wTargetItem );
				break;

			// �ʒu�����i�c�j
			case 'pos-vert':
				// �ʒu�����i�c�j�@�J�n
				this.positionItemStart( pArgument, wTargetItem );
				break;

			// �ʒu�����i���j
			case 'pos-side':
				// �ʒu�����i���j�@�J�n
				this.positionItemStart( pArgument, wTargetItem );
				break;

			// ���ڑ���L�����Z��
			case 'cancel':
				// ����i�C�x���g�j��S�ăL�����Z��
				this.cancelControl( pArgument.cancel );
				break;
			}

		} catch(e) {
			throw { name: 'execItemControl.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �}�E�X�Ǐ]�R�����g
	// **************************************************************

	// �}�E�X�Ǐ]�R�����g�@�����ݒ�
	clsContentsBox.prototype.initMouseCmt = function() {
		try {
			this._ContentsMouseCmt = new clsMouseCmt( { parent: this._ContentsEleMain } );

		} catch(e) {
			throw { name: 'initMouseCmt.' + e.name, message: e.message };
		}
	};

	// �A���[�g�\���i�}�E�X�Ǐ]�R�����g�\�����j
	clsContentsBox.prototype.alertMouseCmt = function( pMsgCd ) {
		try {
			// �}�E�X�Ǐ]�R�����g�ꎞ��~
			if ( this._ContentsMouseCmt ) this._ContentsMouseCmt.stopMouseCmt();
			
			if ( !(pMsgCd in this._MSG_CONTENTS_ALERT) ) return;

			var wMsg = this._MSG_CONTENTS_ALERT[pMsgCd];
			alert( wMsg );

		} catch(e) { alert(e.message); }
	};

	// �}�E�X�Ǐ]�R�����g�@�\��
	clsContentsBox.prototype.dspMouseCmt = function( pEvent, pComment) {
		try {
			if ( !this._ContentsMouseCmt ) return;

			var wEvtPos = this.getEventPos( pEvent );
			this._ContentsMouseCmt.dspMouseCmt( wEvtPos, pComment );

		} catch(e) {
			throw { name: 'dspMouseCmt.' + e.name, message: e.message };
		}
	};

	// �}�E�X�Ǐ]�R�����g�@��\��
	clsContentsBox.prototype.hideMouseCmt = function() {
		try {
			if ( !this._ContentsMouseCmt ) return;

			this._ContentsMouseCmt.hideMouseCmt();

		} catch(e) {
			throw { name: 'hideMouseCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �ۑ��^�Ǎ�
	// **************************************************************

	// �z�u����Ă��鍀�ڂ̏����擾
	clsContentsBox.prototype.getItemData = function( pParam ) {
		try {
			var wItemData = {};

			// �擾�Ώۃ`�F�b�N
			if ( this.isArray(pParam) ) {
				for( var wIndex = 0; wIndex < pParam.length; wIndex++ ) {
					wItemData[pParam[wIndex]] = { count: 0 };
				}

			} else if ( typeof pParam == 'string' ) {
				wItemData[pParam] = { count: 0 };

			} else {
				wItemData.person	= { count: 0 };
				wItemData.group		= { count: 0 };
				wItemData.relation	= { count: 0 };
				wItemData.comment	= { count: 0 };
				wItemData.freeline	= { count: 0 };

			}

			for( var wKey in wItemData ) {
				if ( wKey in this._ContentsItems ) {
					// ���ڌ����擾
					wItemData[wKey].count = Object.keys(this._ContentsItems[wKey]).length;
				}
			}

			return wItemData;

		} catch(e) {
			throw { name: 'getItemData.' + e.name, message: e.message };
		}
	};

	// �ۑ��f�[�^����
	clsContentsBox.prototype.getSaveData = function( pSaveParam ) {
		try {
			// �擾�f�[�^����
			var wSaveParam = {
				  keyperson		: true
				, personal		: true
				, contact		: true
				, comment		: true
				, freeline		: true
			};

			// �p�����[�^�ŏ㏑��
			this.copyProperty( pSaveParam, wSaveParam );

			// �ۑ��p�I�u�W�F�N�g
			var wSaveObj = {};

			// �ۑ��f�[�^KEY�ݒ�
			wSaveObj.savekey = this._DEF_CONTENTS_SAVEKEY;
			wSaveObj.baseid  = this.getBoxId();

			// ���ڃf�[�^
			var wItmes;
			for( var wKey in this._ContentsItems ) {
				wItmes = this._ContentsItems[wKey];
				
				var wSaveItem = {};
				for( var wId in wItmes ) {
					// ���ڂ̐ݒ���e���擾�iobject�j
					wSaveData = wItmes[wId].saveData( wSaveParam );
					wSaveItem[wId] = JSON.stringify( wSaveData );
				}
				
				wSaveObj[wKey] = JSON.stringify(wSaveItem);
			}
			
			return JSON.stringify(wSaveObj);
			
		} catch(e) {
			throw { name: 'getSaveData.' + e.name, message: e.message };
		}
	};

	// �f�[�^�ۑ��idownload�j�@IE
	clsContentsBox.prototype.downloadDataIE = function( pSaveData ) {
		try {
			var wBlobData = new Blob( [pSaveData], {type: 'application/json'} );

			var wFileName = this.getNowDateTime() + '.sav';

			window.navigator.msSaveBlob(wBlobData, wFileName);

		} catch(e) {
			throw { name: 'downloadDataIE', message: e.message };
		}
	};

	// �f�[�^�ۑ��idownload�j�@IE�ȊO
	clsContentsBox.prototype.downloadDataEtc = function( pSaveData ) {
		try {
			// download�pLink����
			var wDownloadLink = this.addElement( 'a', 'a-download' );
			if ( !wDownloadLink ) return false;

			this.setStyle( wDownloadLink, { display: 'none' } );

			var wBlobData = new Blob( [pSaveData], {type: 'application/json'} );
			
			wDownloadLink.href = URL.createObjectURL( wBlobData );
			wDownloadLink.download = this.getNowDateTime() + '.sav';

			// Body�v�f��Link��ݒ�
			this.appendElementToParent( this.getBoxBody(), wDownloadLink );

			// download
			wDownloadLink.click();

			// Link�폜
			this.delElement( wDownloadLink );

		} catch(e) {
			throw { name: 'downloadDataEtc', message: e.message };
		}
	};

	// �f�[�^�ۑ��idownload�j
	clsContentsBox.prototype.downloadData = function( pSaveData ) {
		try {
			// �u���E�U��IE
			if ( this.isIE() ) {
				this.downloadDataIE( pSaveData );
			
			// �ȊO
			} else {
				this.downloadDataEtc( pSaveData );

			}

		} catch(e) {
			throw { name: 'downloadData.' + e.name, message: e.message };
		}
	};

	// ���ڕ���
	clsContentsBox.prototype.loadItem = function( pKey, pLoadData ) {
		try {
			// ���ڎ�ʃ`�F�b�N
			var wItemKind;
			switch( pKey ) {
			case 'person':
				wItemKind = 'item-person';
				break;

			case 'group':
				wItemKind = 'item-group';
				break;

			case 'comment':
				wItemKind = 'item-comment';
				break;

			case 'relation':
				wItemKind = 'item-relation';
				break;

			case 'freeline':
				wItemKind = 'item-freeline';
				break;

			default:
				throw { name: 'checkKey', message: '�ΏۊO�o�[�W�����̃f�[�^�ł�[�s���ȃf�[�^���]' };
				breka;
			}

			// ���ړ��e����
			var wLoadInf = JSON.parse( pLoadData );

			// ���ڒǉ�
			var wRetItem = this.addItem( null, wItemKind, wLoadInf );
			if ( !wRetItem ) {
				throw { name: 'addItem', message: '�ۑ�����Ă��鍀�ڂ������ł��܂���[���ڒǉ�]' };
				
			}
			
			return wRetItem;

		} catch(e) {
			throw { name: 'loadItem.' + e.name, message: e.message };
		}
	};

	// ���ڂ̊֘A�t�����𕜌�
	clsContentsBox.prototype.loadItemRelation = function() {
		try {
			var self = this;

			if ( !this._ContentsItems ) return;
			
			var mRelationSave = true;

			// �֘A�t����񂪕ۑ�����Ă��Ȃ�ver
			if ( !this._ContentsItems.relation ) {
				// �֘A�t���������ڂ��琶��
				this._ContentsItems.relation = {};
				mRelationSave = false;

			}

			// �֘A�t����񐶐�
			function createRelationInf( pContentsItem ) {
				if ( !pContentsItem ) return false;

				var wItemKd;
				for( var wKey in pContentsItem ) {
					var wRelsItem = pContentsItem[wKey].getRelationList('parent');
					if ( !wRelsItem ) continue;

					for( var wRelKey in wRelsItem ) {
						wItemKd = wRelsItem[wRelKey].kind;

						// �֘A�t���Ώێ擾
						var wDstItem = self.getContentsItem( wRelKey, wItemKd );
						if ( !wDstItem ) continue;

						// �֘A�t�����擾
						var wRelInf = null;

						// �֘A�t���ۑ�ver
						if ( mRelationSave ) {
							// �����ς̏��擾
							wRelInf = self._ContentsItems.relation[wRelsItem[wRelKey].key];
						}
						
						if ( (!wRelInf) && (typeof wRelsItem[wRelKey].relationInf !== 'undefined') ) {
							// ���ڂɕۑ�����Ă���֘A�t�����擾
							// �� load���A���ڂ�relationInf�ɂ�clsItemRelation�����ׂ̈̃p�����[�^���ݒ肳���
							var wRelLoad = {};
							self.copyProperty( wRelsItem[wRelKey].relationInf, wRelLoad );

							// �֘A�t��class����
							var wRelParam;
							if ( (typeof wRelLoad.contents !== 'undefined') && (typeof wRelLoad.masterId !== 'undefined') ) {
								wRelParam = { loadData: wRelLoad };

							} else {
								wRelParam = wRelLoad;

							}
							wRelParam.window = self.getBoxWindow();
							wRelParam.parent = self._ContentsEleMain;
							
							wRelInf = new clsItemRelation( wRelParam );
						}

						// �֘A�t���ݒ�
						if ( wRelInf ) self.setRelation( pContentsItem[wKey], wDstItem, wRelInf );

					}
				}
			};

			// ���ځi��j
			createRelationInf( this._ContentsItems.person );

			// �O���[�v�i��j
			createRelationInf( this._ContentsItems.group );

			// ���p�_�i��j
			createRelationInf( this._ContentsItems.relation );

		} catch(e) {
			throw { name: 'loadItemRelation.' + e.name, message: e.message };
		}
	};

	// �f�[�^�Ǎ�
	clsContentsBox.prototype.execLoadData = function( pLoadData ) {
		try {
			// �Ǎ��f�[�^�����Ȃ珈���Ȃ�
			if ( typeof pLoadData == 'undefined' ) return false;
			if ( pLoadData == null ) return false;

			// �f�[�^�`�F�b�N
			if ( pLoadData.indexOf(this._DEF_CONTENTS_SAVEKEY) == -1 ) {
				alert( '�I�����ꂽ�t�@�C�����ۑ��f�[�^�ł͂Ȃ����A�ΏۊO�o�[�W�����̃f�[�^�ł�[savekey]');
				return false;
			}

			// �ǂݍ��񂾃f�[�^���獀�ڂ𕜌�
			var wLoadObj = JSON.parse(pLoadData);

			// �x�[�X�v�fid�擾
			var wBaseId = wLoadObj.baseid;
			if ( !wBaseId ) {
				alert( '�ΏۊO�o�[�W�����̃f�[�^�ł�[baseid�s��]');
				return false;
			}

			// ��R���e���c��id���Đݒ�
			this._ContentsEleMain.setAttribute( 'id', wBaseId );

			// ������������
			this.initContents();

			var wReadContents = {};
			try {
				for ( var wKey in wLoadObj ) {
					// �ۑ�KEY�͕s�v
					if ( wKey == 'savekey' ) continue;
					
					// �x�[�X�v�fid�͕s�v
					if ( wKey == 'baseid' ) continue;

					// �e���ځiperson�Agroup�Acomment�Arelation�j�𕜌�
					wReadContents[wKey] = {};

					var wReadItems;
					var wLoadItems = JSON.parse( wLoadObj[wKey] );
					for( var wId in wLoadItems ) {
						// �����������ڂ��擾
						wReadContents[wKey][wId] = this.loadItem( wKey, wLoadItems[wId] );
					}

				}

				// �e�q�֌W���Đݒ�
				this.resetItemParent( wReadContents );

				// �Ǎ����ڂ�ۑ�
				this._ContentsItems = wReadContents;
				if ( !('person'   in this._ContentsItems) ) this._ContentsItems.person		= {};
				if ( !('group'    in this._ContentsItems) ) this._ContentsItems.group		= {};
				if ( !('relation' in this._ContentsItems) ) this._ContentsItems.relation	= {};
				if ( !('comment'  in this._ContentsItems) ) this._ContentsItems.comment		= {};
				if ( !('freeline' in this._ContentsItems) ) this._ContentsItems.freeline	= {};

				// ���ڂ̊֘A�t�������Đݒ�
				this.loadItemRelation();

			} catch(me) {
				// �ǉ����ڂ�S�č폜���ė�O��throw
				try {
					for( var wDel in wReadContents ) {
						if ( wReadContents[wDel] ) {
							var wDelContents = wReadContents[wDel];
							for( var wDelId in wDelContents ) {
								if ( !wDelContents[wDelId] ) {
									if ( typeof wDelContents[wDelId].freeClass == 'function' ) {
										wDelContents[wDelId].freeClass();
									}
								}
								delete wDelContents[wDelId]
							}
						}
						delete wReadContents[wDel]
					}
				} catch(de) {}
				throw { name: me.name, message: me.message };
				
			}

			// ���ڍĕ\��
			this.redspContents();

			return true;

		} catch(e) {
			throw { name: 'execLoadData.' + e.name, message: e.message };
		}
	};

	// �f�[�^�ۑ�
	clsContentsBox.prototype.execSaveData = function( pEvent ) {
		try {
			// �ۑ��f�[�^����
			var wSaveData = this.getSaveData();

			// �f�[�^�ۑ��idownload�j
			this.downloadData( wSaveData );

		} catch(e) {
			throw { name: 'execSaveData.' + e.name, message: e.message };
		}
	};

	// �Ǎ����j���[�\��
	clsContentsBox.prototype.dspLoadMenu = function( pEvent ) {
		try {
			// �Ǎ��_�C�A���O�\��
			if ( this._ContentsMenuFile ) {
				var wPoint = this.getEventPos( pEvent );
				this._ContentsMenuFile.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventLoadFile } );
			}

		} catch(e) {
			throw { name: 'dspLoadMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���
	// **************************************************************

	// �L�����o�X���
	clsContentsBox.prototype.printCanvasData = function( ) {
		try {
			if ( !this._ContentsEleMain ) return false;

			var wWindow = this.getBoxWindow();
			if ( !wWindow ) return false;

			// ����v���r���[
			wWindow.print();

			return true;
			
		} catch(e) {
			throw { name: 'printCanvasData.' + e.name, message: e.message };
		}
	};

	// ����f�[�^����
	clsContentsBox.prototype.getPrintData = function( ) {
		try {
			if ( !this._ContentsEleMain ) return null;
			if ( !this._ContentsCanvas ) return null;

			return {
				  html		: this._ContentsEleMain.innerHTML
				, canvas	: this._ContentsCanvas.canvasGetStatus()
			};

		} catch(e) {
			throw { name: 'getPrintData.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ��ʑ���
	// **************************************************************

	// ����i�C�x���g�j��S�ăL�����Z��
	//�@�� ���C����ʂ���Call�����
	clsContentsBox.prototype.cancelControl = function( pCancelParam ) {
		try {
			// �L�����Z�������ݒ�
			// ���I���̓L�����Z�����Ȃ�
			var wParam = {
				  select : false
			};
			
			// ���̑��p�����[�^�㏑��
			if ( this.isObject(pCancelParam) ) {
				this.copyProperty( pCancelParam, wParam );
			}

			// �������C�x���g����
			this.eventClear( wParam );

		} catch(e) {
			throw { name: 'cancelControl . ' + e.name, message: e.message };
		}
	};

	// �q���ڂ̃C�x���g��S�ăL�����Z��
	clsContentsBox.prototype.cancelChiledEvent = function() {
		try {
			// �C�x���g�L�����Z��
			var cancelItemEvent = function( pTgList ) {
				if ( !pTgList ) return false;

				for( var wKey in pTgList ) {
					if ( !pTgList.hasOwnProperty(wKey) ) continue;

					if ( typeof pTgList[wKey].eventClear == 'function' ) {
						pTgList[wKey].eventClear();
					}
				}
			};

			for( var wKind in this._ContentsItems ) {
				if ( !this.isObject(this._ContentsItems[wKind]) ) continue;
				
				// ���ڃC�x���g�L�����Z��
				cancelItemEvent( this._ContentsItems[wKind] );
			}

		} catch(e) {
			throw { name: 'cancelChiledEvent . ' + e.name, message: e.message };
		}
	};

	// �C�x���g���L�����Z���i�E�N���b�N�ŃL�����Z���\�Ȃ��̂̂݁j
	clsContentsBox.prototype.eventClearClick = function( pCancelParam ) {
		try {
			if ( this._ContentsMenuColor ) {
				this._ContentsMenuColor.hideMenu();
			}

			if ( this._ContentsMenuFile ) {
				this._ContentsMenuFile.hideMenu();
			}

			var wCancelEvent = {
				  relation		: true
				, comment		: true
				, itemUpd		: true
				, position		: true
				, select		: true
				, freeline		: true
			};
			if ( this.isObject(pCancelParam) ) {
				if ( 'relation' in pCancelParam ) wCancelEvent.relation	= pCancelParam.relation;
				if ( 'comment'  in pCancelParam ) wCancelEvent.comment	= pCancelParam.comment;
				if ( 'itemUpd'  in pCancelParam ) wCancelEvent.itemUpd	= pCancelParam.itemUpd;
				if ( 'position' in pCancelParam ) wCancelEvent.position	= pCancelParam.position;
				if ( 'select'   in pCancelParam ) wCancelEvent.select	= pCancelParam.select;
				if ( 'freeline' in pCancelParam ) wCancelEvent.freeline	= pCancelParam.freeline;
			}

			// �֌W�ǉ��^����
			if ( wCancelEvent.relation ) this.execFunction( this.addRelationCancel );

			// �R�����g�ǉ��@����
			if ( wCancelEvent.comment ) this.execFunction( this.cancelAddItemComment );

			// ���C���ǉ��@����
			if ( wCancelEvent.freeline ) this.execFunction( this.freeLineCancel );

			// ���ڍX�V����
			if ( wCancelEvent.itemUpd ) this.execFunction( this.updItemCancel );

			// �ʒu��������
			if ( wCancelEvent.position ) this.execFunction( this.positionItemCancel );

			// �I������
			if ( wCancelEvent.select ) this.execFunction( this.resetSelectItem );

		} catch(e) {
			throw { name: 'eventClearClick.' + e.name, message: e.message };
		}
	};

	// �C�x���g��S�ăL�����Z��
	clsContentsBox.prototype.eventClear = function( pCancelParam ) {
		try {
			if ( this._ContentsMenuColor ) {
				this._ContentsMenuColor.hideMenu();
			}
			if ( this._ContentsMenuFile ) {
				this._ContentsMenuFile.hideMenu();
			}

			//�� �E�N���b�N�ŃL�����Z���\�ȃC�x���g
			this.eventClearClick( pCancelParam );

			//�� �E�N���b�N�ŃL�����Z���ł��Ȃ��C�x���g
			// �L�����Z���Ώېݒ�
			var wCancelEvent = {
				  move		: true
				, resize	: true
			};
			if ( this.isObject(pCancelParam) ) {
				if ( 'move'   in pCancelParam ) wCancelEvent.move	= pCancelParam.move;
				if ( 'resize' in pCancelParam ) wCancelEvent.resize	= pCancelParam.resize;
			}

			// �@�ړ��i����э��ڒǉ��j
			if ( wCancelEvent.move ) this.execFunction( this.moveItemCancel );
			
			// �@���T�C�Y�I��
			if ( wCancelEvent.resize ) this.execFunction( this.cancelResizeItem );

			// �q���ڂ̃C�x���g�L�����Z��
			this.cancelChiledEvent();
			
		} catch(e) {
			throw { name: 'eventClear.' + e.name, message: e.message };
		}
	};

	// �S���ڃ��j���[�@�L�����E������
	clsContentsBox.prototype.useItemContextCtrl = function( pValid, pParam ) {
		try {
			// �S���ڂ̃��j���[����ݒ�
			for( var wKey in this._ContentsItems ) {
				if ( !this._ContentsItems[wKey] ) continue;
				
				for( var wId in this._ContentsItems[wKey] ) {
					var wItem = this._ContentsItems[wKey][wId];
					if ( !wItem ) continue;
					
					if ( typeof wItem.setContextAvailable == 'function' ) {
						wItem.setContextAvailable( pValid, pParam );
					}
				}
			}

		} catch(e) {
			throw { name: 'useItemContextCtrl', message: e.message };
		}
	};

	// �S���ڈʒu�������j���[�@�L�����E������
	clsContentsBox.prototype.useItemPositionCtrl = function( pValid ) {
		try {
			// �S���ڂ̈ʒu�������j���[����ݒ�
			for( var wKey in this._ContentsItems ) {
				if ( !this._ContentsItems[wKey] ) continue;
				
				for( var wId in this._ContentsItems[wKey] ) {
					var wItem = this._ContentsItems[wKey][wId];
					if ( !wItem ) continue;
					
					if ( typeof wItem.setPositionAvailable == 'function' ) {
						wItem.setPositionAvailable( pValid );
					}
				}
			}

		} catch(e) {
			throw { name: 'useItemPositionCtrl', message: e.message };
		}
	};

	// �x�[�X����@�L�����E������
	clsContentsBox.prototype.useContextCtrl = function( pValid ) {
		try {
			// ���������͑I������
			if ( !pValid ) this.execFunction( this.resetSelectItem );

			// ���ڃ��j���[����ݒ�
			var wMenuValid = pValid;

			// �h���b�O��
			var wCtrlParam = {};

			// �z�u�ҏW���[�h��
			if ( this.isEditModeMove() ) {
				// �L�������Ȃ�
				wMenuValid = false;

				// �h���b�O����
				wCtrlParam.drag = true;
			
			}

			// �S���ڂ̑���ݒ�
			this.useItemContextCtrl( wMenuValid, wCtrlParam );

			// �x�[�X���j���[
			this._ContentsContextValid = pValid;

			// �T�C�h�p�l���E�p�l���R���g���[���@����ݒ�
			var wValidParam = {
				  kind		: 'set-valid'
				, valid		: pValid
			};
			this.execLinkCallback( wValidParam, null );

		} catch(e) {
			throw { name: 'useContextCtrl.' + e.name, message: e.message };
		}
	};

	// �J���[���j���[�\��
	clsContentsBox.prototype.dspColorMenu = function( pEvent ) {
		try {
			// �C�x���g��~
			this.cancelEvent( pEvent, true );

			// �������C�x���g����
			this.eventClear();

			// �J���[���j���[�\��
			if ( this._ContentsMenuColor ) {
				var wPoint = this.getEventPos( pEvent );
				this._ContentsMenuColor.dspMenu( { x: wPoint.x, y: wPoint.y, callback: this.eventColorSelect } );
			}

		} catch(e) {
			throw { name: 'dspColorMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ��{��ʂ̃��j���[
	// **************************************************************

	// �I��������
	clsContentsBox.prototype.execContentsMenu = function( pEvent, pSelectMenu ) {
		try {
			if ( !pSelectMenu ) return false;

			var wRetVal = true;

			switch(pSelectMenu.kind) {
			// �l���ǉ�
			case 'item':
				wRetVal = this.addItemStart( pEvent, 'item-person' );
				break;

			// �O���[�v�ǉ�
			case 'group':
				wRetVal = this.addItemStart( pEvent, 'item-group' );
				break;

			// �R�����g�ǉ�
			case 'comment':
				wRetVal = this.addItemComment( pEvent );
				break;

			// �t���[���C���ǉ�
			case 'freeline':
				wRetVal = this.addItemFreeLine( pEvent );
				break;

			// �F�ύX
			case 'color':
				wRetVal = this.dspColorMenu( pEvent );
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'execContentsMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���C�����j���[��ʂ̃��j���[
	// **************************************************************

	// �ҏW���[�h���j���[���u�z�u�ҏW�v���`�F�b�N
	clsContentsBox.prototype.isEditModeMove = function( pEditMode ) {
		try {
			var wModeKind = this._ContentsEditMode;
			
			if ( typeof pEditMode == 'string' ) wModeKind = pEditMode;
			
			return ( wModeKind == this._DEF_MENU_ID_MOVE );

		} catch(e) {
			throw { name: 'isEditModeMove.' + e.name, message: e.message };
		}
	};

	// �ҏW���[�h�ݒ�
	clsContentsBox.prototype.setEditMode = function( pMenuId ) {
		try {
			// ���j���[�ύX�Ȃ��͏����Ȃ�
			if ( this._ContentsEditMode == pMenuId ) return false;

			switch( pMenuId ) {
			// �z�u�ҏW���[�h
			case this._DEF_MENU_ID_MOVE:
				// �I������
				this.resetSelectItem();

				// ���ڃ��j���[������
				this.useItemContextCtrl( false, { drag: true } );
				
				// ���ڈʒu�������j���[�L����
				this.useItemPositionCtrl( true );

				break;

			// �ȊO�i�ʏ탂�[�h�j
			default:
				// ���ڃ��j���[�L����
				this.useItemContextCtrl( true );

				break;
			
			}

			// ���[�h�Ɉڍs
			this._ContentsEditMode = pMenuId;

			// ���j���[�ύX
			this.chgMenuEditStyle( this._ContentsEditMode );

			return true;

		} catch(e) {
			throw { name: 'setEditMode.' + e.name, message: e.message };
		}
	};

	// ���C�����j���[�I��������
	clsContentsBox.prototype.execMainMenu = function( pEvent, pMenuId ) {
		try {
			var wRetVal = true;

			// �x�[�X����L�����̂�
			if ( !this._ContentsContextValid ) return false;

			switch(pMenuId) {
			// �f�[�^
			case 'data':
				// �f�[�^���j���[�\��
				// �z�u�ҏW�p�R���e�L�X�g���j���[�\��
				var wPoint = this.getEventPos( pEvent );
				this._ContentsMenuData.dspMenu( wPoint );
				break;

			// �ʏ�ҏW
			case this._DEF_MENU_ID_NORMAL:
				// �ʏ탂�[�h�֐ؑ�
				wRetVal = this.setEditMode( pMenuId );

				if ( wRetVal ) {
					// ���T�C�h�p�l���֕ҏW���[�h�ύX�ʒm
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_NORMAL }, null );
				}
				break;

			// �z�u�ҏW
			case this._DEF_MENU_ID_MOVE:
				// �z�u�ҏW���[�h�֐ؑ�
				wRetVal = this.setEditMode( pMenuId );

				if ( wRetVal ) {
					// ���T�C�h�p�l���֕ҏW���[�h�ύX�ʒm
					this.execLinkCallback( { kind: 'edit', mode: this._DEF_MENU_ID_MOVE }, null );
				}
				break;

			// ���
			case 'print':
				// ���
				this.printCanvasData()
				break;

			// �f�[�^�ۑ�
			case 'save':
				// �ۑ�
				wRetVal = this.execSaveData( pEvent );
				break;

			// �f�[�^�Ǎ�
			case 'load':
				// �Ǎ�
				wRetVal = this.dspLoadMenu( pEvent );
				break;

			}
			return wRetVal;

		} catch(e) {
			throw { name: 'execMainMenu.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ��ʐ���
	// **************************************************************

	// ���j���[�L���`�F�b�N
	clsContentsBox.prototype.chkActiveMenu = function( ) {
		try {
			// ���j���[�ݒ�`�F�b�N
			if ( !this._ContentsMenuIs ) return false;

			var wMenuIs = false;
			for( var wKey in this._ContentsMenuIs ) {
				if ( this._ContentsMenuIs[wKey] ) {
					wMenuIs = true;
					break;
				}
			}

			return wMenuIs;

		} catch(e) {
			throw { name: 'createMenuElement.' + e.name, message: e.message };
		}
	};

	// ���j���[�\���G���A����
	clsContentsBox.prototype.createMenuElement = function( ) {
		try {
			// ���j���[�ݒ�L�����̂�
			if ( !this.chkActiveMenu() ) return;

			// ���j���[�\���G���A����
			var wMenuEle = this.addElement( 'div', this.getBoxId() + '_menu' );
			if ( !wMenuEle ) {
				throw { name: 'addElement', message: '�v�f�������ł��܂���' };

			}

			this.addClass( wMenuEle, 'cssCommon-menu' );
			this.addClass( wMenuEle, 'no-print' );
			this.appendBoxToParent( wMenuEle );

			// ���얳����
			this.addEvent( wMenuEle, 'onclick',			this.eventInvalid );
			this.addEvent( wMenuEle, 'oncontextmenu',	this.eventInvalid );

			// �v�f�ۑ�
			this._ContentsEleMenu = wMenuEle;

			// ���j���[�ǉ�
			if ( this._ContentsMenuIs.edit ) {
				var wEditNormal = this.createMenuEditNormal( this._ContentsEleMenu, this.eventMainMenuSelect );
				this._ContentsEleMenuList.push( wEditNormal );

				var wEditMove = this.createMenuEditMove( this._ContentsEleMenu, this.eventMainMenuSelect );
				this._ContentsEleMenuList.push( wEditMove );
			}

			if ( this._ContentsMenuIs.data ) {
				// �f�[�^SAVE
				var wParamSave = {
					  title		: '�f�[�^�ۑ�'
					, name		: 'save'
					, style		: { 'float': 'right' }
					, class		: 'cssCommon-menu-list-def'
				};

				var wDataSave = this.createMenu( this._ContentsEleMenu, this.eventMainMenuSelect, wParamSave );
				this._ContentsEleMenuList.push( wDataSave );

				// �f�[�^LOAD
				var wParamLoad = {
					  title		: '�f�[�^�Ǎ�'
					, name		: 'load'
					, style		: { 'float': 'right' }
					, class		: 'cssCommon-menu-list-def'
				};

				var wDataLoad = this.createMenu( this._ContentsEleMenu, this.eventMainMenuSelect, wParamLoad );
				this._ContentsEleMenuList.push( wDataLoad );
			}

			if ( this._ContentsMenuIs.print ) {
				// ���
				var wParamPrint = {
					  title		: '���'
					, name		: 'print'
					, style		: { 'float': 'right', 'padding-right': '10px' }
					, class		: 'cssCommon-menu-list-def'
				};

				var wPrint = this.createMenu( this._ContentsEleMenu, this.eventMainMenuSelect, wParamPrint );
				this._ContentsEleMenuList.push( wPrint );
			}

		} catch(e) {
			throw { name: 'createMenuElement.' + e.name, message: e.message };
		}
	};

	// ���C���R���e���c�G���A����
	clsContentsBox.prototype.createContentsElement = function() {
		try {
			// �X�e�[�^�X�\���G���A����
			var wMainEle = this.addElement( 'div', this.getBoxId() + '_main' );
			if ( !wMainEle ) {
				throw { name: 'addElement', message: '�v�f�������ł��܂���' };

			}

			this.addClass( wMainEle, 'cssContents-main' );

			// ���j���[�ݒ�L����
			if ( this.chkActiveMenu() ) {
				this.addClass( wMainEle, 'cssContents-main-menu' );

			// ���j���[�Ȃ�
			} else {
				this.addClass( wMainEle, 'cssContents-main-nomenu' );

			}

			this.appendBoxToParent( wMainEle );

			// �v�f�ۑ�
			this._ContentsEleMain = wMainEle;

		} catch(e) {
			throw { name: 'createContentsElement.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ���ړ���
	// **************************************************************

	// �ҏW���[�h���j���[�ύX
	// �@�����C���I�u�W�F�N�g����call�����
	clsContentsBox.prototype.execChgEditModeNormal = function() {
		try {
			// �ʏ�ҏW���[�h�ɕύX
			this.setEditMode( this._DEF_MENU_ID_NORMAL );

		} catch(e) {
			throw { name: 'execChgEditModeNormal.' + e.name, message: e.message };
		}
	};

	// �������ڕύX������
	// �@�������I�u�W�F�N�g����call�����
	clsContentsBox.prototype.execLinkItemEvent = function( pArgument ) {
		try {
			switch( pArgument.kind ) {
			// ���ڑI��
			case 'select':
				var wSelectItm = pArgument.item;
				if ( wSelectItm ) {
					// �R���e���c�ƃT�C�h�p�l������
					this.selectClickItem( wSelectItm );
				
				}
				break;

			// ���ڑ���L�����Z��
			case 'cancel':
				// ����i�C�x���g�j��S�ăL�����Z��
				this.cancelControl( pArgument.cancel );
				break;

			// �ҏW���j���[�I��
			case 'edit':
				this.setEditMode( pArgument.mode );
				break;
			
			}

		} catch(e) {
			throw { name: 'execLinkItemEvent.' + e.name, message: e.message };
		}
	};


	// �����I�u�W�F�N�g�ւ̍��ڕύX�ʒm�C�x���g�ݒ�
	clsContentsBox.prototype.addLinkCallback = function( pEvtFnc ) {
		try {
			if ( !pEvtFnc ) return false;

			// ���ڕύX�������ǉ�
			this._ContentsLinkCallback.push( pEvtFnc );

		} catch(e) {
			throw { name: 'addLinkCallback', message: e.message };
		}
	};

	// ���ڕύX������
	// �@�������I�u�W�F�N�g�֍��ڕύX��ʒm
	clsContentsBox.prototype.execLinkCallback = function( pParam, pItem ) {
		try {
			if ( this._ContentsLinkCallback.length == 0 ) return true;

			// �C�x���g�I�u�W�F�N�g�փp�����[�^�ݒ�
			var wCallbackParam = {};
			this.copyProperty( pParam, wCallbackParam );

			wCallbackParam.item		= pItem;

			for( var wIndex = 0; wIndex < this._ContentsLinkCallback.length; wIndex++ ) {
				if ( typeof this._ContentsLinkCallback[wIndex] == 'function' ) {
					// �o�^����Ă��鏈�������s
					var wArguments = [];
					wArguments.push( wCallbackParam );

					this._ContentsLinkCallback[wIndex].apply( this, wArguments );

				}
			}
			return true;

		} catch(e) {
			throw { name: 'execLinkCallback.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// ����ݒ�p�����[�^�擾
	// **************************************************************

	// ���ڃh���b�O�ېݒ�
	clsContentsBox.prototype.getSettingItemDrag = function( pItemKind ) {
		try {
			var wItemDrag = {
				  drag		: false
				, moveInit	: false
			};

			// �Ώۍ��ڎ�ʖ�
			var wKindNm = '';

			// �l��
			if ( this.isItemPerson(pItemKind) ) {
				wKindNm = 'person';

			// �O���[�v
			} else if ( this.isItemGroup(pItemKind) ) {
				wKindNm = 'group';

			// �R�����g
			} else if ( this.isItemComment(pItemKind) ) {
				wKindNm = 'comment';

			// �֘A�t�����p�_
			} else if ( this.isItemRelation(pItemKind) ) {
				wKindNm = 'relation';

			// �֘A�t�����p�_
			} else if ( this.isItemFreeLine(pItemKind) ) {
				wKindNm = 'freeline';

			// �ȊO�͏����Ȃ�
			} else {
				return wItemDrag;

			}

			// ���ڑ���ݒ�擾
			var wControl = this.loadArgument( 'control' );
			if ( !wControl ) return wItemDrag;
			
			var wCtrlDrag = wControl.drag;
			if ( wCtrlDrag ) {
				if ( wKindNm in wCtrlDrag ) wItemDrag.drag = wCtrlDrag[wKindNm];
			}

			var wCtrlMove = wControl.moveInit;
			if ( wCtrlMove ) {
				if ( wKindNm in wCtrlMove ) wItemDrag.moveInit = wCtrlMove[wKindNm];
			}

			return wItemDrag;

		} catch(e) {
			throw { name: 'getSettingItemDrag.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsContentsBox.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_CONTENTS_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁucontents�v
				wInitArgument.kind = this._DEF_CONTENTS_KIND;

			}

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// �ҏW���j���[�����l
			this._ContentsEditMode = this._DEF_MENU_ID_NORMAL;

			var wArgFlg = this.isObject(pArgument);

			// �p�����[�^�擾
			var wLocked		= false;
			var wUseMenu	= null;

			if ( wArgFlg ) {
				if ( 'locked' in pArgument ) wLocked = pArgument.locked;

				// ���j���[�ݒ�
				if ( 'menu' in pArgument ) {
					if ( 'contents' in pArgument.menu ) wUseMenu = pArgument.menu.contents;
				}
			}
			this._ContentsLocked = wLocked;

			// ���b�N���̓��j���[�g�p�s��
			if ( !wLocked ) {
				this._ContentsMenuIs = wUseMenu;
			}

			// �N���X�ǉ�
			this.setBoxClass( 'cssContents-base' );
			this.setBoxClass( 'main-print' );

			// ���j���[�\���G���A����
			this.createMenuElement();

			// ���C���R���e���c�G���A����
			this.createContentsElement();

			// ------------------------
			// ���ʃ��j���[�ݒ�
			// ------------------------
			// �����b�N�����j���[�s�v
			if ( !wLocked ) {
				// ���ʃ��j���[�ݒ�
				this._ContentsPublicMenu = this.loadArgument( 'publicMenu' );

				// �J���[���j���[�ݒ�
				if ( this._ContentsPublicMenu ) {
					if ( this._ContentsPublicMenu.common ) {
						this._ContentsMenuColor = this._ContentsPublicMenu.common.color;
					}
				}
				if ( !this._ContentsMenuColor ) this._ContentsMenuColor = new clsColorBox();

			}

			// �t�@�C���I�����j���[�ݒ�
			if ( this._ContentsPublicMenu ) {
				if ( this._ContentsPublicMenu.common ) {
					this._ContentsMenuFile = this._ContentsPublicMenu.common.file;
				}
			}
			if ( !this._ContentsMenuFile ) this._ContentsMenuFile = new clsFileBox();

			// ------------------------
			// �L�����o�X�ݒ�
			// ------------------------
			var wCanvasSize = {
				  width		: this._DEF_CONTENTS_CANVAS_SIZE.width
				, height	: this._DEF_CONTENTS_CANVAS_SIZE.height
			};

			// �L�����o�X�T�C�Y�ݒ肠��
			if ( wArgFlg ) {
				if ( 'canvas' in pArgument ) {
					var wCanvasParam = pArgument.canvas;
					if ( 'width' in wCanvasParam ) {
						if ( String(wCanvasParam.width).length > 0 ) wCanvasSize.width = Number(wCanvasParam.width);
					}
					if ( 'widthSub' in wCanvasParam ) {
						if ( String(wCanvasParam.widthSub).length > 0 ) wCanvasSize.width -= Number(wCanvasParam.widthSub);
					}

					if ( 'height' in wCanvasParam ) {
						if ( String(wCanvasParam.height).length > 0 ) wCanvasSize.height = Number(wCanvasParam.height);
					}
					if ( 'heightSub' in wCanvasParam ) {
						if ( String(wCanvasParam.heightSub).length > 0 ) wCanvasSize.height -= Number(wCanvasParam.heightSub);
					}

				}
			}
			this._ContentsCanvas = new clsCanvas( { parent: this._ContentsEleMain, size: wCanvasSize } );

			// �����b�N��
			if ( !wLocked ) {
				// ------------------------
				// �R���e�L�X�g���j���[�ݒ�
				// ------------------------

				// ���j���[����
				this._ContentsContextMenu = new clsMenuList( { menuList: this._DEF_CONTENTS_MENU, callback: this.eventMenuSelect } );

				// ------------------------
				// �C�x���g�ݒ�
				// ------------------------

				// �x�[�X���j���[�L����
				this.addBoxEvents( 'oncontextmenu'	, this.eventContentsContext );

				// ���ڃN���b�N
				this.addBoxEvents( 'onmousedown'	, this.eventContentsClick );

				// ------------------------
				// �Ǐ]�R�����g�ݒ�
				// ------------------------
				this.initMouseCmt();

			// ���b�N��
			} else {
				// �x�[�X���j���[������
				this.addBoxEvents( 'oncontextmenu'	, this.eventInvalid );

			}

			// ����ېݒ�
			this.useContextCtrl( !wLocked );

			// ------------------------
			// �����pcallback�ݒ�
			// ------------------------
			if ( wArgFlg ) {
				this.addLinkCallback( pArgument.callback );

			}

			// ��R���e���c�\��
			this.dspBox( true );

		} catch(e) {
			throw { name: 'clsContentsBox.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsContentsBox.prototype.freeClass = function() {
		try {
			// ���ڑS�č폜
			this.execFunction( this.initContents );

			// �v���p�e�B�J��
			this._ContentsPublicMenu		= null;
			this._ContentsMenuColor			= null;
			this._ContentsMenuFile			= null;

			if ( this._ContentsCanvas ) {
				this._ContentsCanvas.freeClass();
			}
			this._ContentsCanvas			= null;

			if ( this._ContentsContextMenu ) {
				this._ContentsContextMenu.freeClass();
			}
			this._ContentsContextMenu		= null;

			if ( this._ContentsMenuData ) {
				this._ContentsMenuData.freeClass();
			}
			this._ContentsMenuData			= null;

			for( var wIdx = 0; wIdx < this._ContentsEleMenuList.length; wIdx++ ){
				this._ContentsEleMenuList[wIdx] = null;
			}
			
			if ( this._ContentsEleMenu ) {
				this.execFunction( this.delEvent, this._ContentsEleMenu, 'onclick',			this.eventInvalid );
				this.execFunction( this.delEvent, this._ContentsEleMenu, 'oncontextmenu',	this.eventInvalid );
			}
			this._ContentsEleMenu			= null;

			for( var wCIdx = 0; this._ContentsLinkCallback.length; CIdx++ ) {
				this._ContentsLinkCallback[wCIdx] = null;
			}
			this._ContentsLinkCallback = null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype	= null;

		} catch(e) {}
	};
}());
