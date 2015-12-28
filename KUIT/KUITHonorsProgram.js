//***************************************************************************************************************
//***************************************************************************************************************
//
//  Incoming Freshmen Honors Program Form JavaScript
//  University of Kansas Information Technology
//  Arijit Basu | a549b010@ku.edu
//
//  Change Log: 
//              09-08-2015: Creation - Arijit Basu
//              
//
//
//                          
//
//***************************************************************************************************************
//***************************************************************************************************************
var flag;

function formLoad() {
    //flag=true; //Enable and set true if you want to display the hidden boxes, for Program go to xsl and change the display type
    //ToggleHiddenFields();
    //alert("start");
    //alert("If this is not your name, you have entered the wrong Student ID.\r\n"+"Please cancel out of this form and contact the Honors Program at honors@ku.edu for assistance in identifying your Student ID.");
	copyIntoTxtStudentId();
    copyIntoTxtName();
    copyIntoTxtEmail();
    loadEvents();
    requiredFields();
    setTimeout(function () {
     document.getElementById("txtStudentId").focus() }, 100);

    //alert("End");

}

/* Function to turn the required fields red */
function requiredFields() {
    //alert("Beg of REQ");
    var Requiredfields = Array("txtStudentId","txtName", "txtEmail", 'txtInternational', 'txtSemester');
    var returnVal = true;
    for (var i = 0; i < Requiredfields.length; i++) {
        if (i < 3) {
            //alert("i is less than 2");
            if ($('#' + Requiredfields[i]).val() == '') {

                $('#' + Requiredfields[i]).addClass("error"); // draw box
                document.getElementById(Requiredfields[i] + "star").style.color = "red";
                returnVal = false;
            } else {
                $('#' + Requiredfields[i]).removeClass("error");
                //alert("Turning black");
                document.getElementById(Requiredfields[i] + "star").style.color = "black";

            }
        } else if(i>=3){
        	//alert("Radio cases");
        	  if ($('#' + Requiredfields[i]).val() == '') {
                	//alert("Check radios");
                     document.getElementById(Requiredfields[i] + 'star').style.color = "red";
                } 
              else {
                    document.getElementById(Requiredfields[i] + 'star').style.color = "black";
                }


        }

    }

	if(document.getElementById("chkOptIn").checked == true){
    	document.getElementById("txtCertifyBox").style.color = "black";
        $('#chkOptIn').removeClass('error');
    }
	else if(document.getElementById("chkOptIn").checked == false){
         $('#chkOptIn').addClass('error');
	     document.getElementById("txtCertifyBox").style.color = "red";
     }
}


/* function that saves the SB*/
function saveChkBox(ele) {
    ele.nextSibling.value = ele.checked;
}

/* function to fill name and date input boxes*/
function signForm() {
    //alert("Entering signForm");
    var SignDate;
    var oNow = new Date();
    var month = oNow.getMonth() + 1;
    if (month <= 9)
        month = '0' + month;
    var year = oNow.getFullYear();
    var day = oNow.getDate();
    if (day <= 9)
        day = '0' + day;
    sSignDate = month + "/" + day + "/" + year;
	var cond1 = ((document.getElementById("txtInternational").value !=="")&&(document.getElementById("txtSemester").value !=="")&&(document.getElementById("hdnEmail").value !=="") );

    if (document.getElementById("chkOptIn").checked == true) {
    	if(cond1!=true){
		    alert("Please fill the fields marked with red asterisk");
    		document.getElementById("chkOptIn").checked = false;
    		return false;
    	}
        var names = document.getElementById("hdnName").value.split(',');
        var lastname = names[0];
        var firstname = '';
        if (names.length > 1) {
            var firstname = names[1];
        }
        var fullname = firstname + " " + lastname;
        //alert(fullname);
        if (fullname == ' ') {
            alert("Name should be filled");
            document.getElementById("chkOptIn").checked = false;
            return true;
        }
        document.getElementById("txtDisplayName").value = fullname;
        document.getElementById("txtSubmittedDate").value = sSignDate;
		document.getElementById("txtCertifyBox").style.color = "black";
        $('#chkOptIn').removeClass('error');
		document.getElementById("hdnchkOptIn").value = "true";
    }

     else if (document.getElementById("chkOptIn").checked == false) {
        document.getElementById("txtDisplayName").value = "";
        document.getElementById("txtSubmittedDate").value = "";
		document.getElementById("txtCertifyBox").style.color = "red";
        $('#chkOptIn').addClass('error');
		document.getElementById("hdnchkOptIn").value = "";
    }
    //alert("End of signForm");

}


/* functions that copies value to hidden Name textbox */
function copyIntoHiddenName() {
    //alert("Entering Child Value");
    var res = document.getElementById("txtName").value;
    var res1 = res.replace(/[" "]+/g, "");
    document.getElementById("hdnName").value = res1;
    document.getElementById("txtName").value = res1;
    requiredFields();
    if (document.getElementById("hdnName").value == "") {
        document.getElementById("chkOptIn").checked = false;
        document.getElementById("txtDisplayName").value = "";
    }


}

function copyIntoHiddenEmail() {
    document.getElementById("hdnEmail").value = document.getElementById("txtEmail").value;
    requiredFields();
}

function copyIntoHiddenId() {
    document.getElementById("hdnStudentId").value = document.getElementById("txtStudentId").value;
    requiredFields();
}

function copyIntoTxtName() {
    //alert("copying into txtbox for name");
    document.getElementById("txtName").value = document.getElementById("hdnName").value;
}

function copyIntoTxtEmail() {
    document.getElementById("txtEmail").value = document.getElementById("hdnEmail").value;
}

function copyIntoTxtStudentId() {
    document.getElementById("txtStudentId").value = document.getElementById("hdnStudentId").value;
}

function checkComma(ele) {
    var res = ele.value;
    //alert(res);
    if (res == '') return;
    if (res.indexOf(",") == -1) {
        //document.getElementById("hdnFirstName").value=document.getElementById("txtFirstName").value;
        //else if(!str.contains(",")){
        alert("Format should be Last,First");
        document.getElementById("hdnName").value = "";
        setTimeout(function () {
            document.getElementById("txtName").focus()
        }, 10);

    } else
        requiredFields();
}

/* function that copies student id to hidden StudentId text box */
function checkStudentIdLength() {
    //alert("start of length check");
    var StudentId = document.getElementById("txtStudentId").value;
    //alert(StudentId);
    if (StudentId != "") {
        if (StudentId.length < 7) {
            alert("ID is not 7 digits");
            document.getElementById("hdnStudentId").value = "";
            setTimeout(function () {
                document.getElementById("txtStudentId").focus()
            }, 10);
        }
    } else if (document.getElementById("txtStudentId").value.length == 7){
        document.getElementById("hdnStudentId").value = document.getElementById("txtStudentId").value;

    }
}

/* function that checks the Email Format */

function checkEmail() {
    var emailStr = document.getElementById("txtEmail").value;
    var re1 = '([\\w-+]+(?:\\.[\\w-+]+)*@(?:[\\w-]+\\.)+[a-zA-Z]{2,7})';
    var p = new RegExp(re1, ["i"]);
    var m = p.exec(emailStr);
    if (m != null) {
        var email1 = m[1];
        document.getElementById("hdnEmail").value = email1;
        
    } else {
        if (emailStr != "") {
            alert("Email is not in valid format");
            document.getElementById("hdnEmail").value = "";
            setTimeout(function () {
                document.getElementById("txtEmail").focus()
            }, 100);

        }
    }
}

function ToggleRadioAsterisk2(){
    requiredFields();
}

function ToggleRadioAsterisk1(){
	requiredFields();
	
}


/*Function to display all hidden textboxes that inject the xml strings  */
function ToggleHiddenFields() {
    var arrayOfHiddens = ['hdnName', 'hdnEmail', 'hdnStudentId', 'txtInternational', 'txtSemester'];
    if (flag === true) {

        for (var i in arrayOfHiddens) {
            document.getElementById(arrayOfHiddens[i]).style.display = 'block';
        }
    } else if (flag === false) {
        for (var i in arrayOfHiddens) {
            document.getElementById(arrayOfHiddens[i]).style.display = 'none';
        }
    }
}

function checkNumber(e) { // onKeystrokes 
    switch (e.keyCode) { // support for arrow keys
    case 37:
        return;
        break;
    case 38:
        return;
        break;
    case 39:
        return;
        break;
    case 40:
        return;
        break;
    default:
        break;
    }

    var allowedChars = '01234567890';
    //var Element = ((window.e)?(e.srcElement):(e.target));
    if (e.srcElement)
        var Element = e.srcElement;
    else
        var Element = e.target;

    //var msg =((e.srcElement)?(alert("SRC")):(alert("target")));
    var str = Element.value;
    if(str!="")
    	document.getElementById("txtStudentIdstar").style.color="black";
    else
    	document.getElementById("txtStudentIdstar").style.color="red";
    //if(str == e.target.value) {alert("Using Target");}
    for (var pos = 0; pos < str.length; pos++) { // check the string from last to first
        var tChar = String.fromCharCode(str.charCodeAt(pos));
        //alert(tChar);
        if (allowedChars.indexOf(tChar) == -1) {
            this.value = str.substring(0, pos) + str.substring(pos + 1, str.length);
            break;
        }
    }
}

/*List of events to be called on startup */
function loadEvents() {
    addEvent(document.getElementById('txtStudentId'), 'keyup', checkNumber);
    addEvent(document.getElementById('YesLabel'), 'click', labelClicksElement);
    addEvent(document.getElementById('NoLabel'), 'click', labelClicksElement);
    addEvent(document.getElementById('Fall_2016Label'), 'click', labelClicksElement);
    addEvent(document.getElementById('Spring_2016Label'), 'click', labelClicksElement);


}

/* Handler to attach an event*/
function addEvent(brw_obj, type, func) {
    //alert("start of addEvent")
    if (!brw_obj) {
        //alert("missing element during addEventListener " + type);
        return;
    }
    if (brw_obj.addEventListener) { // all browsers except IE < v9
        brw_obj.addEventListener(type, func, false);
    } else if (brw_obj.attachEvent) { // IE only for v < v9
        brw_obj["e" + type + func] = func;
        brw_obj[type + func] = function () {
            brw_obj["e" + type + func](window.event);
        }
        brw_obj.attachEvent("on" + type, brw_obj[type + func]);
    }
}

function labelClicksElement(e) { // for Checkbox & Radio labels 
  var tTargetName = e.srcElement.getAttribute("for");
  document.getElementById(tTargetName).click();  
}


function highlight_asterisk() {
    var arrayofreq = ['txtStudentIdstar','txtNamestar', 'txtEmailstar', 'txtInternationalstar', 'txtSemesterstar'];
    for (var i in arrayofreq) {

        document.getElementById(arrayofreq[i]).style.color = 'red';
        //alert('Give me Red');
    }

}

//Text box control - key-press = enter
function LookupKeyPressEMPLIDSearch(e) {
    //alert("Calling imgEMPLIDSearch_click");
    if (!e) e = window.event; // needed for cross browser compatibility

    if (e.keyCode == 13 || e.keyCode == 10) {
        imgEMPLIDSearch_click(document.getElementById('imgEmplIDSearch'));
        return true;
    } else {
        return true;
    }
}

//Button control - onclick
function imgEMPLIDSearch_click(ele) {
    //alert("Looking Id");
    var txtLookupEl = $(ele).previous();
    //alert(txtLookupEl);
    var fullName = "";

    if (txtLookupEl.disabled || txtLookupEl.readOnly || !txtLookupEl.val()) {
        alert("Please enter your 7 digit KUID and click the magnifying glass");
          setTimeout(function () {
            document.getElementById("txtStudentId").focus()
        }, 100);
        return false;
    }
    var params = new Array();
    params.push("SQL_PERSON");
    params.push(txtLookupEl.val());
    //alert(params);

    var data = iScriptLookup("KU_ADM_HonorsApp_eForm_Lookups", {
        params: params
    });
    //alert(data);

    if (!data || data.length == 0) {
        alert("You have entered an invalid Student ID. Please cancel out of the form and contact the Honors Program at honors@ku.edu for assistance.");
        setTimeout(function () {
            document.getElementById("txtStudentId").focus()
        }, 100);
        return false;
    }
    if (data.length == 1) {
        //alert("Employee Found");
        //document.getElementById('txtStudentId').value = data[0].EMPLID;
        if (data[0].MIDDLE_NAME != "") {
            fullName = data[0].LAST_NAME + "," + data[0].FIRST_NAME + " " + data[0].MIDDLE_NAME;
            //alert("The id matched with " + fullName);
            document.getElementById('txtName').value = fullName;
            document.getElementById('hdnName').value = fullName;
            /*alert("If this is not your name, you have entered the wrong Student ID.\n" +"Please cancel out of this form and contact the Honors Program for assistance in identifying your Student ID.");*/
            requiredFields();
        } else {
            fullName = data[0].LAST_NAME + "," + data[0].FIRST_NAME;
            //alert("The id matched with " + fullName);
            document.getElementById('txtName').value = fullName;
            document.getElementById('hdnName').value = fullName;
            /*alert("If this is not your name, you have entered the wrong Student ID. Please cancel out of the form and contact the Honors Program honors@ku.edu for assistance.");*/
            requiredFields();
        }    
        if(document.getElementById("txtName")!=""){
        	document.getElementById("txtNamestar").style.color="black";
        }


        
        alert("If this is not your name, you have entered the wrong Student ID. Please cancel out of the form and contact the Honors Program honors@ku.edu for assistance.");

        setTimeout(function () {
                document.getElementById("txtEmail").focus()
            }, 100);

    } else {
        alert("You have entered an invalid Student ID. Please cancel out of the form and contact the Honors Program honors@ku.edu for assistance.");
           setTimeout(function () {
                document.getElementById("txtEmail").focus()
            }, 100);
    }

    /*var params1 = new Array();
    params1.push("SQL_ACAD_PROG");
    params1.push(txtLookupEl.val());
    //alert(params1);
    var data1 = iScriptLookup("KU_ADM_HonorsApp_eForm_Lookups", {
        params: params1
    });

    if (!data1 || data1.length == 0) {
        //alert('You are not enrolled in any program.');
        return false;
    }
    if (data1.length == 1) {
        //alert(data1[0].ACAD_PROG);
        document.getElementById("hdnProgram").value = data1[0].ACAD_PROG;

    }*/

}

/************************************************
 * Call an iScript from a worksheet
 *
 * @param {String} scriptName Name of the iScript to be called
 * @param {String[]} params   Array of parameters to pass to iScript
 *
 * @return {JSON[]|String}  iScript will typically return a single value or an array of JSON elements
 ************************************************/
function iScriptLookup(scriptName, options) {
    this.options = {
        params: null,
        evalResponse: true
    }

    for (var option in options) {
        this.options[option] = options[option];
    }

    if (!this.options.params) {
        this.options.params = new Array();
        this.options.params.push("");
    }

    var arrInputs = new Array();
    for (var i = 0; i < this.options.params.length; i++) {
        var input = document.createElement("input");
        input.setAttribute('type', 'hidden');
        input.setAttribute('dbCall', scriptName);
        input.setAttribute('dbCall_param', (i + 1).toString());
        input.setAttribute('value', this.options.params[i]);

        document.body.appendChild(input);
        arrInputs.push(input);
    }

    var rtn = document.createElement("input");
    rtn.setAttribute('type', 'hidden');
    rtn.setAttribute('dbSet', scriptName);
    rtn.setAttribute('dbSet_param', "1");

    document.body.appendChild(rtn);

    var btn = document.createElement("input");
    btn.style.display = "none";
    btn.setAttribute('type', 'button');
    btn.setAttribute('dbCall_onclick', scriptName);
    btn.id = 'iScriptLookup';
    btn.name = 'iScriptLookup';

    document.body.appendChild(btn);
    if (document.createEventObject) {
        btn.fireEvent('onclick');
    } else {
        btn.click();
    }

    var rtnValue = rtn.value;

    for (var i = 0; i < arrInputs.length; i++) {
        document.body.removeChild(arrInputs[i]);
    }

    document.body.removeChild(rtn);
    document.body.removeChild(btn);

    if (this.options.evalResponse) {
        try {
            var results = eval(rtnValue);
        } catch (e) {
            alert("Failed to parse response from iScript Lookup");
            return false;
        }
    }
    return results;
}