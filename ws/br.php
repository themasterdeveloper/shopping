<?php 
date_default_timezone_set('Africa/Lagos');
ini_set('html_errors', false);
// Debug area
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(-1);

// Prepare the headers for JSON data

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_query = 1;
$_update = 2;
$_email = 3;

// Connect to server and select database

include '../config.php';

set_error_handler("customError");

$conn = new mysqli($php_server, $php_user, $php_password, $php_schema);
$conn->query("SET time_zone='+01:00';");

// Gets the stored procedure name from the user interface

$action = $_GET['action'];

log_this($action);

switch ($action) {
    case "login":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the variable with value from ui

        $email = $_GET['email'];
        $password = $_GET['password'];

        // Fill the query parameters
        $query = "login('" . $email . "','" . $password . "')";

        break;

    case "get_token":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "get_token()";

        break;

    case "get_areas":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "get_areas()";

        break;

    case "areas_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "areas_list()";

        break;

    case "cities_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "cities_list()";

        break;

    case "products_list":

        // It's gonna be a query

        $action_type = $_query;
        $search = $_GET['search'];
        $token = $_GET['token'];

        // Fill the query parameters
        $query = "products_list('" . $search . "','" . $token . "')";

        break;

    case "get_total_basket":

        // It's gonna be a query

        $action_type = $_query;
        $token = $_GET['token'];

        // Fill the query parameters
        $query = "get_total_basket('" . $token . "')";

        break;

    case "basket_list":

        // It's gonna be a query

        $action_type = $_query;
        $token = $_GET['token'];

        // Fill the query parameters
        $query = "basket_list('" . $token . "')";

        break;

    case "get_config_value":

        // It's gonna be a query

        $action_type = $_query;
        $name = $_GET['name'];

        // Fill the query parameters
        $query = "get_config_value('" . $name . "')";

        break;

    case "save_item":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL add_item(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("sii", $token, $product_id, $quantity);

        // Assign values
        $token = $_GET['token'];
        $product_id = $_GET['product_id'];
        $quantity = $_GET['quantity'];

        break;

    case "remove_item":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL delete_item(?)");

        // Bind parameters

        $stmt->bind_param("i", $item_id);

        // Assign values
        $item_id = $_GET['item_id'];

        break;

    case "remove_all":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL delete_all(?)");

        // Bind parameters

        $stmt->bind_param("s", $token);

        // Assign values
        $token = $_GET['token'];

        break;

    case "save_location":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL save_location(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("dds", $lat, $lng, $token);

        // Assign values
        $lat = $_GET['lat'];
        $lng = $_GET['lng'];
        $token = $_GET['token'];

        break;

    case "profile_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL order_save(?, ?, ?, ?, ?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("siisssss", $address, $area_id, $city_id, $email, $mobile, $name, $password, $token);

        // Assign values
        $address = $_GET['address'];
        $area_id = $_GET['area_id'];
        $city_id = $_GET['city_id'];
        $email = $_GET['email'];
        $mobile = $_GET['mobile'];
        $name = $_GET['name'];
        $password = $_GET['password'];
        $token = $_GET['token'];

        break;

    case "order_notify":

        // It's gonna be a database update

        $action_type = $_email;

        // Set the procedure we are going to use

        $to = $_GET['to'];
        $mobile = $_GET['mobile'];

        $message = "Report generated automatically by <strong>iyabasira.online</strong>.<br/>This is a test. ";
        $subject = $_GET['subject'];

        $URL = $sms_url . "?username=" . $sms_user . "&password=" . $sms_password . "&sender=" . $sms_sender . "&recipient=" . $mobile . "&message=" . urlencode($subject);

        break;

}

switch ($action_type) {
    case $_query:
    
        $result = $conn->query('CALL ' . $query) or trigger_error($conn->error . "[$query]");
        $rowcount=mysqli_num_rows($result);
        $rows = array();
        if($rowcount==0){
            $rows[] = array("error"=>1, 
                            "message"=>"Sorry, there are no products available<br/><span class='bold'>Check your basket!</span>");
        }else{
            while ($row = $result->fetch_array(MYSQLI_ASSOC))
                {
                $rows[] = $row;
                }
        }
        $result->free();

        break;

    case $_update:

        $stmt->execute();
        $rows = array();
        stmt_bind_assoc($stmt, $row);
        while ($stmt->fetch())
            {
            $rows[] = array_copy($row);
            }

        break;

    case $_email:

        $headers = "MIME-Version: 1.0";
        $headers.= "\r\nContent-type:text/html;charset=iso-8859-1";
        // More headers and the BCC to me

        $headers .= "\r\nFrom: <noreply@iyabasira.online>";
        $headers .= "\r\nBcc: <omar.melendrez@gmail.com>";

        // Create the message with html style
        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><title>iyabasira</title></head>" . $email_style . "<body>" . $message . "</body></html>";
        
        if($php_server != "localhost")
            mail($to, $subject, $body, $headers);
        else
            log_this($to . ": " . $subject);
        
        //$sms_resutls = file_get_contents($URL);
        $ch = curl_init($URL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);

        $result = curl_exec($ch);
        curl_close($ch);

        $rows = array();
        $rows[] = array("error"=>0, "message"=>"Success");
        break;
}

$conn->close();

// Send data in JSON format back to the user interface

if ($action_type != $_email) echo (json_encode($rows));

//if ($action_type != "") echo (json_encode(array("data"=>array_values($rows), "records"=>$rowcount)) );

session_write_close();

?>