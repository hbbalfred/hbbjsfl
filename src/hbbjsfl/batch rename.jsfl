// *******************************************************************************************
// 					Copyright Name Change By HBB Alfred
// *******************************************************************************************
//
//	@Product: Name Changer
// 	@Version: 1.0.6
//	@Author: HBB Alfred
//	@History: ______________________________________________________________________________
//			|-10.13.2004 修正change frame label线性命名bug, 添加帧于帧之间设置普通帧帧数
//			|-10.17.2004 增加各选项的alert功能, 添加增加前导零功能, 面板设计调整
//			|-10.27.2004 修正change frame name功能,使没有命名的情况下也可以实现间隔同等帧数
//			|-03.20.2010 改成utf-8，界面换成中文。修改了change instance的顺序
//			\
// *******************************************************************************************

// 生成全局变量供各函数使用
_doc = fl.getDocumentDOM();
// for changeSymbolName and changeLinkageName
// 不知道为什么在经过changeSymbolName后,在changeSymbolName中声明的全局变量Len也会变掉
// 很有可能是symbol名字变了以后,library也跟着变了,Len就要重认....
// 所以只好一上来就声明这些变量,以待使用 ^^"
lib = _doc.library;
Items = lib.getSelectedItems();
Len = Items.length;
// for changeInstanceName
sel = _doc.selection;


// 调用xui 并调用事件
getXML();
execute();

// 事件一览
function getXML(){
	xmlData = _doc.xmlPanel(fl.configURI+"Commands/hbbjsfl/batch rename.xml");

	leadZero = (xmlData.leadZero=="true" ? true : false);

	sName = xmlData.sName;
	sNumber = parseInt(xmlData.sNumber);
	sFolderName = xmlData.sFolderName;

	iName = xmlData.iName;
	iNumber = parseInt(xmlData.iNumber);

	lName = xmlData.lName;
	lNumber = parseInt(xmlData.lNumber);
	lExff = xmlData.lExff;

	fName = xmlData.fName;
	fNumber = parseInt(xmlData.fNumber);
	fSpace = parseInt(xmlData.fSpace);
}

function addLeadingZero (nam,num,digit){
	switch(digit){
		case 0:
			return nam + num;
		break;
		case 1:
			return nam + "0"+ num;
		break;
		case 2:
			return nam + "00"+ num;
		break;
		case 3:
			return nam + "000"+ num;
		break;
	}
}

function changeSymbolName(){

	if(Items.length > 0){
		// 是否放入新的文件夹
		if(xmlData.sIntoFolder == "true") lib.newFolder(sFolderName);
		// 是否前导零,如果是就算出要改变的元素的位数
		if(leadZero) var digit = String(Len).length;

		for(var i=0;i<Len;i++){
			var iType = lib.getItemType(Items[i].name);
			if ((iType != "folder" && iType != "undefined" && iType != null)){
				lib.selectItem(Items[i].name); // 选择当前的物件

				var sTmpName = sName + (sNumber+i);
				if(leadZero) sTmpName = addLeadingZero(sName, (sNumber+i), (digit - String(sNumber+i).length));

				if(xmlData.sIntoFolder == "true") lib.moveToFolder(sFolderName);
				lib.renameItem(sTmpName);
			}
		}
	}else alert("You must select one symbol from library at least");
}

function changeLinkageName(){

	if(Items.length > 0){
		// 是否前导零,如果是就算出要改变的元素的位数
		if(leadZero) var digit = String(Len).length;

		for(var i=0;i<Len;i++){
			var iType = lib.getItemType(Items[i].name);
			if (iType != "bitmap" && iType != "video" && iType != "compiled clip"){
				lib.selectItem(Items[i].name);

				var id = lName + (lNumber + i);
				if(leadZero) id = addLeadingZero(lName, (lNumber+i), (digit - String(lNumber+i).length));

				lib.setItemProperty("linkageExportForAS" , true);
				lib.setItemProperty("linkageIdentifier" , id);
				lib.setItemProperty("linkageExportInFirstFrame" , (lExff == "true" ? true : false));
			}
		}
	}else alert("You must select one symbol from library at least");
}

function changeInstanceName(){
	if(sel.length > 0){
		var iLen = sel.length;
		// 是否前导零,如果是就算出要改变的元素的位数
		if(leadZero) var digit = String(iLen).length;

		for(var i=0;i<iLen;i++){
			var el = sel[i];
			if(el.elementType=="instance"){

				var iTmpName = iName + iNumber;
				if(leadZero) iTmpName = addLeadingZero(iName, iNumber, (digit - String(iNumber).length));

				el.name = iTmpName;
				iNumber ++;
			};
		}
	}else alert("You must select some thing from stage");
}

function changeFrameLabelName(){
	var timeline = _doc.getTimeline();
 	var selFrames = timeline.getSelectedFrames();
	if(selFrames != ""){

		var frames = timeline.layers[selFrames[0]].frames;
		var firstNum = selFrames[1];
		var lastNum = selFrames[2];
		var fLen = lastNum - firstNum;

		if(fName != ""){
			// 是否前导零,如果是就算出要改变的元素的位数
			if(leadZero) var digit = String(fLen).length;

			for(var i=0; i<fLen; i++){
				var fTmpName = fName + (fNumber+i);
				if(leadZero) fTmpName = addLeadingZero(fName, (fNumber+i), (digit - String(fNumber+i).length));

				frames[firstNum+i].name = fTmpName;
			}
		}

		if(fSpace > 0){
			for(var i=0;i<fLen;i++){
				timeline.insertFrames(fSpace,false,i*fSpace+i);
			}
		}
	}else alert("You must select one frame form timeline at least");

}

function execute(){
	if(xmlData.csName == "true"){
		changeSymbolName();
	}
	if(xmlData.clName == "true"){
		changeLinkageName();
	}
	if(xmlData.ciName == "true"){
		changeInstanceName();
	}
	if(xmlData.cflName == "true"){
		changeFrameLabelName();
	}

}
















