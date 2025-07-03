document.addEventListener('DOMContentLoaded', () => {

    const addNomineeForm = document.getElementById('add-nominee-form');
    const currentNomineesList = document.getElementById('current-nominees');

    // Handle adding a new nominee
    addNomineeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('nominee-name');
        const seriesInput = document.getElementById('nominee-series');
        const imageInput = document.getElementById('nominee-image');

        const newNominee = {
            name: nameInput.value,
            series: seriesInput.value,
            image: imageInput.value
        };

        addNomineeToList(newNominee);

        // Clear the form
        addNomineeForm.reset();
    });

    // Function to add a nominee to the visual list
    function addNomineeToList(nominee) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${nominee.image}" alt="${nominee.name}">
            <span>${nominee.name}</span>
            <button class="btn-remove"><i class="fas fa-trash-alt"></i></button>
        `;

        currentNomineesList.appendChild(listItem);

        // Add event listener to the new remove button
        listItem.querySelector('.btn-remove').addEventListener('click', () => {
            listItem.remove();
            updateNomineeCount();
        });
        
        updateNomineeCount();
    }

    // Function to update the count of nominees
    function updateNomineeCount() {
        const count = currentNomineesList.children.length;
        const widgetTitle = document.querySelector('#current-nominees').closest('.admin-widget').querySelector('h4');
        widgetTitle.textContent = `المرشحون الحاليون (${count})`;
    }

    // Add event listeners to existing remove buttons
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            e.currentTarget.closest('li').remove();
            updateNomineeCount();
        });
    });

    // Initial count update
    updateNomineeCount();
});
