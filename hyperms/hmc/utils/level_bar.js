/*
<SCRIPT language=javascript src="level_bar.js"></SCRIPT>

================================================
DHTML Level bar widget - example of use in page
that contains a div named "levels1"
1. construct the level bar objects
2. call createIt()
3. call setIt();
================================================

var G_levels = new Array();
var G_nTotal = 10;
for (var i=0; i<G_nTotal; i++)
{
        var strName = "Name" + i;
	G_levels[ i ] = new LevelBar( strName, i*100 );
}

function createIt()
{
	var strHTML = "<font face=Arial size=2><table>";
	for (var i=0; i<G_nTotal; i++)
	{
		strHTML += G_levels[i].getHTML();
	}
        strHTML += '</table></font>';

	document.getElementById("levels1").innerHTML = strHTML;
        
	for (var i=0; i<G_nTotal; i++)
	{
		G_levels[i].init( document );
	}
}

function setIt()
{
	for (var i=0; i<G_nTotal; i++)
	{
		G_levels[i].setLevel( document.form.level.value*(i+1) );
	}
}
*/

var G_ID = 0;

function LevelBar( strName, nMax )
{
        if ( nMax <= 0 )
        {
            alert( "Invalid value for nMax, changing to 1" );
            nMax = 1;
        }
        G_ID++;
        this.m_strBarID         = "BAR" + G_ID;
        this.m_strLevelID       = "LEVEL" + G_ID;
        this.m_strNumberID      = "NUMBER" + G_ID;
        this.m_strTextID        = "TEXT" + G_ID;
        this.getHTML            = levelBarGetHTML;
        this.setLevel           = levelBarSetLevel;
        this.init               = levelBarInit;
        this.m_nBarWidth        = 150;
        this.m_strName          = strName;
        this.m_nMax             = nMax;
}

//function LevelBar.prototype.setLevel( nLevel )
function levelBarSetLevel( nLevel, strText )
{
    if ( nLevel < 0 )
    {
        nLevel = 0;
    }
    else
    if (nLevel > this.m_nMax)
    {
        nLevel = this.m_nMax;
    }

    this.m_levelObj.style.width = this.m_nBlockSize*nLevel;
    
    if (typeof strText == 'undefined')
    {
        this.m_oNumField.innerHTML  = nLevel;
        this.m_oTextField.innerHTML  = "";
        return;
    }

    //this.m_oTextField.innerHTML  = "(" + strText + ")";
    this.m_oNumField.innerHTML = "";
    this.m_oTextField.innerHTML  = strText;
}

//function LevelBar.prototype.init( doc )
function levelBarInit( doc )
{
    //alert( "init LevelID=[" + this.m_strLevelID + "] barID =[" + this.m_strBarID + "]");
    var levelObj		= doc.getElementById( this.m_strLevelID );
    var barObj			= doc.getElementById( this.m_strBarID );
    
    this.m_oNumField    = doc.getElementById( this.m_strNumberID );
    this.m_oTextField   = doc.getElementById( this.m_strTextID );
    this.m_levelObj     = levelObj;
    this.m_nBlockSize   = (this.m_nBarWidth - 2)/this.m_nMax;    

    this.m_levelObj.style.width = 0;
}

//function LevelBar.prototype.getHTML()
function levelBarGetHTML()
{
	var loadedcolor='navy' ;            // PROGRESS BAR COLOR
	var unloadedcolor='lightgrey';      // BGCOLOR OF UNLOADED AREA
	var barheight=15;                   // HEIGHT OF PROGRESS BAR IN PIXELS
	var barwidth=this.m_nBarWidth;      // WIDTH OF THE BAR IN PIXELS
	var bordercolor='black';            // COLOR OF THE BORDER
	
	var blocksize=(barwidth-2)/100;
	barheight=Math.max(4,barheight);
	var loaded=0;
	var perouter=0;
	var perdone=0;
	var strHTML='<tr width=' + this.m_nBarWidth + 100 + '>';

    strHTML+='<td align=right width=80>' + this.m_strName + '</td>'
    strHTML+='<td width=' + (this.m_nBarWidth + 10) + '><div id="' + this.m_strBarID + '" style="position:relative; visibility:visible; background-color:'+bordercolor+'; width:'+barwidth+'px; height:'+barheight+'px;">';
    strHTML+='<div style="position:absolute; top:1px; left:1px; width:'+(barwidth-2)+'px; height:'+(barheight-2)+'px; background-color:'+unloadedcolor+'; z-index:100; font-size:1px;"></div>';
    strHTML+='<div id="' + this.m_strLevelID + '" style="position:absolute; top:1px; left:1px; width:0px; height:'+(barheight-2)+'px; background-color:'+loadedcolor+'; z-index:100; font-size:1px;"></div>';
    strHTML+='</div></td>';
    strHTML+='<td width=10 id="' + this.m_strNumberID + '">0</td>'
    strHTML+='<td width=200 align="left" id="' + this.m_strTextID + '">0</td>'
    strHTML+='</tr>'
	
    return strHTML;
}