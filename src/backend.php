<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Подключение к базе данных
include 'db_config.php';

// Обработка GET-запросов
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['departments'])) {
        $departments = getDepartments($conn);
        echo json_encode($departments);
    } elseif (isset($_GET['positions'])) {
        $positions = getPositions($conn);
        echo json_encode($positions);
    } else {
        $employees = getEmployees($conn, $_GET);
        echo json_encode($employees);
    }
}

// Обработка POST-запросов
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $success = addEmployee($conn, $data);
    echo json_encode(['success' => $success]);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['action'])) {
        if ($data['action'] === 'fire') {
            $success = fireEmployee($conn, $data['EmployeeID']);
        } elseif ($data['action'] === 'update') {
            $success = updateEmployee($conn, $data);
        }
    } else {
        $success = false;
    }
    
    echo json_encode(['success' => $success]);
}

// Функция для обновления информации о сотруднике
function updateEmployee($conn, $data) {
    $stmt = $conn->prepare("UPDATE Employee SET FullName=?, BirthDate=?, PassportNumber=?, ContactInfo=?, Address=?, Salary=?, HireDate=?, DepartmentID=?, PositionID=? WHERE EmployeeID=?");
    $stmt->bind_param("ssssssssii", $data['FullName'], $data['BirthDate'], $data['PassportNumber'], $data['ContactInfo'], $data['Address'], $data['Salary'], $data['HireDate'], $data['DepartmentID'], $data['PositionID'], $data['EmployeeID']);
    
    return $stmt->execute();
}

// Функции работы с базой данных
function getEmployees($conn, $filters) {
    $query = "SELECT e.*, d.DepartmentName, p.PositionTitle FROM Employee e
              LEFT JOIN Department d ON e.DepartmentID = d.DepartmentID
              LEFT JOIN JobPosition p ON e.PositionID = p.PositionID";
    
    $conditions = [];
    if (!empty($filters['name'])) {
        $conditions[] = "e.FullName LIKE '%" . $conn->real_escape_string($filters['name']) . "%'";
    }
    if (!empty($filters['department'])) {
        $conditions[] = "e.DepartmentID = " . (int)$filters['department'];
    }
    if (!empty($filters['position'])) {
        $conditions[] = "e.PositionID = " . (int)$filters['position'];
    }
    if (count($conditions) > 0) {
        $query .= " WHERE " . implode(' AND ', $conditions);
    }
    
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}


function getDepartments($conn) {
    $result = $conn->query("SELECT * FROM Department");
    return $result->fetch_all(MYSQLI_ASSOC);
}

function getPositions($conn) {
    $result = $conn->query("SELECT * FROM JobPosition");
    return $result->fetch_all(MYSQLI_ASSOC);
}

function addEmployee($conn, $data) {
    $stmt = $conn->prepare("INSERT INTO Employee (FullName, BirthDate, PassportNumber, ContactInfo, Address, Salary, HireDate, DepartmentID, PositionID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssi", $data['FullName'], $data['BirthDate'], $data['PassportNumber'], $data['ContactInfo'], $data['Address'], $data['Salary'], $data['HireDate'], $data['DepartmentID'], $data['PositionID']);
    
    return $stmt->execute();
}

function fireEmployee($conn, $employeeID) {
    $stmt = $conn->prepare("UPDATE Employee SET IsFired = TRUE, FiredDate = NOW() WHERE EmployeeID = ?");
    $stmt->bind_param("i", $employeeID);
    
    return $stmt->execute();
}

$conn->close();
?>
