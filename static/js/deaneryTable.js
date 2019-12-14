'use strict';

let userData;
const departmentsUrl = "http://192.168.31.205:8080/departments";

window.onload = async () => {
    const response = await fetch(departmentsUrl);
    const myJson = await response.json();
    alert(myJson);
};


// Update table according to data
var updateTable = function () {
    var dataTable = document.getElementById('table1'),
        tableHead = document.getElementById('table-head'),
        tbody = document.createElement('tbody');

    while (dataTable.firstChild) {
        dataTable.removeChild(dataTable.firstChild);
    }

    dataTable.appendChild(tableHead);

    for (var i = 0; i < userData.length; i++) {
        var tr = document.createElement('tr'),
            td0 = document.createElement('td'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            btnDelete = document.createElement('input'),
            btnEdit = document.createElement('input');

        btnDelete.setAttribute('type', 'button');
        btnDelete.setAttribute('value', 'Delete');
        btnDelete.setAttribute('class', 'btnDelete');
        btnDelete.setAttribute('id', i);

        btnEdit.setAttribute('type', 'button');
        btnEdit.setAttribute('value', 'Edit');
        btnEdit.setAttribute('id', i);

        tr.appendChild(td0);
        tr.appendChild(td1);
        tr.appendChild(td2);

        td0.innerHTML = userData[i].name;
        td1.appendChild(btnEdit);
        td2.appendChild(btnDelete);


        btnDelete.onclick = (function () {
            return function () {
                if (confirm("Are you sure you want to delete?")) {
                    var deleteId = this.getAttribute('id');
                    userData.splice(deleteId, 1);
                    updateTable();
                    refreshForm();
                }
            };
        })();

        btnEdit.addEventListener('click', function () {
            var editId = this.getAttribute('id');
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            updateForm(editId);
        }, false);

        tbody.appendChild(tr);
    }
    dataTable.appendChild(tbody);
};

// Set form for data edit
var updateForm = function (id) {
    console.log(userData[id].name);
    var nameField = document.getElementById('name'),
        saveButton = document.getElementById('btnSave');

    nameField.value = userData[id].name;
    saveButton.value = 'Update';
    saveButton.setAttribute('data-update', id);
}

// Save new data
var saveData = function () {
    var newName = document.getElementById('name').value,
        datatoAdd = {
            name: newName,
        };

    userData.push(datatoAdd);
    updateTable();
}

// Update data
var updateData = function (id) {
    var upName = document.getElementById('name').value,
        upPhone = document.getElementById('phone').value;

    userData[id].name = upName;
    userData[id].phone = upPhone;
    updateTable();
}

// Reset the form
var refreshForm = function () {
    var nameField = document.getElementById('name'),
        phoneField = document.getElementById('phone'),
        saveButton = document.getElementById('btnSave');

    nameField.value = '';
    phoneField.value = '';
    saveButton.value = 'Save';
    saveButton.removeAttribute('data-update');
}

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
        refreshForm();
    };

    btnRefresh.onclick = function () {
        refreshForm();
    };
};

init(); //Intialize the table
