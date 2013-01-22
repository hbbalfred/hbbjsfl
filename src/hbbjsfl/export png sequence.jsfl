/**
 * Export PNG Sequence
 * you can custome name the export pne file with the frame label.
 */
(function(){
	var folder = fl.browseForFolderURL("Select a folder"); 
	// cancel
	if(!folder)
		return;

	if(folder.substr(-1) != "/")
		folder += "/";

	var filename = fl.getDocumentDOM().name;
	filename = filename.substr(0, filename.lastIndexOf(".fla"));
	var inputname = prompt( "Save As:", filename );

	if(!inputname){
		alert("Please input the file name");
		return;
	}

	var symbols = fl.getDocumentDOM().library.getSelectedItems();
	if( !symbols || symbols.length == 0 ){
		alert("Please select a symbol in library.");
		return;
	}
	fl.getDocumentDOM().library.editItem( symbols[0].name );

	var timeline = fl.getDocumentDOM().getTimeline();
	var frames = timeline.frameCount;
	for(var i = 0; i < frames; ++i)
	{
		timeline.currentFrame = i;
		var label = getFrameLabel( i, timeline );
		if( label )
			fl.getDocumentDOM().exportPNG( folder + label + ".png", false, true );
		else
			fl.getDocumentDOM().exportPNG( folder + inputname + zero(i+1) + ".png", false, true );
	}
	
}).call();

function getFrameLabel( frameIndex, timeline )
{
	for(var i = timeline.layerCount - 1; i > -1; --i)
	{
		var frame = timeline.layers[i].frames[ frameIndex ];
		if( frame
		&& frame.name
		&& frame.startFrame == frameIndex
		&& frame.labelType != "comment" )
		{
			return frame.name;
		}
	}
	return "";
}

function zero( num )
{
	return ("0000" + num).substr( -4 );
}
