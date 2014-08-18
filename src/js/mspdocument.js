var MspDocument;
(function(){

function elementToObject(node) {
  if (typeof(node.childNodes) === "undefined") return null;
  var object = {};
  var childNodes = node.childNodes, n = childNodes.length,
      i, childNode, tagName, typeOfEl
  ;
  for (i = 0; i < n; i++){
    childNode = childNodes[i];
    switch (childNode.nodeType) {
      case 1:
        tagName = childNode.tagName;
        typeOfEl = typeof(object[tagName]);
        switch (typeOfEl) {
          case "undefined":
            object[tagName] = elementToObject(childNode);
            break;
          case "object":
            if (object[tagName].constructor !== Array) {
              object[tagName] = [object[tagName]];
            }
            object[tagName].push(elementToObject(childNode));
            break;
        }
        break;
      case 3:
        if (n === 1) return childNode.data;
        break;
    }
  }
  return object;
}

(MspDocument = function(){
  this.data = null;
}).prototype = {
  loadFromXml: function(xml){
    var doc = parseXmlText(xml);
    this.loadFromDom(doc);
  },
  loadFromDom: function(dom){
    var object = elementToObject(dom);
    this.data = object;
  },
  getValue: function(){
    var value = this.data, argument;
    for (var i = 0; i < arguments.length; i++) {
      argument = arguments[i];
      value = value[argument];
    }
    return value;
  },
  getValueAsDate: function(){
    var value = this.getValue.apply(this, arguments);
    //Normally, new Date(Date.UTC(value)); should do the trick, but not in IE8
    return new Date(this.parseDate(value));
  },
  getValueAsBoolean: function(){
    var value = this.getValue.apply(this, arguments);
    switch (value) {
      case "0": return false;
      case "1": return true;
      default: throw "Invalid boolean value " + value;
    }
  },
  getValueAsInteger: function(){
    var value = this.getValue.apply(this, arguments);
    var iValue = parseInt(value, 10);
    if (isNaN(iValue)) {
      throw "Invalid int value " + value;
    }
    return iValue;
  },
  getValueAsFloat: function(){
    var value = this.getValue.apply(this, arguments);
    var fValue = parseFloat(value);
    if (isNaN(fValue)) {
      throw "Invalid float value " + value;
    }
    return fValue;
  },
  getValueAsArray: function(){
    var value = this.getValue.apply(this, arguments);
    if (iArr(value)) return value;
    return [value];
  },
  getBoundaryDates: function(){
    var minDate = this.getStartDate().getTime(),
        maxDate = this.getFinishDate().getTime()
    ;
    var me = this;
    this.forEachTask(function(task, i){
      var date;
      date = me.parseDate(task.Start);
      if (date < minDate) {
        minDate = date;
      }
      date = me.parseDate(task.Finish);
      if (date > maxDate) {
        maxDate = date;
      }
    });
    return {
      minDate: new Date(minDate),
      maxDate: new Date(maxDate)
    };
  },
  getStartDate: function(){
    return this.getValueAsDate("Project", "StartDate");
  },
  getFinishDate: function(){
    return this.getValueAsDate("Project", "FinishDate");
  },
  getCalendars: function(){
    return this.getValueAsArray("Project", "Calendars", "Calendar");
  },
  getBaseCalendar: function(){
    if (!this.baseCalendar) {
      var calendars = this.getCalendars();
      var i, n = calendars.length, calendar;
      for (i = 0; i < n; i++) {
        calendar = calendars[i];
        if (calendar.IsBaseCalendar === "1") {
          this.baseCalendar = calendar;
          break;
        }
      }
    }
    return this.baseCalendar;
  },
  getWeekStartDay: function(){
    return this.getValueAsInteger("Project", "WeekStartDay");
  },
  getTasks: function(){
    return this.getValueAsArray("Project", "Tasks", "Task");
  },
  forEachTask: function(callback, scope){
    if (!scope) scope = this;
    var tasks = this.getTasks();
    for (var task, i = 0, n = tasks.length; i < n; i++) {
      task = tasks[i];
      if (callback.call(scope, task, i) === false) {
        return false;
      }
    }
    return true;
  }
};

MspDocument.prototype.parseDate = (isNaN(Date.parse("1970-01-01T00:00:00")) ? function(value){
    var re = /^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)$/;
    var match = re.exec(value);
    if (match === null) {
      return NaN;
    }
    return Date.UTC(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1,
      parseInt(match[3], 10),
      parseInt(match[4], 10),
      parseInt(match[5], 10),
      parseInt(match[6], 10)
    );
  } : function(value) {
    return Date.parse(value);
  }
);

})();