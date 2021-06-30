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

  $("#reply-message-button").click(function (event) {
    event.preventDefault();
    $("#reply-message-box").show();
  });
});
