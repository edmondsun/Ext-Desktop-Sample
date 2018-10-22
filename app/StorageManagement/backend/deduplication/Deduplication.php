#!/www/cgi-bin/php
<?php
require_once ('/www/api_v2/storage/dedup.php');

/* For debugging */
if (isset($_SERVER['GET_STR'])) parse_str($_SERVER['GET_STR'], $_GET);
if (isset($_SERVER['POST_STR'])) parse_str($_SERVER['POST_STR'], $_POST);

function POST_METHOD() {

    $ret = 0;
    $output = "";

    if (isset($_POST["op"])) {
        switch ($_POST["op"]) {
            case 'set_dedup':

                $zfs_arr = (isset($_POST['zfs_arr'])) ? json_decode($_POST['zfs_arr']) : array();

                $ret = set_dedup($zfs_arr, $output);

                break;

            default:
                break;
        }
    }
    else {
        $ret = - 1;
        $output = xlt('invalid_value');
    }

    $result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
    $result_arr["msg"] = $output;
    echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
}

function GET_METHOD() {
    $result_arr = array();
    $dedup_arr = array();
    $ret = 0;

    if (isset($_GET["op"])) {
        switch ($_GET["op"]) {
            default:
                break;
        }
    }
    else {
        $dedup_arr = get_dedup();
    }

    $chksum = md5(json_encode($pool_arr));
    if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
        $pool_arr = NULL;
        $pool_arr = array();
    }

    $result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
    $result_arr["data"] = $dedup_arr;
    $result_arr["md5sum"] = $chksum;
    echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
}

if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
    exit;
}

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

header('Content-Type: application/json; charset=utf-8');
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);

// HTTP/1.0
header('Pragma: no-cache');
?>