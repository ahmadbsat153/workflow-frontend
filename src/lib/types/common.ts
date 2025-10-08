import { AxiosError } from "axios";

export type Meta = {
  count: number; // total number of items
  page: number; // current page
  limit: number; // items per page
  total_pages: number; // total number of pages displayed
  has_next: boolean;
  has_previous: boolean;
};

export type STATUS = "LOADING" | "ERROR" | "SUCCESS";

export type FilesProps = { files: string[] };

export type SyncProps = {
  is_sync: boolean;
  repeat_type: "hourly" | "daily" | "weekly" | "monthly";
  repeat_time: string;
  repeat_days?: string[];
  timezone?: string;
};

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Array<
    infer ArrayType
  >
    ? ArrayType extends object
      ?
          | `${Key}`
          | `${Key}[${number}]`
          | `${Key}[${number}].${NestedKeyOf<ArrayType>}`
      : `${Key}` | `${Key}[${number}]`
    : ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type CacheResponse = {
  success: boolean;
  message: string;
};

export type ScheduleResponse = {
  status: number;
  message: string;
};

export type BreadcrumbItem = {
  name: string;
  slug: string;
};

export type SuccessResponse = {
  status: number;
  success: boolean;
  message: string;
};

export type ErrorResponse = {
  cause?: AxiosError;
  message?: string;
};

export type DeleteResponse = {
  message: string;
  status: number;
  success: boolean;
};

export type ResendResponse = SuccessResponse;

export type ErrorMessageProps = { [key: string]: string };
