import { useState, useRef } from 'react';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';
import { useCreateTimeSlotMutation } from '../../redux/services/schedule/scheduleService';
import { DaysChecked, TimeSlot as TimeSlotType } from '../../types';
import { convertTo24Hour, validTimeSlot } from '../../utils/scheduleUtils';
import { ToastEnum } from '../../enums';
import { Select } from 'flowbite-react';
import ClearScheduleButton from '../Schedule/ClearScheduleButton';
import DayPicker from '../Calendar/DayPicker';
import { TypesOfInput } from '../../enums';
import { useToast } from '../../utils/functions';
import ExistingTimeSlotModal from '../Modals/ExisitingTImeSlotModal';
export const colors: string[] = [
  'slate',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'blue',
  'violet',
  'purple',
  'fuchsia',
  'rose',
];

const TimeSlotInput = () => {
  // || Refs ||
  const formRef = useRef(document.createElement('form'));
  const titleRef = useRef(document.createElement('input'));
  const startTimeHourRef = useRef(document.createElement('input'));
  const startTimeMinutesRef = useRef(document.createElement('input'));
  const endTimeHourRef = useRef(document.createElement('input'));
  const endTimeMinutesRef = useRef(document.createElement('input'));
  const locationRef = useRef(document.createElement('input'));
  const professorRef = useRef(document.createElement('input'));

  // || Local State ||
  const [timeSlotColor, setTimeSlotColor] = useState<string>('border-none');
  const [isMeridiemFailed, setIsMeridiemFailed] = useState<boolean>(false);
  const [daysError, setDaysError] = useState<boolean>(false);
  const [timeError, setTimeError] = useState<boolean>(false);
  const [colorError, setColorError] = useState<boolean>(false);
  const [timeSlotError, setTimeSlotError] = useState<boolean>(false);
  const [startTimeMeridiem, setStartTimeMeridiem] = useState<string>('AM');
  const [endTimeMeridiem, setEndTimeMeridiem] = useState<string>('AM');

  const [createTimeSlotMutation] = useCreateTimeSlotMutation();

  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
  });

  const { showToast } = useToast();

  let scheduleID = '';
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  if (!isFetching && data) {
    scheduleID = data._id;
  }

  const validateMinutes = (minutes: string | null) => {
    if (!minutes || minutes.length === 1) {
      return `0${minutes}`;
    }
    return minutes;
  };

  const addTimeSlot = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const { monday, tuesday, wednesday, thursday, friday } = selectedDays;

    if (isMeridiemFailed) return;

    // If no checkboxes have been selected, the form shouldn't be submitted.
    if (!(monday || tuesday || wednesday || thursday || friday)) {
      setDaysError(true);
      return;
    }

    const daySelection: DaysChecked = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };

    if (monday) {
      daySelection.monday = true;
      setDaysError(false);
    }
    if (tuesday) {
      daySelection.tuesday = true;
      setDaysError(false);
    }
    if (wednesday) {
      daySelection.wednesday = true;
      setDaysError(false);
    }
    if (thursday) {
      daySelection.thursday = true;
      setDaysError(false);
    }
    if (friday) {
      daySelection.friday = true;
      setDaysError(false);
    }

    const startTime = `${startTimeHourRef.current.value}:${validateMinutes(
      startTimeMinutesRef.current.value
    )} ${startTimeMeridiem}`;
    const endTime = `${endTimeHourRef.current.value}:${validateMinutes(
      endTimeMinutesRef.current.value
    )} ${endTimeMeridiem}`;

    if (convertTo24Hour(startTime) > convertTo24Hour(endTime)) {
      setTimeError(true);
      return;
    }
    if (timeSlotColor === 'border-none') {
      setColorError(true);
      return;
    }

    if (!validTimeSlot(startTime, endTime, data.timeSlots, daySelection)) {
      setTimeSlotError(true);
      return;
    }

    const currentTimeSlot: TimeSlotType = {
      days: daySelection,
      title: titleRef.current.value,
      startTime: startTime,
      endTime: endTime,
      location: locationRef.current.value || null,
      professor: professorRef.current.value || null,
      color: timeSlotColor,
    };

    try {
      await createTimeSlotMutation({
        scheduleId: scheduleID,
        timeSlot: currentTimeSlot,
      });
      showToast(ToastEnum.CREATED_TIMESLOT);

      const resetDays: DaysChecked = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };
      setTimeSlotColor('border-none');
      setColorError(false);
      setTimeSlotError(false);
      setDaysError(false);
      setSelectedDays(resetDays);
      setStartTimeMeridiem('AM');
      setEndTimeMeridiem('AM');
    } catch (error) {
      console.error(error);
    }
    formRef.current.reset();
  };

  const validateMeridiem = (
    inputRef: React.RefObject<HTMLInputElement>,
    inputType: TypesOfInput
  ) => {
    // @ts-ignore: Object is possibly 'null'.
    const inputValue: number = parseFloat(inputRef.current.value);
    if (inputType === TypesOfInput.HourInput) {
      if (inputValue < 1 || inputValue > 12) {
        inputRef.current?.classList.add(
          'border-red-500',
          'focus:border-rose-500',
          'focus:ring-rose-500',
          'dark:border-red-500',
          'dark:focus:border-rose-500',
          'dark:focus:ring-rose-500'
        );
        setIsMeridiemFailed(true);
      } else {
        inputRef.current?.classList.remove(
          'border-red-500',
          'focus:border-rose-500',
          'focus:ring-rose-500',
          'dark:border-red-500',
          'dark:focus:border-rose-500',
          'dark:focus:ring-rose-500'
        );
        setIsMeridiemFailed(false);
      }
    }

    if (inputType === TypesOfInput.MinutesInput) {
      if (inputValue < 0 || inputValue > 59) {
        inputRef.current?.classList.add(
          'border-red-500',
          'focus:border-rose-500',
          'focus:ring-rose-500',
          'dark:border-red-500',
          'dark:focus:border-rose-500',
          'dark:focus:ring-rose-500'
        );
        setIsMeridiemFailed(true);
      } else {
        inputRef.current?.classList.remove(
          'border-red-500',
          'focus:border-rose-500',
          'focus:ring-rose-500',
          'dark:border-red-500',
          'dark:focus:border-rose-500',
          'dark:focus:ring-rose-500'
        );
        setIsMeridiemFailed(false);
      }
    }
  };

  const handleStartTimeMeridiemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeMeridiem(e.target.value);

    if (e.target.value === 'PM') {
      setEndTimeMeridiem('PM');
    }
  };

  const handleEndTimeMeridiemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTimeMeridiem(e.target.value);
  };

  const handleColorPickerKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, color: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTimeSlotColor(color);
    }
  };

  return (
    <>
      {!isFetching && data && (
        <div className="flex flex-col">
          <ClearScheduleButton scheduleId={scheduleID} currentSchedule={data} />
          <div className="mt-6 flex flex-col rounded-lg border bg-white p-5 shadow dark:border-none dark:bg-black dark:shadow-none">
            <form ref={formRef} onSubmit={addTimeSlot} className="space-y-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Title
                </label>
                <input
                  ref={titleRef}
                  required
                  type="text"
                  id="title"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="BIO 130"
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="days"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Days
                </label>
                <DayPicker
                  selectedDays={selectedDays}
                  setSelectedDays={setSelectedDays}
                  daysError={daysError}
                />
                <div className="flex w-full justify-center">
                  {daysError && <p className="text-rose-500">Please pick a day!</p>}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-2">
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Start Time
                  </label>
                  <div className="flex items-center">
                    <div className="space-x-2">
                      <input
                        ref={startTimeHourRef}
                        type="number"
                        id="title"
                        className={`inline-block w-2/5 rounded-lg border bg-gray-50 p-2.5 text-center text-sm text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                          !timeError &&
                          'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                        }`}
                        onChange={() => validateMeridiem(startTimeHourRef, TypesOfInput.HourInput)}
                        placeholder="12"
                        maxLength={2}
                        required
                      />
                      <span className="text-black dark:text-white">:</span>
                      <input
                        ref={startTimeMinutesRef}
                        type="number"
                        id="title"
                        className={`inline-block w-2/5 rounded-lg border bg-gray-50 p-2.5 text-center text-sm text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                          !timeError &&
                          'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                        }`}
                        onChange={() =>
                          validateMeridiem(startTimeMinutesRef, TypesOfInput.MinutesInput)
                        }
                        placeholder="00"
                        maxLength={2}
                        required
                      />
                    </div>
                    <Select
                      value={startTimeMeridiem}
                      onChange={(e) => handleStartTimeMeridiemChange(e)}
                      id="startMeridiemTime"
                      className="w-3/5"
                      required
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    End Time
                  </label>
                  <div className="flex items-center">
                    <div className="space-x-2">
                      <input
                        ref={endTimeHourRef}
                        type="number"
                        id="title"
                        className={`inline-block w-2/5 rounded-lg border bg-gray-50 p-2.5 text-center text-sm text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                          !timeError &&
                          'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                        }`}
                        onChange={() => validateMeridiem(endTimeHourRef, TypesOfInput.HourInput)}
                        placeholder="12"
                        maxLength={2}
                        required
                      />
                      <span className="text-black dark:text-white">:</span>
                      <input
                        ref={endTimeMinutesRef}
                        type="number"
                        id="title"
                        className={`inline-block w-2/5 rounded-lg border bg-gray-50 p-2.5 text-center text-sm text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                          !timeError &&
                          'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500'
                        }`}
                        onChange={() =>
                          validateMeridiem(endTimeMinutesRef, TypesOfInput.MinutesInput)
                        }
                        placeholder="00"
                        maxLength={2}
                        required
                      />
                    </div>
                    <Select
                      value={endTimeMeridiem}
                      onChange={(e) => handleEndTimeMeridiemChange(e)}
                      id="endTimeMeridiem"
                      className="w-3/5"
                      required
                    >
                      <option value="AM" disabled={startTimeMeridiem === 'PM'}>
                        AM
                      </option>
                      <option value="PM">PM</option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-full">
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Location
                  </label>
                  <input
                    ref={locationRef}
                    type="text"
                    id="location"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Whitman Hall"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="professor"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Professor
                  </label>
                  <input
                    ref={professorRef}
                    type="text"
                    id="professor"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Dr. Gerstl"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorPicker" className="font-medium dark:text-white">
                  Select a color
                </label>
                <div className="flex justify-center">
                  <div className="my-2 grid grid-cols-7 gap-2">
                    {colors.map((color) => (
                      <div
                        onClick={() => setTimeSlotColor(color)}
                        key={color}
                        id="colorPicker"
                        tabIndex={0}
                        onKeyDown={(e) => handleColorPickerKeyPress(e, color)}
                        className={`bg-${color}-400 h-8 w-8 cursor-pointer rounded-full border-4 lg:h-10 lg:w-10 ${
                          timeSlotColor === color ? 'border-blue-700' : 'border-none'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {colorError && (
                  <p className="text-center font-bold text-rose-500">Please pick a color!</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-blue-400 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-600 dark:bg-slate-300 dark:text-black hover:dark:bg-slate-400"
              >
                Submit
              </button>
            </form>
            {timeSlotError && (
              <ExistingTimeSlotModal
                timeSlotError={timeSlotError}
                setTimeSlotError={setTimeSlotError}
                setTimeSlotColor={setTimeSlotColor}
                setColorError={setColorError}
                formRef={formRef}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TimeSlotInput;
