
// --------------------------------------------------------------------
//
// �}�E�X�Ǐ]�R�����g�N���X
//
// --------------------------------------------------------------------
// clsMouseCmt �� clsBaseBox
// --------------------------------------------------------------------
var clsMouseCmt = function( pArgument ) {
	try {
		var self = this;

		this._DEF_MOUSECMT_KIND			= 'comment';

		this._DEF_MOUSECMT_PROPERTY		= {
			 'z-index'				: '5000'
		};

		this._DEF_MOUSECMT_CHR_WIDTH	= 12;
		this._DEF_MOUSECMT_CHR_HEIGHT	= 12;
		this._DEF_MOUSECMT_LEFT			= 15;
		this._DEF_MOUSECMT_TOP			= 5;

		// �p�����N���X��prototype
		this._BasePrototype				= null;

		// ���N���X�̃v���p�e�B
		this._MouseCmtDsp				= false;
		this._MouseCmtStop				= false;
		this._MouseCmtPos				= { left: 0, right: 0, top: 0, bottom: 0 };


		// **************************************************************
		// �C�x���g����
		// **************************************************************

		// �R�����g�ړ�
		this.eventMouseCmtMove = function( pEvent ) {
			try {
				if ( !self._MouseCmtDsp ) return true;
				if ( !pEvent ) return true;

				var wCmtEle = self.getBoxElement()
				if ( !wCmtEle ) return true;

				var wPoint	= self.getEventPos( pEvent );
				var wCmtPos	= self.getMouseCmtPos( wPoint );

				wCmtEle.style.left	= wCmtPos.left + "px";
				wCmtEle.style.top	= wCmtPos.top  + "px";
			
				// �ꎞ��\����
				if ( self._MouseCmtStop ) {
					self.dspBox( true );
					self._MouseCmtStop = false;

				}

			} catch(e) {}

			return true;
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
		throw { name: 'clsMouseCmt.' + e.name, message: e.message };
	}
};

// �}�E�X�Ǐ]�R�����g prototype
(function(){
	// clsBaseBox�̃v���g�^�C�v���p��
	clsInheritance( clsMouseCmt, clsBaseBox );

	// **************************************************************
	// �R�����g�\��
	// **************************************************************

	// �R�����g�T�C�Y�擾
	clsMouseCmt.prototype.getCmtSize = function( pComment ) {
		try {
			var wRetSize = { width: 160, height: 16 };
			
			var wCmtVal = '';
			if ( pComment) wCmtVal = String(pComment);

			if ( wCmtVal.length > 0 ) {
				var wCmtAry = wCmtVal.toLowerCase().split( '<br>' );
				var wCol = 0;
				var wRow = wCmtAry.length;
				for( var wIdx=0; wIdx < wCmtAry.length; wIdx++ ) {
					if ( wCol < wCmtAry[wIdx].length ) wCol = wCmtAry[wIdx].length;
				}
				
				wRetSize.width	= wCol * this._DEF_MOUSECMT_CHR_WIDTH;
				wRetSize.height	= wRow * this._DEF_MOUSECMT_CHR_HEIGHT;

			}
			return wRetSize;

		} catch(e) {
			throw { name: 'getCmtSize.' + e.name, message: e.message };
		}
	};

	// �\���R�����g�ݒ�
	clsMouseCmt.prototype.getMouseCmtPos = function( pMousePos ) {
		try {
			var wCmtPos = { left: 0, top: 0 };

			// �e�̈ʒu�ݒ�
			var wParentPos = this.getParentPos();
			
			wCmtPos.left	= pMousePos.x - wParentPos.left;
			wCmtPos.top		= pMousePos.y - wParentPos.top;

			// �X�N���[���l���Z
			var wParentScroll = this.getParentScroll();
			wCmtPos.left	+= wParentScroll.x;
			wCmtPos.top		+= wParentScroll.y;

			wCmtPos.left	+= this._DEF_MOUSECMT_LEFT;
			wCmtPos.top		+= this._DEF_MOUSECMT_TOP;

			return wCmtPos;

		} catch(e) {
			throw { name: 'getMouseCmtPos.' + e.name, message: e.message };
		}
	};

	// �\���R�����g�ݒ�
	clsMouseCmt.prototype.setMouseCmt = function( pStartPos, pComment ) {
		try {
			var wCmtEle = this.getBoxElement();
			if ( !wCmtEle ) return true;

			if ( typeof pComment == 'string' ) {
				// �T�C�Y�ݒ�
				var wCmtSize = this.getCmtSize( pComment );
				wCmtEle.style.width  = wCmtSize.width  + "px";
				wCmtEle.style.height = wCmtSize.height + "px";
				
				// �R�����g�ݒ�
				wCmtEle.innerHTML = pComment;
			}
			if ( String(wCmtEle.innerHTML).length == 0 ) return true;

			// �\���ʒu�w��
			if ( pStartPos ) {
				// �e�̈ʒu�ݒ�
				var wCmtPos = this.getMouseCmtPos( pStartPos );

				wCmtEle.style.left	= wCmtPos.left + "px";
				wCmtEle.style.top	= wCmtPos.top  + "px";

			}
			return true;

		} catch(e) {
			throw { name: 'setMouseCmt.' + e.name, message: e.message };
		}
	};

	// �R�����g�\��
	clsMouseCmt.prototype.dspMouseCmt = function( pStPos, pComment ) {
		try {
			// �R�����g�ݒ�
			this.setMouseCmt( pStPos, pComment );

			// �\��
			this.dspBox( true );

			this._MouseCmtDsp = true;

		} catch(e) {
			throw { name: 'dspMouseCmt.' + e.name, message: e.message };
		}
	};

	// �R�����g��\��
	clsMouseCmt.prototype.hideMouseCmt = function() {
		try {
			// �R�����g��\��
			this.dspBox( false );

			this._MouseCmtDsp = false;

		} catch(e) {
			throw { name: 'hideMouseCmt.' + e.name, message: e.message };
		}
	};

	// �R�����g�ꎞ��\��
	clsMouseCmt.prototype.stopMouseCmt = function() {
		try {
			// �R�����g�\���ꎞ��~
			this.dspBox( false );

			this._MouseCmtStop = true;

		} catch(e) {
			throw { name: 'hideMouseCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// �p�����\�b�h
	// **************************************************************

	// �R���X�g���N�^
	clsMouseCmt.prototype.initClass = function( pArgument ) {
		try {
			// �v���p�e�B�ݒ�
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_MOUSECMT_PROPERTY );

			// ��ʁupanel�v
			wInitArgument.kind = this._DEF_MOUSECMT_KIND;

			// �p�����R���X�g���N�^
			if ( this._BasePrototype ) {
				this._BasePrototype.initClass.call( this, wInitArgument );

			}

			// class�ݒ�
			this.setBoxClass( 'cssMouseCmt' );

			// �}�E�X�ɒǏ]
			var wParentEle = this.getParent();
			if ( wParentEle ) {
				this.addEvent( wParentEle, 'onmousemove'	, this.eventMouseCmtMove );
			}

		} catch(e) {
			throw { name: 'clsMouseCmt.initClass.' + e.name, message: e.message };
		}
	};

	// �f�X�g���N�^
	clsMouseCmt.prototype.freeClass = function() {
		try {
			// �C�x���g�폜
			var wParentEle = this.getParent();
			if ( wParentEle ) {
				this.execFunction( this.delEvent, wParentEle, 'onmousemove', this.eventMouseCmtMove );
			
			}

			// �v���p�e�B�J��
			this._MouseCmtPos		= null;

			// �p�����f�X�g���N�^
			// ���p�����f�X�g���N�^�͍Ō��call����
			if ( this._BasePrototype ) {
				this._BasePrototype.freeClass.call( this );

			}
			this._BasePrototype		= null;

		} catch(e) {}
	};
}());
