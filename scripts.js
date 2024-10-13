document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
    loadDepartments();
    loadPositions();

    // Установка маски ввода для серии и номера паспорта
    const passportInput = document.getElementById('passportNumber');
    passportInput.addEventListener('input', function() {
        // Оставляем только цифры и ограничиваем ввод до 10 символов
        let value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        // Форматируем строку в формате "0000 000000"
        this.value = value.replace(/(\d{4})(\d{0,6})/, '$1 $2').trim();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('contactInfo');
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Удаляем все, кроме цифр
        // Ограничиваем количество символов до 11 (код страны + 10 цифр номера)
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        // Форматируем номер телефона в виде "+7 (000) 000-00-00"
        if (value.startsWith('7')) {
            value = '+' + value;
        } else if (value.startsWith('8')) {
            value = '+7' + value.slice(1);
        }
        // Добавляем скобки и дефисы по шаблону
        value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
        this.value = value;
    });
});

// Функция для загрузки сотрудников
function loadEmployees() {
    fetch('src/backend.php')
        .then(response => response.json())
        .then(data => renderEmployees(data));
}

// Функция для рендеринга таблицы сотрудников
function renderEmployees(data) {
    const tbody = document.getElementById('employeeTable').querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.FullName}</td>
            <td>${employee.BirthDate}</td>
            <td>${formatPassportNumber(employee.PassportNumber)}</td>
            <td>${employee.ContactInfo}</td>
            <td>${employee.Address}</td>
            <td>${employee.DepartmentName}</td>
            <td>${employee.PositionTitle}</td>
            <td>${employee.Salary}</td>
            <td>${employee.HireDate}</td>
            <td>${employee.IsFired == 1 ? 'Уволен' : 'Работает'}</td>
            <td>
                ${employee.IsFired == 1 ? '' : `<button class="edit-button" onclick="editEmployee(${employee.EmployeeID})">Редактировать</button>`}
                ${employee.IsFired == 1 ? 'Нет доступных действий' : `<button class="fire-button" onclick="fireEmployee(${employee.EmployeeID})">Уволить</button>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Функция для фильтрации сотрудников
function filterEmployees() {
    const name = document.getElementById('searchName').value;
    const department = document.getElementById('departmentFilter').value;
    const position = document.getElementById('positionFilter').value;
    fetch(`src/backend.php?name=${name}&department=${department}&position=${position}`)
        .then(response => response.json())
        .then(data => renderEmployees(data));
}

function showAddEmployeeForm() {
    document.getElementById('addEmployeeForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Добавить нового сотрудника';
    document.getElementById('employeeForm').reset(); // Очищаем форму
    document.getElementById('employeeID').value = ''; // Сбрасываем ID сотрудника
}

function editEmployee(employeeID) {
    // Запрос данных сотрудника по ID
    fetch(`src/backend.php?id=${employeeID}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const employee = data[0]; // Берем только первого сотрудника из массива

                // Заполняем поля формы данными сотрудника
                document.getElementById('employeeID').value = employee.EmployeeID;
                document.getElementById('fullName').value = employee.FullName;
                
                // Проверка и преобразование даты
                document.getElementById('birthDate').value = employee.BirthDate 
                    ? new Date(employee.BirthDate).toISOString().split('T')[0] 
                    : '';
                
                document.getElementById('passportNumber').value = employee.PassportNumber;
                document.getElementById('contactInfo').value = employee.ContactInfo;
                document.getElementById('address').value = employee.Address;
                document.getElementById('salary').value = employee.Salary;
                
                document.getElementById('hireDate').value = employee.HireDate 
                    ? new Date(employee.HireDate).toISOString().split('T')[0] 
                    : '';
                
                document.getElementById('departmentID').value = employee.DepartmentID;
                document.getElementById('positionID').value = employee.PositionID;

                // Отображаем форму с измененным заголовком
                document.getElementById('formTitle').textContent = 'Редактировать сотрудника';
                document.getElementById('addEmployeeForm').style.display = 'block';
            } else {
                console.error('Не удалось получить данные сотрудника');
            }
        })
        .catch(error => console.error('Ошибка загрузки данных сотрудника:', error));
}

// Функция для форматирования паспортных данных (серия и номер)
function formatPassportNumber(passportNumber) {
    const seriesLength = 4;

    if (typeof passportNumber === 'string' && passportNumber.length > seriesLength) {
        // Делим строку на серию и номер, используя substr
        const series = passportNumber.substr(0, seriesLength);
        const number = passportNumber.substr(seriesLength);
        return `${series} ${number}`;
    }
    return passportNumber;
}


// Функция для скрытия формы добавления сотрудника
function hideAddEmployeeForm() {
    document.getElementById('addEmployeeForm').style.display = 'none';
}

// Функция для загрузки отделов
function loadDepartments() {
    fetch('src/backend.php?departments=true')
        .then(response => response.json())
        .then(data => {
            const departmentSelect = document.getElementById('departmentID');
            const filterDepartmentSelect = document.getElementById('departmentFilter');
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.DepartmentID;
                option.textContent = department.DepartmentName;

                // Добавляем опцию в выпадающий список для фильтров
                filterDepartmentSelect.appendChild(option);

                // Добавляем опцию в выпадающий список для формы добавления сотрудника
                const formOption = option.cloneNode(true); // Клонируем опцию для формы
                departmentSelect.appendChild(formOption);
            });
        })
        .catch(error => console.error('Error loading departments:', error));
}
// Функция для загрузки должностей
function loadPositions() {
    fetch('src/backend.php?positions=true')
        .then(response => response.json())
        .then(data => {
            const positionSelect = document.getElementById('positionID');
            const filterPositionSelect = document.getElementById('positionFilter');
            data.forEach(position => {
                const option = document.createElement('option');
                option.value = position.PositionID;
                option.textContent = position.PositionTitle;

                // Добавляем опцию в выпадающий список для фильтров
                filterPositionSelect.appendChild(option);

                // Добавляем опцию в выпадающий список для формы добавления сотрудника
                const formOption = option.cloneNode(true); // Клонируем опцию для формы
                positionSelect.appendChild(formOption);
            });
        })
        .catch(error => console.error('Error loading positions:', error));
}

document.getElementById('employeeForm').onsubmit = function(event) {
    event.preventDefault();
    
    const confirmed = confirm("Вы уверены, что хотите сохранить изменения?");
    
    if (confirmed) {
        const employeeData = {
            action: 'update',
            EmployeeID: document.getElementById('employeeID').value,
            FullName: document.getElementById('fullName').value,
            BirthDate: document.getElementById('birthDate').value,
            PassportNumber: document.getElementById('passportNumber').value,
            ContactInfo: document.getElementById('contactInfo').value,
            Address: document.getElementById('address').value,
            Salary: document.getElementById('salary').value,
            HireDate: document.getElementById('hireDate').value,
            DepartmentID: document.getElementById('departmentID').value,
            PositionID: document.getElementById('positionID').value,
        };        
    
    const method = employeeData.EmployeeID ? 'PUT' : 'POST';
    const url = 'src/backend.php';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Изменения успешно сохранены!");
            window.location.reload();
        } else {
            console.error('Ошибка при сохранении данных сотрудника');
        }
    })
    .catch(error => console.error('Ошибка при отправке данных:', error));
    }
};

// Функция для увольнения сотрудника
function fireEmployee(employeeID) {
    if (confirm("Вы уверены, что хотите уволить этого сотрудника?")) {
        const employeeData = {
            action: 'fire',
            EmployeeID: employeeID
        };

        fetch('src/backend.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData), 
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Сотрудник успешно уволен.");
                loadEmployees();
            } else {
                alert("Ошибка при увольнении сотрудника.");
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при увольнении сотрудника.");
        });
    } else {
        console.log("Увольнение отменено пользователем.");
    }
}


