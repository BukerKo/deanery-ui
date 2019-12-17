'use strict';

let departmentData;
let url_string =  window.location.href;
let url = new URL(url_string);
let id = url.searchParams.get("groupId");
console.log(id);


const departmentsUrl = "http://localhost:8085/departments/" + id;
const rootGroupsUrl = "http://localhost:8085/groups";
let groupsUrl;


window.onload = async () => {
    let response = await fetch(departmentsUrl);
    let myJson = await response.json();
    groupsUrl = myJson['_links'].classes.href;
    response = await fetch(groupsUrl);
    myJson = await response.json();
    const departmentData = myJson['_embedded'].groups;
    console.log(departmentData);

// Update table according to data
    var updateTable = function () {
        var dataTable = document.getElementById('table1'),
            tableHead = document.getElementById('table-head'),
            tbody = document.createElement('tbody');

        while (dataTable.firstChild) {
            dataTable.removeChild(dataTable.firstChild);
        }

        dataTable.appendChild(tableHead);

        for (var i = 0; i < departmentData.length; i++) {
            const deanery = departmentData[i];
            var tr = document.createElement('tr'),
                td0 = document.createElement('td'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td'),
                btnDelete = document.createElement('input'),
                btnEdit = document.createElement('input');

            btnDelete.setAttribute('type', 'button');
            btnDelete.setAttribute('value', 'Delete');
            btnDelete.setAttribute('class', 'btnDelete');
            btnDelete.setAttribute('id', deanery['_links'].department.href);

            btnEdit.setAttribute('type', 'button');
            btnEdit.setAttribute('value', 'Edit');
            btnEdit.setAttribute('id', i);

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);

            let id = deanery['_links'].self.href.split("/").slice(-1)[0];
            td0.innerHTML = '<a href="/static/html/group.html?groupId=' + id + '">'+deanery.name+'</a>';
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
        var nameField = document.getElementById('group'),
            saveButton = document.getElementById('btnSave');

        const deanery = departmentData[id];
        nameField.value = deanery.name;
        saveButton.value = 'Update';
        saveButton.setAttribute('data-update', deanery['_links'].self.href);
    };

// Save new data
    var saveData = async function () {
        var newName = document.getElementById('group').value,
            datatoAdd = {
                name: newName,
            };

        let result = await fetch(rootGroupsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datatoAdd)
        });
        const json = await result.json();
        const groupUrl = json['_links'].department.href;

        result = await fetch(groupUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/uri-list',
            },
            body: departmentsUrl
        });

        document.location.reload(true);
    };

// Update data
    var updateData = async function (groupUrl) {
        var upName = document.getElementById('group').value;
        let result = await fetch(groupUrl, {
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