document.addEventListener("DOMContentLoaded", function () {
    //Inisialisation creneaux
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
    //Mise en place slot de reservation pour chaque jour via les dates du calendrier
    function showSlots() {
        const date = dateInput.value || formatDate(new Date());
        slotsDiv.innerHTML = "";
        
        times.forEach(time => {
            const slotInfo = bookings[date]?.[time] || [];
            
            const slotDiv = document.createElement("div");
            slotDiv.className = "flex flex-col items-center bg-white p-4 rounded-md shadow-md w-full";
            //affichage horraire reservation
            const title = document.createElement("p");
            title.textContent = `${time} (${slotInfo.length}/4)`;
            title.className = "font-bold";
            slotDiv.appendChild(title);
            //Slot pour le prenom
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Votre prénom";
            input.className = "border rounded-md p-2 w-full mt-2";
            slotDiv.appendChild(input);
            //Bouton reservation
            const bookBtn = document.createElement("button");
            bookBtn.textContent = "Réserver";
            bookBtn.className = `p-2 rounded-md w-full text-white mt-2 ${slotInfo.length >= 4 ? 'bg-gray-400' : 'bg-green-500'}`;
            bookBtn.disabled = slotInfo.length >= 4;
            bookBtn.addEventListener("click", () => bookSlot(date, time, input.value));
            slotDiv.appendChild(bookBtn);
            //affichage du prenom
            slotInfo.forEach(name => {
                const nameItem = document.createElement("p");
                const blockItem = document.createElement("button");
                blockItem.textContent = "Annuler";
                nameItem.textContent = name;
                nameItem.className = "name";
                blockItem.className = "button";
                blockItem.addEventListener("click", () => confirmCancel(date, time, name));
                //afficher les éléments côte à côte
                const itemWrapper = document.createElement("div");
                itemWrapper.style.display = "flex";
                itemWrapper.style.alignItems = "center";
                itemWrapper.style.marginBottom = "10px";
                nameItem.style.marginRight = "15px";          
                itemWrapper.appendChild(nameItem);
                itemWrapper.appendChild(blockItem);
                slotDiv.appendChild(itemWrapper);
            });
            
            slotsDiv.appendChild(slotDiv);
        });
    }
    // Reservation
    function bookSlot(date, time, name) {
        if (!name) {
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
    // Annulation Reservation
    function confirmCancel(date, time, name) {
        if (confirm(`Voulez-vous vraiment annuler la réservation de ${name} ?`)) {
            cancelSlot(date, time, name);
        }
    }
    //Recherche prenom slot reservation
    function cancelSlot(date, time, name) {
        if (bookings[date] && bookings[date][time]) {
            const index = bookings[date][time].findIndex(n => n.toLowerCase() === name.toLowerCase());
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
    //Nouvelle initialisation creneau a chaque date
    dateInput.value = formatDate(new Date());
    dateInput.addEventListener("change", showSlots);
    showSlots();
});
