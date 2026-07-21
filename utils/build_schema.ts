import { z, ZodTypeAny } from "zod";
import { FormFieldConfig } from "@/types/form";

export function buildSchema(fields: FormFieldConfig[]) {
  const shape: Record<string, ZodTypeAny> = {};

  fields.forEach((field) => {
    if (field.type === "group" && field.group) {
      field.group.forEach((subField) => {
        const resolvedRequired = subField.required ?? field.required;
        shape[subField.name] = buildFieldSchema({
          ...subField,
          required: resolvedRequired,
        });
      });
      return;
    }

    shape[field.name] = buildFieldSchema(field);
  });

  return z.object(shape);
}

function buildFieldSchema(field: FormFieldConfig): ZodTypeAny {
  switch (field.type) {
    case "email": {
      let schema = z.string();
      if (field.required) {
        schema = schema.min(1, `${field.label}은 필수 입력입니다`);
      }
      schema = schema.email(`${field.label} 형식이 올바르지 않습니다`);
      return field.required ? schema : schema.optional().or(z.literal(""));
    }

    case "number": {
      const base = z.preprocess(
        (val) => {
          if (val === "" || val === undefined || val === null) return undefined;
          const num = Number(val);
          return Number.isNaN(num) ? val : num;
        },
        z.union([z.number(), z.undefined(), z.string()]),
      );

      return base.superRefine((val, ctx) => {
        if (val === undefined) {
          if (field.required) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label}을 입력해주세요`,
            });
          }
          return;
        }
        if (typeof val !== "number") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field.label}은 숫자여야 합니다`,
          });
        }
      });
    }

    case "checkbox": {
      const schema = z.boolean();
      if (field.required) {
        return schema.refine((val) => val === true, {
          message: `${field.label}에 동의해주세요`,
        });
      }
      return schema.optional();
    }

    case "checkboxGroup": {
      const schema = z.array(z.string());
      if (field.required) {
        return schema.min(1, `${field.label}을 최소 1개 이상 선택해주세요`);
      }
      return schema.optional();
    }

    case "radio":
    case "select": {
      let schema = z.string();
      if (field.required) {
        schema = schema.min(1, `${field.label}을 선택해주세요`);
        return schema;
      }
      return schema.optional();
    }

    // 파일 검증 (신규)
    case "file": {
      if (field.multiple) {
        // 다중 파일 — 배열 형태
        return z.array(z.instanceof(File)).superRefine((files, ctx) => {
          if (field.required && (!files || files.length === 0)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label}을 첨부해주세요`,
            });
            return;
          }
          if (field.maxFileSizeMb) {
            files?.forEach((file) => {
              if (file.size > field.maxFileSizeMb! * 1024 * 1024) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `${field.label}은 파일당 최대 ${field.maxFileSizeMb}MB까지 첨부 가능합니다`,
                });
              }
            });
          }
        });
      }

      // 단일 파일
      return z
        .instanceof(File)
        .optional()
        .superRefine((file, ctx) => {
          if (field.required && !file) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label}을 첨부해주세요`,
            });
            return;
          }
          if (
            file &&
            field.maxFileSizeMb &&
            file.size > field.maxFileSizeMb * 1024 * 1024
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label}은 최대 ${field.maxFileSizeMb}MB까지 첨부 가능합니다`,
            });
          }
        });
    }

    case "date": {
      let schema = z.string();
      if (field.required) {
        schema = schema.min(1, `${field.label}을 선택해주세요`);
        return schema;
      }
      return schema.optional();
    }

    case "text":
    case "password":
    case "textarea": {
      let schema = z.string();
      if (field.required) {
        schema = schema.min(1, `${field.label}은 필수 입력입니다`);
      }
      if (field.minLength) {
        schema = schema.min(
          field.minLength,
          `${field.label}은 최소 ${field.minLength}자 이상이어야 합니다`,
        );
      }
      if (field.maxLength) {
        schema = schema.max(
          field.maxLength,
          `${field.label}은 최대 ${field.maxLength}자까지 가능합니다`,
        );
      }
      return field.required ? schema : schema.optional().or(z.literal(""));
    }

    default:
      return z.string().optional();
  }
}
