var request = new XMLHttpRequest()

  request.open('GET', 'https://top.gg/api/bots/632489295273394176/stats', true)
  request.setRequestHeader("Authorization", "NOTHING");
  request.onload = function () {
    var data = JSON.parse(this.response)
    if (data.server_count) {
      document.getElementById("server_count").innerHTML = data.server_count
    } else {
      document.getElementById("server_count").innerHTML = "70+"
    }

    
  }
  request.send()