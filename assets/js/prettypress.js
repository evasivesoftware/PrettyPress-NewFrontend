function prettypress( config ) {

	var ppglobal = this;

	if ( config ) {
		this.config = config;
	}

	this.active_editor = "markdown";

	//Hook editor and title.
	this.title_editor = document.getElementById("post-title");
	this.markdown_editor = document.getElementById("post-editor");


	//Find the iframe.
	this.iframe_handle = document.getElementById("prettypress-iframe");
	this.iframe_document = this.iframe_handle.contentDocument || this.iframe_handle.contentWindow.document;

	this.resize = function() {

		//Elements.
		this.markdown_editor_margin = this.markdown_editor.getBoundingClientRect().top + document.body.scrollTop - document.body.clientTop;

		//Window info.
		this.window_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		//Resize the editor.
		var editor_height = this.window_height - this.markdown_editor_margin - 20;
		this.markdown_editor.style.height = editor_height + "px";
	}

	this.hookelements = function() {

		//Hook elements in the iframe.
		this.content_handle = this.iframe_document.getElementById( this.config.content_rel );
		this.title_handle = this.iframe_document.getElementById( this.config.title_rel );

		if ( this.content_handle && this.title_handle ) {

			this.title_editor.onkeyup = function() {
				ppglobal.updatecontent('title');
			}

			this.markdown_editor.onkeyup = function() {
				ppglobal.updatecontent('content');
			}

			this.status = 1;
			return true;

		} else {
			return false;
		}

	}

	this.updatecontent = function( type ) {
		
		if ( type === "title" ) {
			//Update the title.

			//Get the title.
			var title = this.title_editor.value;

			//Set the title in the iframe.
			this.title_handle.innerHTML = title;


		} else {
			//Update the content.

			//Get the content.
			var content = this.getContent();

			//Push it over to the iframe.
			this.content_handle.innerHTML = content;

		}

	}

	this.getContent = function() {

		if ( this.active_editor === "markdown" ) {
			//Run through filter first.
			return marked( this.markdown_editor.value );
		}

	}

	window.onresize = function(){
		ppglobal.resize();
	};

	//Auto run "resize".
	this.resize();

	//Hook the elements.
	this.hookelements();


}

