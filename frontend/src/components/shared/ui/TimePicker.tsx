// SPDX-License-Identifier: GPL-3.0-or-later

import type React from "react";
import { fieldControlClass } from "./fieldClasses";

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  /** Defaults to the shared criteria control styling; every caller wants that. */
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  min,
  max,
  required = false,
  disabled = false,
  name,
  id,
  className = fieldControlClass,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type="time"
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      required={required}
      disabled={disabled}
      className={className}
    />
  );
};

export default TimePicker;
