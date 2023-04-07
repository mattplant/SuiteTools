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

/**
 * Show a modal with a custom page.
 * @author Matthew Plant
 * @param {string} modalId - the id of the modal to show
 * @param {string} pageUrl - the url of the page to show
 * @param {string | number} id - the id of the record to show
 */
function showModal(modalId, pageUrl, id) {
    // replace id if number in parentheses is found at end
    var str = id.toString();
    var matches = str.match(/\((-?\d+)\)$/);
    if (matches) {
        id = matches[1];
    }
    pageUrl = pageUrl + id;
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
 * Show file modal.
 * @author Matthew Plant
 * @param {string} scriptUrl - the base url of the script to show
 * @param {string | number} id - the id of the record to show
 */
function showFileModal(scriptUrl, id) {
    pageUrl = scriptUrl + '&action=fileModal&id=';
    content = showModal("file-modal", pageUrl, id);
}

/**
 * Show script modal.
 * @author Matthew Plant
 * @param {string} scriptUrl - the base url of the script to show
 * @param {string | number} id - the id of the record to show
 */
function showScriptModal(scriptUrl, id) {
    pageUrl = scriptUrl + '&action=scriptModal&id=';
    content = showModal("script-modal", pageUrl, id);
}

/**
 * Show user modal.
 * @author Matthew Plant
 * @param {string} scriptUrl - the base url of the script to show
 * @param {string | number} id - the id of the record to show
 */
function showUserModal(scriptUrl, id) {
    pageUrl = scriptUrl + '&action=userModal&id=';
    content = showModal("user-modal", pageUrl, id);
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
