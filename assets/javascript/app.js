//Declare jQuery DOM variables for later use
var $divButtons = $("#divButtons");
var $divGallery = $("#divGallery");
var $txtCategory = $("#txtCategory");

//localStorage.clear("userGifs")

//Declare global variables
var defaultCategories = ["dilbert","loony toons","scooby doo","the simpsons"];
var userCategories = [];
var arrWorking = [];

//Check for locally stored Categories
if (localStorage.getItem("userGifs")){
  var userStoredVariables = localStorage.getItem("userGifs");
  userCategories = userStoredVariables.split(',');
}
//Attach listener to btnSaveCategory
$("#btnSaveCategory").on("click",function(){
 
  //Make sure the field isn't blank
  if ($txtCategory.val().length > 1) {
    
    let newCategory = $txtCategory.val().toLowerCase();

    //Lets make sure the category is actually new
    if (defaultCategories.indexOf(newCategory) == -1 && userCategories.indexOf(newCategory) == -1) {
      userCategories.push(newCategory);
      localStorage.setItem("userGifs", userCategories);
      createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)));
    }

  }
 
})

createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)));

//Create buttons for each item in default and user arrays
function createButtons(array){

  $divButtons.empty();
  
  for(var i =0;i<array.length;i++){
    let myValue = stringReplaceSpace(array[i]);
    let newButton = $("<button>");
    newButton.addClass("btn btn-info m-1 text-uppercase js_btnGif");
    newButton.val(myValue);
    newButton.text(array[i]);
    newButton.appendTo($divButtons);
  }
  $(".js_btnGif").on("click", function(){

    getGifs($(this).val());
  
  })

}
function getGifs(sGif) {

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + sGif + "&api_key=Pi6G0VZE4khvrzUzfcJsdCtObo9Z9tkq&limit=6&rating=pg";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response)

    let newRow = $("<div>");
    newRow.addClass("row");

    for (var i = 0; i < response.data.length; i++) {
      let newCol = $("<div>");
      newCol.addClass("col d-flex align-items-stretch col-md-2 col-sm-12");

      let newCard = $("<div>");
      newCard.addClass("card");
      newCard.attr("data-state", "still");
      let newHeader = $("<div>");
      newHeader.addClass("card-header text-bold bg-dark text-muted");
      newHeader.html("<strong>" + response.data[i].title.substring(0,10).toUpperCase() + "</strong>");
      newHeader.appendTo(newCard);
      newBody = $("<div>");
      newBody.addClass("card-body text-center p-1");
      newImage = $("<img>");
      newImage.attr("src", response.data[i].images.fixed_height_small_still.url);
      newImage.attr("data-still", response.data[i].images.fixed_height_small_still.url);
      newImage.attr("data-animate", response.data[i].images.fixed_height_small.url);
      newImage.appendTo(newBody);
      newBody.appendTo(newCard);
      let newFooter = $("<div>");
      newFooter.addClass("card-footer");
      let newP = $("<p>");
      newP.text("Rating: " + response.data[i].rating);
      newP.appendTo(newFooter);
      if( response.data[i].source != ""){
        newLink = $("<a>");
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

  }) 

}

//This function replaces spaces with + for use in the gif lookup
function stringReplaceSpace(myStr){

  myStr = myStr.trim();

  for(var i=0;i< myStr.length;i++){
    if(myStr.charAt(i) === " "){
    
      myStr = myStr.replace(myStr.charAt(i),"+");
    }    
  }
  return myStr;
}
