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

function sendMessage() {
    const request = new XMLHttpRequest();
    var feedback = document.getElementById('feedbackinput').value;
    var name = document.getElementById('nameinput').value;
    if (feedback == '' || name == '') {
        alert("Please fill out both fields before submitting feedback.");
        return;
    }
    request.open("POST", "https://discord.com/api/webhooks/917048615975931995/0u9APl2MKhUVLD5yV9voBbwcLoFlx-lwV03erOqJegNQEXpPHrfaulFrLulUBo4hal5I");

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
    content: 'Feedback: '+ feedback + '\nSubmitted by: ' + name
    }

    request.send(JSON.stringify(params));

    document.getElementById('form').style.display = 'none';
    document.getElementById('submitted').style.display = 'block';

}

function setcategory(category, button) {
  cmdcategories = document.getElementsByClassName('cmdcategory');
  for (element of cmdcategories) {element.style.display = 'none'}
  document.getElementById(category).style.display = "block";
  elements = document.getElementsByClassName('button blurple is-active');
  for (element of elements) {element.className = 'button blurple';}
  document.getElementById(button).className = 'button blurple is-active';
}