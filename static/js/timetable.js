'use strict';



window.onload = async () => {
    let url_string =  window.location.href;
    let url = new URL(url_string);
    let groupId = url.searchParams.get("groupId");

    const timetablesUrl = "http://localhost:8085/timeTables/search/findByGroup_Id?groupId=" + groupId;
    const timetablesRootUrl = "http://localhost:8085/timeTables";
    const groupsRootUrl = "http://localhost:8085/groups";
    const tutorsUrl = "http://localhost:8085/tutors";


    let response = await fetch(timetablesUrl);
    let myJson = await response.json();
    const timeTableData = myJson['_embedded'].timeTables;

    response = await fetch(tutorsUrl);
    myJson = await response.json();
    const tutorsData = myJson['_embedded'].tutors;

// Update table according to data
    var updateTable = async function () {
        var dataTable = document.getElementById('table1'),
            tableHead = document.getElementById('table-head'),
            tutorSelect = document.getElementById('tutor'),
            tbody = document.createElement('tbody');

        while (dataTable.firstChild) {
            dataTable.removeChild(dataTable.firstChild);
        }

        dataTable.appendChild(tableHead);

        for (let i = 0; i < timeTableData.length; i++) {
            const timeTable = timeTableData[i];
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
            btnDelete.setAttribute('groupId', timeTable['_links'].group.href);

            btnEdit.setAttribute('type', 'button');
            btnEdit.setAttribute('value', 'Edit');
            btnEdit.setAttribute('groupId', i);

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            const response = await fetch(timeTable['_links'].tutor.href);
            const json = await response.json();
            const tutorFullName = json.firstName + ' ' + json.lastName;

            td0.innerHTML = timeTable.dayOfWeek;
            td1.innerHTML = timeTable.content;
            td2.innerHTML = tutorFullName;
            td3.appendChild(btnEdit);
            td4.appendChild(btnDelete);


            btnDelete.onclick = (function () {
                return async function () {
                    if (confirm("Are you sure you want to delete?")) {
                        var deleteUrl = this.getAttribute('groupId');
                        let result = await fetch(deleteUrl, {
                            method: 'DELETE',
                        });
                    }
                    document.location.reload(true);
                };
            })();

            btnEdit.addEventListener('click', function () {
                var editId = this.getAttribute('groupId');
                updateForm(editId);
            }, false);

            tbody.appendChild(tr);
        }

        for (let i = 0; i < tutorsData.length; i++) {
            let option = document.createElement('option');
            option.text = tutorsData[i].firstName + ' ' + tutorsData[i].lastName;
            option.value = tutorsData[i].firstName + ' ' + tutorsData[i].lastName;
            tutorSelect.add(option);
        }

        dataTable.appendChild(tbody);


    };

// Set form for data edit
    var updateForm = async function (id) {
        var dayOfWeekField = document.getElementById('dayOfWeek'),
            tutorField = document.getElementById('tutor'),
            contentField = document.getElementById('content'),
            saveButton = document.getElementById('btnSave');

        const timeTable = timeTableData[id];
        const response = await fetch(timeTable['_links'].tutor.href);
        const json = await response.json();
        const tutorValue = json.firstName + ' ' + json.lastName;

        dayOfWeekField.value = timeTable.dayOfWeek;
        tutorField.value = tutorValue;
        contentField.value = timeTable.content;
        saveButton.value = 'Update';
        saveButton.setAttribute('data-update', timeTable['_links'].self.href);
    };

// Save new data
    var saveData = async function () {
        const newDayOfWeek = document.getElementById('dayOfWeek').value;
        const tutorSelectElement = document.getElementById('tutor');
        const newTutorName = tutorSelectElement.options[tutorSelectElement.selectedIndex].value;
        const newContent = document.getElementById('content').value;
        const tutorUrl = tutorsData.find(tutor => tutor.firstName + ' ' + tutor.lastName === newTutorName)['_links'].self.href;

        const datatoAdd = {
            dayOfWeek: newDayOfWeek,
            content: newContent,
            tutor: tutorUrl,
        };

        let result = await fetch(timetablesRootUrl, {
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
            body: groupsRootUrl + '/' + groupId
        });


        document.location.reload(true);
    };

// Update data
    const updateData = async function (timetablesUrl) {
        const upDayOfWeek = document.getElementById('dayOfWeek').value;
        const tutorSelectElement = document.getElementById('tutor');
        const newTutorName = tutorSelectElement.options[tutorSelectElement.selectedIndex].value;
        const upContent = document.getElementById('content').value;

        const tutorUrl = tutorsData.find(tutor => tutor.firstName + ' ' + tutor.lastName === newTutorName)['_links'].self.href;

        let result = await fetch(timetablesUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dayOfWeek : upDayOfWeek,
                content: upContent,
                tutor: tutorUrl
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