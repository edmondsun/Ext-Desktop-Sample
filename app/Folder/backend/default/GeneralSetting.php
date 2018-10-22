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
    
    if(isset($_POST['op'])) {
        switch ($_POST['op'])
        {
            case 'set_acl_gs':
                $gs_arr = array();
                $gs_arr['enable_adv_acl'] = $_POST['enable_adv_acl'];
                $gs_arr['enable_win_acl'] = $_POST['enable_win_acl'];
                $ret = set_acl_gs($gs_arr, $msg);
                break;

            default:
                break;
        }
    }
    
    $result['success'] = $ret;
    $result['msg']     = $msg;
    echo json_encode($result, JSON_NUMERIC_CHECK);
}

function GET_METHOD()
{
    $gs_arr = array();
    $result = array();
    $msg    = '';

    $ret = get_acl_gs($gs_arr, $msg);

    $result['success']  = $ret;
    if($ret)   $result['data'] = $gs_arr;
    else       $result['msg']  = $msg;

    echo json_encode($result, JSON_NUMERIC_CHECK);
}

if (isset($_SERVER['REQUEST_METHOD']) == FALSE)
    exit;

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
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');

?>
