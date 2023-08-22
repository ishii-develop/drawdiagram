
// --------------------------------------------------------------------
//
// 関係情報クラス
//
// --------------------------------------------------------------------
// clsItemRelation ← clsItemBox ← clsBaseBox
// --------------------------------------------------------------------
var clsItemRelation = function( pArgument ) {
	try {
		var self = this;

		this._DEF_RELATIONINF_KIND				= 'item-relation';

		this._DEF_RELATIONINF_STYLE				= {
				  'z-index'				: '310'
			};

		// 中継点ライン幅（通常時）
		this._DEF_RELATIONINF_LINE_WIDTH		= 1;

		// ----------------------------------
		// メニュー設定
		// ----------------------------------
		this._DEF_RELATIONINF_MENU_CONTEXT		= {
			  2: [
				  { kind: 'relation'	, title: '関連付け'		}
				, { kind: 'relationChg'	, title: '関連変更'		}
				, { kind: 'unrelation'	, title: '関連解除'		}
			 ]
			, 3: [
				  { kind: 'color'		, title: '色変更'		}
			  ]
		};


		// ----------------------------------
		// 関係情報
		// ----------------------------------

		this._DEF_RELATIONINF_LIST_STAT			= [
				  { value: 1, name: '通常'			, width: 1	, style: 'normal'	}
				, { value: 2, name: '強い結びつき'	, width: 3	, style: 'normal'	}
				, { value: 3, name: '希薄な関係'	, width: 2	, style: 'dash'		}
				, { value: 4, name: '対立'			, width: 1	, style: 'stripe'	}
		];

		this._DEF_RELATIONINF_LIST_KIND			= [
				  { value: 99, name: ''				, color: '#000000'	, icon : ''	}
				, { value: 10, name: '離婚'			, color: '#FF9900'	, icon : 'icon_stat_divorce.png'	}
				, { value: 20, name: '別居'			, color: '#FF99CC'	, icon : 'icon_stat_separation.png'	}
		];

		this._DEF_RELATIONINF_LIST_KIND_GROUP	= [
				  { value: 99, name: ''				, color: '#000000'	}
				, { value:  1, name: '親子'			, color: '#339900'	}
				, { value: 30, name: '親族'			, color: '#00CC00'	}
				, { value: 31, name: '敵対'			, color: '#FF0000'	}
		];

		this._DEF_RELATIONINF_LIST_WAY			= [
				  { value: 0, name: 'なし'				}
				, { value: 1, name: '正方向'			}
				, { value: 2, name: '逆方向'			}
				, { value: 3, name: '双方向'			}
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

		// 継承元クラスのprototype
		this._ItemPrototype						= null;

		// 関係情報
		this._RelationInfMaster					= { parent: '', target: '', key: '' };
		this._RelationInfContents				= {};
		this._RelationInfKind					= null;

		// コメント情報
		this._RelationInfCmtMove				= null;
		this._RelationInfHtml					= '';
		this._RelationInfCmtDrag				= true;

		// 中継点
		this._RelationInfPoints					= {};
		
		// 状態設定
		this._RelationInfStatus					= { kind: '', size: null, sizeH: null };
		this._RelationInfStatusItem				= null;


		// **************************************************************
		// コメントイベント
		// **************************************************************

		// コメント移動　開始
		this.eventCmtMoveStart = function( pEvent ) {
			try {
				// コメントドラッグ許可時のみ処理
				if ( !self._RelationInfCmtDrag ) return true;

				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				// 左クリックのみ有効
				var wClick = self.getEventClick( pEvent );
				if ( wClick.left ) {
					// 移動開始
					self.startCmtMove( pEvent );
				}

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};

		// コメント移動　移動中
		this.eventCmtMove = function( pEvent ) {
			try {
				if ( !self._RelationInfCmtMove ) return false;

				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				// コメント移動
				var wPoint = self.getEventPos( pEvent );
				self.moveCmt( wPoint );

			} catch(e) {
				self.execFunction( self.cancelCmtMove );
				self.catchErrorDsp(e);
			}
			return false;
		};

		// コメント移動　終了
		this.eventCmtMoveStop = function( pEvent ) {
			try {
				// イベント停止
				self.execFunction( self.cancelEvent, pEvent, true );

				if ( self._RelationInfCmtMove ) {
					// 移動先チェック
					var wStayFlg = false;
					
					// 開始位置と同じなら処理なし
					var wStPos = self._RelationInfCmtMove.startpos;
					if ( self.isObject(wStPos) ) {
						var wEvtPos = self.getEventPos( pEvent );
						if ( (wEvtPos.x == wStPos.x) && (wEvtPos.y == wStPos.y) ) wStayFlg = true;
					}

					if ( !wStayFlg ) {
						// 移動先保存
						self.setLinePoint( pEvent, self.getBoxElement() );
					
					}
				
				}

				// 移動終了
				self.cancelCmtMove();

			} catch(e) {
				self.catchErrorDsp(e);
			}
			return false;
		};


		// **************************************************************
		// コンストラクタ
		// **************************************************************
		// 親クラスのprototypeを保存
		this._ItemPrototype = clsItemBox.prototype;

		// 親クラスのconstructor
		// ※継承した「initClass」がcallされる
		clsItemBox.call( this, pArgument );

	} catch(e) {
		throw { name: 'clsItemRelation.' + e.name, message: e.message };
	}
};

// 関係情報 prototype
(function(){
	// clsItemBoxのプロトタイプを継承
	clsInheritance( clsItemRelation, clsItemBox );


	// **************************************************************
	// 規定値取得
	// **************************************************************

	// 規定値取得　種別
	clsItemRelation.prototype.getDefStat = function() {
		try {
			return this._DEF_RELATIONINF_LIST_STAT;

		} catch(e) {
			throw { name: 'getDefStat', message: e.message };
		}
	};

	// 規定値取得　関係
	clsItemRelation.prototype.getDefKind = function( pValue ) {
		try {
			// 値指定時
			if ( typeof pValue !== 'undefined' ) {
				var wRelKind = this._RelationInfKind[0];

				for( var wIdx=0; wIdx < this._RelationInfKind.length; wIdx++ ) {
					if ( this._RelationInfKind[wIdx].value == pValue ) {
						wRelKind = this._RelationInfKind[wIdx];
						break;
					}
				}
				return wRelKind;
			
			// 値未指定時は全て
			} else {
				return this._RelationInfKind;

			}

		} catch(e) {
			throw { name: 'getDefKind', message: e.message };
		}
	};

	// 規定値取得　働きかけ（方向）
	clsItemRelation.prototype.getDefWay = function() {
		try {
			return this._DEF_RELATIONINF_LIST_WAY;

		} catch(e) {
			throw { name: 'getDefWay', message: e.message };
		}
	};

	// 規定値取得　外枠の幅
	clsItemRelation.prototype.getDefLineWidth = function() {
		try {
			return this._DEF_RELATIONINF_LINE_WIDTH;

		} catch(e) {
			throw { name: 'getDefLineWidth', message: e.message };
		}
	};


	// **************************************************************
	// プロパティ設定/取得
	// **************************************************************

	// 設定値取得（複写）
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

	// 設定値更新
	clsItemRelation.prototype.setContents = function( pContents ) {
		try {
			for( var wKey in pContents ) {
				// 関係状態設定時
				if ( wKey == 'rel' ) {
					// 関係状態設定
					this.setStatusItem( pContents[wKey] );

				}

				this._RelationInfContents[wKey] = pContents[wKey];
			}

		} catch(e) {
			throw { name: 'setContents', message: e.message };
		}
	};

	// 関係　設定／取得
	clsItemRelation.prototype.setRelation = function( pRelation ) {
		try {
			// 関係状態設定
			this.setStatusItem( pRelation );

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

	// 関係　アイコン取得
	clsItemRelation.prototype.getStatusIcon = function( pStatusId ) {
		try {
			var wIconFile = '';

			for( var wIdx=0; wIdx < this._DEF_RELATIONINF_LIST_KIND.length; wIdx++ ) {
				if ( String(pStatusId) == String(this._DEF_RELATIONINF_LIST_KIND[wIdx].value) ) {
					wIconFile = this._DEF_RELATIONINF_LIST_KIND[wIdx].icon;
					break;
				}

			}
			
			return wIconFile;

		} catch(e) {
			throw { name: 'getStatusIcon', message: e.message };
		}
	};

	// 関係　状態項目有無
	clsItemRelation.prototype.isRelationStat = function() {
		try {
			if ( !this._RelationInfStatusItem ) return false;
			if ( !this._RelationInfStatus.kind ) return false;

			return true;

		} catch(e) {
			throw { name: 'isRelationStat', message: e.message };
		}
	};

	// 関係　状態項目サイズ
	clsItemRelation.prototype.getRelationStatSize = function() {
		try {
			if ( !this.isRelationStat() ) return null;

			return this._RelationInfStatus.size;

		} catch(e) {
			throw { name: 'getRelationStatSize', message: e.message };
		}
	};

	clsItemRelation.prototype.getRelationStatSizeH = function() {
		try {
			if ( !this.isRelationStat() ) return null;

			return this._RelationInfStatus.sizeH;

		} catch(e) {
			throw { name: 'getRelationStatSizeH', message: e.message };
		}
	};

	// 関係種別　設定／取得
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

	// 働きかけ方向　設定／取得
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

	// コメント　設定／取得
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

	clsItemRelation.prototype.getCommentSize = function() {
		try {
			if ( !this._RelationInfContents.cmtSize ) return null;

			return this._RelationInfContents.cmtSize;

		} catch(e) {
			throw { name: 'getCommentSize', message: e.message };
		}
	};

	clsItemRelation.prototype.isComment = function() {
		try {
			if ( !this._RelationInfContents.cmt ) return 0;

			var wComLen = String(this._RelationInfContents.cmt).length;
			return ( wComLen > 0 );

		} catch(e) {
			throw { name: 'isComment', message: e.message };
		}
	};

	// 色　設定／取得
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
	// 関係状態設定
	// **************************************************************

	// 関係状態設定時　関係状態項目設定
	clsItemRelation.prototype.setStatusItem = function( pStatus ) {
		try {
			var wStatId = String(pStatus);

			// 状態　アイコン設定
			switch( wStatId ) {
			// 離婚
			case '10':
			// 別居
			case '20':
				// 関係状態　項目追加
				this.addStatusItem( wStatId );
				break;

			default:
				// 関係状態クリア
				this.clearStatusItem();
			}

		} catch(e) {
			throw { name: 'clearStatusItem', message: e.message };
		}
	};

	// 関係状態項目設定
	clsItemRelation.prototype.addStatusItem = function( pStatuId ) {
		try {
			if ( !this._RelationInfStatus ) this._RelationInfStatus = {};

			// 設定済なら処理なし
			var wKind = this._RelationInfStatus.kind;
			if ( wKind == pStatuId ) return;

			// 項目未作成
			if ( !this._RelationInfStatusItem ) {
				// 項目作成
				var wAddItem = this.createStatusItem();
				if ( !wAddItem ) retrun;

				// 項目保存
				this._RelationInfStatusItem = wAddItem;

				// 項目サイズ保存
				this._RelationInfStatus.size = this.getSize( wAddItem );

				// 配置補正値保存
				var wHw = Math.floor( this._RelationInfStatus.size.width / 2 );
				var wHh = Math.floor( this._RelationInfStatus.size.height / 2 );
				this._RelationInfStatus.sizeH = {
					  width		: wHw
					, height	: wHh
				};

			}

			// 項目のアイコン変更
			var wIconFile = this.getStatusIcon( pStatuId );
			if ( String(wIconFile).length > 0 ) {
				var wImgPath = this.getImagePath();
				var wBackGround = "url(" + wImgPath + wIconFile + ")";

				this.setStyle( this._RelationInfStatusItem, { 'background-image': wBackGround } );

			}
			this._RelationInfStatus.kind = pStatuId;

		} catch(e) {
			throw { name: 'addStatusItem', message: e.message };
		}
	};

	// 関係状態項目作成
	clsItemRelation.prototype.createStatusItem = function( ) {
		try {
			// ユニークID設定
			var wItemId = this.getBoxId() + '_kind';

			// 要素生成
			var wAddEle = this.addElement( 'div', wItemId );
			if ( !wAddEle ) return null;

			// 一旦非表示
			this.setStyle( wAddEle, { display: 'none' } );

			this.addClass( wAddEle, 'cssItem-relation-kind' );

			// 親要素へ追加
			this.appendElementToParent( this.getParent(), wAddEle );

			return wAddEle;

		} catch(e) {
			throw { name: 'createStatusItem', message: e.message };
		}
	};

	// 関係状態項目削除
	clsItemRelation.prototype.delStatusItem = function( ) {
		try {
			if ( !this._RelationInfStatus ) return;
			if ( !this._RelationInfStatusItem ) return;

			// 要素削除
			this.delElement( this._RelationInfStatusItem );

			this._RelationInfStatusItem = null;

		} catch(e) {
			throw { name: 'delStatusItem', message: e.message };
		}
	};

	// 関係状態クリア
	clsItemRelation.prototype.clearStatusItem = function( ) {
		try {
			if ( this._RelationInfStatusItem ) {
				this.setStyle( this._RelationInfStatusItem, { 'display': 'none' } );
			}

			this._RelationInfStatus.kind = '';

		} catch(e) {
			throw { name: 'clearStatusItem', message: e.message };
		}
	};

	// 関係状態項目表示
	clsItemRelation.prototype.dspStatusItem = function( pStatPos ) {
		try {
			if ( !this._RelationInfStatus.kind ) return;
			if ( !this._RelationInfStatusItem ) return;

			// 表示位置未指定時は表示なし
			if ( !pStatPos ) {
				this.setStyle( this._RelationInfStatusItem, { display: 'none' } );
				return;

			}

			// 配置中心点取得
			var wItmPos = Object.create( pStatPos );

			// コメントサイズ補正
			if ( this._RelationInfStatus.sizeH ) {
				wItmPos.left -= this._RelationInfStatus.sizeH.width;
				wItmPos.top  -= this._RelationInfStatus.sizeH.height;
			}

			var wStyle = {
				  left		: wItmPos.left + 'px'
				, top		: wItmPos.top  + 'px'
				, display	: ''
			};

			// 角度調整
			// ※ アイコンのラインと関係ラインが重ならないようにする
			if ( 'deg' in pStatPos ) {
				var wRotate = 0;
				// 離婚
				if ( this._RelationInfStatus.kind == '10' ) {
					if ( pStatPos.deg < -45 ) {
						wRotate = ( 90 - Math.abs(pStatPos.deg) );
					} else if ( pStatPos.deg < 0 ) {
						wRotate = pStatPos.deg;
					}

				// 別居
				} else if ( this._RelationInfStatus.kind == '20' ) {
					if ( pStatPos.deg > 0 ) {
						if ( pStatPos.deg < 45 ) {
							wRotate = Math.abs(pStatPos.deg);
						} else if ( pStatPos.deg < 75 ) {
							wRotate = -30;
						}
					}
				}

				wStyle.transform = 'rotate(' + wRotate + 'deg)';
			}

			// 表示
			this.setStyle( this._RelationInfStatusItem, wStyle );

		} catch(e) {
			throw { name: 'dspStatusItem', message: e.message };
		}
	};


	// **************************************************************
	// 関係情報取得
	// **************************************************************

	// 種別取得
	clsItemRelation.prototype.getRelationKind = function() {
		try {
			// 選択された関係取得
			var wRelation = this._RelationInfContents.rel;
			
			var wRelKind = this.getDefKind( wRelation );

			return wRelKind;

		} catch(e) {
			throw { name: 'getRelationKind.' + e.name, message: e.message };
		}
	};

	// 色取得
	clsItemRelation.prototype.getRelationColor = function() {
		try {
			var wColor = this._RelationInfContents.color;
			if ( typeof wColor != 'string' ) wColor = 'black';

			return wColor;

		} catch(e) {
			throw { name: 'getRelationColor', message: e.message };
		}
	};

	// 関連情報から描画情報取得
	clsItemRelation.prototype.toLineKind = function( ) {
		try {
			var wRetLineKind = Object.create( this._DEF_RELATIONINF_LINE );

			// 状態取得
			var wStatus = this._RelationInfContents.stat;
			for( var wIdx=0; wIdx < this._DEF_RELATIONINF_LIST_STAT.length; wIdx++ ) {
				if ( String(wStatus) == String(this._DEF_RELATIONINF_LIST_STAT[wIdx].value) ) {
					wRetLineKind.width = this._DEF_RELATIONINF_LIST_STAT[wIdx].width;
					wRetLineKind.style = this._DEF_RELATIONINF_LIST_STAT[wIdx].style;
					break;
				}

			}

			// 働きかけ方向
			wRetLineKind.way = this._RelationInfContents.way;

			// 色設定
			var wColor = this.getRelationColor();
			wRetLineKind.color = wColor;

			// 中継点
			wRetLineKind.point = {};
			this.copyProperty( this._RelationInfPoints, wRetLineKind.point );
			
			return wRetLineKind;

		} catch(e) {
			throw { name: 'toLineKind', message: e.message };
		}
	};


	// **************************************************************
	// 所属要素情報
	// **************************************************************

	// 所属要素　関連付けKEY設定
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

	// 所属要素　所属チェック
	clsItemRelation.prototype.chkMasterKey = function( pId ) {
		try {
			// 関連元IDチェック
			if ( pId == this._RelationInfMaster.parent ) return true;

			// 関連先IDチェック
			if ( pId == this._RelationInfMaster.target ) return true;

			return false;

		} catch(e) {
			throw { name: 'chkMasterKey', message: e.message };
		}
	};

	// 所属要素　関連付けKEY取得
	clsItemRelation.prototype.getMasterKey = function() {
		try {
			return this._RelationInfMaster.key;

		} catch(e) {
			throw { name: 'getMasterKey', message: e.message };
		}
	};

	// 所属要素　関連付け元ID取得
	clsItemRelation.prototype.getMasterParent = function() {
		try {
			return this._RelationInfMaster.parent;

		} catch(e) {
			throw { name: 'getMasterParent', message: e.message };
		}
	};

	// 所属要素　関連付け先ID取得
	clsItemRelation.prototype.getMasterTarget = function() {
		try {
			return this._RelationInfMaster.target;

		} catch(e) {
			throw { name: 'getMasterTarget', message: e.message };
		}
	};


	// **************************************************************
	// 中継点
	// **************************************************************

	// 中継点コメント位置設定
	clsItemRelation.prototype.setCommentPoint = function( pEvent ) {
		try {
			// 中継点設定
			this.setLinePoint( pEvent, this.getBoxElement() );

		} catch(e) {
			throw { name: 'setCommentPoint.' + e.name, message: e.message };

		}
	};

	// 中継点設定
	clsItemRelation.prototype.setLinePoint = function( pEvent, pElement ) {
		try {
			// 終了位置
			var wPoint = this.getEventPos( pEvent );

			// 座標補正
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

			// 親要素のスクロール値加算
			var wMainScroll = this.getParentScroll();
			wPoint.x += wMainScroll.x;
			wPoint.y += wMainScroll.y;

			// ポイント保存
			var wId = pElement.getAttribute('id');
			if ( wId ) {
				this._RelationInfPoints[wId] = wPoint;

			}

			// 親へ変更を通知
			this.execItemCallback( pEvent, { kind: 'relationLine' } );

		} catch(e) {
			throw { name: 'setLinePoint.' + e.name, message: e.message };

		}
	};

	// 中継点位置補正値取得
	clsItemRelation.prototype.getLinePointCorrection = function( pPos ) {
		try {
			var wCorrection = { x: 0, y: 0 };

			// 中継点表示補正値取得
			var wBoxSize	= this.getSize( this.getBoxElement(), { border: false } );
			var wBoxShift	= this.getShiftPos( true, wBoxSize );

			// 通常時ライン幅 + 1
			wCorrection.x = wBoxShift.x + this._DEF_RELATIONINF_LINE_WIDTH;
			wCorrection.y = wBoxShift.y + this._DEF_RELATIONINF_LINE_WIDTH;
			
			return wCorrection;

		} catch(e) {
			throw { name: 'getLinePointCorrection.' + e.name, message: e.message };

		}
	};

	// 中継点位置設定
	clsItemRelation.prototype.setLinePointPos = function( pPos ) {
		try {
			// 中継点位置を設定
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

	// 中継点コメント位置取得
	clsItemRelation.prototype.getCommentPoint = function( ) {
		try {
			var wPointEle = this.getBoxElement();
			if ( !wPointEle ) return null;

			// 中継点位置設定あれば返す
			var wId = wPointEle.getAttribute('id');
			
			if ( wId in this._RelationInfPoints ) {
				return Object.create( this._RelationInfPoints[wId] );
			
			} else {
				return null;

			}

		} catch(e) {
			throw { name: 'getCommentPoint.' + e.name, message: e.message };

		}
	};

	// 中継点クリア
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
	// コメント要素
	// **************************************************************

	// コメント表示用要素生成
	clsItemRelation.prototype.setCmtElement = function( pRelId ) {
		try {
			// コメント設定
			var wComment  = this._RelationInfContents.cmt;

			// 表示内容設定
			var wCmtEle = this.getBoxElement();
			wCmtEle.innerHTML = wComment;

			// 表示コメント保存
			this._RelationInfHtml = wComment;

			// 枠設定
			this.setBoxStyle( { 'border-color': this.getRelationColor() } );

			// コメントない場合
			if ( String(wComment).length == 0 ) {
				// 空コメントclass追加
				this.setBoxClass('cssItem-relation-nocmt');
				this.setBoxClass('no-print');

			} else {
				// 空コメントclass削除
				this.delBoxClass('cssItem-relation-nocmt');
				this.delBoxClass('no-print');

			}

			// コメントサイズ保存
			this._RelationInfContents.cmtSize = this.getBoxSize();

		} catch(e) {
			throw { name: 'setCmtElement.' + e.name, message: e.message };

		}
	};

	// コメント有無
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

	// 関係コメント表示
	clsItemRelation.prototype.dspRelationCmt = function( pX, pY, pStatPos ) {
		try {
			// コメント位置補正
			var wSize = this.getBoxSize();

			var wPos  = { x: pX, y: pY };

			var wShift  = true;
			var wCenter = true;

			// 中継点ある場合
			if ( this._RelationInfPoints ) {
				for( var wKey in this._RelationInfPoints ) {
					if ( this._RelationInfPoints[wKey] ) {
						wPos.x = this._RelationInfPoints[wKey].x;
						wPos.y = this._RelationInfPoints[wKey].y;

						break;
					}
				}
			}

			// 位置設定
			this.setBoxPos( wPos, { shift: wShift, center: wCenter, size: wSize } );

			// 表示
			this.dspBox(true);
			
			// 関係状態項目表示
			this.dspStatusItem( pStatPos );

		} catch(e) {
			throw { name: 'dspRelationCmt.' + e.name, message: e.message };
		}
	};

	// 関係コメント非表示
	clsItemRelation.prototype.hideRelationCmt = function() {
		try {
			// 中継点削除
			this.clearLinePoint();

			// 非表示
			this.dspBox(false);

		} catch(e) {
			throw { name: 'hideRelationCmt.' + e.name, message: e.message };
		}
	};

	// **************************************************************
	// コメント移動
	// **************************************************************

	// コメント移動イベント　追加
	clsItemRelation.prototype.addCmtMoveEvent = function() {
		try {
			// マウス追従
			this.addEvent( this.getBoxWindow(), 'onmousemove'	, this.eventCmtMove );

			// 位置確定
			this.addEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtMoveStop );

		} catch(e) {
			throw { name: 'addCmtMoveEvent.' + e.name, message: e.message };
		}
	};

	// コメント移動イベント　削除
	clsItemRelation.prototype.delCmtMoveEvent = function() {
		try {
			// マウス追従
			this.delEvent( this.getBoxWindow(), 'onmousemove'	, this.eventCmtMove );

			// 位置確定
			this.delEvent( this.getBoxWindow(), 'onmouseup'		, this.eventCmtMoveStop );

		} catch(e) {
			throw { name: 'delCmtMoveEvent.' + e.name, message: e.message };
		}
	};

	// コメント移動　終了時処理
	clsItemRelation.prototype.cancelCmtMove = function() {
		try {
			// イベント停止
			this.delCmtMoveEvent();

			this._RelationInfCmtMove = null;

			// 最前面解除
			this.setBoxToFront( false );

		} catch(e) {
			throw { name: 'cancelCmtMove.' + e.name, message: e.message };
		}
	};

	// コメント移動　開始時処理
	clsItemRelation.prototype.startCmtMove = function( pEvent ) {
		try {
			// 一旦キャンセル
			this.cancelCmtMove();

			this._RelationInfCmtMove = {};

			// 親の位置を保存
			this._RelationInfCmtMove.parent = this.getParentPos();

			// クリック位置を保存
			var wEvtPos = this.getEventPos( pEvent );
			var wItmPos = this.getBoxPos();

			this._RelationInfCmtMove.startpos = {};
			this.copyProperty( wEvtPos, this._RelationInfCmtMove.startpos );

			this._RelationInfCmtMove.drag = {
				  left: wEvtPos.x - wItmPos.left
				, top : wEvtPos.y - wItmPos.top
			};

			// イベント追加
			this.addCmtMoveEvent();

			// 最前面表示
			this.setBoxToFront( true );

			return true;

		} catch(e) {
			throw { name: 'startCmtMove.' + e.name, message: e.message };
		}
	};

	// コメント移動
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

			// 親要素のスクロール値加算
			var wMainScroll = this.getParentScroll();
			wMovePos.x += wMainScroll.x;
			wMovePos.y += wMainScroll.y;

			// 上端、左端は処理なし
			if ( wMovePos.x <= 0 ) return false;
			if ( wMovePos.y <= 0 ) return false;

			this.setBoxPos( wMovePos );

			return true;

		} catch(e) {
			throw { name: 'moveCmt.' + e.name, message: e.message };
		}
	};


	// **************************************************************
	// イベント
	// **************************************************************

	// イベントキャンセル
	clsItemRelation.prototype.eventClear = function() {
		try {
			// 移動キャンセル
			this.execFunction( this.cancelCmtMove );

			// 継承元イベントキャンセル処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.eventClear.call( this );

			}

		} catch(e) {
			throw { name: 'clsItemRelation.eventClear', message: e.message };
		}
	};

	// 項目更新時通知
	// ※ clsItemBoxから継承
	clsItemRelation.prototype.execItemCallback = function( pEvent, pParam ) {
		try {
			// KEY設定
			pParam.key = this._RelationInfMaster.key;

			// 継承元　項目更新時通知
			if ( this._ItemPrototype ) {
				this._ItemPrototype.execItemCallback.call( this, pEvent, pParam );

			}

		} catch(e) {
			throw { name: 'clsItemRelation.execItemCallback', message: e.message };
		}
	};

	// コンテキストメニュー使用有無設定
	// ※ clsItemBoxから継承
	clsItemRelation.prototype.setContextAvailable = function( pAvailable, pParam ) {
		try {
			// 継承元　コンテキストメニュー使用有無設定
			if ( this._ItemPrototype ) {
				this._ItemPrototype.setContextAvailable.call( this, pAvailable, pParam );

			}

			// ドラッグ許可時のみ処理
			if ( !this.getItemDragIs() ) return;

			// コメントドラッグ可否
			this._RelationInfCmtDrag = pAvailable;

			// drag可否パラメータあり
			var wDragParam = false;
			if ( this.isObject(pParam) ) {
				if ( 'drag' in pParam ) wDragParam = true;
			}

			if ( wDragParam ) {
				// パラメータ値を使用
				this._RelationInfCmtDrag = pParam.drag;

			// パラメータなし
			} else {
				// メニュー有効時
				if ( pAvailable ) {
					// 通常時ドラッグ可否を設定
					this._RelationInfCmtDrag = this.getItemMoveInitIs();

				}
			}


		} catch(e) {
			throw { name: 'setContextAvailable', message: e.message };
		}
	};


	// **************************************************************
	// 継承対象メソッド
	// **************************************************************

	// -------------------
	// メニュー関連
	// -------------------

	// メニュー初期設定
	clsItemRelation.prototype.initItemMenu = function( pArgument ) {
		try {
			// 継承元メニュー初期化処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemMenu.call( this, pArgument );

			}

			// 項目ロック時処理不要
			if ( this.getItemLockIs() ) return;

			// コメントドラッグ許可
			if ( this.getItemDragIs() ) {
				this.addBoxEvents( 'onmousedown'	, this.eventCmtMoveStart );
			}

		} catch(e) {
			throw { name: 'clsItemRelation.initItemMenu.' + e.name, message: e.message };
		}
	};


	// -------------------
	// 基本情報関連
	// -------------------

	// ステータス初期設定
	clsItemRelation.prototype.initItemStatus = function( pArgument ) {
		try {
			// 継承元ステータス更新時処理
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initItemStatus.call( this, pArgument );

			}

			// Load時　設定内容
			var wLoadContents = this.loadDataVal( 'contents' );
			if ( wLoadContents ) {
				this._RelationInfContents = wLoadContents;

			} else {
				// 初期値設定
				this.copyProperty( this._DEF_RELATIONINF_CONTENTS, this._RelationInfContents );

			}

			// Load時　中継点
			var wLoadRelay = this.loadDataVal( 'relay' );
			if ( wLoadRelay ) {
				this._RelationInfPoints = wLoadRelay;
			}

			// Load時　関係状態
			var wLoadStatus = this.loadDataVal( 'relstat' );
			if ( wLoadStatus ) {
				this._RelationInfStatus = wLoadStatus;

				// アイコン設定
				var wLoadKind = this._RelationInfStatus.kind;
				if ( typeof wLoadKind !== 'string' ) wLoadKind = '';

				if ( wLoadKind.length > 0 ) {
					// 一旦状態IDクリア
					this._RelationInfStatus.kind = '';
					// 状態再設定（アイコン）
					this.addStatusItem( wLoadKind );
				}
			}

			// パラメータ設定
			if ( this.isObject(pArgument) ) {
				// 所属要素情報
				if ( pArgument.master ) {
					for( var wMstKey in pArgument.master ) {
						this._RelationInfMaster[wMstKey] = pArgument.master[wMstKey];
					}

				}

				// 変更時初期値
				for( var wKey in pArgument ) {
					// 関係情報
					if ( wKey in this._RelationInfContents ) {
						// 値上書き
						this._RelationInfContents[wKey] = pArgument[wKey];
					}
				}

			}

			// 関係種別初期設定
			var wDefKind;
			var wRelKind = this._RelationInfContents['relKind'];
			if ( wRelKind == 'item-group' ) {
				wDefKind = this._DEF_RELATIONINF_LIST_KIND_GROUP;
			
			} else {
				wDefKind = this._DEF_RELATIONINF_LIST_KIND;

			}
			this._RelationInfKind = wDefKind;

			// 初期ドラッグ可否（初期移動可　かつ　ドラッグ可）
			this._RelationInfCmtDrag = ( this.getItemMoveInitIs() && this.getItemDragIs() );

		} catch(e) {
			throw { name: 'clsItemRelation.initItemStatus.' + e.name, message: e.message };
		}
	};


	// -------------------
	// SAVE/LOAD関連
	// -------------------

	// データ保存用　項目設定値取得
	clsItemRelation.prototype.saveData = function( pSaveParam ) {
		try {
			var wSaveData;
			
			// 継承元項目設定値取得処理
			if ( this._ItemPrototype ) {
				wSaveData = this._ItemPrototype.saveData.call( this, pSaveParam );

			} else {
				wSaveData = {};

			}

			// 所属要素
			wSaveData.master	= JSON.stringify( this._RelationInfMaster );

			// 設定内容
			wSaveData.contents	= JSON.stringify( this._RelationInfContents );

			// 中継点
			wSaveData.relay		= JSON.stringify( this._RelationInfPoints );

			// 関係状態設定
			wSaveData.relstat	= JSON.stringify( this._RelationInfStatus );

			// 設定値を取得
			return wSaveData;

		} catch(e) {
			throw { name: 'clsItemRelation.saveData', message: e.message };
		}
	};

	// データ読込
	clsItemRelation.prototype.loadData = function( pLoadData ) {
		try {
			var wLoadBuff;

			// 継承元データ読込処理
			if ( this._ItemPrototype ) {
				wLoadBuff = this._ItemPrototype.loadData.call( this, pLoadData );

			} else {
				wLoadBuff = {};
			
			}
			if ( !pLoadData ) return wLoadBuff;

			// 所属要素
			if ( pLoadData.master ) {
				wLoadBuff.master = JSON.parse( pLoadData.master );
			}

			// 設定内容
			if ( pLoadData.contents ) {
				wLoadBuff.contents = JSON.parse( pLoadData.contents );

			} else {
				wLoadBuff.contents = {};
				this.copyProperty( this._DEF_RELATIONINF_CONTENTS, wLoadBuff.contents );
				for( var wKey in pLoadData ) {
					if ( wKey in wLoadBuff.contents ) wLoadBuff.contents[wKey] = pLoadData[wKey];
				}

			}

			// 中継点
			if ( pLoadData.relay ) {
				wLoadBuff.relay = JSON.parse( pLoadData.relay );
			}

			// 関係状態設定
			if ( pLoadData.relstat ) {
				wLoadBuff.relstat = JSON.parse( pLoadData.relstat );
			}

			return wLoadBuff;

		} catch(e) {
			throw { name: 'clsItemRelation.loadData', message: e.message };
		}
	};


	// **************************************************************
	// 継承メソッド（コンストラクタ／デストラクタ）
	// **************************************************************

	// コンストラクタ
	clsItemRelation.prototype.initClass = function( pArgument, pNoBoxReq ) {
		try {
			// プロパティ設定
			var wInitArgument = this.setArgumentInProperty( pArgument, this._DEF_RELATIONINF_STYLE );

			// 種別未設定時
			if ( typeof wInitArgument.kind == 'undefined' ) {
				// 種別「relation」
				wInitArgument.kind = this._DEF_RELATIONINF_KIND;

			}

			// メニュー設定
			wInitArgument.menuList		= this._DEF_RELATIONINF_MENU_CONTEXT;
			wInitArgument.menuReplace	= true;

			// 継承元コンストラクタ
			if ( this._ItemPrototype ) {
				this._ItemPrototype.initClass.call( this, wInitArgument, pNoBoxReq );

			}

		} catch(e) {
			throw { name: 'clsItemRelation.initClass', message: e.message };
		}
	};

	// デストラクタ
	clsItemRelation.prototype.freeClass = function() {
		try {
			// イベント削除
			this.execFunction( this.delCmtMoveEvent );

			// プロパティ開放
			this._RelationInfContents		= null;
			this._RelationInfPoints			= null;
			this._RelationInfKind			= null;
			this._RelationInfCmtMove		= null;
			this._RelationInfMaster			= null;

			// 要素削除
			this.execFunction( this.delStatusItem );
			this._RelationInfStatus			= null;

			// 継承元デストラクタ
			// ※継承元デストラクタは最後にcallする
			if ( this._ItemPrototype ) {
				this._ItemPrototype.freeClass.call( this );

			}
			this._ItemPrototype	= null;

		} catch(e) {}
	};

}());
