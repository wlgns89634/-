"use client";

import * as Dialog from "@radix-ui/react-dialog";
import AnimatedDialog from "./ModalsDialog";
import { useModalStore } from "@/store/Modal";
import { ModalState } from "@/types/modalType";

export default function ModalRenderer() {
  const modal = useModalStore((state) => state.modal);
  const close = useModalStore((state) => state.close);

  return (
    <AnimatedDialog open={!!modal} onOpenChange={(open) => !open && close()}>
      {modal && renderModalContent(modal, close)}
    </AnimatedDialog>
  );
}

function renderModalContent(modal: ModalState, close: () => void) {
  switch (modal.type) {
    case "alert":
      return <AlertModalContent modal={modal} close={close} />;
    case "confirm":
      return <ConfirmModalContent modal={modal} close={close} />;
    case "content":
      return <ContentModalContent modal={modal} close={close} />;
    default:
      return null;
  }
}

// ── 1. 메세지 모달(예:alert, confirm 용도) ──
function AlertModalContent({
  modal,
  close,
}: {
  modal: Extract<ModalState, { type: "alert" }>;
  close: () => void;
}) {
  const handleConfirm = () => {
    modal.onConfirm?.();
    close();
  };

  return (
    <>
      <img src={modal.imgUrl} alt="" className="w-16 h-16 object-contain" />
      {modal.title && (
        <Dialog.Title className="text-base font-semibold mb-2">
          {modal.title}
        </Dialog.Title>
      )}
      {modal.description && (
        <Dialog.Description className="text-sm text-gray-600 mb-4">
          {modal.description}
        </Dialog.Description>
      )}
      <button
        className="w-full border border-gray-300 rounded-md py-2 text-sm"
        onClick={handleConfirm}
      >
        {modal.confirmLabel ?? "확인"}
      </button>
    </>
  );
}

// ── confirm: 버튼 2개 ──
function ConfirmModalContent({
  modal,
  close,
}: {
  modal: Extract<ModalState, { type: "confirm" }>;
  close: () => void;
}) {
  const isConfirmLoading = useModalStore((state) => state.isConfirmLoading);
  const setConfirmLoading = useModalStore((state) => state.setConfirmLoading);

  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);
      await modal.onConfirm();
      close();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    modal.onCancel?.();
    close();
  };

  return (
    <>
      <img src={modal.imgUrl} alt="" className="w-16 h-16 object-contain" />

      {modal.title && (
        <Dialog.Title className="text-base font-semibold mb-2">
          {modal.title}
        </Dialog.Title>
      )}
      {modal.description && (
        <Dialog.Description className="text-sm text-gray-600 mb-4">
          {modal.description}
        </Dialog.Description>
      )}
      <div className="flex gap-2">
        <button
          className="flex-1 border border-gray-300 rounded-md py-2 text-sm"
          onClick={handleCancel}
          disabled={isConfirmLoading}
        >
          {modal.cancelLabel ?? "취소"}
        </button>
        <button
          className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700"
          onClick={handleConfirm}
          disabled={isConfirmLoading}
        >
          {isConfirmLoading ? "처리 중..." : (modal.confirmLabel ?? "확인")}
        </button>
      </div>
    </>
  );
}

// ── 3. 콘텐츠 모달(예:모달안에 비디오,이미지 등 api 내용 들어가는데 사용) ──
function ContentModalContent({
  modal,
  close,
}: {
  modal: Extract<ModalState, { type: "content" }>;
  close: () => void;
}) {
  return (
    <>
      {modal.title && (
        <Dialog.Title className="text-base font-semibold mb-3">
          {modal.title}
        </Dialog.Title>
      )}

      <div className="modal-body mb-4">{modal.content}</div>

      {/* <button
        className="w-full border border-gray-300 rounded-md py-2 text-sm font-medium hover:bg-gray-50"
        onClick={() => {
          if (modal.onCloseClick) modal.onCloseClick();
          close();
        }}
      >
        {modal.closeLabel ?? "확인"}
      </button> */}
    </>
  );
}
