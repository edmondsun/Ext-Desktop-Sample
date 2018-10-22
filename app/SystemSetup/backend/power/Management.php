#!/www/cgi-bin/php
<?
require_once('/www/lib/net_lib.php');
require_once('/www/lib/pwr_sched_lib.php');
require_once('/www/lib/globals.php');
require_once('/www/lib/rms.php');
require_once('/www/lib/config.php');
require_once('/www/lib/ems_lib.php');
header('Content-Type: application/json; charset=utf-8');


if ( isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ) {        

    if (isset($_POST["op"])) {
        switch($_POST["op"]) {
            case 'setting':
                if (isset($_POST["auto_shutdown_status"])) {

                    $auto_shutdown_status = $_POST['auto_shutdown_status'];
                    cfg_set_auto_shutdown($auto_shutdown_status);

                    if (is_sw_with("WITH_HAC") && check_dual()) {

                        ipc_sync_cfg(SYNC_CFG_HW_SHUT_OFF);
                    }
                }
                
                if (isset($_POST["wol_enable"])) {

                    net_set_wake_on_lan("eth1", $_POST["wol_enable"]);
                    
                }
                if (isset($_POST["recovery"])) {
                    $is_recovey = ($_POST["recovery"] == 1)? true : false;
                    ems_set_power_recovery($is_recovey);
                }

                if (isset($_POST["power_schedule_enable"])) {

                    ems_set_power_schedule_status($_POST["power_schedule_enable"]);
                }
                break;
            case 'create_schedule':
                $schedule_type = (isset($_POST["schedule_type"]))? $_POST["schedule_type"] : 0;
                $schedule_action = (isset($_POST["schedule_action"]))? $_POST["schedule_action"] : 0;
                $day_period = (isset($_POST["day_period"]))? $_POST["day_period"] : 0;
                $week_period = (isset($_POST["week_period"]))? $_POST["week_period"] : 0;
                $months = (isset($_POST["months"]))? $_POST["months"] : 0;
                $dates = (isset($_POST["dates"]))? $_POST["dates"] : 0;
                $weekdays = (isset($_POST["weekdays"]))? $_POST["weekdays"] : 0;                
                $hours = (isset($_POST["hours"]))? $_POST["hours"] : 0;
                $minutes = (isset($_POST["minutes"]))? $_POST["minutes"] : 0;
                $is_active = (isset($_POST["is_active"]))? $_POST["is_active"] : 0;
                                

                    ems_pwr_create_task($schedule_type, $schedule_action, $day_period, $week_period, $months, $dates, $weekdays, $hours, $minutes, $is_active);
                
                break;
            case 'edit_schedule':
                if (isset($_POST["schedule_index"]) && isset($_POST["schedule_type"]) && isset($_POST["schedule_action"]) && isset($_POST["day_period"])
                    && isset($_POST["week_period"]) && isset($_POST["months"]) && isset($_POST["dates"])&& isset($_POST["weekdays"])
                    && isset($_POST["hours"]) && isset($_POST["minutes"]) && isset($_POST["is_active"])) {

                    ems_pwr_edit_task($_POST["schedule_index"], $_POST["schedule_type"], $_POST["schedule_action"]
                                        , $_POST["day_period"], $_POST["week_period"]
                                        , $_POST["months"], $_POST["dates"], $_POST["weekdays"]
                                        , $_POST["hours"], $_POST["minutes"], $_POST["is_active"]);
                }
                break;
            case 'delete_schedule':
                if(isset($_POST["index"])){
                    $res = ems_pwr_delete_task($_POST["index"]);
                        if($res != 0){
                            $is_success = false;
                            $msg = 'failed';
                        }
                }
                else{
                    $is_success = false;
                    $msg = 'failed';
                }
                break;
        }
    }
    
        
    $result_arr = array();
    $result_arr["success"] = true;
    $result_arr["msg"] = xlt('info_change_ok');
    echo json_encode($result_arr);

} else {

    $auto_shutdown_status = cfg_get_auto_shutdown()? 1 : 0;
    
    get_wol_status("eth1", $wol_enable);

    $ret = ems_get_power_recover($is_enable);
    if ($ret == 0) {
    $recovery_enable = $is_enable? 1 : 0;
    } else {
        $recovery_enable = 0;
    }

    pwr_get_system_conf($power_schedule_enable, $power_schedule_wait_backup_enable);
    
    $data_arr = array();
    $data_arr["auto_shutdown_status"] = $auto_shutdown_status;
    $data_arr["wol_enable"] = $wol_enable;
    $data_arr["recovery"] =  $recovery_enable;
    $data_arr["power_schedule_enable"] = $power_schedule_enable;
    
    
    ems_get_power_schedule_status($power_schedule_arr, $power_schedule_enable, $wait_backup_enable);
    
    $data_arr["power_schedule_enable"] = $power_schedule_enable;
    $data_arr["power_schedule_arr"] = $power_schedule_arr;

    echo json_encode(array("success" => true, "data" => $data_arr), JSON_NUMERIC_CHECK);
}

header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" ); 
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');
?>