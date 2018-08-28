///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//
// Allocation logic related stuff
//
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
var myGlobal = this;

function cardSortFunc(card1, card2) 
{ 
	if ( card1.m_strAddress > card2.m_strAddress ) 
	{
		return 1; 
	}

	if ( card1.m_strAddress < card2.m_strAddress ) 
	{
		return -1; 
	}
	
	return 0 
}

function ConfigInfo()
{
    // Read-only tables
    //=================

    // m_mapCardType2Addresses[ "CG4.0" ] = { "21", "22" }
    this.m_mapCardType2Addresses = new Array();

    // m_mapAddress2Name[22] = "CG4.0(1)"
    this.m_mapAddress2Name = new Array();
    
    // m_mapName2Address["CG4.0(1)"] = 22
    this.m_mapName2Address = new Array();

    // m_arCards[0] = "E1.0(1)"
    // m_arCards[1] = "E1.0(2)"
    // m_arCards[2] = "CG4.0(1)"
    this.m_arCards = new Array();
    
    // Read/Write tables
    //==================
    
    // m_logicalMediaLinks[ "23.1" ] = "22.4"
    //this.m_logicalMediaLinks = new Array();
    
	// Valid media allocations
    // m_mediaAllocations[ "22" ] = { "21.1", "21.2", "", "2B.2" }
    this.m_mediaAllocations = new Array();

	// Invalid/conflicting media allocations
    // m_invalidAllocations[ "24" ] = { "", "21.2", "", "" }
    this.m_invalidAllocations = new Array();

    // m_I2CAllocations[ "22" ] = { "21", "21", "", "2B" }
    this.m_I2CAllocations = new Array();
	
    // m_modifiedAllocations[ "23" ] = 1;
    // m_modifiedAllocations[ "21" ] = 1;
    this.m_modifiedAllocations = new Array();

    this.getModifiedCards		= getModifiedCards_M;
    this.link					= link_M;
    this.unLink					= unLink_M;
    this.getCardNames			= getCardNames_M;
    this.name2Addr				= name2Addr_M;
    this.addr2Name				= addr2Name_M;
    this.getMatrixAllocations	= getMatrixAllocations_M;
	this.getInvalidAllocations	= getInvalidAllocations_M;
    this.getI2CAllocations		= getI2CAllocations_M;
    this.processConfigInfo		= processConfigInfo_M;
    this.getCardTypeAddresses	= getCardTypeAddresses_M;
    this.getSelectCardHTML		= getSelectCardHTML_M;
    this.calcSlotNumber			= calcSlotNumber_M;
    this.get1stE1Name			= get1stE1Name_M;
	this.clearModified			= clearModified_M;
	this.onCardSelected			= onCardSelected_M;

    this.m_str1stName = "";
	this.m_str2ndName = "";
    
    function get1stE1Name_M()
    {
		if ( this.m_str1stName != "" )
		{
			return this.m_str1stName;
		}
		
		return this.m_str2ndName;
    }

    function getModifiedCards_M()
    {
        return this.m_modifiedAllocations;
    }
    
    function link_M( strLogical1, strLogical2 )
    {
        // e.g. Link("21.1", "2a.3") means add "2a.3" as the
        // link from channel 1 of card at address 21 and "21.1"
        // as the link from channel 3 of card at address 3a.
        var str1 = new String( strLogical1 );
        var str2 = new String( strLogical2 );
        
        var ar1 = str1.split( "." );
        var ar2 = str2.split( "." );
        
        var strCard1 = ar1[ 0 ];
        var strCard2 = ar2[ 0 ];
    
        var nChannel1 = parseInt( ar1[ 1 ] );
        var nChannel2 = parseInt( ar2[ 1 ] );
    
        var nIndex = 0;
        var strUnlinked = "";
        var arUnlink;
        
        var strCardLink = this.m_mediaAllocations[ strCard1 ][ nChannel1-1 ];
        if (  strCardLink != "" )
        {
            // Unlink this card from the mapping of the previous allocated card
            strUnlinkInfo = new String( strCardLink );
            arUnlink = strUnlinkInfo.split( "." );
            var strUnlinkCard = arUnlink[ 0 ];
            var nUnlinkChannel = parseInt( arUnlink[ 1 ] );
            this.m_mediaAllocations[ strUnlinkCard ][ nUnlinkChannel-1 ] = "";
            this.m_invalidAllocations[ strUnlinkCard ][ nUnlinkChannel-1 ] = "";
            this.m_I2CAllocations[ strUnlinkCard ][ nUnlinkChannel-1 ] = "";
            this.m_modifiedAllocations[ strUnlinkCard ] = 1;
            strUnlinked = strCardLink;
        }
    
        strCardLink = this.m_mediaAllocations[ strCard2 ][ nChannel2-1 ];
        if (  strCardLink != "" )
        {
            // Unlink this card from the mapping of the previous allocated card
            strUnlinkInfo = new String( strCardLink );
            arUnlink = strUnlinkInfo.split( "." );
            var strUnlinkCard = arUnlink[ 0 ];
            var nUnlinkChannel = parseInt( arUnlink[1] );
            this.m_mediaAllocations[ strUnlinkCard ][ nUnlinkChannel-1 ] = "";
			this.m_invalidAllocations[ strUnlinkCard ][ nUnlinkChannel-1 ] = "";
            this.m_I2CAllocations[ strUnlinkCard ][ nUnlinkChannel-1 ] = "";
            this.m_modifiedAllocations[ strUnlinkCard ] = 1;
            strUnlinked = strCardLink;
        }
    
        this.m_mediaAllocations[ strCard1 ][ nChannel1-1 ] = strLogical2;
        this.m_mediaAllocations[ strCard2 ][ nChannel2-1 ] = strLogical1;
		
		this.m_invalidAllocations[ strCard1 ][ nChannel1-1 ] = "";
		this.m_invalidAllocations[ strCard2 ][ nChannel2-1 ] = "";
		
		this.m_I2CAllocations[ strCard1 ][ nChannel1-1 ] = strCard2;
		this.m_I2CAllocations[ strCard2 ][ nChannel2-1 ] = strCard1;
		
        this.m_modifiedAllocations[ strCard1 ] = 1;
        this.m_modifiedAllocations[ strCard2 ] = 1;
        
        return strUnlinked; 
    }
    
    function unLink_M( strSrc, strDst )
    {
        // e.g. unLink("21.1") means for instance remove the link from card
        // at address 21 channel 1  to logical address 2a.3 and
        // also remove from card address 2a the link to logical
        // address 21.1 (card 21 channel 1)
        
        var str1 = new String( strSrc );
        var ar1 = str1.split( "." );
        var strCard1 = ar1[ 0 ];
        var nChannel1 = parseInt( ar1[ 1 ] )-1;
		
		var strLogical2 = this.m_mediaAllocations[ strCard1 ][ nChannel1 ];
		
        this.m_mediaAllocations[ strCard1 ][ nChannel1 ] = "";
		this.m_I2CAllocations[ strCard1 ][ nChannel1 ] = "";
        this.m_modifiedAllocations[ strCard1 ] = 1;
		
		if ( this.m_invalidAllocations[ strCard1 ][ nChannel1 ] != "" )
		{
			// This was an invalid allocation - do not attempt to unlink
			// the channel on the card that it points to.
			this.m_invalidAllocations[ strCard1 ][ nChannel1 ] = "";
			return;
		}
		
		if ( strDst != strLogical2 )
		{
			alert( "Error - unlink: destination mismatch " + strDst + "," + strLogical2 );
			return;
		}
		
        var str2 = new String( strLogical2 );
        var ar2 = str2.split( "." );
        var strCard2 = ar2[ 0 ];
        var nChannel2 = parseInt( ar2[1] )-1;
		
		if ( str2 != "" )
		{
			this.m_I2CAllocations[ strCard2 ][ nChannel2 ] = "";
			this.m_mediaAllocations[ strCard2 ][ nChannel2 ] = "";
			this.m_invalidAllocations[ strCard2 ][ nChannel2 ] = "";
			this.m_modifiedAllocations[ strCard2 ] = 1;
		}
    }
    
    function getCardNames_M()
    {
        return this.m_arCards;
    }

    function name2Addr_M( strName )
    {
        return this.m_mapName2Address[ strName ];
    }

    function addr2Name_M( strAddr )
    {
        return this.m_mapAddress2Name[ strAddr ];
    }
    
    function getMatrixAllocations_M( strCardAddress )
    {
        return this.m_mediaAllocations[ strCardAddress ];
    }
    
    function getInvalidAllocations_M( strCardAddress )
    {
        return this.m_invalidAllocations[ strCardAddress ];
    }
    
    function getI2CAllocations_M( strCardAddress )
    {
        return this.m_I2CAllocations[ strCardAddress ];
    }
    
	function clearModified_M()
	{
        // Reset modified card allocations list
        this.m_modifiedAllocations  = new Array;
	}
	
    function processConfigInfo_M( packStr )
    {
        // Create data structures derived from the supplied
        // HGW configuration information (packStr).
        
        // Reset modified card allocations list
        this.m_modifiedAllocations  = new Array;
	
        var strAddresses	= new String( packStr.getSection( "c" ) ); // Detected cards
        var strMediaLinks	= new String( packStr.getSection( "m" ) ); // Valid media links
        var strSignalLinks	= new String( packStr.getSection( "s" ) ); // I2C links
        var strInvalidLinks	= new String( packStr.getSection( "e" ) ); // Invalid media links
		
        var arCardsAddrs	= strAddresses.split( "|" );	 // Detected cards array
        var arCardsLinks	= strMediaLinks.split( "|" );	 // Valid media links array
        var arSignalLinks	= strSignalLinks.split( "|" );   // I2C links array
        var arInvalidLinks	= strInvalidLinks.split( "|" );  // Invalid media links array
		
        var i;
        
        // Iterate over the existing card addresses and create a mapping
        // between a card UI alias and its I2C address and vice versa
        // e.g  CG4.0-1 (alias) <-> 23 (I2C address)
        
        var nCardCount = 0;
        
        for (i=0; i<arCardsAddrs.length; i++)
        {
            var strCardAddr = new String(arCardsAddrs[ i ]);
            var arTagVal = strCardAddr.split( "=" );
            
            var strVal = new String(arTagVal[1]);
            var arAddresses = strVal.split(",");
            var strCardType = arTagVal[0];
            this.m_mapCardType2Addresses[ strCardType ] = arAddresses;

			var bFound = 0;
			
            for (var j=0; j<arAddresses.length; j++)
            {
                var nSlot   = this.calcSlotNumber( arAddresses[j] );
                var strFullCardName = strCardType + "(" + nSlot + ")";
                if ( this.m_str1stName == "" )
                {
					//alert( strCardType );
					if ( strCardType == "E1.0" )
					{
						this.m_str1stName = strFullCardName;
					}
                }
				
                if ( this.m_str2ndName == "" )
				{
					this.m_str2ndName = strFullCardName;
				}
				
                this.m_arCards[ nCardCount++ ] = strFullCardName;
                this.m_mapAddress2Name[ arAddresses[ j ] ]	= strFullCardName;
                this.m_mapName2Address[ strFullCardName ]	= arAddresses[ j ];
            }
        }

        // Create the matrix of the logical media links between the
        // cards as inferred by the HGW configuration information.
		
        for (i=0; i<arInvalidLinks.length; i++)
        {
            var strCardLinks = new String(arInvalidLinks[ i ]);
            var arTagVal = strCardLinks.split( "=" );
            var strCard = arTagVal[0];
            var strLinks = new String(arTagVal[1]);
            var arLinks = strLinks.split( "," );
            this.m_invalidAllocations[ strCard ] = arLinks;
		}
		
        for (i=0; i<arCardsLinks.length; i++)
        {
            var strCardLinks = new String(arCardsLinks[ i ]);
            var arTagVal = strCardLinks.split( "=" );
            var strCard = arTagVal[0];
            var strLinks = new String(arTagVal[1]);
            var arLinks = strLinks.split( "," );
			
			//alert( this.m_mapAddress2Name[strCard] + " " + strLinks ); // BM:2
			
            this.m_mediaAllocations[ strCard ] = arLinks;
			
			if ( typeof this.m_invalidAllocations[ strCard ] == 'undefined' )
			{
				// Old version of server that does not provide the invalid allocations information
				// Just simulate no invalid allocations.
				var arInvalidAllocs = new Array();
				
				for (var j=0; j<arLinks.length; j++)
				{
					arInvalidAllocs[ j ] = "";
				}
				
				this.m_invalidAllocations[ strCard ] = arInvalidAllocs;
			}
            /*
            for (var j=0; j<arLinks.length; j++)
            {
                var strLogicalName = strCard + "." + (j+1);
                if ( arLinks[ j ] != "" )
                {
                    this.m_logicalMediaLinks[ strLogicalName ] = arLinks[ j ];
                    this.m_logicalMediaLinks[ arLinks[ j ] ] = strLogicalName;
                }
            }
            */
        }
		
        // Create the table of I2C (signalling) links between the
        // cards
        for (i=0; i<arSignalLinks.length; i++)
        {
            var strCardI2CLinks = new String(arSignalLinks[ i ]);
            var arTagVal = strCardI2CLinks.split( "=" );
            var strCard = arTagVal[0];
            var strI2CLinks = new String(arTagVal[1]);
            var arI2CLinks = strI2CLinks.split( "," );

			//alert( strCard + " " + arI2CLinks.length + " " + strI2CLinks ) 
            this.m_I2CAllocations[ strCard ] = arI2CLinks;
        }
    }
    
    function getCardTypeAddresses_M( strCardType )
    {
        // Return the array of I2C addresses that are connected to a card
        // of type strCardType
        
        return this.m_mapCardType2Addresses[ strCardType ];
    }

    function calcSlotNumber_M( strCardAddr )
    {
		if ( strCardAddr == "MG" )
		{
			strCardAddr = "2B";
		}
		
        var nOrigin = parseInt( "0x20", 16 );
        var nCard   = parseInt( strCardAddr, 16 );
        var nSlot = nCard - nOrigin;
        return nSlot;
    }
    
    function getSelectCardHTML_M( packStr, strCardTypes, strTitle, strCallback )
    {
		// Update the internal data structures (what cards are available, what types,
		// who is connected to who etc.) from the configuration info packet.
		
        this.processConfigInfo( packStr );
		
		// List of card types for which a radio button will exist, e.g. "CG4.0,CC4.0"
		var strTypeList = new String( strCardTypes );
		var arTypes = strTypeList.split( "," );
		
		var arCards = new Array();
		
		// Create an array of all the cards whose type matches the list given in strTypeList
		
		for (var i=0; i<arTypes.length; i++)
		{
			var arTypeAddresses = this.getCardTypeAddresses( arTypes[ i ] );
			
			if (typeof arTypeAddresses == 'undefined')
			{
				continue;
			}
			
			for (var j=0; j<arTypeAddresses.length; j++)
			{
				var card = new Object();
				card.m_strAddress	= arTypeAddresses[ j ];
				card.m_strType		= arTypes[ i ];
				arCards.push( card );
			}
		}
		
        if (arCards.length == 0)
        {
			var objRet = new Object();
			objRet.m_strHTML = "No card detected in this slot<br><br>";
			objRet.m_strSelCard = null;
			objRet.m_strSelCardType = null;
			return objRet;
        }
		
		// Sort the array of card objects according to the card address field
		arCards.sort( cardSortFunc );
		
		var strCardGroupType = strCardTypes;
		
		if (typeof parent.frames[0].G_map[ strCardGroupType ] == 'undefined')
		{
			parent.frames[0].G_map[ strCardGroupType ] = arCards[ 0 ].m_strAddress;
		}

		var strCheckedCard = parent.frames[ 0 ].G_map[ strCardGroupType ];
		var strSelCardType = "";
		
        var strHTML = "<font face='Arial'>";
        strHTML += strTitle;
        strHTML += "<br><table bgcolor='#f0f0f0'><tr><td><b>Slot </b></td>";
        for (var i=0; i<arCards.length; i++ )
        {
            var strCardName = this.addr2Name( arCards[ i ].m_strAddress );
            var nSlot = this.calcSlotNumber( arCards[ i ].m_strAddress );
            strHTML += "<td width=20>";
            strHTML += "<input type=radio name='c' ";
            strHTML += "value='" + arCards[ i ].m_strAddress + "' ";
            if ( arCards[ i ].m_strAddress == strCheckedCard )
            {
                strHTML += "checked ";
            }
			
			var strCard		= arCards[ i ].m_strAddress;
			var strCardType	= arCards[ i ].m_strType;
            strHTML += "onClick='G_configInfo.onCardSelected( \"" + strCardGroupType + "\",\"" + strCard + "\"); " + strCallback + "(\"" + strCard + "\", \"" + strCardType + "\");'>" + nSlot;
            strHTML += "</td>";
			
			if ( strCard == strCheckedCard )
			{
				strSelCardType = strCardType;
			}
        }
    
        strHTML += "</tr></table></font><br>";
		
		var objRet = new Object();
		objRet.m_strHTML = strHTML;
		objRet.m_strSelCard = strCheckedCard;
		objRet.m_strSelCardType = strSelCardType;
        return objRet;
    }
	
	function onCardSelected_M( strCardGroupType, strCard )
	{
		parent.frames[0].G_map[ strCardGroupType ] = strCard;
	}
}

var G_configInfo = new ConfigInfo();
