(function(){
	var modMessage = "";
	modMessage += "(0) for symbol(default)" + "\n";
	modMessage += "(1) for library" + "\n";
	modMessage += "Enter the index:";
	var mod = prompt( modMessage, "0" );

	if( mod === null )
		return;

	if( mod == "1" )
		handleInLibrary();
	else
		handleInSymbol();
	
}).call();

function handleInSymbol()
{
	// get all elements in the current timeline
	var selectedElements = [];
	function getElements(frame)
	{
		selectedElements = selectedElements.concat( frame.elements );
	}
	fl.runScript( fl.configURI+"Commands/hbbjsfl/scan.jsfl.lib", "scanTimeline", fl.getDocumentDOM().getTimeline(), {frame: getElements} );

	// kick off the invalid items, such as shape,text...
	var selectedItems = [];
	for(var i = 0; i < selectedElements.length; ++i)
		if( selectedElements[i].elementType == "instance" )
			selectedItems.push( selectedElements[i] );

	if( selectedItems.length == 0 )
		throw "Error: no item in the current frame!";

	var count = selectedItems.length;

	fl.getDocumentDOM().getTimeline().addNewLayer("All Items");

	fl.getDocumentDOM().getTimeline().convertToBlankKeyframes(0, count);

	for(var i = 0; i < count; ++i)
	{
		fl.getDocumentDOM().getTimeline().setSelectedFrames(i,i,true);

		fl.getDocumentDOM().library.addItemToDocument({x:0.0, y:0.0}, selectedItems[i].libraryItem.name); 
		fl.getDocumentDOM().setElementProperty("x", 0.0); 
		fl.getDocumentDOM().setElementProperty("y", 0.0); 
	}

}

function handleInLibrary()
{
	var selectedItems = fl.getDocumentDOM().library.getSelectedItems(); 

	if( selectedItems.length == 0 )
		throw "Error: no item be selected!";

	var mcName = prompt("Enter movie clip name", ""); 
	if( mcName === null )
		return;

	if( mcName == "" )
		throw "Error: need a movie clip name!";

	createEmptyMovieClip( mcName );

	fl.getDocumentDOM().library.editItem( mcName );

	var count = selectedItems.length;

	fl.getDocumentDOM().getTimeline().convertToBlankKeyframes(0, count);

	for(var i = 0; i < count; ++i)
	{
		fl.getDocumentDOM().getTimeline().setSelectedFrames(i,i,true);

		fl.getDocumentDOM().library.addItemToDocument({x:0.0, y:0.0}, selectedItems[i].name); 

		fl.getDocumentDOM().setElementProperty("x", 0.0); 
		fl.getDocumentDOM().setElementProperty("y", 0.0); 
	}
}

function createEmptyMovieClip( name )
{
	var lib = fl.getDocumentDOM().library;
	lib.addNewItem('movie clip', name);
	if (lib.getItemProperty('linkageImportForRS') == true) {
		lib.setItemProperty('linkageImportForRS', false);
	}else {
		lib.setItemProperty('linkageExportForAS', false);
		lib.setItemProperty('linkageExportForRS', false);
	}
}