
// LCR Parameters - channels, groups, rules, filters and time periods.
var strCmdOpcode30 = "SendGenericPacket 30:/x1,0/ALCR/I830/Q";

// Rules time periods.
var strCmdOpcode34 = "SendGenericPacket 34:/x1,0/ALCR/I834/Q";

var g_arZebra = { 0:"e4e4e4", 1:"f2f2f2" };

function PollLcr(opcode){
	
	switch(opcode){
		case "30":
			parent.frames[0].SendCommand(strCmdOpcode30);
			return;
		case "34":
			parent.frames[0].SendCommand(strCmdOpcode34);
			return;
	}
}

//----------------------------------------------
function RegExMatch(b,c) {
	var ret = false;
  var re = new RegExp(b);
  if (c.match(re)) {
  	if(c.match(re).lastIndex == c.length){
    	ret = true;
    }
  } 
  return ret;
}


//----------------------------------------------

var hex = "0123456789ABCDEF";
function hex2num(a)
{
    var retval = 0x00;
    var x;
    var A = a.toString().toUpperCase();
    var i = 0;

    while (i < A.length)
    {
        retval <<= 4;
        x = hex.indexOf(A.charAt(i));
        if (x < 0)
        {
            alert("invalid hex digit, can only be 0 to F");
            break;
        }
        retval += x;
	i++;
    }
    return retval;
}

function num2bin(n)
{
    var retval = "";
    var bitmask = 0x80;

    while (bitmask >= 1)
    {
        retval += (n & bitmask) ? "1" : "0";
        bitmask >>= 1;
    }
    return retval;
}

function bin2num(a)
{
    var retval = 0;
    var x;
    var i = 0;

    while (i < a.length)
    {
        retval *= 2;
        x = a.charAt(i);
        if ((x != '0') && (x != '1'))
        {            
            alert("invalid binary digit '"+x+"', can only be 0 or 1");
            break;
        }
        retval += x - '0';
	i++;
    }
    return retval;
}

function num2hex(num) {
	return "0123456789ABCDEF".split("")[num]
}

function SleepFor(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}




/********************************************

	GUI STARTS HERE 

*********************************************/

function GroupComboRenderer(elementId, cssClass, selectedItem){

	var hhtml = "<select id=" + elementId.toString() + " class = " + cssClass + ">";
	
	hhtml += "<option value=''>-none-</option>";
	
	for (var i=1; i <= LCRGroupCollection.groups.length ; i++){
		hhtml += "<option value=" + i.toString() ;
		if (selectedItem == i){
			hhtml += " selected ";
			}
		hhtml += ">";
		
		hhtml += LCRGroupCollection.getName(i);
		
		hhtml += "</option>";
	}
	hhtml += "</select>";
	return hhtml ;	
}


function RoutingGroupRenderer(elementId, cssClass, selectedItem){

//    return GroupComboRenderer("group" + elementId + "RoutingCombo", cssClass, selectedItem);
    
	var hhtml = "<select id=group" + elementId.toString() + "RoutingCombo class = " + cssClass + ">";
	
	hhtml += "<option value=\"0\">LCR</option>";
	
	//The above line is not the same as on GroupComboRenderer (option 0 is "LCR" here, and "-none-" over there)
	
	for (var i=1; i <= LCRGroupCollection.groups.length; i++){
		hhtml += "<option value=" + i.toString() ;
		if (selectedItem == i){
			hhtml += " selected ";
			}
		hhtml += ">";
		
		hhtml += LCRGroupCollection.getName(i);
		
		hhtml += "</option>";
	}
	hhtml += "</select>";
	return hhtml ;	
    
}

function FilterComboRenderer(elementId, cssClass, selectedItem){
	var hhtml = "<select id = '" + elementId.toString() + "' class = '" + cssClass.toString() + "'>";
	hhtml += "<option value=''>-none-</option>";
	var filterNumber = GLBCardConfig.NumberOfFilters();
	for (var i=1; i<=filterNumber; i++){
		hhtml += "<option value=" + i.toString() ;
		if (selectedItem == i ){ hhtml += " selected "; }
		hhtml += ">";
		hhtml += "Filter " + i.toString();
		hhtml += "</option>";
	}	
	hhtml += "</select>";
	return hhtml ;

}

function SourceTypeComboRenderer(elementId, cssClass, selectedItem){

	var hhtml = "<select id=" + elementId + " class = " + cssClass + ">";
	hhtml += "<option value=0";
	if (selectedItem == 0){hhtml += " selected "; }
	hhtml +=	">Bidirectional</option>";
	hhtml += "<option value=1";
	if (selectedItem == 1){hhtml += " selected ";	}
	hhtml +=	">Outgoing Only</option></select>";
	return hhtml;
}

function CyclicComboRenderer(elementId , cssClass, selectedItem){

	var hhtml = "<select id=group" + elementId.toString() + "CyclicCombo class = " + cssClass + ">";
	hhtml += "<option value=0" ;
	if (selectedItem == 0){hhtml += " selected "; }
	hhtml +=  ">No</option>";
	hhtml += "<option value=1"; 
	if (selectedItem == 1){hhtml += " selected ";	}
	hhtml +=   ">Yes</option></select>";
	return hhtml;
}

/// Rule Page Renderers

function RenderRuleZeroTable(lcrDataDefaultRule, lcrDefaultDataDB, lcrDefaultTextRule, lcrDefaulTextDB){
	
	var defaultRule = "<table bgcolor='#FFEF8C'><tr><td class='tableheader'>Default Rule:</td>";
	defaultRule += "<td class='TableCell'>" 
		+ GroupComboRenderer("rule0groupC", "TextBox",lcrDataDefaultRule) + "</td><td>"+RendeCheckBoxCell('1', lcrDefaultDataDB,'ACR')+"</td><tr>";

    defaultRule += "<tr><td class='tableheader'>Default Text Rule:</td><td class='TableCell'>";
    defaultRule += GroupComboRenderer("rule0groupD", "TextBox",lcrDefaultTextRule)   + "</td><td>"+RendeCheckBoxCell('2', lcrDefaulTextDB, 'ACR')+"</td></tr>";
    
    //defaultRule += "<td class='TableCell'>" RenderGroupReportCell('1001', lcrDefaulTextDB[1])  + "</td></tr>"
    
	//defaultRule +=  "<tr><td colspan='2' class=\"tableCell\"><input type=\"button\" value=\"Save Default Rules\"  class=\"Button\" onclick=\"WriteDefaultRule()\"></td>";
	defaultRule += "</table>";

	return defaultRule;
}


function RenderTFHeader(numOfTf){
	var hhtml = "";
	for (x=1; x <= numOfTf; x++){
		hhtml    += "<td class='tableHeader'>TF " + x + "</td>";
	}
	return hhtml;
//"<td class='tableHeader'>TF 1</td><td class='tableHeader'>TF 2</td><td class='tableHeader'>TF 3</td><td class='tableHeader'>TF 4</td>
}

function RenderLcrParams( arParams )
{
	var hhtml = "";
	if (arParams != "") hhtml += "<td class='tableHeader' align=center>NP</td>";
	return hhtml;
}

function RenderRulesTable(arLcrData, numOfTf, arLcrParams){
	
		var hhtml = "<br><table bgcolor='#FFEF8C'><tr><td class='tableheader'>Rule #</td><td class='tableheader'>Prefix</td><td class='tableHeader'>1st Group</td>" + 
					"<td class='tableHeader'>2nd Group</td><td class='tableHeader'>3rd Group</td> <td class='tableHeader'>ACR</td>" +
					RenderLcrParams(arLcrParams[ 1 ]) +
					RenderTFHeader(numOfTf) +
					"<tr>";
		var rulesNumber = GLBCardConfig.NumberOfRules();
		
		for (var i=1; i <= rulesNumber; i++){
		
			hhtml += "<tr bgcolor='#" + g_arZebra[i%2] + "'>";
			
			hhtml += RenderRuleNumberCell(i);
			hhtml += RenderPrefixCell(i,arLcrData[i][1]);
			hhtml += RenderGroupsSquenceCells(i,arLcrData[i][2],arLcrData[i][3],arLcrData[i][4]);
            hhtml += RenderGroupReportCell(i, arLcrData[i][6]);
            hhtml += RenderLcrParamCells(i, arLcrParams[ i ]);
			if(numOfTf > 0)
			{
				hhtml += RenderTFBoxesCell(i-1,arLcrData[i][5],numOfTf);
			}
			
			hhtml += "</tr>";
		}
		hhtml += "</table>";
	
	return hhtml;
}
function RenderSaveButton(elementId){
	return "<td class=\"tableCell\"><input type=\"button\" value=\"Save\"  class=\"Button\" onclick=\"WriteRule('" + elementId.toString() + "')\"></td>";
}

function RenderRuleNumberCell(elementId){
	return "<td class='TableCell'>Rule " + elementId.toString() + "</td>";
}
function RenderPrefixCell(elementId, selectedItem){
	var controlId = "rule" + elementId.toString() + "prefix";
	return "<td class='TableCell'><input type='text' id=" + controlId 
		+ " class='TextBox' value='" + selectedItem +  "' onchange=\"IsValidInput('regex','" + controlId +"')\"></td>";
}

function RenderGroupsSquenceCells(elementId, GroupCSelectedItem, GroupDSelectedItem, GroupESelectedItem ){
	
	var hhtml = "<td class='TableCell'>" 
		+ GroupComboRenderer("rule" 
		+ elementId.toString() 
		+ "groupC", "TextBox",GroupCSelectedItem) 
		+ "</td>";
		
		hhtml += "<td class='TableCell'>" 
		+ GroupComboRenderer("rule" 
		+ elementId.toString() 
		+ "groupD", "TextBox",GroupDSelectedItem) 
		+ "</td>";
		
		hhtml += "<td class='TableCell'>" 
		+ GroupComboRenderer("rule" 
		+ elementId.toString() 
		+"groupE", "TextBox", GroupESelectedItem) 
		+ "</td>";
	return hhtml;
}

function RenderLcrParamCells(elementId, selParams)
{
	var hhtml = "";

	if (selParams != "")
	{
		hhtml += "<td class='tableCell' align=center><input type='checkbox' id='npChk" + elementId.toString() + "'";
		if (selParams[ 0 ] == '1')
		{
			hhtml += " checked ";
		}
		hhtml += "></td>";	
	}
	return hhtml;
}

function reverse(input) {
  
  var output = 0

  for (i = 0; i <= input.length; i++) {
    output = input.charAt (i) + output;
  }

  return output;
} 
function RenderTFBoxesCell(ruleNum, tfData, numOfTf){
	var hhtml = "";
	var arTFData = GetTimeFramesArray(tfData); //.reverse();
    
	for (i=0; i<numOfTf; i++){
	    
		hhtml += "<td class='tableCell' align=center><input type='checkbox' id='chk" + ruleNum.toString() + "-" + (i+1).toString() + "'";
		if (arTFData[i] == 1){ hhtml += " checked ";}
		hhtml +=  " onclick='UpdateRuleTF(" + (ruleNum).toString() + "," + i + ")' ></td>";	
	}
	return hhtml;

}

//Get a number that represents the or-ed ("|") values of the frames.
//returns an array with 4 cells, each cell for time frame accordingally.
function GetTimeFramesArray(lcrData){

	return num2bin(hex2num(lcrData)).substr(4).split("").reverse();
}


/// Group Page Renderers

function RenderGroupTable(arLcrData){
	
		//        
		var grp = new LCRGroup(arLcrData[1]);
        var bIntelliRouteSupport = ( grp.intelligentR == undefined ) ? false : true ;
        var hTDSel = "<tr><td class=tableCell colspan=7 align=right><input type='checkbox' onclick='selectDeselect()' checked='false' id='selectAllCheck'><span class='normalText' id='selectAllText'>Deselect All</span></td><tr>";
        var hhtml ="<table bgcolor='#FFEF8C'><tr>" +
		"<td class='tableheader'>Group #</td>" +
		"<td class='tableheader'>Group Name</td>" + 
		"<td class='tableheader'>Cyclic</td>" + 
		"<td class='tableHeader'>In Filter</td>" +
		"<td class='tableHeader'>Out Filter</td>" +
		"<td class='tableheader'>Route to</td>";
        //check if intelligent rounting supported
        if ( bIntelliRouteSupport )
        {
            hhtml += "<td class='tableHeader'>Int. Routing</td>";
            hTDSel = "<tr><td class=tableCell colspan=8 align=right>"
            + "<input type='checkbox' onclick='selectDeselect()' checked='false' id='selectAllCheck'>"
            + "<span class='normalText' id='selectAllText'>Deselect All</span></td><tr>";
        }        
           
		hhtml += "<td class='tableHeader'>Report Calls</td>" +
        
        "<tr>";
     
	   hhtml += hTDSel;
	
	
	
	for (var i=1; i < arLcrData.length; i++){
		
		var group = new LCRGroup(arLcrData[i]);		
        
		hhtml += "<tr bgcolor='#" + g_arZebra[i%2] + "'>";
		hhtml += RenderGroupNumberCell(group.number);
		// ADD
		hhtml += RenderGroupName(i,group.name);
		hhtml += RenderCyclicCell(i, group.cyclic);
		hhtml += RenderGroupInFilter(i, group.inFilter);
		hhtml += RenderFilterCell(i, group.filter);
		hhtml += RenderGroupRoutingCell(i, group.routeGroup);
               
        if (bIntelliRouteSupport)      
            hhtml += RenderGroupIntelliRoute(i, group.intelligentR);
            
		hhtml += RenderGroupReportCell(i, group.report);
		// ADD

		hhtml += "</tr>";
	}
	hhtml += "</table>";
	return hhtml;
}

function RenderGroupName(elementId,groupName){
	var hhtml = "<td class='tableCell'>"
	hhtml += "<input type='text' id='groupName_" + elementId.toString() + "' value='" + groupName + "' maxlength=100/></td>";
	return hhtml;
}
function RenderGroupInFilter(elemId,groupInFilter){
	return "<td class='tableCell'>" + GroupInFilterCombo(elemId, 'comboBox', groupInFilter) + "</td>";
}

function GroupInFilterCombo(elementId, cssClass, selectedItem){
	var hhtml = "<select id='GroupInFilter" + elementId + "' class = " + cssClass + ">";
	var inFilterNumber = GLBCardConfig.numberOfInFilters;
	hhtml += "<option value='0'>-none-</option>"; 
	for (var i=1; i <= inFilterNumber; i++){
		hhtml += "<option value='" + i.toString() + "'";
		if (selectedItem == i){
			hhtml += " selected ";
			}
		hhtml += ">" + "Filter " + i.toString() + "</option>";
	}
	hhtml += "</select>";
	return hhtml;
}

function RenderGroupSaveButton(elementId){
	//sendGroupCommand
	return "<td class=\"tableCell\"><input type=\"button\" value=\"Save\" class=\"Button\" onclick=\"sendGroupCommand('" + elementId.toString() + "')\"></td>";	
}
function RenderGroupNumberCell(elementId){
	return "<td class='TableCell'>Group " + elementId.toString() + "</td>";
}
function RenderReadOnlyCell(elementVal){
	return "<td class='TableCell' align='center'>" + elementVal + "</td>";
}

function RenderGroupRoutingCell(elementId, lcrData){
	var hhtml = "<td class='TableCell'>";
	hhtml += RoutingGroupRenderer(elementId, "comboBox",lcrData);
	hhtml += "</td>";
	return hhtml;

}

function RenderGroupReportCell(elementId, lcrData){

	var hhtml = "<td class='tableCell' align=center><input type='checkbox' id='reportChk" + elementId.toString() + "'";
		if (lcrData.length > 0){ hhtml += " checked ";}
		hhtml +=  "></td>";	
	return hhtml;
}

function RenderGroupIntelliRoute(elementId, lcrData){

	var hhtml = "<td class='tableCell' align=center><input type='checkbox' id='intelliRouteChk" + elementId.toString() + "'";
    if (lcrData == "1")
        { 
            hhtml += " checked ";
        }
    hhtml +=  "></td>";	
        
	return hhtml;
}

function RendeCheckBoxCell(elementId, lcrData, cbText){

	var hhtml = "<td class='tableCell' align=center><input type='checkbox' id='cb" + elementId.toString() + "'";
		if (lcrData.length > 0){ hhtml += " checked ";}
		hhtml +=  ">"+cbText+"</td>";	
	return hhtml;
}
function RenderYesNoCheckBoxCell(elementId, lcrData, cbText){

	var hhtml = "<td class='tableCell' align=center><input type='checkbox' id='cb" + elementId.toString() + "'";
		if (lcrData > 0){ hhtml += " checked ";}
		hhtml +=  ">"+cbText+"</td>";	
	return hhtml;
}
function RenderCyclicCell(elementId, lcrData){
	var hhtml = "<td class='TableCell'>";
	hhtml += CyclicComboRenderer(elementId, "comboBox",lcrData);
	hhtml += "</td>";
	return hhtml;
}

function RenderFilterCell(elementId, lcrData){
	var hhtml = "<td class='TableCell'>";
	hhtml += FilterComboRenderer("group" + elementId.toString() + "FilterCombo","comboBox",lcrData);
	hhtml += "</td>";
	return hhtml;
}
///LCR Settings - Features Renders
function RenderSettingsTable(arLcrData)
{
	var hhtml="<table bgcolor='#FFEF8C'><tr><td class='tableheader'>Feature</td><td class='tableHeader'>Enable</td><tr>";
    //<td class='tableheader'>Parameter Desc.</td><td class='tableheader'>Parameter Val.</td><td class='tableHeader'>Enable</td><tr>";
    var j = 1;
	
    for (i=1; i <= NumOfSettings(); i++)
	{
		if( arLcrData[i] != null )
		{
			hhtml += "<tr bgcolor='#" + g_arZebra[j%2] + "'>";
			hhtml += RenderSettingsNameCell(i, arSettingsDesc[i]);                        
			//hhtml += RenderSettingsNameCell(i,arSettingsParam[i]);//arLcrData[i]);
			//hhtml += RenderSettingsParamCell(i,arLcrData[i]);
			hhtml += RenderYesNoCheckBoxCell(i, arLcrData[i], "");
			hhtml += "</tr>";
			j++;
		}
    }
    hhtml += "</table>";
    return hhtml;
}
    
    function RenderSettingsNameCell(Id, Value){
		return "<td class='TableCell'><input type='text' READONLY id=group" + Id.toString()+ " value='" + Value + "' class='ReadOnlyTextBoxWide'></td>";
    }

    function RenderSettingsParamCell(filterId, lcrData){
        return "<td class='TableCell'><input type='text' id=filterCondition" + filterId.toString()+ " value='" + lcrData + "' class='ReadOnlyTextBox'></td>";
    }
///Filter Renderers



function RenderFilterNameCell(filterId){
		return "<td class='TableCell'><input type='text' id=group" + filterId.toString()+ " value='Filter " + filterId + "' class='ReadOnlyTextBox'></td>";
}

function RenderFilterTrimCell(filterId, lcrData){
	var hhtml = "<td height='18' width='100' class='TableCell'>";
	hhtml += TrimFromLeftComboRenderer("filter" + filterId.toString() +"trimCombo","TextBox",lcrData);
	hhtml += "</td>";
	return hhtml;
}
function TrimFromLeftComboRenderer(elementId, cssClass, selectedItem){
	var hhtml = "<select id='" + elementId + "' class = " + cssClass + ">";
	for (var i=0; i <= 16; i++){
		hhtml += "<option value='" + i.toString() + "'";
		if (selectedItem == i){
			hhtml += " selected ";
			}
		hhtml += ">" + i.toString() + "</option>";
	}
	hhtml += "</select>";
	return hhtml;
}
//onchange=\"IsValidInput('regex','" + controlId +"')\"
function RenderFilterAddCell(filterId, lcrData){
	var controlId = "filter" + filterId.toString()+ "addTextBox";
	return "<td class='TableCell'><input type='text' id='" 
				+ controlId + "' maxlength='8' class='TextBox' value=\"" 
				+ lcrData + "\" onchange=\"IsValidInput('regex','" + controlId +"')\"></td>";
}

function RenderFilterTable(arLcrData){
	var hhtml="<table bgcolor='#FFEF8C'><tr><td class='tableheader'>Filter #</td><td class='tableheader'>Trim Left</td><td class='tableHeader'>Add Left</td><td class='tableHeader'>Match Condition</td><tr>";
	var filtersNumber = GLBCardConfig.NumberOfFilters();
	
	for (i=1; i <= filtersNumber; i++){
		hhtml += "<tr bgcolor='#" + g_arZebra[i%2] + "'>";
		hhtml += RenderFilterNameCell(i);
		hhtml += RenderFilterTrimCell(i, NZ(arLcrData[i][1]));
		hhtml += RenderFilterAddCell(i,NZ(arLcrData[i][2]));
		hhtml += RenderFilterConditionCell(i,NZ(arLcrData[i][3]));
		//hhtml += RenderFilterSaveButton(i);
		hhtml += "</tr>";
	}
	hhtml += "</table>";
	return hhtml;
}

function RenderFilterConditionCell(filterId, lcrData){
	return "<td class='TableCell'><input type='text' id=filterCondition" + filterId.toString()+ " value='" + lcrData + "' class='ReadOnlyTextBox'></td>";
}

function NZ(data){
	if (data == null){
		return "";
	}
		return data;
}

//// CG4 Renderers

function RenderI2C_CG4Combo(aCon){

	var hhtml = "<select id='I2CAddressCombo' class='Button' onchange='I2CCombo_OnChange()'>";
	
	for(var x =1; x <= aCon.CG4GetAllCardsSlots().length;  x++){
	
		hhtml += "<option value=";
		hhtml += x;
		hhtml += ">" + "Slot No. ";
		hhtml += ConcatInt(hex2num( aCon.CG4GetAllCardsSlots()[x-1]-0) , -32);
		hhtml +=  "</option>";
	
	}
	
	hhtml += "</select>";
	
	return hhtml;
}


function RenderCG4Table(cardNum,cg4data, configInfo){
	var hhtml = "<table bgcolor='#FFEF8C'>";
	hhtml += cg4TableHeader();
	hhtml += cg4TableBody(cardNum,cg4data, configInfo);
	hhtml += "</table>"	
	return hhtml;
}

function cg4TableBody(cardNum,cg4data, configInfo){
	var hhtml = "";
	hhtml += cg4SimCell(cardNum, configInfo);
	for (var j=1 ; j <= 4 ; j++){
		hhtml += cg4DataCells(cardNum,j,cg4data[j][3],cg4data[j][4]);
	}

	return hhtml;
}

function cg4DataCells(cardNum, channelNum, selectedGroup, selectedSource){
	var hhtml = "<tr>";
		hhtml = "<td class=\"TableCell\"><input type=\"text\"  size=\"16\"  maxlength=\"8\"    class=\"TextBox\" value=\"SIM 0" + channelNum.toString() + "\"></td>";
		hhtml += "<td class=\"TableCell\">" + GroupComboRenderer("card" + cardNum.toString() + "channel" + channelNum.toString() + "GroupCombo", "TextBox", selectedGroup) + "</td>";
		hhtml += "<td class=\"TableCell\">" + SourceTypeComboRenderer("card" + cardNum.toString() + "channel" + channelNum.toString() + "ResourceType", "TextBox", selectedSource) + "</td>";
	hhtml += "</tr>";
	
	return hhtml;	
}

function cg4SimCell(cardId, configInfo){
	return "<td width=\"132\" style=\"TableCell\" class=\"TableCell\" rowspan=\"4\"> 	Card # 0" + ConcatInt(configInfo.CG4GetAllCardsSlots()[cardId-1]-0 , -20) + "<br><img src=sim.gif width=\"52\" height=\"65\"></td>";
}
function cg4TableHeader(){
	return "<tr><td class=\"TableHeader\">Slot No.</td><td class=\"TableHeader\">Channel</td><td class=\"TableHeader\">Groups</td><td class=\"TableHeader\">Resource Type</td></tr>";
}



/// PRI Renderers
function RenderPRIAxisCombo(aCon){

	var hhtml = "<select id='PRIAxisCombo' class='Button' onchange='PRIAxisCombo_OnChange()'>";
	
	for(var x =1; x <= aCon.PRIGetAllCardsSlots().length;  x++){
	
		hhtml += "<option value=";
		hhtml += x;
		hhtml += ">" + "Axis No. ";
		hhtml += ConcatInt(x , 0);
		hhtml +=  "</option>";
	}
	
	hhtml += "</select>";
	return hhtml;
}

function RenderPRITable(axisNumber, priData){
	
	var hhtml = "<table bgcolor='#FFEF8C'>";
	hhtml += PriHeaderLine();
	hhtml += PriTableBody(axisNumber, priData);
	hhtml += "</table>";
	
	return hhtml;
	
}


function PriTableBody(axisNumber, priData){
	var factor = 0;
	if (axisNumber == 2){factor = 30;}
	var hhtml = "";
	for (var i=factor+1; i <= (30+ (30* (axisNumber-1))); i++){
	
		hhtml +=
			PriDataCells(axisNumber,i,priData[i][3],priData[i][4]);
	}
	return hhtml;
}

function PriDataCells(axisNumber,channel,group,resourceType){
	var hhtml = "<tr>";
	hhtml += "<td class=\"TableCell\"><input type=\"text\" class=\"ComboBox\" value=\"Channel " + channel.toString() + "\" size=\"13\"></td>";
	hhtml += "<td class=\"TableCell\">" + GroupComboRenderer("Axis" + axisNumber.toString() + "Channel" + channel.toString() + "group", "TextBox", group) + "</td>";
	hhtml += "<td class=\"TableCell\">" + SourceTypeComboRenderer("Axis" + axisNumber.toString() + "Channel" + channel.toString() + "resource", "TextBox", resourceType) + "</td>";
	hhtml += "</tr>"	
	return hhtml;	
}

function PriHeaderLine(){
	return "<tr><td class=\"TableHeader\">Channel</td><td class=\"TableHeader\">Groups</td><td class=\"TableHeader\">Resource Type</td></tr>";	
}



/////////


function ConcatInt(a, b){

	a += b;
	return a.toString();
}


////////////////////////////////////////////////////
////// Progress BAR


function updateProgress(message, m,n){
	var desc = message + ":  " + m.toString() + " of " + n.toString();
	document.getElementById("prgrsBr").innerHTML =  desc + '<br />' + visualBar(m,n); 
	ShowProgressBar(m,n);
}

function ShowProgressBar(m,n){
	if (m < n){
		document.getElementById("prgrsBr").style.visibility='visible';
        document.getElementById("prgrsBr").style.display = 'block';
		return;
	}
	if (m == n){
		document.getElementById("prgrsBr").style.visibility='hidden';
        document.getElementById("prgrsBr").style.display = 'none';
		return;	
	}
}

function visualBar(m,n){
	var	fullPart = m/n*100;
	var emptyPart = 100-fullPart;
	
	var table = "<table bgcolor='#FFEF8C' border=1 bordercolor=#901C3A width =100% height=17 cellspacing=0><tr><td height=100% width=" 
				+ fullPart.toString() + "% bgcolor=#901C3A></td><td width=" + emptyPart.toString() + "%bordercolor=white bgcolor=white height=100%></td></tr></table>";
	
	return table;
}




function GetConfiguration() {
    try{
	    return parent.frames[0].GetConfig();
	}
	catch(exception){
	    window.location.href = HTMLAnchorElement;
	}
	
}

function ShowBlank(){
	document.location.href="BlankRight.htm";
}




var LCRGroup = Class.create();

LCRGroup.prototype = {
	number:0,
	cyclic:0,
	filter:0,
	routeGroup:0,
	report:0,
	inFilter:0,
	name:'',
    intelligentR:'',
	
	initialize:
	function(lcrMsg){

		lcrMsg = lcrMsg.replace(/,,/g, ',empty-string-place-holder,')

		var arData = lcrMsg.split('/g')[1].split(/,/g);			
        
        //this.intelligentR could get 0/1 (enabled/disabled) or undefined (not supported)
        this.intelligentR = lcrMsg.split('/i')[1].split(',')[1];
        //alert ( "this.intelligentR = " + this.intelligentR );
		
        if (arData.length > 5)	{

			var inFilterAndName = arData[5].split('/i');

			this.number = this.parseData(arData[0]);
			this.cyclic = this.parseData(arData[1]);
			this.filter = this.parseData(arData[2]);
			this.routeGroup = this.parseData(arData[3]);
			this.report = this.parseData(arData[4]);
			
			this.inFilter = inFilterAndName[0];
			this.name = inFilterAndName[1].replace('"','').replace('"','');
		}
		else{
			var arParam = lcrMsg.split( " " );
			var packStr = new PacketString( arParam[ 1 ] );
			var newArData = packStr.getSection( "g" );
			newArData = newArData.split(',');
			this.number = this.parseData(newArData[0]);
			this.cyclic = this.parseData(newArData[1]);
			this.filter = this.parseData(newArData[2]);
			this.routeGroup = this.parseData(newArData[3]);
			this.report = this.parseData(newArData[4]);
			
		}
		
	},
	parseData:
	function(data){
		if (data === 'empty-string-place-holder')
			return '';
		return data;
	},
	saveCommand:
	function(){
		var commandParams = 
			this.number + "," + 
			this.cyclic + "," + 
			this.filter + "," + 
			this.routeGroup + ",";
          
            
		
		if (this.report)
			commandParams += getPCAddress();
			
		commandParams += "," + this.inFilter;
		commandParams += "/i\"" + this.name + "\"";
        			
		return "SendGenericPacket 32:/x1,0/ALCR/I932/G" + commandParams;
	}
	
};




var GroupHelper = {
	parseMessage:
	function(msg){
		return msg.split('/g')[1].split(/,/g);
	}
	
}


/*
*
*
*
*   SendGenericPacket 30:/x1,0/ALCR/I777/Q1
*   GenericReply /#30/@2b/x0,1/I777/i"","","","","ISDN Bezeq","Analog FX","GSM","SMS","VPN-GSM","VPN-PSTN","","","","","","" 
*
*
*/

var LCRGroupCollection = {
	queryCommand: 'SendGenericPacket 30:/x1,0/ALCR/I777/Q1',
	groups:[],
    
    getShortName:
    function(groupNm){
        if (groupNm){
            if (groupNm <= this.groups.length){
                var tmpName = this.groups[groupNm-1];
                return (tmpName !== 'empty-string-place-holder')? tmpName + ' (' + groupNm + ')' :  groupNm ;
            }
            else
                return '';
        }
		else
			return '';
        
    },
    
	getName:
	function(groupNm){
		if (groupNm <= this.groups.length){
			var tmpName = this.groups[groupNm-1];
			
			return (tmpName !== 'empty-string-place-holder')? tmpName  : 'Group ' + groupNm; //+ ' (' + groupNm + ')'
		}
		else
			return '';
	},
	
	isLoaded:
	function(){
		return this.groups.length;
	},
	
	parseGroups:
	function (lcrReply){
		if (lcrReply.indexOf('/i') > -1){
			lcrReply = lcrReply.replace(/\"\"/g,'empty-string-place-holder');
			lcrReply = lcrReply.replace(/\"/g, '');
			lcrReply = lcrReply.split('/i')[1];
			this.groups = lcrReply.split(/,/g);             
		}
		else{
			
			var numOfGroups = GLBCardConfig.NumberOfGroups();
			this.groups.clear();
			for (i=0; i < numOfGroups; i ++)
				this.groups.push('empty-string-place-holder');
			
		}
	}
	
};