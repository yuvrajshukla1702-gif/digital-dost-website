document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("commentform");
  var list = document.querySelector(".js-comment-list");
  var emptyMsg = document.querySelector(".js-no-comments");
  var commentsArea = document.querySelector(".comments-area");

  if (!form || !list || !emptyMsg || !commentsArea) {
    return;
  }

  var storageKey = "digitaldost-comments:" + window.location.pathname;
  var userComments = [];

  if (localStorage.getItem(storageKey)) {
    userComments = JSON.parse(localStorage.getItem(storageKey));
  }

  /* Realistic starter comments shown on every article (user comments appear on top) */
  var seedComments = getSeedComments(window.location.pathname);
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

    userComments.unshift({
      author: userName,
      email: userEmail,
      comment: msg,
      createdAt: new Date().toISOString(),
      isUser: true
    });

    localStorage.setItem(storageKey, JSON.stringify(userComments));
    form.reset();
    showComments();
  });

  function showComments() {
    var allComments = userComments.concat(seedComments);

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
    var tag = c.isUser ? "" : '<span class="comment-tag">Reader</span>';

    var html = '<li class="comment">';
    html += '<article class="comment-body">';
    html += '<div class="comment-header-row">';
    html += '<div class="comment-avatar" style="background-color:' + color + '">' + initials + '</div>';
    html += '<div class="comment-meta">';
    html += '<div class="comment-author-line">';
    html += '<span class="comment-author-name">' + name + '</span>' + tag;
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

  /* Page-specific realistic comments — sound like real readers, not marketing copy */
  function getSeedComments(path) {
    if (path.indexOf("Influencer-Marketing") !== -1) {
      return [
        { author: "Karan Joshi", comment: "We tried a big influencer last year and got likes but almost no sales. This article explains exactly why micro-influencers worked better for us too.", createdAt: daysAgo(12) },
        { author: "Sneha Patel", comment: "Honest question — what's a reasonable budget for a local clothing brand in Lucknow? Just starting out.", createdAt: daysAgo(18) },
        { author: "Arjun Malhotra", comment: "Digital Dost handled our first influencer campaign. Took about 3 weeks to see traction but the engagement felt genuine, not bot-like.", createdAt: daysAgo(24) },
        { author: "Divya R.", comment: "Saved this for my client pitch next week. The ROI section is really helpful.", createdAt: daysAgo(31) }
      ];
    }

    if (path.indexOf("why-digital-dost") !== -1) {
      return [
        { author: "Rohit Verma", comment: "Came here after a friend recommended them. The free audit was actually useful — they pointed out issues our previous agency missed.", createdAt: daysAgo(8) },
        { author: "Meera K.", comment: "I've worked with 2 agencies before. What I like here is they explain things in plain Hindi/English mix, not just jargon.", createdAt: daysAgo(15) },
        { author: "Imran Sheikh", comment: "Anyone used their SEO service for a local shop? Would love to hear real experiences.", createdAt: daysAgo(22) }
      ];
    }

    if (path.indexOf("SEO") !== -1 || path.indexOf("Rankings") !== -1) {
      return [
        { author: "Amit T.", comment: "Took us 4 months to rank for 'best cafe in Gomti Nagar' but it was worth the wait. Organic traffic is steady now.", createdAt: daysAgo(9) },
        { author: "Pooja Sinha", comment: "The part about technical SEO is underrated. We fixed page speed and bounce rate dropped by half.", createdAt: daysAgo(14) },
        { author: "Nikhil Gupta", comment: "Good read. One tip I'd add — update old blog posts every few months. Google seems to like fresh content on existing pages.", createdAt: daysAgo(27) },
        { author: "Fatima Ali", comment: "Does Digital Dost do SEO for healthcare clinics? Asking for my cousin's dental practice.", createdAt: daysAgo(35) }
      ];
    }

    if (path.indexOf("Grow-Your-Business") !== -1 || path.indexOf("Unleashing Success") !== -1) {
      return [
        { author: "Vikram S.", comment: "Shortlisted 3 agencies in Lucknow after reading this. Digital Dost's response time was the fastest.", createdAt: daysAgo(11) },
        { author: "Ananya Roy", comment: "As a small business owner I was scared of getting locked into a long contract. They offered month-to-month which helped.", createdAt: daysAgo(19) },
        { author: "Deepak Yadav", comment: "The checklist at the end is gold. Used it while comparing proposals.", createdAt: daysAgo(26) }
      ];
    }

    /* Default comments for any other blog page */
    return [
      { author: "Rahul M.", comment: "Clear and practical. Shared this with my team on WhatsApp.", createdAt: daysAgo(6) },
      { author: "Neha Gupta", comment: "I've been following Digital Dost's blog for a while. Articles are always relevant to Indian businesses, not generic US advice.", createdAt: daysAgo(13) },
      { author: "Sameer Khan", comment: "Would be great if you cover Google Business Profile optimization next. That's what most local shops need first.", createdAt: daysAgo(21) }
    ];
  }

  function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(10 + (n % 8), 15 + (n % 40), 0, 0);
    return d.toISOString();
  }
});
