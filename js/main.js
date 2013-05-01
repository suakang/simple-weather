$(document).ready(function($) {
  $("#search").on("click", function(e) {
    var $zip = $("#zip"),
      value = $zip.val();

    e.preventDefault();
    if (value) {
      $.ajax({
        url: "http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/" + $zip.val() + ".json",
        dataType: "jsonp",
        success: function(data) {
          var mark = data.current_observation,
            location = mark.display_location,
            image = mark.image,
            $row = $("<tr></tr>"),
            $img = $("<ul></ul>"),
            $output = $("#output");

          $(".alert").fadeOut("slow");

          $img.append($("<li />", {
            html: "<img src='" + mark.icon_url + "' /></li>"
          }));

          $row.append($("<td />", {
            html: "<img src='" + mark.icon_url + "' /></td>"
          }));
          $row.append($("<td />", {text: location.city}, "<hr>"));
          $row.append($("<td />", {text: location.state_name}, "<hr>"));
          $row.append($("<td />", {text: location.zip}, "<hr>"));
          $row.append($("<td />", {text: mark.temp_f + "°F"}, "<hr>"));
          $row.append($("<td />", {
            html: '<a href="#"><i class="icon-trash icon-large"></i></a>'
          })).on("click", function(e) {
            e.preventDefault();
            $(this).closest("tr").remove();
            if (!$output.find("tbody tr").length) {
              $output.fadeOut("slow");
            }
          });

          $output.find("tbody").append($row);
          $output.fadeIn("show");
          $("#zip").val("");
        }
      });
    } else {
      $(".alert").text("Please enter zip code").fadeIn("slow");
    }
  });
});
