//// Hypermedia info

if (typeof(hyperms) == "undefined") {
    hyperms = {};
}

/**
 * I collect and keep gateway information
 *
 * Options is an object with this keys:
 *
 * - delegate: object implementing any of the info delegate methods
 * - timeout: milliseconds to wait for reply from hgs (default 30000)
 * - auth_reply: hgs authentication reply. Contains information about hgs version
 *
 * Delegate methods:
 *
 * - info_did_finish(sender) - called when info finished collection
 * - info_did_fail(sender, error) - called when info failed to collect information 
 *
 */
hyperms.info = function(options) {
    // Set defaults    
    options.timeout = options.timeout || 30000;

    /**
     * Public interface
     */

    /**
     * Start collecting info from hgs.
     *
     * Invokes the delegate info delegate methods when done.
     */
    var start = function() {
        if (timeout_id !== null)
            throw {name: "inconsistency error", message: "info already started"};

        timeout_id = setTimeout(timeout, options.timeout);

        if (can_get_packages_and_status()) {
            state = get_packages_state(
                    get_app_status_state(
                        get_model_name_state(null)));
        } else {
            state = get_model_name_state(null);
        }
        state.start();
    };

    /**
     * Cancel collection. The delegate will not get any notifiction.
     */
    var cancel = function() {
        state = null; // Stop handling
        clear_timeout();
    };

    /**
     * Handle a message from hgs.
     *
     * Returns true if message was handled, false otherwise.
     */
    var handle = function(cmd, params) {
        if (state === null)
            return false; // Not started yet or already finished

        var ps = new PacketString(params);
        var id = ps.getSection('I');
        if (id !== private_id)
            return false; // Not my message

        return state.handle(cmd, ps);
    };
    
    var that = {
        // Methods
        start: start,
        cancel: cancel,
        handle: handle,

        // Properties
        model_name: "",
        media_card: "",
        packages: {},
        status: {}
    };
    
    /**
     * Private interface
     */

    // Initialize info from hgs authentication reply
    var init = function() {
        
        // Split the first argument and drop the rest
        var blob = options.auth_reply.split(" ", 1)[0];
        var versions;
        if (blob.length > 0)
            versions = blob.split("|");
        else
            versions = ["pre-1.50"];

        // hgs and signalgw use legacy version string format, where the variant and
        // platform are encoded at the end of the version string.

        var hgs = parse_legacy_version_string(versions[0]);

        // Take the model from hgs version info
        that.model_name = hgs.variant + hgs.platform;
        that.media_card = hgs.media_card;

        // Register hgs package with partial information
        that.packages['hgs'] = {name: 'hgs', version: hgs.version};
        that.status.hgs = 'ok'; // Always ok

        if (versions[1]) {
            // Singalgw was started by hgs
            that.status.signalgw = 'ok';
            // Register signalgw package with partial information
            var signalgw = parse_legacy_version_string(versions[1]);
            var pkg = {name: 'signalgw', version: signalgw.version};
            if (signalgw.model) {
                // Signalgw contained more specific model string in older versions
                that.model_name = signalgw.variant + signalgw.platform;
                // Update packages variants
                if (signalgw.model.charAt(0) === "S")
                    pkg.variants = ['sip'];
                if (signalgw.model.charAt(0) === "H")
                    pkg.variants = ['h323'];
            }
            that.packages[pkg.name] = pkg;
        } else if (should_have_signalgw()) {
            that.status.signalgw = 'error';
        }

        if (versions[2]) {
            // SMS Server is installed.
            // The version does not use the lagacy format.
            that.packages['sms_server'] = {name: "sms_server", version: versions[2]};
        }
    };

    // Returns true if hgs should support the GetPackages and GetAppStatus commands
    // HMCServer does not give any error when you send an unknown command, which may
    // lead to unpleasent delay if you try the commands on old version.
    var can_get_packages_and_status = function() {
        if (that.packages['hgs'] === undefined)
            // This should never happen
            return false;    

        // Check the version - version 2.x or later supports packages and
        // status.
        var hgs = that.packages['hgs'];
        var parts = hgs.version.split('.');
        var version = parseInt(parts[0]);
        if (version > 1)
            return true;
        
        // This is version 1.x - check the revision number.
        var revision = parts[parts.length - 1];
        if (revision === undefined)
            // Invalid version string - should never happen
            return false;

        // Revision may include a branch name, separated with "-"
        var sep = revision.search(/-\d+$/);
        var revno = parseInt(revision.substring(sep + 1));
        //alert('revno = ' + revno);
        return revno >= 3218;
    };

    var should_have_signalgw = function() {
        var variant = that.model_name.charAt(0);
        return variant === 'S' || variant === 'H';
    };

    // Parse legacy version string: "version.revision-XX". Returns an object
    // with version, platform, variant and media_card attributes.
    var parse_legacy_version_string = function(version_string) {
        // Possible formats: 
        // - version-[LPW]          - (platform)
        // - version-[SLB][LPW]     - (variant, platform)
        // - version-[SLB][LPW][SA] - (variant, platform, mediacard)
        var sep = version_string.search(/-[A-Z]{1,3}$/);
        if (sep === -1)
            // Should not happen
            return {
                version: version_string,
                platform: "",
                variant: "",
                media_card: ""
            };
        
        var info = {};
        info.version = version_string.substring(0, sep);
        
        var attributes = version_string.substring(sep + 1);
        switch (attributes.length) {
            case 1:
                info.platform = attributes;
                info.variant = "";
                info.media_card = "";
                break;
            case 2:
                info.variant = attributes.charAt(0);
                info.platform = attributes.charAt(1);
                info.media_card = "";
                break;
            case 3:
                info.variant = attributes.charAt(0);
                info.platform = attributes.charAt(1);
                info.media_card = attributes.charAt(2);
                break;

        }
        return info;
    };

    var transition = function(next_state) {
        state = next_state;
        state.start();
    };

    var timeout = function() {
        fail("timeout");
    };

    var finish = function() {
        state = null;
        clear_timeout(); 
        if (delegate && delegate.info_did_finish)
            delegate.info_did_finish(that);
    };

    var fail = function(reason) {
        state = null;
        clear_timeout(); 
        if (delegate && delegate.info_did_fail)
            delegate.info_did_fail(that, reason);
    };

    var clear_timeout = function() {
        if (timeout_id) {
            clearTimeout(timeout_id);
            timeout_id = null;
        }
    };

    var delegate = options.delegate;
    var timeout_id = null;
    var private_id = '999';
    var state = null;

    /**
     * States
     */

    var get_packages_state = function(next_state) {

        var start = function() {
            var cmd = "GetPackages /I" + private_id;
            var result = SendCommand(cmd);
            //alert("SendCommand(\"" + cmd + "\") -> " + result);
        };
        
        var handle = function(cmd, ps) {
            switch (cmd) {
                case "GetPackagesReply":
                    //alert('GetPackagesReply: ' + ps);
                    update_packages(ps);
                    transition(next_state);
                    return true; 
                case "GWError":
                    //alert('GWError: ' + params);
                    fail("Cannot get installed packages");
                    return true;
            }
            return false;
        };

        // Fill packages registry from GetPackagesRely message packet string
        var update_packages = function(ps) {
            var blob = ps.getSection("g");
            if (blob === null)
                return; // Invalid reply
            var rows = blob.split('|');
            for (var i in rows) {
                var row = rows[i].split(',');
                var pkg = {};
                pkg.name = row[0];
                pkg.platform = row[1];
                pkg.version = row[2];
                if (row[3].length > 0)
                    pkg.variants = row[3].split(" ");
                else
                    pkg.variants = [];
                pkg.timestamp = row[4];
                that.packages[pkg.name] = pkg;
            }
        };
    
        return {
            start: start,
            handle: handle
        };
    };

    var get_app_status_state = function(next_state) {

        var start = function() {
            var cmd = "GetAppStatus /I" + private_id;
            var result = SendCommand(cmd);
            //alert("SendCommand(\"" + cmd + "\") -> " + result);
        };
        
        var handle = function(cmd, ps) {
            switch (cmd) {
                case "GetAppStatusReply":
                    //alert('GetAppStatusReply: ' + ps);
                    update_status(ps);
                    // Ask the carrier card to send its serial number
                    //SendCommand('SendGenericPacket 53:/AFF/I' + private_id);
                    transition(next_state);
                    return true; 
                case "GWError":
                    //alert('GWError: ' + ps);
                    fail("Cannot get application status");
                    return true;
            }
            return false;
        };

        // Fill status from GetAppStatusReply message packet string
        var update_status = function(ps) {
            var blob = ps.getSection("g");
            if (blob === null)
                return; // Invalid reply
            var rows = blob.split('|');
            for (var i in rows) {
                var row = rows[i].split(',');
                var name = row[0];
                var status = row[1];
                that.status[name] = status;
            }
        };
    
        return {
            start: start,
            handle: handle
        };
    };

    var get_model_name_state = function(next_state) {

        var start = function() {
            var cmd = 'SendGenericPacket 53:/AFF/I' + private_id;
            var result = SendCommand(cmd);
            //alert("SendCommand(\"" + cmd + "\") -> " + result);
        };
        
        var handle = function(cmd, ps) {
            switch (cmd) {
                case "GenericReply":
                    //alert('GenericReply: ' + ps);
                    if (ps.getSection('#') !== '54')
                        return false; // Not my message (unlikely).
                    update_model_name(ps);
                    finish();
                    return true;
                case "GWError":
                    //alert('GWError: ' + ps);
                    fail("Cannot get model name");
                    return true;
            }
            return false;
        };

        // Fill model_name from GenericReply /#54 message parameters
        var update_model_name = function(ps) {
            var serial = ps.getSection("g");
            var name = hyperms.card.name(serial);
            if (name)
                that.model_name = name + ' ' + that.model_name;
        };

        return {
            start: start,
            handle: handle
        };
    };

    init();

    return that;
};
