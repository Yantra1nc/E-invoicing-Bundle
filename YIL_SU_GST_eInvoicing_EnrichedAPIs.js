/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * File Name: YIL_SU_GST_eInvoicing_EnrichedAPIs.js
 * File ID: customscript_yil_su_gst_einv_enrichedapi
 * Date Created: 26 August 2020
 * Author: Pralhad Solanke
 * Company: Yantra Tech Innovation Lab Pvt. Ltd.
 * email: pralhad@yantrainc.com
 * Description: This script is used to call APIs related to GST e-Invoicing(Cygnet Enriched API) and storing response on Invoice record.
 */
/**
 * Script Modification Log:
 * 
    -- Date -- -- Modified By -- --Requested By-- -- Description --

 *
 */

define(['N/record','N/search','N/https','N/format','N/runtime','N/redirect','N/ui/serverWidget','N/config'],

		function(record,search,https,format,runtime,redirect,serverWidget,config) {

	function onRequest(context) {

		if (context.request.method === 'GET')
		{
			try 
			{
				log.debug("onRequest:Get","-----------------Script Execution Starts here-----------------");

				var AuthErrorValues = "";
				var s_Authtoken ="";
				//script object to get value of script parameter
				var objScript = runtime.getCurrentScript();

				var paramAPIDetailsRecId = objScript.getParameter({name:'custscript_yil_gst_einv_enriapidet_recid'});
				//log.debug('onRequest:GET','paramAPIDetailsRecId :'+paramAPIDetailsRecId); 
				//--------------------------------------------------- Starts - Get GST EInvoicing Enriched API details ----------------------------------------------------------------------//
				if(_logValidation(paramAPIDetailsRecId)){
					gstEinvoiceApiLookUp = search.lookupFields({ type:'customrecord_yil_gst_einv_api_details', id: paramAPIDetailsRecId, columns: ['custrecord_yil_gst_einv_auth_api_url', 'custrecord_yil_gst_einv_savedoc_api_url','custrecord_yil_gst_einv_savedocsts_api','custrecord_yil_gst_einv_cancel_einv_api','custrecord_yil_gst_einv_can_einv_sts_api','custrecord_yil_gst_einv_geteinv_resp_api','custrecord_yil_gst_einv_genewbbyirn_api','custrecord_yil_gst_einv_genewbbyirn_sts','custrecord_yil_gst_einv_cancel_ewb','custrecord_yil_gst_einv_cancel_ewb_sts'] });

					if(_logValidation(gstEinvoiceApiLookUp)){

						urlAuthAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_auth_api_url;
						//log.debug('onRequest:GET','urlAuthAPI=='+urlAuthAPI);
						if(_logValidation(urlAuthAPI)){
							urlAuthAPI = urlAuthAPI;
						}

						urlSaveDocAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_savedoc_api_url;
						//log.debug('onRequest:GET','urlSaveDocAPI=='+urlSaveDocAPI);
						if(_logValidation(urlSaveDocAPI)){
							urlSaveDocAPI = urlSaveDocAPI;
						}

						urlSaveDocStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_savedocsts_api;
						//log.debug('onRequest:GET','urlSaveDocStatusAPI=='+urlSaveDocStatusAPI);
						if(_logValidation(urlSaveDocStatusAPI)){
							urlSaveDocStatusAPI = urlSaveDocStatusAPI;
						}

						urlGetEinvoiceResponseAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_geteinv_resp_api;
						//log.debug('onRequest:GET','urlGetEinvoiceResponseAPI=='+urlGetEinvoiceResponseAPI);
						if(_logValidation(urlGetEinvoiceResponseAPI)){
							urlGetEinvoiceResponseAPI = urlGetEinvoiceResponseAPI;
						}

						urlCancelIRNAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_cancel_einv_api;
						//log.debug('onRequest:GET','urlCancelIRNAPI=='+urlCancelIRNAPI);
						if(_logValidation(urlCancelIRNAPI)){
							urlCancelIRNAPI = urlCancelIRNAPI;
						}
						urlCancelIRNStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_can_einv_sts_api;
						//log.debug('onRequest:GET','urlCancelIRNStatusAPI=='+urlCancelIRNStatusAPI);
						if(_logValidation(urlCancelIRNStatusAPI)){
							urlCancelIRNStatusAPI = urlCancelIRNStatusAPI;
						}

						urlGenerateEWBbyIRNAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_genewbbyirn_api;
						//log.debug('onRequest:GET','urlGenerateEWBbyIRNAPI=='+urlGenerateEWBbyIRNAPI);
						if(_logValidation(urlGenerateEWBbyIRNAPI)){
							urlGenerateEWBbyIRNAPI = urlGenerateEWBbyIRNAPI;
						}	
						urlGenerateEWBbyIRNStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_genewbbyirn_sts;
						//log.debug('onRequest:GET','urlGenerateEWBbyIRNStatusAPI=='+urlGenerateEWBbyIRNStatusAPI);
						if(_logValidation(urlGenerateEWBbyIRNStatusAPI)){
							urlGenerateEWBbyIRNStatusAPI = urlGenerateEWBbyIRNStatusAPI;
						}	

						urlCancelEWBAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_cancel_ewb;
						//log.debug('onRequest:GET','urlCancelEWBAPI=='+urlCancelEWBAPI);

						if(_logValidation(urlCancelEWBAPI)){
							urlCancelEWBAPI = urlCancelEWBAPI;
						}						
						urlCancelEWBStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_cancel_ewb_sts;
						//log.debug('onRequest:GET','urlCancelEWBStatusAPI=='+urlCancelEWBStatusAPI);

						if(_logValidation(urlCancelEWBStatusAPI)){
							urlCancelEWBStatusAPI = urlCancelEWBStatusAPI;
						}
					}
				}
				//--------------------------------------------------- Ends - Get GST EInvoicing Enriched API details ----------------------------------------------------------------------//
				var getEWBStatusAPIStatus="";
				var recordID = context.request.parameters.recordid;
				log.debug("onRequest:GET","recordID=="+recordID);

				var recordType = context.request.parameters.s_recordType;
				log.debug("onRequest:GET","recordType=="+recordType);

				var getbutton = context.request.parameters.buttonvalue;
				log.debug("onRequest:GET","getbutton=="+getbutton);

				if(getbutton=='generateewbbyirn' || getbutton=='canceleinv' || getbutton=='cancelewb'){	

					getEWBStatusAPIStatus = context.request.parameters.ewbapistatus;
					log.debug("onRequest:GET","getEWBStatusAPIStatus=="+getEWBStatusAPIStatus);

					if(((getEWBStatusAPIStatus == ' ') || (getEWBStatusAPIStatus != 'IP' &&  getEWBStatusAPIStatus != 'YNS')) || (getbutton=='canceleinv' || getbutton=='cancelewb')){

						var form = serverWidget.createForm({title: 'Popup',hideNavBar: false});

						var fldRecordId = form.addField({id: 'custpage_recordid',type: serverWidget.FieldType.TEXT,label: 'Record ID'});
						fldRecordId.updateLayoutType({layoutType: 'normal'});
						fldRecordId.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
						fldRecordId.defaultValue=recordID;

						var fldRecordType = form.addField({id: 'custpage_recordtype',type: serverWidget.FieldType.TEXT,label: 'Record Type'});
						fldRecordType.updateLayoutType({layoutType: 'normal'});
						fldRecordType.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
						fldRecordType.defaultValue=recordType;

						var fldButton = form.addField({id: 'custpage_buttonvalue',type: serverWidget.FieldType.TEXT,label: 'Button Value'});
						fldButton.updateLayoutType({layoutType: 'normal'});
						fldButton.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
						fldButton.defaultValue=getbutton;
					}
				}

				if(getbutton=='generateewbbyirn'){					

					var getEWBStatusAPIStatus = context.request.parameters.ewbapistatus;
					//log.debug("onRequest:GET","getEWBStatusAPIStatus=="+getEWBStatusAPIStatus);

					log.debug("onRequest:GET","getEWBStatusAPIStatus**1=="+getEWBStatusAPIStatus);

					if((getEWBStatusAPIStatus == ' ') || ( getEWBStatusAPIStatus != 'IP'  && getEWBStatusAPIStatus != 'YNS')){


						//form.clientScriptModulePath = "SuiteScripts/YIL_CS_GST_eInvoicing_EnrichedAPIs.js";
						//form.clientScriptFileId = 3439;

						var scriptObj 				= runtime.getCurrentScript();
						var clientScriptPath		= scriptObj.getParameter({name: 'custscript_ygst_einv_encrichapi_cli_path'});
						log.debug("onRequest:GET","clientScriptPath=="+clientScriptPath);

						form.clientScriptModulePath = ''+clientScriptPath+'';

						var fldewbTransportMode = form.addField({id: 'custpage_ewb_trans_mode',type: serverWidget.FieldType.SELECT,label: 'Transport Mode'});
						fldewbTransportMode.updateLayoutType({layoutType: 'normal'});
						fldewbTransportMode.isMandatory = true;

						fldewbTransportMode.addSelectOption({value: '',text: ''});
						/*fldewbTransportMode.addSelectOption({value: '1',text: 'Road'}); 
						fldewbTransportMode.addSelectOption({value: '2',text: 'Air'}); 
						fldewbTransportMode.addSelectOption({value: '3',text: 'Rail'}); 
						fldewbTransportMode.addSelectOption({value: '4',text: 'Ship'}); */

						fldewbTransportMode.addSelectOption({value: 'ROAD',text: 'Road'}); 
						fldewbTransportMode.addSelectOption({value: 'AIR',text: 'Air'}); 
						fldewbTransportMode.addSelectOption({value: 'RAIL',text: 'Rail'}); 
						fldewbTransportMode.addSelectOption({value: 'SHIP',text: 'Ship'});

						var fldTransporterId = form.addField({id: 'custpage_ewb_transporter_id',type: serverWidget.FieldType.TEXT,label: 'Transporter Id'});
						fldTransporterId.updateLayoutType({layoutType: 'normal'});
						fldTransporterId.isMandatory = true;

						/*var fldTransportDateTime = form.addField({id: 'custpage_ewb_transport_datetime',type: serverWidget.FieldType.DATE,label: 'Transport Date Time'});
					fldTransportDateTime.updateLayoutType({layoutType: 'normal'});*/
						//fldTransportDateTime.isMandatory = true;

						var fldTransporterName = form.addField({id: 'custpage_ewb_transporter_name',type: serverWidget.FieldType.TEXT,label: 'Transporter Name'});
						fldTransporterName.updateLayoutType({layoutType: 'normal'});
						//fldTransporterName.isMandatory = true;

						var fldDistance = form.addField({id: 'custpage_ewb_distance',type: serverWidget.FieldType.TEXT,label: 'Distance'});
						fldDistance.updateLayoutType({layoutType: 'normal'});
						fldDistance.isMandatory = true;

						var fldTransportDocNo = form.addField({id: 'custpage_ewb_transport_doc_no',type: serverWidget.FieldType.TEXT,label: 'Transport Document Number'});
						fldTransportDocNo.updateLayoutType({layoutType: 'normal'});
						//fldTransportDocNo.isMandatory = true;

						var fldTransportDocDate = form.addField({id: 'custpage_ewb_transport_doc_date',type: serverWidget.FieldType.TEXT,label: 'Transport Document Date'});
						fldTransportDocDate.updateLayoutType({layoutType: 'normal'});
						//fldTransportDocDate.isMandatory = true;

						var fldVehicleNo = form.addField({id: 'custpage_ewb_vehicle_no',type: serverWidget.FieldType.TEXT,label: 'Vehicle Number'});
						fldVehicleNo.updateLayoutType({layoutType: 'normal'});
						//fldVehicleNo.isMandatory = true;

						var fldVehicleType = form.addField({id: 'custpage_ewb_vehicle_type',type: serverWidget.FieldType.SELECT,label: 'Vehicle Type'});					
						fldVehicleType.updateLayoutType({layoutType: 'normal'});
						//fldVehicleType.isMandatory = true;			

						/*fldVehicleType.addSelectOption({value: '',text: ''});
						fldVehicleType.addSelectOption({value: '1',text: 'Regular'}); 
						fldVehicleType.addSelectOption({value: '2',text: 'ODC'}); */

						fldVehicleType.addSelectOption({value: '',text: 'No Value'});
						fldVehicleType.addSelectOption({value: 'R',text: 'Regular'}); 
						fldVehicleType.addSelectOption({value: 'O',text: 'ODC'}); 

						form.addSubmitButton({label: 'Submit'});

						context.response.writePage(form);
					}

					else if(getEWBStatusAPIStatus && (getEWBStatusAPIStatus == 'IP' || getEWBStatusAPIStatus == 'YNS')){

						var sellerGstin='';
						var recObj = record.load({ type: recordType, id: recordID, isDynamic: false });

						var getSaveDocRefId = recObj.getValue('custbody_yil_gst_ewb_generate_refid');						
						log.debug("onRequest:GET", "getSaveDocRefId=="+getSaveDocRefId);

						sellerGstin = recObj.getValue('custbody_gst_locationregno');						
						if(_logValidation(sellerGstin)){
							sellerGstin = sellerGstin.toString()
						}
						log.debug('onRequest:GET','sellerGstin :'+sellerGstin);

						if(_logValidation(sellerGstin)){

							//var tokenData = getAuthToken(recordID,sellerGstin,urlAuthAPI);
							var tokenData = getAuthToken(recObj,sellerGstin,urlAuthAPI);
							log.debug("onRequest:GET", " tokenData=="+JSON.stringify(tokenData));
							if(tokenData){
								AuthErrorValues = tokenData[0].AuthErrorValues;
								log.debug("onRequest:GET", "AuthErrorValues=="+AuthErrorValues);
								s_Authtoken = tokenData[0].currentAuthtoken;
								log.debug("onRequest:GET", "s_Authtoken=="+s_Authtoken);
							}
						}
						// IF Auth token Error's are blank
						if(!AuthErrorValues && _logValidation(s_Authtoken))//
						{
							//---------------------------------- Request Header Array -----------------------------------------//
							var arrHeaders = [];
							arrHeaders["Content-Type"] = "application/json";
							arrHeaders["auth-token"] = s_Authtoken;

							//------------------------------- Request Header Array -------------------------------------------//

							getUpdatedStatus_GenerateEWB(recObj,urlGenerateEWBbyIRNStatusAPI,getSaveDocRefId,arrHeaders)

							var saveInvRecordId = recObj.save({enableSourcing: true,ignoreMandatoryFields: true});
							log.debug('onRequest:GET','saveInvRecordId :'+saveInvRecordId);

							redirect.toRecord({type: recordType,id: recordID,isEditMode:false});

						}

					}
				}
				if(getbutton=='canceleinv' || getbutton == 'cancelewb'){

					var fldcnlReason = form.addField({id: 'custpage_cancel_reason',type: serverWidget.FieldType.SELECT,label: 'Cancel Reason'});
					fldcnlReason.updateLayoutType({layoutType: 'normal'});
					fldcnlReason.isMandatory = true;

					fldcnlReason.addSelectOption({value: '',text: ''});
					fldcnlReason.addSelectOption({value: '1',text: 'Duplicate'}); 
					fldcnlReason.addSelectOption({value: '2',text: 'Data entry mistake'}); 
					//	fldcnlReason.addSelectOption({value: '3',text: 'Order Cancelled'}); 
					//	fldcnlReason.addSelectOption({value: '4',text: 'Others'}); 

					var fldcnlRemark = form.addField({id: 'custpage_cancel_remark',type: serverWidget.FieldType.TEXT,label: 'Cancel Remark'});
					fldcnlRemark.updateLayoutType({layoutType: 'normal'});
					fldcnlRemark.isMandatory = true;

					form.addSubmitButton({label: 'Submit'});

					context.response.writePage(form);
				}
				/*if(getbutton == 'cancelewb'){
					var fldcnlewbRemark = form.addField({id: 'custpage_cancel_remark',type: serverWidget.FieldType.TEXT,label: 'Cancel Remark'});
					fldcnlRemark.updateLayoutType({layoutType: 'normal'});
					fldcnlRemark.isMandatory = true;

					form.addSubmitButton({label: 'Submit'});

					context.response.writePage(form);
				}*/

			}
			catch(e)
			{
				var errString = 'Error:'+ e.name + ' : ' + e.type + ' : ' + e.message;
				log.error({ title: 'onRequest:GET ', details: errString });
			}
		}
		// If Request Method is Post method
		if (context.request.method === 'POST')
		{
			try 
			{
				var 	s_Authtoken = "";
				var locationName = "";
				var AuthErrorValues ="";
				//----------------------------------------------- Start - Get GST EInvoicing Enriched API details ------------------------------------------------------//
				var gstEinvoiceApiLookUp="";
				var urlAuthAPI = "";
				var urlSaveDocAPI = "";
				var urlSaveDocStatusAPI = "";
				var urlGetEinvoiceResponseAPI="";
				var urlCancelIRNAPI = "";
				var urlCancelIRNStatusAPI = "";				
				var urlCancelEWBAPI = "";
				var urlCancelEWBStatusAPI = "";
				var urlGenerateEWBbyIRNAPI = "";
				var urlGenerateEWBbyIRNStatusAPI = "";


				//script object to get value of script parameter
				var objScript = runtime.getCurrentScript();

				var paramAPIDetailsRecId = objScript.getParameter({name:'custscript_yil_gst_einv_enriapidet_recid'});
				//log.debug('onRequest:POST','paramAPIDetailsRecId :'+paramAPIDetailsRecId); 

				if(_logValidation(paramAPIDetailsRecId)){
					gstEinvoiceApiLookUp = search.lookupFields({ type:'customrecord_yil_gst_einv_api_details', id: paramAPIDetailsRecId, columns: ['custrecord_yil_gst_einv_auth_api_url', 'custrecord_yil_gst_einv_savedoc_api_url','custrecord_yil_gst_einv_savedocsts_api','custrecord_yil_gst_einv_cancel_einv_api','custrecord_yil_gst_einv_can_einv_sts_api','custrecord_yil_gst_einv_geteinv_resp_api','custrecord_yil_gst_einv_genewbbyirn_api','custrecord_yil_gst_einv_genewbbyirn_sts','custrecord_yil_gst_einv_cancel_ewb','custrecord_yil_gst_einv_cancel_ewb_sts'] });

					if(_logValidation(gstEinvoiceApiLookUp)){

						urlAuthAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_auth_api_url;
						//log.debug('onRequest:POST','urlAuthAPI=='+urlAuthAPI);
						if(_logValidation(urlAuthAPI)){
							urlAuthAPI = urlAuthAPI;
						}

						urlSaveDocAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_savedoc_api_url;
						//log.debug('onRequest:POST','urlSaveDocAPI=='+urlSaveDocAPI);
						if(_logValidation(urlSaveDocAPI)){
							urlSaveDocAPI = urlSaveDocAPI;
						}

						urlSaveDocStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_savedocsts_api;
						//log.debug('onRequest:POST','urlSaveDocStatusAPI=='+urlSaveDocStatusAPI);
						if(_logValidation(urlSaveDocStatusAPI)){
							urlSaveDocStatusAPI = urlSaveDocStatusAPI;
						}

						urlGetEinvoiceResponseAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_geteinv_resp_api;
						//log.debug('onRequest:POST','urlGetEinvoiceResponseAPI=='+urlGetEinvoiceResponseAPI);
						if(_logValidation(urlGetEinvoiceResponseAPI)){
							urlGetEinvoiceResponseAPI = urlGetEinvoiceResponseAPI;
						}

						urlCancelIRNAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_cancel_einv_api;
						//log.debug('onRequest:POST','urlCancelIRNAPI=='+urlCancelIRNAPI);
						if(_logValidation(urlCancelIRNAPI)){
							urlCancelIRNAPI = urlCancelIRNAPI;
						}
						urlCancelIRNStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_can_einv_sts_api;
						//log.debug('onRequest:POST','urlCancelIRNStatusAPI=='+urlCancelIRNStatusAPI);
						if(_logValidation(urlCancelIRNStatusAPI)){
							urlCancelIRNStatusAPI = urlCancelIRNStatusAPI;
						}

						urlGenerateEWBbyIRNAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_genewbbyirn_api;
						//log.debug('onRequest:POST','urlGenerateEWBbyIRNAPI=='+urlGenerateEWBbyIRNAPI);
						if(_logValidation(urlGenerateEWBbyIRNAPI)){
							urlGenerateEWBbyIRNAPI = urlGenerateEWBbyIRNAPI;
						}	
						urlGenerateEWBbyIRNStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_genewbbyirn_sts;
						//log.debug('onRequest:POST','urlGenerateEWBbyIRNStatusAPI=='+urlGenerateEWBbyIRNStatusAPI);
						if(_logValidation(urlGenerateEWBbyIRNStatusAPI)){
							urlGenerateEWBbyIRNStatusAPI = urlGenerateEWBbyIRNStatusAPI;
						}	

						urlCancelEWBAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_cancel_ewb;
						//log.debug('onRequest:POST','urlCancelEWBAPI=='+urlCancelEWBAPI);

						if(_logValidation(urlCancelEWBAPI)){
							urlCancelEWBAPI = urlCancelEWBAPI;
						}						
						urlCancelEWBStatusAPI = gstEinvoiceApiLookUp.custrecord_yil_gst_einv_cancel_ewb_sts;
						//log.debug('onRequest:POST','urlCancelEWBStatusAPI=='+urlCancelEWBStatusAPI);

						if(_logValidation(urlCancelEWBStatusAPI)){
							urlCancelEWBStatusAPI = urlCancelEWBStatusAPI;
						}
					}
				}
				//--------------------------------------------------- Ends - Get GST EInvoicing Enriched API details ----------------------------------------------------------------------//

				var recordID = context.request.parameters.custpage_recordid;
				log.debug('onRequest:POST','recordID =='+recordID);

				var recordType = context.request.parameters.custpage_recordtype;
				log.debug('onRequest:POST','recordType =='+recordType);

				var recObj = record.load({ type: recordType, id: recordID, isDynamic: false });

				//Get User's Date and Time Format
				var objUser = runtime.getCurrentUser();
				var dateFormat = (objUser.getPreference({name:'dateformat'})).toUpperCase();
				log.debug("onRequest:POST","dateFormat"+dateFormat);

				var timeFormat = (objUser.getPreference({name:'timeformat'})).toUpperCase();
				log.debug("onRequest:POST","timeFormat"+timeFormat);

				var invLookupField ="";
				var getIRN=null;
				var documentNo ="";
				var documentDate="";
				var sellerGstin=null;

				if(_logValidation(recordID)){

					invLookupField = search.lookupFields({
						type: recordType ,
						id: recordID,
						columns: ['tranid','trandate','custbody_yil_gst_einv_irn','custbody_gst_locationregno']
					});

					if(_logValidation(invLookupField)){

						getIRN = invLookupField.custbody_yil_gst_einv_irn;						
						if(_logValidation(getIRN)){
							getIRN = getIRN.toString();
						}
						log.debug('onRequest:POST','getIRN :'+getIRN);

						documentNo = invLookupField.tranid;						
						if(_logValidation(documentNo)){
							documentNo = documentNo
						}
						log.debug('onRequest:POST','documentNo :'+documentNo);


						var tranDate = invLookupField.trandate;	
						//log.debug('onRequest:POST','tranDate :'+tranDate);
						if(_logValidation(tranDate)){
							documentDate = formatdate(tranDate);
							if(_logValidation(documentDate)){
								documentDate = documentDate.toString();									
							}
							else{
								documentDate=null;								
							}
						}
						log.debug('onRequest:POST','documentDate :'+documentDate);

						sellerGstin = invLookupField.custbody_gst_locationregno;						
						if(_logValidation(sellerGstin)){
							sellerGstin = sellerGstin.toString()
						}
						log.debug('onRequest:POST','sellerGstin :'+sellerGstin);
					}
				}

				if(_logValidation(sellerGstin)){

					var tokenData = getAuthToken(recObj,sellerGstin,urlAuthAPI);
					log.debug("onRequest:POST", " tokenData=="+JSON.stringify(tokenData));

					if(tokenData){
						AuthErrorValues = tokenData[0].AuthErrorValues;
						log.debug("onRequest:POST", " AuthErrorValues=="+AuthErrorValues);
						s_Authtoken = tokenData[0].currentAuthtoken;
						log.debug("onRequest:POST", " s_Authtoken=="+s_Authtoken);
					}
				}

				// IF Auth token Error's are blank
				if(!AuthErrorValues && _logValidation(s_Authtoken))//
				{
					//---------------------------------- Request Header Array -----------------------------------------//
					var arrHeaders = [];
					arrHeaders["Content-Type"] = "application/json";
					arrHeaders["auth-token"] = s_Authtoken;

					//------------------------------- Request Header Array -------------------------------------------//

					var button = context.request.parameters.custpage_buttonvalue;
					log.debug('onRequest:POST','button =='+button); 	

					if(button =='canceleinv' ||  button =='cancelewb'){


						var cancelRemark ="";
						var cancelReasonValue ="";
						var cancelReason ="";

						cancelReasonValue = context.request.parameters.custpage_cancel_reason;
						log.debug('onRequest:POST','cancelReasonValue =='+cancelReasonValue);
						if(_logValidation(cancelReasonValue)){

							if(cancelReasonValue == 1){
								cancelReason = "Duplicate";
							}
							else if(cancelReasonValue == 2){
								cancelReason = "Data entry mistake";
							}
							else if(cancelReasonValue == 3){
								cancelReason = "Order Cancelled";
							}
							else if(cancelReasonValue == 4){
								cancelReason = "Others";
							}
							//cancelReason=cancelReason.toString();
						}
						log.debug('onRequest:POST','cancelReason =='+cancelReason);

						cancelRemark = context.request.parameters.custpage_cancel_remark;
						log.debug('onRequest:POST','cancelRemark =='+cancelRemark);
						if(_logValidation(cancelRemark)){
							cancelRemark=cancelRemark.toString();
						}

						var cancelJson =
						{

								"reason":cancelReason,
								"remarks":cancelRemark,
								"criterias":
									[
										{
											"locationGstin": sellerGstin,
											"locationName": locationName,
											"documentNumber": documentNo,
											"documentDate": documentDate,
											"supplyType": "S",
											"billFromGstin": sellerGstin,
											"portCode": null
										}
										]							
						}

						var canceljsonStr = JSON.stringify(cancelJson);
						log.debug("onRequest","canceljsonStr:"+canceljsonStr);
						
						

						var cancelEinvResponse = https.post({url:urlCancelIRNAPI,body:canceljsonStr,headers: arrHeaders	});
						//log.debug("cancelEinvResponse=",cancelEinvResponse);
						log.debug(" stringify cancelEinvResponse=",JSON.stringify(cancelEinvResponse));

						var cancelResponseBody = JSON.parse(cancelEinvResponse.body);
						log.debug("cancelResponseBody",cancelResponseBody);

						var cancelRefId = cancelResponseBody.referenceId
						log.debug("cancelRefId",cancelRefId);

						if(cancelRefId){
							//set reference ID on Invoice record
							if(button =='cancelewb'){
								recObj.setValue({fieldId:'custbody_yil_gst_einv_cancleewb_refid',value:cancelRefId });
							}
						}
						//------------------------------------------------------------- End- Cancel E-Invoice API ---------------------------------------------------------------------------//

						/*if (cancelEinvStatusResponseStatus == "IP"){
							if(saveDocRefId){
								s_referenceId = saveDocRefId
							}
						}*/

						//------------------------------------------------------------- Start - Cancel E-Invoice Status API ---------------------------------------------------------------------------//

						var cancelEinvStatusResponse = https.get({url: urlCancelIRNStatusAPI+cancelRefId,headers: arrHeaders	});
						log.debug(" stringify cancelEinvStatusResponse==",JSON.stringify(cancelEinvStatusResponse));

						//Parse Cancel E-Invoice Status API response 
						var cancelEinvStatusResponseBody = JSON.parse(cancelEinvStatusResponse.body);
						log.debug("cancelEinvStatusResponseBody==",cancelEinvStatusResponseBody);

						var cancelEinvStatusResponse_requestType = cancelEinvStatusResponseBody.requestType
						log.debug("cancelEinvStatusResponse_requestType==",cancelEinvStatusResponse_requestType);
						var cancelEinvStatusResponse_status = cancelEinvStatusResponseBody.status
						log.debug("cancelEinvStatusResponse_status==",cancelEinvStatusResponse_status);
						var cancelEinvStatusResponse_version = cancelEinvStatusResponseBody.version
						log.debug("cancelEinvStatusResponse_version==",cancelEinvStatusResponse_version);
						var cancelEinvStatusResponse_referenceId = cancelEinvStatusResponseBody.referenceId
						log.debug("cancelEinvStatusResponse_referenceId==",cancelEinvStatusResponse_referenceId);

						if(cancelEinvStatusResponse_status){
							recObj.setValue({fieldId:'custbody_yil_gst_einv_cancleinvsts_sts',value:cancelEinvStatusResponse_status });								
						}

						if(cancelEinvStatusResponse_status == "P"){
							if(cancelEinvStatusResponseBody.hasOwnProperty("dataReport") == true){
								var arrDataReport_cancelEInv = cancelEinvStatusResponseBody.dataReport;			
								log.debug("arrDataReport_cancelEInv ##",arrDataReport_cancelEInv[0]);

								var cancelledDate= arrDataReport_cancelEInv[0].cancelledDate
								log.debug("cancelledDate##",cancelledDate);

								if(cancelledDate){
									recObj.setValue({fieldId:'custbody_yil_gst_einv_cancelled_date',value:cancelledDate });

									// --------------------------------------------------- Start - Reverse Process to create Credit memo for the Cancel E-Invoice -------------------------------------------------//

								/*	if(recordType && recordType ==='invoice'){

										var oReturnAuth = record.transform({ fromType:recordType, fromId: recordID, toType: 'returnauthorization' ,defaultValues: { billdate: '01/01/2019'} });
										log.debug("oReturnAuth##",oReturnAuth);
										var oItemReceipt = record.transform({ fromType:'returnauthorization', fromId: oReturnAuth, toType: 'itemreceipt' });
										log.debug("oItemReceipt##",oItemReceipt);

										if(oItemReceipt){
											var oCreditMemo = record.transform({ fromType:'returnauthorization', fromId: oReturnAuth, toType: 'creditmemo' });
										}
									}*/

									// --------------------------------------------------- End - Reverse Process to create Credit memo for the Cancel E-Invoice -------------------------------------------------//
								}
								var cancelledErrors= arrDataReport_cancelEInv[0].errors
								log.debug("cancelledErrors##",cancelledErrors);
								if(cancelledErrors){
									cancelledErrors = JSON.stringify(cancelledErrors);
									recObj.setValue({fieldId:'custbody_yil_gst_einv_cancelerrdetails',value:cancelledErrors });
								}
							}
						}
						/*If Save Document Status API Response may be PE,IP,YNS,ER
						 * PE - Processed with Errors (Validation Errors at Cygnet GSP or After IRN Generation Completion or GST or EWB)
						 * IP - In Progress either at Cygnet GSP or GST or IRP or EWB
						 * ER - Error at Cygnet GSP
						 * YNS - Yet Not Started at Cygnet GSP*/

						//if(cancelEinvStatusResponse_status == "P" && cancelEinvStatusResponse_status == "IP")
						{
							if(cancelEinvStatusResponseBody.hasOwnProperty("errors") == true){
								var cancelledErrors= cancelEinvStatusResponseBody.errors
								log.debug("cancelledErrors##",cancelledErrors);
								if(cancelledErrors){
									cancelledErrors = JSON.stringify(cancelledErrors);		
									recObj.setValue({fieldId:'custbody_yil_gst_einv_cancelerrdetails',value:cancelledErrors });
								}
							}
						}
					}

					//---------------------------------------------------------------------- Start - Generate EWB by IRN -------------------------------------------------------------------------------//

					if(button =='generateewbbyirn'){			

						var documentType="";
						var recObj = record.load({ type: recordType, id: recordID, isDynamic: false });

						if(recordType == 'invoice'){
							documentType = "INV";
						}
						if(recordType == 'creditmemo'){ 
							documentType="CRN";
						}


						var getSaveDocStatusResponseStatus = recObj.getValue('custbody_yil_gst_ewb_savedocsts_resps');						
						log.debug("onRequest:POST", " generateewbbyirn: getSaveDocStatusResponseStatus=="+getSaveDocStatusResponseStatus);

						var getSaveDocRefId = recObj.getValue('custbody_yil_gst_ewb_generate_refid');						
						log.debug("onRequest:POST", "generateewbbyirn: getSaveDocRefId=="+getSaveDocRefId);

						if( !_logValidation(getSaveDocStatusResponseStatus) ||( getSaveDocStatusResponseStatus != "YNS" && getSaveDocStatusResponseStatus != "IP" && getSaveDocStatusResponseStatus != "P"))
						{
							var sTransporterId =null;
							var sTransporterName = null;
							var sTransportMode = null;
							var sTransportDocumentNumber = null;
							var sTransportDocumentDate = null;
							var sVehicleNumber = null;
							var sVehicleType = null;
							var fDistance = null;
							var sTransportDateTime = null;
							var getDistance = null;

							sTransporterId = context.request.parameters.custpage_ewb_transporter_id;
							log.debug('onRequest:POST','generateewbbyirn: sTransporterId =='+sTransporterId);
							if(sTransporterId){
								sTransporterId =sTransporterId
							}
							else{
								sTransporterId=null
							}
							sTransporterName = context.request.parameters.custpage_ewb_transporter_name;
							log.debug('onRequest:POST','generateewbbyirn: sTransporterName =='+sTransporterName);				
							if(sTransporterName){
								sTransporterName =sTransporterName
							}
							else{
								sTransporterName=null
							}

							getDistance = context.request.parameters.custpage_ewb_distance;
							log.debug('onRequest:POST','generateewbbyirn: getDistance =='+getDistance);				
							if(getDistance){
								getDistance =getDistance
							}
							else{
								getDistance=null
							}

							sTransportMode = context.request.parameters.custpage_ewb_trans_mode;
							log.debug('onRequest:POST','generateewbbyirn: sTransportMode =='+sTransportMode);
							if(sTransportMode){
								sTransportMode =sTransportMode
							}
							else{
								sTransportMode=null
							}

							sTransportDocumentNumber = context.request.parameters.custpage_ewb_transport_doc_no;
							log.debug('onRequest:POST','generateewbbyirn: sTransportDocumentNumber =='+sTransportDocumentNumber);
							if(sTransportDocumentNumber){
								sTransportDocumentNumber =sTransportDocumentNumber
							}
							else{
								sTransportDocumentNumber=null
							}

							sTransportDocumentDate = context.request.parameters.custpage_ewb_transport_doc_date;
							log.debug('onRequest:POST','generateewbbyirn: sTransportDocumentDate =='+sTransportDocumentDate);
							if(sTransportDocumentDate){
								sTransportDocumentDate =sTransportDocumentDate
							}
							else{
								sTransportDocumentDate=null
							}

							sVehicleNumber = context.request.parameters.custpage_ewb_vehicle_no;
							log.debug('onRequest:POST','generateewbbyirn: sVehicleNumber =='+sVehicleNumber);
							if(sVehicleNumber){
								sVehicleNumber =sVehicleNumber
							}
							else{
								sVehicleNumber=null
							}

							sVehicleType = context.request.parameters.custpage_ewb_vehicle_type;
							log.debug('onRequest:POST','generateewbbyirn: sVehicleType =='+sVehicleType);
							if(sVehicleType){
								sVehicleType =sVehicleType
							}
							else{
								sVehicleType=null
							}

							//---------------------------- Start - Distance Validation for the EWB generation -------------------------------------------//
							var locationId = recObj.getValue('location');
							if(_logValidation(locationId))
							{
								var s_record_type="location";
							}

							var sellerDetails = getSellerDetails(s_record_type,locationId)
							log.debug("onRequest:POST","sellerDetails=="+sellerDetails);

							var i_datasplit = sellerDetails.toString().split("##");
							var sellerZip = i_datasplit[5];
							if(_logValidation(sellerZip)){
								//sellerZip = sellerZip.toString();
								sellerZip = Number(sellerZip);
							}
							else{
								sellerZip="";
							}

							var shipsubrec = recObj.getSubrecord({fieldId: 'shippingaddress'});
							//log.debug("shipsubrec", shipsubrec);

							var buyerZip = shipsubrec.getValue('zip');
							if(_logValidation(buyerZip)){
								//buyerZip = buyerZip.toString();
								buyerZip = Number(buyerZip)
							}
							else{
								buyerZip=null;
							}

							log.debug('onRequest:POST','buyerZip=='+buyerZip);

							if(sellerZip && buyerZip){
								if(sellerZip==buyerZip){
									fDistance = 1;
								}
								if(sellerZip!=buyerZip){

									if(getDistance){
										fDistance = getDistance;
									}
									else{
										fDistance =0;
									}
								}
							}
							//---------------------------- End - Distance Validation for the EWB generation -------------------------------------------//

							var generateEWBbyIRNJson = {
									"overwriteTransportDetails": "Y",
									"transporterId": sTransporterId,
									"transporterName": sTransporterName,
									"transportMode": sTransportMode,
									"transportDocumentNumber": sTransportDocumentNumber,
									"transportDocumentDate": sTransportDocumentDate,
									"distance": fDistance,
									"vehicleNumber": sVehicleNumber,
									"vehicleType": sVehicleType,
									"overwriteExportShippingDetails": "N",
									"shipToAddress1": "",
									"shipToAddress2": "",
									"shipToCity": "",
									"shipToStateCode": "",
									"shipToPincode": "",
									"overwriteDispatchDetails": "N",
									"dispatchFromTradeName": "",
									"dispatchFromAddress1": "",
									"dispatchFromAddress2": "",
									"dispatchFromCity": "",
									"dispatchFromStateCode":"" ,
									"dispatchFromPincode":"" ,
									"criterias": [
										{
											"locationGstin":sellerGstin ,
											"locationName":locationName,
											"documentNumber": documentNo,
											"documentDate":documentDate ,
											"supplyType": "S",
											//"documentType": "INV",
											"documentType": documentType,
											"billFromGstin": sellerGstin,
											"portCode": null
										}
										]
							}
							var generateEWBbyIRNJsonStr = JSON.stringify(generateEWBbyIRNJson);
							log.debug("onRequest","generateEWBbyIRNJsonStr:"+generateEWBbyIRNJsonStr);

							var generateEWBbyIRNResponse = https.post({url:urlGenerateEWBbyIRNAPI,body:generateEWBbyIRNJsonStr,headers: arrHeaders	});
							//log.debug("generateEWBbyIRNResponse=",generateEWBbyIRNResponse);
							log.debug(" stringify generateEWBbyIRNResponse=",JSON.stringify(generateEWBbyIRNResponse));

							var generateEWBbyIRN_responsebody = JSON.parse(generateEWBbyIRNResponse.body);
							log.debug(" parsed generateEWBbyIRN_responsebody",generateEWBbyIRN_responsebody);

							var s_referenceId = generateEWBbyIRN_responsebody.referenceId
							log.debug(" generate EWB by IRN s_referenceId==",s_referenceId);

							if(s_referenceId){
								//set reference ID on Invoice record
								recObj.setValue({fieldId:'custbody_yil_gst_ewb_generate_refid',value:s_referenceId });								
							}
							else{
								recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:JSON.stringify(generateEWBbyIRN_responsebody)});
								recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });
							}
						}
						if (getSaveDocStatusResponseStatus == "IP"){
							if(getSaveDocRefId){
								var 	s_referenceId = getSaveDocRefId
							}
						}

						if(s_referenceId){
							var generateEWBbyIRNStatusResponse = https.get({url: urlGenerateEWBbyIRNStatusAPI+s_referenceId,headers: arrHeaders	});
							log.debug(" stringify generateEWBbyIRNStatusResponse==",JSON.stringify(generateEWBbyIRNStatusResponse));

							var generateEWBbyIRNStatusResponseBody = JSON.parse(generateEWBbyIRNStatusResponse.body);
							log.debug("generateEWBbyIRNStatusResponseBody==",generateEWBbyIRNStatusResponseBody);

							if(generateEWBbyIRNStatusResponseBody){

								var	genEWBbyIRNResponseStatus  = generateEWBbyIRNStatusResponseBody.status
								log.debug("genEWBbyIRNResponseStatus==",genEWBbyIRNResponseStatus);

								recObj.setValue({fieldId:'custbody_yil_gst_ewb_savedocsts_resps',value:genEWBbyIRNResponseStatus });

								if(genEWBbyIRNResponseStatus =="P"){
									if(generateEWBbyIRNStatusResponseBody.hasOwnProperty("dataReport") == true){

										var arrDataReport_genEWBbyIRN = generateEWBbyIRNStatusResponseBody.dataReport;			
										log.debug("arrDataReport_genEWBbyIRN ==",arrDataReport_genEWBbyIRN[0]);

										var ewbNo= arrDataReport_genEWBbyIRN[0].ewayBillNumber
										log.debug("ewbNo==",ewbNo);

										var generatedDate= arrDataReport_genEWBbyIRN[0].generatedDate
										log.debug("generatedDate==",generatedDate);

										var ewbErrors = arrDataReport_genEWBbyIRN[0].errors
										log.debug("ewbErrors==",ewbErrors);

										if(ewbNo){
											ewbNo = ewbNo.toString();
											recObj.setValue({fieldId:'custbody_yil_gst_einv_ewbno',value:ewbNo });	
											recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:"" });
										}
										if(generatedDate){
											recObj.setValue({fieldId:'custbody_yil_gst_einv_ewbgendate_text',value:generatedDate });	
										}
										if(!_logValidation(ewbNo) && _logValidation(ewbErrors)){
											ewbErrors = JSON.stringify(ewbErrors);
											recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:ewbErrors });
										}
									}
								}
								/*If Save Document Status API Response may be PE,IP,YNS,ER
								 * PE - Processed with Errors (Validation Errors at Cygnet GSP or After IRN Generation Completion or GST or EWB)
								 * IP - In Progress either at Cygnet GSP or GST or IRP or EWB
								 * ER - Error at Cygnet GSP
								 * YNS - Yet Not Started at Cygnet GSP*/

								if( genEWBbyIRNResponseStatus != "P"){

									if(genEWBbyIRNResponseStatus =="IP" || genEWBbyIRNResponseStatus =="YNS"){
										recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:" " });
										recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });
									}

									var genEWBbyIRNStatusReqId= generateEWBbyIRNStatusResponseBody.requestId;
									log.debug("genEWBbyIRNStatusReqId##",genEWBbyIRNStatusReqId);

									var genEWBbyIRNStatusErrors= generateEWBbyIRNStatusResponseBody.errors;
									log.debug("genEWBbyIRNStatusErrors##",JSON.stringify(genEWBbyIRNStatusErrors));

									if(genEWBbyIRNStatusErrors){

										genEWBbyIRNStatusErrors = JSON.stringify(genEWBbyIRNStatusErrors);

										recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:genEWBbyIRNStatusErrors });
										recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });
									}

									var genEWBbyIRNStatusValidateReport= generateEWBbyIRNStatusResponseBody.validationReport;
									log.debug("genEWBbyIRNStatusValidateReport##",JSON.stringify(genEWBbyIRNStatusValidateReport));								

									if(genEWBbyIRNStatusValidateReport){

										genEWBbyIRNStatusValidateReport = JSON.stringify(genEWBbyIRNStatusValidateReport);

										recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:genEWBbyIRNStatusValidateReport });
										recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });

										var propertyErrors1 = JSON.parse(genEWBbyIRNStatusValidateReport).propertyErrors;
										log.debug('onRequest:POST','gernerate EWB by IRN propertyErrors1 :'+propertyErrors1);

										var propertyErrors = generateEWBbyIRNStatusResponseBody.validationReport.propertyErrors 
										log.debug('onRequest:POST','gernerate EWB by IRN propertyErrors :'+propertyErrors);
									}
								}
							}
						}
					}
				}
				//---------------------------------------------------------------------- End - Generate EWB by IRN -------------------------------------------------------------------------------//

				var saveInvRecordId = recObj.save({enableSourcing: true,ignoreMandatoryFields: true});
				log.debug('onRequest:POST','saveInvRecordId :'+saveInvRecordId);

				//Window close and Parent record Refresh/reload
				context.response.write("<html><head><title></title></head><body><script language='JavaScript' type='text/javascript'>parent.location.reload();parent.document.getElementById(parent.document.getElementsByClassName('x-tool x-tool-close')[0].id).click();</script></body></html>");

			}
			catch(e){
				var errString = 'Error:'+ e.name + ' : ' + e.type + ' : ' + e.message;
				log.error({ title: 'onRequest:POST ', details: errString });
			}
		}
	}

	//----------------------------------------------- Start - Custom Functions ------------------------------------------------------------------//

	//----------------------------------------------- START - Method to Call Authentication API ------------------------------------------------------//
	//function getAuthToken(internalId,sellerGstin,urlAuthAPI){		
	function getAuthToken(recObj,sellerGstin,urlAuthAPI){

		var authTokenDetails=[];
		var currentAuthtoken ="";
		var AuthErrorValues="";

		//log.debug("getAuthToken","internalId:"+internalId);
		log.debug("getAuthToken","sellerGstin:"+sellerGstin);

		if(sellerGstin){

			var gstInvDetailsId ="";
			var s_clientId="";
			var s_gstinNo="";
			var s_clientSecret="";
			var s_userName ="";
			var s_password="";				
			var s_Authtoken="";
			var oldTokenExpiry="";

			var objSearchGSTInvDetails = search.create({
				type: "customrecord_yil_gst_einv_details",
				filters:
					[
						["isinactive","is","F"], 
						"AND", 
						["custrecord_yil_gst_einv_gstin","is",sellerGstin]									
						],
						columns:
							[
								search.createColumn({name: "internalid", label: "Internal ID"}),
								search.createColumn({name: "custrecord_yil_gst_einv_authtoken", label: "Authtoken"}),
								search.createColumn({name: "custrecord_yil_gst_einv_client_id", label: "Client Id"}),
								search.createColumn({name: "custrecord_yil_gst_einv_client_secret", label: "Client Secret"}),
								search.createColumn({name: "custrecord_yil_gst_einv_gstin", label: "GSTIN"}),
								search.createColumn({name: "custrecord_yil_gst_einv_username", label: "Username"}),
								search.createColumn({name: "custrecord_yil_gst_einv_password", label: "Password"}),
								search.createColumn({name: "custrecord_yil_gst_einv_token_expiry", label: "Token Expiry"})
								]
			});

			var searchResultCount_gstInvDetails = objSearchGSTInvDetails.runPaged().count;
			log.debug("getAuthToken","searchResultCount_gstInvDetails result count##"+searchResultCount_gstInvDetails);
			if(searchResultCount_gstInvDetails && searchResultCount_gstInvDetails>0){
				objSearchGSTInvDetails.run().each(function(result){
					// .run().each has a limit of 4,000 results

					gstInvDetailsId = result.getValue({name: "internalid", label: "Internal ID"});
					log.debug("getAuthToken","gstInvDetailsId:"+gstInvDetailsId);

					s_clientId = result.getValue({name: "custrecord_yil_gst_einv_client_id", label: "Client Id"});
					log.debug("getAuthToken","s_clientId:"+s_clientId);

					s_clientSecret = result.getValue({name: "custrecord_yil_gst_einv_client_secret", label: "Client Secret"});
					log.debug("getAuthToken","s_clientSecret:"+s_clientSecret);

					s_gstinNo = result.getValue({name: "custrecord_yil_gst_einv_gstin", label: "GSTIN"});
					log.debug("getAuthToken","s_gstinNo:"+s_gstinNo);

					s_userName = result.getValue({name: "custrecord_yil_gst_einv_username", label: "Username"});
					log.debug("getAuthToken","s_userName:"+s_userName);

					s_password = result.getValue({name: "custrecord_yil_gst_einv_password", label: "Password"});
					log.debug("getAuthToken","s_password:"+s_password);

					s_Authtoken = result.getValue({name: "custrecord_yil_gst_einv_authtoken", label: "Authtoken"});
					log.debug("getAuthToken","s_Authtoken:"+s_Authtoken);

					oldTokenExpiry = result.getValue({name: "custrecord_yil_gst_einv_token_expiry", label: "Token Expiry"});
					log.debug("getAuthToken","oldTokenExpiry:"+oldTokenExpiry);

					return true;
				});	

				if(_logValidation(oldTokenExpiry)){	
					var newDate = new Date();
					log.debug("newDate##",newDate);

					var userObj = runtime.getCurrentUser();

					var dateFormat = (userObj.getPreference({name:'dateformat'})).toUpperCase();
					log.debug("getAuthToken","dateFormat"+dateFormat);

					var userTimeZone = (userObj.getPreference({name:'timezone'})).toUpperCase();
					log.debug("getAuthToken","userTimeZone"+userTimeZone);

					var companyInfo = config.load({type: config.Type.COMPANY_INFORMATION});

					var companyTimezone = (companyInfo.getValue({fieldId:'timezone'})).toUpperCase();
					log.debug("getAuthToken","companyTimezone:"+companyTimezone);

					var formatedCurrentTime = format.format({value: newDate,type: format.Type.DATETIME,timezone: format.Timezone.userTimeZone});
					log.debug("formatedCurrentTime##",formatedCurrentTime);
				}

				log.debug(" Current time equals to old token time:",formatedCurrentTime==oldTokenExpiry);
				log.debug(" current time  is less than old token time:", formatedCurrentTime< oldTokenExpiry);
				log.debug(" current time is greater than old token time:",formatedCurrentTime>oldTokenExpiry);

				//if( (!_logValidation(oldTokenExpiry)) || (formatedCurrentTime >= oldTokenExpiry) )//
				{
					var arrAuthRequestHheaders = [];
					arrAuthRequestHheaders["Content-Type"] = "application/json";
					arrAuthRequestHheaders["client-id"] = s_clientId;
					arrAuthRequestHheaders["client-secret"] = s_clientSecret;

					var authRequestBody = 
					{
							"forceRefresh": true,
							"username" : s_userName,
							"password" : s_password
					}

					authRequestBody = JSON.stringify(authRequestBody);
					log.debug("getAuthToken","authRequestBody="+authRequestBody);

					var authResponse = https.post({url:urlAuthAPI,body: authRequestBody,headers: arrAuthRequestHheaders});
					//log.debug('getAuthToken',"authResponse="+authResponse);
					log.debug(" authResponse stringify",JSON.stringify(authResponse));

					var authResponseCode = authResponse.code;
					log.debug('getAuthToken',"authResponseCode="+authResponseCode);

					var authResponsebody = JSON.parse(authResponse.body);
					log.debug('getAuthToken',"authResponsebody="+JSON.stringify(authResponsebody));

					if(authResponseCode== 200){

						var authToken = authResponsebody.token;
						log.debug('getAuthToken',"authToken="+authToken);

						var expiryInMinutes = authResponsebody.expiryTimeInMinutes;
						log.debug('getAuthToken',"expiryInMinutes="+expiryInMinutes);

						var currentDate = new Date();
						log.debug('getAuthToken',"currentDate="+currentDate);								

						currentDate.setMinutes(currentDate.getMinutes()+parseInt(expiryInMinutes));
						log.debug('getAuthToken',"after adding expiryMinute="+currentDate);

						var expiryDateTime = format.format({value:currentDate, type: format.Type.DATETIME});
						log.debug('getAuthToken','expiryDateTime :'+expiryDateTime);

						if(_logValidation(gstInvDetailsId)){
							log.debug("getStatus","Before setting auth token and expiry time")
							if( _logValidation(authToken) && _logValidation(expiryDateTime))
							{
								s_Authtoken = authToken;

								var gstInvDetailsSubmitId = record.submitFields({type:'customrecord_yil_gst_einv_details',id: gstInvDetailsId,values: {          
									custrecord_yil_gst_einv_authtoken:authToken,custrecord_yil_gst_einv_token_expiry:expiryDateTime								
								},
								options: {enableSourcing: true,ignoreMandatoryFields : true}
								});	
							}
							else{
								//Do Nothing
								log.debug("getAuthToken","There might be issue in gstInvDetailsId, authToken, or expiryDateTime values");
							}
						}
					}
					else if(authResponseCode != 200){

						AuthErrorValues = authResponsebody.errors
						log.debug("getAuthToken","ErrorValues="+JSON.stringify(AuthErrorValues));

						AuthErrorValues = JSON.stringify(AuthErrorValues);

						/*	if(internalId){
						if(_logValidation(AuthErrorValues)){

							var invSubmitId = record.submitFields({type:recordType,id:recordID ,values: {          
								custbody_yil_gst_einv_auth_err_details:AuthErrorValues,
							},
							options: {enableSourcing: true,ignoreMandatoryFields : true}
							});	
						}
					}
					log.debug("getAuthToken","invSubmitId="+invSubmitId);*/

						if(AuthErrorValues){
							recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:AuthErrorValues});
						}

					}
				}
			}
		}

		if(s_Authtoken && !AuthErrorValues){
			currentAuthtoken  = s_Authtoken;
			log.debug('getAuthToken','currentAuthtoken='+currentAuthtoken);
			authTokenDetails.push({'currentAuthtoken':currentAuthtoken,'AuthErrorValues':AuthErrorValues});
			//return currentAuthtoken;
		}
		else if(AuthErrorValues){
			//return AuthErrorValues;
			authTokenDetails.push({'currentAuthtoken':currentAuthtoken,'AuthErrorValues':AuthErrorValues});

		}
		return authTokenDetails;
	}
	//--------------------------------------------------------- END - Method to Call Authentication API ----------------------------------------------------------------//
//	----------------------------------------------Start-Function to fetch data from location record --------------------------------------------------------------//
	function getSellerDetails(recordType,locationId){

		var locationData="";
		log.debug("getSellerDetails", "recordType##"+recordType);
		log.debug("getSellerDetails", "locationId##"+locationId);

		var locationSearchObj = search.create({
			type:recordType,
			filters:
				[
					["internalid", "anyof",locationId]
					],
					columns:
						[
							search.createColumn({ name: "name", sort: search.Sort.ASC, label: "Name" }),							
							search.createColumn({name: "address1",join: "address",label: " Address 1"}),
							search.createColumn({name: "address2",join: "address",label: " Address 2"}),
							search.createColumn({ name: "address3", join: "address", label: " Address 3" }),
							search.createColumn({ name: "city", join: "address", label: " City" }),
							search.createColumn({ name: "state", join: "address", label: " State" }),
							search.createColumn({ name: "zip", join: "address", label: " Zip" }),
							search.createColumn({ name: "country", join: "address", label: "Country" }),
							search.createColumn({ name: "phone", join: "address", label: " Phone" })
							]
		});
		var searchResultCount = locationSearchObj.runPaged().count;
		log.debug("getSellerDetails", "searchResultCount=="+searchResultCount);

		var locationSearchresultset = locationSearchObj.run();
		var locationSearchresults = locationSearchresultset.getRange(0, 1000);

		if (searchResultCount > 0) {
			//var sellerCountry = locationSearchresults[0].getValue({ name: "country", label: "Country" });
			var country = locationSearchresults[0].getText({ name: "country", join: "address", label: "Country" });
			log.debug("getSellerDetails", "country== "+country);

			var phone = locationSearchresults[0].getValue({ name: "phone", join: "address",label: "Phone" });
			log.debug("getSellerDetails", "phone== "+phone);

			var Address1 = locationSearchresults[0].getValue({ name: "address1", join: "address", label: "Address 1" });
			log.debug("getSellerDetails", "Address1== "+Address1);

			var Address2 = locationSearchresults[0].getValue({ name: "address2", join: "address", label: "Address 2" });
			log.debug("getSellerDetails", "Address2== "+Address2);

			var Address3 = locationSearchresults[0].getValue({ name: "address3", join: "address", label: "Address 3" });
			log.debug("getSellerDetails", "Address3== "+Address3);

			var city  = locationSearchresults[0].getValue({ name: "city", join: "address", label: "City" });
			log.debug("getSellerDetails", "city=="+city);

			var state = locationSearchresults[0].getValue({ name: "state", join: "address", label: "State/Province" });
			//var state = locationSearchresults[0].getText({ name: "state", join: "address", label: "State/Province" });
			log.debug("getSellerDetails", "state=="+state);		

			var zip = locationSearchresults[0].getValue({name: "zip",   join: "address", label: " Zip"});
			log.debug("getSellerDetails", "zip=="+zip);

		}
		var locationData=Address1+"##"+Address2+"##"+Address3+"##"+city+"##"+state+"##"+zip+"##"+country+"##"+phone;

		return locationData;
	}
	//----------------------------------------------End-Function to fetch data from location record --------------------------------------------------------------//

//	------------------------------------------------------------------------------ Start - Methods for Date formatting ------------------------------------------------------------------------------//

	function formatdate(date_value){

		log.debug ('formatdate()', '----------------------------------Execution Starts------------------------------------' );

		log.debug ('formatdate', ' date_value =' + date_value);

		var userObj = runtime.getCurrentUser();
		log.debug ('formatdate', ' userObj =' + userObj);

		var date_format = userObj.getPreference('DATEFORMAT');
		log.debug ('formatdate', ' date_format =' + date_format);

		var d_string = date_value;
		log.debug ('formatdate', ' d_string =' + d_string);

		if(date_format == 'M/D/YYYY')
		{
			var date_split = d_string.split('/');

			var m= date_split[0];
			var d= date_split[1];
			var y=date_split[2];

			if(d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') 
			{
				d= '0'+d
			}
			if(m == '1' || m == '2' || m == '3' || m == '4' || m == '5' || m == '6' || m == '7' || m == '8' || m == '9') 
			{
				m='0'+m
			}
			//var final_date = d + '/' + m + '/' + y;
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;
		}//if(dateFormat == 'M/D/YYYY')

		else if(date_format == 'D/M/YYYY')
		{
			var date_split = d_string.split('/');

			var d= date_split[0];
			var m= date_split[1];
			var y=date_split[2];

			if(d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') 
			{
				d= '0'+d
			}
			if(m == '1' || m == '2' || m == '3' || m == '4' || m == '5' || m == '6' || m == '7' || m == '8' || m == '9') 
			{
				m='0'+m
			}
			//var final_date = d + '/' + m + '/' + y;
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;
		}//if(dateFormat == 'D/M/YYYY')

		else if (date_format == 'D-Mon-YYYY') {

			var date_split = d_string.split('-');

			var d = date_split[0];
			var m = date_split[1];
			var y = date_split[2];

			if (d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') {

				d = '0' + d;
			}

			//var final_date = d + '/' + SearchNumber(m) + '/' + y
			var final_date = d + '-' +SearchNumber(m) + '-' + y;
			log.debug('formatdate', 'month ='+ m);
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'D.M.YYYY') {

			var date_split = d_string.split('.');

			var d = date_split[0];
			var m = date_split[1];
			var y = date_split[2];

			if (d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') {

				d = '0' + d;
			}

			if (m == '1' || m == '2' || m == '3' || m == '4' || m == '5' || m == '6' || m == '7' || m == '8' || m == '9') {

				m = '0' + m;
			}
			//var final_date = d + '/' + m + '/' + y;
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;

		}
		else if (date_format == 'D-MONTH-YYYY') {

			var date_split = d_string.split('-');

			var d = date_split[0];
			var m = date_split[1];
			var y = date_split[2];

			m = SearchLongNumber(m)

			var yy = date_split[2];

			if (d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') {

				d = '0' + d;
			}
			//var final_date = d + '/' + m + '/' + y;
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;
		}
		else if (date_format == 'D MONTH, YYYY') {
			var date_split = d_string.split(' ');
			log.debug('formatdate', 'date_split ='+ date_split);

			var d = date_split[0];
			var m = date_split[1];
			var y = date_split[2];

			m = SearchLongNumber(m.replace(/,/g, ''))
			log.debug('formatdate', 'm =' + m);

			if (d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') {

				d = '0' + d;
			}
			//var final_date = d + '/' + m + '/' + y
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;
		}
		else if (date_format == 'YYYY/M/D') {

			var date_split = d_string.split('/');
			log.debug('formatdate', 'date_split ='+ date_split);

			var y = date_split[0];
			var m = date_split[1];
			var d = date_split[2];

			if (m == '1' || m == '2' || m == '3' || m == '4' || m == '5' || m == '6' || m == '7' || m == '8' || m == '9') {
				m = '0' + m;
			}
			if (d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') {
				d = '0' + d;
			}

			//var final_date = d + '/' + m + '/' + y
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'YYYY-M-D') {
			var date_split = d_string.split('-');
			log.debug('formatdate', 'date_split ='+ date_split);

			var y = date_split[0];
			var m = date_split[1];
			var d = date_split[2];

			if (m == '1' || m == '2' || m == '3' || m == '4' || m == '5' || m == '6' || m == '7' || m == '8' || m == '9') {
				m = '0' + m;
			}
			if (d == '1' || d == '2' || d == '3' || d == '4' || d == '5' || d == '6' || d == '7' || d == '8' || d == '9') {
				d = '0' + d;
			}

			//var final_date = d + '/' + m + '/' + y
			var final_date = d + '-' + m + '-' + y;
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'DD/MM/YYYY') {

			var date_split = d_string.split('/');


			var dd = date_split[0];
			var mm = date_split[1];
			var yy = date_split[2];

			if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
				mm = '0' + mm;
			}
			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
				dd = '0' + dd;
			}

			//var final_date = dd + '/' + mm + '/' + yy;
			var final_date = dd + '-' + mm + '-' + yy;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;
		}
		else if (date_format == 'DD-Mon-YYYY') {

			var date_split = d_string.split('-');

			var dd = date_split[0];

			var mm = date_split[1];
			var yy = date_split[2];

			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {

				// dd = '0' + dd;
			}
			//var final_date = dd + '-' + SearchNumber(mm) + '-' + yy

			//var final_date = dd + '/' + SearchNumber(mm) + '/' + yy
			var final_date = dd + '-' + SearchNumber(mm) + '-' + yy
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'DD.MM.YYYY') {

			var date_split = d_string.split('.');

			var dd = date_split[0];
			var mm = date_split[1];
			var yy = date_split[2];

			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {

				dd = '0' + dd;
			}

			if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {

				mm = '0' + mm;
			}

			//var final_date = dd + '/' + mm + '/' + yy;
			var final_date = dd + '-' + mm + '-' + yy;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;

		}
		else if (date_format == 'DD-MONTH-YYYY') {

			var date_split = d_string.split('-');

			var dd = date_split[0];
			var mm = date_split[1];
			var yy = date_split[2];

			//mm = SearchLongNumber(mm)

			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
			}

			//var final_date = dd + '/' + SearchLongNumber(mm) + '/' + yy;
			var final_date = dd + '-' + SearchLongNumber(mm) + '-' + yy;
			log.debug('formatdate', 'final_date ='+ final_date);
			return final_date;
		}
		else if (date_format == 'DD MONTH, YYYY') {

			var date_split = d_string.split(' ');
			log.debug('formatdate', 'date_split ='+ date_split);

			var dd = date_split[0];
			var mm = date_split[1];
			var yy = date_split[2];

			mm = SearchLongNumber(mm.replace(/,/g, ''))
			log.debug('date_split', 'mm =' + mm);

			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
				// dd = '0' + dd; 
			}
			//var final_date = dd + '/' + mm + '/' + yy
			var final_date = dd + '-' + mm + '-' + yy
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'MM/DD/YYYY') {

			var date_split = d_string.split('/');

			var mm = date_split[0];
			var dd = date_split[1];
			var yy = date_split[2];

			if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
				//mm = '0' + mm;
			}
			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
				//dd = '0' + dd;
			}

			//var final_date = dd + '/' + mm + '/' + yy;
			var final_date = dd + '-' + mm + '-' + yy;
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'YYYY/MM/DD') {

			var date_split = d_string.split('/');

			var yy = date_split[0];
			var mm = date_split[1];
			var dd = date_split[2];

			if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
				//mm = '0' + mm;
			}
			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
				//dd = '0' + dd;
			}
			//var final_date = dd + '/' + mm + '/' + yy;
			var final_date = dd + '-' + mm + '-' + yy;
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else if (date_format == 'YYYY-MM-DD') {

			var date_split = d_string.split('-');
			log.debug('formatdate', 'date_split ='+ date_split);

			var yy = date_split[0];
			var mm = date_split[1];
			var dd = date_split[2];

			if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
				//mm = '0' + mm;
			}
			if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
				//dd = '0' + dd;
			}

			//var final_date = dd + '/' + mm + '/' + yy;
			var final_date = dd + '-' + mm + '-' + yy;
			log.debug('formatdate', 'final_date ='+ final_date);

			return final_date;
		}
		else {
			return null;
		}
	}
//	------------------------------------------------------------------------------ End - Methods for Date formatting ------------------------------------------------------------------------------//

	function getUpdatedStatus_GenerateEWB(recObj,urlGenerateEWBbyIRNStatusAPI,s_referenceId,arrHeaders){

		var generateEWBbyIRNStatusResponse = https.get({url: urlGenerateEWBbyIRNStatusAPI+s_referenceId,headers: arrHeaders	});
		log.debug(" stringify generateEWBbyIRNStatusResponse==",JSON.stringify(generateEWBbyIRNStatusResponse));

		var generateEWBbyIRNStatusResponseBody = JSON.parse(generateEWBbyIRNStatusResponse.body);
		log.debug("generateEWBbyIRNStatusResponseBody==",generateEWBbyIRNStatusResponseBody);

		if(generateEWBbyIRNStatusResponseBody){

			var	genEWBbyIRNResponseStatus  = generateEWBbyIRNStatusResponseBody.status
			log.debug("genEWBbyIRNResponseStatus==",genEWBbyIRNResponseStatus);

			recObj.setValue({fieldId:'custbody_yil_gst_ewb_savedocsts_resps',value:genEWBbyIRNResponseStatus });

			if(genEWBbyIRNResponseStatus =="P"){
				if(generateEWBbyIRNStatusResponseBody.hasOwnProperty("dataReport") == true){

					var arrDataReport_genEWBbyIRN = generateEWBbyIRNStatusResponseBody.dataReport;			
					log.debug("arrDataReport_genEWBbyIRN ==",arrDataReport_genEWBbyIRN[0]);

					var ewbNo= arrDataReport_genEWBbyIRN[0].ewayBillNumber
					log.debug("ewbNo==",ewbNo);

					var generatedDate= arrDataReport_genEWBbyIRN[0].generatedDate
					log.debug("generatedDate==",generatedDate);

					var ewbErrors = arrDataReport_genEWBbyIRN[0].errors
					log.debug("ewbErrors==",ewbErrors);

					if(ewbNo){
						ewbNo = ewbNo.toString();
						recObj.setValue({fieldId:'custbody_yil_gst_einv_ewbno',value:ewbNo });	
						//recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:"" });
					}

					if(generatedDate){
						recObj.setValue({fieldId:'custbody_yil_gst_einv_ewbgendate_text',value:generatedDate });	
					}

					//if(!_logValidation(ewbNo) && _logValidation(ewbErrors)){
					if (_logValidation(ewbErrors)){
						ewbErrors = JSON.stringify(ewbErrors);
						recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:ewbErrors });
					}
				}
			}
			/*If Save Document Status API Response may be PE,IP,YNS,ER
			 * PE - Processed with Errors (Validation Errors at Cygnet GSP or After IRN Generation Completion or GST or EWB)
			 * IP - In Progress either at Cygnet GSP or GST or IRP or EWB
			 * ER - Error at Cygnet GSP
			 * YNS - Yet Not Started at Cygnet GSP*/

			if( genEWBbyIRNResponseStatus != "P"){

				if(genEWBbyIRNResponseStatus =="IP" || genEWBbyIRNResponseStatus=='YNS'){
					recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:" " });
					recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });
				}

				var genEWBbyIRNStatusReqId= generateEWBbyIRNStatusResponseBody.requestId;
				log.debug("genEWBbyIRNStatusReqId##",genEWBbyIRNStatusReqId);

				var genEWBbyIRNStatusErrors= generateEWBbyIRNStatusResponseBody.errors;
				log.debug("genEWBbyIRNStatusErrors##",JSON.stringify(genEWBbyIRNStatusErrors));							

				var genEWBbyIRNStatusValidateReport= generateEWBbyIRNStatusResponseBody.validationReport;
				log.debug("genEWBbyIRNStatusValidateReport##",JSON.stringify(genEWBbyIRNStatusValidateReport));

				if(genEWBbyIRNStatusValidateReport){

					genEWBbyIRNStatusValidateReport = JSON.stringify(genEWBbyIRNStatusValidateReport);
					recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:genEWBbyIRNStatusValidateReport });
					recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });

					var propertyErrors1 = JSON.parse(genEWBbyIRNStatusValidateReport).propertyErrors;
					log.debug('onRequest:POST','gernerate EWB by IRN propertyErrors1 :'+propertyErrors1);

					var propertyErrors = generateEWBbyIRNStatusResponseBody.validationReport.propertyErrors 
					log.debug('onRequest:POST','gernerate EWB by IRN propertyErrors :'+propertyErrors);
				}			

				if(generateEWBbyIRNStatusResponseBody.hasOwnProperty("dataReport") == true){

					var arrDataReport_genEWBbyIRN = generateEWBbyIRNStatusResponseBody.dataReport;			
					log.debug("arrDataReport_genEWBbyIRN ==",arrDataReport_genEWBbyIRN[0]);

					var ewbErrors = arrDataReport_genEWBbyIRN[0].errors
					log.debug("ewbErrors==",ewbErrors);
					if(ewbErrors){
						recObj.setValue({fieldId:'custbody_yil_gst_einv_ewb_errordetails',value:JSON.stringify(ewbErrors)});
						recObj.setValue({fieldId:'custbody_yil_gst_einv_auth_err_details',value:" " });
					}

				}

			}
		}
	}

	function _logValidation(value) 
	{
		if(value!='null' && value != null && value != '' && value != undefined && value != 'undefined' && value != 'NaN' && value != NaN) 
		{
			return true;
		}
		else 
		{ 
			return false;
		}
	}
	//------------------------------------------------- End - Custom Functions ------------------------------------------------------------------------------//

	return {
		onRequest: onRequest
	};

});
