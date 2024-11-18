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
define(["require", "exports", "N/log", "./handlebars.min"], function (require, exports, log, Handlebars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsView = void 0;
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
         * Render SPA page
         *
         * @returns HTML content
         */
        renderSpa() {
            log.debug({ title: 'SuiteToolsView:renderSpa() initiated', details: null });
            const layoutValues = {};
            // // TODO verify that this does not negatively impact and then remove the values from settings
            // (layoutValues['css'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(this.stApp.appCssFile)),
            //   (layoutValues['js'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(this.stApp.appJsFile));
            layoutValues['css'] = this.stApp.stAppSettings.cssUrl;
            layoutValues['js'] = this.stApp.stAppSettings.jsUrl;
            // layoutValues['scriptUrl'] = this.stApp.scriptUrl;
            // layoutValues['userName'] = this.stApp.stAppNs.runtime.getCurrentUser().name;
            // layoutValues['userEmail'] = this.stApp.stAppNs.runtime.getCurrentUser().email;
            // TODO move this to client side
            // layoutValues['alert'] = this.stApp.getAlert();
            // TODO move this to client side
            // if (this.stApp.stAppSettings.devMode) {
            //   layoutValues['remainingUsage'] =
            //     this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() +
            //     ' units' +
            //     ' (' +
            //     this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() / 10 +
            //     '%)';
            //   layoutValues['sql'] = this.stApp.getSession('sql');
            //   layoutValues['search'] = this.stApp.getSession('search');
            // }
            const layout = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('pages/index.html');
            const layoutTemplate = Handlebars.compile(layout);
            let content = layoutTemplate(layoutValues);
            content += this.getPageFooterComments();
            this.stApp.context.response.write(content);
        }
        /**
         * Renders the Application Error form.
         *
         * @param appError - issues with the application that prevent it from running properly
         */
        renderAppErrorForm(e, devMode) {
            log.debug({ title: 'SuiteToolsView:renderAppErrorForm() initiated', details: e });
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('pages/appError.html');
            const bodyValues = {};
            bodyValues['id'] = e.id;
            bodyValues['name'] = e.name;
            bodyValues['message'] = e.message;
            if (devMode && Array.isArray(e.stack) && e.stack.length > 0) {
                const stackLines = e.stack[0];
                log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLines', details: stackLines });
                const stackLinesArray = stackLines.split('at');
                log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLinesArray', details: stackLinesArray });
                bodyValues['stack'] = stackLinesArray;
            }
            this.renderPageOnly(body, bodyValues);
        }
        /**
         * Renders the Application Issues form.
         *
         * @param issues - issues with the application that prevent it from running properly
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderAppIssuesForm(issues) {
            log.debug({ title: 'SuiteToolsView:renderAppIssuesForm() initiated', details: { issues: issues } });
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('pages/appIssues.html');
            const bodyValues = {};
            bodyValues['issues'] = issues;
            this.renderPageOnly(body, bodyValues);
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
            const bodyTemplate = Handlebars.compile(body);
            const bodyContent = bodyTemplate(bodyValues);
            this.stApp.context.response.write(bodyContent);
        }
        getPageFooterComments() {
            log.debug({ title: 'SuiteToolsView:getPageFooterComments() initiated', details: null });
            const lines = [];
            lines.push('<!-- SuiteTools Application' + ' -->');
            lines.push('<!-- ScriptUrl: ' + this.stApp.scriptUrl + ' -->');
            lines.push('<!-- ApiUrl: ' + this.stApp.apiUrl + ' -->');
            lines.push('<!-- NetSuite -->');
            return lines.join('\n');
        }
    }
    exports.SuiteToolsView = SuiteToolsView;
});
