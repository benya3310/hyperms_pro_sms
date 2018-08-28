/**
 * @author Yaniv
 */ 
function CellularCellRenderer( strID, strCellParams, cssClass )
{
	
	var strHTML = "";
	var nMaxRxLevel = 63;
	if ( strCellParams == null )
		return strHTML;
	//CellID,BCCH,RXLevel
	var arCellParams = strCellParams.split(',');
	var strCellID = arCellParams[0];
	var strBCCH   = arCellParams[1];
	var strRx     = arCellParams[2];
	var strTBBGColor;
	var barBGColor;
	var strRXText = (-111 + parseInt(strRx)).toString() + " dBm";
	var levelBar  = RXLevelBar( strRx, nMaxRxLevel,getBarFullBGColor(strID) );
	strHTML  = "<div id='cell" + strCellID + "' class='channelInfo'><table ";
	//strHTML += ( strID == "1" )? " class='CelluCell.SelCellTable'>" : " class='CelluCell.CellTable'>";		
	strHTML += "<tr><td class='" + cssClass + "'>CellID: </td>" + "<td class='" + cssClass + "'>" +strCellID + "</td></tr>";
	strHTML += "<tr><td class='" + cssClass + "'>BCCH: </td>"  + "<td class='" + cssClass + "'>" + strBCCH   + "</td></tr>";
	strHTML += "<tr><td class='" + cssClass + "' colspan='2'>" + levelBar + " " + strRXText + "</td></tr>";
	strHTML += "</table></div>"
	
	return strHTML;
	
}
function getBarFullBGColor(strCellNum)
{
	return ( strCellNum == "1" ) ? "#800000" : "#800080";
}
function RXLevelBar(nVal, nMaxVal, strFullColor){
	var	nFull= parseInt(nVal/nMaxVal*100);	
	var nEmpty = 100-nFull;	
	var strBarHTML = "<table border=1 bordercolor=#901C3A width =100% height=15 cellspacing=0><tr><td height=100% width=" 
				+ nFull.toString()  + "% bgcolor=" + strFullColor + "></td><td width=" 
				+ nEmpty.toString() + "%bordercolor=white bgcolor=white height=100%></td></tr></table>";	
	return strBarHTML;
}

function ModuleComboRenderer(elementId, cssClass, selectedItem){

	var strHtml = "<select id=" + elementId.toString() + " class = " + cssClass;
	strHtml += " onchange ='getSelectedModule()'>"	
	for (var i=1; i <= 4; i++){
		strHtml  += "<option value=" + i.toString() ;
		if (selectedItem == i){
			strHtml += " selected ";
			}
		strHtml += ">";
		strHtml +=  "<a href='javascript:newwindow()'>"+ i.toString() +"</a>";
		strHtml += "</option>";
	}
	strHtml += "</select>";
	return strHtml;	
}
function getButtonHTML(strValue ,strOnClick)
{
	return "<input type='BUTTON' value='" + strValue + "' onclick='" + strOnClick + "' class='button'>";
}