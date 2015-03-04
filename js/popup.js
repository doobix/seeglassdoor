// My secret Glassdoor keys
var glassdoor_id = '27251';
var glassdoor_Key = 'e6BJypHHlMY';

// Company to search for
var QUERY = '';
// The browser tab's URL
var tabURL = '';

// Get current tab's URL
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  tabURL = tabs[0].url;
  QUERY = $.url('domain', tabURL);
  
  searchGlassdoor();
});

// Search Glassdoor
var searchGlassdoor = function() {
  // Glassdoor API
  var searchAPI = 'http://api.glassdoor.com/api/api.htm?t.p=' + glassdoor_id + 
               '&t.k=' + glassdoor_Key + '&q=' + QUERY + 
               '&userip=0.0.0.0&useragent=&format=json&v=1&action=employers';

  // Get Glassdoor results
  if (QUERY) {
    $('#search').append('Searching Glassdoor for <i>' + QUERY + '</i>');
    // console.log('Searching Glassdoor for', QUERY);
    $.get(searchAPI, searchAnalyzer);
  }
}

// Create the 5 star visual display
var generateStars = function(rating, size) {
  size = size || '';

  if (size === 'mini') {
    size = '-mini';
  }

  // Classes for the stars
  var starBG = 'star-bg' + size;
  var starGreen = 'star-green' + size;
  var star = 'star' + size;

  var result = '';
  var decimal = rating;

  // Create full green stars
  for (var decimal = rating; decimal >= 1; decimal--) {
    result += '<i class="' + starBG + '"><i class="' + starGreen + '"><i class="' + star + '"></i></i></i>';
  }

  // Create fractional green star
  if (decimal > 0) {
    var percent = decimal * 100 + '%';
    result += '<i class="' + starBG + '"><i class="' + starGreen + '" style="width: ' +
              percent + '"><i class="' + star + '"></i></i></i>';
  }

  // Create gray stars
  var grayStars = Math.floor(5 - rating);
  if (grayStars >= 1) {
    for (var i = 0; i < grayStars; i++) {
      result += '<i class="' + starBG + '"><i class="' + star + '"></i></i>';
    }
  }

  return result;
}

// Display Glassdoor Results
var displayResult = function(data) {
  $('#info').append('Result found for <i>' + QUERY + '</i>');
  $('#logo').append('<img src="' + data.squareLogo + '" />');
  $('#name').append(data.name);
  $('#reviews').append('<a target="_blank" href="http://www.glassdoor.com/api/api.htm?version=1&action=employer-overview&t.s=w-m&t.a=c&employerId=' + 
    data.id + '">' + data.numberOfRatings + ' reviews</a>');

  $('#overallRating .rating').append(data.overallRating);
  $('#overallRating .stars').append(generateStars(data.overallRating));

  $('#cultureAndValuesRating .rating').append(data.cultureAndValuesRating);
  $('#cultureAndValuesRating .stars').append(generateStars(data.cultureAndValuesRating, 'mini'));

  $('#workLifeBalanceRating .rating').append(data.workLifeBalanceRating);
  $('#workLifeBalanceRating .stars').append(generateStars(data.workLifeBalanceRating, 'mini'));

  $('#seniorLeadershipRating .rating').append(data.seniorLeadershipRating);
  $('#seniorLeadershipRating .stars').append(generateStars(data.seniorLeadershipRating, 'mini'));

  $('#compensationAndBenefitsRating .rating').append(data.compensationAndBenefitsRating);
  $('#compensationAndBenefitsRating .stars').append(generateStars(data.compensationAndBenefitsRating, 'mini'));

  $('#careerOpportunitiesRating .rating').append(data.careerOpportunitiesRating);
  $('#careerOpportunitiesRating .stars').append(generateStars(data.careerOpportunitiesRating, 'mini'));
  $('#search').hide();
  $('#result').show();
}

// Analyze Glassdoor results
var searchAnalyzer = function(data) {
  console.log(data);

  if (data.success && data.response.totalRecordCount > 0) {
    var result = data.response.employers[0];
    displayResult(result);
  } else {
    $('#search').html('No results found on Glassdoor for <i>' + QUERY + '</i>');
  }
}
