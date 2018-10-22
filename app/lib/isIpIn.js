/*
var s = new DESKTOP.lib.isIpIn();
s.test();
 */
Ext.define('DESKTOP.lib.isIpIn', {
    is_ip_in: function (ip, net, mask) {
        if (!this.verify_ip(ip) || !this.verify_ip(net))
            return false;
        var err = "";
        if (ip + "" === "" || net + "" === "" || mask + "" === "")
            return true;
        var ip_pattern = /^(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})$/;
        var ip_array = ip.match(ip_pattern);
        if (Math.round(ip_array[1]) >= 224) {
            return false;
        }
        var bin_ip = this.iptobin(ip);
        var bin_net = this.iptobin(net);
        var bin_mask = this.iptobin(mask);
        for (var cmask = 0; cmask < 32; cmask++) {
            if (bin_mask.charAt(cmask) == "0")
                break;
        }
        var firstpart = bin_net.substr(0, cmask);
        var broadcast = this.str_pad(firstpart, 32, "1");
        var identifier = this.str_pad(firstpart, 32, "0");
        var ident_ip = parseInt(identifier, 2);
        var broadcast_ip = parseInt(broadcast, 2);
        var my_ip = parseInt(bin_ip, 2);
        if (ident_ip < my_ip && my_ip < broadcast_ip)
            return true;
        else
            return false;
    },
    iptobin: function (ip) {
        var ip_pattern = /^(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})$/;
        var ip_array = ip.match(ip_pattern);
        var bin,
            binip = "";
        for (var i = 1; i < 5; i++) {
            bin = Math.round(ip_array[i]).toString(2);
            binip += this.str_pad(bin, 8, "0", "STR_PAD_LEFT");
        }
        return binip;
    },
    str_pad: function (input, pad_length, pad_string, pad_type) {
        input = String(input);
        pad_string = pad_string !== null ? pad_string : " ";
        if (pad_string.length > 0) {
            var padi = 0;
            var i;
            pad_type = pad_type !== null ? pad_type : "STR_PAD_RIGHT";
            pad_length = parseInt(pad_length, 10);
            switch (pad_type) {
            case "STR_PAD_BOTH":
                input = this.str_pad(input, input.length + Math.ceil((pad_length - input.length) / 2.0), pad_string, "STR_PAD_RIGHT");
                break;  // kein break!
            case "STR_PAD_LEFT":
                var buffer = "";
                for (i = 0, z = pad_length - input.length; i < z; ++i) {
                    buffer += pad_string.charAt(padi); // [padi] IE 6.x bug
                    if (++padi == pad_string.length)
                        padi = 0;
                }
                input = buffer + input;
                break;
            default:
                for (i = 0, z = pad_length - input.length; i < z; ++i) {
                    input += pad_string.charAt(padi);
                    if (++padi == pad_string.length)
                        padi = 0;
                }
                break;
            }
        }
        return input;
    },
    verify_ip: function (ip_val) {
        var ip_pattern = /^(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})$/;
        var ip_array = ip_val.match(ip_pattern);
        ip_ng = "Invalid IP address";
        var err = "";
        if (ip_val + "" == "undefined" || ip_val === "")
            return true;
        if (ip_val == "0.0.0.0")
            err = ip_ng;
        else if (ip_val == "255.255.255.255")
            err = ip_ng;
        if (ip_array === null)
            err = "error";
        else {
            for (i = 1; i < 5; i++) {
                byte_val = Math.round(ip_array[i]);
                if (byte_val > 255 || ((i == 1 && byte_val === 0))) {
                    err = ip_ng;
                    break;
                }
            }
        }
        var ip_val_arr = ip_val.split(".");
        for (i = 0; i < ip_val_arr.length; i++) {
            if (ip_val_arr[i].length > 3) {
                return false;
            }
            if (ip_val_arr[i] !=parseInt(ip_val_arr[i],10)) {
                return false;
            }
        }
        if (err === "") {
            return true;
        } else {
            return false;
        }
    },
    verify_mask: function (mask_val) {
        if (this.verify_ip(mask_val) && mask_val !== '') {
            var bin_mask = this.iptobin(mask_val);
            var tmp1,
                tmp2,
                cmask;
            for (cmask = 0; cmask < 32; cmask++) {
                if (bin_mask.charAt(cmask) == "0") {
                    tmp1 = cmask;
                    break;
                }
            }
            for (cmask = 31; cmask >= 0; cmask--) {
                if (bin_mask.charAt(cmask) == "1") {
                    tmp2 = cmask;
                    break;
                }
            }
            if ((parseInt(tmp1, 10) - 1) == parseInt(tmp2, 10))
                return true;
            else
                return false;
        } else {
            return false;
        }
    },
    verify_ipv6: function (ip) {
        return (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(ip));
    },
    verify_ipv6_prefix: function (prefix) {
        if (prefix < 0 || prefix > 128) return false;
        return true;
    },
    isNumber: function (n) {
        return (isNaN(parseFloat(n)) === false) && isFinite(n);
    },
    verify_domain: function (domain) {
        var pattern = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/i;
        if (domain.match(pattern) === null || domain.length > 63)
            return false;
        else
            return true;
    },
    verify_char: function (pwd) {
        var pattern = /^[a-zA-Z0-9-_]+$/;
        if (pwd.match(pattern) === null)
            return 'Characters which are allowed include:"a-z A-Z 0-9 - _"';
        else
            return 'correct';
    },
    verify_pwd: function (pwd, retype_pwd) {
        var pattern = /^[a-zA-Z0-9-_]+$/;
        if (pwd != retype_pwd)
            return 'Retype password does not match your password. Please type again.';
        else
            return 'correct';
    }
});
