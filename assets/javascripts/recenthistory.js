/* Copyright 2011 Dustin Lambert - Licensed under: GNU Public License 2.1 or later */
/* https://github.com/lmbrt/Redmine-Recent-Issue-List/blob/master/redmine_recenthistory/assets/javascripts/recenthistory.js */
/* Modified by Kota Shiratsuka [Compatible with Redmine 6.x] */
/* https://github.com/INSANEWORKS/redmine_recenthistory */

const issueMatcher = /\/issues\/(\d+)/;
const maxIssues = 20;
const maxIssuesTitle = 35;

// Multi-language messages
const messages = {
  en: {
    recentIssues: "Recently Viewed Issues",
  },
  ja: {
    recentIssues: "最近見たチケット",
  },
  fr: {
    recentIssues: "Problèmes récemment consultés",
  },
  // Add more languages as needed
};

// Get the browser's language
const userLang = navigator.language || navigator.userLanguage; // e.g., 'en-US', 'ja'
const lang = userLang.split('-')[0];
const message = messages[lang] || messages['en']; // Default to English if unsupported

function trackRecentHistory() {
  const results = location.href.match(issueMatcher);
  if (!results || results.length < 2) return;

  const currentIssue = results[1];
  const issueTitle = $("#content h2:first").text().replace(/.*(#\d+)/, "$1");
  const issueSubject = $("#content div.subject h3").text();

  // Retrieve current history
  let issueArray = JSON.parse(localStorage.getItem("recentIssues")) || [];

  // Create a new history entry
  const newEntry = { ID: currentIssue, Str: `${issueTitle}: ${issueSubject}` };

  // Remove duplicate entries with the same ID
  issueArray = issueArray.filter(issue => issue.ID !== currentIssue);

  // Add the new history entry at the beginning
  issueArray.unshift(newEntry);

  // Truncate the array if it exceeds the maximum allowed entries
  if (issueArray.length > maxIssues) {
    issueArray = issueArray.slice(0, maxIssues);
  }

  // Save to localStorage
  localStorage.setItem("recentIssues", JSON.stringify(issueArray));
}

function showRecentHistory() {
  if (!$("#sidebar").length) return;

  const results = location.href.match(issueMatcher);
  const currentIssue = results ? results[1] : null; // Get the current ticket ID

  const issueArray = JSON.parse(localStorage.getItem("recentIssues")) || [];

  // Do not display anything if no history exists
  if (issueArray.length === 0) return;

  // Create the recent list in the sidebar
  const recentList = $("<div id='recentList'><h3>" + message.recentIssues + "</h3></div>");
  $("#sidebar-wrapper").prepend(recentList);

  let issuesShown = 0;

  issueArray.forEach(issue => {
    if (issue.ID === currentIssue) return; // Skip the current ticket

    const truncatedTitle = issue.Str.length > maxIssuesTitle
      ? `${issue.Str.substring(0, maxIssuesTitle)}...`
      : issue.Str;

    recentList.append(`<a href="/issues/${issue.ID}">${truncatedTitle}</a><br>`);
    issuesShown++;
  });

  // Hide the recent list if no issues are displayed
  if (issuesShown === 0) {
    $("#recentList").remove();
  }
}

$(document).ready(() => {
  trackRecentHistory();
  showRecentHistory();
});
