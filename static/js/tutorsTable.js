'use strict';

const tutorsUrl = "http://localhost:8085/tutors";

window.onload = async () => {
    const response = await fetch(tutorsUrl);
    const myJson = await response.json();
    const tutorsData = myJson["_embedded"].tutors;


// Update table according to data
    var updateTable = function () {
        var dataTable = document.getElementById('table1'),
            tableHead = document.getElementById('table-head'),
            tbody = document.createElement('tbody');

        while (dataTable.firstChild) {
            dataTable.removeChild(dataTable.firstChild);
        }

        dataTable.appendChild(tableHead);

        for (var i = 0; i < tutorsData.length; i++) {
            const tutor = tutorsData[i];
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
            btnDelete.setAttribute('id', tutor['_links'].self.href);

            btnEdit.setAttribute('type', 'button');
            btnEdit.setAttribute('value', 'Edit');
            btnEdit.setAttribute('id', i);

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            td0.innerHTML = tutor.firstName;
            td1.innerHTML = tutor.lastName;
            td2.innerHTML = tutor.degree;
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
            degreeField = document.getElementById('degree'),
            saveButton = document.getElementById('btnSave');

        const tutor = tutorsData[id];
        firstNameField.value = tutor.firstName;
        lastNameField.value = tutor.lastName;
        degreeField.value = tutor.degree;
        saveButton.value = 'Update';
        saveButton.setAttribute('data-update', tutor['_links'].self.href);
    };

// Save new data
    var saveData = async function () {
        var newFirstName = document.getElementById('first_name').value,
            newLastName = document.getElementById('last_name').value,
            newDegree = document.getElementById('degree').value,
            datatoAdd = {
                firstName: newFirstName,
                lastName: newLastName,
                degree: newDegree
            };

        let result = await fetch(tutorsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datatoAdd)
        });

        document.location.reload(true);
    };

// Update data
    var updateData = async function (departmentUrl) {
        var upFirstName = document.getElementById('first_name').value;
        var upLastName = document.getElementById('last_name').value;
        var upDegree = document.getElementById('degree').value;
        let result = await fetch(departmentUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName : upFirstName,
                lastName: upLastName,
                degree: upDegree
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