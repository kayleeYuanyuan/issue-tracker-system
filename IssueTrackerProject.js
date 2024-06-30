var fileArray = [];
var handleFiles;
function redirectToCreate() {
    document.querySelector('.container').style.display = "none";
    document.querySelector('.dropzone').style.display = "";
    document.getElementById("submit").style.display = "";
    document.getElementById("update").style.display = "none";
    document.getElementById('issueName').value = '';
    document.getElementById('assignTo').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').innerText = '';
    document.getElementById('priority_choose').value = '';
    //set current date
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;
    document.getElementById('dueDate').value = formattedDate;

    document.getElementById('imagePreview').innerHTML = '';
    fileArray = [];
}
function redirectToHome() {
    document.querySelector('.dropzone').style.display = "none";
    document.querySelector('.container').style.display = "";
}
function filterData() {
    var priority = document.getElementById('priority').value;
    var searchValue = document.getElementById('searchContent').value.toLowerCase();
    var time = document.getElementById('time').value;
    var status = document.getElementById('status').value;
    var sort = document.getElementById('timeSort').value;

    if (!Array.isArray(info)) {
        document.getElementById("infoContent").innerHTML = "<p>No issues found!</p>";
        return;
    }
    var filteredData = info.filter(item => {
        var priorityCondition = true;
        var statusCondition = (status === 'all' || item.issueStatus === status);
        if (priority !== "") {
            priorityCondition = item.Priority === priority;
        }
        var searchCondition = item.issueName.toLowerCase().includes(searchValue);
        return statusCondition && priorityCondition && searchCondition;
    });
    if (sort !== "") {
        filteredData.sort((a, b) => {
            let dateA, dateB;
            if (time === 'due') {
                dateA = new Date(a.dueDate);
                dateB = new Date(b.dueDate);
            } else if (time === 'create') {
                dateA = a.created;
                dateB = b.created;
            } else if (time === 'update') {
                dateA = new Date(a.updateTime);
                dateB = new Date(b.updateTime);
            }
            return sort === 'ascending' ? dateA - dateB : dateB - dateA;
        });
    }
    document.getElementById("infoContent").innerHTML = gen_info(filteredData);
}
function clear() {
    var search = document.getElementById('searchContent');
    search.value = '';
    search.dispatchEvent(new Event('input'));
}
function get_priority(el) {
    if (el.Priority === 'high') {
        return 'H';
    }
    else if (el.Priority === 'medium') {
        return 'M';
    }
    else if (el.Priority === 'low') {
        return 'L';
    }
    else if (el.Priority === 'delayed') {
        return 'D';
    }
}
function priority_color(el) {
    if (el.Priority === 'high') {
        return '#FEBAAB';
    }
    else if (el.Priority === 'medium') {
        return '#EBC598';
    }
    else if (el.Priority === 'low') {
        return '#E3FFD6';
    }
    else if (el.Priority === 'delayed') {
        return '#999FA2';
    }
}
function gen_info(el) {
    var html = '';
    el.forEach(el => {
        var status = '';
        if (el.issueStatus === 'open') {
            status = 'Close';
        }
        else if (el.issueStatus === 'close') {
            status = 'Open';
        }
        if (el.Image !== null) {
            html += `<div class="item">
                    <div class="issues" onclick="showDetails(this)">
                        <div class="issue_info">
                            <div class="priority_show" style="background-color: ${priority_color(el)};">
                                <label>${get_priority(el)}</label>
                            </div>
                            <div class="category_show">
                                <label>${el.Category}</label>
                            </div>
                        </div>
                        <div class="issue_content">
                            <div class="issue_name">
                                 [${el.issueStatus}] ${el.issueName}
                            </div>
                            <div class="issue_time">
                                Update time: ${el.updateTime.split("T")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Due: ${el.dueDate.split("T")[0]}
                            </div>
                        </div>
                    </div>
                    <div class="details" style="display: none;">
                        <div class="issue_details">
                            <strong>Due Date: </strong> ${el.dueDate.split("T")[0]}
                            <br />
                            <strong>Assign To: </strong> ${el.Assigned}
                            <br />
                            <div class="description1"><strong>Description:</strong><br>${el.Description}</div>
                            <strong>Images:</strong> 
                            <br />
                            <div class="uploadImages">
                                <div id="imageShow">`; 
            el.Image.forEach((image, index) => {
                html += `<img src = "${image}" style = "width: 150px; height: 150px; object-fit: cover; cursor: pointer; margin-right: 1vh; margin-bottom: 1vh;" onclick = "showModal(this.src, event)">`;
            });
            html += `</div>
                        <div id="modal" class="modal">
                            <span class="close">&times;</span>
                            <img class="modal-content" id="modalImage">
                        </div>
                    </div>
                </div>`;
        }
        else {
            html += `<div class="item">
                    <div class="issues" onclick="showDetails(this)">
                        <div class="issue_info">
                            <div class="priority_show" style="background-color: ${priority_color(el)};">
                                <label>${get_priority(el)}</label>
                            </div>
                            <div class="category_show">
                                <label>${el.Category}</label>
                            </div>
                        </div>
                        <div class="issue_content">
                            <div class="issue_name">
                                 [${el.issueStatus}] ${el.issueName}
                            </div>
                            <div class="issue_time">
                                Update time: ${el.updateTime.split("T")[0]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Due: ${el.dueDate.split("T")[0]}
                            </div>
                        </div>
                    </div>
                    <div class="details" style="display: none;">
                        <div class="issue_details">
                            <strong>Due Date: </strong> ${el.dueDate.split("T")[0]}
                            <br />
                            <strong>Assign To: </strong> ${el.Assigned}
                            <br />
                            <div class="description1"><strong>Description:</strong><br>${el.Description}</div>
                            <strong>Images:</strong> 
                            <br />
                            <div class="uploadImages">
                                <div id="imageShow">
                                    No images.
                                </div>
                            </div>
                        </div>`
        }
        if (el.issueStatus === 'close') {
            html += `                        <div class="update_buttons">
                            <button class="edit_button" onclick="update_issue(this, '${JSON.stringify(el).replace(/"/g, '&quot;')}', event)" disabled>Edit</button>
                            <button class="status_button" onclick="update_issue(this, '${JSON.stringify(el).replace(/"/g, '&quot;')}', event)">${status}</button>
                        </div>
                    </div>
                </div>`
        }
        else {
            html += `                        <div class="update_buttons">
                            <button class="edit_button" onclick="update_issue(this, '${JSON.stringify(el).replace(/"/g, '&quot;')}', event)">Edit</button>
                            <button class="status_button" onclick="update_issue(this, '${JSON.stringify(el).replace(/"/g, '&quot;')}', event)">${status}</button>
                        </div>
                    </div>
                </div>`
        }
    })
    return html;
}
function showDetails(itemElement) {
    var detailsDiv = itemElement.nextElementSibling;
    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = '';
    }
    else {
        detailsDiv.style.display = 'none';
    }
}
function showModal(src, event) {
    var container = event.currentTarget.parentNode.parentNode;
    var modal = container.querySelector("#modal");
    var modalImg = container.querySelector("#modalImage");
    modal.style.display = "flex";
    modalImg.src = src;
    var span = container.querySelector(".close");
    span.onclick = function () {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function readIssueFromLocalStorage() {
    fileArray = [];
    document.getElementById('imagePreview').innerHTML = '';
    var issueName = localStorage.getItem('issueName');
    var assigned = localStorage.getItem('assigned');
    var category = localStorage.getItem('category');
    var priority = localStorage.getItem('priority');
    var dueDate = localStorage.getItem('dueDate');
    var description = localStorage.getItem('description');
    var image = localStorage.getItem('image');
    document.getElementById('issueName').value = issueName;
    document.getElementById('assignTo').value = assigned;
    document.getElementById('category').value = category;
    document.getElementById('description').innerText = description;
    document.getElementById('priority_choose').value = priority;
    document.getElementById('dueDate').value = dueDate.split('T')[0];
    if (image !== 'null') {
        var listImages = image.split(',');
        var orginalImages = [];
        processImages(listImages, orginalImages).then(() => {
            handleFiles(orginalImages, fileArray);
        });
    }
}

async function urlToFile(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split('/').pop();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
}

async function processImages(listImages, files) {
    for (const url of listImages) {
        const file = await urlToFile(url);
        files.push(file);
    }
}

$(function () {
    var currentIndex = 0;
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modalImage");
    var dragBox = document.getElementById("drag");
    var input = document.getElementById("image");

    dragBox.onclick = function () {
        input.click();
    };
    dragBox.ondragover = function (event) {
        event.preventDefault();
        dragBox.classList.add('drag-over');
    };

    dragBox.ondragleave = function (event) {
        dragBox.classList.remove('drag-over');
    };

    dragBox.ondrop = function (event) {
        event.preventDefault();
        dragBox.classList.remove('drag-over');
        var files = event.dataTransfer.files;
        handleFiles(files, fileArray);
    };

    input.addEventListener("change", function (event) {
        var files = event.target.files;
        handleFiles(files, fileArray);
    });

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };
    handleFiles = async function (files, fileList) {
        const imageContainer = document.getElementById("imagePreview");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fileList.push(file);

            const imgSrc = await readFileAsDataURL(file);

            var previewContainer = document.createElement('div');
            previewContainer.classList.add('preview-container');

            var imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.style.width = "150px";
            imgElement.style.height = "150px";
            imgElement.style.objectFit = "cover";

            imgElement.addEventListener('click', function () {
                currentIndex = fileList.indexOf(file);
                modal.style.display = "flex";
                modalImg.src = imgSrc;
            });

            (function (previewContainer, file) {
                var deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.innerHTML = 'X';
                deleteBtn.addEventListener('click', function () {
                    const index = fileList.indexOf(file);
                    if (index > -1) {
                        fileList.splice(index, 1);
                    }
                    imageContainer.removeChild(previewContainer);
                });
                previewContainer.appendChild(imgElement);
                previewContainer.appendChild(deleteBtn);
                imageContainer.appendChild(previewContainer);
            })(previewContainer, file);
        }
    }
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }
});


window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function submit() {
    var issueName = document.getElementById("issueName").value;
    var dueDate = document.getElementById("dueDate").value;
    var assigned = document.getElementById("assignTo").value;
    var category = document.getElementById("category").options[document.getElementById("category").selectedIndex].value;
    var priority = document.getElementById("priority_choose").options[document.getElementById("priority_choose").selectedIndex].value;
    var description = document.getElementById("description").innerText;  
    var date = new Date(dueDate);
    var today = new Date();
    if (!issueName || !dueDate || !assigned || !category || !priority || !description) {
        alert("All fields must be filled out.");
        return;
    }
    var issueStatus = "open";
    const formData = new FormData();
    if (fileArray.length > 0) {
        for (var i = 0; i < fileArray.length; i++) {
            formData.append("image", fileArray[i]);
        }
    }
    else {
        formData.append("image", null);
    }
    var issue = {
        "issueName": issueName,
        "dueDate": date,
        "assigned": assigned,
        "category": category,
        "priority": priority,
        "description": description,
        "issueStatus": issueStatus,
        "updateTime": today,
    };
    var issue = JSON.stringify(issue);
    var addIssuePackage = {
        key: "000",
        profileGuid: "admin",
        itemGuid: "default",
        endpoint: "0.0.0.0",
        target: "Profile",
        package: issue,
        filters:
            []
    }
    var addIssuePackage = JSON.stringify(addIssuePackage);
    formData.append("package", addIssuePackage);
    // send AJAX require
    var xhr = new XMLHttpRequest();
    xhr.open("POST", API_ROOT_IssueTracker + 'AddIssueTracker.aspx', true);
    var submitButton = document.getElementById('submit');
    submitButton.disabled = true;
    xhr.onload = function () {
        if (xhr.status === 200) {
            submitButton.disabled = false;
            redirectToHome();
            location.reload();
        } else {
            alert("Error submitting issue: " + xhr.responseText);
        }
    };
    xhr.send(formData);
}

function update() {
    var issueName = document.getElementById("issueName").value;
    var dueDate = document.getElementById("dueDate").value;
    var assigned = document.getElementById("assignTo").value;
    var category = document.getElementById("category").options[document.getElementById("category").selectedIndex].value;
    var priority = document.getElementById("priority_choose").options[document.getElementById("priority_choose").selectedIndex].value;
    var description = document.getElementById("description").innerText;
    var guid = localStorage.getItem('guid');
    var currentTime = new Date();

    if (!issueName || !dueDate || !assigned || !category || !priority || !description) {
        alert("All fields must be filled out.");
        return;
    }

    var issueStatus = localStorage.getItem('issueStatus');
    var date = new Date(dueDate);

    const formData = new FormData();

    if (fileArray.length > 0) {
        for (var i = 0; i < fileArray.length; i++) {
            formData.append("image", fileArray[i]);
        }
    }
    else {
        formData.append("image", null);
    }
    var issue = {
        "guid": guid,
        "issueName": issueName,
        "dueDate": date,
        "assigned": assigned,
        "category": category,
        "priority": priority,
        "description": description,
        "issueStatus": issueStatus,
        "updateTime": currentTime,
    };
    var issue = JSON.stringify(issue);
    var updateIssuePackage = {
        key: "000",
        profileGuid: "admin",
        itemGuid: "default",
        endpoint: "0.0.0.0",
        target: "Profile",
        package: issue,
        filters:
            []
    }
    var updateIssuePackage = JSON.stringify(updateIssuePackage);
    formData.append("package", updateIssuePackage);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", API_ROOT_IssueTracker + 'UpdateIssueTracker.aspx', true);
    var updateButton = document.getElementById('update');
    updateButton.disabled = true;
    xhr.onload = function () {
        if (xhr.status === 200) {
            updateButton.disabled = false;
            redirectToHome();
            location.reload();
        } else {
            alert("Error submitting issue: " + xhr.responseText);
        }
    };
    xhr.send(formData);
}
function update_issue(button, el, event) {
    event.stopPropagation();
    var element = JSON.parse(el);
    localStorage.setItem('guid', element.guid);
    localStorage.setItem('issueName', element.issueName);
    localStorage.setItem('assigned', element.Assigned);
    localStorage.setItem('category', element.Category);
    localStorage.setItem('priority', element.Priority);
    localStorage.setItem('description', element.Description);
    localStorage.setItem('dueDate', element.dueDate);
    localStorage.setItem('issueStatus', element.issueStatus);
    localStorage.setItem('image', element.Image);
    var currentTime = new Date();
    var guid = localStorage.getItem('guid');
    if (button.textContent == 'Close') {
        button.textContent = 'Open';
        var container = event.currentTarget.parentNode;
        var editButton = container.querySelector(".edit_button");
        editButton.disabled = true;
        const formData = new FormData();
        var issue = {
            "guid": guid,
            "issueName": element.issueName,
            "dueDate": element.dueDate,
            "assigned": element.Assigned,
            "category": element.Category,
            "priority": element.Priority,
            "description": element.Description,
            "issueStatus": "close",
            "updateTime": currentTime,
        };
        var issue = JSON.stringify(issue);
        var updateIssuePackage = {
            key: "000",
            profileGuid: "admin",
            itemGuid: "default",
            endpoint: "0.0.0.0",
            target: "Profile",
            package: issue,
            filters:
                []
        }
        var updateIssuePackage = JSON.stringify(updateIssuePackage);
        formData.append("package", updateIssuePackage);
        formData.append("changeStatus", '1');
        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_ROOT_IssueTracker + 'UpdateIssueTracker.aspx', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                location.reload();
            } else {
                alert("Error submitting issue: " + xhr.responseText);
            }
        };
        xhr.send(formData);
    }
    else if (button.textContent == 'Open') {
        button.textContent = 'Close';
        var container = event.currentTarget.parentNode;
        var editButton = container.querySelector(".edit_button");
        editButton.disabled = false;
        const formData = new FormData();
        var issue = {
            "guid": guid,
            "issueName": element.issueName,
            "dueDate": element.dueDate,
            "assigned": element.Assigned,
            "category": element.Category,
            "priority": element.Priority,
            "description": element.Description,
            "issueStatus": "open",
            "updateTime": currentTime,
        };
        var issue = JSON.stringify(issue);
        var updateIssuePackage = {
            key: "000",
            profileGuid: "admin",
            itemGuid: "default",
            endpoint: "0.0.0.0",
            target: "Profile",
            package: issue,
            filters:
                []
        }
        var updateIssuePackage = JSON.stringify(updateIssuePackage);
        formData.append("package", updateIssuePackage);
        formData.append("changeStatus", '1');
        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_ROOT_IssueTracker + 'UpdateIssueTracker.aspx', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                location.reload();
            } else {
                alert("Error submitting issue: " + xhr.responseText);
            }
        };
        xhr.send(formData);
    }
    else {
        document.querySelector('.container').style.display = "none";
        document.querySelector('.dropzone').style.display = "";
        document.getElementById("submit").style.display = "none";
        document.getElementById("update").style.display = "";
        readIssueFromLocalStorage();
    }
}
function pasteListener(event) {
    event.preventDefault();
    var files = [];
    $.each(event.clipboardData.items, function (index, item) {
        if (item.kind == "file" && item.type.match("image/*")) {
            var file = item.getAsFile();
            files.push(file);
            handleFiles(files, fileArray);
        } else if (item.kind == "string" && item.type.match("text/plain")) {
            item.getAsString(function (str) {
                var selection = window.getSelection();
                var range = selection.getRangeAt(0);
                range.insertNode(new Text(str));
                selection.anchorOffset = selection.focusOffset;
                selection.collapseToEnd();
            });
        }
    });
    return false;
}

window.onload = function () {
    document.getElementById('create').addEventListener('click', redirectToCreate);
    document.getElementById('cancel').addEventListener('click', redirectToHome);
    document.getElementById('priority').addEventListener('change', filterData);
    document.getElementById('status').addEventListener('change', filterData);
    document.getElementById('clear').addEventListener('click', clear);
    document.getElementById('searchContent').addEventListener('input', filterData);
    document.getElementById('time').addEventListener('change', filterData);
    document.getElementById('timeSort').addEventListener('change', filterData);
    document.getElementById('submit').addEventListener('click', submit);
    document.getElementById('update').addEventListener('click', update);
};

var info;
var currentStatus = 'open';
var getIssuesPackage = {
    key: "000",
    profileGuid: "admin",
    itemGuid: "default",
    endpoint: "0.0.0.0",
    target: "Profile",
    package: "{}",
    filters:
        []
}
var getIssuesPackage = JSON.stringify(getIssuesPackage);
$(document).ready(function () {
    $.ajax({
        url: API_ROOT_IssueTracker + 'LoadIssueTracker.aspx',
        type: 'GET',
        data: {
            package: getIssuesPackage,
        },
        success: function (data) {
            info = JSON.parse(data).package;
            if (info.length === 0) {
                document.getElementById("infoContent").innerHTML = "<p>No issues found!</p>";
            }
            else {
                filterData();
            }
        },
        error: function (xhr, status, error) {
            console.error('Request failed: ' + status + ', ' + error);
        }
    });
});
