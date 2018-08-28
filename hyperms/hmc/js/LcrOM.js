/**
 * @author Tzury
 */

 var LCRFilter = Class.create();
 
 LCRFilter.prototype = { 	
	initialize: function(lcrMsg){
		
	},
	filterNumber: 0,
	trimLeft: "",
	padLeft: "",
	setCommand: new String().format("SendGenericPacket {0}:/x1,0/A2b/I9{0}/G{1},{2},{3}", this.opCode, this.filterNumber, this.trimLeft, this.padLeft),
	getCommand: new String().format("SendGenericPacket {0}:/x1,0/A2b/{0}/Q{1}",this.opCode ,this.filterNumber),
	opCode:33
 }