"use client";

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

interface StartTimeInput {
  value: string;
  onChange: (value: string) => void;
}

interface ParticipantsProps {
    value: string;
    onChange: (value: string) => void;
  }

export default function CreateMeetingPage() {
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [participants, setParticipants] = useState<string>("");
  const [call, setCall] = useState<Call>()
  const client = useStreamVideoClient();
  const { user } = useUser();
  if (!user || !client) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  async function createMeeting(){
    if (!user || !client) {
        return 
    }

    try {
        const id = crypto.randomUUID()
        const call = client.call("default", id)
        await call.getOrCreate({
            data: {
                custom: {
                    description
                }
            }
        })
        setCall(call)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1>Welcome {user?.username}</h1>
      <div className="w-80 mx-auto space-y-6 rounded-md bg-slate-100 p-5">
        <h2>Create new meeting</h2>
        <Description value={description} onChange={setDescription} />
        <StartTime value={startTime} onChange={setStartTime} />
        <Participants value={participants} onChange={setParticipants}/>
        <button onClick={createMeeting}>Create meeting</button>
      </div>
      { call && <MeetingLink call={call}/>}
    </div>
  );
}

function Description({ value, onChange }: DescriptionProps) {
  const [active, setActive] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting info:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            setActive(e.target.checked);
            onChange("");
          }}
        />
        Add description
      </label>
      {active && (
        <label className="block space-y-1">
          <span>Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}

function StartTime({ value, onChange }: StartTimeInput) {
  const [active, setActive] = useState<boolean>(false);
  const dateTimeNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="space-y-2">
      <div>Meeting start:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting now
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(dateTimeNow);
          }}
        />
        Start meeting date
      </label>
      {active && (
        <label className="block space-y-1">
          <span>Start time: </span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={dateTimeNow}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}

function Participants({value, onChange}: ParticipantsProps) {    
  const [active, setActive] = useState<boolean>(false);


  return (
    <div className="space-y-2">
      <div>Participants: </div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Everyone with link
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
          }}
        />
        Private
      </label>
      {active && (
        <label className="block space-y-1">
          <span>Participants: </span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Enter participant separated by comas"
          />
        </label>
      )}
    </div>
  );
}

interface MeetingProps {
    call: Call
}

function MeetingLink({call}: MeetingProps) {
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`
    return <div className="text-center">
        {meetingLink}
    </div>
}