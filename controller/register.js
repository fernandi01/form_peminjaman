angular.module('formApp', [])
    .controller('FormController', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
      // ... (kode FormController yang sudah ada) ...
      $scope.formData = {};
      $scope.today = new Date();
      $scope.waktuTersedia = [];
      $scope.chosen = false;
      $scope.done = false;

      $scope.toggleWaktu = function(waktu) {
        waktu.checked = !waktu.checked;
      };

      $scope.submitForm = function() {
        const waktuTerpilih = $scope.waktuTersedia
          .filter(w => w.checked)
          .map(w => w.label);

        if ($scope.bookingForm.$invalid || waktuTerpilih.length === 0) {
          let msg = 'Mohon lengkapi semua field dan pilih waktu.\n';
          if ($scope.bookingForm.nama.$invalid) msg += '- Nama belum diisi\n';
          if ($scope.bookingForm.subseksi.$invalid) msg += '- Subseksi/Wilayah/Acara belum diisi\n';
          if ($scope.bookingForm.ruangan.$invalid) msg += '- Ruangan belum dipilih\n';
          if ($scope.bookingForm.tanggal.$invalid) msg += '- Tanggal belum diisi\n';
          if (waktuTerpilih.length === 0) msg += '- Waktu belum dipilih\n';
          if ($scope.bookingForm.wa.$invalid) msg += '- Nomor WhatsApp tidak valid\n';
          if ($scope.bookingForm.Alasan.$invalid) msg += '- Alasan pemakaian belum diisi\n';
          alert(msg);
        }
        else{
          if(waktuTerpilih.length > 3 && $scope.formData.ruangan !== 'Oliver') {
            alert('Maksimal 3 jam pemakaian!');
          }
          else{
          $scope.done = true;
          const payload = Object.assign({}, $scope.formData);
          payload.waktu = waktuTerpilih;

          const formEncoded = new URLSearchParams(payload).toString();

          const endpoint = "https://script.google.com/macros/s/AKfycbwk3iGg8luuMUahGj-GdwP3bZVmntvS_Snh5Hk0M1-3UAKzfoptPjUS7K1fdteBvwQFeg/exec";

          $http({
            method: 'POST',
            url: endpoint,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: formEncoded
          }).then(function success() {

            const msg =
              `Halo PIC Ruangan,%0A` +
              `Saya ingin mengajukan peminjaman ruangan:%0A%0A` +
              `Nama: ${payload.nama}%0A` +
              `Subseksi: ${payload.subseksi}%0A` +
              `Ruangan: ${payload.ruangan}%0A` +
              `Tanggal: ${payload.tanggal}%0A` +
              `Waktu: ${payload.waktu.join(', ')}%0A` +
              `WA: ${payload.wa}%0A` +
              `Alasan: ${payload.Alasan}%0A%0A` +
              `Mohon konfirmasi dan bantuannya untuk akses smart door. Terima kasih.`;

            window.location.href = `https://wa.me/6285117552527?text=${msg}`;
          }, function error() {
            alert('Gagal mengirim data.');
          });
        }
        }
      };

      $scope.updateDisabledCheckboxes = function() {
        if (!$scope.formData.tanggal || !$scope.formData.ruangan) return;
        else {
            $scope.waktuTersedia = [];
            $scope.chosen = true;
            $scope.waiting = true;
        }

        $http.get('https://script.google.com/macros/s/AKfycbwk3iGg8luuMUahGj-GdwP3bZVmntvS_Snh5Hk0M1-3UAKzfoptPjUS7K1fdteBvwQFeg/exec')
          .then(function(res) {
            const booked = res.data;
            console.log(booked);
            const allWaktu = [
              "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
              "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
              "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"
            ];

            const selectedDate = new Date($scope.formData.tanggal).toDateString();
            const selectedRoom = $scope.formData.ruangan;

            if(selectedRoom === 'Oliver') {
              const waktuTersisa = allWaktu.map(w => ({
                label: w,
                checked: false
              }));
              $scope.waktuTersedia = waktuTersisa;
              $scope.waiting = false;
            }
            else{
              let waktuTerpakai = [];

              booked.forEach(entry => {
              const entryDate = new Date(entry.tanggal).toDateString();
              if (entryDate === selectedDate && entry.ruangan === selectedRoom) {
                  if (entry.waktu.length > 0) {
                  const timeStr = entry.waktu[0];
                  const times = timeStr.split(',').map(t => t.trim());
                  waktuTerpakai = waktuTerpakai.concat(times);
                  }
              }
              });

              const waktuTersisa = allWaktu.map(w => ({
                label: w,
                checked: false,
                disabled: waktuTerpakai.includes(w)
              }));

              $scope.waktuTersedia = waktuTersisa;
              $scope.waiting = false;
            }


        });
      };
    }])
    .controller('RegisterController', ['$scope', '$http', function($scope, $http) {
      $scope.regData = {};
      $scope.done = false; // Untuk menampilkan spinner

      $scope.submitRegistration = function() {
        // Validasi sisi klien tambahan
        if ($scope.registerForm.$invalid || $scope.regData.password !== $scope.regData.confirmPassword) {
          alert('Mohon lengkapi semua field dengan benar dan pastikan password cocok.');
          return;
        }

        $scope.done = true; // Tampilkan spinner

        const payload = {
          username: $scope.regData.username,
          password: $scope.regData.password, // Ingat: hash ini di sisi server untuk produksi!
          nama: $scope.regData.nama,
          subseksi: $scope.regData.subseksi,
          wa: $scope.regData.wa
        };

        // Ganti URL_APPS_SCRIPT_REGISTRASI dengan URL Web App Google Apps Script Anda
        const endpoint = "https://script.google.com/macros/s/AKfycbw-SBiFOQ9nN37UV98jzy1ZdiVisvj937cnQ3fAIA4wL--sd5YFZM4kOdIu86APbIw/exec"; // PASTE URL WEB APP ANDA DI SINI

        $http({
          method: 'POST',
          url: endpoint,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: new URLSearchParams(payload).toString()
        }).then(function success(response) {
          $scope.done = false; // Sembunyikan spinner
          if (response.data.status === "SUCCESS") {
            alert('Registrasi berhasil! Silakan login.');
            window.location.href = 'login.html'; // Arahkan ke halaman login
          } else {
            alert('Registrasi gagal: ' + response.data.message);
          }
        }, function error(response) {
          $scope.done = false; // Sembunyikan spinner
          alert('Terjadi kesalahan saat mengirim data registrasi. Coba lagi nanti.');
          console.error('Error during registration:', response);
        });
      };
    }]);

// ... (kode ViewDataController yang sudah ada) ...
angular.module('formApp') // Gunakan kembali modul yang sama
    .controller('ViewDataController', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

    const name = 'Georgia Sugisandhea'; // Ini perlu diubah untuk mengambil nama dari sesi login
    $scope.waiting = true;

    $http.get('https://script.google.com/macros/s/AKfycbw-SBiFOQ9nN37UV98jzy1ZdiVisvj937cnQ3fAIA4wL--sd5YFZM4kOdIu86APbIw/exec')
    .then(function(res){
            const data = res.data;
            console.log(data);

            $scope.bookings = [];

            data.forEach(entry => {
                if(entry.nama === name){
                    console.log(entry);
                    entry.tanggal = new Date(entry.tanggal);
                    entry.tanggal = entry.tanggal.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    console.log(entry.tanggal);
                    $scope.bookings.push(entry);
                }
            })

            $scope.waiting = false;
        })
    }
]);
