function parse() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var jsonData = this.responseText;
    	var parsed = JSON.parse(jsonData);
      document.getElementById("messages").innerHTML = parsed[0]["content"] + " " + parsed[0]["username"] + "<br>" + parsed[1]["content"] + " " + parsed[1]["username"];
    }
  };
 xhttp.open("GET", "data.json", true);
 xhttp.send();

}