export type CHANGE_VIEW_TARGET = 'mail' | 'calendar' | 'account';

// This type must be updated in the Electron application as well
export type IPCInboxMessage =
    | { type: 'updateNotification'; payload: number }
    | { type: 'userLogout'; payload: undefined }
    | { type: 'clearAppData'; payload: undefined }
    | { type: 'oauthPopupOpened'; payload: 'oauthPopupStarted' | 'oauthPopupFinished' }
    | { type: 'openExternal'; payload: string }
    | { type: 'changeView'; payload: CHANGE_VIEW_TARGET }
    | { type: 'trialEnd'; payload: 'trialEnded' | 'resetTrialEnded' };
export type IPCInboxMessageType = IPCInboxMessage['type'];

/**
 * Electron injects an object in the window object
 * This object can then be used to communicate from the web app to the desktop app
 * This type can be used in any file that needs to communicate with the desktop app.
 *
 * The object can be injected when used in specific clients to avoid adding it globally
 */
export type IPCInboxMessageBroker = {
    send: <T extends IPCInboxMessageType>(type: T, payload: Extract<IPCInboxMessage, { type: T }>['payload']) => void;
};

export const END_OF_TRIAL_KEY = 'endOfTrial';

export interface InboxDesktopFreeTrialDates {
    trialStartDate?: Date;
    trialEndDate?: Date;
}

export interface InboxDesktopFreeTrialReminders {
    first: boolean;
    second: boolean;
    third: boolean;
}
