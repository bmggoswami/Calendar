(function(){
	var timeline = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];
	var meetings = [
		{ "id":1, "start": 60, "end": 150 },		
		{ "id":2, "start": 540, "end": 570 },
		{ "id":3, "start": 555, "end": 600 },
		{ "id":4, "start": 585, "end": 660 },
	];
	
	/**
	 * rendering timeline with time on left side.
	 */ 
	function renderTimeLine(timeline) {
		var tLength = timeline.length;
		console.log("timeline:",timeline);
		for(var i = 0; i < tLength;i++){
			var divElement = document.createElement("div");
			divElement.style.width = "50px";
			divElement.style.height = "120px";
			divElement.innerHTML = timeline[i];
			var tLine = document.getElementById('timeline');
			tLine.appendChild(divElement);
		}
	}
	
	/**
	 * generating random color 
	 */
	function randColor() {
	  var letters = '0123456789ABCDEF'.split('');
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	  }
	  return color;
	}	
	
	/**
	 * will return meetings array with updated status.
	 */ 
	function getMeetings(meetings) {
		meetings.sort(function(a,b){
			return a.start - b.start;
		});
		meetings = updateMeetings(meetings);
		appendMeetingDivs(meetings);
		return meetings;
	}
	
	/**
	 * appending div to calendar
	 */ 
	function appendMeetingDivs(meetingsArr) {
	  var i = 0;
	  while (i < meetingsArr.length) {
		var meetingsEl = document.createElement('div');
		meetingsEl.className = 'meeting';
		meetingsEl.style.height = meetingsArr[i].height;
		meetingsEl.style.top = meetingsArr[i].top;
		meetingsEl.style.background = meetingsArr[i].color;
		meetingsEl.style.width = meetingsArr[i].width;
		meetingsEl.style.left = meetingsArr[i].left;
		meetingsEl.innerHTML = 'Meeting ' + meetingsArr[i].id;
		var cl = document.getElementById('calendar');
		cl.appendChild(meetingsEl);
		i++;
	  }
	}

	/**
	 * checking collision between two meetings.
	 */ 
	function collidesWith(m1, m2) {
		return m1.end > m2.start && m1.start < m2.end;
	}
	
	/**
	 * checking collision for all the events in an array.
	 */ 
	function checkCollision(meetginsArr) {
		var len = meetginsArr.length;
		for(var i = 0; i < len; i++) {
			meetginsArr[i].cols = [];
			meetginsArr[i].colsBefore = [];
			for(var j = 0; j < len; j++) {
				if(collidesWith(meetginsArr[i], meetginsArr[j])) {
					meetginsArr[i].cols.push(j);
					if( i > j ){
							meetginsArr[i].colsBefore.push(j);
					}
				}
			}
		}
		return meetginsArr;
	}
	
	/**
	 * updating meetings
	 */ 
	function updateMeetings(meetginsArr) {
	  meetginsArr = checkCollision(meetginsArr);
	  var arr = meetginsArr.slice(0); 
	  var arrLen = arr.length;
	  
	  for(var i=0; i < arrLen; i++){
		var el=arr[i];
		el.color = randColor();
		el.height = (el.end - el.start) * 2 + 'px';
		el.top = (el.start) * 2 + 'px';
		
		if(i > 0 && el.colsBefore.length > 0) { //colliders with prior meetings
			if(arr[i-1].column > 0) { //if there is space at left side
			for(var j = 0;j < arr[i-1].column;j++) { 
				if(el.colsBefore.indexOf(i-(j+2)) === -1) { 
				el.column=arr[i-(j+2)].column; 
			  }
			}
			if(typeof el.column === 'undefined') 
				el.column=arr[i-1].column + 1;
		  }else{
			var column = 0;
			for(var j = 0;j < el.colsBefore.length;j++){ 
			  if(arr[el.colsBefore[el.colsBefore.length-1-j]].column == column) column++;
			}
			el.column=column;
		  }
		}else el.column=0;
	  }
	  
	  for(var i = 0; i < arrLen; i++){
		arr[i].totalColumns = 0;
		if(arr[i].cols.length>1){ 
		  var conflictGroup = []; 
		  var conflictingColumns = []; 
		  addConflictsToGroup(arr[i]);
		  function addConflictsToGroup(a) {
			for(k = 0;k < a.cols.length;k++) {
			  if(conflictGroup.indexOf(a.cols[k]) === -1) { 
				conflictGroup.push(a.cols[k]);
				conflictingColumns.push(arr[a.cols[k]].column);
				addConflictsToGroup(arr[a.cols[k]]); 
			  }
			}
		  }
		  arr[i].totalColumns = Math.max.apply(null, conflictingColumns);
		}
		arr[i].width = (600 / (arr[i].totalColumns+1)) + 'px';
		arr[i].left = (600 / (arr[i].totalColumns+1) * arr[i].column) + 'px';
	  }
	  return arr;
	}
	
	renderTimeLine(timeline);
	console.log(getMeetings(meetings));	
})();
