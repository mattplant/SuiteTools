/**
 * SuiteTools Client Functions
 *
 * The client side functions for SuiteTools.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2023  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Clear HTML select fields
 * @author Matthew Plant
 * @param multiselectIds
 */
function clearSelectFields(multiselectIds) {
    for (var multiselectId of multiselectIds) {
        var field = document.getElementById(multiselectId).options;
        // clear the the select fields of their selected values
        for (var i = 0; i < field.length; i++) {
            field[i].selected = false;
        }
    }
}

/**
 * Clear HTML text fields
 * @author Matthew Plant
 * @param textIds
 */
function clearTextFields(textIds) {
    for (var textId of textIds) {
        document.getElementById(textId).value = "";
    }
}

/**
 * Multiselect Post Workaround
 * Provides a workaround for NetSuite's handling of multiselect fields by using hidden field (id: custom_multiselects)
 * @author Matthew Plant
 * @param multiselectIds
 */
function CustomMultiselectPost(multiselectIds) {
    // gather all the selected values of each multiselect
    var selections = [];
    for (var multiselectId of multiselectIds) {
        console.log(multiselectId);
        var optionsSelected = [];
        for (var option of document.getElementById(multiselectId).options) {
            if (option.selected) {
                optionsSelected.push({"value": option.value})
            }
        }
        if (optionsSelected.length > 0) {
            selections.push({field: multiselectId, "values": optionsSelected})
        }
    }
    // set the value of the hidden multiselects field to the selected values of the each multiselect
    document.getElementById('custom_multiselects').value = JSON.stringify(selections);
}

/**
 * Post a custom page.
 * @author Matthew Plant
 * @param multiselectIds
 * @param {string} pageUrl - the url of the page to post
 */
function postPage(multiselectIds, pageUrl) {
    // multiselect workaround
    CustomMultiselectPost(multiselectIds);

    // // post the page
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         document.getElementById("main").innerHTML = this.responseText;
    //     }
    // };
    // xhttp.open("POST", pageUrl, true);
    // xhttp.send();
}

const ModalType = Object.freeze({
    "Employee": 1,
    "File": 2,
    "Integration": 3,
    "Role": 4,
    "Script": 5,
    "Token": 6,
    "User": 7,
});

/**
 * Show a modal with a custom page.
 * @author Matthew Plant
 * @param {string} scriptUrl - the URL of the main script
 * @param {number} modalType - the type of modal to show
 * @param {string | number} id - the id of the record to show
 */
function showModal(scriptUrl, modalType, id) {
    // determine the modal id and page url
    switch (modalType) {
        case ModalType.Employee:
            modalId = 'employee-modal';
            action = 'employeeModal';
            break;
        case ModalType.File:
            modalId = 'file-modal';
            action = 'fileModal';
            break;
        case ModalType.Integration:
            modalId = 'integration-modal';
            action = 'integrationModal';
            break;
        case ModalType.Role:
            modalId = 'role-modal';
            action = 'roleModal';
            break;
        case ModalType.Script:
            modalId = 'script-modal';
            action = 'scriptModal';
            break;
        case ModalType.Token:
            modalId = 'token-modal';
            action = 'tokenModal';
            break;
        case ModalType.User:
            modalId = 'user-modal';
            action = 'userModal';
            break;
        default:
            console.error('Invalid modal type "' + modalType + '" provided.');
            return;
    }
    // determine id replacing id if number in parentheses is found at end
    var str = id.toString();
    var matches = str.match(/\((-?\d+)\)$/);
    if (matches) {
        id = matches[1];
    }
    // build the page url
    pageUrl = scriptUrl + '&action=' + action + '&id=' + id;
    // get the page
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // set the modal content
            document.getElementById(modalId + '-content').innerHTML = this.responseText;
            // show modal
            const modal = new Modal(document.getElementById(modalId), null)
            modal.show();
            // add event listener to close icon
            const closeModalIcon = document.getElementById(modalId + '-close-icon');
            closeModalIcon.addEventListener('click', () => {
                modal.hide();
            });
        }
    };
    xhttp.open("GET", pageUrl, true);
    xhttp.send();
}

/**
 * Set form option values.
 * @author Matthew Plant
 * @param {string} data - the data to set the options of the select fields
 */
function setOptionValues(data) {
    if (data.options) {
        for (var i = 0; i < data.options.length; i++) {
            var field = data.options[i].field;
            var values = data.options[i].values;
            var select = document.getElementById(field);
            if (select) {
                for (var j = 0; j < values.length; j++) {
                    var option = document.createElement('option');
                    option.value = values[j].value;
                    option.text = values[j].text;
                    select.add(option);
                }
            }
        }
    }
}

/**
 * Set form selections.
 * @author Matthew Plant
 * @param {object} data - the selections of the select fields
 */
function setFormSelections(data) {
    for (var i = 0; i < data.length; i++) {
        var key = Object.keys(data[i])[0];
        var value = data[i][key];
        var select = document.getElementById(key);
        if (select) {
            // if comma separated string
            if (typeof value === 'string' && value.includes(',')) {
                value = value.split(',');
                // set multiselect values
                const options = select.querySelectorAll('option');
                for (var j = 0; j < value.length; j++) {
                    let option = Array.from(options).find(opt => opt.value === value[j]);
                    if (option) {
                        option.selected = true;
                    }
                }
            } else {
                select.value = value;
            }
        }
    }
}

/**
 * Get page content
 *
 * @param {string} url - the endpoint to get data from
 * @param {string} id - the id of the element to get
 */
function getPageContent(url, id) {
    return fetch(url)
    .then((response) => response.text())
    .then((pageData) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageData, 'text/html');
        const content = doc.getElementById(id).innerHTML;
        return content;
    })
    .catch((error) => {
        console.error(`getPageContent Error =\n`, error);
    });
};

/**
 * Get JSON page content
 *
 * @param {string} url - the endpoint to get data from
 */
function getJsonPageContent(url) {
    return fetch(url)
    .then((response) => response.text())
    .then((pageData) => {
        return JSON.parse(pageData);
    })
    .catch((error) => {
        console.error(`getPageContent Error =\n`, error);
    });
};

/**
 * Post data to an endpoint.
 *
 * @param name - the name of the data
 * @param data - the data to post
 * @param {string} url - the endpoint to post to
 */
function postData(name, data, url) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, value: data })
    };
    return fetch(url, requestOptions)
        .then(response => response.text())
        .catch(error => console.error('postData Error =\n', error));
}
