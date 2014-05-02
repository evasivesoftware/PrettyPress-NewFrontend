function prettypress( config ) {

	if ( config ) {
		this.config = config;
	}

	this.active_editor = "markdown";
	this.resize_active = 0;

	//Hook editor and title.
	this.title_editor = document.getElementById("post-title");
	this.markdown_editor = document.getElementById("post-editor");

	//Hook the tabs.
	this.tab_markdown = document.getElementById("markdown-tab");
	this.tab_meta = document.getElementById("meta-tab");

	//Hook the resize handle div.
	this.resize_handle = document.getElementById("prettypress-resize");
	this.resize_editor = document.getElementById("prettypress-editor-resize");
	this.resize_preview = document.getElementById("prettypress-preview-resize");

	//Wrappers
	this.editor_wrapper = document.getElementById("prettypress-editor");
	this.preview_wrapper = document.getElementById("prettypress-preview");

	//Get initial widths.
	this.editor_width = window.getComputedStyle( this.editor_wrapper ).width;
	this.preview_width = window.getComputedStyle( this.preview_wrapper ).width;


	//Find the iframe.
	this.iframe_handle = document.getElementById("prettypress-iframe");
	this.iframe_document = this.iframe_handle.contentDocument || this.iframe_handle.contentWindow.document;

	//Triggers.
	this.trigger_post_meta = document.getElementById("prettypress-trigger-post-meta");

	var ppglobal = this;

	this.resize = function() {

		//Elements.
		this.markdown_editor_margin = this.markdown_editor.getBoundingClientRect().top + document.body.scrollTop - document.body.clientTop;

		//Window info.
		this.window_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
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

	this.resizePort = function() {

		//Resize the port.
		ppglobal.editor_wrapper.style.width = ppglobal.editor_width;
		ppglobal.preview_wrapper.style.width = ppglobal.preview_width;

		//Move the resize handle to the edge of the post editor.
		ppglobal.resize_handle.style.left = ppglobal.editor_width;

	}

	this.resize_handle.onmousedown = function() {

		ppglobal.resize_active = 1;

		//Show the overlays.
		ppglobal.resize_editor.style.display = "block";
		ppglobal.resize_preview.style.display = "block";

		//Add the "no select class"
		return false;

	}

	this.toggle_editor = function( editorEnable ) {
		
		var element_hide;
		var element_enable;

		if ( ppglobal.active_editor === "markdown" ) {
			//Hide markdown.
			element_hide = ppglobal.tab_markdown;
		}

		//element to enable.
		if ( editorEnable === "meta" ) {
			element_enable = ppglobal.tab_meta;
		}

		//Animation.
		element_hide.classList.add("animated");
		element_hide.classList.add("rollOut");

		window.setTimeout(function(){

			element_hide.style.display = "none";

			element_enable.classList.add("animated");
			element_enable.classList.add("fadeIn");
			element_enable.style.display = "block";

		},500);

	}

	document.onmouseup = function() {

		ppglobal.resize_active = 0;
		
		//Hide the overlays.
		ppglobal.resize_editor.style.display = "none";
		ppglobal.resize_preview.style.display = "none";

		//Resize the divs.
		ppglobal.resizePort();

	}

	window.onresize = function(){
		ppglobal.resize();
	};

	window.onmousemove = function(e) {

		if ( ppglobal.resize_active === 1 ) {

			var x;

			if ( e.pageX ) { 
			  x = e.pageX;
			}

			else { 
			  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			}

			var xpreview = ppglobal.window_width - x;

			ppglobal.resize_editor.style.width = x + "px";
			ppglobal.resize_preview.style.width = xpreview + "px";

			ppglobal.editor_width = x + "px";
			ppglobal.preview_width = xpreview + "px";

		}

	}

	this.trigger_post_meta.onclick = function(e) {
		
		e.preventDefault();
		ppglobal.toggle_editor("meta");

		this.classList.add("active");
		return false;

	}


	//Auto run "resize".
	this.resize();

	//Hook the elements.
	this.hookelements();


}

