/* *
 *  Created by Stefan Serkin on May 16, 2021
 *  Based on YouTube tutorial from Matt Gerry Coding with the Force
 * */

import { LightningElement, track, api } from 'lwc';
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import AG_LOGO_IMAGE from '@salesforce/resourceUrl/ag_logo';

import getFacilityVisits from '@salesforce/apex/PDFGenerator.getFacilityVisits';

export default class FacilityVisitPDFGenerator extends LightningElement {
    @api recordId;
    agLogo = AG_LOGO_IMAGE;
    facilityVisitList = [];
    headers = this.createHeaders([
        "Contact_Name__c",
        "Location_Name__c",
        "Check_In_Date__c"
    ]);

    @track error;

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
        doc.setTextColor(0, 151, 76);
        doc.text("Facility Visit History", 10, 30);
        doc.table(10, 40, this.facilityVisitList, this.headers, { autosize:true });
        doc.save("facilityvisits.pdf");
    }

    generateData(){
        getFacilityVisits({ recordId: this.recordId })
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

}