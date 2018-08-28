function SectionTypes(){	
	this.Filters = 1;
	this.Groups = 2;
	this.Rules = 3;
	this.CG4 = 4;
	this.PRI = 5;
}

var SectionType = new SectionTypes();

var ResourceReadCommand = "SendGenericPacket 97:/A2b/x1,0/I897/r";
var RuleReadCommand = "SendGenericPacket 31:/x1,0/A2b/I831/Q";
var FilterReadCommand = "SendGenericPacket 33:/x1,0/A2b/I833/Q";
var GroupReadCommand = "SendGenericPacket 32:/x1,0/A2b/I832/Q";

