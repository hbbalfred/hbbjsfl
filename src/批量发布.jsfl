/*************************************************************************
	Batch Builder v1.0
		history 18.05.2005 - complete 0.1
				20.05.2005 - add to select publish or test movie
				20.03.2010 - change to utf-8 and change name
*************************************************************************/

xui = fl.getDocumentDOM().xmlPanel( fl.configURI + "Commands/批量发布.xml");

// xui.isPublishAll
// xui.isTestMovie
// xui.selectedDocs

// Publish function
function publish(conts, mode)
{
	for(var i in conts)
	{
		conts[i][mode]();
	}
}
	
if( "accept" == xui.dismiss)
{
	// Test movie or publish
	if( "true" == xui.isTestMovie )
		publishMode = "testMovie";
	else
		publishMode = "publish";
	
	// Publish all or custom
	if( "true" == xui.isPublishAll )
	{
		publish(fl.documents, publishMode);
	}
	else
	{
		// get all selected documents from document names
		selDocNames = xui.selectedDocs.split(",");
		allDocs = fl.documents;
		selDocs = new Array();
		
		for(var i=0; i<selDocNames.length; i++)
		{
			for(var j=0; j<allDocs.length; j++)
			{
				if( selDocNames[i] == allDocs[j].name)
				{
					selDocs.push( allDocs[j] );
					break;
				}
			}
		}
		
		publish(selDocs, publishMode);
	}
}
