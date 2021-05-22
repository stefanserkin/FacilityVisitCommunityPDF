import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import FIRSTNAME_FIELD from '@salesforce/schema/User.FirstName';

export default class CommunityGreetingCard extends LightningElement {
    @track error;
    @track name = '';

    @wire(getRecord, {
        recordId: USER_ID,
        fields: [FIRSTNAME_FIELD]
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.name = data.fields.FirstName.value;
        }
    }

}