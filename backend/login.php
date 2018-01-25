<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (!isset($_SESSION["USER"])) {
  if (isset($_POST["email"]) && isset($_POST["password"])) {
    if ($_POST["email"]!="" && $_POST["password"]!=""){
      $stmt = $sqli->prepare("select * from person where email=? and password=? LIMIT 1");
      $stmt->bind_param("ss", $_POST["email"], sha1($_POST["email"].$shalt.$_POST["password"]));
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->num_rows == 1) {
          $user = $result->fetch_object();
          $_SESSION["USER"] = array(
            "ID" => (int)$user->id,
            "name" => (string)$user->name,
            "email" => (string)$user->email,
            "prename" => (string)$user->prename
          );
          $output["success"] = true;
      }else{
        $output["error"] = "Helytelen email/jelszó";
      }
      $stmt->close();
    }else{
      $output["error"] = "Üresek a mezők";
    }
  }else{
    $output["error"] = "Hiányos mezők";
  }
}else{
  $output["error"] = "Már be vagy jelentkezve";
}

$sqli->close();
echo json_encode($output);

?>
