if( fl.getDocumentDOM() ){
	try{
		execute();
	}catch(er){
		alert('Error!\n' + er.toString());
	}
}else{
	alert('No document');
}


function execute()
{
	fl.outputPanel.clear();

	var xui = fl.getDocumentDOM().xmlPanel(fl.configURI+"Commands/hbbjsfl/library cleaner.xml");
	if(xui.dismiss == "accept")
	{
		if(xui.isRemoveGuide=="true") removeGuide();

		// TODO check the group, check the bitmap fill
		var usedItems = getUsedItems();
		sortItems( fl.getDocumentDOM().library.items, usedItems, xui.isCleanFolder=="false", xui.folderName );

		if(xui.isRemoveEmptyFolder=="true") removeEmptyFolder( fl.getDocumentDOM().library.items );
	}
}

/*
	remove all of guide layers in symbol and timelien in scenes
	this function just determine which timeline to be removed
*/
function removeGuide()
{
	var items = fl.getDocumentDOM().library.items;
	var i = items.length;
	while(--i>-1){
		if(items[i].timeline){
			removeGuideLayer(items[i].timeline);
		}
	}

	for(i=fl.getDocumentDOM().timelines.length - 1; i>-1; --i){
		removeGuideLayer( fl.getDocumentDOM().timelines[i] );
	}
}
/*
	really remove guide layer in specific timeline
*/
function removeGuideLayer(timeline)
{
	var safe = -1;
	var layers = timeline.layers;
	var i = timeline.layerCount;
	while(--i>-1)
	{
		switch(layers[i].layerType)
		{
			case 'guided': safe = i-1; break;
			case 'guide': if(safe != i) timeline.deleteLayer(i); break;
			default:
		}
	}
}

/*
	remove empty folder in specific items
	this function just check which folder is empty
*/
function removeEmptyFolder(items)
{
	var used = {};
	var unused = {};
	var i = items.length;
	while(--i>-1){
		var name = items[i].name;
		if(items[i].itemType == 'folder'){
			if(used[ name ]) continue;
			unused[ name ] = true;
			delete used[ name ];
		}else{
			var k = name.lastIndexOf('/');
			if(k == -1) continue;
			do{
				var path = name.substr(0,k);
				if(used[path]) break;
				used[path] = true;
				if(unused[path]) delete unused[path];
				k = name.lastIndexOf('/', k-1);
			}while(k>-1);
		}
	}


	removeFolder( unused );
}

/*
	remove the specific folders in map
*/
function removeFolder(map)
{
	var lib = fl.getDocumentDOM().library;
	for(var name in map){
		lib.deleteItem( name );
	}
}

/*
	sort item for its type
	items is specific to be sort
	usedItems is used in symbol
*/
function sortItems(items, usedItems, ignoreFolder, folderName)
{
	var folderPath = folderName + '-lib cleaner';

	var CLASS_FOLDER = folderPath + '/class';
	var BITMAP_FOLDER = folderPath + '/bitmap';
	var MOVIECLIP_FOLDER = folderPath + '/movie clip';
	var BUTTON_FOLDER = folderPath + '/button';
	var GRAPHIC_FOLDER = folderPath + '/graphic';
	var MEDIA_FOLDER = folderPath + '/video_audio';
	var FONT_FOLDER = folderPath + '/font';
	var UNUSED_FOLDER = folderPath + '/unuse(almost)';

	var lib = fl.getDocumentDOM().library;

	if(!lib.itemExists(CLASS_FOLDER)) lib.newFolder(CLASS_FOLDER);
	if(!lib.itemExists(BITMAP_FOLDER)) lib.newFolder(BITMAP_FOLDER);
	if(!lib.itemExists(MOVIECLIP_FOLDER)) lib.newFolder(MOVIECLIP_FOLDER);
	if(!lib.itemExists(BUTTON_FOLDER)) lib.newFolder(BUTTON_FOLDER);
	if(!lib.itemExists(GRAPHIC_FOLDER)) lib.newFolder(GRAPHIC_FOLDER);
	if(!lib.itemExists(MEDIA_FOLDER)) lib.newFolder(MEDIA_FOLDER);
	if(!lib.itemExists(FONT_FOLDER)) lib.newFolder(FONT_FOLDER);
	if(!lib.itemExists(UNUSED_FOLDER)) lib.newFolder(UNUSED_FOLDER);

	var i = items.length;
	var item;
	while(--i>-1){
		item = items[i];

		if( ignoreFolder ){
			if( item.itemType == 'folder') continue;
			if( item.name.indexOf('/') > -1 ) continue;
		}

		if(isClass(item)){
			moveToFolder(item, CLASS_FOLDER);
		}else if(usedItems[ item.name ]){
			     if(item.itemType == 'bitmap') moveToFolder(item, BITMAP_FOLDER);
			else if(item.itemType == 'movie clip') moveToFolder(item, MOVIECLIP_FOLDER);
			else if(item.itemType == 'graphic') moveToFolder(item, GRAPHIC_FOLDER);
			else if(item.itemType == 'button') moveToFolder(item, BUTTON_FOLDER);
			else if(item.itemType == 'sound') moveToFolder(item, MEDIA_FOLDER);
			else if(item.itemType == 'video') moveToFolder(item, MEDIA_FOLDER);
			else if(item.itemType == 'font') moveToFolder(item, FONT_FOLDER);
		}else{
			if(item.name.indexOf(folderPath) != 0)
				moveToFolder(item, UNUSED_FOLDER);
		}
	}
}

/*
	wrapper function
*/
function moveToFolder(item, folder)
{
	fl.getDocumentDOM().library.moveToFolder(folder, item.name);
}

/*
	check the item which may be used to AS
*/
function isClass(item)
{
	if(!item) return false;
	if(item.itemType == 'undefined') return false;
	if(item.itemType == 'folder') return false;
	if(item.linkageBaseClass) return true;
	if(item.linkageClassName) return true;
	if(item.linkageExportForAS) return true;
	if(item.linkageExportForRS) return true;
	if(item.linkageExportInFirstFrame) return true;
	if(item.linkageIdentifier) return true;
	if(item.linkageImportForRS) return true;
	if(item.linkageURL) return true;
	return false;
}

/*
	scan document to get used items
*/
function getUsedItems()
{
	var ob = {};

	var frameCall = function(frame, scaned)
	{
		if(frame.soundLibraryItem)
			if(!scaned[ frame.soundName ])
				scaned[ frame.soundName ] = frame.soundLibraryItem;
	};

	fl.runScript( fl.configURI+"Commands/hbbjsfl/scan.jsfl.lib", "scanDocument", {frame:frameCall}, null, true, ob );

	return ob;
}

