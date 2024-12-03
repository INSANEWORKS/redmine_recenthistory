/* Copyright 2011 Dustin Lambert - Licensed under: GNU Public License 2.1 or later */
/* https://github.com/lmbrt/Redmine-Recent-Issue-List/blob/master/redmine_recenthistory/assets/javascripts/recenthistory.js */
/* Modified by Kota Shiratsuka [Compatible with Redmine 6.x] */
/* https://github.com/INSANEWORKS/redmine_recenthistory */

var issueMatcher = new RegExp(/.*\/issues\/(\d+).*/gi);
var currentIssue = null;
var maxIssues = 20;
var maxIssuesTitle = 35;

Object.size = function(obj) {
    var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function trackRecentHistory() {
  var results = issueMatcher.exec(location.href);
  if (results == undefined || results == null || results.length < 2 || results[1].length < 1) { return; }

  currentIssue = results[1];
  var issueTitle = $("#content h2:first").text().replace(/.*(#\d+)/, "$1");
  var issueSubject = $("#content div.subject h3").text();

  var issueArray = JSON.parse(localStorage.getItem("recentIssues")) || [];

  var issueHash = {};
  issueHash[currentIssue] = 1;
  var newArray = [];
  var cidx = 1;

  for (var i = 0; i < Object.size(issueArray); i++) {
    if (i <= maxIssues) {
      var entry = issueArray[i];
      if (issueHash[entry.ID] != 1) {
        issueHash[entry.ID] = 1;
        newArray[cidx] = entry;
        cidx++;
      }
    }
  }
  issueArray = newArray;

  var thisEntry = {
    ID: currentIssue,
    Str: issueTitle + ": " + issueSubject
  };
  issueArray[0] = thisEntry;

  localStorage.setItem("recentIssues", JSON.stringify(issueArray));
}

function showRecentHistory() {
  if ($("#sidebar").length > 0) {
    var issueArray = JSON.parse(localStorage.getItem("recentIssues")) || [];

    $("<div id='recentList'>").prependTo("#sidebar-wrapper");
    var recentList = $("<h3>最近見たチケット</h3>").appendTo("#recentList");

    var issuesShown = 0;
    for (var i = 0; i < Object.size(issueArray); i++) {
      if (issueArray[i]["ID"] != currentIssue) {
        issuesShown++;
        var disp = issueArray[i]["Str"];
        if (disp.length > maxIssuesTitle) { disp = disp.substring(0, maxIssuesTitle) + "..." }
        var a = "<a href=/issues/" + issueArray[i]["ID"] + ">" + disp + "</a></br>";
        $("#recentList").append(a);
      }
    }

    if (issuesShown < 1) {
      $("#recentList").hide();
    }
  }
}

$(document).ready(function() {
  trackRecentHistory();
  showRecentHistory();
});
