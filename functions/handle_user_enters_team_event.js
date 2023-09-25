const getRelevantTargetCollections = (targetDb) => {
    // Add all collections that need binderName update
    const targetCollectionNames = ['mv-user-enters-team-events'];
    return targetCollectionNames.map((targetCollectionName) => targetDb.collection(targetCollectionName));
};

const getBaseReportParams = (fullDocument) => {
    return {
        eventType: fullDocument.eventType,
        teamId: fullDocument.uniqueObjectId.teamId,
        timestamp: fullDocument.timestamp,
        userId: fullDocument.createdBy,
        userEmail: fullDocument.email,
        insertedAt: new Date(),
    };
};

const handleUserEntersTeamEvent = async (reportsServiceDatabase, changeEvent) => {
    const { fullDocument } = changeEvent;
    const baseReportParams = getBaseReportParams(fullDocument);

    if (changeEvent.operationType === 'insert') {
        console.log('Inserting User Enters Team Event');
        const targetCollections = getRelevantTargetCollections(reportsServiceDatabase);
        const promises = targetCollections.map((targetCollection) => {
            return targetCollection
                .insert(baseReportParams)
                .then((res) => console.log('User Enters Team Event Inserted', JSON.stringify(res)))
                .catch((error) => console.error('Failed to insert User Enters Team Event', JSON.stringify(error)));
        });
        return Promise.all(promises);
    }
};

exports = handleUserEntersTeamEvent

// Check if 'module' is defined (Node.js environment) before exporting

if (typeof module !== 'undefined') {
    module.exports = handleUserEntersTeamEvent;
}