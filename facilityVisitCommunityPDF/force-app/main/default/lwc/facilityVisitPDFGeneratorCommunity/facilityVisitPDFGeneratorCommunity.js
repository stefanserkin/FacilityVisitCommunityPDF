/* *
 *  Created by Stefan Serkin on May 22, 2021
 * */

import { LightningElement, track, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import AG_LOGO_IMAGE from '@salesforce/resourceUrl/ag_logo';
import USER_ID from '@salesforce/user/Id';
import CONTACT_ID from '@salesforce/schema/User.ContactId';
import FIRSTNAME_FIELD from '@salesforce/schema/User.FirstName';

import getFacilityVisits from '@salesforce/apex/PDFGenerator.getFacilityVisits';


export default class FacilityVisitPDFGeneratorCommunity extends LightningElement {
    @api pdfTextColor;
    agLogo = AG_LOGO_IMAGE;
    facilityVisitList = [];
    headers = this.createHeaders([
        "Contact_Name__c",
        "Location_Name__c",
        "Check_In_Date__c"
    ]);

    @track error;
    @track name = '';
    @track recordId = '';
    minDate = new Date(1990, 0, 1); // January 1, 1990
    maxDate = new Date(2090, 0, 1); // January 1, 2090

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [CONTACT_ID, FIRSTNAME_FIELD]
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.recordId = data.fields.ContactId.value;
            this.name = data.fields.FirstName.value;
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
        doc.text("Facility Visit History", 10, 30);
        doc.table(10, 40, this.facilityVisitList, this.headers, { autosize:true });
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

    handleMinChange(event) {
        this.minDate = event.target.value;
    }

    handleMaxChange(event) {
        this.maxDate = event.target.value;
    }

}
