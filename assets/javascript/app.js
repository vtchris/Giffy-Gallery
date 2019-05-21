//Declare jQuery DOM variables for later use
var $divButtons = $("#divButtons")
var $divGallery = $("#divGallery")

//Declare global variables
var defaultCategories = ["dilbert","loony toons","scooby doo","the simpsons"]
var userCategories = []
var arrWorking = []

//Check for locally stored Categories
if (localStorage.getItem("userGifs")){
  var userStoredVariables = localStorage.getItem("userGifs")
  userCategories = userStoredVariables.split(',');
}
//Attach listener to btnSaveCategory
$("#btnSaveCategory").on("click",function(){
 
  userCategories.push($("#txtCategory").val())
  localStorage.setItem("userGifs", userCategories)
  createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)))
 
})

createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)))

//Create buttons for each item in default and user arrays
function createButtons(array){

  $divButtons.empty();
  
  for(var i =0;i<array.length;i++){
    let myValue = stringReplaceSpace(array[i])
    let newButton = $("<button>")
    newButton.addClass("btn btn-info m-1 text-uppercase js_btnGif")
    newButton.val(myValue)
    newButton.text(array[i])
    newButton.appendTo($divButtons)
  }
  $(".js_btnGif").on("click", function(){

    getGifs($(this).val())
  
  })

}
function getGifs(sGif) {

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + sGif + "&api_key=Pi6G0VZE4khvrzUzfcJsdCtObo9Z9tkq&limit=10";

  $.ajax({

    url: queryURL,
    method: "GET" //,
    //header:"Access-Control-Allow-Origin: *"

  }).then(function (response) {
    console.log(response)

     for(var i = 0;i < response.data.length;i++){
       newCard = $("<div>")
       newCard.addClass("card")
       newImage = $("<img>")
       newImage.attr("src",response.data[i].images.fixed_height_small.url)
       newImage.appendTo(newCard)
       newCard.appendTo($divGallery)
     }
   })

}

//This function replaces spaces with + for use in the gif lookup
function stringReplaceSpace(myStr){

  myStr = myStr.trim();

  for(var i=0;i< myStr.length;i++){
    if(myStr.charAt(i) === " "){
    
      myStr = myStr.replace(myStr.charAt(i),"+")
    }    
  }
  return myStr
}
