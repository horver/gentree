<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $result = $sqli->query("select p.id, p.name, p.email, p.sex, p.mother_id,
                          p.father_id, p.born, p.death, r.husband_id from
                          person as p left outer join relationship as r
                          on p.id = r.wife_id;");
  if ($result) {
    $output["persons"] = array();
    while($output["persons"][] = $result->fetch_assoc());
    array_pop($output["persons"]);
    $output["success"] = true;
  }else{
    $output["error"] = $sqli->error;
  }
  $result->close();
}else{
  $output["error"] = "Nonono";
}

$sqli->close();
echo json_encode($output);

?>
