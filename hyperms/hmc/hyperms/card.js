//// Hypermedia card

if (typeof(hyperms) == "undefined") {
    hyperms = {};
}

hyperms.card = (function() {
    var that = {};
    var names = {
        // serial number prefix: name
        '001': 'PRI1.1',
        '002': 'CL4',   // either CG4.x or CC4.x
        '003': 'MG',
        '004': 'TDMA',
        '005': 'CDMA',
        '006': 'PC',
        '007': 'AN4',
        '008': 'PM',
        '009': 'CU4',
        '010': 'USB Audio Card',
        '011': 'CB',
        '012': 'PRI2.2',
        '013': 'PXA',
        '014': 'HBD',
        '015': 'PRI2.1',
        '016': 'QBRI',
        '017': 'S-HUB',
        '018': 'SU',    // Surf media card
        '019': 'HBS',
        '020': 'HBN',
        '021': 'CL4',   // (GSM, CDMA or UTMS)
        '022': 'PC'     // Rev4
    };

    /**
     * Returns card name from card serial number. Returns undefined if card is
     * unknown.
     */
    var name = function(serial) {
        var prefix = serial.substring(0, 3);
        return names[prefix];
    };

    that.name = name;
    return that;
})();
