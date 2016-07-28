window.onload = function() {
  console.log('js loaded');
//Booket APP :)

//get elements
var div = document.querySelector('#content');
var search = document.querySelector('#titlesearch');
var button = document.querySelector('#searchBtn');

// var url = "http://localhost:3000";
var url = 'https://polar-cliffs-37664.herokuapp.com';

//submit button gets it started
searchBtn.addEventListener('click', function(ev) {
  ev.preventDefault();

var drop = document.querySelector('#dropbox');
// console.log(drop);
var searchValue = search.value;
var chosenEndPoint = drop.value;
console.log(chosenEndPoint);
var queryStr = '';
if (chosenEndPoint === 'booktitle') {
  queryStr = '?name=';
} else if (chosenEndPoint === 'author') {
  queryStr = '?title=';
}
queryStr += searchValue;
console.log(queryStr);


var data = {
  searchValue: searchValue,
  chosenEndPoint: chosenEndPoint
};

  //ajax stuff
    $.ajax({
      url: url,
      method: "post",
      data: data,
      dataType: 'json'
    }).done(function(res){
      console.log("response: ", res);
      appending(res);

    });
// let's see this mess, append to the DOM
function appending(response) {
  var html = '<ul>';
    for (var i = 0; i < response.items.length; i++) {
      var book = response.items[i];
      var id = book.id;
      var title = book.volumeInfo.title;
      var thumbnail = book.volumeInfo.imageLinks.smallThumbnail;
      var authors = [];
      if (book.volumeInfo.hasOwnProperty('authors')) {
         authors = book.volumeInfo.authors;
      }
      var description = book.searchInfo.textSnippet;
      var price = 'no sale price available';
      if (book.saleInfo.hasOwnProperty('retailPrice')) {
          price = '$' + book.saleInfo.retailPrice.amount;
      }
      html += '<img src="'+thumbnail+'">';
      html += '<br>';
      html += '<h3>' + title + '</h3>';
      html += '<p>Authors: ' ;
      for (var j = 0; j < authors.length; j++) {
        html += authors[j];
        if (j !== authors.length - 1) {
          html += ', ';
        }
      }
      html += '</p>';
      html += '<p>' + price + '</p>';
      html += '<p>' + description + '</p>';
      html += '<br>';
      html += "<button id='" + id +"'  type='button' name='button'>Add to Favorites</button>"  + '<br>';
      // thank you Babajide for helping me with this button part.

      // for email sharing
      var email=('you@youhost.com');
      var subject = ('You are going to love this book!');
      var body = ('Put the link to page here!');
      html += '<a href="mailto:' + email + '?subject=' +subject+ '&body=' +body+'">' + 'Share!' + '<'+'/a>';
    }
  html += '</ul>';
  document.querySelector('#content').innerHTML = html;

  // favorite button posts to DB
  var buttons = document.querySelectorAll('button');
    for (var f = 0; f < buttons.length; f++) {
      buttons[f].addEventListener('click', function(){
        var id = this.id;
        console.log('favorite button clicked: ', id);
        // ajax post to favorites
        $.ajax({
          url: url + '/books/favbooksCollection',
          method: 'POST',
          data: {"id": id},
          dataType: 'json'
        }).done(function(res){
          console.log("favorites response: ", res);
          });
        }); //end ajax
      } //end eventlistener
    } // end for loop
  }); //end query selector
};
