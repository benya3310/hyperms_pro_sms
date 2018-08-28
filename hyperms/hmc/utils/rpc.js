function RPC()
{
    this.m_nTimerId = 0;
    /*
    // TODO: avoid having the user create a script in the HTML
    var receiver = document.createElement('script');
    receiver.id = 'scriptreceiver';
    */
    this.rawInvoke =  function( strServerUrl, nTimeout )
    {
        var receiver = document.createElement('script');
        receiver.id = 'scriptreceiver';
        receiver.src = strServerUrl;
        var placeholder = document.getElementById('scriptreceiver');
        placeholder.parentNode.replaceChild(receiver, placeholder);
        //m_nTimerId = setTimeout( function() { this.onTimeout(); }, nTimeout );
    }
    
    this.invoke =  function( strServerUrl, objParams, strHandler, nTimeout )
    {
        var strParams = "?";
        for (var tag in objParams)
        {
            if ( strParams != "?" )
            {
                strParams += "&";
            }
            strParams += encodeURIComponent(tag) + "=" + encodeURIComponent(objParams[tag]);    
        }
        if ( strParams != "?" )
        {
            strParams += "&rpchandler=" + strHandler;
        }
        var receiver = document.createElement('script');
        receiver.id = 'scriptreceiver';
        receiver.src = strServerUrl + strParams;
        var placeholder = document.getElementById('scriptreceiver');
        placeholder.parentNode.replaceChild(receiver, placeholder);
        //m_nTimerId = setTimeout( function() { this.onTimeout(); }, nTimeout );
    }
}
