
var LCREntities = Class.create();

LCREntities.prototype = {	

	initialize:
	function(){
		//this.initCounters(arguments[0]);
	},
	
	counters : {
		resources:0,
		groups:0,
		rules:0,
		outFilters:0,
		timeFrames:0,
		inFilters:0
	},
	
	initCounters: function (arResInfo) {
		if (!arResInfo)
			arResInfo=[128,16,32,8,0,8]; // default values;
		
		if (typeof(arResInfo) == 'string')
			arResInfo = arResInfo.split(/,/g);
		
		this.counters.resources = arResInfo[0];
		this.counters.groups = arResInfo[1];
		this.counters.rules = arResInfo[2];
		this.counters.outFilters = arResInfo[3];
		this.counters.timeFrames = arResInfo[4];
		this.counters.inFilters = arResInfo[5];
		
	}
	
	/*
	 * for future use each as collection of its entities 
	 * e.g. groups as {new group(), new group(),...}
	 
	resources:{},
	groups: {},
	rules: {},
	outFilters:{},
	timeFrames:{},
	inFilters: {},
	
	*/	
}


GLB_LCREntities = new LCREntities();


var LCRConfig = Class.create();

LCRConfig.prototype={
	
	m_NumberOfChannels:0,
	m_NumberOfGroups:0,
	m_NumberOfRules:0,
	m_NumberOfFilters:0,
	m_NumberOfTimePeriods:0,
	m_CG4GetAllCardsSlots: [],
	m_PRIGetAllCardsSlots: [],
	m_TimeFrames : [],
	numberOfInFilters:0,

	CG4NumOfCards: 
	function(){return this.m_CG4GetAllCardsSlots.length;},
	
	CG4GetAllCardsSlots: 
	function(){return this.m_CG4GetAllCardsSlots;},
	
	CG4GetCardSlot: 
	function(){return this.m_CG4GetAllCardsSlots[cardNum]},
	
	PRINumOfCards: 
	function(){return this.m_PRIGetAllCardsSlots.length;},
	
	PRIGetAllCardsSlots : 
	function(){return this.m_PRIGetAllCardsSlots;},
	
	PRIGetCardSlot : 
	function(){return this.m_PRIGetAllCardsSlots[cardNum];},
	
		
	initialize: function(configInfo){

		var part1 = new String("CG4.0=");
		var part2 = new String("|E1.0=");
		var part3 = new String("/m2c=");
		
		var cnfg = new String(configInfo);
		
		var prisp = cnfg.indexOf(part2,0) + part2.length;
		var priep = cnfg.indexOf(part3,prisp);
		
		this.m_CG4GetAllCardsSlots = this.ParseCG4CardsInfo(cnfg);
		this.m_PRIGetAllCardsSlots = this.ParsePRICardsInfo(cnfg);		
		
	},
	
	
	NumberOfChannels:
	function (){
		return this.m_NumberOfChannels;
	},
	
	NumberOfGroups:
	function (){
		return this.m_NumberOfGroups;
	},
	
	NumberOfRules:
	function (){
		return this.m_NumberOfRules
	},
	

	NumberOfFilters:
	function (){
		return this.m_NumberOfFilters;
	},
	
    /*
	NumberOfInFilters:
	function (){
		return this.m_NumberOfInFilters;
	},*/
    
	NumberOfTimePeriods:
	function (){
		return this.m_NumberOfTimePeriods;
	},

	InitResources:
	function (resInfo){
		if (!resInfo){
			resInfo=[0,0,0,0,0,0];
		}
        
		this.m_NumberOfChannels = resInfo[0];
		this.m_NumberOfGroups = resInfo[1];
		this.m_NumberOfRules = resInfo[2];
		this.m_NumberOfFilters = resInfo[3];
		this.m_NumberOfTimePeriods = resInfo[4];
        this.numberOfInFilters = resInfo[5];
        
	},
	
	ParseCG4CardsInfo: 
	function (configInfo){
		var part1 = "CG4.0=";
		var startAt = configInfo.indexOf(part1,0) + part1.length;
		var pipe = configInfo.indexOf("|",startAt);
		var slashM = configInfo.indexOf("/m");
		var endsAt = -1;
		
		if (pipe > -1 && slashM > -1){
			if (pipe > slashM){
				endsAt = slashM;
			}else{
				endsAt = pipe;
			}
		}
		else if (pipe == -1){
			endsAt = slashM;
		}else{
			endsAt = pipe;
		}
				
		return configInfo.substr(startAt , endsAt - startAt).split(",")
		
	},
	
	ParsePRICardsInfo: 
	function (configInfo){
		var part1 = "E1.0=";
		var startAt = configInfo.indexOf(part1,0) + part1.length;
		var pipe = configInfo.indexOf("|",startAt);
		var slashM = configInfo.indexOf("/m",startAt);
		var endsAt = -1;
		
		if (pipe > -1 && slashM > -1){
			if (pipe > slashM){
				endsAt = slashM;
			}else{
				endsAt = pipe;
			}
		}
		else if (pipe == -1){
			endsAt = slashM;
		}else{
			endsAt = pipe;
		}
				
		return configInfo.substr(startAt , endsAt - startAt).split(",")
	},
	
	InitTimeFrames:
	function (arFramesInfo){
		this.m_TimeFrames = new TimeFrame(arFramesInfo, TrimArray(arFramesInfo,0).length);
	},
	
	GetTimeFrames:
	function (){
		return this.m_TimeFrames;
	}
	
}


var TimeFrame = Class.create();

TimeFrame.prototype = {
	initialize: function(arSectionG, activeFrames){
		this.m_NumOfFrames = activeFrames;
		this.m_arFrames = new Array();
		
		for (x=0; x < arSectionG.length ; x++){
			sH = arSectionG[x];
			eH = arSectionG[this.Circulator(x ,activeFrames)];
			if (eH == "undefined" || eH == null){eH ="";}
			this.m_arFrames.push(new TimeRange(sH,eH));
		}		
	},
	sH:"",
	eH:"",
	m_NumOfFrames:0,
	m_arFrames:[],
	Circulator: function (a,all){
		if (a+1==all){return 0;}
		return a+1;
	},
	NumOfFrames: function (){return this.m_NumOfFrames;},
	AsArray:function(){return this.m_arFrames;}	
	
}
	
var TimeRange = Class.create();

TimeRange.prototype = {
	m_startHour:'',
	m_EndHour:'',
	initialize: function(a,b){
		if (a)
			this.m_startHour = a;
		if (b)
			this.m_EndHour = b;
	},
	GetStartHour: function(){return this.m_startHour;},
	GetEndHour: function(){return this.m_EndHour;},
	IsEmpty: function(){
		
		return ((this.m_StartHour == null && this.m_EndHour == null) || (this.m_StartHour == "" && this.m_EndHour == ""));
	}
	
	
}




function StartConfigInitializationProcess(){
	SendCommand( "GetGWConfig" );
}

function SendCommand(msg){
	parent.frames[0].SendCommand(msg);
	
}




function TrimArray(v, startIndex){
	for (x=startIndex; x< v.length; x++){
		if ( v[x] == "" || v[x] == null){
			return v.slice(startIndex,x);
		}
	}
	return v.slice(startIndex,x);	
}
