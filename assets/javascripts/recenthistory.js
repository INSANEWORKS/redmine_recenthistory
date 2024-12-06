/* Copyright 2011 Dustin Lambert - Licensed under: GNU Public License 2.1 or later */
/* https://github.com/lmbrt/Redmine-Recent-Issue-List/blob/master/redmine_recenthistory/assets/javascripts/recenthistory.js */
/* Modified by Kota Shiratsuka [Compatible with Redmine 6.x] */
/* https://github.com/INSANEWORKS/redmine_recenthistory */

const issueMatcher = /\/issues\/(\d+)/;
const maxIssues = 20;
const maxIssuesTitle = 35;

function trackRecentHistory() {
  const results = location.href.match(issueMatcher);
  if (!results || results.length < 2) return;

  const currentIssue = results[1];
  const issueTitle = $("#content h2:first").text().replace(/.*(#\d+)/, "$1");
  const issueSubject = $("#content div.subject h3").text();

  // 現在の履歴を取得
  let issueArray = JSON.parse(localStorage.getItem("recentIssues")) || [];

  // 新しい履歴項目を作成
  const newEntry = { ID: currentIssue, Str: `${issueTitle}: ${issueSubject}` };

  // 配列から同じIDの項目を削除（古いエントリを削除）
  issueArray = issueArray.filter(issue => issue.ID !== currentIssue);

  // 新しい履歴を先頭に追加
  issueArray.unshift(newEntry);

  // 最大件数を超えたら切り捨て
  if (issueArray.length > maxIssues) {
    issueArray = issueArray.slice(0, maxIssues);
  }

  // ローカルストレージに保存
  localStorage.setItem("recentIssues", JSON.stringify(issueArray));
}

function showRecentHistory() {
  if (!$("#sidebar").length) return;

  const results = location.href.match(issueMatcher);
  const currentIssue = results ? results[1] : null; // 現在のチケットIDを取得

  const issueArray = JSON.parse(localStorage.getItem("recentIssues")) || [];

  // 履歴が存在しない場合は非表示
  if (issueArray.length === 0) {
    $("#recentList").hide();
    return;
  }

  // サイドバーに履歴を表示
  const recentList = $("<div id='recentList'><h3>最近見たチケット</h3></div>");
  $("#sidebar-wrapper").prepend(recentList);

  let issuesShown = 0;

  issueArray.forEach(issue => {
    if (issue.ID === currentIssue) return; // 現在のチケットを除外

    const truncatedTitle = issue.Str.length > maxIssuesTitle
      ? `${issue.Str.substring(0, maxIssuesTitle)}...`
      : issue.Str;

    recentList.append(`<a href="/issues/${issue.ID}">${truncatedTitle}</a><br>`);
    issuesShown++;
  });

  // 履歴が非表示になる場合を処理
  if (issuesShown === 0) {
    $("#recentList").hide();
  }
}

$(document).ready(() => {
  trackRecentHistory();
  showRecentHistory();
});
