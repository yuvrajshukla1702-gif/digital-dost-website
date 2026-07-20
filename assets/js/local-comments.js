document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("commentform");
  var list = document.querySelector(".js-comment-list");
  var emptyMsg = document.querySelector(".js-no-comments");
  var commentsArea = document.querySelector(".comments-area");

  if (!form || !list || !emptyMsg || !commentsArea) {
    return;
  }

  var storageKey = "digitaldost-comments:" + window.location.pathname;
  var allComments = [];

  if (localStorage.getItem(storageKey)) {
    allComments = JSON.parse(localStorage.getItem(storageKey));
  }

  var countHeading = document.createElement("h3");
  countHeading.className = "comments-count js-comment-count";
  commentsArea.insertBefore(countHeading, list);

  showComments();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var userName = document.getElementById("author").value.trim();
    var userEmail = document.getElementById("email").value.trim();
    var msg = document.getElementById("comment").value.trim();

    if (userName === "" || userEmail === "" || msg === "") {
      alert("Please fill in Name, Email, and Comment.");
      return;
    }

    allComments.unshift({
      author: userName,
      email: userEmail,
      comment: msg,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(storageKey, JSON.stringify(allComments));
    form.reset();
    showComments();
  });

  function showComments() {
    if (allComments.length === 0) {
      list.innerHTML = "";
      emptyMsg.style.display = "block";
      countHeading.textContent = "Comments";
      return;
    }

    emptyMsg.style.display = "none";
    countHeading.textContent = allComments.length + (allComments.length === 1 ? " Comment" : " Comments");

    var html = "";

    for (var i = 0; i < allComments.length; i++) {
      html += buildCommentHtml(allComments[i]);
    }

    list.innerHTML = html;
  }

  function buildCommentHtml(c) {
    var name = cleanText(c.author) || "Guest";
    var text = cleanText(c.comment).replace(/\n/g, "<br>");
    var initials = getInitials(name);
    var color = getAvatarColor(name);
    var dateLabel = formatRelativeTime(c.createdAt);

    var html = '<li class="comment">';
    html += '<article class="comment-body">';
    html += '<div class="comment-header-row">';
    html += '<div class="comment-avatar" style="background-color:' + color + '">' + initials + '</div>';
    html += '<div class="comment-meta">';
    html += '<div class="comment-author-line">';
    html += '<span class="comment-author-name">' + name + '</span>';
    html += '</div>';
    html += '<span class="comment-date">' + dateLabel + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="comment-content"><p>' + text + '</p></div>';
    html += '</article>';
    html += '</li>';

    return html;
  }

  function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  function getAvatarColor(name) {
    var colors = ["#794AFF", "#6638e8", "#5b6cf0", "#8b5cf6", "#6d28d9", "#7c3aed"];
    var total = 0;
    for (var i = 0; i < name.length; i++) {
      total += name.charCodeAt(i);
    }
    return colors[total % colors.length];
  }

  function formatRelativeTime(dateStr) {
    var date = new Date(dateStr);
    var now = new Date();
    var diffMs = now - date;
    var diffMins = Math.floor(diffMs / 60000);
    var diffHours = Math.floor(diffMs / 3600000);
    var diffDays = Math.floor(diffMs / 86400000);
    var diffWeeks = Math.floor(diffDays / 7);
    var diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return diffMins + (diffMins === 1 ? " minute ago" : " minutes ago");
    if (diffHours < 24) return diffHours + (diffHours === 1 ? " hour ago" : " hours ago");
    if (diffDays < 7) return diffDays + (diffDays === 1 ? " day ago" : " days ago");
    if (diffWeeks < 5) return diffWeeks + (diffWeeks === 1 ? " week ago" : " weeks ago");
    if (diffMonths < 12) return diffMonths + (diffMonths === 1 ? " month ago" : " months ago");
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function cleanText(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
});
