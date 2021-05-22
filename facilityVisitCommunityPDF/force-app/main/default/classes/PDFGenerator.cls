public with sharing class PDFGenerator {
    
    @AuraEnabled
    public static List<Facility_Visit__c> getFacilityVisits(String recordId) {

        return [SELECT Id, Name, Location_Name__c, Contact_Name__c, Check_In_Date__c
                  FROM Facility_Visit__c
                 WHERE Contact__c = :recordId
                   AND Failed__c = false
                  WITH SECURITY_ENFORCED
                 ORDER BY Facility_Visit_DateTime__c DESC
                 LIMIT 1000];
    }

}