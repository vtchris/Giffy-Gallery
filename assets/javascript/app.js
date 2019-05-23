//Declare jQuery DOM variables for later use
var $btnDelLocal = $("#btnDelLocal")
var $btnReset = $("#btnReset");
var $divButtons = $("#divButtons");
var $divGallery = $("#divGallery");
var $pageFooter = $("#pageFooter")
var $txtCategory = $("#txtCategory");

//Declare global variables
var arrWorking = [];
var defaultCategories = ["dilbert", "jonny quest", "looney toons", "recess", "scooby doo", "the simpsons", "south park", "spongebob"];
var userCategories = [];

//Check for locally stored Categories
if (localStorage.getItem("userGifs")) {
  var userStoredVariables = localStorage.getItem("userGifs");
  userCategories = userStoredVariables.split(',');
  $btnDelLocal.removeClass("invisible");
}
//Attatch listener to Delete User Added Categories button
$btnDelLocal.on("click", function () {
  localStorage.clear("userGifs")
  userCategories = [];
  $btnDelLocal.addClass("invisible")
  createButtons(defaultCategories.slice(0));
})
//Attach listener to btnReset
$("#btnReset").on("click", function () {
  $(".js_giffRow").remove();
  $btnReset.addClass("invisible");
  $pageFooter.addClass("fixed-bottom")
})
//Attach listener to btnSaveCategory
$("#btnSaveCategory").on("click", function () {

  //Make sure the field isn't blank
  if ($txtCategory.val().length > 1) {

    let newCategory = $txtCategory.val().toLowerCase();

    //Lets make sure the category is actually new
    if (defaultCategories.indexOf(newCategory) == -1 && userCategories.indexOf(newCategory) == -1) {
      userCategories.push(newCategory);
      localStorage.setItem("userGifs", userCategories);
      $btnDelLocal.removeClass("invisible");
      createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)));
    }

    $txtCategory.val("");

  }

})
//Create the buttons using both Default and Locally Stored User Categories
createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)));

//Create buttons for each item in default and user arrays
function createButtons(array) {

  //Rebuild from scratch every time function is called
  $divButtons.empty();

  //Create a new button for each item in the array 
  for (var i = 0; i < array.length; i++) {
    let myValue = stringReplaceSpace(array[i]);
    let newButton = $("<button>");
    newButton.addClass("btn btn-info m-1 text-uppercase js_btnGif");
    newButton.val(myValue);
    newButton.text(array[i]);
    newButton.appendTo($divButtons);
  }
  //Attach listener so when giff cards are created, the clear button is visible
  $(".js_btnGif").on("click", function () {

    getGifs($(this).val());
    $btnReset.removeClass("invisible")

  })

}
//Time for some AJAX and the API call!
function getGifs(sGif) {

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + sGif + "&api_key=Pi6G0VZE4khvrzUzfcJsdCtObo9Z9tkq&limit=6&rating=pg";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)


    if (sGif.search("/+")) {

      for (var i = 0; i < sGif.length; i++) {
        if (sGif.charAt(i) === "+") {
          sGif = sGif.replace("+", "");
        }
      }
    }

    //Create unique js class for row
    let newClass = "js_" + sGif

    //Remove Row with this class if it already exists
    $("." + newClass).remove();



    //Create a new row for each call
    let newRow = $("<div>");
    newRow.addClass("row js_giffRow " + newClass);

    for (var i = 0; i < response.data.length; i++) {
      let newCol = $("<div>");
      newCol.addClass("col col-md-2 col-sm-6 p-2 d-flex align-items-stretch");
      let newCard = $("<div>");
      newCard.addClass("card mb-3");
      newCard.attr("data-state", "still");
      let newHeader = $("<div>");
      newHeader.addClass("card-header text-bold text-center bg-dark text-muted pl-1 pr-1");
      if (response.data[i].title != "") {
        newHeader.html("<strong>" + response.data[i].title.substring(0, 11).toUpperCase() + "</strong>");
      } else {
        newHeader.html("<strong>UNTITLED</strong>");
      }
      newHeader.appendTo(newCard);
      newBody = $("<div>");
      newBody.addClass("card-body text-center p-1 bg-secondary");
      newImage = $("<img>");
      newImage.attr("src", response.data[i].images.fixed_width_still.url);
      newImage.attr("data-still", response.data[i].images.fixed_width_still.url);
      newImage.attr("data-animate", response.data[i].images.fixed_width.url);
      newImage.appendTo(newBody);
      newBody.appendTo(newCard);
      let newFooter = $("<div>");
      newFooter.addClass("card-footer bg-dark text-muted");
      let newP = $("<p>");
      newP.text("Rating: " + response.data[i].rating);
      newP.appendTo(newFooter);
      if (response.data[i].source != "") {
        newLink = $("<a>");
        newLink.addClass("text-muted");
        newLink.attr("href", response.data[i].source);
        newLink.attr("target", "_blank");
        newLink.text("View Source");
        newLink.appendTo(newFooter);
      }

      newFooter.appendTo(newCard)
      newCard.on("click", function () {

        //Find divs image
        let $img = $(this).find("img");

        //If div state is still, animate, otherwise set to still
        if ($(this).attr("data-state") === "still") {
          $img.attr("src", $img.attr("data-animate"));
          $(this).attr("data-state", "animate");
        } else {
          $img.attr("src", $img.attr("data-still"));
          $(this).attr("data-state", "still");
        }

      })

      newCard.appendTo(newCol);
      newCol.appendTo(newRow);

    }

    newRow.appendTo($divGallery);

    if ($(".row").length > 3) {
      $pageFooter.removeClass("fixed-bottom")
    } else
      $pageFooter.addClass("fixed-bottom")
  })

}
//This function replaces spaces with + for use in the gif lookup
function stringReplaceSpace(myStr) {

  myStr = myStr.trim();

  for (var i = 0; i < myStr.length; i++) {
    if (myStr.charAt(i) === " ") {

      myStr = myStr.replace(myStr.charAt(i), "+");
    }
  }
  return myStr;
}