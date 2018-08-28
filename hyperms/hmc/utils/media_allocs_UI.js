///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//
// Channel allocation UI related stuff
//
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function ChannelAllocUI()
{
    this.onSelectCard                   = onSelectCard_M;
    this.onComboCardSelection           = onComboCardSelection_M;
    this.onComboCardChannelSelection    = onComboCardChannelSelection_M;
    this.editAlloc                      = editAlloc_M;
    this.saveAlloc                      = saveAlloc_M;
    this.unLink                         = unLink_M;
	this.unLinkAll                      = unLinkAll_M;
    this.saveConfig                     = saveConfig_M;
    this.cancelEdit                     = cancelEdit_M;
    this.autoLink                       = autoLink_M;
	this.onCellClicked                  = onCellClicked_M;
    this.getCardFreeChannels            = getCardFreeChannels_M;
    this.getCardsComboHTML              = getCardsComboHTML_M;
    this.send                           = send_M;
    this.getTableHTML                   = getTableHTML_M;
    this.getTextualAllocations          = getTextualAllocations_M;
    this.buildTableElements             = buildTableElements_M;
    this.getSelectCardHTML              = getSelectCardHTML_M;
    this.processAck                     = processAck_M;
    this.processErr                     = processErr_M;
    this.getNewID                       = getNewID_M;
    
    this.m_bConfigChanged               = 0;
    this.m_bEditAllocMode               = 0;
	this.m_bInAutoLinkState				= 0;
	this.m_bUnlinkallMode               = 0;
	this.m_nTotalAutoAllocated		    = 0;
    this.m_strUpdateLinkID              = "1";

    this.m_strLastCardLink              = "";
    this.m_strLastChannelLink           = "";
    
    function processAck_M( packStr )
    {
		var strID      = packStr.getSection( "I" );
		if ( strID == this.m_strUpdateLinkID )
		{
				// The update links request has been completed by the server
				var strPrompt = "Configuration saved.";
				document.getElementById("DIV_SaveConfig").innerHTML = strPrompt;
				this.m_bConfigChanged = 0;
				this.m_strUpdateLinkID = this.getNewID( this.m_strUpdateLinkID );
				G_configInfo.clearModified();
		}
    }
    
    function getNewID_M( strLinkID )
    {
		var nLinkID = parseInt( strLinkID );
		nLinkID++;
		nLinkID = (nLinkID%100) + 1;
		strLinkID = "";
		strLinkID += nLinkID;
		return strLinkID;
    }
    
    function processErr_M( packStr )
    {
        var strID      = packStr.getSection( "I" );
        if ( strID == this.m_strUpdateLinkID )
        {
            // Update the valid UpdateLinks request ID so that if others of
            // the same batch will return with an ack they will be ignored
            this.m_strUpdateLinkID = this.getNewID( this.m_strUpdateLinkID );
            var strPrompt = "Error saving configuration.";
            document.getElementById("DIV_SaveConfig").innerHTML = strPrompt;
        }
    }

    function onSelectCard_M( strCard, strCardType )
    {    
 
		if ( strCard == null )
		{
			return;
		}
		
        this.m_strLastSelectedCardAddr = strCard;
		var nSlot = G_configInfo.calcSlotNumber( strCard );        
        var strHTML = this.getTableHTML( "matrix_table", strCard );
        var strTitle = getSelCardText( nSlot, strCardType );
        document.getElementById("update_settings").innerHTML = strTitle;
        document.getElementById("DIV_MatrixTable").innerHTML = strHTML;
    
        var strActions = "(Select to change)";
		strActions += " | <a href='javascript:G_allocUI.unLinkAll()'><font color='red'>Unlink All</font></a>";
        document.getElementById("DIV_Action").innerHTML = strActions;    
    
        this.m_bEditAllocMode = 0;
    }
    
    function onComboCardSelection_M( objSelection )
    {
        // A change has been made in the target card selection combo
        var strSelCard = G_configInfo.addr2Name(objSelection.value);
        var strCardCombo = this.getCardsComboHTML( strSelCard );
        var oFreeChannels = this.getCardFreeChannels( strSelCard, "-1" );
    
        var strActions;
        if (oFreeChannels.m_bIsFull)
        {
            strActions = "<a href='javascript:G_allocUI.cancelEdit()'>Cancel</a>";
        }
        else
        {
            strActions = "<a href='javascript:G_allocUI.saveAlloc()'>Save</a> | <a href='javascript:G_allocUI.autoLink()'>Auto Link</a> | <a href='javascript:G_allocUI.cancelEdit()'>Cancel</a>";
        }
            
        document.getElementById("DIV_Action").innerHTML = strActions;    
        this.m_SelectedDOMCell.innerHTML    = strCardCombo + oFreeChannels.m_strComboHTML;
        this.m_strLastCardLink              = strSelCard;
        this.m_strLastChannelLink           = oFreeChannels.m_strSelectedChannel;
    }
    
    function onComboCardChannelSelection_M( objSelection )
    {
        // A change has been made in the target card channel selection combo
        this.m_strLastChannelLink  = objSelection.value;
    }
    
    function editAlloc_M()
    {
        this.m_bEditAllocMode = 1;
    
        var strActions = "";
        var domCell = this.m_SelectedDOMCell;
        var strCombo = "";
        
		if (domCell == undefined)
			return;
		var strLinkType = domCell.m_strType;
		
        if ( strLinkType == "Unmapped" || strLinkType == "UnknownInvalidLink" || strLinkType == "KnownInvalidLink" )
        {
            // This channel is not linked to another channel. We'll open a combo
            // with the first E1 as default since there has to be at least one
            // E1 card in the system.

            var strCard = "";
            if ( this.m_strLastCardLink != "" )
            {
                strCard = this.m_strLastCardLink;
            }
            else
            {
                strCard = G_configInfo.get1stE1Name();
            }

            oFreeChannels = this.getCardFreeChannels( strCard, "-1" );
        }
        else
        {
            // This channel is already linked to a valid card + channel
            var strCard = domCell.m_strCard;
            var strChannel = domCell.m_strChannel;
            oFreeChannels = this.getCardFreeChannels( strCard, strChannel );
        }
    
        var strActions;
        if (oFreeChannels.m_bIsFull)
        {
            strActions = "<a href='javascript:G_allocUI.cancelEdit()'>Cancel</a>";
        }
        else
        {
            strActions = "<a href='javascript:G_allocUI.saveAlloc()'>Save</a> | <a href='javascript:G_allocUI.autoLink()'>Auto Link</a> | <a href='javascript:G_allocUI.cancelEdit()'>Cancel</a>";
        }
            
        document.getElementById("DIV_Action").innerHTML = strActions;    
        
        domCell.innerHTML = this.getCardsComboHTML( strCard ) + oFreeChannels.m_strComboHTML;
        //domCell.m_strCard = strCard;
        //domCell.m_strChannel = oFreeChannels.m_strSelectedChannel;
        this.m_strLastCardLink     = strCard;
        this.m_strLastChannelLink  = oFreeChannels.m_strSelectedChannel;
    }
    function autoLink_M()
	{
		
		this.m_bInAutoLinkState = 1;
		var strCard = this.m_strLastCardLink;
        var strChannel = this.m_strLastChannelLink;
        var strCardAddr = G_configInfo.name2Addr( strCard );
		var bLCR  = false;
		var bQBRI = false;
		
		if ( strCardAddr == "LCR" )
			bLCR = true;
		else 
		if ( strCard.substr( 0, 4 ) == "QBRI" )
			bQBRI = true;
		
		//////////////////////////////////////////////////////////////
		//check how many channels do we need to allocate
		//////////////////////////////////////////////////////////////
		if ( this.m_strLastSelectedCardAddr == strCardAddr )
		{
			//can not link a card to itself using auto link
			alert ("linking a card to itself using auto link is not allowed!")
			this.m_bInAutoLinkState = 0;
			return;
			
		}
		
		//get the selected dest card type
		var strSelectedCardType = "";
		if ( bLCR )
			strSelectedCardType =  "LCR";
		else
			strSelectedCardType = strCard.substr( 0, strCard.indexOf("(") );
		
		//check how many channels do we need
		var strSelectedSrcCard = this.m_strLastSelectedCardAddr;
		var strSelectedSrcChannel = this.m_SelectedDOMCell.m_nRow+1;
		//how amny channels our srs card has		
		var totalChannelsOfSelectedSrcCard = G_configInfo.m_mediaAllocations[strSelectedSrcCard].length;
		//run over src selected channel till first mapped channel
		var startAt = this.m_SelectedDOMCell.m_nRow +1;
		var i = startAt;
		for (i; i<totalChannelsOfSelectedSrcCard; i++ )
		{
			var strDestCell    = document.getElementById('matrix_table_'+i+'_1');
			if ( strDestCell.innerHTML  != '-' )
			{	
				break;
			}
		}
		var numOfRequired = (i-startAt+1);
		if ( numOfRequired == "1") 
		{
			//notihing to do - just click regular save
			this.m_bInAutoLinkState = 0;
			return;
		}
		//alert ("I need " + numOfRequired + " channles of " + strSelectedCardType + " starting with card:"+ strCardAddr + " channel:" + strChannel  );
		
		//////////////////////////////////////////////////////////////
		// run over dest cards and check if we have numOfRequired 
		// channels free in arow 
		//////////////////////////////////////////////////////////////
		var channelsPerDestCard = G_configInfo.m_mediaAllocations[strCardAddr].length;
		var numOfRequiredCards = Math.ceil(numOfRequired/channelsPerDestCard);
	
		//get all cards addreess of selected  type
		var arrDestCardsAddresses = G_configInfo.getCardTypeAddresses( strSelectedCardType );
		
		var startPos=0;
		for (startPos;startPos<arrDestCardsAddresses.length;startPos++)
		{
			if ( arrDestCardsAddresses[startPos] == strCardAddr )
				break;
		}
		if (startPos==arrDestCardsAddresses)
		{
			//impossible logic state
			alert("Error-destination card has no valid address, contact support");
			this.m_bInAutoLinkState = 0;
			return;
			
		}
		//get channel start pos (i.e user choose crad add 24 channel 3)
		var channelPos =  parseInt(strChannel);
		//run over cards array calculate number of free channels in a row.
		var numOfAllocated = 0;
		var bBreak = false;
		startAt =startAt-1;
		for (i=0;i<numOfRequiredCards;i++)
		{
			if ( bBreak )
				break;
			var cardChannels = G_configInfo.m_mediaAllocations[arrDestCardsAddresses[startPos]];
			//more card from same type?
			if ( cardChannels == undefined )
				break;
			//run over card's channels:
			var ch = 0;
			if (i==0)
			{
				//first time only use selected channel pos
				ch = channelPos-1;
			}
			for (ch; ch<channelsPerDestCard; ch++)
			{
				
				if ( cardChannels[ch] == "" )
				{
					//ok, we have a free channel, let's use it
					
					var strHTML = "";
					if ( bLCR )
						strHTML = strSelectedCardType +   " Resource " + (ch +1);
					else
					if ( bQBRI )
	
						strHTML = strSelectedCardType + "(" + G_configInfo.calcSlotNumber(arrDestCardsAddresses[startPos]) +  ") Port" + Math.ceil((ch+1) / 2) + " Ch." + ((ch % 2) + 1);
					else
						strHTML = strSelectedCardType + "(" + G_configInfo.calcSlotNumber(arrDestCardsAddresses[startPos]) +  ") Channel " + (ch +1);

					var cell = document.getElementById('matrix_table_'+startAt+'_1');
					cell.innerHTML = strHTML;
					cell.m_strType    = "Link";
					
					if ( bLCR )
					{
						cell.m_strCard = "LCR";
					}
					else
					{
						cell.m_strCard = strSelectedCardType + "(" + G_configInfo.calcSlotNumber(arrDestCardsAddresses[startPos]) +  ")";						
					}
					cell.m_strChannel = (ch +1);
					startAt++;
					
					//check if done
					numOfAllocated++;										
					if ( numOfAllocated == numOfRequired)
						break; //it's enough...
				}
				else
				{	
					bBreak = true;
					break;
				}
				
			}

			startPos = startPos+1;
		}
		this.m_nTotalAutoAllocated = numOfAllocated;

		
	}
    function saveAlloc_M()
    {
        this.m_bEditAllocMode = 0;
    
        var strCard = this.m_strLastCardLink;
        var strChannel = this.m_strLastChannelLink;
        var strCardAddr = G_configInfo.name2Addr( strCard );

   		this.m_SelectedDOMCell.m_strType    = "Link";
        this.m_SelectedDOMCell.m_strCard    = strCard;
        this.m_SelectedDOMCell.m_strChannel = strChannel;
		this.m_SelectedDOMCell.innerHTML    = strCard + " " + getChannelText( strCard, strChannel );
		var strActions = "<a href='javascript:G_allocUI.editAlloc()'>Edit</a> | <a href='javascript:G_allocUI.unLink()'>Unlink</a>";
		strActions += " | <a href='javascript:G_allocUI.unLinkAll()'><font color='red'>Unlink All</font></a>";
        document.getElementById("DIV_Action").innerHTML = strActions;    
        
		var numOfAllocated = this.m_nTotalAutoAllocated;
		
		if ( this.m_bInAutoLinkState )
		{
			var nRow = parseInt(strChannel) - 1;
			var cellRow = this.m_SelectedDOMCell.m_nRow;
			for(var i=0;i<numOfAllocated;i++)
			{
				
				var strLogical1 = this.m_strLastSelectedCardAddr + "." + (cellRow+1);
				var strDestCell   = document.getElementById('matrix_table_'+cellRow+'_1');
				var strDestCard  = G_configInfo.name2Addr( strDestCell.m_strCard );
				var strDestChannel = strDestCell.m_strChannel;
				var strLogical2 = strDestCard + "." + strDestChannel;
				
				var strUnlink = G_configInfo.link( strLogical1, strLogical2 );
				cellRow = cellRow + 1;
			}
		}
		else
		{
			var strLogical1 = this.m_strLastSelectedCardAddr + "." + (this.m_SelectedDOMCell.m_nRow+1);
			var strLogical2 = strCardAddr + "." + strChannel;
			var strUnlink = G_configInfo.link( strLogical1, strLogical2 );
		
			if ( this.m_strLastSelectedCardAddr == strCardAddr )
			{
				// We have linked to a channel in the same card - this should
				// also be reflected in the user interface so that the channel
				// for the target card also shows that it is linked to this channel.
				
				var nRow = parseInt(strChannel) - 1;
				var nCol = this.m_nTargetAllocCol;
				var objDOMCell  = GetCell( "matrix_table", nRow, nCol );
				var nChannel    = this.m_SelectedDOMCell.m_nRow + 1;
				objDOMCell.innerHTML    = strCard + " " + getChannelText( strCard, nChannel );
				objDOMCell.m_strCard    = strCard; 
				objDOMCell.m_strChannel = nChannel; 
				objDOMCell.m_strType    = "Link";
	   
				if ( strUnlink != "" && strLogical1 != strLogical2 )
				{
					// This new link caused a previous channel to unlink from this one
					// ( and it is not a self link - i.e the link was between two 
					//  different channels ).
					var strInfo = new String(strUnlink);
					var arInfo = strInfo.split(".");
		
					if ( this.m_strLastSelectedCardAddr == arInfo[0] )
					{
						// ... and that previous channel which has been unlinked also
						// happens to be on the same card, so update the user interface
						// by changing the display link of that channel to "-"
		
						nRow = parseInt(arInfo[1]) - 1;
						objDOMCell = GetCell( "matrix_table", nRow, 3 );
						objDOMCell.innerHTML = "-";
						objDOMCell.m_strType = "Unmapped";
					}
				}
			}
		}
        

		this.m_bConfigChanged = 1;
		var strSave = utils_getButtonHTML( "G_allocUI.saveConfig()", "SaveSettings.jpg" );
		document.getElementById("DIV_SaveConfig").innerHTML = strSave;
    }
	function unLinkAll_M()
    {
		this.m_bInAutoLinkState = 1;
		this.m_bUnlinkallMode = 1;
		var strCard = this.m_strLastSelectedCardAddr;
		var totalChannels = G_configInfo.m_mediaAllocations[strCard].length;
		for (i=0; i<totalChannels; i++ )
		{
			var strDestCell    = document.getElementById('matrix_table_'+i+'_1');
			if ( strDestCell.innerHTML  != '-' )
			{
				
				var strDestCard   = strDestCell.m_strCard;
				var strDestChannel = strDestCell.m_strChannel;
				var strDestCardAddr    = G_configInfo.name2Addr( strDestCard );
				
				var strSrc = this.m_strLastSelectedCardAddr + "." + (i+1); // source logical address
				var strDst = strDestCardAddr + "." + strDestChannel; // target logical address
				var strUnLink = G_configInfo.unLink( strSrc, strDst );
				if ( this.m_strLastSelectedCardAddr == strDestCardAddr )
				{
					// We have unlinked a channel that is connected to a channel in the same card.
					// this should also be reflected in the user interface so that the target channel
					// also shows that it is unlinked from this channel
					
					var nRow = parseInt(strDestChannel) - 1;
					var nCol = this.m_nTargetAllocCol;
					
					var objDOMCell = GetCell( "matrix_table", nRow, nCol );
					objDOMCell.innerHTML = "-"; 
					objDOMCell.m_strType = "Unmapped";
				}
				this.m_bEditAllocMode = 0;
				strDestCell.innerHTML = "-";
				strDestCell.m_strType = "Unmapped";
				var strActions = "<a href='javascript:G_allocUI.cancelEdit()'>Cancel</a>"
				document.getElementById("DIV_Action").innerHTML = strActions;    
				
				this.m_bConfigChanged = 1;
				var strSave = utils_getButtonHTML( "G_allocUI.saveConfig()", "SaveSettings.jpg" );
				document.getElementById("DIV_SaveConfig").innerHTML = strSave;
			}
			
		
		
			
		}
		
	}
	
    function unLink_M()
    {
        // The only way we can arrive here is if a concrete address
        // has been selected for being unlinked.
        
        var strCard = this.m_SelectedDOMCell.m_strCard;
        var strChannel = this.m_SelectedDOMCell.m_strChannel;
        var strCardAddr = G_configInfo.name2Addr( strCard );
		
        var strSrc = this.m_strLastSelectedCardAddr + "." + (this.m_SelectedDOMCell.m_nRow+1); // source logical address
        var strDst = strCardAddr + "." + strChannel; // target logical address
		
		
        var strUnLink = G_configInfo.unLink( strSrc, strDst );
			
        if ( this.m_strLastSelectedCardAddr == strCardAddr )
        {
			
            // We have unlinked a channel that is connected to a channel in the same card.
            // this should also be reflected in the user interface so that the target channel
            // also shows that it is unlinked from this channel
            
            var nRow = parseInt(strChannel) - 1;
            var nCol = this.m_nTargetAllocCol;
            
            var objDOMCell = GetCell( "matrix_table", nRow, nCol );
            objDOMCell.innerHTML = "-"; 
            objDOMCell.m_strType = "Unmapped";
        }
			
        this.m_bEditAllocMode = 0;
        this.m_SelectedDOMCell.innerHTML = "-";
		this.m_SelectedDOMCell.m_strType = "Unmapped";
        var strActions = "<a href='javascript:G_allocUI.editAlloc()'>Edit</a>";
        document.getElementById("DIV_Action").innerHTML = strActions;    
		
		this.m_bConfigChanged = 1;
		var strSave = utils_getButtonHTML( "G_allocUI.saveConfig()", "SaveSettings.jpg" );
		document.getElementById("DIV_SaveConfig").innerHTML = strSave;
    }
    
    function saveConfig_M()
    {
		var arChanged = G_configInfo.getModifiedCards();
		
		var nIndex = 0;
		
		var strPrompt = "Saving configuration, please wait...";
		document.getElementById("DIV_SaveConfig").innerHTML = strPrompt;
		this.m_nUpdateReplies = 0;
		
		var strSend = "UpdateCardBusLinks /I";
		strSend += this.m_strUpdateLinkID;
        strSend += "#";
		
		var strMediaLinksUpdate	= "";
		var strI2CLinksUpdate	= "";
		
		var strSeparator = "";
		
        for (var strCardAddr in arChanged)
        {
			//this.m_nTotalUpdateRequests++;
            var arLinks = G_configInfo.getMatrixAllocations( strCardAddr );
			var arI2CLinks = G_configInfo.getI2CAllocations( strCardAddr );
			var arInvalidLinks = G_configInfo.getInvalidAllocations( strCardAddr );

			var strLinks = "";
			var strI2CLinks = "";
			var strInvalidLinks = "";
			
            for (var j=0; j<arLinks.length; j++)
            {
                strLinks += arLinks[ j ];
                strI2CLinks += arI2CLinks[ j ];
				strInvalidLinks += arInvalidLinks[ j ];
                if (j != arLinks.length-1)
                {
                    strLinks += ",";
                    strI2CLinks += ",";
					strInvalidLinks += ",";
                }
            }
			
			strMediaLinksUpdate += strSeparator;
			strI2CLinksUpdate += strSeparator;
			strSeparator = "|";
			
			strMediaLinksUpdate += "/A";
			strMediaLinksUpdate += strCardAddr;
			strMediaLinksUpdate += "/G";
			strMediaLinksUpdate += strLinks;
			
			strI2CLinksUpdate += "/A";
			strI2CLinksUpdate += strCardAddr;
			strI2CLinksUpdate += "/G";
			strI2CLinksUpdate += strI2CLinks;
			strI2CLinksUpdate += "/N";
			strI2CLinksUpdate += strInvalidLinks;
        }

		strSend += strMediaLinksUpdate + "#" + strI2CLinksUpdate;
		
        this.send( strSend );
		
		//after unlik all a command link will appear only if user will select raw.
		if ( this.m_bUnlinkallMode == 1 )
			document.getElementById("DIV_Action").innerHTML = "(Select to change)";   
		//clear all states and modes...
		this.m_bInAutoLinkState = 0;
		this.m_bUnlinkallMode =0;
    }

    function cancelEdit_M()
    {
		
		if ( this.m_bInAutoLinkState == 1)
		{
			this.m_bInAutoLinkState = 0;
			window.location.reload();
			return;		
			
		}
        var strInnerHTML = "";
		
        var strLinkType = this.m_SelectedDOMCell.m_strType;        
        switch ( strLinkType )
        {
            case "Link":
            {
                //strInnerHTML = this.m_SelectedDOMCell.m_strCard + " Channel " + this.m_SelectedDOMCell.m_strChannel;
				strInnerHTML = this.m_SelectedDOMCell.m_strCard + " " + getChannelText(this.m_SelectedDOMCell.m_strCard, this.m_SelectedDOMCell.m_strChannel);
                break;
            }
            
            case "Unmapped":
            {
                strInnerHTML = "-";
                break;
            }
            
            case "UnknownInvalidLink":
            {
                strInnerHTML = "<font color='red'>Invalid Link<font>";
                break;
            }
            
            
            case "KnownInvalidLink":
            {
                strInnerHTML = "<font color='red'>" + strLink;
                strInnerHTML += this.m_SelectedDOMCell.m_strCard + " Channel " + this.m_SelectedDOMCell.m_strChannel;
                strInnerHTML += "<font>";
                break;
            }
		}
        
        this.m_SelectedDOMCell.innerHTML    = strInnerHTML;
        
        var strActions = "<a href='javascript:G_allocUI.editAlloc()'>Edit</a>";
        if ( this.m_SelectedDOMCell.m_strType != "Unmapped" )
        {
            strActions += " | <a href='javascript:G_allocUI.unLink()'>Unlink</a>";
        }
		strActions += " | <a href='javascript:G_allocUI.unLinkAll()'><font color='red'>Unlink All</font></a>";
        document.getElementById("DIV_Action").innerHTML = strActions;    
        this.m_bEditAllocMode = 0;
    }
    
    function onCellClicked_M( strTable, nRow, nCol )
    {
	
        if (this.m_bEditAllocMode == 1)
        {
            return;
        }

        if ( nCol == 0 )
        {
            // UF: The application should decide which column to ignore
            return;
        }
        var domCell = GetCell( strTable, nRow, nCol );
		
        if ( nCol == 0 )
        {
            // UF: The application should decide which columns are not
            //     clickable - this is just an ugly hack.
            return;
        }
        
        if ( this.m_SelectedDOMCell == domCell )
        {
            // We've already selected this. Ignore.
            return;
        }

        domCell.m_bSaveBackgroundColor = domCell.style.backgroundColor;
        if (!(typeof this.m_SelectedDOMCell == 'undefined'))
        {
            this.m_SelectedDOMCell.style.backgroundColor = this.m_SelectedDOMCell.m_bSaveBackgroundColor;
        }
    
        if (parseInt(nRow)%2 == 0)
        {
            domCell.style.backgroundColor = "#ffaa00";
        }
        else
        {
            domCell.style.backgroundColor = "#ffcc00";
        }
    
        domCell.m_nRow = nRow;
        domCell.m_nCol = nCol;
        
        var strActions = "<a href='javascript:G_allocUI.editAlloc()'>Edit</a>";
        if ( domCell.m_strType != "Unmapped" )
        {
            strActions += " | <a href='javascript:G_allocUI.unLink()'>Unlink</a>";
        }
		strActions += " | <a href='javascript:G_allocUI.unLinkAll()'><font color='red'>Unlink All</font></a>";
        document.getElementById("DIV_Action").innerHTML = strActions;    
        
        this.m_SelectedDOMCell = domCell;
    }
    
    function getCardFreeChannels_M( strSelCard, strSelChannel )
    {
        var strSelCardAddr = G_configInfo.name2Addr( strSelCard );
        var arChannels = G_configInfo.getMatrixAllocations( strSelCardAddr );
        
        var strHTML = "<select name='selchannels' onchange='G_allocUI.onComboCardChannelSelection(this)';>";
        var nChannel = parseInt( strSelChannel );
    
        var bFree = 0;
        var bSelfMap = 0;
        
        var reply = new Object();
        
        reply.m_bIsFull = 0;
        reply.m_strSelectedChannel = "";
        
        for (var i=1; i<=arChannels.length; i++)
        {
            // Iterate over the allocated channels for card strSelCard
            if ( arChannels[i-1] == "" )
            {
                bFree = 1;
                
                if ( nChannel == -1 )
                {
                    nChannel = i;
                }
            }
            
            if ( arChannels[i-1] == "" || i == nChannel  )
            {
                strHTML += "<option value='" + i + "' ";
                if ( i == nChannel )
                {
                    // This channel should be selected in the Combo by default
                    strHTML += "selected";
                    reply.m_strSelectedChannel = i;
                }
    
                strHTML += ">";
				strHTML += getChannelText( strSelCard, i );
				
                
               
            }
            strHTML += "</option>";
        }
        
        strHTML += "</select>";
        
        if ( bFree == 0 )
        {
            // No free channels found for selected card.
            // Override any previously defined HTML for the combo.
            strHTML = "Fully allocated!";
            reply.m_strSelectedChannel = -1;
            reply.m_bIsFull = 1;
        }
        
        reply.m_strComboHTML = strHTML;
        return reply;
    }
	//this function return the channel name per card
	//for LCR - "Resource", Ananlog "FX0/FXS", QBRI "Port x Channel y", or "Channel" for others.
    function getChannelText( strSelCard, nChannel )
	{ 
		var strHTML;
		
		if ( strSelCard.substr( 0, 5 ) == "AN4.4" )
        {
        	// Special handling for channel display of analog card
            if ( nChannel > 4 )
            {
            	strHTML = "FXS " + (nChannel-4);
            }
            else
            {
            	strHTML = "FXO " + nChannel;
            }
	    }
		else if ( strSelCard.substr( 0, 3 ) == "LCR" )
		{
			strHTML = "Resource " + nChannel;
		}
		else if ( strSelCard.substr( 0, 4 ) == "QBRI" )
		{
			strHTML = "Port" + Math.ceil(nChannel / 2) + " Ch." + (((nChannel - 1) % 2) + 1);
		}
        else
        {
			strHTML = "Channel " + nChannel;
        }
		return 	strHTML;
	}
    function getCardsComboHTML_M( strSelCard )
    {
        var arNames = G_configInfo.getCardNames();
        var strHTMLComboCards = "<select name='selcards' onchange='G_allocUI.onComboCardSelection(this)';>";
    
        bFoundMatch = 0;
        
        for (var i=0; i<arNames.length; i++)
        {
            strHTMLComboCards += "<option value='" + G_configInfo.name2Addr( arNames[i] ) + "' ";
            if ( strSelCard == arNames[i] )
            {
                // The current target card allocation should be the default selection in
                // the combo box being created.
                bFoundMatch = 1;
                strHTMLComboCards += "selected";
            }
            else
            {
                bFoundMatch = 0;
            }
            
            strHTMLComboCards += ">";
            strHTMLComboCards += arNames[i] + "</option>";
        }
    
        strHTMLComboCards += "</select>";
        return strHTMLComboCards;
    }
    
    // Send command to applet
    function send_M( strMsg )
    {
        parent.frames[0].SendCommand( strMsg );
    }
    
    function getTableHTML_M( strTableID, strCardAddress )
    {
        var strHTML = "";
    
        // header
        var oTable = createTableElements( strCardAddress );
        
        strHTML += GetTableHeaderHTML( oTable );
        
        var nTableHeight = this.m_nTotalChannels*23;
        var nMaxHeight = 260;
        
        if ( nTableHeight > nMaxHeight )
        {
            nTableHeight = nMaxHeight;
        }
        strHTML += GetTableBodyHTML( oTable, strTableID, nTableHeight, this.m_arColsClickable );
        if ( nTableHeight == nMaxHeight )
        {
            strHTML += GetTableFooterHTML( oTable );
        }
        
        return strHTML;
    }    
    
    function getTextualAllocations_M( strCardAddress )
    {
        // return an array where each element contains the HTML text for each allocated
        // channel. If no channel is allocated the text is the '-' character;        
        var arAllocs = G_configInfo.getMatrixAllocations( strCardAddress );
        var arInvalidAllocs = G_configInfo.getInvalidAllocations( strCardAddress );
        
		
		var strRes;
		var strVal;
		var strLink;
        var strCard;
        var strChannel;
        var strType;
		
        var arResult = new Array;
        try
        {
            for (var i=0; i<arAllocs.length; i++)
            {
                if ( arAllocs[ i ] != "" )
                {
                    // A bidirectional link exists for this channel
                    var strLogicalLink = new String(arAllocs[ i ]);
                    var arLink = strLogicalLink.split( "." );
                    strCard     = G_configInfo.addr2Name( arLink[ 0 ] );
                    strChannel  = arLink[ 1 ];
                    strVal      = strCard + " " + getChannelText( strCard, strChannel );
                    strRes      = strVal;
                    strLink     = "ok";
                    strType     = "Link";
                }
                else
                {
                    // No bidirectional link exists for this channel
                    if ( arInvalidAllocs[ i ] != "" )
                    {
                        // A unidirectional link exists
                        var strLogicalLink = new String(arInvalidAllocs[ i ]);
                        if ( strLogicalLink == "*" )
                        {
                            strVal = "*";
                            strRes = "<font color='red'>Invalid Link</font>";
                            strLink = "invalid";
                            strType = "UnknownInvalidLink";
                        }
                        else
                        {
                            var arLink = strLogicalLink.split( "." );
                            strCard     = G_configInfo.addr2Name( arLink[ 0 ] );
                            strChannel  = arLink[ 1 ];
                            strVal      = strCard + " " + getChannelText( strCard, strChannel );
                            strRes = "<font color='red'>";
                            strRes += strVal;
                            strRes += "</font>";
                            strLink = "invalid";
                            strType = "KnownInvalidLink";
                        }
                    }
                    else
                    {
                        // No link exists
                        strRes = "-";
                        strVal = "-";
                        strLink = "ok";
                        strType = "Unmapped";
                    }
                }
               
                arResult[ i ] = new Object();
                arResult[ i ].m_strHTML   	= strRes;
                arResult[ i ].m_strType   	= strType;
                arResult[ i ].m_strCard   	= strCard;
                arResult[ i ].m_strChannel	= strChannel;
            }
        }
        catch ( e)
        {
         alert (e);
        }
        
        return arResult;
    }
    
    function buildTableElements_M( oTable, arCol, arColsClickable )
    {
        if (typeof arColsClickable == 'undefined')
        {
            this.m_arColsClickable = new Array();
            for (var i=0; i<this.m_nTargetAllocCol; i++)
            {
                this.m_arColsClickable[ i ] = 0;
            }
        }
        else
        {
            this.m_arColsClickable = arColsClickable;
        } 

        this.m_nTargetAllocCol = arCol.length;
        var arTextualAllocated = arCol[ arCol.length - 1 ];
        
        this.m_nTotalChannels = arTextualAllocated.length;
        
        for (var i=0; i<arTextualAllocated.length; i++)
        {
            var oRow = new Array();
            for (var j=0; j<this.m_nTargetAllocCol+1; j++)
            {
                var oCell = new Object();
                if ( j == 0 )
                {
                    oCell.m_eType = eText;
                    if (!(typeof arCol[0][i].m_strChannelDisplay == 'undefined'))
                    {
                        oCell.m_strText = arCol[0][i].m_strChannelDisplay;
                    }
                    else
                    {
                        oCell.m_strText = (i+1);                    // Channel Number
                    }
                }
                else
                {
                    oCell.m_eType = eText;
                    oCell.m_strText     = arCol[j-1][i].m_strHTML;
					oCell.m_strType     = arCol[j-1][i].m_strType;
					oCell.m_strCard     = arCol[j-1][i].m_strCard;      // Target Card
					oCell.m_strChannel	= arCol[j-1][i].m_strChannel;   // Target Channel
                }
    
                oRow.push( oCell );
            }
            
            oTable.m_oRows.push( oRow );
        }
        
        return oTable;
    }
    
    function getSelectCardHTML_M( packStr, strCardType, strTitle )
    {
        return G_configInfo.getSelectCardHTML( packStr, strCardType, strTitle, "G_allocUI.onSelectCard" );
    }
}

var G_allocUI = new ChannelAllocUI();

function onCellClicked( strTable, nRow, nCol )
{
    G_allocUI.onCellClicked( strTable, nRow, nCol );
}

function onPageChange()
{
    if ( G_allocUI.m_bConfigChanged == 1 )
    {
		var strPrompt = "The new configuration has not been saved - any ";
		strPrompt += "changes made will be lost.\n";
		strPrompt += "Are you sure you wish to continue ?";
		if (confirm( strPrompt ))
		{
			return 1;
		}
		return 0;
    }
}
