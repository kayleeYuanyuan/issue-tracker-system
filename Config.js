var DebugMode = true;

window.onbeforeunload = function () {
    return "Leaving this page will unload all models, use the reflesh feature in the App instead.";
};

function Debug(messsage) {
    if (DebugMode === true) {
        console.log(messsage)
    }
}


/* Change the dev / production domain */
//var Domain = "platform.metabim.com.au";
var Domain = "platformdev.metabim.com.au";

var API_ROOT = "http://" + Domain + "/api/client/";
var API_ROOT_IssueTracker = "https://" + Domain + "/api/issuetracker/";
var APP_ROOT = "Build/platform.metabim.com.au.json";
var API_KEY = "j1RpMum08UKS1oT7r7E1bA";

var API_GetAllOperationsByDeviceID = "GetAllOperationsByDeviceID.aspx";
var API_OnRequestVehicleTracking = "OnRequestVehicleTracking.aspx";
var API_GetProjectByGuid = "GetProjectByGuid.aspx";
var API_GetUserByGuid = "GetUserByGuid.aspx";
var API_OnRequestConvertionBase64 = "OnRequestConvertionBase64.aspx";
var API_OnRequestVersionProcess = "OnUploadModelVersion.aspx";

// Unity Callback Object Target (the name of unity object in scene)
var JSOBJECT_CALLBACK = "JavascriptCallBack";

// Uploader
const fileTypes = ["ifc", "png"];
const MAX_IFC_SIZE = 52428800 * 10; // 52428800  = 50 MB