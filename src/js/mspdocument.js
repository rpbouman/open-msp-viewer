/*

Copyright 2014 Roland Bouman (roland.bouman@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

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

/*
http://msdn.microsoft.com/en-us/library/bb968637(v=office.12).aspx
*/
var durationFormats = {
  3: {
    abbr: "m",
    name: "minutes",
    formatter: function(from, to) {
      return (to - from) / 60 / 1000;
    }
  },
  4: {
    abbr: "em",
    name: "elapsed minutes",
  },
  5: {
    abbr: "h",
    name: "hours",
    formatter: function(from, to) {
      return (to - from) / 60 / 60 / 1000;
    }
  },
  6: {
    abbr: "eh",
    name: "elapsed hours",
  },
  7: {
    abbr: "d",
    name: "days",
    formatter: function(from, to) {
      return (to - from) / 24 / 60 / 60 / 1000;
    }
  },
  8: {
    abbr: "ed",
    name: "elapsed days",
  },
  9: {
    abbr: "w",
    name: "weeks",
    formatter: function(from, to) {
      return (to - from) / 7 / 24 / 60 / 60 / 1000;
    }
  },
  10: {
    abbr: "ew",
    name: "elapsed weeks",
  },
  11: {
    abbr: "mo",
    name: "months",
  },
  12: {
    abbr: "emo",
    name: "elapsed months",
  },
  19: {
    abbr: "%",
    name: "percent",
  },
  20: {
    abbr: "e%",
    name: "elapsed percent",
  },
  21: null,
  35: {
    abbr: "m?",
    name: "estimated minutes",
  },
  36: {
    abbr: "em?",
    name: "estimated elapsed minutes",
  },
  37: {
    abbr: "h?",
    name: "estimated hours",
  },
  38: {
    abbr: "h?",
    name: "estimated elapsed hours",
  },
  39: {
    abbr: "d?",
    name: "estimated days",
  },
  40: {
    abbr: "ed?",
    name: "estimated elapsed days",
  },
  41: {
    abbr: "w?",
    name: "estimated weeks",
  },
  42: {
    abbr: "ew?",
    name: "estimated elapsed weeks",
  },
  43: {
    abbr: "mo?",
    name: "estimated months",
  },
  44: {
    abbr: "emo?",
    name: "estimated elapsed months",
  },
  51: {
    abbr: "%?",
    name: "estimated percent",
  },
  52: {
    abbr: "e%?",
    name: "estimated elapsed percent",
  },
  53: null
};

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
    this.indexData();
  },
  formatDuration: function(startDate, endDate, format){
    var format = durationFormats[format];
    var formatter = format.formatter;
    var value;
    if (formatter) {
      value = formatter(startDate.getTime(), endDate.getTime());
      value += " " + format.name;
    }
    else {
      value = "duration format \"" + format.name + "\" not implemented :(";
    }
    return value;
  },
  parseISO8601Duration: function(duration){
              //   12       34       56         78       91       12
    var match = /^P((\d+)Y)?((\d+)M)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?$/.exec(duration);
    if (!match) throw "Illegal duration value.";
    var o = {};
    if (match[2]) {
      o.years = parseInt(match[2], 10);
    }
    if (match[4]){
      o.months = parseInt(match[4], 10);
    }
    if (match[6]){
      o.days = parseInt(match[6], 10);
    }
    if (match[8]){
      o.hours = parseInt(match[8], 10);
    }
    if (match[10]){
      o.minutes = parseInt(match[10], 10);
    }
    if (match[12]){
      o.seconds = parseInt(match[12], 10);
    }
    return o;
  },
  index: function(path, keys, multiple){
    var array = this.getValueAsArray.apply(this, path);
    var i, n, object, property, key, value, map, bucket;
    for (property in keys) {
      map = {};
      this[property] = map;
    }
    for (i = 0, n = array.length; i < n; i++){
      object = array[i];
      for (property in keys) {
        map = this[property];
        key = keys[property];
        value = object[key];
        if (multiple) {
          bucket = map[value];
          if (!bucket) {
            bucket = [];
            map[value] = bucket;
          }
          bucket.push(object);
        }
        else {
          map[value] = object;
        }
      }
    }
  },
  indexTasks: function(){
    this.index(["Project", "Tasks", "Task"], {
      tasksByUID: "UID"
    }, false);
  },
  getTaskByUID: function(uid){
    return this.tasksByUID[uid];
  },
  indexResources: function(){
    this.index(["Project", "Resources", "Resource"], {
      resourcesByUID: "UID"
    }, false);
  },
  getResourceByUID: function(uid){
    return this.resourcesByUID[uid];
  },
  indexAssignments: function(){
    this.index(["Project", "Assignments", "Assignment"], {
      assignmentsByTaskUID: "TaskUID",
      assignmentsByResourceUID: "ResourceUID",
    }, true);
  },
  getAssignmentsByResourceUID: function(resourceUID){
    return this.assignmentsByResourceUID[resourceUID];
  },
  getAssignmentsByTaskUID: function(taskUID){
    return this.assignmentsByTaskUID[taskUID];
  },
  indexData: function(){
    this.indexTasks();
    this.indexResources();
    this.indexAssignments();
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
  getDurationFormat: function(item){
    var durationFormat;
    if (item) {
      durationFormat = item.DurationFormat;
      durationFormat = parseInt(durationFormat, 10);
      if (durationFormat < 3 || durationFormat > 51) {
        throw "Invalid duration format " + durationFormat;
      }
      if (durationFormat !== 21 && durationFormat !== 51) {
        return durationFormat;
      }
    }
    if (!this.durationFormat){
      this.durationFormat = this.getValueAsInteger("Project", "DurationFormat");
    }
    return this.durationFormat;
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
  getAssignments: function(){
    return this.getValueAsArray("Project", "Assignments", "Assignment");
  },
  getResources: function(){
    return this.getValueAsArray("Project", "Resources", "Resource");
  },
  getTaskLinks: function(task) {
    var links = task.PredecessorLink;
    if (!links) {
      links = [];
    }
    else
    if (!iArr(links)){
      links = [links];
    }
    return links;
  },
  forEachTaskLink: function(task, callback, scope){
    if (!scope) scope = this;
    var i, n, link, links = this.getTaskLinks(task);
    for (i = 0, n = links.length; i < n; i++) {
      link = links[i];
      if (callback.call(scope, link, i) === false) {
        return false;
      }
    }
    return true;
  },
  forEach: function(){
    var args = arguments, n = args.length, i, arg, path = [];
    for (i = 0; i < n; i++){
      arg = args[i];
      if (iStr(arg)) {
        path.push(arg);
      }
      else {
        break;
      }
    }
    var array = this.getValueAsArray.apply(this, path);
    var callback = args[i++];
    var scope = args[i++];
    if (!scope) {
      scope = this;
    }
    for (i = 0, n = array.length; i < n; i++){
      arg = array[i];
      if (callback.call(scope, arg, i) === false) {
        return false;
      }
    }
    return true;
  },
  forEachTask: function(callback, scope){
    return this.forEach.apply(this, ["Project", "Tasks", "Task", callback, scope]);
  },
  forEachResource: function(callback, scope){
    return this.forEach.apply(this, ["Project", "Resources", "Resource", callback, scope]);
  },
  forEachAssignment: function(callback, scope){
    return this.forEach.apply(this, ["Project", "Assignements", "Assignment", callback, scope]);
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