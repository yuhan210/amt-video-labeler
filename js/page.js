// Set up the parameters for the page

function page(){
	
	this.assignmentId = null;	
	this.hitId = null;
	this.workerId = null;
	this.video_name_a = null;
	this.video_name_b = null;
	this.turkSubmitTo = null;

	this.ParseURL = function () {
		var url = document.URL;
		var idx = url.indexOf('?');
		if ( (idx != -1) ){ // there are parameters in the url

			var par_str = url.substring(idx + 1, url.length);

			do { // iterate through all the parameters
				idx = par_str.indexOf('&');
				var par_tag;

				if (idx == -1) par_tag = par_str;
				else par_tag = par_str.substring(0, idx);
				
				var par_field = this.getURLField(par_tag);
				var par_value = this.getURLValue(par_tag);
			
				if (par_field == 'assignmentId')	{
					this.assignmentId = par_value;
				}
				if (par_field == 'hitId') {
					this.hitId = par_value;	
				}
				
				if (par_field == 'workerId')	{
					this.workerId = par_value;	
				}
			
				if (par_field == 'video_name_a') {
					this.video_name_a = par_value;
				}
				if (par_field == 'video_name_b') {
					this.video_name_b = par_value;
				}
			
				if (par_field == 'turkSubmitTo') {	
					if (par_value.indexOf("sandbox") >= 0) {
						submitURL = externalSubmitURLsandbox;
					}else{
						submitURL = externalSubmitURL;
					}
					this.turkSubmitTo = par_value;
				}
		
				
				console.log('field: ' + par_field + ' value:' + par_value);
				
				par_str = par_str.substring(idx+1, par_str.length);

			}while(idx != -1); // end of parsing all parameters
			
			
			/** handle conditions **/
			if (this.assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE'){

				window.location = "https://elmo.csail.mit.edu/visual-hint/instruction.html";
				return false;	
			}

		}else{ // URL contains no parameters

			// Use a default example
			this.video_name_a = "blind_kellar_plays_fetch_Ha92yzmVv2s_3000_3149.mp4";
			this.video_name_b = "adorable_baby_lambs_5EbATpgZEMw_1650_1799.mp4";
		}
		return true;
	};


	// *****************
   // private methods:
	// ******************

	this.getURLField = function (str) {
		var idx = str.indexOf('=');
		return str.substring(0, idx);	
	};

	this.getURLValue = function (str) {
		var idx = str.indexOf('=');
		return str.substring(idx+1, str.length);
	};


}


