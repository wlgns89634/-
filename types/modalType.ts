import { FormFieldConfig } from "@/types/form";
import React from "react";

export type ModalState =
  | {
      type: "alert"; // 버튼 1개 (확인)
      imgUrl?: string;
      title?: string;
      description?: string;
      confirmLabel?: string;
      onConfirm?: () => void | Promise<void>;
    }
  | {
      type: "confirm"; // 버튼 2개 (확인/취소)
      imgUrl?: string;
      title?: string;
      description?: string;
      confirmLabel?: string;
      cancelLabel?: string;
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
    }
  | {
      type: "content";
      title?: string;
      content: React.ReactNode;
    };

// 1. API 전송 데이터 타입 정의
export type ProgressPayload = {
  courseId: number;
  lectureId: number;
  watchedSeconds: number;
  isCompleted: boolean;
};

export type VideoModalProps = {
  url?: string;
  videoId: string;
  courseId: number;
  title: string;
  duration: string;
  lectureId: number;
  close: () => void;
};
