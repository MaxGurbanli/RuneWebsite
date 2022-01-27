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
$(document).ready(function(){
    $("#cookieButton").click(function(){
		var expire=new Date();
		expire=new Date(expire.getTime()+7776000000);
		document.cookie="cookieCompliancyAccepted=here; expires="+expire+";path=/";
        $("#myCookieConsent").hide(400);
    });
	testFirstCookie();
});

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

    confirm('Bug report submitted! It will be reviewed and handled appropriate within a day.')
}

function setcategory(category, button) {
  cmdcategories = document.getElementsByClassName('cmdcategory');
  for (element of cmdcategories) {element.style.display = 'none'}
  document.getElementById(category).style.display = "block";
  elements = document.getElementsByClassName('button blurple is-active');
  for (element of elements) {element.className = 'button blurple';}
  document.getElementById(button).className = 'button blurple is-active';
}