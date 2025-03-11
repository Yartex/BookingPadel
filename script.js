document.addEventListener("DOMContentLoaded", function () {
    const times = [
        "09:30 - 11:00", "11:00 - 12:30", "12:30 - 14:00",
        "14:00 - 15:30", "15:30 - 17:00", "17:00 - 18:30",
        "18:30 - 20:00", "20:00 - 21:30"
    ];
    const dateInput = document.getElementById("date");
    const slotsDiv = document.getElementById("slots");
    let bookings = {};

    function formatDate(date) {
        return date.toISOString().split("T")[0];
    }

    function showSlots() {
        const date = dateInput.value || formatDate(new Date());
        slotsDiv.innerHTML = "";

        times.forEach(time => {
            const slotInfo = bookings[date]?.[time] || [];

            const slotDiv = document.createElement("div");
            slotDiv.className = "slot-container";

            const title = document.createElement("p");
            title.textContent = `${time} (${slotInfo.length}/4)`;
            title.className = "slot-title";
            slotDiv.appendChild(title);

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Votre prénom";
            input.className = "slot-input";
            slotDiv.appendChild(input);

            const bookBtn = document.createElement("button");
            bookBtn.textContent = "Réserver";
            bookBtn.className = `slot-button ${slotInfo.length >= 4 ? 'disabled' : ''}`;
            bookBtn.disabled = slotInfo.length >= 4;
            bookBtn.addEventListener("click", () => bookSlot(date, time, input.value));
            slotDiv.appendChild(bookBtn);

            slotInfo.forEach(name => {
                const itemWrapper = document.createElement("div");
                itemWrapper.className = "slot-item";
                
                const nameItem = document.createElement("p");
                nameItem.textContent = name;
                nameItem.className = "slot-name";
                
                const blockItem = document.createElement("button");
                blockItem.textContent = "Annuler";
                blockItem.className = "cancel-button";
                blockItem.addEventListener("click", () => confirmCancel(date, time, name));
                
                itemWrapper.appendChild(nameItem);
                itemWrapper.appendChild(blockItem);
                slotDiv.appendChild(itemWrapper);
            });

            slotsDiv.appendChild(slotDiv);
        });
    }

    function bookSlot(date, time, name) {
        if (!name.trim()) {
            alert("Veuillez entrer votre prénom");
            return;
        }
        if (!bookings[date]) bookings[date] = {};
        if (!bookings[date][time]) bookings[date][time] = [];
        if (bookings[date][time].length < 4) {
            bookings[date][time].push(name.trim());
        }
        showSlots();
    }

    function confirmCancel(date, time, name) {
        if (confirm(`Voulez-vous vraiment annuler la réservation de ${name} ?`)) {
            cancelSlot(date, time, name);
        }
    }

    function cancelSlot(date, time, name) {
        if (bookings[date] && bookings[date][time]) {
            const index = bookings[date][time].indexOf(name);
            if (index !== -1) {
                bookings[date][time].splice(index, 1);
                if (bookings[date][time].length === 0) {
                    delete bookings[date][time];
                }
                showSlots();
            } else {
                alert("Prénom non trouvé dans ce créneau");
            }
        }
    }

    dateInput.value = formatDate(new Date());
    dateInput.addEventListener("change", showSlots);
    showSlots();
});
