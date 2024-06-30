using System;
using System.Collections.Generic;
using System.Text;
using System.Web.Hosting;
using System.Web;
using MetaBIM;
using Newtonsoft.Json;


public partial class AddIssueTracker : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        /* Record Start timestamp */
        DateTime OnSet = DateTime.Now;
        StringBuilder response = new StringBuilder();

        /* Request Data / Parameters */
        string package = Request.Form["package"];


        /* Setup response */
        IResponse iResponse = new IResponse(false, StringBuffer.ApiPackageError);
        LogItem log = new LogItem("no key", false, "no id", this.GetType().Name, "no target");

        Package packageObject;

        /* Check for api data format */
        if (!APIController.PackageVildation(package, out packageObject))
        {
            iResponse.SetResponse(false, StringBuffer.ApiPackageError, null);
            log.SetLog(false, StringBuffer.ApiPackageError, "default", package);
        }
        else
        {
            DatabaseController database = new DatabaseController();
            string result = "";

            try
            {
                TrackIssue trackIssue = JsonConvert.DeserializeObject<TrackIssue>(packageObject.package);
                if (string.IsNullOrEmpty(trackIssue.guid))
                {
                    trackIssue.guid = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
                }
                List<string> imagePaths = new List<string>();
                if (Request.Files.Count > 0)
                {
                    for (int i = 0; i < Request.Files.Count; i++)
                    {
                        HttpPostedFile file = Request.Files[i];
                        if (file != null)
                        {
                            string filePath = SaveFileToLocal(file, trackIssue.guid, i + 1);
                            imagePaths.Add(filePath);
                        }
                    }
                    trackIssue.Image = imagePaths.ToArray();
                    log.SetLog(true, StringBuffer.ApiComplete, "Image added successfully.");
                }
                result = database.AddItem<TrackIssue>(trackIssue);
                if (result == "done")
                {
                    iResponse.SetResponse(true, StringBuffer.ApiComplete, new List<TrackIssue> { trackIssue }.ToArray());
                    log.SetLog(true, StringBuffer.ApiComplete, result, package);
                }
                else
                {
                    iResponse.SetResponse(false, StringBuffer.ApiDatabaseError);
                    log.SetLog(false, StringBuffer.ApiDatabaseError, result, package);
                }
            }
            catch (Exception ex)
            {
                iResponse.SetResponse(false, StringBuffer.ApiError);
                log.SetLog(false, StringBuffer.ApiError, ex.Message, package);
            }
        }

        string dataPackage = iResponse.ToJson();
        iResponse.complete = Utility.GetMsDiffFromNow(OnSet);
        log.packageSize = dataPackage.Length;
        log.complete = iResponse.complete;
        response.Append(iResponse.ToJson());
        Response.Write(response.ToString());

        Logger.Write(log);
        return;

    }

    private string SaveFileToLocal(HttpPostedFile file, string issueGuid, int imageIndex)
    {

        string virtualPath = String.Format("/resource/tracker/{0}_{1}.png", issueGuid, imageIndex);
        string savePath = HostingEnvironment.MapPath(virtualPath);
        file.SaveAs(savePath);
        return virtualPath;
    }
}