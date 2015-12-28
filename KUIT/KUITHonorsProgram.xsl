<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" doctype-public="XSLT-compat" omit-xml-declaration="yes" encoding="utf-8" indent="yes"/>
  <!-- strip whitespace from whitespace-only nodes -->
  <xsl:strip-space elements="*"/>
  <xsl:template match="/page">
    <html>
	      <head>
	        <title>University Honors Program</title>
	        <link type="text/css" rel="stylesheet" href="KUITHonorsProgram.css"/>
	        <link type="text/css" rel="stylesheet" href="ender.css"/>
	        <!-- <script type="text/javascript" src="tcal.js"></script> -->

	        <script type="text/javascript" src="ender.js"></script>
	        <script type="text/javascript" src="ender-ui.js"></script>

	        <script type="text/javascript" src="KUITHonorsProgram.js"></script>  <!-- form-specific data/routines -->

	        <script type='text/javascript'>
	          <xsl:call-template name="translateStateInfo">
	            <xsl:with-param name="getCPs">true</xsl:with-param> 
	          </xsl:call-template>
	        </script>

	        <script language="JavaScript"> <!-- ImageNow/WebNow/FormServer variables --> 
	          var ClientType = '<xsl:value-of select="StateInfo/Client/Type" />';
	          var inImageNow = (ClientType == "ImageNow")?true:false;
	          var inWebNow = (ClientType == "WebNow")?true:false;
	          var inFormsServer = (ClientType.toUpperCase() == "FORMVIEWER" || ClientType.toUpperCase() == "IMAGENOW FORMS SERVER")?true:false;
	          var CurrentQueue = '<xsl:value-of select="StateInfo/CurrentQueueName" />';
	          var CurrentUser = '<xsl:value-of select="StateInfo/UserName" />';
	          var CurrentDocType = '<xsl:value-of select="StateInfo/DocKeys/DocType"/>';
	          var arrCurrentGroups = new Array();
	          <!-- if (ClientType != '') {
	            <xsl:for-each select="StateInfo/DocKeys/DocType">
	              arrCurrentGroups.push("<xsl:value-of select="GroupName"/>");
	            <xsl:for-each>
	          } -->
	          var documentId = '<xsl:value-of select="StateInfo/DocID" />';
	          var customProps = '<xsl:value-of select="StateInfo/customProperties" />';

	          var disableJavascript = 0;
	          if (disableJavascript) alert('Javascript is disabled (= FLATTEN Layout)'); 
	          <!-- short pages do 'hides' at bottom of FORM -->
	        </script>
	      </head>
       <body onload="formLoad();">
        <form name='frmWorksheet' id='frmWorksheet'>

          <div id="Page_Wrapper" name="Page_Wrapper">

            <div id="Section_Header" name="Section_Header"> <!-- Form header -->
              <table id="Header_Table" style="width: 100%">
                <tr>
                  <td id="Header_Logo">                  
                    <img src='KUsighorz2C-193-50.png'/> <!-- KUsighorz2C-193-50.png -->
                  </td>
                  <td id="Header_Text">
                    <h2 id="Header_Title">Incoming Freshman Application</h2>
                    <!-- <h4 id="Header_SubTitle">&#160;</h4> -->
                  </td>
                </tr>
              </table>
			    <table id ="Header_Table2">
              	<tr>
              	  <td>
                	<h4>University Honors Program</h4>
                  </td>
              	</tr>
              </table>
            </div>

            <div id="Section_Wrapper" name="Section_Wrapper">

              <div id="Section_Wrapper_Text" name="Section_Wrapper_Text"> <!-- Form helper text --> 
                <!-- <br /> -->
           
                  <br />
   					<p style="font-size:14px;color:#222222">Please be sure you have also submitted an application for admission to the University. Admission to the University Honors Program is highly competitive. All applications go through a comprehensive review process. While no ACT/SAT or GPA scores guarantee acceptance or denial, last year accepted students averaged a 32 ACT composite and a 3.95 unweighted GPA. Because the curriculum, resume, and essay are all reviewed, students with test scores and grades lower than these averages may be accepted.</p>
   					<p><label class="star">*</label> = required field</p>
              </div>
              
              <div id="Main_Blue_Wrapper" name="Main_Blue_Wrapper" class="Blue_Wrapper" style="display:block">
                  <div id="Section_Main_Header" name="Section_Main_Header" class="blue_header label_text">Student Information</div> <!-- text on blue bckgnd -->
                  <div id="Section_Main" name="Section_Main" width="100%"> <!-- content area -->
               <!-- Requestor Info -->
                          <div id="Requestor_label" class="label_text"></div>
		                  <table id="User_Name" class="tablesetting" width="95%"><!--  -->
		                  	<tr>
		                      <td>
		                        <div>
		                          <div id="txtStudentId1" for="txtStudentId1" class="label_text inline">Student ID (7 digits)<label id="txtStudentIdstar">*</label></div>
		                          <input type="text" name="txtStudentId" id="txtStudentId" title="KU ID" class="text_readonly Size_100" maxlength="7" onkeyup="copyIntoHiddenId();"  onchange="checkStudentIdLength();" onkeydown="LookupKeyPressEMPLIDSearch();">
		                          	   <xsl:attribute name="value">
		                              <xsl:value-of select="strStudentIdVisible"/>
		                            </xsl:attribute>
                                   </input>
		                          	<img name='imgEmplIDSearch' id='imgEmplIDSearch' class="image_padding" src='search_SM.png' onclick='imgEMPLIDSearch_click(this);' title='Lookup Employee' alt='Magnifier - Lookup Employee' />

		                        
		                          <input type="text" style="display:none" id="hdnStudentId">
		                          	  <xsl:attribute name="value">
		                              <xsl:value-of select="strStudentId"/>
		                            </xsl:attribute>
		                          </input>
		                        </div>
		                        <br />
		                        <div>
		                          <div id="txtFirstName_label" for="txtName" class="label_text inline">Name <label id="txtNamestar">*</label></div> <!-- text_readonly is not in use! -->
		                          <input type="text" name="txtName" id="txtName" title="Name" class="text_readonly Size_200" maxlength="30" readonly="true" onchange="copyIntoHiddenName();" onblur="checkComma(this); ">
		                            <xsl:attribute name="value">
		                              <xsl:value-of select="strFullNameVisible"/>
		                            </xsl:attribute>
		                          </input>
		                          
		                          <input type="text" style="display:none" id="hdnName"><!-- readonly="true" -->
		                          	  <xsl:attribute name="value">
		                              <xsl:value-of select="strFullName"/>
		                            </xsl:attribute>
		                          </input>
		                        </div>
		                      </td>
							  <td>
		                      	  <label class="info_label1">( Enter your Student ID and click the magnifying glass.</label>
		                      	  <br/>
								  <label class="info_label1">If you do not know your Student Id, please cancel out of</label>
								  <br/>
								  <label class="info_label1">the form and contact the Honors Program for assistance. )</label>
		                      </td> 

		                    </tr>
		                    <tr>
		                      <td>
		                       <!--  <div>
		                          <div id="txtFirstName_label" for="txtName" class="label_text inline">Name <label id="txtNamestar">*</label></div> 
		                          <input type="text" name="txtName" id="txtName" title="Name" class="text_readonly Size_200" maxlength="30" readonly="true" onchange="copyIntoHiddenName();" onblur="checkComma(this); "
		                          </input>
		                          
		                          <input type="text" style="display:none" id="hdnName">
		                          	  <xsl:attribute name="value">
		                              <xsl:value-of select="strFullName"/>
		                            </xsl:attribute>
		                          </input>
		                        </div> -->
		                      </td>

		                      <!--Hidden Field Program populated by lookup-->
		                       <td>
		                        <div>
		                          <input type="text" style="display:none" id="hdnProgram"><!-- readonly="true" -->
		                          	  <xsl:attribute name="value">
		                              <xsl:value-of select="strProgram"/>
		                            </xsl:attribute>
		                          </input>
		                        </div>
		                      </td>
		                      <!-- Ends -->

		                  </tr>
		                  </table>
		                  <table id="UserEmail" class="tablesetting" width="100%" style="display:block">
		                    <tr>
		                      <td>
		                        <div>
		                          <div id="txtEmail-label" for="txtEmail-label" class="label_text inline">Email <label id='txtEmailstar'>*</label></div>
		                          <input type="text" name="txtEmail" id="txtEmail" title="Email" maxlength="70" class="text_readonly Size_250" onkeyup="copyIntoHiddenEmail();" onblur="checkEmail()">
		                            <xsl:attribute name="value">
		                              <xsl:value-of select="strEmailVisible"/>
		                            </xsl:attribute>
		                          </input>
		                          <input type="text" style="display:none" id="hdnEmail" readonly="true" >
		                          	  <xsl:attribute name="value">
		                              <xsl:value-of select="strEmail"/>
		                            </xsl:attribute>
		                          </input>
		                        </div>
		                      </td>                      
		                    </tr>
		                  </table>
             
              <!-- Start of Section 2 -->
               
                  
                  <!-- College Info Info -->
			                <table id ="College_Information" class="tablesetting" width="95%" style="display:block">
			                	<tr>
			                		<td>
			                			<div>
				                			<div id="College_label" class="label_text"></div>
				                			<div class="label_text inline">Are you an international student? 
				                				<label id='txtInternationalstar'>*</label>
				                				<input type="radio" id="Yes" name="International_Student" value="Yes" class="radio" onclick="this.parentElement.lastChild.value = this.value;ToggleRadioAsterisk1();">
				                					<xsl:if test="strInternational='Yes'">
                                   					  <xsl:attribute name="checked">true</xsl:attribute>
                                                	</xsl:if>
				                				</input>
							                    <label id="YesLabel" for="Yes" class="label_text">Yes</label>

				                                <input type="radio" id="No" name="International_Student" value="No" class="radio" style="display:inline" onclick="this.parentElement.lastChild.value = this.value;ToggleRadioAsterisk1();">
				                                	  <xsl:if test="strInternational='No'">
                                                 		<xsl:attribute name="checked">true</xsl:attribute>
                                               		  </xsl:if>
				                                </input>
				                                <label id="NoLabel" for="No" class="label_text">No</label>

				                                <input id='txtInternational' type='text' style="display:none">
				                                	<xsl:attribute name="value">
			                                          <xsl:value-of select="strInternational"/>
			                                        </xsl:attribute>
				                                </input>
				                           </div>
			                           </div>
			                		</td>
			                	</tr>

			                	<tr>
			                		<td>
			                			<div>
			                				<div id="Application_Status" class="label_text"></div>
			                				<div class="label_text inline">Applying for: 
				                				<label id='txtSemesterstar'>*</label>

				                				  <input type="radio" id="Fall_2016" name="Application_Status" value="2016Fall" class="radio" style="display:inline" onclick="this.parentElement.lastChild.value = this.value;ToggleRadioAsterisk2();">
				                                	<xsl:if test="strSemester='2016Fall'">
                                   					  <xsl:attribute name="checked">true</xsl:attribute>
                                                	</xsl:if>
				                                </input>
				                                <label id="Fall_2016Label" for="Fall_2016" class="label_text">Fall 2016</label>

				                				<input type="radio" id="Spring_2016" name="Application_Status" value="2016Spring" class="radio" onclick="this.parentElement.lastChild.value = this.value; ToggleRadioAsterisk2();">
				                					 <xsl:if test="strSemester='2016Spring'">
                                   					    <xsl:attribute name="checked">true</xsl:attribute>
                                                	 </xsl:if>
				                				</input>
							                    <label id="Spring_2016Label" for="Spring_2016" class="label_text">Spring 2016</label>
                                                <!--Switched positions of Fall 2016 and Spring 2016 -->
				                              
				                                <input id='txtSemester' type='text' style="display:none">
				                                	<xsl:attribute name="value">
			                                  			<xsl:value-of select="strSemester"/>
			                                  		</xsl:attribute>
				                                </input> 
				                           </div>
			                			</div>
			                		</td>
			                	</tr>

			                	<tr>
			                		<td>
			                			<label class="label_text">Transcript</label>
			                			<label id='txtAttachmentStar' class="star">*</label>
			                			<label class="info_label"> (Please use the Attachment buttons below to upload your document)</label>
			                		</td>
			                	</tr>
			                	<tr>
			                		<td>
			                			<p class="info_label_text">
			                				As part of your application, you must submit a copy of your high school transcript for review by the admission committee. Please upload an official or unofficial, electronic copy. If necessary, you may submit your transcript separately to the Office of Admissions (submitting your transcript separately may result in a delay in considering your Honors application).
			                			</p>
			                		</td>
			                    </tr>
			                    <tr>
			                		<td>
			                			<label class="label_text">Resume</label>
			                			<label id='txtAttachmentStar' class="star">*</label>
			                			<label class="info_label"> (Please use the Attachment buttons below to upload your document)</label>
			                		</td>
			                	</tr>
			                	<tr>
			                		<td>
			                			<p class="info_label_text">
			                				Please upload your complete resume. This is used to better understand you and your involvement in activities outside the classroom, including extra-curricular, volunteer, and employment activities.
			                			</p>
			                		</td>
			                    </tr>

			                    <tr>
			                		<td>
			                			<label class="label_text">Essay</label>
			                			<label id='txtAttachmentStar' class="star">*</label>
			                			<label class="info_label"> (Please use the Attachment buttons below to upload your document)</label>
			                		</td>
			                	</tr>
			                	<tr>
			                		<td>
			                			<p class="info_label_text">
			                				Please respond to one of the following essay questions. Your essay will be evaluated for the quality of your writing and your ability to provide a focused response to the question you choose. Your response should demonstrate intellectual curiosity and academic rigor, and should be thoughtful, well-organized and free of grammatical and spelling errors. Please limit your response to 500 words.
			                			</p>
			                		</td>
			                    </tr>

			                    <tr>
			                    	<td>
			                    		<p class="info_label_question">
			                    			1.   Werner Heisenberg and Horace Lamb are attributed similar quotes. Heisenberg allegedly stated, "When I meet God, I am going to ask him two questions:  Why relativity? And why turbulence? I really believe he will have an answer for the first." What scientific truth would you seek if presented the opportunity? Why?
			                    		</p>
			                    	</td>
			                    </tr>
			                   
			                    <tr>
			                    	<td>
			                    		<p class="info_label_question">
			                    			 2.   Political philosophy is the analytical framework underpinning the evolution of ones conceptual, historical, ethical, and political views. Elucidate your own, personal, political philosophy.
			                    		</p>
			                    	</td>
			                    </tr>
			                    
			                    <tr>
			                    	<td>
			                    		<p class="info_label_question">
			                    			 3.   What if everything you have been taught is wrong?
			                    		</p>
			                    	</td>
			                    </tr>
			          </table>
			          <table>
			                	<tr>
			                		<td>
			                			<div for="chkOptIn" class="info_label_text1">
			                                    <div id="label_text" class="inline">
			                                        <input type="checkbox" id="chkOptIn" name="chkOptIn" onclick="saveChkBox(this); signForm();">
													<xsl:attribute name="value">
			                                        	<xsl:value-of select="blnOptIn" />
			                                        </xsl:attribute>
			                                        </input>
                                                    <label id='txtCertifyBox'>*</label>
			                                        
			                                        <b> &#160;I certify that these statements are correct and complete, and my essay is my original work, and I understand that omission or misrepresentation of information may invalidate admission to or continuation in the University of Kansas Honors Program.</b>
													
													 <input type="text" id="hdnchkOptIn" style="display:none">
			                                        	<xsl:attribute name="value">
			                                        	  <xsl:value-of select="hdnOptIn" />
			                                            </xsl:attribute>
			                                        </input>
			                                    </div>
			                                </div>
			                		</td>
			                	</tr>


			         </table>

	                 <table id="CheckIn">
	                    <tr>
	                      <td>
	                          <div for="txtStudentSignature" class="label_text inline">Full Name: </div>
	                              <input type="text" name="txtDisplayName" id="txtDisplayName" title="Submitted By" class="textbox_style Size_200" disabled="true">
	                                  <xsl:attribute name="value">
	                                  	<xsl:value-of select="strDisplayName" />
	                                  </xsl:attribute>
	                              </input>
							
	                         

	                      </td>
	                      <td>
	                        <label for="txtDepartmentApprovedDate" class="label_text inline">Date:</label>
	                            <input type="text" name="txtSubmittedDate" id="txtSubmittedDate" title="Date" class="textbox_style Size_150" disabled="true">
	                                <xsl:attribute name="value">
	                                	<xsl:value-of select="dateSubmittedDate" />
	                                </xsl:attribute>
	                            </input>
	                     
	                      </td>
	                    </tr>
	                  </table>
	                  <div class="label_text"></div>

	              </div> <!-- end of Section_Main-->
	              </div> <!-- end of Main_Blue_Wrapper-->
	              <!--End of Section 2 -->

	              </div> <!-- end of Section_Wrapper -->





            <div id="Section_Footer" name="Section_Footer"> <!--Footer--> 
              <table>
                <tr>
                  <td class="Section_Footer_Image">
                    <img alt="Jayhawk" src="jhwk_RF_50px.gif"/>
                  </td>
                  <td class="Section_Footer_Content">
                    The University of Kansas prohibits discrimination on the basis of race, color, ethnicity, religion, sex, national origin, age, ancestry, disability, 
                    status as a veteran, sexual orientation, marital status, parental status, gender identity, gender expression and genetic information in the 
                    University's programs and activities. &#160;Retaliation is also prohibited by university policy. &#160;The following person has been designated to handle inquiries regarding the non-discrimination policies: 
                    Director of the Office of Institutional Opportunity and Access, <a name="emaillink" class="emaillink">IOA@ku.edu</a>, 1246 W. Campus Road, Room 153A, Lawrence, KS, 66045, (785)864-6414, 711 TTY.
                  </td>
                </tr>
              </table>
              <input id="hdnCurrentQueuefromScript" type="text" class="Size_250" style="display:none">
              </input>
            </div>

          </div> <!-- end of Page_Wrapper -->
        </form>
      </body>
    </html>
  </xsl:template>

  <xsl:template name="translateStateInfo">
    <xsl:param name="getCPs"/>
    var stateInfo = new Object();
    <xsl:choose>
      <xsl:when test="count(StateInfo/DocKeys)">
        stateInfo.isDocument = true;
        stateInfo.isProject = false;
        stateInfo.docKeys = {
        <xsl:variable name="iters" select="count(StateInfo/DocKeys/node()[name() != ''])"/>
        <xsl:for-each select="StateInfo/DocKeys/node()[name() != '']">
          "<xsl:value-of select="name()"/>":"<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="."/></xsl:call-template>"<xsl:if test="position() != $iters">,</xsl:if>
        </xsl:for-each>
        };
        stateInfo.docId = "<xsl:value-of select="StateInfo/DocID"/>";
      </xsl:when>
      <xsl:otherwise>
        <!--<xsl:if test="count(StateInfo/Project)" >  Needed to switch this since Project information was added about 6.3, if needed in future releases, can be re-added in-->
        stateInfo.isDocument = false;
        stateInfo.isProject = true;
        stateInfo.projectInfo = {
        <xsl:variable name="iters" select="count(StateInfo/Project/node()[name() != ''])"/>
        <xsl:for-each select="StateInfo/Project/node()[name() != '']">
          "<xsl:value-of select="name()"/>":"<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="."/></xsl:call-template>"<xsl:if test="position() != $iters">,</xsl:if>
        </xsl:for-each>
        };
        <!--</xsl:if>-->
      </xsl:otherwise>
    </xsl:choose>

    <xsl:if test="$getCPs != '' and $getCPs != '0' and $getCPs != 'false'">
      <xsl:variable name="cpCount" select="count(StateInfo/CustomProperties/ActualValues/CustomProperty)"/>
      stateInfo.customProperties = {
      <xsl:for-each select="StateInfo/CustomProperties/ActualValues/CustomProperty">
        "<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="Name"/></xsl:call-template>":"<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="Value"/></xsl:call-template>"<xsl:if test="position() != $cpCount">,</xsl:if>
      </xsl:for-each>
      };
    </xsl:if>

    <xsl:choose>
      <xsl:when test="count(StateInfo/Client) > 0">
        stateInfo.clientType = "<xsl:value-of select="StateInfo/Client/Type"/>";
        stateInfo.clientVersion = "<xsl:value-of select="StateInfo/Client/Version"/>";
      </xsl:when>
      <xsl:otherwise>
        stateInfo.clientType = ((document.createEventObject)?"ImageNow":"WebNow");
        stateInfo.clientVersion = "";
      </xsl:otherwise>
    </xsl:choose>

    stateInfo.groups = [];
    <xsl:for-each select="StateInfo/UserGroups/UserGroup">
      <xsl:choose>
        <xsl:when test="GroupName != ''">
          stateInfo.groups.push("<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="GroupName"/></xsl:call-template>");
        </xsl:when>
        <xsl:otherwise>
          stateInfo.groups.push("<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="GroupDescription"/></xsl:call-template>");
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
    stateInfo.currentQueue = "<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="StateInfo/CurrentQueueName"/></xsl:call-template>"
    stateInfo.userName = "<xsl:call-template name="cleanQuote"><xsl:with-param name="string" select="StateInfo/UserName"/></xsl:call-template>"
  </xsl:template>

  <xsl:template name="cleanQuote">
    <xsl:param name="string"/>
    <xsl:if test="contains($string, '&#x22;')">
      <xsl:value-of select="substring-before($string, '&#x22;')" />\"<xsl:call-template name="cleanQuote"><xsl:with-param name="string"><xsl:value-of select="substring-after($string, '&#x22;')" /></xsl:with-param></xsl:call-template>
    </xsl:if>
    <xsl:if test="not(contains($string, '&#x22;'))">
      <xsl:value-of select="$string"/>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
