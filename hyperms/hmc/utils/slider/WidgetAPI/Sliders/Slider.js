var G_SliderBarID = 1;
var SLIDER_INCLUDED = true;
var G_KnobDivIDMap = new Array();
var G_nXPAD = 10;

function DL_GetElementLeft(eElement)
{
    var nLeftPos = eElement.offsetLeft;          // initialize var to store calculations
    var eParElement = eElement.offsetParent;     // identify first offset parent element  
    while (eParElement != null)
    {                                            // move up through element hierarchy
        nLeftPos += eParElement.offsetLeft;      // appending left offset of each parent
        eParElement = eParElement.offsetParent;  // until no more offset parents exist
    }
    return nLeftPos;                             // return the number calculated
}
 
function DL_GetElementTop(eElement)
{
    var nTopPos = eElement.offsetTop;            // initialize var to store calculations
    var eParElement = eElement.offsetParent;     // identify first offset parent element  
    while (eParElement != null)
    {                                            // move up through element hierarchy
        nTopPos += eParElement.offsetTop;        // appending top offset of each parent
        eParElement = eParElement.offsetParent;  // until no more offset parents exist
    }
    return nTopPos;                              // return the number calculated
}
 


// test to see that the AbstractWidget class is defined.
if ( typeof ABSTRACT_WIDGET_INCLUDED == "undefined" )
{
	alert("Fatal Error: you need to include \"AbstractWidget.js\" before you can subclass it.");
}

function Slider(browserAbstractionLayer, strLabel, nRange )
{
    this.m_strLabel = strLabel;
    this.m_SliderBarID = G_SliderBarID;
    this.m_nRange = nRange;
    
    //Slider is a subclass of AbstractWidget
    this.base = AbstractWidget;
    this.instanceName = "mySlider" + G_SliderBarID;
    
    var strKnobID = this.instanceName + WIDGET_DIV_DELIMITER + "knob";
    G_KnobDivIDMap[ strKnobID ] = this;

    this.base(browserAbstractionLayer, this.instanceName);
    G_SliderBarID++;

	// default values for all inherited classes. Override these in the subclass, not here.
	this.sliderKnobDivObj = null;
	this.sliderBarDivObj = null;
	this.sliderBarWidth = 159;
	this.sliderBarLeft = 0;
	this.sliderKnobWidth = 29;
	this.sliderKnobLeft = 0;
	
	this.imagePath = g_widgetPath + "Sliders/images/";
	this.KNOB_IMAGE = this.imagePath + "slider.gif";
	this.BAR_IMAGE = this.imagePath + "bar.gif";
	
	this.offsetX = 0;

	//Slider method declarations
	this.draw		= drawMethod;
	this.activate		= activateMethod;
	this.setPosition	= setPositionMethod;
	this.getValue		= getValueMethod;
        this.setValue           = setValueMethod;
	this.move		= moveMethod;
	this.moveKnob		= moveKnobMethod;
        this.getHTML            = getHTMLMethod;

	function getValueMethod()
	{
		var retVal = null;
		if ( this.sliderBarWidth - this.sliderKnobWidth >= 0 )
		{
			retVal = Math.round( this.sliderKnobLeft / ( this.sliderBarWidth - this.sliderKnobWidth ) * this.m_nRange );
		}
		return retVal;
	} // end getValueMethod

    function setValueMethod( nValue )
    {
        var newX = Math.round( nValue * ( this.sliderBarWidth - this.sliderKnobWidth ) / this.m_nRange );
        this.sliderKnobLeft = newX;
        this.browserAbstractionLayer.setDivLeft(this.sliderKnobDivObj,newX);
        this.sliderValDivObj.innerHTML = nValue;
    }
    
    function getHTMLMethod()
    {
        var nSliderID = this.m_SliderBarID;
        var strHTML = '<tr>';
        strHTML += '<td width=30 align=right>'
        strHTML += this.m_strLabel;
        strHTML += '</td>'

        strHTML += '<td align=right width='
        strHTML += this.sliderBarWidth + G_nXPAD;

        strHTML += ' id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'table">';
        strHTML += '<div class="sliderBar" id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'bar">';
        strHTML += '<div class="sliderKnob" id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'knob">';
        strHTML += '</div></div></td>'

        strHTML += '<td align=left id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'value">0</td>';

        strHTML += '</tr>';
        return strHTML;
    }

    /*
    function getHTMLMethod()
    {
        var nSliderID = this.m_SliderBarID;
        var strHTML = '<tr>';
        strHTML += '<td width=100>'
        strHTML += this.m_strLabel;
        strHTML += '</td>'
        
        strHTML += '<td width=40 align=right id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'table">';
        strHTML += '<div class="sliderBar" id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'bar">';
        strHTML += '<div class="sliderKnob" id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'knob">';
        strHTML += '</div></div></td>'

        strHTML += '<td align=right width='
        strHTML += this.sliderBarWidth;
        strHTML += ' id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'value">0</td>';

        strHTML += '</tr>';
        return strHTML;
    }
    */

    /*
    function getHTMLMethod()
    {
        var nSliderID = this.m_SliderBarID;
        var strHTML = '<tr><td width=100>'
        strHTML += this.m_strLabel;
        strHTML += '</td>'
        strHTML += '<td align=right width=40 id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'value">0</td>';
        strHTML += '<td id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'table">';
        strHTML += '<div class="sliderBar" id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'bar">';
        strHTML += '<div class="sliderKnob" id="mySlider' + nSliderID + WIDGET_DIV_DELIMITER + 'knob">';
        strHTML += '</div></div></td></tr>';
        return strHTML;
    }
    */
        
	function drawMethod() 
	{
		// make references to these newly draw objects
        this.sliderValDivObj = this.browserAbstractionLayer.getDivObj(this.instanceName + WIDGET_DIV_DELIMITER + "value");
		this.sliderBarDivObj = this.browserAbstractionLayer.getDivObj(this.instanceName + WIDGET_DIV_DELIMITER + "bar");
		this.sliderKnobDivObj = this.browserAbstractionLayer.getDivObj(this.instanceName + WIDGET_DIV_DELIMITER + "knob", this.sliderBarDivObj);
		
		this.browserAbstractionLayer.setBgImage(this.sliderKnobDivObj, this.KNOB_IMAGE);
		this.browserAbstractionLayer.setBgImage(this.sliderBarDivObj, this.BAR_IMAGE);

		this.browserAbstractionLayer.setDivWidth(this.sliderBarDivObj, this.sliderBarWidth);
		this.browserAbstractionLayer.setDivWidth(this.sliderKnobDivObj, this.sliderKnobWidth);
		this.sliderBarWidth = this.browserAbstractionLayer.getDivWidth(this.sliderBarDivObj);
		this.sliderKnobWidth = this.browserAbstractionLayer.getDivWidth(this.sliderKnobDivObj);

        var objColumn = this.browserAbstractionLayer.getDivObj(this.instanceName + WIDGET_DIV_DELIMITER + "table");
        x = DL_GetElementLeft(objColumn) + G_nXPAD;
        y = DL_GetElementTop(objColumn) + (objColumn.offsetHeight / 2) - 6;

		this.setPosition(x,y);

		// attach event handlers
		this.browserAbstractionLayer.addEventHandler(this.sliderKnobDivObj,"DOWN","mouseDownHandler");
	} // end of drawMethod

	function moveKnobMethod(x,y) 
	{
		// FIX: what does this next line do?
		//window.event.returnValue = false;
		var newX = x - this.sliderBarLeft - this.offsetX;

		if ( newX < 0 )
		{
			newX = 0;
		}
		else if ( newX > ( this.sliderBarWidth - this.sliderKnobWidth ) )
		{
			newX = this.sliderBarWidth - this.sliderKnobWidth;
		}

		this.browserAbstractionLayer.setDivLeft(this.sliderKnobDivObj,newX);
		this.sliderKnobLeft = newX;
	} // end of moveKnobMethod
	
	function moveMethod(x,y)
	{
		this.moveKnob(x,y);
                this.sliderValDivObj.innerHTML = this.getValue();
	}
	
	function activateMethod(mouseX, mouseY) 
	{
		this.offsetX = mouseX - this.sliderBarLeft - this.sliderKnobLeft;
		g_selectedWidget = this;
	} // end of activateMethod

	function setPositionMethod(x, y) 
	{
		this.browserAbstractionLayer.setDivPos(this.sliderBarDivObj,x,y);
		this.browserAbstractionLayer.setDivPos(this.sliderKnobDivObj,0,0);
		this.sliderBarLeft = this.browserAbstractionLayer.getDivLeft(this.sliderBarDivObj);
		this.sliderKnobLeft = this.browserAbstractionLayer.getDivLeft(this.sliderKnobDivObj);
	} // end of setPositionMethod

} //end of Slider class

// this line sets up the object hierarchy
Slider.prototype = new AbstractWidget;