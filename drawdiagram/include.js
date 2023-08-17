// ---------------------------------------------
// 　呼び出し元からのパス
// ---------------------------------------------
const _C_DRAWDIAGRAM_ROOT_PATH_			= ".";

// ---------------------------------------------
// 　画像配置パス
// ---------------------------------------------
const _C_DRAWDIAGRAM_IMG_PATH			= _C_DRAWDIAGRAM_ROOT_PATH_ + "/drawdiagram/image";

// ---------------------------------------------
// 　Script配置パス
// ---------------------------------------------
const _C_DRAWDIAGRAM_SCRIPT_PATH		= _C_DRAWDIAGRAM_ROOT_PATH_ + "/drawdiagram/script";

// ---------------------------------------------
// 　CSS配置パス
// ---------------------------------------------
const _C_DRAWDIAGRAM_CSS_PATH			= _C_DRAWDIAGRAM_ROOT_PATH_ + "/drawdiagram/css";


// --------------------------------------------------------------------
//
// クラス継承用関数
//
// --------------------------------------------------------------------
var clsInheritance = function( pChildCtor, pParentCtor ) {
	try {
		if ( Object.setPrototypeOf ) {
			Object.setPrototypeOf( pChildCtor.prototype, pParentCtor.prototype );

		} else if ( Object.create ) {
			pChildCtor.prototype = Object.create( pParentCtor.prototype );
			pChildCtor.prototype.constructor = pChildCtor;

		} else {
			var retFunc = function() {};
			retFunc.prototype = pParentCtor.prototype;

			pChildCtor.prototype = new retFunc();
			pChildCtor.prototype.constructor = pChildCtor;

		}
	} catch(e) {
		alert(e.message);
	}
};


// --------------------------------------------------------------------
//
// 関連JSのインクルード
//
// --------------------------------------------------------------------

var includeDrawDiagram = function() {
	try {
		var wLoadDate = new Date();
		var wReload = "?date=" + wLoadDate.toString();

		// 関連StyleSheetインクルード
		var wStyleSheet = "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + _C_DRAWDIAGRAM_CSS_PATH

		document.write( wStyleSheet + "/drawdiagram.css\" />" );
		document.write( wStyleSheet + "/drawdiagram.print.css\" media=\"print\" />" );

		// 関連JavaScriptインクルード
		var wScriptSt = "<script language=\"javascript\" src=\"" + _C_DRAWDIAGRAM_SCRIPT_PATH
		var wScriptEd = wReload + "\"></script>";

		document.write( wScriptSt + "/drawmain.js"						+ wScriptEd );

		document.write( wScriptSt + "/drawdiagram.js"					+ wScriptEd );

		document.write( wScriptSt + "/drawdiagram.contents.js"			+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.canvas.js"			+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.mousecmt.js"			+ wScriptEd );

		document.write( wScriptSt + "/drawdiagram.panel.control.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.panel.side.js"		+ wScriptEd );

		document.write( wScriptSt + "/drawdiagram.menu.js"				+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.menu.list.js"			+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.menu.color.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.menu.icon.js"			+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.menu.relation.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.menu.status.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.menu.file.js"			+ wScriptEd );

		document.write( wScriptSt + "/drawdiagram.item.js"				+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.item.person.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.item.group.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.item.comment.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.item.relation.js"		+ wScriptEd );
		document.write( wScriptSt + "/drawdiagram.item.freeline.js"		+ wScriptEd );

	} catch(e) {
		alert( e.message );
	}
};

// 関連JSインクルード
includeDrawDiagram();
