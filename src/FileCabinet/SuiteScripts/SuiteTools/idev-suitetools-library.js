/**
 * SuiteTools Library
 *
 * This is the library file for SuiteTools.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2023  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/file", "N/log", "N/query", "N/record", "N/redirect", "N/search", "N/url"], function (require, exports, file, log, query, record, redirect, search, url) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsLibraryNetSuiteSuiteQl = exports.SuiteToolsLibraryNetSuiteSearch = exports.SuiteToolsLibraryNetSuiteScript = exports.SuiteToolsLibraryNetSuiteRecord = exports.SuiteToolsLibraryNetSuiteFile = exports.SuiteToolsLibraryNetSuite = exports.SuiteToolsLibrary = void 0;
    /**
     * SuiteTools Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibrary {
        get stApp() {
            return this._stApp;
        }
        get stLibNs() {
            return this._stLibNs;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibrary:constructor() initiated', details: null });
            this._stApp = stApp;
            this._stLibNs = new SuiteToolsLibraryNetSuite(this.stApp);
        }
    }
    exports.SuiteToolsLibrary = SuiteToolsLibrary;
    /**
     * SuiteTools NetSuite Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibraryNetSuite {
        get stApp() {
            return this._stApp;
        }
        get stLibNsFile() {
            return this._stLibNsFile;
        }
        get stLibNsRecord() {
            return this._stLibNsRecord;
        }
        get stLibNsScript() {
            return this._stLibNsScript;
        }
        get stLibNsSearch() {
            return this._stLibNsSearch;
        }
        get stLibNsSuiteQl() {
            return this._stLibNsSuiteQl;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibraryNetSuite:constructor() initiated', details: null });
            this._stApp = stApp;
            this._stLibNsFile = new SuiteToolsLibraryNetSuiteFile(this.stApp);
            this._stLibNsRecord = new SuiteToolsLibraryNetSuiteRecord(this.stApp);
            this._stLibNsScript = new SuiteToolsLibraryNetSuiteScript(this.stApp);
            this._stLibNsSearch = new SuiteToolsLibraryNetSuiteSearch(this.stApp);
            this._stLibNsSuiteQl = new SuiteToolsLibraryNetSuiteSuiteQl(this.stApp);
        }
    }
    exports.SuiteToolsLibraryNetSuite = SuiteToolsLibraryNetSuite;
    /**
     * SuiteTools NetSuite File Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibraryNetSuiteFile {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Get NetSuite file object.
         *
         * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
         * @returns file
         */
        getFile(id) {
            log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFile() initiated', details: { id: id } });
            let fileObj;
            if (typeof id === 'string') {
                const filePath = `/SuiteScripts/${this.stApp.appDir}/${id}`;
                fileObj = file.load({ id: filePath });
            }
            else {
                fileObj = file.load({ id: id });
            }
            log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFile() fileObj', details: fileObj });
            return fileObj;
        }
        /**
         * Gets NetSuite file contents.
         *
         * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
         * @returns file contents
         */
        getFileContents(id) {
            log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });
            const fileObj = this.getFile(id);
            return fileObj.getContents();
        }
        /**
         * Gets NetSuite file URL.
         *
         * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
         * @returns file url
         */
        getFileURL(fileName) {
            log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFileContents() initiated', details: { fileName: fileName } });
            const fileObj = this.getFile(fileName);
            return fileObj.url;
        }
    }
    exports.SuiteToolsLibraryNetSuiteFile = SuiteToolsLibraryNetSuiteFile;
    /**
     * SuiteTools NetSuite Record Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibraryNetSuiteRecord {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Create custom record or list entry
         *
         * @param recordType
         * @param recordId
         * @returns true if successful else false
         */
        createCustomRecord(recordType, values) {
            log.debug({
                title: 'SuiteToolsLibraryNetSuiteRecord:createCustomRecord() initiated',
                details: { recordType: recordType, values: values },
            });
            let success = false;
            try {
                const recordObj = record.create({
                    type: recordType,
                });
                for (const field in values) {
                    recordObj.setValue({ fieldId: field, value: values[field] });
                }
                recordObj.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true,
                });
                success = true;
            }
            catch (e) {
                log.error({ title: `SuiteToolsLibraryNetSuiteRecord:createCustomRecord - Error on ${recordType}`, details: e });
            }
            return success;
        }
        /**
         * Update custom record or list entry
         *
         * @param recordType
         * @param recordId
         * @returns true if successful else false
         */
        updateCustomRecord(recordType, recordId, values) {
            log.debug({
                title: 'SuiteToolsLibraryNetSuiteRecord:updateCustomRecord() initiated',
                details: { recordType: recordType, recordId: recordId, values: values },
            });
            let success = false;
            try {
                const recordObj = record.load({
                    type: recordType,
                    id: recordId,
                });
                for (const field in values) {
                    recordObj.setValue({ fieldId: field, value: values[field] });
                }
                recordObj.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true,
                });
                success = true;
            }
            catch (e) {
                log.error({ title: `SuiteToolsLibraryNetSuiteRecord:updateCustomRecord - Error on ${recordType}`, details: e });
            }
            return success;
        }
        /**
         * Clears custom record.
         *
         * @param recordType
         * @returns true if successful else false
         */
        clearCustomRecord(recordType) {
            let success = false;
            try {
                const queryResults = query.runSuiteQL({ query: `SELECT ID FROM ${recordType}` }).asMappedResults();
                for (let i = 0; i < queryResults.length; i++) {
                    const recordId = queryResults[i].id;
                    log.debug({
                        title: 'SuiteToolsLibraryNetSuiteRecord:clearCustomRecord() deleting record',
                        details: { recordType: recordType, recordID: recordId },
                    });
                    record.delete({ type: recordType, id: recordId });
                }
                success = true;
            }
            catch (e) {
                log.error({ title: `SuiteToolsLibraryNetSuiteRecord:clearCustomRecord - Error on ${recordType}`, details: e });
            }
            return success;
        }
        /**
         * Disable custom record or list
         *
         * @param recordType
         * @returns true if successful else false
         */
        disableCustomRecord(recordType) {
            let success = false;
            try {
                const queryResults = query.runSuiteQL({ query: `SELECT ID FROM ${recordType}` }).asMappedResults();
                for (let i = 0; i < queryResults.length; i++) {
                    const recordId = queryResults[i].id;
                    log.debug({
                        title: 'SuiteToolsLibraryNetSuiteRecord:disableCustomRecord() disabling record',
                        details: { recordType: recordType, recordId: recordId },
                    });
                    const disableRecord = record.load({
                        type: recordType,
                        id: recordId,
                    });
                    // set field "isinactive" to true
                    disableRecord.setValue({ fieldId: 'isinactive', value: true });
                    // save record
                    disableRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true,
                    });
                }
                success = true;
            }
            catch (e) {
                log.error({ title: `SuiteToolsLibraryNetSuiteRecord:disableCustomRecord - Error on ${recordType}`, details: e });
            }
            return success;
        }
        /**
         * Gets the Custom List's internal id.
         *
         * @param customList - the custom list id (e.g. "customlist_...")
         * @returns the internal id
         */
        getCustomListInternalId(customList) {
            let result = 0;
            const sql = `
        SELECT
          CustomList.internalId,
        FROM
          CustomList
        WHERE
          CustomList.scriptId = '${customList.toUpperCase()}'
      `;
            const resultSet = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomListInternalId() - resultSet', details: resultSet });
            if (resultSet.length > 0) {
                result = resultSet[0].internalid;
            }
            log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomListInternalId() returning', details: result });
            return result;
        }
        /**
         * Gets the Custom Record's internal id.
         *
         * @param customRecord - the custom record id (e.g. "customrecord_...")
         * @returns the internal id
         */
        getCustomRecordInternalId(customRecord) {
            let result = 0;
            const sql = `
        SELECT
          CustomRecordType.internalId,
        FROM
          CustomRecordType
        WHERE
          CustomRecordType.scriptId = '${customRecord.toUpperCase()}'
      `;
            const resultSet = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomRecordInternalId() - resultSet', details: resultSet });
            if (resultSet.length > 0) {
                result = resultSet[0].internalid;
            }
            log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomRecordInternalId() returning', details: result });
            return result;
        }
    }
    exports.SuiteToolsLibraryNetSuiteRecord = SuiteToolsLibraryNetSuiteRecord;
    /**
     * SuiteTools NetSuite Script Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibraryNetSuiteScript {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Redirects to SuiteScript script.
         *
         * @param scriptId - the script id
         * @param deploymentId - the deployment id
         * @param parameters - the parameters
         */
        redirectToScript(scriptId, deploymentId, params) {
            try {
                log.debug({
                    title: 'SuiteToolsLibraryNetSuiteScript:redirectToScript() initiated',
                    details: { scriptId: scriptId, deploymentId: deploymentId, params: params },
                });
                const scriptUrl = url.resolveScript({
                    scriptId: scriptId,
                    deploymentId: deploymentId,
                });
                log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:redirectToScript() redirecting to', details: scriptUrl });
                redirect.redirect({
                    url: scriptUrl,
                    parameters: params,
                });
            }
            catch (e) {
                log.error('SuiteToolsLibraryNetSuiteScript:redirectToScript() error', e);
            }
        }
    }
    exports.SuiteToolsLibraryNetSuiteScript = SuiteToolsLibraryNetSuiteScript;
    /**
     * SuiteTools NetSuite Search Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibraryNetSuiteSearch {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Runs the Search query.
         *
         * @param type
         * @param columns
         * @param filters
         * @param rows
         * @param [setSession]
         * @returns the search results
         */
        search(type, columns, filters, rows, setSession = false
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
            log.debug({
                title: `SuiteToolsLibraryNetSuiteSearch:search() initiated`,
                details: { type: type, columns: columns, filters: filters, rows: rows, setSession: setSession },
            });
            // default number of required values if not specified
            if (!rows) {
                rows = '50';
            }
            const stSearch = search.create({ type: type });
            stSearch.columns = columns;
            stSearch.filters = filters;
            if (setSession) {
                // save the search to the session for display in the UI if in DEV mode
                this.stApp.setSession('search', JSON.stringify(stSearch));
            }
            // TODO: use run().each() instead of run().getRange() for the 4,000 result limit
            // var searchResultCount = scriptexecutionlogSearchObj.runPaged().count;
            // log.debug("scriptexecutionlogSearchObj result count",searchResultCount);
            // scriptexecutionlogSearchObj.run().each(function(result){
            // // .run().each has a limit of 4,000 results
            // return true;
            // });
            // run the search
            const searchResults = stSearch.run().getRange({
                start: 0,
                end: parseInt(rows),
            });
            log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() returning', details: searchResults });
            return searchResults;
        }
    }
    exports.SuiteToolsLibraryNetSuiteSearch = SuiteToolsLibraryNetSuiteSearch;
    /**
     * SuiteTools NetSuite SuiteQL Library
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsLibraryNetSuiteSuiteQl {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Runs the SuiteQL query.
         *
         * @param sql - the sql query
         * @param [setSession] - set to true to save the query to the session for display in the UI if in DEV mode
         * @returns the query results
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query(sql, setSession = false) {
            if (sql) {
                // remove line endings
                sql = sql.toString().replace(/(\r\n|\n|\r)/gm, ' ');
            }
            log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:query() initiated with ', details: { sql: sql } });
            if (setSession) {
                // save the sql to the session for display in the UI if in DEV mode
                this.stApp.setSession('sql', sql);
            }
            let results = [];
            try {
                results = query.runSuiteQL({ query: sql }).asMappedResults();
            }
            catch (error) {
                log.error({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:query() error', details: error });
                results = [];
            }
            // log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:query() returning', details: results });
            return results;
        }
        /**
         * Gets field value from SQL query
         *
         * @param sql - the sql query
         * @param field - the field to return
         * @returns the field value or empty string if not found
         */
        getSqlValue(sql, field) {
            let resultField = ''; // default to empty string
            const resultSet = this.query(sql);
            log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() resultSet =', details: resultSet });
            // grab the first row if it exists
            if (resultSet.length > 0) {
                const resultJson = resultSet[0];
                log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() resultJson = ', details: resultJson });
                const resultObject = JSON.parse(JSON.stringify(resultJson));
                if (resultObject[field]) {
                    // return the field value since it exists
                    resultField = resultObject[field];
                }
            }
            log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() returning', details: resultField });
            return String(resultField);
        }
    }
    exports.SuiteToolsLibraryNetSuiteSuiteQl = SuiteToolsLibraryNetSuiteSuiteQl;
});
