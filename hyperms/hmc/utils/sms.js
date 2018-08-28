function getGroups( objSMSInfo )
{
    objGroups = objData.sim_config;
    var arGroups = new Array();
    var mapGroupSet = new Object();
    for (var strCard in objGroups)
    {
        strI2CAddr = objGroups[strCard].card;
        var objGroup = objGroups[strCard];
        if ( objGroup.group != null )
        {
            mapGroupSet[ objGroup.group ] = "x";
        }
    }
    var nCount = 0;
    for (var strGroup in mapGroupSet)
    {
        arGroups[nCount++] = strGroup;
    }
    
    return arGroups;
}
