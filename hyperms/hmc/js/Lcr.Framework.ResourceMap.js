/**
 * @author Tzury
 */


var ChannelInfo = Class.create();


ChannelInfo.prototype = {
	
	replayPattern: '(\\w*),((\\w*)(.)?(\\w*))?,((\\w*).(\\w*))?,(\\w*),(\\w*)',
	channelInfoReply:'',
	resourceNumber: '',
	remoteI2CAddress: '',
	remoteI2CSubAddress: '',
	remoteHighway: '',
	remoteTimeSlot: '',
	groupNumber: '',
	resourceType: '',

	
	initialize: 
	function (channelInfoReply){
		
		this.channelInfoReply = channelInfoReply;
		this.resourceNumber = this.exctract(1);
		this.remoteI2CAddress = this.exctract(3);
		this.remoteI2CSubAddress = this.exctract(5);
		this.groupNumber = this.exctract(9);
		if (this.groupNumber == 0)
			this.groupNumber = '';
		this.resourceType = this.exctract(10); 
	},
	
	exctract: 
	function (groupNumber){
		var reg = new RegExp(this.replayPattern);
		var matches = reg.exec(this.channelInfoReply);
		return matches[groupNumber];
	},
	
	innerHTML: 
	function(){
		var strChannel, strGroup, strType;
		strChannel = new String().format("<span class='channelNum' >{0}</span>", this.resourceNumber);
		strGroup = new String().format("<span class='groupNum'>Group: <strong>{0}</strong></span><br/>", LCRGroupCollection.getShortName(this.groupNumber));
		strType = (this.resourceType == '0')? "<span class='resType'>BiDirect</span>" : "<span class='resType'>OutOnly</span>";
		
		return strChannel + strGroup + strType;
	}
	
};


var ChannelsInfo = Class.create();
ChannelsInfo.prototype = {
	queryString: 'GetLCRInfo /I897',
	addressInfo: {},
	channels:[],
	
	
	initialize:
	function(){},
	
	bindData: 
	function(channelInfoReply){
		this.channels.clear();
		var channelInfoRplies = channelInfoReply.split(/r/g);
		
		for(var x=0; x < channelInfoRplies.length; x++)	{
			this.channels.push(	new ChannelInfo(channelInfoRplies[x]));
		}
		this.scanAddresses();
	},
	
	scanAddresses: 
	function(){
		var addresses = G_configInfo.getI2CAllocations("LCR");
        
		
        var str = "";
		for(var x=0; x < addresses.length; x++){
			if (!this.addressInfo[addresses[x]]){
                addresses[x] = ( addresses[x] == "2B" ) ? "MG" : addresses[x];
				var add2name = G_configInfo.addr2Name(addresses[x]);
                str += "  " + addresses[x] + "|" + add2name;
				if (!add2name)
					add2name = G_configInfo.addr2Name(addresses[x].toLowerCase());
				this.addressInfo[addresses[x]] = add2name;
			}
		}
		
		
		
	},
	
	getNameByAddress: 
	function(addr){
		return this.addressInfo[addr];
	}
};


var SelectionRange = Class.create();

SelectionRange.prototype = {
	startElementId	: 0,
	endElementId	: 0,
    ctrlElementIds   : [],
	
	onSelection: 
	function(indexId){
		if (!this.startElementId)
			this.startElementId = indexId;
		else{
			this.endElementId = indexId;
			indexId = new Number(indexId);
			if (indexId < new Number(this.startElementId)){
				var tmp = this.startElementId;
				this.startElementId = this.endElementId;
				this.endElementId = tmp;
			}				
		}		
	},
    onCtrlSelection:
    function(indexId){
        if ( this.ctrlElementIds.indexOf( indexId ) > -1 )
        {
            var arr = [];
            for (var i=0; i<this.ctrlElementIds.length; i++) {
                if (this.ctrlElementIds[i] != indexId ) {
                    arr.push(this.ctrlElementIds[i]);
                }
            }
            this.ctrlElementIds = arr;
        }    
        else         
           this.ctrlElementIds.push( indexId );
    
    
    },
    
	
	initialize:
	function(){
		this.reset();
        this.ctrlElementIds.clear();
	},
	
	reset:
	function(indexId){
        this.ctrlElementIds.clear();
		this.endElementId = this.startElementId = 0;	
		if (indexId)
			this.startElementId = indexId;	
	},
	
	toString:
	function(){
		
		var ret = "Your Selection:"
			if (!this.startElementId)
				ret += " None"
			if (this.startElementId)
				 ret += " Channel " + this.startElementId ;
			if (this.endElementId)
				ret += " - Channel " + this.endElementId;
            if ( this.ctrlElementIds.length )
                ret += " and Channel  " + this.ctrlElementIds;
			if (!this.endElementId)
				ret += " - (hold shift key to select a range of channels)"
		return ret;
	},
	
	elementsRange:
	function(){
		var rangNames = '';
		var startIndex, endIndex;
		
		startIndex = new Number(this.startElementId);
		endIndex = new Number(this.endElementId);
		//alert ( "ctrlSize=" + this.ctrlElementIds.length );
        if ( this.ctrlElementIds.length ) {
            this.ctrlElementIds.each(function(item) {
                rangNames += 'box_' + item + ',';
            });
            //rangNames = rangNames.substr(0, rangNames.length - 1);
			//return rangNames.split(',');
        }
		if (this.endElementId){
			for (var x = startIndex; x <= endIndex; x++)
				rangNames += 'box_' + x + ',';
			
			rangNames = rangNames.substr(0, rangNames.length - 1);
			return rangNames.split(',');
		}
		else {
			rangNames += 'box_' + this.startElementId;
		}
        return rangNames.split(',');

	}
}

/*

From NIR DOCUMENTATIONS:

Command: /ra/Gb.c,d.e,f,g

ChannelInfoReply /A2b/x0,1/I1/r1/g2B.0,2.1,(12.1=highway.timeslot),0,0
ChannelInfoReply /A2b/x0,1/I1/r1/g2B.0,2.1,12.1,0,0

a = resource number, 1-128
b = remote I2C address
c = remote I2C subaddress
d = remote highway
e = remote timeslot
f = group number the channel belongs to (1-16)
g = '1' when the resource is to be used for outgoing calls only (out of the LCR), '0' for bidirectional resources.

*/