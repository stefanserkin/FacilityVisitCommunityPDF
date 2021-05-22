import { LightningElement } from 'lwc';
import UES_IMAGE from '@salesforce/resourceUrl/site_selector_img_ues';
import BPC_IMAGE from '@salesforce/resourceUrl/site_selector_img_bpc';
import AG_LOGO_IMAGE from '@salesforce/resourceUrl/ag_logo';

export default class LandingPageSiteSelector extends LightningElement {
    uesImage = UES_IMAGE;
    bpcImage = BPC_IMAGE;
    agLogo = AG_LOGO_IMAGE;

}