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

