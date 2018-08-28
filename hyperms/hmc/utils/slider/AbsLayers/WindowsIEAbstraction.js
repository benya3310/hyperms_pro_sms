var CONCRETE_ABSTRACTION_INCLUDED = true;

// test to see that the BrowserAbstraction class is defined.
if ( typeof BROWSER_ABSTRACTION_INCLUDED == "undefined" )
{
	alert("Fatal Error: you need to include \"BrowserAbstraction.js\" before you can subclass it.");
}

// browser abstraction layer utility class (emulates a static Java class)
function WindowsIEAbstraction() {
	//WindowsIEAbstraction is a subclass of BrowserAbstraction
	this.base = BrowserAbstraction;
	this.base();

	// declare methods
	this.getDivObj			= getDivObjMethod;
	this.getDivLeft			= getDivLeftMethod;
	this.getDivWidth		= getDivWidthMethod;
	this.getDivTop			= getDivTopMethod;
	this.getDivHeight		= getDivHeightMethod;
	this.setDivWidth		= setDivWidthMethod;
	this.setDivLeft			= setDivLeftMethod;
	this.setDivTop			= setDivTopMethod;
	this.setDivPos			= setDivPosMethod;
	this.addEventHandler	= addEventHandlerMethod;
	this.setBgImage 		= setBgImageMethod;
	this.setVisibility		= setVisibilityMethod;
	this.setDisplay			= setDisplayMethod;

	// methods
	function getDivObjMethod(divID, parentDivObj)
	{
		// parentDivObj is optional if you want/need to traverse the DOM explicitly
		//FIX: this IE function should work
		//return getElementByID(divID);
		return eval(divID);
	}
	
	function getDivLeftMethod(objRef)
	{
		return ( objRef != null ) ? objRef.offsetLeft : null;
	}
	
	function getDivWidthMethod(objRef)
	{
		return ( objRef != null ) ? objRef.offsetWidth : null;
	}

	function getDivTopMethod(objRef)
	{
		return ( objRef != null ) ? objRef.offsetTop : null;
	}

	function getDivHeightMethod(objRef)
	{
		return ( objRef != null ) ? objRef.offsetHeight : null;
	}

	function setVisibilityMethod(objRef,isVisible)
	{
		objRef.style.visibility = isVisible;		
	}

	function setDisplayMethod(objRef,displayValue)
	{
		objRef.style.display = displayValue;
	}
	
	function setDivWidthMethod(objRef,width)
	{
		if ( objRef != null )
		{
			objRef.style.width = width + "px";
		}
	}

	function setDivLeftMethod(objRef, x)
	{
		if ( objRef != null )
		{
			objRef.style.left = x + "px";
		}
	}
	
	function setBgImageMethod(objRef, imageName)
	{
		if ( objRef != null )
		{
			//debug("bg: " + objRef.style.backgroundImage);
			objRef.style.backgroundImage = 'url(' + imageName + ')';
		}
	}
	
	function setDivTopMethod(objRef, x)
	{
		if ( objRef != null )
		{
			objRef.style.top = x + "px";
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
		else if ( eventStr == "UP" )
		{
			eval("objRef.onmouseup = " + functionName);
		}
		else if ( eventStr == "DOWN" )
		{
			eval("objRef.onmousedown = " + functionName);
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
WindowsIEAbstraction.prototype = new BrowserAbstraction;

// global event handlers
function mouseMoveHandler()
{
	if ( g_selectedWidget != null ) {
		g_selectedWidget.move(window.event.x, window.event.y);
		return false;
	}
}

function mouseUpHandler()
{
	if ( g_selectedWidget != null )
	{
		g_selectedWidget.deactivate(window.event.x, window.event.y);
	}
	g_selectedWidget = null;
}

function mouseDownHandler()
{
	g_selectedWidget = getInstanceNameFromDivID(this.id);
	if ( g_selectedWidget != null )
	{
		g_selectedWidget.activate(window.event.x, window.event.y);
		return false;
	}
}

function onMouseOutHandler(evt)
{

	if ( g_selectedWidget != null )
	{
		var parentEl = window.event.toElement;
	
		if (parentEl)
		{
			var isNotChildofDiv = false;
	
			while (parentEl = parentEl.parentElement)
			{
				if (g_selectedWidget.selectedElement != -1 && parentEl == g_selectedWidget.divObjArr[g_selectedWidget.selectedElement])
				{
					var isNotChildofDiv = true;
				}
			}
	
			if (!isNotChildofDiv)
			{
				g_selectedWidget.deactivate();
			}
		}
		return false;
	}

}
