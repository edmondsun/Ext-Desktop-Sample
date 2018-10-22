<?php
require_once "/www/api_v2/file_manager/file_upload.php";
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
        case "upload_file":

            $fileInfo = isset($_POST["fileInfo"]) ? json_decode($_POST["fileInfo"]) : array();
            $ret = upload_file($_FILES, $_POST["chunk"], $_POST["chunks"], $fileInfo, $errmsg);
            if ($ret != 0) {
                $output .= $errmsg;
            }
            break;
        case "regist_task":
            $tasks = isset($_POST["tasks"]) ? json_decode($_POST["tasks"]) : array();
            $ret = regist_task($tasks);

            break;
        case "remove_task":
            $fileMd5 = isset($_POST["fileMd5"]) ? $_POST["fileMd5"] : "";
            $fileId = isset($_POST["fileId"]) ? $_POST["fileId"] : "";
            $mode = isset($_POST["mode"]) ? $_POST["mode"] : "ALL";
            $ret = remove_task($fileMd5, $fileId, $mode);

            break;
        case "update_task":
            $taskInfo = isset($_POST["taskInfo"]) ? json_decode($_POST["taskInfo"]) : array();
            $ret = update_task($taskInfo);

            break;
        case "create_folder":
            $folderPath = isset($_POST["folderPath"]) ? json_decode($_POST["folderPath"]) : array();
            $ret = create_folder($folderPath);

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
        case "check_lock":
            $fileMd5 = isset($_GET["fileMd5"]) ? $_GET["fileMd5"] : "";
            $fileId = isset($_GET["fileId"]) ? $_GET["fileId"] : "";
            $fileFromfolder = isset($_GET["fileFromfolder"]) ? $_GET["fileFromfolder"] : "";
            $file_arr["is_lock"] = check_lock($fileMd5, $fileId, $fileFromfolder);

            break;
        case "get_upload_task":
            $session = isset($_GET["session"]) ? $_GET["session"] : "*";
            $file_arr = get_upload_task($session);

            break;

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
header("Content-Type: application/json; charset=utf-8");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// HTTP/1.0
header("Pragma: no-cache");
switch ($_SERVER["REQUEST_METHOD"]) {
case "POST":
    POST_METHOD();
    break;

case "GET":
    GET_METHOD();

    break;

default:
    break;
}
