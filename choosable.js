(function($){
    //var table = this;

	var _conf = {
		storeCookies:		true,
		cookiePrefix:		'choosable_',
		columnPrefix:		'',
		pinPopup:			false,
		popupText:			'Click to show menu.',
        menuType:	        'checkbox',  // the default menu type (checkbox, radio, select)
        leftOffset:         '10',
        
        // id
        idWrapper:			'ChoosableWrapperId',
        idPopup:			'ChoosablePopupId',
        idColumnMenu:		'ChoosableColumnMenuId',
        idMenuCheckbox:		'MenuCheckboxId',	// the menu div
        idMenuRadio:		'MenuRadioId',		// the menu div
        idMenuSelect:		'MenuSelectId',		// the menu div
        idSelectMenuCheckbox:	'SelectCheckboxId',	// the popup menu choice
        idSelectMenuRadio:	'SelectRadioId',		// the popup menu choice
        idSelectMenuSelect:	'SelectSelectId',		// the popup menu choice
        
        // classes
        clWrapper:			'ChoosableWrapper',
        clPopup:			'ChoosablePopup',
        clColumnMenu:		'ChoosableColumnMenu'
	};
	
	function idHelper(id)
	{
		return '#' + id;
	};
	function classHelper(class)
	{
		return '.' + class;
	};
	
	/**
     * class: Wrapper
	 * This is the class encapsulating the functionality of the wrapper element that holds all the DOM
	 * for this plugin.
	 */
	var _wrapper = function(table){
		/**
		 * id
		 * The unique identifier of the _wrapper element.
		 */
		var id = '#' + _conf.idWrapper;
		/**
		 * className
		 * The HTML class name that will be used for elements in the _wrapper. 
		 */
		var className =	'.' + _conf.clWrapper;
		/**
		 * _wrapper.initialized
		 * A boolean value representing whether or not the _wrapper object has been initialized.
		 */
		var initialized = false;
		/**
		 * private popup.init() (constructor)
		 * Initializes the popup object by creating the DOM that represents the popup. Hard coded
		 * CSS is also included.
		 */
		(function(table){
			// create a div to place the DOM components we are creating. This helps with our animations as well.
            var css = "position:relative;margin-left:"+ _conf.leftOffset +"px;font-family:helvetica, 'trebuchet ms', arial;font-size:0.8em;";

			var domStr = '<div id="'+ _conf.idWrapper +'" style="'+ css +'"></div>';
			
			$(table).before(domStr);
			
			initialized = true;
		})(table);
		
		/**
		 * public _wrapper.get()
		 * Retrieves the _wrapper DOM, which may then be added to the document. This method checks to make sure
		 * the _wrapper object has been initialized, and if not then it performs the initialization.
		 */
		this.get = function(){
			return $(id);
		};
	};
	
	/**
     * class: Popup
	 * This is a Class representing the Popup menu.
	 */
	var _popup = function(table, wrapper){
		/**
		 * The unique identifier for the _popup element.
		 */
		var id = '#' + _conf.idPopup;
		/**
		 * className
		 * The HTML class name that will be used for elements in the _popup. 
		 */
		var className = '.' + _conf.clPopup;
		/**
		 * _popup.initialized
		 * A boolean value representing whether or not the _popup object has been initialized.
		 */
		var initialized = false;
		/**
		 * _popup.init()
		 * Initializes the _popup object by creating the DOM that represents the _popup. Hard coded
		 * CSS is also included.
		 */
		(function(wrapper){
			// TODO get the cookie
			var choice = '<div>' +
							'<input id="'+ _conf.idSelectMenuCheckbox +'" type="radio" name="menuType" value="checkbox"/> <label for="'+ _conf.idSelectMenuCheckbox +'">checkbox</label>' + 
							'<input id="'+ _conf.idSelectMenuRadio +'" type="radio" name="menuType" value="radio"/> <label for="'+ _conf.idSelectMenuRadio +'">radio</label>' + 
							'<input id="'+ _conf.idSelectMenuSelect +'" type="radio" name="menuType" value="select"/> <label for="'+ _conf.idSelectMenuSelect +'">select</label>' +
						 '</div>';
			
			var css = 'left:0;bottom:0;display:none;position:absolute;float:left;background-color:#dddddd;border:solid 1px #bcbcbc;padding:5px;cursor:pointer;-moz-border-radius-topleft:10px;-moz-border-radius-topright:10px;-webkit-border-top-left-radius:10px;-webkit-border-top-right-radius:10px;font-weight:bold;';//height:20px;
			var domStr = '<div id="'+ _conf.idPopup +'" style="'+ css +'"><img src="choosable/images/close.png" alt="x" class="close" style="cursor:pointer;" /> ' +
							'<span>'+ _conf.popupText +'</span>' +
							choice +
						 '</div>';//<img src="images/minimize.png" alt="-" style="cursor:pointer;" />
			
			$(wrapper).append(domStr);
			bindEvents();
			
			// set the default menu type selected
			switch(_conf.menuType)
			{
			case 'checkbox':
				$(idHelper(_conf.idSelectMenuCheckbox)).attr('checked', 'checked');
				break;
			case 'radio':
				$(idHelper(_conf.idSelectMenuRadio)).attr('checked', 'checked');
				break;
			case 'select':
				$(idHelper(_conf.idSelectMenuSelect)).attr('checked', 'checked');
				break;
			default:
				$(idHelper(_conf.idSelectMenuCheckbox)).attr('checked', 'checked');
				break;
			}
			
			initialized = true;
		})(wrapper);
		
		/**
		 * _popup.get()
		 * Retrieves the _popup DOM, which may then be added to the document. This method checks to make sure
		 * the _popup object has been initialized, and if not then it performs the initialization.
		 */
		function get(){
			return $(id);
		};

        /**
         * _popup.bindEvents()
         * Handles binding the events that the user will use to interact with the popup menu. This
         * includes mousing over the table to display the popup menu.
         *
         * @param table The table to bind events to.
         */
        function bindEvents(){
			// Popup
            $(table).bind('mouseenter', function(){
                $(id).stop().slideDown();
            });
            $("input[name='menuType']").change(function(){
            	$(idHelper(_conf.idColumnMenu)).stop().slideDown();
            	$(id).stop().slideUp();
            });
            
            // Column Menu
            $(id + ' span').bind('click', function(){
                $('#' + _conf.idColumnMenu).stop().slideUp();
            });
            
            // Buttons
            $(id +' img.close').bind('mouseup', function(){
                $(this).attr('src', 'choosable/images/close.png');
                $(id).stop().slideUp();
            });
            $(id +' img.close').bind('mousedown', function(){
                $(this).attr('src', 'choosable/images/close-press.png');
            });
        };
	};
	
	/**
     * class: Menu
	 * This is the class encapsulating the functionality of the menu that allows the user to hide/show columns.
	 */
	var _menu = function(table, wrapper){
		/**
		 * The unique identifier for the _menu element.
		 */
		var id = '#' + _conf.idColumnMenu;
		/**
		 * className
		 * The HTML class name that will be used for elements in the _menu. 
		 */
		var className = '.' + _conf.clColumnMenu;
		/**
		 * _menu.initialized
		 * A boolean value representing whether or not the _menu object has been initialized.
		 */
		var initialized = false;
		/**
		 * _menu.init()
		 * Initializes the _menu object by creating the DOM that represents the _menu. Hard coded
		 * CSS is also included.
		 * 
		 * @requires _menu.table to be set prior to being called.
		 */
		(function(table, wrapper){
			
			if (table == null) return false;
			
			var menuCSS = "left:0;bottom:0;display:none;position:absolute;float:right;background-color:#dddddd;border:solid 1px #bcbcbc;padding:5px;-moz-border-radius-topleft:10px;-moz-border-radius-topright:10px;-webkit-border-top-left-radius:10px;-webkit-border-top-right-radius:10px;";//height:20px;
			
			var domStr = '<span id="'+ _conf.idColumnMenu +'" style="'+ menuCSS +'">';
				// add ability to close the domStr
            	domStr += '<img src="choosable/images/close.png" alt="x" class="close" style="cursor:pointer;" />';
			
			var menuCheckbox = '<div id="'+ _conf.idMenuCheckbox +'" style="display:none;">';
			var menuRadio = '<div id="'+ _conf.idMenuRadio +'" style="display:none;">';
			var menuSelect = '<div id="'+ _conf.idMenuSelect +'" style="display:none;">';
			
			// get all the columns for the table
			var columns = $('thead th', table).toArray();
            // the CSS to be inserted into the style attribute of each input
            var css = 'margin:5px 5px;';
            
            menuSelect += '<select multiple="multiple">';
			
			// add an input element for each column
			for (var i=0; i<columns.length; i++)
			{
				var text = 'Column ' + i;
				
				// change the default text if text exists
				if ($(columns[i]).text().length > 0)
				{
					text =  $(columns[i]).text();
				}
				
                menuCheckbox += createInput('checkbox', text, css);
                menuRadio += createInput('radio', text, css);
                menuSelect += createInput('select', text, css);
			}
			
			menuCheckbox += '</div>';
			menuRadio += '</div>';
			menuSelect += '</select></div>';
			
			domStr += menuCheckbox + menuRadio + menuSelect;
			domStr += '</span>';
			
			$(wrapper).append(domStr);
			bindEvents();
			show(_conf.menuType);
			
			initialized = true;
		})(table, wrapper);
		/**
		 * _menu.get()
		 * Retrieves the _menu DOM, which may then be added to the document. This method checks to make sure
		 * the _menu object has been initialized, and if not then it performs the initialization.
		 */
		function get(){
			return $(id);
		};
		/**
		 * _menu.show()
		 * Handles the displaying of the column menu.
		 * @param type A string of the type of menu to display.
		 * @return
		 */
		function show(type){
			switch(type)
			{
			case 'checkbox':
				$(idHelper(_conf.idMenuCheckbox)).show();
				$(idHelper(_conf.idMenuRadio)).hide();
				$(idHelper(_conf.idMenuSelect)).hide();
				break;
			case 'radio':
				$(idHelper(_conf.idMenuCheckbox)).hide();
				$(idHelper(_conf.idMenuRadio)).show();
				$(idHelper(_conf.idMenuSelect)).hide();
				break;
			case 'select':
				$(idHelper(_conf.idMenuCheckbox)).hide();
				$(idHelper(_conf.idMenuRadio)).hide();
				$(idHelper(_conf.idMenuSelect)).show();
				break;
			default:
				$(idHelper(_conf.idMenuCheckbox)).show();
				$(idHelper(_conf.idMenuRadio)).hide();
				$(idHelper(_conf.idMenuSelect)).hide();
				break;
			}
		};

        /**
         * createInput()
         * Creates the DOM that will represent the input to be used by the user to select which columns
         * to show or hide.
         *
         * @param text The text that will be displayed representing the column.
         * @return The HTML. Either <input> or <option> depending on the _conf.menuType option.
         */
        function createInput(type, text, css){
            if (css == undefined) css = '';
            // default is a checkbox
            var result = '<input type="checkbox" checked style="'+ css +'" /> ' + text;
            var inputId = text + 'InputId';
            
            switch (type)
            {
            case 'select':
                result = '<option selected="selected" value="'+ text +'">'+ text +'</option>';
                break;
            case 'checkbox':
                result = '<input id="'+ inputId +'" type="checkbox" checked style="'+ css +'" /> <label for="'+ inputId +'">'+ text +'</label>';
                break;
            case 'radio':
                result = '<input id="'+ inputId +'" type="radio" name="columns" style="'+ css +'" /> <label for="'+ inputId +'">'+ text +'</label>';
                break;
            }
            return result;
        };
        /**
         * _menu.bindEvents()
         * Handles binding the events that the user will use to interact with the menu.
         */
        function bindEvents(){
            $('#'+ _conf.idPopup +' span').bind('click', function(){
                $(id).stop().slideDown();
            });
            
            // Buttons
            $(id +' img.close').bind('mouseup', function(){
                $(this).attr('src', 'choosable/images/close.png');
                $(id).stop().slideUp();
            });
            $(id +' img.close').bind('mousedown', function(){
                $(this).attr('src', 'choosable/images/close-press.png');
            });

            // Menu Type
            $(idHelper(_conf.idSelectMenuCheckbox)).bind('click', function(){
            	show('checkbox');
            });
            $(idHelper(_conf.idSelectMenuRadio)).bind('click', function(){
            	show('radio');
            });
            $(idHelper(_conf.idSelectMenuSelect)).bind('click', function(){
            	show('select');
            });
            
            // Set the Events to hide/show the columns
            //
            // Bind inputs for the Checkbox menu type
            $(id +' input:checkbox').each(function(i){
                
                var col = '.' + _conf.columnPrefix + 'c' + i;
                var cookie = _conf.cookiePrefix + 'c' + i;
                    
                $(this).bind('click', function(){
                    if ($(this).is(':checked'))
                    {
                        $(col).show();
                        $.cookie(cookie, 1, { expires: 3 });
                    }
                    else
                    {
                        $(col).hide();
                        $.cookie(cookie, 0, { expires: 3 });
                    }
                });

                // load the cookie
                var toShow = $.cookie(cookie);

                if(toShow == 1 || toShow == null)
                {
                    $(this).attr('checked', true);
                    $(col).show();
                }
                else
                {
                    $(this).attr('checked', false);
                    $(col).hide();
                }
            });

            // Bind inputs for the Radio menu type
            $(id +' input:radio').each(function(i){
                
                var col = '.' + _conf.columnPrefix + 'c' + i;
                var cookie = _conf.cookiePrefix + 'c' + i;

                $(this).bind('click', function(){
                    $('.column').hide();
                    //$.cookie(cookie, 0, { expires: 3 });

                    if ($(this).is(':checked'))
                    {
                        $(col).show();
                        $.cookie(cookie, 1, { expires: 3 });
                    }
                });
            });


            // Bind inputs for the Select menu type
            $(id +' select').bind('change', function(){
                $(id +' select option').each(function(i){
                    
                    var col = '.' + _conf.columnPrefix + 'c' + i;
                    var cookie = _conf.cookiePrefix + 'c' + i;

                    if ($(this).is(':selected'))
                    {
                        $(col).show();
                        $.cookie(cookie, 1, { expires: 3 });
                    }
                    else
                    {
                        $(col).hide();
                        $.cookie(cookie, 0, { expires: 3 });
                    }
                });
            });

            // load cookies
            $(id +' select option').each(function(i){
                
                var col = '.' + _conf.columnPrefix + 'c' + i;
                var cookie = _conf.cookiePrefix + 'c' + i;

                var toShow = $.cookie(cookie);

                if(toShow == 1 || toShow == null)
                {
                    $(this).attr('selected', true);
                    $(col).show();
                }
                else
                {
                    $(this).attr('selected', false);
                    $(col).hide();
                }
            });
        };
	};
	
	/**
	 * _funcs
	 * The functions in the _funcs object are the functions used by the plugin itself. 
	 */
	var _funcs = {
		/**
		 * init()
		 * Initializes the plugin. Handles creating and inserting the DOM to be inserted, including the menu.
		 */
		init: function(table){
			_funcs.addMetaData(table);
			
			var wrapper = new _wrapper(table);//_wrapper.prependDOMTo(table);
			var popup = new _popup(table, $(idHelper(_conf.idWrapper)));//_popup.appendDOMTo(wrapper);
			var menu = new _menu(table, $(idHelper(_conf.idWrapper)));
            // we have to set the table property in the Menu class before we try to append the DOM
			//_menu.table = table;
			//var menu = _menu.appendDOMTo(wrapper);
			
			//_funcs.addMetaData(table);
			
            // we have to call bindEvents after adding meta data since the bind events require the meta data.
            // This should change in the future.
            //_menu.bindEvents();
            //_popup.bindEvents(table);

		    return true;
		},
        /**
         * The addMetaData() function handles adding all the meta data to the DOM so that
    	 * this plugin can use the data.
	     * 
	     * @param t The table table.
	     */
        addMetaData: function(t)
	    {
		    // add a class to each <td> element to indicate which column it is in.
		    $('tbody tr', t).each
		    (function(){
		        $('td', this).each
                (function(i){
			        $(this).addClass(_conf.columnPrefix+'c'+i);
                    $(this).addClass('column');
                });
		    });
		    $('thead tr', t).each
		    (function(){
		        $('th', this).each
		        (function(i){
			        $(this).addClass(_conf.columnPrefix+'c'+i);
                    $(this).addClass('column');
		        });
		    });
	    }
	 };
	
    /**
     * choosable()
     * The choosable plugin allows the user to simply call one method on a table giving them the ability
     * to hide or show columns. The settings can be saved via cookies so that each time the browser is
     * refreshed, the columns will stay hidden or shown.
     */
	$.fn.choosable = function(options)
	{
		var table = this;
		
		_conf = $.extend(_conf, options);

		// Handle each table jQuery finds.
		return this.each(function(){
			_funcs.init(table);
		});
		
//		return this;
	};
	
})(jQuery);
