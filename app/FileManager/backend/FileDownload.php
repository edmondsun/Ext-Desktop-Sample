<?php
require_once "/www/api_v2/file_manager/file_download.php";
require_once "/www/lib/globals.php";
// require_once "/www/lib/smart_resize_image.function.php";

/* For debugging */
if (isset($_SERVER["GET_STR"])) {
    parse_str($_SERVER["GET_STR"], $_GET);
}

if (isset($_SERVER["POST_STR"])) {
    parse_str($_SERVER["POST_STR"], $_POST);
}

function POST_METHOD() {
    $result_arr = array();

    $ret = 0;
    $output = "";
    $errmsg = "";

    if (isset($_POST["op"])) {
        switch ($_POST["op"]) {
        case "download_singlefile":
            $sourcePath = isset($_POST["sourcePath"]) ? $_POST["sourcePath"] : "";
            $ret = singlefile_download($sourcePath, $errmsg);
            if ($ret != 0) {
                $output .= $errmsg;
            }
            break;
        case "download_multifile":
            $sourcePath = isset($_POST["sourcePath"]) ? $_POST["sourcePath"] : "";
            $sourceName = isset($_POST["sourceName"]) ? json_decode($_POST["sourceName"]) : array();
            $ret = multifile_download($sourcePath, $sourceName, $errmsg);
            break;
        default:
            $ret = -1;
            $output = xlt("invalid_value");
            break;
        }
    } else {
        $ret = -1;
        $output = xlt("invalid_value");
    }

    $result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
    $result_arr["msg"] = $output;
    echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

function GET_METHOD() {
    $result_arr = array();
    $file_arr = array();
    $ret = 0;

    if (isset($_GET["op"])) {
        switch ($_GET["op"]) {
        default:
            break;
        }
    } else {
        $file_arr = file_list("/www");
    }

    $chksum = md5(json_encode($file_arr));
    if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
        $file_arr = NULL;
        $file_arr = array();
    }

    $result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
    $result_arr["data"] = $file_arr;
    $result_arr["md5sum"] = $chksum;
    echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

if (isset($_SERVER["REQUEST_METHOD"]) == FALSE) {
    exit;
}
switch ($_SERVER["REQUEST_METHOD"]) {
case "POST":
    POST_METHOD();
    break;

case "GET":
    header("Content-Type: application/json; charset=utf-8");
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

    // HTTP/1.1
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);

    // HTTP/1.0
    header("Pragma: no-cache");
    GET_METHOD();

    break;

default:
    break;
}
