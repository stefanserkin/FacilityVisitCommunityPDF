public with sharing class PDFGenerator {
    
    @AuraEnabled
    public static List<Facility_Visit__c> getFacilityVisits(String recordId, Date minDate, Date maxDate) {
        Integer minDay = minDate.day();
        Integer minMonth = minDate.month();
        Integer minYear = minDate.year();
        Integer maxDay = maxDate.day();
        Integer maxMonth = maxDate.month();
        Integer maxYear = maxDate.year();

        DateTime minDateTime = DateTime.newInstance(minYear, minMonth, minDay, 0, 0, 0);
        DateTime maxDateTime = DateTime.newInstance(maxYear, maxMonth, maxDay, 23, 59, 59);

        return [SELECT Id, Name, Location_Name__c, Contact_Name__c, Check_In_Date__c, Guest_Pass__c
                  FROM Facility_Visit__c
                 WHERE Contact__c = :recordId
                   AND Failed__c = false
                   AND Facility_Visit_DateTime__c > :minDateTime
                   AND Facility_Visit_DateTime__c < :maxDateTime
                  WITH SECURITY_ENFORCED
                 ORDER BY Facility_Visit_DateTime__c DESC
                 LIMIT 1000];
    }

}