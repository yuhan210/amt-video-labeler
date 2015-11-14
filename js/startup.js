
// entry point
function StartAMT() {

	console.time('startup');

	page = new page();
	parse_result = page.ParseURL();

	if (parse_result){
		
		setPageFormat();
		html5_supported = check_html5_video();
		if (html5_supported) {
			loadVideos();
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
		$('#anno_region').append("<div id = 'loading'> Loading videos, please wait. (It takes 5 - 10 secs)    </div>" +
										 "<div id = 'video_container'> </div>" +
										 "<div id = 'choice'> </div>" +
	   								 "<div id = 'submit_region'> </div>" + 
										 "<br> </br> "  
										);
			
		$('#anno_region').width('100%');
		$('#video_container').width('100%');
		document.getElementById('video_container').style.visibility = 'hidden';

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

		return false;
	}

	return true;
};


function getVideoURL(video_name) {

	return 'https://elmo.csail.mit.edu/visual-hint/videos/' + video_name;
}

function canPlayVideoA() {
		console.log('a is loaded');
		video_loaded_a = true;
		setLoadingMsgVisibility();
}

function canPlayVideoB() {
		console.log('b is loaded');
		video_loaded_b = true;
		setLoadingMsgVisibility();
}
function endedVideoA() {
		console.log('a has ended');
		video_finished_a = true;
		setSubmitButtonVisibility();
		$("#mt_submit").text('Submit HIT');
}

function endedVideoB() {
		console.log('b has ended');
		video_finished_b = true;
		setSubmitButtonVisibility();
		$("#mt_submit").text('Submit HIT');
}
function loadVideos(){

	var video_name_a = page.video_name_a;
	var video_name_b = page.video_name_b;
	var video_url_a = getVideoURL(video_name_a);
	var video_url_b = getVideoURL(video_name_b);
	var html_str = '<table style = "width:100%">' 
					+  '<tr> <td align = "center"><font size = 8> <b>Video A</b></td>'
   			   +  '     <td align = "center"><font size = 8> <b>Video B</b></td></tr>'
					+  '<tr><td align = "center"> <video width="560" controls oncanplay="canPlayVideoA()" onended = "endedVideoA()">'
					+  '<source src="' + video_url_a + '" type="video/mp4" id = "videoa">'
					+  'Your browser does not support HTML5 video.'
					+  '</video> </td> '
					+  '<td align = "center"> <video width="560" controls oncanplay="canPlayVideoB()" onended = "endedVideoB()">'
					+  '<source src="' + video_url_b + '" type="video/mp4" id = "videob">'
					+  'Your browser does not support HTML5 video.'
					+  '</video> </td></tr> </table>';
	
	$('#video_container').append(html_str);	
	

}

function setLoadingMsgVisibility(){
	if (video_loaded_a && video_loaded_b) {
		document.getElementById('loading').style.display = 'none';
		document.getElementById('video_container').style.visibility = 'visible';
	}
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

	var intro_str = '<br><table>'
			+ '<tr><td>'
			+ '<font size="4"><b> When searching videos using keyword: </font> <font size = 7> <u>"dog"</u></font> <font size = "4">, which video is more relevant? </b></font>'         
		   + '</tr></td>' 
			+ '</table>';
	$('#choice').append(intro_str);
	var select_html_str = '<form>' +
								' <input type="radio" name="score" value="A" onchange="onChange()"> Video A <br>' +
								' <input type="radio" name="score" value="B" onchange="onChange()"> Video B <br>' +
								' </form>';
	$('#choice').append(select_html_str);

	var html_submit_str = ''
	html_submit_str = '<table style = "width: 100%">'
					+ '<tr>'
					+ '<td>'
					+ '<button disabled="true" type="button" style="height:50px; width:100%" id="mt_submit" name="Submit" onclick="onSubmit(this);">Submit HIT </button>'
       			+ '</td>'
					+ '<td>'
      	 	   + '<form id="amt-form" action="' + submitURL + '">'
					+ '<input type="hidden" id="assignmentId" name="assignmentId" value="'+ page.assignmentId +'" />'
					+ '<input type="hidden" id="turkSubmitTo" name="turkSubmitTo" value="'+ page.turkSubmitTo +'" />'
					+ '<input type="hidden" id="hitId" name="hitId" value="'+ page.hitId +'" />'
					+ '<input type="hidden" id="workerId" name="workerId" value="'+ page.workerId +'" />'
					+ '<input type="hidden" id="video_name_a" name="video_name_a" value="' + page.video_name_a + '" />'
					+ '<input type="hidden" id="video_name_b" name="video_name_b" value="' + page.video_name_b + '" />'
					+ '<input type="hidden" id="selected_value" name="selected_value" value="" />'
					+ '<input type="hidden" id="mt_comments" name="mt_comments" value="" />'
					//+ '<input disabled="true" type="submit" style="height:50px; width:1000px" id="mt_submit" name="Submit" value="Submit HIT" onclick="onSubmit(this);" />'
						//onmousedown="javascript:document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value;" />'
					+ '</form>'
					+ '</td></tr></table>';
				//console.log(html_submit_str);

		$('#submit_region').append(html_submit_str);

}

// Processing the selection_list and choices_dict
// Post all labels in one shot
function onSubmit(event){
	
	console.log(selected_value);
	$('#selected_value').val(selected_value);
	document.getElementById("amt-form").submit();
};


function setSubmitButtonVisibility(){
	console.log(selected_value);
	console.log(video_finished_a);
	console.log(video_finished_b);
	
	if (selected_value != null && video_finished_a && video_finished_b) {
			document.getElementById("mt_submit").disabled = false;
	}else{
			if (video_finished_a == false || video_finished_b == false) {
				$("#mt_submit").text('Submit HIT (Please finish watching the videos)');
			}
			document.getElementById("mt_submit").disabled = true;
	}
};
