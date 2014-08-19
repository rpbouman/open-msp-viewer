(function(){

linkCss(cssDir + "app.css");

var spinner = new Spinner();
spinner.show();

var dnd = new DDHandler({
  node: body
});
SplitPane.listenToDnd(dnd);

var mainToolbar = new Toolbar({
  container: body,
});
mainToolbar.addButton([
  {"class": "open"},
  typeof(FileReader) === "undefined" ? {"class": "separator"} : cEl("input", {
    id: "file",
    type: "file"
  }),
  {"class": "separator"},
  {"class": "ganttchart", tooltip: "Gant T Chart", toggleGroup: "view", depressed: true},
  {"class": "resources", tooltip: "Resources", toggleGroup: "view"},
  {"class": "separator"},
  {"class": "project", tooltip: "Project", toggleGroup: "calendar", depressed: true},
  {"class": "year", tooltip: "Year", toggleGroup: "calendar"},
  {"class": "month", tooltip: "Month", toggleGroup: "calendar"},
  {"class": "week", tooltip: "Week", toggleGroup: "calendar"},
  {"class": "day", tooltip: "Day", toggleGroup: "calendar"}
]);

mainToolbar.listen({
  buttonPressed: function(toolbar, event, data){
    switch (data.conf["class"]) {
      case "open":
        handleHttpOpen();
        break;
    }
  },
  afterToggleGroupStateChanged: function(toolbar, event, data){
    var newButton = data.newButton;
    var newButtonClass = newButton.conf["class"];
    switch (data.group) {
      case "view":
        //todo: show the current view, hide the others.
        break;
      case "calendar":
        gantTChart.setCalendarResolution(newButtonClass);
        break;
    }
  }
});

function gotDocument(doc){
  gantEl.style.display = "";
  gantTChart.clear();
  gantTChart.setSplitterPosition("350px");
  gantTChart.setDocument(doc);
}

function handleHttpOpen(){
  var sampleUrl = document.location.href.split("/");
  sampleUrl.length = sampleUrl.length - 3;
  sampleUrl = sampleUrl.join("/") + "/sample/3PointPlan-example.xml";
  var url = prompt(
    "Please enter a url to download a MS Project XML file:",
    sampleUrl
  );
  if (url === null) return;
  spinner.show();
  ajax({
    url: url,
    success: function(options, xhr, data){
      try {
        var doc = new MspDocument();
        doc.loadFromDom(data);
        gotDocument(doc);
      }
      catch (e) {
        alert("Error occurred loading the document: " + e);
      }
      spinner.hide();
    },
    failure: function(options, xhr, exception){
      debugger;
      alert("Error occurred retrieving the document: " + exception.toString());
      spinner.hide();
    }
  });
}

if (typeof(FileReader) !== "undefined") {
  listen(gEl("file"), "change", function(e){
    spinner.show();
    var target = e.getTarget();
    var file = target.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      try {
        var doc = new MspDocument();
        doc.loadFromXml(e.target.result);
        gotDocument(doc);
      }
      catch (e) {
        alert("Error occurred loading the document: " + e);
      }
      spinner.hide();
    }
    reader.readAsText(file);
  });
}
//var top = mainToolbar.getDom().offsetHeight;
cEl("div", {
  id: "workarea",
  style: {
    top: 34 + "px",
    left: "0px", right: "0px", bottom: "0px",
    position: "absolute"
  }
}, null, body);

var calendarResolution = mainToolbar.getDepressedButtonInToggleGroup("calendar").conf["class"];
var dateFormatter = function(value){
  var date = gantTChart.getDocument().parseDate(value);
  return (new Date(date)).toDateString();
}
var gantTChart = new GantTChart({
  container: gEl("workarea"),
  calendarResolution: calendarResolution,
  configuredAttributes: {
    Start: {
      formatter: dateFormatter
    },
    Finish: {
      formatter: dateFormatter
    },
    Duration: {
      //formatter: durationFormatter
    }
  }
});
var gantEl = gantTChart.createDom();
gantEl.style.display = "none";

spinner.hide();
})()