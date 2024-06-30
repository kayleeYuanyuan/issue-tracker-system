using System;
using System.Web.UI;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Web.Hosting;
using System.Web;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public partial class UpdateIssueTracker : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        DateTime onStart = DateTime.Now;
        StringBuilder response = new StringBuilder();

        LogItem log = new LogItem("no key", false, "no id", this.GetType().Name, "no target");

        IResponse iResponse = new IResponse(false, StringBuffer.ApiPackageError);

        string issuePackage = Request.Form["package"];
        Package packageObject;

        string changeStatus = Request.Form["changeStatus"];

        if (!APIController.PackageVildation(issuePackage, out packageObject))
        {
            iResponse.SetResponse(false, StringBuffer.ApiPackageError, null);
            log.SetLog(false, StringBuffer.ApiPackageError, "default", issuePackage);
        }

        try
        {
            TrackIssue newIssueData = JsonConvert.DeserializeObject<TrackIssue>(packageObject.package);
            DatabaseController dbController = new DatabaseController();
            List<TrackIssue> currentIssues;
            string findResult = dbController.GetItemByGuid<TrackIssue>(newIssueData.guid, out currentIssues);

            if (findResult != "done" || currentIssues.Count == 0)
            {
                iResponse.SetResponse(false, StringBuffer.ApiError, null);
                log.SetLog(false, StringBuffer.ApiError, "Issue not found with guid: " + newIssueData.guid);
            }
            else
            {
                TrackIssue currentIssue = currentIssues[0];
                if (changeStatus == "1")
                {
                    UpdateIssueProperties(currentIssue, newIssueData);
                }
                else
                {
                    UpdateIssueImage(currentIssue, newIssueData);
                    UpdateIssueProperties(currentIssue, newIssueData);
                }
                

                string result = dbController.UpdateItem<TrackIssue>(currentIssue, "guid");
                if (result == "done")
                {
                    iResponse.SetResponse(true, StringBuffer.ApiComplete, new List<TrackIssue> { currentIssue }.ToArray());
                    log.SetLog(true, StringBuffer.ApiComplete, "Issue updated successfully.", issuePackage);
                }
                else
                {
                    iResponse.SetResponse(false, StringBuffer.ApiDatabaseError);
                    log.SetLog(false, StringBuffer.ApiDatabaseError, result, issuePackage);
                }
            }
        }
        catch (Exception ex)
        {
            iResponse.SetResponse(false, StringBuffer.ApiError);
            log.SetLog(false, StringBuffer.ApiError, ex.Message, issuePackage);
        }

        string dataPackage = iResponse.ToJson();
        iResponse.complete = Utility.GetMsDiffFromNow(onStart);
        log.packageSize = dataPackage.Length;
        log.complete = iResponse.complete;

        response.Append(iResponse.ToJson());
        Response.Write(response.ToString());
        Logger.Write(log);
        return;

    }

    private void UpdateIssueImage(TrackIssue currentIssue, TrackIssue newIssueData)
    {
        ClearCurrentImages(currentIssue);

        List<string> imagePaths = new List<string>(currentIssue.Image ?? new string[0]);

        if (Request.Files.Count > 0)
        {
            for (int i = 0; i < Request.Files.Count; i++)
            {
                HttpPostedFile file = Request.Files[i];
                if (file != null)
                {
                    string filePath = SaveFileToLocal(file, currentIssue.guid, i + 1);
                    imagePaths.Add(filePath);
                }
            }
            if (imagePaths.Count > 0)
            {
                currentIssue.Image = imagePaths.ToArray();
            }
        }
        else
        {
            currentIssue.Image = null;
        }
    }

    private void UpdateIssueProperties(TrackIssue currentIssue, TrackIssue newIssueData)
    {
        currentIssue.issueName = newIssueData.issueName;
        currentIssue.Category = newIssueData.Category;
        currentIssue.Description = newIssueData.Description;
        currentIssue.Priority = newIssueData.Priority;
        currentIssue.dueDate = newIssueData.dueDate;
        currentIssue.Assigned = newIssueData.Assigned;
        currentIssue.issueStatus = newIssueData.issueStatus;
        currentIssue.updateTime = newIssueData.updateTime;
    }



    private string SaveFileToLocal(HttpPostedFile file, string issueGuid, int imageIndex)
    {

        string virtualPath = String.Format("/resource/tracker/{0}_{1}.png", issueGuid, imageIndex);
        string savePath = HostingEnvironment.MapPath(virtualPath);
        file.SaveAs(savePath);
        return virtualPath;
    }

    private void ClearCurrentImages(TrackIssue currentIssue)
    {
        if (currentIssue.Image != null)
        {
            foreach (string imagePath in currentIssue.Image)
            {
                string physicalPath = HostingEnvironment.MapPath(imagePath);
                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                }
            }
            currentIssue.Image = new string[0];
        }
    }

}