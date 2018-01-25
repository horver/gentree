<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  if (!isset($_POST["search"])) {
   $stmt = $sqli->prepare("select id, name, email, sex, father_id, mother_id from person");
  }else{
     $stmt = $sqli->prepare("select id, name, email, sex from person where name like ?");
     $stmt->bind_param("s", $name);
     $name = "%".$_POST["search"]."%";
   }
  if ($stmt->execute()) {
    $result = $stmt->get_result();
    $output["persons"] = array();
    while($output["persons"][] = $result->fetch_assoc());
    array_pop($output["persons"]);
    $output["success"] = true;
  }else{
    $output["error"] = $sqli->error;
  }
  $stmt->close();
}else{
  $output["error"] = "Nonono";
}

$sqli->close();
echo json_encode($output);

?>
