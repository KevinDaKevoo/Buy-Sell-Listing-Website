$(document).ready(function () {
  //hiding all div classes
  $("#reply-message-box").hide();
  $("#message-admin-box").hide();
  $(".filter-input").hide();
  //showing all hidden div classes
  $("#reply-message-button").click(function (event) {
    event.preventDefault();
    $("#reply-message-box").show();
  });

  $("#message-admin").click(function (event) {
    event.preventDefault();
    $("#message-admin-box").show();
  });
  $(".btn-filter").click(function (event) {
    event.preventDefault();
    $(".filter-input").show();
  });
});

