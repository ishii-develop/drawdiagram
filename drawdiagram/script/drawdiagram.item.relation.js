
// --------------------------------------------------------------------
//
// �֌W���N���X
//
// --------------------------------------------------------------------
// clsItemRelation �� clsItemBox �� clsBaseBox
// --------------------------------------------------------------------
var clsItemRelation = function( pArgument ) {
	try {
		var self = this;

		this._DEF_RELATIONINF_KIND				= 'item-relation';

		this._DEF_RELATIONINF_STYLE				= {
				  'z-index'				: '310'
			};

		// ���p�_���C�����i�ʏ펞�j
		this._DEF_RELATIONINF_LINE_WIDTH		= 1;

		// ----------------------------------
		// ���j���[�ݒ�
		// ----------------------------------
		this._DEF_RELATIONINF_MENU_CONTEXT		= {
			  2: [
				  { kind: 'relation'	, title: '�֘A�t��'		}
				, { kind: 'relationChg'	, title: '�֘A�ύX'		}
				, { kind: 'unrelation'	, title: '�֘A����'		}
			 ]
			, 3: [
				  { kind: 'color'		, title: '�F�ύX'		}
			  ]
		};


		// ----------------------------------
		// �֌W���
		// ----------------------------------

		this._DEF_RELATIONINF_LIST_STAT			= [
				  { value: 1, name: '�ʏ�'			, width: 1	, style: 'normal'	}
				, { value: 2, name: '�������т�'	, width: 3	, style: 'normal'	}
				, { value: 3, name: '�󔖂Ȋ֌W'	, width: 2	, style: 'dash'		}
				, { value: 4, name: '�Η�'			, width: 1	, style: 'stripe'	}
		];

		this._DEF_RELATIONINF_LIST_KIND			= [
				  { value: 99, name: '���̑�'		, color: '#000000'	}
				, { value:  1, name: '�e�q'			, color: '#339900'	}
				, { value: 20, name: '�e��'			, color: '#00CC00'	}
				, { value: 10, name: '�v�w'			, color: '#333399'	}
				, { value: 11, name: '����'			, color: '#FF9900'	}
				, { value: 12, name: '�č�'			, color: '#FF99CC'	}
				, { value: 30, name: '�G��'			, color: '#FF0000'	}
		];

		this._DEF_RELATIONINF_LIST_KIND_GROUP	= [
				  { value: 99, name: '���̑�'		, color: '#000000'	}
				, { value:  1, name: '�e�q'			, color: '#339900'	}
				, { value: 20, name: '�e��'			, color: '#00CC00'	}
				, { value: 30, name: '�G��'			, color: '#FF0000'	}
		];

		this._DEF_RELATIONINF_LIST_WAY			= [
				  { value: 0, name: '�Ȃ�'				}
				, { value: 1, name: '������'			}
				, { value: 2, name: '�t����'			}
				, { value: 3, name: '�o����'			}
		];

		this._DEF_RELATIONINF_CONTENTS			= {
				  stat		: 1
				, rel		: 99
				, way		: 0
				, cmt		: ''
				, color		: 'black'
				, relKind	: 'item-person'
		};

		this._DEF_RELATIONINF_LINE				= { 
				  width		: 2
				, style		: 'normal'
				, color		: 'black'
				, way		: 0
		};

		// �p�����N���X��prototype
		this._ItemPrototype						= null;

		// �֌W���
		this._RelationInfMaster					= { parent: '', target: '', key: '' };
		this._RelationInfContents				= {};
		this._RelationInfKind					= null;

		// �R�����g���
		this._RelationInfCmtMove				= null;
		this._RelationInfHtml					= '';
		this._RelationInfCmtDrag				= true;

		// ���p�_
		this._RelationInfPoints					= {};


		// **************************************************************
		// �R�����g�C�x���g
		// **************************************************************

		// �R�����g�ړ��@�J�n
		this.eventCmtMoveStart = function( pEvent ) {
			try {
				// �R�����g�h���b�O�����̂ݏ���
				if ( !self._RelationInfCmtDrag ) return true;

				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				// ���N���b�N�̂ݗL��
				var wClick = self.getEventClick( pEvent );
				if ( wClick.left ) {
					// �ړ��J�n
					self.startCmtMove( pEvent );
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �R�����g�ړ��@�ړ���
		this.eventCmtMove = function( pEvent ) {
			try {
				if ( !self._RelationInfCmtMove ) return false;

				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				// �R�����g�ړ�
				var wPoint = self.getEventPos( pEvent );
				self.moveCmt( wPoint );

			} catch(e) {
				self.execFunction( self.cancelCmtMove );
				self.catchErrorDsp(e);
			}
			return false;
		};

		// �R�����g�ړ��@�I��
		this.eventCmtMoveStop = function( pEvent ) {
			try {
				// �C�x���g��~
				self.execFunction( self.cancelEvent, pEvent, true );

				if ( self._RelationInfCmtMove ) {
					// �ړ���`�F�b�N
					var wStayFlg = false;
					
					// �J�n�ʒu�Ɠ����Ȃ珈���Ȃ�
					var wStPos = self._RelationInfCmtMove.startpos;
					if ( self.isObject(wStPos) ) {
						var wEvtPos = self.getEventPos( pEvent );
						if ( (wEvtPos.x == wStPos.x) && (wEvtPos.y == wStPos.y) ) wStayFlg = true;
					}

					if ( !wStayFlg ) {
						// �ړ���ۑ�
						self.setLinePoint( pEvent, self.getBoxElement() );
					
					}
				
				}

				// �ړ��I��
				self.cancelCmtMove();

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
		throw { name: 'clsItemRelation.' + e.name, message: e.message };
	}
};

// �֌W��� prototype
(function(){
	// clsItemBox�̃v���g�^�C�v���p��
	clsInheritance( clsItemRelation, clsItemBox );


	// **************************************************************
	// �K��l�擾
	// **************************************************************

	// �K��l�擾�@���
	clsItemRelation.prototype.getDefStat = function() {
		try {
			return this._DEF_RELATIONINF_LIST_STAT;

		} catch(e) {
			throw { name: 'getDefStat', message: e.message };
		}
	};

	// �K��l�擾�@�֌W
	clsItemRelation.prototype.getDefKind = function( pValue ) {
		try {
			// �l�w�莞
			if ( typeof pValue !== 'undefined' ) {
				var wRelKind = this._RelationInfKind[0];

				for( var wIdx=0; wIdx < this._RelationInfKind.length; wIdx++ ) {
					if ( this._RelationInfKind[wIdx].value == pValue ) {
						wRelKind = this._RelationInfKind[wIdx];
						break;
					}
				}
				return wRelKind;
			
			// �l���w�莞�͑S��
			} else {
				return this._RelationInfKind;

			}

		} catch(e) {
			throw { name: 'getDefKind', message: e.message };
		}
	};

	// �K��l�擾�@���������i�����j
	clsItemRelation.prototype.getDefWay = function() {
		try {
			return this._DEF_RELATIONINF_LIST_WAY;

		} catch(e) {
			throw { name: 'getDefWay', message: e.message };
		}
	};

	// �K��l�擾�@�O�g�̕�
	clsItemRelation.prototype.getDefLineWidth = function() {
		try {
			return this._DEF_RELATIONINF_LINE_WIDTH;

		} catch(e) {
			throw { name: 'getDefLineWidth', message: e.message };
		}
	};


	// **************************************************************
	// �v���p�e�B�ݒ�/�擾
	// **************************************************************

	// �ݒ�l�擾�i���ʁj
	clsItemRelation.prototype.getContents = function() {
		try {
			var wRetValue = {};

			for( var wKey in this._RelationInfContents ) {
				wRetValue[wKey] = this._RelationInfContents[wKey];
			}

			return wRetValue;

		} catch(e) {
			throw { name: 'getContents', message: e.message };
		}
	};

	// �ݒ�l�X�V
	clsItemRelation.prototype.setContents = function( pContents ) {
		try {
			for( var wKey in pContents ) {
				this._RelationInfContents[wKey] = pContents[wKey];
			}

		} catch(e) {
			throw { name: 'setContents', message: e.message };
		}
	};

	// �֌W�@�ݒ�^�擾
	clsItemRelation.prototype.setRelation = function( pRelation ) {
		try {
			this._RelationInfContents.rel = pRelation;

		} catch(e) {
			throw { name: 'setRelation', message: e.message };
		}
	};

	clsItemRelation.prototype.getRelation = function() {
		try {
			return this._RelationInfContents.rel;

		} catch(e) {
			throw { name: 'getRelation', message: e.message };
		}
	};

	// �֌W��ʁ@�ݒ�^�擾
	clsItemRelation.prototype.setStatus = function( pStatus ) {
		try {
			this._RelationInfContents.stat = pStatus;

		} catch(e) {
			throw { name: 'setStatus', message: e.message };
		}
	};

	clsItemRelation.prototype.getStatus = function() {
		try {
			return this._RelationInfContents.stat;

		} catch(e) {
			throw { name: 'getStatus', message: e.message };
		}
	};

	// �������������@�ݒ�^�擾
	clsItemRelation.prototype.setWorkWay = function( pWay ) {
		try {
			this._RelationInfContents.way = pWay;

		} catch(e) {
			throw { name: 'setWorkWay', message: e.message };
		}
	};

	clsItemRelation.prototype.getWorkWay = function() {
		try {
			return this._RelationInfContents.way;

		} catch(e) {
			throw { name: 'getWorkWay', message: e.message };
		}
	};

	// �R�����g�@�ݒ�^�擾
	clsItemRelation.prototype.setComment = function( pComment ) {
		try {
			this._RelationInfContents.cmt = pComment;

		} catch(e) {
			throw { name: 'setComment', message: e.message };
		}
	};

	clsItemRelation.prototype.getComment = function() {
		try {
			return this._RelationInfContents.cmt;

		} catch(e) {
			throw { name: 'getComment', message: e.message };
		}
	};

	// �F�@�ݒ�^�擾
	clsItemRelation.prototype.setColor = function( pColor ) {
		try {
			this._RelationInfContents.color = pColor;

		} catch(e) {
			throw { name: 'setColor', message: e.message };
		}
	};

	clsItemRelation.prototype.getColor = function() {
		try {
			return this._RelationInfContents.color;

		} catch(e) {
			throw { name: 'getColor', message: e.message };
		}
	};


	// **************************************************************
	// �֌W���擾
	// **************************************************************

	// ��ʎ擾
	clsItemRelation.prototype.getRelationKind = function() {
		try {
			// �I�����ꂽ�֌W�擾
			var wRelation = this._RelationInfContents.rel;
			
			var wRelKind = this.getDefKind( wRelation );

			return wRelKind;

		} catch(e) {
			throw { name: 'getRelationKind.' + e.name, message: e.message };
		}
	};

	// �F�擾
	clsItemRelation.prototype.getRelationColor = function() {
		try {
			var wColor = this._RelationInfContents.color;
			if ( typeof wColor != 'string' ) wColor = 'black';

			return wColor;

		} catch(e) {
			throw { name: 'getRelationColor', message: e.message };
		}
	};

	// �֘A��񂩂�`����擾
	clsItemRelation.prototype.toLineKind = function( ) {
		try {
			var wRetLineKind = Object.create( this._DEF_RELATIONINF_LINE );

			// ��ʎ擾
			var wStatus = this._RelationInfContents.stat;
			for( var wIdx=0; wIdx < this._DEF_RELATIONINF_LIST_STAT.length; wIdx++ ) {
				if ( String(wStatus) == String(this._DEF_RELATIONINF_LIST_STAT[wIdx].value) ) {
					wRetLineKind.width = this._DEF_RELATIONINF_LIST_STAT[wIdx].width;
					wRetLineKind.style = this._DEF_RELATIONINF_LIST_STAT[wIdx].style;
					break;
				}

			}

			// ������������
			wRetLineKind.way = this._RelationInfContents.way;

			// �F�ݒ�
			var wColor = this.getRelationColor();
			wRetLineKind.color = wColor;

			// ���p�_
			wRetLineKind.point = {};
			this.copyProperty( this._RelationInfPoints, wRetLineKind.point );
			
			return wRetLineKind;

		} catch(e) {
			throw { name: 'toLineKind', message: e.message };
		}
	};


	// **************************************************************
	// �����v�f���
	// **************************************************************

	// �����v�f�@�֘A�t��KEY�ݒ�
	clsItemRelation.prototype.setMasterKey = function( pParentId, pTargetId ) {
		try {
			this._RelationInfMaster.parent = pParentId;
			this._RelationInfMaster.target = pTargetId;

			var wMasterKey = pParentId + '-' + pTargetId;
			this._RelationInfMaster.key = wMasterKey;

		} catch(e) {
			throw { name: 'setMasterKey', message: e.message };
		}
	};

	// �����v�f�@�����`�F�b�N
	clsItemRelation.prototype.chkMasterKey = function( pId ) {
		try {
			// �֘A��ID�`�F�b�N
			if ( pId == this._RelationInfMaster.parent ) return true;

			// �֘A��ID�`�F�b�N
			if ( pId == this._RelationInfMaster.target ) return true;

			return false;

		} catch(e) {
			throw { name: 'chkMasterKey', message: e.message };
		}
	};

	// �����v�f�@�֘A�t��KEY�擾
	clsItemRelation.prototype.getMasterKey = function() {
		try {
			return this._RelationInfMaster.key;

		} catch(e) {
			throw { name: 'getMasterKey', message: e.message };
		}
	};

	// �����v�f�@�֘A�t����ID�擾
	clsItemRelation.prototype.getMasterParent = function() {
		try {
			return this._RelationInfMaster.parent;

		} catch(e) {
			throw { name: 'getMasterParent', message: e.message };
		}
	};

	// �����v�f�@�֘A�t����ID�擾
	clsItemRelation.prototype.getMasterTarget = function() {
		try {
			return this._RelationInfMaster.target;

		} catch(e) {
			throw { name: 'getMasterTarget', message: e.message };
		}
	};


	// **************************************************************
	// ���p�_
	// **************************************************************

	// ���p�_�R�����g�ʒu�ݒ�
	clsItemRelation.prototype.setCommentPoint = function( pEvent ) {
		try {
			// ���p�_�ݒ�
			this.setLinePoint( pEvent, this.getBoxElement() );

		} catch(e) {
			throw { name: 'setCommentPoint.' + e.name, message: e.message };

		}
	};

	// ���p�_�ݒ�
	clsItemRelation.prototype.setLinePoint = function( pEvent, pElement ) {
		try {
			// �I���ʒu
			var wPoint = this.getEventPos( pEvent );

			// ���W�␳
			var wBoxSize = this.getBoxSize();
			if ( wBoxSize.width  > 2 ) wBoxSize.width  = Math.floor(wBoxSize.width  / 2);
			if ( wBoxSize.height > 2 ) wBoxSize.height = Math.floor(wBoxSize.height / 2);

			var wParentPos  = this.getParentPos();
			var wParentSize = this.getParentSize();

			wPoint.x -= wParentPos.left;
			if ( wPoint.x < wBoxSize.width ) wPoint.x = wBoxSize.width;

			wPoint.y -= wParentPos.top;
			if ( wPoint.y < wBoxSize.height ) wPoint.y = wBoxSize.height;

			if ( wParentSize ) {
				if ( wParentSize.width ) {
					if ( wPoint.x > wParentSize.width ) wPoint.x = wParentSize.width - wBoxSize.width;
				}
				if ( wParentSize.height ) {
					if ( wPoint.y > wParentSize.height ) wPoint.y = wParentSize.height - wBoxSize.height;
				}
			}

			// �e�v�f�̃X�N���[���l���Z
			var wMainScroll = this.getParentScroll();
			wPoint.x += wMainScroll.x;
			wPoint.y += wMainScroll.y;

			// �|�C���g�ۑ�
			var wId = pElement.getAttribute('id');
			if ( wId ) {
				this._RelationInfPoints[wId] = wPoint;

			}

			// �e�֕ύX��ʒm
			this.execItemCallback( pEvent, { kind: 'relationLine' } );

		} catch(e) {
			throw { name: 'setLinePoint.' + e.name, message: e.message };

		}
	};

	// ���p�_�ʒu�␳�l�擾
	clsItemRelation.prototype.getLinePointCorrection = function( pPos ) {
		try {
			var wCorrection = { x: 0, y: 0 };

			// ���p�_�\���␳�l�擾
			var wBoxSize	= this.getSize( this.getBoxElement(), { border: false } );
			var wBoxShift	= this.getShiftPos( true, wBoxSize );

			// �ʏ펞���C���� + 1
			wCorrection.x = wBoxShift.x + this._DEF_RELATIONINF_LINE_WIDTH;
			wCorrection.y = wBoxShift.y + this._DEF_RELATIONINF_LINE_WIDTH;
			
			return wCorrection;

		} catch(e) {
			throw { name: 'getLinePointCorrection.' + e.name, message: e.message };

		}
	};

	// ���p�_�ʒu�ݒ�
	clsItemRelation.prototype.setLinePointPos = function( pPos ) {
		try {
			// ���p�_�ʒu��ݒ�
			var wPointEle = this.getBoxElement();
			if ( !wPointEle ) return;

			var wId = wPointEle.getAttribute('id');
			if ( wId ) {
				var wPointPos = {};
				if ( wId in this._RelationInfPoints ) {
					wPointPos.x = this._RelationInfPoints[wId].x;
					wPointPos.y = this._RelationInfPoints[wId].y;
				}

				if ( typeof pPos.x != 'undefined' ) wPointPos.x = pPos.x;
				if ( typeof pPos.y != 'undefined' ) wPointPos.y = pPos.y;

				if ( (typeof wPointPos.x != 'undefined') || (typeof wPointPos.y != 'undefined') ) {
					var wBoxPos		= this.getPosByStyle( wPointEle );
					var wCorrection	= this.getLinePointCorrection();

					if ( typeof wPointPos.x == 'undefined' ) wPointPos.x = wBoxPos.left + wCorrection.x;
					if ( typeof wPointPos.y == 'undefined' ) wPointPos.y = wBoxPos.top  + wCorrection.y;
				}

				this._RelationInfPoints[wId] = wPointPos;

			}

		} catch(e) {
			throw { name: 'setLinePointPos.' + e.name, message: e.message };

		}
	};

	// ���p�_�N���A
	clsItemRelation.prototype.clearLinePoint = function( pEvent, pElement ) {
		try {
			for( var wKey in this._RelationInfPoints ) {
				delete this._RelationInfPoints[wKey];
			}

			this._RelationInfPoints = {};

		} catch(e) {
			throw { name: 'clearLinePoint', message: e.message };

		}
	};


	// **************************************************************
	// �R�����g�v�f
	// **************************************************************

	// �R�����g�\���p�v�f����
	clsItemRelation.prototype.setCmtElement = function( pRelId ) {
		try {
			// �R�����g�ݒ�
			var wCmtHtml  = '';
			var wDivTitle = '';
			var wComment  = this._RelationInfContents.cmt;

			var wLineKind = this.getRelationKind();
			// �֌W�@���̑�
			if ( wLineKind.value == 99 ) {
				wCmtHtml = wComment;

			// �ȊO
			} else {
				wCmtHtml  = wLineKind.name;
				wDivTitle = wComment;

			}

			// �\�����e�ݒ�
			var wCmtEle = this.getBoxElement();
			wCmtEle.innerHTML = wCmtHtml;

			// �\���R�����g�ۑ�
			this._RelationInfHtml = wCmtHtml;

			// �^�C�g���ݒ�
			this.setBoxAttribute( { title: wDivTitle } );

			// �g�ݒ�
			this.setBoxStyle( { 'border-color': this.getRelationColor() } );

			// �R�����g�Ȃ��ꍇ
			if ( String(wCmtHtml).length == 0 ) {
				// ��R�����gclass�ǉ�
				this.setBoxClass('cssItem-relation-nocmt');
				this.setBoxClass('no-print');

			} else {
				// ��R�����gclass�폜
				this.delBoxClass('cssItem-relation-nocmt');
				this.delBoxClass('no-print');

			}

		} catch(e) {
			throw { name: 'setCmtElement.' + e.name, message: e.message };

		}
	};

	// �R�����g�L��
	clsItemRelation.prototype.isComment = function( pRelId ) {
		try {
			if ( this._RelationInfHtml.length > 0 ) {
				return true;

			} else {
				return false;

			}

		} catch(e) {
			throw { name: 'isComment', message: e.message };

		}
	};

	// �֌W�R�����g�\��
	clsItemRelation.prototype.dspRelationCmt = function( pX, pY ) {
		try {
			// �R�����g�ʒu�␳
			var wSize = this.getBoxSize();

			var wPos  = { x: pX, y: pY };

			var wShift  = true;
			var wCenter = true;

			// ���p�_����ꍇ
			if ( this._RelationInfPoints ) {
				for( var wKey in this._RelationInfPoints ) {
					if ( this._RelationInfPoints[wKey] ) {
						wPos.x = this._RelationInfPoints[wKey].x;
						wPos.y = this._RelationInfPoints[wKey].y;

						break;
					}
				}
			}

			// �ʒu�ݒ�
			this.setBoxPos( wPos, { shift: wShift, center: wCenter, size: wSize } );

			// �\��
			this.dspBox(true);

		} catch(e) {
			throw { name: 'dspRelationCmt.' + e.name, message: e.message };
		}
	};

	// �֌W�R�����g��\��
	clsItemRelation.prototype.hideRelationCmt = function() {
		try {
			// ���p�_�폜
			this.clearLinePoint();

			// ��\��
			this.dspBox(false);

		} catch(e) {
			throw { name: 'hideRelationCmt.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// �R�����g�ړ�
	// **************************************************************

	// �R�����g�ړ��C�x���g�@�ǉ�
	clsItemRelation.prototype.addCmtMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.addEvent( this.getBoxWindow(), 'onmousemove'	, this.eventCmtMove );

			// �ʒu�m��
			this.addEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtMoveStop );

		} catch(e) {
			throw { name: 'addCmtMoveEvent.' + e.name, message: e.message };
		}
	};

	// �R�����g�ړ��C�x���g�@�폜
	clsItemRelation.prototype.delCmtMoveEvent = function() {
		try {
			// �}�E�X�Ǐ]
			this.delEvent( this.getBoxWindow(), 'onmousemove'	, this.eventCmtMove );

			// �ʒu�m��
			this.delEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtMoveStop );

		} catch(e) {
			throw { name: 'delCmtMoveEvent.' + e.name, message: e.message };
		}
	};

	// �R�����g�ړ��@�I��������
	clsItemRelation.prototype.cancelCmtMove = function() {
		try {
			// �C�x���g��~
			this.delCmtMoveEvent();

			this._RelationInfCmtMove = null;

			// �őO�ʉ���
			this.setBoxToFront( false );

		} catch(e) {
			throw { name: 'cancelCmtMove.' + e.name, message: e.message };
		}
	};

	// �R�����g�ړ��@�J�n������
	clsItemRelation.prototype.startCmtMove = function( pEvent ) {
		try {
			// ��U�L�����Z��
			this.cancelCmtMove();

			this._RelationInfCmtMove = {};

			// �e�̈ʒu��ۑ�
			this._RelationInfCmtMove.parent = this.getParentPos();

			// �N���b�N�ʒu��ۑ�
			var wEvtPos = this.getEventPos( pEvent );
			var wItmPos = this.getBoxPos();

			this._RelationInfCmtMove.startpos = {};
			this.copyProperty( wEvtPos, this._RelationInfCmtMove.startpos );

			this._RelationInfCmtMove.drag = {
				  left: wEvtPos.x - wItmPos.left
				, top : wEvtPos.y - wItmPos.top
			};

			// �C�x���g�ǉ�
			this.addCmtMoveEvent();

			// �őO�ʕ\��
			this.setBoxToFront( true );

			return true;

		} catch(e) {
			throw { name: 'startCmtMove.' + e.name, message: e.message };
		}
	};

	// �R�����g�ړ�
	clsItemRelation.prototype.moveCmt = function( pPoint ) {
		try {
			var wMovePos = { x: pPoint.x, y: pPoint.y };

			if ( this._RelationInfCmtMove ) {
				if ( this._RelationInfCmtMove.parent ) {
					wMovePos.x -= this._RelationInfCmtMove.parent.left;
					wMovePos.y -= this._RelationInfCmtMove.parent.top;

				}

				if ( this._RelationInfCmtMove.drag ) {
					wMovePos.x -= this._RelationInfCmtMove.drag.left;
					wMovePos.y -= this._RelationInfCmtMove.drag.top;
				}
			}

			// �e�v�f�̃X�N���[���l���Z
			var wMainScroll = this.getParentScroll();
			wMovePos.x += wMainScroll.x;
			wMovePos.y += wMainScroll.y;

			// ��[�A���[�͏����Ȃ�
			if ( wMovePos.x <= 0 ) return false;
			if ( wMovePos.y <= 0 ) return false;

			this.setBoxPos( wMovePos );

			return true;

		} catch(e) {
			throw { name: 'moveCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �C�x���g
	// **************************************************************

	// �C�x���g�L�����Z��
	clsItemRelation.prototype.eventClear = function() {
		try {
			// �ړ��L�����Z��
			this.execFunction( this.cancelCmtMove );

			// �p�����C�x���g�L�����Z������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.eventClear.call( this );

			}

		} catch(e) {
			throw { name: 'clsItemRelation.eventClear', message: e.message };
		}
	};

	// ���ڍX�V���ʒm
	// �� clsItemBox����p��
	clsItemRelation.prototype.execItemCallback = function( pEvent, pParam ) {
		try {
			// KEY�ݒ�
			pParam.key = this._RelationInfMaster.key;

			// �p�����@���ڍX�V���ʒm
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execItemCallback.call( this, pEvent, pParam );

			}

		} catch(e) {
			throw { name: 'clsItemRelation.execItemCallback', message: e.message };
		}
	};

	// �R���e�L�X�g���j���[�g�p�L���ݒ�
	// �� clsItemBox����p��
	clsItemRelation.prototype.setContextAvailable = function( pAvailable, pParam ) {
		try {
			// �p�����@�R���e�L�X�g���j���[�g�p�L���ݒ�
			if ( this._ItemPrototype ) {
				this._ItemPrototype.setContextAvailable.call( this, pAvailable, pParam );

			}

			// �h���b�O�����̂ݏ���
			if ( !this.getItemDragIs() ) return;

			// �R�����g�h���b�O��
			this._RelationInfCmtDrag = pAvailable;

			// drag�ۃp�����[�^����
			var wDragParam = false;
			if ( this.isObject(pParam) ) {
				if ( 'drag' in pParam ) wDragParam = true;
			}

			if ( wDragParam ) {
				// �p�����[�^�l���g�p
				this._RelationInfCmtDrag = pParam.drag;

			// �p�����[�^�Ȃ�
			} else {
				// ���j���[�L����
				if ( pAvailable ) {
					// �ʏ펞�h���b�O�ۂ�ݒ�
					this._RelationInfCmtDrag = this.getItemMoveInitIs();

				}
			}


		} catch(e) {
			throw { name: 'setContextAvailable', message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// -------------------
	// ���j���[�֘A
	// -------------------

	// ���j���[�����ݒ�
	clsItemRelation.prototype.initItemMenu = function( pArgument ) {
		try {
			// �p�������j���[����������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// ���ڃ��b�N�������s�v
			if ( this.getItemLockIs() ) return;

			// �R�����g�h���b�O����
			if ( this.getItemDragIs() ) {
				this.addBoxEvents( 'onmousedown'	, this.eventCmtMoveStart );
			}

		} catch(e) {
			throw { name: 'clsItemRelation.initItemMenu.' + e.name, message: e.message };
		}
	};


	// -------------------
	// ��{���֘A
	// -------------------

	// �X�e�[�^�X�����ݒ�
	clsItemRelation.prototype.initItemStatus = function( pArgument ) {
		try {
			// �p�����X�e�[�^�X�X�V������
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// Load���@�ݒ���e
			var wLoadContents = this.loadDataVal( 'contents' );
			if ( wLoadContents ) {
				this._RelationInfContents = wLoadContents;

			} else {
				// �����l�ݒ�
				this.copyProperty( this._DEF_RELATIONINF_CONTENTS, this._RelationInfContents );

			}

			// Load���@���p�_
			var wLoadRelay = this.loadDataVal( 'relay' );
			if ( wLoadRelay ) {
				this._RelationInfPoints = wLoadRelay;
			}

			// �p�����[�^�ݒ�
			if ( this.isObject(pArgument) ) {
				// �����v�f���
				if ( pArgument.master ) {
					for( var wMstKey in pArgument.master ) {
						this._RelationInfMaster[wMstKey] = pArgument.master[wMstKey];
					}

				}

				// �ύX�������l
				for( var wKey in pArgument ) {
					// �֌W���
					if ( wKey in this._RelationInfContents ) {
						// �l�㏑��
						this._RelationInfContents[wKey] = pArgument[wKey];
					}
				}

			}

			// �֌W��ʏ����ݒ�
			var wDefKind;
			var wRelKind = this._RelationInfContents['relKind'];
			if ( wRelKind == 'item-group' ) {
				wDefKind = this._DEF_RELATIONINF_LIST_KIND_GROUP;
			
			} else {
				wDefKind = this._DEF_RELATIONINF_LIST_KIND;

			}
			this._RelationInfKind = wDefKind;

			// �����h���b�O�ہi�����ړ��@���@�h���b�O�j
			this._RelationInfCmtDrag = ( this.getItemMoveInitIs() && this.getItemDragIs() );

		} catch(e) {
			throw { name: 'clsItemRelation.initItemStatus.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD�֘A
	// -------------------

	// �f�[�^�ۑ��p�@���ڐݒ�l�擾
	clsItemRelation.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// �p�������ڐݒ�l�擾����
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// �����v�f
			wSaveData.master	= JSON.stringify( this._RelationInfMaster );

			// �ݒ���e
			wSaveData.contents	= JSON.stringify( this._RelationInfContents );

			// ���p�_
			wSaveData.relay		= JSON.stringify( this._RelationInfPoints );
			
			// �ݒ�l���擾
			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemRelation.saveData', message: e.message };
		}
	};

	// �f�[�^�Ǎ�
	clsItemRelation.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// �p�����f�[�^�Ǎ�����
			if ( this._ItemPrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// �����v�f
			if ( pLoadData.master ) {
				wLoadBuff.master = JSON.parse( pLoadData.master );
			}

			// �ݒ���e
			if ( pLoadData.contents ) {
				wLoadBuff.contents = JSON.parse( pLoadData.contents );

			} else {
				wLoadBuff.contents = {};
				this.copyProperty( this._DEF_RELATIONINF_CONTENTS, wLoadBuff.contents );
				for( var wKey in pLoadData ) {
					if ( wKey in wLoadBuff.contents ) wLoadBuff.contents[wKey] = pLoadData[wKey];
				}

			}
			
			// ���p�_
			if ( pLoadData.relay ) {
				wLoadBuff.relay = JSON.parse( pLoadData.relay );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemRelation.loadData', message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsItemRelation.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_RELATIONINF_STYLE );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁurelation�v
				wInitArgument.kind = this._DEF_RELATIONINF_KIND;

			}

			// ���j���[�ݒ�
			wInitArgument.menuList		= this._DEF_RELATIONINF_MENU_CONTEXT;
			wInitArgument.menuReplace	= true;

			// �p�����R���X�g���N�^
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsItemRelation.initClass', message: e.message };
		}
	};

	// �f�X�g���N�^
	clsItemRelation.prototype.freeClass = function() {
		try {
			// �C�x���g�폜
			this.execFunction( this.delCmtMoveEvent );

			// �v���p�e�B�J��
			this._RelationInfContents		= null;
			this._RelationInfPoints			= null;
			this._RelationInfKind			= null;
			this._RelationInfCmtMove		= null;
			this._RelationInfMaster			= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
