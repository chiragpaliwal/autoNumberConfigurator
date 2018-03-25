let Anc = window.Anc || {};

Anc.Initialize = function() {
    // Load solutions

    let solutionsUri = "/solutions?$select=friendlyname,version&$expand=publisherid($select=customizationprefix)&$filter=ismanaged eq false and  solutiontype eq 0";
    Sdk.request("GET", clientUrl + webAPIPath + solutionsUri, null, true)
    .then(function (req) {
    debugger;
    // Get the <datalist> and <input> elements.
    let dataList = document.getElementById('json-datalist');
    let input = document.getElementById('ajax');
    input.placeholder = 'Select a Solution';
    let jsonOptions = JSON.parse(req.response);
    if(jsonOptions != undefined || jsonOptions != null) {
        jsonOptions.value.forEach((item) => {
            // Create a new <option> element.
            let option = document.createElement('option');
            option.id = item.solutionid;
            option.value = item.friendlyname + " (" + item.version + ")";
            // Add the <option> element to the <datalist>.
            dataList.appendChild(option);
        });
    }
    console.log("query done");
    });

    // Load Existing Auto Numbers
}

Anc.LoadEntities = function () {
    let entitiesUrl = "/EntityDefinitions?$select=DisplayName,LogicalName&$filter=CanCreateAttributes/Value eq true"
    Sdk.request("GET", clientUrl + webAPIPath + entitiesUrl, null, true)
    .then(function () {
        
    })
}
window.onload = Anc.Initialize();

let enableNext = () => {
    let disabledInput = document.getElementById('disabledTextInput');
    disabledInput.removeAttribute('disabled');
}