<?php
date_default_timezone_set('Africa/Lagos');
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
    case "adm_load_table_products":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_products_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_orders_fees":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_orders_fees_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_deliverers":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_deliverers_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_shop_types":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_shop_types_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_areas":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_areas_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_cities":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_cities_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_delivery_rates":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_delivery_rates_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_customers":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_customers_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_receivers":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_receivers_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;

    case "adm_load_table_orders":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_orders_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;
    case "adm_load_table_shops":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_shops_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;
    case "adm_load_table_shops_areas":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_shops_areas_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;
    case "adm_load_table_shop_product":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_shop_product_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;
    case "adm_load_table_categories":

        // It's gonna be a query

        $action_type = $_query;

        $search = $_GET['search'];
        $limit = $_GET['limit'];
        $rows = $_GET['rows'];
        // Fill the query parameters
        $query = "adm_categories_list('" . $search . "', '" . $limit . "', '" . $rows . "')";

        break;
    case "get_table_record":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $table = $_GET['table'];
        $item_id = $_GET['item_id'];
        $query = "get_table_record('" . $table . "','" . $item_id . "')";

        break;
    case "get_token":

        // It's gonna be a query

        $action_type = $_query;

        $area_id = $_GET['area_id'];

        // Fill the query parameters
        $query = "get_token('" . $area_id . "')";

        break;

    case "get_area_coordinates":

        // It's gonna be a query

        $action_type = $_query;

        $area_id = $_GET['area_id'];

        // Fill the query parameters
        $query = "get_area_coordinates('" . $area_id . "')";

        break;

    case "get_shop_coordinates":

        // It's gonna be a query

        $action_type = $_query;

        $order_id = $_GET['order_id'];

        // Fill the query parameters
        $query = "get_shop_coordinates('" . $order_id . "')";

        break;

    case "get_deliverer_coordinates":

        // It's gonna be a query

        $action_type = $_query;

        $order_id = $_GET['order_id'];

        // Fill the query parameters
        $query = "get_deliverer_coordinates('" . $order_id . "')";

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

    case "products_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "products_list()";

        break;

    case "category_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "category_list()";

        break;

    case "shops_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "shops_list()";

        break;
    case "shop_types_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "shop_types_list()";

        break;
    case "deliverers_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "deliverers_list()";

        break;

    case "cities_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "cities_list()";

        break;

    case "shops_locations_list":

        // It's gonna be a query

        $action_type = $_query;

        $area_id = $_GET['area_id'];

        // Fill the query parameters
        $query = "shops_locations_list('" . $area_id . "')";

        break;

    case "products_search":

        // It's gonna be a query

        $action_type = $_query;
        $search = $_GET['search'];
        $token = $_GET['token'];
        $shop_area_id = $_GET['shop_area_id'];

        // Fill the query parameters
        $query = "products_search('" . $search . "','" . $shop_area_id . "','" . $token . "')";

        break;

    case "get_shops_areas":

        // It's gonna be a query

        $action_type = $_query;
        $area_id = $_GET['area_id'];

        // Fill the query parameters
        $query = "get_shops_areas('" . $area_id . "')";

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

    case "delete_table_record":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL delete_table_record(?,?)");

        // Bind parameters

        $stmt->bind_param("si", $table, $item_id);

        // Assign values
        $table = $_GET['table'];
        $item_id = $_GET['item_id'];

        break;

    case "save_item":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL add_item(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("sii", $token, $shop_product_id, $quantity);

        // Assign values
        $token = $_GET['token'];
        $shop_product_id = $_GET['shop_product_id'];
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

    case "save_area_location":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL save_area_location(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("idd", $area_id, $lat, $lng);

        // Assign values
        $area_id = $_GET['area_id'];
        $lat = $_GET['lat'];
        $lng = $_GET['lng'];

        break;

    case "save_shop_location":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL save_shop_location(?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("iidd", $area_id, $shop_id, $lat, $lng);

        // Assign values
        $area_id = $_GET['area_id'];
        $shop_id = $_GET['shop_id'];
        $lat = $_GET['lat'];
        $lng = $_GET['lng'];

        break;

    case "profile_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL order_save(?, ?, ?, ?, ?, ?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("ssssssssi", $token, $name, $mobile, $email, $receiver_name, $receiver_mobile, $receiver_email, $receiver_address, $area_id);

        // Assign values
        $token = $_GET['token'];
        $name = $_GET['name'];
        $mobile = $_GET['mobile'];
        $email = $_GET['email'];
        $receiver_name = $_GET['receiver_name'];
        $receiver_mobile = $_GET['receiver_mobile'];
        $receiver_email = $_GET['receiver_email'];
        $receiver_address = $_GET['receiver_address'];
        $area_id = $_GET['area_id'];

        break;

    case "save_table_image":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL save_table_image(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("sis", $table, $item_id, $image_path);

        // Assign values
        $table = $_GET['table'];
        $item_id = $_GET['item_id'];
        $image_path = $_GET['image_path'];

        break;

    case "products_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL products_save(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("isi", $item_id, $name, $category_id);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];
        $category_id = $_GET['category_id'];

        break;

    case "shops_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL shops_save(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("isi", $item_id, $name, $type_id);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];
        $type_id = $_GET['type_id'];

        break;

    case "orders_fees_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL orders_fees_save(?, ?)");

        // Bind parameters

        $stmt->bind_param("id", $item_id, $fees);

        // Assign values
        $item_id = $_GET['item_id'];
        $fees = $_GET['fees'];

        break;

    case "shop_types_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL shop_types_save(?, ?)");

        // Bind parameters

        $stmt->bind_param("is", $item_id, $name);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];

        break;

    case "deliverers_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL deliverers_save(?, ?, ?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("issssi", $item_id, $name, $mobile, $email, $password, $active);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];
        $mobile = $_GET['mobile'];
        $email = $_GET['email'];
        $password = $_GET['password'];
        $active = $_GET['active'];

        break;

    case "areas_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL areas_save(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("isi", $item_id, $name, $city_id);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];
        $city_id = $_GET['city_id'];

        break;

    case "cities_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL cities_save(?, ?)");

        // Bind parameters

        $stmt->bind_param("is", $item_id, $name);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];

        break;

    case "shops_areas_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL shops_areas_save(?, ?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("isssi", $item_id, $contact, $mobile, $email, $email_notify);

        // Assign values
        $item_id = $_GET['item_id'];
        $contact = $_GET['contact'];
        $mobile = $_GET['mobile'];
        $email = $_GET['email'];
        $email_notify = $_GET['email_notify'];
        break;

    case "delivery_rates_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL delivery_rates_save(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("idd", $item_id, $value, $value2);

        // Assign values
        $item_id = $_GET['item_id'];
        $value = $_GET['value'];
        $value2 = $_GET['value2'];

        break;

    case "shop_product_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL shop_product_save(?, ?, ?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("iiiidi", $item_id, $shop_id, $area_id, $product_id, $price, $availability);

        // Assign values
        $item_id = $_GET['item_id'];
        $shop_id = $_GET['shop_id'];
        $area_id = $_GET['area_id'];
        $product_id = $_GET['product_id'];
        $price = $_GET['price'];
        $availability = $_GET['availability'];

        break;

    case "categories_save":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL categories_save(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("isi", $item_id, $name, $type_id);

        // Assign values
        $item_id = $_GET['item_id'];
        $name = $_GET['name'];
        $type_id = $_GET['shop_type_id'];

        break;

    case "order_notify":

        // It's gonna be an email

        $action_type = $_email;

        $order_id = $_GET['order_id'];
        // Set the procedure we are going to use
        $query = 'get_order_details(' . $order_id . ')';
        $result = $conn->query('CALL ' . $query) or trigger_error($conn->error . "[$query]");
        $template = file_get_contents('../assets/templates/order_confirmation.html');
        //$sms_template = file_get_contents('../assets/templates/order_confirmation.txt');
        $data = '';
        $pass = 0;
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            if($pass == 0){
                foreach($row as $key => $value) {
                    $template = str_replace('{'.$key.'}',  $row[$key], $template);
                }
                $email = $row['email'];
                //$mobile = $row['mobile'];
                $subject = 'iyabasira - Order Confirmation # ' . $row['order-number'];
                //$sms_template = str_replace('{customer-name}', $row['customer-name'], $sms_template);
                //$sms_template = str_replace('{order-total}', $row['order-total'], $sms_template);
                //$sms_template = str_replace('{order-number}', $row['order-number'], $sms_template);
                $pass=1;
            }
            $data .= "<tr>";
            $data .= "<td>".$row["shop"]."</td>";
            $data .= "<td>".$row["item"]."</td>";
            $data .= "<td class='_qty'>".$row["qty"]."</td>";
            $data .= "<td class='_amount'>".$row["unit price"]."</td>";
            $data .= "<td class='_amount'>".$row["total price"]."</td>";
            $data .= "</tr>";
           }
        $template = str_replace('{data}', $data, $template);
        $result->free();

        //$URL = $sms_url . "?username=" . $sms_user . "&password=" . $sms_password . "&sender=" . $sms_sender . "&recipient=" . $mobile . "&message=" . urlencode($sms_template);

        break;

}

switch ($action_type) {
    case $_query:

        $result = $conn->query('CALL ' . $query) or trigger_error($conn->error . "[$query]");
        $rowcount=mysqli_num_rows($result);
        $rows = array();
        if($rowcount==0){
            $rows[] = array("error"=>1,
                            "message"=>"Sorry, there are no products available");
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
        $headers .= "\r\nCc: <admin@iyabasira.online>";
        $headers .= "\r\nBcc: <omar.melendrez@gmail.com>";


        // Create the message with html style

        $body = $template;

        if($php_server != "localhost")
            if($email!="")
                mail($email, $subject, $body, $headers);
        else
            log_this($email . ": " . $subject);
            log_this($headers);
            log_this($body, "email");
        /*
        if($mobile != '') {
            $ch = curl_init($URL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);

            $return_value = curl_exec($ch);
            log_this($return_value);
            curl_close($ch);
        }
        */

        $rows = array("error"=>0, "message"=>"Order Completed");
        break;
}

$conn->close();

// Send data in JSON format back to the user interface

if ($action_type != '') echo (json_encode($rows));

//if ($action_type != "") echo (json_encode(array("data"=>array_values($rows), "records"=>$rowcount)) );

session_write_close();

?>
