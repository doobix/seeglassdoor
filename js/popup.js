// My secret Glassdoor keys
var glassdoor_id = '27251';
var glassdoor_Key = 'e6BJypHHlMY';

// Company to search for
var QUERY = '';

// Get current tab's URL
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  var url = tabs[0].url;
  QUERY = $.url('domain', url);

  // Glassdoor API
  var search = 'http://api.glassdoor.com/api/api.htm?t.p=' + glassdoor_id + 
               '&t.k=' + glassdoor_Key + '&q=' + QUERY + 
               '&userip=0.0.0.0&useragent=&format=json&v=1&action=employers';

  // Get Glassdoor results
  if (QUERY) {
    console.log('Searching Glassdoor for', QUERY);
    $.get(search, searcher);
  }
});

// Extract a domain name from a string
// var getDomainName = function(string) {
//   var regex = new RegExp("\/\/(.+)\/");
//   var domainName = regex.exec(string);
// console.log('searching',string);
// console.log('found',domainName);
//   if (domainName[1]) {
//     return domainName[1];
//   } else {
//     return null;
//   }
// }

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

// Display Glassdoor results
var searcher = function(data) {
  console.log(data);
  var result = data.response.employers[0];

  if (data.success && data.response.totalRecordCount > 0) {
    $('#logo').append('<img src="' + result.squareLogo + '" />');
    $('#name').append(result.name);
    $('#reviews').append('<a target="_blank" href="http://www.glassdoor.com/api/api.htm?version=1&action=employer-overview&t.s=w-m&t.a=c&employerId=' + 
      result.id + '">' + result.numberOfRatings + ' reviews</a>');

    $('#overallRating .rating').append(result.overallRating);
    $('#overallRating .stars').append(generateStars(result.overallRating));

    $('#cultureAndValuesRating .rating').append(result.cultureAndValuesRating);
    $('#cultureAndValuesRating .stars').append(generateStars(result.cultureAndValuesRating, 'mini'));

    $('#workLifeBalanceRating .rating').append(result.workLifeBalanceRating);
    $('#workLifeBalanceRating .stars').append(generateStars(result.workLifeBalanceRating, 'mini'));

    $('#seniorLeadershipRating .rating').append(result.seniorLeadershipRating);
    $('#seniorLeadershipRating .stars').append(generateStars(result.seniorLeadershipRating, 'mini'));

    $('#compensationAndBenefitsRating .rating').append(result.compensationAndBenefitsRating);
    $('#compensationAndBenefitsRating .stars').append(generateStars(result.compensationAndBenefitsRating, 'mini'));

    $('#careerOpportunitiesRating .rating').append(result.careerOpportunitiesRating);
    $('#careerOpportunitiesRating .stars').append(generateStars(result.careerOpportunitiesRating, 'mini'));
  } else {
    $('#seeglassdoor').empty();
    $('#seeglassdoor').append('<h2>No results found on Glassdoor</h2>');
  }
}
