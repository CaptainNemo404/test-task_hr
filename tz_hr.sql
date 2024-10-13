-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Окт 13 2024 г., 19:45
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `tz_hr`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Department`
--

CREATE TABLE `Department` (
  `DepartmentID` int NOT NULL,
  `DepartmentName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Department`
--

INSERT INTO `Department` (`DepartmentID`, `DepartmentName`) VALUES
(1, 'Отдел кадров'),
(2, 'IT'),
(3, 'Финансовый отдел'),
(4, 'Маркетинг'),
(5, 'Отдел продаж');

-- --------------------------------------------------------

--
-- Структура таблицы `Employee`
--

CREATE TABLE `Employee` (
  `EmployeeID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `BirthDate` date NOT NULL,
  `PassportNumber` varchar(10) NOT NULL,
  `ContactInfo` varchar(100) NOT NULL,
  `Address` text NOT NULL,
  `Salary` decimal(10,2) NOT NULL,
  `HireDate` date NOT NULL,
  `IsFired` tinyint(1) DEFAULT '0',
  `FiredDate` date DEFAULT NULL,
  `DepartmentID` int DEFAULT NULL,
  `PositionID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Employee`
--

INSERT INTO `Employee` (`EmployeeID`, `FullName`, `BirthDate`, `PassportNumber`, `ContactInfo`, `Address`, `Salary`, `HireDate`, `IsFired`, `FiredDate`, `DepartmentID`, `PositionID`) VALUES
(1, 'Петров Иван Иванович', '1985-05-12', '4500123456', '+7 (900) 123-45-64', 'г. Москва, ул. Ленина, д.2', '75000.00', '2020-01-15', 0, NULL, 1, 4),
(2, 'Смирнов Кирилл Александрович', '2004-01-21', '4501654321', '+7 (900) 234-56-78', 'г Ярославль, ул Большая Норская, д 17а', '80000.00', '2019-10-04', 0, NULL, 3, 3),
(3, 'Иванов Иван Иванович', '1985-07-12', '4534523456', '+7 (967) 123-45-67', 'г. Москва, ул. Ленина, д.1', '70000.00', '2020-01-15', 0, NULL, 2, 4),
(6, 'Сергеев Иван Иванович', '1985-06-12', '4500456456', '+7 (900) 145-45-67', 'г. Москва, ул. Ленина, д.3', '70000.00', '2020-01-15', 1, '2024-10-13', 2, 4),
(7, 'Петров Петр Петрович', '1980-03-15', '1234567890', '+7 (910) 111-22-33', 'г. Москва, ул. Пушкина, д. 1', '50000.00', '2023-01-01', 0, NULL, 1, 2),
(8, 'Сидорова Светлана Ивановна', '1990-07-20', '2345678901', '+7 (910) 222-33-44', 'г. Санкт-Петербург, ул. Ленина, д. 2', '60000.00', '2023-02-01', 1, '2024-10-13', 2, 3),
(9, 'Иванов Сергей Александрович', '1985-09-30', '3456789012', '+7 (910) 333-44-55', 'г. Казань, ул. Гагарина, д. 3', '55000.00', '2023-03-01', 0, NULL, 1, 2),
(10, 'Федорова Анна Сергеевна', '1992-12-05', '4567890123', '+7 (910) 444-55-66', 'г. Екатеринбург, ул. Степана Разина, д. 4', '65000.00', '2023-04-01', 0, NULL, 3, 1),
(11, 'Кузнецов Алексей Викторович', '1988-05-18', '5678901234', '+7 (910) 555-66-77', 'г. Новосибирск, ул. Мира, д. 5', '70000.00', '2023-05-01', 0, NULL, 2, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `JobPosition`
--

CREATE TABLE `JobPosition` (
  `PositionID` int NOT NULL,
  `PositionTitle` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `JobPosition`
--

INSERT INTO `JobPosition` (`PositionID`, `PositionTitle`) VALUES
(1, 'HR-менеджер'),
(2, 'Программист'),
(3, 'Бухгалтер'),
(4, 'Маркетолог'),
(5, 'Менеджер по продажам');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Department`
--
ALTER TABLE `Department`
  ADD PRIMARY KEY (`DepartmentID`);

--
-- Индексы таблицы `Employee`
--
ALTER TABLE `Employee`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD KEY `DepartmentID` (`DepartmentID`),
  ADD KEY `PositionID` (`PositionID`);

--
-- Индексы таблицы `JobPosition`
--
ALTER TABLE `JobPosition`
  ADD PRIMARY KEY (`PositionID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Department`
--
ALTER TABLE `Department`
  MODIFY `DepartmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `Employee`
--
ALTER TABLE `Employee`
  MODIFY `EmployeeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `JobPosition`
--
ALTER TABLE `JobPosition`
  MODIFY `PositionID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Employee`
--
ALTER TABLE `Employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `Department` (`DepartmentID`) ON DELETE SET NULL,
  ADD CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`PositionID`) REFERENCES `JobPosition` (`PositionID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
