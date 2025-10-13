interface ModalDeleteProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function ModalUpdateStatus({ open, onOk, onCancel }: ModalDeleteProps) {
  if (!open) return null; 

  return (
    <div className="overlay" id="modal-container">
      <div className="delete">
        <div className="confirm-container">
          <div className="header-modal">
            <div><p className="textComfirm">Xác nhận cập nhật</p></div>
            <button className="close-btn" onClick={onCancel}>
            ×
          </button>
          </div>
          <hr />
          <div className="body-modal">
            <p className="text">
              Xác nhận cập nhật trạng thái nhiệm vụ
            </p>
          </div>
          <hr />
          <div className="footerDelete">
            <button className="btn btnCancel" onClick={onCancel}>Huỷ</button>
            <button className="btn btnConfirm" onClick={onOk}>Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  )
}
