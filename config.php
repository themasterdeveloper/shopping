<?php
//escngcom.ipagemysql.com
$php_server="localhost";
$php_user="shopping_webuser";
$php_password="M1a4$1t4E8r0";
$php_schema="escng_shopping";

$sms_url = "https://www.bulksmsnigeria.net/components/com_spc/smsapi.php";
$sms_user ="nwabuezestephen27@gmail.com";
$sms_password = "Foot27ball";
$sms_sender = "iyabasira";

//GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON `escng_shopping`.* TO 'shopping_webuser'@'localhost';

function stmt_bind_assoc(&$stmt, &$bound_assoc)
    {
    $metadata = $stmt->result_metadata();
    $fields = array();
    $bound_assoc = array();
    $fields[] = $stmt;
    while ($field = $metadata->fetch_field())
        {
        $fields[] = & $bound_assoc[$field->name];
        }

    call_user_func_array("mysqli_stmt_bind_result", $fields);
    }

function array_copy(array $array)
    {
    $result = array();
    foreach($array as $key => $val)
        {
        if (is_array($val))
            {
            $result[$key] = arrayCopy($val);
            }
        elseif (is_object($val))
            {
            $result[$key] = clone $val;
            }
          else
            {
            $result[$key] = $val;
            }
        }

    return $result;
    }
// Debug area
function customError($errno, $errstr) {
  log_this("Error: [$errno] $errstr", "err");
  die();
}

function log_this($content = '', $type = "log"){
    $log  = date("d-m-y H:i:s") . PHP_EOL;
    $log  .= "user: " . $_SERVER['REMOTE_ADDR'] . PHP_EOL;
//  $log  .= "Browser: " . $_SERVER['HTTP_USER_AGENT'] . PHP_EOL;
    foreach($_GET as $key => $value)
    {
        $log .= $key . ': ' . $value . PHP_EOL;
    }
     if(strlen($content) > 0)
    $log .= $content . PHP_EOL;
    $log .= "-------------------------" . PHP_EOL;
    file_put_contents('../logs/usr_' . date("ymd") . '.txt', $_SERVER['REMOTE_ADDR'] .' ' . date("d-m-y H:i:s") . ' '.  $_GET['action'] . PHP_EOL, FILE_APPEND);
    file_put_contents('../logs/' . $type . '_' . date("ymd") . '.txt', $log, FILE_APPEND);
}


?>

