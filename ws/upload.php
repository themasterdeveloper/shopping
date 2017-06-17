<?php
include '../config.php';
$target_dir = getcwd() . $_POST["target_folder"];
$imageFileType = pathinfo(basename($_FILES["fileToUpload"]["name"]),PATHINFO_EXTENSION);
$target_file = $target_dir . $_POST["image_file_name"] . '.' . $imageFileType;

$uploadOk = 1;
$error_message = "";

if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        $uploadOk = 1;
    } else {
        $uploadOk = 0;
        $error_message = "File is not an image";
    }
}

if (file_exists($target_file)) {
    unlink($target_file);
}

if ($_FILES["fileToUpload"]["size"] > 50000) {
    $uploadOk = 0;
    $error_message = "Sorry, your file is too large";
}

if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
    $uploadOk = 0;
    $error_message = "Sorry, only JPG, JPEG, PNG & GIF files are allowed";
}

if($uploadOk==1){
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "<script>parent.confirm_upload('" . $imageFileType . "');</script>";
    } else {
        echo "<script>parent.common.showErr('" . $error_message . "');</script>";
    }
}
?>
