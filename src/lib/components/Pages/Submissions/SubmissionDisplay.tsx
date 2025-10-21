"use client";

import { Field, FieldsType } from "@/lib/types/form/fields";
import { Badge } from "@/lib/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

type SubmissionData = {
  [key: string]: any;
};

type SubmissionDisplayProps = {
  fields: Field[];
  submissionData: SubmissionData;
  formName?: string;
  formDescription?: string;
  submittedBy?: {
    _id: string;
    name?: string;
    email: string;
  };
  createdAt?: string;
};

const SubmissionDisplay = ({
  fields,
  submissionData,
  formName,
  formDescription,
  submittedBy,
  createdAt,
}: SubmissionDisplayProps) => {
  const sortedFields = [...fields].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const renderFieldValue = (field: Field, value: any) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-gray-400 italic">Not provided</span>;
    }

    switch (field.type) {
      case FieldsType.CHECKBOX:
        return value ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Yes</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <XCircle className="w-4 h-4" />
            <span>No</span>
          </div>
        );

      case FieldsType.DATE:
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{format(new Date(value), "PPP")}</span>
          </div>
        );

      case FieldsType.SELECT:
      case FieldsType.RADIO:
        const selectedOption = field.options?.find(
          (opt) => opt.value === value
        );
        return (
          <Badge variant="secondary" className="text-sm">
            {selectedOption?.label || value}
          </Badge>
        );

      case FieldsType.TEXT_AREA:
        return (
          <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
            {value}
          </div>
        );

      case FieldsType.EMAIL:
        return (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
            {value}
          </a>
        );

      case FieldsType.NUMBER:
        return <span className="font-mono">{value}</span>;

      default:
        return <span>{value}</span>;
    }
  };

  const getFieldWidth = (width?: number) => {
    if (!width || width === 100) return "col-span-12";
    if (width === 75) return "col-span-12 lg:col-span-9";
    if (width === 66) return "col-span-12 lg:col-span-8";
    if (width === 50) return "col-span-12 lg:col-span-6";
    if (width === 33) return "col-span-12 lg:col-span-4";
    if (width === 25) return "col-span-12 lg:col-span-3";
    return "col-span-12";
  };

  return (
    <div className="">
      {/* Header Section */}
      {(formName || submittedBy || createdAt) && (
        <Card className="mb-6">
          <CardHeader>
            {formName && <CardTitle className="text-2xl">{formName}</CardTitle>}
            {formDescription && (
              <p className="text-gray-600 mt-2">{formDescription}</p>
            )}
          </CardHeader>
          {(submittedBy || createdAt) && (
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {submittedBy && (
                  <div>
                    <span className="font-medium">Submitted by:</span>{" "}
                    {submittedBy.name || submittedBy.email}
                  </div>
                )}
                {createdAt && (
                  <div>
                    <span className="font-medium">Submitted on:</span>{" "}
                    {format(new Date(createdAt), "PPP 'at' p")}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Submission Data */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-6">
            {sortedFields.map((field) => {
              const value = submissionData[field.name];
              const width = field.style?.width;

              return (
                <div key={field.name} className={getFieldWidth(width)}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="text-gray-900">
                      {renderFieldValue(field, value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionDisplay;
