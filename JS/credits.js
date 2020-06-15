console.log("loaded");

// Add all names here
var names = [
  "Siraj Motaung",
  "Shameel Nkosi",
  "Molefe Molefe"
];

// Add corresponding title here
// var titles = [
//   "Director & Object Creation",
//   "Lighting & Materials",
//   "Game Mechanics & Stage Direction",
// ]

function writeName(){

	var i = 0,
      employee,
      name,
      title,
      bottom;

  var interval = setInterval(function() {
                   employee = '.employee.' + i;
                   name = '.name.' + i;
                   // title = '.title.' + i;
                   $('<div></div>').appendTo('#screen').addClass('employee '+i);
                   // $('<h4></h4>').appendTo(employee).addClass('title '+i);
                   $('<h2></h2>').appendTo(employee).addClass('name '+i);
                   $('<div></div>').appendTo(employee).addClass('space ');
                   $(name).text(names[i]);
                   // $(title).text(titles[i]);
                   i++;
                   if(i >= names.length) clearInterval(interval);
                 }, 4000);

}

function fadeInText(){
  var i = 0;
  if (i < 150){
  var interval =  setInterval(function(){
                    $('h2').css('opacity', '+=0.01');
                    $('h4').css('opacity', '+=0.01');
                    i++;
                  },50);
  }

}

function scrollText(){
   var interval = setInterval(function(){
     							   $('.employee').css('bottom', '+=1px');
                     $('.employee').css('opacity', '-=0.0025');
   								 }, 50);
}
