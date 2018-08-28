/*
	BrowserAbstractionFactory class
*/

function BrowserAbstractionFactory(balPath) 
{
	this.balClassName = null;
	var isSupported = true;
	
	// create BrowserDetect object
	var browserDetect = new BrowserDetect();
	
	if ( browserDetect.win ) 
	{
		// Supported Windows browsers
		if ( browserDetect.ie4up ) 
		{
			this.balClassName = "WindowsIEAbstraction";
		} 
		else if ( browserDetect.nav5up ) 
		{
			this.balClassName = "WindowsNav6Abstraction";
		}
	}
	
	if ( this.balClassName != null ) 
	{
		document.writeln('<script language="javascript" src="' + balPath + this.balClassName + '.js"></script>');
	}
	else
	{
		isSupported = false;
		alert("browser not supported");
	}
	
	// declare methods
	this.getAbstraction	= getAbstractionMethod;
	
	function getAbstractionMethod()
	{
		// Example: return new WindowsIEAbstraction();
		return eval('new ' + this.balClassName + '()');
	}
}