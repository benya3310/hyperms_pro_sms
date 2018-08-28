var CONCRETE_ABSTRACTION_INCLUDED = true;

// test to see that the BrowserAbstraction class is defined.
if ( typeof BROWSER_ABSTRACTION_INCLUDED == "undefined" )
{
	alert("Fatal Error: you need to include \"BrowserAbstraction.js\" before you can subclass it.");
}

// browser abstraction layer utility class (emulates a static Java class)
function WindowsNav6Abstraction() {
	//subclass of BrowserAbstraction
	this.base = BrowserAbstraction;
	this.base();
	
	// declare methods
	this.getDivObj			= getDivObjMethod;
	this.getDivLeft			= getDivLeftMethod;
	this.getDivTop			= getDivTopMethod;
	this.getDivWidth		= getDivWidthMethod;
	this.getDivHeight		= getDivHeightMethod;
	this.setDivWidth		= setDivWidthMethod;
	this.setDivLeft			= setDivLeftMethod;
	this.setDivTop			= setDivTopMethod;
	this.setDivPos			= setDivPosMethod;
	this.addEventHandler	= addEventHandlerMethod;
	this.setBgImage			= setBgImageMethod;
	this.setVisibility		= setVisibilityMethod;
	this.setDisplay			= setDisplayMethod;
	
	// methods
	
	function getDivWidthMethod(objRef)
	{
		return ( objRef != null) ? parseInt(objRef.style.width) : null;
	}

	function getDivHeightMethod(objRef)
	{
		return ( objRef != null) ? parseInt(objRef.style.height) : null;
	}
	
	function setVisibilityMethod(objRef,isVisible)
	{
		objRef.style.visibility = isVisible;
	}
	
	function setDisplayMethod(objRef,displayValue)
	{
		objRef.style.display= displayValue;
	}

	function getDivObjMethod(divID, parentDivObj)
	{
		// parentDivObj is optional
		var objRef = null;
		objRef = document.getElementById(divID);
		return objRef;
	}
	
	function setBgImageMethod(objRef, imageName)
	{

		if ( objRef != null )
		{
			objRef.style.backgroundImage = 'url(' + imageName + ')';;
		}

	}

	function setDivWidthMethod(objRef,width)
	{
		if ( objRef != null )
		{
			objRef.style.width = width + "px";
		}
	}
	
	function getDivLeftMethod(objRef)
	{
		return (objRef != null) ? parseInt(objRef.style.left) : null;
	}

	function getDivTopMethod(objRef)
	{
		return (objRef != null) ? parseInt(objRef.style.top) : null;
	}

	
	function setDivLeftMethod(objRef, x)
	{
		if ( objRef != null )
		{
			objRef.style.left = x + "px";
		}
	}
	
	function setDivTopMethod(objRef, y)
	{
		if ( objRef != null )
		{
			objRef.style.top = y + "px";
		}
	}
	
	function setDivPosMethod(objRef, x, y)
	{
		if ( objRef != null )
		{
			objRef.style.left = x + "px";
			objRef.style.top = y + "px";
		}
	}

	function addEventHandlerMethod(objRef, eventStr, functionName)
	{
		if ( objRef == null )
		{
			objRef = document;
		}
		if ( eventStr == "MOVE" )
		{
			eval("objRef.onmousemove = " + functionName);
		}
		else if ( eventStr == "DOWN" )
		{
			eval("objRef.onmousedown = " + functionName);
		}
		else if ( eventStr == "UP" )
		{
			eval("objRef.onmouseup = " + functionName);
		}
		else if ( eventStr == "OUT" )
		{
			eval("objRef.onmouseout = " + functionName);
		}
	}
	// event handlers
	this.addEventHandler(null,"MOVE","mouseMoveHandler");
	this.addEventHandler(null,"UP","mouseUpHandler");
}
// this line sets up the object hierarchy
WindowsNavAbstraction.prototype = new BrowserAbstraction;

// global event handlers
function mouseMoveHandler(evt)
{
	if ( g_selectedWidget != null ) {
		g_selectedWidget.move(evt.pageX, evt.pageY);
		return false;			
	}
}

function mouseUpHandler(evt)
{
	if ( g_selectedWidget != null )
	{
		g_selectedWidget.deactivate(evt.pageX, evt.pageY);
	}
	g_selectedWidget = null;
}

function mouseDownHandler(evt)
{
	g_selectedWidget = getInstanceNameFromDivID(this.getAttribute("id"));

	if ( g_selectedWidget != null )
	{
		g_selectedWidget.activate(evt.pageX, evt.pageY);
		return false;
	}
}

function onMouseOutHandler(evt)
{
	if ( g_selectedWidget != null )
	{
		if ((evt.layerX) >= (g_selectedWidget.width + 10))
		{
			g_selectedWidget.deactivate();
		}
		return false;
	}
}