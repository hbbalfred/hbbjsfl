if( fl.getDocumentDOM() ){
	try{
		execute();
	}catch(er){
		alert('出错啦!\n' + er.toString());
	}
}else{
	alert('没有打开文档，无法执行场景定位器');
}

function execute()
{
	var doc = fl.getDocumentDOM();
	var rect = doc.selection[0];
	if(!rect) throw new Error("请先选中一个矩形图形作为场景定位区域！");

	var offsetX = -rect.left;
	var offsetY = -rect.top;

	var shift = function(elem)
	{
		elem.x += offsetX;
		elem.y += offsetY;
	};

	fl.runScript( fl.configURI+"Commands/hbb的jsfl库/扫描.jsfl.lib", "scanDocument", {element:shift} );


	doc.width = parseInt(rect.width);
	doc.height = parseInt(rect.height);
}

