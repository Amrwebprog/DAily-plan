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
  
  // زر التحويل بين اللغات
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  let isArabic = false;
  
  langToggleBtn.addEventListener('click', function() {
      if (isArabic) {
          // تغيير النصوص إلى الإنجليزية
          document.getElementById('school-name').textContent = 'El Mostakbal Modern School';
          document.getElementById('grade-label').textContent = 'Grade';
          document.getElementById('select-class').textContent = 'Select ClassRoom';
          document.getElementById('date-label').textContent = 'Select Date';
          document.getElementById('table-date').textContent = 'Date';
          document.getElementById('table-subject').textContent = 'Subject';
          document.getElementById('table-classroom').textContent = 'ClassRoom';
          document.getElementById('table-homework').textContent = 'Homework';
          document.getElementById('table-reminder').textContent = 'Reminder';
          langToggleBtn.textContent = 'Arabic';
          isArabic = false;
      } else {
          // تغيير النصوص إلى العربية
          document.getElementById('school-name').textContent = 'مدرسة المستقبل الحديثة';
          document.getElementById('grade-label').textContent = 'الصف';
          document.getElementById('select-class').textContent = 'اختر الصف';
          document.getElementById('date-label').textContent = 'اختر التاريخ';
          document.getElementById('table-date').textContent = 'التاريخ';
          document.getElementById('table-subject').textContent = 'المادة';
          document.getElementById('table-classroom').textContent = 'الصف';
          document.getElementById('table-homework').textContent = 'الواجب';
          document.getElementById('table-reminder').textContent = 'التذكير';
          langToggleBtn.textContent = 'English';
          isArabic = true;
      }
  });
  
  // انتظار اختيار الـ Grade
  document.getElementById('classRoom').addEventListener('change', function () {
    document.getElementById('day-display').style.display = 'none';
    document.getElementById('table-container').style.display = 'none';
    document.getElementById('date').value = '';
  
    const dateContainer = document.getElementById('date-container');
    dateContainer.style.display = 'block';
    dateContainer.classList.add('animate__fadeIn');
  });
  
  // إضافة حدث لتغيير التاريخ
  document.getElementById('date').addEventListener('change', async function () {
    const selectedGrade = document.getElementById('classRoom').value;
    if (!selectedGrade) {
        alert("Please select a grade first.");
        return;
    }
  
    const selectedDate = new Date(this.value);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[selectedDate.getDay()];
  
    const dayDisplay = document.getElementById('day-display');
    dayDisplay.textContent = dayName;
    dayDisplay.style.display = 'block';
    dayDisplay.classList.add('animate__fadeIn');
  
    const selectedDateString = this.value;
  
    const q = db.collection("Daily-plane")
                .where("grade", "==", selectedGrade.toLowerCase())
                .where("date", "==", selectedDateString);
  
    const querySnapshot = await q.get();
  
    const tbody = document.querySelector('#table-container tbody');
    tbody.innerHTML = '';
  
    if (querySnapshot.empty) {
        const noDataMessage = `
            <tr>
                <td colspan="5" class="text-center">No data available for the selected date and grade.</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', noDataMessage);
    } else {
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
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }
  
    const tableContainer = document.getElementById('table-container');
    tableContainer.style.display = 'block';
    tableContainer.classList.add('animate__fadeIn');
  });
  
