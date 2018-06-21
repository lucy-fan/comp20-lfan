function parse() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var jsonData = this.responseText;
    	var parsed = JSON.parse(jsonData);
      document.getElementById("messages").innerHTML = '<p>' + parsed[0]["content"] + " " + parsed[0]["username"] + "</p><p></p><p></p><p>" + parsed[1]["content"] + " " + parsed[1]["username"] + '</p>';
    }
  };
 xhttp.open("GET", "https://messagehub.herokuapp.com/messages.json", true);
 xhttp.send();

}