if( fl.getDocumentDOM() ){
	try{
		execute();
	}catch(er){
		alert('������!\n' + er.toString());
	}
}else{
	alert('û�д��ĵ����޷�ִ�г�����λ��');
}

function execute()
{
	var doc = fl.getDocumentDOM();
	var rect = doc.selection[0];
	if(!rect) throw new Error("����ѡ��һ������ͼ����Ϊ������λ����");

	var offsetX = -rect.left;
	var offsetY = -rect.top;

	var shift = function(elem)
	{
		elem.x += offsetX;
		elem.y += offsetY;
	};

	fl.runScript( fl.configURI+"Commands/hbb��jsfl��/ɨ��.jsfl.lib", "scanDocument", {element:shift} );


	doc.width = parseInt(rect.width);
	doc.height = parseInt(rect.height);
}

