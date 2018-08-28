var ABSTRACT_WIDGET_INCLUDED = true;

// test to see that the AbstractSlider class is defined.
if ( typeof CONCRETE_ABSTRACTION_INCLUDED == "undefined" )
{
	alert("Fatal Error: you need to include one of the concrete BrowserAbstraction subclasses before using the AbstractWidget class.");
}

// GLOBALS (these are emulating static (aka class) variables for the AbstractWidget class)
var g_selectedWidget = null;
var g_widgetPath = "";

// CONSTANTS
var WIDGET_DIV_DELIMITER = "_";

function AbstractWidget(browserAbstractionLayer, instanceName)
{
	//this.id = id;
	this.browserAbstractionLayer = browserAbstractionLayer;
	this.instanceName = instanceName;

	// method declarations
	this.activate = activateMethod;
	this.deactivate = deactivateMethod;
	this.draw = drawMethod;
	this.readHtml = readHtmlMethod;
	this.setPosition = setPositionMethod;
	this.move = moveMethod;

	function setPositionMethod(x,y) 
	{
		throwUndefinedMethodException("setPosition");
	}

	function activateMethod(x,y) 
	{
		throwUndefinedMethodException("activate");
	}

	function deactivateMethod(x,y) 
	{
            // it's OK to do nothing here, the handler that called this method already does enough
            if (typeof onVolumeChange == 'undefined')
            {
                return;
            }
            
            onVolumeChange( this );
	}

	function moveMethod(x,y) 
	{
		// it's OK to do nothing here, we just need a placeholder for Widgets that done catch move events
	}

	function drawMethod() 
	{
		// we do not want to make this required because we might have
		// the need to get the data from the page itself.
		// throwUndefinedMethodException("draw");
	}

	function readHtmlMethod() 
	{
		// we do not want to make this required because we might have
		// the need to get the data from the page itself.
		// throwUndefinedMethodException("draw");
	}
	
}

// static (class) methods
function setWidgetPath(relativePath)
{
	g_widgetPath = relativePath;
}

//Utility functions
function getInstanceNameFromDivID(htmlID)
{
        var objRef = G_KnobDivIDMap[ htmlID ];
	return objRef;
}

function throwUndefinedMethodException(methodName)
{
	alert("The method you have called, \"" + methodName + "\", has not been implemented.");
}