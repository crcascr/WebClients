import React from 'react';
import { c } from 'ttag';
import { Icon, useLoading } from 'react-components';
import { MAILBOX_LABEL_IDS } from 'proton-shared/lib/constants';
import { Label } from 'proton-shared/lib/interfaces/Label';
import { Folder } from 'proton-shared/lib/interfaces/Folder';

import ToolbarButton from './ToolbarButton';
import { Breakpoints } from '../../models/utils';
import { labelIncludes, getFolderName } from '../../helpers/labels';
import { useMoveToFolder } from '../../hooks/useApplyLabels';
import { useElementsCache } from '../../hooks/useElementsCache';

const { TRASH, SPAM, DRAFTS, ARCHIVE, SENT, INBOX, ALL_DRAFTS, ALL_SENT } = MAILBOX_LABEL_IDS;

interface Props {
    labelID: string;
    labels?: Label[];
    folders?: Folder[];
    breakpoints: Breakpoints;
    selectedIDs: string[];
    onBack: () => void;
}

const MoveButtons = ({ labelID = '', labels = [], folders = [], breakpoints, selectedIDs = [], onBack }: Props) => {
    const [loading, withLoading] = useLoading();
    const moveToFolder = useMoveToFolder();
    const labelIDs = labels.map(({ ID }) => ID);
    const [elementsCache] = useElementsCache();

    const handleMove = async (LabelID: string) => {
        const folderName = getFolderName(LabelID, folders);
        const fromLabelID = labelIDs.includes(labelID) ? INBOX : labelID;
        const elements = selectedIDs.map((elementID) => elementsCache.elements[elementID]);
        await moveToFolder(elements, LabelID, folderName, fromLabelID);
        onBack();
    };

    const displayInbox = !breakpoints.isNarrow && !labelIncludes(labelID, INBOX, SENT, ALL_SENT, DRAFTS, ALL_DRAFTS);

    const displayTrash = !labelIncludes(labelID, TRASH) && (!breakpoints.isNarrow || !labelIncludes(labelID, SPAM));

    const displayArchive =
        !breakpoints.isNarrow && !labelIncludes(labelID, DRAFTS, ALL_DRAFTS, SENT, ALL_SENT, ARCHIVE);

    const displaySpam = !breakpoints.isNarrow && !labelIncludes(labelID, DRAFTS, ALL_DRAFTS, SENT, ALL_SENT, SPAM);

    return (
        <>
            {displayInbox ? (
                <ToolbarButton
                    loading={loading}
                    title={c('Action').t`Move to inbox`}
                    onClick={() => withLoading(handleMove(INBOX))}
                    disabled={!selectedIDs.length}
                    data-cy="movetoinbox"
                >
                    <Icon className="toolbar-icon mauto" name="inbox" />
                    <span className="sr-only">{c('Action').t`Move to inbox`}</span>
                </ToolbarButton>
            ) : null}
            {displayArchive ? (
                <ToolbarButton
                    loading={loading}
                    title={c('Action').t`Move to archive`}
                    onClick={() => withLoading(handleMove(ARCHIVE))}
                    disabled={!selectedIDs.length}
                    data-cy="movetoarchive"
                >
                    <Icon className="toolbar-icon mauto" name="archive" />
                    <span className="sr-only">{c('Action').t`Move to archive`}</span>
                </ToolbarButton>
            ) : null}
            {displaySpam ? (
                <ToolbarButton
                    loading={loading}
                    title={c('Action').t`Move to spam`}
                    onClick={() => withLoading(handleMove(SPAM))}
                    disabled={!selectedIDs.length}
                    data-cy="movetospam"
                >
                    <Icon className="toolbar-icon mauto" name="spam" />
                    <span className="sr-only">{c('Action').t`Move to spam`}</span>
                </ToolbarButton>
            ) : null}
            {displayTrash ? (
                <ToolbarButton
                    loading={loading}
                    title={c('Action').t`Move to trash`}
                    onClick={() => withLoading(handleMove(TRASH))}
                    disabled={!selectedIDs.length}
                    data-cy="movetotrash"
                >
                    <Icon className="toolbar-icon mauto" name="trash" />
                    <span className="sr-only">{c('Action').t`Move to trash`}</span>
                </ToolbarButton>
            ) : null}
        </>
    );
};

export default MoveButtons;
