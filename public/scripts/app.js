// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

$(document).ready(function () {
  $("#reply-message-box").hide();
  $("#message-admin-box").hide();
  $(".filter-input").hide();

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
