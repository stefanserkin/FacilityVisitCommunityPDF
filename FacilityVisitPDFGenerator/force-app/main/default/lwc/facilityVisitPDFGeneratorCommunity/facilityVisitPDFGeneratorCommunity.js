/* *
 *  Created by Stefan Serkin on May 22, 2021
 * */

import { LightningElement, track, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { loadScript } from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import AG_LOGO_IMAGE from '@salesforce/resourceUrl/ag_logo';
import USER_ID from '@salesforce/user/Id';
import CONTACT_ID from '@salesforce/schema/User.ContactId';
import FIRSTNAME_FIELD from '@salesforce/schema/User.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/User.LastName';

import getFacilityVisits from '@salesforce/apex/PDFGenerator.getFacilityVisits';


export default class FacilityVisitPDFGeneratorCommunity extends LightningElement {
    @api pdfTextColor;
    agLogo = AG_LOGO_IMAGE;
    facilityVisitList = [];
    showDateSelectors = false;
    headers = this.createHeaders([
        "Check_In_Date__c",
        "Contact_Name__c",
        "Location_Name__c"
    ]);

    @track error;
    @track firstName = '';
    @track recordId = '';
    @track minDate = new Date(1990, 0, 1); // January 1, 1990
    @track maxDate = new Date(2090, 0, 1); // January 1, 2090
    @track minDateString = this.minDate.toLocaleDateString("en-US");
    @track maxDateString = this.maxDate.toLocaleDateString("en-US");

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [CONTACT_ID, FIRSTNAME_FIELD, LASTNAME_FIELD]
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.recordId = data.fields.ContactId.value;
            this.firstName = data.fields.FirstName.value;
            this.lastName = data.fields.LastName.value;
        }
    }

    renderedCallback() {
        Promise.all([
            loadScript(this, JSPDF)
        ]);
    }

    generatePdf(){
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "portrait"
            /*
            encryption: {
                userPassword: "user",
                ownerPassword: "owner",
                userPermissions: ["print", "modify", "copy", "annot-forms"]
            }
            */
            
        });
        doc.addImage(this.agLogo, "PNG", 5, 5, 58, 20, null, "FAST");
        doc.setTextColor(this.pdfTextColor);
        doc.text("Facility Visit History for " + this.firstName + " " + this.lastName, 10, 30);
        doc.text('Date Range: ' + this.minDateString + ' - ' + this.maxDateString, 10, 37);
        doc.table(10, 44, this.facilityVisitList, this.headers, { autosize:true });
        doc.save("facilityvisits.pdf");
    }

    generateData(){
        getFacilityVisits({ recordId: this.recordId, minDate: this.minDate, maxDate: this.maxDate })
        .then(result => {
            this.facilityVisitList = result;
            this.generatePdf();
        });
    }

    createHeaders(keys) {
        var result = [];
        for (var i = 0; i < keys.length; i += 1) {
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 85,
                align: "center",
                padding: 0
            });
        }
        return result;
    }

    handleSetDateRange() {
        this.showDateSelectors = !this.showDateSelectors;
        if (!this.showDateSelectors) {
            this.minDate = new Date(1990, 0, 1);
            this.maxDate = new Date(2090, 0, 1);
        }
    }

    handleMinChange(event) {
        this.minDate = event.target.value;
        this.updateMinDateString();
    }

    handleMaxChange(event) {
        this.maxDate = event.target.value;
        this.updateMaxDateString();
    }

    // Reconstruct strings of dates
    updateMinDateString() {
        this.minDateString = new Date(Date.parse(this.minDate)).toLocaleDateString("en-US");
    }

    updateMaxDateString() {
        this.maxDateString = new Date(Date.parse(this.maxDate)).toLocaleDateString("en-US");
    }

}