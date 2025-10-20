/**
 * SuiteTools Library - NetSuite Email
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as email from 'N/email';
import * as log from 'N/log';

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {}

/**
 * SuiteTools NetSuite Email Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteEmail {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Send Email Notification
   *
   * @param subject - email subject
   * @param content - email core content
   */
  public sendNotification(
    author: number,
    recipients: [number] | [string],
    replyTo: string,
    subject: string,
    body: string,
  ): void {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() initiated',
      details: { author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body },
    });

    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() sending email',
      details: { author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body },
    });
    // send email
    try {
      email.send({ author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body });
    } catch (error) {
      log.error({
        title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() error sending email',
        details: { error: error },
      });
    }
    // log.debug({
    //   title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() email sent',
    //   details: null,
    // });
  }
}
