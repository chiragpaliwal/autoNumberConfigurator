let Anc = window.Anc || {};

MicroModal.init({
    closeTrigger: 'data-custom-close'
});

// Globals
var table = null;
var logicalname = null;

Anc.Initialize = function() {
    // Load solutions
    MicroModal.show('modal-1');
    let solutionsUri = "/solutions?$select=friendlyname,version&$expand=publisherid($select=customizationprefix)&$filter=ismanaged eq false and  solutiontype eq 0";
    Sdk.request("GET", clientUrl + webAPIPath + solutionsUri, null, true)
    .then(function (req) {
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

window.onload = Anc.Initialize();

let enableNext = () => {
    let disabledInput = document.getElementById('disabledTextInput');
    disabledInput.removeAttribute('disabled');
}

let checkEnable = () => {
    let disabledInput = document.getElementById('entity-input');
    if(disabledInput.value !== "default"){
        disabledInput.removeAttribute('disabled');
        Anc.LoadEntities();
    }
}

Anc.LoadExistingAutoNumbers = function () {
    let entityInputVal = $('#entity-input').val();
    let regExp = /\(([^)]+)\)/;
    logicalname = regExp.exec(entityInputVal);

    let autoNumbersUrl = "/EntityDefinitions(LogicalName='" + logicalname[1] + "')/Attributes?$select=DisplayName,AutoNumberFormat,LogicalName,Description&$filter=AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'String' and (AutoNumberFormat ne '' and AutoNumberFormat ne null)";
    Sdk.request("GET", clientUrl + webAPIPath + autoNumbersUrl, null, true)
    .then(function (req) {
        let jsonForExistingAN = JSON.parse(req.response);
        if(jsonForExistingAN != undefined || jsonForExistingAN != null) {
            let existingANbody = document.getElementById("table-body");
            if (table != null) table.destroy();
            table = $('#existingANtable').DataTable({
                data : jsonForExistingAN.value,
                "bFilter": false,
                "paging": false,
                "ordering": false,
                select: true,
                "columnDefs": [
                    {
                        "targets": [3],
                        "visible": false
                    },
                    {
                        "targets": [4],
                        "visible": false
                    }
                ],
                columns: [
                    { data : "DisplayName.UserLocalizedLabel.Label"},
                    { data : "LogicalName" },
                    { data : "AutoNumberFormat"},
                    { data : "DisplayName"},
                    { data : "Description.UserLocalizedLabel.Label" }
                ]
            });
          

            table.on( 'select', function ( e, dt, type, indexes ) {
                if ( type === 'row' ) {
                    debugger;
                    var data = table.rows(indexes).data()[0];
                    let logicalname = document.getElementById('lnameANP');
                    let displayname = document.getElementById('dnameANP');
                    let description = document.getElementById('descANP');
                    let format = document.getElementById('nformatANP');

                    logicalname.value = data.LogicalName;
                    displayname.value = data.DisplayName.UserLocalizedLabel.Label;
                    description.value = data.Description.UserLocalizedLabel.Label;
                    format.value = data.AutoNumberFormat;
                }
            });  
            //Styling table
            //   document.getElementById('existingANtable_wrapper').classList.remove('form-inline');
            $('#existingANtable_wrapper').find('div').first().remove();
            $('#existingANtable_wrapper').find('div').first().css('width', '100%');
            document.getElementById('existingANtable').style.width = '100%';          
        }
    });
}

Anc.CreateAutoNumber = function() {
    var data = {
        "AttributeType": "String",
        "AttributeTypeName": {
         "Value": "StringType"
        },
        "Description": {
         "@odata.type": "Microsoft.Dynamics.CRM.Label",
         "LocalizedLabels": [
          {
           "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
           "Label": document.getElementById('descANP').value,
           "LanguageCode": 1033
          }
         ]
        },
        "DisplayName": {
         "@odata.type": "Microsoft.Dynamics.CRM.Label",
         "LocalizedLabels": [
          {
           "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
           "Label": document.getElementById('dnameANP').value,
           "LanguageCode": 1033
          }
         ]
        },
        "RequiredLevel": {
         "Value": "None",
         "CanBeChanged": true,
         "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings"
        },
        "SchemaName": document.getElementById('lnameANP').value,
        "AutoNumberFormat": document.getElementById('nformatANP').value,
        "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
        "FormatName": {
         "Value": "Text"
        },
        "MaxLength": 100
       };

    let autoNumberUrl = "/EntityDefinitions(LogicalName='"+ logicalname[1] +"')/Attributes";
    Sdk.request("POST", clientUrl + webAPIPath + autoNumberUrl, data, true)
    .then(function (req) {
        var res = req.response;
    });
}

$("#entity-input").change(function () {
    Anc.LoadExistingAutoNumbers();
});

// Select table to populate AN Properties
// $("#table-body tr").click(function() {
//     var selected = $(this).hasClass("highlight");
//     $("#table-body tr").removeClass("highlight");
//     if(!selected)
//             $(this).addClass("highlight");
// });

// var table = $('#existingANtable').DataTable();

// $('#existingANtable tbody').on( 'click', 'tr', function () {
    
//     if ( $(this).hasClass('highlight') ) {
//         $(this).removeClass('highlight');
//     }
//     else {
//         $('existingANtable tr.highlight').removeClass('highlight');
//         $(this).addClass('highlight');
//     }
// } );

// $('#button').click( function () {
//     $('#existingANtable tbody').row('.highlight').remove().draw( false );
// } );



let populateProperties = () => {
    console.log("Populated Properties!");
}

// document.getElementsByTagName("tr")[1].addEventListener("click", function(){
//     console.log("Clicked");
// });