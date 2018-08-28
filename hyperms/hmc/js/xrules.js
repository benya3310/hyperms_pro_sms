var elm1 = 1;
var elm2 = 2;
var elm3 = 4;
var elm4 = 8;
function RuleActivation(){
	
	function GetStateByTF(tf1,tf2,tf3,tf4){
		var ret = 0;
		if (tf1){ ret = elm1; }
		if (tf2){ ret = ret | elm2; }
		if (tf3){ ret = ret | elm3; }
		if (tf4){ ret = ret | elm4; }
		
		return ret;
	}
}
	
	