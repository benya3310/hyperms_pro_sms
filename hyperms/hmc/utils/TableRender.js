/////////////////////////////////////////////////////////////////
// TableRender.js
//
// Handles the rendering of an HTML table from an oTable object
//---------------------------------------------------------------
// Structure of table object
//---------------------------------------------------------------
//
// oTable
// {
//    m_oHeader
//    m_oRows[]
// }
//
// oHeader
// {
//    m_oHeaderCell[]
// }
//
// oHeaderCell
// {
//   m_strName
//   m_nWidth
// }
//
// oRow
// {
//    m_oCells[]
// }
//
// oCell
// {
//   m_eType
//   m_oCheckbox | m_oDropdown | m_strText
// }
//
//---------------------------------------------------------------

var eText       = 0;
var eCombo      = 1;
var eCheckBox   = 2;


///////////////////////////////////////////////////////////////////////////
// GetTableHeaderHTML
// ==================
//
// Get the HTML of the table header based on the oTable.oHeader structure
// The HTML is actually a separate table that is above the data table.
// This is to enable a scollable data table with a fixed header.
///////////////////////////////////////////////////////////////////////////

function GetTableHeaderHTML( oTable )
{
    var nWidth = 0;
    
    for (var i=0; i<oTable.oHeader.length; i++)
    {
        nWidth += oTable.oHeader[ i ].m_nWidth;
    }
    
    var strHTML = '<TABLE cellSpacing=0 cellPadding=0 border=0 width=' + nWidth + '><TR>';
    
    var strBgColor;
    for (var i=0; i<oTable.oHeader.length; i++)
    {
        if (i%2)
        {
            strBgColor = '#e0e0e0';
        }
        else
        {
            strBgColor = '#f0f0f0';
        }
        
        strHTML += "<TD bgcolor='";
        strHTML += strBgColor;
        strHTML += "' width=";
        strHTML += oTable.oHeader[ i ].m_nWidth;
        strHTML += '>';
        
        strHTML += oTable.oHeader[ i ].m_strName;
        strHTML += '</TD>';
    }

    strHTML += "</TR></TABLE>";
    return strHTML
}

///////////////////////////////////////////////////////////////////////////
// GetTableFooterHTML
// ==================
//
// Get the HTML of the table footer based on the oTable.oHeader structure
// The HTML is actually a separate table that is below the data table.
// This is to create a line below the scollable data table.
///////////////////////////////////////////////////////////////////////////

function GetTableFooterHTML( oTable )
{
    var nWidth = 0;
    
    for (var i=0; i<oTable.oHeader.length; i++)
    {
        nWidth += oTable.oHeader[ i ].m_nWidth;
    }
    
    var strHTML = '<TABLE cellSpacing=0 cellPadding=0 border=0 width=' + nWidth + '><TR><TD></TD></TR></TABLE>';
    return strHTML;
}

///////////////////////////////////////////////////////////////////////////
// GetTableBodyHTML
// ==================
//
// Get the HTML of the table body based on the oTable structure
// The HTML is a separate table that is below the header table.
//
///////////////////////////////////////////////////////////////////////////
function GetTableBodyHTML( oTable, strTableID, nDIVHeight, arColsClickable )
{
    var nWidth = 0;
    
    for (var i=0; i<oTable.oHeader.length; i++)
    {
        nWidth += oTable.oHeader[ i ].m_nWidth;
    }
    
    var nDIVWidth = nWidth + 20; // Enough for the vertical scrollbar of the DIV

    var strHTML = '<DIV STYLE="width: ';
    strHTML += nDIVWidth;
    strHTML += 'px; height: ';
    strHTML += nDIVHeight;
    strHTML += 'px; overflow: auto;">';
    
    strHTML += '<TABLE ID="';
    strHTML += strTableID;
    strHTML += '" cellSpacing=0 cellPadding=0 border=0 width=';
    strHTML += nWidth;
    strHTML += '><TR>';
    
    // Iterate over all the rows of the table
    for (var i=0; i<oTable.m_oRows.length; i++)
    {
        // Cosmetics - alternate color every other row
        
        strHTML += "<TR bgcolor='";
        if (i%2)
        {
            strHTML += "#ffffff";
        }
        else
        {
            strHTML += "#d0d0d0";
        }
        strHTML += "'>";

        // Write the HTML of the row's cells
        
        var oRow = oTable.m_oRows[ i ];
        
        for (var j=0; j<oRow.length; j++)
        {
            var oCell = oRow[ j ];
            strHTML += "<TD ";

            // unique cell ID
            var strCellID = strTableID + '_' + i + '_' + j;
            strHTML += "id='";
            strHTML += strCellID;

            // cell width (derived from corrsponding header cell width) 
            strHTML += "' width='";
            strHTML += oTable.oHeader[ j ].m_nWidth;
            strHTML += "' ";

            strHTML += "m_strType='";
            strHTML += oCell.m_strType;
            strHTML += "' ";
			
            strHTML += "m_strCard='";
            strHTML += oCell.m_strCard;
            strHTML += "' ";
			
            strHTML += "m_strChannel='";
            strHTML += oCell.m_strChannel;
            strHTML += "' ";
			
            if ( arColsClickable[ j ] == 1 )
            {
                if (document.all)
                {
                    strHTML += "style='cursor:hand'"; // IE
                }
                else
                {
                    strHTML += "style='cursor:pointer'"; // Netscape
                }
            }
            
            strHTML += ' onClick=occ("' + strTableID + '",' + i + ',' + j + ');';

            strHTML += ">";

            switch ( oCell.m_eType )
            {
                case eText:
                    strHTML += oCell.m_strText;
                    break;
                
                case eCombo:
                case eCheckBox:
                default:
                    break;
            }
            
            strHTML += "</TD>";
        }
        
        // and close the row
        strHTML += '</TR>';
    }
    
    strHTML += '</TABLE></DIV>';
    return strHTML;
}

///////////////////////////////////////////////////////////////////////////
// GetCell
// ==================
//
// Get the DOM Cell objet of the particular table cell
//
///////////////////////////////////////////////////////////////////////////
function GetCell( strTableID, nRow, nColumn )
{
    var strCellID = strTableID + '_' + nRow + '_' + nColumn;
    return document.getElementById( strCellID );
}

///////////////////////////////////////////////////////////////////////////
// occ
// ====
// Called whenever a table cell is clicked. If a callback function is
// implemented by the relevant page, it is invoked with the parameters
// of the table id and row and column numbers
//
///////////////////////////////////////////////////////////////////////////
function occ( strTableID, nRow, nCol )
{
    if ( onCellClicked )
    {
        onCellClicked( strTableID, nRow, nCol );
    }
}
