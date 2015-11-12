
// entry point
function StartAMT() {

	console.time('startup');

	page = new page();
	parse_result = page.ParseURL();

	if (parse_result){
		
		setPageFormat();
		html5_supported = check_html5_video();
		if (html5_supported) {
			loadVideo();
			renderButtons();
		}

	}else{
		
		return;
	}	
		
	console.timeEnd('startup');
};

// Using parameters in page var to set up the webpage format
function setPageFormat(){
		
		// Put image and choice side-by-side
		$('#anno_region').append("<div id = 'loading'> Loading video ... </div>" + 
										 "<div id = 'video'>  </div>" +
										 "<div id = 'choice'> </div>" +
										 "<br style='clear: left;' />" +
										 "<br> </br> "  
										);
			
		$('#anno_region').width('100%');
		$('#loading').css({'float':'left'});
		$('#video').css({'float':'left'});
		$('#choice').css({'float':'left'});

};

function check_html5_video(){

	var supported = false;
	var v = document.createElement('video');	
	if(v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
       supported = true;
	}

	if (supported == false){

		var html_str = "Your browser does not support HTML5 video.";
		$('#loading').text(html_str);
   	document.getElementById('main_media').style.visibility = 'visible';

		return false;
	}

	return true;
};

function loadVideo(){

	var video_name = page.video_name;
	var video_url = 'https://elmo.csail.mit.edu/visual-hint/videos/' + video_name
	var html_str = '<video width="560" controls>'
					+  '  <source src="' + video_url + '" type="video/mp4" id = "myVideo">'
					+  'Your browser does not support HTML5 video.'
					+ '</video>'
					;
	$('#video').append(html_str);	

	var v = document.getElementsByTagName('video')[0];
	v.onended = function(e) {
		video_finished = true;
		$("#mt_submit").text('Submit HIT');
	}	

	document.getElementById('loading').style.visibility = 'hidden';
	document.getElementById('loading').style.display = 'none';
   document.getElementById('main_media').style.visibility = 'visible';

}


function onChange(){
	var items = document.getElementsByName("score");
	for (var element in items) {
		if (items[element].checked){
			selected_value = items[element].value;
			//console.log(selected_value);
			$('#selected_value').val(selected_value);
			setSubmitButtonVisibility();
		}
	}
}

function renderButtons(){

	var intro_str = '<table>'
			+ '<tr><td>'
			+ '<font size="4"><b> On a scale of 0-5, how relevant is this video to </font> <font size = 6> <u>dog</u></font>? </b></font>'         
		   + '</tr></td>' 
			+ '</table>';
	$('#choice').append(intro_str);
	var select_html_str = '<form>' +
								' <input type="radio" name="score" value="0" onchange="onChange()"> 0 <br>' +
								' <input type="radio" name="score" value="1" onchange="onChange()"> 1 <br>' +
								' <input type="radio" name="score" value="2" onchange="onChange()"> 2 <br>' +
								' <input type="radio" name="score" value="3" onchange="onChange()"> 3 <br>' +
								' <input type="radio" name="score" value="4" onchange="onChange()"> 4 <br>' +
								' <input type="radio" name="score" value="5" onchange="onChange()"> 5 <br>' +
								' </form>';
	$('#choice').append(select_html_str);

	var html_submit_str = ''
	html_submit_str = '<table>'
					+ '<tr>'
					+ '<td>'
					+ '<button disabled="true" type="button" style="height:50px; width:1000px" id="mt_submit" name="Submit" onclick="onSubmit(this);">Submit HIT </button>'
       			+ '</td>'
					+ '<td>'
      	 	   + '<form id="amt-form" action="' + submitURL + '">'
					+ '<input type="hidden" id="assignmentId" name="assignmentId" value="'+ page.assignmentId +'" />'
					+ '<input type="hidden" id="turkSubmitTo" name="turkSubmitTo" value="'+ page.turkSubmitTo +'" />'
					+ '<input type="hidden" id="hitId" name="hitId" value="'+ page.hitId +'" />'
					+ '<input type="hidden" id="workerId" name="workerId" value="'+ page.workerId +'" />'
					+ '<input type="hidden" id="video_name" name="video_name" value="' + page.video_name + '" />'
					+ '<input type="hidden" id="selected_value" name="selected_value" value="" />'
					+ '<input type="hidden" id="mt_comments" name="mt_comments" value="" />'
					//+ '<input disabled="true" type="submit" style="height:50px; width:1000px" id="mt_submit" name="Submit" value="Submit HIT" onclick="onSubmit(this);" />'
						//onmousedown="javascript:document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value;" />'
					+ '</form>'
					+ '</td></tr></table>';
				console.log(html_submit_str);

		$('#anno_region').append(html_submit_str);

}

// Processing the selection_list and choices_dict
// Post all labels in one shot
function onSubmit(event){
	
	console.log(selected_value);
	$('#selected_value').val(selected_value);
	document.getElementById("amt-form").submit();
};


function setSubmitButtonVisibility(){
	if (selected_value > -1 && video_finished) {
			document.getElementById("mt_submit").disabled = false;
	}else{
			console.log(video_finished);
			if (video_finished == false) {
				$("#mt_submit").text('Submit HIT (Please finish watching the video)');
			}
			document.getElementById("mt_submit").disabled = true;
	}
};
