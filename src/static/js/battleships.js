
//This subroutine is for opening full screen
function openFullscreen() {
  const elem = document.documentElement;    //finds the object with the full screen function in it
  if (elem.requestFullscreen) {     //checks to make sure that the function (going full screen) exists
    elem.requestFullscreen();   //makes the whole page go fullscreen
  }
}
//This subroutine is for exiting full screen
function exitFullscreen() {
  if (document.fullscreenElement) {     //same as open full screen but for exiting
    document.exitFullscreen();
  }
}


//Where you would put javascript functions to change the page
$(document).ready(function () {

  $('.game-board table') //Finds all game boards and targets the table inside it
  .each(function(index, item) {  //For every table inside game-board, this funtion will execute
    let gameBoard = $(item);  //Creating a variable that refers to the table
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';  //Creates a constant variable called alphabet, which is the alphabet
    const boardSize = GRID_SIZE;  //How big the board will be
    for (let row = 0; row < boardSize + 2; row++) { //Begins a for loop that starts at 0, increments by 1 each time and goes until board size + 2
      let rowElement = $('<tr/>'); //Creating rows
      for (let col = 0; col < boardSize + 2; col++) { //Same as 2 lines above, but for columns instead
        if (row == 0 || row == boardSize + 1) {   //If it's the first or last row, then don't label it
          if (col == 0 || col == boardSize + 1) { //If it's the first or last column, then don't label it
            rowElement.append('<th>&nbsp;</th>');    //Creating the space for the corners of the grid
          } else{
            rowElement.append('<th>'+alphabet[col-1]+'</th>');    //Adds the column heading (alphabet)
          }      
        } else {  //If it's not the first or last row, then creates buttons unless it's the first or last column
          if (col == 0 || col == boardSize + 1) {
            rowElement.append('<th>'+row+'</th>');   //If it's the first or last column, then label with numbers 
          } else{
            rowElement.append('<td><button data-grid="'+alphabet[col-1]+row+'"></button></td>');  //Adding the buttons to everything else
          }       
        }
      }
      gameBoard.append(rowElement); //Adds the row that's just been created
    }
  });

  $('.game-board.opponent').on('click', 'button', function() { //Looks for any button inside game-board and when it's clicked do this function
    let $this = $(this);  //Assigining a variable to the jquery version of the button you clicked on
    $this.prop("disabled", true); //Disables button after clicking it
    $.ajax({  //A way of sending a request to python
      url: '/take-turn',  //The path to get to python
      type: 'POST',
      contentType: 'application/json',  //json is a convenient way of passing information back and forth
      dataType: 'json',
      data: JSON.stringify({  //Making 'turn' into json
        id: GAME_ID,  //Passing the gameId back to python
        turn: $this.data('grid')  //'this' is the button the user clicked on and data('grid') is its coordinates
      }),
      success: function(response) {
        if (response.result == true) {
          $this.addClass('hit');  //If the click is a hit, then it adds a class so that css can colour it
        } else {
          $this.addClass('miss'); //Same but if it's a miss
        }
        console.log('Success:', response);  //deals with the response from python
      }
    });
  });

});
