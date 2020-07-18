// Company to search for
let QUERY = '';
// The browser tab's URL
let tabURL = '';

// Search specific part of URL
// Docs: https://github.com/websanova/js-url#url
// E.g. domain is http://www.example.com 
const searchType = [
  'domain', // example.com
  '.-2'     // example
]
let searchCount = 0;

// Get current tab's URL
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  tabURL = tabs[0].url;
  
  searchGlassdoor();
});

// Search Glassdoor
const searchGlassdoor = function() {
  QUERY = $.url(searchType[searchCount], tabURL);
  searchCount++;

  // Glassdoor API
  const searchAPI = `https://see-glassdoor.netlify.app/.netlify/functions/search-glassdoor?query=${QUERY}`;

  // Get Glassdoor results
  if (QUERY) {
    $('#search').html(`Searching Glassdoor for <i>${QUERY}</i>`);
    $.get(searchAPI, searchAnalyzer);
  }
}

// Create the 5 star visual display
const generateStars = function(rating, size) {
  size = size || '';

  if (size === 'mini') {
    size = '-mini';
  }

  // Classes for the stars
  const starBG = `star-bg${size}`;
  const starGreen = `star-green${size}`;
  const star = `star${size}`;

  let result = '';
  let decimal = rating;

  // Create full green stars
  for (decimal; decimal >= 1; decimal--) {
    result += `<i class="${starBG}"><i class="${starGreen}"><i class="${star}"></i></i></i>`;
  }

  // Create fractional green star
  if (decimal > 0) {
    const percent = `${decimal * 100}%`;
    result += `<i class="${starBG}"><i class="${starGreen}" style="width: ${percent}"><i class="${star}"></i></i></i>`;
  }

  // Create gray stars
  const grayStars = Math.floor(5 - rating);
  if (grayStars >= 1) {
    for (let i = 0; i < grayStars; i++) {
      result += `<i class="${starBG}"><i class="${star}"></i></i>`;
    }
  }

  return result;
}

// Display Glassdoor Results
const displayResult = function(data) {
  $('#info').append(`Result found for <i>${QUERY}</i>`);
  $('#logo').append(`<img src="${data.squareLogo}" />`);
  $('#name').append(data.name);
  $('#reviews').append(`<a target="_blank" href="http://www.glassdoor.com/api/api.htm?version=1&action=employer-overview&t.s=w-m&t.a=c&employerId=${data.id}">${data.numberOfRatings} reviews</a>`);

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
const searchAnalyzer = function(data) {
  if (data && data.totalRecordCount > 0) {
    displayResult(data.employers[0]);
  } else if (searchCount < searchType.length) {
    searchGlassdoor();
  } else {
    $('#search').html(`No results found on Glassdoor for <i>${QUERY}</i>`);
  }
}
