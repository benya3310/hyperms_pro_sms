/**
 * @author Yaniv
 */

var CellProcessor = Class.create();

CellProcessor.prototype = 
{
	strReply: '',
	nModule: 0,
	strLockedOnBCCH: '0',
	strLockedOnUARFCN: '0',
	strLockedOnPSC: '65535',
	currentCell: '',
	strStatus: '',
	CellularCells:[],
	bShowCampBtn: true,
	bCampByBCCH: true,
	bMultiNet: false,
 
	///rA/LB/iC1,D1,E1/gC2,D2,E2;C3,D3,E3;C4,D4,E4;C5,D5,E5;C6,D6,E6;C7,D7,E7
	///rA/LB1,B2,B3/qC1,D1,E1/gC2,D2,E2;C3,D3,E3;C4,D4,E4;C5,D5,E5;C6,D6,E6;C7,D7,E7.... on TELIT UMTS (3G mode)
	///rA/LB1,B2,B3/iC1,D1,E1/gC2,D2,E2;C3,D3,E3;C4,D4,E4;C5,D5,E5;C6,D6,E6;C7,D7,E7	 on TELIT UMTS (2G mode)

	initialize:
	function ( packet )
	{
		this.nModule = parseInt( packet.getSection('r') );

		switch ( packet.getSection('i') )
		{
			case "":
			case null: 
			{
				this.bCampByBCCH = false;
				switch ( packet.getSection('q') )
				{
					case "":
					case null: 
					case "0":
					{
						this.strStatus = "Not Valid";
						//return;					
					}
					default:
					{
						var arLockParams       = packet.getSection('L').split(',');	
						this.strLockedOnUARFCN = parseInt( arLockParams[ 1 ] );	
						this.strLockedOnPSC    = parseInt( arLockParams[ 2 ] );	
						this.bMultiNet         = true;
						break;
					}
				}
				break;
			}
			case "0":
			{
				this.strStatus = "Not Valid";
				//return;
			}		
			default:
			{
				var arLockParams     = packet.getSection('L').split(',');	
				this.strLockedOnBCCH = parseInt( arLockParams[ 0 ] );
				this.bMultiNet       = ( arLockParams[ 2 ] != null ) ? true : false;
				break;
			}
		}
		
		if (this.strStatus != "") return;

		var arOtherCells = (packet.getSection('g') != null) ? packet.getSection('g').split(';') : null;
		this.CellularCells.clear();
		
		var i = 0;

		if ( this.bCampByBCCH )
		{
			this.currentCell = new Cell( packet.getSection('i'), true, this.strLockedOnBCCH, this.bMultiNet );

			if ( arOtherCells != null )
			{
				for ( ; i<arOtherCells.length ; i++ )
				{
					this.CellularCells.push( new Cell( arOtherCells[ i ], false, this.strLockedOnBCCH, this.bMultiNet ) );
				}
			}
			for ( ; i<6 ; i++ )
			{
				this.CellularCells.push( new Cell( "-,0,64", false, this.strLockedOnBCCH, this.bMultiNet ) );
			}
		}
		else
		{
			this.currentCell = new UMTS_Cell( packet.getSection('q'), true, this.strLockedOnUARFCN, this.strLockedOnPSC );
		
			if ( arOtherCells != null )
			{
				var nOtherCellsAmount = ( (arOtherCells.length > 6) ? 6 : arOtherCells.length );
				for ( ; i<nOtherCellsAmount ; i++ )
				{
					this.CellularCells.push( new UMTS_Cell( arOtherCells[ i ], false, this.strLockedOnUARFCN, this.strLockedOnPSC ) );
				}
			}
			for ( ; i<6 ; i++ )
			{
				this.CellularCells.push( new UMTS_Cell( "0,0,0", false, this.strLockedOnUARFCN, this.strLockedOnPSC ) );
			}
		}
	},
 
	getCancelCampBtn:
	function()
	{
		var strBtn = "";
		if ( this.bCampByBCCH )
		{
			if ( this.strLockedOnBCCH != "0" )
			{
				strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"setCurrentCell(" + ( this.bMultiNet ? "2" : "1" ) + ",0,0,65535)\" ";
				strBtn += "value=\"Cancel camping on BCCH " + this.strLockedOnBCCH + "\" style=\"width='200px'\">&nbsp&nbsp";	
			}
		}
		else
		{
			if ( this.strLockedOnUARFCN != "0" )
			{
				strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"setCurrentCell(0,0,0,65535)\" ";
				strBtn += "value=\"Cancel camping on UARFCN " + this.strLockedOnUARFCN + " & PSC " + this.strLockedOnPSC + "\" style=\"width='300px'\">&nbsp&nbsp";	
			}
		}
	
		return strBtn;
	},
 
	getCancelALLBtn:
	function()
	{
		var strBtn = "";
		if ( this.bCampByBCCH )
		{
			if ( this.strLockedOnBCCH != "0" )
			{
				strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"setAllCell(" + ( this.bMultiNet ? "2" : "1" ) + ",0,0,65535)\" ";
				strBtn += "value=\"Cancel camping for all modules\" style=\"width='200px'\">&nbsp&nbsp";	
			}
		}
		else
		{
			if ( this.strLockedOnUARFCN != "0" )
			{
				strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"setAllCell(0,0,0,65535)\" ";
				strBtn += "value=\"Cancel camping for all modules\" style=\"width='200px'\">&nbsp&nbsp";	
			}
		}
	
		return strBtn;
	},
 
	getCampThemALLBtn:
	function()
	{
		var strBtn = "";
		if ( this.bCampByBCCH )
		{
			if ( this.strLockedOnBCCH != "0" )
			{
				strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"setAllCell(" + ( this.bMultiNet ? "2," : "1," ) + this.strLockedOnBCCH + ",0,65535)\" ";
				strBtn += "value=\"Camp all modules on BCCH " + this.strLockedOnBCCH + "\" style=\"width='200px'\">&nbsp&nbsp";
			}
		}
		else
		{
			if ( this.strLockedOnUARFCN != "0" )
			{
				strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"setAllCell(0,0," + this.strLockedOnUARFCN + "," +  this.strLockedOnPSC + ")\" ";
				strBtn += "value=\"Camp all modules on UARFCN " + this.strLockedOnUARFCN + " & PSC " + this.strLockedOnPSC + "\" style=\"width='300px'\">&nbsp&nbsp";
			}
		}
	
		return strBtn;
	}	
};

var Cell = Class.create();

Cell.prototype = 
{
	strReply: '',
	bIsActive: false,
	bIsCamped: false,
	bIsValid: true,
	strCellID: 0,
	strBCCH: '',
	nRX: 0,
	strRXText: '',
	nMaxRx: 63,
	
	initialize:
	function( strReply, isActive, strBCCHLock, isMultiNet )
	{
		var  arReply  		= strReply.split(',');
		this.strCellID 		= arReply[0];
		this.strBCCH 		= arReply[1];
		if ( this.strBCCH == "0" ) this.bIsValid = false;
		this.nRX   			= parseInt( arReply[2] );		
		this.bIsActive 		= isActive;
		this.bIsCamped  	= (strBCCHLock == this.strBCCH) ? true : false;
		this.bShowCampBtn  	= (strBCCHLock == "0") ? true : false;
		this.setRXText();
		this.bIsMultiNet    = isMultiNet;
	},
	
	innerHTML: 
	function()
	{
		if ( this.strBCCH == "0" )
			return "";
		var strCellID, strBCCH, strSetBTN, strTable;
		strCellID = new String().format("<span class={0}>CellID:<strong>{1}</strong></span>", this.getCellCssClass(), this.strCellID);
		strBCCH = new String().format("<span class={0}>BCCH:<strong>{1} </strong></span>", this.getCellCssClass(), this.strBCCH );
		strSetBTN = new String().format("<span >{0}</span>", this.getSetBtn(this.strBCCH) );
		strRXText = new String().format("<span class={0}><strong>{1}</strong></span><br>", this.getCellCssClass(), this.strRXText);		
		strTable  = "<table class='TableNoBorder'><tr><td>"+strCellID+"</td></tr>"		
		strTable += "<tr><td colspan='2'>" + strBCCH;
		strTable += (this.bIsCamped)? "</td</tr>" : ""+strSetBTN+"</td></tr>";		
		strTable += "<tr><td colspan='2'>"+strRXText+""+this.RXLevelBar(this.nRX )+"</td></tr>";
		strTable += "</table>";		
		return strTable;
	},
	
	getSetBtn:
	function( strBCCH )
	{
		if ( this.bShowCampBtn )
			return "<a href=\"javascript:setCurrentCell(" + ( this.bIsMultiNet ? "2," : "1," ) + strBCCH + ",0,65535)\" class=Link>Camp</a>";
		else
			return "";	
	},

	getCellCssClass:
	function()
	{
		return ( this.bIsActive ) ? 'cellActiveTag' : 'cellTag';
	},
	
	RXLevelBar:
	function (nVal)
	{
		var	nFull = parseInt(nVal/this.nMaxRx*100);	
		var nEmpty = 100 - nFull;
		if ( nVal > this.nMaxRx || nVal < 1 )
		{
			return "<table class=cellRxLevel border=1 bordercolor=#901C3A  height=15 cellspacing=0><tr><td height=100% width=100%></td></tr></table>"; 
		}
	
		//alert ( nVal);
		var strBarHTML = "<table class=cellRxLevel border=0 height=15 cellspacing=0>"
		//var strBarHTML = "<table class=cellRxLevel border=1 bordercolor=#901C3A  height=15 cellspacing=0>"
		strBarHTML += "<tr><td height=100% width="
		strBarHTML += nFull.toString()  + "% bgcolor=" + this.getBarFullBGColor() + "></td><td height=100% width=" 
		strBarHTML += nEmpty.toString() + "% bgcolor=white ></td></tr></table>";
		// if ( nVal > this.nMaxRx )
		//	alert ( strBarHTML );	
		return strBarHTML;
	},
	
	getBarFullBGColor:
	function ()
	{
		return ( this.bIsActive ) ? "#F77671" : "#9CB2E5";//(this.bIsCamped)? "00FF00" : "#9CB2E5";
	},
	
	setRXText:
	function()
	{
		if ( this.nRX < 1 ) 
			this.strRXText  = "< -110 dBm";
		if ( this.nRX >=1 && this.nRX <63 )
			this.strRXText  = (-111 + this.nRX).toString() + " dBm";
		if ( this.nRX == 63 )
			this.strRXText  = "> -48 dBm";
		if ( this.nRX >63 )
			this.strRXText  = "<font color='red'>No Reception<font>";
	}
};


var UMTS_Cell = Class.create();

UMTS_Cell.prototype = 
{
	strReply: '',
	bIsActive: false,
	bIsCamped: false,
	strCellID: 0,
	strUARFCN: '',
	strPSC: '',
	nRX: 0,
	strRXText: '',
	
	initialize:
	function( strReply, isActive, strUARFCNLock, strPSCLock )
	{
		var  arReply  		= strReply.split(',');
		this.strUARFCN		= arReply[0];
		this.strPSC 		= arReply[1];
		this.nRX   			= parseInt( arReply[2] );		
		this.bIsActive 		= isActive;
		this.bIsCamped  	= ( ( strUARFCNLock == this.strUARFCN ) && ( strPSCLock == this.strPSC ) ) ? true : false;
		this.bShowCampBtn  	= ( strUARFCNLock == "0" ) ? true : false;
		this.setRXText();
		this.strCellID 		= this.strUARFCN + "_" + this.strPSC;
	},
	
	innerHTML: 
	function()
	{
		if ( this.strUARFCN == "0" )
		{
			return "";
		}
		var strUARFCN, strPSC, strSetBTN, strTable;
		strUARFCN = new String().format("<span class={0}>UARFCN: <strong>{1}</strong></span>", this.getCellCssClass(), this.strUARFCN);
		strPSC = new String().format("<span class={0}>PSC: <strong>{1} </strong></span>", this.getCellCssClass(), this.strPSC );
		strSetBTN = new String().format("<span >{0}</span>", this.getSetBtn(this.strUARFCN, this.strPSC) );
		strRXText = new String().format("<span class={0}><strong>{1}</strong></span>", this.getCellCssClass(), this.strRXText);		
		strTable  = "<table class='TableNoBorder'><tr><td colspan='2'>" + strUARFCN + "</td></tr>"		
		strTable += "<tr><td colspan='2'>" + strPSC + "</td</tr>";
		strTable += "<tr><td colspan='2'>" + strRXText;
		strTable += (this.bIsCamped) ? "" : strSetBTN;
		strTable += "<br>" + this.RXLevelBar(this.nRX) + "</td></tr>";
		strTable += "</table>";		
		return strTable;
	},

	getSetBtn:
	function( strUARFCN, strPSC )
	{
		if ( this.bShowCampBtn )
			return "<a href=\"javascript:setCurrentCell(0,0," + strUARFCN + "," + strPSC + ")\" class=Link>Camp</a>";
		else
			return "";	
	},
	
	getCellCssClass:
	function()
	{
		return ( this.bIsActive ) ? 'cellActiveTag':'cellTag';
	},
	
	RXLevelBar:
	function (nVal)
	{
		if (nVal > 121)							//less than -121dBm
		{
			return "<table class=cellRxLevel border=1 bordercolor=#901C3A  height=15 cellspacing=0><tr><td height=100% width=100%></td></tr></table>"; 
		}
		var	nFull = parseInt(((121-nVal)/73)*100);		//48 --> 100%, 121 --> 0%
		if (nFull > 100) nFull = 100;
		var nEmpty = 100 - nFull;
		var strBarHTML = "<table class=cellRxLevel border=0 height=15 cellspacing=0>"
		strBarHTML += "<tr><td height=100% width="
		strBarHTML += nFull.toString()  + "% bgcolor=" + this.getBarFullBGColor() + "></td><td height=100% width=" 
		strBarHTML += nEmpty.toString() + "% bgcolor=white ></td></tr></table>";
		return strBarHTML;
	},

	getBarFullBGColor:
	function ()
	{
	return ( this.bIsActive ) ? "#F77671" : "#9CB2E5";//(this.bIsCamped)? "00FF00" : "#9CB2E5";
	},
	
	setRXText:
	function()
	{
		if ( this.nRX )
			this.strRXText  = "-" + this.nRX.toString() + " dBm";
		else
			this.strRXText  = "<font color='red'>No Reception<font>";
	}
};
