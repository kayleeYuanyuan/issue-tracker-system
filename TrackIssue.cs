using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


public class TrackIssue : IModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string IssueID { get; set; }

    [Required]
    public string issueName { get; set; }

    [Required]
    public string Category { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public string Priority { get; set; }

    // Optional: BSON type for image storage could be string (URL or base64), or a binary type like BsonBinaryData if you store the image bytes in the database
    public string Image { get; set; }

    [Required]
    public DateTime dueDate { get; set; }

    [Required]
    public string Assigned { get; set; }

    [Required]
    public string issueStatus { get; set; }

    [Required]
    public DateTime updateTime { get; set; }
}