/*
(c) frog, unless otherwise licensed or noted

$Archive: /frog DHTML Library/BrowserAbsLayers/BrowserDetect.js $
$Author: Dave Peckham $ 
$Date: 9/13/00 11:10a $ 
$Revision: 3 $  
$History: BrowserDetect.js $
 * 
 * *****************  Version 3  *****************
 * User: Dave Peckham Date: 9/13/00    Time: 11:10a
 * Updated in $/frog DHTML Library/BrowserAbsLayers
 * fixed missing is.ie and is.nav
   		 
Description:
Netscape's Ultimate client-side JavaScript client sniff

*/
// Ultimate client-side JavaScript client sniff.
// (C) Netscape Communications 1999. Permission granted to reuse and distribute.
// Revised 17 May 99 to add is.nav5up and is.ie5up (see below).
// Revised 8 Aug 00 by frog to change name to BrowserSniffer from Is and to
// be optimized for our purposed by removing extraneous properties such as
// all unix variations, javascript version check and early browser version we
// aren't supporting anyway. 8.4k to 1.8k

function BrowserDetect () {
	// convert all characters to lowercase to simplify testing
	var agt=navigator.userAgent.toLowerCase();
	this.nameB=navigator.userAgent.toLowerCase();
	// *** BROWSER VERSION ***
	// Note: On IE5, these return 4, so use is.ie5up to detect IE5.
	this.major = parseInt(navigator.appVersion);
	this.minor = parseFloat(navigator.appVersion);
	
	this.nav = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1) && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1) && (agt.indexOf('webtv')==-1));
    this.nav4 = (this.nav && (this.major == 4));
    this.nav4up = (this.nav && (this.major >= 4));
    this.navonly = (this.nav && ((agt.indexOf(";nav") != -1) ||
    (agt.indexOf("; nav") != -1)) );
    this.nav5 = (this.nav && (this.major == 5));
    this.nav5up = (this.nav && (this.major >= 5));

    this.ie = (agt.indexOf("msie") != -1);
    this.ie4 = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.0")==-1) );
    this.ie4up = (this.ie &&(this.major >= 4));
    this.ie5 = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.0")!=-1) );
    this.ie5up = (this.ie &&!this.ie3 && !this.ie4);

    // KNOWN BUG: On AOL4, returns false if IE3 is embedded browser
    // or if this is the first browser window opened. Thus the
    // properties is.aol, is.aol3, and is.aol4 aren't 100% reliable.
    this.aol4 = (this.aol && this.ie4);

    // *** PLATFORM ***
    this.win = ( (agt.indexOf("win")!=-1) || (agt.indexOf("16bit")!=-1) );
    this.mac = (agt.indexOf("mac")!=-1);
}

