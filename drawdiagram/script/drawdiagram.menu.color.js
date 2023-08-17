// --------------------------------------------------------------------
//
// �J���[�p���b�g�\���N���X
//
// --------------------------------------------------------------------
// clsColorBox �� clsMenuBase �� clsBaseBox
// --------------------------------------------------------------------
var clsColorBox = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MENU_COLOR_KIND		= 'menu-color';

		this._DEF_MENU_COLOR_PROPERTY	= {
			 'z-index'				: '4100'
		};

		// ���j���[��style
		this._DEF_MENU_COLOR_LIST_PROPERTY = {
			 'z-index'				: '4110'
		};

		// �p�����N���X��prototype
		this._MenuPrototype				= null;

		this._ColorList = [
			 [ '#FFFFFF', '#BBBBBB', '#888888', '#444444', '#000000' ]
			,[ '#FFFFEE', '#FFFFAA', '#FFFF77', '#FFFF33', '#FFFF00' ]
			,[ '#EEFFFF', '#AAFFFF', '#77FFFF', '#33FFFF', '#00FFFF' ]
			,[ '#FFEEFF', '#FFAAFF', '#FF77FF', '#FF33FF', '#FF00FF' ]
			,[ '#FFEEEE', '#FFAAAA', '#FF7777', '#FF3333', '#FF0000' ]
			,[ '#EEEEFF', '#AAAAFF', '#7777FF', '#3333FF', '#0000FF' ]
			,[ '#EEFFEE', '#AAFFAA', '#77FF77', '#33FF33', '#00FF00' ]
			,[ '#FF0000', '#CC0000', '#990000', '#550000', '#220000' ]
			,[ '#00FF00', '#00CC00', '#009900', '#005500', '#002200' ]
			,[ '#0000FF', '#0000CC', '#000099', '#000055', '#000022' ]
		];

		this._ColorContents				= {};
		this._ColorElement				= [];

		// **************************************************************
		// �C�x���g����
		// **************************************************************
		
		// �F�I�����C�x���g
		this.eventColorClick = function( pEvent ) {
			try {
				// �C�x���g��~
				self.cancelEvent( pEvent, true );

				// �I��v�f�̐F���擾
				var wSelectColor = self.getColorInf( this );

				// ����
				self.hideMenu();

				// ���j���[�ďo���̊֐���call
				if ( wSelectColor ) {
					self.execCallBack( pEvent, { kind: 'select', color: wSelectColor.color } );

				} else {
					self.execCallBack( pEvent, { kind: 'close' } );

				}

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
		throw { name: 'clsColorBox.' + e.name, message: e.message };
	}
};


// ��{���j���[ prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsColorBox, clsMenuBase );

	// **************************************************************
	// �v���p�e�B�ݒ�^�擾
	// **************************************************************

	// �F���X�g�ݒ�
	clsColorBox.prototype.setColorList = function( pColorAry ) {
		try {
			if ( !pColorAry ) return false;
			if ( !this.isArray(pColorAry) ) return false;

			this._ColorList = pColorAry;
			return true;

		} catch(e) {
			throw { name: 'setColorList', message: e.message };
		}
	};

	// �v�f�̐F�擾
	clsColorBox.prototype.getColorInf = function( pElement ) {
		try {
			if ( !pElement ) return null;

			var wId = pElement.id;
			if ( !wId ) return null;

			var wContents = this._ColorContents[wId];
			if ( !wContents ) return null;
			
			return wContents;

		} catch(e) {
			throw { name: 'getColorInf', message: e.message };
		}
	};


	// **************************************************************
	// ���j���[�쐬
	// **************************************************************

	// �J���[BOX�v�f����
	clsColorBox.prototype.addColorElement = function( pIdx, pColor, pFloat ) {
		try {
			var wId  = this.getBoxId() + '_color_' + String(pIdx);
			var wDivEle = this.addElement( 'div', wId );
			if ( !wDivEle ) return false;

			// style�ݒ�
			this.addClass( wDivEle, 'cssMenuColor-box' );
			this.setStyle( wDivEle, this._DEF_MENU_COLOR_LIST_PROPERTY );
			wDivEle.style['background-color'] = pColor;
			
			if ( !pFloat ) {
				wDivEle.style['clear']	= 'left';
			}

			// ���j���[�֒ǉ�
			this.appendBoxToParent( wDivEle );

			// click�C�x���g�ݒ�
			this.addEvent( wDivEle, 'onclick', this.eventColorClick );

			// ���ۑ�
			this._ColorContents[wId] = { index: pIdx, color: pColor };
			this._ColorElement.push( wDivEle );
			
			return true;

		} catch(e) {
			throw { name: 'addColorElement.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p���Ώۃ��\�b�h
	// **************************************************************

	// ���j���[�v�f�������ݒ�
	clsColorBox.prototype.createMenu = function() {
		try {
			if ( !this._ColorList ) return false;
			if ( !this.isArray(this._ColorList) ) return false;

			var wColorCol;
			var wCnt = 0;
			for( var i = 0; i < this._ColorList.length; i++ ) {
				wColorCol = this._ColorList[i];
				if ( typeof wColorCol === 'string' ) {
					if ( this.addColorElement(wCnt, wColorCol, false) ) {
						wCnt++;
					}

				} else {
					var wFloat = false;
					for( var j = 0; j < wColorCol.length; j++ ) {
						if ( this.addColorElement(wCnt, wColorCol[j], wFloat) ) {
							wFloat = true;
							wCnt++;
						}
					}
				}
				
			}

			// �p���������ݒ�
			if ( this._MenuPrototype ) {
				this._MenuPrototype.createMenu.call( this );

			}

		} catch(e) {
			throw { name: 'clsColorBox.createMenu' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h�i�R���X�g���N�^�^�f�X�g���N�^�j
	// **************************************************************

	// �R���X�g���N�^
	clsColorBox.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MENU_COLOR_PROPERTY );

			// ��ʖ��ݒ莞
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// ��ʁumenu-color�v
				wInitArgument.kind = this._DEF_MENU_COLOR_KIND;
			}

			// ���j���[���e�ݒ�
			if ( pArgument ) {
				// �F���X�g�w�莞
				if ( typeof pArgument.colorList !== 'undefined' ) {
					this.setColorList(pArgument.colorList);
				}

			}

			// �p�����R���X�g���N�^
			if ( this._MenuPrototype ) {
				this._MenuPrototype.initClass.call( this, wInitArgument );

			}

		} catch(e) {
			throw { name: 'clsColorBox.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsColorBox.prototype.freeClass = function() {
		try {
			// �v���p�e�B�J��
			var wColor;
			for( var wIdx = 0; wIdx < this._ColorElement.length; wIdx++ ) {
				wColor = this._ColorElement[wIdx];
				if ( !wColor ) continue;

				this.execFunction( this.delEvent, wColor, 'onclick', this.eventColorClick );
				this._ColorElement[wIdx] = null;
			}

			this._ColorContents		= null;
			this._ColorElement		= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._MenuPrototype ) {
				this._MenuPrototype.freeClass.call( this );

			}
			this._MenuPrototype		= null;

		} catch(e) {}
	};

}());
