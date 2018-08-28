function PacketString( strMessage )
{
    this.m_strMessage = new String(strMessage);
    this.getSection = getSectionMethod;
    
    function getSectionMethod( strSectionName )
    {
        var nTagLen = strSectionName.length;
        var Params = this.m_strMessage.split( "/" );
        for (var i=0; i<Params.length; i++)
        {
            var strParam = new String( Params[ i ] );
            if ( strParam.substr(0,nTagLen) == strSectionName )
            {
                return strParam.substr( nTagLen );
            }
        }
        
        return null;
    }
}

function syncTables( strTable1, strTable2 )
{
	var firstRow1 = document.getElementById(strTable1).rows[0];
	var firstRow2 = document.getElementById(strTable2).rows[0];
	
	if ( typeof( firstRow1 ) == 'undefined' || typeof( firstRow2 )== 'undefined' )
	{
		return;
	}
	
	var nLen1 = firstRow1.cells.length;
	var nLen2 = firstRow2.cells.length;
	for (var i=0; i<nLen1; i++)
	{
		var nWidth1 = firstRow1.cells[i].clientWidth;
		var nWidth2 = firstRow2.cells[i].clientWidth;
		if ( nWidth1 > nWidth2 )
		{
			firstRow2.cells[i].setAttribute( "width", nWidth1 );
		}
		else
		{
			firstRow1.cells[i].setAttribute( "width", nWidth2 );
		}
	}
}


function utils_clickIt( obj, strFile, bPressed, nDebug )
{
    obj.bPressed = bPressed;
    var str = 'document.all.' + obj.name + '.src = "' + strFile + '"';
    //if (nDebug==1) alert(str);
    eval( str );
}

function utils_getButtonHTML( strAction, strBtnName )
{
    var strUp = 'Up-' + strBtnName;
    var strDown = 'Down-' + strBtnName;

    var strHTML = '<img name="bnext" src="' + strUp + '"';
    strHTML += ' onmousedown="utils_clickIt( this, \'' + strDown + '\', 1 );"';
    strHTML += ' onmouseup="if (this.bPressed==1) {utils_clickIt( this, \'' + strUp + '\', 0 ); javascript:' + strAction + '; }"';
    strHTML += ' onMouseOver = "style.cursor=\'hand\'"';
    strHTML += ' onmouseout="utils_clickIt( this, \'' + strUp + '\', 0 );">';
    
    return strHTML;
}

function dump(theObj) {
	var tx="<table width='100'>";
	var props = new Array();
	for (var i in theObj) { props.push(i); }
	props.sort();
	for (var i=0; i<props.length; i++) {
		tx+= "<tr><td>"+props[i]+"</td><td>"+theObj[props[i]]+"</td></tr>";
	}
	tx+="</table>"
	document.write(tx);
}
function IsNumeric(sText)
{
   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;
   if ( sText == null )
   	 return null;
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
}
function isValidName( strMessage )
{
	if ( typeof( strMessage ) == "undefined" )
	{
		return false;
	}
	
	var regex=/^[0-9A-Za-z\-_]+$/;
	if (regex.test(strMessage))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function replaceAll( str, from, to )
{
    var idx = str.indexOf( from );

    while ( idx > -1 )
    {
        str = str.replace( from, to ); 
        idx = str.indexOf( from );
    }

    return str;
}

function getSelCardText( nSlot, strCardType )
{
    // This is ugly ! use a hash table ...
    
    var strCardDesc = "unknown";
    
    switch ( strCardType )
    {
        case "CG4.0":
        {
            strCardDesc = "GSM";
            break;
        }
        
        case "CC4.0":
        case "CC4.2":
        {
            strCardDesc = "CDMA";
            break;
        }
        
        case "CT4.1":
        {
            strCardDesc = "TDMA";
            break;
        }
        
        case "CU4.1":
        {
            strCardDesc = "UMTS/3G";
            break;
        }
        
        case "MG.0":
        {
            strCardDesc = "Media Card";
            break;
        }
        
        case "E1.0":
        {
            strCardDesc = "E1 PRI";
            break;
        }
        
        case "T1.0":
        {
            strCardDesc = "T1 PRI";
            break;
        }
        
        case "AN4.4":
        {
            strCardDesc = "Analog Card";
            break;
        }
        case "LCR":
        {
            strCardDesc = "LCR Card";
            break;
        }
        
        case "QBRI":
        {
            strCardDesc = "BRI";
            break;
        }

	}

    if ( nSlot == -1 )
    {
        return strCardDesc;
    }
    
    var strText = "Selected card at slot " + nSlot + " (" + strCardDesc + ")";
    return strText;
}

// ====================================================================
//       URLEncode and URLDecode functions
//
// Copyright Albion Research Ltd. 2002
// http://www.albionresearch.com/
//
// You may copy these functions providing that 
// (a) you leave this copyright notice intact, and 
// (b) if you use these functions on a publicly accessible
//     web site you include a credit somewhere on the web site 
//     with a link back to http://www.albionresarch.com/
//
// If you find or fix any bugs, please let us know at albionresearch.com
//
// SpecialThanks to Neelesh Thakur for being the first to
// report a bug in URLDecode() - now fixed 2003-02-19.
// ====================================================================
function URLEncode( plaintext )
{
	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = "0123456789" +					// Numeric
					"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
					"abcdefghijklmnopqrstuvwxyz" +
					"-_.!~*'()";					// RFC2396 Mark characters
	var HEX = "0123456789ABCDEF";

	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
			    alert( "Unicode Character '" 
                        + ch 
                        + "' cannot be encoded using standard URL encoding.\n" +
				          "(URL encoding only supports 8-bit characters.)\n" +
						  "A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for

	return encoded;
};

function URLDecode( encoded )
{
   // Replace + with ' '
   // Replace %xx with equivalent character
   // Put [ERROR] in output if %xx is invalid.
   var HEXCHARS = "0123456789ABCDEFabcdef"; 
   var plaintext = "";
   var i = 0;
   while (i < encoded.length) {
       var ch = encoded.charAt(i);
	   if (ch == "+") {
	       plaintext += " ";
		   i++;
	   } else if (ch == "%") {
			if (i < (encoded.length-2) 
					&& HEXCHARS.indexOf(encoded.charAt(i+1)) != -1 
					&& HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 ) {
				plaintext += unescape( encoded.substr(i,3) );
				i += 3;
			} else {
				alert( 'Bad escape combination near ...' + encoded.substr(i) );
				plaintext += "%[ERROR]";
				i++;
			}
		} else {
		   plaintext += ch;
		   i++;
		}
	} // while

   return plaintext;
};

function toggleBox(szDivID, iState) // 1 visible, 0 hidden
{
   var obj = document.layers ? document.layers[szDivID] :
   document.getElementById ?  document.getElementById(szDivID).style :
   document.all[szDivID].style;
   obj.visibility = document.layers ? (iState ? "show" : "hide") :
   (iState ? "visible" : "hidden");
}

function IsNumeric(sText)

{
   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;

 
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
   }


/*
 * toJson
 *
 * produces a JSON string representation of a javascript object
 * usage: var jsonstring = toJSON(someobject);
 *
 * Tino Zijdel - crisp@xs4all.nl, 28/09/2006
*/
function toJSON(obj)
{
	if (typeof obj == 'undefined')
		return 'undefined';
	else if (obj === null)
		return 'null';

	var stringescape = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
        }

	var json = null, i, l, v, a = [];
	switch (obj.constructor)
	{
		case Array:
			l = obj.length;
			for (i = 0; i < l; i++)
			{
				if ((v = toJSON(obj[i])) !== null)
					a.push(v);
			}
			json = '[' + a.join(',') + ']';
			break;
		case Object:
			for (i in obj)
			{
				if (obj.hasOwnProperty(i) && (v = toJSON(obj[i])) !== null)
					a.push(toJSON(String(i)) + ':' + v);
			}
			json = '{' + a.join(',') + '}';
			break;
		case String:
			json = '"' + obj.replace(/[\x00-\x1f\\"]/g, function($0)
			{
				var c;
				if ((c = stringescape[$0]))
					return c;
				c = $0.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
			break;
		case Number:
			json = isFinite(obj) ? String(obj) : 'null';
			break;
		case Boolean:
			json = String(obj);
			break;
	}

	return json;
}

// Wrapper for base64 encoder/decoder adapted from http://ntt.cc/

Base64 = function()
{  
    var self = this;
    self.m_keyStr = "ABCDEFGHIJKLMNOP" +
                    "QRSTUVWXYZabcdef" +
                    "ghijklmnopqrstuv" +
                    "wxyz0123456789+/" +
                    "=";

    self.encode64 = function(input)
    {
        //input = escape(input);
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else
            if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output = output +
                    self.m_keyStr.charAt(enc1) +
                    self.m_keyStr.charAt(enc2) +
                    self.m_keyStr.charAt(enc3) +
                    self.m_keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        }
        while (i < input.length);

        return output;
    }

    self.decode64 = function(input)
    {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input))
        {
            alert("Invalid base64 characters in the input text");
        }
         
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
        do
        {
            enc1 = self.m_keyStr.indexOf(input.charAt(i++));
            enc2 = self.m_keyStr.indexOf(input.charAt(i++));
            enc3 = self.m_keyStr.indexOf(input.charAt(i++));
            enc4 = self.m_keyStr.indexOf(input.charAt(i++));
            
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            
            output = output + String.fromCharCode(chr1);
            
            if (enc3 != 64)
            {
               output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64)
            {
               output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
            
        }
        while (i < input.length);
        
        //return unescape(output);
        return output;
    }
}
