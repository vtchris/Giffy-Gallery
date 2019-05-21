var $divButtons = $("#divButtons")

var defaultCategories = ["dilbert","the simpsons"]
var userCategories = []
var arrWorking = []

//Check for locally stored Categories

var userStoredVariables = localStorage.getItem("userGifs")

if(userStoredVariables.length > 0){

  loadUserCategories(userStoredVariables)
}

//Place locally stored categories into userCategories array
function loadUserCategories(StoredVariables){

  userCategories = StoredVariables.split(',');

}



createButtons(defaultCategories.slice(0).concat(userCategories.slice(0)))

function createButtons(array){
  
  for(var i =0;i<array.length;i++){
    let myValue = stringReplaceSpace(array[i])
    let newButton = $("<button>")
    newButton.addClass("js_btnGif")
    newButton.val(myValue)
    newButton.text(array[i])
    newButton.appendTo($divButtons)
  }
  console.log(array)

}


$("#btnSaveCategory").on("click",function(){
 //debugger;
  userCategories.push($("#txtCategory").val())
  localStorage.setItem("userGifs", userCategories)
  
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






$(".js_btnGif").on("click", function(){

  getGifs($(this).val())
  

})


//console.log(string)

//var gif = "funny+cat"

function getGifs(sGif) {

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + sGif + "&api_key=Pi6G0VZE4khvrzUzfcJsdCtObo9Z9tkq&limit=10";

  $.ajax({

    url: queryURL,
    method: "GET"

  }).then(function (response) {
    console.log(response)

  })

}



