#!/www/cgi-bin/php
<?php

require_once '/www/api_v2/folder/folder.php';

/* For debugging */
if (isset($_SERVER['GET_STR'])) {
    parse_str($_SERVER['GET_STR'], $_GET);
}

if (isset($_SERVER['POST_STR'])) {
    parse_str($_SERVER['POST_STR'], $_POST);
}

function POST_METHOD() {
    $ret = FALSE;
    $result = array();

    if (isset($_POST['op'])) {
        switch ($_POST['op']) {
        case '':
            break;

        default:
            break;
        }
    }

    $result['success'] = $ret;
    $result['msg'] = $msg;
    echo json_encode($result, JSON_NUMERIC_CHECK);
}

function GET_METHOD() {
    $result = array();
    $data = array();
    $ret = FALSE;
    $msg = '';
    $abs_path = '';

    if (isset($_GET['op'])) {
        switch ($_GET['op']) {
        case 'get_folder_list':
            $abs_path = isset($_GET['abs_path']) ? $_GET['abs_path'] : '';
            $service_type = isset($_GET['service_type']) ? $_GET['service_type'] : '';

            $ret = list_folder($abs_path, $service_type, $data, $msg);
            break;
        default:
            break;
        }
    }

    $result['success'] = $ret;
    if ($ret) {
        $result['data'] = $data;
    } else {
        $result['msg'] = $msg;
    }

    echo json_encode($result, JSON_NUMERIC_CHECK);
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
default:break;
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
