// components/dynamic-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldConfig } from "@/types/form";
import { buildSchema } from "@/utils/build_schema";
import { useFormValidationAlert } from "@/hooks/validation";
import { X, Paperclip, FileText } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FieldFormProps {
  type?: "modal" | "page";
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
  className?: string;
  onChange?: (data: Record<string, unknown>) => void; // ✅ 함수 타입으로 수정
  defaultValues?: Record<string, unknown>;
  validType?: "inline" | "modal";
}

export default function Form({
  type = "page",
  fields,
  onSubmit,
  submitLabel = "제출",
  onChange, // ✅ destructuring에 추가
  defaultValues,
  validType = "inline",
}: FieldFormProps) {
  const schema = buildSchema(fields);

  const generateDefaultValues = (fieldConfigs: FormFieldConfig[]) => {
    const defaults: Record<string, unknown> = {};

    fieldConfigs.forEach((field) => {
      if (field.type === "group" && field.group) {
        field.group.forEach((subField) => {
          defaults[subField.name] = subField.type === "checkbox" ? false : "";
        });
      } else if (field.type === "checkbox") {
        defaults[field.name] = false;
      } else if (field.type === "checkboxGroup") {
        defaults[field.name] = [];
      } else if (field.type === "file") {
        defaults[field.name] = field.multiple ? [] : undefined;
      } else {
        defaults[field.name] = "";
      }
    });

    return { ...defaults, ...defaultValues };
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: generateDefaultValues(fields),
  });

  useEffect(() => {
    if (!onChange) return;

    const subscription = watch((values) => {
      onChange(values as Record<string, unknown>);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const { handleInvalid, handleSubmitError } = useFormValidationAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFieldError = (field: FormFieldConfig) => {
    if (field.type === "group" && field.group) {
      for (const subField of field.group) {
        if (errors[subField.name]) return errors[subField.name];
      }
    }
    return errors[field.name];
  };

  const handleErrors = (formErrors: any) => {
    if (validType === "modal") {
      handleInvalid(fields, formErrors);
    }
  };

  const handleValid = async (data: Record<string, unknown>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleValid, handleErrors)}
      className="flex flex-col gap-4 w-full max-w-md pr-1 max-h-[60vh] scrollbar-thin overflow-y-auto"
    >
      {fields.map((field) => {
        const error = getFieldError(field);
        const inlineError = validType === "inline" && !!error;

        return (
          <div
            key={field.name}
            className={`${type === "page" ? "page_form" : "modal_form"} flex-1 flex flex-col gap-4`}
          >
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </Label>

            {renderField(field, register, control, validType, errors)}

            {inlineError && error?.message && (
              <p className="text-xs font-medium text-destructive dark:text-red-400 mt-0.5 animate-in fade-in duration-200">
                {String(error.message)}
              </p>
            )}
          </div>
        );
      })}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? "처리 중..." : submitLabel}
      </Button>
    </form>
  );
}

const renderField = (
  field: FormFieldConfig,
  register: ReturnType<typeof useForm>["register"],
  control: Control,
  validType: "inline" | "modal",
  errors: any,
) => {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          {...register(field.name)}
        />
      );

    case "select":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <Select
              onValueChange={controllerField.onChange}
              value={(controllerField.value as string) ?? ""}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={field.placeholder ?? "선택하세요"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      );

    case "radio":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <RadioGroup
              className="flex gap-4"
              onValueChange={controllerField.onChange}
              value={(controllerField.value as string) ?? ""}
            >
              {field.options?.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`${field.name}-${opt.value}`}
                  />
                  <Label
                    htmlFor={`${field.name}-${opt.value}`}
                    className="font-normal"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      );

    case "checkbox":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                checked={!!controllerField.value}
                onCheckedChange={controllerField.onChange}
              />
              {field.placeholder && (
                <Label htmlFor={field.name} className="font-normal">
                  {field.placeholder}
                </Label>
              )}
            </div>
          )}
        />
      );

    case "checkboxGroup":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {
            const selected: string[] =
              (controllerField.value as string[]) ?? [];

            const toggle = (value: string) => {
              if (selected.includes(value)) {
                controllerField.onChange(selected.filter((v) => v !== value));
              } else {
                controllerField.onChange([...selected, value]);
              }
            };

            return (
              <div className="flex gap-4 flex-wrap">
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`${field.name}-${opt.value}`}
                      checked={selected.includes(opt.value)}
                      onCheckedChange={() => toggle(opt.value)}
                    />
                    <Label
                      htmlFor={`${field.name}-${opt.value}`}
                      className="font-normal"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            );
          }}
        />
      );

    case "group":
      return (
        <div className="flex gap-2">
          {field.group?.map((subField) => (
            <div key={subField.name} className="flex-1 flex flex-col gap-1">
              {subField.label && (
                <Label
                  htmlFor={subField.name}
                  className="text-xs text-muted-foreground"
                >
                  {subField.label}
                </Label>
              )}
              {renderField(subField, register, control, validType, errors)}
            </div>
          ))}
        </div>
      );

    case "file":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {
            const files: File[] = field.multiple
              ? ((controllerField.value as File[]) ?? [])
              : controllerField.value
                ? [controllerField.value as File]
                : [];

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const selected = e.target.files;
              if (!selected) return;

              if (field.multiple) {
                controllerField.onChange([...files, ...Array.from(selected)]);
              } else {
                controllerField.onChange(selected[0]);
              }
              e.target.value = "";
            };

            const removeFile = (index: number) => {
              if (field.multiple) {
                controllerField.onChange(files.filter((_, i) => i !== index));
              } else {
                controllerField.onChange(undefined);
              }
            };

            return (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={field.name}
                  className="flex items-center gap-2 border border-dashed rounded-md px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-muted/50"
                >
                  <Paperclip className="w-4 h-4" />
                  {field.placeholder ?? "파일 선택"}
                  <input
                    id={field.name}
                    type="file"
                    accept={field.accept}
                    multiple={field.multiple}
                    className="hidden"
                    onChange={handleChange}
                  />
                </label>

                {files.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {files.map((file, idx) => (
                      <FilePreviewItem
                        key={idx}
                        file={file}
                        onRemove={() => removeFile(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        />
      );

    default:
      return (
        <Input
          id={field.name}
          type={field.type}
          placeholder={field.placeholder}
          {...register(field.name)}
        />
      );
  }
};

const FilePreviewItem = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <div className="relative flex items-center gap-2 border rounded-md p-2 bg-muted/30 max-w-[160px]">
      {isImage && previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-10 h-10 object-cover rounded"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col overflow-hidden">
        <span className="text-xs truncate">{file.name}</span>
        <span className="text-[10px] text-muted-foreground">
          {(file.size / 1024).toFixed(0)}KB
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 bg-background border rounded-full p-0.5 hover:bg-red-50"
      >
        <X className="w-3 h-3 text-muted-foreground hover:text-red-500" />
      </button>
    </div>
  );
};
