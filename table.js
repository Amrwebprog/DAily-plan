// تهيئة Firebase App و Firestore
var firebaseConfig = {
  apiKey: "AIzaSyDSaeLi02XG-g6AnSCKge3rDTK4psbnD1I",
  authDomain: "daily-plane.firebaseapp.com",
  projectId: "daily-plane",
  storageBucket: "daily-plane.appspot.com",
  messagingSenderId: "572630787479",
  appId: "1:572630787479:web:bae6fd319ae9f22e7390d2",
  measurementId: "G-9ESFJFPZZQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// انتظار اختيار الـ Grade
document.getElementById('classRoom').addEventListener('change', function () {
  // تنظيف الحقول عند اختيار فصل جديد
  document.getElementById('day-display').style.display = 'none';
  document.getElementById('table-container').style.display = 'none';
  document.getElementById('date').value = ''; // إعادة ضبط التاريخ

  // إظهار حقل التاريخ بعد اختيار الفصل
  const dateContainer = document.getElementById('date-container');
  dateContainer.style.display = 'block';
  dateContainer.classList.add('animate__fadeIn');
});

// إضافة حدث لتغيير التاريخ
document.getElementById('date').addEventListener('change', async function () {
  const selectedGrade = document.getElementById('classRoom').value; // جلب الـ Grade المختار
  if (!selectedGrade) {
      alert("Please select a grade first.");
      return;
  }

  const selectedDate = new Date(this.value);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = daysOfWeek[selectedDate.getDay()]; // الحصول على اليوم بناءً على التاريخ

  // عرض اليوم في الـ h1
  const dayDisplay = document.getElementById('day-display');
  dayDisplay.textContent = dayName;
  dayDisplay.style.display = 'block';
  dayDisplay.classList.add('animate__fadeIn');

  // جلب البيانات من Firestore بناءً على الـ Grade والتاريخ المختار
  const selectedDateString = this.value; // التاريخ كـ string بتنسيق yyyy-mm-dd

  // إعداد استعلام لجلب البيانات من Firestore بناءً على Grade و Date
  const q = db.collection("Daily-plane")
              .where("grade", "==", selectedGrade.toLowerCase())
              .where("date", "==", selectedDateString);

  const querySnapshot = await q.get();

  // تفريغ محتوى الجدول قبل إضافة البيانات الجديدة
  const tbody = document.querySelector('#table-container tbody');
  tbody.innerHTML = '';

  if (querySnapshot.empty) {
      // عرض رسالة في حالة عدم وجود بيانات
      const noDataMessage = `
          <tr>
              <td colspan="5" class="text-center">No data available for the selected date and grade.</td>
          </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', noDataMessage);
  } else {
      // التعامل مع البيانات التي تم جلبها
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          const row = `
              <tr>
                  <td>${data.date}</td>
                  <td>${data.subject}</td>
                  <td>${data.classroom}</td>
                  <td>${data.homework}</td>
                  <td>${data.reminder}</td>
              </tr>
          `;
          tbody.insertAdjacentHTML('beforeend', row); // إضافة الصف للجدول
      });
  }

  // إظهار الجدول بعد جلب البيانات
  const tableContainer = document.getElementById('table-container');
  tableContainer.style.display = 'block';
  tableContainer.classList.add('animate__fadeIn');
});
