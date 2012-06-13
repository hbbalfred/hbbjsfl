//--------------------------------
//        Extends
//--------------------------------
String.prototype.trim = function()
{
	return this.ltrim().rtrim();
}
String.prototype.ltrim = function()
{
	for(var i = 0, ii = this.length; i < ii; ++i)
		if(this.charCodeAt(i) > 32)
			return this.substr(i);
	return "";
}
String.prototype.rtrim = function()
{
	for (var i = this.length - 1; i > -1; --i)
		if (this.charCodeAt(i) > 32)
			return this.substr(0, i+1);
	return "";
}
//--------------------------------
//        Main
//--------------------------------
fl.outputPanel.clear();
fl.compilerErrors.clear();

g = {
	setting: [],
	exports: [],
	curFolderURI: ""
};

readSetting();
checkFiles();
exportFiles();
//--------------------------------
//        Define Function
//--------------------------------
function readSetting()
{
	var uri = fl.scriptURI;
	var folder = uri.substr( 0, uri.lastIndexOf("/") );
	uri = folder + "/setting.txt";
	if( !FLfile.exists( uri ) )
	{
		throw "No setting file!";
	}
	
	g.curFolderURI = folder;
	g.setting = FLfile.read( uri ).trim();
}

function checkFiles()
{
	// format setting content
	var setting = g.setting;
	setting = setting.replace(/\r+/g, "\n");
	setting = setting.replace(/\n+/g, "\n");
	
	var lines = setting.split("\n");
	for(var i=0; i<lines.length; i+=2)
	{
		// get flash source file and export folder
		var source = lines[i].split("=")[1].trim();
		var folder = lines[i+1].split("=")[1].trim();
		
		// tick of convert setting path to uri for jsfl function
		source = FLfile.uriToPlatformPath( g.curFolderURI ) + "/" + source;
		folder = FLfile.uriToPlatformPath( g.curFolderURI ) + "/" + folder;
		
		source = FLfile.platformPathToURI( source );
		folder = FLfile.platformPathToURI( folder );
		
		// create the export folder if it is not exists
		if(!FLfile.exists( folder ))
		{
			FLfile.createFolder( folder );
		}
		// get the export file path
		var output = folder + source.substr( source.lastIndexOf("/") + 1 ).replace(/\.[^.]+$/, ".swf");
		
		g.exports.push( {source:source, output:output} );
	}
	
	// notic
	if( g.exports.length == 0 )
	{
		log("No files need to exports!");
	}
}

function exportFiles()
{
	var logURI = g.curFolderURI + "/log"
	FLfile.write( logURI, "" );

	var exports = g.exports;
	for(var i = 0; i < exports.length; ++i)
	{
		// open script is a god-like method better than open document and open file
		// see http://blog.csdn.net/holybozo/article/details/1273425
		fl.openScript( exports[i].source );
		fl.getDocumentDOM().exportSWF( exports[i].output, true );
		
		FLfile.write( logURI, "::: " + fl.getDocumentDOM().name + " :::\n", "append" );
		fl.compilerErrors.save( logURI, true );
		FLfile.write( logURI, "\n\n", "append" );

		fl.getDocumentDOM().close(false);
	}
}

function log(msg)
{
	fl.trace(msg);
}
