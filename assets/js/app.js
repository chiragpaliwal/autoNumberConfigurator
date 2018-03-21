var anc = window.anc || {};

anc.Initialize = function() {
    // Load solutions
    var solutionsUri = "/solutions?$select=friendlyname,version&$expand=publisherid($select=customizationprefix)&$filter=ismanaged eq false and  solutiontype eq 0"
    Sdk.request("GET", clientUrl + webAPIPath + solutionsUri, null, true)
    .then(function (req) {
        console.log("query done");
    })
}