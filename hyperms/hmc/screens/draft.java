	private boolean SetTwoWayProxyConfig( String strParams, String strType )
	{
		ProxyResourcePool container = null;
		if ( strType.equals( "Callback" ) )
		{
			container = m_server.m_callbackModules;
		}
		else
		if ( strType.equals( "Callthrough" ) )
		{
			container = m_server.m_callthroughModules;
		}
		else
		{
			return false;
		}
		
		PacketString packStr = new PacketString( strParams );
		String strID		= packStr.getSection( "I" );
		String strAddress	= packStr.getSection( "A" );
		String strCheckList	= packStr.getSection( "G" );
		String strVPNList	= packStr.getSection( "V" );
		
		String[] arChecked		= strCheckList.split( "," , -1 );
		
		String str1stLegI2CLinks	= m_server.getCurrentI2CLinks( strAddress );
		
		if ( str1stLegI2CLinks == null )
		{
			return false;
		}
		
		String[] arI2CLinks		= str1stLegI2CLinks.split( "," , -1 );
		
		// Build the updated I2C links for this 1st leg card (i.e, make the I2C links
		// for the channels that have been marked for callback point to the PC address)
		
		String strNew1stLegI2CLinks	= "";
		String strPCAddr			= m_server.getPCAddr();
		
		String[] arMediaLinks		= m_server.getLogicalLinks( strAddress );
		
		Hashtable updates = new Hashtable();
		
		for (int i = 0; i < arChecked.length; i++ )
		{
			if ( arChecked[ i ].equals( "1" ) )
			{
				// I2C signalling address for this module will be the PC I2C address
				strNew1stLegI2CLinks += strPCAddr;
				
				// Remember the logical signalling address that this module signalled to
				// so that we can later update it to point to the PC address as well
				
				String 		strMediaLink = arMediaLinks[ i ];
				//Logger.logPrintln( "strMediaLink=[" + strMediaLink + "]" ); 
				String[]	arCardChannel	= strMediaLink.split( "\\." );
				String		strCard = arCardChannel[0];		// in this case, same as arI2CLinks[ i ]
				String		strChannel = arCardChannel[1];
				
				if ( updates.get( strCard ) == null )
				{
					// This channel's I2C address should point to the PC address
					updates.put( strCard, strChannel );
				}
				else
				{
					// expand the list of channels whose I2C address needs to
					// be set to the PC (since they are the 2nd leg of a callback)
					String strList = (String)updates.get( strCard );
					strList += "," + strChannel;
					updates.put( strCard, strList );
				}
			}
			else
			{
				// Either "0" (unchanged) or "2" (Set as callback leg2): 
				// I2C signalling address for this module/channel remains unchanged
				strNew1stLegI2CLinks += arI2CLinks[ i ];
			}
			
			if ( i < arChecked.length-1 )
			{
				strNew1stLegI2CLinks += ",";
			}
		}
		
		// First, update the 1st leg card's I2C links
		// Note that there is no need to check if we are accidentally overwriting
		// some existing application associated with a channel since the UI would
		// not allow it in the first place.
		if ( !m_server.cardUpdateI2CLinks( strAddress, strNew1stLegI2CLinks ) )
		{
			return false;
		}
		
		// Done.
		// Next, update the I2C links of the 2nd Leg cards that are connected to 1st leg
		// callback channels on this card
		
		for (Enumeration e = updates.keys(); e.hasMoreElements() ;)
		{
			String strDstCard = (String)e.nextElement();
			String str2ndLegI2CLinks = m_server.getCurrentI2CLinks( strDstCard ); 
			if ( str2ndLegI2CLinks == null )
			{
				return false;
			}
			
			// ar2ndLegLinks contains an array of the I2C addresses of a 2nd Leg card
			// that the callback module is connected to
			String[] ar2ndLegLinks	= str2ndLegI2CLinks.split( "," , -1 );
			
			// the arModifyList contains the channel indices of the I2C links in the
			// 2nd leg card that have to be changed to point to the PC I2C address
			String strModifyList = (String)updates.get(strDstCard);
			String[] arModifyList = strModifyList.split( "," );
			
			// Modify the I2C addresses that were connected to the callback channel
			for (int i=0; i<arModifyList.length; i++)
			{
				try
				{
					int nChannel = Integer.parseInt( arModifyList[ i ] );
					ar2ndLegLinks[ nChannel-1 ] = strPCAddr;
				}
				catch (NumberFormatException ex)
				{
					Logger.logPrintln( "Error - Invalid modified channel value:" + arModifyList[ i ] );
					continue;
				}
			}
			
			// Create the I2C update string for the card
			String strNewE1Links = "";
			
			for (int i=0; i<ar2ndLegLinks.length; i++)
			{
				strNewE1Links += ar2ndLegLinks[ i ]; 
				if ( i < ar2ndLegLinks.length-1 )
				{
					strNewE1Links += ",";
				}
			}
			
			if ( !m_server.cardUpdateI2CLinks( strDstCard, strNewE1Links ) )
			{
				return false;
			}
		}
		
		// Now update the memory callback resources.
		String[] arVPNList = strVPNList.split( "," , -1 );
		
		for (int i = 0; i < arChecked.length; i++ )
		{
			String strLogicalAddr = strAddress + "." + (i+1);
			
			if ( arChecked[ i ].equals( "1" ) )
			{
				TwoWayProxy cbModule = container.get( strLogicalAddr );
				if ( cbModule == null )
				{
					// A new callback module should be created
					if ( strType.equals( "Callback" ) )
					{
						cbModule = new CallbackModule( strAddress, i+1, arVPNList[ i ] );
					}
					else
					{
						cbModule = new CallthroughModule( strAddress, i+1, arVPNList[ i ] );					
					}
					// and added to the callback modules resource pool.
					container.put( strLogicalAddr, cbModule );
				}
			}
			else
			if ( arChecked[ i ].equals( "0" ) )
			{
				// If it wasn't marked as checked then is is marked as unchecked
				// which means this module should not participate in the callback
				// resource pool anymore.
				if ( container.get( strLogicalAddr ) != null )
				{
					// Only remove it if there was something there before
					// This will cause a "callback resource removed" log entry
					container.remove( strLogicalAddr );
				}
			}
			// The case of arChecked[ i ].equals( "2" ) required no handling
		}
		
		// Send a reply to the HMC client that the operation completed sucessfully
		
		return true;
	}
