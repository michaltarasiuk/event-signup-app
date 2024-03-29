import 'react-day-picker/lib/style.css';

import Typography from 'components/Typography';
import { Variant } from 'components/Typography/types';
import { useEventsContext } from 'contexts/EventsContext';
import { useCallback, useMemo, useState } from 'react';
import DayPicker, { DateUtils, DayPickerProps } from 'react-day-picker';
import { useController } from 'react-hook-form';
import tailwindConfig from 'tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { CustomTailwindConfig } from 'types/tailwindConfig';

import { FormEventDatePickerProps } from './types';

const resolvedTailwindConfig = resolveConfig(
  tailwindConfig
) as unknown as CustomTailwindConfig;

const modifiersStyles = {
  selected: {
    backgroundColor: resolvedTailwindConfig.theme.colors.purple,
  },
  highlighted: {
    backgroundColor: resolvedTailwindConfig.theme.colors.lightGray,
  },
  disabled: {
    pointerEvents: 'none',
  },
  customDayCell: {
    minWidth: 40,
  },
};

const customDayCellMatcher = () => true;

function FormEventDatePicker({
  dayPickerOptions,
  ...controllerOptions
}: FormEventDatePickerProps): JSX.Element {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController(controllerOptions);
  const { events } = useEventsContext();

  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const errorMessage = error?.message;

  const eventDates = useMemo(
    () => events.map(({ date }) => new Date(date)),
    [events]
  );

  const disabledDays: DayPickerProps['disabledDays'] = useCallback(
    (date) =>
      !eventDates.some((eventDate) => DateUtils.isSameDay(date, eventDate)),
    [eventDates]
  );

  const onDayMouseEnter: DayPickerProps['onDayMouseEnter'] = useCallback(
    (date) => {
      setHoveredDate(date);
    },
    []
  );

  const onDayMouseLeave = useCallback(() => {
    setHoveredDate(undefined);
  }, []);

  const onDayClick: DayPickerProps['onDayClick'] = useCallback((date) => {
    const matchedEventId = events.find(({ date: eventDate }) =>
      DateUtils.isSameDay(date, new Date(eventDate))
    )?.id;

    if (matchedEventId) {
      setSelectedDate(date);
      onChange(matchedEventId);
    }
  }, []);

  return (
    <div>
      <DayPicker
        {...dayPickerOptions}
        selectedDays={selectedDate}
        disabledDays={disabledDays}
        modifiers={{
          highlighted: hoveredDate,
          customDayCell: customDayCellMatcher,
        }}
        modifiersStyles={modifiersStyles}
        onDayClick={onDayClick}
        onDayMouseEnter={onDayMouseEnter}
        onDayMouseLeave={onDayMouseLeave}
      />
      {errorMessage && (
        <div className="text-red text-left sm:text-center">
          <Typography component="span" variant={Variant.Body2}>
            {errorMessage}
          </Typography>
        </div>
      )}
    </div>
  );
}

export default FormEventDatePicker;
