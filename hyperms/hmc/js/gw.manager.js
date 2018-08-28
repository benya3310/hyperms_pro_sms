/**
 * @author Yaniv
 */


 ////////////
var GWProcessor = Class.create();

GWProcessor.prototype = {

 arGateways:[],
 
 initialize:
 function ( jsonPacket ){ 	
    
   //alert(jsonPacket);
	var objGWs = eval('(' + jsonPacket+ ')');
	//alert("bjGWs.length:"+objGWs.Gateways.length);
	this.arGateways.clear();
	
	for ( i=0; i<objGWs.gateways.length; i++)
	{        
		this.arGateways.push( new Gateway( objGWs.gateways[i] ));
	}

 },
 getGWs:
 function(){
   return this.arGateways; 
 },
 getColorsMap:
 function(){
   strHTML  = "<br><table id='gatewaysArea'style='border:solid 0px'><tr>";
    strHTML +="<td style='float:left;width:120px;height:10px;	font-family: \"verdana\", \"tahoma\", \"arial\", \"Helvetica\";font-size:0.7em;margin:2px;	padding:2px;'>Legend:</td></tr><tr>";
    strHTML +="<td class='gwInfo'>Healthy</td></tr>";
    strHTML +="<tr><td class='gwInfoAlerted'>Alerted</td></tr>";
    strHTML +="<tr><td class='gwInfoSuspended'>Alerts Suspended</td></tr>";
    strHTML +="<tr><td class='gwInfoDisabled'>Disabled</td></tr>";
    strHTML +="</table>";
    return strHTML;
 }
 	
};


var Gateway = Class.create();

Gateway.prototype = {
	//{id:, mtxId:,ip:, port:, pwd:,  status {pri:, gsmSignal:, gsmCard:, hgs:, msg:[]}},
    strMtxID: '',
	strID: '',
    strIP: '',
    strPort: '',
	strPassword: '',
    cssClass: '',
	strMsg: [],    
	pri: 0,
    gsmSignal: 0,
    gsmCard: 0,
    hgs: 0,
	initialize:
	function( objGW )
	{
    //alert( objGW.port);    
		this.strID             = objGW.id; 
        this.strMtxID          = objGW.mtxId; 
        this.strIP             = objGW.ip; 
        this.strPort           = objGW.port; 
		this.strPassword       = objGW.pwd;
		this.pri               = objGW.status.pri;
        this.gsmSignal         = objGW.status.gsmSignal;
        this.gsmCard           = objGW.status.gsmCard;
        this.hgs               = objGW.status.hgs;
        this.arMsg             = objGW.status.msg;  
        this.strConnected      = ( objGW.status.connected == undefined ) ?  'n/a' : objGW.status.connected;
        this.strDialing        = ( objGW.status.dialing   == undefined ) ?  'n/a' : objGW.status.dialing;
       
        this.cssClass = ( this.arMsg[0] == "ok" ) ? 'gwInfo':'gwInfoAlerted';
        this.cssClass = ( this.arMsg[0] == "disabled" ) ? 'gwInfoDisabled': this.cssClass;
        this.cssClass = ( this.arMsg[0] == "disabled" ) ? 'gwInfoDisabled': this.cssClass;
        this.cssClass = ( this.arMsg[0] == "ok" && this.sumOfStats()<3 ) ? 'gwInfoSuspended': this.cssClass;
	},
	sumOfStats:
    function(){
        return ( parseInt(this.pri) + parseInt(this.gsmSignal) + parseInt(this.gsmCard) + parseInt(this.hgs) );
    },
	innerHTML: 
	function(){
		var strID, strMtxID, strIP, strPort, strPass, strTable, strStat, strDialing, strConnected;
        
		strID = new String().format("<span class={0}>ID:<strong>{1}</strong></span>", this.getCellCssClass(), this.strID);
        
        strMtxID = new String().format("<span class={0}>MtxID:<strong>{1}</strong></span>", this.getCellCssClass(), this.strMtxID);
		strIP   = new String().format("<span class={0}>IP:<strong>{1} </strong></span>", this.getCellCssClass(), this.strIP );
        strDialing   = new String().format("<span class={0}>Dialing:<strong>{1} </strong></span>", this.getCellCssClass(), this.strDialing );
        strConnected   = new String().format("<span class={0}>Connected:<strong>{1} </strong></span>", this.getCellCssClass(), this.strConnected );
		//strSetBTN = new String().format("<span >{0}</span>", this.getSetBtn(this.strPort) );
		strPort = new String().format("<span class={0}><strong>{1}</strong></span><br>", this.getCellCssClass(), this.strPort);		
		//strRXLevel = new String().format("<span class={0}>{1}</span>", "cellRxLevel",this.RXLevelBar(this.nRX ));
		////
        //strTable = "<a class='gwHeaderHover' href='#' title='"+this.getInfoToolTip()+"'>"; 
        strTable = "<a class='gwHeaderHover' href='#' onmouseover=\"Tip('xx')\"><a>"; 
        //alert(strTable);
		strTable += "<table class='TableNoBorder'><tr><td>"+strID+"</td></tr>";
        //strTable += "<tr><td>"+strMtxID+"</td></tr>";
		strTable += "<tr><td colspan='2'>" + strIP + "</td></tr>";
        strTable += "<tr><td colspan='2'>" + strDialing + "</td></tr>";
        strTable += "<tr><td colspan='2'>" + strConnected + "</td></tr>";
		strTable += "<tr><td colspan='2' align='center'>" +this.getSetBtn()   + "</td></tr>";
		///strTable += "<tr><td colspan='2'><div></td></tr>";
		strTable += "</table>";
		//return strCellID + strBCCH + strRXText +strRXLevel;
               
		return strTable;
                
	},
    getStat:
    function (nHGS,nStat){
        if( (nHGS == 0)|| (this.arMsg[0]=='disabled') )
            return  "N/A";
        else{
            return (( nStat==1 ) ? "OK":"Error");
            }
        
    },
    getHGSStat:
    function (nHGS){
        if( this.arMsg[0]=='disabled' ) 
            return  "N/A";
        else{
            return (( nHGS==1 ) ? "OK":"Error");
            }
    },
    
	getInfoToolTip:
    function(){
        var strPRI, strSignal, strCard, strServer, strMsg, strTable, strDialing, strConnected;
        strServer   = new String().format("<span class={0}>Ping:<strong>{1} </strong></span>", this.getParamClass(1,this.hgs), this.getHGSStat(this.hgs));//((this.hgs==1) ? "OK" : "Error"));
        strStat = this.getStat( this.hgs, this.pri);
        strPRI = new String().format("<span class={0}>PRI:<strong>{1}</strong></span>", this.getParamClass(this.hgs,this.pri), this.getStat(this.hgs,this.pri));
        strSignal = new String().format("<span class={0}>GSM Signal:<strong>{1}</strong></span>", this.getParamClass(this.hgs,this.gsmSignal), this.getStat(this.hgs,this.gsmSignal));
        strCard   = new String().format("<span class={0}>GSM Card:<strong>{1} </strong></span>", this.getParamClass(this.hgs,this.gsmCard), this.getStat(this.hgs,this.gsmCard));
        //strDialing = new String().format("<span class={0}>Dialing:<strong>{1}</strong></span>", this.getParamClass(this.hgs,this.gsmSignal), this.strDialing);
		//strConnected = new String().format("<span class={0}>Connected:<strong>{1}</strong></span>", this.getParamClass(this.hgs,this.gsmSignal), this.strConnected);
		strTable = "<table class='TableNoBorder'><tr><td>"+strPRI+"</td></tr>";
        strTable += "<tr><td>"+strSignal+"</td></tr>";
		strTable += "<tr><td>" + strCard + "</td></tr>";
        //strTable += "<tr><td>"+strDialing+"</td></tr>";
        //strTable += "<tr><td>"+strConnected+"</td></tr>";
		strTable += "<tr><td>" + strServer + "</td></tr>";
		strTable += "</table>";
        /*
        var strInfo  = "<table class><tr><td>PRI:" + ((this.pri==1) ? "OK" : "Error") + "</td></tr>";
        strInfo     += "<tr><td>GSM Signal:" + ((this.gsmSignal==1) ? "OK" : "Error") + "</td></tr>";
        strInfo     += "<tr><td>GSM Card:"   + ((this.gsmCard==1) ? "OK" : "Error") + "</td></tr>";
        strInfo     += "<tr><td>Server:"     + ((this.hgs==1) ? "OK" : "Error") + "</td></tr>";
        */
        /*
        if ( this.arMsg[0] != "ok" ){        
            for (var i=0 ; i<this.arMsg.length; i++ )
            {
                if (this.arMsg[i].length > 0)
                {
                    strMSG   = new String().format("<span class={0}><strong>{1} </strong></span>", 'RedAlert', this.arMsg[i]);
                    strTable += "<tr><td>" + strMSG + "</td></tr>";
                }
            }
        } 
        */        
        //alert( strInfo );
        return strTable;//strInfo+"</tabel>";
    },
    
	getSetBtn:
	function(){
        var strPage = "./hmcA.html?/a" + this.strIP + "/p" + this.strPort + "/pass" + this.strPassword + "/n" + this.strMtxID;                                        
        strBtn  = "<input type=\"button\" class=\"Button\" onclick=\"launch('" + strPage + "')\" ";
		strBtn += "value=\"HMC\" style=\"width='100px'\">&nbsp&nbsp";	
        return strBtn;
        
        //return "<a href=\"javascript:launch('" + strPage + "')\" class=Link>Set</a>";            
	},
    getParamClass:
    function(nHGS,nVal){
        if( (nHGS == 0)|| (this.arMsg[0]=='disabled') )
            return 'BlueAlert';
        else
            return (nVal>0) ? 'BlueAlert':'RedAlert';
    },
	getCellCssClass:
	function(){
		return ( this.arMsg[0] == "ok" ) ? 'cellActiveTag':'cellTag';
	}
	
	
};

///////////




var TNMSProc = Class.create();

TNMSProc .prototype = {

 tnms: 0,
 
 initialize:
 function ( jsonPacket ){ 	
    
   
	var obj = eval('(' + jsonPacket+ ')');
	//alert("bjGWs.length:"+objGWs.Gateways.length);
	this.tnms = obj.tnms;
    S = parseInt(this.tnms.S);
    this.tnms.S =  -111 + (2*S );
	
	
 },
 getTNMSMap:
 function( interval ){
    /*
    {'S': 5, 'M': 2, 'T': 60, 'N': 3}    
    T = The interval in seconds between two polling samples
    N = The number of polling samples required for event triggering analysis
    M = The number of times out of N which indicates determined failure
    S = The lowest reception level allowed which anything less will be considered as error. 
    As you already know, S should be manupulated as (-111 + 2*S) in order to get the RXLevel
    */
    var nTM = parseInt(this.tnms.T) * parseInt(this.tnms.N);  

    var nTotal = nTM + parseInt(interval);
    //<a href="" title=""></a>
    strHTML  = "Maximum time untill system status is updated:" +  nTotal + " seconds.<br>"
    strHTML  +="Rx level threshold "+this.tnms.S +" dB.";
  
    return strHTML;
 },
 getTNMSMapOld:
 function(){
    /*
    {'S': 5, 'M': 2, 'T': 60, 'N': 3}    
    T = The interval in seconds between two polling samples
    N = The number of polling samples required for event triggering analysis
    M = The number of times out of N which indicates determined failure
    S = The lowest reception level allowed which anything less will be considered as error. 
    As you already know, S should be manupulated as (-111 + 2*S) in order to get the RXLevel
    */
    
    //<a href="" title=""></a>
    strHTML  = "<br><table id='gatewaysArea'style='border:solid 0px'><tr>";
    strHTML += "<td style='float:left;width:50px;height:10px;	font-family: \"verdana\", \"tahoma\", \"arial\", \"Helvetica\";font-size:0.7em;margin:2px;	padding:2px;'>TNMS:</td></tr><tr>";
    strHTML += "<td class='gwInfo' style='float:left;width:55px;'><a href='#' title='The interval in seconds between two polling samples'>T = " + this.tnms.T+ "</a></td></tr>";
    strHTML += "<td class='gwInfo' style='float:left;width:55px;'><a href='#' title='The number of polling samples required for event triggering analysis'>N = " + this.tnms.N + "</a></td></tr>";
    strHTML += "<td class='gwInfo' style='float:left;width:55px;'><a href='#' title='The number of times out of N which indicates determined failure'>M = "+ this.tnms.M + "</a></td></tr>";
    strHTML += "<td class='gwInfo' style='float:left;width:55px;'><a href='#' title='The lowest reception level allowed which anything less will be considered as error'>S = "+this.tnms.S+"</a></td></tr>";
    strHTML += "</table>";
  
    return strHTML;
 }
 	
};
