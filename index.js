// // IIFE
// $(function(){
//
// });

// ELEMENTS I CARE ABOUT
var fetchMakesButton = $( "button.fetch-makes" );
var makesList = $( ".makes-list ");
var imagePopover = $(".image-popover");

// WRITING TO THE DOM
fetchMakesButton.html( "GET VEHICLES" );

// // I AM COMMENTING THIS SECTION OUT BECAUSE
// // WE ARE NOW GETTING DATA FROM THE SERVER
// //
// // READING ATTRIBUTES FROM THE DOM
// // Selecting an element and then getting the value of the makes attribute
// var makes = makesList.attr('makes');
//
// // Javascript - MODIFYING THE DATA I GOT FROM THE DOM
// var makesArray = makes.split(',');
//
// // UpperMakes is just an array of makes in upper case
// makesArray.map(function(car) {
//   makesList.append($('<div>' + car.toUpperCase() + '</div>'))
// })

fetchMakesButton.on('click', getMakesUsingFetch);

getMakesUsingFetch();

function getMakesUsingFetch() {
  // use fetch-jsonp
  fetchJsonp('https://api.edmunds.com/api/vehicle/v2/makes?state=new&year=2016&view=basic&fmt=json&api_key=er94k9ppd6vzghjmt2r5au68')
  .then(function(response) {
    return response.json()
  }).then(function(json) {

    json.makes.map(function(make) {
      makesList.append(createMakeListItem(make))
    });

  }).catch(function(ex) {
    console.error('parsing failed', ex)
  })
}

function getPhotosUsingJQuery(tags) {
  // use jquery
  $.ajax({
    url: "https://api.flickr.com/services/feeds/photos_public.gne",

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "jsonFlickrFeed",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell YQL what we want and that we want JSON
    data: {
        tags: tags,
        format: "json"
    },

    // Work with the response
    success: function( response ) {
        console.log( response ); // server response
    }
  });
}

function jsonFlickrFeed(data) {
  // SELECT THE PREVIOUS IMAGE
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var carImage = $('.image-popover img');
  var numItems = data.items.length;
  var randomItem = data.items[getRandomInt(0,numItems)];
  carImage.attr('src', data.items[0].media.m);
  imagePopover.show();
}

/*
<div>
  <div>make.name</div>
  <div class="model-list">
    <div>Accura MDX</div>
    <div>Accura XDX</div>
  </div>
</div>
*/

function createMakeListItem(make) {

  // THINGS I CARE ABOUT
  var newMakeListItem = $('<li class="list-group-item" />'); // EMPTY
  var makeName = $('<div class="make-name"></div>').text(make.name.toUpperCase());
  var newModelList = createModelList(make);

  makeName.on('click', function() {
    newModelList.toggle();
    if(newModelList.is(':visible')) {
      newMakeListItem.addClass('expanded');
    } else {
      newMakeListItem.removeClass('expanded');
    }
  });

  newMakeListItem.append(makeName);
  newMakeListItem.append(newModelList);

  return newMakeListItem; // RETURN THE DIV, SO IT CAN BE APPENDED
}

function createModelList(make) {
  var newModelList = $('<div class="model-list" />')

  make.models.map(function(model) {
    var newModelListItem = $('<div class="model-list-item"/>').text(model.name);

    newModelListItem.on('click', function() {
      // DO SWEET THINGS
      getPhotosUsingJQuery(make.name + ' ' + model.name);
    });

    newModelList.append(newModelListItem);
  })

  return newModelList;
}

imagePopover.on('click', function() {
  imagePopover.hide();
});
