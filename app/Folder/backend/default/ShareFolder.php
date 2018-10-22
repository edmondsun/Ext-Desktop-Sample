#!/www/cgi-bin/php
<?php

require_once('/www/api_v2/acl/acl.php');

/* For debugging */
if (isset($_SERVER['GET_STR']))
    parse_str($_SERVER['GET_STR'], $_GET);
if (isset($_SERVER['POST_STR']))
    parse_str($_SERVER['POST_STR'], $_POST);

function POST_METHOD()
{
    $ret    = FALSE;
    $result = array();

    if (isset($_POST['op'])) {
        switch ($_POST['op'])
        {
            case 'set_folder_acl':
                $settings = json_decode($_POST['settings'], TRUE);
                $ret = set_acl_by_folder($settings, $msg);
                break;

            case 'set_win_acl':
                $settings = json_decode($_POST['settings'], TRUE);
                $ret = set_acl_by_folder($settings, $msg, array('windows_only' => TRUE));
                break;

            case 'create_folder':
                $settings = json_decode($_POST['settings'], TRUE);

                $pool        = isset($settings['pool'])        ? $settings['pool']        : '';
                $volume      = isset($settings['volume'])      ? $settings['volume']      : '';
                $folder_name = isset($settings['folder_name']) ? $settings['folder_name'] : '';

                // $settings = array();
                // if (isset($_POST['folder_size']))     $settings['folder_size'] = $_POST['folder_size'];
                // if (isset($_POST['description']))     $settings['description'] = $_POST['description'];
                // if (isset($_POST['compression']))     $settings['compression'] = $_POST['compression'];
                // if (isset($_POST['recycle_bin']))     $settings['recycle_bin'] = $_POST['recycle_bin'];
                // if (isset($_POST['hide_net_drive']))  $settings['hide_net_drive'] = $_POST['hide_net_drive'];

                $ret = create_folder($pool, $volume, $folder_name, $settings, $msg);
                break;

            case 'edit_folder':
                $settings = json_decode($_POST['settings'], TRUE);

                $ret = edit_folder($settings['pool'], $settings['volume'], $settings['old_folder_name'], $settings, $msg);
                break;

            case 'delete_folder':
                $pool   = isset($_POST['pool'])   ? $_POST['pool'] : '';
                $volume = isset($_POST['volume']) ? $_POST['volume'] : '';
                $folder = isset($_POST['folder']) ? $_POST['folder'] : '';

                $ret = delete_folder($pool, $volume, $folder, $msg);
                break;

            default:
                break;
        }
    }

    $result['success'] = $ret;
    $result['msg']     = $msg;

    echo json_encode($result, JSON_NUMERIC_CHECK);
    // need refactor
}

function GET_METHOD()
{
    $msg    = '';
    $result = array();
    $data   = array();
    $ret    = FALSE;
    $abs_path = NULL;
    $service_type = NULL;

    if (isset($_GET['op'])) {
        switch ($_GET['op'])
        {
            case 'get_folder_acl':
                $settings = json_decode($_GET['settings'], TRUE);
                $ret = get_acl_by_folder($settings, $data, $msg);
                break;

            case 'get_win_acl':
                $settings = json_decode($_GET['settings'], TRUE);
                $args = array('windows_only' => TRUE);
                if (isset($_GET['specificName']))   $args['name']   = $_GET['specificName'];
                if (isset($_GET['specificDomain'])) $args['domain'] = $_GET['specificDomain'];

                $ret = get_acl_by_folder($settings, $data, $msg, $args);
                break;

            case 'get_all_folders':
                $ret = list_folder($abs_path, $service_type, $data, $msg);
                break;

            case 'get_folder_list':
                $abs_path = isset($_GET['abs_path']) ? $_GET['abs_path'] : '';
                $args = array();
                if (isset($_GET['belongs_to']))
                    $args['belongs_to'] = $_GET['belongs_to'];

                $ret = list_folder($abs_path, $service_type, $data, $msg, $args);
                break;

            case 'get_folder_settings':
                $folder_name = isset($_GET['folder_name']) ? $_GET['folder_name'] : '';
                $ret = query_folder_settings($folder_name, $data, $msg);
                break;

            case 'get_all_accounts':
                $ret = list_account(NULL, $data, $msg);
                break;

            case 'get_users':
                $ret = list_account('user', $data, $msg, array('flat' => TRUE, 'index_name' => 'name'));
                break;

            case 'get_groups':
                $ret = list_account('group', $data, $msg, array('flat' => TRUE, 'index_name' => 'name'));
                break;

            case 'get_all_volumes':
                $ret = get_all_volumes($data, $msg);
                break;

            default:
                break;
        }
    }
	
	$chksum = md5(json_encode($data));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$data = NULL;
	}
	$result["md5sum"] = $chksum;
	$result['success'] = $ret;
	if ($ret) {
		$result['data'] = $data;
	} else {
		$result['msg'] = $msg;
	}

    echo json_encode($result, JSON_NUMERIC_CHECK);
}

if (isset($_SERVER['REQUEST_METHOD']) == FALSE)
    exit;

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        POST_METHOD();  break;
    case 'GET':
        GET_METHOD();   break;
    default:            break;
}

header('Content-Type: application/json; charset=utf-8');
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');

?>
