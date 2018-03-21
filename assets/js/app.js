var anc = window.anc || {};

anc.Initialize = function() {
    // Load solutions
    var solutionsUri = "/solutions?$select=friendlyname,version&$expand=publisherid($select=customizationprefix)&$filter=ismanaged eq false and  solutiontype eq 0"
    Sdk.request("GET", clientUrl + webAPIPath + solutionsUri, null, true)
    .then(function (req) {
        console.log("query done");
    })
}

// json to populate solutions datalist
let id = 0;
// Get the <datalist> and <input> elements.
let dataList = document.getElementById('json-datalist');
let input = document.getElementById('ajax');

let jsonOptions = [
    {'id': id, 'data': 'Lemon'},
    {'id': ++id, 'data': 'Apple'},
    {'id': ++id, 'data': 'Watermelon'},
    {'id': ++id, 'data': 'Orange'},
    {'id': ++id, 'data': 'Strawberry'}
]

jsonOptions.forEach((item) => {
    // Create a new <option> element.
    let option = document.createElement('option');
    option.value = item.data;

    // Add the <option> element to the <datalist>.
    dataList.appendChild(option);

});

// Update the placeholder text.
input.placeholder = 'Select a Solution';


let enableNext = () => {
    let disabledInput = document.getElementById('disabledTextInput');
    disabledInput.removeAttribute('disabled');
}