import { useState, useEffect } from 'react';
import TimeSlotInput from '../components/Schedule/TimeSlotInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toggle from '../components/Toggle';
import { useGetScheduleQuery } from '../redux/services/auth/authService';
type Props = {};

type days = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type TimeSlot = {
  _id: string;
  days: days;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
  professor: string | null;
  color: string;
};

type Schedule = {
  _id: string;
  user_id: string;
  visibility: string;
  timeSlot: TimeSlot[];
  
};

function Schedule({}: Props) {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  const [schedule, setSchedule] = useState<Schedule>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  useEffect(() => {
    if (!isFetching && data) {
      setSchedule(data[0]);
      setTimeSlots((prevTimeSlots) => [
        ...prevTimeSlots,
        ...(schedule?.timeSlot || []),
      ]);
    }
  }, [data, isFetching, schedule]);

  return (
    <div className="flex h-[1110px] min-h-full flex-col gap-10 bg-slate-400 px-12 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex gap-10">
        <ScheduleBox timeSlots={timeSlots} />
        <TimeSlotInput setTimeSlots={setTimeSlots} />
      </div>
    </div>
  );
}

export default Schedule;
