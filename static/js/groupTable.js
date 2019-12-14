'use strict';

let departmentData;
let url_string =  window.location.href;
let url = new URL(url_string);
let id = url.searchParams.get("id");

const groupsUrl = "http://localhost:8080/groups/" + id;
const rootStudentsUrl = "http://localhost:8080/students";
let studentsUrl;


window.onload = async () => {
    let response = await fetch(groupsUrl);
    let myJson = await response.json();
    studentsUrl = myJson['_links'].students.href;
    response = await fetch(studentsUrl);
    myJson = await response.json();
    const studentData = myJson['_embedded'].students;

// Update table according to data
    var updateTable = function () {
        var dataTable = document.getElementById('table1'),
            tableHead = document.getElementById('table-head'),
            tbody = document.createElement('tbody');

        while (dataTable.firstChild) {
            dataTable.removeChild(dataTable.firstChild);
        }

        dataTable.appendChild(tableHead);

        for (var i = 0; i < studentData.length; i++) {
            const student = studentData[i];
            var tr = document.createElement('tr'),
                td0 = document.createElement('td'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td'),
                td3 = document.createElement('td'),
                td4 = document.createElement('td'),

                btnDelete = document.createElement('input'),
                btnEdit = document.createElement('input');

            btnDelete.setAttribute('type', 'button');
            btnDelete.setAttribute('value', 'Delete');
            btnDelete.setAttribute('class', 'btnDelete');
            btnDelete.setAttribute('id', student['_links'].group.href);

            btnEdit.setAttribute('type', 'button');
            btnEdit.setAttribute('value', 'Edit');
            btnEdit.setAttribute('id', i);

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            let id = student['_links'].self.href.split("/").slice(-1)[0];
            td0.innerHTML = student.firstName;
            td1.innerHTML = student.lastName;
            td2.innerHTML = student.birthDate;
            td3.appendChild(btnEdit);
            td4.appendChild(btnDelete);


            btnDelete.onclick = (function () {
                return async function () {
                    if (confirm("Are you sure you want to delete?")) {
                        var deleteUrl = this.getAttribute('id');
                        let result = await fetch(deleteUrl, {
                            method: 'DELETE',
                        });
                    }
                    document.location.reload(true);
                };
            })();

            btnEdit.addEventListener('click', function () {
                var editId = this.getAttribute('id');
                updateForm(editId);
            }, false);

            tbody.appendChild(tr);
        }
        dataTable.appendChild(tbody);
    };

// Set form for data edit
    var updateForm = function (id) {
        var firstNameField = document.getElementById('first_name'),
            lastNameField = document.getElementById('last_name'),
            birthDateField = document.getElementById('birth_date'),
            saveButton = document.getElementById('btnSave');

        const student = studentData[id];
        firstNameField.value = student.firstName;
        lastNameField.value = student.lastName;
        birthDateField.value = student.birthDate;
        saveButton.value = 'Update';
        saveButton.setAttribute('data-update', student['_links'].self.href);
    };

// Save new data
    var saveData = async function () {
        var newFirstName = document.getElementById('first_name').value,
            newLastName = document.getElementById('last_name').value,
            newBirthDate = document.getElementById('birth_date').value,
            datatoAdd = {
                firstName: newFirstName,
                lastName: newLastName,
                birthDate: newBirthDate,
            };

        let result = await fetch(rootStudentsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datatoAdd)
        });
        const json = await result.json();
        const groupUrl = json['_links'].group.href;

        result = await fetch(groupUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/uri-list',
            },
            body: groupsUrl
        });

        document.location.reload(true);
    };

// Update data
    var updateData = async function (groupUrl) {
        var upFirstName = document.getElementById('first_name').value;
        var upLastName = document.getElementById('last_name').value;
        var upBirthDate = document.getElementById('birth_date').value;

        let result = await fetch(groupUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName : upFirstName,
                lastName: upLastName,
                birthDate: upBirthDate
            })
        });
        document.location.reload(true);
    };

// Main function
    var init = function () {
        updateTable();

        var btnSave = document.getElementById('btnSave'),
            btnRefresh = document.getElementById('btnRefresh');

        btnSave.onclick = function () {
            if (btnSave.getAttribute('data-update')) {
                updateData(btnSave.getAttribute('data-update'));
            } else {
                saveData();
            }
        };

        btnRefresh.onclick = function () {
            document.location.reload(true);
        };
    };

    init(); //Intialize the table

};