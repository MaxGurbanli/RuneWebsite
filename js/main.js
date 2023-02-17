function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
     
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
    }
    
function checkCookie() {
    let value = getCookie("closed new bot prompt");
    if (value != 'true') {
      document.getElementById('popup').style.display = 'block'
      }
    }
  
function getCompliancyCookie(name) {
  var arg=name+"=";
  var alen=arg.length;
  var clen=document.cookie.length;
  var i=0;
  while (i<clen) {
	var j=i+alen;
	if (document.cookie.substring(i,j)==arg)
	  return "here";
	i=document.cookie.indexOf(" ",i)+1;
	if (i==0) break;
  }
  return null;
}
function testFirstCookie(){
	var offset = new Date().getTimezoneOffset();
	if ((offset >= -180) && (offset <= 0)) { // European time zones
		var visit=getCompliancyCookie("cookieCompliancyAccepted");
		if (visit==null){
		   $("#myCookieConsent").fadeIn(400);	// Show warning
	   } else {
			// Already accepted
	   }		
	}
}
// $(document).ready(function(){
//     $("#cookieButton").click(function(){
// 		var expire=new Date();
// 		expire=new Date(expire.getTime()+7776000000);
// 		document.cookie="cookieCompliancyAccepted=here; expires="+expire+";path=/";
//         $("#myCookieConsent").hide(400);
//     });
// 	testFirstCookie();
// });

function reportBug() {
    const request = new XMLHttpRequest();
    var username = document.getElementById('username').value;
    var bugtitle = document.getElementById('bugtitle').value;
    var bugdescription = document.getElementById('bugdescription').value;
    if (username == '' || bugtitle == '' || bugdescription == '') {
        alert("Please fill out all fields before submitting the bug report.");
        return;
    }
    request.open("POST", "https://discord.com/api/webhooks/936370237530599546/F7M9cxARvnJYBexUNmDsHXIvGzoC3I2RHrRUT1uBGE_1t0TXMyRTOyaFacQjl-eBgHzc");

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
    content: 'Title: '+ bugtitle + '\nDescription: ' + bugdescription + '\nSubmitted by: ' + username
    }

    request.send(JSON.stringify(params));

    confirm('Are you sure you would like to submit the bug report form?')
}

var categoryStore = {
  "economybutton": "Economy",
  "moderatorbutton": "Moderator",
  "funbutton": "Fun",
  "informationbutton": "Information",
  "loggingbutton": "Logging",
  "utilitybutton": "Utility",
  "surveysbutton": "Surveys"
}

function setcategory(event) {
  cmdcategories = document.getElementsByClassName('cmdcategory');
  for (element of cmdcategories) {element.className = 'cmdcategory hidden'}
  document.getElementById(categoryStore[event.target.id]).className = 'cmdcategory';
  active = document.getElementsByClassName('textbutton is-active')[0];
  if (active) {active.className = 'textbutton'}
  document.getElementById(event.target.id).className = 'textbutton is-active';
}

function showall() {
  cmdcategories = document.getElementById('cmdcontainer');
  for (element of cmdcategories.children) {element.className = 'cmdcategory'}
  active = document.getElementsByClassName('textbutton is-active')[0];
  if (active) {active.className = 'textbutton'}
  document.getElementById('allbutton').className = 'textbutton is-active';
}

function toggleinfo(e) {
  if (e.target.parentElement.className == "cmdcategoryitem") {
    elem = e.target.parentElement.getElementsByClassName('has-text-gray')[0]
  }
  else {
    elem = e.target.getElementsByClassName('has-text-gray')[0]
  }
  if (elem.style.display == 'none' || elem.style.display == '') {
    elem.style.display = 'block';
  }
  else {
    elem.style.display = ''
  }
}

var cmdcontainer, tr

function loadCommands() {
  cmdcontainer = document.getElementById("cmdcontainer")
  tr = []
  for (child of cmdcontainer.children) {
    eachtable = child.getElementsByClassName("cmdcategoryitem")
    for (element of eachtable) {tr.push(element)}
  }
}

function searchCommands() {
  buttons = document.getElementById('cmdcontainerbuttons')
  active = buttons.getElementsByClassName('is-active')[0];
  if (active) {active.className = 'textbutton'}
  document.getElementById('allbutton').className = 'textbutton is-active';

  for (cmdcategory of cmdcontainer.children) {
    cmdcategory.className = 'cmdcategory'
  }

  var input, filter, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByClassName("has-text-primary")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// let interval = null;

// document.querySelector(".homepage-title h1").onmouseover = event => {  
//   let iteration = 0;
  
//   clearInterval(interval);
  
//   interval = setInterval(() => {
//     event.target.innerText = event.target.innerText
//       .split("")
//       .map((letter, index) => {
//         if(index < iteration) {
//           return event.target.dataset.value[index];
//         }
      
//         return letters[Math.floor(Math.random() * 26)]
//       })
//       .join("");
    
//     if(iteration >= event.target.dataset.value.length){ 
//       clearInterval(interval);
//     }
    
//     iteration += 1 / 3;
//   }, 60);
// }
