<?php
require("../config.php");
header("Content-type: application/json; charset=utf-8");

$output = array("error" => "", "success" => false);

if (isset($_SESSION["USER"])) {
  $stmt = $sqli->prepare("select p.*, father.id as fId, mother.id as mId, father.name as fName, mother.name as mName from person as p
                          left outer join person as father on p.father_id = father.id
                          left outer join person as mother on p.mother_id = mother.id
                          where p.id=?");
  $stmt->bind_param("i", $_POST["id"]);
  if ($stmt->execute()) {
    $result = $stmt->get_result();
    $output["person"] = $result->fetch_assoc();
    unset($output["person"]["password"]);

    //Aktuális lakhely
    $stmt = $sqli->prepare("select place.*, l.* from person as p
                            left outer join living as l on l.person_id = p.id
                            inner join place on place.id = l.place_id
                            where p.id=? and l.end is null");
    $stmt->bind_param("i", $_POST["id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $place = $result->fetch_assoc();
    $output["person"]["place"] = $place;

    //Korábbi lakhelyek
    $stmt = $sqli->prepare("select place.*, l.* from person as p
                            left outer join living as l on l.person_id = p.id
                            inner join place on place.id = l.place_id
                            where p.id=? and l.end is not null");
    $stmt->bind_param("i", $_POST["id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $output["person"]["pastPlaces"] = array();
    while($output["person"]["pastPlaces"][] = $result->fetch_assoc());
    array_pop($output["person"]["pastPlaces"]);

    //Házasságok lekérdezése
    $stmt = $sqli->prepare("select r.*, p.name, other.name as otherName, other.id as otherId from person as p
                          	left outer join relationship as r on r.husband_id = p.id or r.wife_id = p.id
                            left outer join person as other on other.id = r.husband_id or other.id = r.wife_id
                            where p.id=? and p.id!=other.id
                            order by divorce asc");
    $stmt->bind_param("i", $_POST["id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $output["person"]["relationships"] = array();
    while($output["person"]["relationships"][] = $result->fetch_assoc());
    array_pop($output["person"]["relationships"]);

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
