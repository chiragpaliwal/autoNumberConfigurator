let Anc = window.Anc || {};

MicroModal.init({
    closeTrigger: 'data-custom-close'
});

Anc.Initialize = function() {
    // Load solutions
    MicroModal.show('modal-1');
    let solutionsUri = "/solutions?$select=friendlyname,version&$expand=publisherid($select=customizationprefix)&$filter=ismanaged eq false and  solutiontype eq 0";
    Sdk.request("GET", clientUrl + webAPIPath + solutionsUri, null, true)
    .then(function (req) {
        debugger;
        let select = document.getElementById('solutions-select');
        let jsonForSolutions = JSON.parse(req.response);
        if(jsonForSolutions != undefined || jsonForSolutions != null){
            jsonForSolutions.value.forEach((item) => {
                let option = document.createElement('option');
                option.id = item.solutionid;
                option.value = item.friendlyname + "(" + item.version + ")";
                option.innerHTML = item.friendlyname + "(" + item.version + ")";
                // Add the <option> element to the <select>.
                select.appendChild(option);
            });
        }else{
            $('solutions-icon').toggleClass('fa-sync-alt fa-times').removeClass('fa-spin');
        }
        
        $('#solutions-icon').toggleClass('fa-sync-alt fa-check').removeClass('fa-spin');
        MicroModal.close('modal-1');
        
        console.log("query done");
    });
    
    // Load Existing Auto Numbers
}

Anc.LoadEntities = function () {
    let modalContent = document.getElementById('modal-1-content');
    modalContent.innerHTML = 'Loading Entities...<i id="entities-icon" class="fas fa-sync-alt loading fa-spin"></i>';
    MicroModal.show('modal-1');

    let entitiesUrl = "/EntityDefinitions?$select=DisplayName,LogicalName&$filter=CanCreateAttributes/Value eq true";
    Sdk.request("GET", clientUrl + webAPIPath + entitiesUrl, null, true)
    .then(function (req) {
        // Get the <datalist> and <input> elements.
        let dataList = document.getElementById('json-datalist');
        let input = document.getElementById('entity-input');
        input.placeholder = 'Select an Entity';
        let jsonForEntity = JSON.parse(req.response);
        if(jsonForEntity != undefined || jsonForEntity != null) {
            jsonForEntity.value.forEach((item) => {
                // Create a new <option> element.
                let option = document.createElement('option');
                option.id = item.MetadataId;
                var displayname = item.DisplayName.UserLocalizedLabel === null ? null : item.DisplayName.UserLocalizedLabel.Label; 
                if(displayname === null) {
                    option.value = item.LogicalName;    
                } else option.value = displayname + " (" + item.LogicalName + ")";
                // Add the <option> element to the <datalist>.
                dataList.appendChild(option);
            });
        }else{
            $('entities-icon').toggleClass('fa-sync-alt fa-times').removeClass('fa-spin');
        }
        $('#entities-icon').toggleClass('fa-sync-alt fa-check').removeClass('fa-spin');
        MicroModal.close('modal-1');
    });
}

Anc.LoadExistingAutoNumbers = function () {
    let autoNumbersUrl = "/api/data/v9.0/EntityDefinitions(LogicalName='account')/Attributes?$select=DisplayName,AutoNumberFormat,LogicalName&$filter=AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'String' and (AutoNumberFormat ne '' and AutoNumberFormat ne null)";
    Sdk.request("GET", clientUrl + webAPIPath + autoNumbersUrl, null, true)
    .then(function (req) {
        let dataList = document.getElementById('json-datalist');
        let input = document.getElementById('entity-input');
        input.placeholder = 'Select an Entity';
        let jsonForEntity = JSON.parse(req.response);
        if(jsonForEntity != undefined || jsonForEntity != null) {
            jsonForEntity.value.forEach((item) => {
                // Create a new <option> element.
                let option = document.createElement('option');
                option.id = item.MetadataId;
                var displayname = item.DisplayName.UserLocalizedLabel === null ? null : item.DisplayName.UserLocalizedLabel.Label; 
                if(displayname === null) {
                    option.value = item.LogicalName;    
                } else option.value = displayname + " (" + item.LogicalName + ")";
                // Add the <option> element to the <datalist>.
                dataList.appendChild(option);
            });
        }else{
            $('entities-icon').toggleClass('fa-sync-alt fa-times').removeClass('fa-spin');
        }
        $('#entities-icon').toggleClass('fa-sync-alt fa-check').removeClass('fa-spin');
        MicroModal.close('modal-1');
    });
}

window.onload = Anc.Initialize();

let checkEnable = () => {
    let disabledInput = document.getElementById('entity-input');
    if(disabledInput.value !== "default"){
        disabledInput.removeAttribute('disabled');
        Anc.LoadEntities();
    }
}

let enableNext = () => {
    let disabledInput = document.getElementById('disabledTextInput');
    disabledInput.removeAttribute('disabled');
}

let populateProperties = () => {
    console.log("Populated Properties!");
}

let populateExistingAN = () => {
    
}

// let tableRow = document.getElementsByTagName("tr");

document.getElementsByTagName("tr")[1].addEventListener("click", function(){
    console.log("Clicked");
});