/**
 * SuiteTools View
 *
 * This script handles the presentation.
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
define(["require", "exports", "N/log", "N/redirect", "./handlebars.min"], function (require, exports, log, redirect, Handlebars) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsView = exports.RenderType = void 0;
    var RenderType;
    (function (RenderType) {
        RenderType[RenderType["Normal"] = 1] = "Normal";
        RenderType[RenderType["PageOnly"] = 2] = "PageOnly";
        RenderType[RenderType["Modal"] = 3] = "Modal";
        RenderType[RenderType["Iframe"] = 4] = "Iframe";
    })(RenderType = exports.RenderType || (exports.RenderType = {}));
    /**
     * SuiteTools View
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsView {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsView:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Redirect to URL
         *
         * @param url - the URL
         */
        redirect(url) {
            log.debug({ title: 'SuiteToolsView:render() redirect', details: url });
            redirect.redirect({ url: url, parameters: {} });
        }
        /**
         * Builds content section.
         *
         * @param body - the templated content
         * @param [values] - the values to use in the template
         * @returns HTML content
         */
        buildContent(body, values) {
            log.debug({ title: 'SuiteToolsView:buildContent() initiated', details: null });
            // populate body content with Handlebars
            const template = Handlebars.compile(body);
            const content = template(values);
            // log.debug({ title: 'SuiteToolsView:buildContent() returning', details: content });
            return content;
        }
        /**
         * Render content
         *
         * @param renderType - the type of render
         * @param body - the templated content
         * @param [bodyValues] - the values to use in the template
         * @returns HTML content
         */
        render(renderType, body, bodyValues) {
            log.debug({ title: 'SuiteToolsView:render() initiated', details: null });
            switch (renderType) {
                case RenderType.Normal:
                    this.renderNormal(body, bodyValues);
                    break;
                case RenderType.PageOnly:
                case RenderType.Modal:
                    this.renderPageOnly(body, bodyValues);
                    break;
                case RenderType.Iframe:
                    this.renderIframe(body);
                    break;
                default:
                    // log error since invalid render type
                    log.error({
                        title: 'SuiteToolsView:render() invalid render type',
                        details: { renderType: renderType },
                    });
            }
        }
        /**
         * Renders the layout with main content.
         *
         * @param body - the templated content
         * @param [bodyValues] - the values to use in the template
         * @returns HTML content
         */
        renderNormal(body, bodyValues) {
            // log.debug({ title: 'SuiteToolsView:Render() initiated', details: null });
            // populate body content with Handlebars
            const bodyTemplate = Handlebars.compile(body);
            const bodyContent = bodyTemplate(bodyValues);
            // populate layout content with Handlebars
            const layoutValues = {};
            layoutValues['css'] = this.stApp.stAppSettings.cssUrl;
            layoutValues['js'] = this.stApp.stAppSettings.jsUrl;
            layoutValues['title'] = this.stApp.appName;
            layoutValues['body'] = bodyContent;
            layoutValues['scriptUrl'] = this.stApp.scriptUrl;
            layoutValues['appFooter'] = this.stApp.appFooter;
            layoutValues['userName'] = this.stApp.stAppNs.runtime.getCurrentUser().name;
            layoutValues['userEmail'] = this.stApp.stAppNs.runtime.getCurrentUser().email;
            layoutValues['alert'] = this.stApp.getAlert();
            if (this.stApp.stAppSettings.devMode) {
                layoutValues['remainingUsage'] =
                    this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() +
                        ' units' +
                        ' (' +
                        this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() / 10 +
                        '%)';
                layoutValues['sql'] = this.stApp.getSession('sql');
                layoutValues['search'] = this.stApp.getSession('search');
            }
            const layout = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/layouts/main.html');
            const layoutTemplate = Handlebars.compile(layout);
            const content = layoutTemplate(layoutValues);
            this.stApp.context.response.write(content);
        }
        /**
         * Renders the page without the layout.
         *
         * @param body - the templated content
         * @param [bodyValues] - the values to use in the template
         * @returns HTML content
         */
        renderPageOnly(body, bodyValues) {
            log.debug({ title: 'SuiteToolsView:RenderPage() initiated', details: null });
            // populate body content with Handlebars
            const bodyTemplate = Handlebars.compile(body);
            const bodyContent = bodyTemplate(bodyValues);
            this.stApp.context.response.write(bodyContent);
        }
        /**
         * Renders the layout with a NetSuite Saved Search in an iFrame.
         *
         * @param id - the NetSuite Saved Search ID (e.g. "customsearch_...")
         * @void writes the HTML content to the response
         */
        renderIframeSearch(id) {
            log.debug({ title: 'SuiteToolsView:renderIframe() initiated', details: { id: id } });
            // get the internal ID of the saved search
            const internalId = this.stApp.stLib.stLibNs.stLibNsSearch.getSearchInternalId('customsearch_idev_web_services_logs');
            this.renderIframe('/app/common/search/searchresults.nl?searchid=' + internalId);
        }
        /**
         * Renders the layout with an iFrame.
         *
         * @param url
         * @void writes the HTML content to the response
         */
        renderIframe(url) {
            log.debug({ title: 'SuiteToolsView:renderIframe() initiated', details: { url: url } });
            // populate body content with iFrame element
            const bodyContent = this.stApp.stView.createIframeElement(url);
            // populate layout content with Handlebars
            const layoutValues = {};
            layoutValues['css'] = this.stApp.stAppSettings.cssUrl;
            layoutValues['js'] = this.stApp.stAppSettings.jsUrl;
            layoutValues['title'] = this.stApp.appName;
            layoutValues['body'] = bodyContent;
            layoutValues['scriptUrl'] = this.stApp.scriptUrl;
            layoutValues['userName'] = this.stApp.stAppNs.runtime.getCurrentUser().name;
            layoutValues['userEmail'] = this.stApp.stAppNs.runtime.getCurrentUser().email;
            const layout = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/layouts/main.html');
            const layoutTemplate = Handlebars.compile(layout);
            const content = layoutTemplate(layoutValues);
            this.stApp.context.response.write(content);
        }
        /**
         * Creates an iFrame element with the specified URL, width and height.
         *
         * @param url - the URL to load in the iFrame
         * @param [width] - the width of the iFrame
         * @param [height] - the height of the iFrame
         * @returns an iFrame element
         */
        createIframeElement(url, width = '1350px', height = '100%') {
            log.debug({ title: 'SuiteToolsView:createIframeElement() initiated', details: { url, width, height } });
            // const title = `${Library.appName} iFrame`;
            const title = `SuiteTools iFrame`;
            // TODO: fix temporary workaround for iFrame height
            // const content = `<iframe src="${url}" name="embed" height="${height}" width="${width}" title="${title}"></iframe>`;
            const content = `<iframe src="${url}" name="embed" class="h-screen w-full" style="padding-bottom:60px; margin-bottom:-84px" title="${title}"></iframe>`;
            return content;
        }
        // ---------------------------------------------------------------------------
        // Supporting Functions
        // ---------------------------------------------------------------------------
        // /**
        //  * Generates form data form the values.
        //  *
        //  * @param values - the values
        //  * @returns the form data
        //  */
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // static generateFormData(values: any[]): string {
        //   log.debug({ title: 'SuiteToolsView:generateFormData() initiated with ', details: { values: values } });
        //   // build form data
        //   let formData = '';
        //   if (values === null || values.length == 0) {
        //     formData = 'var formData = [];';
        //   } else {
        //     formData = 'var formData = [';
        //     for (let i = 0; i < values.length; i++) {
        //       const object = values[i];
        //       const key = object.name;
        //       // log.debug({ title: 'generateFormData() key', details: key });
        //       const value = object.value;
        //       // log.debug({ title: 'generateFormData() value', details: value });
        //       formData += `{${key}: "${value}"},`;
        //     }
        //     formData += '];';
        //   }
        //   log.debug({ title: 'generateFormData() returning', details: formData });
        //   return formData;
        // }
        /**
         * Generates the form's select elements selections.
         *
         * @param values
         * @returns the select element selections
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generateFormSelections(values) {
            log.debug({ title: 'SuiteToolsView:generateFormSelections() initiated with ', details: { values: values } });
            // build form data
            let formSelections = '';
            if (values === null || values.length == 0) {
                formSelections = 'var formSelections = [];';
            }
            else {
                formSelections = 'var formSelections = [';
                for (let i = 0; i < values.length; i++) {
                    const object = values[i];
                    const key = object.name;
                    // log.debug({ title: 'SuiteToolsView:generateFormSelections() key', details: key });
                    const value = object.value;
                    // log.debug({ title: 'SuiteToolsView:generateFormSelections() value', details: value });
                    formSelections += `{${key}: "${value}"},`;
                }
                formSelections += '];';
            }
            log.debug({ title: 'SuiteToolsView:generateFormSelections() returning', details: formSelections });
            return formSelections;
        }
        /**
         * Generate table data from records array
         * @param records - the input records
         * @param cleanData - clean data?
         * @returns {string} table data
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generateTableData(records, cleanData = false) {
            log.debug({
                title: 'SuiteToolsView:generateTableData() initiated with ',
                details: { records: records, cleanData: cleanData },
            });
            // generate the table data
            let tableData = '';
            if (records === null || records.length == 0) {
                tableData = 'var tabledata = [];';
            }
            else {
                const columns = Object.keys(records[0]);
                tableData = 'var tabledata = [';
                records.forEach((row) => {
                    tableData += '{';
                    columns.forEach((col) => {
                        // clean data?
                        if (cleanData && row[col]) {
                            // remove line endings from row[col]
                            row[col] = row[col].toString().replace(/(\r\n|\n|\r)/gm, ' ');
                            // replace double quotes with single quotes
                            row[col] = row[col].toString().replace(/"/g, "'");
                        }
                        tableData += ` ${col}: "${row[col]}",`;
                    });
                    tableData += ' },';
                });
                tableData += '];';
            }
            // log.debug({ title: 'SuiteToolsView:generateTableData() returning', details: tableData });
            return tableData;
        }
        /**
         * Get element html.
         *
         * @param element - the form element to build
         *
         * @returns form element html
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getElementHtml(element) {
            log.debug({ title: `SuiteToolsView:getElementHtml() initiated`, details: { element: element } });
            let result = '';
            let elementId = '';
            let elementLabel = '';
            switch (element) {
                // CRITERIA
                case 'integration':
                    elementId = 'custom_integration';
                    elementLabel = 'Integration';
                    break;
                case 'token':
                    elementId = 'custom_token';
                    elementLabel = 'Token';
                    break;
                // TODO - add more elements once verified that this works
                default:
                    log.error({ title: `SuiteToolsView:getElementHtml() invalid element`, details: element });
                    break;
            }
            if (elementId) {
                result = `<!-- ${element} -->
      <div>
        <label for="${elementId}" class="block mb-2 text-sm font-medium  text-gray-900">${elementLabel}</label><select size=6 name="${elementId}" id="${elementId}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></select>
      </div>`;
            }
            log.debug({ title: `SuiteToolsView:getCriteria() returning`, details: result });
            return result;
        }
        /**
         * Get active options
         *
         * @returns form select options
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getActiveOptions() {
            // log.debug({ title: `SuiteToolsView:getActiveOptions() initiated`, details: '' });
            const options = [];
            options.push({ value: '', text: 'All' });
            options.push({ value: 'T', text: 'Yes' });
            options.push({ value: 'F', text: 'No' });
            return options;
        }
        /**
         * Get API version options
         *
         * @returns form select options
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getApiVersionOptions() {
            // log.debug({ title: `SuiteToolsView:getApiVersionOptions() initiated`, details: '' });
            // note: source of truth is: 'SELECT scriptVersion.id, scriptVersion.name FROM scriptVersion ORDER BY name'
            const options = [];
            options.push({ value: '', text: 'All' });
            options.push({ value: '2.1', text: '2.1' });
            options.push({ value: '2.0', text: '2.0' });
            options.push({ value: '1.0', text: '1.0' });
            return options;
        }
        /**
         * Get date options
         *
         * @returns form select options
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getDateOptions() {
            // log.debug({ title: `SuiteToolsView:getDateOptions() initiated`, details: '' });
            const options = [];
            options.push({ value: '', text: 'All' });
            options.push({ value: '15', text: 'Last 15 minutes' });
            options.push({ value: '60', text: 'Last hour' });
            options.push({ value: '240', text: 'Last 4 hours' });
            options.push({ value: 'today', text: 'Today' });
            options.push({ value: 'yesterday', text: 'Yesterday' });
            options.push({ value: 'lastweektodate', text: 'Last 7 Days' });
            return options;
        }
        /**
         * Get log level options
         *
         * @returns form select options
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getLogLevelOptions() {
            // log.debug({ title: `SuiteToolsView:getLogLevelOptions() initiated`, details: '' });
            const options = [];
            options.push({ value: '', text: 'All' });
            options.push({ value: 'DEBUG', text: 'Debug' });
            options.push({ value: 'AUDIT', text: 'Audit' });
            options.push({ value: 'ERROR', text: 'Error' });
            options.push({ value: 'EMERGENCY', text: 'Emergency' });
            options.push({ value: 'SYSTEM', text: 'System' });
            return options;
        }
        /**
         * Get row options
         *
         * @returns form select options
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getRowOptions() {
            // log.debug({ title: `SuiteToolsView:getRowOptions() initiated`, details: '' });
            const options = [];
            options.push({ value: '', text: 'All' });
            options.push({ value: '50', text: '50' });
            options.push({ value: '250', text: '250' });
            options.push({ value: '1000', text: '1000' });
            options.push({ value: '2000', text: '2000' });
            options.push({ value: '4000', text: '4000' });
            return options;
        }
    }
    exports.SuiteToolsView = SuiteToolsView;
});
