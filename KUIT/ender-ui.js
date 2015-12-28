var gWebNow = (document.createEventObject == null);

!function (context) {
    context.Console = Console;

    var KEY_ENTER = (gWebNow) ? 10 : 9;
    var KEY_UP = 38;
    var KEY_DOWN = 40;

    function addEvent(element, type, func) {
        if (window.addEventListener) {
            element.addEventListener(type, func, false);
        } else {
            element.attachEvent('on' + type, func);
        }
    }

    this.isIE = document.createEventObject;

    function hasClass(node, name) {
        return (' ' + node.className + ' ').indexOf(' ' + name + ' ') != -1;
    }

    function getAncestorByClass(node, className) {
        for (var parent = node; parent; parent = parent.parentNode) {
            if (hasClass(parent, className)) return parent
        }
    }

    /**
     * @class
     * A Javascript console that can be used for form debugging.
     *
     * The console is automatically added to the Form.  Pressing ctrl+` (tilde key) will display the console
     */
    function Console() {
        var self = this;
        addEvent(document, 'keyup', function (evt) {
            var code = 192;

            if (evt && evt.ctrlKey && evt.keyCode == code) {
                if (!self.visible) self.show();
                else self.hide();
            }
        });
        addEvent(window, 'load', function() {
         self.generateMarkup();
        });
    }

    Console.prototype = {
        visible: false,
        groups: null,
        logWindow: null,
        commandHistory: [],
        commandHistoryIdx: null,

        generateMarkup: function () {
            var self = this;

            var div = document.getElementById('console');
            if (!div) {
                var fbFrame = document.createElement("table");
                fbFrame.cellPadding = "0";
                fbFrame.cellSpacing = "0";
                fbFrame.border = "1"
                fbFrame.id = 'console';
                fbFrame.style.display = 'none'
                fbFrame.style.width = "100%"


                var tbody = document.createElement('tbody');
                fbFrame.appendChild(tbody);

                var row = document.createElement("tr");
                row.id = 'fbTop';
                var col = document.createElement("td");


                var fbToolbar = document.createElement("div");
                fbToolbar.id = "fbToolbar";

                fbToolbar.innerHTML = "Form Developer's Console";

                row.appendChild(col);
                col.appendChild(fbToolbar);

                tbody.appendChild(row);

                var row = document.createElement("tr");
                var col = document.createElement("td");


                row.appendChild(col);
                tbody.appendChild(row);

                var logWindow = document.createElement("div");
                logWindow.id = "console-logWindow";

                logWindow.style.width = document.body.clientWidth - 30;
                col.appendChild(logWindow);

                var row = document.createElement("tr");
                var col = document.createElement("td");

                row.appendChild(col);
                tbody.appendChild(row);

                var fbCommandBox = document.createElement("div");
                fbCommandBox.id = "fbCommandBox"
                col.appendChild(fbCommandBox);

                var fbCommandIcon = document.createElement("div");
                fbCommandIcon.style.display = 'inline';
                fbCommandIcon.innerHTML = ">>>";

                var fbCommandLine = document.createElement("input");
                fbCommandLine.type = 'text';
                fbCommandLine.id = 'fbCommandLine';

                this.commandLine = fbCommandLine;

                fbCommandBox.appendChild(fbCommandIcon)
                fbCommandBox.appendChild(fbCommandLine);


                addEvent(fbCommandLine, 'keypress', function(e) {
                    if(e.keyCode == KEY_ENTER)
                    {
                        self.evalCommand();
                    }
                });

                addEvent(fbCommandLine, 'keydown', function(e) {
                    if(e.keyCode == KEY_UP)
                    {
                        self.keyUp();
                    }
                    else if(e.keyCode == KEY_DOWN)
                    {
                        self.keyDown();
                    }
                })



                document.body.appendChild(fbFrame);
                addEvent(logWindow, 'selectstart', function () {
                    return false;
                })

                this.logWindow = logWindow;
                this.fbFrame = fbFrame;
            }
        },
        keyUp: function() {
            if(this.commandHistoryIdx === null)
            {
                this.commandHistoryIdx = this.commandHistory.length - 1;
            }
            else
            {
               this.commandHistoryIdx = this.commandHistoryIdx - 1;
            }

            if(this.commandHistoryIdx < 0)
            {
               this.commandHistoryIdx = 0;
            }

            if(this.commandHistory[this.commandHistoryIdx])
                this.commandLine.value = this.commandHistory[this.commandHistoryIdx];
        },
        keyDown: function() {
          if(this.commandHistoryIdx === null)
           {
               return false;
           }
           else
           {
               if(this.commandHistory.length > (this.commandHistoryIdx + 1))
                   this.commandHistoryIdx = this.commandHistoryIdx + 1;
           }

           if(this.commandHistory[this.commandHistoryIdx])
            this.commandLine.value = this.commandHistory[this.commandHistoryIdx];
        },
        evalCommand: function() {
            var strErr = '';
            var strResults = '';
            try
            {
                this.commandHistory.push(this.commandLine.value);
                this.commandHistoryIdx = null;
                strResults = eval(this.commandLine.value);
            }
            catch(e)
            {
                strErr = e.message
            }


            if(strResults)
                this.log(strResults);

            if(strErr > '')
            {
                this.error(strErr);
            }

            this.commandLine.value = '';
        },
        show: function () {
            if (!this.logWindow) this.generateMarkup();

            this.fbFrame.style.display = 'block';
            this.visible = true;
        },
        hide: function () {
            var div = document.getElementById('console');
            div.style.display = 'none';
            this.visible = false;
        },
        append: function (elem) {
            if (!this.logWindow) {
                this.generateMarkup();
            }
            var container = this.getTopContainer();

            container.appendChild(elem);

            this.logWindow.scrollTop = this.logWindow.scrollHeight;
        },
        /**
         * Write an error message to the log windows
         */
        error: function () {
            var args = this.formatArgs(arguments);
            var l = document.createElement('div');
            l.className = 'console-logRow console-logRow-error';
            l.innerHTML = this.logObject(args);
            this.append(l);
        },
        /**
         * Write a message to the log window
         */
        log: function () {
            var args = this.formatArgs(arguments);
            var l = document.createElement("div");
            l.className = 'console-logRow';
            l.innerHTML = this.logObject(args)
            this.append(l)
        },
        formatArgs: function (args) {
            var format = args[0];
            if (args.length == 1) {
                return format;
            } else {
                args = Array.prototype.slice.apply(args);
                return args.join(" ");
            }

            return args;
        },
        /**
         * Group messages together in the log window.  The messages can then be hidden or shown together by clicking on the group label.  
         * You must call {@link Console#groupEnd} to stop grouping messages
         *
         * ### Example
         * 
         *      function formLoad()
         *      {
         *          console.group("Form Load")
         *          $("#txtVendorId").show();
         *          $("#txtPurchaseOrderId").hide();
         *          console.groupEnd()
         *      }       
         *
         * @param {String} label Label for the group        
         */
        group: function(label) {
            if (!this.groups) this.groups = []

            var args = arguments;

            var div = document.createElement("div");
            div.className = 'console-logGroup'
            div.innerHTML = "<span>-</span>&#xa0;&#xa0;" + label;
            this.append(div);

            addEvent(div, 'mousedown', function (event) {
                if ((isIE && event.button == "1") || !isIE && event.button == "0") {
                    var target = event.target || event.srcElement;

                    target = getAncestorByClass(target, 'console-logGroup');
                    if (target.nextSibling.style.display == 'none') {
                        target.nextSibling.style.display = 'block';
                        target.firstChild.innerHTML = "-";
                    } else {
                        target.nextSibling.style.display = 'none';
                        target.firstChild.innerHTML = "+";
                    }
                }
            })

            var groupBody = document.createElement("div");
            groupBody.className = "console-logGroupBody";
            this.append(groupBody);
            this.groups.push(groupBody);
        },
        /**
         * End message group.
         *
         * See {@link #group} for more information         
         */
        groupEnd: function() {
            if (this.groups && this.groups.length) this.groups.pop();
        },
        /**
         * Group messages together in the log windows with a default hidden state.
         *
         * See {@link Console#group} for more information.
         *
         * @param {String} label Label for the group
         */
        groupCollapsed: function(label) {
            if (!this.groups) this.groups = []
            var args = arguments;

            var div = document.createElement("div");
            div.className = 'console-logGroup'
            div.innerHTML = "<span>+</span>&#xa0;&#xa0;" + label;
            this.append(div);

            addEvent(div, 'mousedown', function (event) {
                if ((isIE && event.button == "1") || !isIE && event.button == "0") {
                    var target = event.target || event.srcElement;

                    target = getAncestorByClass(target, 'console-logGroup');
                    if (target.nextSibling.style.display == 'none') {
                        target.nextSibling.style.display = 'block';
                        target.firstChild.innerHTML = "-";
                    } else {
                        target.nextSibling.style.display = 'none';
                        target.firstChild.innerHTML = "+";
                    }
                }
            })

            var groupBody = document.createElement("div");
            groupBody.className = "console-logGroupBody";
            groupBody.style.display = 'none';
            this.append(groupBody);
            this.groups.push(groupBody);
        },
        /**
         * Start a timer that can be used to time events
         *
         * @param {String} name Label for the timer
         * @param {Boolean} reset True to reset the time
         */
        time: function(name, reset) {
            if (!name) {
                return;
            }

            var time = new Date().getTime();
            if (!this.timeCounters) {
                this.timeCounters = {}
            }
            var key = "KEY" + name.toString();
            if (!reset && this.timeCounters[key]) {
                return
            }
            this.timeCounters[key] = time
        },
        /**
         * Stop timer 
         *
         * @param {String} name Label for the timer to stop
         */
        timeEnd: function(name) {
            var time = new Date().getTime();
            if (!this.timeCounters) {
                return
            }
            var key = "KEY" + name.toString();
            var timeCounter = this.timeCounters[key];
            if (timeCounter) {
                var diff = time - timeCounter;
                var label = name + ": " + diff + "ms";
                this.log(label);
                delete this.timeCounters[key]
            }
            return diff
        },
        getTopContainer: function () {
            if (this.groups && this.groups.length) {
                return this.groups[this.groups.length - 1];
            } else return this.logWindow;
        },
        /**
         * Clear log window
         */
        clear: function() {
            for(var i=0; i<this.logWindow.children.length; i++)
            {
                this.logWindow.removeChild(this.logWindow.children[0]);
            }
        },
        logObject: function (obj) {
            var separator = "<br />";
            var output = "";
            output += "<div>"
            if (typeof (obj) == "number") {
                output += obj.toString();
            }
            else if (typeof (obj) == "string") {
                output += '<span class="console-objectBox-text">' + obj + '</span>';
            }
            else if (typeof (obj) == "object") {
                if(isNode(obj)) {
                    output += "<code>" + htmlEntities(obj.outerHTML) + "</code>";
                }
                else if(obj instanceof ender) {
                    for(var i=0; i<obj.length; i++) {
                        this.logObject(obj[i])
                    }
                }
                else if (obj instanceof Array) {
                    output += "[<ul style='list-style-type:none'>"

                    for (var prop in obj) {
                        output += "<li>" + this.logObject(obj[prop]) + "</li>";
                    }

                    output += "</ul>]"
                } else {
                    output += "{<ul style='list-style-type:none'>"
                    for (var prop in obj) {
                          output += "<li>" + prop + ": ";
                          if (typeof (obj[prop]) == "string") {
                              output += "<span>" + obj[prop] + "</span>";
                          } else {
                              output += this.logObject(obj[prop]);
                          }
                          output += "</li>";
                        }
                    output += "</ul>}"
                }
            }
            else if(typeof(obj) == "function") {
                output += htmlEntities(obj.outerHTML);
            }

            output += "</div>"

            return output
        }
    }

    if (typeof (INFormConsole) === "undefined") {
        INFormConsole = new Console();
        context.console = INFormConsole;
    }

    function isNode(el) {
        return (el && el.nodeType && (el.nodeType == 1 || el.nodeType == 9))
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

}(this)

function inArray(a, obj) {
    for (var i = (a.length - 1); i >= 0; i--) {
        if (a[i] === obj) {
            return i;
        }
    }
    return -1;
}

/**
 * @class Grid.Column
 * Represents a column on the grid
 */
/**
 * @property {String} key iScript Column Name that data will be bound to
 */
/**
 * @property {String} label Name of column that will displayed on the grid
 */
/**
 * @property {Boolean} visible Determine whether or not the column will be visible in the grid
 */ 

/**
 * @class Grid
 * Represents a Table of Data that allows row selection
 *
 * ### Example
 *
 *     var myData = [
 *         {
 *             name: "Bob"
 *             email: "Bob@company.com"
 *             empNum: "123"
 *         },
 *         {
 *             name: "Susan"
 *             email: "Susan@company.com"
 *             empNum: "123"
 *         }
 *     ];
 *     
 *     var myColumns = [
 *         {
 *             key: 'name',
 *             label: 'Name',
 *             visible: true,
 *         },
 *         {
 *             key: 'email',
 *             label: 'Email',
 *             visible: true,
 *         },
 *         {
 *             key: 'empNum',
 *             label: 'Emp #',
 *             visible: false,
 *         }
 *     ];
 *     
 *     var myGrid = new Grid($("#GridElem"), {
 *         data: myData,
 *         columns: myColumns
 *     });
 *
 *
 * @constructor
 * Creates a new grid
 *
 * @param {HTMLElem} elem HTML element that the grid will be rendered to
 * @param {Object} options Config Options
 */
var Grid = $.klass(function (elem, options) {
    this.options = {
        /**
         * @cfg {Object}
         * Initial Data to be displayed in the Grid
         */
        data: "",
        /**
         * @cfg {Object[]}
         * Array of column definition objects which define all columns that appear in the grid       
         * ### Configuring Columns
         * see {@link Grid.Column} for more information
         *     columns: [
         *         {
         *             key: 'name',
         *             label: 'Name',
         *             visible: true,
         *         },
         *         {
         *             key: 'email',
         *             label: 'Email',
         *             visible: true,
         *         },
         *         {
         *             key: 'empNum',
         *             label: 'Emp #',
         *             visible: false,
         *         }
         *     ]
         */
        columns: ""
    };

    for (var i in options) {
        this.options[i] = options[i];
    }

    this.element = elem;
    this._create();
}).methods({
    selectedRow: null,
    _create: function () {
        var self = this;
        var table = this.table = $(document.createElement("table"));
        table[0].width = "100%"
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        table.append(thead);
        table.append(tbody);
        table.appendTo(this.element);

        this.attachEvents();
    },
    attachEvents: function() {
        var self = this;
        this.table.find("tbody").delegate("tr", 'click', function() {
            self._onClick();
        })
    },
    detachEvents: function() {
        this.table.find("tbody").undelegate("click");
    },
    columns: function (cols) {
        if(arguments.length > 0)
            this.options.columns = cols;
        else
            return this.options.columns;
    },
    data: function (data) {
        if(arguments.length > 0)
        {
            this.options.data = data;
        }
    },
    render: function() {
        var self = this;
        var tHead = this.table.find("thead");
        var tBody = this.table.find("tbody");
        var row = document.createElement("tr");

        var data = self.options.data;
        if (!data || data.length == 0) {
            var td = document.createElement("td");
            row.appendChild(td);
            tBody.append(row);
        }

        var columns = new Array();
        if (this.options.columns && this.options.columns.length > 0) {
            columns = this.options.columns;
        } else {
            columns = new Array();
            for (var i in data[0]) {
                var colObj = new Object();
                colObj.key = i;
                colObj.label = i;
                columns.push(colObj);
            }
            this.options.columns = columns;
        }

        for (var i = 0; i < columns.length; i++) {
            if (typeof(columns[i].visible) !== undefined && columns[i].visible === false) continue;

            var th = document.createElement("td");
            th.className = "grid-header-column";
            if(columns[i].label > '')
              th.innerHTML = columns[i].label.replace(/_/g, " ");
            row.appendChild(th);
        }

        tHead.append(row);

        for (var i = 0; i < data.length; i++) {
            var row = document.createElement("tr");
            if ((i % 2) == 1) {
                row.className = "grid-row-odd";
            } else {
                row.className = "grid-row-even";
            }

            for (var j = 0; j < columns.length; j++) {
                if (typeof(columns[j].visible) !== undefined && columns[j].visible === false) continue;
                var td = document.createElement("td");
                var val = data[i][columns[j]["key"]];
                if (typeof (val) == "string") {
                    val = val.replace("\n", "<br />")
                }
                td.innerHTML = val;
                td.id = i
                td.className = "grid-cell";
                row.appendChild(td);
            }

            tBody.append(row);
        }
    },
    /**
     * Redraw the grid
     */
    refresh: function() {
        this.table.find('thead').empty();
        this.table.find("tbody").empty();
        this.render();
    },
    dataChanged: function () {
        this.render();
    },
    destroy: function () {
        this.detachEvents();
        this.element.removeChild(this.table[0]);
    },
    _onClick: function () {
        var self = this;
        var a = event.srcElement;

        if (self.selectedRow) {
            self.selectedRow.removeClass("grid-row-highlighted");
        }

        var a = $(event.srcElement).closest("TR").addClass("grid-row-highlighted");

        self.selectedRow = a;

        $(this).trigger('selectionChanged.Grid');
    },
    /**
     * Get Data for Selected Row
     */
    getRowData: function () {
        if (!this.selectedRow) return null;
        var rtnObj = new Object();
        var columns = this.options.columns;
        var data = this.options.data;
        var row = this.selectedRow.get(0);
        var p = row.parentNode;
        var idx = inArray(p.childNodes, row);

        for (var j = 0; j < columns.length; j++) {
            rtnObj[columns[j]["key"]] = data[idx][columns[j]["key"]];
        }

        return rtnObj;
    }
});

$.ender({
    extend: function () {
        var args = Array.prototype.slice.call(arguments);
        var org = args.shift();
        for (var i = 0, c = args.length; i < c; i++) {
            var prop = args[i];
            for (var name in prop) {
                org[name] = prop[name];
            }
        }
        return org;
    }
});

!function (context) { /* Utility functions */

    function bindEventHandler(element, eventName, handler) {
        if (element.addEventListener) {
            // The standard way
            element.addEventListener(eventName, handler, false);
        } else if (element.attachEvent) {
            // The Microsoft way
            element.attachEvent('on' + eventName, handler);
        }
    }

    /**
     * @class Dialog
     * A dialog is a floating window that contains a title bar and a content area.
     *
     *
     * @constructor
     * Create a new Dialog Instance
     * @param {HTMLElement} el HTML element that will be displayed as a dialog
     * @param {Object} [options] Configuration options
     */
    Dialog = $.klass(function (el, options) {
        this.element = el;

        this.setOptions(options);

        this._create();
        this.init();
    }).methods({ /* handles to the dom nodes */
        container: null,
        header: null,
        body: null,
        actions: null,
        buttons: null,
        _wrapper: null,
        _zIndex: 0,
        options: {},
        setOptions: function (options) {
            this.options = $.extend({}, {
                /**
                 * Width of the dialog box in pixels
                 * @cfg {Number}
                 */
                width: 400,             
                top: 90,
                /**
                 * When autoOpen is true the dialog will open automatically when Dialog is called.  If false it will stay hidden until Dialog.open is called
                 * @cfg {Boolean}
                 */
                autoOpen: true,
                /**
                 * Determines wheter closing the dialog also destroys it completely
                 * @cfg {Boolean}
                 */
                destroyOnClose: true,
                /**
                 * If enabled the dialog box can be closed by pressing the escape key
                 * @cfg {Boolean},
                 */
                closeOnEsc: true,
                buttons: {}
            }, options)
        },
        init: function() {
            if(this.options.autoOpen)
            {
                this.open();
            }
        },
        /**
         * Display the dialog
         */
        open: function () {
            this._makeTop();
            var ws = this._wrapper.style;
            ws.left = document.body.scrollLeft + (document.body.clientWidth - this.options.width) / 2 + 'px';
            ws.top = (document.body.scrollTop || document.documentElement.scrollTop) + this.options.top + 'px';
            this._overlay.style.display = 'block';
            ws.visibility = 'hidden'
            ws.display = 'block';

            if (gWebNow) {
                this.hideControls();
            }

            ws.visibility = 'visible'

            /**
             * @event open
             * Fires after the Dialog is displayed on the screen
             */
            $(this).trigger("open.Dialog");
        },

        /**
         * Closes the dialog
         */
        close: function () {
            if (this.options.destroyOnClose) {
                this.destroy();
            } else {
                this._wrapper.style.display = 'none';
                this._overlay.style.display = 'none';
            }

            if (gWebNow) {
                this.showControls();
            }
        },

        /**
         * Add buttons to the dialog actions panel after creation
         * @param {object} buttons Object with property name as button text and value as click handler
         * @param {boolean} prepend If true, buttons will be prepended to the panel instead of being appended
         */
        addButtons: function (buttons, prepend) {
            var actions = this.actions;
            var buttonArray = this._makeButtons(buttons);
            var first = null;
            if (prepend && (first = actions.firstChild) != null) {
                for (var i in buttonArray) {
                    actions.insertBefore(buttonArray[i], first);
                }
            } else {
                for (var i in buttonArray) {
                    actions.appendChild(buttonArray[i]);
                }
            }

            return buttonArray;
        },

        /**
         * Change (or set) title after creation
         * @param {string} title The dialog title
         */
        setTitle: function (title) {
            if (!this.header) {
                var header = document.createElement('div');
                header.className = 'dialog-header';
                this.container.insertBefore(header, this.body);
                this.header = header;
            }
            this.header.innerHTML = title;
        },

        /**
         * Makes the dom tree for the dialog
         * @private
         */
        _create: function () {
            if (this._wrapper) {
                return; // Avoid duplicate invocation
            }

            if (typeof this.options.title == 'string' && this.options.title != '') {
                var header = document.createElement('div');
                header.className = 'dialog-header';
                header.innerHTML = this.options.title;
                this.header = header;
            }

            this._overlay = document.createElement('div');
            this._overlay.className = 'dialog-overlay';
            this._overlay.style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            this._overlay.style.width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
            if (!gWebNow) {
                this._overlay.style.backgroundColor = "#F0F0F0"
                this._overlay.style.filter = "alpha(opacity=50)";
            }
            document.body.appendChild(this._overlay);

            // {begin dialog body
            var content = document.createElement('div');
            content.className = 'dialog-content';

            this.element.appendTo(content);
            this.element.show();

            this.content = content;

            //   {begin actions panel
            var table = $("<table class='dialog-actions' width='98%'><tbody><tr><td></td></tr></tbody></table>")
            var actions = table.find("td")[0] //document.createElement('div');
            actions.className = 'dialog-buttons';
            var buttons = this._makeButtons(this.options.buttons);
            if (buttons.length > 0) {
                for (var i in buttons) {
                    actions.appendChild(buttons[i]);
                }
            }
            this.buttons = buttons;
            this.actions = actions;
            //   }end actions panel
            var body = document.createElement('div');
            body.className = 'dialog-body';
            body.appendChild(content);
            body.appendChild(table[0]);
            this.body = body;
            // }end dialog body

            var wrapper = this._wrapper = document.createElement('div');
            wrapper.className = 'dialog-wrapper';
            var ws = wrapper.style;
            ws.position = 'absolute';
            ws.width = this.options.width + 'px';
            ws.display = 'none';
            ws.outline = 'none';

            if(this.header)
              wrapper.appendChild(header);
            wrapper.appendChild(body);
            // register keydown event
            if (this.options.closeOnEsc) {
                    wrapper.tabIndex = -1;
                    this._onKeydown = this._makeHandler(function(e) {
                            if (!e) {
                                    e = window.event;
                            }
                            if (e.keyCode && e.keyCode == 27) {
                                    this.close.apply(this);
                            }
                    }, this);
                    bindEventHandler(wrapper, 'keydown', this._onKeydown);
            }

            document.body.appendChild(wrapper);

            if (Dialog.needIEFix) {
                this._fixIE();
            }
        },
        /**
         * Removes the nodes from document
         * @private
         * @param {object} buttons Object with property name as button text and value as click handler
         * @return {Array} Array of buttons as dom nodes
         */
        _makeButtons: function (buttons) {
            var buttonArray = new Array();
            for (var buttonText in buttons) {
                var button = document.createElement('button');
                button.className = 'dialog-button';
                button.innerHTML = buttonText;

                bindEventHandler(button, 'click', this._makeHandler(buttons[buttonText], this));

                buttonArray.push(button);
            }
            return buttonArray;
        },

        /**
         * A helper function used by makeButtons 
         * @private
         */
        _makeHandler: function (method, obj) {
            return function (e) {
                method.call(obj, e);
            }
        },

        /**
         * A helper function used by open 
         * @private
         */
        _makeTop: function () {
            if (this._zIndex < Dialog.Manager.currentZIndex) {
                this._zIndex = this._wrapper.style.zIndex = Dialog.Manager.newZIndex();
            }
        },

        /**
         * @private
         */
        _fixIE: function () {
            var width = document.documentElement["scrollWidth"] + 'px';
            var height = document.documentElement["scrollHeight"] + 'px';

            var iframe = document.createElement('iframe');
            iframe.className = 'iefix';
            iframe.style.width = width;
            iframe.style.height = height;
            this._wrapper.appendChild(iframe);
        },

        /**
         * Removes the nodes from document
         * @private
         */
        destroy: function () {
            if(this._wrapper)
            {
              document.body.removeChild(this._wrapper);
              document.body.removeChild(this._overlay);
              this.container = '';
              this.header = "";
              //this.body = null;
              this.content.style.display = 'none';
              document.body.appendChild(this.content);
              this.content = "";
              this.actions = "";
              this._wrapper = "";
            }
        },
        isBehind: function (elem) {
            var div = this._wrapper;
            var bottom = div.offsetTop + div.offsetHeight;
            var right = div.offsetLeft + div.offsetWidth;
            var top = div.offsetTop;
            var left = div.offsetLeft;

            var elemTop = elem.offsetTop;
            var elemLeft = elem.offsetLeft;
            var temp = elem.offsetParent;
            //Have to loop to the top adding the offsets from the containing parent(TD, Table, Body)
            while (temp != null) {
                elemTop += temp.offsetTop;
                elemLeft += temp.offsetLeft;
                temp = temp.offsetParent;
            }

            var elemRight = elemLeft + elem.offsetWidth;
            var elemBottom = elemTop + elem.offsetHeight;
            if (((left <= elemLeft && elemLeft <= right) || (left <= elemRight && elemRight <= right)) && ((top <= elemTop && elemTop <= bottom) || (top <= elemBottom && elemBottom <= bottom))) {
                return true;
            } else {
                return false;
            }
        },
        hideControls: function () {
            var elems = document.forms[0].elements;
            for (var i = 0; i < elems.length; i++) {
                if (this.isBehind(elems[i]) && !this.checkParentNodesForId(elems[i])) {
                    var zIdx = elems[i].style.zIndex;
                    if (!zIdx) {
                        zIdx = 1;
                    }
                    if (zIdx == 0) {
                        elems[i].style.zIndex = -1;
                    } else if (zIdx > 0) {
                        elems[i].style.zIndex = zIdx * -1;
                    }
                }
            }
        },
        showControls: function () {
            var elems = document.forms[0].elements;
            for (var i = 0; i < elems.length; i++) {
                var zIdx = elems[i].style.zIndex;
                if (!zIdx) {
                    zIdx = -1;
                }
                if (zIdx < 0) elems[i].style.zIndex = zIdx * -1;
            }
        },

        checkParentNodesForId: function (elem) {
            var elems = this._wrapper.getElementsByTagName("input");
            for (var i = 0; i < elems.length; i++) {
                if (elems[i] === elem) {
                    return true;
                }
            }
            return false;
        }
    });

    Dialog.needIEFix = (function () {
        var userAgent = navigator.userAgent.toLowerCase();
        return /msie 6/.test(userAgent) && !/opera/.test(userAgent) && !window.XMLHttpRequest;
    })();

    // This simple object manages the z indices
    Dialog.Manager = {
        currentZIndex: 3000,
        newZIndex: function () {
            return ++this.currentZIndex;
        }
    };

    context["Dialog"] = Dialog;
}(this)

/** 
 * A Dialog that contains a search text box and a {@link Grid}
 *
 * # Example
 *
 *     var columns = [
 *         {key: "VendorID", label: "ID"},
 *         {key: "VendorName", label: "Name"}
 *     ];
 *      
 *     var d = new SearchDialog($.id('SearchDialog'), {
 *         title: 'Vendor Name Search',
 *         source: "PS_AP_eForm_Lookups",
 *         columns: columns,
 *         params: ["VENDOR_NAME"],
 *         minSearchChars: 0,
 *         onRowDblClick: function() {
 *             if(this.searchGrid)
 *             {
 *                 var vendor = this.searchGrid.getRowData();
 *                 if(vendor)
 *                 {
 *                     $.id('txtVendorName').val(vendor.VendorName)
 *                     $.id('txtVendorID').val(vendor.VendorID);
 *                     lookupVendorAddress(vendor.VendorID);
 *                 }
 *             }
 *             this.close();
 *         }
 *     })
 *
 *
 */
var SearchDialog = Dialog.extend(function (el, options) {
    //   this.init();
    this.onRowDblClick = this.options.onRowDblClick;
    /**
     * @property {Grid} searchGrid The grid object
     */
    })
.methods({
    setOptions: function(options) {
        this.supr();

        $.extend(this.options, {
            /**          
             * @cfg {String}
             * iScript name that will be run on search
             */
            source: null,
            /**
             * @cfg {Column[]}
             * Array of column definition objects which define all columns that appear in the grid.
             * See {@link Grid#columns} for more information
             */
            columns: null,
            /**          
             * @cfg {Object}
             * Initial set of data to display in the grid
             */
            data: null,
            buttons: null,
            /**          
             * @cfg {String[]}
             * Array of parameters that will be sent to the iScript
             */
            params: null,
            /**          
             * @cfg {Boolean}
             * Determine whether or not to show the search text box
             */
            allowSearch: true,
            /**          
             * @cfg {Function}
             * Function called when a Grid Item Row has been double clicked
             */
            onRowDblClick: function() {},
            /**          
             * @cfg {Number}
             * Minimun number of characters required to trigger the iScript Search
             */
            minSearchChars: 3
        }, options)
    },
    init: function() {
        this.supr();

        this._data = this.options.data;
        if(this.options.allowSearch === false && this._data === null)
        {
            this.executeSearch();
        }
        else
        {

            if(this._data)
            {
                this.refresh();
            }
        }
    },
    _create: function () {
        var self = this;
        this.supr();

        var buttons = {
            "Ok" : function() {
                this.onRowDblClick.apply(self);
            },
        "Cancel" : function() {
                this.close();
            }
        }
        buttons = this.addButtons(buttons);

        this.buttons = buttons;

        var table = document.createElement('table');
        var tbody = document.createElement('tbody');
        var row = document.createElement('tr');
        var searchControls = document.createElement('td');
        table.appendChild(tbody);
        tbody.appendChild(row);
        row.appendChild(searchControls);

        if(this.options.allowSearch)
        {
            this.content.appendChild(table);
            searchLabel = $("<span>Search:&#xa0;</span>").appendTo(searchControls)

            searchInput = (this.searchInput = $("<input id='txtSearchDialog' name='txtSearchDialog' type='text' />")).appendTo(searchControls).css({
              "padding-right": "3px",
              "margin-right": "3px"
            }).bind('keydown', function (e) {
                var charCode = e.which ? e.which : e.keyCode;
                if (document.createEventObject == null && charCode == 10) // webnow enter key pressed
                {
                    self.executeSearch()
                } else if (charCode == 13) {
                    self.executeSearch();
                }
            });

            searchButton = (this.searchButton = $("<button class='dialog-button' style='height:1.6em; width:2em;'>Go</button>"))
                .appendTo(searchControls)
                .bind("click", function () {
                    self.executeSearch();
                });

            if(!gWebNow)
            {
                searchButton[0].style.padding = "0px";
            }
        }

        var computedWidth = this.options.width - 30;

        this.uiSearchGrid = $("<div></div>")
            .appendTo(this.content)
            .css('height', "200px")
            .css("width", computedWidth + "px")
            .attr('id', 'uiSearchGrid');

        this.searchGrid = new Grid(this.uiSearchGrid[0]);

        $(this.searchGrid).bind("selectRow.Grid", function() {
          self.selectHighlightedRow();
        })

        this.searchResultStatus = $("<td><label></label></td>")
            .insertBefore(this.actions)
            .css("width", "150px")

        this.searchResultStatus[0].style.width = "250px"

        $(this.uiSearchGrid).bind('dblclick', function() {
            if(self.searchGrid && self.searchGrid.selectedRow)
            {
                self.selectHighlightedRow();
            }
        })

        if(this.options.allowSearch)
        {   

            $(self).bind('open.Dialog', function(e) {
              self.searchInput[0].focus();
            });
        }

        // if(this._data && this._data.length > 0)
        // {
        //  $(self).bind('open.Dialog', function(e) {
        //    self.refresh();
        //  });
        // }
    },
    destroy: function () {
        $(this).unbind('open.Dialog');
        if(this.options.allowSearch)
        {
            this.searchInput.unbind('keydown');
            this.searchButton.unbind('click');
        }
        this.searchGrid.destroy();

        this.supr();
    },
    executeSearch: function () {
        var self = this;

        if(this.options.allowSearch)
        {
            var searchVal = this.searchInput.val();
            if(searchVal.length < this.options.minSearchChars)
            {
              this.searchResultStatus.html("<font color='red'>Please enter at least " + this.options.minSearchChars + " characters.</font>");
              return false;
            }
        }

        var params = new Array().concat(this.options.searchParams || []);
        if(this.options.allowSearch)
            params.push(this.searchInput.val());
        this._data = iScriptLookup(this.options.source, {
            params: params
        });

        this.refresh();
    },
    /**
     * Refresh the data in the grid
     */
    refresh: function() {
        if (!this._data) {
            this._data = new Array();
        }

        this.searchGrid.columns(this.options.columns);
        this.searchGrid.data(this._data);

        this.searchGrid.refresh();

        this.uiSearchGrid.css('overflow', 'auto')

        this.searchResultStatus.html(this._data.length + " results found.");
    },
    selectHighlightedRow: function () {
        $(this).trigger("rowSelected.SearchDialog");

        if(this.buttons && this.buttons.length > 0)
        {
            this.buttons[0].click();
        }
    },
    onRowDblClick: function() {

    }
});