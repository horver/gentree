<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $stmt = $sqli->prepare("select p.id, p.name, p.born, p.death, count(child.id) as childNum from person as p
                          left outer join person as child on (child.father_id = p.id or child.mother_id = p.id)
                          group by p.id order by p.name asc");
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
