document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("commentform");
  var list = document.querySelector(".js-comment-list");
  var emptyMsg = document.querySelector(".js-no-comments");

  if (!form || !list || !emptyMsg) {
    return;
  }

  var key = "digitaldost-comments:" + window.location.pathname;
  var allComments = [];

  if (localStorage.getItem(key)) {
    allComments = JSON.parse(localStorage.getItem(key));
  }

  showComments();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var userName = document.getElementById("author").value.trim();
    var userEmail = document.getElementById("email").value.trim();
    var msg = document.getElementById("comment").value.trim();

    if (userName == "" || userEmail == "" || msg == "") {
      alert("Please fill in Name, Email, and Comment.");
      return;
    }

    allComments.unshift({
      author: userName,
      email: userEmail,
      comment: msg,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(key, JSON.stringify(allComments));
    form.reset();
    showComments();
  });

  function showComments() {
    if (allComments.length == 0) {
      list.innerHTML = "";
      emptyMsg.style.display = "block";
      return;
    }

    emptyMsg.style.display = "none";
    var html = "";

    for (var i = 0; i < allComments.length; i++) {
      var c = allComments[i];
      var date = new Date(c.createdAt).toLocaleString();
      var name = cleanText(c.author);
      if (name == "") {
        name = "Guest";
      }
      var text = cleanText(c.comment).replace(/\n/g, "<br>");

      html += '<li class="comment byuser comment-author-local bypostauthor even thread-even depth-1">';
      html += '<article class="comment-body">';
      html += '<footer class="comment-meta">';
      html += '<div class="comment-author vcard"><b class="fn">' + name + '</b></div>';
      html += '<div class="comment-metadata"><span class="comment-date">' + date + '</span></div>';
      html += '</footer>';
      html += '<div class="comment-content"><p>' + text + '</p></div>';
      html += '</article>';
      html += '</li>';
    }

    list.innerHTML = html;
  }

  function cleanText(str) {
    if (!str) {
      return "";
    }
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    return str;
  }
});
