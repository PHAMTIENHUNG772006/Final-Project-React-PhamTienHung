interface ModalDeleteProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  projectName?: string;
}

export default function ModalDelete({ open, onOk, onCancel, projectName }: ModalDeleteProps) {
  if (!open) return null; 

  return (
    <div className="overlay" id="modal-container">
      <div className="modal">
        <div className="confirm-container">
          <div className="header-modal-delete">
            <div><p className="textComfirm">Xác nhận xoá</p></div>
             <button className="close-btn" onClick={onCancel}>
            ×
          </button>
          </div>
          <hr />
          <div className="body-modal">
            <p className="text">
              Bạn chắc chắn muốn xoá dự án: <b>{projectName}</b>?
            </p>
          </div>
          <hr />
          <div className="footerDelete">
            <button className="btn btnCancel" onClick={onCancel}>Huỷ</button>
            <button className="btn btnConfirm" onClick={onOk}>Xoá</button>
          </div>
        </div>
      </div>
    </div>
  )
}
