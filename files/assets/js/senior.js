const modal = document.getElementById('sampleModal');
const closeModalBtn = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

document.getElementById('viewButton').addEventListener('click', () => {
  modalContent.textContent = 'Sample view data: John Doe, 123 Main St, Age 30.';
  modal.classList.remove('hidden');
});

document.querySelector('.action-success').addEventListener('click', () => {
  modalContent.textContent = 'Sample edit data: John Doe - You can edit this content.';
  modal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});


