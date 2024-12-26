/**
 * Combines internal and external log data.
 * @param internalData Data parsed from internal logs.
 * @param externalData Data fetched from external API (logs.tf).
 * @returns Combined data from both internal and external sources.
 */
export const getCombinedLogData = (internalData: any, externalData: any) => {
    const combinedData = {
        internal: internalData, // This will be a key called "internalData" with the value of the internalData object
        external: externalData, // This will be a key called "externalData" with the value of the externalData object
    };
    
    return combinedData;
};
