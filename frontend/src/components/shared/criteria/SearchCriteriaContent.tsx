// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { fieldControlClass, fieldGroupClass } from "../ui/fieldClasses";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaContent({ register }: Props) {
  return (
    <div className={fieldGroupClass}>
      <span className="block">Content</span>
      <label htmlFor="title">Title</label>
      <input type="text" className={fieldControlClass} id="title" {...register("title")} />
      <label htmlFor="detail">Detail</label>
      <input type="text" className={fieldControlClass} id="detail" {...register("detail")} />
    </div>
  );
}
