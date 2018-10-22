#!/www/cgi-bin/php
<?php
require_once ('/www/api_v2/storage/pd.php');
require_once ('/www/api_v2/storage/sddcache.php');

/* For debugging */
if (isset($_SERVER['GET_STR'])) {
    parse_str($_SERVER['GET_STR'], $_GET);
}

if (isset($_SERVER['POST_STR'])) {
    parse_str($_SERVER['POST_STR'], $_POST);
}

function POST_METHOD() {
    $result_arr = array();

    $ret = 0;
    $output = "";

    if (isset($_POST["op"])) {
        switch ($_POST["op"]) {
        case 'modify_read_cache':
            $pool_name = isset($_POST["pool_name"]) ? $_POST["pool_name"] : "";
            $remove_cache_arr = isset($_POST["remove_cache_arr"]) ? json_decode($_POST["remove_cache_arr"], TRUE) : array();
            $add_cache_arr = isset($_POST["add_cache_arr"]) ? json_decode($_POST["add_cache_arr"], TRUE) : array();

            $ret = modify_read_cache($pool_name, $remove_cache_arr, $add_cache_arr, $output);

            break;

        case 'modify_write_cache':
            $pool_name = isset($_POST["pool_name"]) ? $_POST["pool_name"] : "";
            $remove_cache_arr = isset($_POST["remove_cache_arr"]) ? json_decode($_POST["remove_cache_arr"], TRUE) : array();
            $add_cache_arr = isset($_POST["add_cache_arr"]) ? json_decode($_POST["add_cache_arr"], TRUE) : array();
            $mirror = isset($_POST["mirror"]) ? $_POST["mirror"] : 0;

            $ret = modify_write_cache($pool_name, $remove_cache_arr, $add_cache_arr, $mirror, $output);

            break;

        case 'add_write_cache':
            $pool_name = isset($_POST["pool_name"]) ? $_POST["pool_name"] : "";
            $mirror = isset($_POST['raid_level']) ? (($_POST['raid_level'] == 1) ? true : false) : false;
            $add_cache_arr = isset($_POST["add_cache_arr"]) ? json_decode($_POST["add_cache_arr"], TRUE) : array();

            $ret = add_write_cache($pool_name, $mirror, $add_cache_arr, $output);

            break;

        case 'remove_write_cache':
            $pool_name = isset($_POST["pool_name"]) ? $_POST["pool_name"] : "";
            $remove_cache_arr = isset($_POST["remove_cache_arr"]) ? json_decode($_POST["remove_cache_arr"], TRUE) : array();

            $ret = remove_write_cache($pool_name, $remove_cache_arr, $output);

            break;

        default:
            $ret = -1;
            $output = xlt('invalid_value');
            break;
        }
    } else {
        $ret = -1;
        $output = xlt('invalid_value');
    }

    $result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
    $result_arr["msg"] = $output;
    echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

function GET_METHOD() {
    $result_arr = array();
    $pd_arr = array();
    $ret = 0;

    if (isset($_GET["op"])) {
        switch ($_GET["op"]) {
        case 'get_pd_for_avail_ssd':
            $enc_id = isset($_GET["enc_id"]) ? $_GET["enc_id"] : 0;
            $pool_name = isset($_GET["pool_name"]) ? $_GET["pool_name"] : NULL;

            // $type_filter = "is_avail_free_pd";

            $type_filter = "is_free_ssd_pd";

            $pd_arr = get_pd($enc_id, $pool_name, $type_filter);
            break;

        case 'get_pd_for_pool_read_cache':
            $enc_id = isset($_GET["enc_id"]) ? $_GET["enc_id"] : 0;
            $pool_name = isset($_GET["pool_name"]) ? $_GET["pool_name"] : NULL;
            $type_filter = "is_readcache_or_free_ssd";

            $pd_arr = get_pd($enc_id, $pool_name, $type_filter);
            break;

        case 'get_pd_for_pool_write_cache':
            $enc_id = isset($_GET["enc_id"]) ? $_GET["enc_id"] : 0;
            $pool_name = isset($_GET["pool_name"]) ? $_GET["pool_name"] : NULL;
            $type_filter = "is_writecache_or_free_ssd";

            $pd_arr = get_pd($enc_id, $pool_name, $type_filter);
            break;

        case 'get_pool_cache':
            $cache_type = isset($_GET["cache_type"]) ? $_GET["cache_type"] : NULL;

            $pd_arr = get_pool_cache($cache_type);
            break;

        case 'get_cache':
            $cache_type = isset($_GET["cache_type"]) ? $_GET["cache_type"] : NULL;

            $pd_arr = get_cache($cache_type);
            break;

        case 'get_enclosure_info':
            $enc_id = isset($_GET["enc_id"]) ? $_GET["enc_id"] : 0;

            $pd_arr = get_enclosure_info($enc_id);
            break;

        default:
            break;
        }
    } else {
        $pd_arr = get_pool_cache();
    }

    $chksum = md5(json_encode($pd_arr));
    if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
        $pd_arr = NULL;
        $pd_arr = array();
    }

    $result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
    $result_arr["data"] = $pd_arr;
    $result_arr["md5sum"] = $chksum;
    echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);

// HTTP/1.0
header('Pragma: no-cache');

switch ($_SERVER['REQUEST_METHOD']) {
case 'POST':
    POST_METHOD();
    break;

case 'GET':
    GET_METHOD();
    break;

default:
    break;
}

?>