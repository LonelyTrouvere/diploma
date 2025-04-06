"use client";

import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { boxStyle } from "./style";
import { Group } from "@/interfaces/group";

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState<string>("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((res) => setGroups(res.data));
  }, [setGroups]);

  function createGroup() {
    fetch("/api/groups", {
      body: JSON.stringify({ name: groupName }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  return (
    <div className="w-full h-screen pt-32 flex flex-col items-center">
      <div className="w-[40%]">
        <button className="relative left-[80%] mb-1.5" onClick={handleOpen}>
          Create group +
        </button>
        <h1 className="text-center mb-6 text-2xl">Select group</h1>
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          {groups.map((group) => (
            <div
              className="bg-gray-200 w-[80%] py-5 pl-3 rounded-md"
              key={group.id}
            >
              {group.name}
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <label htmlFor="group-name">Name: </label>
          <input
            name="group-name"
            className="border rounded-2xl px-2 py-1"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
          <button
            className="relative left-[45%] block mt-4"
            onClick={createGroup}
          >
            Create
          </button>
        </Box>
      </Modal>
    </div>
  );
}
