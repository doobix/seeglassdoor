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
      console.log('Searching Glassdoor for ', QUERY);
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

// Display Glassdoor results
var searcher = function(data) {
  console.log(data);

  if (data.success && data.response.totalRecordCount > 0) {
    $("#seeglassdoor").append('<h2>' + data.response.employers[0].name + '</h2>');
  } else {
    $("#seeglassdoor").append('<h2>No results found on Glassdoor</h2>');
  }
}
