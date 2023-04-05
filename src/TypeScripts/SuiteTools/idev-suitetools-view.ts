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

import log = require('N/log');
// ignore local Handlebars import error since we just need it run on NetSuite
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Handlebars = require('./handlebars.min');

import { SuiteToolsApp } from './idev-suitetools-app';

/**
 * SuiteTools View
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsView {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsView:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Renders the layout with main content.
   *
   * @param body - the templated content
   * @param [bodyValues] - the values to use in the templates
   * @returns HTML content
   */
  public render(body: string, bodyValues?: object): void {
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
   * @param [bodyValues] - the values to use in the templates
   * @returns HTML content
   */
  public renderPage(body: string, bodyValues?: object): void {
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
  public renderIframeSearch(id: string): void {
    log.debug({ title: 'SuiteToolsView:renderIframe() initiated', details: { id: id } });

    // get the internal ID of the saved search
    const internalId = this.stApp.stLib.stLibNs.stLibNsSearch.getSearchInternalId(
      'customsearch_idev_web_services_logs'
    );

    this.renderIframe('/app/common/search/searchresults.nl?searchid=' + internalId);
  }

  /**
   * Renders the layout with an iFrame.
   *
   * @param url
   * @void writes the HTML content to the response
   */
  public renderIframe(url: string): void {
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
  private createIframeElement(url: string, width = '1350px', height = '100%'): string {
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
  public generateFormSelections(values: any): string {
    log.debug({ title: 'SuiteToolsView:generateFormSelections() initiated with ', details: { values: values } });

    // build form data
    let formSelections = '';
    if (values === null || values.length == 0) {
      formSelections = 'var formSelections = [];';
    } else {
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
  public generateTableData(records: any[], cleanData = false): string {
    // log.debug({ title: 'SuiteToolsView:generateTableData() initiated with ', details: { records: records, cleanData: cleanData } });

    // generate the table data
    let tableData = '';

    if (records === null || records.length == 0) {
      tableData = 'var tabledata = [];';
    } else {
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
}
