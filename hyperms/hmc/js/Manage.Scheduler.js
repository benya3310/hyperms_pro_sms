/**
 * @author Yaniv
 */
var TextCommandsHandler = Class.create();

TextCommandsHandler.prototype = {
	m_arCommands [],
	
	initialize:
	function(){
		this.m_arCommands[0] = "Switch SIM for a Slot";
		this.m_arCommands[1] = "Switch SIM for while System";
		this.m_arCommands[1] = "Reset SIM Counter";
	},
	generateCommand:
	function( nCmdCode, arParams ){
		// nCmdCode is the index of the command in the commands array(m_arCommands)
		var strCmd = "";
		switch ( nCmdCode )
		{
			case 0:		
			case 1:
			{
				strCmd = "UseSIM " + arParams[0] + " " + arParams[1];
				break;
			}
			default:
			{
				strCmd = "ResetSIMCount ";
				break;
			}
		}
	},
	
};