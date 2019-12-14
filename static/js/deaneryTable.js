'use strict';

let deaneryData;
const departmentsUrl = "http://localhost:8080/departments";

window.onload = async () => {
    const response = await fetch(departmentsUrl);
    const myJson = await response.json();
    deaneryData = myJson["_embedded"].departments;


// Update table according to data
    var updateTable = function () {
        var dataTable = document.getElementById('table1'),
            tableHead = document.getElementById('table-head'),
            tbody = document.createElement('tbody');

        while (dataTable.firstChild) {
            dataTable.removeChild(dataTable.firstChild);
        }

        dataTable.appendChild(tableHead);

        for (var i = 0; i < deaneryData.length; i++) {
            const deanery = deaneryData[i];
            var tr = document.createElement('tr'),
                td0 = document.createElement('td'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td'),
                btnDelete = document.createElement('input'),
                btnEdit = document.createElement('input');

            btnDelete.setAttribute('type', 'button');
            btnDelete.setAttribute('value', 'Delete');
            btnDelete.setAttribute('class', 'btnDelete');
            btnDelete.setAttribute('id', deanery['_links'].self.href);

            btnEdit.setAttribute('type', 'button');
            btnEdit.setAttribute('value', 'Edit');
            btnEdit.setAttribute('id', i);

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);

            let id = deanery['_links'].self.href.split("/").slice(-1)[0];
            td0.innerHTML = '<a href="/static/html/department.html?id=' + id + '">'+deanery.name+'</a>';
            td1.appendChild(btnEdit);
            td2.appendChild(btnDelete);


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
        var nameField = document.getElementById('department'),
            saveButton = document.getElementById('btnSave');

        const deanery = deaneryData[id];
        nameField.value = deanery.name;
        saveButton.value = 'Update';
        saveButton.setAttribute('data-update', deanery['_links'].self.href);
    };

// Save new data
    var saveData = async function () {
        var newName = document.getElementById('department').value,
            datatoAdd = {
                name: newName,
            };

        let result = await fetch(departmentsUrl, {
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
        var upName = document.getElementById('department').value;
        let result = await fetch(departmentUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name : upName})
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