var QUERY = 'glassdoor';

var glassdoor_id = '27251';
var glassdoor_Key = 'e6BJypHHlMY';

var searcher = function(data) {
  console.log(data);

  if (data.success) {
    $("#seeglassdoor").append('<h2>' + data.response.employers[0].name + '</h2>');
  } else {
    $("#seeglassdoor").append('<h2>No results found on Glassdoor</h2>');
  }
}

var search = 'http://api.glassdoor.com/api/api.htm?t.p=' + glassdoor_id + 
             '&t.k=' + glassdoor_Key + 
             '&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=' + 
             QUERY + '&callback=searcher';
var searchScript = '<script type="text/javascript" src="' + search + '"></script>'

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  $('#seeglassdoor').append(searchScript);
});
