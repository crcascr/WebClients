import React, { ChangeEvent, useMemo } from 'react';
import { Select } from 'react-components';
import { capitalize } from 'proton-shared/lib/helpers/string';
import { getOnDayString } from '../../../helpers/frequencyString';
import { MONTHLY_TYPE } from '../../../constants';
import { getNegativeSetpos, getPositiveSetpos } from '../eventForm/modelToFrequencyProperties';

// Filter out strings since TS creates an inverse mapping
const MONTHLY_TYPE_VALUES = Object.values(MONTHLY_TYPE).filter((type): type is number => typeof type === 'number');

interface Props {
    id?: string;
    value: MONTHLY_TYPE;
    date: Date;
    onChange: (value: MONTHLY_TYPE) => void;
}

const SelectMonthlyType = ({ id, value, date, onChange }: Props) => {
    const allOptions = useMemo(() => {
        return MONTHLY_TYPE_VALUES.map((type) => {
            const onDayString = getOnDayString(date, type);
            return { text: capitalize(onDayString), value: type };
        });
    }, [date]);

    const isLastDay = getNegativeSetpos(date) === -1;
    const isFifthDay = getPositiveSetpos(date) === 5;
    const options = allOptions.filter(({ value }) => {
        if (value === MONTHLY_TYPE.ON_NTH_DAY && isFifthDay) {
            // we don't offer "on the fifth day" possibility
            return false;
        }
        if (value === MONTHLY_TYPE.ON_MINUS_NTH_DAY && !isLastDay) {
            // only display "last day" option when we are in the last day of the month
            return false;
        }
        return true;
    });

    return (
        <Select
            className="w-unset ml0-5 flex-item-fluid"
            id={id}
            value={value}
            options={options}
            onChange={({ target }: ChangeEvent<HTMLSelectElement>) => {
                const newValue = +target.value as MONTHLY_TYPE;
                onChange?.(newValue);
            }}
        />
    );
};

export default SelectMonthlyType;
