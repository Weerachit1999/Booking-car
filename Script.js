// บันทึกข้อมูลจองใหม่
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const carType = document.getElementById('carType').value;

    if (!name || !date || !startTime || !endTime) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    if (startTime >= endTime) {
        alert('เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด');
        return;
    }

    const booking = { name, date, startTime, endTime, carType };

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    displayBookings();
    this.reset();
});

// แสดงรายการจองในหน้าเว็บ
function displayBookings() {
    const bookingList = document.getElementById('bookingList');
    bookingList.innerHTML = '';

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    bookings.forEach((b, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${b.name}</strong> - ${b.carType} <br>
            วันที่ ${b.date} เวลา ${b.startTime} - ${b.endTime}
            <br><button onclick="deleteBooking(${index})">ลบ</button>
        `;
        bookingList.appendChild(li);
    });
}

// ลบรายการจอง
function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.splice(index, 1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    displayBookings();
}

// Export ข้อมูลจองเป็น Excel
function exportToExcel() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    if (bookings.length === 0) {
        alert("ไม่มีข้อมูลให้ดาวน์โหลด");
        return;
    }

    const data = bookings.map((b, index) => ({
        ลำดับ: index + 1,
        ผู้จอง: b.name,
        วันที่: b.date,
        เวลาเริ่ม: b.startTime,
        เวลาสิ้นสุด: b.endTime,
        ประเภทรถ: b.carType
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายการจอง");

    XLSX.writeFile(workbook, "รายการจองรถ.xlsx");
}

// แสดงรายการเมื่อโหลดหน้า
window.onload = displayBookings;
