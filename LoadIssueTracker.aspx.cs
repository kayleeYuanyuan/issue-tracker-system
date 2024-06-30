using System;
using System.Collections.Generic;
using System.Text;
using MetaBIM;
using Newtonsoft.Json;

public partial class LoadIssueTracker : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Record Start timestamp
        DateTime onStart = DateTime.Now;
        StringBuilder response = new StringBuilder();


        IResponse iResponse = new IResponse(false, StringBuffer.AuthenticationFail);
        LogItem log = new LogItem("", false, "", this.GetType().Name, Config.Domain);


        string package = Request["package"];

        DatabaseController databaseController = new DatabaseController();
        List<TrackIssue> allIssues;


        Package packageObject;

        if (!APIController.PackageVildation(package, out packageObject))
        {
            iResponse.SetResponse(false, StringBuffer.ApiPackageError, null);
            log.SetLog(false, StringBuffer.ApiPackageError, "default", package);
        }


        try
        {
            string result = databaseController.GetItems<TrackIssue>(packageObject, out allIssues);

            if (result == "done")
            {
                if (allIssues != null && allIssues.Count > 0)
                {

                    iResponse.SetResponse(true, StringBuffer.ApiComplete + " " + allIssues.Count, allIssues.ToArray());
                    log.SetLog(true, StringBuffer.ApiComplete, "Issues successfully retrieved. Count: " + allIssues.Count);
                }
                else
                {
                    iResponse.SetResponse(false, "No issues found.");
                    log.SetLog(true, StringBuffer.ApiComplete, "No issues found.");
                }
            }
            else
            {
                iResponse.SetResponse(false, "Error retrieving issues: " + result);
                log.SetLog(false, StringBuffer.ApiError, "Error retrieving issues: " + result);
            }

        }
        catch (Exception ex)
        {
            iResponse.SetResponse(false, StringBuffer.ApiError);
            log.SetLog(false, StringBuffer.ApiError, "Exception caught: " + ex.Message);

        }

        response.Append(iResponse.ToJson());
        Response.Write(response.ToString());


        string dataPackage = iResponse.ToJson();
        iResponse.complete = Utility.GetMsDiffFromNow(onStart);
        log.packageSize = dataPackage.Length;
        log.complete = iResponse.complete;

        Logger.Write(log);
        return;
    }
}