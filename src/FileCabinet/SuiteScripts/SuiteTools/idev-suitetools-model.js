/**
 * SuiteTools Model
 *
 * This script that handles the data logic.
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
define(["require", "exports", "N/log", "N/search"], function (require, exports, log, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsModel = void 0;
    /**
     * SuiteTools Model
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsModel {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsModel:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        // Get Folders SQL
        // let sql = `SELECT
        // 	MediaItemFolder.id,
        // 	BUILTIN.DF(MediaItemFolder.owner) AS owner,
        // 	MediaItemFolder.foldertype,
        // 	MediaItemFolder.appfolder,
        // 	MediaItemFolder.name,
        // 	MediaItemFolder.description,
        // 	MediaItemFolder.lastModifiedDate,
        // 	MediaItemFolder.numFolderFiles,
        // 	MediaItemFolder.folderSize,
        // 	MediaItemFolder.parent
        // FROM
        // 	MediaItemFolder
        // WHERE
        // 	isTopLevel = 'T'
        // ORDER BY
        // 	name`;
        /**
         * Get Files
         *
         * @param rows - the number of rows to return
         * @param types - the file types
         * @param versions - the API versions
         * @returns results
         */
        getFiles(rows, types, createdDateOptions, modifiedDateOptions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
            log.debug({
                title: `SuiteToolsModel:getFiles() initiated`,
                details: {
                    rows: rows,
                    types: types,
                    createdDateOptions: createdDateOptions,
                    modifiedDateOptions: modifiedDateOptions,
                },
            });
            let sql = `SELECT
      file.id,
      file.folder,
      file.createddate,
      file.lastmodifieddate,
      file.filetype,
      BUILTIN.DF(file.filetype) AS filetypename,
      file.name || ' (' || file.id  || ')' AS name,
      file.filesize,
      file.description,
      file.url
    FROM
      file`;
            // add where clause
            const where = [];
            if (rows) {
                // limit to specified number of rows
                where.push(`RowNum <= ${rows}`);
            }
            else {
                // default to 50 rows
                where.push(`RowNum <= 50`);
            }
            if (types) {
                if (Array.isArray(types)) {
                    types = types.map((type) => {
                        return `'${type.toUpperCase()}'`;
                    });
                    where.push(`filetype IN (${types.join(',')})`);
                }
            }
            if (createdDateOptions) {
                switch (createdDateOptions) {
                    case '15':
                        where.push('createddate > SYSDATE - ( 15 / 1440 )');
                        break;
                    case '60':
                        where.push('createddate > SYSDATE - ( 1 / 24 )');
                        break;
                    case 'today':
                        where.push("TO_CHAR ( createddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
                        break;
                    case 'yesterday':
                        where.push("TO_CHAR ( createddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
                        break;
                    default:
                        log.error({ title: `SuiteToolsModel:getFiles() invalid date option`, details: createdDateOptions });
                        break;
                }
            }
            if (modifiedDateOptions) {
                switch (modifiedDateOptions) {
                    case '15':
                        where.push('lastmodifieddate > SYSDATE - ( 15 / 1440 )');
                        break;
                    case '60':
                        where.push('lastmodifieddate > SYSDATE - ( 1 / 24 )');
                        break;
                    case 'today':
                        where.push("TO_CHAR ( lastmodifieddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
                        break;
                    case 'yesterday':
                        where.push("TO_CHAR ( lastmodifieddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
                        break;
                    default:
                        log.error({ title: `SuiteToolsModel:getFiles() invalid date option`, details: modifiedDateOptions });
                        break;
                }
            }
            if (where.length > 0) {
                sql += ` WHERE ${where.join(' AND ')}`;
            }
            // add order by
            sql += ` ORDER BY name ASC`;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
            return sqlResults;
        }
        /**
         * Get File
         *
         * @param id - the record to return
         * @returns results
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getFile(id) {
            log.debug({ title: `SuiteToolsModel:getFile() initiated`, details: { id: id } });
            const sql = `SELECT
      file.id,
      file.isinactive,
      file.folder,
      file.createddate,
      file.lastmodifieddate,
      file.filetype,
      file.name || ' (' || file.id  || ')' AS name,
      file.filesize,
      file.description,
      file.url
    FROM
      file
    WHERE
      file.id = ${id}`;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            return sqlResults[0];
        }
        /**
         * Get Users
         *
         * @returns results
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getUsers() {
            log.debug({ title: `SuiteToolsModel:getUsers() initiated`, details: '' });
            const sql = `SELECT
      employee.id,
      employee.firstname,
      employee.lastname,
      employee.email,
      BUILTIN.DF( employee.supervisor ) || ' (' || employee.supervisor  || ')' AS supervisor,
      employee.title
    FROM
      employee`;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
            return sqlResults;
        }
        /**
         * Get user list
         *
         * @param [active]
         * @returns users
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getUserList(active) {
            // log.debug({ title: `SuiteToolsModel:getUserList() initiated`, details: '' });
            let sql = `SELECT
      employee.id,
      employee.firstname || ' ' || employee.lastname AS name
    FROM
      employee`;
            if (active) {
                sql += ` WHERE
        giveaccess = 'T'
        AND isinactive = 'F'
      `;
            }
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            return sqlResults;
        }
        /**
         * Get User
         *
         * @param id - the script id to return
         * @returns results
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getUser(id) {
            log.debug({ title: `SuiteToolsModel:getUser() initiated`, details: { id: id } });
            const sql = `SELECT
      employee.id,
      employee.entityid,
      employee.firstname,
      employee.lastname,
      employee.email,
      BUILTIN.DF( employee.supervisor ) || ' (' || employee.supervisor  || ')' AS supervisor,
      employee.title,
      employee.isinactive,
    FROM
      employee
    WHERE
      employee.id = ${id}`;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            if (sqlResults.length === 0) {
                log.error({ title: `SuiteToolsModel:getUser() no results`, details: { id: id } });
                return null;
            }
            return sqlResults[0];
        }
        /**
         * Get User Logins
         *
         * @param rows - the number of rows to return
         * @param status - the status of the login
         * @param users - the users to return logins for
         * @param dateOptions - the dates to return logins for
         * @returns HTML content
         */
        getUserLogins(rows, status, users, dateOptions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
            log.debug({
                title: `SuiteToolsModel:getUserLogins() initiated`,
                details: {
                    rows: rows,
                    status: status,
                    users: users,
                    dateOptions: dateOptions,
                },
            });
            let sql = `SELECT
      TO_CHAR ( LoginAudit.date, 'YYYY-MM-DD HH:MI:SS' ) AS date,
      LoginAudit.status,
      LoginAudit.oAuthAppName,
      LoginAudit.oAuthAccessTokenName,
      BUILTIN.DF( LoginAudit.role ) as role,
      BUILTIN.DF( LoginAudit.user ) || ' (' || LoginAudit.user  || ')' AS userName,
      LoginAudit.emailAddress,
      LoginAudit.ipAddress,
      LoginAudit.requestUri,
      LoginAudit.detail,
      LoginAudit.secChallenge,
      LoginAudit.userAgent,
    FROM
      LoginAudit`;
            // add where clause
            const where = [];
            if (rows) {
                // limit to specified number of rows
                where.push(`RowNum <= ${rows}`);
                // } else {
                //   // default to 50 rows
                //   where.push(`RowNum <= 50`);
            }
            if (status) {
                if (status === 'success') {
                    where.push(`LoginAudit.status = 'Success'`);
                }
                if (status === 'failure') {
                    where.push(`LoginAudit.status = 'Failure'`);
                }
            }
            if (users) {
                if (Array.isArray(users)) {
                    users = users.map((user) => {
                        return `'${user.toUpperCase()}'`;
                    });
                    where.push(`LoginAudit.user IN (${users.join(',')})`);
                }
            }
            if (dateOptions) {
                switch (dateOptions) {
                    case '15':
                        where.push('date > SYSDATE - ( 15 / 1440 )');
                        break;
                    case '60':
                        where.push('date > SYSDATE - ( 1 / 24 )');
                        break;
                    case '240':
                        where.push('date > SYSDATE - ( 4 / 24 )');
                        break;
                    case 'today':
                        where.push("TO_CHAR ( date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
                        break;
                    case 'yesterday':
                        where.push("TO_CHAR ( date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
                        break;
                    default:
                        log.error({ title: `SuiteToolsModel:getScriptLogsViaSuiteQL() invalid date option`, details: dateOptions });
                        break;
                }
            }
            if (where.length > 0) {
                sql += ` WHERE ${where.join(' AND ')}`;
            }
            // add order by
            sql += ` ORDER BY LoginAudit.date DESC`;
            const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
            log.debug({ title: 'SuiteToolsModel:getUserLogins() returning', details: results });
            return results;
        }
        /**
         * Get Scripts
         *
         * @param active - the active flag
         * @param versions - the API versions
         * @param types - the script types
         * @param scripts - the scripts
         * @param owners - the script owners
         * @param files - the script files
         * @returns results
         */
        getScripts(active, versions, types, scripts, owners, files
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
            log.debug({
                title: `SuiteToolsModel:getScripts() initiated`,
                details: { active: active, versions: versions, types: types, scripts: scripts, owners: owners, files: files },
            });
            let sql = `SELECT
      script.id,
      script.apiversion,
      script.isinactive,
      script.scripttype,
      script.name || ' (' || script.id  || ')' AS name,
      script.scriptid,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      file.name || ' (' || file.id  || ')' AS scriptfile,
      script.notifyemails,
      script.description
    FROM
      script
    INNER JOIN file
      ON script.scriptfile = file.id`;
            // add where clause
            const where = [];
            if (active) {
                if (active === 'yes') {
                    where.push(`script.isinactive = 'F'`);
                }
                if (active === 'no') {
                    where.push(`script.isinactive = 'T'`);
                }
            }
            if (versions) {
                if (Array.isArray(versions)) {
                    where.push(`apiversion IN (${versions.join(',')})`);
                }
            }
            if (types) {
                if (Array.isArray(types)) {
                    types = types.map((type) => {
                        return `'${type.toUpperCase()}'`;
                    });
                    where.push(`scripttype IN (${types.join(',')})`);
                }
            }
            if (scripts) {
                if (Array.isArray(scripts)) {
                    scripts = scripts.map((script) => {
                        return `'${script.toUpperCase()}'`;
                    });
                    where.push(`id IN (${scripts.join(',')})`);
                }
            }
            if (owners) {
                if (Array.isArray(owners)) {
                    owners = owners.map((owner) => {
                        return `'${owner.toUpperCase()}'`;
                    });
                    where.push(`owner IN (${owners.join(',')})`);
                }
            }
            if (files) {
                if (Array.isArray(files)) {
                    files = files.map((file) => {
                        return `'${file.toUpperCase()}'`;
                    });
                    where.push(`file.id IN (${files.join(',')})`);
                }
            }
            if (where.length > 0) {
                sql += ` WHERE ${where.join(' AND ')}`;
            }
            // add order by
            sql += ` ORDER BY name ASC`;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
            return sqlResults;
        }
        /**
         * Get Script
         *
         * @param id - the record to return
         * @returns results
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getScript(id) {
            log.debug({ title: `SuiteToolsModel:getScript() initiated`, details: { id: id } });
            const sql = `SELECT
      script.id,
      script.apiversion,
      script.isinactive,
      script.scripttype,
      script.name,
      script.scriptid,
      script.owner,
      script.scriptfile,
      script.notifyemails,
      script.description
    FROM
      script
    WHERE
      script.id = ${id}`;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            if (sqlResults.length === 0) {
                log.error({ title: `SuiteToolsModel:getScript() no results`, details: { id: id } });
                return null;
            }
            return sqlResults[0];
        }
        /**
         * Get Script Logs results (Search version)
         *
         * The search version can return the user that triggered the log message, but it can only be filtered by days.
         *
         * @param rows - the number of rows to return
         * @param levels - levels of log (e.g. debug, error, ...)
         * @param users - users to return log records for
         * @param types - types of script
         * @param scripts - the scripts to return log records for
         * @param owners - the script owners to return log records for
         * @param dateOptions - the dates to return log records for
         * @param title - the title contains this string
         * @param detail - the detail contains this string
         * @returns HTML content
         */
        getScriptLogsViaSearch(rows, levels, users, types, scripts, owners, dateOptions, title, detail
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
            log.debug({
                title: `SuiteToolsModel:getScriptLogsViaSearch() initiated`,
                details: {
                    rows: rows,
                    levels: levels,
                    users: users,
                    types: types,
                    scripts: scripts,
                    owners: owners,
                    dateOptions: dateOptions,
                    title: title,
                    detail: detail,
                },
            });
            const columns = [
                search.createColumn({
                    name: 'internalid',
                    sort: search.Sort.DESC,
                    label: 'id',
                }),
                search.createColumn({
                    name: 'date',
                }),
                search.createColumn({
                    name: 'time',
                }),
                search.createColumn({ name: 'type' }),
                search.createColumn({ name: 'user' }),
                search.createColumn({
                    name: 'internalid',
                    join: 'user',
                    label: 'userid',
                }),
                search.createColumn({ name: 'scripttype' }),
                search.createColumn({
                    name: 'owner',
                    join: 'script',
                }),
                search.createColumn({
                    name: 'name',
                    join: 'script',
                }),
                search.createColumn({
                    name: 'internalid',
                    join: 'script',
                    label: 'scriptid',
                }),
                search.createColumn({ name: 'title' }),
                search.createColumn({ name: 'detail' }),
            ];
            const filters = [];
            if (levels) {
                filters.push(search.createFilter({ name: 'type', operator: search.Operator.ANYOF, values: levels }));
            }
            if (users) {
                // TODO - handle multiple users
                filters.push(search.createFilter({ name: 'user', operator: search.Operator.IS, values: users }));
            }
            if (types) {
                filters.push(search.createFilter({ name: 'scripttype', join: 'script', operator: search.Operator.ANYOF, values: types }));
            }
            if (scripts) {
                filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'script',
                    operator: search.Operator.ANYOF,
                    values: scripts,
                }));
            }
            if (owners) {
                filters.push(search.createFilter({
                    name: 'owner',
                    join: 'script',
                    operator: search.Operator.ANYOF,
                    values: owners,
                }));
            }
            if (dateOptions) {
                filters.push(search.createFilter({ name: 'date', operator: search.Operator.ON, values: dateOptions }));
            }
            if (title) {
                filters.push(search.createFilter({ name: 'title', operator: search.Operator.CONTAINS, values: title }));
            }
            if (detail) {
                filters.push(search.createFilter({ name: 'detail', operator: search.Operator.CONTAINS, values: detail }));
            }
            // run the search
            const searchResults = this.stApp.stLib.stLibNs.stLibNsSearch.search('scriptexecutionlog', columns, filters, rows, true);
            // get list of active users so that we can determine user ids
            const userList = this.stApp.stModel.getUserList();
            // only return the results
            const results = searchResults.map((result) => {
                // log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() - columns', details: result.columns });
                // log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() - allValues', details: result.getAllValues() });
                // add user id to user if we can determine it
                //   TODO: handle case where multiple users have the same name
                let userName = result.getValue({ name: 'user' });
                const foundUser = userList.find((user) => user.name.trim() === userName);
                if (foundUser) {
                    userName = userName + ' (' + foundUser.id + ')';
                }
                // add owner name to owner field if we can determine it
                let owner = result.getValue({ name: 'owner', join: 'script' });
                const foundName = userList.find((user) => user.id == owner);
                if (foundName) {
                    owner = foundName.name.trim() + ' (' + owner + ')';
                }
                return {
                    id: result.getValue({ name: 'internalid' }),
                    timestamp: result.getValue({ name: 'date' }) + ' ' + result.getValue({ name: 'time' }),
                    type: result.getValue({ name: 'type' }),
                    user: userName,
                    scripttype: result.getValue({ name: 'scripttype' }),
                    owner: owner,
                    scriptname: result.getValue({ name: 'name', join: 'script' }) +
                        ' (' +
                        result.getValue({ name: 'internalid', join: 'script' }) +
                        ')',
                    title: result.getValue({ name: 'title' }),
                    detail: result.getValue({ name: 'detail' }),
                };
            });
            log.debug({ title: 'SuiteToolsModel:getScriptLogsViaSearch() returning', details: results });
            return results;
        }
        /**
         * Get Script Logs results (SuiteQL version)
         *
         * The SuiteQL version can not return the user that triggered the log message, but it can only be filtered by minutes.
         *
         * @param rows - the number of rows to return
         * @param levels - type of log (e.g. debug, error, ...)
         * @param types - types of script
         * @param scripts - the scripts to return log records for
         * @param owners - the script owners to return log records for
         * @param dateOptions - the dates to return log records for
         * @param title - the title contains this string
         * @param detail - the detail contains this string
         * @returns HTML content
         */
        getScriptLogsViaSuiteQL(rows, levels, types, scripts, owners, dateOptions, title, detail
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
            log.debug({
                title: `SuiteToolsModel:getScriptLogsViaSuiteQL() initiated`,
                details: {
                    rows: rows,
                    levels: levels,
                    types: types,
                    scripts: scripts,
                    owners: owners,
                    dateOptions: dateOptions,
                    title: title,
                    detail: detail,
                },
            });
            let sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptname,
      ScriptNote.title, REPLACE( detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id`;
            // add where clause
            const where = [];
            if (rows) {
                // limit to specified number of rows
                where.push(`RowNum <= ${rows}`);
            }
            else {
                // default to 50 rows
                where.push(`RowNum <= 50`);
            }
            if (levels) {
                if (Array.isArray(levels)) {
                    levels = levels.map((type) => {
                        return `'${type.toUpperCase()}'`;
                    });
                    where.push(`ScriptNote.type IN (${levels.join(',')})`);
                }
            }
            if (types) {
                if (Array.isArray(types)) {
                    types = types.map((type) => {
                        return `'${type.toUpperCase()}'`;
                    });
                    where.push(`script.scripttype IN (${types.join(',')})`);
                }
            }
            if (scripts) {
                if (Array.isArray(scripts)) {
                    where.push(`ScriptNote.scriptType IN (${scripts.join(',')})`);
                }
            }
            if (owners) {
                if (Array.isArray(owners)) {
                    owners = owners.map((owner) => {
                        return `'${owner.toUpperCase()}'`;
                    });
                    where.push(`owner IN (${owners.join(',')})`);
                }
            }
            if (dateOptions) {
                switch (dateOptions) {
                    case '15':
                        where.push('date > SYSDATE - ( 15 / 1440 )');
                        break;
                    case '60':
                        where.push('date > SYSDATE - ( 1 / 24 )');
                        break;
                    case '240':
                        where.push('date > SYSDATE - ( 4 / 24 )');
                        break;
                    case 'today':
                        where.push("TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
                        break;
                    case 'yesterday':
                        where.push("TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
                        break;
                    default:
                        log.error({ title: `SuiteToolsModel:getScriptLogsViaSuiteQL() invalid date option`, details: dateOptions });
                        break;
                }
            }
            if (title) {
                where.push(`ScriptNote.title LIKE '%${title}%'`);
            }
            if (detail) {
                where.push(`ScriptNote.detail LIKE '%${detail}%'`);
            }
            if (where.length > 0) {
                sql += ` WHERE ${where.join(' AND ')}`;
            }
            // add order by
            sql += ` ORDER BY ScriptNote.internalId DESC`;
            // log.debug({ title: `SuiteToolsModel:getScriptLogsViaSuiteQL() generated this sql`, details: sql });
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
            return sqlResults;
        }
    }
    exports.SuiteToolsModel = SuiteToolsModel;
});
