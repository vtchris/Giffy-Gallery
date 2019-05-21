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
//var userStoredVariables = localStorage.getItem("userGifs")



// if(userStoredVariables.length > 0){

//   userCategories = userStoredVariables.split(',');

// }

createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)))

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

  console.log(array)

}


$("#btnSaveCategory").on("click",function(){
 //debugger;
  userCategories.push($("#txtCategory").val())
  localStorage.setItem("userGifs", userCategories)
  createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)))
  
})

//var string = stringReplaceSpace("  This has a lot of spaces in it  ")

function stringReplaceSpace(myStr){
  //debugger;
  myStr = myStr.trim();

  for(var i=0;i< myStr.length;i++){
    if(myStr.charAt(i) === " "){
    
      myStr = myStr.replace(myStr.charAt(i),"+")
    }

    
  }
  return myStr

}









//console.log(string)

//var gif = "funny+cat"

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
