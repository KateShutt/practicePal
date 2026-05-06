import Modal from "react-modal";

function PracticeEntryModal({
  isOpen,
  onClose,
  addAnotherSession,
  backToDashboard,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Practice session added"
    >
      <h2>Practice session logged successfully</h2>
      <p>What would you like to do next?</p>

      <button onClick={addAnotherSession}>Add another session</button>
      <button onClick={backToDashboard}>Back to Dashboard</button>
    </Modal>
  );
}

export default PracticeEntryModal;
